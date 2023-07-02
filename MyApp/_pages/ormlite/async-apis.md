---
title: OrmLite Async API
---

A quick overview of Async API's can be seen in the class diagram below:

![OrmLite Async APIs](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/ormlite/OrmLiteApiAsync.png)

Essentially most of OrmLite public API's now have async equivalents of the same name and an additional conventional `*Async` suffix.
The Async API's also take an optional `CancellationToken` making converting sync code trivial, where you just need to
add the `Async` suffix and **await** keyword, as can be seen in the
[Customer Orders UseCase upgrade to Async diff](https://github.com/ServiceStack/ServiceStack.OrmLite/commit/c1ce6f0eac99133fc232b263c26c42379d4c5f48)
, e.g:

Sync:

```csharp
db.Insert(new Employee { Id = 1, Name = "Employee 1" });
db.Save(product1, product2);
var customer = db.Single<Customer>(new { customer.Email }); 
```

Async:

```csharp
await db.InsertAsync(new Employee { Id = 1, Name = "Employee 1" });
await db.SaveAsync(product1, product2);
var customer = await db.SingleAsync<Customer>(new { customer.Email });
```

::: info
Effectively the only Data Access API's that doesn't have async equivalents are `*Lazy` APIs yielding a lazy
sequence (incompatible with async) as well as **Schema** DDL API's which are typically not used at runtime.
:::

For a quick preview of many of the new Async API's in action, checkout
[ApiSqlServerTestsAsync.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Tests/Async/ApiSqlServerTestsAsync.cs).

## Async RDBMS Providers

Currently, only a limited number of RDBMS providers offer async API's, which at this time are only:

- [SQL Server .NET 4.7.2+](https://www.nuget.org/packages/ServiceStack.OrmLite.SqlServer)
- [PostgreSQL .NET 4.7.2+](https://www.nuget.org/packages/ServiceStack.OrmLite.PostgreSQL)
- [MySQL .NET 4.7.2+](https://www.nuget.org/packages/ServiceStack.OrmLite.MySql)

We've also added a
[.NET 4.7.2 build for Sqlite](https://www.nuget.org/packages/ServiceStack.OrmLite.Sqlite)
as it's a common use-case to swapout to use Sqlite's in-memory provider for faster tests.
But as Sqlite doesn't provide async API's under-the-hood we fallback to *pseudo async* support where we just wrap its synchronous responses in `Task` results. 
