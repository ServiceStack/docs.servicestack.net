---
title: .NET Core Overview
---

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/netcore-banner.png?t)

Most of ServiceStack's features are also available on .NET Core, where it's all maintained within a single code-base 
enabling excellent source-code compatibility to maximize existing knowledge and code-reuse and reducing portability efforts, 
and released within the same suite of NuGet packages, all without breaking changes to existing .NET 4.5 Customers.

### .NET Core - the future of .NET on Linux

.NET Core enables an exciting era of .NET Web and Server App development - the kind .NET hasn't seen before. 
The existing Windows hosting and VS.NET restraints have been freed, now anyone can develop using .NET's
productive expertly-designed and statically-typed mainstream C#/F# languages in their preferred editor and 
host it on the most popular server Operating Systems, in either an all-Linux, all-Windows or mixed ecosystem. 
Not only does this flexibility increase the value of existing .NET investments but it also makes .NET appeal 
to the wider and highly productive developer ecosystem who've previously disregarded .NET as an option. 

.NET Core offers significant performance and stability improvements over Mono that's derived from a shared 
cross-platform code-base and supported by a well-resourced, active and responsive team. 
If you're currently running **ServiceStack on Mono**, we strongly recommend **upgrading to .NET Core** to 
take advantage of its superior performance, stability and its top-to-bottom supported Technology Stack.

and with that let's jump into seeing some ServiceStack Live Demos running on .NET Core in Linux...

### ServiceStack .NET Core Apps running in Docker

Hosting .NET Core Apps immediately exposes us to the benefits of .NET Core. We've ported the Live Demos using 
the most productive IDE and tooling combination we've found for us - which is still VS.NET with ReSharper. 
But for deployments and hosting we now have an array of options at our disposal, including joining the 
thriving state-of-the-art ecosystem around building Linux Docker images and deploying them to the cloud. 

For .NET Core Live Demos we've settled on the popular power combo of:

 - Using [travis-ci.org](https://travis-ci.org/) (free for OSS projects) for running CI scripts to rebuild Docker App Images on every check-in
 - Using [AWS EC2 Container Service](https://aws.amazon.com/ecs/) for managing Docker images and instance deployments
 - Using [nginx-proxy](https://github.com/jwilder/nginx-proxy) setting up an nginx reverse proxy and automatically bind virtual hosts to Docker Instances

You can checkout our [Deploy .NET Core with Docker to AWS ECS Guide](/deploy-netcore-docker-aws-ecs) 
for the details on how we've deployed the .NET Core Live Demos, but ultimately packaging .NET Core Apps 
inside Docker images enables a higher-level of abstraction letting you define your entire App Server 
Instance with a repeatable recipe that lets you treat and deploy instances like opaque self-contained units.

With our [.NET 4.5 Windows Live Demos](https://github.com/ServiceStackApps/LiveDemos) we're effectively 
mutating a static Windows Server VM that required pre-configuring with IIS Virtual Hosts. Any infrastructure 
Servers each Live Demo needs, are set up out-of-band and to minimize the System administration burden, 
all Demos share the same Redis server instance.

#### Repeatable, Isolated, no-touch automated Deployments

But for our .NET Core Docker deployments we have proper isolation and repeatable no-touch deployments 
where any infrastructure services each App needs are declared in configuration and deployed in a separate 
Docker container along side each App to an ECS cluster - decoupling your deployments from static EC2 instances.
This lets you treat your server infrastructure and deployment automation story like code, where it's 
checked-in with your Repo and run with your CI who packages it in a Docker Container, publishes it as an 
opaque Image and deploys it to the [AWS EC2 Container Service](https://aws.amazon.com/ecs/).

#### Linux Cost Savings

In addition to the thriving ecosystem and superior automation, another benefit of hosting .NET Core Apps 
on Linux is the considerable cost savings of hosting on a Linux infrastructure. Docker instances enable 
isolation with considerably more efficiency than VM's allowing you to pack them with greater density. 
For .NET Core Live Demos the single T2 medium instance (**$25 /month**) is hosting 15 Docker Images whilst
running at **~50% Memory Utilization** and **&lt;1% CPU Utilization** in its current idle state.

### Exceptional Code reuse

Thanks to ServiceStack's high-level host agnostic API and our approach to decouple from concrete HTTP abstractions behind lightweight `IRequest` interfaces, ServiceStack projects enjoy near perfect code reuse, which allows the same ServiceStack Services to be able to run on ASP.NET, HttpListener SelfHosts, SOAP Endpoints, multiple MQ Hosts and .NET Core Apps. The [HelloMobile Server Hosts](https://github.com/ServiceStackApps/HelloMobile#servicestack-server-app) shows an example of this where the same [AppHost Configuration and WebServices implementation](https://github.com/ServiceStackApps/HelloMobile/blob/master/src/Server.Common/WebServices.cs) is used in all:

 - .NET 6.0 Server
 - ASP.NET Core running on .NET Framework
 - ASP.NET Web App (.NET Framework)
 - HttpListener Self-Host (.NET Framework)
 
The primary advantage of this is simplicity, in both effort and cognitive overhead for creating Services that target multiple platforms, reuse of existing knowledge and investments in using ServiceStack libraries and features as well as significantly reduced migration efforts for porting existing .NET Framework code-bases to run on .NET Core where it enjoys near perfect source code compatibility. 
 
ServiceStack's exceptional source compatibility is visible in our new .NET 6.0 and .NET Framework project templates where all templates utilize the same recommended [Physical Project Structure](/physical-project-structure), reference the same NuGet packages, share the same source code for its Server and Client App implementations as well as Client and Server Unit and Integration Tests.

The primary difference between the .NET Core and .NET Framework project templates is how ServiceStack's `AppHost` is initialized, in ASP.NET it's done in `Global.asax` whilst for .NET Core it's registered in .NET Core's pipeline as standard. The `.csproj` are also different with .NET Core using MSBuild's new and minimal human-friendly format and the ASP.NET Framework templates continuing to use VS.NET's classic project format for compatibility with older VS .NET versions.

## New .NET 6.0 Project Templates
 
There are **11 .NET 6.0 project templates** for each of ServiceStack's most popular starting templates. Each .NET 6.0 template has an equivalent .NET Framework template except for ServiceStack [Sharp Apps](https://sharpscript.net/docs/sharp-apps) which is itself a pre-built .NET 6.0 App that lets you develop Web Applications and HTTP APIs on-the-fly without any compilation.

All .NET 6.0 Templates can be developed using your preferred choice of either VS Code, VS.NET or JetBrains Project Rider on your preferred Desktop OS. Given the diverse ecosystem used to develop .NET Core Applications, the new Project Templates are being maintained on GitHub and made available via our new [x new](/web-new) command-line utility, installable from npm with:
 
:::sh
dotnet tool install --global x 
:::
 
This makes the `x` .NET Core tool globally available which can be run without arguments to view all templates available:

::include web-new-netcore.md::

### Usage

That can be used to create new projects with:
 
:::sh
npx create-net `<template-name>` `<project-name>`
:::
 
Example of creating a new **Vue SPA** project called **Acme**:
 
:::sh
npx create-net vue-spa Acme
:::
 
The resulting `Acme.sln` can be opened in VS 2017 which will automatically restore and install both the .NET and npm packages upon first load and build. This can take a while to install all client and server dependencies, once finished the `wwwroot` folder will be populated with your generated Webpack App contained within a `/dist` folder alongside a generated `index.html` page. After these are generated you can run your App with **F5** to run your project as normal:

![](/img/pages/ssvs/dotnet-new-spa-files.png)

If using JetBrains Rider the npm packages can be installed by opening `package.json` and clicking on the **"npm install"** tooltip on the **bottom right**. In VS Code you'll need to run `npm install` manually from the command-line.

## .NET Core Live Demos

To showcase ServiceStack features running on .NET Core we've forked several of our existing 
[Live Demos](https://github.com/ServiceStackApps/LiveDemos) and ported them to .NET Core and 
listed them side-by-side with their original ASP.NET 4.5 code-bases so they can be easily compared.

The Live Demos cover a broad spectrum of ServiceStack features including:


### Multi-stage Docker Builds

The [.NET Core Apps deployed using Docker](/deploy-netcore-docker-aws-ecs) use ASP.NET Team's [recommended multi-stage Docker Builds](https://docs.microsoft.com/en-us/dotnet/core/docker/building-net-docker-images#your-first-aspnet-core-docker-app) where the App is built inside an `aspnetcore-build` Docker container with its published output copied inside a new `aspnetcore` runtime Docker container:

```docker
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /app

# copy csproj and restore as distinct layers
COPY src/*.sln .
COPY src/Chat/*.csproj ./Chat/
RUN dotnet restore

# copy everything else and build app
COPY src/Chat/. ./Chat/
WORKDIR /app/Chat
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS runtime
WORKDIR /app
COPY --from=build /app/Chat/out ./
ENV ASPNETCORE_URLS http://*:5000
ENTRYPOINT ["dotnet", "Chat.dll"]
```

The smaller footprint required by the `aspnetcore` runtime reduced the footprint of [.NET Core Chat](https://github.com/NetCoreApps/Chat) from **567MB** to **126MB** whilst continuing to run flawlessly in AWS ECS at [chat.netcore.io](http://chat.netcore.io).

### .NET Core Web Apps

.NET 6.0 is also used to enable [Sharp Apps](https://sharpscript.net/docs/sharp-apps) which is a new approach to dramatically simplify .NET Wep App development and provide the most productive development experience possible whilst maximizing reuse and component sharing. 

Web Apps let you develop dynamic websites without needing to write any C# code or perform any app builds which dramatically reduces the cognitive overhead and conceptual knowledge required for development where the only thing front-end Web developers need to know is [ServiceStack #Script Syntax](https://sharpscript.net/docs/syntax) and [what scripts are available](https://sharpscript.net/docs/filters-reference) to call. Because of #Script's high-fidelity with JavaScript, developing a Website with Templates will be instantly familiar to JavaScript devs despite calling and binding directly to .NET APIs behind the scenes.

#### [Web App Examples](https://gist.github.com/gistlyn/f555677c98fb235dccadcf6d87b9d098#live-demos#live-demos)

To illustrate the various features available we've developed a number of Web Apps examples to showcase the different kind of Apps that can easily be developed. The source code for each app is available from [github.com/NetCoreWebApps](https://github.com/sharp-apps). Each app runs the same unmodified [Web App Binary](https://github.com/ServiceStack/Web) that's also used in the Bare Web App project above.

You can quickly get started by creating a Web App from the project template:

:::sh
dotnet-new bare-app ProjectName
:::

## Run ASP.NET Core Apps on the .NET Framework

A primary use-case prevented from having unified NuGet packages containing both **.NET Standard** and **.NET Framework** builds is being able to run ASP.NET Core Apps on the **.NET Framework** which stems from:

  - `net45` - Contains support for running **ASP.NET** Web or Self-Hosting **HttpListener** App Hosts
  - `netstandard2.0` - Contains support for only running on **ASP.NET Core** App Hosts

Where the `net45` builds always get used when they're added to any **.NET Framework** project. To support running ASP.NET Core Apps on the .NET Framework you can use the `.Core` NuGet packages which contains only the **.NET Standard 2.0** builds in order to force .NET Framework projects to use **.NET Standard 2.0** builds. Currently the complete list of `.Core` packages which contains only **.NET Standard 2.0** builds include:

 - ServiceStack.Text.Core
 - ServiceStack.Interfaces.Core
 - ServiceStack.Client.Core
 - ServiceStack.HttpClient.Core
 - ServiceStack.Core
 - ServiceStack.Common.Core
 - ServiceStack.Mvc.Core
 - ServiceStack.Server.Core
 - ServiceStack.Redis.Core
 - ServiceStack.OrmLite.Core
 - ServiceStack.OrmLite.Sqlite.Core
 - ServiceStack.OrmLite.SqlServer.Core
 - ServiceStack.OrmLite.PostgreSQL.Core
 - ServiceStack.OrmLite.MySql.Core
 - ServiceStack.OrmLite.MySqlConnector.Core
 - ServiceStack.Aws.Core
 - ServiceStack.Azure.Core
 - ServiceStack.RabbitMq.Core
 - ServiceStack.Api.OpenApi.Core
 - ServiceStack.Admin.Core
 - ServiceStack.Stripe.Core
 - ServiceStack.Kestrel

::: warning
Ultimately support for whether a **.NET Standard 2.0** library will run on the .NET Framework depends on whether external dependencies also support this scenario which as it's a more niche use-case, will be a less tested scenario
:::

Other issues from being a less popular scenario is not being able to reference the [Microsoft.AspNetCore.All](https://www.nuget.org/packages/Microsoft.AspNetCore.All) meta package which only supports .NET Core 2.1 projects, instead ASP.NET .NET Standard packages will need to be referenced individually. 

To make it as easy as possible to get started you can use the [NetFrameworkCoreTemplates](https://github.com/NetFrameworkCoreTemplates) containing popular starting templates for running ASP.NET Core Apps on .NET Framework (default v4.7) which as a convention all have the `-corefx` suffix: 

 - [web-corefx](https://github.com/NetFrameworkCoreTemplates/web-corefx) - .NET Framework ASP.NET Core Website
 - [empty-corefx](https://github.com/NetFrameworkCoreTemplates/empty-corefx) - .NET Framework ASP.NET Core Single Project Website
 - [selfhost-corefx](https://github.com/NetFrameworkCoreTemplates/selfhost-corefx) - .NET Framework ASP.NET Core self-hosting Console App
 - [mvc-corefx](https://github.com/NetFrameworkCoreTemplates/mvc-corefx) - .NET Framework ASP.NET Core MVC Website
 - [razor-corefx](https://github.com/NetFrameworkCoreTemplates/razor-corefx) - .NET Framework ASP.NET Core Website with ServiceStack.Razor
 - [templates-corefx](https://github.com/NetFrameworkCoreTemplates/templates-corefx) - .NET Framework ASP.NET Core Templates Bootstrap Website

This will let you create an ASP.NET Core App running on the .NET Framework v4.7 with the [dotnet tool](/dotnet-tool):

:::sh
dotnet tool install --global x 
:::

Then create a new project with:

:::sh
npx create-net web-corefx AcmeNetFx
:::

Which can then be opened in your preferred VS.NET or Project Rider C# IDE.

### ServiceStack features that won't be supported in .NET Core

Whilst we were able to make most of ServiceStack's features available in .NET Core there are a number of 
features that we're not able to support, these include:

 - **HttpListener** inc. all .NET 4.5 Self Host AppHosts - replaced with .NET Core's Kestrel
 - **SOAP Support** inc. WSDLs, XSDs - missing WCF implementations in .NET Core
 - **Mini Profiler** - tightly coupled to System.Web
 - **Markdown Razor** - CodeDom not available in .NET Core (vanilla Markdown still supported)
 - **ServiceStack.Authentication.OAuth2** - DotNetOpenAuth dependency not available in .NET Core
 - **ServiceStack.Authentication.OpenId** - DotNetOpenAuth dependency not available in .NET Core
 - **MVC FluentValidation Validators** - tightly coupled to old System.Web MVC
 - **ServiceStack.Razor** inc all existing `Html.*` helpers - tightly coupled to System.Web Razor

Whilst we lost our beloved **ServiceStack.Razor** support we developed a completely new implementation backed 
by .NET Core MVC where we were able to implement most of ServiceStack.Razor user-facing features
so porting should still be relatively straightforward with some minor syntax and configuration changes needed. 
This new implementation is available in **ServiceStack.Mvc** package and can be seen in action in 
the [Razor Rockstars .NET Core demo](http://razor.netcore.io).

### AppSelfHostBase Source-compatible Self-Host

The **ServiceStack.Kestrel** NuGet package encapsulates .NET Core's Kestrel HTTP Server dependency 
behind a source-compatible `AppSelfHostBase` which can be used to create source-compatible Self Hosted Apps
and is what enables the exact same .NET Framework Template's [Integration Tests](https://github.com/NetFrameworkTemplates/vue-spa-netfx/blob/master/MyApp.Tests/IntegrationTest.cs) to 
be used in .NET Core Template's [Integration Tests](https://github.com/NetCoreTemplates/vue-spa/blob/master/MyApp.Tests/IntegrationTest.cs).

### AppHostBase .NET Core Module

Whilst `AppSelfHostBase` enables the same development experience for developing Self-Hosted ServiceStack
Solutions, when developing .NET Core-only Web Apps we instead recommend inheriting from `AppHostBase` and 
registering ServiceStack as a .NET Core module in order to remain consistent with all other .NET Core solutions. 

In ASP.NET 4.5, `AppHostBase` is used to create an ASP.NET ServiceStack Host, but in .NET Core all Web Apps 
are Console Apps, `AppHostBase` in this case just refers to a normal ServiceStack `AppHost` you'll use to 
idiomatically register your ServiceStack AppHost into .NET Core's `IApplicationBuilder` pipeline as a standard 
.NET Core Module.

### Binding to .NET Core

To see how ServiceStack integrates with .NET Core we'll walk through porting the stand-alone 
[Todos Live Demo](https://github.com/NetCoreApps/Todos) which contains the entire implementation of
a functional Todos Web App back-end in a single 
[Startup.cs](https://github.com/NetCoreApps/Todos/blob/master/src/Todos/Startup.cs) that we created using 
the **ASP.NET Core Web Application (.NET Core)** Empty VS.NET Template.

```csharp
public class Program
{
    public static void Main(string[] args)
    {
        var host = new WebHostBuilder()
            .UseKestrel()
            .UseContentRoot(Directory.GetCurrentDirectory())
            .UseIISIntegration()
            .UseStartup<Startup>()
            .Build();

        host.Run();
    }
}
```

### .NET Core Startup


Alternatively you can start with any of the [.NET Core Templates](https://github.com/NetCoreTemplates/) which 
uses ASP .NET Core's recommended [Top-level statements](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/program-structure/top-level-statements) for its [Program.cs](https://github.com/LegacyTemplates/razor-pages/blob/main/MyApp/Program.cs) Startup class, e.g:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Configure ASP .NET Core Dependencies

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

//Register your ServiceStack AppHost as a .NET Core module
app.UseServiceStack(new AppHost()); 

app.Run(async (context) =>
{
    await context.Response.WriteAsync("Hello World!");
});
```

This shows the minimum code required to configure ServiceStack to run in .NET Core. It works similarly to the 
[Wildcard HttpHandler configuration](https://github.com/ServiceStackApps/Todos/blob/fdcffd37d4ad49daa82b01b5876a9f308442db8c/src/Todos/Web.config#L37) in your ASP.NET **Web.config** telling ASP.NET to route all requests to ServiceStack. The difference here 
is that ServiceStack is registered in a pipeline and only receives requests that weren't handled in any of
the preceding modules. Likewise ServiceStack will just call the next Module in the pipeline for any Requests 
that it's not configured to handle, this is in contrast to ASP.NET 4.5 where ServiceStack was designed to handle 
all requests it receives, so it instead returns a `NotFoundHandler` and responds with a 404 Response.

In the above configuration any Request that ServiceStack doesn't handle gets passed on to the next module 
registered, which in this case will return a `Hello World!` plain text response.

### .NET Core AppHost Integration

Once inside your `AppHost` you're back in ServiceStack-land where it's business as usual and your AppHost 
configuration remains the same as before: 

```csharp
// Create your ServiceStack Web Service with a singleton AppHost
public class AppHost : AppHostBase
{
    // Initializes your AppHost Instance, with the Service Name and assembly containing the Services
    public AppHost() : base("Backbone.js TODO", typeof(TodoService).Assembly) { }

    // Configure your AppHost with the necessary configuration and dependencies your App needs
    public override void Configure(Container container)
    {
        //Register Redis Client Manager singleton in ServiceStack's built-in Func IOC
        container.Register<IRedisClientsManager>(new BasicRedisClientManager("localhost"));
    }
}
```

This was all it took to port the 
[Todos back-end Services](https://github.com/NetCoreApps/Todos/blob/c742da45c9a70217980c2f2b323813fe7821df06/src/Todos/Startup.cs#L61-L110)
to run on .NET Core which was able to reuse the entire existing Service implementation as-is. 

The other change needed outside the Todos ServiceStack implementation was to match .NET Core's default convention 
of serving static files from the **WebRootPath** which just required moving all static resources into the 
[/wwwroot](https://github.com/NetCoreApps/Todos/tree/master/src/Todos/wwwroot) folder.

And with that the [Todos port](https://github.com/NetCoreApps/Todos) was complete.

## Seamless Integration with .NET Core

In addition to running flawlessly on .NET Core we're also actively striving to find how we can best 
integrate with and leverage the surrounding .NET Core ecosystem and have made several changes to that end:

### CamelCase

The JSON and JSV Text serializers are following .NET Core's default convention to use **camelCase** properties
by default. This can be reverted back to **PascalCase** with:

```csharp
SetConfig(new HostConfig { UseCamelCase = false })
```

We also agree with this default, .NET Core seems to be centered around embracing the surrounding 
developer ecosystem where .NET's default **PascalCase** protrudes in a sea of **camelCase** and 
**snake_case** JSON APIs. This won't have an impact on .NET Service Clients or Text Serialization which 
supports case-insensitive properties, however Ajax and JS clients will need to be updated to use matching properties.
You can use [ss-utils normalize()](/ss-utils-js.html#normalize-and-normalizekey) methods
to help with handling both conventions by recursively normalizing and converting all properties to **lowercase**.

### .NET Core Container Adapter

Like ServiceStack, .NET Core now has a built-in IOC where you can register any dependencies you need in
your Startup `ConfigureServices()`, e.g:

```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddTransient<IFoo, Foo>()
                .AddScoped<IScoped, Scoped>()
                .AddSingleton<IBar>(c => new Bar { Name = "bar" });
    }
}
```

#### Scoped Dependencies

In .NET Core ServiceStack is pre-configured to use a `NetCoreContainerAdapter` where it will also resolve any 
dependencies declared in your .NET Core Startup using `app.ApplicationServices`. One side-effect of this is that 
when resolving **Scoped** dependencies it resolves them in a Singleton scope instead of the Request Scope had 
they instead been resolved from `context.RequestServices.GetService<T>()`.

One way to be able to inject scoped dependencies into your Services is to register the `IHttpContextAccessor`
where they'll be resolved from ASP.NET Core's RequestServices context:

```csharp
public void ConfigureServices(IServiceCollection services)
{
     services.AddHttpContextAccessor();
     services.AddScoped<IScoped, Scoped>();
}
```

Otherwise if you need to resolve Request Scoped .NET Core dependencies you can resolve them from `IRequest`, e.g:

```csharp
public object Any(MyRequest request)
{
    var requestScope = base.Request.TryResolve<IScoped>();
}
```

Alternatively you can register the dependencies in ServiceStack's IOC instead, e.g:

```csharp
public override void Configure(Container container)
{
    services.RegisterAutoWiredAs<Scoped,IScoped>()
        .ReusedWithin(ReuseScope.Request);
}
```

Where they'd be resolved within ServiceStack's Request Scope instead of via ASP.NET Core's RequestServices.

### ASP.NET Core IServiceProvider APIs

Registering dependencies in ServiceStack's IOC are only available within ServiceStack, you can access 
**scoped ASP.NET Core dependencies** and create Custom IOC Scopes using the `IRequest` APIs below:

 - `IRequest.TryResolveScoped<T>()`
 - `IRequest.TryResolveScoped()`
 - `IRequest.ResolveScoped<T>()`
 - `IRequest.ResolveScoped()`
 - `IRequest.CreateScope()`
 - `IRequest.GetServices()`
 - `IRequest.GetServices<T>()`

Which can be used to create custom scopes that utilizes ASP.NET Entity Framework Identity classes in your ServiceStack Services:

```csharp
using (var scope = Request.CreateScope())
{
    var RoleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var UserManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

    var managerUser = await UserManager.FindByEmailAsync("manager@gmail.com");
    if (managerUser == null)
    {
        assertResult(await UserManager.CreateAsync(new ApplicationUser {
            DisplayName = "Test Manager",
            Email = "manager@gmail.com",
            UserName = "manager@gmail.com",
            FirstName = "Test",
            LastName = "Manager",
        }, "p@55wOrd"));
        
        managerUser = await UserManager.FindByEmailAsync("manager@gmail.com");
        await UserManager.AddToRoleAsync(managerUser, "Manager");
    }
}
```

### Register ASP.NET Core dependencies in AppHost

Any dependencies registered .NET Core Startup are also available to ServiceStack but dependencies registered in ServiceStack's IOC 
are **only** visible to ServiceStack.

This is due to the limitation of ASP.NET Core requiring all dependencies needing to be registered in `ConfigureServices()` before any App Modules 
are loaded and why dependencies registered in ServiceStack's AppHost `Configure()` are only accessible from ServiceStack and 
not the rest of ASP.NET Core. 

But in [Modular Startup](/modular-startup) Apps you can override ASP.NET Core's `builder.ConfigureServices(IServiceCollection)` method in your AppHost
`Configure(IWebHostBuilder builder)` to register IOC dependencies where they'll now be accessible to both ServiceStack and the rest of your ASP.NET Core App, e.g:

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
            UseSameSiteCookies = true,
        });
    }
}
```

The `IWebHostBuilder` can also be used to hook into the `Configure(IApplicationBuilder)` to inject ASP.NET Core middleware, including ServiceStack and
 the `AppHost` itself.

::: info
Reason for only conditionally registering ServiceStack with `if (!HasInit)` is to allow other plugins (like Auth) the opportunity
to precisely control where ServiceStack is registered within its preferred ASP .NET Core's pipeline
:::

This will let you drop-in your custom `AppHost` into a [ModularStartup enabled ASP.NET Core App](/modular-startup) to enable the same 
"no-touch" auto-registration.

### .NET Core IAppSettings Adapter

.NET Core Templates are also pre-configured to use the new `NetCoreAppSettings` adapter to utilize .NET Core's new `IConfiguration` config model in ServiceStack by default.

This lets you use **appsettings.json** and .NET Core's other Configuration Sources from ServiceStack's `IAppSettings` API where it continues to resolve both primitive values and complex Types, e.g:

```csharp
bool debug = AppSettings.Get<bool>("DebugMode", false);
MyConfig myConfig = AppSettings.Get<MyConfig>();
List<string>  ghScopes = AppSettings.Get<List<string>>("oauth.github.Scopes");
IList<string> fbScopes = AppSettings.GetList("oauth.facebook.Permissions");
```

But instead of a single JSV string value, you'll need to use the appropriate JSON data type, e.g:

```json
{
    "DebugMode": true,    
    "MyConfig": {
        "Name": "Kurt",
        "Age": 27
    },
    "oauth.facebook.Permissions": ["email"],
    "oauth.github.Scopes": ["user"]
}
```

### Consistent Registration APIs

To retain the same nomenclature that .NET Core uses to register dependencies we've added several 
[Overloads to ServiceStack's IOC](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/ContainerNetCoreExtensions.cs)
letting you use a single consistent API to register dependencies in both ServiceStack and .NET Core IOC's 
making it easy to move registrations between the two, e.g:

```csharp
public void Configure(Container container)
{
    container.AddTransient<IFoo, Foo>()
             .AddScoped<IScoped, Scoped>()
             .AddSingleton<IBar>(c => new Bar { Name = "bar" });
}
```

ServiceStack's `Container` also implements .NET Core's `IServiceProvider` interface giving it access to 
.NET Core's convenience extension methods for resolving dependencies, e.g:

```csharp
var foo = container.GetService<IFoo>();
```

### ServiceStack.Logging Adapters

The default 
Logging is an example of an abstraction which didn't make sense to maintain a separate implementation 
as any adapter would only be able to support logging within ServiceStack. With logging you'll want to
configure it one place and have it apply to your whole application, so we've instead pre-configured 
ServiceStack.Logging to proxy all messages to .NET Core's 
[logging abstraction](https://docs.asp.net/en/latest/fundamentals/logging.html)
where you'll only need to configure logging once in `Startup` and have it handle all logging solution-wide.


### .NET Standard 2.0 Logging Providers

Whilst our recommendation is to use .NET Core's Logging Abstraction, if you prefer you can avoid this abstraction and 
configure logging with ServiceStack directly with the logging providers below which maintains **.NET Standard 2.0** versions:

 - ServiceStack.Logging.Serilog
 - ServiceStack.Logging.Slack

### WebRootPath and ContentRootPath

Classic ASP.NET serves static resources from your Host project's folder but in .NET Core this has been moved 
to your App's `/wwwroot` folder, separated from your App's non-public assets which remain in
your projects root folder.

To match this convention we've configured the read-only `VirtualFileSources` to point to the `/wwwroot` 
**WebRootPath** whilst the read/write `IVirtualFiles` is configured to your projects **ContentRootPath** folder.

#### MapProjectPath

As ServiceStack can be hosted in variety of different platforms encompassing several AppHost's, we've
added a new `IAppHost.MapProjectPath()` API that can be used to consistently resolve an absolute file path 
using a **virtualPath** from your Host Project root folder, e.g:

```csharp
var filePath = appHost.MapProjectPath("~/path/to/settings.txt");
```

### Hosting ASP.NET Core Apps on Custom Path

Use the `PathBase` property on AppHost for hosting a ServiceStack .NET Core App at a custom path, e.g:

```csharp
app.UseServiceStack(new AppHost {
    PathBase = "/api",
});
```

Resulting in both `Config.PathBase` and `Config.HandlerFactoryPath` getting populated with and without the `/` suffix:

```csharp
Config.PathBase           //= /api
Config.HandlerFactoryPath //= api
```

When necessary the `PathBase` property is available in both server rendered views:

::: v-pre
  - `{{PathBase}}` variable in [#Script Pages](https://sharpscript.net/docs/script-pages)
  - `PathBase` in Razor Views
:::

### HostContext.TryGetCurrentRequest()

ASP.NET Web Applications let you resolve the `IRequest` of the current executing HTTP Request with:

```
IRequest req = HostContext.TryGetCurrentRequest();
```

Which is a wrapper over accessing the `HttpContext.Current` singleton but as there's no equivalent in 
HttpListener self hosts this returns `null`. .NET Core also doesn't enable singleton access to the current 
HttpRequest by default but can be enabled by registering:

```csharp
services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
```

Although this should only be registered if needed as it has 
[non-trivial performance costs](https://github.com/aspnet/Hosting/issues/793).

### OrmLite LIKE Queries

One of our primary goals with ServiceStack providers is compatibility which lets you easily switch 
providers without having to change any call-site logic using the abstraction.

One case where this has an impact on performance is in OrmLite **LIKE** queries where some RDBMS 
providers will perform case-sensitive LIKE queries so in order to retain consistent behavior across 
all RDBMS providers OrmLite generates queries using `UPPER(Field)` to ensure case-insensitive searches. 

However given .NET Core's strong focus on performance we've removed this feature and reverted to the 
behavior of the underlying RDBMS so it no longer invalidates any DB Indexes on Fields. A more efficient 
alternative to get case-insensitive LIKE queries (where it's not the default) is to use a case-insensitive 
collation.

This behavior also applies to AutoQuery LIKE queries and can be reverted with:

```csharp
OrmLiteConfig.StripUpperInLike = false;
```

### Register ServiceStack HttpHandlers as .NET Core Modules

Under the hood ServiceStack's functionality is split into different HTTP Handlers that implements 
[ASP.NET's IHttpAsyncHandler](https://msdn.microsoft.com/en-us/library/ms227433.aspx) and is also adapted to 
support HttpListener self-hosts behind ServiceStack's `IRequest` abstractions. 

We're happy to report that ServiceStack's HTTP Handlers can also be registered as a .NET Core module in 
the `IApplicationBuilder` pipeline. This lets you for instance return the same information as ServiceStack's
[?debug=requestinfo](/debugging.html#request-info) route for any unhandled 
requests by registering the `RequestInfoHandler` as the last module in .NET Core's `IApplicationBuilder` 
pipeline, e.g:

```csharp
app.UseServiceStack(new AppHost());

app.Use(new RequestInfoHandler());
```

Some other examples of HTTP Handlers you could use is returning an image by registering a `StaticFileHandler`
configured with the **virtualPath** of the image (from **ContentRootPath**):

```csharp
app.Use(new StaticFileHandler("wwwroot/img/404.png"));
```

Or you can even render an MVC Razor View by returning it in a `RazorHandler`, e.g:

```csharp
app.Use(new RazorHandler("/login"));
```

Which will render the `/wwwroot/login.cshtml` Razor Page using the 
[MVC Smart Razor Pages support](/netcore-razor)

# Community Resources

  - [ASP.NET Core 2 + React + Docker + ServiceStack](https://medium.com/@williams.jackj/asp-net-core-2-react-docker-servicestack-96be42933e86) by [@jackkedd](https://twitter.com/jackkedd)
