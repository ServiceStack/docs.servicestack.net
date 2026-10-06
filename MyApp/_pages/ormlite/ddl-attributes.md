---
title: Indexes, Generated Columns & Constraints
---

`CreateTable` can create filtered and covering indexes, generated columns, enum check constraints and comments from
attributes on your Data Models, which otherwise need a hand-written `[PostCreateTable]` or a migration:

| Attribute | Creates |
|-|-|
| `[Index(Where = "...")]` | A filtered (partial) index of the rows matching a condition |
| `[CompositeIndex(..., Include = [...])]` | A covering index that also keeps other columns |
| `[CompositeIndex("TenantId", "CreatedDate DESC")]` | An index with descending columns |
| `[Compute("...")]` | A column whose value the RDBMS generates |
| `[CheckEnum]` | A check constraint that only allows an Enum's values |
| `[Description("...")]` | A comment on a table or column |

::: info
Attributes are used when a table is created. Changing one on a table that already exists doesn't change the table,
use a [migration](/ormlite/db-migrations) to change existing tables. [Schema Diff](/ormlite/schema-diff) finds the
indexes and check constraints that are different to the model's and writes the migration for you, but doesn't
compare the expressions of generated columns or comments.
:::

## Referencing columns

SQL in these attributes can reference columns by their property name in braces, which are replaced with the quoted
column name of each RDBMS, including its naming convention:

```csharp
[Index(Where = "{DeletedDate} IS NULL")]   // "DeletedDate" IS NULL, or "deleted_date" IS NULL in PostgreSQL
```

## Filtered indexes

A filtered index only contains the rows matching its `Where` condition. A unique one only applies to those rows, e.g.
an email can be reused once its subscriber is deleted:

```csharp
public class Subscriber
{
    [AutoIncrement]
    public int Id { get; set; }

    [Index(Unique = true, Where = "{DeletedDate} IS NULL")]
    public string Email { get; set; }

    public DateTime? DeletedDate { get; set; }
}
```

```sql
CREATE UNIQUE INDEX uidx_subscriber_email ON "Subscriber" ("Email") WHERE "DeletedDate" IS NULL;
```

They're also smaller and faster than indexing every row when queries only use some, e.g. the orders that haven't
shipped. `[CompositeIndex]` has the same `Where`:

```csharp
[CompositeIndex(nameof(TenantId), nameof(Email), Unique = true, Where = "{DeletedDate} IS NULL")]
```

| RDBMS | Filtered indexes |
|-|-|
| PostgreSQL, SQL Server, SQLite | Supported |
| MySQL, MariaDB | `NotSupportedException` when the table is created |

## Covering indexes

`Include` keeps other columns with an index, so a query that only uses them and the indexed columns is answered from
the index without reading the table:

```csharp
[CompositeIndex(nameof(TenantId), nameof(Status), Include = [nameof(Name), nameof(Size)])]
public class Upload
{
    [AutoIncrement]
    public int Id { get; set; }
    public int TenantId { get; set; }
    public string Status { get; set; }
    public string Name { get; set; }
    public long Size { get; set; }
    public DateTime CreatedDate { get; set; }
}

// Answered from the index
var sizes = db.Column<long>(db.From<Upload>()
    .Where(x => x.TenantId == tenantId && x.Status == "Ready")
    .Select(x => x.Size));
```

| RDBMS | Index |
|-|-|
| PostgreSQL 11+, SQL Server | `("TenantId", "Status") INCLUDE ("Name", "Size")` |
| SQLite, MySQL, MariaDB | `("TenantId", "Status", "Name", "Size")`, which covers the same queries |

The columns of a **unique** index aren't changed on SQLite and MySQL, as more key columns would change which rows it
allows. `[Index]` on a property has the same `Include`.

## Descending index columns

Add `DESC` to a column of a `[CompositeIndex]` to match a newest first sort:

```csharp
[CompositeIndex(nameof(TenantId), "CreatedDate DESC")]
public class Upload { ... }
```

## Generated columns

A `[Compute]` column with an expression is calculated by the RDBMS. With `[Persisted]` it's stored with the row and
kept up to date whenever the columns it uses change, otherwise it's calculated when it's read:

```csharp
public class LineItem
{
    [AutoIncrement]
    public int Id { get; set; }
    public int Quantity { get; set; }
    public int UnitPrice { get; set; }

    [Compute("{Quantity} * {UnitPrice}"), Persisted]
    public int Total { get; set; }
}

var id = db.Insert(new LineItem { Quantity = 3, UnitPrice = 20 }, selectIdentity: true);
db.SingleById<LineItem>(id).Total; //= 60

db.UpdateOnly(() => new LineItem { Quantity = 5 }, where: x => x.Id == id);
db.SingleById<LineItem>(id).Total; //= 100

// Query and index them like any other column
var large = db.Select<LineItem>(x => x.Total > 100);
```

Generated columns are never inserted or updated, any value they're given is ignored.

| RDBMS | `[Compute("...")]` | `[Compute("..."), Persisted]` |
|-|-|-|
| SQL Server | `AS (...)` | `AS (...) PERSISTED` |
| MySQL, MariaDB, SQLite | `GENERATED ALWAYS AS (...) VIRTUAL` | `GENERATED ALWAYS AS (...) STORED` |
| PostgreSQL | `GENERATED ALWAYS AS (...) STORED` | `GENERATED ALWAYS AS (...) STORED` |

PostgreSQL only has virtual generated columns from v18, so they're always stored.

::: info
`[Compute]` without an expression is unchanged: it's for a column that already exists in the table, which OrmLite
reads but doesn't create or write to. `[Compute, Persisted]` without an expression is a regular column.
:::

## Enum check constraints

`[CheckEnum]` only allows the values of a property's Enum, so the database rejects any other value written by another
App or by raw SQL:

```csharp
public enum ShipmentStatus { Packed, Shipped, Delivered }

[EnumAsInt]
public enum ShipmentPriority { Standard = 1, Express = 2 }

public class Shipment
{
    [AutoIncrement]
    public int Id { get; set; }

    [CheckEnum]
    public ShipmentStatus Status { get; set; }

    [CheckEnum]
    public ShipmentPriority Priority { get; set; }
}
```

```sql
CONSTRAINT CHK__Shipment_Status CHECK ("Status" IN ('Packed','Shipped','Delivered')),
CONSTRAINT CHK__Shipment_Priority CHECK ("Priority" IN (1,2))
```

The values are those the Enum is stored with: its names by default, or its numbers with `[EnumAsInt]`. A nullable Enum
also allows `NULL`. It's combined with a `[CheckConstraint]` on the same property.

::: warning
Adding a value to the Enum needs a [migration](/ormlite/db-migrations) to replace the constraint of existing tables,
until then the database rejects the new value. [Schema Diff](/ormlite/schema-diff) reports the constraint as changed
and writes the migration that replaces it. `[Flags]` Enums aren't supported as their values are combined.
:::

## Comments

`[Description]` on a Data Model and its properties is added to the table and its columns, where it's shown by
database tools:

```csharp
[Description("Books that customers can order")]
public class CatalogBook
{
    [AutoIncrement]
    public int Id { get; set; }

    [Description("The book's title, as it's printed")]
    public string Title { get; set; }
}
```

| RDBMS | Comments |
|-|-|
| PostgreSQL | `COMMENT ON TABLE` and `COMMENT ON COLUMN` |
| MySQL, MariaDB | `COMMENT` on the table and its columns |
| SQL Server | `MS_Description` extended properties |
| SQLite | Ignored, as it has no comments |

## Other RDBMS

These attributes are supported by PostgreSQL, SQL Server, MySQL, MariaDB and SQLite. Use
[Pre / Post Custom SQL Hooks](/ormlite/apis/schema#pre-post-custom-sql-hooks-when-creating-and-dropping-tables) for
anything else your RDBMS supports.
