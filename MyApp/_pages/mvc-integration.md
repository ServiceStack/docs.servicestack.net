---
slug: mvc-integration
title: ASP.NET MVC Integration
---

:::tip
These docs only apply to ASP .NET Framework MVC projects, for [.NET Core](/netcore) see [MVC Project Templates](/templates/mvc)
:::

### Add ServiceStack to an existing MVC Project

You can easily add ServiceStack to any ASP.NET MVC project by getting it from NuGet with:

::: nuget
`<PackageReference Include="ServiceStack.Mvc" Version="6.*" />`
:::

This install ServiceStack with additional (and optional) integration support for MVC letting you use ServiceStack's IOC to initialize MVC controllers or create MVC Controllers with built-in access to ServiceStack's components.

### Enabling ServiceStack in Web.Config

Typically when hosting ServiceStack with MVC you'd want to host it at the `/api` custom route which you can do by adding the IIS7+ configuration below to your **Web.config**:

```xml
<location path="api">
  <system.web>
    <httpHandlers>
      <add path="*" type="ServiceStack.HttpHandlerFactory, ServiceStack" 
           verb="*"/>
    </httpHandlers>
  </system.web>

  <system.webServer>
    <modules runAllManagedModulesForAllRequests="true"/>
    <validation validateIntegratedModeConfiguration="false" />
    <handlers>
      <add path="*" name="ServiceStack.Factory" 
           type="ServiceStack.HttpHandlerFactory, ServiceStack" verb="*" 
           preCondition="integratedMode" 
           resourceType="Unspecified" allowPathInfo="true" />
    </handlers>
  </system.webServer>
</location>
```

::: info
See [Run Side-by-Side with another web framework](/servicestack-side-by-side-with-another-web-framework) for other web.config examples of hosting ServiceStack, e.g with IIS6/Mono
:::

### Add your ServiceStack AppHost

The smallest ServiceStack AppHost for MVC would look something like:

```csharp
public class AppHost : AppHostBase
{
    public AppHost() : base("MVC", typeof(MyServices).Assembly) {}

    public override void Configure(Container container)
    {            
        SetConfig(new HostConfig { 
            HandlerFactoryPath = "api" 
        });

        ControllerBuilder.Current.SetControllerFactory(
            new FunqControllerFactory(container));
    }
}

[Route("/hello/{Name}")]
public class Hello
{
    public string Name { get; set; }
}

public class MyServices : Service
{
    public object Any(Hello request)
    {
        return request;
    }
}
```

### Inferring ServiceStack's HandlerFactoryPath (/api)

Whilst ServiceStack automatically tries to infer the handler path based on the `<location>` tag, if there's an uncommon Web.config setup or there are some other issue inferring it, it' recommended to also explicitly set the `/api` handler path in `Config.HandlerFactoryPath`, e.g:

```csharp
SetConfig(new HostConfig { 
    HandlerFactoryPath = "api",
});
```

### Initializing ServiceStack

Hosting in ASP.NET MVC is very similar to hosting in any ASP.NET framework, i.e. The ServiceStack AppHost still needs to be initialized on start up in your `Global.asax.cs` (or WebActivator), e.g:

```csharp
public class Global : System.Web.HttpApplication
{
    protected void Application_Start(object sender, EventArgs e)
    {
        new AppHost().Init();
    }
}
```

You *MUST* also register ServiceStacks `/api` path by adding the lines below to MvcApplication.RegisterRoutes(RouteCollection) in the **Global.asax**:

```csharp
routes.IgnoreRoute("api/{*pathInfo}"); 
routes.IgnoreRoute("{*favicon}", new { favicon = @"(.*/)?favicon.ico(/.*)?" }); 
```

Place them before the current entries the method.

### Removing Web API

For MVC applications that include WebApi, you would need to unregister it by commenting out this line:

```csharp
//WebApiConfig.Register(GlobalConfiguration.Configuration);
```

## Optional Configuration

### Sharing dependencies with MVC Controllers

To register all your dependencies in your ServiceStack AppHost, register an MVC Controller factory so both your MVC Controllers and ServiceStack services get auto-wired with these dependencies in your `AppHost.Configure()`, e.g:

```csharp
void Configure(Funq.Container container) 
{
    //Set MVC to use the same Funq IOC as ServiceStack
    ControllerBuilder.Current.SetControllerFactory(
        new FunqControllerFactory(container));
}
```

## Calling ServiceStack Services from MVC Controllers


### Using the Service Gateway

The preferred method for calling ServiceStack Services is via the loosely-coupled [Service Gateway](/service-gateway):

```csharp
public HelloController : ServiceStackController 
{
    public void Index(string name) 
    {
        ViewBag.GreetResult = base.Gateway.Send(new Hello { Name = name }).Result;
        return View();
    }        
}
```

### Calling Services Directly

Alternatively just like in ServiceStack, you can retrieve an autowired Service and execute it directly using `base.ResolveService<TService>()`, e.g:

```csharp
public HelloController : ServiceStackController 
{
    public void Index(string name) 
    {
        using (var service = base.ResolveService<HelloService>())
        {
           ViewBag.GreetResult = service.Any(new Hello { Name = name }).Result;
           return View();
        }
    }        
}
```

For any other external methods or MVC Controllers that don't inherit `ServiceStackController` you can execute Services with:

```csharp
//Using Gateway
var gateway = HostContext.AppHost.GetServiceGateway(base.HttpContext.ToRequest());
ViewBag.GreetResult = gateway.Send(new Hello { Name = name }).Result;

//Calling Service Directly
using (var service = HostContext.ResolveService<HelloService>(base.HttpContext.ToRequest()))
{
    ViewBag.GreetResult = service.Any(new Hello { Name = name }).Result;
}
```

Another cleaner way to share functionality between MVC and ServiceStack is to get them both injected with a shared dependency. See the [IGreeter example on StackOverflow](http://stackoverflow.com/a/10572977).

### Adding Mini Profiler

To enable the Mini Profiler add the following lines in to MvcApplication in **Global.asax.cs**:

```csharp
protected void Application_BeginRequest(object src, EventArgs e)
{
    if (Request.IsLocal)
        ServiceStack.MiniProfiler.Profiler.Start();
}

protected void Application_EndRequest(object src, EventArgs e)
{
    ServiceStack.MiniProfiler.Profiler.Stop();
}
```

For more info on the MiniProfiler see the [Built in profiling](/built-in-profiling) docs.

## [Accessing ServiceStack from MVC](/servicestack-integration)

Once you have MVC + ServiceStack up and running checkout [ServiceStack Integration](/servicestack-integration) docs to explore different ways of accessing ServiceStack from MVC.

  [1]: https://github.com/ServiceStack/ServiceStack/blob/master/NuGet/ServiceStack.Host.Mvc/content/README.txt
  [2]: https://nuget.org/packages/ServiceStack.Host.Mvc/
  [3]: https://github.com/ServiceStack/ServiceStack/blob/master/NuGet/ServiceStack.Host.Mvc/content/README.txt#L10
  [4]: http://tech.pro/tutorial/1148/your-first-rest-service-with-servicestack
  [5]: https://github.com/ServiceStack/ServiceStack/wiki
  [6]: http://aspnetwebstack.codeplex.com/workitem/935
