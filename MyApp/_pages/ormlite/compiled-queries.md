---
title: Compiled Queries
---

A typed query generates its SQL each time it's run. `OrmLiteQuery.Compile()` generates the SQL of a query once, then
only creates db params from its arguments each time it's run:

<generated-sql>

```csharp
public static class OrderQueries
{
    // Declared once, the SQL is generated the first time it's run
    public static readonly CompiledQuery<Order, int> RecentByCustomer =
        OrmLiteQuery.Compile<Order, int>((q, customerId) => q
            .Where(x => x.CustomerId == customerId && x.Status != OrderStatus.Cancelled)
            .OrderByDescending(x => x.Id)
            .Take(20));
}

var orders = db.Select(OrderQueries.RecentByCustomer, customerId);
```

```sql
SELECT "Id", "CustomerId", "Status", "Reference", "Total", "CreatedDate"
FROM "Order"
WHERE (("CustomerId" = @0) AND ("Status" <> @1))
ORDER BY "Id" DESC
LIMIT 20
-- @0 = 42, @1 = 'Cancelled'
```

</generated-sql>

It's the same SQL and db params as the typed query it was compiled from, so it returns the same results. Use it for
the queries your App runs most, where the time and memory to generate the same SQL each time adds up.

## Declare a query

The first argument of the lambda is the query to build, followed by up to 4 arguments of the query:

```csharp
// No arguments
static readonly CompiledQuery<Order> OpenOrders = OrmLiteQuery.Compile<Order>(q => q
    .Where(x => x.Status == OrderStatus.Pending)
    .OrderBy(x => x.CreatedDate));

// Several arguments, with a join and a custom select
static readonly CompiledQuery<Order, int, DateTime, string> Summaries =
    OrmLiteQuery.Compile<Order, int, DateTime, string>((q, customerId, since, country) => q
        .Join<Customer>((o, c) => o.CustomerId == c.Id)
        .Where(x => x.CustomerId == customerId && x.CreatedDate >= since)
        .And<Customer>(c => c.Country == country)
        .OrderByDescending(x => x.CreatedDate)
        .Select<Order, Customer>((o, c) => new { o.Id, o.Total, c.Name }));
```

Queries with more values can use a class for an argument, whose properties are read each time the query is run:

```csharp
static CompiledQuery<Order, OrderFilter> Filtered = OrmLiteQuery.Compile<Order, OrderFilter>(
    (q, filter) => q.Where(x => x.CustomerId == filter.CustomerId && x.Total >= filter.MinTotal));
```

Declare compiled queries in `static readonly` fields. Each compiled query keeps its own SQL, so a query that's
compiled each time it's run never reuses it.

## Run a query

| API | Returns |
|-|-|
| `db.Select(query, args)` | The results |
| `db.Single(query, args)` | The first result, or `null` |
| `db.Count(query, args)` | The number of rows |
| `db.Exists(query, args)` | Whether it has any rows |
| `db.Delete(query, args)` | The number of rows it deleted |

Each has an async API, e.g. `await db.SelectAsync(query, customerId)`.

### Updates and deletes

`Delete()` deletes the rows a compiled query matches, and `UpdateOnly()` and `UpdateAdd()` update them, reusing the SQL
of its `WHERE` clause. The values to update are written each time, with the connection's
[write rules](/ormlite/connection-filters#write-rules):

```csharp
static readonly CompiledQuery<Order, int> ByCustomer = OrmLiteQuery.Compile<Order, int>(
    (q, customerId) => q.Where(x => x.CustomerId == customerId));

db.UpdateOnly(() => new Order { Status = OrderStatus.Cancelled }, ByCustomer.Bind(db, customerId));
db.UpdateAdd(() => new Order { Total = 10 }, ByCustomer.Bind(db, customerId)); // adds 10 to each Total
db.Delete(ByCustomer, customerId);
```

### In other APIs

`Bind()` returns the query with a connection and its arguments, for the other APIs that take a query:

```csharp
var summaries = db.Select<OrderSummary>(Summaries.Bind(db, customerId, since, "US"));

var names = db.Column<string>(CustomerNames.Bind(db, "US"));
var total = db.Scalar<decimal>(TotalSpent.Bind(db, customerId));
```

Its `ToQuery()` returns the typed query, to change it or use it in an API that needs an `SqlExpression<T>`. It
generates its SQL each time:

```csharp
var q = RecentByCustomer.Bind(db, customerId).ToQuery().Take(5);
var orders = db.LoadSelect(q);
```

## How much faster

The time and memory to get the SQL and db params of a query that's ready to run, without running it:

| Query | Typed query | Compiled query | Faster | Memory |
|-|-|-|-|-|
| By Id | 1,844 ns | 74 ns | 25x | 5,296 B → 240 B |
| 2 filters, order by and take | 3,437 ns | 81 ns | 42x | 8,400 B → 312 B |
| Text search with `StartsWith()` | 3,257 ns | 85 ns | 38x | 8,488 B → 256 B |
| `Sql.In()` with 10 values | 3,081 ns | 552 ns | 5.6x | 8,744 B → 1,584 B |
| Join, 4 filters and custom select | 10,521 ns | 214 ns | 49x | 21,817 B → 544 B |

Measured with [BenchmarkDotNet](https://benchmarkdotnet.org) on .NET 10 and a Ryzen 7 7800X3D for SQLite. PostgreSQL,
SQL Server and MySQL are 20x to 47x faster, and 4.5x to 5.9x for the `Sql.In()` query, which creates a db param for
each value. Run them with:

```bash
cd ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Tests.Benchmarks
dotnet run -c Release -- --filter '*CompiledQuery*'
```

This is the time before a query is sent to the database, a few microseconds, which is much less than the time most
queries take to run. Compiled queries matter most for queries that are run very often or return quickly, e.g. from an
in-process SQLite database, and for the memory that's no longer allocated for each query.

## When a query has more than one SQL statement

The SQL of some queries changes with their arguments. Compiled queries keep a statement for each:

| Argument | SQL for each | Example |
|-|-|-|
| `null` | Combination of null arguments | `x.Author == author` is `"Author" IS NULL` for a null |
| Collection | Number of values | `Sql.In(x.Id, ids)` and `ids.Contains(x.Id)` have a db param for each value |
| Used outside a lambda | Value | `q.Take(take)` has the number of rows in its SQL |
| [Connection filters](#queries-of-filtered-tables) | FilterSets a connection uses and the SQL of their filters | A filter that admins skip has SQL with and without the tenant's condition |

```csharp
static readonly CompiledQuery<Order, int[]> ByIds = OrmLiteQuery.Compile<Order, int[]>(
    (q, ids) => q.Where(x => Sql.In(x.Id, ids)));

db.Select(ByIds, [1, 2, 3]); // generates SQL for 3 values
db.Select(ByIds, [4, 5, 6]); // reuses it
db.Select(ByIds, [7, 8]);    // generates SQL for 2 values
```

A query keeps up to `OrmLiteQuery.MaxCachedStatements` statements for each dialect, 256 by default. After that the
SQL of new combinations is generated each time, so don't use arguments with many values outside a lambda, e.g. the
rows to skip in `q.Skip(skip)`.

## Queries of filtered tables

Queries of tables that a connection has [mandatory filters](/ormlite/connection-filters) for reuse their SQL too, e.g.
a tenant's tables in a multi-tenant App. Connections that use the same [FilterSets](/ormlite/connection-filters#declaring-filters-and-rules)
share a statement, with the values of their scopes as db params, so every tenant uses the same SQL:

```csharp
static readonly CompiledQuery<Order, int> RecentOrders = OrmLiteQuery.Compile<Order, int>(
    (q, customerId) => q.Where(x => x.CustomerId == customerId).OrderByDescending(x => x.Id).Take(20));

using var db = dbFactory.Open().UseFilters(TenantFilters.For(tenant));
var orders = db.Select(RecentOrders, customerId); // filtered by the tenant of the connection
```

The filters' values are read from the scope each time the query is run, like they are for other queries. A
condition that only reads the scope has a statement for each case, e.g. one with the tenant condition and one
without it for admins. Filters whose SQL can't be reused, which `FilterSet.NotCachedReasons` lists, generate the
query's SQL each time.

## Vector search

The vector a query compares with can be an argument, so the queries that find the rows most similar to a question
reuse their SQL, see [Vector Search](/ormlite/vectors):

```csharp
static readonly CompiledQuery<Passage, float[]> MostSimilar = OrmLiteQuery.Compile<Passage, float[]>(
    (q, vector) => q.OrderBy(x => Sql.CosineDistance(x.Embedding, vector)).Take(5));

var nearest = db.Select(MostSimilar, questionVector);
```

## Values that aren't arguments are read once

Everything in the query that isn't an argument is read when its SQL is generated, and is the same each time after:

```csharp
// The time it was first run, each time it's run
OrmLiteQuery.Compile<Order, int>((q, customerId) => q
    .Where(x => x.CustomerId == customerId && x.CreatedDate >= DateTime.Today));

// Pass values that change as arguments
OrmLiteQuery.Compile<Order, int, DateTime>((q, customerId, since) => q
    .Where(x => x.CustomerId == customerId && x.CreatedDate >= since));
```

## Queries that generate their SQL each time

Some queries can't reuse their SQL. They return the same results as the typed query, without being faster:

- **Connection filters whose SQL can't be reused**, e.g. a filter with a collection that has a db param for each of its
  values, see `FilterSet.NotCachedReasons`
- **Global filters**: when `OrmLiteConfig.SqlExpressionSelectFilter` or `SqlExpressionInitFilter` is used
- **Arguments that decide the SQL**: e.g. `Where(x => includeAll || x.Year >= since)`, where the value of
  `includeAll` decides if there's a condition
- **Values that change as they're read**, e.g. `DateTime.UtcNow` or `Guid.NewGuid()`
- **Null values that aren't arguments**, e.g. when `filter.Author` is null. Only arguments keep SQL for a null

`NotCachedReason` has why a query last had to generate its SQL, and `CachedStatements` how many statements it keeps,
e.g. to check a query in a test:

```csharp
db.Select(OrderQueries.RecentByCustomer, 1);

Assert.That(OrderQueries.RecentByCustomer.NotCachedReason, Is.Null);
Assert.That(OrderQueries.RecentByCustomer.CachedStatements, Is.EqualTo(1));
```

## Prepared statements

A compiled query sends the same SQL each time it's run, which a database can prepare once and run again without parsing
and planning it. SQL Server reuses the plans of parameterized SQL by itself. In PostgreSQL, Npgsql prepares the
statements a connection runs most when it's enabled in the connection string, for typed and compiled queries alike:

```
Server=localhost;Database=app;User Id=app;Password=...;Max Auto Prepare=20
```

## Things to be aware of

- **Each dialect has its own SQL**, so a compiled query can be used with every database of an App
- **Configuration is read once**: changes to a dialect or `OrmLiteConfig` that change the SQL of a query, e.g. its
  naming strategy, aren't seen by queries that have generated their SQL
- **Text searches always have an ESCAPE**: `StartsWith()`, `EndsWith()` and `Contains()` with an argument generate
  `LIKE @0 ESCAPE '^'`, which typed queries only have when the text has a wildcard to escape. The results are the same
- **Thread safe**: compiled queries can be run by many threads at once
