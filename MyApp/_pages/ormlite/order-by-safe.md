---
title: Dynamic Sorting with OrderBySafe
---

Letting users choose the sort order, e.g. with `?orderBy=-Price`, is one of the most common ways user input ends up in
SQL. `OrderBySafe()` resolves user-supplied field names to properly quoted columns instead of embedding them in SQL,
so only real fields can ever be used:

```csharp
// GET /books?orderBy=-Price,Title
var q = db.From<Book>()
    .OrderBySafe(request.OrderBy, [nameof(Book.Title), nameof(Book.Price), nameof(Book.Year)]);

var books = db.Select(q);
```

## Syntax

`orderBy` is a comma-delimited list of field names:

| orderBy                 | SQL                               |
|-------------------------|-----------------------------------|
| `Price`                 | `ORDER BY "Price"`                |
| `-Price`                | `ORDER BY "Price" DESC`           |
| `Price DESC`            | `ORDER BY "Price" DESC`           |
| `price asc, title`      | `ORDER BY "Price", "Title"`       |
| `-Year,Title`           | `ORDER BY "Year" DESC, "Title"`   |

- Prefix a field with `-` or suffix it with `DESC` to sort descending, `ASC` is optional
- Field names are case-insensitive and resolved to the RDBMS column name, e.g. `in_stock` for `InStock` on PostgreSQL
- Whitespace around fields is ignored

## Allowed fields

Pass the list of fields users can sort by, e.g. `[nameof(Book.Title), nameof(Book.Price)]` or an array. Anything else
throws an `ArgumentException`, which ServiceStack returns to API clients as a `400 Bad Request`:

```csharp
static readonly string[] SortableFields = [nameof(Book.Title), nameof(Book.Price), nameof(Book.Year)];

db.From<Book>().OrderBySafe("-Year", SortableFields);    // OK
db.From<Book>().OrderBySafe("Author", SortableFields);   // throws ArgumentException
```

Limiting sorting to fields with an index keeps sorting large tables fast, and avoids exposing fields you don't want
clients to depend on. It also stops users sorting by a field they can't see, e.g. a `PasswordHash` or `ApiKey`, whose
values the order of the results would reveal. An empty list allows no fields.

Without a list, any field of the queried tables can be used, including joined tables, so only use it on tables
without sensitive fields:

```csharp
var q = db.From<Book>()
    .Join<BookReview>((b, r) => b.Id == r.BookId)
    .OrderBySafe("-Rating, Reviewer")
    .Select<Book, BookReview>((b, r) => new { b.Title, r.Reviewer, r.Rating });
```

## Invalid input is rejected

Input is only ever treated as field names and sort directions. Anything else throws an `ArgumentException`:

```csharp
q.OrderBySafe("Unknown");                        // not a field
q.OrderBySafe("Id--");                           // not a field
q.OrderBySafe("Id;DROP TABLE Book");             // not a field
q.OrderBySafe("(SELECT 1)");                     // not a field
q.OrderBySafe("Id SIDEWAYS");                    // invalid direction
q.OrderBySafe("Id DESC NULLS FIRST");            // unsupported syntax
```

## Default sort order

A `null` or empty `orderBy` leaves the query's existing order unchanged, so it's easy to have a default order:

```csharp
var q = db.From<Book>()
    .OrderBy(x => x.Title)                         // default order
    .OrderBySafe(request.OrderBy, SortableFields); // replaces it when specified
```

## Paging

Combine with `Skip()` and `Take()` for a typical paged API:

```csharp
// GET /books?orderBy=-Year&skip=20&take=10
var q = db.From<Book>()
    .OrderBySafe(request.OrderBy ?? "Id", SortableFields)
    .Skip(request.Skip).Take(request.Take);
```

Or page with [keyset pagination](/ormlite/keyset-pagination), which stays fast on large tables, by ending the order
with a unique field:

```csharp
// GET /books?orderBy=-Price,Id&after={lastId}
var q = db.From<Book>()
    .OrderBySafe(request.OrderBy, [nameof(Book.Price), nameof(Book.Id)])
    .Take(50);
if (lastRow != null)
    q.SeekAfter(lastRow);
```

## In a ServiceStack API

```csharp
public class QueryBooks : IGet, IReturn<List<Book>>
{
    public string? OrderBy { get; set; }
    public int? Skip { get; set; }
    public int? Take { get; set; }
}

public class BookServices(IDbConnectionFactory dbFactory) : Service
{
    static readonly string[] SortableFields = [nameof(Book.Title), nameof(Book.Price), nameof(Book.Year)];

    public List<Book> Get(QueryBooks request)
    {
        using var db = dbFactory.OpenDbConnection();
        var q = db.From<Book>()
            .OrderBy(x => x.Title)
            .OrderBySafe(request.OrderBy, SortableFields)
            .Skip(request.Skip).Take(request.Take ?? 50);
        return db.Select(q);
    }
}
```

::: tip
[AutoQuery](/autoquery/rdbms) APIs already support validated `?orderBy=` sorting out of the box.
:::

## OrderBySafe vs OrderBy(string)

`OrderBy(string)` accepts SQL fragments like `"Year DESC, Title"`, which are checked by
[SQL fragment validation](/ormlite/sql-injection#sql-fragment-validation). Validation rejects suspicious fragments,
but anything that passes is still executed as SQL. `OrderBySafe()` never embeds its input in SQL, so it's the right
choice whenever the sort order comes from users.
