---
slug: razor-notes
title: Razor Notes
---

## VS.NET Intelli-sense for self-hosting projects

VS.NET Intelli-sense relies on the `Web.config` that VS.NET looks for in the root directory of your host projects. As self-hosting projects are **Console Applications** they instead use `App.config` instead which is all ServiceStack looks at for configuring Razor. 

Unfortunately as VS.NET's Razor intelli-sense is coupled to ASP.NET MVC, it requires a dummy Web.config in your self-hosted projects which just contains a copy of the Razor configuration in your **App.config** (which was originally populated when adding the [ServiceStack.Razor](http://www.nuget.org/packages/ServiceStack.Razor) NuGet Package to your project). The Web.config is otherwise benign and has no other effect other than enabling VS.NET's intelli-sense.

### Intelli-sense for View Models

The `@model T` attribute isn't known to VS.NET intelli-sense when self-hosting which means you need to its more verbose alias:

```cs
@inherits ViewPage<T>
```

### Web Configuration for Razor

All ASP.NET Razor VS.NET Templates in [ServiceStackVS](https://github.com/ServiceStack/ServiceStackVS) uses the optimal `Web.config` template below `Web.config` for editing Razor pages without designer errors in VS.NET 2015: 

```xml
<configuration>
    <configSections>
        <sectionGroup name="system.web.webPages.razor" type="System.Web.WebPages.Razor.Configuration.RazorWebSectionGroup, System.Web.WebPages.Razor, Version=3.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35">
            <section name="host" type="System.Web.WebPages.Razor.Configuration.HostSection, System.Web.WebPages.Razor, Version=3.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35" requirePermission="false"/>
            <section name="pages" type="System.Web.WebPages.Razor.Configuration.RazorPagesSection, System.Web.WebPages.Razor, Version=3.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35" requirePermission="false"/>
        </sectionGroup>
    </configSections>

    <appSettings>
        <add key="webPages:Enabled" value="false" />
    </appSettings>

    <system.web.webPages.razor>
        <host factoryType="System.Web.Mvc.MvcWebRazorHostFactory, System.Web.Mvc, Version=5.0.0.0, Culture=neutral, PublicKeyToken=31BF3856AD364E35"/>
        <pages pageBaseType="ServiceStack.Razor.ViewPage">
            <namespaces>
                <add namespace="System" />
                <add namespace="System.Linq" />
                <add namespace="ServiceStack" />
                <add namespace="ServiceStack.Html" />
                <add namespace="ServiceStack.Razor" />
                <add namespace="ServiceStack.Text" />
                <add namespace="ServiceStack.OrmLite" />
                <add namespace="ProjectNamespace" />
                <add namespace="ProjectNamespace.ServiceModel" />
            </namespaces>
        </pages>
    </system.web.webPages.razor>
</configuration>
```

The [ServiceStack.Razor](https://www.nuget.org/packages/ServiceStack.Razor) NuGet package uses the official 
[Microsoft.AspNet.Razor](https://www.nuget.org/packages/Microsoft.AspNet.Razor/) 
but to minimize errors in VS.NET's Razor editor, the ServiceStack' Razor templates also reference MVC's
[Microsoft.AspNet.WebPages](https://www.nuget.org/packages/Microsoft.AspNet.WebPages/) 
NuGet package which is only used to assist Razor intellisense as ServiceStack doesn't use or need itself.

To remove the last designer error **Content pages** can inherit:

```html
@inherits ViewPage
```

And Typed **View Pages** can inherit:

```html
@inherits ViewPage<TResponse>
```

Which also doesn't affect the pages behavior, but can remove the final design-time warning showing up in
VS.NET's error list.

#### Only configuration section used

ServiceStack doesn't use the ASP.NET WebPages implementation itself, the configuration is primarily included to enable VS.NET intelli-sense and provide a way to configure the default namespaces added to Razor pages. 

This can also be done in code by adding to the `Config.RazorNamespaces` collection, but adding them to the config section lets VS.NET knows about them so you can get proper intelli-sense. 
