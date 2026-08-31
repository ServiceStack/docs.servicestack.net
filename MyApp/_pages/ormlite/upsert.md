---
title: Upsert
---

OrmLite's `Upsert` API inserts a row when its Primary Key does not exist, or updates the row with the same Primary Key
when it does. On supported databases this is performed with a single native SQL statement, avoiding the separate
existence query used by `db.Save()`.

```csharp
var customer = new Customer
{
    Id = 1,
    Name = "Initial Name",
    Email = "initial@example.org",
};

db.Upsert(customer); // Inserts Id=1

customer.Name = "Updated Name";
db.Upsert(customer); // Updates Id=1
```

`Upsert` is useful for synchronization, importing data, consuming events and retryable jobs where the desired result is:

> Create this row, or bring the existing row with this Id up to date

It removes the need to first query whether the row
exists and avoids a race between an application-side existence check and its subsequent insert or update.

## Example Data Model

The examples on this page use the following Data Model:

```csharp
public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }

    [IgnoreOnUpdate]
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
}
```

OrmLite uses the Data Model's single Primary Key as the conflict key. By convention this is the `Id` property, although
an explicitly attributed `[PrimaryKey]` property and aliased table or column names are also supported.

## Update selected fields

The preferred way to restrict which fields are changed on an existing row is the typed `updateOnly` expression:

```csharp
db.Upsert(customer,
    updateOnly: x => new { x.Name, x.Email });
```

This has different behavior for each possible outcome:

- When the row is new, all insertable fields are inserted.
- When the Primary Key already exists, only `Name` and `Email` are updated.

This makes it safe to submit a complete Data Model whilst preserving fields owned by another part of the application:

```csharp
var customer = new Customer
{
    Id = 1,
    Name = "Updated Name",
    Email = "updated@example.org",
    CreatedDate = DateTime.UtcNow, // Ignored when updating
};

db.Upsert(customer,
    updateOnly: x => new { x.Name, x.Email });
```

The Primary Key and RowVersion fields cannot be included in `updateOnly`. Fields marked with `[IgnoreOnUpdate]` are also
excluded from updates made by `Upsert`.

### Select fields at runtime

String field names provide flexibility when the fields are selected dynamically:

```csharp
var fields = includeEmail
    ? new[] { nameof(Customer.Name), nameof(Customer.Email) }
    : new[] { nameof(Customer.Name) };

db.Upsert(customer, updateOnly: fields);
```

Prefer the typed expression when the field set is known at compile time, as it is refactor-safe and validated by C#.

## Upsert multiple rows

`UpsertAll` inserts new rows and updates existing rows in a transaction:

```csharp
var customers = new[]
{
    new Customer { Id = 1, Name = "Updated", Email = "one@example.org" },
    new Customer { Id = 2, Name = "Inserted", Email = "two@example.org" },
};

db.UpsertAll(customers);
```

The same typed `updateOnly` API can restrict updates for every existing row. It does not restrict the fields inserted for
new rows:

```csharp
db.UpsertAll(customers,
    updateOnly: x => new { x.Name, x.Email });
```

String field-name overloads are also available for `UpsertAll`.

## Async APIs

Every Upsert API has an asynchronous equivalent and accepts an optional `CancellationToken`:

```csharp
await db.UpsertAsync(customer,
    updateOnly: x => new { x.Name, x.Email },
    token: cancellationToken);

await db.UpsertAllAsync(customers,
    updateOnly: x => new { x.Name, x.Email },
    token: cancellationToken);
```

## Auto-increment Primary Keys

When an `[AutoIncrement]` Primary Key has its default value, `Upsert` treats the Data Model as a new row, inserts it and
populates its generated `Id`:

```csharp
public class Customer
{
    [AutoIncrement]
    public long Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}

var customer = new Customer
{
    Name = "New Customer",
    Email = "new@example.org",
};

db.Upsert(customer);

// Populated with the generated database ID
var id = customer.Id;
```

Once the generated ID is populated, subsequent calls use it as the Upsert conflict key:

```csharp
customer.Name = "Updated Customer";
db.Upsert(customer);
```

An explicitly populated auto-increment Primary Key is preserved and can be used to insert or update that specific ID.

## Native database support

OrmLite generates the native Upsert syntax for its primary supported databases:

| Database | Generated operation |
| --- | --- |
| SQLite | `INSERT ... ON CONFLICT (PrimaryKey) DO UPDATE` |
| PostgreSQL | `INSERT ... ON CONFLICT (PrimaryKey) DO UPDATE` |
| SQL Server | `MERGE ... WITH (HOLDLOCK)` matching the Primary Key |
| MySQL / MariaDB | `INSERT ... ON DUPLICATE KEY UPDATE` |

Providers without native Upsert support fall back to `Save()`-style behavior: OrmLite checks whether the Primary Key
exists, then issues an `INSERT` or `UPDATE`. The fallback has the same `updateOnly` behavior, but requires a separate
existence query and cannot provide the same atomic single-statement behavior as a native Upsert.

::: info
MySQL and MariaDB's `ON DUPLICATE KEY UPDATE` can also be activated by a secondary `UNIQUE` constraint, not just the
Primary Key. Applications which require strict Primary-Key-only matching can disable native MySQL Upserts:

```csharp
MySqlDialect.Instance.UseNativeUpsert = false;
```

OrmLite will then use its Primary-Key existence check and insert/update fallback.
:::

## Choosing Upsert, Save, Insert or Update

Use `Upsert` when:

- The Data Model has a known Primary Key and should be inserted or updated in one operation.
- An import, synchronization process or event handler may receive both new and existing rows.
- A job may be retried and should converge on the same persisted row.
- You want the native database's efficient, atomic conflict handling.
- You only want selected fields changed when a row already exists.

Use `Insert` when the row must be new. A duplicate Primary Key should remain an error instead of silently becoming an
update.

Use `Update` or `UpdateOnly` when the row must already exist, or when the update condition is something other than its
Primary Key. `UpdateOnly` also supports updating multiple rows selected by a `WHERE` expression, whereas `Upsert` always
targets a single row by its Primary Key.

Use `Save` when its higher-level behavior is more important than minimizing database round trips, particularly when
saving `[Reference]` data with `references:true`. `Save` queries for an existing row before choosing an insert or update;
native `Upsert` normally performs the decision inside one database statement and does not save referenced Data Models.

::: warning
Upsert is not a replacement for optimistic concurrency. If an update must fail when another process has changed the row,
use OrmLite's [Optimistic Concurrency](/ormlite/optimistic-concurrency) support with a `[RowVersion]` field.
:::
