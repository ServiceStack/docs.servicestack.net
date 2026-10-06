---
title: Locking Rows
---

`ForUpdate()` locks the rows a query selects until the end of the current transaction, so no other transaction can
update, delete or lock them in between reading and updating them:

<generated-sql db="SQL Server">

```csharp
using var trans = db.OpenTransaction();

var account = db.Single(db.From<Account>().Where(x => x.Id == id).ForUpdate());
account.Balance -= amount;
db.Update(account);

trans.Commit();
```

```sql
SELECT "Id", "Balance"
FROM "Account" WITH (UPDLOCK, ROWLOCK)
WHERE ("Id" = @0)
-- @0 = 1

UPDATE "Account" SET "Balance"=@Balance WHERE "Id"=@Id
-- @Balance = 75, @Id = 1
```

</generated-sql>

`ForUpdate(skipLocked: true)` skips rows that are already locked instead of waiting for them, which lets multiple
workers take different items from the same queue table:

<generated-sql db="SQL Server">

```csharp
var jobs = db.Select(db.From<Job>()
    .Where(x => x.Status == "Queued")
    .OrderBy(x => x.Id)
    .Take(10)
    .ForUpdate(skipLocked: true));
```

```sql
SELECT TOP 10 "Id", "Status"
FROM "Job" WITH (UPDLOCK, ROWLOCK, READPAST)
WHERE ("Status" = @0)
ORDER BY "Id"
-- @0 = 'Queued'
```

</generated-sql>

## Preventing lost updates

Without locking, two requests that read and then update the same row can overwrite each other's changes:

1. Request A reads a balance of 100
2. Request B reads a balance of 100
3. Request A adds 10 and saves 110
4. Request B adds 10 and saves 110, losing A's deposit

With `ForUpdate()`, request B's read waits until request A's transaction ends, then reads the updated balance:

<generated-sql db="SQL Server">

```csharp
using (var trans = db.OpenTransaction())
{
    var account = db.Single(db.From<Account>().Where(x => x.Id == id).ForUpdate());
    account.Balance += 10;
    db.Update(account);
    trans.Commit(); // releases the lock, other requests now read 110
}
```

```sql
SELECT "Id", "Balance"
FROM "Account" WITH (UPDLOCK, ROWLOCK)
WHERE ("Id" = @0)
-- @0 = 1

UPDATE "Account" SET "Balance"=@Balance WHERE "Id"=@Id
-- @Balance = 110, @Id = 1
```

</generated-sql>

Locks are held until the transaction is committed or rolled back, so keep these transactions short. Outside a
transaction the lock is released as soon as the query completes, so `ForUpdate()` should always be used inside one.

::: tip
[Optimistic concurrency](/ormlite/optimistic-concurrency) with `[RowVersion]` is an alternative that doesn't hold
locks: the update fails with an `OptimisticConcurrencyException` if the row was changed since it was read, and the
application retries or reports the conflict. `ForUpdate()` is a better fit when conflicts are frequent, e.g. counters,
balances and stock levels, as requests wait their turn instead of failing.
:::

## Work queues

Multiple workers can take work from the same table without taking the same items. Each worker locks the next queued
items, skipping any items locked by other workers, and marks them as being processed:

```csharp
using var trans = db.OpenTransaction();

var jobs = db.Select(db.From<Job>()
    .Where(x => x.Queue == "emails" && x.Status == "Queued")
    .OrderBy(x => x.Id)
    .Take(10)
    .ForUpdate(skipLocked: true));

foreach (var job in jobs)
{
    db.UpdateOnly(() => new Job { Status = "Processing", ClaimedBy = workerId },
        where: x => x.Id == job.Id);
}

trans.Commit();
```

Workers don't wait for each other, and each queued item is only taken by one worker. After the transaction commits,
the items are no longer `Queued` so they won't be selected again.

::: info
Update each locked row by its primary key as above. SQL Server may scan the table for other conditions, like
`Id IN (...)` on small tables, which waits on rows locked by other workers.
:::

Compared to taking items with [DeleteReturning()](/ormlite/returning#taking-items-from-a-queue), this keeps the items
in the table while they're processed, so they can be retried if a worker fails.

## Queries with joins

Only rows of the query's table are locked where supported:

```csharp
// Lock the orders of a customer, the Customer row isn't locked
var orders = db.Select(db.From<Order>()
    .Join<Customer>((o, c) => o.CustomerId == c.Id)
    .Where<Customer>(c => c.Email == email)
    .ForUpdate());
```

PostgreSQL uses `FOR UPDATE OF` the query's table and SQL Server adds the lock hint to the query's table only. MySQL,
MariaDB and Oracle lock the selected rows of all joined tables.

## Async

```csharp
var account = await db.SingleAsync(db.From<Account>().Where(x => x.Id == id).ForUpdate());
var jobs = await db.SelectAsync(db.From<Job>().Where(x => x.Status == "Queued").Take(10).ForUpdate(skipLocked: true));
```

## RDBMS support

| RDBMS | `ForUpdate()` | `ForUpdate(skipLocked: true)` |
|-|-|-|
| PostgreSQL | `FOR UPDATE` | `FOR UPDATE SKIP LOCKED` |
| SQL Server | `WITH (UPDLOCK, ROWLOCK)` | `WITH (UPDLOCK, ROWLOCK, READPAST)` |
| MySQL 8+, MariaDB 10.6+ | `FOR UPDATE` | `FOR UPDATE SKIP LOCKED` |
| Oracle | `FOR UPDATE` | `FOR UPDATE SKIP LOCKED` |
| Firebird | `FOR UPDATE WITH LOCK` | `FOR UPDATE WITH LOCK SKIP LOCKED` (Firebird 5+) |
| SQLite | Ignored | Ignored |

SQLite only has database-level locks, so `ForUpdate()` is ignored, which lets the same code run on SQLite, e.g. in
development and tests. As rows aren't locked, concurrent SQLite transactions using `skipLocked` can select the same
rows.

`ForUpdate()` can't be combined with set operations like `Union()`, `WithRecursive()` queries or queries of a
[system-versioned table's](/ormlite/system-versioned-tables) previous versions like `AsOf()`, which throw a
`NotSupportedException`. PostgreSQL also rejects locks on queries with `DISTINCT`, `GROUP BY` or aggregates.
