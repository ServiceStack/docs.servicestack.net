---
title: Querying Large Lists of Values
---

APIs that match a list of values, like `SelectByIds()`, `DeleteByIds()` and `Contains()` in typed queries, generate
an `IN (...)` list with a db param for each value:

```csharp
var books = db.SelectByIds<Book>(ids);
var count = db.Count<Book>(x => ids.Contains(x.Id));
db.DeleteByIds<Book>(expiredIds);
```

```sql
SELECT ... FROM "Book" WHERE "Id" IN (@0,@1,@2,...)
```

Every RDBMS limits how large these lists can be, e.g. SQL Server allows 2,100 params per query and Oracle 1,000 values
per `IN` list. OrmLite handles large lists automatically, so the same code works whether a list has 10 values or
10,000.

## How large lists are handled

Lists with up to `MaxInListParams` values (default 1,000) generate a standard `IN` list, exactly as before. Above
that:

| API | Strategy |
|-|-|
| `SelectByIds()`, `SelectByIdsAsync()` | Executed in batches, with the results combined |
| `DeleteByIds()`, `DeleteByIdsAsync()` | Executed in batches within a single transaction |
| `Contains()` on **PostgreSQL** | A single array param: `"Id" = ANY(@0)` |
| `Contains()` on **SQL Server 2016+** | A single JSON param: `"Id" IN (SELECT value FROM OPENJSON(@0))` |
| `Contains()` on other RDBMS | Multiple `IN` lists: `("Id" IN (...) OR "Id" IN (...))` |

### SelectByIds and DeleteByIds

```csharp
var ids = db.Column<int>(db.From<Order>().Where(x => x.Status == Status.Archived).Select(x => x.Id));

var orders = db.SelectByIds<Order>(ids);      // 5,000 ids executes 5 queries of 1,000
var deleted = db.DeleteByIds<Order>(ids);     // 5 deletes in 1 transaction
```

Batched deletes run in a transaction so they either all succeed or all fail. When a transaction is already open,
the batches are part of it:

```csharp
using var trans = db.OpenTransaction();
db.DeleteByIds<Order>(ids);
db.Insert(new AuditLog { Action = "Archive", Count = ids.Count });
trans.Commit();
```

### Contains in typed queries

```csharp
var ids = GetIdsToProcess(); // 10,000 ids
var q = db.From<Order>().Where(x => ids.Contains(x.Id));
var orders = db.Select(q);

var titles = books.Map(x => x.Title);
var count = db.Count<Book>(x => titles.Contains(x.Title));
var notIn = db.Count<Book>(x => !titles.Contains(x.Title));
```

**PostgreSQL** sends the list as a single native array param, supported for `short`, `int`, `long`, `float`,
`double`, `decimal` and `string` values.

**SQL Server 2016+** sends the list as a single JSON param and expands it with `OPENJSON`, supported for integer,
`decimal`, `Guid` and `string` values.

**Other RDBMS**, and value types those strategies don't support (e.g. enums or dates), split the list into multiple
`IN` lists. This avoids limits on the size of each list, like Oracle's 1,000 values, but still sends a param for each
value.

## Configuring the max list size

`MaxInListParams` is configured per dialect provider, e.g. in your AppHost:

```csharp
SqliteDialect.Provider.MaxInListParams = 500;
SqlServer2022Dialect.Provider.MaxInListParams = 2000;
```

A lower limit makes smaller batches and switches to the single-param strategies sooner. Set it to `0` to always
use a standard `IN` list.

## Raw SQL

Collection params in raw SQL are expanded into a param for each value, but aren't batched, since OrmLite doesn't
rewrite raw SQL:

```csharp
db.Select<Book>("Id IN (@ids)", new { ids });
db.Select<Book>(Sql.Fmt($"Id IN ({ids})"));
```

For large lists, use `SelectByIds()` or a typed `Contains()` query instead, or a sub query when the ids come from the
database:

```csharp
var q = db.From<Book>()
    .Where(x => Sql.In(x.Id, db.From<BookReview>().Where(r => r.Rating >= 4).Select(r => r.BookId)));
```
