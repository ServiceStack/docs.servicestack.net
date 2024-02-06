---
slug: endpoints-migration
title: Migrating to .NET 8 Endpoints
---

In the ServiceStack v8.1 release, we have introduced a way to better incorporate your ServiceStack APIs into the larger ASP.NET Core ecosystem by mapping your ServiceStack APIs to the [standard ASP.NET Core Endpoints](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/routing?view=aspnetcore-8.0#endpoints). This enables you to have your ServiceStack APIs integrate with your larger ASP.NET Core application in the same way other middle ware does, opening up more opportunities for reuse of your ServiceStack APIs.

Migrating to this new way to initialize your ServiceStack `AppHost` is not required, but it does open up the ability to use common third party tooling. A good example of this is adding OpenAPI v3 specification generation for your endpoints offered by the `Swashbuckle` package.
We have even included a wrapper package `ServiceStack.AspNetCore.OpenApi` to make this integration as easy as possible, and incorporate additional information from your ServiceStack APIs into Swagger metadata.

## Changes Required

There are four main changes required to migrate to the new Endpoints:
- **AppHost Initialization**
- **Moving from Funq to ASP.NET Core's built in Dependency Injection system**
- **Plugin Initialization**
- **Service Dependency Resolution**

### AppHost Initialization

To use ServiceStack APIs as mapped Endpoints, the way ServiceStack is initialized in your ASPNET Core application needs to be updated.

Previously, the following was used to initialize your ServiceStack `AppHost`:

#### Program.cs
```csharp
app.UseServiceStack(new AppHost());
```

The `app` in this example is a `WebApplication` resulting from an `IHostApplicationBuilder` calling `builder.Build()`. Whilst we still need to call `app.UseServiceStack()`, we also need to move the discovery of your ServiceStack APIs to earlier in the setup.

```csharp
var builder = WebApplication.CreateBuilder(args);
// Add ASP.NET dependencies using `builder.Services`
// ...
// Register all services
builder.Services.AddServiceStack(typeof(MyServices).Assembly);
```

You can also configure options within the `AddServiceStack` call, such as adding Swagger support:

```csharp
// Register all services
services.AddServiceStack(typeof(MyServices).Assembly, c => {
    c.AddSwagger(o => {
        //o.AddJwtBearer();
        o.AddBasicAuth();
    });
});
```

### Moving from Funq to ASP.NET Core's built in Dependency Injection system

Since ServiceStack services are registered earlier in the setup, we need to move the discovery of your ServiceStack APIs to earlier in the setup as well. 
This means that we need to change any uses of the `Funq` IoC container to use ASP.NET Core's built in Dependency Injection system.

Previously, the following was used to register your ServiceStack services:

#### Configure.AppHost.cs

```csharp
public class AppHost : AppHostBase, IHostingStartup
{
    public AppHost() : base("MyApp", typeof(MyServices).Assembly) { }

    public override void Configure(Container container)
    {
        SetConfig(new HostConfig {
        });
        
        // Register your dependencies
        container.Register(new MyDependency());
    }
}
```

This used the built in `Funq` IoC container to register dependencies for your services. We now need to move this to the `ConfigureServices` and use the `IServiceCollection` to register your dependencies.

```csharp
public class AppHost : AppHostBase, IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) =>
        {
            // Configure ASP.NET Core IOC Dependencies
            services.AddSingleton(new MyDependency());
        });

    public AppHost() : base("MyApp", typeof(MyServices).Assembly) { }
    
    public override void Configure(Container container)
    {
        SetConfig(new HostConfig {
        });
    }
}
```

The `Configure(IWebHostBuilder builder)` method is called by the `WebHostBuilder` when it is building the `WebApplication`. This is where we can register our dependencies using the `IServiceCollection` provided by ASP.NET Core.

### Plugin Initialization

The way ServiceStack plugins are initialized also needs to be updated. Previously, the following was used to initialize your ServiceStack plugins:

#### Configure.AppHost.cs

```csharp
public class AppHost : AppHostBase, IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) =>
        {
            // Configure ASP.NET Core IOC Dependencies
        });

    public AppHost() : base("MyApp", typeof(MyServices).Assembly) { }

    public override void Configure(Container container)
    {
        SetConfig(new HostConfig {
        });
        
        Plugins.Add(new CorsFeature());
    }
}
```

We now need to move the initialization of your ServiceStack plugins to the `ConfigureServices` method as well and use the `IServiceCollection` and the `AddPlugin` extension method.

```csharp
public class AppHost : AppHostBase, IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) =>
        {
            // Configure ASP.NET Core IOC Dependencies
            services.AddPlugin(new CorsFeature());
        });

    public AppHost() : base("MyApp", typeof(MyServices).Assembly) { }

    // Configure your AppHost with the necessary configuration and dependencies your App needs
    public override void Configure(Container container)
    {
        SetConfig(new HostConfig {
        });
    }
}
```

If you need to resolve dependencies during your own plugin or AppHost initialization, you can use a lambda to resolve the dependency from the `IServiceProvider`.
Here is an example of configuring `AutoQuery` which needs to resolve an `IDbConnectionFactory`:

```csharp
public class ConfigureAutoQuery : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            // Enable Audit History
            services.AddSingleton<ICrudEvents>(c =>
                new OrmLiteCrudEvents(c.GetRequiredService<IDbConnectionFactory>()));
            // For TodosService
            services.AddPlugin(new AutoQueryDataFeature());
            // For Bookings https://docs.servicestack.net/autoquery-crud-bookings
            services.AddPlugin(new AutoQueryFeature
            {
                MaxLimit = 1000,
                //IncludeTotal = true,
            });
        })
        .ConfigureAppHost(appHost => {
            appHost.Resolve<ICrudEvents>().InitSchema();
        });
}
```

### Service Dependency Resolution

Since we are now using ASP.NET Core's built in Dependency Injection system, we need to change the way we resolve dependencies in our ServiceStack services. Previously, it was common to use property injection to resolve dependencies:

```csharp
public class MyService : Service
{
    public MyDependency MyDependency { get; set; }
    
    public object Any(MyRequest request)
    {
        // Use MyDependency
    }
}
```

However, this method of resolving dependencies is not supported in ASP.NET Core. Instead, we need to use constructor injection to resolve dependencies.
Construction injection can be very verbose, especially when you have a lot of dependencies.
Thankfully, C# 12 introduces a new feature called `Primary Constructors` which can help reduce the verbosity of constructor injection.

```csharp
public class MyService(MyDependency MyDependency) : Service
{
    public object Any(MyRequest request)
    {
        // Use MyDependency
    }
}
```

This is a much more concise way of injecting dependencies into your ServiceStack services.

## Conclusion

By bringing ServiceStack APIs onto the same level as other middleware in ASP.NET Core, we open up more opportunities for reuse of your ServiceStack APIs and the ability to use common third party tooling. This is a big step forward in making ServiceStack even more interoperable with the larger ASP.NET Core ecosystem, and hope it will make it easier for you to integrate your ServiceStack APIs into your larger ASP.NET Core applications.