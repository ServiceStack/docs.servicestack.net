---
title: Request Loggers
---

Add an In-Memory `IRequestLogger` and service with the default route at `/requestlogs` which maintains a live log of the most recent requests (and their responses). Supports multiple config options incl. Rolling-size capacity, error and session tracking, hidden request bodies for sensitive services, etc.

```cs
Plugins.Add(new RequestLogsFeature());
```

### CSV Request Logger

One of the areas where ServiceStack's [CSV Support](/csv-format) shines is being able to store daily Request Logs in a plain-text structured format, that way they could be immediately inspectable with a text editor or for even better inspection, opened in a spreadsheet and benefit from its filterable, movable, resizable and sortable columns.

To enable CSV Request Logging you just need to register the `RequestLogsFeature` and configure it to use the
[CsvRequestLogger](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/CsvRequestLogger.cs):

```csharp
Plugins.Add(new RequestLogsFeature {
    RequestLogger = new CsvRequestLogger(),
});
```

This will register the CSV Request logger with the following overridable defaults:

```csharp
Plugins.Add(new RequestLogsFeature {
    RequestLogger = new CsvRequestLogger(
        files: new FileSystemVirtualFiles(HostContext.Config.WebHostPhysicalPath),
        requestLogsPattern: "requestlogs/{year}-{month}/{year}-{month}-{day}.csv",
        errorLogsPattern: "requestlogs/{year}-{month}/{year}-{month}-{day}-errors.csv",
        appendEvery: TimeSpan.FromSeconds(1)
    ),
});
```

Where Request Logs are flushed every **1 second** using a background Timer to a daily log maintained in
the logical date format structure above. As it would be useful to be able to inspect any errors in isolation, 
errors are also written to a separate `YYYY-MM-DD-errors.csv` format, in addition to the main Request logs.

### [Custom CSV AutoQuery Data implementation](/autoquery/service#custom-autoquery-data-implementation)

The AutoQuery Service example shows you can quickly create an AutoQuery Data Service that lets you inspect your CSV Request and Error Logs with AutoQuery, which in addition to the rich querying benefits also gives you access to an instant UI in [AutoQuery Viewer](https://github.com/ServiceStack/Admin) to be able to [View your Request Logs](/autoquery/service#view-request-logs-in-autoquery-viewerhttpsgithubcomservicestackadmin).

## Rollbar Request Logger

The [iayos.ServiceStack.RollbarPlugin](https://github.com/daleholborow/iayos.ServiceStack.RollbarPlugin) integrates with [Rollbar](https://rollbar.com) real-time error monitoring solution which has a free tier to log up to 5,000 requests per month.

### Install

To use `RollbarLoggerPlugin` install the [iayos.ServiceStack.RollbarPlugin](https://www.nuget.org/packages/iayos.ServiceStack.RollbarPlugin) NuGet package:

:::copy
`<PackageReference Include="iayos.ServiceStack.RollbarPlugin" Version="0.0.1" />`
:::

Sign Up for a new account on [Rollbar](https://rollbar.com). Then register `RollbarLoggerPlugin` with the your API Key:

```csharp
Plugins.Add(new RollbarLoggerPlugin
{
    ApiKey = rollbarApiKey,
    //..
}
```

Please see the [iayos.ServiceStack.RollbarPlugin](https://github.com/daleholborow/iayos.ServiceStack.RollbarPlugin) project for additional customization options.

## Redis Request Logger

The HTTP Request logs can also be configured to persist to a distributed [Redis](https://redis.io) data store instead by configuring the `RequestLogsFeature` plugin to use the `RedisRequestLogger`. Persisting logs in redis will allow them to survive and be view-able across App Domain restarts.

### Install

To use `RedisRequestLogger` first install the **ServiceStack.Server** NuGet package:

:::copy
`<PackageReference Include="ServiceStack.Server" Version="8.*" />`
:::

Then configure `RequestLogsFeature` to use the `RedisRequestLogger` which can make use of your existing `IRedisClientsManager` registered IOC dependency, e.g:

```csharp
Plugins.Add(new RequestLogsFeature {
    RequestLogger = new RedisRequestLogger(
	    container.Resolve<IRedisClientsManager>(), capacity:1000)
});
```

::: info Tip
The optional `capacity` configures Redis Request Logger as a rolling log where it will only keep the most recent 1000 entries
:::

### Configuration

Like other ServiceStack [Plugins](/plugins) the `RequestLogsFeature` has a number of configuration options that can be specified at registration to customize Request Logging:


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

### Usage

The `IRequestLogger` is a great way to introspect and analyze your service requests in real-time, e.g:

![Live Screenshot](/img/pages/plugins/request-logs-01.png)

It supports multiple queryString filters and switches so you filter out related requests for better analysis and debuggability:

![Request Logs Usage](/img/pages/plugins/request-logs-02.png)

The [RequestLogsService](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Admin/RequestLogsService.cs) is just a simple C# service under-the-hood but is a good example of how a little bit of code can provide a lot of value in ServiceStack's by leveraging its generic, built-in features.
