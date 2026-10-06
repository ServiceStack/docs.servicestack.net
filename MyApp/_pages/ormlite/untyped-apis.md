---
title: OrmLite Untyped API and T4 Templates
---

The [IUntypedApi](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/src/ServiceStack.OrmLite/IUntypedApi.cs) interface is useful for when you only have access to a late-bound object runtime type which is accessible via `db.CreateTypedApi`, e.g:

```csharp
public class BaseClass
{
    public int Id { get; set; }
}

public class Target : BaseClass
{
    public string Name { get; set; }
}

var row = (BaseClass)new Target { Id = 1, Name = "Foo" };

var useType = row.GetType();
var typedApi = db.CreateTypedApi(useType);

db.DropAndCreateTables(useType);

typedApi.Save(row);

var typedRow = db.SingleById<Target>(1);
typedRow.Name //= Foo

var updateRow = (BaseClass)new Target { Id = 1, Name = "Bar" };

typedApi.Update(updateRow);

typedRow = db.SingleById<Target>(1);
typedRow.Name //= Bar

typedApi.Delete(typedRow, new { Id = 1 });

typedRow = db.SingleById<Target>(1); //= null
```

### Reading rows

Rows can be read when all you have is the table's `Type`. They're returned as a `List` of that Type, so each row is
an instance of it:

```csharp
var typedApi = db.CreateTypedApi(typeof(Target));

IList rows = typedApi.Select();                              // a List<Target>
IList named = typedApi.Select("Name = @name", new { name = "Foo" });
var target = (Target)typedApi.SingleById(1);                 // null if it doesn't exist
long count = typedApi.Count();
```

Each has an async version, e.g. `await typedApi.SelectAsync()`. This is useful for code that works on a set of tables
it finds at runtime, e.g. exporting every table that implements an interface:

```csharp
var tables = typeof(IHasTenantId).Assembly.GetTypes()
    .Where(x => x.IsClass && !x.IsAbstract && typeof(IHasTenantId).IsAssignableFrom(x));

var export = tables.ToDictionary(x => x.Name, x => {
    IList rows = db.CreateTypedApi(x).Select();
    return JsonSerializer.SerializeToString(rows, rows.GetType()); // as a List<T>, without type info
});
```

The untyped APIs apply [connection filters and write rules](/ormlite/connection-filters) like the typed APIs do,
so on a connection that's confined to a tenant they only read, change and delete that tenant's rows.

## T4 Template Support

[OrmLite's T4 Template](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.OrmLite/src/ServiceStack.OrmLite.T4)
are useful in database-first development or when wanting to use OrmLite with an existing
RDBMS by automatically generating POCO's and strong-typed wrappers
for executing stored procedures.

```
PM> Install-Package ServiceStack.OrmLite.T4
```