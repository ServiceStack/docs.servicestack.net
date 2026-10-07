---
title: RDBMS Background Jobs
---

The **DatabaseJobFeature** is a new implementation purpose built for **PostgreSQL**, **SQL Server** and **MySQL** 
backends that's a drop-in replacement for [SQLite's BackgroundsJobFeature](/jobs/sqlite) which can be applied to an existing .NET 10+ project by [mixing in](/mix-tool) the **db-identity** or **db-jobs** gist files to your host project.

It runs your Jobs in the database you already operate, with no broker or other infrastructure to deploy,
and safely scales out across any number of App Servers sharing the same database:

 - **[Scale out across App Servers](#scale-out-across-app-servers)** - every Job is owned by one server at a
   time, and recovered automatically when a server fails
 - **[Queue Jobs in your own transaction](#queue-jobs-in-your-own-transaction)** - Jobs are only queued if
   the work that queued them commits
 - **[Using Background Jobs](/jobs/usage)** - queue APIs and Commands, Job options, logging,
   progress and cancellation
 - **[Queues, priorities & rate limits](/jobs/queues)** - run each class of work in its own lane,
   and control it at runtime from any server
 - **[Workflows, batches & results](/jobs/workflows)** - multi-step workflows, batches with live
   progress, and results awaited or delivered to a webhook
 - **[Retries & reliability](/jobs/reliability)** - backoff with jitter, failed attempt history,
   expiry, and preventing duplicate work
 - **[Monitoring & operations](/jobs/monitoring)** - Admin UI, health checks and OpenTelemetry

:::youtube EYycrGqDyJk
.NET Background Jobs That Survive Crashes, Deploys & Retries
:::

## Install

For [ServiceStack ASP.NET Identity Auth](https://servicestack.net/start) Projects:

:::sh
npx add-in db-identity
:::

Which replaces `Configure.BackgroundJobs.cs` and `Configure.RequestLogs.cs` with an equivalent
version that uses the `DatabaseJobFeature` for sending Application Emails and `DbRequestLogger` 
for API Request Logging.

All other .NET 10+ ServiceStack Apps should instead use:

:::sh
npx add-in db-jobs
:::

Which replaces `Configure.BackgroundJobs.cs` to use `DatabaseJobFeature`:

```csharp
public class ConfigureBackgroundJobs : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            services.AddPlugin(new CommandsFeature());
            services.AddPlugin(new DatabaseJobFeature {
                // NamedConnection = "<alternative db>"
            });
            services.AddHostedService<JobsHostedService>();
         }).ConfigureAppHost(afterAppHostInit: appHost => {
            var services = appHost.GetApplicationServices();
            var jobs = services.GetRequiredService<IBackgroundJobs>();
            // Example of registering a Recurring Job to run Every Hour
            //jobs.RecurringCommand<MyCommand>(Schedule.Hourly);
        });
}

public class JobsHostedService(ILogger<JobsHostedService> log, IBackgroundJobs jobs) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await jobs.StartAsync(stoppingToken);
        
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(3));
        while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
        {
            await jobs.TickAsync();
        }
    }
}
```

`DatabaseJobFeature` reuses the same `IBackgroundJobs` interface, Data Models, and API Service Contracts 
which greatly simplifies any migration efforts from SQLite's **ServiceStack.Jobs** implementation.

By implementing the same API Service Contracts (i.e. Request/Response DTOs) it's also able to reuse the same 
[built-in](/auto-ui) Management UI to provide real-time monitoring, inspection and management of background jobs:

:::youtube 2Cza_a_rrjA
Durable C# Background Jobs and Scheduled Tasks for .NET
:::

## Scale out across App Servers

Any number of App Servers can process Jobs from the same PostgreSQL, SQL Server or MySQL database.
Each server claims Jobs in batches, and every claimed Job is **leased** to the server that claimed it:

 - **One owner at a time.** A Job can only be claimed by one server, and every write a server makes to a
   Job - its progress, completion, retry or failure - is fenced by its lease. A slow or partitioned server
   can't overwrite the result of the server that took over from it.
 - **Heartbeats keep long Jobs alive.** A server renews the leases of the Jobs it's running, so a
   long-running Job isn't mistaken for an abandoned one.
 - **Automatic recovery.** When a server crashes, is killed or loses its network, its leases expire and
   another server recovers its Jobs. A server that loses a lease - to a cancellation or to another server
   recovering the Job - cancels its local execution.
 - **Poison Jobs are failed, not retried forever.** A Job abandoned mid-execution counts as a failed attempt,
   and fails with the `LeaseExpired` error code once it exceeds its `RetryLimit`.
 - **Claiming scales with your servers.** On PostgreSQL and MySQL 8+, Jobs are claimed with `SKIP LOCKED`,
   so competing servers claim different Jobs instead of contending for the same rows.

```csharp
services.AddPlugin(new DatabaseJobFeature {
    LeaseDurationSecs = 60,     // how long a claim lasts before another server can recover it
    ClaimBatchSize = 100,       // Jobs claimed per query
    MaxPrefetchJobs = 100,      // Jobs claimed ahead of a queue's Workers
});
```

<cluster-simulator></cluster-simulator>

### Deploy without losing work

When a server shuts down, its running Jobs are given `ShutdownTimeoutSecs` (default 30s) to finish. Jobs it
had claimed but not started, and Jobs still running when the timeout runs out, are released immediately so
another server picks them up, instead of waiting for their leases to expire on every deploy.

### Know which servers are doing what

Each server records a heartbeat, so you can see which servers are alive, what they're running and which
stopped reporting, and **drain** a server before taking it out of service. See
[App Servers](/jobs/monitoring#app-servers).

<screenshot src="/img/pages/jobs/05-nodes.png" title="App Servers processing Jobs, with their heartbeat, running Jobs and Drain control"></screenshot>

### Dedicate servers to queues

Use `Queues` to restrict a server to specific [queues](/jobs/queues), e.g. only running GPU work
on the servers that have one:

```csharp
services.AddPlugin(new DatabaseJobFeature {
    Queues = ["gpu"],
});
```

## Queue Jobs in your own transaction

Pass your own `IDbConnection` to `EnqueueCommand` or `EnqueueApi` to queue a Job in the same database
transaction as your data. The Job is only queued if your transaction commits, so an order and the email
confirming it can't disagree - also known as the **transactional outbox** pattern:

```csharp
public object Post(PlaceOrder request)
{
    using var db = Db;
    using var trans = db.OpenTransaction();

    var orderId = db.Insert(request.ConvertTo<Order>(), selectIdentity: true);

    jobs.EnqueueCommand<SendOrderConfirmationCommand>(db, new SendOrderConfirmation {
        OrderId = orderId,
    });

    trans.Commit(); // Rolling back also removes the Job
    return new PlaceOrderResponse { Id = orderId };
}
```

The Jobs tables need to be in the same database as your data, so this isn't available when Jobs use a
[separate database](#separate-jobs-database). Jobs queued this way are picked up on the next tick rather than
immediately, since they can't run before your transaction has committed.

## Job History Storage

A key benefit of using SQLite for Background Jobs was the ability to easily maintain completed and failed job history in 
separate **monthly databases**. This approach prevented the main application database from growing unbounded by archiving 
historical job data into isolated monthly SQLite database files (e.g., `jobs_2025-01.db`, `jobs_2025-02.db`). 
These monthly databases could be easily backed up, archived to cold storage, or deleted after a retention period, 
providing a simple yet effective data lifecycle management strategy.

For the new **DatabaseJobFeature** supporting PostgreSQL, SQL Server, and MySQL, we've replicated this monthly 
partitioning strategy using **monthly partitioned SQL tables** for the `CompletedJob` and `FailedJob` archive tables.

### PostgreSQL - Native Table Partitioning

PostgreSQL provides native support for table partitioning, allowing us to automatically create monthly partitions using 
`PARTITION BY RANGE` on the `CreatedDate` column. The `DatabaseJobFeature` automatically creates new monthly partitions 
as needed, maintaining the same logical separation as SQLite's monthly .db's while keeping everything within a single 
Postgres DB:

```sql
CREATE TABLE CompletedJob (
    -- columns...
    CreatedDate TIMESTAMP NOT NULL,
    PRIMARY KEY ("Id","CreatedDate")
) PARTITION BY RANGE ("CreatedDate");

-- Monthly partitions are automatically created, e.g.:
CREATE TABLE CompletedJob_2025_01 PARTITION OF CompletedJob
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

This provides excellent query performance since PostgreSQL can use partition pruning to only scan relevant monthly partitions 
when filtering by `CreatedDate`.

### SQLServer / MySQL - Manual Partition Management

For **SQL Server** and **MySQL**, monthly partitioned tables need to be created **out-of-band** 
(either manually or via cronjob scripts) since they don't support the same level of automatic 
partition management as PostgreSQL. However, this still works well in practice as it uses:

1. **Write-Only Tables** - The `CompletedJob` and `FailedJob` tables are write-only append tables. Jobs are never updated after completion or failure, only inserted.

2. **CreatedDate Index** - All queries against these tables use the `CreatedDate` indexed column for filtering and sorting, ensuring efficient access patterns even as the tables grow.

The indexed `CreatedDate` column ensures that queries remain performant regardless of table size, and the write-only 
nature means there's no complex update logic to manage across partitions.

This approach maintains the same benefits as SQLite's monthly databases - easy archival, manageable table sizes,
and efficient queries - while leveraging the scalability and features of enterprise RDBMS systems.

## Separate Jobs Database

If preferred, you can maintain background jobs in a **separate database** from your main application database. 
This separation keeps the write-heavy job processing load off your primary database, allowing you to optimize 
each database independently for its specific workload patterns like maintaining different backup strategies
for your critical application data vs. job history. 

```csharp
// Configure.Db.cs
services.AddOrmLite(options => options.UsePostgres(connectionString))
        .AddPostgres("jobs", jobsConnectionString);

// Configure.BackgroundJobs.cs
services.AddPlugin(new DatabaseJobFeature {
    NamedConnection = "jobs"
});
```

## Configuration

The main `DatabaseJobFeature` options:

| Option | Default | Description |
| --- | --- | --- |
| `NamedConnection` | | Use a [separate database](#separate-jobs-database) for Jobs |
| `MaxConcurrentJobs` | CPU cores | Jobs each queue runs at once |
| `QueueConcurrency` | | Per-queue concurrency overrides |
| `Queues` | all | Queues this server processes |
| `DefaultRetryLimit` | `2` | Retries after a failed attempt |
| `DefaultRetryBackoff` | `ExponentialJitter` | How retry delays grow |
| `DefaultRetryDelayMs` | `5000` | Delay before the first retry |
| `DefaultMaxRetryDelayMs` | `300000` | Longest delay between retries |
| `DefaultTimeoutSecs` | `600` | How long a Job can run before it's cancelled |
| `LeaseDurationSecs` | `60` | How long a claim lasts before another server can recover the Job |
| `ClaimBatchSize` | `100` | Jobs claimed per query |
| `MaxPrefetchJobs` | `100` | Jobs claimed ahead of a queue's Workers |
| `ShutdownTimeoutSecs` | `30` | How long running Jobs have to finish on shutdown |
| `NodeHeartbeatSecs` | `15` | How often a server records its heartbeat |
| `MaxRequestBodyChars` | `1000000` | Largest Request a Job can be queued with |
| `MaxResponseBodyChars` | `1000000` | Largest Response that's stored |
| `MaxJobLogChars` | `100000` | Largest log kept for a Job |
| `JobSummaryRetention` | off | Delete the history of finished Jobs older than this |
| `ArchiveRetention` | off | Drop monthly `CompletedJob` and `FailedJob` archives older than this |
| `ValidateReplyTo` | | [Restrict where results are sent](/jobs/workflows#restrict-where-results-are-sent) |
| `OnJobReplyTo` | | [Customize how results are delivered](/jobs/workflows#customize-delivery) |

## Upgrading from v10.2

v10.3 upgrades the Background Jobs schema on startup, and clears Jobs that are still queued or running when
the upgrade is applied. If you run multiple App Servers, stop all of them before starting the new version,
rather than doing a rolling deploy. See [Upgrading to v10.3](/releases/v10_03#upgrading-to-v103) for what
changes and how to prepare.

## Next steps

See [Using Background Jobs](/jobs/usage) for queueing your APIs and Commands, all the options
available when queueing Jobs, and logging, progress and cancellation from inside a running Job.
