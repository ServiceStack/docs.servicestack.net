---
title: Workflows, Batches & Results
---

Background Jobs can do more than run a single task in the background. Jobs can depend on each other to
form multi-step workflows, fan out as a **Batch** whose progress you can track, and have their results
awaited or delivered as soon as they complete.

Everything on this page works the same with [RDBMS](/background-jobs-rdbms) and
[SQLite](/background-jobs-sqlite) Background Jobs.

## Multi-step workflows

A Job queued with `DependsOn` only runs after its parent Job has completed successfully. If the parent
fails or is cancelled, every Job that depends on it is cancelled too - including Jobs queued after the
parent had already failed:

```csharp
var charge  = jobs.EnqueueCommand<ChargePaymentCommand>(order);
var reserve = jobs.EnqueueCommand<ReserveInventoryCommand>(order, new() { DependsOn = charge.Id });
var ship    = jobs.EnqueueCommand<ShipOrderCommand>(order, new() {
    DependsOn = reserve.Id,
    Callback = nameof(OrderShippedCommand),
});
```

Each step can read the Job it depends on, including its Request and Response, from inside the Command:

```csharp
public class ShipOrderCommand : AsyncCommand<Order>
{
    protected override async Task RunAsync(Order order, CancellationToken token)
    {
        var job = Request.GetBackgroundJob();
        var reserved = job.ParentJob; // the completed ReserveInventory Job
        //...
    }
}
```

### Run however the parent finished

Some steps need to run whether or not the previous step succeeded, like notifying a customer or cleaning
up temporary files. Queue them with `DependsOnPolicy.OnFinished` to run once the parent has finished in
any state:

```csharp
jobs.EnqueueCommand<NotifyCustomerCommand>(order, new() {
    DependsOn = ship.Id,
    DependsOnPolicy = JobDependencyPolicy.OnFinished,
});
```

The default, `JobDependencyPolicy.OnSuccess`, only runs the Job if its parent completed successfully.

<workflow-simulator></workflow-simulator>

### Callbacks

A `Callback` runs another Command with the result of a successful Job, which lets the same Command's
results be handled differently for different callers:

```csharp
jobs.EnqueueCommand<CheckUrlsCommand>(new CheckUrls { Urls = urls }, new() {
    Callback = nameof(EmailUrlResultsCommand),
});
```

## Job Batches

Bulk work like importing a file, resizing a gallery or reprocessing a day of records is queued as many
Jobs sharing a `BatchId`. A **Job Batch** makes that group trackable: how far through it is, what failed,
and what to run once it's done.

```csharp
var batchId = $"gallery-{galleryId}";
jobs.CreateJobBatch(batchId, total: images.Count,
    description: "Resize gallery images",
    callback: nameof(GalleryResizedCommand),    // runs once every Job has finished
    onSuccess: nameof(PublishGalleryCommand));   // only runs if every Job succeeded

foreach (var image in images)
{
    jobs.EnqueueCommand<ResizeImageCommand>(image, new() { BatchId = batchId });
}
```

 - `total` is the number of Jobs you'll add. It lets the batch report its progress, and makes sure its
   callbacks don't run early when Jobs are queued over time.
 - `callback` runs once every Job has finished, however they finished.
 - `onSuccess` only runs if every Job in the batch completed successfully.

Both callbacks are Commands that receive the completed `JobBatch`, and are only ever queued once, however
many servers are processing the batch:

```csharp
public class GalleryResizedCommand(IEmailer emailer) : AsyncCommand<JobBatch>
{
    protected override async Task RunAsync(JobBatch batch, CancellationToken token)
    {
        await emailer.SendAsync($"{batch.Completed} of {batch.Total} images resized, {batch.Failed} failed");
    }
}
```

You don't need to create a batch up-front - queueing a Job with a new `BatchId` creates it - but without a
`total` or callbacks it only groups the Jobs together.

<batch-simulator></batch-simulator>

### Batch progress

A batch's counters are updated in the database as each Job finishes, so its progress can be read from any
server:

```csharp
var batch = jobs.GetJobBatch(batchId);
Console.WriteLine($"{batch.Finished}/{batch.Total} ({batch.Progress:P0}), {batch.Failed} failed");
```

The [Admin UI](/background-jobs-monitoring#batches) shows the progress of a batch on each of its Jobs, along
with actions to requeue its failed Jobs or cancel it.

<screenshot src="/img/pages/jobs/09-job-batch.png" title="Batch progress, callbacks and requeueing its failed Jobs"></screenshot>

### Cancel a batch

Cancelling a batch cancels every Job in it that hasn't finished, and prevents any more Jobs being added
to it:

```csharp
List<long> cancelledJobIds = jobs.CancelJobBatch(batchId);
```

Related batches can be grouped with `parentBatchId`, e.g. one batch per file in a multi-file import.

### Fan in after a batch

A Job queued with `DependsOnBatch` waits until every Job in the batch has finished before it runs:

```csharp
jobs.EnqueueCommand<CreateZipArchiveCommand>(new CreateZip { GalleryId = galleryId }, new() {
    DependsOnBatch = batchId,
});
```

This is an alternative to a batch `callback` when the follow-up work needs its own Request, queue or
options.

<results-delivery></results-delivery>

## Await a Job's result

`WaitForJobAsync` waits for a durable Job to finish and returns its result, so an API can queue work to be
run by whichever server has capacity, and still return its result in the same request:

```csharp
public async Task<object> Any(GenerateReport request)
{
    var jobRef = jobs.EnqueueCommand<GenerateReportCommand>(request);
    var result = await jobs.WaitForJobAsync(jobRef, TimeSpan.FromSeconds(30));
    return jobs.CreateResponse(result);
}
```

It polls for the result, backing off from 100ms to 1s, and throws a `TimeoutException` if the Job hasn't
finished within the timeout. For work that doesn't need to be durable, `RunCommandAsync` runs a Command
in-memory and returns its result directly.

## Deliver results to ReplyTo

Give a Job a `ReplyTo` and its result is delivered as soon as it completes:

```csharp
// POSTed as JSON to a URL
jobs.EnqueueCommand<BuildReportCommand>(request, new() {
    ReplyTo = "https://example.org/hooks/report-ready",
});

// Published to an MQ queue
jobs.EnqueueCommand<BuildReportCommand>(request, new() {
    ReplyTo = "report.ready",
});
```

 - An `http://` or `https://` URL receives the Response DTO as a JSON POST, with `X-Job-Id`, `X-Job-RefId`,
   `X-Job-BatchId`, `X-Job-Tag` and `X-Job-State` HTTP Headers so the receiver can correlate the result
   without parsing the body.
 - Anything else is treated as a queue name, and the Response is published to it with the registered
   [MQ Server](/messaging).

A failed delivery is logged, but doesn't fail the Job, which has already run successfully.

### Restrict where results are sent

If a `ReplyTo` can come from your users, restrict where results can be sent so your servers can't be used
to POST to internal addresses:

```csharp
services.AddPlugin(new DatabaseJobFeature {
    ValidateReplyTo = JobReplyTo.AllowUrlPrefixes(["https://hooks.example.org/"]),
});
```

`AllowUrlPrefixes` compares the parsed scheme, host and port rather than the raw string, so a look-alike
host like `https://hooks.example.org.evil.com` can't pass. A Job with a `ReplyTo` that isn't allowed is
rejected when it's queued, and it's checked again before the result is sent. MQ queue names are still
allowed unless you pass `allowMqQueues:false`.

### Customize delivery

Replace `OnJobReplyTo` to sign requests, add authentication, or send results somewhere else entirely:

```csharp
services.AddPlugin(new DatabaseJobFeature {
    OnJobReplyTo = async ctx => {
        // ctx.Job, ctx.ReplyTo, ctx.Response, ctx.Token
        if (ctx.ReplyTo.StartsWith("slack:"))
            await slack.PostAsync(ctx.ReplyTo["slack:".Length..], ctx.Response);
        else
            await JobReplyTo.SendAsync(ctx); // default delivery
    },
});
```
