---
slug: web-new
title: Create new Projects with 'x new'
---

All ServiceStack Projects can be created using the .NET Core [x dotnet tool](https://www.nuget.org/packages/x):

:::sh
dotnet tool install --global x 
:::

If you had a previous version installed, update with:

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

x new `<template>` `<name>`

For example to create a new **Vue Single Page App**, run:

:::sh
x new vue-spa ProjectName
:::

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

#### angular-spa

> Angular CLI Bootstrap App

![](/img/pages/auth/signin/angular-spa.png)

    $ x new angular-spa ProjectName            # .NET Core
    $ x new angular-spa-netfx ProjectName      # Classic ASP.NET on .NET Framework

#### mvcauth

> .NET 6.0 MVC Website integrated with ServiceStack Auth

![](/img/pages/auth/signin/mvcauth.png)

    $ x new mvcauth ProjectName                # .NET Core

#### mvcidentityserver

> .NET 6.0 MVC Website integrated with ServiceStack using IdentityServer4 Auth

![](/img/pages/auth/signin/mvcidentityserver.png)

    $ x new mvcidentityserver ProjectName      # .NET Core

#### razor

> ServiceStack.Razor Bootstrap Website

![](/img/pages/auth/signin/razor.png)

    $ x new razor ProjectName                  # .NET Core
    $ x new razor-corefx ProjectName           # ASP.NET Core on .NET Framework
    $ x new razor-netfx ProjectName            # Classic ASP.NET on .NET Framework

#### react-spa

> React Create App CLI Bootstrap App

![](/img/pages/auth/signin/react-spa.png)

    $ x new react-spa ProjectName              # .NET Core
    $ x new react-spa-netfx ProjectName        # Classic ASP.NET on .NET Framework

#### react-lite

> ASP.NET Core Simple + lite (npm-free) React SPA using TypeScript

![](/img/pages/auth/signin/react-lite.png)

    $ x new react-lite ProjectName             # .NET Core
    $ x new react-lite-corefx ProjectName      # ASP.NET Core on .NET Framework

#### script

> #Script Pages Bootstrap Website

![](/img/pages/auth/signin/script.png)

    $ x new script ProjectName                 # .NET Core
    $ x new script-corefx ProjectName          # ASP.NET Core on .NET Framework
    $ x new script-netfx ProjectName           # Classic ASP.NET on .NET Framework

#### vue-spa

> Vue CLI Bootstrap App

![](/img/pages/auth/signin/vue-spa.png)

    $ x new vue-spa ProjectName                # .NET Core
    $ x new vue-spa-netfx ProjectName          # Classic ASP.NET on .NET Framework

#### vue-lite

> ASP.NET Core Simple + lite (npm-free) Vue SPA using TypeScript

![](/img/pages/auth/signin/vue-lite.png)

    $ x new vue-lite ProjectName               # .NET Core
    $ x new vue-lite-corefx ProjectName        # ASP.NET Core on .NET Framework

#### vue-nuxt

> Nuxt.js SPA App with Bootstrap

![](/img/pages/auth/signin/vue-nuxt.png)

    $ x new vue-nuxt ProjectName               # .NET Core
    $ x new vue-nuxt-netfx ProjectName         # Classic ASP.NET on .NET Framework


### Create Customized Projects with mix

All new projects can be further customized with [mix](/mix-tool) dotnet tool to mix in additional "layered" features.


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

### Always up to date

Importantly end users will always be able to view the latest list of project templates and create projects using the latest available version, 
even if using older versions of the tools as they query GitHub's public APIs to list all currently available projects that for installation
will use the latest published release (or **master** if there are no published releases), which if available, downloads, caches and 
creates new projects from the latest published `.zip` release.

### Just regular Projects

Best of all creating and testing projects are now much easier since project templates are just working projects following a simple naming convention
that when a new project is created with:

```shell
    $ x new <template> ProjectName
```

Replaces all occurrences in all text files, file and directory names, where:

 - `MyApp` is replaced with `ProjectName`
 - `my-app` is replaced with `project-name`
 - `My App` is replaced with `Project Name`

The tool installer then inspects the project contents and depending on what it finds will:

 - Restore the .NET `.sln` if it exists
 - Install npm packages if `package.json` exists
 - Install libman packages if `libman.json` exists

That after installation is complete, results in newly created projects being all setup and ready to run.

### Available project templates

One missing detail is how it finds which GitHub repo should be installed from the `<template>` name. 

This can be configured with the `APP_SOURCE_TEMPLATES` Environment variable to configure the `x` tool to use your own GitHub organizations instead, e.g:

    APP_SOURCE_TEMPLATES=NetCoreTemplates;NetFrameworkTemplates;NetFrameworkCoreTemplates

Optionally you can display a friendly name next to each Organization name, e.g:

    APP_SOURCE_TEMPLATES=NetCoreTemplates .NET Core C# Templates;

`x new` will then use the first GitHub Repo that matches the `<template>` name from all your GitHub Sources, so this
does require that all repos have unique names across all your configured GitHub Sources.

These are the only sources `x new` looks at to create ServiceStack projects, which by default is configured to use 
[NetCoreTemplates](https://github.com/NetCoreTemplates), [NetFrameworkTemplates](https://github.com/NetFrameworkTemplates) and 
[NetFrameworkCoreTemplates](https://github.com/NetFrameworkCoreTemplates) GitHub Organizations, whose repos will be listed when running:

    $ x new

<WebTroubleMd></WebTroubleMd>
