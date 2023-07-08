---
slug: compiled-razor-views
title: Compiled Razor Views
---

The primary benefits of compiled views is improved performance by eliminating compile times of Razor views. They can also provide static compilation benefits by highlighting compile errors during development and can simplify deployment by avoiding the need to deploy any `*.cshtml` files as they end up pre-compiled in the containing Assembly.

### Install ServiceStack.Razor.BuildTask

To enable compiled razor views you need to add the [ServiceStack.Razor.BuildTask](https://www.nuget.org/packages/ServiceStack.Razor.BuildTask) NuGet Package to the project containing your Razor `*.cshtml` pages, i.e:

:::copy
`<PackageReference Include="ServiceStack.Razor.BuildTask" Version="5.*" />`
:::

This doesn't add any additional dlls to your project, instead it just sets the **BuildAction** to all `*.cshtml` pages to **Content** and registers an MSBuild task to your `.csproj` project file set to pre-compile razor views on every build.

### Register Compiled Assembly to RazorFormat Plugin

To register assemblies containing compiled razor views with Razor Format you just need to add it to RazorFormat.LoadFromAssemblies, e.g:

```csharp
Plugins.Add(new RazorFormat {
    LoadFromAssemblies = { typeof(RockstarsService).Assembly }
});
```

### Retains optimal development workflow

The Compiled Views support continues to retain a great development experience in [DebugMode](/debugging#debugmode) as all Razor Views are initially loaded from the Assembly but also continues to monitor the file system for modified views, automatically compiling and loading them on the fly so AppDomain reloads aren't required to see changes.

## Example Projects

### [Razor Rockstars](https://github.com/ServiceStackApps/RazorRockstars)

The [RazorRockstars.CompiledViews](https://github.com/ServiceStackApps/RazorRockstars/tree/master/src/RazorRockstars.CompiledViews) VS.NET project shows an example of [Razor Rockstars](https://razor.netcore.io/) which uses shared compiled Razor Views in a `.dll` in a number of different projects:

  - [WPF Host](https://github.com/ServiceStackApps/RazorRockstars/tree/master/src/RazorRockstars.CompiledViews.WpfHost)
  - [HttpListener SelfHost](https://github.com/ServiceStackApps/RazorRockstars/tree/master/src/RazorRockstars.CompiledViews.SelfHost)
  - [ASP.NET WebHost](https://github.com/ServiceStackApps/RazorRockstars/tree/master/src/RazorRockstars.CompiledViews.WebHost)

### [ServiceStack.Gap](https://github.com/ServiceStack/ServiceStack.Gap)

The [ServiceStack.Gap](https://github.com/ServiceStack/ServiceStack.Gap) project shows how to extend Compiled Razor Views and use them to create embedded ServiceStack solutions that can be ILMerged down to a single `.exe`. 


