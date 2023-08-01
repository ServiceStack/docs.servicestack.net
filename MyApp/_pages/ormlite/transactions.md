---
title: Database Transactions
---

As a Micro ORM OrmLite has direct access to ADO.NET's `IDbConnection` classes, where starting a transaction can be done with 
`OpenTransaction` to create a new transaction and attach it to its containing executed ADO.NET commands:

```csharp
using (IDbTransaction dbTrans = db.OpenTransaction())
{
    try
    {
        db.Insert(new ShipperType { Name = "Trains" });
        db.Insert(new ShipperType { Name = "Planes" });
    
        dbTrans.Commit();
    }
    catch (Exception e)
    {
        dbTrans.Rollback();
    }
}
```

## Custom Isolation Level

Which also supports custom Isolation Levels:

```csharp
using (IDbTransaction dbTrans = db.OpenTransaction(IsolationLevel.ReadCommitted))
{
    db.Insert(new ShipperType { Name = "Automobiles" });
}
```

## Transaction SavePoints

A savepoint is a special mark inside a transaction that allows all commands that are executed after it was created
to be rolled back, restoring the transaction state to what it was at the time of the savepoint.

Transaction SavePoints are available for all [supported RDBMS](https://docs.servicestack.net/ormlite/installation)
with the `SavePoint()` API which will let you Create and `Rollback()` to a SavePoint or `Release()` its resources, e.g:

```csharp
// Sync
using (var trans = db.OpenTransaction())
{
    try
    {
        db.Insert(new Person { Id = 2, Name = "John" });

        var firstSavePoint = trans.SavePoint("FirstSavePoint");

        db.UpdateOnly(() => new Person { Name = "Jane" }, where: x => x.Id == 1);

        firstSavePoint.Rollback();

        var secondSavePoint = trans.SavePoint("SecondSavePoint");

        db.UpdateOnly(() => new Person { Name = "Jack" }, where: x => x.Id == 1);

        secondSavePoint.Release();

        db.Insert(new Person { Id = 3, Name = "Diane" });

        trans.Commit();
    }
    catch (Exception e)
    {
        trans.Rollback();
    }
}
```

Equivalent async versions are also available with `SavePointAsync()` to create a Save Point, `RollbackAsync()` and `ReleaseAsync()`
to Rollback and Release Save Points, e.g:

```csharp
// Async
using (var trans = db.OpenTransaction())
{
    try
    {
        await db.InsertAsync(new Person { Id = 2, Name = "John" });

        var firstSavePoint = await trans.SavePointAsync("FirstSavePoint");

        await db.UpdateOnlyAsync(() => new Person { Name = "Jane" }, where: x => x.Id == 1);

        await firstSavePoint.RollbackAsync();

        var secondSavePoint = await trans.SavePointAsync("SecondSavePoint");

        await db.UpdateOnlyAsync(() => new Person { Name = "Jack" }, where: x => x.Id == 1);

        await secondSavePoint.ReleaseAsync();

        await db.InsertAsync(new Person { Id = 3, Name = "Diane" });

        trans.Commit();
    }
    catch (Exception e)
    {
        trans.Rollback();
    }
}
```
