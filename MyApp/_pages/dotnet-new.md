---
slug: dotnet-new
title: Create Projects with 'x new'
---

All ServiceStack Projects can be created using the .NET Core [x dotnet tool](https://www.nuget.org/packages/x):

## Install

:::sh
dotnet tool install --global x 
:::

### Apple M1

Install on Apple's new M1 Pro and M1 Max ARM chips with:

:::sh
dotnet tool install -g -a x64 x
:::

### Update

Or if you had a previous version installed, update with:

:::sh
dotnet tool update -g x
:::

All features from the cross-platform `x` dotnet tool are also available from the [.NET Core Windows Desktop app](/netcore-windows-desktop) tool:

:::sh
dotnet tool install --global app 
:::

#### Usage

To view a list of projects run:

:::sh
x new
:::

Where it will display all repositories in [.NET Core](https://github.com/NetCoreTemplates), 
[.NET Framework](https://github.com/NetFrameworkTemplates) and 
[ASP.NET Core Framework](https://github.com/NetFrameworkCoreTemplates) GitHub Orgs:

:::{class="not-prose table table-striped"}

::include web-new-netcore.md::

<p>&nbsp;</p>

::include web-new-corefx.md::

<p>&nbsp;</p>

::include web-new-netfx.md::

:::

#### Usage

```bash
$ x new `<template>` `<name>`
```

For example to create a new **Vue Single Page App**, run:

:::sh
x new vue-spa ProjectName
:::

Alternatively you can write new project files directly into an empty repository using the Directory Name as the ProjectName:

```bash
$ git clone https://github.com/<User>/<ProjectName>.git
$ cd <ProjectName>
$ x new vue-spa
```

Or download a customized project template from our Getting Started Page:

### [servicestack.net/start](https://servicestack.net/start)

## Modernized Project Templates

![](/img/pages/ssvs/spa-templates-overview.png)

The ASP.NET Core Project Templates have been upgraded to use the latest external dependencies and have all been rewritten to take advantage
of the ServiceStack Features added in this release, namely:

 - **[Modular Startup](/modular-startup)** - ASP.NET Core Apps can take advantage of the modularity benefits and extensibility of `mix` features
 - **[Navigation Items](/navigation)** - Simplified maintenance and dynamic navigation items rendering using Navigation controls
 - **Auth Enabled** - Integrated Auth including dynamic menu, protected pages, auth redirect flow inc. Forbidden pages
 - **[SVG](/svg)** - Pre-configured to use `svg/` folder, ready to drop in your App's assets and go
 - **[Optimal Library Bundles](/html-css-and-javascript-minification)** - CSS/JS bundles are split into optimal hashed library and frequently changing App bundles
 - **SSL** - As it's recommended for Web Apps to use SSL, all templates now use `https://localhost:5001` and 
 configured to use Same Site Cookies by default

### Auth Enabled Project Templates

Most Project Templates are now integrated with Credentials Auth and Facebook, Google and Facebook 3rd Party OAuth providers, complete with
protected Pages and Services and auth redirect flow to Sign In and Forbidden pages. 

### vue-spa

Vue CLI Bootstrap App

[![](/img/pages/auth/signin/vue-spa.png)](https://github.com/NetCoreTemplates/vue-spa)

.NET 6+
:::sh
x new vue-spa ProjectName
:::

.NET Framework
:::sh
x new vue-spa-netfx ProjectName
:::

### react-spa

React Create App CLI Bootstrap App

[![](/img/pages/auth/signin/react-spa.png)](https://github.com/NetCoreTemplates/react-spa)


.NET 6+
:::sh
x new react-spa ProjectName
:::

.NET Framework
:::sh
x new react-spa-netfx ProjectName
:::

### svelte-spa

Svelte SPA App with Bootstrap

[![](/img/pages/auth/signin/svelte-spa.png)](https://github.com/NetCoreTemplates/svelte-spa)

.NET 6+
:::sh
x new svelte-spa ProjectName
:::

### angular-spa

Angular 12 CLI Bootstrap App

[![](/img/pages/auth/signin/angular-spa.png)](https://github.com/NetCoreTemplates/angular-spa)

.NET 6+
:::sh
x new angular-spa ProjectName
:::

.NET Framework
:::sh
x new angular-spa-netfx ProjectName
:::

### mvcauth

.NET 6.0 MVC Website integrated with ServiceStack Auth

[![](/img/pages/auth/signin/mvcauth.png)](https://github.com/NetCoreTemplates/mvcauth)

.NET 6+
:::sh
x new mvcauth ProjectName
:::

### mvcidentity

.NET 6.0 MVC Website integrated with ServiceStack using MVC Identity Auth

[![](/img/pages/auth/signin/mvcidentity.png)](https://github.com/NetCoreTemplates/mvcidentity)

.NET 6+
:::sh
x new mvcidentity ProjectName
:::

### mvcidentityserver

.NET 6.0 MVC Website integrated with ServiceStack using IdentityServer4 Auth

[![](/img/pages/auth/signin/mvcidentityserver.png)](https://github.com/NetCoreTemplates/mvcidentityserver)

.NET 6+
:::sh
x new mvcidentityserver ProjectName
:::

### react-lite

ASP.NET Core Simple + lite (npm-free) React SPA using TypeScript

[![](/img/pages/auth/signin/react-lite.png)](https://github.com/NetCoreTemplates/react-lite)

.NET 6+
:::sh
x new react-lite ProjectName
:::

ASP.NET Core on .NET Framework
:::sh
x new react-lite-corefx ProjectName
:::

### vue-lite

ASP.NET Core Simple + lite (npm-free) Vue SPA using TypeScript

[![](/img/pages/auth/signin/vue-lite.png)](https://github.com/NetCoreTemplates/vue-lite)

.NET 6+
:::sh
x new vue-lite ProjectName
:::

ASP.NET Core on .NET Framework
:::sh
x new vue-lite-corefx ProjectName
:::

### vue-nuxt

Nuxt.js SPA App with Bootstrap

[![](/img/pages/auth/signin/vue-nuxt.png)](https://github.com/NetCoreTemplates/vue-nuxt)

.NET 6+
:::sh
x new vue-nuxt ProjectName
:::

.NET Framework
:::sh
x new vue-nuxt-netfx ProjectName
:::

### script

`#Script` Pages Bootstrap Website

[![](/img/pages/auth/signin/script.png)](https://github.com/NetCoreTemplates/script)

.NET 6+
:::sh
x new script ProjectName
:::

ASP.NET Core on .NET Framework
:::sh
x new script-corefx ProjectName
:::

.NET Framework
:::sh
x new script-netfx ProjectName
:::

### razor

ServiceStack.Razor Bootstrap Website

[![](/img/pages/auth/signin/razor.png)](https://github.com/NetCoreTemplates/razor)

.NET 6+
:::sh
x new razor ProjectName
:::

ASP.NET Core on .NET Framework
:::sh
x new razor-corefx ProjectName
:::

.NET Framework
:::sh
x new razor-netfx ProjectName
:::

### Create Customized Projects with mix

All new projects can be further customized with [mix](/mix-tool) dotnet tool to mix in additional "layered" features.

## Creating new .NET 5 projects

If you're not yet ready to move to .NET 6 you can still create new projects of older versions of
the [.NET Core templates](https://github.com/NetCoreTemplates/).

Which can also be created from our online Project builder at: **servicestack.net/start?tag=net5**

Otherwise our .NET Core project templates have had their last .NET 5.0 version tagged with `net5` which can be installed with 
the `x` tool by using the full URL of its Source Code **.zip** archive in place of the Template name, e.g:

:::sh
`x new https://github.com/NetCoreTemplates/<template>/archive/refs/tags/net5.zip ProjectName`
:::

### Creating new projects of older Template versions

To install any other version, explore each released Project Template version by going to its GitHub Projects `/releases` page, e.g.
[/web/releases](https://github.com/NetCoreTemplates/web/releases) then clicking on the Release `<tag>` to explore its contents. 

Once you know which release you want to create a new project of, e.g. for the `web` template 
[/v27](https://github.com/NetCoreTemplates/web/tree/v27) was the last release to target **net5.0**.

Use its full URL of its Source Code **.zip** archive 
in place of the Template name, e.g:

:::sh
mkdir ProjectName && cd ProjectName 
:::

:::sh
x new https://github.com/NetCoreTemplates/web/archive/refs/tags/v27.zip
:::

Alternatively if it's easier you can download the Release Source Code archive manually:

**https://github.com/NetCoreTemplates/web/archive/refs/tags/v27.zip**

Then either rename the project and folder names manually or copy over the original source files you want into your existing solution.

### Using older mix features

All [mix features](/mix-tool) have been rewritten to use .NET 6's new `HostingStartup` model going forward,
to help with migration please refer to the [mix diff](https://github.com/ServiceStack/mix/commit/b56746622aa1879e3e6a8cbf835e634f05db30db) 
showing how each of the existing mix configurations were converted to the new model.

To support older projects the [Existing ModularStartup configuration](https://gist.github.com/gistlyn/7362ea802aef361bbdc21097b6a99e0d)
can still be used for when running on earlier .NET Core runtimes with the mix tool by changing the gist Id in the `MIX_SOURCE` 
Environment Variable, e.g:

:::sh
MIX_SOURCE=7362ea802aef361bbdc21097b6a99e0d x mix
:::

Which will chance to use the older mix Modular Startup configuration as its source.

## Why a new project template system?

It's not often that a tool causes enough friction that it ends up requiring less effort to develop a replacement than 
it is to continue using the tool. But this has been our experience with maintaining our VS.NET Templates in the 
[ServiceStackVS](https://github.com/ServiceStack/ServiceStackVS) VS.NET Extension which has been the biggest time sink of all our
3rd Party Integrations where the iteration time to check in a change, wait for CI build, uninstall/re-install the VS.NET extension 
and create and test new projects is measured in hours not minutes. To top off the poor development experience we've now appeared to have 
reached the limits of the number of Project Templates we can bundle in our 5MB **ServiceStackVS.vsix** VS.NET Extension as a 
number of Customers have reported seeing VS.NET warning messages that ServiceStackVS is taking too long to load.

Given all the scenarios ServiceStack can be used in, we needed a quicker way to create, update and test our growing **47 starting project templates**. 
In the age of simple command-line dev tools like git and .NET Core's light weight text/human friendly projects, maintaining and creating 
new .NET project templates still feels archaic & legacy requiring packaging projects as binary blobs in NuGet packages which become stale 
the moment they're created.

## How it works

### GitHub powered Project Templates

Especially for SPA projects which need to be frequently updated, the existing .NET Project Templates system is a stale solution that doesn't offer 
much benefit over maintaining individual GitHub projects, which is exactly what the `dotnet-new` npm tool and now `x new` .NET Core are designed around.

Inside [dotnet-new](/templates/dotnet-new) and `x new` is an easier way to create and share any kind of project templates which are easier for developers
to create, test, maintain and install. So if you're looking for a simpler way to be able to create and maintain your own value-added project templates 
with additional bespoke customizations, functionality, dependencies and configuration, using `x new` is a great way to maintain and share them.

Using GitHub for maintaining project templates yields us a lot of natural benefits:

 - Uses the same familiar development workflow to create and update Project Templates
 - Git commit history provides a public audit trail of changes
 - Publish new versions of project templates by creating a new GitHub release
 - Compare changes between Project Templates using GitHub's compare changes viewer
 - Browse and Restore Previous Project Releases
 - End users can raise issues with individual project templates and send PR contributions

A quick way to get started is to fork one of the existing [.NET Project Templates](https://github.com/NetCoreTemplates/) like the [web](https://github.com/NetCoreTemplates/web) or [empty](https://github.com/NetCoreTemplates/empty) templates.

### Always up to date

Importantly end users will always be able to view the latest list of project templates and create projects using the latest available version, 
even if using older versions of the tools as they query GitHub's public APIs to list all currently available projects that for installation
will use the latest published release (or **master** if there are no published releases), which if available, downloads, caches and 
creates new projects from the latest published `.zip` release.

### Just regular Projects

Best of all creating and testing projects are now much easier since project templates are just working projects following a simple naming convention
that when a new project is created with:

```bash
$ x new <template> ProjectName
```

### Install directly from your GitHub repo

To create projects from your own GitHub projects use its qualified `user/repo` name, e.g:

```bash
$ x new <user>/<repo> ProjectName
```

Replaces all occurrences in all text files, file and directory names, where:

 - `My_App` is replaced with `Project_Name`
 - `MyApp` is replaced with `ProjectName`
 - `My App` is replaced with `Project Name`
 - `my-app` is replaced with `project-name`
 - `myapp` is replaced with `projectname`
 - `my_app` is replaced with `project_name`

The tool installer then inspects the project contents and depending on what it finds will:

 - Restore the .NET `.sln` if it exists
 - Install npm packages if `package.json` exists
 - Install libman packages if `libman.json` exists

That after installation is complete, results in newly created projects being all setup and ready to run.

### Available project templates

One missing detail is how it finds which GitHub repo should be installed from the `<template>` name. 

This can be configured with the `APP_SOURCE_TEMPLATES` Environment variable to configure the `x` tool to use your own GitHub organizations instead, e.g:

```
APP_SOURCE_TEMPLATES=NetCoreTemplates;NetFrameworkTemplates;NetFrameworkCoreTemplates
```

Optionally you can display a friendly name next to each Organization name, e.g:

```
APP_SOURCE_TEMPLATES=NetCoreTemplates .NET Core C# Templates;
```

`x new` will then use the first GitHub Repo that matches the `<template>` name from all your GitHub Sources, so this
does require that all repos have unique names across all your configured GitHub Sources.

These are the only sources `x new` looks at to create ServiceStack projects, which by default is configured to use 
[NetCoreTemplates](https://github.com/NetCoreTemplates), [NetFrameworkTemplates](https://github.com/NetFrameworkTemplates) and 
[NetFrameworkCoreTemplates](https://github.com/NetFrameworkCoreTemplates) GitHub Organizations, whose repos will be listed when running:

:::sh
x new
:::

### Creating new Legacy Project Templates

By Setting `APP_SOURCE_TEMPLATES` environment variable to [LegacyTemplates](https://github.com/LegacyTemplates) you can can use the `x` tool 
to browse and create new legacy project templates, e.g:

:::sh
APP_SOURCE_TEMPLATES=LegacyTemplates x new
:::

::include web-trouble.md::
