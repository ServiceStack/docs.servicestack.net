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
npx create-net blazor-vue MyApp
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

::include jobs-shared.md::

::include command-types.md::
