---
title: ServiceStack Mono Repo
---

All active ServiceStack libraries and NuGet packages are now being developed and maintained in ServiceStack's mono repo:

<a class="block my-8 font-medium text-center text-2xl" href="https://github.com/ServiceStack/ServiceStack">github.com/ServiceStack/ServiceStack</a>

The new Mono repo has greatly simplified all maintenance efforts around ServiceStack's code base, including building, contributing and debugging, where there's now only 1 repo that needs to be checked out to make changes to any ServiceStack package.

### Mono repo project structure

Whilst all projects are contained within the same repo, they continue to be independently maintained in isolated top-level solution folders, containing only the references and test projects each need:

- [/ServiceStack](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack)
- [/ServiceStack.Text](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Text)
- [/ServiceStack.OrmLite](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.OrmLite)
- [/ServiceStack.Redis](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Redis)
- [/ServiceStack.Aws](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Aws)
- [/ServiceStack.Azure](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Azure)
- [/ServiceStack.Blazor](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Blazor)
- [/ServiceStack.Stripe](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Stripe)
- [/ServiceStack.Logging](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Logging)

All top-level solutions follow the same uniform project structure which require no other external build tools or scripts other than a default VS .NET install, you can open the **.sln** in each folder and start utilizing projects immediately.

### Debugging ServiceStack

It also dramatically improves the debuggability of ServiceStack source code from your App where you can choose to replace binary package references with source project references. Or for small projects, a simpler alternative is to attach your projects to the main [ServiceStack.sln](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack/src) where most ServiceStack projects are readably available for quick reference.

### Building All ServiceStack Projects

Building all projects have also been simplified and can be run locally in both Windows and Unix platforms with the scripts below:

 - [build-all.bat](https://github.com/ServiceStack/ServiceStack/blob/main/build/build-all.bat)
 - [build-all.sh](https://github.com/ServiceStack/ServiceStack/blob/main/build/build-all.sh)

Which runs the **build.proj** MS Build task in the `/build` folder of each top-level project. The difference between **build.proj** vs the **.sln** is that **build.proj** only builds the library projects deployed to NuGet which it locally copies into a `/NuGet` folder for easy access to locally modified packages.

### Preserved source code links

We've fortuitously been able to benefit from GitHub's [renaming of their main branch](https://github.com/github/renaming/) since all our repos were created before the change which allowed us to keep the existing structure in the earlier **master** branch untouched, preserving existing links whilst the new mono repo structure has been added in the new **main** branch which has now been switched over and become the **default** branch.

### Switching to main branch

If you've previously checked out [github.com/ServiceStack/ServiceStack](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack) you will need to change the **origin** branch to use **main** however for simplicity we'd recommend performing a clean checkout. You can also delete all other ServiceStack repos which are no longer maintained.

### Why?

After dropping v4.5 .NET Framework support, deleting platform specific .NET 4.5 implementations & removing legacy projects in our last major [v6 Release](/releases/v6#breaking-changes), we continued embarking on a journey to improve the health and approachability of our code base which up to this point was maintained across multiple repos, each encapsulating a stand-alone library that can be used independently. To enable much of its high level functionality the libraries make usage of core functionality in ServiceStack's common libraries. 

#### Poor cross dependency support

Actively developing cross-repo dependencies has always been a source of friction where previously to debug and maintain changes across all packages we've had to maintain parallel `*.Source.csproj` for each project that used Project Source references instead of binary references which needed to be checked out and maintained in a separate physical location since .NET doesn't properly handle multiple `.csproj's` in the same folder. We were hoping support for source references for development and binary references for release would improve in time, however we gave up on this ever improving when the .NET team moved to a mono repo themselves.

### Legacy Branches and Releases

For preservation should you need to make changes to support Legacy applications we've included direct links to the previous states of ServiceStack code bases before the migration to its Mono repo:

| fx45 branch | v5.14 | v6.0.2 | master |
|------------ | ----- | ------ | ------ |
| [ServiceStack](https://github.com/ServiceStack/ServiceStack/tree/fx45)                 | [v5.14 Release](https://github.com/ServiceStack/ServiceStack/releases/tag/v5.14)         | [v6.0.2 Release](https://github.com/ServiceStack/ServiceStack/releases/tag/v6.0.2)         | [master](https://github.com/ServiceStack/ServiceStack/tree/master)         |
| [ServiceStack.Text](https://github.com/ServiceStack/ServiceStack.Text/tree/fx45)       | [v5.14 Release](https://github.com/ServiceStack/ServiceStack.Text/releases/tag/v5.14)    | [v6.0.2 Release](https://github.com/ServiceStack/ServiceStack.Text/releases/tag/v6.0.2)    | [master](https://github.com/ServiceStack/ServiceStack.Text/tree/master)    |
| [ServiceStack.Redis](https://github.com/ServiceStack/ServiceStack.Redis/tree/fx45)     | [v5.14 Release](https://github.com/ServiceStack/ServiceStack.Redis/releases/tag/v5.14)   | [v6.0.2 Release](https://github.com/ServiceStack/ServiceStack.Redis/releases/tag/v6.0.2)   | [master](https://github.com/ServiceStack/ServiceStack.Redis/tree/master)   |
| [ServiceStack.OrmLite](https://github.com/ServiceStack/ServiceStack.OrmLite/tree/fx45) | [v5.14 Release](https://github.com/ServiceStack/ServiceStack.OrmLite/releases/tag/v5.14) | [v6.0.2 Release](https://github.com/ServiceStack/ServiceStack.OrmLite/releases/tag/v6.0.2) | [master](https://github.com/ServiceStack/ServiceStack.OrmLite/tree/master) |
| [ServiceStack.Aws](https://github.com/ServiceStack/ServiceStack.Aws/tree/fx45)         | [v5.14 Release](https://github.com/ServiceStack/ServiceStack.Aws/releases/tag/v5.14)     | [v6.0.2 Release](https://github.com/ServiceStack/ServiceStack.Aws/releases/tag/v6.0.2)     | [master](https://github.com/ServiceStack/ServiceStack.Aws/tree/master)     |
| [ServiceStack.Azure](https://github.com/ServiceStack/ServiceStack.Azure/tree/fx45)     | [v5.14 Release](https://github.com/ServiceStack/ServiceStack.Azure/releases/tag/v5.14)   | [v6.0.2 Release](https://github.com/ServiceStack/ServiceStack.Azure/releases/tag/v6.0.2)   | [master](https://github.com/ServiceStack/ServiceStack.Azure/tree/master)   |
| [ServiceStack.Admin](https://github.com/ServiceStack/Admin/tree/fx45)                  | [v5.14 Release](https://github.com/ServiceStack/Admin/releases/tag/v5.14)                | [v6.0.2 Release](https://github.com/ServiceStack/Admin/releases/tag/v6.0.2)                | [master](https://github.com/ServiceStack/Admin/tree/master)                |
| [ServiceStack.Stripe](https://github.com/ServiceStack/Stripe/tree/fx45)                | [v5.14 Release](https://github.com/ServiceStack/Stripe/releases/tag/v5.14)               | [v6.0.2 Release](https://github.com/ServiceStack/Stripe/releases/tag/v6.0.2)               | [master](https://github.com/ServiceStack/Stripe/tree/master)               |
| [ServiceStack.CefGlue](https://github.com/ServiceStack/ServiceStack.CefGlue/tree/fx45) | [v5.14 Release](https://github.com/ServiceStack/ServiceStack.CefGlue/releases/tag/v5.14) | [v6.0.2 Release](https://github.com/ServiceStack/ServiceStack.CefGlue/releases/tag/v6.0.2) | [master](https://github.com/ServiceStack/ServiceStack.CefGlue/tree/master) |


- **fx45** branch contains the state of ServiceStack before support for v4.5 .NET Framework & legacy projects was removed
- **v5.14** contains the source code for the last v4.5 .NET Framework release published to NuGet
- **v6.0.2** contains the source code for the last NuGet release before moving to the Mono Repo
- **master** branch contains the source code before moving to the master branch

Currently **fx45** is effectively equivalent to **v5.14** release and **master** equivalent to **v6.0.2** release, but can change in time if new fixes to legacy projects are contributed.