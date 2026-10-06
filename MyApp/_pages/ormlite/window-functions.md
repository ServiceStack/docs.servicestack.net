---
title: Window Functions
---

Window functions calculate a value for each row from other rows related to it, like its rank within a group, a running
total or the value of the previous row. Unlike `GroupBy()`, every row is still returned:

```csharp
var q = db.From<Order>()
    .Select(x => new {
        x.Id,
        x.Customer,
        x.Total,
        // Each order's rank among its customer's orders, from largest to smallest
        Rank = Sql.RowNumber(w => w.PartitionBy(x.Customer).OrderByDescending(x.Total)),
        // The customer's running total, in date order
        RunningTotal = Sql.Sum(x.Total, w => w.PartitionBy(x.Customer).OrderBy(x.CreatedDate)),
    });

var results = db.Select<OrderStats>(q);
```

`TopPerGroup()` returns the first rows of each group, e.g. each customer's 3 latest orders:

<generated-sql>

```csharp
var latest = db.Select(db.From<Order>()
    .OrderByDescending(x => x.CreatedDate)
    .TopPerGroup(x => x.Customer, take: 3));
```

```sql
SELECT "Id", "Customer", "Total", "CreatedDate"
FROM (
  SELECT "Order".*, ROW_NUMBER() OVER (PARTITION BY "Customer" ORDER BY "CreatedDate" DESC) AS "_rn"
  FROM "Order"
) "Order"
WHERE "Order"."_rn" <= 3
ORDER BY "CreatedDate" DESC
```

</generated-sql>

## The window

Each window function takes a lambda that defines its window, the rows the function is calculated over:

| Method | SQL | Description |
|-|-|-|
| `PartitionBy(x.A, x.B)` | `PARTITION BY` | Calculate the function separately for each group of rows with the same values |
| `OrderBy(x.A)`, `OrderByDescending(x.A)` | `ORDER BY` | The order of rows within each partition |
| `ThenBy(x.B)`, `ThenByDescending(x.B)` | `ORDER BY` | Additional order, e.g. to break ties |
| `RowsBetween(preceding, following)` | `ROWS BETWEEN` | Only use the rows around the current row |

Without `PartitionBy()` the window is every row returned by the query, and `w => w` uses every row in any order.

## Ranking rows

```csharp
var q = db.From<Order>()
    .Select(x => new {
        x.Id,
        RowNumber = Sql.RowNumber(w => w.PartitionBy(x.Customer).OrderByDescending(x.Total)),
        Rank = Sql.Rank(w => w.PartitionBy(x.Customer).OrderByDescending(x.Total)),
        DenseRank = Sql.DenseRank(w => w.PartitionBy(x.Customer).OrderByDescending(x.Total)),
        Quartile = Sql.Ntile(4, w => w.OrderByDescending(x.Total)),
    });
```

| Function | Returns | For totals of 120, 80, 80, 60 |
|-|-|-|
| `Sql.RowNumber()` | The row's number in its partition | 1, 2, 3, 4 |
| `Sql.Rank()` | Its rank, equal values share a rank and the next rank is skipped | 1, 2, 2, 4 |
| `Sql.DenseRank()` | Its rank, without skipping ranks | 1, 2, 2, 3 |
| `Sql.Ntile(n)` | The bucket it's in after dividing the rows into `n` buckets | |

`RowNumber()` gives rows with equal values an arbitrary order, add `ThenBy()` to make it stable, e.g.
`w.OrderByDescending(x.Total).ThenBy(x.Id)`.

## Running totals and group totals

Aggregate functions have window overloads. With an `OrderBy()` the window is every row up to the current row, which
makes a running total. Without one, it's the whole partition:

```csharp
var q = db.From<Order>()
    .Select(x => new {
        x.Id,
        x.Total,
        RunningTotal = Sql.Sum(x.Total, w => w.PartitionBy(x.Customer).OrderBy(x.CreatedDate)),
        CustomerTotal = Sql.Sum(x.Total, w => w.PartitionBy(x.Customer)),
        CustomerOrders = Sql.Count("*", w => w.PartitionBy(x.Customer)),
        LargestOrder = Sql.Max(x.Total, w => w.PartitionBy(x.Customer)),
    });

// e.g. each order's share of its customer's total
foreach (var row in db.Select<OrderStats>(q))
{
    var share = row.Total / row.CustomerTotal;
}
```

`Sql.Sum()`, `Sql.Count()`, `Sql.Min()`, `Sql.Max()` and `Sql.Avg()` are supported.

## Moving averages

`RowsBetween(preceding, following)` limits the window to rows around the current row. Use `0` for the current row and
`null` for all rows before or after it:

```csharp
// The average of each day's sales and the 6 days before it
var q = db.From<DailySales>()
    .OrderBy(x => x.Date)
    .Select(x => new {
        x.Date,
        x.Total,
        WeeklyAverage = Sql.Avg(x.Total, w => w.OrderBy(x.Date).RowsBetween(6, 0)),
    });
```

## Previous and next rows

```csharp
var q = db.From<Order>()
    .Select(x => new {
        x.Id,
        x.Total,
        PreviousTotal = Sql.Lag(x.Total, w => w.PartitionBy(x.Customer).OrderBy(x.CreatedDate)),
        NextTotal = Sql.Lead(x.Total, w => w.PartitionBy(x.Customer).OrderBy(x.CreatedDate)),
        FirstTotal = Sql.FirstValue(x.Total, w => w.PartitionBy(x.Customer).OrderBy(x.CreatedDate)),
        LastTotal = Sql.LastValue(x.Total,
            w => w.PartitionBy(x.Customer).OrderBy(x.CreatedDate).RowsBetween(null, null)),
    });
```

- `Sql.Lag()` and `Sql.Lead()` return `null` when there's no previous or next row. Pass an offset to read further
  back or ahead, e.g. `Sql.Lag(x.Total, 7, w => ...)` for the value 7 rows before.
- `Sql.LastValue()` needs `RowsBetween(null, null)` to return the last row of the partition, as with an `OrderBy()`
  the window ends at the current row.

## Top rows of each group

`TopPerGroup()` only returns the first `take` rows of each group, in the order of the query's `OrderBy()`:

```csharp
// Each customer's 3 latest orders
var q = db.From<Order>()
    .OrderByDescending(x => x.CreatedDate)
    .TopPerGroup(x => x.Customer, take: 3);

// Each customer's largest order
var q = db.From<Order>()
    .OrderByDescending(x => x.Total).ThenBy(x => x.Id)
    .TopPerGroup(x => x.Customer, take: 1);
```

The results are returned in the order of the query's `OrderBy()`. Order by the group first to return the rows of each
group together:

```csharp
var q = db.From<Order>()
    .OrderBy(x => x.Customer).ThenByDescending(x => x.CreatedDate)
    .TopPerGroup(x => x.Customer, take: 3);
```

`Where()` conditions and joins filter the rows before they're ranked, and the results can be counted, paged or
projected like any other query:

```csharp
var q = db.From<Order>()
    .Join<Customer>((o, c) => o.CustomerId == c.Id)
    .Where<Customer>(c => c.Country == "UK")
    .OrderByDescending(x => x.CreatedDate)
    .TopPerGroup(x => x.CustomerId, take: 3);

var total = db.Count(q);
var page = db.Select(q.Skip(0).Take(50));
```

Group by multiple columns with an anonymous type, e.g. `TopPerGroup(x => new { x.Region, x.Category }, take: 5)`.

::: info
Databases don't allow window functions in `WHERE`, so `TopPerGroup()` selects the rows with their `ROW_NUMBER()` in a
sub query and filters them in the outer query:

```sql
SELECT "Id", "Customer", "Total", "CreatedDate"
FROM (SELECT "Order".*, ROW_NUMBER() OVER (PARTITION BY "Customer" ORDER BY "CreatedDate" DESC) AS "_rn"
      FROM "Order") "Order"
WHERE "Order"."_rn" <= 3
ORDER BY "CreatedDate" DESC
```

It requires an `OrderBy()` and can't be combined with `GroupBy()`, `ForUpdate()`, set operations like `Union()` or
`WithRecursive()`. With joins, only the query's table's columns can be selected.
:::

## Queries with joins

Window functions can use columns from any joined table:

```csharp
var q = db.From<BookReview>()
    .Join<Book>((r, b) => r.BookId == b.Id)
    .Select<BookReview, Book>((r, b) => new {
        r.Reviewer,
        b.Title,
        ReviewerReviews = Sql.Count("*", w => w.PartitionBy(r.Reviewer)),
        RatingRank = Sql.Rank(w => w.PartitionBy(b.Title).OrderByDescending(r.Rating)),
    });
```

## RDBMS support

Window functions are supported on PostgreSQL, SQL Server, SQLite 3.25+, MySQL 8+, MariaDB 10.2+ and Oracle.
