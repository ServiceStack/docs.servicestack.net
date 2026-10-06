---
title: SQLite Background Jobs
---

ServiceStack.Jobs is our solution for queueing and managing background jobs and scheduled tasks in .NET 10 Apps. It's a easy to use library that seamlessly integrates into existing ServiceStack Apps with a built-in Management UI to provide real-time monitoring, inspection and management of background jobs.

:::youtube 2Cza_a_rrjA
Durable Background Jobs and Scheduled Tasks for .NET 10 Apps
:::

### Durable and Infrastructure-Free

Prior to Background Jobs we've been using [Background MQ](/background-mq) for executing
our background tasks which lets you queue any Request DTO to execute its API in a background worker.
It's been our preferred choice as it didn't require any infrastructure dependencies since its concurrent
queues are maintained in memory, this also meant they were non-durable that didn't survive across App restarts. 
Whilst [ServiceStack MQ](/messaging) enables an additional endpoint for your APIs our main use-case for using 
it was for executing background tasks which would be better suited by purpose-specific software 
designed for the task.

#### SQLite Persistence

It uses SQLite as the backing store for its durability since it's low latency, 
[fast disk persistence](https://www.sqlite.org/fasterthanfs.html) and embeddable file-based 
database makes it ideally suited for the task which allows creation of naturally partition-able 
and archivable monthly databases on-the-fly without any maintenance overhead or infrastructure 
dependencies making it easy to add to any .NET App without impacting or adding increased load to 
their existing configured databases.

SQLite Background Jobs runs on a single App Server. To process Jobs on multiple App Servers sharing the
same database, use [RDBMS Background Jobs](/jobs/rdbms) with PostgreSQL, SQL Server or MySQL,
which uses the same `IBackgroundJobs` APIs, Admin UI and data models.

### Queue APIs or Commands

For even greater reuse you're able to queue your existing ServiceStack APIs
as a Background Job in addition to [Commands](/commands) added in the 
[last v8.3 release](/releases/v8_03) for encapsulating units of logic
into internal invokable, inspectable and auto-retryable building blocks.

### Real Time Admin UI

The Background Jobs Admin UI provides a real time view into the status of all background jobs including 
their progress, logs, retries, batches and queues, with controls to cancel, requeue and replay Jobs and
pause queues. See [Monitoring & Operations](/jobs/monitoring#admin-ui) for a tour.

<screenshot src="/img/pages/jobs/03-job-running.png" title="A running Job streaming its progress and logs live"></screenshot>

### Feature Overview

 - No infrastructure dependencies
   - Monthly archivable rolling Databases with full Job Execution History
 - Execute existing APIs or versatile Commands
   - Commands auto registered in IOC
 - [Named queues](/jobs/queues) with their own concurrency, priorities and rate limits
   - Pause, resume and re-throttle queues at runtime
 - Serially execute jobs with the same named Worker, or per
   [concurrency key](/jobs/queues#concurrency-keys)
 - [Multi-step workflows](/jobs/workflows) with Jobs dependent on their parent Job
 - [Job Batches](/jobs/workflows#job-batches) with live progress and completion callbacks
 - [Await a Job's result](/jobs/workflows#await-a-jobs-result) or have it
   [delivered to a webhook or MQ](/jobs/workflows#deliver-results-to-replyto)
 - [Retries with exponential backoff and jitter](/jobs/reliability#retries-and-backoff), with every
   failed attempt recorded
 - [Idempotent](/jobs/reliability#idempotent-enqueue) and
   [singleton](/jobs/reliability#singleton-jobs) Jobs to prevent duplicate work
 - [Job expiry](/jobs/reliability#job-expiry), timeouts and cancellation
 - [Durable, time zone aware Recurring Tasks](/jobs/recurring-tasks)
 - Queue Jobs to be executed after a specified Date
 - Execute Jobs within the context of an Authenticated User
 - Maintain Status, Logs and Progress of Executing Jobs
 - Execute transitive (i.e. non-durable) jobs using named workers
 - [Health checks, OpenTelemetry and Profiling](/jobs/monitoring)
 - Attach optional `Tag`, `TenantId`, `CreatedBy` and `Args` metadata to Jobs

Please [let us know](https://servicestack.net/ideas) if there are any other missing features
you would love to see implemented.

## Install

As it's more versatile and better suited, we've replaced the usage of Background MQ with
ServiceStack.Jobs in all **.NET 10 Identity Auth Templates** for sending Identity Auth Confirmation 
Emails when SMTP is enabled. So the easiest way to get started with ServiceStack.Jobs is to 
[create a new Identity Auth Project](https://servicestack.net/start), e.g:

:::sh
npx create-net blazor-vue MyApp
:::

### Exiting .NET 10 Templates

Existing .NET 10 Projects can configure their app to use **ServiceStack.Jobs** by mixing in:

:::sh
npx add-in jobs
:::

Which adds the `Configure.BackgroundJobs.cs` [Modular Startup](https://docs.servicestack.net/modular-startup)
configuration and a **ServiceStack.Jobs** NuGet package reference to your project.

## Usage

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
and track execution of a job.

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
want to either [Restrict access](/auth/restricting-services) or [limit usage to specified users](/auth/identity-auth#declarative-validation-attributes).

In both cases the `SendEmail` Request is persisted into the Jobs SQLite database for durability 
that gets updated as it progresses through the queue.

For execution the API or command is resolved from the IOC before being invoked with the Request.
APIs are executed via the [MQ Request Pipeline](/order-of-operations)
and commands executed using the [Commands Feature](/commands) where
it will be also visible in the [Commands Admin UI](/commands#command-admin-ui).

### Configuration

The main `BackgroundsJobFeature` options:

| Option | Default | Description |
| --- | --- | --- |
| `DbDir` | `App_Data/jobs` | Directory for the Jobs databases |
| `DbFile` | `jobs.db` | Database for queued Jobs, their history and Scheduled Tasks |
| `DbMonthFile` | `jobs_{yyyy}-{MM}.db` | Monthly database for the Completed and Failed Jobs archive |
| `MaxConcurrentJobs` | CPU cores | Jobs each queue runs at once |
| `QueueConcurrency` | | Per-queue concurrency overrides |
| `DefaultRetryLimit` | `2` | Retries after a failed attempt |
| `DefaultRetryBackoff` | `ExponentialJitter` | How retry delays grow |
| `DefaultRetryDelayMs` | `5000` | Delay before the first retry |
| `DefaultMaxRetryDelayMs` | `300000` | Longest delay between retries |
| `DefaultTimeoutSecs` | `600` | How long a Job can run before it's cancelled |
| `ShutdownTimeoutSecs` | `30` | How long running Jobs have to finish on shutdown |
| `MaxRequestBodyChars` | `1000000` | Largest Request a Job can be queued with |
| `MaxResponseBodyChars` | `1000000` | Largest Response that's stored |
| `MaxJobLogChars` | `100000` | Largest log kept for a Job |
| `JobSummaryRetention` | off | Delete the history of finished Jobs older than this |
| `ArchiveRetention` | off | Delete monthly archive databases older than this |
| `ValidateReplyTo` | | [Restrict where results are sent](/jobs/workflows#restrict-where-results-are-sent) |
| `OnJobReplyTo` | | [Customize how results are delivered](/jobs/workflows#customize-delivery) |

### Upgrading from v10.2

v10.3 upgrades the Background Jobs schema on startup, and clears Jobs that are still queued or running when
the upgrade is applied. See [Upgrading to v10.3](/releases/v10_03#upgrading-to-v103) for what changes and
how to prepare.

::include jobs-shared.md::
