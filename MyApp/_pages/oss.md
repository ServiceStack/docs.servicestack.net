---
slug: oss
title: FREE for OSS
---

ServiceStack's [AGPL/FLOSS Exception](https://github.com/ServiceStack/ServiceStack/blob/master/license.txt) allows free usage of ServiceStack's Source Code on GitHub in OSS projects without a commercial license.

### Linking to Source projects

In order to get the best source-based development experience using the latest version of ServiceStack in your Projects, clone the ServiceStack
Repos you want to use:

 - [ServiceStack/ServiceStack](https://github.com/ServiceStack/ServiceStack)
 - [ServiceStack/ServiceStack.Text](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Text/src/ServiceStack.Text)
 - [ServiceStack/ServiceStack.Redis](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Text/src/ServiceStack.Text)
 - [ServiceStack/ServiceStack.OrmLite](/ormlite/)
 - [ServiceStack/ServiceStack.Aws](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Aws)
 - [ServiceStack/ServiceStack.Azure](https://github.com/ServiceStack/ServiceStack.Azure)

Then reference the `*.Source.csproj` of each project you want to reference in your solution. 

This approach is used in our [Test.csproj](https://github.com/NetCoreApps/Test/blob/master/src/Test/Test.csproj) allowing us to debug directly into ServiceStack library source code just like any other project reference in our solution.

### Use Local Libraries

Each ServiceStack Repo has a `.sln` in its `/src` folder you can use to build all libraries in each repo. These libraries can be copied to a 
local lib folder and included as `.dll` references.

### Use Local NuGet packages

As each ServiceStack project is a standard `.csproj`, you can alternatively choose to build and reference NuGet packages instead:

    $ dotnet pack -c Release <project>.csproj

#### Use build.proj to generate all packages

Each repo has a `/build/build.proj` that can be run to generate all library NuGet packages in each repo, e.g:

    $ msbuild build.proj /property:Configuration=Release;MinorVersion=<MINOR>;PatchVersion=1

Which can be referenced as a [local Nuget package feed](https://docs.microsoft.com/en-us/nuget/hosting-packages/local-feeds).

### OSS License Key

OSS projects building from source can use the [OSS License Key](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.Text/tests/ServiceStack.Text.Tests/App.config#L4) below to allow unrestricted usage in their OSS projects:

```
1001-e1JlZjoxMDAxLE5hbWU6VGVzdCBCdXNpbmVzcyxUeXBlOkJ1c2luZXNzLEhhc2g6UHVNTVRPclhvT2ZIbjQ5MG5LZE1mUTd5RUMzQnBucTFEbTE3TDczVEF4QUNMT1FhNXJMOWkzVjFGL2ZkVTE3Q2pDNENqTkQyUktRWmhvUVBhYTBiekJGUUZ3ZE5aZHFDYm9hL3lydGlwUHI5K1JsaTBYbzNsUC85cjVJNHE5QVhldDN6QkE4aTlvdldrdTgyTk1relY2eis2dFFqTThYN2lmc0JveHgycFdjPSxFeHBpcnk6MjAxMy0wMS0wMX0=
```

Which can be registered using any of ServiceStack's [license registration options](https://servicestack.net/download#register).
