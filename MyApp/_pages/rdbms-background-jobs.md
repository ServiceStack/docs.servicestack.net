---
title: RDBMS Background Jobs
---

The **DatabaseJobFeature** is a new implementation purpose built for **PostgreSQL**, **SQL Server** and **MySQL** 
backends that's a drop-in replacement for [SQLite's BackgroundsJobFeature](/background-jobs) which can be applied to an existing .NET 8+ project by [mixing in](/mix-tool) the **db-identity** or **db-jobs** gist files to your host project.

### Install

For [ServiceStack ASP.NET Identity Auth](https://servicestack.net/start) Projects:

:::sh
npx add-in db-identity
:::

Which replaces `Configure.BackgroundJobs.cs` and `Configure.RequestLogs.cs` with an equivalent
version that uses the `DatabaseJobFeature` for sending Application Emails and `DbRequestLogger` 
for API Request Logging.

All other .NET 8+ ServiceStack Apps should instead use:

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

## RDBMS Optimizations

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

### Separate Jobs Database

Or if preferred, you can maintain background jobs in a **separate database** from your main application database. 
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

### Real Time Admin UI

The Jobs Admin UI provides a real time view into the status of all background jobs including their progress, completion times, 
Executed, Failed, and Cancelled Jobs, etc. which is useful for monitoring and debugging purposes.

[![](/img/pages/jobs/jobs-dashboard.webp)](/img/pages/jobs/jobs-dashboard.webp)

View Real-time progress of queued Jobs

[![](/img/pages/jobs/jobs-queue.webp)](/img/pages/jobs/jobs-queue.webp)

View real-time progress logs of executing Jobs

[![](/img/pages/jobs/jobs-logs.webp)](/img/pages/jobs/jobs-logs.webp)

View Job Summary and Monthly Databases of Completed and Failed Jobs

[![](/img/pages/jobs/jobs-completed.webp)](/img/pages/jobs/jobs-completed.webp)

View full state and execution history of each Job

[![](/img/pages/jobs/jobs-failed.webp)](/img/pages/jobs/jobs-failed.webp)

Cancel Running jobs and Requeue failed jobs

## Usage

For even greater reuse of your APIs you're able to queue your existing ServiceStack Request DTOs
as a Background Job in addition to [Commands](/commands) 
for encapsulating units of logic into internal invokable, inspectable and auto-retryable building blocks.

### Queue Commands

Any API, Controller or Minimal API can execute jobs with the `IBackgroundJobs` dependency, e.g.
here's how you can run a background job to send a new email when an API is called in
any new Identity Auth template:

```csharp
class MyService(IBackgroundJobs jobs) : Service 
{
    public object Any(MyOrder request)
    {
        var jobRef = jobs.EnqueueCommand<SendEmailCommand>(new SendEmail {
            To = "my@email.com",
            Subject = $"Received New Order {request.Id}",
            BodyText = $"""
                       Order Details:
                       {request.OrderDetails.DumptTable()}
                       """,
        });
        //...
    }
}
```

Which records and immediately executes a worker to execute the `SendEmailCommand` with the specified
`SendEmail` Request argument. It also returns a reference to a Job which can be used later to query
and track the execution of a job.

### Queue APIs

Alternatively a `SendEmail` API could be executed with just the Request DTO:

```csharp
var jobRef = jobs.EnqueueApi(new SendEmail {
    To = "my@email.com",
    Subject = $"Received New Order {request.Id}",
    BodyText = $"""
               Order Details:
               {request.OrderDetails.DumptTable()}
               """,
});
```

Although Sending Emails is typically not an API you want to make externally available and would
want to [Restrict access](/auth/restricting-services) or [limit usage to specified users](/auth/identity-auth#declarative-validation-attributes).

In both cases the `SendEmail` Request is persisted into the Jobs SQLite database for durability
that gets updated as it progresses through the queue.

For execution the API or command is resolved from the IOC before being invoked with the Request.
APIs are executed via the [MQ Request Pipeline](/order-of-operations)
and commands executed using the [Commands Feature](/commands) where
they'll also be visible in the [Commands Admin UI](/commands#command-admin-ui).

### Feature Overview

It packs most features needed in a Background Jobs solution including:

- Use your App's existing RDBMS (no other infrastructure dependencies)
- Execute existing APIs or versatile Commands
    - Commands auto registered in IOC
- Scheduled Reoccurring Tasks
    - Track Last Job Run
- Serially execute jobs with the same named Worker
- Queue Jobs dependent on successful completion of parent Job
- Queue Jobs to be executed after a specified Date
- Execute Jobs within the context of an Authenticated User
- Auto retry failed jobs on a default or per-job limit
- Timeout Jobs on a default or per-job limit
- Cancellable Jobs
- Requeue Failed Jobs
- Execute custom callbacks on successful execution of Job
- Maintain Status, Logs, and Progress of Executing Jobs
- Execute transitive (i.e. non-durable) jobs using named workers
- Attach optional `Tag`, `BatchId`, `CreatedBy`, `ReplyTo` and `Args` with Jobs

::include jobs-shared.md::

::include command-types.md::
