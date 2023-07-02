---
slug: html5reportformat
title: HTML5 JSON Report Format
---

These examples are simply links to existing ServiceStack web services, which based on your browsers user-agent (i.e. Accept: 'text/html') provides this HTML format instead of the other serialization formats.

| Northwind API    |                                                      |                                                           |
| ---------------- | ---------------------------------------------------- | --------------------------------------------------------- |
| All Customers    | [html](https://northwind.netcore.io/customers)       | [json](https://northwind.netcore.io/customers.json)       |
| Customer Details | [html](https://northwind.netcore.io/customers/ALFKI) | [json](https://northwind.netcore.io/customers/ALFKI.json) |
| Customer Orders  | [html](https://northwind.netcore.io/orders)          | [json](https://northwind.netcore.io/orders.json)          |

<div class="not-prose mt-8 flex items-center">
    <a class="block" href="https://northwind.netcore.io/customers/ALFKI.json">
        <img class="" src="/img/pages/formats/CustomerDetails-json.png">
    </a>
    <div class="flex flex-col items-center px-2 text-lg font-bold text-green-700">
      <div>JSON</div>
      <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M16.01 11H4v2h12.01v3L20 12l-3.99-4z"/></svg>
      <div>HTML</div>
    </div>
    <a class="block" href="https://northwind.netcore.io/customers/ALFKI">
        <img class="" src="/img/pages/formats/CustomerDetails-html.png">
    </a>
</div>


To see it in action, **view the source** in your browser. Webkit and Firefox users can simply go to the url below:

```
view-source:https://northwind.netcore.io/customers/ALFKI
```

Note: To view the web services in a different format simply append either **.{ext}** or **?format={ext}** to the query string, e.g:

```
/customers.json
/customers?format=[json|xml|html|csv|jsv]
```

## Lightweight Customizable HTML Templates

ServiceStack's auto HTML response pages can be overridden specific routes by populating `HtmlFormat.PathTemplates`
with a lightweight HTML template, e.g. the `/auth` page is pre-configured with:

```csharp
GetPlugin<HtmlFormat>.PathTemplates["/auth"] = "/Templates/Auth.html";
```

Specifying the **/path/info** to override and the **VirtualPath** of the static HTML page that should be returned instead.

That instead of the JSON HTML Dump of the `/auth` endpoint, now returns a static `.html` page to display the `AuthenticateResponse`
DTO in a beautified custom HTML view:

![](/img/pages/release-notes/v5.9/auth-page.png)

The static HTML templates will replace these variable placeholders which will allow you to render a custom view of service responses:

- `${Dto}` JSON Response DTO
- `${BaseUrl}` - `IRequest.GetBaseUrl()`
- `${ServiceUrl}` - Service URL

### [The Magic AutoGrid Partial](https://github.com/ServiceStackApps/HttpBenchmarks#the-magic-autogrid-partial)

[![Search Test Results](https://raw.githubusercontent.com/ServiceStack/HttpBenchmarks/master/src/BenchmarksAnalyzer/Content/img/search-filter.png)](https://github.com/ServiceStack/HttpBenchmarks/blob/master/src/BenchmarksAnalyzer/Views/SearchTestResults.cshtml)

A bootstrap themed version of HTML Format is also encapsulated within an [AutoGrid.cshtml](https://github.com/ServiceStack/HttpBenchmarks/blob/master/src/BenchmarksAnalyzer/Views/Shared/AutoGrid.cshtml)
partial which does the heavy lifting of converting any C# enumerable into a human optimized dynamic sortable datagrid with just 1 Line of Code:

```csharp
@Html.Partial("AutoGrid", Model.Results)
```

### Human Friendly output

The primary focus for the HTML Format is to provide a readable and semantic HTML layout letting you visualize all the data returned by your web service with a single glance.
Features include:

Based on convention, it generates a recursive and cascading view of your data using a combination of different sized definition lists and tables where appropriate.
After it's rendered convenience behaviour is applied allowing you to sort your tabular data, view the embedded JSON contents as well as providing links back to the original web service that generated the report including links to the other formats supported.

### Completely self-contained

The report does not have any external CSS, JavaScript or Images which also helps achieve its super-fast load-time and rendering speed.

### Embeds the complete snapshot of your web services data

The report embeds a complete, unaltered version of your 'JSON webservice' capturing a snapshot of the state of your data at a given point in time.
It's perfect for backups with the same document containing a human and programatic access to the data.
The JSON data is embedded inside a valid and well-formed document, making it programmatically accessible using a standard XML/HTML parser.
The report also includes an interface to allow humans to copy it from a textbox.

### It's Fast

Like the other web services, the HTML format is just a raw C# IHttpHandler using
[.NET's fastest JSON Serializer](http://www.servicestack.net/mythz_blog/?p=344)
to serialize the response DTO to a JSON string which is embedded inside a **static HTML string template**.
No other .aspx page or MVC web framework is used to get in the way to slow things down.
High performance JavaScript techniques are also used to start generating the report at the earliest possible time.

### Well supported in all modern browsers

It's tested and works equally well on the latest versions of Chrome, Firefox, Safari, Opera and IE9.
[v1.83](https://github.com/ServiceStack/ServiceStack/downloads) Now works in IE8 but needs internet connection to download json2.js. (not tested in <=IE7)

### It Validates (as reported by validator.w3.org)

This shouldn't be important but as the technique of using JavaScript to generate the entire report is likely to ire the semantic HTML police, I thought I'd make this point. Personally I believe this style of report is more useful since it caters for both human and scripted clients.

# How it works - 'view-source' reveals all :)

This is a new type of HTML5 report that breaks the normal conventional techniques of generating a HTML page.
Instead of using a server programming and template language to generate the HTML on the server, the data is simply embedded as JSON, unaltered inside the tag:

```xml
<script id="dto" type="text/json">{jsondto}</script>
```

Because of the browser behaviour of the script tag, you can embed any markup or javascript unescaped.
Unless it has none or a 'javascript' type attribute, the browser doesn't execute it letting you to access the contents with:

```js
document.getElementById("dto").innerHTML;
```

From there, javascript invoked just before the closing body tag (i.e. the fastest time to run DOM-altering javascript) which takes the data,
builds up a html string and injects the generated markup in the contents of the page.

After the report is rendered, and because JavaScript can :) UX-friendly behaviours are applied to the document allowing the user to sort the table data on each column as well as providing an easy way to take a copy of the JSON datasource.

For what it does, the JavaScript is very terse considering no JavaScript framework was used. In most cases the JSON payload is a lot larger than the entire JavaScript used to render the report :)

### Advantages of a strong-typed, code-first web service framework

Although hard to believe, most of the above web service examples were developed before ServiceStack's CSV and HTML format existed.
No code-changes were required in order to take advantage of the new formats, they were automatically available after replacing the ServiceStack.dlls with the latest version (v1.81+)

Being able to generically provide new features like this shows the advantage of ServiceStack's strong-typed, code-first approach to developing web services that lets you focus on your app-specific logic as you only need to return C#/.NET objects or throw C#/.NET exceptions which gets automatically handled, and hosted on a number of different endpoints in a variety of different formats.

Out of the box REST, RPC and SOAP endpoints types are automatically provided, in JSON, XML, CSV, JSV and now the new HTML report format above.

### Disable Auto HTML Pages

ServiceStack's fallback [Auto HTML Report Pages](/html5reportformat) can be disabled with:

```csharp
SetConfig(new HostConfig {
    EnableAutoHtmlResponses = false
})
```

When disabled it will render Response DTOs from Browser requests (i.e. `Accept:text/html`) in the next `Config.PreferredContentTypes` - (JSON by default).
