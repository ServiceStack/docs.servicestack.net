---
slug: studio
title: ServiceStack Studio
---

::: warning Deprecated
**[ServiceStack Studio has been replaced](/releases/v6_02.html#retiring-studio)** by **[Admin UI](/admin-ui)**.
Last supported versions: **ServiceStack v6.1** with **app v6.0.4**.
:::

**ServiceStack Studio**  is a capability-based UI to manage multiple remote ServiceStack instances from either a Chromium Desktop App or cross-platform .NET Core Web App. 

The richer metadata in ServiceStack Services allows Studio to logically group Services around Data Models, enabling its high-level semantic features like its native data-grid like UX over all AutoQuery Services to quickly discover, search, create, update and delete entities based on the available AutoQuery APIs and whether Authenticated Users have access to them.

Install the [app dotnet tool](/netcore-windows-desktop): 

```bash
$ dotnet tool install -g app
```

Then launch with:

<h3 id="app-studio" class="my-4" tabindex="-1"><a href="app://studio">app://studio</a> 
<a class="header-anchor" href="#app-studio" aria-hidden="true">#</a></h3>

Or from a terminal with:

```bash
$ app open studio
```

> Older .NET 5.0 v5.x of `x` and `app` dotnet tools can open with `studio5` [more...](https://forums.servicestack.net/t/studio-desktop-app-switch/10342)

## Studio Preview

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="kN7371bqUII" style="background-image: url('https://img.youtube.com/vi/kN7371bqUII/maxresdefault.jpg')"></lite-youtube>

**Studio** replaces the [ServiceStack Admin UI](https://github.com/ServiceStack/Admin) where it provides a UX-friendly UI for accessing AutoQuery & Crud Services but will also gain UI features for taking advantage of various ServiceStack Plugins & Features, e.g. in this initial release it includes UI's for **Managing DB Validation Rules** & for viewing the **Executable Audit History of Tables** updated through AutoCrud Services.

### Requires v5.9+

**Studio** capability-based Admin UI is enabled via the `/metadata/app` endpoint which returns metadata information about which plugins are enabled, what features they're configured with and what User Roles they're protected behind (if any). As such it's only able to manage **v5.9+** ServiceStack instances.

You'll need the latest [app dotnet tool](/netcore-windows-desktop) which is bundled with the latest Chromium which provides the Desktop UI:

```bash
$ dotnet tool update -g app
```

Which you'll need to run once to register the `app://` url scheme, e.g:

```bash
$ app -version
```

### Starting ServiceStack Studio

This initial release of ServiceStack Studio primarily provides a UI around AutoQuery Services and the latest features in this release like **Executable Audit History** and declarative **RDBMS validators**.

If you don't have a project using the **v5.9+** features on hand you can launch a copy of [NetCoreApps/NorthwindCrud](https://github.com/NetCoreApps/NorthwindCrud) which uses the new AutoCrud features to generate AutoQuery Services around all its RDBMS tables, that can be run locally with:

```bash
$ x download NetCoreApps/NorthwindCrud
$ cd NorthwindCrud
$ dotnet run
```

Where you can use `app` URL scheme support to launch **Studio** & automatically register the **NorthwindCrud** instance with:

<p><a href="app://studio?connect=https://localhost:5001">app://studio?connect=https://localhost:5001</a></p>

This URL scheme gets translated & is equivalent to running **Studio** on the command-line with:

```bash
$ app open studio6 -connect https://localhost:5001
```

Which downloads the [Studio Gist Desktop App](https://gist.github.com/gistlyn/d8e7a56027ed6ec3060d9a9896931909), loads it as a [Gist VFS](/virtual-file-system#gistvirtualfiles) whose static assets are then served by the .NET Core Server and loaded in the CEF Chromium browser.

The `connect` param is used by **Studio** to auto register the remote **NorthwindCrud** instance where it auto downloads its App Metadata containing its enabled plugins & features & within a few seconds you should see it appear on the home page:

![](/img/pages/release-notes/v5.9/studio-home.png)

#### Desktop-less x-plat app

Whilst not optimized for it, **Studio** can also be launched headless in your default Browser using the `x` x-plat tool:

<h3 class="my-4"><a href="xapp://studio?connect=https://localhost:5001">xapp://studio?connect=https://localhost:5001</a></h3>

```bash
$ x open studio6 -connect https://localhost:5001
```

Where you'll then be able to view it by going to `https://localhost:5002`. Note if not launched in a browser **Studio** will have limited capacity and features, but will eventually be a supported mode for accessing **Studio** from macOS or Linux.

## Home Page

From the home page you'll see all the top-level Admin Sections available that's enabled on the remote instance, in the initial release there's a UI for [Managing Users](/studio-users), accessing [AutoQuery Services](/studio-autoquery) and a UI for maintaining [DB Validation Rules](/studio-validation-rules) which automatically appear against each remote ServiceStack instance depending on whether they have each feature enabled or not.

![](/img/pages/studio/studio-home.png)

## [User Management](/studio-users)

For ServiceStack instances with the `AdminUsersFeature` plugin, **Admin** users will be able to manage system users, change their passwords, Assign Roles & Permissions, temporarily Lock or permanently delete users. The plugin is highly flexible with graceful support for all Auth Providers, custom UserAuth data models and configurable editable & queryable fields.

> YouTube demo - Create Users [youtu.be/XpHAaCTV7jE?t=321](https://youtu.be/XpHAaCTV7jE?t=321)

[![](/img/pages/studio/bookings-crud-screenshot.png)](https://youtu.be/XpHAaCTV7jE?t=321)

[Admin Users docs](/studio-users)

## [AutoQuery UI](/studio-autoquery)

Studio's AutoQuery UI provides an instant intuitive UI around your ServiceStack AutoQuery Services allowing users to immediately hit the ground running and input system data as per their fine-grained authorization rules and configured validation rules.

> YouTube demo: [Querying Northwind](https://youtu.be/2FFRLxs7orU?t=16)

[![](/img/pages/release-notes/v5.9/autoquery-noauth.png)](https://youtu.be/2FFRLxs7orU?t=16)

[AutoQuery UI docs](/studio-autoquery)

### AutoQuery + Studio Demo

To see how productive the power combo of AutoQuery + ServiceStack Studio is together checkout the [AutoQuery CRUD Bookings Demo](/autoquery/crud-bookings) showing how to create a multi-user Bookings System from scratch within minutes.

## [Validation Rules UI](/studio-validation-rules)

For ServiceStack instances that have a Validation Source registered, **Admin** users will be able to specify additional Validation Rules & have them immediately applied at runtime, where they'll be instantly verified in all existing [ServiceStack Apps with Validation enabled](/world-validation) without any changes.

> YouTube demo: [Northwind Validation](https://youtu.be/2FFRLxs7orU?t=75)

[![](/img/pages/release-notes/v5.9/studio-validator-property.png)](https://youtu.be/2FFRLxs7orU?t=75)

[Validation Rules docs](/studio-validation-rules)

### Studio Desktop App vs ServiceStack.Admin

The primary limitations with [ServiceStack Admin](https://github.com/ServiceStack/Admin) was its deployment model where it had to be explicitly registered as a plugin in each ServiceStack instance, this means it could only be used on ServiceStack instances that explicitly had it registered, also it maintained the long release cadence of ServiceStack major releases which means the UI couldn't be updated frequently resulting in a stale long feedback loop.

### Frequent out-of-band release cadence

To overcome this ServiceStack Studio is delivered as a [Gist Desktop App](https://sharpscript.net/docs/gist-desktop-apps) which, like a website will be running the latest version each time it's run. To reduce its download footprint the `app` and `x` dotnet tools now include the new [ServiceStack.Desktop](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Desktop) project which includes the common framework libraries that most Vue & React Apps use which saves it from needing to be included in each Download. It also includes Google Material Design Icons SVGs & a copy of [fontawesome free icons](https://fontawesome.com/how-to-use/on-the-web/setup/hosting-font-awesome-yourself) that all Desktop Apps will be able to use without the bandwidth cost for using them.

### Light Footprint + Always use latest version

[ServiceStack/Studio](https://github.com/ServiceStack/Studio) is a [vue-lite](https://github.com/NetCoreTemplates/vue-lite) App that only uses SVG icons as they're small, high-quality at every scale, are customizable & have built-in css classes making them easy to use declaratively where it takes advantage of [ServiceStack's built-in SVG](/svg) support which allows optimal css bundles containing only the SVGs your App's use. All SVG icons used in Studio are defined in its [_init.ss](https://github.com/ServiceStack/Studio/blob/master/wwwroot/_init.ss) startup script which defines which Material Design SVG to make available under which css bundle. It also registers its own custom SVG icons not contained in ServiceStack.Desktop's embedded resources and includes them as part of its `/css/app.css` bundle.

As a result of its architecture Studio gets bundled down to a **55kb .zip** which includes its 46kb (Uncompressed) `Studio.dll` plugin containing all its C# back-end logic (thanks to all ServiceStack .dll's being deployed with the dotnet tools as well). As it's [published as a Gist](https://gist.github.com/gistlyn/d8e7a56027ed6ec3060d9a9896931909) it adds a bit more overhead (and Gist APIs aren't particularly fast) so there's a slight delay in loading from a Gist but still is able to load its home page in around **2-3s**, which includes the start time of the ServiceStack .NET Core App and the Chromium CEF Browser. The number of restarts should be minimal thanks to Studio being designed as a single UI to manage all your ServiceStack instances so you can reuse the same running Desktop App to manage multiple remote ServiceStack instances.
