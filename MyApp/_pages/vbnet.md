---
slug: vbnet
title: VB.NET Resources
---

There are some nostalgic developers who prefer not to leave their VB.NET days behind them, luckily they blog so other VB.NET developers can easily follow in their footsteps:

### VB .NET Core Project

You can create a new VB .NET Core project in a new empty directory using the [x dotnet tool](/dotnet-tool) with:

```bash
$ dotnet tool install --global x 
$ mkdir ProjectName && cd ProjectName
$ npx add-in init-vb
$ dotnet run
```

Which will download the [init-vb Gist](https://gist.github.com/gistlyn/88f2792fc4820de7dc4e68c0c5d76126) to your local directory 
where you can use its dep-free [/index.html](https://gist.github.com/gistlyn/88f2792fc4820de7dc4e68c0c5d76126#file-wwwroot-index-html) and its
`JsonServiceClient` to call its **/hello** API:

![](/img/pages/release-notes/v5.9/init.png)

### VB .NET Core Auth + File Uploads Example

The [vb-auth](https://github.com/NetCoreApps/vb-auth) VB.NET .NET Core project created with [x dotnet tool](/dotnet-tool):

```bash
$ mkdir ProjectName && cd ProjectName
$ npx add-in init-vb
```

Configured with [OrmLite + SQL Server](/ormlite/), 
[ServiceStack Auth](/auth/authentication-and-authorization) including Login & Registration UIs
& integrated [JWT Auth](/auth/jwt-authprovider) showing how to manage file uploads for authenticated users.

![](https://raw.githubusercontent.com/NetCoreApps/vb-auth/master/screenshot.png)

### Plain static HTML Pages + JavaScript UI

No client or server UI Frameworks or external dependencies were used in this example which uses only Vanilla JS and functionality in the 
[Embedded UMD @servicestack/client](/servicestack-client-umd).

E.g. the client HTML UI & Backend Service implementation for the Authenticated HTTP File Upload Management functionality is in:

 - [/wwwroot/files.html](https://github.com/NetCoreApps/vb-auth/blob/master/wwwroot/files.html) - static HTML UI
 - [/ServiceInterface/UploadServices.vb](https://github.com/NetCoreApps/vb-auth/blob/master/ServiceInterface/UploadServices.vb) - back-end Service

### JWT Auth

JWT Authentication is [enabled at authentication](/auth/jwt-authprovider#switching-existing-sites-to-jwt) where
the `UseTokenCookie` parameter directs ServiceStack to capture the Authenticated Session in a stateless JWT Session Cookie:

```html
<form action="/auth/credentials" method="post">
    <input type="hidden" name="UseTokenCookie" value="true" />
    ...
</form>
```

### TypeScript Generated DTOs

[TypeScript Add ServiceStack Reference](/typescript-add-servicestack-reference) were used to generate the 
Typed DTOs which can be re-generated with:

```bash
$ cd wwwroot
$ x ts && tsc dtos.ts
```

# Community Resources

<!-- Commenting out as all links are crusty and no longer working.
  - [How to set up a VB.Net REST service on ServiceStack](http://fafx.wordpress.com/2013/02/09/how-to-set-up-a-vb-net-rest-service-on-servicestack/) by [The FAfx Project](http://fafx.wordpress.com/)
  - [Servicestack, VB.Net and some easyhttp](http://blogs.lessthandot.com/index.php/DesktopDev/MSTech/VBNET/servicestack-vb-net-and-some) by [@chrissie1](https://twitter.com/chrissie1)
  - [Redis and VB.Net](http://blogs.lessthandot.com/index.php/DataMgmt/DBProgramming/redis-and-vb-net) by [@chrissie1](https://twitter.com/chrissie1)

-->
