---
title: Monitoring & Operations
---

Background Jobs gives you several ways to see what your Jobs are doing: a built-in Admin UI for day-to-day
operations, ASP.NET health checks for your load balancer and alerting, and OpenTelemetry traces and metrics
for your existing observability stack.

Everything on this page works with both [RDBMS](/jobs/rdbms) and [SQLite](/jobs/sqlite)
Background Jobs.

<observability-pillars></observability-pillars>

## Admin UI

Open **Background Jobs** in the [Admin UI](/admin-ui) to monitor and manage your Jobs in real-time.

### Dashboard

The Dashboard summarizes the Jobs that ran over a period, broken down by Command, API, Worker and Queue,
along with how long Jobs waited to start. A backlog building up shows in the wait times before Jobs start
timing out.

<screenshot src="/img/pages/jobs/01-dashboard.png" title="Job activity and statistics over a selected period"></screenshot>

### Queue

The **Queue** tab lists the Jobs that are queued or running, with the progress of running Jobs. Use its
toolbar to cancel Jobs in bulk by state, worker, queue, tag or batch.

<screenshot src="/img/pages/jobs/02-queue.png" title="Queued and running Jobs"></screenshot>

### Job details

Selecting a Job shows its options, Request and Response, and for running Jobs their live status and logs.
Depending on its state a Job can be cancelled, requeued or **replayed** - queueing a completed Job again with
the same arguments, e.g. when a downstream system lost its result.

<screenshot src="/img/pages/jobs/03-job-running.png" title="A running Job streaming its progress and logs live"></screenshot>

Jobs that were retried list each [failed attempt](/jobs/reliability#failed-attempt-history) with
its error, the server it ran on and how long it took:

<screenshot src="/img/pages/jobs/07-job-attempts.png" title="A Job that succeeded after two failed attempts"></screenshot>

### Batches

Jobs in a [Batch](/jobs/workflows#job-batches) show the progress of the whole batch, with actions
to requeue its failed Jobs or cancel the Jobs that haven't finished:

<screenshot src="/img/pages/jobs/09-job-batch.png" title="Batch progress, callbacks and requeueing its failed Jobs"></screenshot>

### Queues

The **Queues** tab shows each queue's backlog, running Jobs and how long its oldest Job has been waiting,
with controls to pause and resume it and change its [concurrency and rate limit](/jobs/queues)
while your App is running. Changes take effect on every server.

<screenshot src="/img/pages/jobs/04-queues.png" title="Pause, resume, concurrency and rate limit controls for each queue"></screenshot>

### Nodes

The **Nodes** tab lists the App Servers processing Jobs - see [App Servers](#app-servers) below.

<screenshot src="/img/pages/jobs/05-nodes.png" title="App Servers processing Jobs, with their heartbeat, running Jobs and Drain control"></screenshot>

### History

The **History** tab lists every Job that has run with its outcome, and the full details of Completed and
Failed Jobs in their monthly archives. Failed Jobs can be requeued in bulk by Tag or Batch.

<screenshot src="/img/pages/jobs/06-history.png" title="The history of every Job"></screenshot>

### Scheduled Tasks

The **Scheduled Tasks** tab lists your [Recurring Tasks](/jobs/recurring-tasks) with their next run and the
outcome of their last run, where they can be paused, resumed or run immediately.

<screenshot src="/img/pages/jobs/11-scheduled-tasks.png" title="Scheduled Tasks with their next run, last result and run-now controls"></screenshot>

## App Servers

Each App Server records a heartbeat in the `JobNode` table every `NodeHeartbeatSecs` (default 15s), with its
machine name, process, version, concurrency and how many Jobs it's running. A clean shutdown is recorded
too, so a deploy doesn't look like a crash:

```csharp
foreach (var node in jobs.AssertQueues().GetJobNodes())
{
    var alive = node.IsAlive(TimeSpan.FromMinutes(1));
    Console.WriteLine($"{node.ServerId} running {node.RunningJobs}/{node.Concurrency} alive:{alive}");
}
```

### Drain a server

Before taking a server out of service, drain it so it finishes the Jobs it has without taking any more:

```csharp
jobs.SetJobNodeDraining(serverId, draining: true);
```

Servers can also be drained from the Nodes tab of the Admin UI.

## Health checks

`JobsHealthCheck` reports Background Jobs to [ASP.NET Core health checks](https://learn.microsoft.com/aspnet/core/host-and-deploy/health-checks),
so a growing backlog or a queue that's stopped being processed shows up where your team already looks:

```csharp
services.AddHealthChecks()
    .AddCheck<JobsHealthCheck>("background-jobs");
```

It reports **Degraded** or **Unhealthy** based on the size of the backlog, how long the oldest Job has been
waiting, and whether any App Server is still reporting in. Register `JobsHealthCheckOptions` to change the
thresholds:

```csharp
services.AddSingleton(new JobsHealthCheckOptions {
    DegradedQueuedJobs = 1000,
    UnhealthyQueuedJobs = 10_000,
    DegradedWaitTime = TimeSpan.FromMinutes(5),
    UnhealthyWaitTime = TimeSpan.FromMinutes(30),
    CheckNodes = true,
});
```

## OpenTelemetry

Background Jobs publishes traces and metrics under the `ServiceStack.Jobs` name, which you can export with
[OpenTelemetry](https://opentelemetry.io/docs/languages/dotnet/):

```csharp
services.AddOpenTelemetry()
    .WithTracing(x => x.AddSource(JobsDiagnostics.Name))
    .WithMetrics(x => x.AddMeter(JobsDiagnostics.Name));
```

Each Job execution starts an `Activity` tagged with its id, queue, type, attempt, batch and worker. A Job
records the trace of the request that queued it and continues it when it runs, so an API request and the
work it queued appear in the same trace.

| Metric | Type | Description |
| --- | --- | --- |
| `servicestack.jobs.queued` | Counter | Jobs added to a queue |
| `servicestack.jobs.started` | Counter | Jobs that began executing |
| `servicestack.jobs.completed` | Counter | Jobs that completed successfully |
| `servicestack.jobs.failed` | Counter | Jobs that failed permanently |
| `servicestack.jobs.retried` | Counter | Job attempts that were retried |
| `servicestack.jobs.cancelled` | Counter | Jobs that were cancelled or expired |
| `servicestack.jobs.duration` | Histogram (ms) | How long Jobs took to execute |
| `servicestack.jobs.wait_time` | Histogram (ms) | How long Jobs waited between being queued and starting |

Metrics are tagged with `job.queue`, `job.type`, `job.name` and `job.worker`. Nothing is recorded when no
listener is configured.

## Profiling

Job executions also appear in the Admin UI's [Profiling](/admin-ui-profiling) page, alongside APIs, the
Gateway, OrmLite and Redis, showing each Job's Command, queue, batch, worker, attempt and duration.
`ProfileSource.Jobs` is included in `ProfileSource.All`, or can be enabled on its own:

```csharp
services.AddPlugin(new ProfilingFeature {
    Profile = ProfileSource.ServiceStack | ProfileSource.Jobs,
});
```
