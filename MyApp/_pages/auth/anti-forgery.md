---
title: Anti Forgery
slug: anti-forgery
---

<doc-status status="legacy" title="ASP.NET MVC's AntiForgery API is .NET Framework only"
  text="This page covers ServiceStack validating ASP.NET MVC's AntiForgery token on .NET Framework. ASP.NET Core Apps use its own built-in antiforgery services instead."
  :links="[{ text:'Authentication Overview', href:'/auth/' }]"></doc-status>

<csrf-overview>
</csrf-overview>

You can leverage ASP.NET MVC's AntiForgery token support your Razor pages by embedding the token in your HTML Forms with:

## Example

```html
<form action="/antiforgery/test" method="POST">
    @Html.AntiForgeryToken()
    <input name="Field" value="Test"/>        
    <input type="submit"/>
</form>
```

Which you can then validate in your Service with:

```csharp
[Route("/antiforgery/test")]
public class AntiForgeryTest
{
    public string Field { get; set; }
}

public class AntiForgeryService : Service
{
    public object Any(AntiForgeryTest request)
    {
        AntiForgery.Validate();
        ...
    }
}
```

::: info
ASP.NET MVC's AntiForgery API is only available in the .NET Framework
:::
