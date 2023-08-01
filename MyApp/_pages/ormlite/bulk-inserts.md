---
title: Bulk Inserts
---

Bulk Insert implementations are available for each [supported RDBMS](/ormlite/installation) enabling the most efficient
ways for inserting large amounts of data from code, which is encapsulated behind OrmLite's `BulkInsert` API:

```csharp
db.BulkInsert(rows);
```

## Bulk Insert Implementations

Which uses the optimal implementation available for each RDBMS:

- **PostgreSQL** - Uses PostgreSQL's [COPY](https://www.postgresql.org/docs/current/sql-copy.html)
  command via Npgsql's [Binary Copy](https://www.npgsql.org/doc/copy.html) import
- **MySql** - Uses [MySqlBulkLoader](https://dev.mysql.com/doc/connector-net/en/connector-net-programming-bulk-loader.html)
  feature where data is written to a temporary **CSV** file that's imported directly by `MySqlBulkLoader`
- **MySqlConnector** - Uses [MySqlConnector's MySqlBulkLoader](https://mysqlconnector.net/api/mysqlconnector/mysqlbulkloadertype/)
  implementation which makes use of its `SourceStream` feature to avoid writing to a temporary file
- **SQL Server** - Uses SQL Server's `SqlBulkCopy` feature which imports data written to an in-memory `DataTable`
- **SQLite** - SQLite doesn't have a specific import feature, instead Bulk Inserts are performed using batches of [Multiple Rows Inserts](https://www.tutorialscampus.com/sql/insert-multiple-rows.htm)
  to reduce I/O calls down to a configurable batch size
- **Firebird** - Is also implemented using **Multiple Rows Inserts** within an [EXECUTE BLOCK](https://firebirdsql.org/refdocs/langrefupd20-execblock.html)
  configurable up to Firebird's maximum of **256** statements

## SQL Multiple Row Inserts

All RDBMS's also support SQL's Multiple Insert Rows feature which is an efficient and compact alternative to inserting
multiple rows within a single INSERT statement:

```sql
INSERT INTO Contact (Id, FirstName, LastName, Age) VALUES 
(1, 'John', 'Doe', 27),
(2, 'Jane', 'Doe', 42);
```

Normally OrmLite APIs uses parameterized statements however for Bulk Inserts it uses inline rasterized values in order
to construct and send large SQL INSERT statements that avoids RDBMS's max parameter limitations, which if preferred can
be configured to be used instead of its default RDBMS-specific implementation:

```csharp
db.BulkInsert(rows, new BulkInsertConfig {
    Mode = BulkInsertMode.Sql
});
```

## Batch Size

**Multiple Row Inserts** are sent in batches of **1000** (Maximum for SQL Server), Firebird uses a maximum of **256**
whilst other RDBMS's can be configured to use larger batch sizes:

```csharp
db.BulkInsert(rows, new BulkInsertConfig {
    BatchSize = 1000
});
```

## Bulk Insert Benchmarks

To test the performance of Bulk Inserts we've ran a number of benchmarks across macOS, Linux and Windows in our
[Bulk Insert Performance](https://servicestack.net/posts/bulk-insert-performance) blog post.

The Relative performances of Apple M2 macOS Benchmarks provide some indication of the performance benefits of Bulk Inserts
you can expect, confirming that they offer much better performance when needing to insert a significant number of rows,
we're it's up to **138x** more efficient than inserting just **1,000 rows**.

:::{.table .table-striped .text-base}

Relative performance for Inserting **1,000** records:

| Database       | Bulk Inserts | Multiple Rows Inserts | Single Row Inserts |
|----------------|-------------:|----------------------:|-------------------:|
| PostgreSQL     |           1x |                 1.32x |             57.04x |
| MySqlConnector |           1x |                 1.04x |            137.78x |
| MySql          |           1x |                 1.16x |            131.47x |
| SqlServer      |           1x |                 6.61x |             74.19x |

Relative performance for Inserting **10,000** records:

| Database       | Bulk Inserts | Multiple Rows Inserts |
|----------------|-------------:|----------------------:|
| PostgreSQL     |           1x |                 3.37x |
| MySqlConnector |           1x |                 1.24x |
| MySql          |           1x |                 1.52x |
| SqlServer      |           1x |                 9.36x |

Relative performance for Inserting **100,000** records:

| Database       | Bulk Inserts | Multiple Rows Inserts |
|----------------|-------------:|----------------------:|
| PostgreSQL     |           1x |                 3.68x |
| MySqlConnector |           1x |                 2.04x |
| MySql          |           1x |                 2.31x |
| SqlServer      |           1x |                10.14x |

:::

It also shows that batched Multiple Row Inserts Bulk Insert mode is another good option for inserting large number of
rows that's within **3.4x** performance range of optimal Bulk Insert implementations, for all but SQL Server which
is an order of magnitude slower than using `SqlBulkCopy`.