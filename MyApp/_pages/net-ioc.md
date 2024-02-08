---
title: ASP.NET Core IOC
---

From [ServiceStack v8.1](/releases/v8_01) all new .NET 8+ [Project Templates](https://servicestack.net/start) have switched to use
[Endpoint Routing](/endpoint-routing) and ASP.NET Core IOC where all Dependencies, Services and Plugins should now be registered
in `IServiceCollection`, commonly done in `IHostingStartup` [Modular Startup](/modular-startup) classes, e.g:

```csharp
public class AppHost() : AppHostBase("MyApp"), IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            // Register Singleton Instance
            services.AddSingleton<IBar>(new Bar { Name = "bar" });

            //Register Singleton instance using Factory function
            services.AddSingleton<IBar>(c => new Bar { Name = "bar" });

            //Register Auto-Wired Transient instance
            services.AddTransient<IFoo, Foo>();
            
            //Register Auto-Wired Request Scope instance
            services.AddScoped<IScoped, Scoped>();

            //Register Request Scope instance using Factory function
            services.AddScoped<IScoped>(c => new Scoped(c.GetRequiredService<IBar>()) {
                Foo = c.GetService<IFoo>() // Optional Service
            });
        });
}
```

Use `context` when needing access to configuration or `HostingEnvironment`, e.g:

```csharp
public class ConfigureDb : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {

            services.AddSingleton<IDbConnectionFactory>(new OrmLiteConnectionFactory(
                context.Configuration.GetConnectionString("DefaultConnection"),
                SqliteDialect.Provider));

            if (context.HostingEnvironment.IsDevelopment())
            {
                //...
            }
        });
}
```

## Switch to use ASP.NET Core IOC

To enable ServiceStack to switch to use ASP .NET Core's IOC, all dependency, Plugins and Service registrations need to be moved
to before the `WebApplication` is built by calling `AddServiceStack()` with the Assemblies where your ServiceStack Service 
Implementations are located, e.g:

```csharp
builder.Services.AddServiceStack(typeof(MyServices).Assembly);

var app = builder.Build();

//...
app.UseServiceStack(new AppHost());

app.Run();
```

This change registers all ServiceStack dependencies in ASP.NET Core's IOC, including all ServiceStack Services prior to
the AppHost being initialized.

### Registering Dependencies and Plugins

Additionally ASP.NET Core's IOC requirement for all dependencies needing to be registered before the WebApplication is 
built means you'll no longer be able to register any dependencies or plugins in ServiceStack's `AppHost.Configure()`:

```csharp
public class AppHost() : AppHostBase("MyApp"), IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            // Register IOC Dependencies and ServiceStack Plugins
        });

    public override void Configure()
    {
        // DO NOT REGISTER ANY PLUGINS OR DEPENDENCIES HERE
    }
}
```

Instead anything that needs to register dependencies in ASP.NET Core IOC should now use the `IServiceCollection` extension methods:

 - `IServiceCollection.Add*` APIs to register dependencies
 - `IServiceCollection.AddPlugin` API to register ServiceStack Plugins
 - `IServiceCollection.RegisterService*` APIs to dynamically register ServiceStack Services in external Assemblies

This can be done whenever you have access to `IServiceCollection`, either in `Program.cs`:

```csharp
builder.Services.AddPlugin(new AdminDatabaseFeature());
```

Or in any Modular Startup `IHostingStartup` configuration class, e.g:

```csharp
public class ConfigureDb : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            services.AddSingleton<IDbConnectionFactory>(new OrmLiteConnectionFactory(
                context.Configuration.GetConnectionString("DefaultConnection"),
                SqliteDialect.Provider));
            
            // Enable Audit History
            services.AddSingleton<ICrudEvents>(c =>
                new OrmLiteCrudEvents(c.GetRequiredService<IDbConnectionFactory>()));
            
            // Enable AutoQuery RDBMS APIs
            services.AddPlugin(new AutoQueryFeature {
                 MaxLimit = 1000,
            });

            // Enable AutoQuery Data APIs
            services.AddPlugin(new AutoQueryDataFeature());
            
            // Enable built-in Database Admin UI at /admin-ui/database
            services.AddPlugin(new AdminDatabaseFeature());
        })
        .ConfigureAppHost(appHost => {
            appHost.Resolve<ICrudEvents>().InitSchema();
        });
}
```

The `ConfigureAppHost()` extension method can continue to be used to execute any logic that requires access to 
registered dependencies on StartUp.


## Dependency Injection

The primary difference between the IOC's is that ASP.NET Core's IOC does not support property injection by default, 
which require ServiceStack Services to use constructor injection of dependencies which is pleasant to define
with C# 12's [Primary Constructors](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/tutorials/primary-constructors)
which requires a lot less boilerplate to define, assign and access dependencies, e.g:

```csharp
public class TechStackServices(IAutoQueryDb autoQuery) : Service
{
    public async Task<object> Any(QueryTechStacks request)
    {
        using var db = autoQuery.GetDb(request, base.Request);
        var q = autoQuery.CreateQuery(request, Request, db);
        return await autoQuery.ExecuteAsync(request, q, db);
    }
}
```

### [FromServices] Property Injection

For added flexibility **ServiceStack Services** also support property injection convention by using the `[FromServices]` attribute 
to any **public** properties you want injected, e.g:

```csharp
public class TechStackServices : Service
{
    [FromServices]
    public required IAutoQueryDb AutoQuery { get; set; }

    [FromServices]
    public MyDependency? OptionalDependency { get; set; }
}
```

This feature is useful for Services needing optional access to dependencies that may or may not be registered. 

:::info NOTE
`[FromServices]` is only supported in ServiceStack Services (i.e. not other dependencies)
:::

### Authoring ServiceStack Plugins

To enable ServiceStack Plugins to support both Funq and ASP .NET Core IOC, any dependencies and Services a plugin needs
should be registered in the `IConfigureServices.Configure(IServiceCollection)` method as seen in the refactored
[ServerEventsFeature.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack/ServerEventsFeature.cs)
plugin, e.g:

```csharp
public class ServerEventsFeature : IPlugin, IConfigureServices
{
    //...
    public void Configure(IServiceCollection services)
    {
        if (!services.Exists<IServerEvents>())
        {
            services.AddSingleton<IServerEvents>(new MemoryServerEvents
            {
                IdleTimeout = IdleTimeout,
                HouseKeepingInterval = HouseKeepingInterval,
                OnSubscribeAsync = OnSubscribeAsync,
                OnUnsubscribeAsync = OnUnsubscribeAsync,
                OnUpdateAsync = OnUpdateAsync,
                NotifyChannelOfSubscriptions = NotifyChannelOfSubscriptions,
                Serialize = Serialize,
                OnError = OnError,
            });
        }
        
        if (UnRegisterPath != null)
            services.RegisterService<ServerEventsUnRegisterService>(UnRegisterPath);

        if (SubscribersPath != null)
            services.RegisterService<ServerEventsSubscribersService>(SubscribersPath);
    }

    public void Register(IAppHost appHost)
    {
        //...
    }
}
```