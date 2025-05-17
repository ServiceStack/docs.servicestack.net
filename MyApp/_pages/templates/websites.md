---
title: Website Project Templates
slug: templates-websites
---

There are 3 templates for each of the different technologies that can be used with ServiceStack to develop Server HTML Generated Websites and HTTP APIs which can be installed with [dotnet-new](/dotnet-new): 

```bash
$ dotnet tool install --global x 
```

```bash
$ x new mvc AcmeMvc
```

Which will create a new .NET 6.0 MVC Project called **AcmeMvc**. The Template Names, Source Code and Live Demos for each Website Template is available below:

<table class="not-prose table tpl">
<tr>
    <th>.NET 6.0</th>
    <th>.NET Framework</th>
    <th>Single Page App Templates</th>
</tr>
<tr>
    <td><a href="https://github.com/NetCoreTemplates/mvc">mvc</a></td>
    <td><a href="https://github.com/NetFrameworkTemplates/mvc-netfx">mvc-netfx</a></td>
    <th align="center">
        MVC Bootstrap Template
    </th>
</tr>
<tr>
    <td class="tpl-desc" colspan="2">
        The <code class="highlighter-rouge">mvc</code> template differentiates the most between .NET Core and ASP.NET versions as ASP.NET Core MVC and ASP.NET MVC 5 are completely different implementations. With <code class="highlighter-rouge">mvc</code> ServiceStack is configured within the same .NET Core pipeline and shares the same request pipeline and “route namespace” but in ASP.NET MVC 5, ServiceStack is hosted at the <code class="highlighter-rouge">/api</code> Custom Path. Use MVC if you prefer to create different Controllers and View Models for your Website UI independently from your HTTP APIs or if you prefer to generate <strong>server HTML validation errors</strong> within MVC Controllers.
    </td>
    <td align="center">
        <a href="http://mvc.web-templates.io"><img src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/mvc.png" width="450" /></a>
        <p><a href="http://mvc.web-templates.io">mvc.web-templates.io</a></p>
    </td>
</tr>
<tr>
    <td><a href="https://github.com/NetCoreTemplates/razor">razor</a></td>
    <td><a href="https://github.com/NetFrameworkTemplates/razor-netfx">razor-netfx</a></td>
    <th align="center">
        ServiceStack.Razor Bootstrap Template
    </th>
</tr>
<tr>
    <td class="tpl-desc" colspan="2">
        The <code class="highlighter-rouge">razor</code> Template is configured to develop Websites using <a href="https://razor.netcore.io">ServiceStack.Razor</a> for developing server-generated Websites using Razor without MVC Controllers which lets you create Content Razor Pages that can be called directly or View Pages for generating HTML Views for existing Services. The source code for .NET Core and ASP.NET Framework projects are nearly identical despite being completely different implementations with the .NET Core version being retrofitted on top of .NET Core MVC Views. Use <code class="highlighter-rouge">razor</code> templates if you like Razor and prefer the <a href="/api-first-development">API First Development model</a> or plan on developing Websites for both .NET Core and ASP.NET and would like to be easily able to migrate between them.
    </td>
    <td align="center">
        <a href="http://razor.web-templates.io"><img src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/razor.png" width="450" /></a>
        <p><a href="http://razor.web-templates.io">razor.web-templates.io</a></p>
    </td>
</tr>
<tr>
    <td><a href="https://github.com/NetCoreTemplates/script">script</a></td>
    <td><a href="https://github.com/NetFrameworkTemplates/script-netfx">script-netfx</a></td>
    <th align="center">
        ServiceStack #Script Pages Bootstrap Template
    </th>
</tr>
<tr>
    <td class="tpl-desc" colspan="2">
        The <code class="highlighter-rouge">script</code> Project Template is configured to develop Websites using <a href="https://sharpscript.net/docs/script-pages">#Script Pages</a>, a simpler and cleaner alternative to Razor that lets you utilize simple #Script Expressions for evaluating Server logic in <code class="highlighter-rouge">.html</code> pages. #Script doesn’t require any precompilation, is easier to learn and more intuitive for non-programmers that’s more suitable for a <a href="https://sharpscript.net/usecases/">number of use-cases</a>. Use <code class="highlighter-rouge">script</code> if you want an <a href="/releases/v4_5_14#why-templates">alternative to Razor</a> syntax and the heavy machinery required to support it.
    </td>
    <td align="center">
        <img src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/templates.png" width="450" />
    </td>
</tr>
</table>

#### Hot Reloading

Both `razor` and `script` project enjoy Hot Reloading where in development a long poll is used to detect and reload changes in the current Template Page or static files in `/wwwroot`.

### Watched .NET Core builds

.NET Core projects can also benefit from [Live Coding using dotnet watch](https://dotnetcoretutorials.com/2017/01/31/live-coding-net-core-using-dotnet-watch/) which performs a "watched build" where it automatically stops, recompiles and restarts your .NET Core App when it detects source file changes. You can start a watched build from the command-line with:

```bash
$ dotnet watch run
```

### .NET 6.0 ServiceStack WebApp Template

The .NET 6.0 [bare-app](https://github.com/sharp-apps/bare-app) project template is a pre-built .NET 6.0 App that dramatically simplifies .NET Wep App development by enabling Websites and APIs to be developed instantly without compilation.

<table class="not-prose table">
<tr>
    <th>.NET 6.0</th>
    <th>Sharp App</th>
</tr>
<tr>
    <td><a href="https://github.com/sharp-apps/rockwind-app">rockwind-app</a></td>
    <td align="center">
        <a href="http://rockwind-app.web-templates.io/"><img src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/bare-app.png" width="650" /></a>
        <p><a href="http://rockwind-app.web-templates.io/">rockwind-app.web-templates.io</a></p>
    </td>
</tr>
</table>

See [sharpscript.net/docs/sharp-apps](https://sharpscript.net/docs/sharp-apps) to learn the different use-cases made possible with Sharp Apps.
