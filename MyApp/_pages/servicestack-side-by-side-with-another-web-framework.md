---
slug: servicestack-side-by-side-with-another-web-framework
title: Run side-by-side with another Framework
---

:::tip
These docs only apply to ASP .NET Framework MVC projects, for [.NET Core](/netcore) see [MVC Project Templates](/templates/mvc)
:::

In order to avoid conflicts with your existing ASP.NET web framework it is recommended to host your ServiceStack web services at a custom path.
This will allow you to use ServiceStack together with an existing web framework e.g. ASP.NET MVC 3 or FUBU MVC, etc.

The location configuration (to your root Web.config file) below hosts your webservices at custom path: `/api`

```xml
<configuration>
  <!-- ... --> 
  <location path="api">
    <system.web>
      <httpHandlers>
        <add path="*" type="ServiceStack.HttpHandlerFactory, ServiceStack" verb="*"/>
      </httpHandlers>
    </system.web>

    <!-- Required for IIS 7.0 -->
    <system.webServer>
      <modules runAllManagedModulesForAllRequests="true"/>
      <validation validateIntegratedModeConfiguration="false" />
      <handlers>
        <add path="*" name="ServiceStack.Factory" 
             type="ServiceStack.HttpHandlerFactory, ServiceStack" 
             verb="*" preCondition="integratedMode" 
             resourceType="Unspecified" allowPathInfo="true" />
      </handlers>
    </system.webServer>
  </location>
  <!-- ... --> 
</configuration>
```

Configuration for also running on Mono / IIS 6:

```xml
<!-- Required for MONO -->
<configuration>
  <!-- ... --> 
  <system.web>
    <httpHandlers>
      <add path="api*" type="ServiceStack.HttpHandlerFactory, ServiceStack" verb="*"/>
    </httpHandlers>
  </system.web>
  <system.webServer>
    <validation validateIntegratedModeConfiguration="false" />
  </system.webServer>
  <!-- ... --> 
</configuration>
```

::: info
Due to limitations in IIS 6 - the `/custompath` must end with `.ashx`, e.g: `path="api.ashx"`
:::

You also need to configure the root path in your AppHost.

```csharp
public override void Configure(Container container)
{
    SetConfig(new HostConfig { HandlerFactoryPath = "api" });
}
```

**To avoid conflicts with ASP.NET MVC add an ignore rule** in `Global.asax RegisterRoutes` method e.g: 

```csharp
routes.IgnoreRoute ("api/{*pathInfo}");
```

See [mvc-netfx](https://github.com/NetFrameworkTemplates/mvc-netfx) for a working ServiceStack + MVC Project Template.

**For MVC4 applications you also need to unregister WebApi**, by commenting out this line in `Global.asax.cs`:

```csharp
//WebApiConfig.Register(GlobalConfiguration.Configuration);
```

If you used Nuget to install the bits, remove the original handler from the web.config system.webserver node e.g: 

```xml
<add path="*" name="ServiceStack.Factory"
    type="ServiceStack.HttpHandlerFactory, ServiceStack" verb="*" 
    preCondition="integratedMode" resourceType="Unspecified" allowPathInfo="true" />
```

## Enable ASP.NET Sessions

If you want ServiceStack Services to be able to access ASP.NET Session you can use a decorated `IHttpHandlerFactory` below
that returns a `SessionHandlerDecorator` that's decorated with `IRequiresSessionState` to tell ASP.NET to enable Sessions for these handlers:

```csharp
namespace MyApp
{
    public class SessionHttpHandlerFactory : IHttpHandlerFactory
    {
        private static readonly HttpHandlerFactory Factory = new HttpHandlerFactory();

        public IHttpHandler GetHandler(HttpContext context, string requestType, string url, string path)
        {
            var handler = Factory.GetHandler(context, requestType, url, path);
            return handler == null ? null : new SessionHandlerDecorator((IHttpAsyncHandler)handler);
        }

        public void ReleaseHandler(IHttpHandler handler) => Factory.ReleaseHandler(handler);
    }

    public class SessionHandlerDecorator : IHttpAsyncHandler, IRequiresSessionState
    {
        private IHttpAsyncHandler Handler { get; set; }

        internal SessionHandlerDecorator(IHttpAsyncHandler handler) => Handler = handler;

        public bool IsReusable => Handler.IsReusable;

        public void ProcessRequest(HttpContext context) => Handler.ProcessRequest(context);

        public IAsyncResult BeginProcessRequest(HttpContext context, AsyncCallback cb, object extraData) => 
          Handler.BeginProcessRequest(context, cb, extraData);

        public void EndProcessRequest(IAsyncResult result) => Handler.EndProcessRequest(result);
    }
}
```

Then replace the existing `ServiceStack.HttpHandlerFactory` registration with your decorated implementation above, e.g:

```xml
<system.web>
  <httpHandlers>
    <add path="*" type="MyApp.SessionHttpHandlerFactory, MyApp" verb="*"/>
  </httpHandlers>
</system.web>
```

### Resources

* [Example config files for Starter Templates](https://github.com/ServiceStackApps/LiveDemos#starter-templates)
