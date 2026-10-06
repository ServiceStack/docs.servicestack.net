---
title: Streaming Results
---

`SelectLazyAsync()` and `ColumnLazyAsync()` return `IAsyncEnumerable<T>` streams that read rows one at a time as
you iterate, so large result sets can be processed with bounded memory and without blocking a thread:

```csharp
await foreach (var order in db.SelectLazyAsync(db.From<Order>().Where(x => x.Status == Status.Shipped), token))
{
    await writer.WriteAsync(order);
}
```

Compared to `SelectAsync()`, which loads every row into a `List<T>` before returning, streaming:

- Uses the same memory for 1 row as for 10 million rows
- Starts processing as soon as the first row is read
- Lets you stop reading at any point, closing the reader

Use it for exports, reports, data migrations, background processing and sending results to other systems.

## Streaming typed queries

```csharp
var q = db.From<Book>()
    .Where(x => x.Available)
    .OrderBy(x => x.Year);

await foreach (var book in db.SelectLazyAsync(q))
{
    Console.WriteLine($"{book.Year}: {book.Title}");
}
```

## Streaming parameterized SQL

With anonymous type params:

```csharp
await foreach (var book in db.SelectLazyAsync<Book>("Author = @author", new { author }))
{
    // ...
}
```

Or with [interpolated SQL](/ormlite/sql-fmt), where each value is a db param:

```csharp
await foreach (var book in db.SelectLazyAsync<Book>(Sql.Fmt($"Genre = {genre} AND Price < {maxPrice}")))
{
    // ...
}
```

## Streaming a single column

`ColumnLazyAsync()` streams the first column's values:

```csharp
var total = 0m;
await foreach (var price in db.ColumnLazyAsync<decimal>(db.From<Book>().Select(x => x.Price)))
{
    total += price;
}

await foreach (var email in db.ColumnLazyAsync<string>("SELECT Email FROM Customer WHERE Active = @active", 
    new { active = true }))
{
    await mailer.QueueAsync(email);
}

// Or with interpolated values sent as db params
await foreach (var email in db.ColumnLazyAsync<string>(Sql.Fmt($"SELECT Email FROM Customer WHERE Country = {country}")))
{
    await mailer.QueueAsync(email);
}
```

## Processing in batches

Group streamed rows into batches, e.g. to send them to another system without loading the whole table:

```csharp
var batch = new List<Book>();
await foreach (var book in db.SelectLazyAsync(db.From<Book>().OrderBy(x => x.Id)))
{
    batch.Add(book);
    if (batch.Count == 100)
    {
        await SendBatchAsync(batch);
        batch.Clear();
    }
}
if (batch.Count > 0)
    await SendBatchAsync(batch);
```

## Stopping early

Breaking out of the loop disposes the reader and command straight away, so the connection can be used again
immediately:

```csharp
Book? first = null;
await foreach (var book in db.SelectLazyAsync(db.From<Book>().OrderByDescending(x => x.Price)))
{
    first = book;
    break;
}

var count = await db.CountAsync<Book>(); // the connection is available again
```

## Cancellation

Pass a `CancellationToken` to stop streaming, e.g. when an HTTP request is aborted. Cancellation is checked for
every row, including on providers whose readers don't observe the token themselves:

```csharp
try
{
    await foreach (var book in db.SelectLazyAsync(db.From<Book>(), token))
    {
        await ProcessAsync(book, token);
    }
}
catch (OperationCanceledException)
{
    // stopped
}
```

`WithCancellation()` isn't required since the token is passed to the query.

## Exporting to a file

Stream rows straight into a file, e.g. to export a large table to CSV without loading it into memory:

```csharp
await using var writer = File.CreateText("books.csv");
await writer.WriteLineAsync("Id,Title,Author,Year");

await foreach (var book in db.SelectLazyAsync(db.From<Book>().OrderBy(x => x.Id), token))
{
    await writer.WriteLineAsync($"{book.Id},{book.Title.ToCsvField()},{book.Author.ToCsvField()},{book.Year}");
}
```

## Keep the connection open while streaming

Rows are read from the database while you iterate, so the connection stays in use until the loop completes. Most
providers don't allow running other queries on the same connection while a stream is open, so open another
connection if you need to query while streaming:

```csharp
using var db = await dbFactory.OpenDbConnectionAsync();
using var lookupDb = await dbFactory.OpenDbConnectionAsync();

await foreach (var review in db.SelectLazyAsync(db.From<BookReview>()))
{
    var book = await lookupDb.SingleByIdAsync<Book>(review.BookId);
}
```

## Sync streaming

The sync equivalents are `SelectLazy()` and `ColumnLazy()`, which return `IEnumerable<T>`:

```csharp
foreach (var book in db.SelectLazy(db.From<Book>().Where(x => x.Available)))
{
    // ...
}

foreach (var title in db.ColumnLazy<string>(Sql.Fmt($"SELECT Title FROM Book WHERE Genre = {genre}")))
{
    // ...
}
```

## APIs

| API | Returns |
|-|-|
| `SelectLazyAsync<T>(SqlExpression<T>, token)` | `IAsyncEnumerable<T>` |
| `SelectLazyAsync<T>(string sql, object anonType, token)` | `IAsyncEnumerable<T>` |
| `SelectLazyAsync<T>(SqlFormattable sql, token)` | `IAsyncEnumerable<T>` |
| `ColumnLazyAsync<T>(ISqlExpression, token)` | `IAsyncEnumerable<T>` |
| `ColumnLazyAsync<T>(string sql, object anonType, token)` | `IAsyncEnumerable<T>` |
| `ColumnLazyAsync<T>(SqlFormattable sql, token)` | `IAsyncEnumerable<T>` |
| `SelectLazy<T>(...)`, `ColumnLazy<T>(...)` | `IEnumerable<T>` |

The async streaming APIs are available on all target frameworks, including .NET Framework.
