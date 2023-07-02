---
slug: modular-startup-legacy
title: Modular Startup (Legacy)
---

::: info
This modular startup applies to version 5.6 to 5.12, prior to the support of .NET 6.
If you are running 5.13+, we recommend you follow the use of the new .NET 6 modular startup.
For more information, see [Modular Startup](./modular-startup.md) documentation page.
:::

We want to dramatically simplify and improve the experience for configuring ASP.NET Core Apps and make them truly composable, 
where we can drop-in files that auto configures itself with both ASP.NET Core and ServiceStack's AppHost so they can
encapsulate an entire feature and provide instant utility without needing to wade through different steps of how they
should be manually configured at different places in your Startup configuration class. 

This functionality is enabled via the `ModularStartup` base class which can be leveraged in any ASP.NET Core App 
(i.e. not just ServiceStack Apps) by modifying the standard `Startup` class with injected `IConfiguration`:

```csharp
public class Startup
{
    IConfiguration Configuration { get; }
    public Startup(IConfiguration configuration) => Configuration = configuration;

    public void ConfigureServices(IServiceCollection services)
    {
        //...
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        //...
    }
}
```

and change it to inherit from `ModularStartup` instead:

```csharp
public class Startup : ModularStartup
{
    public new void ConfigureServices(IServiceCollection services)
    {
        //...
    }

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        //...
    }
}
```

Then in `Program.cs` replace `UseStartup<Startup>` with `.UseModularStartup<Startup>()`, e.g:

```csharp
using ServiceStack;

//...

public static IWebHost BuildWebHost(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        .UseModularStartup<Startup>()
        .Build();
```

> The `new` modifier isn't strictly necessary but does resolve a compiler warning

This change now makes it possible to maintain configuration in independent "no-touch" cohesive configuration files by implementing
any of the below interfaces to register dependencies in ASP.NET Core's IOC or App handlers:

```csharp
public interface IConfigureServices 
{
    void Configure(IServiceCollection services);
}

public interface IConfigureApp
{
    void Configure(IApplicationBuilder app);
}
```

### Scan Multiple Assemblies

By default the `ModularStartup` class only scans for types in the Host project (i.e. containing the Startup class), 
the base constructor can also specify a list of assemblies it should scan to find and register other "no-touch" configuration files, e.g:

```csharp
public class Startup : ModularStartup
{
    public Startup(IConfiguration configuration) 
      : base(configuration, typeof(Startup).Assembly, typeof(AltAssemblyType).Assembly){}
}
```

### Skip Assembly Scanning

Assembly scanning can also be avoided entirely by specifying the list of Types implementing Startup interfaces you want registered, e.g:

```csharp
public class Startup : ModularStartup
{
    public Startup(IConfiguration configuration) 
      : base(configuration, typeof(ConfigureRedis), typeof(ConfigureDb)){}
}
```

> Although in this case it ceases to be "no-touch" as it would require manual registration of each Startup class

### Using AspNetCore's IStartup instead

If preferred your features configuration classes can avoid any dependency to ServiceStack by having them implement ASP.NET Core's 
**Microsoft.AspNetCore.Hosting** `IStartup` class instead:

```csharp
public interface IStartup
{
    // Note: return value is ignored
    IServiceProvider ConfigureServices(IServiceCollection services);

    void Configure(IApplicationBuilder app);
}
```

Which `ModularStartup` also auto-registers.

### Ignore Startup Classes

The `IgnoreTypes` collection or `LoadType` predicate can be used to specify which Startup classes that `ModularStartup` should ignore,
so you could skip configuring Redis in your App with:

```csharp
public class Startup : ModularStartup
{
    public Startup(IConfiguration configuration) : base(configuration)
    {
        IgnoreTypes.Add(typeof(ConfigureRedis));
    }
}
```

### no-touch Startup Configuration Examples

The benefit of `ModularStartup` is that we can now start composing App features like lego building blocks, 
so we could configure Redis with our ASP.NET Core App by dropping in a `Configure.Redis.cs` like:

```csharp
public class ConfigureRedis : IConfigureServices
{
    public void Configure(IServiceCollection services) =>
        services.AddSingleton<IRedisClientsManager>(new RedisManagerPool());
}
```

Which will be auto-registered by `ModularStartup` and add the `IRedisClientsManager` dependency to .NET Core's IOC where
it's available to all of ASP.NET Core (including ServiceStack).

If a feature requires access to `IConfiguration` it can either use constructor injection or property injection
by implementing `IRequireConfiguration`, e.g:

```csharp
public class ConfigureRedis : IConfigureServices
{
    IConfiguration Configuration { get; }
    public ConfigureRedis(IConfiguration configuration) => Configuration = configuration;

    public void Configure(IServiceCollection services) => services.AddSingleton<IRedisClientsManager>(
        new RedisManagerPool(Configuration.GetConnectionString("redis")));
}
```

We can then start adding other features depending on Redis independently without disrupting and mutating existing 
configuration source files, so we can register to use a Redis Auth Repository by dropping in a `Configure.AuthRepository.cs`:

```csharp
public class ConfigureAuthRepository : IConfigureServices
{
    public void Configure(IServiceCollection services) => services.AddSingleton<IAuthRepository>(
        c => new RedisAuthRepository(c.Resolve<IRedisClientsManager>()));
}
```

Or utilize Redis MQ by dropping in a `Configure.Mq.cs`:

```csharp
public class ConfigureMq : IConfigureServices, IAfterInitAppHost
{
    public void Configure(IServiceCollection services) => services.AddSingleton<IMessageService>(
        c => new RedisMqServer(c.Resolve<IRedisClientsManager>()));

    public void AfterInit(IAppHost appHost) => appHost.Resolve<IMessageService>().Start();
}
```

Which other isolated features can further extend by registering which of its ServiceStack Services they want to make available via MQ:

```csharp
public class MyFeature : IConfigureAppHost
{
    public void Configure(IAppHost appHost) =>
        appHost.Resolve<IMessageService>().RegisterHandler<MyRequest>(appHost.ExecuteMessage);
}
```

Here we can see how we can easily compose our App's functionality like lego by dropping in cohesive features that can
replace features in isolation without disrupting other parts of the App. For example we could use a different Auth Repository by 
overwriting `Configure.AuthRepository.cs` and replace `Configure.Mq.cs` to use a different MQ Server all without disrupting
any of the App's other features, including feature extensions like `MyFeature` which registers its Service the overwritten MQ Server -
unaware that it had been replaced. 

We can then easily replicate the same consistent technology choices you want to standardize on across all Apps, by copying feature in piecemeal 
units at the file-level, without fear of breaking existing Apps as any no other App-specific configuration is disrupted - a process which 
could now be automated with shell scripts.

Ultimately the driving force behind enabling modular App composition is to reduce the knowledge and effort required to add, remove and
replace features. So instead of having to wade through a set of documentation around learning how to add and configure each feature we
can reduce the steps down to just choosing the features we want and have them include the minimum configuration needed to register it with our App.

## Compose ASP.NET Core Apps with Mix

`ModularStartup` lays the foundation for being able to composing ASP.NET Core Apps by dropping in "no-touch" configuration files which encapsulate
each feature and takes care of binding itself to your App, registering any required dependencies, App modules or AppHost features.

Check out the [mix dotnet tool](/mix-tool) for easy access to a library of layerable features that can be added to ASP.NET Core Applications.

## Modular Startup Prioritization

Ideally features would not be order dependent, but if need to, you can use the `[Priority]` attribute to control the prioritization of different
features implementing the .NET Core Startup interfaces:

 - `IConfigureServices` - Register IOC dependencies
 - `IConfigureApp` - Register ASP.NET Core Modules
 - `IStartup` - Configure both IOC and App Modules

Startup classes with `Priority < 0` are executed before your App's `Startup` otherwise they're executed after your AppHost, in ascending order.

The example configuration below shows the order in which each Startup class is executed:

```csharp
[Priority(-1)]
public class MyPreConfigureServices : IConfigureServices
{
    public void Configure(IServiceCollection services) => "#1".Print();
}

public class MyConfigureServices : IConfigureServices
{
    public void Configure(IServiceCollection services) => "#4".Print();
}

[Priority(1)]
public class MyPostConfigureServices : IConfigureServices
{
    public void Configure(IServiceCollection services) => "#5".Print();
}

[Priority(-1)]
public class MyStartup : IStartup
{
    public IServiceProvider ConfigureServices(IServiceCollection services)
    {
        "#2".Print();
        return null;
    }

    public void Configure(IApplicationBuilder app) => "#6".Print();
}

public class Startup : ModularStartup
{
    public Startup(IConfiguration configuration) : base(configuration){}

    public new void ConfigureServices(IServiceCollection services) => "#3".Print();

    public void Configure(IApplicationBuilder app, IHostingEnvironment env) => "#8".Print();
}

[Priority(-1)]
public class MyPreConfigureApp : IConfigureApp
{
    public void Configure(IApplicationBuilder app)=> "#7".Print();
}

public class MyConfigureApp : IConfigureApp
{
    public void Configure(IApplicationBuilder app)=> "#9".Print();
}
```

### AppHost Startup classes

The `[Priority]` attribute can also be used in ServiceStack AppHost's Startup classes:

 - `IPreConfigureAppHost` - Customize `AppHost` before `Configure()` is run (e.g. to add ServiceAssemblies)
 - `IConfigureAppHost` - Run external "no-touch" `AppHost` configuration 
 - `IAfterInitAppHost` - Run custom logic after `AppHost` has initialized (e.g. to start MQ Server)

In addition to the above Interfaces, `IPlugin` can also implement the plugin interfaces below:

 - `IPreInitPlugin` - Run custom logic just before Plugins are registered
 - `IPostInitPlugin` - Run custom logic just after Plugins are registered

### Register ASP.NET Core dependencies in AppHost

A limitation of ASP.NET Core is that all dependencies need to be registered in `ConfigureServices()` before any App Modules 
which is the reason why dependencies registered in ServiceStack's AppHost `Configure()` are only accessible from ServiceStack and 
not the rest of ASP.NET Core. 

But as ASP.NET Core's `AppHostBase` now implements `IConfigureServices`, you're now able to register IOC dependencies in your 
`AppHost` class by registering them in `Configure(IServiceCollection)` where they'll now be accessible to both ServiceStack and the 
rest of your ASP.NET Core App, e.g:

```csharp
public class AppHost : AppHostBase
{
    public override void Configure(IServiceCollection services)
    {
        services.AddSingleton<IRedisClientsManager>(
            new RedisManagerPool(Configuration.GetConnectionString("redis")));
    }

    public override void Configure(Container container)
    {
        var redisManager = container.Resolve<IRedisClientsManager>();
        //...
    }
}
```

We can take this even further and have your ServiceStack AppHost implement `IConfigureApp` where it can also contain the logic to register itself
as an alternative to registering ServiceStack in your `Startup` class, e.g:

```csharp
public class AppHost : AppHostBase, IConfigureApp
{
    public void Configure(IApplicationBuilder app)
    {
        app.UseServiceStack(new AppHost
        {
            AppSettings = new NetCoreAppSettings(Configuration)
        });
    }

    public override void Configure(Container container) { /***/ }
}
```

This will let you drop-in your custom `AppHost` into a `ModularStartup` enabled ASP.NET Core App to enable the same "no-touch" auto-registration.


## Limitations of ASP.NET Core's App Composition Model

ASP.NET Core App Composition Model involves using opaque RPC ["mystery meat"](https://en.wikipedia.org/wiki/Mystery_meat_navigation)
extension methods to enable features by slotting them in different sections of your Startup class.

There's a lack of consistency with how each feature is enabled, some require both Services and App registration, 
some use a configuration lambda to configure the feature, other use a builder pattern, some require multiple app registrations,
and in some cases like MVC Tag Helpers, also need configuration in external files.

App construction via opaque RPC mutations makes it hard to introspect and discover what features are enabled, how they were configured, 
how different features can interact with each other, to be able to attach additional custom logic and registration or 
to replace or disable any pre-existing conflicting features.

They also require more moving parts to build a feature which typically requires separate classes for exposing an Extension method, 
configuration object and any classes for its implementation, and another set of classes again if the feature requires registering any
dependencies in the IOC. 

### vs ServiceStack's Plugins

By contrast you could implement the same feature in a single cohesive Plugin class like 
[CorsFeature](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/CorsFeature.cs), 
encapsulating both configuration and implementation and exposes an ideal natural declarative typed API that takes advantage of 
C#'s class and property initialization syntax sugar for simplified typed configuration. They also naturally benefit from all the 
introspection, discoverability and modularity of being maintained within a generic List collection that's accessible from everywhere.

Most ServiceStack features are encapsulated within [Plugins](/plugins) which are all registered the same way - by 
adding a declarative class instance to the `Plugins` collection. Plugins encapsulate the entire feature, taking care of all IOC 
registrations and how to configure itself with ServiceStack.

So if you wanted to enable [#Script Pages](https://sharpscript.net/docs/script-pages) (alternative to MVC) and give all pages
access to OrmLite's DB functionality - it can all be configured with a single declarative expression:

```csharp
Plugins.Add(new SharpPagesFeature {
    ScriptMethods = {
        new DbScriptsAsync()
    }
});
```

Other features independent of your AppHost are able to easily extend other plugins before they're registered,
e.g. the new AuthRepo UI Feature ensures #Script Pages is registered and extends it with its own functionality with:

```csharp
public void Configure(IAppHost appHost)
{
    appHost.AssertPlugin<SharpPagesFeature>().ScriptMethods.Add(new UserAuthScripts());
}
```

Modular plugins makes it easy to [toggle on/off features with feature flags](/plugins#disabling-plugins-via-feature-enum-flags):

```csharp
SetConfig(new HostConfig { 
    EnableFeatures = Feature.All.Remove(Feature.Csv | Feature.Html)
})
```

Or just by removing them from the `Plugins` collection:

```csharp
Plugins.RemoveAll(x => x is CsvFormat || x is HtmlFormat);
```

Other functionality that's not possible with ASP.NET Core's app mutation model is a implementing a dynamic plugin system as done in
[Sharp Apps Plugins](https://sharpscript.net/docs/sharp-apps#plugins) where it's possible to both register and configure plugins 
without compilation, dynamically, using a simple `app.settings` text file, e.g:

```
features CustomPlugin, OpenApiFeature, PostmanFeature, CorsFeature, ValidationFeature
CustomPlugin { ShowProcessLinks: true }
ValidationFeature { ScanAppHostAssemblies: true }
```

Where it specifies which Plugins the App should register and the order they should be registered with, where any additional configuration 
can be configured using a JS Object Literal, together the above configuration is equivalent to:

```csharp
Plugins.Add(new CustomPlugin { ShowProcessLinks = true });
Plugins.Add(new OpenApiFeature());
Plugins.Add(new PostmanFeature());
Plugins.Add(new CorsFeature());
Plugins.Add(new ValidationFeature { ScanAppHostAssemblies = true });
```

The **features** app.setting also supports adding `plugins/*` to the end of the features list which
[enables no-touch extensibility](https://sharpscript.net/docs/sharp-apps#netcore-extensibility) where Apps can automatically 
register all `IPlugin` it can find in any `.dll` dropped into the App's `/plugin` folder.

The consequence of ASP.NET's app mutation configuration model is that adding features are less intuitive, less discoverable and 
require more documentation and knowledge then they otherwise should. Having all features slotted into different parts of the same 
Startup class also makes copying and maintaining individual features across a suite of .NET Core Apps unnecessarily cumbersome.
