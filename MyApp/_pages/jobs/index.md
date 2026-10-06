---
title: Background Jobs
---

Background Jobs is ServiceStack's built-in solution for running work in the background and on a schedule,
durably, in the database you already use. Queue any of your existing APIs or [Commands](/commands) to run in
the background, retry them when they fail, run them on a schedule, and monitor and manage them all from the
built-in Admin UI - without deploying a message broker or any other infrastructure.

:::youtube 2Cza_a_rrjA
Durable Background Jobs and Scheduled Tasks for .NET 10 Apps
:::

It's designed for the work your App depends on: sending emails, charging payments, importing data,
generating reports, syncing tenants and calling third-party APIs.

```csharp
class MyServices(IBackgroundJobs jobs) : Service
{
    public object Any(PlaceOrder request)
    {
        // Send the confirmation email in the background, retrying if it fails
        var jobRef = jobs.EnqueueCommand<SendOrderConfirmationCommand>(new SendOrderConfirmation {
            OrderId = request.Id,
        }, new() {
            Queue = "emails",
            RetryLimit = 3,
        });
        //...
    }
}
```

<screenshot src="/img/pages/jobs/03-job-running.png" title="Monitor Jobs, their progress and logs in real-time from the Admin UI"></screenshot>

## Choose a provider

Background Jobs is available with two storage providers that share the same `IBackgroundJobs` APIs, data
models and Admin UI, so you can start with one and move to the other without changing how you queue Jobs.

| | [RDBMS Background Jobs](/jobs/rdbms) | [SQLite Background Jobs](/jobs/sqlite) |
| --- | --- | --- |
| Plugin | `DatabaseJobFeature` | `BackgroundsJobFeature` |
| Storage | Your App's PostgreSQL, SQL Server or MySQL database | Local SQLite database files |
| App Servers | Any number sharing the same database | A single App Server |
| Failover | Jobs of a failed server are recovered by another | - |
| Queue Jobs in your own transaction | ✓ | - |
| Job history | Monthly partitioned tables | Monthly database files |
| Install | `npx add-in db-jobs` | `npx add-in jobs` |

Use **RDBMS Background Jobs** when your App runs on more than one server, or you want your Jobs stored and
backed up with the rest of your data. Use **SQLite Background Jobs** for a single server App that wants Jobs
kept out of its main database with no setup at all.

## Documentation

### Getting started

 - **[RDBMS Background Jobs](/jobs/rdbms)** - Install and configure `DatabaseJobFeature`, scale out
   across App Servers, queue Jobs in your own transaction, and manage its partitioned history tables
 - **[SQLite Background Jobs](/jobs/sqlite)** - Install and configure `BackgroundsJobFeature`
   with its monthly SQLite databases

Both pages also cover the fundamentals shared by every App: queueing APIs and Commands, Job options, named
Workers, running Jobs as an authenticated user, and logging and progress updates. See
[Commands in Background Jobs](/jobs/commands) for implementing your Jobs as Commands.

### Guides

<jobs-guides></jobs-guides>

### Related

 - **[Commands](/commands)** - The Commands Feature reference for encapsulating units of logic into
   reusable, inspectable Commands, the recommended way to implement Background Jobs
 - **[Background MQ](/background-mq)** - A lightweight in-memory MQ for work that doesn't need to be durable
 - **[What's new in v10.3](/releases/v10_03)** - The major upgrade that added queues, batches, leases,
   rate limits and more, including how to upgrade existing Apps

## How a Job runs

Every Job moves through the same states, whichever provider you use. Queued Jobs are started by the
Workers of their queue, and retried, failed or cancelled depending on how they end:

<job-lifecycle></job-lifecycle>

## Feature overview

 - **No infrastructure** - runs in your existing RDBMS, or in local SQLite databases
 - **Execute existing APIs or Commands** - Commands are auto registered in the IOC
 - **Scale out** across App Servers with automatic failover (RDBMS)
 - **Queues** with their own concurrency, priorities and rate limits, controllable at runtime
 - **Workflows** of dependent Jobs, and **Batches** with live progress and completion callbacks
 - **Retries** with exponential backoff and jitter, and a history of every failed attempt
 - **Exactly-once patterns** with idempotent and singleton Jobs, concurrency keys and the
   transactional outbox (RDBMS)
 - **Results** that can be awaited, or delivered to a webhook or MQ when a Job completes
 - **Durable Recurring Tasks** with time zones, misfire and overlap policies
 - **Real-time Admin UI** to monitor, cancel, requeue and replay Jobs, and manage queues and schedules
 - **Observability** with health checks, OpenTelemetry traces and metrics, and Profiling
