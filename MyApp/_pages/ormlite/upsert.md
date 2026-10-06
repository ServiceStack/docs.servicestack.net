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

`UpsertAll` has a statement for each row, which are [sent together](/ormlite/batched-writes) when the driver supports
it. Use [BulkUpsert](/ormlite/bulk-upsert) for thousands of rows, which loads them with each RDBMS's bulk loader and
upserts them in a single statement.

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

## Database generated values

Like `Save()`, `Upsert` keeps the Data Model in sync with the row in the database. After both inserts and updates it
populates:

- the generated `Id` of `[AutoIncrement]` Primary Keys
- `[RowVersion]` fields
- `[ReturnOnInsert]` fields, e.g. values set by database defaults

```csharp
public class WikiPage
{
    // Primary Key, populated after Upsert when [AutoIncrement]
    public int Id { get; set; }

    // Set by the application, not modified by Upsert
    public string Title { get; set; }

    // Populated after Upsert: set by the database default on insert,
    // never updated after that ([IgnoreOnUpdate])
    [Default(OrmLiteVariables.SystemUtc), IgnoreOnUpdate, ReturnOnInsert]
    public DateTime CreatedAt { get; set; }

    // Populated after Upsert: changes on every insert and update
    [RowVersion]
    public ulong RowVersion { get; set; }
}

var page = new WikiPage { Id = 1, Title = "Draft" };
db.Upsert(page);

page.CreatedAt;  // set by the database
page.RowVersion; // the current row version
```

As the row version is kept current, the upserted Data Model can be used in later optimistic concurrency updates:

```csharp
page.Title = "Published";
db.Update(page); // Throws OptimisticConcurrencyException if the row was changed since the Upsert
```

On PostgreSQL, SQLite and SQL Server these values are returned by the Upsert statement itself, using `RETURNING` or
`OUTPUT`, so no additional query is needed. Other databases read them with a query after the Upsert.

::: warning
SQL Server doesn't allow an `OUTPUT` clause on tables with enabled triggers, so `Upsert` fails on those tables if their
Data Model has `[RowVersion]` or `[ReturnOnInsert]` fields.
:::

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

Tables with [Connection Filters or Write Rules](/ormlite/connection-filters#upserts) also use this fallback, so the
row that's updated is filtered and rules can set different columns on insert and update.

::: info
MySQL and MariaDB's `ON DUPLICATE KEY UPDATE` can also be activated by a secondary `UNIQUE` constraint, not just the
Primary Key. Applications which require strict Primary-Key-only matching can disable native MySQL Upserts:

```csharp
MySqlDialect.Instance.UseNativeUpsert = false;
```

OrmLite will then use its Primary-Key existence check and insert/update fallback.
:::

## Choosing Upsert, Save, Insert or Update

<write-chooser>
</write-chooser>
