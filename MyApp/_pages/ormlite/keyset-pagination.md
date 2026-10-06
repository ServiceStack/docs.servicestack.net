---
title: Keyset Pagination with SeekAfter
---

`SeekAfter()` pages through results by continuing after the last row of the previous page, known as keyset or seek
pagination:

<generated-sql>

```csharp
var q = db.From<Order>()
    .OrderByDescending(x => x.CreatedDate).ThenBy(x => x.Id)
    .Take(50);
if (lastRow != null)
    q.SeekAfter(lastRow);  // continue after the last row of the previous page

var page = db.Select(q);
```

```sql
SELECT "Id", "Customer", "Total", "CreatedDate"
FROM "Order"
WHERE (("CreatedDate" <= @0) AND (("CreatedDate" < @0) OR ("CreatedDate" = @0 AND "Id" > @1)))
ORDER BY "CreatedDate" DESC, "Id"
LIMIT 50
-- @0 = '2026-09-30 00:00:00', @1 = 42
```

</generated-sql>

## Why not Skip and Take?

`Skip(n).Take(m)` generates `OFFSET n` paging, which has two problems as tables grow:

- **Deep pages get slower**: the database still has to read and discard every skipped row, so page 1,000 reads
  50,000 rows to return 50
- **Pages shift when data changes**: if a row is added or removed before the current position between requests,
  rows are skipped or shown twice

Keyset pagination filters by the last row seen instead, e.g. `WHERE Id > @lastId ORDER BY Id`, so each page only
reads its own rows and continues exactly where the previous page left off.

| | Skip / Take | SeekAfter |
|-|-|-|
| Deep pages | Slower the deeper you page | Same speed at any depth |
| Rows added or removed between requests | Rows can be skipped or repeated | Continues where it left off |
| Jump to page N | Yes | No, pages are sequential |
| Total page count | Yes, with `Count()` | Yes, with `Count()` |

Use keyset pagination for feeds, infinite scrolling, exports, sync APIs and paging through large tables. Use
`Skip()` and `Take()` when users need to jump to arbitrary page numbers.

## Ordering requirements

`SeekAfter()` builds its condition from the query's ORDER BY, so:

- Call `OrderBy()` before `SeekAfter()`
- End the ORDER BY with a unique column, usually the primary key, so every row has a unique position. Without it,
  rows that share the same sort values could be skipped between pages
- Sort by non-nullable columns, as `NULL` values can't be compared

```csharp
// Sorting by a non-unique column, with Id as the tie-breaker
var q = db.From<Book>().OrderByDescending(x => x.Year).ThenBy(x => x.Id);
```

## Seeking after the last row

Pass the last row of the previous page and `SeekAfter()` reads the values of the ORDER BY columns from it:

```csharp
var ids = new List<int>();
Book? last = null;
while (true)
{
    var q = db.From<Book>().OrderByDescending(x => x.Year).ThenBy(x => x.Id).Take(100);
    if (last != null)
        q.SeekAfter(last);

    var page = db.Select(q);
    if (page.Count == 0)
        break;

    ids.AddRange(page.Map(x => x.Id));
    last = page[^1];
}
```

## Seeking after values

Pass the values of each ORDER BY column directly when you don't have the row, e.g. from a cursor in an API request,
or when ordering by expressions or joined tables. Values are in the same order as the ORDER BY columns:

<generated-sql>

```csharp
// Cheapest first, then newest first
var page = db.Select(db.From<Book>()
    .OrderBy(x => x.Price).ThenByDescending(x => x.Year).ThenBy(x => x.Id)
    .SeekAfter(cursor.Price, cursor.Year, cursor.Id)
    .Take(50));
```

```sql
SELECT "Id", "Title", "Author", "Genre", "Price", "Year", "Available"
FROM "Book"
WHERE (("Price" >= @0) AND (("Price" > @0)
   OR ("Price" = @0 AND "Year" < @1)
   OR ("Price" = @0 AND "Year" = @1 AND "Id" > @2)))
ORDER BY "Price", "Year" DESC, "Id"
LIMIT 50
-- @0 = 12.99, @1 = 1990, @2 = 42
```

</generated-sql>

## How it works

`SeekAfter()` generates a condition for each ORDER BY column, using `>` for ascending and `<` for descending columns.
For `ORDER BY Price, Year DESC, Id` it generates:

```sql
WHERE (("Price" >= @0) AND (("Price" > @0)
    OR ("Price" = @0 AND "Year" < @1)
    OR ("Price" = @0 AND "Year" = @1 AND "Id" > @2)))
ORDER BY "Price", "Year" DESC, "Id"
```

This form works on every RDBMS and supports mixed sort directions, unlike row value comparisons such as
`(Price, Id) > (@0, @2)` which SQL Server doesn't support. Each value is sent as a single typed param. The
`"Price" >= @0` bound matches the same rows as the conditions after it, and lets the database seek to the first row
of the page in an index instead of scanning the rows before it, which PostgreSQL and SQL Server need it for.

For the best performance on large tables, create an index that matches the ORDER BY columns and directions:

```csharp
[CompositeIndex(nameof(Price), "Year DESC", nameof(Id))]
public class Book { ... }
```

With an index that matches, a page is as fast at any depth. On a table of 100,000 rows ordered by
`CreatedDate DESC, Id`, page 1,000 took about as long as page 1 with `SeekAfter()` on SQLite, PostgreSQL,
SQL Server and MariaDB, where `Skip()` took 8x to 100x longer than page 1.

## Combining with filters

`SeekAfter()` is added to the query's other conditions:

```csharp
SqlExpression<Book> Query() => db.From<Book>()
    .Where(x => x.Available && x.Genre == Genre.Fiction)
    .OrderByDescending(x => x.Price).ThenBy(x => x.Id);

var page = db.Select(Query().SeekAfter(lastRow).Take(10));
```

## User-supplied sort orders

It works with sort orders from [OrderBySafe()](/ormlite/order-by-safe), as long as the allowed fields end with a
unique field:

```csharp
// GET /books?orderBy=-Price,Id
var q = db.From<Book>()
    .OrderBySafe(request.OrderBy, [nameof(Book.Price), nameof(Book.Id)])
    .Take(50);
if (lastRow != null)
    q.SeekAfter(lastRow);
```

## Joins

Table prefixed ORDER BY columns in queries with joins are resolved to the model's properties:

```csharp
var q = db.From<Book>()
    .Join<BookReview>((b, r) => b.Id == r.BookId)
    .OrderByDescending(x => x.Year).ThenBy(x => x.Id)
    .SeekAfter(lastRow);
```

When ordering by a joined table's columns, pass the values with `SeekAfter(values)`.

## Cursors in APIs

APIs typically return an opaque cursor for the next page with the last row's ORDER BY values, which the client
passes back to fetch the next page:

```csharp
public class QueryBooks : IGet, IReturn<QueryBooksResponse>
{
    public string? After { get; set; }  // cursor from the previous page
}
public class QueryBooksResponse
{
    public List<Book> Results { get; set; } = [];
    public string? Next { get; set; }   // cursor for the next page, null on the last page
}

public class BookServices(IDbConnectionFactory dbFactory) : Service
{
    const int PageSize = 50;

    public QueryBooksResponse Get(QueryBooks request)
    {
        using var db = dbFactory.OpenDbConnection();
        var q = db.From<Book>().OrderByDescending(x => x.Year).ThenBy(x => x.Id).Take(PageSize);
        if (request.After != null)
        {
            var (year, id) = ParseCursor(request.After);
            q.SeekAfter(year, id);
        }

        var results = db.Select(q);
        var last = results.LastOrDefault();
        return new() {
            Results = results,
            Next = results.Count == PageSize ? $"{last!.Year}_{last.Id}" : null,
        };
    }

    static (int Year, int Id) ParseCursor(string cursor)
    {
        var parts = cursor.Split('_');
        return (int.Parse(parts[0]), int.Parse(parts[1]));
    }
}
```

## Async

Use `SelectAsync()` to page asynchronously:

```csharp
List<Book> page;
Book? last = null;
do
{
    var q = db.From<Book>().OrderBy(x => x.Id).Take(100);
    if (last != null)
        q.SeekAfter(last);
    page = await db.SelectAsync(q);
    if (page.Count > 0)
        last = page[^1];
} while (page.Count == 100);
```

To process every row of a large table in one pass, [stream the results](/ormlite/streaming) with
`SelectLazyAsync()` instead.

## Errors

| Usage | Exception |
|-|-|
| No `OrderBy()` before `SeekAfter()` | `InvalidOperationException` |
| Number of values doesn't match the ORDER BY columns | `ArgumentException` |
| A `null` value | `ArgumentNullException` |
| Ordering by column position, e.g. `OrderBy(1)`, or `NULLS FIRST/LAST` | `NotSupportedException` |
| `SeekAfter(lastRow)` with an ORDER BY that isn't a property of the model | `NotSupportedException`, use `SeekAfter(values)` |
