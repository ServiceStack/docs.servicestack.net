---
title: Batched Writes
---

`InsertAll`, `UpdateAll`, `UpsertAll` and `SaveAll` send their rows to the database together, instead of making a
round trip for each row. There's nothing to change in your code:

```csharp
db.InsertAll(orders);
db.UpdateAll(orders);
db.UpsertAll(orders);
db.SaveAll(orders);

await db.InsertAllAsync(orders);
```

Each row still has its own statement, with the same SQL, db params, [filters and rules](/ormlite/connection-filters)
as before. They're sent with an ADO.NET `DbBatch`, in a transaction, so either all the rows are written or none are.

## Supported drivers

Rows are sent together when the ADO.NET driver supports batches:

| Driver | OrmLite package | Batched |
|-|-|-|
| Npgsql | `ServiceStack.OrmLite.PostgreSQL` | Yes |
| Microsoft.Data.SqlClient | `ServiceStack.OrmLite.SqlServer.Data` | Yes |
| MySqlConnector | `ServiceStack.OrmLite.MySqlConnector` | Yes |
| System.Data.SqlClient | `ServiceStack.OrmLite.SqlServer` | No |
| MySql.Data | `ServiceStack.OrmLite.MySql` | No |
| Microsoft.Data.Sqlite | `ServiceStack.OrmLite.Sqlite.Data` | No |
| System.Data.SQLite | `ServiceStack.OrmLite.Sqlite` | No |

With the other drivers, and on .NET Framework, a statement is sent for each row as before. SQLite runs in your App's
process, so it has no round trips to save.

## How much faster

The time to write rows to a database on the same machine, which is when a round trip costs the least:

| | Rows | A statement for each row | Sent together | Faster |
|-|-|-|-|-|
| **InsertAll**, PostgreSQL | 100 | 6.4 ms | 1.5 ms | 4.3x |
| | 1,000 | 65.0 ms | 13.1 ms | 4.9x |
| **InsertAll**, SQL Server | 100 | 12.9 ms | 1.7 ms | 7.8x |
| | 1,000 | 133.2 ms | 15.6 ms | 8.5x |
| **InsertAll**, MariaDB | 100 | 5.4 ms | 1.7 ms | 3.3x |
| | 1,000 | 57.5 ms | 15.8 ms | 3.6x |
| **UpdateAll**, PostgreSQL | 100 | 13.4 ms | 7.4 ms | 1.8x |
| | 1,000 | 86.6 ms | 23.1 ms | 3.7x |
| **UpdateAll**, SQL Server | 100 | 18.0 ms | 7.3 ms | 2.5x |
| | 1,000 | 130.5 ms | 14.8 ms | 8.8x |
| **UpdateAll**, MariaDB | 100 | 6.1 ms | 1.8 ms | 3.4x |
| | 1,000 | 65.5 ms | 16.6 ms | 3.9x |

Measured with [BenchmarkDotNet](https://benchmarkdotnet.org) on .NET 10, in a transaction. Updates include the time to
commit, which is most of the time to update a few rows in PostgreSQL and SQL Server. Run them with:

```bash
cd ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Tests.Benchmarks
dotnet run -c Release -- --filter '*DbBatch*'
```

The further your database is from your App, the more each round trip costs and the more that's saved.

## Configure

Rows are sent in batches of 1000 statements. Change it, or send a statement for each row, on the dialect:

```csharp
services.AddOrmLite(options => options.UsePostgres(connectionString, dialect => {
    dialect.BatchSize = 500;     // statements sent together, 1000 by default
    dialect.UseDbBatch = false;  // send a statement for each row
}));
```

## Rows that are sent on their own

Some rows need a result from the database before the next row can be sent:

| API | Sent on their own |
|-|-|
| `InsertAll` | Rows of tables with values that are returned by the insert, e.g. `[ReturnOnInsert]` columns |
| `UpdateAll` | Rows with a [RowVersion](/ormlite/optimistic-concurrency) on MySqlConnector, which doesn't return the rows that each statement updated |
| `UpsertAll` | New rows of tables with an `[AutoIncrement]` Primary Key, whose id is read back. All rows of tables with a `RowVersion` or `[ReturnOnInsert]` columns, and on connections with [filters or rules](/ormlite/connection-filters) |
| `SaveAll` | New rows of tables with an `[AutoIncrement]` Primary Key, whose id is read back. All rows of tables with a `RowVersion` |

Rows are always written in the order they're in, so the rows before a row that's sent on its own are sent first.

A statement is also sent for each row when they're observed as they're run, with `OrmLiteConfig.ResultsFilter`, e.g.
`CaptureSqlFilter`, or the dialect's `OnBeforeExecuteNonQuery` and `OnAfterExecuteNonQuery`.

## Things to be aware of

- **Filters are run for each row**: `OrmLiteConfig.InsertFilter`, `UpdateFilter` and `BeforeExecFilter`, a
  `commandFilter` and SQL logging all get each row's statement before it's sent
- **Errors are thrown when a batch is sent**, not as each row is added, so a row that fails is reported after the
  rows before it in its batch have been sent. `OrmLiteConfig.ExceptionFilter` gets the last statement of the batch
- **Roll back when a write fails in your own transaction**: SQL Server runs the statements after one that fails, so
  some of the rows are written. The `*All` APIs roll back their own transaction, do the same when they're called in
  yours
- **Stale row versions** fail `UpdateAll` with an `OptimisticConcurrencyException` after its batch is sent, and none
  of its rows are updated
- **For thousands of rows** [BulkInsert](/ormlite/bulk-inserts) and [BulkUpsert](/ormlite/bulk-upsert) are faster,
  which use each database's bulk loader instead of a statement for each row
