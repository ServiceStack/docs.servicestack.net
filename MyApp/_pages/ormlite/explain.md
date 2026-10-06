---
title: Query Plans
---

`db.Explain()` returns the query plan your RDBMS will use to run a query, e.g. to check that it uses an index instead
of scanning a table:

```csharp
var q = db.From<Book>().Where(x => x.Author == "J.R.R. Tolkien").OrderBy(x => x.Year);

string plan = db.Explain(q);
```

The plan is returned as text in your RDBMS's own format, e.g. in PostgreSQL:

```txt
Sort  (cost=11.51..11.52 rows=1 width=619)
  Sort Key: year
  ->  Seq Scan on book  (cost=0.00..11.50 rows=1 width=619)
        Filter: (author = 'J.R.R. Tolkien'::text)
```

The query isn't run or modified, so it's safe to call in tests, admin UIs or when logging slow queries.

## Checking a query uses an index

A lookup by primary key uses its index, where each RDBMS describes it differently:

```csharp
var plan = db.Explain(db.From<Book>().Where(x => x.Id == 1));
```

| RDBMS | Query plan |
|-|-|
| SQLite | `SEARCH Book USING INTEGER PRIMARY KEY (rowid=?)` |
| PostgreSQL | `Index Scan using book_pkey on book  (cost=0.14..8.16 rows=1 width=619)` |
| SQL Server | `Clustered Index Seek(OBJECT:([test].[dbo].[Book].[PK__Book__3214EC07581621B7]), SEEK:(...))` |
| MySQL, MariaDB | A row with `type` of `const` and `key` of `PRIMARY` |

Compared with the first query which filters on a column without an index, e.g. in SQLite:

```txt
SCAN Book
USE TEMP B-TREE FOR ORDER BY
```

As plans are text you can assert on them in tests, e.g. to catch a query that stops using an index:

```csharp
Assert.That(db.Explain(q), Does.Not.Contain("SCAN Book"));
```

## Queries with joins

```csharp
var q = db.From<Book>()
    .Join<BookReview>((b, r) => b.Id == r.BookId)
    .Where<BookReview>(r => r.Rating >= 4);

var plan = db.Explain(q);
```

MySQL and MariaDB return a row for each table of the query, which is returned as a text table:

```txt
id | select_type | table      | type   | possible_keys | key     | key_len | ref                    | rows | Extra
1  | SIMPLE      | BookReview | ALL    |               |         |         |                        | 5    | Using where
1  | SIMPLE      | Book       | eq_ref | PRIMARY       | PRIMARY | 4       | test.BookReview.BookId | 1    |
```

## Custom SQL

Explain any SQL statement with its params:

```csharp
var plan = db.Explain("SELECT * FROM Book WHERE Year > @year", new { year = 1970 });
```

## Actual row counts and timings

By default the plan is the RDBMS's estimate. Use `analyze` to run the query and include what actually happened:

```csharp
var plan = db.Explain(q, analyze: true);
```

```txt
Sort  (cost=11.51..11.52 rows=1 width=619) (actual time=0.008..0.009 rows=2 loops=1)
  Sort Key: year
  Sort Method: quicksort  Memory: 25kB
  ->  Seq Scan on book  (cost=0.00..11.50 rows=1 width=619) (actual time=0.004..0.005 rows=2 loops=1)
        Filter: (author = 'J.R.R. Tolkien'::text)
        Rows Removed by Filter: 6
Planning Time: 0.016 ms
Execution Time: 0.013 ms
```

::: warning
`analyze` runs the statement, so only use it with custom SQL that's safe to run, e.g. a `SELECT`.
:::

## Async

```csharp
string plan = await db.ExplainAsync(q);
string plan = await db.ExplainAsync("SELECT * FROM Book WHERE Year > @year", new { year = 1970 });
```

## RDBMS support

| RDBMS | Query plan | With `analyze` |
|-|-|-|
| PostgreSQL | `EXPLAIN` | `EXPLAIN ANALYZE` |
| SQLite | `EXPLAIN QUERY PLAN` | `NotSupportedException` |
| SQL Server | `SET SHOWPLAN_TEXT ON` | `SET STATISTICS PROFILE ON` |
| MySQL | `EXPLAIN` | `EXPLAIN ANALYZE` (8.0.18+) |
| MariaDB | `EXPLAIN` | `ANALYZE` |
| Oracle, Firebird | `NotSupportedException` | `NotSupportedException` |

::: info
SQL Server only returns estimated plans of statements without params, so the query's params are included in its SQL
as literals. As the query isn't run this doesn't affect your data, but the plan can differ from the plan of the
parameterized query, which SQL Server caches for all values. Use `analyze` to get the plan of the parameterized query.
:::

Queries on a connection with [Connection Filters](/ormlite/connection-filters) include their filters, so their plans
show whether your filter columns are indexed.
