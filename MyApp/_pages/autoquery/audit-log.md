---
title: AutoQuery CRUD Executable Audit Log
---

In addition to being able to declaratively develop [AutoQuery](/autoquery/) and [CRUD](/autoquery/crud) APIs without needing to implement them, 
you're also able to enable a **recorded history of Executable Audit information** over all AutoCrud operations in an executable audit log that 
in addition to maintaining an automated recorded history of every change to an entity also exhibits "EventSourcing-like capabilities" in being 
able to recreate the entities state using the latest Services implementation by replaying all AutoCrud operations in order, which can be 
applied on a granular entity, table level, or in the unlikely case that all System DB writes are performed through AutoQuery CRUD Services, 
it's capable of re-creating the entire DB state from just its Audit history, although is dependent on whether all changes made to
AutoCrud Services are backwards compatible.

Being able to rebuild your Systems DB by replaying audit history events is a nice property that can serve as an integrity check to
verify that all changes leading up to the current DB state has been recorded. As data is the most important part of most systems it
can be beneficial to maintain a change history of when items were created, modified and deleted (and by whom) as we're used to 
when using a VCS for our source code. Typically this means also employing "non destructive" approaches to system design like "Soft Deletes" 
which you can declaratively implement with Auto CRUD.

## Executable Crud Audit Events

This feature tries to obtain some of the nice features of Event Sourcing but without the additional complexity by allowing you to 
capture all CRUD operations in an executable log whilst still retaining your RDBMS as your master authority. 
This feature doesn’t require any additional dev overhead as your AutoCrud Request DTOs are the recorded events.

To enable this feature you just need to register an [ICrudEvents](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Server/CrudEvents.cs) 
provider which will let you persist your events in any data store, but typically you’d use OrmLiteCrudEvents to persist it in 
the same RDBMS that the AutoCrud requests are already writing to, e.g:

```csharp
public class ConfigureAutoQuery : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            // Enable Audit History
            services.AddSingleton<ICrudEvents>(c =>
                new OrmLiteCrudEvents(c.GetRequiredService<IDbConnectionFactory>()) {
                    // NamedConnections = { SystemDatabases.Reporting }
                });
           
            services.AddPlugin(new AutoQueryFeature {
                MaxLimit = 1000,
                //IncludeTotal = true,
            });
        })
        .ConfigureAppHost(appHost => {
            appHost.Resolve<ICrudEvents>().InitSchema();
        });
}
```

If you’re using Multitenancy features or multiple RDBMS’s in your AutoCrud DTOs you can add them to NamedConnections where 
it will create an CrudEvent table in each of the RDBMS’s used.

and that’s all that’s required, now every AutoCrud operation will persist the Request DTO and associative metadata in the 
Event entry below within a DB transaction:

```csharp
public class CrudEvent : IMeta
{
    [AutoIncrement]
    public long Id { get; set; }    
    // AutoCrudOperation, e.g. Create, Update, Patch, Delete, Save
    public string EventType { get; set; }    
    public string Model { get; set; }         // DB Model Name    
    public string ModelId { get; set; }       // Primary Key of DB Model
    public DateTime EventDate { get; set; }   // UTC
    public long? RowsUpdated { get; set; }    // How many rows were affected
    public string RequestType { get; set; }   // Request DTO Type    
    public string RequestBody { get; set; }   // Serialized Request Body    
    public string UserAuthId { get; set; }    // UserAuthId if Authenticated    
    public string UserAuthName { get; set; }  // UserName or unique User Identity
    public string RemoteIp { get; set; }      // Remote IP of the Request
    public string Urn { get; set; }           // URN format: urn:{requestType}:{ModelId}

    // Custom Reference Data with or with non-integer Primary Key
    public int? RefId { get; set; }
    public string RefIdStr { get; set; }
    public Dictionary<string, string> Meta { get; set; }
}
```

## Full Executable Audit History

With what's captured this will serve as an Audit History of state changes for any row by querying the `Model` & `ModelId` columns, e.g:

```csharp
var dbEvents = (OrmLiteCrudEvents)container.Resolve<ICrudEvents>();
var rowAuditEvents = dbEvents.GetEvents(Db, nameof(Rockstar), id);
```

The contents of the Request DTO stored as JSON in `RequestBody`. You can quickly display the contents of any JSON in human-friendly 
HTML with the [htmlDump](https://sharpscript.net/docs/html-scripts#htmldump) script if you're using `#Script`, `@Html.HtmlDump(obj)` 
if you're using Razor or just the static `ViewUtils.HtmlDump(obj)` method to get a raw pretty-formatted HTML String.

## Replay AutoCrud Requests

If all your database was created with AutoCrud Services you could delete its rows and re-create it by just re-playing all your 
AutoCrud DTOs in the order they were executed, which can be done with:

```csharp
var eventsPlayer = new CrudEventsExecutor(appHost);
foreach (var crudEvent in dbEvents.GetEvents(db))
{
    await eventsPlayer.ExecuteAsync(crudEvent);
}
```

The `CrudEventsExecutor` uses your AppHost's `ServiceController` to execute the message, e,g. same execution pipeline MQ Requests use, 
so it will execute your AppHost's `GlobalMessageRequestFilters/Async` if you have any custom logic in Request Filters 
(e.g. Multi TenantId example above). It also executes authenticated AutoCrud requests as the original AutoCrud Request Authenticated User, 
which just like [JWT Refresh Tokens](/auth/jwt-authprovider#requires-user-auth-repository-or-iusersessionsource)
will require either using an AuthRepository or if you're using a Custom Auth Provider you can implement an `IUserSessionSource` to 
load User Sessions from a custom data store.

When replaying the Audit Events it will use the original primary key, even if you're using `[AutoIncrement]` Primary Keys, 
this will let you re-create the state of a single entry, e.g:

```csharp
db.DeleteById<Rockstar>(id);
var rowAuditEvents = dbEvents.GetEvents(Db, nameof(Rockstar), id);
foreach (var crudEvent in rowAuditEvents)
{
    await eventsPlayer.ExecuteAsync(crudEvent);
}
```

If for instance you wanted it to execute through your latest logic with any enhancements or bug fixes, etc.


## Ignoring Crud Events

You can selectively choose to ignore capturing events by returning `null` in the `EventsFilter` when registering `OrmLiteCrudEvents`, e.g:

```csharp
new OrmLiteCrudEvents(c.Resolve<IDbConnectionFactory>()) {
    EventsFilter = (row,context) => MyShouldIgnore(context) 
        ? null
        : row
}
```

The `CrudContext` contains all the relevant information about the AutoQuery Crud request, including:

```csharp
public class CrudContext
{
    public IRequest Request { get; private set; }
    public IDbConnection Db { get; private set; }
    public ICrudEvents Events { get; private set; }
    public string Operation { get; set; }
    public object Dto { get; private set; }
    public Type ModelType { get; private set; }
    public Type RequestType { get; private set; }
    public Type ResponseType { get; private set; }
    public ModelDefinition ModelDef { get; private set; }
    public PropertyAccessor IdProp { get; private set; }
    public PropertyAccessor ResultProp { get; private set; }
    public PropertyAccessor CountProp { get; private set; }
    public PropertyAccessor RowVersionProp { get; private set; }
    
    public object Id { get; set; }    
    public object Response { get; set; }    
    public long? RowsUpdated { get; set; }
}
```

Alternatively you can ignore recording the event for requests tagged with `IRequest.Items[Keywords.IgnoreEvent]`, e.g:

```csharp
GlobalRequestFilters.Add((req, res, dto) => {
    if (MyShouldIgnore(dto))
        req.Items[Keywords.IgnoreEvent] = bool.TrueString;
});
```