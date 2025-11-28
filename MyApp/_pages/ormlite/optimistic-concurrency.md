---
title: Optimistic Concurrency
---

Optimistic concurrency can be added to any table by adding the `ulong RowVersion { get; set; }` property, e.g:

```csharp
public class Poco
{
    ...
    public ulong RowVersion { get; set; }
}
```

RowVersion is implemented efficiently in all major RDBMS's, i.e:

- Uses `rowversion` datatype in SqlServer
- Uses PostgreSql's `xmin` system column (no column on table required)
- Uses UPDATE triggers on MySql, Sqlite and Oracle whose lifetime is attached to Create/Drop tables APIs

Despite their differing implementations each provider works the same way where the `RowVersion` property is populated when the record is selected and only updates the record if the RowVersion matches with what's in the database, e.g:

```csharp
var rowId = db.Insert(new Poco { Text = "Text" }, selectIdentity:true);

var row = db.SingleById<Poco>(rowId);
row.Text += " Updated";
db.Update(row); //success!

row.Text += "Attempting to update stale record";

//Can't update stale record
Assert.Throws<OptimisticConcurrencyException>(() =>
    db.Update(row));

//Can update latest version
var updatedRow = db.SingleById<Poco>(rowId);  // fresh version
updatedRow.Text += "Update Success!";
db.Update(updatedRow);

updatedRow = db.SingleById<Poco>(rowId);
db.Delete(updatedRow);                        // can delete fresh version
```

Optimistic concurrency is only verified on API's that update or delete an entire entity, i.e. it's not enforced in partial updates. There's also an Alternative API available for DELETE's:

```csharp
db.DeleteById<Poco>(id:updatedRow.Id, rowversion:updatedRow.RowVersion)
```

## RowVersion Byte Array

To improve reuse of OrmLite's Data Models in Dapper, OrmLite also supports `byte[] RowVersion` which lets you use OrmLite Data Models with `byte[] RowVersion` properties in Dapper queries.

## Conflict Resolution using commandFilter

An optional `Func<IDbCommand> commandFilter` is available in all `INSERT` and `UPDATE` APIs to allow customization and inspection of the populated `IDbCommand` before it's run.
This feature is utilized in the [Conflict Resolution Extension methods](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/src/ServiceStack.OrmLite/OrmLiteConflictResolutions.cs)
where you can specify the conflict resolution strategy when a Primary Key or Unique constraint violation occurs:

```csharp
db.InsertAll(rows, dbCmd => dbCmd.OnConflictIgnore());

//Equivalent to: 
db.InsertAll(rows, dbCmd => dbCmd.OnConflict(ConflictResolution.Ignore));
```

In this case it will ignore any conflicts that occur and continue inserting the remaining rows in SQLite, MySql and PostgreSQL, whilst in SQL Server it's a NOOP.

SQLite offers [additional fine-grained behavior](https://sqlite.org/lang_conflict.html) that can be specified for when a conflict occurs:

- ROLLBACK
- ABORT
- FAIL
- IGNORE
- REPLACE
