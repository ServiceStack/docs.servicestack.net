---
title: Auditing
---

A benefit to AutoQuery's structured declarative approach to its CRUD APIs is that it's better able to enable high-level 
generic functionality that can benefit all CRUD APIs. AutoQuery CRUD's 
[Executable Audit Log](/autoquery/audit-log) is an example of this which makes use of
[AutoQuery CRUD Attributes](/autoquery/crud#autoquery-crud-attributes)
to capture every CRUD operation responsible for any modifications to its underlying RDBMS tables.

We'll explore an overview of this feature by applying it to our simple Bookings table from the
[AutoQuery CRUD Bookings Demo](/autoquery/crud-bookings) included in all
[jamstacks.net](https://jamstacks.net/) project templates there by adding the ability to track all CRUD API operations 
and with it all modifications made to our `Booking` RDBMS table.

## Enabling Crud Events

First thing we need to do is register the `ICrudEvents` dependency in our App's IOC, in this case uses `OrmLiteCrudEvents`
to store all Audit Information in the `CrudEvent` table of our configured database:

```csharp
public class ConfigureAutoQuery : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            // Enable Audit History
            services.AddSingleton<ICrudEvents>(c =>
                new OrmLiteCrudEvents(c.Resolve<IDbConnectionFactory>()));
        })
        .ConfigureAppHost(appHost => {
            appHost.Plugins.Add(new AutoQueryFeature {
                MaxLimit = 1000,
                //IncludeTotal = true,
            });
            
            // Create CrudEvent if it doesn't exist
            appHost.Resolve<ICrudEvents>().InitSchema();
        });
}
```

As `ICrudEvents` stores all events in a separate table, we also need to use `InitSchema` above to create the `CrudEvent`
table if it doesn't already exist.

## Enabling Audit History Tracking on Data Models and APIs

With `ICrudEvents` registered, we can now choose which Data Models we want to enable Audit Tracking on by having them
inherit from the built-in `AuditBase` class:

```csharp
public class Booking : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
    public RoomType RoomType { get; set; }
    public int RoomNumber { get; set; }
    public DateTime BookingStartDate { get; set; }
    public DateTime? BookingEndDate { get; set; }
    public decimal Cost { get; set; }
    public string Notes { get; set; }
    public bool? Cancelled { get; set; }
}
```

This will extend our RDBMS tables with additional Audit Info to capture who and when bookings were **Created**, 
**Last Modified** and **Deleted** (when using Soft Deletes):

```csharp
public abstract class AuditBase
{
    public DateTime CreatedDate { get; set; }
    public string CreatedBy { get; set; }
    public DateTime ModifiedDate { get; set; }
    public string ModifiedBy { get; set; }
    public DateTime? DeletedDate { get; set; }
    public string DeletedBy { get; set; }
}
```

Even without needing to inspect the audit history table, capturing this info on its own provides valuable insight into 
the provenance of each booking.

### Configuring CRUD APIs

But to be able to maintain a complete executable audit log we need to capture every CRUD API and modification done on
our `Booking` table which we can do by annotating our Booking CRUD APIs with 
[AutoApply](/autoquery/crud#apply-generic-crud-behaviors) attribute which annotates our
APIs with the behavior we want to apply to them.

For the Audit feature, this behavior is implemented in the pre-registered 
[AuditAutoCrudMetadataFilter](/autoquery/crud#auditautocrudmetadatafilter) which dynamically
adds attributes to annotated APIs to achieve it's desired behavior. By primarily using the
[[AutoPopulate]](/autoquery/crud#autopopulate) attribute to populate the Audit Info and
[[AutoFilter]](/autoquery/crud#autofilter) attribute to ensure our Query APIs don't
return any **Soft Deleted** records.

Essentially `[AutoApply]` enables us to define a single attribute as a substitute for defining the multiple compound attributes 
to populate the Audit Info and Filter queries.

The appropriate `[AutoApply]` behavior needs to be added on all the CRUD APIs for the data models we want Audit History
tracking enabled on, e.g:

```csharp
[AutoApply(Behavior.AuditQuery)]
public class QueryBookings : QueryDb<Booking>
{
    //...
}

[AutoApply(Behavior.AuditCreate)]
public class CreateBooking
    : ICreateDb<Booking>, IReturn<IdResponse>
{
    //...
}

[AutoApply(Behavior.AuditModify)]
public class UpdateBooking
    : IPatchDb<Booking>, IReturn<IdResponse>
{
    //...
}

[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteBooking : IDeleteDb<Booking>, IReturnVoid
{
    //...
}
```

::: tip
Use `Behavior.AuditDelete` instead if you prefer your delete operations resulted in permanent hard deletes 
:::

## Audit Info in Locode

The `AutoQueryFeature.AccessRole` determines the accessibility of the CRUD Event APIs that Locode uses to display the
Audit History logs for each entity, which by default is restricted to **Admin** users who will be able to view the
Audit History of each record at the bottom of its **Edit** Form.

With our Bookings CRUD APIs now configured with Audit behavior we can see an example of what this looks like in Locode
after the Employee User account records a Booking from **John Smith** for a **Single** room: 

![](/img/pages/locode/audit-history-create.png)

With the left section displaying audit information about the CRUD operation and the User making it including their 
UserName, Id and IP. The right section contains the info sent in the Request DTO, in this case the `CreateBooking` API. 

If **John Smith** later contacts the manager to upgrade his booking to a **Suite**, the Audit information will be updated
with the `UpdateBooking` Audit entry which as it is a `IPatchDb<Table>` operation, only contains information that's **changed**:

![](/img/pages/locode/audit-history-update.png)

This is typically why the behavior of `IPatchDb<Table>` is preferable over `IUpdateDb<Table>` APIs when Audit Tracking 
is enabled as otherwise each Update operation would instead contain the entire entry on each update.

## Full Executable Audit History

As each Audit Entry contains the CRUD Request DTO, they can be used to recreate the state of the database by replaying
each event & executing them against a blank database:

```csharp
var eventsPlayer = new CrudEventsExecutor(appHost);
foreach (var crudEvent in dbEvents.GetEvents(db))
{
    await eventsPlayer.ExecuteAsync(crudEvent);
}
```

This can provide similar benefits to [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) without its
additional development & maintenance burden where they can be used to reconstruct the state of the database at a specific 
point in time or used to populate external data stores like search indexes or analytical reporting databases to enable
greater insight than what an RDBMS snapshot can provide.

You could replay all events to reconstruct the entire state of the database, or choose just the tables you want to 
rebuild where you can fetch all Audit Events for just the `Booking` table with:

```csharp
var bookingAuditEvents = dbEvents.GetEvents(Db, nameof(Booking));
```

Alternatively you can fetch all the audit events for a single row which is what Locode uses to display its Audit Events: 

```csharp
var rowAuditEvents = dbEvents.GetEvents(Db, nameof(Booking), id);
```

## Complete Bookings CRUD Implementation

The [Bookings CRUD Demo](/autoquery/crud-bookings) is a good representative example of the
effort it takes to implement a traditional CRUD API with AutoQuery:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="rSFiikDjGos" style="background-image: url('https://img.youtube.com/vi/rSFiikDjGos/maxresdefault.jpg')"></lite-youtube>

Which reduces the development to effort of creating Full Stack Apps down to declaring your Data Models and APIs with
simple POCOs to define the precise schema of the underlying RDBMS tables and API contract, that can then benefit from: 

 - Productive end-to-end [typed Development Model in 9 languages](https://servicestack.net/service-reference)
 - [Declarative Dev Model](/locode/declarative) for defining Authentication, Validation, Documentation & UI Customizations
 - Beautiful, UX-Friendly, capability-based Customizable UI in [Locode](https://www.locode.dev)
 - Rich analysis, API discoverability & [simplified client integrations](/api-explorer#code-tab) in [API Explorer](/api-explorer)
 - Powerful querying capabilities in [AutoQuery](/autoquery/)
 - Full executable [Audit History Tracking](/autoquery/audit-log)
 - Access to ServiceStack's rich ecosystem of [typed clients, versatile formats & endpoints](/why-servicestack#multiple-clients)
 - Seamless integrations with [Open API](/openapi), interactive [Jupyter Notebooks](/jupyter-notebooks) & [Instant Client Apps](https://apps.servicestack.net/)

And access to ServiceStack's rich ecosystem of features, most of which are centered around your typed API contracts
making them easy to enhance & apply to your existing Services.

All without needing to write a single line of implementation logic thanks to the default implementation in AutoQuery
Services & Auto UIs in Locode, API Explorer & Swagger UI. At the same time when needed the default behavior
can be overridden at multiple levels, from custom AutoQuery implementations on the server to custom UIs on the client.

For completeness, the entire source code used to implement the Bookings CRUD implementation is below: 

```csharp
public class Booking : AuditBase
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Name { get; set; }
    public RoomType RoomType { get; set; }
    public int RoomNumber { get; set; }
    public DateTime BookingStartDate { get; set; }
    public DateTime? BookingEndDate { get; set; }
    public decimal Cost { get; set; }
    public string Notes { get; set; }
    public bool? Cancelled { get; set; }
}

public enum RoomType
{
    Single,
    Double,
    Queen,
    Twin,
    Suite,
}

[AutoApply(Behavior.AuditQuery)]
public class QueryBookings : QueryDb<Booking>
{
    public int[] Ids { get; set; }
}

[ValidateHasRole("Employee")]
[AutoApply(Behavior.AuditCreate)]
public class CreateBooking
    : ICreateDb<Booking>, IReturn<IdResponse>
{
    public string Name { get; set; }
    public RoomType RoomType { get; set; }
    [ValidateGreaterThan(0)]
    public int RoomNumber { get; set; }
    public DateTime BookingStartDate { get; set; }
    public DateTime? BookingEndDate { get; set; }
    [ValidateGreaterThan(0)]
    public decimal Cost { get; set; }
    public string Notes { get; set; }
}

[ValidateHasRole("Employee")]
[AutoApply(Behavior.AuditModify)]
public class UpdateBooking
    : IPatchDb<Booking>, IReturn<IdResponse>
{
    public int Id { get; set; }
    public string Name { get; set; }
    public RoomType? RoomType { get; set; }
    [ValidateGreaterThan(0)]
    public int? RoomNumber { get; set; }
    public DateTime? BookingStartDate { get; set; }
    public DateTime? BookingEndDate { get; set; }
    [ValidateGreaterThan(0)]
    public decimal? Cost { get; set; }
    public bool? Cancelled { get; set; }
    public string Notes { get; set; }
}

[ValidateHasRole("Manager")]
[AutoApply(Behavior.AuditSoftDelete)]
public class DeleteBooking : IDeleteDb<Booking>, IReturnVoid
{
    public int Id { get; set; }
}
```