---
title: Modularizing Services
---

ServiceStack only allows a **single App Host** for each App Domain. As you might be able to infer from the name, the role of the **Host** project is to be the conduit for binding all your services concrete dependencies, plugins, filters and everything else your service needs. The configuration of your service should be immutable after everything is initialized in your `AppHost.Configure()` method. The [Physical project structure wiki page](/physical-project-structure) wiki shows the recommended physical project structure for typical solutions.

## Modularizing services in multiple assemblies

Whilst you can only have 1 AppHost, you can have multiple services spread across multiple assemblies. In that case you have to provide a list of assemblies containing the services to the AppHostBase constructor, e.g:

```csharp
public class AppHost : AppHostBase
{
    //Tell ServiceStack the name of your app and which assemblies to scan for services
    public AppHost() : base("Hello ServiceStack!", 
       typeof(ServicesFromDll1).Assembly,
       typeof(ServicesFromDll2).Assembly
       /*, etc */) {}

    public override void Configure(Container container) {}
}
```

You can also provide your own strategy for discovering and resolving the service types that ServiceStack should auto-wire by overriding `CreateServiceManager`, e.g:

```csharp
public class AppHost : AppHostBase
{
    public AppHost(): base("Hello ServiceStack!", typeof(ServicesFromDll1).Assembly) {}
    public override void Configure(Container container) {}
    
    //Alternative way to inject Service Resolver strategy
    protected override ServiceController CreateServiceController(
        params Assembly[] assembliesWithServices)
    {       
        return new ServiceController(this, () => assembliesWithServices.ToList().SelectMany(x =>x.GetTypes()));
    }
}
```

## Encapsulating Services inside Plugins

One way of modularizing services is to encapsulate them inside [Plugins](/plugins) which allows you to manually register services, custom routes, filters, content types, allow customization and anything else your module needs.

To illustrate this point, we'll show what a Basic [Auth Feature](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/AuthFeature.cs) example might look like:

```csharp
public class BasicAuthFeature : IPlugin 
{
    public string HtmlRedirect { get; set; }   //User-defined configuration

    public void Register(IAppHost appHost)
    {
        //Register Services exposed by this module
        appHost.RegisterService<AuthService>("/auth", "/auth/{provider}");
        appHost.RegisterService<AssignRolesService>("/assignroles");
        appHost.RegisterService<UnAssignRolesService>("/unassignroles");

        //Load dependent plugins
        appHost.LoadPlugin(new SessionFeature());
    }
}
```

With everything encapsulated inside a plugin, your users can easily enable them in your AppHost with:

```csharp
Plugins.Add(new BasicAuthFeature { HtmlRedirect = "~/login" });
```

## "No touch" Host Configuration

To improve modularization and reuse the configuration logic for a ServiceStack AppHost can be split over multiple files as 
seen with [World Validation's](/world-validation) AppHost where all it's Auth registration is maintained inside 
[Configure.Auth.cs](https://github.com/NetCoreApps/Validation/blob/master/world/Configure.Auth.cs):

```csharp
public class ConfigureAuth : IConfigureAppHost
{
    public void Configure(IAppHost appHost)
    {
        var AppSettings = appHost.AppSettings;
        appHost.Plugins.Add(new AuthFeature(() => new CustomUserSession(),
            new IAuthProvider[] {
            new CredentialsAuthProvider(), //Enable UserName/Password Credentials Auth
        }));

        appHost.Plugins.Add(new RegistrationFeature()); //Enable /register Service

        //override the default registration validation with your own custom implementation
        appHost.RegisterAs<CustomRegistrationValidator, IValidator<Register>>();

        appHost.Register<ICacheClient>(new MemoryCacheClient()); //Store User Sessions in Memory

        appHost.Register<IAuthRepository>(new InMemoryAuthRepository()); //Store Authenticated Users in Memory
   }
}
```

This modular approach makes it easy to "layer on" functionality with tools like [web +](/web-apply).

### ConfigureAppHost Interfaces

You can use this to refactor out different cohesive parts your Host configuration over multiple files and decouple them from your concrete `AppHost` which
ServiceStack automatically runs all `IPreConfigureAppHost`, `IConfigureAppHost` and `IPostConfigureAppHost` interfaces on Startup it 
can find in either your `AppHost` Assembly or **Service Assemblies** specified in your AppHost constructor.

This opens up a number of re-use benefits where you'll be able to use the same AppHost configuration if your Services are being hosted
in [different Hosting Options](/why-servicestack#multiple-hosting-options), it makes it easy to maintain a standardized configuration 
across many of your ServiceStack projects, e.g. you can easily replace `Configure.Auth.cs` in all your projects to ensure they're running
the same Auth Configuration without impacting any of the projects other bespoke host configuration.

### Bundle Startup Logic in your Services Assembly

It also allows you to maintain any necessary Startup configuration that your Services implementation needs alongside the Services themselves.

E.g. This is used to register the `Data.Contact` to DTO `Contact` [Auto Mapping](/auto-mapping):

```csharp
// Register Custom Auto Mapping for converting Contact Data Model to Contact DTO
public class ContactsHostConfig : IConfigureAppHost 
{
    public void Configure(IAppHost appHost) =>
        AutoMapping.RegisterConverter((Data.Contact from) => from.ConvertTo<Contact>(skipConverters:true));
}
```

There are **3 different Startup interfaces** you can use depending on when you want your configuration to run.

### Register additional Service Assemblies on Startup

Use `IPreConfigureAppHost` for Startup logic you want to run before the AppHost starts initialization, this is
run before `AppHost.Config` is initialized or Services are registered so has limited configurability but is useful
if you want to register additional Service Assemblies with ServiceStack, e.g:

```csharp
public class ConfigureContactsServices : IPreConfigureAppHost
{
    public void PreConfigure(IAppHost host) => host.ServiceAssemblies.AddIfNotExists(typeof(MyServices).Assembly);
}
```

### Register no-touch Startup before and after your AppHost's Configure

Use `IConfigureAppHost` for Startup logic you want to run immediately **before** `AppHost.Configure()`:

```csharp
public interface IConfigureAppHost
{
    void Configure(IAppHost appHost);
}
```

Use `Priority <= -1` for Startup logic you want to run **before** `AppHost.Configure()` and
`Priority >= 1` for logic you want to run immediately **after** `AppHost.Configure()`:

```csharp
[Priority(-1)]
public class MyPreAppHostConfigure : IConfigureAppHost
{
    public void Configure(IAppHost host) => ...;
}

[Priority(1)]
public class MyPostAppHostConfigure : IConfigureAppHost
{
    public void Configure(IAppHost host) => ...;
}
```
