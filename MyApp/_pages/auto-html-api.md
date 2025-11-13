---
title: Auto HTML API Page
---

The Auto HTML Page provides instant utility for API consumers in consuming your APIs with a built-in API Response Visualizer, JSON syntax highlighting, integrated Postman-like UI and API SDK integration all-in-one.

<div class="not-prose hide-title my-16 px-4 sm:px-6">
    <div class="text-center">
        <h3 id="autohtml" class="text-4xl sm:text-5xl md:text-6xl tracking-tight font-extrabold text-gray-900">
            Auto HTML API
        </h3>
    </div>
    <p class="mx-auto mt-5 max-w-prose text-xl text-gray-500"> The best way to visualize, inspect and integrate with your APIs in an instant!</p>
    <div class="my-8">
        <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="3gjisRVqhLo" style="background-image: url('https://img.youtube.com/vi/3gjisRVqhLo/maxresdefault.jpg')"></lite-youtube>
    </div>
</div>

Lets take a quick tour through each of these features:

## PREVIEW

Calling our APIs in a browser will greet us with the Preview page which uses the [HtmlFormat](/vue/formats#htmlformat) to display the API response in a
beautiful Tailwind style with links to different [Content-Type Formats](/formats) and direct links to view it in [API Explorer](/api-explorer) and [Locode](/locode/) for [AutoQuery](/autoquery/rdbms) APIs:

<a href="https://northwind.netcore.io/customers/ALFKI" class="not-prose max-w-4xl">
    <div class="block flex justify-center shadow hover:shadow-lg rounded">
        <img class="" src="/img/pages/ui/autohtml-preview.png">
    </div>
</a>

## JSON

Developers who wish to view the actual JSON API Response can click on the **JSON** tab to view the JSON in pretty-formatted syntax-highlighted form with a 1-click button to copy:

<a href="https://northwind.netcore.io/customers/ALFKI?tab=json" class="not-prose max-w-4xl">
    <div class="block flex justify-center shadow hover:shadow-lg rounded">
        <img class="" src="/img/pages/ui/autohtml-json.png">
    </div>
</a>

## FORM

You don't need to build UIs before non-developers can access your APIs with the **FORM** tab which uses the new [AutoForm](/vue/autoform) component
to render an optimal UI to call an API that you can further customize from your C# Request DTOs:

<a href="https://blazor-gallery.servicestack.net/bookings/1?tab=form" class="not-prose max-w-4xl">
    <div class="block flex justify-center shadow hover:shadow-lg rounded">
        <img class="" src="/img/pages/ui/autohtml-form-bookings.png">
    </div>
</a>

## CODE

The **CODE** tab gives you an appealing API docs page you can immediately share with any 3rd Party Developers that want to consume your APIs, with simple
step-by-step instructions for how to call your APIs from their preferred programming language:

<a href="https://northwind.netcore.io/customers/ALFKI?tab=code" class="not-prose max-w-4xl">
    <div class="block flex justify-center shadow hover:shadow-lg rounded">
        <img class="" src="/img/pages/ui/autohtml-code.png">
    </div>
</a>

A nice benefit of ServiceStack's API Design is that consuming APIs are fundamentally all done the same way in all languages, which just requires adding a 
dependency containing a generic ServiceClient which can be used to call any ServiceStack API using the typed DTOs copied directly from the API docs page
to enable an end-to-end typed API without any external tooling or build steps.

## Overriding Auto HTML API

Like most of ServiceStack's built-in UIs, the Auto HTML API can be customized the same way by providing a local 
[HtmlFormat.html](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack/Templates/HtmlFormat.html)
at the same path in your AppHost Project's `/wwwroot/Templates` folder:

```files
/wwwroot/Templates
  HtmlFormat.html
```

## API Fallback HTML Page

The Auto HTML API is the fallback HTML page returned for APIs when calling user-defined routes from a browser (i.e. **Accept: text/html**):

### [/bookings/1](https://blazor-vue.web-templates.io/bookings/1)

When calling the [/api pre-defined route](/routing#json-api-pre-defined-route) with the `.html` extension:

### [/api/QueryBookings.html?Id=1](https://blazor-vue.web-templates.io/api/QueryBookings.html?Id=1)

When calling the [/api pre-defined route](/routing#json-api-pre-defined-route) with `?format=html`:

### [/api/QueryBookings?Id=1&format=html](https://blazor-vue.web-templates.io/api/QueryBookings?Id=1&format=html)
