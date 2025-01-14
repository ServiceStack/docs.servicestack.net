---
slug: debugging
title: Debugging
---

## SourceLink Enabled Packages 

To maximize the debuggability of ServiceStack packages all ServiceStack projects utilize **MSBuild generated NuGet packages** 
where all packages are embed **pdb symbols** and are configured with [support for SourceLink](https://github.com/dotnet/sourcelink/) 
to improve the debugging experience of ServiceStack Apps as source files can be downloaded on-the-fly from GitHub as you debug.

Scott Hanselman has written a [nice post on Source Link](https://www.hanselman.com/blog/ExploringNETCoresSourceLinkSteppingIntoTheSourceCodeOfNuGetPackagesYouDontOwn.aspx) 
and how it can be enabled inside VS.NET by turning on **Enable source link support**:

[![](https://www.hanselman.com/blog/content/binary/Windows-Live-Writer/7e5fb7b6dad8_140AA/image_0c73cb8d-bd5a-406e-a51d-a2eb4af12117.png)](https://www.hanselman.com/blog/ExploringNETCoresSourceLinkSteppingIntoTheSourceCodeOfNuGetPackagesYouDontOwn.aspx)

When enabled it should let you debug into the ServiceStack framework implementation, downloading the correct source files version from GitHub as and when needed.

### All ServiceStack GitHub projects use CI NuGet feed

In addition to using MSBuild generated packages all projects also utilize CI NuGet package feeds for external dependencies instead of copying 
.dll's in `/lib` folders. As a consequence you'll no longer have to build external ServiceStack GitHub projects or use GitHub published releases, 
as now the **master** repo of all GitHub projects can be built from a clean checkout at anytime.

The pre-release packages are still published using the **same version number** so if you get a build error from having a cached stale package
you'll need to [clear your local packages cache](/pre-release#redownloading-myget-packages) to download the latest build packages from the CI NuGet packages feed.

### Linking to Source projects

In order to get the best source-based development experience using the latest version of ServiceStack in your Projects, clone the ServiceStack
Repos you want to use:

 - [ServiceStack/ServiceStack](https://github.com/ServiceStack/ServiceStack)
 - [ServiceStack/ServiceStack.Text](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Text)
 - [ServiceStack/ServiceStack.OrmLite](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.OrmLite)
 - [ServiceStack/ServiceStack.Aws](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Aws)
 - [ServiceStack/ServiceStack.Azure](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Azure)

Then reference the `*.Source.csproj` of each project you want to reference in your solution. 

This approach is used in our [Test.csproj](https://github.com/NetCoreApps/Test/blob/master/src/Test/Test.csproj) allowing us to debug directly into ServiceStack library source code just like any other project reference in our solution.

### Alternatives Debugging Solutions

[GitLink](https://oren.codes/2015/09/23/enabling-source-code-debugging-for-your-nuget-packages-with-gitlink/)
is another solution for debugging source code in NuGet packages.

Otherwise the most reliable solution for debugging ServiceStack source code is to 
[download the source code for the release](https://github.com/ServiceStack/ServiceStack/releases) on Github 
you want to debug, build the VS.NET Solution locally using **Debug** configuration then change your 
ServiceStack references to use your local **.dll**.

## Configuration

### DebugMode

ServiceStack allows additional debug information when in **DebugMode**, which is automatically set by 
default in **Debug** builds or explicitly with:

```csharp
SetConfig(new HostConfig { DebugMode = true });
```

In addition, users with the **Admin** role or Requests with an **AuthSecret** can also view Debug Info 
in production.

### StrictMode

You can configure Strict Mode in ServiceStack to enforce stricter behavior and have it throw Exceptions when it 
sees certain failure conditions. To enable Strict Mode across all libraries use:

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

### Admin Role

Users in the `Admin` role have super-user access giving them access to any services or plugins protected 
with Roles and Permissions.

### AuthSecret

You can use **Config.AdminAuthSecret** to specify a special string to give you admin access without having 
to login by adding `?authsecret=xxx` to the query string, e.g:

```csharp
SetConfig(new HostConfig { AdminAuthSecret = "secretz" });
```

By-pass protected services using query string:

```
/my-service?authsecret=secretz
```

### AuthSecret HttpHeader

In addition to **authsecret** QueryString, FormData or Cookie, it can also be sent with any request with the `authsecret` HTTP Header, e.g:

```ts
let client = new JsonServiceClient(BaseUrl).apply(c => {
    c.basePath = '/api'
    c.headers.set('authsecret', authsecret)
})
```

Or it can be sent in the `authsecret` Cookie or `X-Param-Override-authsecret` HTTP Header.

## Debug Links

To provide better visibility to the hidden functionality in ServiceStack we've added **Debug Info** links 
section to the `/metadata` page which add links to any Plugins with Web UI's, e.g:

![Debug Info Links](http://i.imgur.com/2Hf3P9L.png)

The **Debug Links** section is only available in **DebugMode**.

You can add links to your own [Plugins](/plugins) in the metadata pages with:

```csharp
appHost.GetPlugin<MetadataFeature>()
    .AddPluginLink("swagger-ui/", "Swagger UI");

appHost.GetPlugin<MetadataFeature>()
    .AddDebugLink("?debug=requestinfo", "Request Info");
```

`AddPluginLink` adds links under the **Plugin Links** section and should be used if your plugin is publicly 
visible, otherwise use `AddDebugLink` for plugins only available during debugging or development.

## Startup Errors

When plugins are registered their Exceptions are swallowed and captured in `AppHost.StartupErrors` so an 
individual Rogue plugin won't prevent your ServiceStack AppHost from starting. But when a plugin doesn't 
work properly it can be hard to determine the cause was due to an Exception occuring at Startup. 

Alternatively enable [StrictMode](#strictmode) to have StartUp Exceptions thrown on StartUp.

## Debug Inspector

[![](https://sharpscript.net/assets/img/screenshots/metadata-debug.png)](https://sharpscript.net/metadata/debug)

All ServiceStack Apps have access to rich introspection and queryability for inspecting remote ServiceStack instances with the new [Debug Inspector](https://sharpscript.net/docs/servicestack-scripts#debug-template).

The Debug Template is a Service in `SharpPagesFeature` that's pre-registered in [DebugMode](#debugmode). The Service can also be available when not in **DebugMode** by enabling it with:

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

Alternatively if preferred you can make the Debug Template Service available to:

```csharp
Plugins.Add(new SharpPagesFeature { 
    MetadataDebugAdminRole = RoleNames.AllowAnyUser,  // Allow Authenticated Users
    MetadataDebugAdminRole = RoleNames.AllowAnon,     // Allow anyone
})
```

Which is the configuration that allows [sharpscript.net/metadata/debug](https://sharpscript.net/metadata/debug) to be accessible to anyone.

## Lisp TCP Repl Server

A even greater way to get deeper insights into a Live running remote ServiceStack App is to open a
[Lisp TCP REPL Server](/lisp-tcp-repl-server) into the server to open a **"programmable gateway"** into any 
ServiceStack App where you're able to perform live queries, access IOC dependencies, invoke internal Server functions and query
the state of a running Server to provide invaluable insight when diagnosing issues on a remote server.

::: info YouTube
[youtu.be/HO523cFkDfk](https://youtu.be/HO523cFkDfk)
:::

[![](/img/pages/sharpscript/lisp-tcp-repl.gif)](https://youtu.be/HO523cFkDfk)


### Request Info

ServiceStack's Request Info feature is useful for debugging requests. Just add **?debug=requestinfo** 
in your `/pathinfo` and ServiceStack will return a dump of all the HTTP Request parameters to help with 
debugging interoperability issues. The RequestInfoFeature is only enabled in [DebugMode](/debugging#debugmode).

To better highlight the presence of Startup Errors a red warning banner will also appear in `/metadata` pages when in [DebugMode](/debugging#debugmode), e.g:

![](./img/pages/release-notes/startup-errors.png)

The number of Startup Errors is also added to the `X-Startup-Errors: n` Global HTTP Header so you'll be 
able to notice it when debugging HTTP Traffic.

If you prefer that any Plugin Exception is immediately visible you can register this callback in your 
`AppHost` to throw a YSOD with your first Startup Error:

```csharp
AfterInitCallbacks.Add(host => {
    var appHost = (ServiceStackHost)host;
    if (appHost.StartUpErrors.Count > 0)
        throw new Exception(appHost.StartUpErrors[0].Message);
});
```

## Plugins

There are a number of plugins that can help with debugging:

### [Request Logger](/request-logger)

Add an In-Memory `IRequestLogger` and service with the default route at `/requestlogs` which maintains a 
live log of the most recent requests (and their responses). Supports multiple config options incl. 
Rolling-size capacity, error and session tracking, hidden request bodies for sensitive services, etc.

```cs
Plugins.Add(new RequestLogsFeature());
```

The `IRequestLogger` is a great way to introspect and analyze your service requests in real-time, e.g:

![Live Screenshot](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/request-logs-01.png)

It supports multiple queryString filters and switches so you filter out related requests for better analysis 
and debuggability:

![Request Logs Usage](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/request-logs-02.png)

The [RequestLogsService](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Admin/RequestLogsService.cs) is just a simple C# service under-the-hood but is a good example of how a little bit of code can provide a lot of value in ServiceStack's by leveraging its generic, built-in features.

