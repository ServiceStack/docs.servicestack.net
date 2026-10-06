---
title: Bulk Upsert
---

`BulkUpsert` inserts the rows with a new Primary Key and updates the rows with an existing one, for large numbers of
rows. It's the bulk equivalent of [Upsert](/ormlite/upsert), for importing and synchronizing data:

```csharp
db.BulkUpsert(products);
```

The rows are loaded into a temporary table with the fastest way each RDBMS has, then inserted and updated from it in
a single statement. Where `UpsertAll()` sends a statement for each row, `BulkUpsert` sends a handful for any number of
rows.

## Example Data Model

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }

    [IgnoreOnUpdate]
    public DateTime CreatedDate { get; set; }
}
```

Rows are matched by their Primary Key, which the Data Model must have:

```csharp
// Products 1-3 exist
db.BulkUpsert(new[] {
    new Product { Id = 2, Name = "Wireless Mouse", Price = 25, Stock = 40, CreatedDate = now }, // updated
    new Product { Id = 4, Name = "Webcam", Price = 60, Stock = 12, CreatedDate = now },         // inserted
});
```

`[IgnoreOnUpdate]` fields like `CreatedDate` are only set when a row is inserted.

## Update selected fields

Use `updateOnly` to choose the fields that are updated on existing rows. New rows are inserted with all their fields:

```csharp
// Only change the price and stock of existing products
db.BulkUpsert(products, updateOnly: x => new { x.Price, x.Stock });

// Or name the fields at runtime
db.BulkUpsert(products, updateOnly: [nameof(Product.Price)]);
```

Without any fields to update, existing rows are left as they are and only the new rows are inserted:

```csharp
db.BulkUpsert(products, updateOnly: Array.Empty<string>());
```

## Async

```csharp
await db.BulkUpsertAsync(products, token: cancellationToken);

await db.BulkUpsertAsync(products, updateOnly: x => new { x.Price, x.Stock }, token: cancellationToken);
```

## How it works

<generated-sql>

```csharp
db.BulkUpsert(products);
```

```sql
-- 1. An empty temporary table with the table's columns
CREATE TEMPORARY TABLE "ormlite_stage" AS
SELECT "id","name","price","stock","created_date" FROM "product" WHERE 1=0

-- 2. The rows are bulk loaded into it, e.g. with COPY in PostgreSQL

-- 3. One statement inserts the new rows and updates the existing ones
INSERT INTO "product" ("id","name","price","stock","created_date")
SELECT "id","name","price","stock","created_date" FROM "ormlite_stage"
ON CONFLICT ("id") DO UPDATE SET "name"=EXCLUDED."name", "price"=EXCLUDED."price", "stock"=EXCLUDED."stock"

-- 4.
DROP TABLE "ormlite_stage"
```

</generated-sql>

As the rows are upserted by one statement, either all of them are or none are. Each RDBMS uses its own bulk loader
and upsert statement:

| RDBMS | Rows are loaded with | Upsert statement |
|-|-|-|
| PostgreSQL | `COPY` binary import | `INSERT ... SELECT ... ON CONFLICT (PrimaryKey) DO UPDATE` |
| SQL Server | `SqlBulkCopy` | `MERGE ... WITH (HOLDLOCK)` matching the Primary Key |
| MySQL, MariaDB | Multiple row inserts | `INSERT ... SELECT ... ON DUPLICATE KEY UPDATE` |
| SQLite | Multiple row inserts | `INSERT ... SELECT ... ON CONFLICT (PrimaryKey) DO UPDATE` |

It takes the same [BulkInsertConfig](/ormlite/bulk-inserts) as `BulkInsert`, e.g. to load the rows with multiple row
inserts on every RDBMS, or to change how many rows each has:

```csharp
db.BulkUpsert(products, new BulkInsertConfig {
    Mode = BulkInsertMode.Sql,
    BatchSize = 500,
});
```

## Auto-increment Primary Keys

Like `Upsert`, rows whose `[AutoIncrement]` Primary Key hasn't been assigned are new, so they're inserted for the
RDBMS to assign it. Rows with a Primary Key are upserted, and keep it when they're inserted:

```csharp
public class Contact
{
    [AutoIncrement]
    public int Id { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
}

db.BulkUpsert(new[] {
    new Contact { Id = 1, Email = "alice@example.org", Name = "Alice Smith" }, // updated
    new Contact { Email = "bob@example.org", Name = "Bob" },                   // inserted with a new Id
});
```

The new rows are inserted with `BulkInsert` after the others are upserted. `[AutoId]` Guid Primary Keys that haven't
been assigned get a new Guid.

## Transactions

`BulkUpsert` is part of the connection's transaction when it has one:

```csharp
using var trans = db.OpenTransaction();
db.BulkUpsert(products);
db.BulkUpsert(prices, updateOnly: x => new { x.Price });
trans.Commit();
```

## Differences from UpsertAll

| | `UpsertAll` | `BulkUpsert` |
|-|-|-|
| Statements | One for each row | A handful for any number of rows |
| Populates `[AutoIncrement]`, `[RowVersion]` and `[ReturnOnInsert]` fields of the rows | Yes | No |
| [Connection Filters and Write Rules](/ormlite/connection-filters) | Applied | Applied, by upserting each row like `UpsertAll` |
| RDBMS without a native Upsert | Checks if each row exists | The same as `UpsertAll` |

Use `UpsertAll` for a few rows or when you need the rows to have the values the database generated, and `BulkUpsert`
to write thousands.

## Things to be aware of

- **Primary Keys are unique** within the rows of a `BulkUpsert`. PostgreSQL and SQL Server reject rows that would
  update the same row twice
- **Every row has every field**: rows are inserted with all their fields when they don't exist, so each needs the
  values a new row is valid with, even when `updateOnly` is used
- **MySQL and MariaDB** also update a row when a new row has the same value in a secondary `UNIQUE` constraint, as
  `ON DUPLICATE KEY UPDATE` isn't limited to the Primary Key
- **Tables with Connection Filters or Write Rules** are upserted a row at a time, which is slower
