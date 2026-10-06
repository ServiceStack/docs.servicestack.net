---
title: Recursive Queries
---

`WithRecursive()` queries hierarchical data, like categories, org charts, threaded comments or bills of materials,
using a recursive common table expression (CTE). It starts with the rows of a seed query, then repeatedly adds the
rows that match a relationship until no more rows are found:

```csharp
public class Subject
{
    public int Id { get; set; }
    public int? ParentId { get; set; }
    public string Name { get; set; }
    public bool Active { get; set; }
}

// Fiction and every subject under it, at any depth
var q = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Name == "Fiction"),
        recurse: (parent, child) => child.ParentId == parent.Id);

List<Subject> subjects = db.Select(q);
```

- `seed` is the query for the rows to start with
- `recurse` matches the next rows to add: its first parameter is a row already found, and its second parameter is a
  row to add

## Descendants

To find every row below a node, match children whose parent is a row already found:

```csharp
var descendants = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Id == 1),
        recurse: (parent, child) => child.ParentId == parent.Id);
```

The results include the seed rows, e.g. subject `1` itself.

## Ancestors

To walk up the hierarchy, swap the relationship so the next row is the parent of a row already found:

<generated-sql>

```csharp
// The path from Epic Fantasy up to the root: Epic Fantasy, Fantasy, Fiction, Books
var ancestors = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Id == 4),
        recurse: (child, parent) => parent.Id == child.ParentId);
```

```sql
WITH RECURSIVE "cte" ("Id", "ParentId", "Name", "Active") AS (
  SELECT "Id", "ParentId", "Name", "Active"
  FROM "Subject"
  WHERE ("Id" = @0)
  UNION ALL
  SELECT "c"."Id", "c"."ParentId", "c"."Name", "c"."Active"
  FROM "Subject" "c" INNER JOIN "cte" ON ("c"."Id" = "cte"."ParentId")
)
SELECT "Id", "ParentId", "Name", "Active"
FROM "cte" "Subject"
-- @0 = 4
```

</generated-sql>

## Multiple roots

The seed can return multiple rows, e.g. every root of a forest:

```csharp
var everything = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.ParentId == null),
        recurse: (parent, child) => child.ParentId == parent.Id);
```

## Limiting how many levels are selected

`maxDepth` is how many levels of rows are added to the rows of the seed, which stops the query looking any further:

<generated-sql>

```csharp
// Books, its children and their children
var q = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Name == "Books"),
        recurse: (parent, child) => child.ParentId == parent.Id,
        maxDepth: 2);
```

```sql
WITH RECURSIVE "cte" ("Id", "ParentId", "Name", "Active", "cte_depth") AS (
  SELECT "Id", "ParentId", "Name", "Active", 0 AS "cte_depth"
  FROM "Subject"
  WHERE ("Name" = @0)
  UNION ALL
  SELECT "c"."Id", "c"."ParentId", "c"."Name", "c"."Active", "cte"."cte_depth" + 1
  FROM "Subject" "c" INNER JOIN "cte" ON ("c"."ParentId" = "cte"."Id")
  WHERE "cte"."cte_depth" < 2
)
SELECT "Id", "ParentId", "Name", "Active"
FROM "cte" "Subject"
-- @0 = 'Books'
```

</generated-sql>

| `maxDepth` | Rows |
|-|-|
| `0` | Only the rows of the seed |
| `1` | And their children |
| `2` | And their grandchildren |

It works in either direction, e.g. a subject with its parent and grandparent:

```csharp
var q = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Name == "Epic Fantasy"),
        recurse: (child, parent) => parent.Id == child.ParentId,
        maxDepth: 2);
```

## The level of each row

`Sql.RecursiveDepth()` is how many levels a row is from the rows of the seed, which are at `0`. Use it in the rest of
the query, e.g. to select it, sort by it or filter by it:

```csharp
public class SubjectLevel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Depth { get; set; }
}

// Fiction and everything under it, a level at a time
var q = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Name == "Fiction"),
        recurse: (parent, child) => child.ParentId == parent.Id)
    .OrderBy(x => Sql.RecursiveDepth())
    .ThenBy(x => x.Id)
    .Select(x => new { x.Id, x.Name, Depth = Sql.RecursiveDepth() });

List<SubjectLevel> levels = db.Select<SubjectLevel>(q);
```

| Name | Depth |
|-|-|
| Fiction | 0 |
| Fantasy | 1 |
| Science Fiction | 1 |
| Epic Fantasy | 2 |

```csharp
// Only the grandchildren of Books
var q = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Name == "Books"),
        recurse: (parent, child) => child.ParentId == parent.Id,
        maxDepth: 2)
    .Where(x => Sql.RecursiveDepth() == 2);
```

The depth is only added to the query when it's used.

## Data with loops

Rows are added until no more rows match, so a loop in the data, e.g. a subject that's its own ancestor, makes the
query recurse until the RDBMS stops it. Use `detectCycles` for data that can have loops, e.g. pages that link to each
other, which stops at rows that were already reached by the rows that lead to them:

```csharp
// Every page that can be reached from home
var q = db.From<Page>()
    .WithRecursive(
        seed: db.From<Page>().Where(x => x.Id == "home"),
        recurse: (page, next) => next.Id == page.LinksTo,
        detectCycles: true);
```

Each row is returned once for each path that leads to it, which is once in a hierarchy. It works by keeping the path
of Primary Keys that lead to each row, e.g. `/1/4/9/`, and not adding a row that's already in its path, so the Data
Model needs a Primary Key. It can be used with `maxDepth` and `Sql.RecursiveDepth()`.

::: info
`maxDepth` also stops a query with loops, without the cost of keeping each row's path, when you know how deep it
needs to look.
:::

## Filtering, ordering and projecting

The rest of the query applies to all the rows found, so typed `Where()`, `OrderBy()` and `Select()` work as usual:

```csharp
// Names of active subjects under Books, excluding Books itself
var q = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Id == 1),
        recurse: (parent, child) => child.ParentId == parent.Id)
    .Where(x => x.Active && x.Id != 1)
    .OrderBy(x => x.Name)
    .Select(x => x.Name);

List<string> names = db.Column<string>(q);
```

::: tip
Filters on the recursive query are applied after all rows are found. To stop walking at inactive subjects instead,
e.g. to exclude the children of an inactive subject, add the condition to `recurse`:
`(parent, child) => child.ParentId == parent.Id && child.Active`
:::

## Counting and paging

```csharp
SqlExpression<Subject> Descendants() => db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Name == "Non-Fiction"),
        recurse: (parent, child) => child.ParentId == parent.Id);

var total = db.Count(Descendants());
var any = db.Exists(Descendants());

var page = db.Select(Descendants().OrderBy(x => x.Id).Skip(20).Take(10));
```

[Keyset pagination](/ormlite/keyset-pagination) also works on the results:

```csharp
var next = db.Select(Descendants().OrderBy(x => x.Id).SeekAfter(lastRow).Take(10));
```

## Combining with other queries

A recursive query can be the first query of a [set operation](/ormlite/set-operations):

```csharp
// Fantasy subjects plus all root subjects
var q = db.From<Subject>()
    .WithRecursive(
        seed: db.From<Subject>().Where(x => x.Name == "Fantasy"),
        recurse: (parent, child) => child.ParentId == parent.Id)
    .Select(x => x.Name)
    .Union(db.From<Subject>().Where(x => x.ParentId == null).Select(x => x.Name));
```

## Async and streaming

```csharp
var subjects = await db.SelectAsync(q);
var count = await db.CountAsync(q);

await foreach (var subject in db.SelectLazyAsync(q))
{
    // ...
}
```

## Generated SQL

`WithRecursive()` generates a recursive CTE with the model's columns, then reads from it using the model's table name
as the alias, so the rest of the query is unchanged:

```sql
WITH RECURSIVE "cte" ("Id", "ParentId", "Name", "Active") AS (
SELECT "Id", "ParentId", "Name", "Active" FROM "Subject" WHERE ("Id" = @0)
UNION ALL
SELECT "c"."Id", "c"."ParentId", "c"."Name", "c"."Active" FROM "Subject" "c"
  INNER JOIN "cte" ON ("c"."ParentId" = "cte"."Id")
)
SELECT "Id", "ParentId", "Name", "Active" FROM "cte" "Subject"
WHERE ("Active" = @1)
ORDER BY "Name"
```

SQL Server and Oracle use `WITH` without the `RECURSIVE` keyword. Recursive CTEs are supported by SQLite, SQL Server,
PostgreSQL, MySQL 8+, MariaDB 10.2+, Oracle and Firebird.

Raw SQL statements that start with a CTE are also executed as-is:

```csharp
var roots = db.Select<Subject>("WITH roots AS (SELECT * FROM Subject WHERE ParentId IS NULL) SELECT * FROM roots");
```

## Things to be aware of

- **Cycles**: rows are added until no more rows match, so data with loops recurses until the RDBMS stops it, unless
  the query has `detectCycles` or a `maxDepth`. SQL Server stops after 100 levels by default
- **Deep hierarchies**: SQL Server's default limit of 100 levels applies to deep trees too, including a `maxDepth`
  over 100
- **Detecting cycles**: the path of each row is text, which MySQL and MariaDB limit to 1,000 characters. Primary Keys
  containing `%` or `_` can be mistaken for another key that's in the path
- **Indexes**: index the column used by `recurse`, e.g. `ParentId`, as it's queried once per level
- **Seed query**: the seed must select all columns of the model, which is the default. Its `OrderBy()` is ignored
- **Set operations**: a recursive query can only be the first query of a set operation
- **Other sub queries**: a query can only have one recursive CTE, which can be combined with
  [named sub queries](/ormlite/common-table-expressions)
