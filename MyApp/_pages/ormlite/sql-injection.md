---
title: SQL Injection Protection
---

OrmLite's typed APIs send every value as a db parameter, so the safest way to query is to stay typed wherever
possible. This page covers how OrmLite protects the places where SQL is written by hand, and the safe alternatives
to reach for first.

## Prefer typed queries

Values in typed expressions are always parameterized, including values from user input:

```csharp
var books = db.Select<Book>(x => x.Author == request.Author && x.Price < request.MaxPrice);

var q = db.From<Book>()
    .Where(x => x.Genre == request.Genre)
    .OrderByDescending(x => x.Year);
var page = db.Select(q.Take(50));
```

The same applies to anonymous type and dictionary params in raw SQL APIs, which are sent as db params:

```csharp
var books = db.Select<Book>("Author = @author AND Price < @maxPrice", 
    new { author = request.Author, maxPrice = request.MaxPrice });
```

## Choose the safe API for each job

| You need to...                                  | Use                                                     |
|-------------------------------------------------|---------------------------------------------------------|
| Filter by user input                            | Typed `Where()`, or params with raw SQL                 |
| Write raw SQL with interpolated values          | [Sql.Fmt()](/ormlite/sql-fmt)                           |
| Let users choose the sort order                 | [OrderBySafe()](/ormlite/order-by-safe)                 |
| Reference a table name in raw SQL               | `db.TableRef<T>()` or `typeof(T)` in `Sql.Fmt()` |
| Reference a column name in raw SQL              | `db.ColumnRef<T>()`, `db.ColumnRefs<T>()` in `Sql.Fmt()` |
| Embed trusted SQL that fails validation         | `Unsafe*` APIs, e.g. `q.UnsafeWhere()`                  |

### Interpolated SQL with Sql.Fmt

C# string interpolation is the most common way values end up concatenated into SQL. `Sql.Fmt()` keeps the
interpolation syntax but sends every value as a db param. See [Interpolated SQL](/ormlite/sql-fmt):

```csharp
// Unsafe: the value is embedded in the SQL
db.Select<Book>($"Author = '{request.Author}'");

// Safe: the value is sent as a db param
db.Select<Book>(Sql.Fmt($"Author = {request.Author}"));
```

### Dynamic sorting with OrderBySafe

Sorting by a query string value like `?orderBy=-Price` should never embed the value in SQL. `OrderBySafe()` resolves
field names to quoted columns and only accepts allowed fields. See [Dynamic Sorting](/ormlite/order-by-safe):

```csharp
var q = db.From<Book>().OrderBySafe(request.OrderBy, [nameof(Book.Title), nameof(Book.Price)]);
```

## SQL fragment validation

APIs that accept SQL fragments, like `Where(string)`, `And(string)`, `Or(string)`, `Having(string)`, `OrderBy(string)`,
`GroupBy(string)`, `Select(string)` and `From(string)`, validate the fragment with `SqlVerifyFragment()` and throw an
`ArgumentException` if it looks like it contains SQL injection:

```csharp
q.Where("Price > @price");                  // OK
q.OrderBy("Year DESC, Title");              // OK
q.OrderBy("Year; DROP TABLE Book");         // throws ArgumentException
q.Where("Author = 'x' OR 1=1 --");          // throws ArgumentException
```

A fragment is rejected when, outside of quoted strings, it contains:

- Comments (`--`, `/*`, `*/`) or statement separators (`;`) anywhere, e.g. `Id--` or `Id;TRUNCATE Book`.
  A single trailing `;` is allowed
- System variables (`@@`)
- Keywords that aren't needed in fragments, like `DROP`, `DELETE`, `INSERT`, `UPDATE`, `EXEC`, `DECLARE`, `ALTER`,
  `CREATE` and `SELECT` (for fragments), when used as whole words
- An unclosed quoted string, e.g. `'; DROP TABLE Book; --`

Quoted strings are checked both as ANSI SQL (`''` escapes) and MySQL (`\'` escapes) would parse them, so a fragment
has to be safe under both interpretations.

::: warning
Fragment validation is a safety net, not a substitute for parameters. It can't tell whether a fragment that passes
validation does what you intended, so never build fragments from user input. Pass values as params, or use
[Sql.Fmt()](/ormlite/sql-fmt) and [OrderBySafe()](/ormlite/order-by-safe).
:::

### Validating your own fragments

Use the same validation for SQL you build yourself:

```csharp
var orderBy = request.OrderBy.SqlVerifyFragment(); // throws ArgumentException if unsafe
```

### Trusted SQL with Unsafe APIs

Legitimate SQL can occasionally fail validation, e.g. a sub query in a `Where()` fragment. When the SQL is written
by you and contains no user input, use the equivalent `Unsafe*` API, which skips validation:

```csharp
q.UnsafeWhere("Id IN (SELECT BookId FROM BookReview WHERE Rating >= {0})", 4); // {0} is sent as a param
q.UnsafeSelect("COUNT(*) AS Total, MAX(Price) AS MaxPrice");
q.UnsafeOrderBy("CASE WHEN Available THEN 0 ELSE 1 END, Title");
```

### Customizing validation

Replace the built-in validation with `OrmLiteUtils.SqlVerifyFragmentFn`, which should throw for unsafe fragments:

```csharp
OrmLiteUtils.SqlVerifyFragmentFn = fragment => {
    if (MyValidator.IsUnsafe(fragment))
        throw new ArgumentException("Potential illegal fragment detected: " + fragment);
    return fragment;
};
```

## Identifier quoting

Table, column and schema names are always quoted with the dialect's quote character, and any quote characters
within them are escaped by doubling them, so a name can't break out of its quotes:

```csharp
var dialect = db.GetDialectProvider();
dialect.GetQuotedName("my\"table");   // "my""table"
dialect.QuoteSchema("db.dbo", "Book");  // "db"."dbo"."Book" on SQL Server
```

On Oracle and Firebird, which only quote names when required, any name that isn't a plain identifier is quoted
and escaped.

## Values inlined into SQL

A few features have to inline values into SQL instead of sending them as params, e.g. the date format in
`x.Date.ToString(format)` expressions on SQLite and MySQL, and the date format and currency symbol in the
`q.sql.DateFormat()` and `q.sql.Currency()` SQL helpers. These values are always escaped with the dialect's quoting
rules, including MySQL's backslash escapes, even when they come from variables.
