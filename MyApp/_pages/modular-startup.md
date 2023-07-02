---
slug: modular-startup
title: Modular Startup
---

::: info
For more information on the earlier Modular Startup in ServiceStack **v5.x** see our [Legacy Modular Startup](/modular-startup-legacy) docs
:::

Taking advantage of C# 9 top level statements and .NET 6 [WebApplication Hosting Model](https://gist.github.com/davidfowl/0e0372c3c1d895c3ce195ba983b1e03d), ServiceStack templates by utilize both these features to simplify configuring your AppHost in a modular way.

`Program.cs` becomes a script-like file since C# 9 top level statements are generating application entry point implicitly.

```csharp
var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseServiceStack(new AppHost())
app.Run();
```

The application `AppHost` hooks into startup using `HostingStartup` assembly attribute.
In ServiceStack templates, this uses the file name prefix of `Configure.*.cs` to help 
identify these startup modules.

All ServiceStack's features are loaded using .NET's `HostingStartup`, including ServiceStack's `AppHost` itself that's
now being configured in [Configure.AppHost.cs](https://github.com/NetCoreTemplates/web/blob/master/MyApp/Configure.AppHost.cs), e.g:

```csharp
[assembly: HostingStartup(typeof(MyApp.AppHost))]

namespace MyApp;

public class AppHost : AppHostBase, IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            // Configure ASP .NET Core IOC Dependencies
        });

    public AppHost() : base("MyApp", typeof(MyServices).Assembly) {}

    public override void Configure(Container container)
    {
        // Configure ServiceStack only IOC, Config & Plugins
        SetConfig(new HostConfig {
            UseSameSiteCookies = true
        });
    }
}
```

The use of Modular Startup does not change the AppHost declaration, but enables the modular grouping of configuration concerns.
Different features are encapsulated together allowing them to be more easily updated or replaced,
e.g. each feature could be temporarily disabled by commenting out its assembly HostingStartup's attribute:

```csharp
//[assembly: HostingStartup(typeof(MyApp.AppHost))]
```

## Module composition using `mix`

This has enabled ServiceStack Apps to be easily composed with the features developers need in mind. Either at project creation with servicestack.net/start page or after a project's creation where features can easily be added and removed using the command-line [mix tool](/mix-tool) where
you can view all available mix gists that can be added to projects with:

:::sh
x mix
:::

.NET 6's idiom is incorporated into the [mix gist config files](https://gist.github.com/gistlyn/9b32b03f207a191099137429051ebde8) to adopt its `HostingStartup` which is better able to load modular Startup configuration without assembly scanning.

This is a standard ASP .NET Core feature that we can use to configure Mongo DB in any ASP .NET Core App with:

:::sh
x mix mongodb
:::

Which adds the `mongodb` gist file contents to your ASP .NET Core Host project:

```csharp
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;

[assembly: HostingStartup(typeof(MyApp.ConfigureMongoDb))]

namespace MyApp;

public class ConfigureMongoDb : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            var mongoClient = new MongoClient();
            IMongoDatabase mongoDatabase = mongoClient.GetDatabase("MyApp");
            services.AddSingleton(mongoDatabase);
        });
}    
```

As it's not a ServiceStack feature it can be used to configure ASP .NET Core Apps with any feature,
e.g. we could also easily configure [Marten](https://martendb.io) in an ASP .NET Core App with:

:::sh
x mix marten
:::

The benefit of this approach is entire modules of features can be configured in a single command, e.g. An empty
ServiceStack App can be configured with MongoDB, ServiceStack Auth and a MongoDB Auth Repository with a single command:


:::sh
x mix auth auth-mongodb mongodb
:::

Likewise, you can replace MongoDB with a completely different PostgreSQL RDBMS implementation by running:

:::sh
x mix auth auth-db postgres
:::

### ConfigureAppHost

Looking deeper, we can see where we're plugins are able to configure ServiceStack via the `.ConfigureAppHost()` extension method:

```csharp
[assembly: HostingStartup(typeof(MyApp.ConfigureAuth))]

namespace MyApp;

// Add any additional metadata properties you want to store in the Users Typed Session
public class CustomUserSession : AuthUserSession
{
}

// Custom Validator to add custom validators to built-in /register Service requiring DisplayName and ConfirmPassword
public class CustomRegistrationValidator : RegistrationValidator
{
    public CustomRegistrationValidator()
    {
        RuleSet(ApplyTo.Post, () =>
        {
            RuleFor(x => x.DisplayName).NotEmpty();
            RuleFor(x => x.ConfirmPassword).NotEmpty();
        });
    }
}

public class ConfigureAuth : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            //services.AddSingleton<ICacheClient>(new MemoryCacheClient()); //Store User Sessions in Memory Cache (default)
        })
        .ConfigureAppHost(appHost => {
            var appSettings = appHost.AppSettings;
            appHost.Plugins.Add(new AuthFeature(() => new CustomUserSession(),
                new IAuthProvider[] {
                    new CredentialsAuthProvider(appSettings),     /* Sign In with Username / Password credentials */
                    new FacebookAuthProvider(appSettings),        /* Create App https://developers.facebook.com/apps */
                    new GoogleAuthProvider(appSettings),          /* Create App https://console.developers.google.com/apis/credentials */
                    new MicrosoftGraphAuthProvider(appSettings),  /* Create App https://apps.dev.microsoft.com */
                }));

            appHost.Plugins.Add(new RegistrationFeature()); //Enable /register Service

            //override the default registration validation with your own custom implementation
            appHost.RegisterAs<CustomRegistrationValidator, IValidator<Register>>();
        });
}
```

By default, any AppHost configuration is called before `AppHost.Configure()` is run, the AppHost can be further customized after its run:

```csharp
[assembly: HostingStartup(typeof(MyApp.ConfigureAuthRepository))]

namespace MyApp;

// Custom User Table with extended Metadata properties
public class AppUser : UserAuth
{
    public string ProfileUrl { get; set; }
    public string LastLoginIp { get; set; }
    public DateTime? LastLoginDate { get; set; }
}

public class AppUserAuthEvents : AuthEvents
{
    public override void OnAuthenticated(IRequest req, IAuthSession session, IServiceBase authService, 
        IAuthTokens tokens, Dictionary<string, string> authInfo)
    {
        var authRepo = HostContext.AppHost.GetAuthRepository(req);
        using (authRepo as IDisposable)
        {
            var userAuth = (AppUser)authRepo.GetUserAuth(session.UserAuthId);
            userAuth.ProfileUrl = session.GetProfileUrl();
            userAuth.LastLoginIp = req.UserHostAddress;
            userAuth.LastLoginDate = DateTime.UtcNow;
            authRepo.SaveUserAuth(userAuth);
        }
    }
}

public class ConfigureAuthRepository : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => services.AddSingleton<IAuthRepository>(c =>
            new OrmLiteAuthRepository<AppUser, UserAuthDetails>(c.Resolve<IDbConnectionFactory>()) {
                UseDistinctRoleTables = true
            }))
        .ConfigureAppHost(appHost => {
            var authRepo = appHost.Resolve<IAuthRepository>();
            authRepo.InitSchema();
            // CreateUser(authRepo, "admin@email.com", "Admin User", "p@55wOrd", roles:new[]{ RoleNames.Admin });
        }, afterConfigure: appHost => 
            appHost.AssertPlugin<AuthFeature>().AuthEvents.Add(new AppUserAuthEvents()));

    // Add initial Users to the configured Auth Repository
    public void CreateUser(IAuthRepository authRepo, string email, string name, string password, string[] roles)
    {
        if (authRepo.GetUserAuthByUserName(email) == null)
        {
            var newAdmin = new AppUser { Email = email, DisplayName = name };
            var user = authRepo.CreateUserAuth(newAdmin, password);
            authRepo.AssignRoles(user, roles);
        }
    }
}
```

### Customize AppHost at different Startup Lifecycles

To cater for all plugins, AppHost configurations can be registered at different stages within the AppHost's initialization:

```csharp
public void Configure(IWebHostBuilder builder) => builder
    .ConfigureAppHost(
        beforeConfigure:    appHost => /* fired before AppHost.Configure() */, 
        afterConfigure:     appHost => /* fired after AppHost.Configure() */,
        afterPluginsLoaded: appHost => /* fired after plugins are loaded */,
        afterAppHostInit:   appHost => /* fired after AppHost has initialized */);
```

### Removing Features

The benefits of adopting a modular approach to AppHost configuration is the same as general organizational code structure which results
in better decoupling and cohesion where it's easier to determine all the dependencies of a feature, easier to update, less chance of
unintended side effects, easier to share standard configuration amongst multiple projects and easier to remove the feature entirely,
either temporarily if needing to isolate & debug a runtime issue by:

```csharp
// [assembly: HostingStartup(typeof(MyApp.ConfigureAuth))]
```

Or easier to permanently replace or remove features by either directly deleting the isolated `*.cs` source files or by undoing mixing in the feature
using `mix -delete`, e.g:

:::sh
x mix -delete auth auth-db postgres
:::

Which works similar to package managers where it removes all files contained within each mix gist.

::: info
Please see the [Mix HowTo](https://gist.github.com/gistlyn/9b32b03f207a191099137429051ebde8#file-mix_howto-md) to find out how you can contribute your own gist mix features
:::

## Migrating to HostingStartup

As we'll be using the new `HostingStartup` model going forward we recommend migrating your existing configuration to use them.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="WgsFl0AFUdo" style="background-image: url('https://img.youtube.com/vi/WgsFl0AFUdo/maxresdefault.jpg')"></lite-youtube>

To help with this you can refer to the [mix diff](https://github.com/ServiceStack/mix/commit/b56746622aa1879e3e6a8cbf835e634f05db30db)
showing how each of the existing mix configurations were converted to the new model.

As a concrete example, lets take a look at the steps used to migrate our Chinook example application [from NET5 using the previous `Startup : ModularStartup`, to .NET 6 `HostingStartup`](https://github.com/NetCoreApps/Chinook/commit/2758af9deae9c3aa910a27134f95167f7ec6e541).

### Step 1
Migrate your existing `ConfigureServices` and `Configure(IApplicationBuilder)` from `Startup : ModularStartup` to the top-level host builder in `Program.cs`. Eg

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. 
    // You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.Run();
```

### Step 2

Move your `AppHost` class to a new `Configure.AppHost.cs` file.

### Step 3
Implement `IHostingStartup` on your AppHost with automatic initialization. Eg:

```csharp
public void Configure(IWebHostBuilder builder)
{
    builder.ConfigureServices(services => {
        // Configure ASP.NET Core IOC Dependencies
    });
}
```

### Step 4

Declare `assembly: HostingStartup` for your `AppHost` in the same `Configure.AppHost.cs`. Eg:

```csharp
[assembly: HostingStartup(typeof(Chinook.AppHost))]
```

### Step 5

Migrate each existing modular startup class that implements `IConfgiureServices` and/or `IConfigureApp` to use `IHostingStartup`. Eg:

```csharp
// net5.0 modular startup
using ServiceStack;

namespace Chinook;

public class ConfigureAutoQuery : IConfigureAppHost
{
    public void Configure(IAppHost appHost)
    {
        appHost.Plugins.Add(new AutoQueryFeature {
            MaxLimit = 1000,
            IncludeTotal = true
        });
    }
}
```

```csharp
// net6.0 modular startup using IHostingStartup
using Microsoft.AspNetCore.Hosting;
using ServiceStack;

[assembly: HostingStartup(typeof(Chinook.ConfigureAutoQuery))]

namespace Chinook;

public class ConfigureAutoQuery : IHostingStartup
{
    public void Configure(IWebHostBuilder builder)
    {
        builder.ConfigureAppHost(appHost =>
        {
            appHost.Plugins.Add(new AutoQueryFeature {
                MaxLimit = 1000,
                IncludeTotal = true
            });
        });
    }
}
```

> Remembering also that infrastructure like your `Dockerfile` or host will likely need the runtimes/SDKs updated as well.
