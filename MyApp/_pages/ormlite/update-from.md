---
title: Update from Joined Tables
---

`UpdateFrom()` updates rows with values from joined tables in a single statement, without reading the rows into .NET.
The query's joins and filters select the rows to update, and the set expression can use columns of any joined table:

<generated-sql>

```csharp
// Apply each UK warehouse's markup to the price of its parts
var q = db.From<Part>()
    .Join<Warehouse>((p, w) => p.WarehouseId == w.Id)
    .Where<Warehouse>(w => w.Country == "UK");

int updated = db.UpdateFrom<Part, Warehouse>((p, w) => new Part { Price = p.Price * w.Markup }, q);
```

```sql
UPDATE "Part" SET "Price" = "_u"."_v0"
FROM (
  SELECT "Part"."Id" AS "_id", ("Part"."Price"*"Warehouse"."Markup") AS "_v0"
  FROM "Part" INNER JOIN "Warehouse" ON ("Part"."WarehouseId" = "Warehouse"."Id")
  WHERE ("Warehouse"."Country" = @0)
) "_u"
WHERE "Part"."Id" = "_u"."_id"
-- @0 = 'UK'
```

</generated-sql>

Without it, updating rows from another table means selecting them into .NET and updating each one, or writing
RDBMS-specific SQL.

## Example Data Model

The examples on this page use these tables:

```csharp
public class Site
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class Warehouse
{
    public int Id { get; set; }
    public int SiteId { get; set; }
    public string Name { get; set; }
    public string Country { get; set; }
    public decimal Markup { get; set; }
    public bool Active { get; set; }
}

public class Part
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int WarehouseId { get; set; }
    public string Country { get; set; }
    public string Location { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
}
```

## Copy values from a joined table

The set expression's parameters are the query's table followed by the joined tables, in the order of the generic
arguments:

```csharp
// Each part's country is the country of its warehouse
db.UpdateFrom<Part, Warehouse>((p, w) => new Part { Country = w.Country },
    db.From<Part>().Join<Warehouse>((p, w) => p.WarehouseId == w.Id));
```

Only the columns in the set expression are updated. `UpdateFrom()` returns the number of rows updated.

## Filter the rows to update by a joined table

When the values only use the query's table, use the single table overload, with the joins in the query:

<generated-sql>

```csharp
// Clear the stock of parts in inactive warehouses
var q = db.From<Part>()
    .Join<Warehouse>((p, w) => p.WarehouseId == w.Id)
    .Where<Warehouse>(w => !w.Active);

db.UpdateFrom(p => new Part { Stock = 0 }, q);
```

```sql
UPDATE "Part" SET "Stock" = "_u"."_v0"
FROM (
  SELECT "Part"."Id" AS "_id", @0 AS "_v0"
  FROM "Part" INNER JOIN "Warehouse" ON ("Part"."WarehouseId" = "Warehouse"."Id")
  WHERE "Warehouse"."Active"=0
) "_u"
WHERE "Part"."Id" = "_u"."_id"
-- @0 = 0
```

</generated-sql>

## Multiple columns, values and params

Set multiple columns with any mix of columns, calculations, constants and captured values. Constants and captured
values are sent as params:

```csharp
var discount = 0.5m;
db.UpdateFrom<Part, Warehouse>((p, w) => new Part {
    Country = w.Country,
    Location = "Clearance",
    Price = p.Price * discount,
}, q);
```

## Multiple joined tables

Use values from up to 3 joined tables:

```csharp
// Each part in stock is located at the site of its warehouse
var q = db.From<Part>()
    .Join<Warehouse>((p, w) => p.WarehouseId == w.Id)
    .Join<Warehouse, Site>((w, s) => w.SiteId == s.Id)
    .Where(p => p.Stock > 0);

db.UpdateFrom<Part, Warehouse, Site>((p, w, s) => new Part { Location = s.Name }, q);
```

## Async

```csharp
int updated = await db.UpdateFromAsync<Part, Warehouse>((p, w) => new Part { Country = w.Country }, q);
```

The query isn't modified, so it can be reused, e.g. to select the updated rows:

```csharp
await db.UpdateFromAsync(p => new Part { Stock = p.Stock + 1 }, q);
var parts = await db.SelectAsync(q);
```

## RDBMS support

Each RDBMS uses its own syntax for updating from other tables:

| RDBMS | Generated SQL |
|-|-|
| SQL Server | `UPDATE t SET ... FROM t INNER JOIN ... WHERE ...` |
| MySQL, MariaDB | `UPDATE t INNER JOIN ... SET ... WHERE ...` |
| PostgreSQL, SQLite 3.33+ | `UPDATE t SET ... FROM (SELECT t.Id, ... FROM t INNER JOIN ... WHERE ...) u WHERE t.Id = u.Id` |
| Oracle, Firebird | `NotSupportedException` |

For example the markup example above generates:

<generated-sql db="SQL Server">

```csharp
db.UpdateFrom<Part, Warehouse>((p, w) => new Part { Price = p.Price * w.Markup }, q);
```

```sql
UPDATE "Part" SET "Price" = ("Part"."Price"*"Warehouse"."Markup")
FROM "Part" INNER JOIN "Warehouse" ON ("Part"."WarehouseId" = "Warehouse"."Id")
WHERE ("Warehouse"."Country" = @0)
```

</generated-sql>

<generated-sql db="MySQL">

```csharp
db.UpdateFrom<Part, Warehouse>((p, w) => new Part { Price = p.Price * w.Markup }, q);
```

```sql
UPDATE `Part` INNER JOIN `Warehouse` ON (`Part`.`WarehouseId` = `Warehouse`.`Id`)
SET `Part`.`Price` = (`Part`.`Price`*`Warehouse`.`Markup`)
WHERE (`Warehouse`.`Country` = @0)
```

</generated-sql>

PostgreSQL and SQLite update from a sub query of the rows to update with their new values, which keeps the query's
joins and filters exactly as they are. This requires the table to have a primary key.

::: info
If a row matches multiple rows of a joined table, it's updated with the values from one of them, so join on columns
that match at most one row, e.g. a foreign key to a primary key.
:::

`UpdateFrom()` can't be combined with `GroupBy()`, `Skip()`, `Take()`, `ForUpdate()`, `TopPerGroup()`, set operations
like `Union()` or `WithRecursive()`, and can't update the primary key. Oracle and Firebird throw a
`NotSupportedException` before anything is updated, use [UpdateOnly()](/ormlite/apis/update) instead.
