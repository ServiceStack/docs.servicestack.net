---
title: Retries & Reliability
---

Background Jobs is built for work that has to happen, and happen once: charging payments, sending emails
and syncing data with other systems. This page covers how failed Jobs are retried, how to stop work running
twice or running late, and the limits that keep your Jobs database healthy.

Everything on this page works with both [RDBMS](/background-jobs-rdbms) and [SQLite](/background-jobs-sqlite)
Background Jobs, except where noted.

## Retries and backoff

A Job that throws is retried up to its `RetryLimit` (default `2`) before it's recorded as **Failed**.
Retries are spaced out so a failing dependency has time to recover:

```csharp
jobs.EnqueueCommand<SyncCrmContactCommand>(contact, new() {
    RetryLimit = 5,
    RetryBackoff = RetryBackoff.ExponentialJitter,
    RetryDelay = TimeSpan.FromSeconds(5),       // before the first retry
    MaxRetryDelay = TimeSpan.FromMinutes(5),    // longest wait between retries
});
```

| `RetryBackoff` | Delay before retry *n* |
| --- | --- |
| `Fixed` | `RetryDelay` |
| `Linear` | `RetryDelay` × *n* |
| `Exponential` | `RetryDelay` × 2<sup>*n*-1</sup> |
| `ExponentialJitter` (default) | A random delay between half and all of the `Exponential` delay |

Every delay is capped at `MaxRetryDelay`. `ExponentialJitter` spreads retries out after an outage, so all
the Jobs that failed at the same time don't retry at the same time.

<retry-planner></retry-planner>

Defaults for every Job are configured on the plugin:

```csharp
services.AddPlugin(new DatabaseJobFeature {     // or BackgroundsJobFeature
    DefaultRetryLimit = 2,
    DefaultRetryBackoff = RetryBackoff.ExponentialJitter,
    DefaultRetryDelayMs = 5_000,
    DefaultMaxRetryDelayMs = 300_000,
});
```

### Which failures are retried

Jobs that throw an `OperationCanceledException`, e.g. because they were cancelled or timed out, aren't
retried. Use `ShouldRetry` to decide for yourself, e.g. to not retry validation errors that will never
succeed:

```csharp
services.AddPlugin(new DatabaseJobFeature {
    ShouldRetry = (job, ex) => ex is not (OperationCanceledException or ArgumentException),
});
```

### Failed attempt history

Every failed attempt is recorded with its error, the server it ran on and how long it took, so an
intermittent failure shows its full history rather than only the last error:

```csharp
foreach (var attempt in jobs.GetJobAttempts(jobId))
{
    Console.WriteLine($"Attempt {attempt.Attempt} on {attempt.ServerId}: {attempt.Error?.Message}");
}
```

The attempts are also listed on each Job in the [Admin UI](/background-jobs-monitoring#job-details):

<screenshot src="/img/pages/jobs/08-job-failed.png" title="Every failed attempt is recorded with its error, server and duration"></screenshot>

### Requeue failed Jobs

A failed Job can be requeued to run again, which clears its previous run state:

```csharp
jobs.RequeueFailedJob(jobId);
```

Failed Jobs can also be requeued from the Admin UI, individually or in bulk by Tag or Batch.

## Timeouts

A Job that runs longer than its `TimeoutSecs` (default 10 minutes) is cancelled:

```csharp
jobs.EnqueueCommand<GenerateReportCommand>(request, new() {
    Timeout = TimeSpan.FromMinutes(30),
});
```

Commands should pass on or check their `CancellationToken` so they stop promptly. A Job that ignores its
token still releases its Worker once it exceeds its timeout, so the Jobs queued behind it keep moving.

## Cancellation

Queued and running Jobs can be cancelled from code or the Admin UI:

```csharp
jobs.CancelJob(jobId);

// Cancel every Job in a state or on a named Worker
jobs.CancelJobs(state: BackgroundJobState.Queued, worker: "smtp");
```

A queued Job is cancelled immediately. A running Job is asked to stop through its `CancellationToken` -
with RDBMS Background Jobs this reaches whichever server is executing it - and its completion can't
overwrite the cancellation afterwards. If a Job fails or is cancelled, the Jobs that
[depend on it](/background-jobs-workflows#multi-step-workflows) are cancelled too.

## Job expiry

Some work is pointless once it's late, like a reminder for a meeting that's already happened. Give a Job
an expiry, and if it can't start in time it's cancelled with the `JobExpired` error code instead of running:

```csharp
jobs.EnqueueCommand<SendMeetingReminderCommand>(reminder, new() {
    ExpiresIn = TimeSpan.FromMinutes(15),       // or ExpiresAt = meeting.StartTime
});
```

## Idempotent enqueue

Networks time out and clients retry, so the same request can arrive twice. Give a Job a meaningful `RefId`
and use `DuplicateRefIdBehavior.ReturnExisting` so queueing it again returns the Job that already exists,
instead of creating a duplicate:

```csharp
var jobRef = jobs.EnqueueCommand<ChargeOrderCommand>(order, new() {
    RefId = $"charge-order-{order.Id}",
    DuplicateRefIdBehavior = DuplicateRefIdBehavior.ReturnExisting,
});
```

With the default `DuplicateRefIdBehavior.Throw`, queueing a `RefId` that belongs to a different Job throws a
`DuplicateRefIdException`.

## Singleton Jobs

A `SingletonKey` allows only one Job with that key to be queued or running at a time. Queueing another while
one is active returns the existing Job instead, e.g. to refresh a cache without piling up refreshes:

```csharp
jobs.EnqueueCommand<RefreshProductsCacheCommand>(new() {
    SingletonKey = "refresh-products-cache",
});
```

It's enforced by a unique database index, so it holds even when several servers queue the same Job at the
same moment. Once the Job finishes, the key can be used again.

<dedup-playground></dedup-playground>

| To make sure... | Use |
| --- | --- |
| The same request is only ever processed once | `RefId` + `DuplicateRefIdBehavior.ReturnExisting` |
| Only one Job does this work at a time, and extras are dropped | `SingletonKey` |
| Jobs for the same entity run in order, one at a time | [`ConcurrencyKey`](/background-jobs-queues#concurrency-keys) |
| A Job is only queued if your database transaction commits | [Transactional outbox](/background-jobs-rdbms#queue-jobs-in-your-own-transaction) (RDBMS) |

## Graceful shutdown

When your App shuts down, running Jobs are given `ShutdownTimeoutSecs` (default 30s) to finish, and their
progress and logs are saved. This is registered by the plugin, so it works without changes to your own
hosted service.

With RDBMS Background Jobs, Jobs that were claimed but never started, and Jobs still running when the
shutdown timeout runs out, are released straight away so another server picks them up immediately, instead
of waiting for their lease to expire.

## Protecting your database

Your Jobs database is a work queue, not a blob store. These limits keep it lean:

| Option | Default | Behavior |
| --- | --- | --- |
| `MaxRequestBodyChars` | 1M chars | Queueing a Job with a larger serialized Request throws an `ArgumentException`, since a truncated Request couldn't be deserialized. Pass a reference to large payloads instead. |
| `MaxResponseBodyChars` | 1M chars | Larger Responses aren't stored, and the Job's `Meta` records why its result is missing. |
| `MaxJobLogChars` | 100K chars | Logs beyond the limit are dropped, and the Job is marked `LogsTruncated`. |
| `JobSummaryRetention` | off | Deletes the history of finished Jobs older than this. A Job's `RefId` can be reused once its history is deleted. |
| `ArchiveRetention` | off | Drops monthly `CompletedJob` and `FailedJob` archives older than this. |

```csharp
services.AddPlugin(new DatabaseJobFeature {
    JobSummaryRetention = TimeSpan.FromDays(90),
    ArchiveRetention = TimeSpan.FromDays(365),
});
```

## Error codes

Jobs that the Background Jobs runtime fails or cancels itself are recorded with these `JobErrorCodes`:

| Error code | Meaning |
| --- | --- |
| `JobExpired` | The Job couldn't start before its `ExpiresAt` deadline |
| `LeaseExpired` | The Job was abandoned mid-execution, e.g. its server crashed, more times than its `RetryLimit` allows (RDBMS) |
| `QueueClearedOnUpgrade` | The Job was still queued when its database was upgraded to the v10.3 schema |
