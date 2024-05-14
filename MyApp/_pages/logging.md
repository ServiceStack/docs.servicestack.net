---
title: An implementation-free logging API for .NET
---

**ServiceStack.Logging** is an implementation and dependency-free logging API with adapters for all of .NET's popular logging providers. It allows your business logic to bind to an easily-mockable and testable dependency-free interface whilst providing the flexibility to switch logging providers at runtime.

## Download on NuGet

Currently there are 5 different .NET logging providers available on NuGet:

**[NLog](https://nuget.org/packages/ServiceStack.Logging.NLog)**

:::copy
`<PackageReference Include="ServiceStack.Logging.NLog" Version="8.*" />`
:::

**[Elmah](https://nuget.org/packages/ServiceStack.Logging.Elmah)**

:::copy
`<PackageReference Include="ServiceStack.Logging.Elmah" Version="8.*" />`
:::

**[Log4Net](https://nuget.org/packages/ServiceStack.Logging.Log4Net)**

:::copy
`<PackageReference Include="ServiceStack.Logging.Log4Net" Version="8.*" />`
:::

**[EventLog](https://nuget.org/packages/ServiceStack.Logging.EventLog)**

:::copy
`<PackageReference Include="ServiceStack.Logging.EventLog" Version="8.*" />`
:::

**[SlackLog](https://www.nuget.org/packages/ServiceStack.Logging.Slack/)**

:::copy
`<PackageReference Include="ServiceStack.Logging.Slack" Version="8.*" />`
:::

**[SerilogLogger](https://www.nuget.org/packages/ServiceStack.Logging.Serilog/)**

:::copy
`<PackageReference Include="ServiceStack.Logging.Serilog" Version="8.*" />`
:::

::: info
The `ConsoleLogFactory` and `DebugLogFactory` and are already built-in and bind to .NET Framework's Console and Debug loggers.
:::

### Why a Logging Interface?

Even in the spirit of **Bind to interfaces, not implementations**, many .NET projects still have
a hard dependency to [log4net](http://logging.apache.org/log4net/index.html). 

Although log4net is the standard for logging in .NET, potential problems can arise from your libraries having a hard dependency on it:

* Your library needs to be shipped with a third-party dependency
* Potential conflicts can occur when different libraries have dependency on different versions of log4net (e.g. the 1.2.9 / 1.2.10 dependency problem).
* You may want to use a different logging provider (i.e. network distributed logging)
* You want your logging for Unit and Integration tests to redirect to the Console or Debug logger without any configuraiton.
* Something better like [elmah](http://code.google.com/p/elmah/) can come along requiring a major rewrite to take advantage of it

ServiceStack.Logging solves these problems by providing an implementation-free `ILog` interface that your application logic can bind to where your Application Host project can bind to the concrete logging implementation at deploy or runtime.

ServiceStack.Logging also includes adapters for the following logging providers:

* Elmah
* NLog
* Log4Net 1.2.10+
* Log4Net 1.2.9
* EventLog
* SlackLog
* Serilog
* Console Log
* Debug Log
* Null / Empty Log

### Logging with Context

Support for contextual logging is available with the `ILogWithContext` interface and `PushProperty` extension method which lets you attach additional data to log messages, e.g:

```csharp
using (log.PushProperty("Hello", "World"))
{
    log.InfoFormat("Message");
}
```

Support for the additional context was added to `Log4net`, `NLog` and `Serilog` logging providers.

#### Serilog notes

Serilog `PushProperty` support requires [Serilog.Enrichers.Thread](https://www.nuget.org/packages/Serilog.Enrichers.Thread) NuGet package and its enricher enabled, e.g:

```csharp
var serilog = new LoggerConfiguration()
  .Enrich.FromLogContext()
  // additional config
  .CreateLogger();

LogManager.LogFactory = new SerilogFactory(serilog);
```

# Registration Examples

Once on your App Startup, either In your `AppHost.cs` or `Global.asax` file inject the concrete logging implementation that your app should use, e.g.

## Built-in Loggers

```csharp
//Console.WriteLine
LogManager.LogFactory = new ConsoleLogFactory(debugEnabled:true); 
//Debug.WriteLine
LogManager.LogFactory = new DebugLogFactory(debugEnabled:true);   
//Capture logs in StringBuilder
LogManager.LogFactory = new StringBuilderLogFactory(); 
//No Logging (default)
LogManager.LogFactory = new NullLogFactory();   
```

## NLog

```csharp
LogManager.LogFactory = new NLogFactory(); 
```

## Log4Net

```csharp
//Also runs log4net.Config.XmlConfigurator.Configure()
LogManager.LogFactory = new Log4NetFactory(configureLog4Net:true); 
```

## Event Log

```csharp
LogManager.LogFactory = new EventLogFactory("Logging.Tests", "Application");
```

Then your application logic can bind to and use a lightweight implementation-free ILog which at runtime will be an instance of the concrete implementation configured in your host:

```csharp
ILog log = LogManager.GetLogger(GetType());

log.Debug("Debug Event Log Entry.");
log.Warn("Warning Event Log Entry.");
```

## Elmah

To configure Elmah register it before initializing ServiceStack's AppHost, passing in the Global HttpApplication Instance and an alternate logger you'd like to use to for your Debug and Info messages, e.g:

```csharp
public class Global : System.Web.HttpApplication
{
    protected void Application_Start(object sender, EventArgs e)
    {
        var debugMessagesLog = new ConsoleLogFactory();
        LogManager.LogFactory = new ElmahLogFactory(debugMessagesLog, this);
        new AppHost().Init();
    }
}
```

Elmah also requires its handlers and modules to be registered in the **Web.config** which lets you view your Elmah Error Log at: `/elmah.xsd`:

```xml
<configuration>
  <system.web>
    ...
    <httpHandlers>
      <add verb="POST,GET,HEAD" path="elmah.axd" type="Elmah.ErrorLogPageFactory, Elmah" />
    </httpHandlers>
    <httpModules>
      <add name="ErrorLog" type="Elmah.ErrorLogModule, Elmah"/>
    </httpModules>
  </system.web>

  <system.webServer>
    <handlers>
      ...
      <add name="Elmah" path="elmah.axd" verb="POST,GET,HEAD" 
           type="Elmah.ErrorLogPageFactory, Elmah" preCondition="integratedMode" />
    </handlers>
    <modules>
      <add name="Elmah.ErrorLog" type="Elmah.ErrorLogModule, Elmah" preCondition="managedHandler" />
    </modules>
  </system.webServer>

</configuration>
```

For a working example see the [Logging.Elmah UseCase](https://github.com/ServiceStack/ServiceStack.UseCases/tree/master/Logging.Elmah) which has ServiceStack and Elmah configured together.

## Slack

Configure Slack Logger with the channels you want to log it to, e.g:

```csharp
LogManager.LogFactory = new SlackLogFactory("{GeneratedSlackUrlFromCreatingIncomingWebhook}", 
    debugEnabled:true)
{
    //Alternate default channel than one specified when creating Incoming Webhook.
    DefaultChannel = "other-default-channel",
    //Custom channel for Fatal logs. Warn, Info etc will fallback to DefaultChannel or 
    //channel specified when Incoming Webhook was created.
    FatalChannel = "more-grog-logs",
    //Custom bot username other than default
    BotUsername = "Guybrush Threepwood",
    //Custom channel prefix can be provided to help filter logs from different users or environments. 
    ChannelPrefix = System.Security.Principal.WindowsIdentity.GetCurrent().Name
};

LogManager.LogFactory = new SlackLogFactory(appSettings);
```

More usage examples are available in [SlackLogFactoryTests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.Logging.Tests/UnitTests/SlackLogFactoryTests.cs).

## Serilog

To Configure Serilog Logging, first download [ServiceStack.Logging.Serilog](https://www.nuget.org/packages/ServiceStack.Logging.Serilog) from NuGet:

:::copy
`<PackageReference Include="ServiceStack.Logging.Serilog" Version="8.*" />`
:::

Then configure ServiceStack to use `SerilogFactory`:

```csharp
LogManager.LogFactory =  new SerilogFactory();
```

The Serilog adapter includes enhanced Serilog-specific APIs:

```csharp
ILog.Debug(Exception ex, string messageTemplate, params object[] propertyValues)
ILog.Info(Exception ex, string messageTemplate, params object[] propertyValues)
ILog.Warn(Exception ex, string messageTemplate, params object[] propertyValues)
ILog.Error(Exception ex, string messageTemplate, params object[] propertyValues)
ILog.Fatal(Exception ex, string messageTemplate, params object[] propertyValues)
ILog.ForContext(Type type)
ILog.ForContext<T>()
ILog.ForContext(ILogEventEnricher enricher)
ILog.ForContext(IEnumerable<ILogEventEnricher> enrichers)
ILog.ForContext(string propertyName, object value, bool destructureObjects = false)
```

## Usage Example

Using a logger in your Service is similar to other .NET Logging providers, e.g. you can initialize a static property for the class and use it in your services, e.g:

```csharp
public class MyService : Service
{
    public static ILog Log = LogManager.GetLogger(typeof(MyService));

    public object Any(Request request)
    {
        if (Log.IsDebugEnabled)
            Log.Debug("In Request Service");
    }
}
```

## Community Logging Providers

### [ServiceStack.Seq.RequestLogsFeature](https://github.com/wwwlicious/servicestack-seq-requestlogsfeature)

Servicestack plugin that logs requests to [Seq](https://getseq.net/).

# Community Resources

  - [Using Slack for Logging (with ServiceStack)](http://buildclassifieds.com/2016/02/01/using-slack-for-logging-with-servicestack/) by [@markholdt](https://twitter.com/markholdt)
  - [Elmah, Emails, and ServiceStack](http://rossipedia.com/blog/2013/03/elmah-emails-and-servicestack/) by [@rossipedia](https://twitter.com/rossipedia)
