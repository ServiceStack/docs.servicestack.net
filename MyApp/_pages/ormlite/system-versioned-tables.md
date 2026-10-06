---
title: System-Versioned Tables
---

A `[SystemVersioned]` table keeps every previous version of its rows, so it can be queried as it was at any time:

```csharp
[SystemVersioned]
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}

// The products as they were at the start of the year
var then = db.Select(db.From<Product>().AsOf(new DateTime(2026, 1, 1)));
```

The RDBMS keeps the versions itself, whenever a row is updated or deleted by any App or tool, so there's no history
table, trigger or audit code to write. Also known as temporal tables, they're useful for:

- **Auditing** what a row was and when it changed
- **Reports as of a date**, e.g. an invoice with the prices of the day it was issued
- **Recovering** a row as it was before a mistaken update or delete

## Supported databases

| RDBMS | System-versioned tables |
|-|-|
| SQL Server | 2016+ and Azure SQL |
| MariaDB | 10.3+ |
| PostgreSQL, MySQL, SQLite and others | `NotSupportedException` when the table is created or queried |

## Using a versioned table

Nothing changes for the rest of your App. Rows are inserted, updated and deleted as usual, and queries only read
current rows:

```csharp
db.Insert(new Product { Id = 1, Name = "Keyboard", Price = 50 });
db.UpdateOnly(() => new Product { Price = 55 }, where: x => x.Id == 1);
db.DeleteById<Product>(2);

var products = db.Select<Product>(); // current rows
```

## The table as it was at a time

`AsOf()` reads the rows that were current at a time, including rows that have since been changed or deleted:

<generated-sql>

```csharp
var q = db.From<Product>()
    .AsOf(lastMonth)
    .Where(x => x.Price < 30);

var cheapLastMonth = db.Select(q);
```

```sql
SELECT "Id", "Name", "Price"
FROM "Product" FOR SYSTEM_TIME AS OF @0
WHERE ("Price" < @1)
```

</generated-sql>

It's used with the rest of a typed query, including joins to other tables, which are read as they are now:

```csharp
// What's in stock now, at last month's prices
var q = db.From<Product>()
    .Join<Stock>((p, s) => p.Id == s.ProductId)
    .AsOf(lastMonth)
    .Where<Stock>(s => s.Quantity > 0);
```

## The versions of a row

Add properties for when each version was current, which the RDBMS sets:

```csharp
[SystemVersioned]
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }

    [RowStart]
    public DateTime ValidFrom { get; set; }
    [RowEnd]
    public DateTime ValidTo { get; set; }
}
```

`AllVersions()` reads every version of the rows, current and previous:

```csharp
// How the price of a product changed
var versions = db.Select(db.From<Product>()
    .AllVersions()
    .Where(x => x.Id == 1)
    .OrderBy(x => x.ValidFrom));
```

| Price | ValidFrom | ValidTo |
|-|-|-|
| 50 | 2026-01-10 09:00 | 2026-03-01 14:30 |
| 55 | 2026-03-01 14:30 | 2026-06-15 08:15 |
| 60 | 2026-06-15 08:15 | 9999-12-31 23:59 |

Each version was current from its `ValidFrom` until its `ValidTo`, which is when the next version replaced it. The
current version has the latest time the RDBMS can store.

`VersionsBetween()` reads the versions that were current at any time between two times:

```csharp
var changesThisYear = db.Select(db.From<Product>()
    .VersionsBetween(new DateTime(2026, 1, 1), DateTime.UtcNow)
    .Where(x => x.Id == 1)
    .OrderBy(x => x.ValidFrom));
```

The properties are optional. Without them the times are still kept, and `AsOf()`, `AllVersions()` and
`VersionsBetween()` work the same, but queries don't return when each version was current.

## Time zones

| RDBMS | Times are in |
|-|-|
| SQL Server | UTC. A `DateTime` with a `Local` kind is converted to UTC |
| MariaDB | The time zone of the connection |

Use the times of the database, e.g. the `ValidFrom` of a version or `SYSUTCDATETIME()`, when a query needs to be exact,
as the clock of your App can differ from the clock of your database.

## What's created

<generated-sql>

```csharp
db.CreateTable<Product>();
```

```sql
-- SQL Server
CREATE TABLE "Product"
(
  "Id" INTEGER PRIMARY KEY,
  "Name" VARCHAR(8000) NULL,
  "Price" DECIMAL(38,6) NOT NULL,
  "ValidFrom" DATETIME2 GENERATED ALWAYS AS ROW START NOT NULL,
  "ValidTo" DATETIME2 GENERATED ALWAYS AS ROW END NOT NULL,
  PERIOD FOR SYSTEM_TIME ("ValidFrom", "ValidTo")
) WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = "dbo"."ProductHistory"));

-- MariaDB
CREATE TABLE `Product`
(
  `Id` INT(11) PRIMARY KEY,
  `Name` VARCHAR(255) NULL,
  `Price` DECIMAL(38,6) NOT NULL,
  `ValidFrom` TIMESTAMP(6) GENERATED ALWAYS AS ROW START,
  `ValidTo` TIMESTAMP(6) GENERATED ALWAYS AS ROW END,
  PERIOD FOR SYSTEM_TIME (`ValidFrom`, `ValidTo`)
) WITH SYSTEM VERSIONING;
```

</generated-sql>

SQL Server keeps previous versions in a history table, which is named after the table. Use `HistoryTable` to name it:

```csharp
[SystemVersioned(HistoryTable = "ProductVersions")]
public class Product { ... }
```

`db.DropTable<Product>()` also drops its history table. MariaDB keeps previous versions in the table itself.

## Things to be aware of

- **A Primary Key is required** by SQL Server
- **One time per query**: a query reads its table as of one time, and only the table of `db.From<T>()`. Joined tables
  are read as they are now
- **Existing tables**: `[SystemVersioned]` is used when a table is created. Use a
  [migration](/ormlite/db-migrations) to make a table that already exists system-versioned
- **Storage**: every update and delete adds a row, so tables that change often grow. Both RDBMS can remove old
  versions, with a retention period in SQL Server and `DELETE HISTORY` in MariaDB
- **SQL Server's history table** is in the table's schema, or `dbo` for tables without a `[Schema]`
- `ForUpdate()`, `TopPerGroup()` and `UpdateFrom()` can't be used on a query that reads previous versions
