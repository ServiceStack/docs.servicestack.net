---
title: Background Jobs
---

ServiceStack.Jobs is our solution for queueing and managing background jobs and scheduled tasks in .NET 8 Apps. It's a easy to use library that seamlessly integrates into existing ServiceStack Apps with a built-in Management UI to provide real-time monitoring, inspection and management of background jobs.

:::youtube 2Cza_a_rrjA
Durable Background Jobs and Scheduled Tasks for .NET 8 Apps
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

### Queue APIs or Commands

For even greater reuse you're able to queue your existing ServiceStack APIs
as a Background Job in addition to [Commands](/commands) added in the 
[last v8.3 release](/releases/v8_03) for encapsulating units of logic
into internal invokable, inspectable and auto-retryable building blocks.

### Real Time Admin UI

The Background Jobs Admin UI provides a real time view into the status of all background jobs including 
their progress, completion times, Executed, Failed and Cancelled Jobs, etc. which is useful for monitoring 
and debugging purposes. 

![](/img/pages/jobs/jobs-dashboard.webp)

View Real-time progress of queued Jobs

![](/img/pages/jobs/jobs-queue.webp)

View real-time progress logs of executing Jobs

![](/img/pages/jobs/jobs-logs.webp)

View Job Summary and Monthly Databases of Completed and Failed Jobs

![](/img/pages/jobs/jobs-completed.webp)

View full state and execution history of each Job

![](/img/pages/jobs/jobs-failed.webp)

Cancel Running jobs and Requeue failed jobs

### Feature Overview

Despite being a v1 release it packs all the features we wanted to use in a Background Jobs solution including:

 - No infrastructure dependencies
   - Monthly archivable rolling Databases with full Job Execution History
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
 - Maintain Status, Logs and Progress of Executing Jobs
 - Execute transitive (i.e. non-durable) jobs using named workers
 - Attach optional `Tag`, `BatchId`, `CreatedBy`, `ReplyTo` and `Args` with Jobs

Please [let us know](https://servicestack.net/ideas) if there are any other missing features
you would love to see implemented.

## Install

As it's more versatile and better suited, we've replaced the usage of Background MQ with
ServiceStack.Jobs in all **.NET 8 Identity Auth Templates** for sending Identity Auth Confirmation 
Emails when SMTP is enabled. So the easiest way to get started with ServiceStack.Jobs is to 
[create a new Identity Auth Project](https://servicestack.net/start), e.g:

:::sh
x new blazor-vue MyApp
:::

### Exiting .NET 8 Templates

Existing .NET 8 Projects can configure their app to use **ServiceStack.Jobs** by mixing in:

:::sh
x mix jobs
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

### Background Job Options

The behavior for each `Enqueue*` method for executing background jobs can be customized with 
the following options: 

 - `Worker` - Serially process job using a named worker thread 
 - `Callback` - Invoke another command with the result of a successful job 
 - `DependsOn` - Execute jobs after successful completion of a dependent job
   - If parent job fails all dependent jobs are cancelled
 - `UserId` - Execute within an Authenticated User Context
 - `RunAfter` - Queue jobs that are only run after a specified date
 - `RetryLimit` - Override default retry limit for how many attempts should be made to execute a job
 - `TimeoutSecs` - Override default timeout for how long a job should run before being cancelled
 - `RefId` - Allow clients to specify a unique Id (e.g Guid) to track job
 - `Tag` - Group related jobs under a user specified tag
 - `CreatedBy` - Optional field for capturing the owner of a job
 - `BatchId` - Group multiple jobs with the same Id
 - `ReplyTo` - Optional field for capturing where to send notification for completion of a Job
 - `Args` - Optional String Dictionary of Arguments that can be attached to a Job

### Schedule Recurring Tasks

In addition to queueing jobs to run in the background, it also supports scheduling recurring tasks 
to execute APIs or Commands at fixed intervals.

:::youtube DtB8KaXXMCM
Schedule your Reoccurring Tasks with Background Jobs!
:::

APIs and Commands can be scheduled to run at either a `TimeSpan` or
[CRON Expression](https://github.com/HangfireIO/Cronos?tab=readme-ov-file#cron-format) interval, e.g:

```csharp
jobs.RecurringCommand<CheckUrlsCommand>(Schedule.Cron("* * * * *"));
jobs.RecurringCommand<CheckUrlsCommand>(
    Schedule.Interval(TimeSpan.FromMinutes(1)));

jobs.RecurringCommand<CheckUrlsCommand>(Schedule.EveryMinute, new CheckUrls {
    Urls = urls
});

jobs.RecurringApi(Schedule.Interval(TimeSpan.FromMinutes(1)), new CheckUrls {
    Urls = urls
});
```

That can be registered with an optional **Task Name** and **Background Options**, e.g:

```csharp
jobs.RecurringCommand<CheckUrlsCommand>("Check URLs", Schedule.EveryMinute, 
   new() {
       RunCommand = true // don't persist job
   });
```

:::info
If no name is provided, the Command's Name or APIs Request DTO will be used
:::

Scheduled Tasks are idempotent where the same registration with the same name will
either create or update the scheduled task registration without losing track of the
last time the Recurring Task was run which is also viewable in the Jobs Admin UI:

![](/img/pages/jobs/jobs-scheduled-tasks-last-job.webp)

As such it's recommended to always define your App's Scheduled Tasks on Startup:

### Executing non-durable jobs

`IBackgroundJobs` also supports `RunCommand` methods to be able to execute jobs transiently 
(i.e. non-durable), which is useful for commands that want to be serially executed by a named worker 
but don't need to be persisted.

You could use this to queue system emails to be sent by the same **smtp** worker and are happy to 
avoid tracking its state and execution history in the Jobs database.

```csharp
var job = jobs.RunCommand<SendEmailCommand>(new SendEmail { ... }, 
    new() {
        Worker = "smtp"
    });
```

In this case `RunCommand` returns the actual `BackgroundJob` instance that will be updated by 
the worker. 

You can also use `RunCommandAsync` if you prefer to wait until the job has been executed. Instead
of a Job it returns the **Result** of the command if it returned one. 

```csharp
var result = await jobs.RunCommandAsync<SendEmailCommand>(new SendEmail {...}, 
    new() {
        Worker = "smtp"
    });
```

### Serially Execute Jobs with named Workers

By default jobs are executed immediately in a new Task, we can also change the behavior to
instead execute jobs one-by-one in a serial queue by specifying them to use the same named 
worker as seen in the example above.

Alternatively you can annotate the command with the `[Worker]` attribute if you **always** want 
all jobs executing the command to use the same worker:

```csharp
[Worker("smtp")]
public class SendEmailCommand(IBackgroundJobs jobs) : SyncCommand<SendEmail>
{
    //...
}
```

### Use Callbacks to process the results of Commands

Callbacks can be used to extend the lifetime of a job to include processing a callback to process its results.
This is useful where you would like to reuse the the same command but handle the results differently,
e.g. the same command can email results or invoke a webhook by using a callback:

```csharp
jobs.EnqueueCommand<CheckUrlsCommand>(new CheckUrls { Urls = allUrls },
    new() {
        Callback = nameof(EmailUrlResultsCommand),
    });

jobs.EnqueueCommand<CheckUrlsCommand>(new CheckUrls { Urls = criticalUrls },
    new() {
        Callback = nameof(WebhookUrlResultsCommand),
        ReplyTo = callbackUrl
    });
```

Callbacks that fail are auto-retried the same number of times as their jobs, which if they all fail then 
the entire job is also marked as failed. 

### Run Job dependent on successful completion of parent

Jobs can be queued to only run after the successful completion of another job, this is useful 
for when you need to kick off multiple jobs after a long running task has finished like
generating monthly reports after monthly data has been aggregated, e.g: 

```csharp
var jobRef = jobs.EnqueueCommand<AggregateMonthlyDataCommand>(new Aggregate {
    Month = DateTime.UtcNow
});

jobs.EnqueueCommand<GenerateSalesReportCommand>(new () {
   DependsOn = jobRef.Id,
});

jobs.EnqueueCommand<GenerateExpenseReportCommand>(new () {
   DependsOn = jobRef.Id,
});
```

Inside your command you can get a reference to your current job with `Request.GetBackgroundJob()`
which will have its `ParentId` populated with the parent job Id and `job.ParentJob` containing
a reference to the completed Parent Job where you can access its Request, Results and other job 
information:

```csharp
public class GenerateSalesReportCommand(ILogger<MyCommandNoArgs> log) 
    : SyncCommand
{
    protected override void Run()
    {
        var job = Request.GetBackgroundJob();
        var parentJob = job.ParentJob;
    }
}
```

### Atomic Batching Behavior

We can also use `DependsOn` to implement atomic batching behavior where from inside our
executing command we can queue new jobs that are dependent on the successful execution
of the current job, e.g:

```csharp
public class CheckUrlsCommand(IHttpClientFactory factory, IBackgroundJobs jobs)
    : AsyncCommand<CheckUrls>
{
    protected override async Task RunAsync(CheckUrls req, CancellationToken ct)
    {
        var job = Request.GetBackgroundJob();

        var batchId = Guid.NewGuid().ToString("N");
        using var client = factory.CreateClient();
        foreach (var url in req.Urls)
        {
            var msg = new HttpRequestMessage(HttpMethod.Get, url);
            var response = await client.SendAsync(msg, ct);
            response.EnsureSuccessStatusCode();
      
            jobs.EnqueueCommand<SendEmailCommand>(new SendEmail {
                To = "my@email.com",
                Subject = $"{new Uri(url).Host} status",
                BodyText = $"{url} is up",
            }, new() {
                DependsOn = job.Id,
                BatchId = batchId,
            });
        }
    }
}
```

Where any dependent jobs are only executed if the job was successfully completed. 
If instead an exception was thrown during execution, the job will be failed and
all its dependent jobs cancelled and removed from the queue.

### Executing jobs with an Authenticated User Context

If you have existing logic dependent on a Authenticated `ClaimsPrincipal` or ServiceStack
`IAuthSession` you can have your APIs and Commands also be executed with that user context
by specifying the `UserId` the job should be executed as:

```csharp
var openAiRequest = new CreateOpenAiChat {
   Request = new() {
       Model = "gpt-4",
       Messages = [
           new() {
               Content = request.Question
           }
       ]
   },
}; 

// Example executing API Job with User Context
jobs.EnqueueApi(openAiRequest, 
    new() {
      UserId = Request.GetClaimsPrincipal().GetUserId(),
      CreatedBy = Request.GetClaimsPrincipal().GetUserName(),
   });

// Example executing Command Job with User Context
jobs.EnqueueCommand<CreateOpenAiChatCommand>(openAiRequest, 
    new() {
      UserId = Request.GetClaimsPrincipal().GetUserId(),
      CreatedBy = Request.GetClaimsPrincipal().GetUserName(),
   });
```

Inside your API or Command you access the populated User `ClaimsPrincipal` or
ServiceStack `IAuthSession` using the same APIs that you'd use inside your ServiceStack APIs, e.g:

```csharp
public class CreateOpenAiChatCommand(IBackgroundJobs jobs) 
    : AsyncCommand<CreateOpenAiChat>
{
    protected override async Task RunAsync(
        CreateOpenAiChat request, CancellationToken token)
    {
        var user = Request.GetClaimsPrincipal();
        var session = Request.GetSession();
        //...
    }
}
```

### Queue Job to run after a specified date

Using `RunAfter` lets you queue jobs that are only executed after a specified `DateTime`, 
useful for executing resource intensive tasks at low traffic times, e.g: 

```csharp
var jobRef = jobs.EnqueueCommand<AggregateMonthlyDataCommand>(new Aggregate {
       Month = DateTime.UtcNow
   }, 
   new() {
       RunAfter = DateTime.UtcNow.Date.AddDays(1)
   });
```

### Attach Metadata to Jobs

All above Background Job Options have an effect on when and how Jobs are executed.
There are also a number of properties that can be attached to a Job that can be useful
in background job processing despite not having any effect on how jobs are executed.

These properties can be accessed by commands or APIs executing the Job and are visible
and can be filtered in the Jobs Admin UI to help find and analyze executed jobs.

```csharp
var jobRef = jobs.EnqueueCommand<CreateOpenAiChatCommand>(openAiRequest, 
   new() {
      // Group related jobs under a common tag
      Tag = "ai",
      // A User-specified or system generated unique Id to track the job
      RefId = request.RefId,
      // Capture who created the job
      CreatedBy = Request.GetClaimsPrincipal().GetUserName(),
      // Link jobs together that are sent together in a batch
      BatchId = batchId,
      // Capture where to notify the completion of the job to
      ReplyTo = "https:example.org/callback",
      // Additional properties about the job that aren't in the Request  
      Args = new() {
          ["Additional"] = "Metadata"
      }
   });
```

### Querying a Job

A job can be queried by either it's auto-incrementing `Id` Primary Key or by a unique `RefId`
that can be user-specified.

```csharp
var jobResult = jobs.GetJob(jobRef.Id);

var jobResult = jobs.GetJobByRefId(jobRef.RefId);
```

At a minimum a `JobResult` will contain the Summary Information about a Job as well as the 
full information about a job depending on where it's located:

```csharp
class JobResult
{
    // Summary Metadata about a Job in the JobSummary Table 
    JobSummary Summary
    // Job that's still in the BackgroundJob Queue
    BackgroundJob? Queued
    // Full Job information in Monthly DB CompletedJob Table
    CompletedJob? Completed
    // Full Job information in Monthly DB FailedJob Table
    FailedJob? Failed
    // Helper to access full Job Information
    BackgroundJobBase? Job => Queued ?? Completed ?? Failed 
}
```

### Job Execution Limits

Default Retry and Timeout Limits can be configured on the Backgrounds Job plugin:

```csharp
services.AddPlugin(new BackgroundsJobFeature
{
   DefaultRetryLimit = 2,
   DefaultTimeout = TimeSpan.FromMinutes(10),
});
```

These limits are also overridable on a per-job basis, e.g: 

```csharp
var jobRef = jobs.EnqueueCommand<AggregateMonthlyDataCommand>(new Aggregate {
       Month = DateTime.UtcNow
   }, 
   new() {
      RetryLimit = 3,
      Timeout = TimeSpan.FromMinutes(30),
   });
```

### Logging, Cancellation an Status Updates

We'll use the command for checking multiple URLs to demonstrate some recommended patterns
and how to enlist different job processing features.

```csharp
public class CheckUrlsCommand(
    ILogger<CheckUrlsCommand> logger,
    IBackgroundJobs jobs,
    IHttpClientFactory clientFactory) : AsyncCommand<CheckUrls>
{
    protected override async Task RunAsync(CheckUrls req, CancellationToken ct)
    {
        // 1. Create Logger that Logs and maintains logging in Jobs DB
        var log = Request.CreateJobLogger(jobs,logger);

        // 2. Get Current Executing Job
        var job = Request.GetBackgroundJob();

        var result = new CheckUrlsResult {
            Statuses = new()
        };
        using var client = clientFactory.CreateClient();
        for (var i = 0; i < req.Urls.Count; i++)
        {
            // 3. Stop processing Job if it's been cancelled 
            ct.ThrowIfCancellationRequested();

            var url = req.Urls[i];
            try
            {
                var msg = new HttpRequestMessage(HttpMethod.Get,url);
                var response = await client.SendAsync(msg, ct);

                result.Statuses[url] = response.IsSuccessStatusCode;
                log.LogInformation("{Url} is {Status}",
                    url, response.IsSuccessStatusCode ? "up" : "down");

                // 4. Optional: Maintain explicit progress and status updates
                log.UpdateStatus(i/(double)req.Urls.Count,$"Checked {i} URLs");
            }
            catch (Exception e)
            {
                log.LogError(e, "Error checking {Url}", url);
                result.Statuses[url] = false;
            }
        }

        // 5. Send Results to WebHook Callback if specified
        if (job.ReplyTo != null)
        {
            jobs.EnqueueCommand<NotifyCheckUrlsCommand>(result,
                new() {
                    ParentId = job.Id,
                    ReplyTo = job.ReplyTo,
                });
        }
    }
}
```

We'll cover some of the notable parts useful when executing Jobs:

#### 1. Job Logger

We can use a Job logger to enable database logging that can be monitored in real-time in the 
Admin Jobs UI. Creating it with both `BackgroundJobs` and `ILogger` will return a combined 
logger that both Logs to standard output and to the Jobs database:

```csharp
var log = Request.CreateJobLogger(jobs,logger);
```

Or just use `Request.CreateJobLogger(jobs)` to only save logs to the database.

#### 2. Resolve Executing Job

If needed the currently executing job can be accessed with:

```csharp
var job = Request.GetBackgroundJob();
```

Where you'll be able to access all the metadata the jobs were created with including `ReplyTo`
and `Args`.

#### 3. Check if Job has been cancelled

To be able to cancel a long running job you'll need to periodically check if a Cancellation
has been requested and throw a `TaskCanceledException` if it has to short-circuit the command
which can be done with:

```csharp
ct.ThrowIfCancellationRequested();
```

You'll typically want to call this at the start of any loops to prevent it from doing any more work.

#### 4. Optionally record progress and status updates

By default Background Jobs looks at the last API or Command run and worker used to estimate 
the duration and progress for how long a running job will take.

If preferred your command can explicitly set a more precise progress and optional status update
that should be used instead, e.g:

```csharp
log.UpdateStatus(progress:i/(double)req.Urls.Count, $"Checked {i} URLs");
```

Although generally the estimated duration and live logs provide a good indication for the progress
of a job.

#### 5. Notify completion of Job

Calling a Web Hook is a good way to notify externally initiated job requests of the completion
of a job. You could invoke the callback within the command itself but there are a few benefits
to initiating another job to handle the callback:

 - Frees up the named worker immediately to process the next task
 - Callbacks are durable, auto-retried and their success recorded like any job
 - If a callback fails the entire command doesn't need to be re-run again

We can queue a callback with the result by passing through the `ReplyTo` and link it to the
existing job with:

```csharp
if (job.ReplyTo != null)
{
   jobs.EnqueueCommand<NotifyCheckUrlsCommand>(result,
       new() {
           ParentId = job.Id,
           ReplyTo = job.ReplyTo,
       });
}
```

Which we can implement by calling the `SendJsonCallbackAsync` extension method with the
Callback URL and the Result DTO it should be called with:

```csharp
public class NotifyCheckUrlsCommand(IHttpClientFactory clientFactory) 
    : AsyncCommand<CheckUrlsResult>
{
    protected override async Task RunAsync(
        CheckUrlsResult request, CancellationToken token)
    {
        await clientFactory.SendJsonCallbackAsync(
            Request.GetBackgroundJob().ReplyTo, request, token);
    }
}
```

#### Callback URLs

`ReplyTo` can be any URL which by default will have the result POST'ed back to the URL with a JSON
Content-Type. Typically URLs will contain a reference Id so external clients can correlate a callback
with the internal process that initiated the job. If the callback API is publicly available you'll
want to use an internal Id that can't be guessed so the callback can't be spoofed, like a Guid, e.g:

`$"https://api.example.com?refId={RefId}"`

If needed the callback URL can be customized on how the HTTP Request callback is sent.

If the URL contains a space, the text before the space is treated as the HTTP method:

`"PUT https://api.example.com"`

If the auth part contains a colon `:` it's treated as Basic Auth:

`"username:password@https://api.example.com"`

If name starts with `http.` sends a HTTP Header

`"http.X-API-Key:myApiKey@https://api.example.com"`

Otherwise it's sent as a Bearer Token:

`"myToken123@https://api.example.com"`

Bearer Token or HTTP Headers starting with `$` is substituted with Environment Variable if exists:

`"$API_TOKEN@https://api.example.com"`

When needed headers, passwords and tokens can be URL encoded if they contain any delimiter characters.

## Implementing Commands

At a minimum a command need only implement the simple [IAsyncCommand interface](/commands#commands-feature): 

```csharp
public interface IAsyncCommand<in T>
{
    Task ExecuteAsync(T request);
}
```

Which is the singular interface that can execute any command.

However commands executed via Background Jobs have additional context your commands may need to 
access during execution, including the `BackgroundJob` itself, the `CancellationToken` and
an Authenticated User Context.

::include command-types.md::
