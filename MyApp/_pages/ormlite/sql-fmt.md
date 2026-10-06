---
title: Interpolated SQL with Sql.Fmt
---

`Sql.Fmt()` lets you write raw SQL with C# string interpolation while every interpolated value is sent as a db
parameter, so it's never concatenated into the SQL. OrmLite generates the SQL and params for your RDBMS:

<generated-sql>

```csharp
var author = request.Author;
var books = db.Select<Book>(Sql.Fmt($"Author = {author} AND Price < {request.MaxPrice}"));
```

```sql
SELECT "Id", "Title", "Author", "Genre", "Price", "Year", "Available"
FROM "Book"
WHERE Author = @p0 AND Price < @p1
-- @p0 = 'J.R.R. Tolkien', @p1 = 20
```

</generated-sql>

Values that would otherwise enable SQL Injection are just values that don't match:

```csharp
var malicious = "x' OR '1'='1";
db.Select<Book>(Sql.Fmt($"Author = {malicious}")); // returns no rows
```

::: tip
`Sql.Fmt()` is an explicit opt-in. Passing an interpolated string directly to APIs that accept a `string`, e.g.
`db.Select<Book>($"Author = '{author}'")`, still concatenates the value into the SQL.
:::

## Values of any type

Values are converted the same way as in typed queries, so enums, dates, decimals and bools just work:

```csharp
var genre = Genre.Fiction;  // enums are converted to how they're stored, e.g. as strings
var books = db.Select<Book>(Sql.Fmt($"Genre = {genre} AND Price < {15m} AND Available = {true}"));
```

## Collections expand into IN lists

Collections are expanded into a param for each value:

```csharp
var authors = new[] { "Frank Herbert", "Carl Sagan" };
var books = db.Select<Book>(Sql.Fmt($"Author IN ({authors})"));
// WHERE Author IN (@v0,@v1)
```

Empty collections match nothing, rather than generating invalid SQL:

```csharp
var none = new List<string>();
db.Select<Book>(Sql.Fmt($"Author IN ({none})")); // returns no rows
```

## Referencing tables and columns

Table and column references are embedded in the SQL as names quoted by the RDBMS dialect, instead of being sent as
params:

```csharp
var Book = db.TableRef<Book>();
var (Title, Author, Year) = db.ColumnRefs<Book>(x => new { x.Title, x.Author, x.Year });

var titles = db.SqlColumn<string>(
    Sql.Fmt($"SELECT {Title} FROM {Book} WHERE {Author} = {author} ORDER BY {Year}"));
```

Naming references after their table and column, and values in camelCase, keeps the SQL readable and makes it clear
which parts of the SQL are names and which are params.

Using the quoted names also makes the SQL portable, as they include the table's schema, `[Alias]` names and the RDBMS
naming convention, e.g. PostgreSQL's naming convention stores the `BookReview` table as `book_review` and its
`BookId` column as `book_id`.

### Tables

| Reference | Example |
|-|-|
| `TableRef` | `var Book = db.TableRef<Book>();`, `new TableRef("Book")`, `new TableRef("archive", "Book")` |
| `TableRefs` | `var (Book, BookReview) = db.TableRefs<Book, BookReview>();` for up to 6 tables |
| `Type` | `{typeof(Book)}` |
| `ModelDefinition` | `{ModelDefinition<T>.Definition}`, e.g. in generic code |

```csharp
var (Order, Customer, Product) = db.TableRefs<Order, Customer, Product>();

var count = db.SqlScalar<int>(Sql.Fmt($"SELECT COUNT(*) FROM {typeof(Book)}"));

// Works for any table
int CountRows<T>(IDbConnection db) =>
    db.SqlScalar<int>(Sql.Fmt($"SELECT COUNT(*) FROM {ModelDefinition<T>.Definition}"));
```

### Columns

`db.ColumnRef<T>()` references a single column, and `db.ColumnRefs<T>()` references multiple columns that are
deconstructed into variables:

```csharp
var Price = db.ColumnRef<Book>(x => x.Price);
var (Id, Title, Author) = db.ColumnRefs<Book>(x => new { x.Id, x.Title, x.Author });
```

They return the same quoted names as `q.Column<T>()`, e.g. `"Price"`, embedded like `Sql.Raw()`.

### Queries with joins

Use `prefixTable: true` to qualify columns with their table name, e.g. `"Book"."Id"`:

```csharp
var (Book, BookReview) = db.TableRefs<Book, BookReview>();
var (Id, Title) = db.ColumnRefs<Book>(x => new { x.Id, x.Title }, prefixTable:true);
var (BookId, Rating) = db.ColumnRefs<BookReview>(x => new {x.BookId, x.Rating}, prefixTable:true);

var reviewed = db.SqlColumn<string>(Sql.Fmt(
  $"SELECT DISTINCT {Title} FROM {Book} JOIN {BookReview} ON {Id}={BookId} WHERE {Rating}>={4}"));
```

::: info
A variable named after a type hides the type within its scope, e.g. after
`var Genre = db.ColumnRef<Book>(x => x.Genre)`, `Genre.Fiction` refers to the variable. Assign enum values to
variables before declaring the column references, or use the enum's full name, e.g. `MyApp.Genre.Fiction`.
:::

### Other trusted SQL with Sql.Raw

Use `Sql.Raw()` to embed any other trusted SQL verbatim. It's a signal that the value is SQL rather than data, so
never use it with user input:

```csharp
var orderBy = Sql.Raw(sortByNewest ? "DESC" : "ASC");
var books = db.SqlList<Book>(Sql.Fmt($"SELECT * FROM {Book} ORDER BY {Year} {orderBy}"));
```

## Supported APIs

The examples below use these references:

```csharp
var genre = Genre.Science;
var Book = db.TableRef<Book>();
var (Id, Title, Author, Genre, Price, Year, Available) = db.ColumnRefs<Book>(x =>
    new { x.Id, x.Title, x.Author, x.Genre, x.Price, x.Year, x.Available });
```

### Raw SQL queries

Complete SQL statements with `SqlList`, `SqlColumn` and `SqlScalar`:

```csharp
List<Book> books = db.SqlList<Book>(Sql.Fmt($"SELECT * FROM {Book} WHERE {Author} = {author}"));
List<string> titles = db.SqlColumn<string>(Sql.Fmt($"SELECT {Title} FROM {Book} WHERE {Year} < {1950}"));
int count = db.SqlScalar<int>(Sql.Fmt($"SELECT COUNT(*) FROM {Book} WHERE {Genre} = {genre}"));
```

### WHERE clause shorthand APIs

APIs that complete the `SELECT` for you accept just the condition:

```csharp
List<Book> books = db.Select<Book>(Sql.Fmt($"{Author} = {author}"));
Book book = db.Single<Book>(Sql.Fmt($"{Title} = {title}"));
bool exists = db.Exists<Book>(Sql.Fmt($"{Author} = {author}"));
List<string> titles = db.Column<string>(Sql.Fmt($"SELECT {Title} FROM {Book} WHERE {Year} > {2000}"));
int max = db.Scalar<int>(Sql.Fmt($"SELECT MAX({Year}) FROM {Book} WHERE {Genre} = {genre}"));
```

### Queries into collections

```csharp
HashSet<string> authors = db.ColumnDistinct<string>(Sql.Fmt($"SELECT {Author} FROM {Book} WHERE {Genre} = {genre}"));
Dictionary<string, List<string>> titlesByAuthor = db.Lookup<string, string>(
    Sql.Fmt($"SELECT {Author}, {Title} FROM {Book} WHERE {Genre} = {genre}"));
Dictionary<string, int> years = db.Dictionary<string, int>(Sql.Fmt($"SELECT {Title}, {Year} FROM {Book} WHERE {Year} < {1950}"));
List<KeyValuePair<string, int>> pairs = db.KeyValuePairs<string, int>(
    Sql.Fmt($"SELECT {Title}, {Year} FROM {Book} WHERE {Year} < {1950}"));
long rows = db.RowCount(Sql.Fmt($"SELECT {Id} FROM {Book} WHERE {Genre} = {genre}"));
```

Results can be read lazily with `SelectLazy()` and `ColumnLazy()`, or from one table into a different model:

```csharp
IEnumerable<Book> books = db.SelectLazy<Book>(Sql.Fmt($"{Genre} = {genre}"));
IEnumerable<string> titles = db.ColumnLazy<string>(Sql.Fmt($"SELECT {Title} FROM {Book} WHERE {Genre} = {genre}"));
List<BookTitle> summaries = db.Select<BookTitle>(typeof(Book), Sql.Fmt($"{Genre} = {genre}"));
```

### Updates and deletes

```csharp
db.ExecuteSql(Sql.Fmt($"UPDATE {Book} SET {Price} = {Price} * {0.9m} WHERE {Author} = {author}"));

var ids = db.Column<int>(db.From<Book>().Where(x => !x.Available).Select(x => x.Id));
db.ExecuteSql(Sql.Fmt($"DELETE FROM {Book} WHERE {Id} IN ({ids})"));
```

`ExecuteNonQuery()` is also supported. `Delete()` accepts just the condition:

```csharp
db.Delete<Book>(Sql.Fmt($"{Author} = {author}"));
db.Delete(typeof(Book), Sql.Fmt($"{Id} IN ({ids})"));
```

### Typed SqlExpressions

`Sql.Fmt()` mixes with typed queries in `Where()`, `And()`, `Or()` and `Having()`:

```csharp
var q = db.From<Book>()
    .Where(x => x.Available)
    .And(Sql.Fmt($"{Year} >= {minYear}"))
    .OrderBy(x => x.Year);
```

This is useful for conditions that are hard to express in C#, e.g. aggregates in `HAVING`:

```csharp
// Genres with at least 2 books, one of which was published since 1980
var q = db.From<Book>()
    .GroupBy(x => x.Genre)
    .Having(Sql.Fmt($"COUNT(*) >= {2} AND MAX({Year}) >= {1980}"))
    .Select(x => x.Genre);

var genres = db.Column<Genre>(q);
```

In queries with joins, `Sql.Raw(q.Column<T>(x => x.Year))` prefixes the column with its table or alias when needed.

### Async APIs

Every API has an async equivalent:

```csharp
var books = await db.SelectAsync<Book>(Sql.Fmt($"{Genre} = {genre}"));
var book = await db.SingleAsync<Book>(Sql.Fmt($"{Title} = {title}"));
var max = await db.ScalarAsync<decimal>(Sql.Fmt($"SELECT MAX({Price}) FROM {Book} WHERE {Genre} = {genre}"));
var rows = await db.ExecuteSqlAsync(Sql.Fmt($"UPDATE {Book} SET {Available} = {false} WHERE {Genre} = {genre}"));
```

Including `SelectAsync`, `SingleAsync`, `ScalarAsync`, `ColumnAsync`, `ColumnDistinctAsync`, `ExistsAsync`,
`LookupAsync`, `DictionaryAsync`, `KeyValuePairsAsync`, `RowCountAsync`, `SqlListAsync`, `SqlColumnAsync`,
`SqlScalarAsync`, `ExecuteSqlAsync`, `ExecuteNonQueryAsync` and `DeleteAsync`. You can also
[stream results](/ormlite/streaming) with `SelectLazyAsync()` and `ColumnLazyAsync()`.

## Literal braces and format specifiers

Use `{{` and `}}` for literal braces, as in any C# interpolated string:

```csharp
db.SqlList<Book>(Sql.Fmt($"SELECT * FROM {Book} WHERE {Title} <> '{{untitled}}' AND {Year} > {1900}"));
```

Format and alignment specifiers like `{date:yyyy-MM-dd}` are rejected with a `FormatException`, since db params are
sent as typed values rather than text. Pass the typed value, or format it before interpolating it:

```csharp
var since = new DateTime(2026, 1, 1);
Sql.Fmt($"CreatedDate >= {since:yyyy-MM-dd}");               // FormatException when executed
Sql.Fmt($"CreatedDate >= {since}");                          // typed DateTime param
Sql.Fmt($"Day = {since.ToString("yyyy-MM-dd")}");            // formatted string param
```

## Inspecting the generated SQL

`ToSql()` returns the SQL and params for a dialect, e.g. for logging or tests:

```csharp
var sql = Sql.Fmt($"Author = {author}").ToSql(db.GetDialectProvider(), out var dbParams);
// sql: "Author = @p0", dbParams: { ["p0"] = "J.R.R. Tolkien" }
```
