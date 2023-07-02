---
slug: view-and-template-selection
title: View & Template Selection
---

ServiceStack provides multiple ways to select the Razor View that will be used to render your services response with. First if the `IHttpRequest.Items["View"]` has been set [via any Global, Request, Response or Action Filter](/order-of-operations) it will use that, otherwise the fallback convention is to use the view with the same name as the **Request DTO** followed finally by one with the **Response DTO** name.

To illustrate this, the below service is overloaded with different ways to select a Razor View, each are assigned a priority number starting from `#1`:

```csharp
[ClientCanSwapTemplates]        // #4 Client can select with ?view=UserSpecified4
[DefaultView("DevSpecified3")]  // #3 
public class RockstarsService : Service 
{
    [DefaultView("DevSpecified2")]        // #2 
    public object Get(Rockstars5 request) // #5
    {
        return new HttpResult(new RockstarsResponse6()) // #6
        {
            View = "DevSpecified1"  // #1
        }
    }
}
```

The above service selects views that are mapped to the below Razor views. The folder structure is inconsequential so Views can be organized and nested in any number of folders, e.g:

```
/Views
    /Any
        /Nested
            /Deep
                DevSpecified1.cshtml       // #1
                DevSpecified2.cshtml       // #2
                DevSpecified3.cshtml       // #3
                UserSpecified4.cshtml      // #4
                Rockstars5.cshtml          // #5
                RockstarsResponse6.cshtml  // #6
    /Shared
        _Layout.cshtml
```

The `DevSpecified1.cshtml` would be selected first because it is last to set the `IHttpRequest.Items["View"]` property that the Razor Format uses to select the view. You're also not limited to these options as you can easily set the same property in any of your own custom filters. 

E.g. this is the entire source code of the [ClientCanSwapTemplates Attribute](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.ServiceInterface/ClientCanSwapTemplatesAttribute.cs) which once enabled lets the client to specify the view via HTTP Header, QueryString, FormData or Cookies (in that order):

```csharp
public class ClientCanSwapTemplatesAttribute : ResponseFilterAttribute
{
    public override void Execute(IHttpRequest req, IHttpResponse res, object requestDto)
    {
        req.Items["View"] = req.GetParam("View");
        req.Items["Template"] = req.GetParam("Template");
    }
}
```

The last filter to set `req.Items["View"]` wins.

### Layout Templates

Although the above example only shows how to select the View (e.g. Page Body), the exact same rules applies to select the Layout template via the **Template** field also on the HttpResult and DefaultView attribute. If a template is not specified the default `/Shared/_Layout.cshtml` is used.

## Executing Razor in Code

The `RazorFormat` plugin provides several APIs which lets you access Razor views independently from ServiceStack, e.g:

```csharp
var razorFormat = HostContext.GetPlugin<RazorFormat>();
var razorView = razorFormat.GetViewPage("MyView"); //e.g. /Views/MyView.cshtml
var html = razorFormat.RenderToHtml(razorView, dto);
```

### Creating Pages at Runtime

For views that don't exist you can use the `CreatePage()` API to dynamically create a Razor View from a dynamic string at runtime that can be later reused to generate HTML for multiple models:

```csharp
var razorView = razorFormat.CreatePage("<h3>Hello @Model.name, the year is @DateTime.Now.Year</h3>");
var htmlFoo = razorFormat.RenderToHtml(razorView, new { name = "foo" });
var htmlBar = razorFormat.RenderToHtml(razorView, new { name = "bar" });
```

Or if you don't need to reuse the page again, it can be done in 1-line with:

```csharp
var html = razorFormat.CreateAndRenderToHtml("<h3>Hello @Model.name</h3>", model: new { name = "foo" });
```

## Debuggable Razor Views

Razor Views are now debuggable for 
[Debug builds](/debugging#debugmode) by default, it can also be explicitly specified on:

```csharp
Plugins.Add(new RazorFormat {
    IncludeDebugInformation = true,
    CompileFilter = compileParams => ...
})
```

The `CompileFilter` is an advanced option that lets modify the `CompilerParameters` used by the C# CodeDom provider to compile the Razor Views if needed. 

