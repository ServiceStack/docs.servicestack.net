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

## T4 Template Support

[OrmLite's T4 Template](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.OrmLite/src/ServiceStack.OrmLite.T4)
are useful in database-first development or when wanting to use OrmLite with an existing
RDBMS by automatically generating POCO's and strong-typed wrappers
for executing stored procedures.

```
PM> Install-Package ServiceStack.OrmLite.T4
```