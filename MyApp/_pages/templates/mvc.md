---
title: MVC Project Templates
---

All ServiceStack Projects can be created from ServiceStack's Start Page:

<div class="not-prose">
<h3 class="m-0 py-8 text-4xl text-center text-blue-600"><a href="https://servicestack.net/start">servicestack.net/start</a></h3>
</div>

Or using the .NET [x dotnet tool](/dotnet-new):

:::sh
dotnet tool install --global x
:::


## mvc

.NET 6.0 MVC Website with ServiceStack APIs

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/mvc.png)](https://github.com/NetCoreTemplates/mvc)

:::sh
x new mvc ProjectName
:::

## MVC with Integrated Auth

### mvcauth

.NET 6.0 MVC Website integrated with ServiceStack Auth

[![](/img/pages/auth/signin/mvcauth.png)](https://github.com/NetCoreTemplates/mvcauth)

:::sh
x new mvcauth ProjectName
:::

::: tip
Learn about [using ServiceStack Auth in MVC](/auth/identity-servicestack)
:::


### mvcidentityserver

.NET 6.0 MVC Website integrated with ServiceStack using IdentityServer4 Auth

[![](/img/pages/auth/signin/mvcidentityserver.png)](https://github.com/NetCoreTemplates/mvcidentityserver)

:::sh
x new mvcidentityserver ProjectName
:::

::: tip
Learn about [using IdentityServer4 Auth in ServiceStack](/auth/identity-aspnet)
:::
