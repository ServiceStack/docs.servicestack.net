---
title: Returning Updated & Deleted Rows
---

`UpdateOnlyReturning()` and `DeleteReturning()` return the rows affected by an UPDATE or DELETE in the same statement:

```csharp
// The updated rows, as they are after the update
List<Order> shipped = db.UpdateOnlyReturning(() => new Order { Status = "Shipped" },
    where: x => x.Status == "Packed");

// The deleted rows
List<Session> expired = db.DeleteReturning<Session>(x => x.ExpiresAt < DateTime.UtcNow);
```

Without them, getting the affected rows needs a separate query before or after the write, which costs another round
trip and can see different rows if the data changes between the two statements.

## Updating rows

Update the fields in the expression and get back every column of each updated row:

```csharp
var updated = db.UpdateOnlyReturning(() => new Book { Price = 20m }, where: x => x.Author == "J.R.R. Tolkien");

foreach (var book in updated)
{
    Console.WriteLine($"{book.Title} now costs {book.Price}");  // all columns are populated
}
```

Use a `SqlExpression` for more complex conditions:

```csharp
var q = db.From<Book>().Where(x => x.Genre == Genre.History && x.Available);
var updated = db.UpdateOnlyReturning(() => new Book { Available = false }, q);
```

An empty list is returned when no rows match.

## Deleting rows

```csharp
var deleted = db.DeleteReturning<Book>(x => !x.Available);
```

Queries with joins are supported:

```csharp
// Books reviewed by Bob
var q = db.From<Book>()
    .Join<BookReview>((b, r) => b.Id == r.BookId)
    .Where<BookReview>(r => r.Reviewer == "Bob");

var deleted = db.DeleteReturning(q);
```

## Returning only selected columns

Rows are returned with all their columns by default. Use `returning` to only read back the columns you need, e.g. for
tables with many or large columns. Other properties of the returned rows aren't populated:

<generated-sql>

```csharp
var updated = db.UpdateOnlyReturning(() => new Book { Price = 20m },
    where: x => x.Author == "J.R.R. Tolkien",
    returning: x => new { x.Id, x.Title });
```

```sql
UPDATE "Book" SET "Price"=@Price WHERE ("Author" = @0) RETURNING "Id", "Title"
-- @0 = 'J.R.R. Tolkien', @Price = 20
```

</generated-sql>

Select a single column to just get the ids of the affected rows:

<generated-sql>

```csharp
var deleted = db.DeleteReturning<Book>(x => !x.Available, returning: x => x.Id);
var ids = deleted.Map(x => x.Id);
```

```sql
DELETE FROM "Book" WHERE "Available"=0 RETURNING "Id"
```

</generated-sql>

It's available on every overload, including queries and the async APIs:

```csharp
var q = db.From<Book>().Where(x => x.Genre == Genre.Science);
var updated = await db.UpdateOnlyReturningAsync(() => new Book { Price = 5m }, q,
    returning: x => new { x.Title, x.Price });
```

## Taking items from a queue

Deleting and returning rows in one statement means the database guarantees each row is only returned to one caller,
which makes it a simple way to take work from a queue table without locking:

```csharp
// Only this worker receives these rows
List<EmailJob> jobs = db.DeleteReturning<EmailJob>(x => x.Queue == "emails" && x.RunAt <= DateTime.UtcNow);

foreach (var job in jobs)
{
    await SendEmailAsync(job);
}
```

For long-running work that must survive crashes, mark rows as claimed with `UpdateOnlyReturning()` instead and
delete them when they've been processed:

```csharp
var claimed = db.UpdateOnlyReturning(() => new EmailJob { ClaimedBy = workerId, ClaimedAt = DateTime.UtcNow },
    where: x => x.ClaimedBy == null && x.Queue == "emails");
```

## Async

```csharp
var updated = await db.UpdateOnlyReturningAsync(() => new Book { Price = 9m }, where: x => x.Genre == Genre.Science);
var deleted = await db.DeleteReturningAsync(db.From<Book>().Where(x => x.Price == 9m));
```

## Which APIs modify objects

OrmLite follows a consistent convention for when database generated values are written back to the objects you pass in:

| API | Modifies the object |
|-|-|
| `Save` / `SaveAll` | Yes: the auto-incremented `Id` and `[RowVersion]` |
| `Upsert` / `UpsertAll` | Yes: the auto-incremented `Id`, `[RowVersion]` and `[ReturnOnInsert]` fields |
| `Insert` / `InsertAll` | Only opt-in `[AutoId]` and `[ReturnOnInsert]` fields |
| `Update` / `UpdateOnly` / `Delete` | No |
| `UpdateOnlyReturning` / `DeleteReturning` | No, they return new rows |

`Save()` and `Upsert()` persist a given object and keep it in sync with its row, so it can be used directly in later
optimistic concurrency updates. `Upsert()` returns these values with `RETURNING` or `OUTPUT` in the same statement,
see [Database generated values](/ormlite/upsert#database-generated-values).

### Returning values from Insert

The values of a connection's [write rules](/ormlite/connection-filters#written-objects-have-the-values-that-were-saved)
are known before a row is written, so they're always set on the object. For values populated by the database,
`Insert()` doesn't modify the object unless its Data Model opts in with attributes:

```csharp
public class Order
{
    // Populated after Insert: a new Guid is generated for each row
    [AutoId]
    public Guid Id { get; set; }

    // Not modified by Insert
    public string Status { get; set; }

    // Populated after Insert: the value set by the database default
    [Default(OrmLiteVariables.SystemUtc), ReturnOnInsert]
    public DateTime CreatedAt { get; set; }
}

var order = new Order { Status = "New" };
db.Insert(order);

order.Id;        // the generated Guid
order.CreatedAt; // set by the database
```

`[ReturnOnInsert]` fields are returned in the same `INSERT` statement using `RETURNING` on PostgreSQL, SQLite and
Firebird and `OUTPUT INSERTED` on SQL Server. When a Data Model has `[ReturnOnInsert]` fields, its auto-incremented
Primary Key is also populated.

For other auto-incremented Primary Keys, use `selectIdentity` to return the new Id without modifying the object:

```csharp
var id = db.Insert(new Customer { Name = "Alice" }, selectIdentity: true);
```

Or use `Save()`, which populates the new Id on the object:

```csharp
var customer = new Customer { Name = "Alice" };
db.Save(customer);
customer.Id; // the new Id
```

## RDBMS support

| RDBMS | SQL |
|-|-|
| PostgreSQL | `UPDATE ... RETURNING` / `DELETE ... RETURNING` |
| SQLite 3.35+ | `UPDATE ... RETURNING` / `DELETE ... RETURNING` |
| SQL Server | `UPDATE ... OUTPUT INSERTED.*` / `DELETE ... OUTPUT DELETED.*` |
| MySQL, MariaDB, Oracle, Firebird | `NotSupportedException` |

Unsupported RDBMS throw a `NotSupportedException` before anything is updated or deleted.

::: warning
SQL Server doesn't allow an `OUTPUT` clause on tables with enabled triggers, as the rows can't be returned without
also writing them to a table (`OUTPUT ... INTO`). Use `UpdateOnly()` or `Delete()` on those tables instead.
:::
