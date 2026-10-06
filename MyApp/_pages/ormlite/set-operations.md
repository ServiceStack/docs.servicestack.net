---
title: Union, Intersect & Except
---

Typed queries can be combined with SQL set operations, without dropping down to raw SQL:

| API | SQL | Returns |
|-|-|-|
| `q.Union(other)` | `UNION` | Distinct rows from both queries |
| `q.UnionAll(other)` | `UNION ALL` | All rows from both queries, including duplicates |
| `q.Intersect(other)` | `INTERSECT` | Distinct rows returned by both queries |
| `q.Except(other)` | `EXCEPT` | Distinct rows of the first query that aren't returned by the other |

```csharp
// Everyone who has written or reviewed a book
var q = db.From<Book>().Select(x => x.Author)
    .Union(db.From<BookReview>().Select(x => x.Reviewer));

var people = db.Column<string>(q);
```

Each query must select the same number of columns with compatible types. The combined results use the column names
of the first query.

## Union

`Union()` returns distinct rows, whereas `UnionAll()` keeps duplicates and avoids the cost of removing them:

```csharp
var q = db.From<Book>().Select(x => x.Author)
    .UnionAll(db.From<BookReview>().Select(x => x.Reviewer));

var all = db.Column<string>(q);   // 13 rows, one per book and review
var count = db.Count(q);          // 13
```

Combine queries on the same table with different filters:

```csharp
// Fantasy books or anything under $9
var q = db.From<Book>().Where(x => x.Genre == Genre.Fantasy).Select(x => x.Title)
    .Union(db.From<Book>().Where(x => x.Price < 9m).Select(x => x.Title));
```

## Intersect and Except

```csharp
var available = db.From<Book>().Where(x => x.Available).Select(x => x.Id);
var reviewed  = db.From<BookReview>().Select(x => x.BookId);

// Available books that have been reviewed
var reviewedIds = db.Column<int>(available.Clone().Intersect(reviewed));

// Available books that haven't been reviewed yet
var awaitingIds = db.Column<int>(available.Clone().Except(reviewed));
```

::: tip
Set operations modify the query they're called on, like other `SqlExpression` APIs. Use `Clone()` to combine the
same query in multiple ways. The queries being combined are never modified.
:::

## Chaining

Set operations can be chained and are evaluated in order:

```csharp
// Highly or poorly rated books, except those reviewed by Bob
var q = highlyRated.Union(poorlyRated).Except(reviewedByBob);
```

## Selecting rows into POCOs

When each query selects all columns of the same model, select the combined rows into POCOs:

```csharp
// The oldest and newest books
var q = db.From<Book>().Where(x => x.Year < 1950)
    .Union(db.From<Book>().Where(x => x.Year > 2000))
    .OrderBy(x => x.Year);

List<Book> books = db.Select(q);
```

## Ordering and paging

`OrderBy()`, `Skip()` and `Take()` on the first query apply to the combined results. The combined query is wrapped
in a derived table so this works on every RDBMS:

```csharp
var q = db.From<Book>().Select(x => x.Author)
    .Union(db.From<BookReview>().Select(x => x.Reviewer))
    .OrderBy(x => x.Author)
    .Skip(20).Take(10);
```

```sql
SELECT * FROM (
  SELECT "Author" FROM "Book"
  UNION
  SELECT "Reviewer" FROM "BookReview"
) q
ORDER BY "Author"
LIMIT 10 OFFSET 20
```

Ordering refers to the columns of the combined results, i.e. the first query's selected columns. When paging with
`Skip()` without an ORDER BY, results are ordered by the first column.

### Queries with their own limits

The queries being combined keep their own `OrderBy()` and `Take()`, e.g. to combine the top rows of each query:

```csharp
// Fantasy books plus the 2 cheapest books
var q = db.From<Book>().Where(x => x.Genre == Genre.Fantasy).Select(x => x.Title)
    .UnionAll(db.From<Book>().OrderBy(x => x.Price).Take(2).Select(x => x.Title));
```

To limit the first query on its own, start from a query without limits, as limits on it apply to the combined
results.

## Params

Each query's params are merged into the combined query and renamed so they never clash, whether they're typed,
positional, named or [Sql.Fmt()](/ormlite/sql-fmt) params:

```csharp
var classics = db.From<Book>().Where("Year < {0}", 1950).Select(x => x.Title);

var recent = db.From<Book>().Select(x => x.Title);
recent.Params.Add(recent.CreateParam("year", 2000));
recent.Where("Year > @year");

var from1965 = db.From<Book>().Select(x => x.Title);
from1965.Params.Add(from1965.CreateParam("year", 1965));  // also named @year
from1965.Where("Year = @year");

var authors = new[] { "Carl Sagan" };
var byAuthors = db.From<Book>().Where(Sql.Fmt($"Author IN ({authors})")).Select(x => x.Title);

var q = classics.Union(recent).Union(from1965).Union(byAuthors);
```

This includes params in sub queries, which is common when combining filtered queries:

```csharp
var highlyRated = db.From<Book>()
    .Where(x => x.Price > 5m && Sql.In(x.Id, db.From<BookReview>().Where(r => r.Rating >= 5).Select(r => r.BookId)))
    .Select(x => x.Title);
var poorlyRated = db.From<Book>()
    .Where(x => x.Year > 1900 && Sql.In(x.Id, db.From<BookReview>().Where(r => r.Rating <= 2).Select(r => r.BookId)))
    .Select(x => x.Title);

var q = highlyRated.Union(poorlyRated);
```

## Sub queries and nesting

A combined query can be used as a sub query, and combined queries can be combined again:

```csharp
// Books with 5 or 2 star reviews
var reviewedIds = db.From<BookReview>().Where(r => r.Rating == 5).Select(r => r.BookId)
    .Union(db.From<BookReview>().Where(r => r.Rating == 2).Select(r => r.BookId));

var q = db.From<Book>().Where(x => Sql.In(x.Id, reviewedIds)).Select(x => x.Title)
    .UnionAll(db.From<Book>().Where(x => x.Genre == Genre.Science).Select(x => x.Title));
```

## Supported APIs

Combined queries work with the APIs that execute a `SqlExpression`, including:

- `Select()`, `Single()`, `Column()`, `ColumnDistinct()`, `Scalar()`, `Count()`, `Exists()`
- `SelectLazyAsync()`, `ColumnLazyAsync()` and the other async APIs
- `ToSelectStatement()` to inspect the generated SQL

```csharp
var titles = await db.ColumnAsync<string>(q);
var count = await db.CountAsync(q);
```

The same query can be executed multiple times, its params are only merged once.

## RDBMS support

| RDBMS | UNION | INTERSECT | EXCEPT |
|-|-|-|-|
| SQLite | Yes | Yes | Yes |
| SQL Server | Yes | Yes | Yes |
| PostgreSQL | Yes | Yes | Yes |
| MySQL 8.0.31+ / MariaDB 10.3+ | Yes | Yes | Yes |
| Oracle | Yes | Yes | Yes, as `MINUS` |
| Firebird | Yes | `NotSupportedException` | `NotSupportedException` |

Earlier MySQL and MariaDB versions only support `UNION`.
