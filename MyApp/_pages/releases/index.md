---
title: Release Notes Summary
---

> [Release Notes History](/release-notes-history)

# [v5.0.2 Update](/releases/v5_0_0)

Happy New 2018 All! We hope you’ve all had a long, relaxing break over the holidays and are re-energized for a productive start to the new year. We have a new v5.0.2 release ready for the start of the new year. A summary of the changes are included below, for the full details see the [v5 Release Notes](/releases/v5_0_0).

### Future Versioning Updates

We intend to ship more frequent "Enhancement Updates" like this one in between major releases so we're able to ship fixes to Customers sooner. Update releases will be primarily additive and minimally disruptive so they’re safe to upgrade.

To distinguish updates from normal releases we’ll use the `{PATCH}` version to indicate an Enhancement Release and use the `{MINOR}` version for normal major releases:

    {MAJOR}.{MINOR}.{PATCH}

The `{MAJOR}` is reserved for Major releases like v5 containing structural changes that may require changes to environment and/or project configurations like v5. A new `{MINOR}` version will be used for normal "Major" releases which will have a `{PATCH}` version of **0**. An **even** `{PATCH}` version number indicates an "Update" release published to **NuGet** whilst an **odd** version number indicates a "pre-release" version that's only [available on MyGet](/myget), e.g:

  - **v5.0.0** - Current Major Release with structural changes
    - v5.0.2 - Enhancement of Major v5.0.0 Release
    - v5.0.3 - Pre-release packages published to MyGet only
    - v5.0.4? - Enhancement of Major v5.0.0 Release (if any)
  - **v5.1.0** - Next Major Release
    - v5.1.1 - Pre-release packages published to MyGet only
    - v5.1.2? - Enhancement of Major v5.1.0 Release (if any)
  - ...
  - **v6.0.0** - Next Major Release with structural changes

## Run ASP.NET Core Apps on the .NET Framework

To support developing ASP.NET Core Apps on the .NET Framework we'll continue publishing `.Core` packages which contains only the **.NET Standard 2.0** builds in order to force .NET Framework projects to use **.NET Standard 2.0** builds which contains support for running ASP.NET Core Apps. The complete list of `.Core` packages include:

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

To make it as easy possible to get started we've created a new [NetFrameworkCoreTemplates](https://github.com/NetFrameworkCoreTemplates) GitHub Organization containing popular starting templates for running ASP.NET Core Apps on .NET Framework (default v4.7) which as a convention all have the `-corefx` suffix: 

 - [web-corefx](https://github.com/NetFrameworkCoreTemplates/web-corefx) - .NET Framework ASP.NET Core Website
 - [empty-corefx](https://github.com/NetFrameworkCoreTemplates/empty-corefx) - .NET Framework ASP.NET Core Single Project Website
 - [selfhost-corefx](https://github.com/NetFrameworkCoreTemplates/selfhost-corefx) - .NET Framework ASP.NET Core self-hosting Console App
 - [mvc-corefx](https://github.com/NetFrameworkCoreTemplates/mvc-corefx) - .NET Framework ASP.NET Core MVC Website
 - [razor-corefx](https://github.com/NetFrameworkCoreTemplates/razor-corefx) - .NET Framework ASP.NET Core Website with ServiceStack.Razor
 - [templates-corefx](https://github.com/NetFrameworkCoreTemplates/templates-corefx) - .NET Framework ASP.NET Core Templates Bootstrap Website

The latest `@servicestack/cli` **v1.0.2** has been updated to include this additional config source, including them in the list of available templates:

    $ dotnet-new

![](/img/pages/ssvs/dotnet-new-list.png)

Which will let you create an ASP.NET Core App running on the .NET Framework v4.7 with:

    $ npm install -g @servicestack/cli

    $ dotnet-new web-corefx AcmeNetFx

Which can then be opened in your preferred VS.NET or Project Rider C# IDE.

## ServiceStack Mobile and Desktop Apps

[![](https://raw.githubusercontent.com/ServiceStackApps/HelloMobile/master/screenshots/splash-900.png)](https://github.com/ServiceStackApps/HelloMobile)

The [HelloMobile](https://github.com/ServiceStackApps/HelloMobile) project has been rewritten to use the latest v5 .NET Standard 2.0 and .NET Framework clients and contains multiple versions of the same App demonstrating a number of different calling conventions, service integrations and reuse possibilities for each of the following platforms:

 - WPF
 - UWP
 - Xamarin.Android
 - Xamarin.iOS
 - Xamarin.OSX
 - Xamarin.Forms
   - iOS
   - Android
   - UWP

### ServiceStack Server App

The [HelloMobile](https://github.com/ServiceStackApps/HelloMobile) project also provides an example of ServiceStack's versatility where the [WebServices.cs](https://github.com/ServiceStackApps/HelloMobile/blob/master/src/Server.Common/WebServices.cs) implementation can be hosted on any of .NET's popular HTTP Server hosting configurations:

### [Server.NetCore](https://github.com/ServiceStackApps/HelloMobile/tree/master/src/Server.NetCore)

The AppHost for hosting the ServiceStack Services in a ASP.NET Core 2.0 App:

```csharp
public class AppHost : AppHostBase
{
    public AppHost() : base(nameof(Server.NetCore), typeof(WebServices).Assembly) { }
    public override void Configure(Container container) => SharedAppHost.Configure(this);
}
```

### [Server.NetCoreFx](https://github.com/ServiceStackApps/HelloMobile/tree/master/src/Server.NetCoreFx)

The same source code can be used to run a ServiceStack ASP.NET Core App on the **.NET Framework**:

```csharp
public class AppHost : AppHostBase
{
    public AppHost() : base(nameof(Server.NetCoreFx), typeof(WebServices).Assembly) { }
    public override void Configure(Container container) => SharedAppHost.Configure(this);
}
```

The difference between a **.NET Framework v4.7** and a **.NET Core 2.0** ASP.NET Core App is in [Server.NetCoreFx.csproj](https://github.com/ServiceStackApps/HelloMobile/blob/master/src/Server.NetCoreFx/Server.NetCoreFx.csproj) where it references **ServiceStack.Core** NuGet package to force using the **.NET Standard 2.0** version of ServiceStack that contains the support for hosting ASP.NET Core Apps.

### [Server.AspNet](https://github.com/ServiceStackApps/HelloMobile/tree/master/src/Server.AspNet)

The same source code is also used for hosting classic ASP.NET Web Applications:

```csharp
public class AppHost : AppHostBase
{
    public AppHost() : base(nameof(Server.AspNet), typeof(WebServices).Assembly) { }
    public override void Configure(Container container) => SharedAppHost.Configure(this);
}
```

### [Server.HttpListener](https://github.com/ServiceStackApps/HelloMobile/tree/master/src/Server.HttpListener)

Alternatively to host in a .NET Framework Self-Hosting HttpListener, the AppHost needs to inherit from `AppSelfHostBase`:

```csharp
public class AppHost : AppSelfHostBase
{
    public AppHost() : base(nameof(Server.HttpListener), typeof(WebServices).Assembly) {}
    public override void Configure(Container container) => SharedAppHost.Configure(this);
}
```

## .NET Standard 2.0 Logging Providers

Whilst our recommendation is to use [.NET Core's Logging Abstraction](/netcore#servicestacklogging-adapters) some Customers prefer to avoid this abstraction and configure logging directly with ServiceStack. To support this we've included **.NET Standard 2.0** builds to the following logging providers:

 - ServiceStack.Logging.Serilog
 - ServiceStack.Logging.Slack

## Async Error Handling

This is an enhancement to our [Expanded Async Support](#expanded-async-support) where there's now the option to register async exception handlers, e.g:

```csharp
this.ServiceExceptionHandlersAsync.Add(async (httpReq, request, ex) =>
{
    await LogServiceExceptionAsync(httpReq, request, ex);

    if (ex is UnhandledException)
        throw ex;

    if (request is IQueryDb)
        return DtoUtils.CreateErrorResponse(request, new ArgumentException("AutoQuery request failed"));

    return null;
});

this.UncaughtExceptionHandlersAsync.Add(async (req, res, operationName, ex) =>
{
    await res.WriteAsync($"UncaughtException '{ex.GetType().Name}' at '{req.PathInfo}'");
    res.EndRequest(skipHeaders: true);
});
```

If you were instead inheriting `OnServiceException` or `OnUncaughtException` in your AppHost they now return a `Task` type.

## AutoQuery DISTINCT

AutoQuery added support querying DISTINCT fields by prefixing the custom fields list with `DISTINCT `, example using QueryString:

    ?Fields=DISTINCT Field1,Field2

Examle using C# Client:

```csharp
var response = client.Get(new QueryCustomers { 
    Fields = "DISTINCT Country"
})
```

We can use this feature with Northwinds existing [AutoQuery Request DTOs](https://github.com/NetCoreApps/Northwind/blob/master/src/Northwind.ServiceModel/AutoQuery.cs):

```csharp
[Route("/query/customers")]
public class QueryCustomers : QueryDb<Customer> { }
```

To return all unique City and Countries of Northwind Customers with:

 - [northwind.netcore.io/query/customers?Fields=DISTINCT City,Country](https://northwind.netcore.io/query/customers?Fields=DISTINCT%20City,Country)

Or to just return their unique Countries they're in:

 - [northwind.netcore.io/query/customers?Fields=DISTINCT Country](https://northwind.netcore.io/query/customers?Fields=DISTINCT%20Country)

### OrmLite commandFilter

An optional `Func<IDbCommand> commandFilter` has been added to OrmLite's `INSERT` and `UPDATE` APIs to allow customization and inspection of the populated `IDbCommand` before it's run. This feature is utilized in the new [Conflict Resolution Extension methods](https://github.com/ServiceStack/ServiceStack.OrmLite/blob/master/src/ServiceStack.OrmLite/OrmLiteConflictResolutions.cs) where you can specify the conflict resolution strategy when a Primary Key or Unique constraint violation occurs:

```csharp
db.InsertAll(rows, dbCmd => dbCmd.OnConflictIgnore());

//Equivalent to: 
db.InsertAll(rows, dbCmd => dbCmd.OnConflict(ConflictResolution.Ignore));
```

In this case it will ignore any conflicts that occurs and continue inserting the remaining rows in SQLite, MySql and PostgreSQL, whilst in SQL Server it's a NOOP.

SQLite offers [additional fine-grained behavior](https://sqlite.org/lang_conflict.html) that can be specified for when a conflict occurs:

 - ROLLBACK
 - ABORT
 - FAIL
 - IGNORE
 - REPLACE

### ServiceStack.Text

The `XmlSerializer.XmlWriterSettings` and `XmlSerializer.XmlReaderSettings` for controlling the default XML behavior is now publicly accessible with [DTD Processing now disabled by default](https://msdn.microsoft.com/en-us/magazine/ee335713.aspx).

Support for leading zeros in integers was restored.


# v5 Release Notes

The theme of this major v5 release is integration and unification with the newly released .NET Standard 2.0 which offers the broadest compatibility and stabilized API surface for .NET Core and the version we've chosen to standardize around.

We'll do our best to summarize new features here but if you have time we encourage you to read the [full v5 Release Notes](/releases/v5_0_0), as this is a major version upgrade we recommend at least reviewing the [v5 Changes and Migration Notes](/releases/v5_0_0#v5-changes-and-migration-notes) before upgrading. Whilst the user-facing source code impact is minimal, we've taken the opportunity of a major version window to perform some logical re-structuring and some potentially breaking changes from **replacing PCL clients** to use .NET Standard 2.0, moving .NET Framework implementations to different projects, making SOAP Support, Mini Profiler and Markdown Razor opt-in and to be able to utilize the latest NuGet package dependencies **ServiceStack.RabbitMQ** requires **.NET v4.5.1** and **ServiceStack.Azure** requires **.NET v4.5.2**.

All .NET Standard builds have been upgraded to **.NET Standard 2.0** where now both `.Core` and `.Signed` NuGet package variants have been unified into ServiceStack's main NuGet packages - unifying them into a single suite of NuGet packages and release cadence. All **.NET 4.5 builds are Strong Named** by default using the `servicestack.snk` signing key that's in the [/src](https://github.com/ServiceStack/ServiceStack/tree/master/src) folder of each Project. The .NET Standard builds continue to remain unsigned so they can be built on each platform with .NET Core's `dotnet build` command.

## New .NET Core 2.0 and .NET Framework Project Templates!

ServiceStack's maintains exceptional source compatibility between .NET Core and .NET Framework projects which is visible in our new .NET Core 2.0 and .NET Framework project templates where all templates utilize the same recommended [Physical Project Structure](/physical-project-structure), reference the same NuGet packages, share the same source code for its Server and Client App implementations as well as Client and Server Unit and Integration Tests.

The primary difference between the .NET Core and .NET Framework project templates is how ServiceStack's `AppHost` is initialized, in ASP.NET it's done in `Global.asax` whilst for .NET Core it's registered in .NET Core's pipeline as standard. The `.csproj` are also different with .NET Core using MSBuild's new and minimal human-friendly format and the ASP.NET Framework templates continuing to use VS.NET's classic project format for compatibility with older VS .NET versions.

v5 includes **11 new .NET Core 2.0 project templates** for each of ServiceStack's most popular starting templates. Each .NET Core 2.0 template has an equivalent .NET Framework template except for [ServiceStack's Sharp Apps](https://sharpscript.net/docs/sharp-apps) which is itself a pre-built .NET Core 2.0 App that lets you develop Web Applications and HTTP APIs on-the-fly without any compilation.

All .NET Core 2.0 Templates can be developed using your preferred choice of either VS Code, VS.NET or JetBrains Project Rider on your preferred Desktop OS. Given the diverse ecosystem used to develop .NET Core Applications, the new Project Templates are being maintained on GitHub and made available via our new [dotnet-new](/templates/dotnet-new) command-line utility, installable from npm with:
 
    $ npm install -g @servicestack/cli
 
This makes the `dotnet-new` command globally available which can be run without arguments to view all templates available:

![](/img/pages/ssvs/dotnet-new-list.png)

That can be used to create new projects with:
 
    $ dotnet-new <template-name> <project-name>
 
Example of creating a new Vue SPA project called **Acme**:
 
    $ dotnet-new vue-spa Acme
 
The resulting `Acme.sln` can be opened in VS 2017 which will automatically restore and install both the .NET and npm packages upon first load and build. This can take a while to install all client and server dependencies, once finished the `wwwroot` folder will be populated with your generated Webpack App contained within a `/dist` folder alongside a generated `index.html` page. After these are generated you can run your App with **F5** to run your project as normal:

![](/img/pages/ssvs/dotnet-new-spa-files.png)

If using JetBrains Rider the npm packages can be installed by opening `package.json` and clicking on the **"npm install"** tooltip on the **bottom right**. In VS Code you'll need to run `npm install` manually from the command-line.

### ServiceStackVS VS.NET Templates Updated

The VS.NET Templates inside [ServiceStackVS](https://github.com/ServiceStack/ServiceStackVS) have also been updated to use the latest .NET Framework templates which you can continue to use to [create new projects within VS.NET](/create-your-first-webservice). For all other IDEs and non-Windows Operating Systems you can use the cross-platform `dotnet-new` tooling to create new .NET Core 2.0 Projects. 

### .NET Core 2.0 TypeScript Webpack Templates

There's a project template for each of the most popular Single Page Application JavaScript frameworks, including a new [Angular 5.1](https://angular.io) template built and managed using Angular's new [angular-spa](https://cli.angular.io) tooling. All other SPA Templates (inc. Angular 4) utilize a modernized Webpack build system, pre-configured with npm scripts to perform all necessary debug, production and live watched builds and testing. The included [gulpfile.js](https://github.com/NetCoreTemplates/vue-spa/blob/master/MyApp/gulpfile.js) provides a Gulp script around each npm script so they can be run without the command-line, by running them using VS.NET's built-in Task Runner Explorer GUI. 

All SPA templates are configured to use Typed DTOs from [TypeScript Add Reference](/typescript-add-servicestack-reference) with the generic [@servicestack/client](https://github.com/ServiceStack/servicestack-client) `JsonServiceClient` with concrete Type Definitions except for the Angular 5 template which uses Angular's built-in Rx-enabled HTTP Client with ServiceStack's ambient TypeScript declarations, as it's often preferable to utilize Angular's built-in dependencies when available. 

All Single Page App Templates are available for both .NET Core 2.0 and ASP.NET Framework projects which can be live-previewed and used to create new projects using the template names below:

#### Angular 5 CLI Bootstrap Template

 - .NET Core: [angular-spa](https://github.com/NetCoreTemplates/angular-spa)
 - .NET Framework: [angular-spa-netfx](https://github.com/NetFrameworkTemplates/angular-spa-netfx)
 - Live Preview: [angular-spa.web-templates.io](http://angular-spa.web-templates.io)

#### Angular 4 Material Design Lite Template

 - .NET Core: [angular-lite-spa](https://github.com/NetCoreTemplates/angular-lite-spa)
 - .NET Framework: [angular-lite-spa-netfx](https://github.com/NetFrameworkTemplates/angular-lite-spa-netfx)
 - Live Preview: [angular-lite-spa.web-templates.io](http://angular-lite-spa.web-templates.io)

#### React 16 Webpack Bootstrap Template

 - .NET Core: [react-spa](https://github.com/NetCoreTemplates/react-spa)
 - .NET Framework: [react-spa-netfx](https://github.com/NetFrameworkTemplates/react-spa-netfx)
 - Live Preview: [react-spa.web-templates.io](http://react-spa.web-templates.io)
 
#### Vue 2.5 Webpack Bootstrap Template

 - .NET Core: [vue-spa](https://github.com/NetCoreTemplates/vue-spa)
 - .NET Framework: [vue-spa-netfx](https://github.com/NetFrameworkTemplates/vue-spa-netfx)
 - Live Preview: [vue-spa.web-templates.io](http://vue-spa.web-templates.io)
 
#### Aurelia Webpack Bootstrap Template

 - .NET Core: [aurelia-spa](https://github.com/NetCoreTemplates/aurelia-spa)
 - .NET Framework: [aurelia-spa](https://github.com/NetFrameworkTemplates/aurelia-spa)
 - Live Preview: [aurelia-spa.web-templates.io](http://aurelia-spa.web-templates.io)
 
### Optimal Dev Workflow with Hot Reloading

The Webpack templates have been updated to utilize [Webpack's DllPlugin](https://robertknight.github.io/posts/webpack-dll-plugins/) which splits your App's TypeScript source code from its vendor dependencies for faster incremental build times. With the improved iteration times our recommendation for development is to run a normal Webpack watched build using the `dev` npm (or Gulp) script:
 
    $ npm run dev

Which will watch and re-compile your App for any changes. These new templates also include a new hot-reload feature which works similar to [#Script Pages hot-reloading](https://sharpscript.net/docs/sharp-apps/docs/hot-reloading) where in **DebugMode** it will long poll the server to watch for any modified files in `/wwwroot` and automatically refresh the page. This provides a hot-reload alternative to `npm run dev-server` to run a Webpack Dev Server proxy on port `http://localhost:3000` 

### Deployments

When your App is ready to deploy, run the `publish` npm (or Gulp) script to package your App for deployment:

    npm run publish
 
Which generates a production Webpack client build and `dotnet publish` release Server build to package your App ready for an XCOPY, rsync or MSDeploy deployment. We used [rsync and supervisord to deploy](https://sharpscript.net/docs/sharp-apps/docs/deploying-sharp-apps) each packaged Web template to our Ubuntu Server at the following URL:

    http://<template-name>.web-templates.io

### /wwwroot WebRoot Path for .NET Framework Templates

To simplify migration efforts of ServiceStack projects between .NET Core and .NET Framework, all SPA and Website Templates are configured to use .NET Core's convention of `/wwwroot` for its public WebRoot Path. The 2 adjustments needed to support this was configuring ServiceStack to use the `/wwwroot` path in AppHost:

```csharp
SetConfig(new HostConfig {
    WebHostPhysicalPath = MapProjectPath("~/wwwroot"),
});
```

Then instructing MSBuild to include all `wwwroot\**\*` files when publishing the project using MS WebDeploy which is contained in the [Properties/PublishProfiles/PublishToIIS.pubxml](https://github.com/NetFrameworkTemplates/vue-spa-netfx/blob/master/MyApp/Properties/PublishProfiles/PublishToIIS.pubxml) of each project.

### Website Templates

There are 3 templates for each of the different technologies that can be used with ServiceStack to develop Server HTML Generated Websites and HTTP APIs: 

#### ASP.NET MVC

 - .NET Core: [mvc](https://github.com/NetCoreTemplates/mvc)
 - .NET Framework: [mvc-netfx](https://github.com/NetFrameworkTemplates/mvc-netfx)
 - ASP.NET Core on .NET Framework: [mvc-corefx](https://github.com/NetFrameworkCoreTemplates/mvc-corefx)
 - Live Preview: [mvc.web-templates.io](http://mvc.web-templates.io)
 
#### ServiceStack.Razor 

 - .NET Core: [razor](https://github.com/NetCoreTemplates/razor)
 - .NET Framework: [](https://github.com/NetFrameworkTemplates/razor-netfx)
 - ASP.NET Core on .NET Framework: [razor-corefx](https://github.com/NetFrameworkCoreTemplates/razor-corefx)
 - Live Preview: [razor.web-templates.io](http://razor.web-templates.io)
 
#### #Script Pages

 - .NET Core: [script](https://github.com/NetCoreTemplates/script)
 - .NET Framework: [script-netfx](https://github.com/NetFrameworkTemplates/script-netfx)
 - ASP.NET Core on .NET Framework: [script-corefx](https://github.com/NetFrameworkCoreTemplates/script-corefx)
 - Live Preview: [script.web-templates.io](http://script.web-templates.io)

#### Hot Reloading

Both `razor` and `templates` project enjoy Hot Reloading where in development a long poll is used to detect and reload changes in the current Template Page or static files in `/wwwroot`.

### Empty Web and SelfHost Templates

Those who prefer starting from an Empty slate can use the `web` template to create the minimal configuration for a Web Application whilst the `selfhost` template can be used to develop Self-Hosting Console Apps. Both templates still follow our recommended physical project layout but are configured with the minimum number of dependencies, e.g. the `selfhost` Console App just has a dependency on [Microsoft.AspNetCore.Server.Kestrel and ServiceStack](https://github.com/NetCoreTemplates/selfhost/blob/f11b25e80752d1fee96ac904a8df07fb150ee746/MyApp/MyApp.csproj#L11-L12), in contrast most templates have a dependency on the all-encompasing `Microsoft.AspNetCore.All` meta package.

#### Empty Web Template

 - .NET Core: [web](https://github.com/NetCoreTemplates/web)
 - .NET Framework: [web-netfx](https://github.com/NetFrameworkTemplates/web-netfx)
 - Live Preview: [web.web-templates.io](http://web.web-templates.io)
 
#### Empty SelfHost Console App Template

 - .NET Core: [selfhost](https://github.com/NetCoreTemplates/selfhost)
 - .NET Framework: [selfhost-netfx](https://github.com/NetFrameworkTemplates/selfhost-netfx)
 - Live Preview: [selfhost.web-templates.io](http://selfhost.web-templates.io)

### .NET Core 2.0 ServiceStack WebApp Template

The only .NET Core 2.0 project template not to have a .NET Framework equivalent is [bare-app](https://github.com/sharp-apps/bare-app) as it's a pre-built .NET Core 2.0 App that dramatically simplifies .NET Wep App development by enabling Websites and APIs to be developed instantly without compilation.

 - .NET Core: [bare-app](https://github.com/sharp-apps/bare-app)
 - Live Preview: [rockwind-app.web-templates.io](http://rockwind-app.web-templates.io)
 
See [sharpscript.net/docs/sharp-apps](https://sharpscript.net/docs/sharp-apps) to learn the different use-cases made possible with Web Apps.

### .NET Framework Templates

Likewise there are 2 .NET Framework Templates without .NET Core 2.0 equivalents as they contain Windows-only .NET Framework dependencies. This includes our React Desktop Template which supports packaging your Web App into 4 different ASP.NET, Winforms, OSX Cocoa and cross-platform Console App Hosts:

#### React Desktop Apps Template

 - .NET Framework: [react-desktop-apps-netfx](https://github.com/NetFrameworkTemplates/react-desktop-apps-netfx)
 - Live Preview: [react-desktop-apps-netfx.web-templates.io](http://react-desktop-apps-netfx.web-templates.io)
 
### Windows Service Template

You can use [winservice-netfx](https://github.com/NetFrameworkTemplates/winservice-netfx) to create a Windows Service but as this requires Visual Studio it's faster to continue creating new Windows Service projects within VS.NET using the **ServiceStack Windows Service Empty** Project Template.

## All Apps and Live Demos Upgraded

All existing .NET Core 1.x projects have been upgraded to .NET Core 2.0 and ServiceStack v5, including all [.NET Core Live Demos](https://github.com/NetCoreApps/LiveDemos), all [.NET Core 2.0 Sharp Apps](https://gist.github.com/gistlyn/f555677c98fb235dccadcf6d87b9d098#live-demos) and all [.NET Framework Live Demos](https://github.com/ServiceStackApps/LiveDemos).

### ServiceStack WebApps

The [.NET Core 2.0 Web Apps](https://gist.github.com/gistlyn/f555677c98fb235dccadcf6d87b9d098#live-demos) now use the default `WebHost.CreateDefaultBuilder()` builder to bootstrap WebApp's letting you use `ASPNETCORE_URLS` to specify which URL and port to bind on, simplifying deployment configurations.

The `ASPNETCORE_ENVIRONMENT` Environment variable can also be used to configure WebApp's to run in `Production` mode. If preferred you can continue using the existing `bind`, `port` and `debug` options in your `app.settings` to override the default configuration. 

### Multi-stage Docker Builds

The [.NET Core Apps deployed using Docker](/deploy-netcore-docker-aws-ecs)now use the ASP.NET Team's [recommended multi-stage Docker Builds](https://docs.microsoft.com/en-us/dotnet/core/docker/building-net-docker-images#your-first-aspnet-core-docker-app) where the App is built inside an `aspnetcore-build` Docker container with its published output copied inside a new `aspnetcore` runtime Docker container:

```docker
FROM microsoft/dotnet:2.1-sdk AS build-env
COPY src /app
WORKDIR /app

RUN dotnet restore --configfile NuGet.Config
RUN dotnet publish -c Release -o out

# Build runtime image
FROM microsoft/dotnet:2.1-aspnetcore-runtime
WORKDIR /app
COPY --from=build-env /app/Chat/out .
ENV ASPNETCORE_URLS http://*:5000
ENTRYPOINT ["dotnet", "Chat.dll"]
```

The smaller footprint required by the `aspnetcore` runtime reduced the footprint of [.NET Core Chat](https://github.com/NetCoreApps/Chat) from **567MB** to **126MB** whilst continuing to run flawlessly in AWS ECS at [chat.netcore.io](http://chat.netcore.io).

### .NET Core IAppSettings Adapter

Most .NET Core Templates are also configured to use the new `NetCoreAppSettings` adapter to utilize .NET Core's new `IConfiguration` config model in ServiceStack by initializing the `AppHost` with .NET Core's pre-configured `IConfiguration` that's injected into the [Startup.cs](https://github.com/NetCoreTemplates/vue-spa/blob/master/MyApp/Startup.cs) constructor, e.g:

```csharp
public class Startup
{
    public IConfiguration Configuration { get; }
    public Startup(IConfiguration configuration) => Configuration = configuration;

    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
        app.UseServiceStack(new AppHost {
            AppSettings = new NetCoreAppSettings(Configuration)
        });
    }
}
```

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

### PBKDF2 Password Hashing implementation

ServiceStack now uses the same [PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) password hashing algorithm ASP.NET Identity v3 uses to hash passwords by default for both new users and successful authentication logins where their password will automatically be re-hashed with the new implementation.

This also means if you wanted to switch, you'll be able to import ASP.NET Identity v3 User Accounts and their Password Hashes into ServiceStack.Auth's `UserAuth` tables and vice-versa.

#### Retain previous Password Hashing implementation

If preferred you can revert to using the existing `SaltedHash` implementation with:

```csharp
SetConfig(new HostConfig { 
    UseSaltedHash = true
});
```

This also supports "downgrading" passwords that were hashed with the new `IPasswordHasher` provider where it will revert to using the older/weaker `SaltedHash` implementation on successful authentication.

#### Override Password Hashing Strength

The new [PasswordHasher](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Auth/PasswordHasher.cs) implementation can also be made to be computationally stronger or weaker by adjusting the iteration count (default 10000), e.g:

```csharp
container.Register<IPasswordHasher>(new PasswordHasher(1000));
```

#### Digest Auth Hashes only created when needed

Digest Auth Hashes are now only populated if the `DigestAuthProvider` is registered. If you ever intend to support Digest access authentication in future but don't want to register the DigestAuthProvider just yet, you can force ServiceStack to continue to maintain Digest Auth Hashes with:

```csharp
new AuthFeature {
    CreateDigestAuthHashes = true
}
```

Users that don't have Digest Auth Hashes will require logging in again in order to have it populated. If you don't intend to use Digest Auth you can clear the hashes in the `DigestHa1Hash` column in your `UserAuth` table which is otherwise unused.

### JWT AuthProvider

Previously in order to be able to utilize RefreshToken's you would need to be also be using an [Auth Repository](/auth/authentication-and-authorization#user-auth-repository) as it's the data source used to populate the JWT Token. 

Now Users who are not using an `IAuthRepository` can instead implement the `IUserSessionSource` interface:

```csharp
public interface IUserSessionSource
{
    IAuthSession GetUserSession(string userAuthId);
}
```

On either their Custom AuthProvider, or if preferred register it as a dependency in the IOC as an alternative source for populating Sessions in new JWT Tokens created using RefreshToken's. The implementation should only return a populated `IAuthSession` if the User is allowed to sign-in, i,e. if their account is locked or suspended it should throw an Exception, e.g:

```csharp
throw HttpError.Forbidden("User is suspended");
```

#### Send JWTs in HTTP Params

The JWT Auth Provider can **opt-in** to accept JWT's via the Query String or HTML POST FormData with:

```csharp
new JwtAuthProvider {
    AllowInQueryString = true,
    AllowInFormData = true
}
```

This is useful for situations where it's not possible to attach the JWT in the HTTP Request Headers or `ss-tok` Cookie. 

#### Runtime JWT Configuration

To allow for dynamic per request configuration as needed in Multi Tenant applications we've added a new [IRuntimeAppSettings](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Configuration/IAppSettings.cs) API which can be registered in your `AppHost` to return custom per request configuration. 

E.g. this can be used to return a custom `AuthKey` that should be used to sign JWT Tokens for that request:

```csharp
container.Register<IRuntimeAppSettings>(c => new RuntimeAppSettings { 
    Settings = {
        { nameof(JwtAuthProvider.AuthKey), req => (byte[]) GetAuthKey(GetTenantId(req)) }
    }
});
```

The following `JwtAuthProvider` properties can be overridden by `IRuntimeAppSettings`:

 - `byte[]` AuthKey
 - `RSAParameters` PrivateKey
 - `RSAParameters` PublicKey
 - `List<byte[]>` FallbackAuthKeys
 - `List<RSAParameters>` FallbackPublicKeys

### Registration

The JWT `BearerToken` and `RefreshToken` properties added to `RegisterResponse` are now populated on Registrations configured to `AutoLogin=true`.

Previously users could update their info after they've registered using the same built-in `/register` Service used at registration. This feature is now disabled by default as it's not an expected capability for a Registration Service, if needed it can be re-enabled with:

```csharp
ServiceStack.Auth.RegisterService.AllowUpdates = true;
```

### Routes with Custom Rules

The new `Matches` property on `[Route]` and `[FallbackRoute]` attributes lets you specify an additional custom Rule that requests need to match. This feature is used in all SPA projects to specify that the `[FallbackRoute]` should only return the SPA `index.html` for unmatched requests which explicitly requests HTML, i.e:

```csharp
[FallbackRoute("/{PathInfo*}", Matches="AcceptsHtml")]
public class FallbackForClientRoutes
{
    public string PathInfo { get; set; }
}
```

This works by matching the `AcceptsHtml` built-in `RequestRules` below where the Route will only match the Request if it includes the explicit `text/html` MimeType in the HTTP Request `Accept` Header. The `AcceptsHtml` rule prevents the home page from being returned for missing resource requests like **favicon** which returns a `404` instead.

The implementation of all built-in Request Rules:

```csharp
SetConfig(new HostConfig {
  RequestRules = {
    {"AcceptsHtml", req => req.Accept?.IndexOf(MimeTypes.Html, StringComparison.Ordinal) >= 0 },
    {"AcceptsJson", req => req.Accept?.IndexOf(MimeTypes.Json, StringComparison.Ordinal) >= 0 },
    {"AcceptsXml", req => req.Accept?.IndexOf(MimeTypes.Xml, StringComparison.Ordinal) >= 0 },
    {"AcceptsJsv", req => req.Accept?.IndexOf(MimeTypes.Jsv, StringComparison.Ordinal) >= 0 },
    {"AcceptsCsv", req => req.Accept?.IndexOf(MimeTypes.Csv, StringComparison.Ordinal) >= 0 },
    {"IsAuthenticated", req => req.IsAuthenticated() },
    {"IsMobile", req => Instance.IsMobileRegex.IsMatch(req.UserAgent) },
    {"{int}/**", req => int.TryParse(req.PathInfo.Substring(1).LeftPart('/'), out _) },
    {"path/{int}/**", req => {
        var afterFirst = req.PathInfo.Substring(1).RightPart('/');
        return !string.IsNullOrEmpty(afterFirst) && int.TryParse(afterFirst.LeftPart('/'), out _);
    }},
    {"**/{int}", req => int.TryParse(req.PathInfo.LastRightPart('/'), out _) },
    {"**/{int}/path", req => {
        var beforeLast = req.PathInfo.LastLeftPart('/');
        return beforeLast != null && int.TryParse(beforeLast.LastRightPart('/'), out _);
    }},
 }
})
```

Routes that contain a `Matches` rule have a higher precedence then Routes without. We can use this to define multiple idential matching routes to call different Service depending on whether the Path Segment is an integer or not, e.g:

```csharp
// matches /users/1
[Route("/users/{Id}", Matches = "**/{int}")]
public class GetUser
{
    public int Id { get; set; }
}

// matches /users/username
[Route("/users/{Slug}")]
public class GetUserBySlug
{
    public string Slug { get; set; }
}
```

Other examples utilizing `{int}` Request Rules:

```csharp
// matches /1/profile
[Route("/{UserId}/profile", Matches = @"{int}/**")]
public class GetProfile { ... }

// matches /username/profile
[Route("/{Slug}/profile")]
public class GetProfileBySlug { ... }

// matches /users/1/profile/avatar
[Route("/users/{UserId}/profile/avatar", Matches = @"path/{int}/**")]
public class GetProfileAvatar { ... }

// matches /users/username/profile/avatar
[Route("/users/{Slug}/profile/avatar")]
public class GetProfileAvatarBySlug { ... }
```

Another popular use-case is to call different services depending on whether a Request is from an Authenticated User or not:

```csharp
[Route("/feed", Matches = "IsAuthenticated")]
public class ViewCustomizedUserFeed { ... }

[Route("/feed")]
public class ViewPublicFeed { ... }
```

This can also be used to call different Services depending if the Request is from a Mobile browser or not:

```csharp
[Route("/search", Matches = "IsMobile")]
public class MobileSearch { ... }

[Route("/search")]
public class DesktopSearch { ... }
```

Instead of matching on a pre-configured RequestRule you can instead specify a Regular Expression using the format:

    {Property} =~ {RegEx}

Where `{Property}` is an `IHttpRequest` property, e.g:

```csharp
[Route("/users/{Id}", Matches = @"PathInfo =~ \/[0-9]+$")]
public class GetUser { ... }
```

An exact match takes the format:

    {Property} = {Value}

Which you could use to provide a tailored feed for specific clients:

```csharp
[Route("/feed", Matches = @"UserAgent = specific-client")]
public class CustomFeedView { ... }
```

### #Script Pages

[#Script Pages](https://sharpscript.net/docs/script-pages) gains support for the last missing feature from ServiceStack.Razor with its new **View Pages** support which lets you use `.html` Template Pages to render the HTML for Services Responses. 

It works similarly to Razor ViewPages where it uses first matching View Page with the Response DTO is injected as the `Model` property. The View Pages can be in any folder within the `/Views` folder using the format `{PageName}.html` where `PageName` can be either the **Request DTO** or **Response DTO** Name, but all page names within the `/Views` folder need to be unique.

Just like ServiceStack.Razor you can also specify to use different Views or Layouts by returning a custom `HttpResult`, e.g:

```csharp
public object Any(MyRequest request)
{
    ...
    return new HttpResult(response)
    {
        View = "CustomPage",
        Template = "_custom-layout",
    };
}
```

Or add the `[ClientCanSwapTemplates]` Request Filter attribute to allow clients to specify which View and Template to use via the query string, e.g: `?View=CustomPage&Template=_custom-layout`.

Additional examples of dynamically specifying the View and Template are available in [TemplateViewPagesTests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/TemplateTests/TemplateViewPagesTests.cs).

#### Cascading Layouts

One difference from Razor is that it uses a cascading `_layout.html` instead of `/Views/Shared/_Layout.cshtml`. 

So if your view page was in:

    /Views/dir/MyRequest.html

It will use the closest `_layout.html` it can find starting from:

    /Views/dir/_layout.html
    /Views/_layout.html
    /_layout.html

### Logging with Context

[Rolf Kristensen](https://github.com/snakefoot) added support for contextual logging with the new `ILogWithContext` interface and `PushProperty` extension method which lets you attach additional data to log messages, e.g:

```csharp
using (log.PushProperty("Hello", "World"))
{
    log.InfoFormat("Message");
}
```

Support for the additional context was added to `Log4net`, `NLog` and `Serilog` logging providers.

The new [ILogWithException](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Logging/ILogWithException.cs) interface and extension methods provides additional overloads for logging Exceptions with separate message format and args.

### Validation

Our internal implementation of [FluentValidation](https://github.com/JeremySkinner/FluentValidation) has been upgraded to the latest 7.2 version which will let you take advantage of new features like implementing [Custom Validators](https://github.com/JeremySkinner/FluentValidation/wiki/e.-Custom-Validators#using-a-custom-validator), e.g:

```csharp
public class CustomValidationValidator : AbstractValidator<CustomValidation>
{
    public CustomValidationValidator()
    {
        RuleFor(request => request.Code).NotEmpty();
        RuleFor(request => request)
            .Custom((request, context) => {
                if (request.Code?.StartsWith("X-") != true)
                {
                    var propName = context.ParentContext.PropertyChain.BuildPropertyName("Code");
                    context.AddFailure(new ValidationFailure(propName, error:"Incorrect prefix") {
                        ErrorCode = "NotFound"
                    });
                }
            });
    }
}
```

#### Validators in ServiceAssemblies auto-wired by default

The `ValidationFeature` plugin now scans and auto-wires all validators in the `AppHost.ServiceAssemblies` that's injected in the AppHost constructor so you'll no longer need to manually register validators maintained in your `ServiceInterface.dll` project:

```csharp
//container.RegisterValidators(typeof(UserValidator).Assembly);
```

This default behavior can be **disabled** with:

```csharp
Plugins.Add(new ValidationFeature {
    ScanAppHostAssemblies = false
});
```

### Expanded Async Support

To pre-emptively support .NET Core when they [disable Sync Response writes by default](https://github.com/aspnet/Announcements/issues/252) in a future version, we've rewritten our internal implementations to write to Responses asynchronously. 

New Async filters are now available to match existing sync filters. It's very unlikely the classic ASP.NET Framework will ever disable sync writes, but if you're on .NET Core you may want to consider switching to use the newer async API equivalents on [IAppHost](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/IAppHost.cs) below: 

    GlobalRequestFiltersAsync
    GlobalResponseFiltersAsync
    GatewayRequestFiltersAsync
    GatewayResponseFiltersAsync
    GlobalMessageRequestFiltersAsync
    GlobalMessageResponseFiltersAsync

#### Async Attribute Filters

Async Filter Attributes are available by inheriting the new `RequestFilterAsyncAttribute` or `ResponseFilterAsyncAttribute` base classes if you need to call async APIs within Filter Attributes.

All async equivalents follow the same [Order of Operations](/order-of-operations) and are executed immediately after any registered sync filters with the same priority.

#### Async Request and Response Converters

As they're not commonly used, the `RequestConverters` and `ResponseConverters` were just converted to utilize an Async API. 

#### Async ContentTypes Formats

There's also new async registration APIs for Content-Type Formats which perform Async I/O, most serialization formats don't except for HTML View Engines which can perform Async I/O when rendering views, so they were changed to use the new `RegisterAsync` APIs:

```csharp
appHost.ContentTypes.RegisterAsync(MimeTypes.Html, SerializeToStreamAsync, null);
appHost.ContentTypes.RegisterAsync(MimeTypes.JsonReport, SerializeToStreamAsync, null);
appHost.ContentTypes.RegisterAsync(MimeTypes.MarkdownText, SerializeToStreamAsync, null);
```

#### Async HttpWebRequest Service Clients

The Async implementation of the `HttpWebRequest` based Service Clients was rewritten to use the newer .NET 4.5 Async APIs as the older APM APIs were found to have some async request hanging issues in the .NET Standard 2.0 version of Xamarin.iOS.

### Minor Features

 - `ToOptimizedResult()` now supports `HttpResult` responses
 - `Config.DebugMode` is being initialized with `env.IsDevelopment()` in .NET Core
 - `MapProjectPath()` uses `env.ContentRoot` in .NET Core
 - `MetadataDebugTemplate` no longer has dependencies on `jquip` and `ss-utils.js`
 - `IMeta`, `IHasSessionId` and `IHasVersion` interfaces are now exported in Add ServiceStack Reference
 - `Html.IncludeFile()` API for embedding file contents in Razor views
 - `VirtualFiles` and `VirtualFileSources` properties added to base Razor View

## @servicestack npm packages

ServiceStack's npm packages are now being maintained in npm organization scoped `@servicestack` packages, if you were using the previous packages you should uninstall them and use the new scoped packages instead:

    $ npm uninstall servicestack-client
    $ npm install @servicestack/client

    $ npm uninstall -g servicestack-cli
    $ npm install -g @servicestack/cli

You'll also need to update your source code references to use the new packages:

```ts
import { JsonServiceClient } from "@servicestack/client";
```

## ServiceStack.OrmLite

### Support for MySqlConnector ADO.NET Provider

[@Naragato](https://github.com/Naragato) from the ServiceStack Community contributed a [MySqlConnector](https://github.com/mysql-net/MySqlConnector) for OrmLite providing a true async ADO.NET Provider option for MySql, from their website:

> This is a clean-room reimplementation of the MySQL Protocol and is not based on the official connector.
It's fully async, supporting the async ADO.NET methods added in .NET 4.5 without blocking (or using Task.Run to run synchronous methods on a background thread). It's also 100% compatible with .NET Core.

To use it, install:

    PM> Install-Package ServiceStack.Ormlite.MySqlConnector

Then initialize your DB Factory with:

```csharp
var dbFactory = new OrmLiteConnectionFactory(connectionString, MySqlConnectorDialect.Provider);

using (var db = dbFactory.Open()) 
{
    ...
}
```

### Parametrized IN Values

You can now provide a collection of values and OrmLite will automatically modify the SQL statement and split the values into multiple DB parameters to simplify executing parameterized SQL with multiple IN Values, e.g:

```csharp
var ids = new[]{ 1, 2, 3};
var results = db.Select<Table>("Id in (@ids)", new { ids });

var names = new List<string>{ "foo", "bar", "qux" };
var results = db.SqlList<Table>("SELECT * FROM Table WHERE Name IN (@names)", new { names });
```

### RowVersion Byte Array

To improve reuse of OrmLite's Data Models in Dapper, [@daleholborow](https://github.com/daleholborow) 
added support for allowing `byte[] RowVersion` as an alternative to OrmLite's `ulong RowVersion` which lets you use OrmLite Data Models with `byte[] RowVersion` properties in Dapper queries.

### OnOpenConnection Filter

The `OnOpenConnection` filter lets you run custom commands after opening a new DB Connection. This feature can be used to easily enable [Write-Ahead Logging in SQLite](https://www.sqlite.org/wal.html):

```csharp
var dbFactory = new OrmLiteConnectionFactory("sqlite.db", SqliteDialect.Provider);
SqliteDialect.Provider.OnOpenConnection = db => db.ExecuteSql("PRAGMA journal_mode=WAL;");

using (var db = dbFactory.Open()) 
{
    ...
}
```

### OpenAsync APIs

The new `OpenDbConnectionAsync()` and `OpenAsync()` alias APIs can be used to Open DB connections asynchronously.

## ServiceStack.Aws

PocoDynamo was updated to utilize [AWS's recommended Exponential Backoff And Jitter algorithm](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/).

This is also available to be used independently with:

```csharp
Thread.Sleep(ExecUtils.CalculateFullJitterBackOffDelay(retriesAttempted));

await Task.Delay(ExecUtils.CalculateFullJitterBackOffDelay(retriesAttempted));
```

# [v4.5.14 Release Notes](/releases/v4_5_14)

In this release we've added a new simple, fast and highly-versatile alternative to Razor for developing Server generated Websites, official support for .NET Core 2.0, new ServiceStack.Azure NuGet package for deeper integration with ServiceStack Apps hosted on Azure and a number of new features and enhancements across ServiceStack.

Please see the full release notes for what's in this Release: /releases/v4_5_14

### .NET Core 2.0 Ready

Firstly we’d like to announce this Release adds support for the newly released .NET Core 2.0. Our test suites have been upgraded to run .NET Core 2.0 as well as some of our existing .NET Core Apps. All new Web Apps created in this release were developed on .NET Core 2.0 which we believe is the first .NET Core release that should be given first consideration for development of new greenfield .NET Web Apps to see if it’s able to meet your requirements. 

## #Script!

We're super excited to announce [#Script](https://sharpscript.net). At its core `#Script` is a simple, fast and versatile general-purpose dynamic templating language for .NET and .NET Core. It requires no pre-compilation, is lazily loaded and Starts up instantly with fast runtime performance, is late-bound with no binary coupling, is highly extensible and is evaluated in a Sandbox with complete fine-grain control over what functionality is available to templates running in different contexts.

These characteristics opens up Templates into a number of exciting new use-cases, some of which we cover in our comprehensive and interactive documentation at [sharpscript.net/](https://sharpscript.net).

### Starter Projects

The Starter Projects below provide a quick way to get started with a pre-configured ServiceStack Template App:

#### [.NET Core 2.0 Bootstrap Starter](https://github.com/NetCoreApps/TemplatesBootstrapStarter)

Clone the [TemplatesBootstrapStarter](https://github.com/NetCoreApps/TemplatesBootstrapStarter) GitHub project to start from a Bootstrap v4 and jQuery .NET Core 2.0 App:

[![](https://raw.githubusercontent.com/NetCoreApps/TemplatePages/master/src/wwwroot/assets/img/screenshots/templates-bootstrap.png)](https://github.com/NetCoreApps/TemplatesBootstrapStarter)

#### ASP.NET v4.5 Bootstrap Starter

For ASP.NET v4.5 projects create a new **ServiceStack ASP.NET Templates with Bootstrap** from the VS.NET Templates in [ServiceStackVS VS.NET Extension](/templates/#servicestackvs-vsnet-extension) to create an ASP.NET v4.5 Project using [ServiceStack's recommended project structure](/create-your-first-webservice#step-4-exploring-the-servicestack-solution):

[![](https://sharpscript.net/assets/img/screenshots/ssvs-bootstrap.png)](https://github.com/ServiceStack/ServiceStackVS)

## Why Templates?

We developed Templates because we want to be able to offer a simple, clean, highly-productive and innovative end-to-end solution for building ServiceStack Web Apps without the external baggage and issues Razor brings to a project. If interested in the finer details, we've published some of the limitations and issues we've hit in [Why not Razor](/why-not-razor). 

### A new .NET templating language was born

So we set out to build the server templating language we wanted, one without the complexity, issues, design problems and static coupling of Razor, with great Startup and runtime performance, is highly-extensible and promotes reuse, integrates cleanly with .NET but still adopts the strengths that make the premier JavaScript frameworks enjoyable and productive to build HTML UIs with. 

We didn't want to invent a new syntax so we evaluated various syntax from multiple JavaScript frameworks and ultimately settled on [Vue.js Filters syntax](https://vuejs.org/v2/guide/filters.html) which has optimal syntax for a templating language, we also share Vue's primary focus on simplicity and its incremental approach to layering advanced functionality, a goal that drove the design and development of `#Script`. The [Syntax](https://sharpscript.net/docs/syntax) is essentially compatible with Vue.js filters including supporting JavaScript's syntax for its native data types and function calls.

Within this minimal syntax we've been able to achieve a highly versatile dynamic template language whose expressive power comes from its [filters](https://sharpscript.net/docs/methods) of which we've included a [comprehensive suite](https://sharpscript.net/docs/filters-reference) to handle many of the tasks commonly required in Templates and Web Apps.

### Meet `#Script`

Even in this initial release we're extremely pleased with its current form. It's not coupled to any external tooling or susceptible to any of the external factors that has plagued us with Razor. It's highly testable by design with unit tests being trivial to write that it's our most tested feature with over 350 new tests added to support its current feature-set, it's also our [most documented feature](https://sharpscript.net). 

It's small, lightweight footprint and built-in Hot Reloading provides a fun, clean and productive alternative to MVC Razor that's easily integrated into any web framework and runs identically in every platform ServiceStack runs on, it can also be returned in ASP.NET MVC and ASP.NET MVC Core Controllers - in all cases, using the same [high-performance implementation](https://sharpscript.net/docs/introduction#instant-startup) to asynchronously write to a forward-only OutputStream for max performance and maximum potential reuse of your code.

Templates are lazily loaded and late-bound for Instant Startup, doesn't require any pre-compilation, have coupling to any external configuration files, build tools, designer tooling or have any special deployment requirements. It can be used as a general purpose templating language to enhance any text format and includes built-in support for `.html`.

Templates are evaluated in an Isolated Sandboxed that enables fine-grained control over exactly what functionality and instances are available to different Templates. They're pre-configured with a comprehensive suite of safe Default Filters which when running in trusted contexts can easily be granted access to enhanced functionality.

Templates are designed to be incrementally adoptable where its initial form is ideal for non-programmers, that can gradually adopt more power and functionality when needed where they can leverage existing Services or MVC Controllers to enable an MVC programming model or have `.html` pages upgraded to use Code Pages where they can utilize the full unlimited power of the C# programming language to enable precise control over the rendering of pages and partials. Code pages take precedence and are interchangeable wherever normal `.html` pages are requested making them a non-invasive layered solution whenever advanced functionality is required.

### Surrounding Ecosystem

These qualities opens Templates up to a number of [new use-cases](https://sharpscript.net/usecases/) that's better suited than Razor for maintaining content-heavy websites, live documents, Email Templates and can easily introspect the state of running .NET Apps where they provide valuable insight at a glance with support for Adhoc querying.

## Web Apps

One use-case made possible by Templates we're extremely excited about is [Web Apps](https://sharpscript.net/docs/sharp-apps) - a new approach to dramatically simplify .NET Web App development and provide the most productive development experience possible whilst maximizing reuse and component sharing. 

Web Apps leverages Templates to develop entire content-rich, data-driven websites without needing to write any C#, compile projects or manually refresh pages - resulting in the easiest and fastest way to develop Web Apps in .NET!

### Ultimate Simplicity

Not having to write any C# code or perform any app builds dramatically reduces the cognitive overhead and conceptual knowledge required for development where the only thing front-end Web developers need to know is [Template's syntax](https://sharpscript.net/docs/syntax) and what [filters are available](https://sharpscript.net/docs/filters-reference) to call. Because of Template's high-fidelity with JavaScript, developing a Website with Templates will be instantly familiar to JavaScript developers despite calling and binding directly to .NET APIs behind the scenes.

All complexity with C#, .NET, namespaces, references, .dlls, strong naming, packages, MVC, Razor, build tools, IDE environments, etc has been eliminated leaving all Web Developers needing to do is run a cross-platform [web/app.dll](https://github.com/ServiceStack/Web) .NET Core 2.0 executable and configure a simple [app.settings](https://github.com/sharp-apps/bare-app/blob/master/app.settings) text file to specify which website folder to use, which ServiceStack features to enable, which db or redis providers to connect to, etc. 

### Rapid Development Workflow

The iterative development experience is also unparalleled for a .NET App, no compilation is required so you can just leave the `web/app.dll` running whilst you add the template `.html` files needed to build your App and thanks to the built-in [Hot Reloading](https://sharpscript.net/docs/hot-reloading) support, pages will refresh automatically as you save. You'll just need to do a full page refresh when modifying external .css/.js files to bypass the browser's cache and you'll need to restart `web/app.dll` to pick up any changes to your `app.settings` or .dlls to your `/plugins` folder.

### Pure Cloud Apps

Web Apps also enable the development of [Pure Cloud Apps](https://sharpscript.net/docs/sharp-apps#pure-cloud-apps) where the same Web App can be developed and run entirely on **AWS S3 and RDS** or **Azure Blob Storage and SQL Server** by just changing the `app.settings` that's deployed with the pre-compiled [Web App Binary](https://github.com/ServiceStack/Web).

## Example Web Apps 

We've developed a number of [Web Apps](https://sharpscript.net/docs/sharp-apps) to illustrate the various features available and to showcase its strengths and the different kind of Web Apps that can easily be developed with it. The source code for each app is maintained in [NetCoreWebApps](https://github.com/sharp-apps) and each Web App runs the same [pre-compiled web/app.dll binary](https://github.com/ServiceStack/Web).

## Metadata Debug Inspector

[![](https://sharpscript.net/assets/img/screenshots/metadata-debug.png)](https://sharpscript.net/metadata/debug)

All ServiceStack Apps now have access to rich introspection and queryability for inspecting remote ServiceStack instances with the new [Metadata Debug Inspector](https://sharpscript.net/docs/servicestack-scripts#debug-template).

The Debug Template is a Service in `SharpPagesFeature` that's pre-registered in [DebugMode](/debugging#debugmode). The Service can also be available when not in **DebugMode** by enabling it with:

```csharp
Plugins.Add(new SharpPagesFeature { 
    MetadataDebugAdminRole = RoleNames.Admin,        // Only allow Admin users
})
```

This registers the Service but limits it to Users with the `Admin` role, alternatively you configure an 
[Admin Secret](/debugging#authsecret):

```csharp
SetConfig(new HostConfig { AdminAuthSecret = "secret" })
```

Which will let you access it by appending the authsecret to the querystring: `/metadata/debug?authsecret=secret`

Alternatively if preferred you can make the Debug Template Service available to all users with:

```csharp
Plugins.Add(new SharpPagesFeature { 
    MetadataDebugAdminRole = RoleNames.AllowAnyUser,  // Allow Authenticated Users
    MetadataDebugAdminRole = RoleNames.AllowAnon,     // Allow anyone
})
```

Which is the configuration that allows [sharpscript.net/metadata/debug](https://sharpscript.net/metadata/debug) to be accessible to anyone.

## JavaScript Utils

The development of Templates also brought with it the development of a number of high-performance utilities that are useful for use on their own. The ServiceStack.Text JSON Serializer was only designed for serializing Typed POCOs, you can still use it to [deserialize dynamic JSON](https://github.com/ServiceStack/ServiceStack.Text#supports-dynamic-json) but you would need to specify the Type to deserialize into on the call-site otherwise the value would be returned as a string.

Templates implementation of JavaScript preserves the Type which can be used to parse JavaScript or JSON literals:

```csharp
JSON.parse("1")      //= int 1 
JSON.parse("1.1")    //= double 1.1
JSON.parse("'a'")    //= string "a"
JSON.parse("{a:1}")  //= new Dictionary<string, object> { {"a", 1 } }
```

It can be used to parse dynamic JSON and any primitive JavaScript data type. The inverse API of `JSON.stringify()` is also available.

### Eval

Eval is useful if you want to execute custom JavaScript functions, or if you want to have a text DSL or scripting language for executing custom logic or business rules you want to be able to change without having to compile or redeploy your App. It uses [Templates Sandbox](https://sharpscript.net/docs/sandbox) which lets you evaluate the script within a custom scope that defines what functions and arguments it has access to, e.g:

```csharp
public class CustomFilter : TemplateFilter
{
    public string reverse(string text) => new string(text.Reverse().ToArray());
}

var scope = JS.CreateScope(
         args: new Dictionary<string, object> { { "arg", "value"} }, 
    functions: new CustomFilter());

JS.eval("arg", scope)                                        //= "value"
JS.eval("reverse(arg)", scope)                               //= "eulav"
JS.eval("itemsOf(3, padRight(reverse(arg), 8, '_'))", scope) //= ["eulav___", "eulav___", "eulav___"]

//= { a: ["eulav___", "eulav___", "eulav___"] }
JS.eval("{a: itemsOf(3, padRight(reverse(arg), 8, '_')) }", scope)
```

## Simple Container

In order for Templates to be free of external dependencies and be decoupled from any one Web Framework but still retain AutoWired functionality it uses a new [SimpleContainer](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Common/SimpleContainer.cs) which implements [IContainer](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/IContainer.cs) - the smallest interface we could define for a minimal but useful IOC:

```csharp
public interface IContainer
{
    Func<object> CreateFactory(Type type);

    IContainer AddSingleton(Type type, Func<object> factory);
    
    IContainer AddTransient(Type type, Func<object> factory);

    object Resolve(Type type);

    bool Exists(Type type);
}
```

It's late-bound API supports registering dependencies in the 2 most useful Scopes: Singleton and Transient. Leveraging the utility of extension methods, every IOC implementing `IContainer` also gains the same [Typed Generic API](https://github.com/ServiceStack/ServiceStack/blob/710da129005f3df5dc93ea0e51e6d8a8681ec04e/src/ServiceStack.Common/SimpleContainer.cs#L114), e.g: 

```csharp
container.AddTransient<IFoo,Foo>();
container.AddTransient<IFoo>(() => new Foo());
container.AddTransient<IBar>(() => new Bar());
container.AddTransient(() => new FooImpl());
container.AddTransient<FooImpl>();

container.AddSingleton(typeof(Foo));
container.AddSingleton(() => foo);

var foo = container.Resolve<IFoo>();
var bar = container.Resolve(typeof(IBar));

var hasFoo = container.Exists<IFoo>();
```

Both `Funq.Container` and `SimpleContainer` implement the `IContainer` interface which 
[ServiceStack's SharpPagesFeature](https://sharpscript.net/docs/script-pages) utilizes to replace the TemplateContext's built-in IOC to use Funq where it shares the same IOC instance and is able to resolve ServiceStack's AppHost dependencies.

### Fast, small, dependency-free IOC

We're happy to report `SimpleContainer` is even smaller and faster than Funq and only requires a dependency to `ServiceStack.Common.dll`. It supports AutoWiring, constructor and public property injection but not Funq's other less used features like Child Containers, named dependencies and Request Scoped dependencies.

## Simple AppSettings

[SimpleAppSettings](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Common/SimpleAppSettings.cs) is an [IAppSettings provider](/appsettings) that you can use to maintain substitutable App Configuration without a dependency to `ServiceStack.dll` which can be populated with a string Dictionary:

```csharp
AppSettings = new SimpleAppSettings(new Dictionary<string, string> {
    ["string"] = "value",
    ["EnableFeature.1"] = "true",
    ["AllowedUsers"] = "Tom,Mick,Harry",
}));

string value = AppSettings.GetString("string");
bool enableFeature1 = AppSettings.Get("EnableFeature.1", defaultValue:false);
bool enableFeature2 = AppSettings.Get("EnableFeature.2", defaultValue:false);
IList<string> allowedUsers = AppSettings.GetList("AllowedUsers");
```

## Virtual File System

The major change added in order for Templates to be isolated from the ServiceStack Web Framework was to decouple the [Virtual File System providers](/virtual-file-system) from ServiceStack's AppHost and move them to `ServiceStack.Common`. 

This separation makes it easier to use VFS providers outside of ServiceStack AppHost which is a useful abstraction for copying files from different file sources as done in the [copy-files](https://github.com/ServiceStack/dotnet-app/tree/master/src/support/copy-files) project to upload files to AWS S3 or Azure Blob Storage.

### AddVirtualFileSources

Registering an additional VFS provider in AppHost's previously required overriding `GetVirtualFileSources()`, they can now also be registered
by adding them to `AddVirtualFileSources`, e.g:

```csharp
AddVirtualFileSources.Add(vfsProvider);
```

### VFS Breaking Change

ServiceStack App's typically don't create instances of VFS providers directly but all VFS provider constructors needed to be changed to remove its `IAppHost` dependency. We used the same breaking change window to also give the user-facing VFS providers better names, changing from `*VirtualPathProvider` to `*VirtualFiles`, e.g:

 - `FileSystemVirtualFiles`
 - `MemoryVirtualFiles`
 - `ResourceVirtualFiles`
 - `S3VirtualFiles`
 - `AzureBlobVirtualFiles`
 - `MultiVirtualFiles`

The VFS providers and extension methods in `ServiceStack.Common` use the same `ServiceStack.IO` namespace that the [VFS Interfaces are defined in](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Interfaces/IO) where typically this would be the only change required, including `using ServiceStack.IO;` if you're using any VFS extension methods.

## ServiceStack.Azure

We've added deeper integration with Azure with [ServiceStack.Azure](https://github.com/ServiceStack/ServiceStack.Azure) - a new project containing Azure backed managed implementations for popular ServiceStack providers (as we've done with [ServiceStack.Aws](https://github.com/ServiceStack/ServiceStack.Aws)):

 - `ServiceBusMqServer` - [MQ Server](/messaging) for invoking ServiceStack Services via Azure ServiceBus
 - `AzureBlobVirtualFiles` - [Virtual File System](/virtual-file-system) provider using Azure Blob Storage
 - `AzureTableCacheClient` - [Cache Client](/caching) provider using Azure Table Storage

We intend to add support for additional providers in future and make it even easier for ServiceStack Apps to be able to move freely between hosting on an Azure or an AWS managed infrastructure.

### ServiceBus MQ Server

Configuring to use ServiceBus is the same as other MQ Servers, by first registering the ServiceBus `IMessageService` provider followed by registering all ServiceStack Services you want to be able to invoke via MQ's:

```csharp
container.Register<IMessageService>(c => new ServiceBusMqServer(ConnectionString));

var mqServer = container.Resolve<IMessageService>();
mqServer.RegisterHandler<MyRequest>(ExecuteMessage);

AfterInitCallbacks.Add(appHost => mqServer.Start());
```

### Azure Blob Storage VFS

The `AzureBlobVirtualFiles` VFS provider can be used to serve website content directly from an Azure Blob Storage container:

```csharp
public class AppHost : AppHostBase
{
    public override void Configure(Container container)
    {
        //Specify to use Azure Blob Container for uploading / writing files
        VirtualFiles = new AzureBlobVirtualFiles(connectionString, containerName);

        //Register an additional File Source for static files
        AddVirtualFileSources.Add(VirtualFiles);
    }
}
```

### Azure Table Storage Cache Client

The `AzureTableCacheClient` [Caching provider](/caching) lets you use an Azure Table for your App's distributed caching:

```csharp
container.Register<ICacheClient>(c => new AzureTableCacheClient(CacheConnectionString));
```

## ServiceStack

A number of internal improvements were made for making ServiceStack run better than ever on .NET Core:

### Internal improvements

In preparation for .NET Core's plans [to disallow sync read / writes to Request and Responses](https://github.com/aspnet/Announcements/issues/252) a number of internal handlers were refactored to use async APIs when writing to the Response Stream including static files and all raw `byte[]`, `Stream` responses, including HTTP Partial Content responses. Custom Results can implement the new `IStreamWriterAsync` and `IPartialWriterAsync` interfaces to return results that asynchronously writes to the Response Stream. 

ASP.NET, HttpListener and .NET Core hosts were refactored to use as much of the same code-paths as possible to ensure better consistency and code maintenance.

The HTTP Request Pipeline was refactored to only use VFS APIs when determining static file requests resulting in more consistent behavior for all VFS sources.

Requests to directories are automatically redirected to enforce a trailing slash, it can be disabled with `Config.RedirectDirectoriesToTrailingSlashes=false`.

## Strict Mode

We're adding a new Strict Mode to ServiceStack which you can use to make ServiceStack behave stricter and throw Exceptions when it sees certain failure conditions. To enable Strict Mode across all libraries use:

```csharp
Env.StrictMode = true;
```

Otherwise to just enable StrictMode for ServiceStack:

```csharp
SetConfig(new HostConfig {
    StrictMode = true
})
```

When enabled ServiceStack will perform runtime checks to catch invalid state, currently:

 - Checks if Services return Value Types
 - Checks if UserSession has circular dependencies
 - Fails fast for exceptions on Startup

In future we'll use it to change the default mode of deserializing as much as possible without error, to fail fast when it detects an error condition. Initially it will be used in Text Serializers and OrmLite to detect mapping errors.

### Content-Type Specific Service Implementations

Service implementations can now use `Verb{Format}` method names to provide a different implementation for handling a specific Content-Type. The Service below defines several different implementation for handling the same Request:

```csharp
[Route("/my-request")]
public class MyRequest 
{
    public string Name { get; set; }
}

public class ContentTypeServices : Service
{
    public object Any(MyRequest request) => ...;    // Handles all other unspecified Verbs/Formats to /my-request

    public object GetJson(MyRequest request) => ..; // Handles GET /my-request for JSON responses

    public object AnyHtml(MyRequest request) =>     // Handles POST/PUT/DELETE/etc /my-request for HTML Responses
$@"<html>
<body>
<h1>AnyHtml {request.Name}</h1>
</body>
</html>";

    public object GetHtml(MyRequest request) =>     // Handles GET /my-request for HTML Responses
$@"<html>
<body>
<h1>GetHtml {request.Name}</h1>
</body>
</html>";
}
```

### Redirect Paths

The `RedirectPaths` dictionary can be used to maintain a redirect mapping of redirect paths, e.g. we use this to redirect
all requests to `/metadata/` to redirect to `/metadata`:

```csharp
SetConfig(new HostConfig { 
    RedirectPaths = {
        { "/metadata/", "/metadata" },
    }
})
```

### Forbidden Paths

The `ForbiddenPaths` can be used to prevent access to different folders in your Web Root, e.g:

```csharp
SetConfig(new HostConfig { 
    ForbiddenPaths = {
        "/private-folder",
    }
})
```

### ServiceAssemblies

The list of Service Implementation Assemblies specified in your AppHost constructor is available from `IAppHost.ServiceAssemblies` which plugins can use to enable auto-wired features, e.g. you can use `ScanAppHostAssemblies` in `ValidationFeature` to automatically register any validators defined in the Service Implementation Assemblies:

```csharp
Plugins.Add(new ValidationFeature {
    ScanAppHostAssemblies = true
})
```

## ServiceStack Minor Features

 - New `Config.Metadata.GetAllDtos()` metadata API to return all DTO Types
 - Encrypted Messaging Requests are now marked as Secure in `IRequest.RequestAttributes`
 - `VaryByHeaders` option added to `[CacheResponse]` attribute
 - New `[ExcludeMetadata]` attribute as alias for `[Exclude(Feature.Metadata | Feature.Soap)]`
 
## Service Clients 

New `*Body` and `*BodyAsync` APIs have been added to all Service Clients which lets you post a separate Request Body for Request DTOs 
that implement `IRequiresRequestStream` where they contain both properties and a custom Request Body, e.g:

```csharp
[Route("/json")]
public class SendJson : IRequiresRequestStream, IReturn<string>
{
    public string Name { get; set; }
    public Stream RequestStream { get; set; }
}

[Route("/text")]
public class SendText : IRequiresRequestStream, IReturn<string>
{
    public string Name { get; set; }
    public string ContentType { get; set; }
    public Stream RequestStream { get; set; }
}

public class SendRawService : Service
{
    [JsonOnly]
    public object Any(SendJson request) => request.RequestStream.ReadFully();

    public object Any(SendText request)
    {
        base.Request.ResponseContentType = request.ContentType ?? base.Request.AcceptTypes[0];
        return request.RequestStream.ReadFully();
    }
}
```

The new APIs accept both a Request DTO which specifies which Service to call and what properties to add to the QueryString and another object to send in the raw HTTP Request Body, e.g:

```csharp
var client = new JsonServiceClient(BaseUrl);

var json = client.PostBody(new SendJson { Name = "JSON body" }, new PocoRequest { Foo = "Bar" });
json.FromJson<PocoRequest>().Foo //= Bar

json = await client.PutBodyAsync(new SendJson { Name = "JSON body" }, "{\"Foo\":\"Bar\"}");
json.FromJson<PocoRequest>().Foo //= Bar

var client = new JsonHttpClient(BaseUrl);
var request = new SendText { Name = "Text body", ContentType = "text/plain" };

var text = await client.PostBodyAsync(request, "foo");
text //= foo
```

## AutoQuery

Previously all AutoQuery Requests would execute an additional Aggregate query to return the total records available for that query. As this can be unnecessary overhead for requests that don't need it, we've made it opt-in where requests that need the total can add it on the QueryString, e.g:

    /query?Include=Total

Or on the Request DTO:

```csharp
var response = client.Get(new MyQuery { Include = "Total" });
```

You can restore the previous behavior and have the Total returned in every request with:

```csharp
Plugins.Add(new AutoQueryFeature {
    IncludeTotal = true
})
```

## Native Types

User defined interfaces on Request DTOs are now being exported in the generated DTOs. It can be disabled with:

```csharp
this.GetPlugin<NativeTypesFeature>().MetadataTypesConfig.ExcludeImplementedInterfaces = true;
```

 - Support was also added for Arrays of Nullable Types.

### Open API Refinements

You can register [Open API Tags](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#tagObject) by adding them to the `Tags` collection:

```csharp
Plugins.Add(new OpenApiFeature
{
    Tags =
    {
        new OpenApiTag
        {
            Name = "TheTag",
            Description = "TheTag Description",
            ExternalDocs = new OpenApiExternalDocumentation
            {
                Description = "Link to External Docs Desc",
                Url = "http://example.org/docs/path",
            }
        }
    }
});
```

 - `[ApiMember(IsRequired = true)]` is now included in `OpenApiSchema`
 - `[ApiResponse(IsDefaultResponse = true)]` can be used to specify the default Service response
 - The `LogoHref` and `LogoUrl` properties can be used to customize the `/swagger-ui` logo
 - A `RequestType` was added in `OpenApiOperation` to make it easy for filters to map Open API classes back to Services
 - Added support for `IReturnVoid` NoContent responses

## Request Logging

 - Add logging for short-circuited requests terminated in Request Filters
 - Allow logging of non-Service Requests, opt-in with `LimitToServiceRequests=false`
 - Add `SkipLogging` delegate to control which requests should be logged

## ServiceStack.RabbitMq

You can send MQ Request bodies using a different registered Content-Type which ServiceStack will use to deserialize into the Request DTO.

## LiteDB Auth Provider

[Stefan de Vogelaere](https://github.com/stefandevo) from the ServiceStack Community released the [ServiceStack.Authentication.LiteDB](https://github.com/CaveBirdLabs/ServiceStack.Authentication.LiteDB) AuthProvider for [LiteDB](https://github.com/mbdavid/LiteDB) - A .NET NoSQL Document Store in a single data file.

## ServiceStack.Text

Several enhancements were added in ServiceStack.Text to improve support for Object Dictionaries and KeyValuePair's which are extensively used in Templates, including support in CSV, QueryStrings and AutoMapping/Conversion Utils.

### String Segment Extensions

We've further enhanced it with several StringSegment extension methods to make it easier to work with, e.g. `TryReadLine` is nice for efficiently reading lines from a large string without generating any string references on the heap:

```csharp
var pos = 0;
var buf = new StringSegment(fileContents);
while (buf.TryReadLine(out StringSegment line, ref pos)) {
    // line
}
```

### Resolve Paths

The `ResolvePaths()` extension method evaluates string paths containing directory commands, e.g:

```csharp
"/a/b/../".ResolvePaths()    //= /a/
"a/../b".ResolvePaths()      //= b
"a/../b/./c".ResolvePaths()  //= b/c
```
## OrmLite

### SQL Server JSON

[@KevinHoward](https://github.com/KevinHoward) added preliminary support for SQL Server JSON queries, e.g:

```csharp
var results = db.Select<Table>(q => Sql.JsonValue(q.JsonColumn, "$.State") == "NV" && q.Id == 1);
```

See [JsonExpressionsTest.cs](https://github.com/ServiceStack/ServiceStack.OrmLite/blob/master/src/ServiceStack.OrmLite.SqlServerTests/Expressions/JsonExpressionsTest.cs) for more examples.

> Requires `SqlServer2016Dialect.Provider`

### Normalizing PostgreSQL

By default PostgreSQL's dialect provider uses quoted **snake_case** for all Table and Column names.
It can be configured to generate similar SQL as other RDBMS's with:

```csharp
PostgreSqlDialectProvider.Instance.Normalize = true; 
```

Where it will use the default Naming strategy and only quote tables and columns using reserved words.
OrmLite's mapping is case-insensitive so will still be able to map columns as a result of PostgreSQL's lowercase names for unquoted symbols.

### Ignore properties

The new `[IgnoreOnInsert]` and `[IgnoreOnUpdate]` attributes can be used to ignore properties from INSERT's and UPDATE's.

 - Added `[Computed]` attribute as a better named alias for `[Compute]`
 - Added support for using string params larger than default string length
 - The new `SqlConcat`, `SqlCurrency`, `SqlBool` and `SqlLimit` APIs can help creating cross-platform SQL, see [SqlDialectTests.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.OrmLite/tests/ServiceStack.OrmLite.Tests/SqlDialectTests.cs) for examples.


# [v4.5.10 Release Notes](/releases/v4_5_10)

We've developed new Angular4, React, Aurelia and Vue.js Single Page App VS.NET templates for ASP.NET which have been re-imagined to incorporate the latest gold standard in modern Single Page App development and integrated to provide the ideal development experience within VS.NET, optimal bundling and packaging for production including one-click Web App deployments using MS Web Deploy. 

## Full support for VS.NET 2017

We've added complete support for VS.NET 2017 with the [ServiceStackVS](https://github.com/ServiceStack/ServiceStackVS) VS.NET Extension and have migrated all ServiceStack code-bases for all of [ServiceStack's NuGet packages](https://www.nuget.org/profiles/servicestack) to VS2017's new MSBuild format which is now being used to generate the different .NET 4.5 and .NET Standard platform builds used in all .NET Core packages including our multi-target Test projects.

[![](/img/pages/ssvs/spa-templates-overview.png)](https://github.com/ServiceStack/ServiceStackVS#install-servicestackvs)

## Webpack-powered Single Page App Templates
 
We've developed a new Single Page App template for the simple and elegant [Vue.js](https://vuejs.org) and our existing Angular, Aurelia, React and React Desktop Single Page App templates have been rewritten to completely embrace [Webpack](https://webpack.js.org) - the most advanced module bundler for JavaScript Apps. Webpack is used to power the development, testing and production builds of your Web App.

The release notes contains a detailed overview of Webpack and how to use it from within VS.NET and command-line which support both of Webpack's popular developer options of watching for changes and regenerating its outputs as well as Live Reload support using the [Webpack Dev Server](https://webpack.js.org/configuration/dev-server/#devserver) which automatically reloads the current page after processing any changes. 

### Single Page App Template features

The templates provide a highly productive base that's ideal for developing small to medium-sized JavaScript Web Apps including just the core essentials that pack the most productive punch whilst adding minimal complexity and required configuration, whilst still remaining open-ended to easily plug-in other tools into your Webpack configuration you believe will improve your development workflow. 
 
With these goals in mind we've hand-picked and integrated a number of simple best-of-breed technologies so you'll be immediately productive:

 - Integrated Bootstrap v4 UI framework and font-awesome Vector Icons
   - Angular4 uses the more natural Material Design Lite UI framework and Design Icons 
 - High-level TypeScript and Sass support andstandard .js or .css when preferred
 - End-to-end Typed APIs pre-configured with TypeScript JsonServiceClient and Server DTOs
 - All templates have Routing Enabled in a Multi-page Layout
 - Deep linkable Pretty URLs
 - JavaScript Unit Testing
 - Live Unit Testing which automatically re-runs tests when sources have changed
 - Built-in Test Coverage
 - Single Click Deployments using MS WebDeploy
 - All projects retain our [Recommended Multi-Project Solution Layout](/physical-project-structure)

### Gistlyn Updated

[Gistlyn](http://gistlyn.com) was upgraded to use the new Webpack-powered React Desktop Apps template.

## Simple command-line utilities for ServiceStack

The new [servicestack-cli](https://github.com/ServiceStack/servicestack-cli) npm package replaces our existing `ss-util.exe` and OSX `swiftref` command-line programs to provide simple command-line utilities to easily Add and Update ServiceStack References for all of ServiceStack's 7 supported languages. Using it is as easy as choosing the language you want and the **BaseUrl** of the remote ServiceStack instance you want to download the Server DTOs for, e.g:

    $ csharp-ref https://techstacks.io

### Major Memory and Performance Improvements to ServiceStack.Text

We've replaced our internal string parsing in ServiceStack.Text's serializers to use .NET Core's new `StringSegment` class (polyfilled in .NET 4.5) which dramatically reduces the memory allocations needed and execution time for deserialization. Parsing implementations of primitive .NET Types like integers, decimal and Guid types were also replaced with custom implementations utilizing `StringSegment` which sees their performance improved by **2.5-4x**. These improvements are best seen in large complex types with nested arrays like MiniProfiler's DTO where memory allocations were reduced by **5.3x** and performance improved by **33%**.

### Vulnerability with object Properties

We've resolved a vulnerability using public `object` properties on DTOs where we've needed to adopt a whitelist to limit the Types that are allowed to create instances of. Please see the release notes for full details.

### Fast Reflection APIs

We've consolidated functionality for populating the fields and properties of a runtime `Type` behind a formal API which includes multiple cascading implementations so it's able to use the fastest implementation available in [each supported platform](https://github.com/ServiceStackApps/HelloMobile#portable-class-library-support), i.e. for most .NET platforms we use the Reflection.Emit implementations when possible, when not available it falls back to using Compiled Expression trees, then finally falling back to using a Reflection-based implementation. 

This functionality is available using the `CreateGetter()` and `CreateSetter()` extension methods on both `PropertyInfo` or `FieldInfo` which you may find useful if you'd like to get better performance when populating runtime types dynamically, e.g:

```csharp
var runtimeType = typeof(MyType);
 
object instance = runtimeType.CreateInstance();
PropertyInfo pi = runtimeType.GetProperty("Id");
var idSetter = pi.CreateSetter();
var idGetter = pi.CreateGetter();
 
idSetter(instance, 1);
var idValue = idGetter(instance);
```

### Support for C# 7 Value Tuples in OrmLite

The fast, new C# 7 Value Tuple support in OrmLite enables an alternative terse, clean and typed API for accessing the [Dynamic Result Sets](/ormlite/dynamic-result-sets) returned when using a custom Select expression, e.g:

```csharp
var query = db.From<Employee>()
    .Join<Department>()
    .OrderBy(e => e.Id)
    .Select<Employee, Department>(
        (e, d) => new { e.Id, e.LastName, d.Name });
 
var results = db.Select<(int id, string lastName, string deptName)>(query);
 
var row = results[i];
$"row: ${row.id}, ${row.lastName}, ${row.deptName}".Print();
```

### Expanded Typed SqlExpresion Surface Area

OrmLite's Typed SqlExpression has been expanded to support up to **15 tables** in a single SQL Condition and up to **4 tables** in a JOIN expression.

## Proxy Feature

The new `ProxyFeature` plugin is an application-level proxy that can be used to transparently proxy HTTP Requests through to
downstream servers whose behavior can be customized with custom C# hooks to control how requests are proxied.
 
`ProxyFeature` registers an async/non-blocking `RawHttpHandler` which bypasses ServiceStack's Request Pipeline that in ASP.NET is executed as an ASP.NET `IHttpAsyncHandler` so it should be flexible and performant enough to handle many demanding workloads.

## Autowired Typed Request Filters

[Josh Engler](https://github.com/englerj) contributed support for Autowired Request and Response Filters which lets you handle Request DTOs in a Typed Filter similar to how Autowired Services handles Typed Request DTOs with access to IOC injected dependencies.

## Refinements to Open API, Server Events, JWT

Driven by customer requests we've added support to Open API, Server Events, JWT

## HTTP Caching static Files

Returning a static [Virtual File](/virtual-file-system) or `FileInfo` in a `HttpResult` now sets the **Last-Modified** HTTP Response Header whose behavior instructs the pre-configured [HttpCacheFeature](/http-caching) to generate the necessary HTTP Headers so HTTP Clients are able to validate subsequent requests using the [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since) HTTP Request Header, allowing them to skip redownloading files they've already cached locally.

### Re-Authentication

We've changed the default behavior to no longer skipping Authenticating existing Authenticated Users. This resolves an issue for not being able to retrieve JWT Refresh Tokens if you're already Authenticated, previous behavior can be restored with:

```csharp
Plugins.Add(new AuthFeature(...) {
    SkipAuthenticationIfAlreadyAuthenticated = true
});
```

### API Key Auth Provider
 
You can opt-in to allow API Keys to be passed on the **QueryString** (e.g. `?apikey={APIKEY}`) or HTTP POST **Form Data** with:
 
```csharp
Plugins.Add(new ApiKeyAuthProvider {
    AllowInHttpParams = true
});
```

### DebugMode
 
The home page and directories are no longer cached in [DebugMode](/debugging#debugmode) to better be able to reflect changes during development.
 
## WebServiceException
 
The `WebServiceException` Message returns the the more appropriate `ResponseStatus.ErrorMessage` if available. The previous StatusDescription text can be retrieved from the `WebServiceException.StatusDescription` property.

### Other Changes
 
 - The `RemoveHeader()` API has been added to `IResponse` and all implementations
 - The HTTP Request/Response Preview in Metadata pages uses the Verb, URL and Request Body of the preferred HTTP Method for each Service
 - The Basic Auth Credentials are auto-sent in `JsonHttpClient` 401 Challenged Responses
 - Empty Collections are now ignored AutoQuery Filters

That's a high-level overview, please see the # [v4.5.10 Release Notes](/releases/v4_5_10) for the full details.

Enjoy!

# [v4.5.8 Release Notes](/releases/v4_5_8)

We've got a another feature-packed release with a number of exciting new features  new support for the [Open API specification](https://github.com/OAI/OpenAPI-Specification) 
enabling new integration possibilities with 
[Azure API Management](https://azure.microsoft.com/en-us/services/api-management/)
and [Azure AutoRest](https://github.com/Azure/autorest), our real-time [Server Events](/server-events) 
solution extending to new Mobile, Desktop and Server platforms, more flexible Authentication options to 
dramatically simplify integration with Mobile, Desktop and Web clients, effortless JWT Refresh Tokens, 
enhanced support for TypeScript and Java client libraries, new compression options, upgrades to the latest 
Fluent Validation with support for Async validators, Async Request Filters, a number of new quality 
OSS ServiceStack projects developed by the community and lots more use-case driven features and 
refinements across the entire ServiceStack suite!

Please see the [v4.5.8 Release Notes](/releases/v4_5_8) for the full details, for a quick summary we'll highlight the major features below:

## [Open API](/openapi)

We've added support for the Open API Specification which opens up several new integration possibilities
including importing your Services into Azure API Management and generating native clients with 
Azure's AutoRest. The Open API plugin also embeds Swagger UI letting you quickly explore and interact with your services.

## [Server Events](/server-events)

We've made great strides in this release towards our goal of expanding the Server Event ecosystem in popular 
Mobile, Desktop and Server platforms with new first-class implementations for Android, Java and TypeScript which now includes:

 - [C# Server Events Client](/csharp-server-events-client)
    - Xamarin.iOS
    - Xamarin.Android
    - UWP
    - .NET Framework 4.5+
    - .NET Core (.NET Standard 1.3+)
- [TypeScript Server Events Client](/typescript-server-events-client)
    - Web
    - Node.js Server
    - React Native
        - iOS
        - Android
- [Java Server Events Client](/java-server-events-client)
    - Android
    - JVM 1.7+ (Java, Kotlin, Scala, etc)
        - Java Clients
        - Java Servers
- [JavaScript (jQuery plugin)](/javascript-server-events-client)
    - Web

## [Android Java Chat](https://github.com/ServiceStackApps/AndroidJavaChat)

To showcase real-world usage of `AndroidServerEventsClient` in an Android App we've ported 
[C# Xamarin Android Chat](https://github.com/ServiceStackApps/AndroidXamarinChat) into **Java 8** using 
Google's recommended [Android Studio Development Environment](https://developer.android.com/studio/index.html). 
In addition to retaining the same functionality as the original 
[C# Xamarin.Android Chat App](https://github.com/ServiceStackApps/AndroidXamarinChat), it also leverages the native 
Facebook, Twitter and Google SDK's to enable seamless and persistent authentication when signing in with Facebook, 
Twitter or Google User accounts.

[![](/img/pages/java/java-android-chat-screenshot-auth.png)](https://github.com/ServiceStackApps/AndroidJavaChat/)

## [Web, Node.js and React Native ServerEvents Apps](https://github.com/ServiceStackApps/typescript-server-events)

The TypeScript [@servicestack/client](https://github.com/ServiceStack/servicestack-client) npm package is a 
cross-platform library enabling a rich, productive end-to-end Typed development experience on Web, node.js Server 
projects, node.js test suites, React Native iOS and Android Mobile Apps - written in either TypeScript or 
plain JavaScript.

To help getting started using [@servicestack/client](https://github.com/ServiceStack/servicestack-client) in each of 
JavaScript's most popular platforms we've developed a simple Server Events Web, Node.js and React Native Mobile iOS App
that can connect to any Server Events Server and listen to messages published on the subscribed channel. The App also 
maintains a live synchronized list of Users in the channel that's automatically updated whenever Users join or leave 
the channel:

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/typescript-serverevents/typescript-server-events-banner.png)](https://github.com/ServiceStackApps/typescript-server-events)

Each App uses the optimal starting configuration that enables a productive workflow on each platform and uses the minimum
runtime dependencies - essentially just [@servicestack/client](https://github.com/ServiceStack/servicestack-client) 
and its es6-shim and W3C `EventSource` polyfills on Node.js and React Native where it's missing a native implementation.

## TypeScript @servicestack/client improvements

New APIs have been added to TypeScript's [@servicestack/client](https://github.com/ServiceStack/servicestack-client) 
to catch up with the additional flexibility and features available in [C#/.NET Service Clients](/csharp-client):

### Sending additional arguments with Typed API Requests

Many AutoQuery Services utilize [implicit conventions](/autoquery/rdbms#implicit-conventions) to query fields that 
aren't explicitly defined on AutoQuery Request DTOs, these can now be queried by specifying additional arguments with 
the typed Request DTO, e.g:

```ts
const request = new FindTechStacks();

client.get(request, { VendorName: "ServiceStack" })
    .then(r => { }) // typed to QueryResponse<TechnologyStack> 
```

### Calling APIs with Custom URLs

In addition to Typed API Requests you can now also call Services using relative or absolute urls, e.g:

```ts
client.get<GetTechnologyResponse>("/technology/ServiceStack")

client.get<GetTechnologyResponse>("https://techstacks.io/technology/ServiceStack")

// GET https://techstacks.io/technology?Slug=ServiceStack
client.get<GetTechnologyResponse>("/technology", { Slug: "ServiceStack" }) 
```

## Relaxed TypeScript Definitions

The metadata requirements in TypeScript Ambient Interface definitions generated by Add ServiceStack Reference's `/types/typescript.d` have been relaxed so they can be used to Type Object Literals:

```ts
let request:QueryContracts = { accountId: 1234 };
```

But as metadata in 
Request DTO interface definitions are no longer inferrable, their return Type and route will need to be supplied 
on each call-site, e.g:

```ts
let request:FindTechnologies = { vendorName: "ServiceStack" };

client.get<QueryResponse<Technology>>("/technology/search", request)
    .then(r => { }); //typed response
```

## Authentication via OAuth AccessTokens 

To improve OAuth Sign In integration from native Mobile or Desktop Apps we've added support for direct 
Authentication via AccessTokens which can dramatically simplify the Development and User Experience by 
being able to leverage the Native Facebook, Twitter and Google Client SDK's to Sign In users locally
then reuse their local **AccessToken** to Authenticate with back-end ServiceStack Servers. 
This feature is what's used to enable [Integrated Facebook, Twitter and Google Logins](https://github.com/ServiceStackApps/AndroidJavaChat/#integrated-facebook-twitter-and-google-logins)
in Android Java Chat and be able to [Automatically Sign In users with saved AccessTokens](https://github.com/ServiceStackApps/AndroidJavaChat#automatically-sign-in-previously-signed-in-users).

This capability is now available on the popular OAuth Providers below:

- `FacebookAuthProvider` - Sign in with Facebook
- `TwitterAuthProvider` - Sign in with Twitter
- `GithubAuthProvider` - Sign in with Github
- `GoogleOAuth2Provider` - Sign in with Google

### Client Authentication with AccessToken

Clients can utilize this feature with the new `AccessToken` and `AccessTokenSecret` properties on the existing
`Authenticate` Request DTO, sent with the **provider** that the AccessToken is for, e.g:

```csharp
var response = client.Post(new Authenticate {
    provider = "facebook",
    AccessToken = facebookAccessToken,
    RememberMe = true,
});
```

## JWT Refresh Tokens

Support for Refresh Tokens is now available in the [JWT Auth Provider](/auth/jwt-authprovider) where new **JWT Tokens**
can now be generated from a longer-lived `RefreshToken` which can be used to fetch new JWT Tokens without
needing to re-authenticate with a separate Auth Provider.

### Accessing Refresh Tokens

Just like JWT Tokens, Refresh Tokens are populated on the `AuthenticateResponse` DTO after successfully 
authenticating via any registered Auth Provider, e.g:

```csharp
var response = client.Post(new Authenticate {
    provider = "credentials",
    UserName = userName,
    Password = password,
});

var jwtToken = response.BearerToken;
var refreshToken = response.RefreshToken;
```

### Lifetimes of tokens

The default expiry time of JWT and Refresh Tokens below can be overridden when registering the `JwtAuthProvider`:

```csharp
new JwtAuthProvider {
    ExpireTokensIn        = TimeSpan.FromDays(14),  // JWT Token Expiry
    ExpireRefreshTokensIn = TimeSpan.FromDays(365), // Refresh Token Expiry
}
```

### Using JWT and Refresh Tokens

In order to provide the simplest development experience possible you only need to specify the Refresh Token on the Service Client and it will take care of transparently fetching a new JWT Token behind-the-scenes. You don't even need to configure the client with a JWT Token as it will just fetch a new one on first use, e.g:

```csharp
var client = new JsonServiceClient(baseUrl) {
    RefreshToken = refreshToken,
};

var response = client.Send(new Secured());
```

## Fluent Validation Upgraded

Another major feature added in this release was contributed by the community with 
[Scott Mackay](https://github.com/wwwlicious) upgrading our internal Fluent Validation implementation 
to the latest version of [FluentValidation](https://github.com/JeremySkinner/FluentValidation). Special care
was taken to maintain backwards compatibility where ServiceStack enhancements were retrofitted on top 
of the new version and existing Error Codes were preserved to ensure minimal disruption with existing
code bases.

### Async Validators

One of the benefits from using the latest version of Fluent Validation is we now have support for Async Validators! 
Async validators can be registered using the `MustAsync` validator where you could simulate the following built-in 
**Not Empty** validation:

```csharp
public class MyRequestValidator : AbstractValidator<MyRequest>
{
    public MyRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
    }
}
```

And replace it with an Async version that uses the [Service Gateway](/service-gateway) to 
call a custom Async `GetStringLength` Service that returns the same `ErrorCode` and Error Message as the 
**Not Empty** validator:

```csharp
public class MyRequestValidator : AbstractValidator<MyRequest>
{
    public MyRequestValidator()
    {
        RuleFor(x => x.Name).MustAsync(async (s, token) => 
            (await Gateway.SendAsync(new GetStringLength { Value = s })).Result > 0)
        .WithMessage("'Name' should not be empty.")
        .WithErrorCode("NotEmpty");
    }
}
```

## Async Global Request Filters

To properly implement Async Validators we also needed Async Request Filters which were also added in this release 
where you can now register non-blocking Request Filters with:

```csharp
GlobalRequestFiltersAsync.Add(async (req,res,dto) => {
    var response = await client.Send(new CheckRateLimit { 
        Service = dto.GetType().Name,
        IpAddress = req.UserHostAddress,
     });
     if (response.RateLimitExceeded) 
     {
         res.StatusCode = 403;
         res.StatusDescription = "RateLimitExceeded";
         res.EndRequest();
     }
})
```

## Enhanced Compression Options

We've followed up [Request Compression](/releases/v4_5_6#clientserver-request-compression) added in the last release
with more compression features in this release including:

### `[CompressResponse]` Attribute

You can now selectively choose which Services should be compressed with the new `[CompressResponse]` attribute to 
compress responses for clients which support compression, which can be applied to most Response Types, e.g:

```csharp
[CompressResponse]
public class CompressedServices : Service
{
    public object Any(CompressDto request) => new CompressExamplesResponse(); 
    public object Any(CompressString request) => "foo"; 
    public object Any(CompressBytes request) => "foo".ToUtf8Bytes(); 
    public object Any(CompressStream request) => new MemoryStream("foo".ToUtf8Bytes()); 
    public object Any(CompressFile request) => new HttpResult(VirtualFileSources.GetFile("/foo"));

    public object Any(CompressAnyHttpResult request)
    {
        return new HttpResult(new CompressExamplesResponse());    // DTO
        return new HttpResult("foo", "text/plain");               // string
        return new HttpResult("foo".ToUtf8Bytes(), "text/plain"); // bytes
        //etc
    }
}
```

> Note using `[CompressResponse]` is unnecessary when returning [cached responses](/http-caching) as ServiceStack 
automatically caches and returns the most optimal Response - typically compressed bytes for clients that 
supports compression

### Static File Compression

ServiceStack can also be configured to compress static files with specific file extensions that are larger than 
specific size with the new opt-in Config options below:

```csharp
SetConfig(new HostConfig {
    CompressFilesWithExtensions = { "js", "css" },
    // (optional), only compress .js or .css files > 10k
    CompressFilesLargerThanBytes = 10 * 1024 
});
```

When more fine-grained logic is needed you can override `ShouldCompressFile()` in your AppHost to choose which
static files you want to compress on a per-file basis, e.g:

```csharp
public override bool ShouldCompressFile(IVirtualFile file)
{
    return base.ShouldCompressFile(file) || file.Name == "large.csv";
}
```

## Community

We've been lucky to receive a number of quality contributions from the Community in this release 
starting with the new [Serilog](https://serilog.net) Logging provider contributed by [Josh Engler](https://github.com/englerj):

### ServiceStack.Logging.Serilog

To Configure Serilog Logging, first download [ServiceStack.Logging.Serilog](https://www.nuget.org/packages/ServiceStack.Logging.Serilog) from NuGet:

    PM> Install-Package ServiceStack.Logging.Serilog

Then configure ServiceStack to use `SerilogFactory`:

```csharp
LogManager.LogFactory =  new SerilogFactory();
```

## Community Projects

There's also been a number of quality OSS Community projects that's surfaced recently that you may find useful to
enable in your ServiceStack projects:

### [ServiceStack.Webhooks](https://github.com/jezzsantos/ServiceStack.Webhooks)

If you need to implement a Webhooks solution for your Services you'll definitely want to check out 
[ServiceStack.Webhooks](https://github.com/jezzsantos/ServiceStack.Webhooks) by [@jezzsantos](https://github.com/jezzsantos). ServiceStack.Webhooks is a high-quality, actively developed, 
[well documented](https://github.com/jezzsantos/ServiceStack.Webhooks/wiki) solution for raising and managing 
application-level "events" raised by your services:

![](https://raw.githubusercontent.com/jezzsantos/ServiceStack.Webhooks/master/docs/img/pages/Webhooks.Architecture.PNG)

### [ServiceStack.Authentication.Azure](https://github.com/ticky74/ServiceStack.Authentication.Azure)

[ServiceStack.Authentication.Azure](https://github.com/ticky74/ServiceStack.Authentication.Azure) is a fork of
[ServiceStack.Authentication.Aad](https://github.com/jfoshee/ServiceStack.Authentication.Aad) developed by 
[Ian Kulmatycki](https://github.com/ticky74) which provides an `AzureAuthenticationProvider` for easily 
authenticating users with Office365 and hybrid Azure Active Directories.

### [ServiceStack.Authentication.Marten](https://github.com/migajek/ServiceStack.Authentication.Marten)

[ServiceStack.Authentication.Marten](https://github.com/migajek/ServiceStack.Authentication.Marten) is a 
`UserAuthRepository` repository developed by [Michał Gajek](https://github.com/migajek) for persisting users in 
[Marten](http://jasperfx.github.io/marten/getting_started/) - a Document Database for PostgreSQL.

### MultiAppSettingsBuilder

Another feature contributed by [Josh Engler](https://github.com/englerj) is the `MultiAppSettingsBuilder` which adds
a fluent discoverable API for configuring ServiceStack's various [App Setting Providers](/appsettings), e.g:

```csharp
AppSettings = new MultiAppSettingsBuilder()
    .AddAppSettings()
    .AddDictionarySettings(new Dictionary<string,string> { "override" : "setting" })
    .AddEnvironmentalVariables()
    .AddTextFile("~/path/to/settings.txt".MapProjectPath())
    .Build();
```

### CacheClient with Prefix

The `CacheClientWithPrefix` class contributed by [@joelharkes](https://github.com/joelharkes) lets you decorate 
any `ICacheClient` to prefix all cache keys using the `.WithPrefix()` extension method. This could be used to 
easily enable multi-tenant usage of a single redis instance, e.g:

```csharp
container.Register(c => 
    c.Resolve<IRedisClientsManager>().GetCacheClient().WithPrefix("site1"));
```

### OrmLite Soft Deletes

Select Filters were added to OrmLite to let you specify a custom `SelectFilter` that lets you modify queries 
that use `SqlExpression<T>` before they're executed. This could be used to make working with "Soft Deletes" 
Tables easier where it can be made to apply a custom `x.IsDeleted != true` condition on every `SqlExpression`.

By either using a `SelectFilter` on concrete POCO Table Types, e.g:

```csharp
SqlExpression<Table1>.SelectFilter = q => q.Where(x => x.IsDeleted != true);
SqlExpression<Table2>.SelectFilter = q => q.Where(x => x.IsDeleted != true);
```

Or alternatively you can configure a global `SqlExpressionSelectFilter` with:

```csharp
OrmLiteConfig.SqlExpressionSelectFilter = q =>
{
    if (q.ModelDef.ModelType.HasInterface(typeof(ISoftDelete)))
    {
        q.Where<ISoftDelete>(x => x.IsDeleted != true);
    }
};
```

Both solutions above will transparently add the `x.IsDeleted != true` to all `SqlExpression<T>` based queries
so it only returns results which aren't `IsDeleted` from any of queries below:

```csharp
var results = db.Select(db.From<Table>());
var result = db.Single(db.From<Table>().Where(x => x.Name == "foo"));
var result = db.Single(x => x.Name == "foo");
```

## ServiceStack.Text 

You can easily escape HTML Entities characters (`<`, `>`, `&`, `=`, `'`) when serializing JSON strings with:

```csharp
JsConfig.Init(new Config { EscapeHtmlChars = true });
```

This can also be requested by clients using [Customized JSON Responses](/customize-json-responses), e.g:

    /my-api?jsconfig=EscapeHtmlChars

## Rabbit MQ

A strong-named version of ServiceStack.RabbitMq is now available at:

    PM> Install-Package ServiceStack.RabbitMq.Signed

The new `CreateQueueFilter` and `CreateTopicFilter` filters added to the [Rabbit MQ Server](/rabbit-mq) will let 
you customize what options Rabbit MQ Queue's and topics are created with.

## Startup Errors

To better highlight the presence of Startup Errors we're now adding a red warning banner in `/metadata` 
pages when in [DebugMode](/debugging#debugmode), e.g:

![](../img/pages/release-notes/startup-errors.png)

The number of Startup Errors is also added to the `X-Startup-Errors: n` Global HTTP Header so you'll be 
able to notice it when debugging HTTP Traffic.

### Forcing a Content Type

Whilst ServiceStack Services are typically available on any endpoint and format, there are times when you only 
want adhoc Services available in a particular format, for instance you may only want the View Models for your
dynamic Web Views available in HTML. This can now be easily enabled with the new `[HtmlOnly]` Request Filter 
Attribute, e.g:
    
```html
[HtmlOnly]
public class HtmlServices : Service
{
    public object Any(MyRequest request) => new MyViewModel { .. };
}
```

This feature is also available for other built-in Content Types: `[JsonOnly]`, `[XmlOnly]`, `[JsvOnly]` and `[CsvOnly]`.

### AuthProvider available on IAuthSession

You can now determine what Auth Provider was used to populate a User's Session with the new 
`IAuthSession.AuthProvider` property. This could be used for instance to detect and ensure highly-sensitive 
services are only available to users that authenticated using a specific Auth Provider.

## All .NET Core Examples upgraded to .NET Core 1.1

All .NET Core Live examples including the **redis-geo** project used in 
[Deploy .NET Core with Docker to AWS ECS Guide](/deploy-netcore-docker-aws-ecs) 
were upgraded to .NET Core 1.1 and has been changed to use the `microsoft/dotnet:1.1-sdk-projectjson` 
Docker Image since `microsoft/dotnet:latest` was changed to only support projects with VS 2017 `.csproj` 
msbuild format.

This covers a high-level view of the major features added in this release, please see the 
[v4.5.8 Release Notes](/releases/v4_5_8) for the full details and other features added in this release.

# [v4.5.6 Release Notes](/releases/v4_5_6)

For the full details of this release please see the [full v4.5.6 release notes](/releases/v4_5_6).

## New Angular2 Single Page App template!

We've added a new modern SPA VS.NET Template for Angular2 which is built the same npm-based TypeScript / JSPM / Gulp technology stack that's solidified in our other SPA templates with the main difference being that it's based on the *Material Design Lite* theme.

The Angular2 template also takes advantage of Angular2's modular architecture with a physical structure optimal for small-to-medium sized projects where its modular layout is compartmentalized into multiple independent sub modules which can easily scale to support large code bases. 

## Simpler and Optimized Single Page App Templates

We've also simplified all our existing npm-based SPA Templates to take advantage of the latest dependencies which can simplify our existing development workflow, some changes include:

### Upgraded to JSPM 0.17 beta

One of the benefits of using JSPM 0.17 beta is we're now using its built-in static builds with Rollup optimizations for production deployments which statically links your entire App's JavaScript into a single `app.js`, eliminating the need for `system.js` at runtime and removing the packaging overhead from using modules.

### Removed interim deps.tsx

The interim `deps.tsx` file used to minimize the number of requests required during development is no longer needed. We're now able to generate a cache of 3rd party npm dependencies using your App's main .js file and your dependencies listed in npm's `package.json`. 

### Simplified Typings

The typings dependency manager has been removed leaving one less `typings.json` that needs to be maintained. Templates now use TypeScript's new @types definitions directly from npm or when they exist, the definitions contained in each npm package that's referenced in *devDependencies*. 

### Upgraded to latest Bootstrap v4

The React and Aurelia SPA Templates have been upgraded to use the just released Bootstrap v4 alpha-6.

## Enhanced TypeScript Support

The SPA Templates also benefit from our enhanced TypeScript support with improvements to both the generated TypeScript DTOs and the `JsonServiceClient` which now includes TypeScript Definitions published with the npm package.

 - *Support for Basic Auth* - Basic Auth support is now implemented in `JsonServiceClient` and follows the same API made available in the C# Service Clients
 - *Raw Data Responses* - The `JsonServiceClient` also supports Raw Data responses like `string` and `byte[]`

## Swift 3

Swift Add ServiceStack Reference and the Swift `JsonServiceClient` has been upgraded to Swift 3 including
its embedded PromiseKit implementation. The earlier Swift 2 compiler bugs preventing AutoQuery Services from working have now been resolved. 

### [swiftref OSX command-line utility](https://github.com/ServiceStack/swiftref)

In response to XcodeGhost, Apple has killed support for plugins in Xcode 8 disabling all existing 3rd party 
plugins from working, and along with it our Integration with Xcode built into ServiceStack Xcode Plugin. 

To enable the best development experience we can without using an Xcode plugin we've developed the 
swiftref OSX command-line utility to provide a simple command-line UX to easily Add and Update Swift 
ServiceStack References.

Installation and Usage instructions for swiftref are available from: https://github.com/ServiceStack/swiftref

### All Swift Example Apps upgraded to Swift 3

Our existing Swift Example Apps have all been upgraded to use ServiceStack's new Swift 3 Support:

 - [TechStacks iOS App](https://github.com/ServiceStackApps/TechStacksApp) 
 - [TechStacks Desktop Cocoa OSX App](https://github.com/ServiceStackApps/TechStacksDesktopApp)
 - [AutoQuery Viewer iOS App](https://github.com/ServiceStackApps/AutoQueryViewer)
 - [101 Swift LINQ Samples](https://github.com/mythz/swift-linq-examples)

### [Swift Package Manager Apps](https://github.com/ServiceStack/SwiftClient)

In its quest to become a popular mainstream language, Swift now includes a built-in Package Manager 
to simplify the maintenance, distribution and building of Swift code. Swift Package Manager can be used to
build native statically-linked modules or Console Apps but currently has no support for iOS, watchOS, 
or tvOS platforms. 

Nevertheless it's simple console and text-based programming model provides a great way to quickly develop 
prototypes or Console-based Swift Apps like swiftref using your favorite text editor. To support this 
environment we've packaged ServiceStack's Swift Service clients into a *ServiceStackClient* package 
so it can be easily referenced in Swift PM projects.

A step-by-step guide showing how to build Swift PM Apps is available at: https://github.com/ServiceStackApps/swift-techstacks-console

### [Service Fabric Example](https://github.com/ServiceStackApps/HelloServiceFabric)

Another Example project developed during this release is [Hello ServiceFabric](https://github.com/ServiceStackApps/HelloServiceFabric) to show a Hello World example of running a ServiceStack Self Hosted Service inside Microsoft's Service Fabric platform.

### Performance Improvements

Our first support for .NET Core was primarily focused on compatibility and deep integration with .NET Core's 
Pipeline, Modules and Conventions. In this release we focused on performance and memory usage which we kicked 
off by developing a benchmarking solution for automatically spinning up Azure VM's that we use to run 
benchmarking and load tests against: https://github.com/NetCoreApps/Benchmarking

A simple JSON Service running our initial .NET Core support in v4.5.4 release yields *Requests/Sec Average*:

 - .NET Core 1.1 **26179**
 - mono 4.6.2 (nginx+hyperfasctcgi) **6428**

Running on Standard_F4s azure instance (4 Core, 8GB RAM) using the following 
[wrk benchmarking tool](https://github.com/wg/wrk) command:

    wrk -c 256 -t 8 -d 30 http://benchmarking_url

Using **8 threads**, keeping **256 concurrent HTTP Connections** open, Running for **30s**.

With the profiling and performance improvements added in this release, the same service now yields:

 - .NET Core 1.1 **37073**
 - mono 4.6.2 (nginx+hyperfasctcgi) **6840**

Which is over a **40% improvement** for this benchmark since last release. Running the same ServiceStack 
Service on the same VM also shows us that .NET Core is **5.4x faster** than Mono.

### Upgraded to .NET Core 1.1

We're closely following .NET Core's progress and continue to upgrade ServiceStack libraries and their test 
suites to run on the latest stable .NET Core 1.1 release.

### Client/Server Request Compression

You can now also elect to compress HTTP Requests in any C#/.NET Service Clients by specifying the Compression 
Type you wish to use, e.g:

```csharp
var client = new JsonServiceClient(baseUrl) {
    RequestCompressionType = CompressionTypes.GZip,
};
```

### FileSystem Mapping

Custom FileSystem mappings can now be easily registered under a specific alias by overriding your AppHost's 
`GetVirtualFileSources()` and registering a custom `FileSystemMapping`, e.g:

```csharp
public override List<IVirtualPathProvider> GetVirtualFileSources()
{
    var existingProviders = base.GetVirtualFileSources();
    existingProviders.Add(new FileSystemMapping(this, "img", "i:\\images"));
    existingProviders.Add(new FileSystemMapping(this, "docs", "d:\\documents"));
    return existingProviders;
}
```

This will let you access File System Resources under the custom `/img` and `/doc` routes, e.g:

 - http://host/img/the-image.jpg
 - http://host/docs/word.doc

## OrmLite

### SQL Server Features

Kevin Howard has continued enhancing the SQL Server Support in OrmLite with access to advanced SQL Server features including Memory-Optimized Tables where you can tell SQL Server to maintain specific tables in Memory using the `[SqlServerMemoryOptimized]` attribute, e.g:

```csharp
[SqlServerMemoryOptimized(SqlServerDurability.SchemaOnly)]
public class SqlServerMemoryOptimizedCacheEntry : ICacheEntry
{
    [PrimaryKey]
    [StringLength(StringLengthAttribute.MaxText)]
    [SqlServerBucketCount(10000000)]
    public string Id { get; set; }
    [StringLength(StringLengthAttribute.MaxText)]
    public string Data { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public DateTime ModifiedDate { get; set; }
}
```

The new Memory Optimized support can be used to improve the performance of SQL Server `OrmLiteCacheClient` by configuring it to use the above In Memory Table Schema instead, e.g:

```csharp
container.Register<ICacheClient>(c => 
    new OrmLiteCacheClient<SqlServerMemoryOptimizedCacheEntry>());
```

### PostgreSQL Data Types

To make it a little nicer to be define custom PostgreSQL columns, we've added `[PgSql*]` specific attributes which will let you use a typed `[PgSqlJson]` instead of previously needing to use `[CustomField("json")]`. 

The list of PostgreSQL Attributes include:

```csharp
public class MyPostgreSqlTable
{
    [PgSqlJson]
    public List<Poco> AsJson { get; set; }

    [PgSqlJsonB]
    public List<Poco> AsJsonB { get; set; }

    [PgSqlTextArray]
    public string[] AsTextArray { get; set; }

    [PgSqlIntArray]
    public int[] AsIntArray { get; set; }

    [PgSqlBigIntArray]
    public long[] AsLongArray { get; set; }
}
```

### .NET Core support for MySql

You can now use OrmLite with MySQL in .NET Core using the new [ServiceStack.OrmLite.MySql.Core](https://www.nuget.org/packages/ServiceStack.OrmLite.MySql.Core) NuGet package.

### Create Tables without Foreign Keys

You can temporarily disable and tell OrmLite to create tables without Foreign Keys by setting `OrmLiteConfig.SkipForeignKeys = true`.

### Custom SqlExpression Filter

The generated SQL from a Typed `SqlExpression` can now be customized using the new `.WithSqlFilter()`, e.g:

```csharp
var q = db.From<Table>()
    .Where(x => x.Age == 27)
    .WithSqlFilter(sql => sql + " option (recompile)");

var q = db.From<Table>()
    .Where(x => x.Age == 27)
    .WithSqlFilter(sql => sql + " WITH UPDLOCK");

var results = db.Select(q);
```

### Custom SQL Fragments

The new `Sql.Custom()` API lets you use raw SQL Fragments in Custom `.Select()` expressions, e.g:

```csharp
var q = db.From<Table>()
    .Select(x => new {
        FirstName = x.FirstName,
        LastName = x.LastName,
        Initials = Sql.Custom("CONCAT(LEFT(FirstName,1), LEFT(LastName,1))")
    });
```

### Cached API Key Sessions

You can reduce the number of I/O Requests and improve the performance of API Key Auth Provider Requests by specifying a `SessionCacheDuration` to temporarily store the Authenticated UserSession against the API Key which will reduce subsequent API Key requests down to 1 DB call to fetch and validate the API Key + 1 Cache Hit to restore the User's Session which if you're using the default in-memory Cache will mean it only requires 1 I/O call for the DB request. This can be enabled with:

```csharp
Plugins.Add(new AuthFeature(...,
    new IAuthProvider[] {
        new ApiKeyAuthProvider(AppSettings) {
            SessionCacheDuration = TimeSpan.FromMinutes(10),
        }
    }));
```

That covers the major features, for the full details please see the full release notes at: /releases/v4_5_6

# [2016 Release Notes Summary](/releases/2016-summary)
