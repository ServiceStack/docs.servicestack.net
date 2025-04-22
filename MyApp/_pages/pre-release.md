---
title: Pre Release NuGet Packages
---

## ServiceStack Pre-Release NuGet Packages

Our interim pre-release NuGet packages in between major releases on NuGet are published to [Feedz.io](https://feedz.io/).

::: tip
If preferred, the pre-release packages are also available in our [MyGet](/myget) or [GitHub Packages Registry](/gh-nuget)
:::

### Add using Mix

If you have the [dotnet x tool](/dotnet-tool) installed, you can configure your projects by downloading `NuGet.Config` in the same folder as your **.sln**

:::sh
x mix feedz
:::

### Add using VS .NET

Instructions to add ServiceStack's Pre-Release packages feed to VS .NET are:

  1. Go to **Tools** > **Options** > **Nuget Package Manager** > **Package Sources**
  2. Add the Source `https://f.feedz.io/servicestack/pre-release/nuget/index.json` with the name of your choice, 
  e.g. `ServiceStack Pre-Release`

After registering the feed it will show up under NuGet package sources when opening the NuGet package manager dialog:

![NuGet Package Manager](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/myget/package-manager-ui.png)

Which will allow you to search and install pre-release packages from the selected Pre Release packages feed.

### Adding Pre-Release NuGet feed without VS .NET

If you're not using or don't have VS .NET installed, you can add the MyGet feed to your NuGet.config at `%AppData%\NuGet\NuGet.config`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="ServiceStack Pre-Release" value="https://f.feedz.io/servicestack/pre-release/nuget/index.json" />
    <add key="nuget.org" value="https://api.nuget.org/v3/index.json" protocolVersion="3" />
  </packageSources>
</configuration>
```

## Redownloading Pre Release packages

If you've already packages with the **same version number** from Feedz previously installed, you will 
need to manually delete the NuGet `/packages` folder for NuGet to pull down the latest packages.

### Clear NuGet Package Cache

You can clear your local NuGet packages cache in any OS by running the command-line below in your favorite Terminal:

:::sh
nuget locals all -clear
:::

If `nuget` is not in your Systems `PATH`, it can also be invoked from the `dotnet` tool:

:::sh
dotnet nuget locals all --clear
:::

Within VS .NET you can clear them from **Tools** > **Options** > **Nuget Package Manager** and click **Clear All NuGet Cache(s)**:

![Clear Packages Cache](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/wikis/myget/clear-package-cache.png)

Alternatively on Windows you can delete the Cached NuGet packages manually with:

:::sh
del %LOCALAPPDATA%\NuGet\Cache\*.nupkg /q
:::

### Full Package Clean

In most cases clearing the NuGet packages cache will suffice, sometimes you'll also need to manually delete other local packages caches

delete all NuGet packages in `/packages` folder:

:::sh
rd /q /s packages 
:::

delete `/bin` and `/obj` folders in host project

:::sh
rd /q /s bin obj
:::

## Versioning Scheme

::include versioning-scheme.md::
