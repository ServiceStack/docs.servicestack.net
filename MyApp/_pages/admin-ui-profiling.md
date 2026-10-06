---
title: Logging & Profiling UI
---

The Request Logging & Profiling UIs bring an invaluable new level of observability into your App, from being able to quickly inspect and browse incoming requests, to tracing their behavior from their generated events in the [Diagnostic Source](https://docs.microsoft.com/en-us/dotnet/api/system.diagnostics.diagnosticsource?view=net-6.0) capabilities added all throughout ServiceStack, which both power the new UIs and enables new introspectability from code where you can now to tap in to inspect & debug when each diagnostic event occurs.

To follow requests across servers, message queues and Background Jobs in your own tracing backend, enable
OpenTelemetry and Profiling in a .NET 8+ App with:

::: sh
npx add-in opentelemetry
:::

This exports traces and metrics over OTLP to your collector, and adds a **Trace view** to the Profiling UI.
See [OpenTelemetry Tracing](#opentelemetry-tracing) to learn what it traces and how to configure it.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="LgQHTSHSk1g" style="background-image: url('https://img.youtube.com/vi/LgQHTSHSk1g/maxresdefault.jpg')"></lite-youtube>

To enable local Profiling without OpenTelemetry, use:

::: sh 
npx add-in profiling
:::

This adds [Modular Startup](/modular-startup) configuration to your Host project that registers Profiling
when running your App in [DebugMode](/debugging#debugmode) (i.e. Development):

```csharp
public class ConfigureProfiling : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            if (context.HostingEnvironment.IsDevelopment())
            {
                services.AddPlugin(new ProfilingFeature
                {
                    IncludeStackTrace = true,
                });
            }
        });
}
```

Whilst Request Logs can be added with:

::: sh 
npx add-in requestlogs
:::

Or if you prefer to store Request Logs in an SQLite database:

::: sh 
npx add-in sqlitelogs
:::

Or to store Request Logs in PostgreSQL, SQL Server or MySql:

::: sh 
npx add-in db-requestlogs
:::

The default configuration looks at providing useful information during development, where the response request bodies are captured in the Request Logger and the StackTrace is captured on the important events where they can be useful.

### Configuration

Depending on your App you'll want to change these defaults, e.g. if you're persisting the request logs using the [CSV Request Logger](/request-logger#csv-request-logger) or [Redis Request Logger](/request-logger#redis-request-logger) it may not be feasible to **capture all API responses** if they're very large.

If enabled, **StackTraces** are captured in these important events:
 - **ServiceStack:** Before a Service Gateway Request is sent
 - **OrmLite:** Opening a connection or rolling back a transaction
 - **Redis:** Opening a connection, auto retrying a failed command, renting & returning clients from a redis manager pool

The latter of which is useful when resolving [concurrent usage issues](/redis/troubleshooting).

As it adds overhead, profiling should only be added when used, e.g. during development or when needing to debug production issues. Although you may always want to capture request logs depending on how important it is to maintain an audit of completed API requests. Should it be needed, both Logging & Profiling plugins offer several configuration options to control the type, info & events captured.

Whichever features you have registered will dynamically appear in the Admin UI's sidebar for quick navigation:

![](/img/pages/admin-ui/admin-ui-nav.png)

### Request Logging UI

Clicking on **Logging** navigates to the Request Logging UI which displays each API request processed in a grid of useful summary information showing high-level information for each HTTP API request:

![](/img/pages/admin-ui/logging-splash.png)

This screenshot shows an example of a non-authenticated user navigating to a protected page before signing in then querying and submitting a new Booking in the [AutoQuery CRUD Bookings Demo](/autoquery/crud-bookings) using [Locode's](/locode/) Auto UI, in which we can see error API Responses are highlighted in **red** and redirects highlighted in **yellow**.

The top navigation controls which results are displayed with:
 - **Has Errors** - Show only requests with errors
 - **Has Response** - Show only requests with response bodies
 - **Reset Filters Icon** - Clear all filters (ESC)
 - **Left/Right Icons** - Navigate to previous/next pages (LEFT/RIGHT)
 - **Refresh Icon** - Reload the latest results

This same user workflow is also captured in the Profiling UI in much finer granularity, capturing all the events performed by APIs:

![](/img/pages/admin-ui/profiling-splash.png)

Clicking on an entry previews it in more detail, e.g. clicking on the first **/api/QueryBookings** will show the API Request and Response made:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/logging-QueryBookings.png">
</div>

By default it shows the Request and Response DTOs in JSON, but clicking on preview often shows a more human-friendly view:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/logging-QueryBookings-preview.png">
</div>

A useful feature from having a dedicated UX-friendly UI is enabling quick navigation where each **blue** link will display results filtered to all matching requests, whilst the **trace request** link will navigate to the Profiling UI showing all diagnostic events performed within that request.

### Inspect Cookies and JWT Tokens

In addition to Request & Response DTOs, the Logging UI also shows all captured HTTP information including HTTP Request Headers with any Cookies being extracted into its own view for better readability as well as decoded JWT payload from the **ss-tok** cookie when using [JWT Auth](/auth/jwt-authprovider) with non-encrypted JWT defaults.

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/logging-http-details.png">
</div>

Lets now take a look at the failed **CreateBooking** request to see what went wrong:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/logging-CreateBooking-validation.png">
</div>

Ok, so the Admin User (identified from JWT info) tried to create an empty booking which was rejected by its server declarative validation rules which sees these context validation errors surfaced into Locode's UI:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/locode/CreateBooking-invalid.png">
</div>

We can then see this was quickly rectified in the next request with a successful Booking submitted:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/logging-CreateBooking.png">
</div>

Clicking on **trace request** we can see all the diagnostic events performed in this API request within the **RequestBefore** and **RequestAfter** events which took **0.07s** to complete.

## Profiling UI

Following diagnostic conventions you'll typically see 2 entries for each event, created before and after each action, measuring the duration and capturing the last event before any error occurred.

![](/img/pages/admin-ui/profiling-CreateBooking-trace.png)

### SQL Profiling

Clicking on an entry will show more useful contextual information captured for each event, e.g. if you click on OrmLite's **CommandAfter** event you'll be able to see the generated SQL + Params executed by OrmLite:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling-CreateBooking-CommandAfter.png">
</div>

The profiling detail view also contains **blue** links to filter matching diagnostic events and showing useful information like the **Thread**, **User** this command was executed by as well as the **duration** and **timestamp** when it occurred.

### Slowest Queries

The **Slowest Queries** view lists the slowest database queries since your App started, showing when each query ran,
how long it took, the [named connection](/ormlite/getting-started#multiple-database-connections) it ran on and the
start of its SQL. By default the 50 slowest OrmLite commands are retained after they're no longer in the latest
profiled events, so slow queries aren't lost in busy Apps.

Selecting a query shows everything that was captured for it, including its full SQL, params, the connection and
operation that ran it, and the trace and user it was run for. Use the maximize button next to the close button to
view the panel in full-screen.

Configure how many queries are retained with `SlowQueriesLimit`, or disable it with `0`:

```csharp
services.AddPlugin(new ProfilingFeature {
    SlowQueriesLimit = 100,
});
```

### Explain, Analyze and Run Queries

When the [Database Admin](/admin-ui-database) plugin is also registered, any `SELECT` query captured by the
Profiling UI can be explained and re-run from its detail panel:

```csharp
services.AddPlugin(new ProfilingFeature());
services.AddPlugin(new AdminDatabaseFeature());
```

**Explain** shows the [query plan](/ormlite/explain) your RDBMS uses for the query without running it, making it
easy to see why a query is slow, e.g. if it's scanning a table instead of using an index:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling/profiling-explain.webp">
</div>

**Analyze** runs the query to include what actually happened, like the actual rows and time of each step. It's most
useful when the plan looks right but the query is still slow, as it shows where your RDBMS's estimates were wrong.
As it needs to run the query it takes as long as the query does, so it's best to try **Explain** first:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling/profiling-analyze.webp">
</div>

**Analyze** is only shown for databases that support it, which are PostgreSQL, SQL Server, MySQL and MariaDB.

**Run Query** runs the query again with its original params and shows its first rows and how long it took:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling/profiling-run-query.webp">
</div>

These features are designed to be safe to use on a live database:

- Only `SELECT` queries your App has already run can be explained or re-run, selected from the profiled queries.
  SQL can't be entered or edited.
- Queries are run in a transaction that's rolled back.
- They require the `Admin` role, and run on the same named connection as the original query.
- **Run Query** returns the first 20 rows, configurable with `RunQueryLimit`:

```csharp
services.AddPlugin(new AdminDatabaseFeature {
    RunQueryLimit = 50,
});
```

Queries run by these features aren't profiled, so they don't appear in the slowest queries.

### Redis Profiling

Redis simpler commands are captured in a list of arguments:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling-redis-CommandAfter.png">
</div>

### Purchase API Events Example

Surfacing the high-level events of your service implementations provides a new observability perspective that's harder to infer from trying to follow the details in the code. 

For example our [Order Page](https://account.servicestack.net/buy/BUS) generated over **150+ events** capturing all the SQL commands to store order, subscription, customer, payment information and generated License and Order confirmation emails, HttpClient integration requests with Stripe and MQ requests for sending emails in a [Background MQ Worker thread](/background-mq).

![](/img/pages/admin-ui/profiling-servicestack-buy1.png)

### HttpClient Profiling

HttpClient profiling is implemented a little differently then other events in that it builds on the existing HttpClient diagnostic events so it's able to capture general usage of .NET's HttpClient, which is how it's able to capture our [integration with Stripe](/stripe):

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling-servicestack-client-stripe.png">
</div>

### JsonApiClient Profiling

Although we're able to provide richer profiling for our .NET 10+ [JsonApiClient](/csharp-client#jsonapiclient) which has access to typed Request DTOs for submitting API Requests:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling-client-api-request.png">
</div>

As well as Response DTOs returned in API Responses:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling-client-api-response.png">
</div>

We also can examine API Error responses in richer detail, e.g:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling-client-api-error.png">
</div>

### MQ Profiling

Since they execute APIs on an entirely different endpoint and worker threads, MQ Requests are tracked independently from HTTP APIs starting their own diagnostic Activity which enables being able to trace all events generated from an MQ Request. Here's an example used to handle sending customer emails:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling-MqRequestBefore.png">
</div>

### Service Gateway Profiling

The [Service Gateway](/service-gateway) leverages ServiceStack's message-based design to enable loosely-coupled service integrations enabling systems to split into Microservices without needing to change any of the internal services consuming them. As they're not RPC invocations their messages are introspectable and can be observed in the Profiling UI:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling-gateway.png">
</div>

### Profile Custom Info

We've made it easy to add a custom tracking field with the same functionality as the primary fields where they can be sorted and filtered. This could be used to attach a **Tenant Id** to the profiling information by providing a Label and Resolver function to resolve it, e.g:

```csharp
new ProfilingFeature {
    TagLabel = "Tenant",
    TagResolver = req => MyResolveTenant(req),
}
```

Where it will be displayed in all profiling results, e.g:

![](/img/pages/admin-ui/profiling-tenant-summary.png)

::: tip
The number and order of fields can be customized in `SummaryFields` collection in `ProfilingFeature`
:::

This custom info also appears in the detail page as a link which can be used to filter events with the same tenant id:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling-tenant-detail.png">
</div>

### Profile Custom Metadata

You're also able to capture custom information for different events and have them appear in the detail page, e.g:

```csharp
new ProfilingFeature {
    DiagnosticEntryFilter = (entry, evt) => {
        if (evt is RequestDiagnosticEvent requestEvent)
        {
            var req = requestEvent.Request;
            entry.Meta = new() {
                ["RemoteIp"] = req.RemoteIp,
                ["Referrer"] = req.UrlReferrer?.ToString(),
                ["Language"] = req.GetHeader(HttpHeaders.AcceptLanguage),
            };
        }
    },
}
```

Where it will be populated in the **Meta** section arguments:

<div class="block flex justify-center items-center">
    <img class="max-w-screen-md" src="/img/pages/admin-ui/profiling-custom-meta.png">
</div>

### Access Diagnostic Events in Code

In addition to powering the profiling UI, the diagnostic events added throughout ServiceStack can be observed in code to tap in and inspect when these diagnostic events occur. It follows the standard Diagnostic Source model where you specify which listeners you want observed in `OnNext(DiagnosticListener)` that you can then access in `OnNext(KeyValuePair<string,object>)`.

Microsoft's Diagnostic Events like HttpClient uses anonymous classes making them unnecessarily difficult to access, which can be made easier by using our [Reflection Utils ToObjectDictionary()](/reflection-utils#converting-instances-from-an-object-dictionary).

As they offer better utility, we've opted to use idiomatic strong types and string constants instead where they're better accessible from C#. 

You can use this skeleton class for a quick way to get started showing how to subscribe to all ServiceStack Diagnostic Sources and the event names and types to handle all profiling events:

```csharp
// Register your Diagnostic Observer
var observer = new MyDiagnosticObserver();
var subscription = DiagnosticListener.AllListeners.Subscribe(observer);

public sealed class MyDiagnosticObserver : 
    IObserver<DiagnosticListener>, 
    IObserver<KeyValuePair<string, object>>
{
    private readonly List<IDisposable> subscriptions = new();

    /* Specify which Profiling Events you want to observe */
    void IObserver<DiagnosticListener>.OnNext(DiagnosticListener diagnosticListener)
    {
        if (diagnosticListener.Name is Diagnostics.Listeners.ServiceStack         
         || diagnosticListener.Name is Diagnostics.Listeners.OrmLite
         || diagnosticListener.Name is Diagnostics.Listeners.Redis
         || diagnosticListener.Name is Diagnostics.Listeners.Client
         || diagnosticListener.Name is Diagnostics.Listeners.HttpClient)
        {
            var subscription = diagnosticListener.Subscribe(this);
            subscriptions.Add(subscription);
        }
    }

    /* Handle Profiling Events */
    public void OnNext(KeyValuePair<string, object> kvp)
    {
        /** ServiceStack */
        /*** Request */
        if (kvp.Key == Diagnostics.Events.ServiceStack.WriteRequestBefore && kvp.Value is RequestDiagnosticEvent reqBefore) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.ServiceStack.WriteRequestAfter && kvp.Value is RequestDiagnosticEvent reqAfter) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.ServiceStack.WriteRequestError && kvp.Value is RequestDiagnosticEvent reqError) { /*...*/ }
        
        /*** Gateway */
        if (kvp.Key == Diagnostics.Events.ServiceStack.WriteGatewayBefore && kvp.Value is RequestDiagnosticEvent gatewayBefore) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.ServiceStack.WriteGatewayAfter && kvp.Value is RequestDiagnosticEvent gatewayAfter) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.ServiceStack.WriteGatewayError && kvp.Value is RequestDiagnosticEvent gatewayError) { /*...*/ }
        
        /*** MQ */
        if (kvp.Key == Diagnostics.Events.ServiceStack.WriteMqRequestBefore && kvp.Value is MqRequestDiagnosticEvent mqReqBefore) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.ServiceStack.WriteMqRequestAfter && kvp.Value is MqRequestDiagnosticEvent mqReqAfter) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.ServiceStack.WriteMqRequestError && kvp.Value is MqRequestDiagnosticEvent mqReqError) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.ServiceStack.WriteMqRequestPublish && kvp.Value is MqRequestDiagnosticEvent mqReqPublish) { /*...*/ }
        
        /** Client */    
        if (kvp.Key == Diagnostics.Events.Client.WriteRequestBefore && kvp.Value is HttpClientDiagnosticEvent clientBefore) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.Client.WriteRequestAfter && kvp.Value is HttpClientDiagnosticEvent clientAfter) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.Client.WriteRequestError && kvp.Value is HttpClientDiagnosticEvent clientError) { /*...*/ }
        
        /** HttpClient */
        if (kvp.Key == Diagnostics.Events.HttpClient.OutStart)
        {
            var obj = kvp.Value.ToObjectDictionary();
        }
        if (kvp.Key == Diagnostics.Events.HttpClient.Request)
        {
            var obj = kvp.Value.ToObjectDictionary();
        }
        if (kvp.Key == Diagnostics.Events.HttpClient.OutStop)
        {
             var obj = kvp.Value.ToObjectDictionary();
        }
        if (kvp.Key == Diagnostics.Events.HttpClient.Response)
        {
            var obj = kvp.Value.ToObjectDictionary();
        }

        /** OrmLite */
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteCommandBefore && kvp.Value is OrmLiteDiagnosticEvent dbBefore) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteCommandAfter && kvp.Value is OrmLiteDiagnosticEvent dbAfter) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteCommandError && kvp.Value is OrmLiteDiagnosticEvent dbError) { /*...*/ }
        
        /*** OrmLite Connections */
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteConnectionOpenBefore && kvp.Value is OrmLiteDiagnosticEvent dbOpenBefore) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteConnectionOpenAfter && kvp.Value is OrmLiteDiagnosticEvent dbOpenAfter) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteConnectionOpenError && kvp.Value is OrmLiteDiagnosticEvent dbOpenError) { /*...*/ }        
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteConnectionCloseBefore && kvp.Value is OrmLiteDiagnosticEvent dbCloseBefore) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteConnectionCloseAfter && kvp.Value is OrmLiteDiagnosticEvent dbCloseAfter) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteConnectionCloseError && kvp.Value is OrmLiteDiagnosticEvent dbCloseError) { /*...*/ }        
        
        /*** OrmLite Transactions */
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteTransactionOpen && kvp.Value is OrmLiteDiagnosticEvent commitOpen) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteTransactionCommitBefore && kvp.Value is OrmLiteDiagnosticEvent commitBefore) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteTransactionCommitAfter && kvp.Value is OrmLiteDiagnosticEvent commitAfter) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteTransactionCommitError && kvp.Value is OrmLiteDiagnosticEvent commitError) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteTransactionRollbackBefore && kvp.Value is OrmLiteDiagnosticEvent rollbackBefore) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteTransactionRollbackAfter && kvp.Value is OrmLiteDiagnosticEvent rollbackAfter) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.OrmLite.WriteTransactionRollbackError && kvp.Value is OrmLiteDiagnosticEvent rollbackError) { /*...*/ }

        /** Redis */
        if (kvp.Key == Diagnostics.Events.Redis.WriteCommandBefore && kvp.Value is RedisDiagnosticEvent redisBefore) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.Redis.WriteCommandRetry && kvp.Value is RedisDiagnosticEvent redisRetry) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.Redis.WriteCommandAfter && kvp.Value is RedisDiagnosticEvent redisAfter) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.Redis.WriteCommandError && kvp.Value is RedisDiagnosticEvent redisError) { /*...*/ }        
        
        /*** Redis Connections */
        if (kvp.Key == Diagnostics.Events.Redis.WriteConnectionOpenBefore && kvp.Value is RedisDiagnosticEvent redisOpenBefore) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.Redis.WriteConnectionOpenAfter && kvp.Value is RedisDiagnosticEvent redisOpenAfter) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.Redis.WriteConnectionOpenError && kvp.Value is RedisDiagnosticEvent redisOpenError) { /*...*/ }        
        if (kvp.Key == Diagnostics.Events.Redis.WriteConnectionCloseBefore && kvp.Value is RedisDiagnosticEvent redisCloseBefore) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.Redis.WriteConnectionCloseAfter && kvp.Value is RedisDiagnosticEvent redisCloseAfter) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.Redis.WriteConnectionCloseError && kvp.Value is RedisDiagnosticEvent redisCloseError) { /*...*/ }        
        
        /*** Redis Pools */
        if (kvp.Key == Diagnostics.Events.Redis.WritePoolRent && kvp.Value is RedisDiagnosticEvent redisPoolBefore) { /*...*/ }
        if (kvp.Key == Diagnostics.Events.Redis.WritePoolReturn && kvp.Value is RedisDiagnosticEvent redisPoolAfter) { /*...*/ }
    }

    void IObserver<DiagnosticListener>.OnCompleted()
    {
        subscriptions.ForEach(x => x.Dispose());
        subscriptions.Clear();
    }
    public void OnCompleted() {}
    void IObserver<DiagnosticListener>.OnError(Exception error) {}
    public void OnError(Exception error) {}
}
```

### Request Logs Configuration

The [Request Logs](/request-logger) feature has a number of configuration options controlling which requests are logged and the level of logging captured about them.

```csharp
class RequestLogsFeature 
{
    // Limit API access to users in role
    string AccessRole = RoleNames.Admin;

    // RequestLogs service Route, default is /requestlogs
    string AtRestPath = "/requestlogs";

    // Size of memory logger circular buffer
    int? Capacity;

    // Turn On/Off Session Tracking
    bool EnableSessionTracking;

    // Turn On/Off Logging of Raw Request Body, default is Off
    bool EnableRequestBodyTracking;

    // Turn On/Off Raw Request Body Tracking per-request
    Func<IRequest, bool> RequestBodyTrackingFilter;

    // Turn On/Off Tracking of Responses
    bool EnableResponseTracking = false;

    // Turn On/Off Tracking of Responses per-request
    Func<IRequest, bool> ResponseTrackingFilter;
    
    // Turn On/Off Tracking of Exceptions
    bool EnableErrorTracking = true;

    // Don't log matching requests
    Func<IRequest, bool> SkipLogging;

    // Change the RequestLogger provider. Default is InMemoryRollingRequestLogger
    IRequestLogger RequestLogger;

    // Don't log requests of these types. By default RequestLog's are excluded
    Type[] ExcludeRequestDtoTypes;

    // Don't log request body's for services with sensitive information.
    // By default Auth and Registration requests are hidden.
    Type[] HideRequestBodyForRequestDtoTypes;
    
    // Don't log Response DTO Types
    Type[] ExcludeResponseTypes;

    // Limit logging to only Service Requests
    bool LimitToServiceRequests = true;
    
    // Customize Request Log Entry
    Action<IRequest, RequestLogEntry> RequestLogFilter;

    // Ignore logging and serializing these Request DTOs
    List<Type> IgnoreTypes; = new();
    
    // Use custom Ignore Request DTO predicate
    Func<object,bool> IgnoreFilter = DefaultIgnoreFilter;

    // Default take, if none is specified
    int DefaultLimit = 100;

    // Change what DateTime to use for the current Date (defaults to UtcNow)
    Func<DateTime> CurrentDateFn = () => DateTime.UtcNow;
}
```

### Profiling Configuration

The `ProfilingFeature` offers similar functionality in specifying which sources to observe and profiling events to capture as well as options for customizing the Profiling UI, e.g you can limit generating & capturing diagnostic events to just [OrmLite](/ormlite/) and [Redis](/redis/) with:

```csharp
Plugins.Add(new ProfilingFeature {
    Profile = ProfileSource.OrmLite | ProfileSource.Redis
});
```

For further configuration options see the documented plugin below:

```csharp
[Flags]
enum ProfileSource
{
    None         = 0,
    ServiceStack = 1 << 0,
    Client       = 1 << 1,
    Redis        = 1 << 2,
    OrmLite      = 1 << 3,
    Jobs         = 1 << 4,
    All          = ServiceStack | Client | OrmLite | Redis | Jobs,
}

class ProfilingFeature
{
    // Limit API access to users in role
    string AccessRole = RoleNames.Admin;

    // Which features to Profile, default all
    ProfileSource Profile = ProfileSource.All;

    // Size of circular buffer of profiled events
    int Capacity = 10000;

    // The number of slowest OrmLite queries to retain, 0 to disable
    int SlowQueriesLimit = 50;

    // Don't profile OrmLite events of connections with these tags
    HashSet<string> ExcludeTags = new();

    // Don't log requests of these types. By default Profiling/Metadata requests are excluded
    List<Type> ExcludeRequestDtoTypes = new();

    // Don't log requests from these path infos prefixes
    List<string> ExcludeRequestPathInfoStartingWith = new();
    
    // Turn On/Off Tracking of Responses per-request
    Func<IRequest, bool>? ExcludeRequestsFilter;

    // Don't log request body's for services with sensitive information.
    // By default Auth and Registration requests are hidden.
    List<Type> HideRequestBodyForRequestDtoTypes = new();

    // Don't log Response DTO Types
    List<Type> ExcludeResponseTypes = new();
    
    // Turn On/Off Tracking of Responses per-request
    Func<IRequest, bool>? ResponseTrackingFilter;
    
    // Whether to include CallStack StackTrace 
    bool? IncludeStackTrace;

    // Attach custom data to request profiling summary fields
    Func<IRequest,string?>? TagResolver;
    
    // Label to show for custom tag
    string? TagLabel;
    
    // The properties displayed in Profiling UI results grid
    List<string> SummaryFields;
    
    // Default take, if none is specified
    int DefaultLimit = 50;

    // Optional trace backend URL containing {traceId}. HTTPS, or HTTP for localhost
    string? ExternalTraceUrlTemplate;
    
    // Customize DiagnosticEntry that gets captured
    Action<DiagnosticEntry, DiagnosticEvent>? DiagnosticEntryFilter;

    // Maximum char/byte length of string response body
    int MaxBodyLength = 10 * 10 * 1024;
}
```

## OpenTelemetry Tracing

Profiling shows what happened inside one App. When a request queues a Job that runs on another server,
publishes a message or calls another service, [OpenTelemetry](https://opentelemetry.io/docs/languages/dotnet/)
connects that work into a single distributed trace that you can follow in any OTLP-compatible backend, such
as Jaeger, Grafana Tempo, Honeycomb, Datadog or the .NET Aspire Dashboard.

On **.NET 8+**, ServiceStack emits standard .NET `ActivitySource` traces and `Meter` metrics for API
operations, messaging and Background Jobs. ServiceStack doesn't depend on the OpenTelemetry SDK: your App
chooses the exporter, sampling and collector, and nothing is recorded until a listener is registered.

### Add OpenTelemetry to your App

Add OpenTelemetry to an existing App with:

::: sh
npx add-in opentelemetry
:::

This installs the `OpenTelemetry.Extensions.Hosting`, `OpenTelemetry.Instrumentation.AspNetCore`,
`OpenTelemetry.Instrumentation.Http` and `OpenTelemetry.Exporter.OpenTelemetryProtocol` packages and adds
this [Modular Startup](/modular-startup) configuration:

```csharp
public class ConfigureProfiling : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            services.AddOpenTelemetry()
                .ConfigureResource(resource => resource
                    .AddService(context.Configuration["OTEL_SERVICE_NAME"] 
                            ?? context.HostingEnvironment.ApplicationName,
                        serviceVersion: typeof(ConfigureProfiling).Assembly.GetName().Version?.ToString())
                    .AddAttributes(new Dictionary<string, object> {
                        ["deployment.environment.name"] = context.HostingEnvironment.EnvironmentName,
                    }))
                .WithTracing(tracing => tracing
                    .AddAspNetCoreInstrumentation()
                    .AddHttpClientInstrumentation()
                    .AddSource(OperationDiagnostics.Name, MessagingDiagnostics.Name, JobsDiagnostics.Name)
                    .AddOtlpExporter())
                .WithMetrics(metrics => metrics
                    .AddAspNetCoreInstrumentation()
                    .AddMeter(OperationDiagnostics.Name, MessagingDiagnostics.Name, JobsDiagnostics.Name)
                    .AddOtlpExporter());

            if (context.HostingEnvironment.IsDevelopment())
            {
                services.AddPlugin(new ProfilingFeature {
                    IncludeStackTrace = true,
                    ExternalTraceUrlTemplate = context.Configuration["OTEL_TRACE_URL_TEMPLATE"],
                });
            }
        });
}
```

ASP.NET Core and `HttpClient` instrumentation cover incoming HTTP requests and outbound HTTP calls, while
the three ServiceStack sources cover API operations, messaging and Background Jobs. OpenTelemetry is enabled
in every environment, while the local Profiling UI is only registered in Development.

::: info
The `opentelemetry` add-in includes everything the `profiling` add-in does. Both create a
`Configure.Profiling.cs`, so use one or the other.
:::

### Configure the exporter

The exporter is configured with the standard OpenTelemetry environment variables, so the same build can send
traces to a different collector in each environment:

| Variable | Used for |
| --- | --- |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Your collector's OTLP endpoint. Defaults to `http://localhost:4317` |
| `OTEL_EXPORTER_OTLP_PROTOCOL` | `grpc` (default) or `http/protobuf` |
| `OTEL_EXPORTER_OTLP_HEADERS` | Credentials your hosted backend needs, e.g. an API key header |
| `OTEL_SERVICE_NAME` | The service name shown in your backend. Defaults to your App's name |
| `OTEL_TRACE_URL_TEMPLATE` | Optional link from the Profiling UI to your backend, [see below](#open-a-trace-in-your-backend) |

To try it locally without an account, run the [.NET Aspire Dashboard](https://learn.microsoft.com/en-us/dotnet/aspire/fundamentals/dashboard/standalone)
in Docker. It receives OTLP on the default port, so no configuration is needed:

::: sh
docker run --rm -it -p 18888:18888 -p 4317:18889 mcr.microsoft.com/dotnet/aspire-dashboard:latest
:::

Then open the login link printed in its output to see your App's traces and metrics.

Sampling is configured in the tracing builder. For example, to export 10% of new traces while always
following the sampling decision of an upstream service:

```csharp
.WithTracing(tracing => tracing
    .SetSampler(new ParentBasedSampler(new TraceIdRatioBasedSampler(0.1)))
    //...
```

Sampling only affects what's exported. The Profiling UI keeps its own bounded history, controlled by
`ProfilingFeature.Capacity`.

### What ServiceStack emits

#### Traces

| Source | Spans |
| --- | --- |
| `ServiceStack` | A `ServiceStack {Operation}` span for each API request, nested under ASP.NET Core's HTTP server span |
| `ServiceStack.Messaging` | A `send {queue}` producer span when a message is published, and a `process {queue}` consumer span when it's processed, for Background MQ, Redis MQ and RabbitMQ |
| `ServiceStack.Jobs` | A consumer span for each Job execution that continues the trace of the request that queued it |

ServiceStack adds one span inside ASP.NET Core's HTTP span instead of creating a second HTTP span. Operation
spans are tagged with:

| Attribute | Value |
| --- | --- |
| `servicestack.operation` | The Request DTO name, e.g. `GetOrders` |
| `http.request.method` | The HTTP method |
| `http.route` | The matched route template, e.g. `/orders/{Id}`, never the raw URL |
| `http.response.status_code` | The response status code |
| `servicestack.outcome` | `success`, `client_error`, `error`, `cancelled` or `unknown` |
| `exception.type` | The exception type, for failed requests |

Only server failures are marked as errors, so validation and authorization responses don't trigger your
error alerts:

| Response | Outcome | Span status |
| --- | --- | --- |
| 1xx - 3xx | `success` | Ok |
| 4xx, e.g. validation or authorization errors | `client_error` | Ok |
| 5xx, or an unhandled exception | `error` | Error |
| Request cancelled | `cancelled` | Unset |

Request and response bodies, user ids and exception messages aren't added to spans. Only requests for known
API operations get an operation span and metrics, so requests for unknown `/api/{Request}` names, static files
and redirects don't add new metric series.

Messaging spans follow the OpenTelemetry messaging conventions. The destination is the queue name, e.g.
`send mq:CreateOrder.inq` and `process mq:CreateOrder.inq`, and both spans are tagged with:

| Attribute | Value |
| --- | --- |
| `messaging.system` | `servicestack.background`, `redis` or `rabbitmq` |
| `messaging.operation.type` | `send` or `process` |
| `messaging.destination.name` | The queue name, e.g. `mq:CreateOrder.inq` |
| `messaging.message.id` | The message's `IMessage.Id` |
| `error.type` | The exception type, when sending or processing failed |

#### Metrics

| Metric | Type | Description |
| --- | --- | --- |
| `servicestack.operation.duration` | Histogram (s) | How long API operations took |
| `servicestack.operation.active` | UpDownCounter | API operations currently executing |
| `servicestack.operation.errors` | Counter | API operations with an `error` outcome |

Operation metrics are tagged with `servicestack.operation`, `http.request.method`, `http.route` and
`servicestack.outcome`, all of which have a limited set of values so they're safe to use as metric
dimensions. They're recorded whether or not a trace is sampled.

The `ServiceStack.Messaging` meter records:

| Metric | Type | Description |
| --- | --- | --- |
| `messaging.client.sent.messages` | Counter | Messages a producer sent |
| `messaging.client.consumed.messages` | Counter | Messages delivered to a consumer |
| `messaging.process.duration` | Histogram (s) | How long processing a message took |

Messaging metrics are tagged with `messaging.system`, `messaging.destination.name` and, when sending or
processing failed, `error.type`.

For Background Jobs metrics, see [Background Jobs OpenTelemetry](/jobs/monitoring#opentelemetry).

#### Detailed spans

To see where time is spent inside an API, enable spans for the request filters, the service invocation and
AutoQuery execution:

```csharp
OperationDiagnostics.EnableDetailedSpans = true;
```

These are disabled by default to keep the number of spans per request low.

### Messages and Jobs

Trace context is carried with the work, so a message or Job continues the trace of the request that started
it, even when it's processed on a different server:

- **Messages** carry the W3C `traceparent` and `tracestate` in their `Meta` dictionary, which RabbitMQ sends
  as message headers. Your own `Meta` entries are preserved, and the existing `IMessage.TraceId` is
  unchanged.
- **Background Jobs** store the trace context in the `BackgroundJob.TraceId` column when they're queued, and
  continue it when they run, including Jobs that are retried or recovered by another server.

Messages and Jobs without trace context, including those queued before upgrading, start a new trace instead
of failing.

Custom `IMessageQueueClient` implementations can join the same trace with `MessagingDiagnostics`:

```csharp
public void Publish(string queueName, IMessage message)
{
    using var scope = MessagingDiagnostics.StartPublish("my-mq", queueName, message);
    MessagingDiagnostics.Inject(message); // adds traceparent and tracestate to message.Meta
    try
    {
        // send the message...
    }
    catch (Exception ex)
    {
        scope.RecordError(ex);
        throw;
    }
}
```

The first argument is the `messaging.system` of your queue. Disposing the scope ends the span and records
the `messaging.client.sent.messages` metric. Messages are processed by ServiceStack's shared message handler,
which reads the trace context with `MessagingDiagnostics.StartProcess(message, system, destination)`.

### Traces in the Profiling UI

With OpenTelemetry registered, Profiling events are recorded with the W3C **Trace Id** and **Span Id** of the
work they belong to. OrmLite, Redis and HttpClient events are correlated with the API request, message or Job
that ran them, so one Trace Id brings together everything a request caused on this server.

Click a Trace Id, or paste one into the **Trace Id** filter, to see all of its events in the order they
happened. Two views are available:

- **Details** - the familiar Profiling grid, with each event's full details
- **Trace view** - one row per step, indented under its parent span, with its source, duration and any errors.
  A step that hasn't completed yet is shown as **pending**

Click a Span Id to narrow the results to a single span. The selected view is kept in the URL, so you can
share a link to a trace.

The Profiling UI only shows events retained by this App's bounded Profiling history, and still requires the
Admin role. Spans from other services, or events that are no longer retained, are only in your trace backend.

#### Open a trace in your backend

To link to the complete trace in your tracing backend, set `ExternalTraceUrlTemplate` to an HTTPS URL
containing `{traceId}`, or set the `OTEL_TRACE_URL_TEMPLATE` environment variable when using the add-in:

```csharp
services.AddPlugin(new ProfilingFeature {
    ExternalTraceUrlTemplate = "https://traces.example.org/trace/{traceId}",
});
```

HTTP is also allowed for `localhost`, so you can link to a local Jaeger or Aspire Dashboard during
development:

| Backend | `ExternalTraceUrlTemplate` |
| --- | --- |
| Jaeger | `http://localhost:16686/trace/{traceId}` |
| Aspire Dashboard | `http://localhost:18888/traces/detail/{traceId}` |

An invalid template is ignored, with a warning logged when the App starts.

When a W3C Trace Id is selected, the Trace view shows an **Open in trace backend** link.

#### Without OpenTelemetry

Profiling works the same without OpenTelemetry, where events use their existing request identifiers as their
Trace Id, so you can continue filtering all the events of a request, message or Job.
