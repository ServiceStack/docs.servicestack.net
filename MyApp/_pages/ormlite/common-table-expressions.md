---
title: Named Sub Queries with With
---

`With()` names a sub query as a common table expression (CTE), which the rest of the query reads like a table. Use it
to write a sub query once and join it, filter by it and select from it, as often as it's needed:

<generated-sql>

```csharp
// The columns of the sub query, in the order it selects them
public class AuthorTotal
{
    public string Author { get; set; }
    public int Books { get; set; }
    public decimal Total { get; set; }
}

// How many books each author has, and what they cost together
var totals = db.From<Book>()
    .GroupBy(x => x.Author)
    .Select(x => new { x.Author, Books = Sql.Count("*"), Total = Sql.Sum(x.Price) });

// Each book since 1970, with how many books its author has
var q = db.From<Book>()
    .With<AuthorTotal>(totals)
    .Join<AuthorTotal>((b, t) => b.Author == t.Author)
    .Where(b => b.Year >= 1970)
    .OrderBy(b => b.Title)
    .Select<Book, AuthorTotal>((b, t) => new { b.Title, b.Author, t.Books });

var results = db.Select<BookTotal>(q);
```

```sql
WITH "AuthorTotal" ("Author", "Books", "Total") AS (
  SELECT "Author", Count(*) AS Books, Sum("Price") AS Total
  FROM "Book"
  GROUP BY "Author"
)
SELECT "Book"."Title", "Book"."Author", "AuthorTotal"."Books" AS "Books"
FROM "Book" INNER JOIN "AuthorTotal" ON ("Book"."Author" = "AuthorTotal"."Author")
WHERE ("Book"."Year" >= @0)
ORDER BY "Book"."Title"
-- @0 = 1970
```

</generated-sql>

## The class of a sub query

`With<TCte>()` names the sub query after a class, so it's used with the same typed APIs as a table: `Join<TCte>()`,
`Where<TCte>()`, `db.From<TCte>()` and in `Select()`.

The class has a property for each column the sub query selects, **in the same order**. The columns are matched by
their position, so the names and aliases the sub query selects them with don't matter. The class doesn't need a table,
it's only used to name the sub query and its columns.

## Querying a sub query

Select from the sub query itself with `db.From<TCte>()`, e.g. to filter by an aggregate:

<generated-sql>

```csharp
// Authors with more than 1 book
var q = db.From<AuthorTotal>()
    .With<AuthorTotal>(totals)
    .Where(x => x.Books > 1);

List<AuthorTotal> prolific = db.Select(q);
long count = db.Count(q);
```

```sql
WITH "AuthorTotal" ("Author", "Books", "Total") AS (
  SELECT "Author", Count(*) AS Books, Sum("Price") AS Total
  FROM "Book"
  GROUP BY "Author"
)
SELECT "Author", "Books", "Total"
FROM "AuthorTotal"
WHERE ("Books" > @0)
-- @0 = 1
```

</generated-sql>

## Using a sub query more than once

A sub query that's needed in several places is written once, e.g. it's read by both the join and the `IN` sub query
here:

```csharp
// The only book of each author that has one
var q = db.From<Book>()
    .With<AuthorTotal>(totals)
    .Join<AuthorTotal>((b, t) => b.Author == t.Author)
    .Where(b => Sql.In(b.Author, db.From<AuthorTotal>().Where(t => t.Books == 1).Select(t => t.Author)))
    .OrderBy(b => b.Title);
```

## Building a query in steps

A query can have several named sub queries, where each can read the ones before it. This breaks a complex query into
steps that are each simple to read:

<generated-sql>

```csharp
public class TopAuthor
{
    public string Author { get; set; }
}

// The books in stock of authors with more than 1 book
var q = db.From<Book>()
    .With<AuthorTotal>(totals)
    .With<TopAuthor>(db.From<AuthorTotal>().Where(x => x.Books > 1).Select(x => x.Author))
    .Join<TopAuthor>((b, a) => b.Author == a.Author)
    .Where(b => b.Available);
```

```sql
WITH "AuthorTotal" ("Author", "Books", "Total") AS (
  SELECT "Author", Count(*) AS Books, Sum("Price") AS Total
  FROM "Book"
  GROUP BY "Author"
),
"TopAuthor" ("Author") AS (
  SELECT "Author"
  FROM "AuthorTotal"
  WHERE ("Books" > @0)
)
SELECT "Book"."Id", "Book"."Title", "Book"."Author", "Book"."Genre", "Book"."Price", "Book"."Year", "Book"."Available"
FROM "Book" INNER JOIN "TopAuthor" ON ("Book"."Author" = "TopAuthor"."Author")
WHERE "Book"."Available"=1
-- @0 = 1
```

</generated-sql>

## Parameters

The params of each sub query are added to the query, so values in any of them are sent as db params:

```csharp
var recent = db.From<Book>()
    .Where(x => x.Year >= since)
    .GroupBy(x => x.Author)
    .Select(x => new { x.Author, Books = Sql.Count("*"), Total = Sql.Sum(x.Price) });

var q = db.From<Book>()
    .Where(b => b.Price <= maxPrice)
    .With<AuthorTotal>(recent)
    .Join<AuthorTotal>((b, t) => b.Author == t.Author);
```

[Connection filters](/ormlite/connection-filters) apply to each sub query like any other typed query.

## Naming a sub query for custom SQL

`With(name, subQuery)` names a sub query without a class, to read it by its name in custom SQL:

```csharp
var q = db.From<Book>()
    .With("fantasy", db.From<Book>().Where(x => x.Genre == Genre.Fantasy))
    .From("fantasy")
    .OrderBy(x => x.Year);
```

## Combining with recursive queries

Named sub queries can be used with [WithRecursive()](/ormlite/recursive-queries), which can read them:

```csharp
// The active subjects under Books
var q = db.From<Subject>()
    .With<ActiveSubject>(db.From<Subject>().Where(x => x.Active).Select(x => x.Id))
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Name == "Books"),
        recurse: (parent, child) => child.ParentId == parent.Id)
    .Where(x => Sql.In(x.Id, db.From<ActiveSubject>().Select(a => a.Id)));
```

## Things to be aware of

- **Column order**: the properties of the class must be in the order the sub query selects its columns
- **Sub queries of sub queries**: a sub query can't have its own named sub queries, add them to the query that reads
  them before it instead
- **Names are unique** within a query
- **Sorting**: SQL Server doesn't allow a sub query with an `OrderBy()` unless it also has a `Take()`
- `ForUpdate()`, `TopPerGroup()` and `UpdateFrom()` can't be used on a query with named sub queries, and it can only be
  the first query of a [set operation](/ormlite/set-operations)

They're supported by SQLite, SQL Server, PostgreSQL, MySQL 8+ and MariaDB 10.2+.
