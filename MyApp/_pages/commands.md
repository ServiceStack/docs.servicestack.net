---
title: Commands Feature
---

### Utilizing Commands to build more robust and observable systems

Much of ServiceStack has been focused on providing a productive [API First Development](/api-first-development) experience and adding value-added features around your System's external APIs.

### Internal API Implementation

Thus far little attention has been given to internal implementations of APIs since it can use anything that fulfils its 
service contract by returning the APIs populated Response DTO. 

How code-bases are structured is largely a matter of developer preference, however we believe we've also been able 
to add value in this area with the new appealing managed **Commands Feature**.

:::youtube SXPdBHbncPc
Use Commands to build robust and observable systems with Admin UI
:::

## Code Architecture 

Ultimately nothing beats the simplicity of "No Architecture" by maintaining all logic within a Service Implementation 
which just needs to call a few App dependencies to implement its functionality and return a populated Response DTO:

```csharp
public object Any(MyRequest request) => new MyResponse { ... };
```

This is still the best option for small implementations where the Service is the only consumer of the logic that should
be run on the HTTP Worker Request Thread.

#### When to restructure

Times when you may want to consider moving logic out of your Service into separate classes include:

- **Code Reuse**: Make it easier to reuse your Service logic in other Services
- **Complexity**: Break down complex logic into smaller more manageable pieces
- **Testability**: Make it easier to test your Logic in isolation
- **Observability**: Make it easier to log and monitor
- **Robustness**: Make it easier to handle, retry and recover from errors
- **Flexibility**: Make it easier to run in parallel or in a different managed thread

We'll look at how the new **Commands Feature** can help in these areas.

### Code Reuse

Following principles of YAGNI in doing the simplest thing that could possibly work, whenever we want to reuse logic
across Services we'd first start by moving it to an extension method on the dependency that it uses, e.g. 

```csharp
public static async Task<List<Contact>> GetActiveSubscribersAsync(
    this IDbConnection db, MailingList mailingList)
{        
    return await db.SelectAsync(db.From<Contact>(db.TableAlias("c"))
        .Where(x => x.DeletedDate == null && x.UnsubscribedDate == null && 
            x.VerifiedDate != null && (mailingList & x.MailingLists) == mailingList)
        .WhereNotExists(db.From<InvalidEmail>()
            .Where<Contact,InvalidEmail>((c,e) => 
                e.EmailLower == Sql.TableAlias(c.EmailLower, "c"))
            .Select(x => x.Id))
    );
}
```

Which does a great job at encapsulating logic and making it reusable and readable:

```csharp
foreach (var sub in await Db.GetActiveSubscribersAsync(MailingList.Newsletter)) {
    //...
}
```

Where it can be reused without referencing any external classes whilst also being easily discoverable via intelli-sense.    

This works great for 1 or 2 dependencies, but becomes more cumbersome as the number of dependencies grows, e.g: 

```csharp
public static async Task<List<Contact>> GetActiveSubscribersAsync(
    this IDbConnection db, ILogger log, ICacheClient cache, MailingList mailingList)
```

In which the complexity of the extension method dependencies leaks and impacts all calling classes that need to include
them and also starts to impact its readability, e.g:

```csharp
public class MyService(ILogger<MyService> log, ICacheClient cache, IDbConnection db) 
    : Service
{
    public object Any(MyRequest request)
    {
        var subs = await Db.GetActiveSubscribersAsync(log, cache, request.MailList);
    }
}
```

### Refactoring Logic into separate classes

The solution to this is to refactor the logic into a separate class and leverage the IOC to inject the dependencies it needs,
fortunately with Primary Constructors this now requires minimal boilerplate code, e.g:

```csharp
class MyLogic(ILogger<MyService> log, ICacheClient cache, IDbConnection db)
{
    //...
}
```

But it still requires manual registration adding additional complexity to 
your Host project `Program.cs` or [Modular Configurations](/modular-startup) which needs to 
manage registration for all these new logic classes, e.g: 

```csharp
builder.Services.AddTransient<MyLogic>();
```

## Commands Feature

Which touches on the first benefit of the **Commands Feature** which like ServiceStack Services auto registers
all classes implementing the intentionally simple and impl-free `IAsyncCommand` interface, e.g:

```csharp
public interface IAsyncCommand<in T>
{
    Task ExecuteAsync(T request);
}
```

Allowing for maximum flexibility in how to implement your logic classes, which are essentially encapsulated
units of logic with a single method to execute it, e.g:

```csharp
public class AddTodoCommand(ILogger<AddTodoCommand> log, IDbConnection db) 
    : IAsyncCommand<CreateTodo>
{
    public async Task ExecuteAsync(CreateTodo request)
    {
        var newTodo = request.ConvertTo<Todo>();
        newTodo.Id = await db.InsertAsync(newTodo, selectIdentity:true);
        log.LogDebug("Created Todo {Id}: {Text}", newTodo.Id, newTodo.Text);
    }
}
```

Where we immediately get the benefits of code reuse, encapsulation, and readability without needing to manually 
register and pollute your App's configuration with them.

By default Commands are registered as transient dependencies, but you can also register them with a different lifetime
scope using the `[Lifetime]` attribute, e.g:

```csharp
[Lifetime(Lifetime.Scoped)]
public class AddTodoCommand(ILogger<AddTodoCommand> log, IDbConnection db)
    : IAsyncCommand<CreateTodo> {}
```

Or by manually registering them, if you need a custom registration:

```csharp
services.AddTransient<AddTodoCommand>(c => CreateAddTodoCommand(c));
```

### Commands with Results

For maximum flexibility, we want to encourage temporal decoupling by separating initiating a command from its execution, 
so instead of adding a different method to execute commands with results, we're instead recommending the convention of
storing the result of a command in a `Result` property, e.g:

```csharp
public interface IAsyncCommand<in TRequest, out TResult> 
    : IAsyncCommand<TRequest>, IHasResult<TResult> { }

public interface IHasResult<out T>
{
    T Result { get; }
}
```

So we could implement a command with a result like:

```csharp
public class AddTodoCommand(ILogger<AddTodoCommand> log, IDbConnection db) 
    : IAsyncCommand<CreateTodo, Todo>
{
    public Todo Result { get; private set; }
    
    public async Task ExecuteAsync(CreateTodo request)
    {
        Result = request.ConvertTo<Todo>();
        Result.Id = await db.InsertAsync(newTodo, selectIdentity:true);
        log.LogDebug("Created Todo {Id}: {Text}", Result.Id, Result.Text);
    }
}
```

### Messaging

Although for better resilience and scalability we recommend utilizing a messaging pattern to notify the outputs of a 
command by publishing messages to invoke dependent logic instead of returning a result, e.g:

```csharp
public class AddTodoCommand(IDbConnection db, IMessageProducer mq) 
    : IAsyncCommand<CreateTodo>
{
    public async Task ExecuteAsync(CreateTodo request)
    {
        var newTodo = request.ConvertTo<Todo>();
        newTodo.Id = await db.InsertAsync(newTodo, selectIdentity:true);
        mq.Publish(new SendNotification { TodoCreated = newTodo });
    }    
}
```

Which decouples the sender and receiver of the message, allowing it to finish without needing to wait and concern itself 
on how subsequent logic is processed, e.g. how to handle errors, whether to execute it in a different managed thread, in parallel, etc.

Messaging encourages adopting a more reliable asynchronous one-way workflow instead of implementing logic serially where 
the sender is timely coupled to the successful execution of all subsequent logic before being able to complete, e.g:

```csharp
await cmd.ExecuteAsync(createTodo);
var newTodo = cmd.Result;
await SendNewTodoNotificationAsync(newTodo);
```

It allows for more reliable and observable workflows that removes the temporal coupling between components where each 
execution step can be executed on different threads, independently monitored and retried if needed.

```txt
[A] -> [B] -> [C]
```

### Commands as Application Building Blocks

As they're not dependent on any framework and can support multiple execution patterns, we believe Commands make great 
building blocks for insulating units of logic as they're simple and testable and allow for managed execution which can 
easily add logging, monitoring, and resilience around your logic.

### Background MQ

It should be noted adopting a messaging pattern doesn't require additional infrastructure complexity of an external MQ Server
as you can use the [Background MQ](/background-mq) to execute messages in configurable managed background threads.

### Executing Commands

Commands are effectively a pattern to structure your logic that doesn't depend on any implementation assembly or 
framework, so they can just be executed directly, e.g:

```csharp
using var db = dbFactory.Open();
var cmd = new AddTodoCommand(new NullLogger<AddTodoCommand>(), db);
await cmd.ExecuteAsync(new CreateTodo { Text = "New Todo" });
```

### Command Executor

They also allow for a managed execution which the **CommandsFeature** provides with its `ICommandExecutor` which
can be executed like:

```csharp
public class MyService(ICommandExecutor executor) : Service
{
    public object Any(MyRequest request)
    {
        var cmd = executor.Command<AddTodoCommand>(); 
        await cmd.ExecuteAsync(new AddTodoCommand { Text = "New Todo" });
    }
}
```

This still results in the same behavior where exceptions are bubbled but also adds observability and resilience and
other niceties like executing any Fluent or Declarative Validation on Command Requests.

### Retry Failed Commands

We can make commands more resilient by adding the `[Retry]` attribute to opt into auto retrying failed commands:

```csharp
[Retry]
public class AddTodoCommand() : IAsyncCommand<CreateTodo> {}
```

Which will automatically retry the command as per the default Retry Policy:

```csharp
services.AddPlugin(new CommandsFeature
{
    DefaultRetryPolicy = new(
        Times: 3,
        Behavior: RetryBehavior.FullJitterBackoff,
        DelayMs: 100,
        MaxDelayMs: 60_000,
        DelayFirst: false
    )
});
```

That can be overridden on a per-command basis with the `[Retry]` attribute, e.g:

```csharp
[Retry(Times=4, MaxDelayMs=300_000, Behavior=RetryBehavior.LinearBackoff)]
public class AddTodoCommand() : IAsyncCommand<CreateTodo> {}
```

The different Retry Behaviors available include:

```csharp
public enum RetryBehavior
{
    // Use the default retry behavior
    Default,
    
    // Always retry the operation after the same delay
    Standard,
    
    // Should be retried with a linear backoff delay strategy
    LinearBackoff,

    // Should be retried with an exponential backoff strategy
    ExponentialBackoff,

    // Should be retried with a full jittered exponential backoff strategy
    FullJitterBackoff,
}
```

## Command Admin UI 

Which can be inspected in the new **Command Admin UI** where you can view summary stats of all executed Commands and **APIs** 
in the **Summary** tab, e.g:

[![](/img/pages/commands/AddTodoCommand-summary.png)](/img/pages/commands/AddTodoCommand-summary.png)

### Latest Command Executions

It also maintains a rolling log of the latest executed commands in the **Latest** tab:

[![](/img/pages/commands/AddTodoCommand-latest.png)](/img/pages/commands/AddTodoCommand-latest.png)

### Failed Command Executions

Whilst the **Errors** tab shows a list of all failed **Command** and **API** executions:

[![](/img/pages/commands/AddTodoCommand-errors.png)](/img/pages/commands/AddTodoCommand-errors.png)

### Execute Internal Commands

A benefit of using Commands as the building block for your internal logic is that they enjoy many of the same benefits
of ServiceStack's message-based Services where they can be invoked using just the Command **Name** and a **Request** Body
which allows them to be discovered and executed from the **Explore** Tab:

[![](/img/pages/commands/AddTodoCommand-execute.png)](/img/pages/commands/AddTodoCommand-execute.png)

In this way they can be treated like **Internal APIs** for being able to invoke internal functionality that's only accessible 
by **Admin** Users.

### Group Commands by Tag

Just like ServiceStack Services they can be grouped by **Tag** which can be used to group related commands: 

```csharp
[Tag("Todos")]
public class AddTodoCommand() : IAsyncCommand<CreateTodo> {}
```

## MQ Integration

Although `CommandsFeature` is a standalone feature we're registering it in the new Identity Auth Templates `Configure.Mq.cs`
which already uses the Background MQ to execute messages in managed background threads where it's used to send Identity Auth emails:

```csharp
public class ConfigureMq : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            services.AddSingleton<IMessageService>(c => new BackgroundMqService());
            services.AddPlugin(new CommandsFeature());
        })
        .ConfigureAppHost(afterAppHostInit: appHost => {
            var mqService = appHost.Resolve<IMessageService>();

            //Register ServiceStack APIs you want to be able to invoke via MQ
            mqService.RegisterHandler<SendEmail>(appHost.ExecuteMessage);
            mqService.Start();
        });
}
```

Despite being 2 independent features, they work well together as the Background MQ can be used to execute Commands in
managed background threads of which a single thread is used to execute each Request Type by default (configurable per request).

You'd typically want to use queues to improve scalability by reducing locking and concurrency contention of heavy resources
by having requests queued and executed in a managed background thread where it's able to execute requests as fast as it can without contention. 
Queues are also a great solution for working around single thread limitations of resources like writes to SQLite databases.

## Use Case - SQLite Writes

As we've started to use server-side SQLite databases for our new Apps given its [many benefits](/ormlite/litestream)
we needed a solution to workaround its limitation of not being able to handle multiple writes concurrently.

One of the benefits of using SQLite is creating and managing multiple databases is relatively cheap, so we can mitigate
this limitation somewhat by maintaining different subsystems in separate databases, e.g:

[![](/img/pages/commands/pvq-databases.png)](/img/pages/commands/pvq-databases.png)

But each database can only be written to by a single thread at a time, which we can now easily facilitate with 
**Background MQ** and **MQ Command DTOs**.

### MQ Command DTOs

We can use the new `[Command]` attribute to be able to execute multiple commands on a single Request DTO Properties:

```csharp
[Tag(Tag.Tasks)]
[Restrict(RequestAttributes.MessageQueue), ExcludeMetadata]
public class DbWrites : IGet, IReturn<EmptyResponse>
{
    [Command<CreatePostVoteCommand>]
    public Vote? CreatePostVote { get; set; }
    
    [Command<CreateCommentVoteCommand>]
    public Vote? CreateCommentVote { get; set; }
    
    [Command<CreatePostCommand>]
    public Post? CreatePost { get; set; }
    
    [Command<UpdatePostCommand>]
    public Post? UpdatePost { get; set; }
    
    [Command<DeletePostsCommand>]
    public DeletePosts? DeletePosts { get; set; }
    
    [Command<DeleteAnswersCommand>]
    public DeleteAnswers? DeleteAnswers { get; set; }
    
    [Command<CreateAnswerCommand>]
    public Post? CreateAnswer { get; set; }
    
    [Command<PostSubscriptionsCommand>]
    public PostSubscriptions? PostSubscriptions { get; set; }
    
    [Command<TagSubscriptionsCommand>]
    public TagSubscriptions? TagSubscriptions { get; set; }    
    //...
}
```

Then to execute the commands we can use the `Request.ExecuteCommandsAsync` extension method for its 
Background MQ API implementation:

```csharp
public class BackgroundMqServices : Service
{
    public Task Any(DbWrites request) => Request.ExecuteCommandsAsync(request);
}
```

Which goes through all Request DTO properties to execute all populated properties with their associated
command, using it as the request for the command.

So after registering the `DbWrites` Command DTO with the MQ Service:

```csharp
mqService.RegisterHandler<DbWrites>(appHost.ExecuteMessage);
```

We can now publish a single `DbWrites` message to execute multiple commands in a single managed background thread:

```csharp
public class NotificationServices(MessageProducer mq) : Service
{
    public object Any(Watch request)
    {
        var userName = Request.GetClaimsPrincipal().GetUserName();

        mq.Publish(new DbWrites
        {
            PostSubscriptions = request.PostId == null ? null : new()
            {
                UserName = userName,
                Subscriptions = [request.PostId.Value],
            },
            TagSubscriptions = request.Tag == null ? null : new()
            {
                UserName = userName,
                Subscriptions = [request.Tag],
            },
        });
        
        mq.Publish(new AnalyticsTasks {
            WatchRequest = request,
        });
    }
}
```

We also benefit from its natural parallelism where write requests to different Databases are executed in parallel.