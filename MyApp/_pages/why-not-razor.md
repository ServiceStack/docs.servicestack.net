---
slug: why-not-razor
title: Why not Razor?
---

We added [our Razor Support](https://razor.netcore.io) in 2012 to be able to use Razor to generate the HTML UI for Services which includes a simplified development model for building Web Apps that includes [No Ceremony Pages](https://razor.netcore.io/#no-ceremony) which lets you use [Smart View Pages](https://razor.netcore.io/#smart-views) without Controllers to develop dynamic web pages with intuitive Cascading Layouts that can be called directly via pretty URLs.

These are some of the features added to make Razor more pleasant to use, but have since hit the law of diminishing returns trying to innovate around Razor any further. We're effectively limited by its coupling to external tooling whose development is controlled entirely by the authors of those tools.

## End User Language with low ROI

A major reason for our reduced focus around Razor is similar to VB6's one-way consumption of COM APIs, Razor is an "end-user language" for .NET APIs, i.e. server logic embedded in Razor pages is "one-off code" providing minimal utility and code reuse that's only applicable to HTML clients (i.e. Browsers) for the page it's embedded in whilst delivering a worse UX compared to the alternative [API First Development](/api-first-development) model where your Web Pages use Ajax as just another client to call the same back-end Services that Mobile and Desktop clients use. 

So instead of having browsers perform full-page POST backs and creating specific Controllers/Services that can only handle browser requests, you'll get much better responsiveness, utility and code-reuse by just developing "pure" back-end Services and using JavaScript to make Ajax requests. JavaScript is also much better than C# at being able to [use a generic routine](/ss-utils-js#fluent-validation) to automatically update Form UIs with Service's structured error responses where it also benefits from reduced development effort.

In this light it's more important to interoperate with JavaScript than it is to have C# logic embedded in HTML pages.

## Poor extensibility

Razor is not easily extensible, to add a new directive you need to go deep into its compiler architecture where even something as pervasive as its `@model` directive is not a feature in `System.Web.Razor` itself, it has to be re-implemented in every Web Framework that uses it, forcing tight coupling to the Web Framework it's hosted in. You're also constrained as to what directives and features you should even attempt to add as if it's not supported by VS.NET's designers there's no point implementing it as having broken intelli-sense is worse than having no intelli-sense at all.

## Limited by VS.NET

This touches on its most inhibiting constraint, we're limited to serving at the mercy of VS.NET's designer tooling, an undocumented proprietary opaque blob that drives the design and limits everything that you can do with Razor. As an example ServiceStack doesn't need any XML configuration for executing its Razor implementation at runtime, but every ServiceStack project using Razor is forced to adopt a fragile [chunk of XML configuration](/razor-notes#web-configuration-for-razor) for the sake of appeasing VS.NET's designer. 

VS.NET's Razor support is also opinionated to only support Razor in ASP.NET projects which is what forces ServiceStack's Self-Hosting Razor projects to maintain a duplicate copy of its Razor configuration in its **app.config** in a separate **web.config** file that should only be used for ASP.NET Web projects. Whilst this fixes intelli-sense in Self-Hosting projects, you'll still see an internal cosmetic designer error that every self-hosting Razor project puts up with as there's currently no workaround that removes it.

## Promotes poor modularity, tightly-coupled Architecture

Razor Views lives in the host project, together with all its Web Assets, MVC Controllers, App Configuration and all concrete dependencies used in the project. It uses static extension methods as the primary way to access shared C# functionality and forces the use of a centralized `/Views` and `/Views/Shared` folder for sharing Layouts and Partials. As a result most sufficiently large ASP.NET MVC Apps we've seen suffer from tight coupling to either concrete dependencies or its MVC Controller implementations, whether it's referenced directly from inside Razor Views or transitively through HTML Helpers and other static classes. These static references to contentious shared locations directly promotes all views being tightly coupled to each other and concrete dependencies which inhibits decoupling, unit testing and being able to remove or substitute dependencies.

Modularity can be measured at a high-level by how easy a feature can be removed and reused in other projects, it also helps reduce complexity by being able to visualize how a component and its dependencies works in isolation. MVC Razor's forced opinions makes it hard to maintain a modular code-base and why every ServiceStack VS.NET project template has always utilized a [recommended physical project structure](/physical-project-structure) which isolates your Services implementation from your Host's configuration and its concrete dependencies, the decoupling encourages binding to clean, substitutable and testable interfaces whilst ServiceStack.Razor's [Cascading Layouts feature](https://razor.netcore.io/#no-ceremony) works intuitively and helps with modularity.

## Fragile

There's nothing else in ServiceStack that's as fragile Razor which is dependent on external build tools, pre-compilation steps, code generation, xml configuration, web.config transforms, project configuration, designer tooling, pre-compiled views, .dll versions, etc. All of which can go wrong to break Razor views.

We offer easy to use APIs for being able to [dynamically create Razor Views](/view-and-template-selection#executing-razor-in-code) which we use ourselves to generate HTML emails, but as there's several external environmental factors that can cause Razor Views to fail we recommend adding Integration tests to ensure your Razor Views still work after an upgrade - a unit test won't be enough to catch a misconfigured project.

There's also needing hacks to [implement pre-compiled Razor Views](/compiled-razor-views) like
[maintaining empty stubs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Razor.BuildTask/Support/HostContext.cs) of our HostContext and HostConfig classes to get successful builds.

## The different flavors of Razor

Due to its design and tight coupling to Web Frameworks, no 2 Razor versions from different Frameworks works the same. The way to return Razor Views, how views are resolved, the HTML Helpers available, the ways to customize Razor pages, the base class used, etc all use the different implementations in each host framework.

They're not even the same from the same team in the same product, with ASP.NET MVC Razor being significantly different from ASP.NET MVC Core Razor, both with different implementations and features not available in the other.

This inhibits consistency, knowledge-sharing, component sharing and code reuse.

## Invasive Magic Behavior

[ASP.NET Web Pages](https://www.asp.net/web-pages) is another flavour of Razor added to ASP.NET a few years ago that was a failed attempt to create a Web Framework using just Razor Pages. It came with its own [Web Matrix](https://www.microsoft.com/web/webmatrix/) IDE that's no longer available to download with its [support for existing developers ending this year](https://blogs.iis.net/webmatrix/webmatrix-product-support-ends-on-november-1st-2017). It's documentation is [still hosted online](https://www.asp.net/web-pages) but contains several broken links.

What we're left with is a case where the complexity of a dead technology is forever embedded in ASP.NET and actively causes issues for other active Web Frameworks that uses Razor *.cshtml* pages which all need to explicitly prevent Web Pages from breaking their pages by explicitly disabling it with:

```xml
<appSettings>
    <add key="webPages:Enabled" value="false" />
</appSettings>
```

This configuration is needed in every ServiceStack Razor project despite not having any references to ASP.NET Web Pages. So the complexity of an failed and unused flavor of Razor is hidden by making all other Web Frameworks that use Razor appear to be "more complex" and require special configuration.

## Magic Behavior in .NET Core

We're very disappointed to see this practice of bundling magic behavior with the underlying platform has continued in .NET Core. Usually we just live with the defaults the ASP.NET team decides to adopt, their choices always have a detrimental effect to the surrounding .NET ecosystem maintaining alternative solutions but at least if you're not using their defaults libraries they won't affect your project, but the special handling to support Razor is actively harmful to all .NET Core 2.0 projects not using it and continues to perpetuate the stigma that ASP.NET is an opinionated, bloated and unnecessarily complex platform, something that .NET Core is trying hard to eradicate, but is tainted with practices like this.

The magic behavior has leaked to negatively impact .NET Core Web projects not using Razor and has prevented us from publishing our [Web App](https://github.com/mythz/WebApp) binaries, a project that explicitly has no references to Razor or MVC and no .cshtml pages as its very purpose is to be able to build .NET Core Web Apps without Razor, but still fails when running:

    dotnet publish -c Release

i.e. the standard command to publish a .NET Core project, fails with:

```
EXEC(1,11): error CS0246: The type or namespace name 'System' could not be found (are you missing a using directive or an assembly reference?) [C:\src\NetC
oreWebApps\WebApp\src\WebApp\WebApp.csproj]
EXEC(1,54): error CS0518: Predefined type 'System.String' is not defined or imported [C:\src\NetCoreWebApps\WebApp\src\WebApp\WebApp.csproj]
C:\Program Files\dotnet\sdk\NuGetFallbackFolder\microsoft.aspnetcore.mvc.razor.viewcompilation\2.0.0\build\netstandard2.0\Microsoft.AspNetCore.Mvc.Razor.Vi
ewCompilation.targets(60,5):
```

A nonsensical error from a component that has no reason for wasting CPU cycles in projects not using MVC or Razor. After spending some time scouring the Internet trying different workarounds, we've found others experiencing similar issues where the solution was having to opt-in to stop MVC Razor Compilation breaking builds with:

    dotnet publish -c Release /p:MvcRazorCompileOnPublish=false

Which then started working as it expected. In our time spent trawling through issues we also discovered that you can reduce your published footprint by the **150 .dlls** in `/refs/*.dll` by opting out of the metadata that's unnecessarily exploding the file count of every .NET Core 2.0 Web App by opting out of metadata used by Razor with:

```xml
<PreserveCompilationContext>false</PreserveCompilationContext>
```

### Reasons against Magic behavior

Seeing this magic behavior embedded in a clean platform rewrite whose design goals is marketed as having a lean core and a **pay-for-play model** is both contradictory and non-existent in other OSS platforms with lean runtimes and thriving OSS ecosystems, including those that .NET Core's HTTP Dev model was modelled after. Instead of having this behavior opt-in and having a true pay-for-play model, the true complexity cost of Razor is hidden by making every .NET Core Web App that doesn't need or want it appear more complex and increases the potential external factors that can break apps. This also reduces the simplicity and approachability of .NET Core and increases the nuances and conceptual space every developer must know of when developing .NET Core Web Apps. A major reason to avoid building monolithic frameworks is to minimize the impact of change so it doesn't leak into and impact unrelated parts of the system, it also reduces complexity by limiting what developers need to be concerned with and spend time researching to only the features they're actually using.

Magic behavior disincentives simplicity being a goal for Razor where instead of being on the same level playing field and using the same plugin APIs as everyone else, the ASP.NET Team can continue accumulating more magic behavior in each release slowing every .NET Core build and forcing every .NET Core App to carry its baggage indefinitely. There shouldn't be any reason why a HTML renderer needs to be reliant on magic behavior like this, if there's a limitation in MSBuild's system that doesn't support the magic behavior required by Razor, that's indicative of a limitation of MSBuild that should be resolved to the benefit of everyone, if that's not possible the Razor feature mandating special treatment should be rewritten so it's not invasively impacting every Web App indiscriminately.

### Opt-in Feature Flags

These issues may just be the result of not being able to properly infer whether a .NET Core Web App is using Razor which is why it's especially important that **all magic behavior** required to support any feature should be opt-in, even if it's just behind a simple global feature flag like ```<EnableRazor>true</EnableRazor>``` so it's limited to only impact projects using Razor and provides a simple visible setting that can be commented out to be able to easily determine if its hidden behavior is the cause of broken project builds.
