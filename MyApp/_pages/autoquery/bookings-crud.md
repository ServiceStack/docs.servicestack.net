---
title: AutoQuery CRUD Bookings Demo
---

The powerfully productive combination of [AutoQuery](/autoquery/rdbms) and [Locode](/locode/) can be used to give **Authorized Users an Instant UI** to access AutoQuery Services resulting in an immediate fully queryable (inc. export to Excel) & management UI over system tables within minutes. By virtue of being normal ServiceStack Services, AutoQuery APIs also inherit ServiceStack's ecosystem of features like [Add ServiceStack Reference](/add-servicestack-reference) enabling high-performance end-to-end typed API access in all popular Web, Mobile & Desktop platforms.

## Creating a multi-user .NET Core Booking system in minutes!

To see the rapid development of AutoQuery in action we've created a quick demo showing how to create a simple multi-user Booking System from an empty [web](https://github.com/NetCoreTemplates/web) project, [mixed in](/mix-tool) with the preferred RDBMS & Auth layered functionality, before enabling [Validation](/validation), [AutoQuery](/autoquery/rdbms), Admin Users & [CRUD Event Log](/autoquery/audit-log) plugins - to lay the foundational features before building our App by first defining its `Booking` data model & its surrounding **Query**, **Create**, **Update** and **Soft Delete** Typed CRUD APIs with rich validation enforced by declarative Validation attributes and multi-layer authorization rules & access permissions protected using Authorization attributes.

All declarative functionality is accessible in Locode which is used to create new Employee & Manager Users, before signing in with each to hit the ground running and start entering new bookings using Locode's capability-based UI, with each change visible in its **Audit History**.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="rSFiikDjGos" style="background-image: url('https://img.youtube.com/vi/rSFiikDjGos/maxresdefault.jpg')"></lite-youtube>

### Download and Run

The quickest way to run the [Bookings AutoQuery Example](https://github.com/NetCoreApps/BookingsCrud) is to install the [x tool](/dotnet-tool), download & run the repo:

```bash
x download NetCoreApps/BookingsCrud
cd BookingsCrud\Acme
dotnet run
```

### Custom project from Scratch

If you have different App requirements you can instead create a project from scratch that integrates with your existing preferred infrastructure - the [mix tool](/mix-tool) and ServiceStack's layered [Modular Startup](/modular-startup) configurations makes this a cinch, start with an empty `web` project:

:::sh
npx create-net web ProjectName
:::

Then mix in your desired features. E.g. In order for this project to be self-hosting it utilizes the embedded SQLite database, which we can configure along with configuration to enable popular Authentication providers and an RDBMS SQLite Auth Repository with:

:::sh
x mix auth auth-db sqlite
:::

But if you also wanted to enable the new [Sign in with Apple](/auth/signin-with-apple) and use SQL Server you'll instead run:

:::sh
x mix auth-ext auth-db sqlserver
:::

You can view all DB and Auth options available by searching for available layered gist configurations by tag:

```bash
x mix [db]
x mix [auth]
```

Typically the only configuration that needs updating is your DB connection string in [Configure.Db.cs](https://github.com/NetCoreApps/BookingsCrud/blob/main/Acme/Configure.Db.cs), in this case it's changed to use a persistent SQLite DB:

```csharp
services.AddSingleton<IDbConnectionFactory>(new OrmLiteConnectionFactory(
    Configuration.GetConnectionString("DefaultConnection") 
        ?? "bookings.sqlite",
    SqliteDialect.Provider));
```

You'll also want to create RDBMS tables for any that doesn't exist:

```csharp
using var db = appHost.Resolve<IDbConnectionFactory>().Open();
db.CreateTableIfNotExists<Booking>();
```

### Create Booking CRUD Services

The beauty of AutoQuery is that we only need to focus on the definition of our C# POCO Data Models which OrmLite uses to create the RDBMS tables and AutoQuery reuses to generates the Typed API implementations enabling us to build full functional high-performance systems with rich querying capabilities that we can further enhance with declarative validation & authorization permissions and rich integrations with the most popular platforms without needing to write any logic.

The `Booking` class defines the Data Model whilst the remaining AutoQuery & CRUD Services define the typed inputs, outputs and behavior of each API available that Queries and Modifies the `Booking` table.

An added utilized feature are the `[AutoApply]` attributes which applies generic behavior to AutoQuery Services.
The `Behavior.Audit*` behaviors below depend on the same property names used in the 
[AuditBase.cs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/AuditBase.cs) 
class where:

  - `Behavior.AuditQuery` - adds an [Ensure AutoFilter](/autoquery/crud#autofilter) to filter out any deleted records
  - `Behavior.AuditCreate` - populates the `Created*` and `Modified*` properties with the Authenticated user info
  - `Behavior.AuditModify` - populates the `Modified*` properties with the Authenticated user info
  - `Behavior.AuditSoftDelete` - changes the behavior of the default **Real Delete** to a **Soft Delete** by  
   populating the `Deleted*` properties

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
    [ApiAllowableValues(typeof(RoomType))]
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
    [ApiAllowableValues(typeof(RoomType))]
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

### Single Patch Partial Update API

Previously the Edit UI required the full update `IUpdateDb<T>` API, but now supports falling back to using a partial `IPatchDb<T>` API (if exists) where it will instead **only update the modified fields** that have changed. 

Ultimately this means for most cases you'll only need to provide a single `IPatchDb<T>` API to update your data model as it allows for the most flexible functionality of only updating any **non-null** values provided. This does mean that every property other than the primary key should either be a **nullable reference or Value Type** (i.e. using `Nullable`). 

Using `IPatchDb<T>` Partial Updates are also beneficial in [crud audit logs](/autoquery/audit-log) as they only capture the fields that have changed instead of full record `IUpdateDb<T>` updates.

`IPatchDb<T>` APIs can also be used to reset fields to `null` by specifying them in a `Reset` DTO string collection Property or **Request Param**, e.g. `?reset=Field1,Field2`.

## Manage in Locode

After defining your AutoQuery APIs, start your App then you can use the built-in [Locode UI](/locode/) to manage Bookings at:

<h3 class="text-4xl text-center text-indigo-800 pb-3"><span class="text-gray-300">https://example.org</span>/locode/</h3>

[![](/img/pages/locode/bookings-locode.png)](/locode/)
