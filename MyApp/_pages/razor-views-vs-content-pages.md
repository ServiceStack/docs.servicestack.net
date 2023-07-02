---
title: Razor Views vs Content Pages
slug: razor-views-vs-content-pages
---

In [ServiceStack][1]: 

  - Razor Pages that exist within the `/Views/` folder are called **View Pages**
  - Razor Pages that exist anywhere else are called **Content Pages**

The difference between them is that **View Pages** are Razor views that are used to provide the HTML representations (aka views) **for services** in much the same way View Pages work for MVC Controllers.

View Pages **cannot** be called directly, that's the role of **Content Pages**, which **can only** be called directly, i.e. outside the context of a service (or redirected to, from a service).

In [Razor Rockstars][2], examples of Content Pages include:

  - [/stars/dead/cobain/][3] which calls the [/stars/dead/Cobain/default.cshtml][4] Content Page
  - [/TypedModelNoController][5] which calls the [/TypedModelNoController.cshtml][6] Content Page

Whereas examples of **View Pages** include:

  - [/rockstars][7] which matches the `/rockstars` route on the [/RockstarsService.cs][8] and because of the `[DefaultView("Rockstars")]` attribute, uses the [/Rockstars.cshtml][9] **View Page**

## Default Pages

For **Content Pages** the `default.cshtml` is the index page for a folder. So to set a default page for the root `/` path, create a `/default.cshtml` page. An example of this is [/default.cshtml][10] home page used in the [Reusability][11] demo.

If you want to use a view page as the Home page, you can set the default redirect to it by adding the AppHost config:

```csharp
SetConfig(new HostConfig { 
    DefaultRedirectPath = "~/home"
});
```

Which would call a **service** matching the `/home` route that will use the most appropriate View Page based on the rules laid out in the [Razor Rockstars][12] page.


  [1]: http://www.servicestack.net/
  [2]: https://razor.netcore.io/
  [3]: https://razor.netcore.io/stars/dead/cobain/
  [4]: https://github.com/ServiceStack/RazorRockstars/blob/master/src/RazorRockstars.WebHost/stars/dead/Cobain/default.cshtml
  [5]: https://razor.netcore.io/TypedModelNoController
  [6]: https://github.com/ServiceStack/RazorRockstars/blob/master/src/RazorRockstars.WebHost/TypedModelNoController.cshtml
  [7]: https://razor.netcore.io/rockstars
  [8]: https://github.com/ServiceStack/RazorRockstars/blob/master/src/RazorRockstars.WebHost/RockstarsService.cs
  [9]: https://github.com/ServiceStack/RazorRockstars/blob/master/src/RazorRockstars.WebHost/Views/Rockstars.cshtml
  [10]: https://github.com/ServiceStack/ServiceStack.UseCases/blob/master/Reusability/default.cshtml
  [11]: https://github.com/ServiceStack/ServiceStack.UseCases/tree/master/Reusability
  [12]: https://razor.netcore.io/
