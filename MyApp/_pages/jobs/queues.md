---
title: Queues, Priorities & Rate Limits
---

Different work has different needs: a password reset can't wait behind a bulk import, and a third-party
API can't be called faster than its quota allows. Background Jobs lets you run each class of work in its
own **queue**, control how much of it runs at once, and change those limits while your App is running.

:::youtube PYsdzX_A-ic
.NET Background Jobs: Per-Tenant Ordering, Queues, Rate Limits, Workflows & Batches
:::

Everything on this page works the same with [RDBMS](/jobs/rdbms) and
[SQLite](/jobs/sqlite) Background Jobs.

## Queues

Every Job runs on a queue, which is `default` unless you specify one:

```csharp
jobs.EnqueueCommand<SendPasswordResetCommand>(request, new() {
    Queue = "emails",
});

jobs.EnqueueCommand<ImportProductsCommand>(import, new() {
    Queue = "imports",
});
```

Each queue has its own Workers, so a backlog on one queue never delays the Jobs on another.

### Queue concurrency

`MaxConcurrentJobs` sets how many Jobs each queue runs at once, defaulting to the number of CPU cores.
Use `QueueConcurrency` to give individual queues a different limit:

```csharp
services.AddPlugin(new DatabaseJobFeature {     // or BackgroundsJobFeature
    MaxConcurrentJobs = 8,                      // every queue not listed below
    QueueConcurrency = {
        ["imports"] = 2,                        // bulk imports can't take over the server
        ["emails"] = 4,
    },
});
```

Queues that aren't listed in `QueueConcurrency` use `MaxConcurrentJobs`, so adding a new queue never
quietly limits it to one Job at a time.

<queue-lanes></queue-lanes>

### Priorities

Within a queue, Jobs with a higher `Priority` are started first. Jobs have a priority of `0` unless you
specify one:

```csharp
jobs.EnqueueCommand<SendEmailCommand>(passwordReset, new() {
    Queue = "emails",
    Priority = 10,  // ahead of the newsletter
});
```

### Named Workers

A named `Worker` runs its Jobs **one at a time**, in the order they were queued, which is useful when work
must never overlap, e.g. sending emails through an SMTP connection:

```csharp
jobs.EnqueueCommand<SendEmailCommand>(email, new() { Worker = "smtp" });
```

Use queues when you want to limit how much of a type of work runs at once, and named Workers when a
fixed set of work must run strictly one at a time. To keep Jobs in order for each customer or tenant,
use a [Concurrency Key](#concurrency-keys) instead.

## Control queues at runtime

Queue settings can be changed while your App is running, from code or the
[Admin UI](/jobs/monitoring#queues). Changes are stored in the `JobQueue` table so they take
effect on every server, and survive restarts.

<screenshot src="/img/pages/jobs/04-queues.png" title="Pause, resume, concurrency and rate limit controls for each queue"></screenshot>

### Pause and resume

When a downstream system is unavailable, pause its queue. Its Jobs stay queued and resume where they left
off, instead of burning through their retries:

```csharp
jobs.PauseJobQueue("payments");

// Once the payment provider has recovered
jobs.ResumeJobQueue("payments");
```

### Change concurrency

Raise a queue's concurrency to clear a backlog, or lower it to take pressure off a struggling dependency,
without a redeploy:

```csharp
jobs.SetJobQueueConcurrency("imports", 4);
```

### Queue status

`GetJobQueues()` returns the runtime settings of every queue, and `GetJobsStatus()` a point-in-time view of
the backlog:

```csharp
foreach (var queue in jobs.GetJobQueues())
{
    // queue.Concurrency is only set when overridden at runtime
    Console.WriteLine($"{queue.Name} paused:{queue.Paused} concurrency:{jobs.GetQueueConcurrency(queue.Name)}");
}

var status = jobs.AssertQueues().GetJobsStatus();
Console.WriteLine($"{status.Queued} queued, {status.Running} running, oldest waiting {status.OldestQueued}");
```

The [Admin UI](/jobs/monitoring#queues) also shows each queue's backlog, running Jobs and how long
its oldest Job has been waiting.

## Rate limits

Concurrency limits how many Jobs run at once, but a quota like "10 calls per second" limits how often Jobs
**start** - a fast Job running one at a time can still exceed it. Rate limits cap how many Jobs a queue may
start within a time window:

```csharp
// At most 10 Jobs start per second
jobs.SetJobQueueRateLimit("stripe-api", rateLimit: 10, window: TimeSpan.FromSeconds(1));

// Remove the limit
jobs.SetJobQueueRateLimit("stripe-api", rateLimit: 0);
```

Jobs over the limit wait in the queue until the next window. With RDBMS Background Jobs the count is kept
in the database, so the limit applies across **every** server rather than to each one - adding servers
doesn't multiply your API bill.

## Concurrency keys

Jobs that share a `ConcurrencyKey` run **one at a time**, while Jobs with different keys still run in
parallel. This keeps each tenant's syncs, each account's ledger updates or each document's edits in order,
without making everyone else wait behind them:

```csharp
jobs.EnqueueCommand<SyncTenantDataCommand>(sync, new() {
    ConcurrencyKey = $"tenant:{sync.TenantId}",
    TenantId = sync.TenantId,
});
```

Unlike a named Worker, which only covers a fixed set of names, a concurrency key can be anything - one per
customer, order or document.

<tenant-ordering></tenant-ordering>

Keys are held in the `JobConcurrencyLock` table, whose primary key is the concurrency key, so two servers
can't both run a Job with the same key. Each lock expires, so a server that stops can't hold a key forever.

:::info
A `ConcurrencyKey` queues Jobs to run one after another. To stop a second Job being queued at all while
one is active, use a [Singleton Job](/jobs/reliability#singleton-jobs) instead.
:::

## Dedicate servers to queues

With RDBMS Background Jobs, each App Server processes every queue by default. Use `Queues` to restrict a
server to specific queues, e.g. to only run GPU work on the servers that have one:

```csharp
services.AddPlugin(new DatabaseJobFeature {
    Queues = ["gpu"], // this server only processes Jobs on the gpu queue
});
```

Each server also only claims its queue's concurrency plus `MaxPrefetchJobs` (default 100) Jobs ahead of its
Workers, so one server can't hoard a backlog that others could be running.
