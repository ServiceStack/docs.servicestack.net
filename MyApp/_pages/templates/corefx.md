---
title: Run ASP.NET Core Apps on the .NET Framework
slug: templates-corefx
---

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/web.png)

### Status of ASP.NET Core on .NET Framework

The last important Microsoft announcement concerning the future of ASP.NET Core 2.1 was that it would stop supporting 
[new versions of ASP.NET Core on the .NET Framework](https://github.com/aspnet/AspNetCore/issues/3753).
Whilst we disagreed against this decision which would've put out a large class of the existing ecosystems from participating 
in the new ASP.NET Core development model and many from staged migrations to .NET Core from commencing, we're happy to see 
[ASP.NET Core 2.1 LTS will enjoy the same indefinite level of support](https://github.com/aspnet/AspNetCore/issues/3753#issuecomment-438046364)
as the rest of the .NET Framework - which should come as great news to the 1/3 of our Customers who are still creating new 
[ASP.NET Core on FX Project Templates](https://github.com/NetFrameworkCoreTemplates).

Whilst this announcement sends a clear message that new development on .NET Framework has effectively been put on product life support, 
**ASP.NET Core 2.1 LTS** is still a great rock-solid platform to build on if you're unable to jump directly to **.NET Core** immediately or 
if you want to get off .NET Core's major version release train and build upon a stable LTS platform.

### ASP.NET Core - still our top recommendation for .NET Framework

If you need to stay on the .NET Framework, we'd still recommend using the newer **ASP.NET Core 2.1** over classic **ASP.NET System.Web** projects
as it's cleaner, lighter, more flexible and future proof. Unlike Microsoft web frameworks, ServiceStack is a **single code-base** which 
supports running on [multiple platforms](/why-servicestack#multiple-hosting-options) so your ServiceStack Services can enjoy near perfect 
source-code compatibility when and if you choose to **move to .NET Core** in future.

Whilst Microsoft is stopping new development of ASP.NET Core on .NET Framework, we're not, our supported packages have standardized to
multi-target both **.NET v4.5+** and **.NET Standard 2.0** which is supported natively on **ASP.NET Core 2.1**.

### Future proofed and continually developed

This includes our own innovations that we continue to invest in like [#Script](https://sharpscript.net) (fka ServiceStack Templates) naturally support 
.NET Framework and .NET Core and runs everywhere ServiceStack does including within [classic ASP.NET MVC Controllers](https://sharpscript.net/docs/mvc-netcore)
which wasn't a design goal but was a natural consequence of developing clean libraries without external dependencies or reliance on external tooling.

This is to say that **ASP.NET Core 2.1 LTS** is still a fantastic rock-solid platform to run your .NET Framework workloads when you need to
which will continue to receive enhancements and new features with each ServiceStack release courtesy of being derived from the same 
shared code-base which will enable seamless migrations to .NET Core should you wish to in future.

#### Start from pre-configured Project Templates

Ultimately you'll miss out on niceties like the [Microsoft.AspNetCore.App](https://www.nuget.org/packages/Microsoft.AspNetCore.App)
meta-package, as a result we recommend starting from one of our [ASP.NET Core Framework project Templates](https://github.com/NetFrameworkCoreTemplates) 
which by convention all have the `-corefx` suffix: 

<WebNewCorefxMd></WebNewCorefxMd>

#### Usage

This will let you create an ASP.NET Core App running on the .NET Framework v4.7 using [web new](/web-new) with:

```bash
$ dotnet tool install --global web 

$ x new web-corefx AcmeNetFx
```

Which can then be opened in your preferred VS.NET or Project Rider C# IDE.

### Reference .Core packages

The primary difference between ASP.NET Core Apps on **.NET Core 2.1** vs **.NET Framework** is needing to reference the `.Core` packages to force referencing ServiceStack **.NET Standard 2.0** libraries, which otherwise when installed in a .NET Framework project would install `net45` libraries. The differences between the 2 builds include:

  - `net45` - Contains support for running **ASP.NET** Web or Self-Hosting **HttpListener** App Hosts
  - `netstandard2.0` - Contains support for only running on **ASP.NET Core** App Hosts

In order to run ASP.NET Core Apps on the .NET Framework it needs to only reference `.Core` NuGet packages which contains only the **.NET Standard 2.0** builds. Currently the list of `.Core` packages which contains only **.NET Standard 2.0** builds include:

 - ServiceStack.Text.Core
 - ServiceStack.Interfaces.Core
 - ServiceStack.Client.Core
 - ServiceStack.HttpClient.Core
 - ServiceStack.Core
 - ServiceStack.Common.Core
 - ServiceStack.Mvc.Core
 - ServiceStack.Server.Core
 - ServiceStack.Redis.Core
 - ServiceStack.OrmLite.Core
 - ServiceStack.OrmLite.Sqlite.Core
 - ServiceStack.OrmLite.SqlServer.Core
 - ServiceStack.OrmLite.PostgreSQL.Core
 - ServiceStack.OrmLite.MySql.Core
 - ServiceStack.OrmLite.MySqlConnector.Core
 - ServiceStack.Aws.Core
 - ServiceStack.Azure.Core
 - ServiceStack.RabbitMq.Core
 - ServiceStack.Api.OpenApi.Core
 - ServiceStack.Admin.Core
 - ServiceStack.Stripe.Core
 - ServiceStack.Logging.Log4Net.Core
 - ServiceStack.Logging.NLog.Core
 - ServiceStack.Kestrel.Core

::: warning
Ultimately support for whether a **.NET Standard 2.0** library will run on the .NET Framework depends on whether external dependencies also support this scenario which as it's a more niche use-case, will be a less tested scenario
:::

## Troubleshooting

### Resolving Runtime Assembly Loading Issues

Many of Microsoft's core **.NET Standard 2.0** packages have been reported to have runtime Assembly loading issues 
that throw `FileNotFoundException` "Could not load file or assembly ..." Exceptions in .NET Framework projects, including:

 - `System.Runtime`
 - `System.Runtime.CompilerServices.Unsafe`
 - `System.Runtime.InteropServices.RuntimeInformation`
 - `System.Memory`
 - `System.Buffers`
 - `System.Numerics.Vectors`
 - `netstandard`

Some solutions that have been known to resolve these issues include:

 1. Adding the package, e.g. `System.Runtime.CompilerServices.Unsafe` reference directly on the Host project,
[for netstandard](https://github.com/dotnet/standard/issues/328#issuecomment-299577190) the package is [NETStandard.Library.NETFramework](https://www.nuget.org/packages/NETStandard.Library.NETFramework) or installing .NET Core 2.0 SDK.
 2. Manually Adding Binding Redirect, see:
   - [System.Runtime](https://stackoverflow.com/a/52250140/85785)
   - [System.Runtime.CompilerServices.Unsafe](https://stackoverflow.com/a/55329952/85785)
   - [System.Runtime.InteropServices.RuntimeInformation](https://stackoverflow.com/a/52637120/85785)
   - [System.Numerics.Vectors](https://github.com/dotnet/corefx/issues/30106#issuecomment-395248278)
   - [System.Net.Http](https://stackoverflow.com/a/48867478/85785)
 3. [Install the missing .dll into the GAC](https://stackoverflow.com/a/62770487/85785)
 4. If you had an existing binding redirect, try removing it
 5. Adding `<AutoGenerateBindingRedirects>true</autoquery/autogenerateBindingRedirects>` to your project's .csproj 
 6. Uninstalling and Reinstalling the problem packages from your projects
 7. Clean Solution and remove project artifacts, including Nuget `/packages` and project `/bin` and `/obj` folders
 8. Upgrading to the latest version of the .NET Framework (v4.7.2+)

Many of these issues is the result of [older .NET Frameworks like .NET v4.6.1](https://github.com/dotnet/standard/issues/481)
not properly supporting .NET Standard 2.0 which is mostly resolved by installing .NET Framework v4.7.1+.

