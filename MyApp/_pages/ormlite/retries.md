---
title: Retrying Temporary Errors
---

Some database errors don't mean anything is wrong with your query, only that the database couldn't run it at that
moment: a deadlock, a serialization failure, throttling by a cloud database, a failover or a dropped connection.
They would usually work if they were run again a moment later.

A `RetryPolicy` runs them again, so your App doesn't fail a request for an error that would have fixed itself:

```csharp
OrmLiteConfig.RetryPolicy = OrmLiteRetry.Exponential(maxRetries: 3);
```

There's nothing to change in your code. Statements are only run again when it's safe to, and the error is thrown as
before when it's not, or after the last retry. Statements aren't retried unless a `RetryPolicy` is set.

`OrmLiteConfig.RetryPolicy` is used by every database of your App that supports retries. SQLite doesn't, so an App
that starts with SQLite retries as soon as it moves to PostgreSQL, SQL Server or MySQL, without changing its
configuration.

### A policy for each database

A dialect's own `RetryPolicy` is used instead of the global one, e.g. to retry a database more often, or not at all
with `OrmLiteRetry.None`:

```csharp
services.AddOrmLite(options => options.UsePostgres(connectionString, dialect => {
    dialect.RetryPolicy = OrmLiteRetry.Exponential(maxRetries: 5);
}))
.AddSqlServer("reporting", reportingConnectionString, dialect => {
    dialect.RetryPolicy = OrmLiteRetry.None;
});
```

## What's retried

There are 2 kinds of temporary errors:

| Kind | Examples | What's run again |
|-|-|-|
| `NotApplied`: the database confirmed the statement wasn't applied | Deadlocks, serialization failures, throttling, connections that couldn't be made | Any statement |
| `MaybeApplied`: the connection was lost, so it's not known if the statement was applied | Network resets, failovers, a server that restarted | Reads (`SELECT` and `WITH` queries that don't write) |

Running an `INSERT` again after its connection was lost could insert it twice, as it may have been saved before the
connection was lost, so only reads are run again after a lost connection. A connection that was lost is opened again
before the statement is retried.

Opening a connection is also retried after either kind of error.

Some databases report an error after a query has started, when its first row is read, e.g. SQL Server reports a
deadlock or a division by zero while it sends a query's rows. A query whose first row fails with a temporary error is
run again, as none of its rows have been returned.

### Statements in a transaction

Statements in a transaction aren't retried. After a deadlock the database rolls back the whole transaction, so
running only the last statement again would lose the statements before it. Use `RunInTransaction` to run the whole
transaction again instead.

The APIs that write many rows, e.g. `InsertAll`, `UpdateAll`, `UpsertAll`, `SaveAll` and `DeleteByIds`, run in a
transaction of their own, which is run again as a whole, like `RunInTransaction`. New rows get the ids of the attempt
that was committed. When they're called in your own transaction, it's the one that's retried.

## Retry a whole transaction

`RunInTransaction` runs your code in a transaction, then commits it. If it fails with a temporary error, the
transaction is rolled back and your code is run again in a new transaction:

```csharp
db.RunInTransaction(() => {
    db.UpdateAdd(() => new Account { Balance = -amount }, x => x.Id == fromId);
    db.UpdateAdd(() => new Account { Balance = amount }, x => x.Id == toId);
});

var orderId = await db.RunInTransactionAsync(async () => {
    var id = await db.InsertAsync(order, selectIdentity: true);
    await db.UpdateAddAsync(() => new Product { Stock = -order.Quantity }, x => x.Id == order.ProductId);
    return id;
});
```

It takes an optional `IsolationLevel`, e.g. `IsolationLevel.Serializable`, whose serialization failures are retried.
A transaction that fails while it's being committed is only run again if the database confirmed it wasn't committed.
Without a `RetryPolicy`, or on SQLite, it runs your code in a transaction without retrying it. When the connection
is already in a transaction, your code is run in it, and the outer transaction is the one that's retried.

:::warning
Your code may run more than once. Its database changes are rolled back before it's run again, but anything else it
does isn't, e.g. sending an email, charging a card or calling another API. Do those after the transaction is
committed.
:::

## Configure

`OrmLiteRetry.Exponential()` waits twice as long after each retry, from `delay` up to `maxDelay`:

```csharp
OrmLiteConfig.RetryPolicy = OrmLiteRetry.Exponential(
    maxRetries: 3,                               // runs each statement up to 4 times
    delay: TimeSpan.FromMilliseconds(50),        // waits 50ms, 100ms, then 200ms (the defaults)
    maxDelay: TimeSpan.FromSeconds(2));
```

Each wait is a random 50-100% of the delay, so that requests that failed together don't retry together, which can be
turned off with `Jitter = false`.

Retries are logged at the `Debug` level. To log them yourself, or record them in metrics, use `OnRetry`:

```csharp
OrmLiteConfig.RetryPolicy = OrmLiteRetry.Exponential(maxRetries: 3)
    .OnRetry((ex, retry, delay) => log.LogWarning("Retry {Retry} in {Delay}ms: {Error}", 
        retry, delay.TotalMilliseconds, ex.Message));
```

### Retry other errors

Each dialect recognizes its driver's temporary errors. To retry other errors, use `Handle`. They're treated as
`MaybeApplied` by default, so only reads and whole transactions are run again:

```csharp
OrmLiteConfig.RetryPolicy = OrmLiteRetry.Exponential(maxRetries: 3)
    .Handle(ex => ex is SqlException { Number: -2 })             // also retry reads that timed out
    .Handle(ex => ex is MyThrottledException, TransientError.NotApplied);
```

Statements that time out aren't retried by default, as a query that was too slow is likely to be too slow again.

## Errors of each database

| Database | Not applied | Connection lost |
|-|-|-|
| PostgreSQL | `40001` serialization failure, `40P01` deadlock, `55P03` lock not available, `53300` too many connections, `57P03` can't connect now, `08001` / `08004` can't connect | `08000` / `08003` / `08006` connection errors, `57P01` / `57P02` server shut down, network errors |
| SQL Server | `1205` deadlock, `3960` snapshot update conflict, In-Memory OLTP conflicts, Azure SQL throttling, failovers and resource limits (`40501`, `40613`, `49918`-`49920`, `10928`, `10929`, `4060`, `4221`) | `40197`, `64`, `121`, `233`, `10053`, `10054`, `10060`, network errors |
| MySQL & MariaDB | `1213` deadlock, `1040` / `1203` too many connections, `1042` / `2002` / `2003` can't connect | `2006` server gone away, `2013` lost connection, `1053` server shutdown, `1927` connection killed, network errors |

The error numbers are in each dialect's `NotAppliedErrors` and `ConnectionLostErrors`, which you can add to, e.g:

```csharp
SqlServerOrmLiteDialectProvider.NotAppliedErrors.Add(1222); // lock request timeout
```

### SQLite isn't retried

SQLite ignores every `RetryPolicy`. Its drivers already wait for a lock to be released until the command times out,
and an embedded database doesn't lose its connection, so retrying would only make a request wait longer. A dialect
that doesn't retry returns `false` from `SupportsRetries`, which custom dialects can override.

SqlClient reconnects idle connections that were lost by itself (`ConnectRetryCount`), and has optional retry logic of
its own (`SqlRetryLogicBaseProvider`). Use either it or a `RetryPolicy`, as using both multiplies their retries.

## What isn't retried

- Statements in a transaction, see [Retry a whole transaction](#retry-a-whole-transaction)
- Errors while reading the rows of a query, after its first row has been read
- Queries run with OrmLite's Dapper APIs
