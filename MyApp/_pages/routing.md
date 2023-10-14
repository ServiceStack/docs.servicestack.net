---
slug: routing
title: Routing
---

## Pre-defined Routes

Without any configuration required, ServiceStack already includes [pre-defined routes](/routing#pre-defined-routes) for all services in the format:

    /api?/[xml|json|html|jsv|csv]/[reply|oneway]/[servicename]

> servicename is the name of the Request DTO

e.g. the pre-defined url to call a JSON 'Hello' Service is:

```
/json/reply/hello
```

#### [Auto Batched Requests](/auto-batched-requests)

```
/json/reply/Hello[]
```

### SOAP Web Service urls

```
/api?/[soap11|soap12]
```

## JSON /api pre-defined route

Over the last decade [JSON](https://www.json.org/json-en.html) has stood out and become more popular than all others combined, where it's the lingua franca for calling APIs in Web Apps and what our [Add ServiceStack Reference](/add-servicestack-reference) ecosystem of languages relies on. Due to its overwhelming dominance for usage in APIs we've decided to elevate its status and give it a pre-defined route of its very own at:

<div class="not-prose">
<h3 class="text-4xl text-center text-indigo-800 pb-3">/api/{Request}</h3>
</div>

This simple convention makes it easy to remember the route new APIs are immediately available on & pairs nicely with [API Explorer's](/api-explorer):

<div class="not-prose">
<h3 class="text-4xl text-center text-indigo-800 pb-3">/ui/{Request}</h3>
</div>

### Benefits in Jamstack Apps

The `/api` route is particularly useful in Jamstack Apps as the 2 ways to call back-end APIs from decoupled UIs hosted on CDNs is to make CORS requests which doesn't send pre-flight CORS requests for [Simple Browser requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests). As such, we can improve the latency of **GET** and **POST** API Requests by configuring our `JsonServiceClient` to use `/api` and to not send the `Content-Type: application/json` HTTP Header which isn't necessary for `/api` requests which always expects and returns JSON:

### Configuring in TypeScript

```ts
export const client = new JsonServiceClient(API_URL).apply(c => {
    c.basePath = "/api"
    c.headers = new Headers() //avoid pre-flight CORS requests
})
```

It also benefits the **alternative method** to CORS in only needing to define a **single reverse proxy rule** on the CDN host to proxy all API requests to downstream back-end servers.

#### Configuring in .NET

No configuration is necessary for the new **.NET 6+** [JsonApiClient](#jsonapiclient) that's pre-configured to use `/api` fallback by default:

```csharp
var client = new JsonApiClient(baseUri);
```

All .NET Clients use any **matching user-defined routes** defined on the Request DTO with the existing Service Clients falling back to `/json/[reply|oneway]` if none exist who can be configured to use the `/api` fallback with:

```csharp
var client = new JsonServiceClient(baseUri) {
    UseBasePath = "/api"
};
var client = new JsonHttpClient(baseUri) {
    UseBasePath = "/api"
};
```

### Multiple Content Types

The JSON API Route also supports returning API responses in multiple [registered content types](/formats) by using its format extension, e.g:

<h3 class="text-4xl text-center text-indigo-800 pb-3">/api/{Request}.{ext}</h3>

 - `/api/{Request}.csv`
 - `/api/{Request}.xml`
 - `/api/{Request}.jsv`
 - `/api/{Request}.html`
 

### ApiHandlers

Using the new [ApiHandlers](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/ApiHandlers.cs), the code to enable the new `/api` pre-defined route is just:

```csharp
RawHttpHandlers.Add(ApiHandlers.Json("/api/{Request}"));
```

`ApiHandlers` is a simpler wrapper that registers a Raw HttpHandler delegating all matching requests to a `GenericHandler` configured with that Mime Type and includes typed overloads for each built-in data format. 

So you could also define a new pre-defined route at `/excel/*` with:

```csharp
RawHttpHandlers.Add(ApiHandlers.Csv("/excel/{Request}"));
```

Where it can now be used to download any APIs response in a `*.csv` file.

### Disable API Route

To avoid potential conflicts `/api` isn't registered if your AppHost configures its own Custom BasePath, or can be explicitly disabled with:

```csharp
ConfigurePlugin<PredefinedRoutesFeature>(feature => feature.JsonApiRoute = null);
```


## Custom Routes

In its most basic form, a Route is just any string literal attributed on your Request DTO:

```csharp
[Route("/hello")]
public class Hello { ... }
```

which matches: 

```
/hello
/hello?Name=XXX
```

### Variable place-holders

Routes can also have variable place-holders:

```csharp
[Route("/hello/{Name}")]
```

matches:

```
/hello/foo
```

And will populate the public property **Name** on the Request DTO with **foo**.

::: info
The QueryString, FormData and HTTP Request Body isn't apart of the Route (i.e. only the /path/info is) but they can all be used in addition to every web service call to further populate the Request DTO.
:::

### Wildcard paths

Using a route with a wild card path like:

```csharp
[Route("/hello/{Name*}")]
```

matches any number of variable paths:

```
/hello
/hello/name
/hello/my/name/is/ServiceStack    //Name = my/name/is/ServiceStack
```

[Another good use-case for when to use wildcard routes](http://stackoverflow.com/questions/7780157/multiple-optional-parameters-with-servicestack-net).

### Fallback Route

Use the `FallbackRoute` attribute to specify a fallback route starting from the root path, e.g:

```csharp
[FallbackRoute("/{Path}")]
public class Fallback
{
    public string Path { get; set; }
}
```

This will match any unmatched route from the root path (e.g. `/foo` but not `/foo/bar`) that's not handled by CatchAll Handler or matches a static file. You can also specify a wildcard path e.g. `[FallbackRoute("/{Path*}")]` which will handle every unmatched route (inc. `/foo/bar`). Only 1 fallback route is allowed.

The Fallback route is useful for HTML5 Single Page App websites handling server requests of HTML5 pushState pretty urls, e.g. All
[Single Page Apps Templates](/templates/single-page-apps) use the `[FallbackRoute]` to return the home page for all HTML Requests that
do not have Server Routes, e.g [MyServices.cs](https://github.com/NetCoreTemplates/vue-spa/blob/master/MyApp.ServiceInterface/MyServices.cs):

```csharp
[FallbackRoute("/{PathInfo*}", Matches="AcceptsHtml")]
public class FallbackForClientRoutes
{
    public string PathInfo { get; set; }
}

public class MyServices : Service
{
    //Return index.html for unmatched requests so routing is handled on client
    public object Any(FallbackForClientRoutes request) => Request.GetPageResult("/");
}
```

Which will returns the the default `index.html` page using [#Script Pages](https://sharpscript.net/docs/script-pages).

#### SPA Fallback

This popular behavior is also available using the more convenient configuration (used in all [SPA Project Templates](/templates/dotnet-new)) with:

```csharp
Plugins.Add(new SharpPagesFeature {
    EnableSpaFallback = true
}); 
```

#### Other Fallback Examples

Examples of other HTML Fallback Response:

```csharp
//Return static HTML file
return new HttpResult(VirtualFileSources.GetFile("index.html"));

//Return HTML String
return new HttpResult(VirtualFileSources.GetFile("index.html").ReadAllText());

//Return ServiceStack.Razor View
return new HttpResult(request)
{
    View = "/default.cshtml"
};
```

### Limiting to HTTP Verbs

If not specified Routes will match **All** HTTP Verbs. You can also limit Routes to individual Verbs, this lets you route the same path to different services, e.g:

```csharp
[Route("/contacts", "GET")]
[Route("/contacts/{Id}", "GET")]
public class GetContacts { ... }

[Route("/contacts", "POST PUT")]
[Route("/contacts/{Id}", "POST PUT")]
public class UpdateContact { ... }

[Route("/contacts/{Id}", "DELETE")]
public class DeleteContact { ... }
```

### Matching ignored paths

You can use the `{ignore}` variable placeholder to match a Route definition that doesn't map to a Request DTO property, e.g:

```csharp
[Route("/contacts/{Id}/{ignore}", "GET")]
public class GetContacts { ... }
```

Will match on `/contacts/1/john-doe` request and not require your Request DTO to have an **ignore** property

### Fluent API

You can also use a Fluent API to register ServiceStack Routes by adding them in your `AppHost.Configure()`:

```csharp
Routes
    .Add<Hello>("/hello")
    .Add<Hello>("/hello/{Name}");
```

and to match only **GET** request for `/Customers?Key=Value` and `/Customers/{Id}`:

```csharp
Routes
    .Add<GetContact>("/Contacts", "GET")
    .Add<GetContact>("/Contacts/{ContactId}", "GET");
```

## Content Negotiation

In addition to using the standard `Accept` HTTP Header to retrieve the response a different format, you can also request an alternative Content-Type by appending **?format=ext** to the query string, e.g:

  - [/rockstars?format=xml](https://razor.netcore.io/rockstars?format=xml)
  - [/rockstars/1?format=json](https://razor.netcore.io/rockstars/1?format=json)

Or by appending the format **.ext** to the end of the route, e.g:

  - [/rockstars.xml](https://razor.netcore.io/rockstars.xml)
  - [/rockstars/1.json](https://razor.netcore.io/rockstars/1.json)
  - [/rockstars.html?id=1](https://razor.netcore.io/rockstars.html?id=1)

This is enabled on all custom routes and works for all built-in and user-registered formats. 
It can be disabled by setting: 

```cs
Config.AllowRouteContentTypeExtensions = false
```

### Simulate alternative HTTP Methods

Some environments prohibit or inhibit sending alternative HTTP Methods like HTML Forms which only allow **GET** or **POST**
but you can simulate an alternative HTTP Method with the `X-Http-Method-Override`, e.g. we can simulate a **PATCH** request with:

```
X-Http-Method-Override: PATCH
```

Or in a HTML Form with a hidden input, e.g:

```html
<form method="POST">
    <input type="hidden" name="X-Http-Method-Override" value="PATCH">
    ...
</form>
```

This header is also available in the `HttpHeaders.XHttpMethodOverride` constant if needing to use it in C#/.NET Clients, e.g:

```csharp
var client = new JsonServiceClient(baseUrl) {
    RequestFilter = req => req.Headers[HttpHeaders.XHttpMethodOverride] = HttpMethods.Patch
};
```

### Custom Rules

The `Matches` property on `[Route]` and `[FallbackRoute]` attributes lets you specify an additional custom Rule that requests need to match. This feature is used in all [SPA project templates](/templates/single-page-apps) to specify that the `[FallbackRoute]` should only return the SPA `index.html` for unmatched requests which explicitly requests HTML, i.e:

```csharp
[FallbackRoute("/{PathInfo*}", Matches="AcceptsHtml")]
public class FallbackForClientRoutes
{
    public string PathInfo { get; set; }
}
```

This works by matching the `AcceptsHtml` built-in `RequestRules` below where the Route will only match the Request if it includes the explicit `text/html` MimeType in the HTTP Request `Accept` Header. The `AcceptsHtml` rule prevents the home page from being returned for missing resource requests like **favicon** which returns a `404` instead.

The implementation of all built-in Request Rules:

```csharp
SetConfig(new HostConfig {
  RequestRules = {
    {"AcceptsHtml", req => req.Accept?.IndexOf(MimeTypes.Html, StringComparison.Ordinal) >= 0 },
    {"AcceptsJson", req => req.Accept?.IndexOf(MimeTypes.Json, StringComparison.Ordinal) >= 0 },
    {"AcceptsXml", req => req.Accept?.IndexOf(MimeTypes.Xml, StringComparison.Ordinal) >= 0 },
    {"AcceptsJsv", req => req.Accept?.IndexOf(MimeTypes.Jsv, StringComparison.Ordinal) >= 0 },
    {"AcceptsCsv", req => req.Accept?.IndexOf(MimeTypes.Csv, StringComparison.Ordinal) >= 0 },
    {"IsAuthenticated", req => req.IsAuthenticated() },
    {"IsMobile", req => Instance.IsMobileRegex.IsMatch(req.UserAgent) },
    {"{int}/**", req => int.TryParse(req.PathInfo.Substring(1).LeftPart('/'), out _) },
    {"path/{int}/**", req => {
        var afterFirst = req.PathInfo.Substring(1).RightPart('/');
        return !string.IsNullOrEmpty(afterFirst) && int.TryParse(afterFirst.LeftPart('/'), out _);
    }},
    {"**/{int}", req => int.TryParse(req.PathInfo.LastRightPart('/'), out _) },
    {"**/{int}/path", req => {
        var beforeLast = req.PathInfo.LastLeftPart('/');
        return beforeLast != null && int.TryParse(beforeLast.LastRightPart('/'), out _);
    }},
 }
})
```

Routes that contain a `Matches` rule have a higher precedence then Routes without. We can use this to define multiple idential matching routes to call different Service depending on whether the Path Segment is an integer or not, e.g:

```csharp
// matches /users/1
[Route("/users/{Id}", Matches = "**/{int}")]
public class GetUser
{
    public int Id { get; set; }
}

// matches /users/username
[Route("/users/{Slug}")]
public class GetUserBySlug
{
    public string Slug { get; set; }
}
```

Other examples utilizing `{int}` Request Rules:

```csharp
// matches /1/profile
[Route("/{UserId}/profile", Matches = @"{int}/**")]
public class GetProfile { ... }

// matches /username/profile
[Route("/{Slug}/profile")]
public class GetProfileBySlug { ... }

// matches /users/1/profile/avatar
[Route("/users/{UserId}/profile/avatar", Matches = @"path/{int}/**")]
public class GetProfileAvatar { ... }

// matches /users/username/profile/avatar
[Route("/users/{Slug}/profile/avatar")]
public class GetProfileAvatarBySlug { ... }
```

Another popular use-case is to call different services depending on whether a Request is from an Authenticated User or not:

```csharp
[Route("/feed", Matches = "IsAuthenticated")]
public class ViewCustomizedUserFeed { ... }

[Route("/feed")]
public class ViewPublicFeed { ... }
```

This can also be used to call different Services depending if the Request is from a Mobile browser or not:

```csharp
[Route("/search", Matches = "IsMobile")]
public class MobileSearch { ... }

[Route("/search")]
public class DesktopSearch { ... }
```

Instead of matching on a pre-configured RequestRule you can instead specify a Regular Expression using the format:

```
{Property} =~ {RegEx}
```

Where `{Property}` is an `IHttpRequest` property, e.g:

```csharp
[Route("/users/{Id}", Matches = @"PathInfo =~ \/[0-9]+$")]
public class GetUser { ... }
```

An exact match takes the format:

```
{Property} = {Value}
```

Which you could use to provide a tailored feed for specific clients:

```csharp
[Route("/feed", Matches = @"UserAgent = specific-client")]
public class CustomFeedView { ... }
```

### HTTP Verb Interface Markers

You can decorate your Request DTO's using the `IGet`, `IPost`, `IPut`, `IDelete` and `IPatch` interface markers and the `Send` and  `SendAsync` API's will use it to automatically send the Request using the selected HTTP Method. E.g:

```csharp
public class HelloByGet : IGet, IReturn<HelloResponse>
{
    public string Name { get; set; }
}
public class HelloByPut : IPut, IReturn<HelloResponse> 
{
    public string Name { get; set; }
}

var response = client.Send(new HelloByGet { Name = "World" }); // GET

await client.SendAsync(new HelloByPut { Name = "World" });     // PUT
```

Interface markers is supported in all .NET Service Clients, they're also included in the generated [Add ServiceStack Reference](/add-servicestack-reference) DTO's.

## Auto Route Generation Strategies

Also related to this is registering Auto routes via the [Routes.AddFromAssembly](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/ServiceRoutesExtensions.cs#L23) extension method, where this single call:

```cs
Routes.AddFromAssembly(typeof(FooService).Assembly)
```

Goes through and scans all your services (in the Assemblies specified) and registers convention-based routes based on all the HTTP methods you have implemented. 

The default convention registers routes based on the Request DTO Name, whether it has an **Id** property and what actions were implemented. These conventions are configurable where you can now adjust/remove the existing rules or add your own to the **pre-defined** rules in `Config.RouteNamingConventions`:

```csharp
RouteNamingConventions = new List<RouteNamingConventionDelegate> {
    RouteNamingConvention.WithRequestDtoName,
    RouteNamingConvention.WithMatchingAttributes,     // defaults: PrimaryKeyAttrubute
    RouteNamingConvention.WithMatchingPropertyNames,  // defaults: Id, IDs
}
```

The existing rules can be further customized by modifying the related static properties, e.g:

```csharp
RouteNamingConvention.PropertyNamesToMatch.Add("UniqueId");
RouteNamingConvention.AttributeNamesToMatch.Add("DefaultIdAttribute");
```

Which will make these request DTOs:

```csharp
class MyRequest1
{
    public UniqueId { get; set;}
}

class MyRequest2
{
    [DefaultId]
    public CustomId { get; set;}
}
```

Generate the following routes:

```
/myrequest1
/myrequest1/{UniqueId}
/myrequest2
/myrequest2/{CustomId}
```

See the implementation of [RouteNamingConvention](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Host/RouteNamingConvention.cs) for examples of how to add your own auto-generated route conventions.

### Dynamically adding Route Attributes

Routes attributes can also be added dynamically but as Services are auto-registered before `AppHost.Configure()` runs, Route attributes need to be added before this happens like in the AppHost Constructor or before `new AppHost().Init()`, i.e:

```csharp
public class AppHost : AppHostBase {
    public AppHost() {
        typeof(MyRequest)
           .AddAttributes(new RouteAttribute("/myrequest"))
           .AddAttributes(new RouteAttribute("/myrequest/{UniqueId}"));
    }
}
```

### Customizing Defined Routes

You can customize existing routes by overriding `GetRouteAttributes()` in your AppHost, the example below adds a `/api` prefix to all existing routes:

```csharp
public class AppHost : AppHostBase
{
    //...
    public override RouteAttribute[] GetRouteAttributes(Type requestType)
    {
        var routes = base.GetRouteAttributes(requestType);
        routes.Each(x => x.Path = "/api" + x.Path);
        return routes;
    }
}
```

### Uploading Files

You can access uploaded files independently of the Request DTO using `Request.Files`. e.g:

```csharp
public object Post(MyFileUpload request)
{
    if (this.Request.Files.Length > 0)
    {
        var uploadedFile = base.Request.Files[0];
        uploadedFile.SaveTo(MyUploadsDirPath.CombineWith(file.FileName));
    }
    return HttpResult.Redirect("/");
}
```

ServiceStack's [imgur.netcore.io](https://imgur.netcore.io) example shows how to access the [byte stream of multiple uploaded files](https://github.com/ServiceStackApps/Imgur/blob/master/src/Imgur/Global.asax.cs#L62), e.g:

```csharp
public object Post(Upload request)
{
    foreach (var uploadedFile in base.Request.Files
       .Where(uploadedFile => uploadedFile.ContentLength > 0))
    {
        using (var ms = new MemoryStream())
        {
            uploadedFile.WriteTo(ms);
            WriteImage(ms);
        }
    }
    return HttpResult.Redirect("/");
}
```

### Reading directly from the Request Stream

Instead of registering a custom binder you can skip the serialization of the Request DTO, you can add the [IRequiresRequestStream](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IRequiresRequestStream.cs) interface to directly retrieve the stream without populating the Request DTO.

```csharp
//Request DTO
public class RawBytes : IRequiresRequestStream
{
    /// <summary>
    /// The raw Http Request Input Stream
    /// </summary>
    Stream RequestStream { get; set; }
}
```

Which tells ServiceStack to skip trying to deserialize the request so you can read in the raw HTTP Request body yourself, e.g:

```csharp
public async Task<object> PostAsync(RawBytes request)
{
    byte[] bytes = await request.RequestStream.ReadFullyAsync();
    string text = bytes.FromUtf8Bytes(); //if text was sent
}
```

### Pluralize and Singularize

In order to use optimal user-friendly routes in [AutoGen AutoQuery Services](/autoquery/autogen), an interned version of 
[Andrew Peters port of Rails Inflector](http://andrewpeters.net/inflectornet/) is available under the `Words` static class
that you can use to `Pluralize` or `Singularize` routes:

```csharp
var plural = Words.Pluralize("customer");      //= customers
var singular = Words.Singularize("customers"); //= customer
```

## Routing Resolution Order

This is described in more detail on the [New API Design wiki](/api-design) but the weighting used to select a route is based on:

  1. Any exact Literal Matches are used first
  2. Exact Verb match is preferred over All Verbs
  3. The more variables in your route the less weighting it has
  4. Routes with wildcard variables have the lowest precedence
  5. When Routes have the same weight, the order is determined by the position of the Action in the service or Order of Registration (FIFO)

### Route weighting example

The following HTTP Request:

```
GET /content/v1/literal/slug
```

Will match the following Route definitions in order from highest precedence to lowest:

```csharp
[Route("/content/v1/literal/slug", "GET")]
[Route("/content/v1/literal/slug")]
[Route("/content/v1/literal/{ignore}", "GET")]
[Route("/content/{ignore}/literal/{ignore}", "GET")]
[Route("/content/{Version*}/literal/{Slug*}", "GET")]
[Route("/content/{Version*}/literal/{Slug*}")]
[Route("/content/{Slug*}", "GET")]
[Route("/content/{Slug*}")]
```

See the [RestPathTests.cs](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.ServiceHost.Tests/RestPathTests.cs) and [Smart Routing](/api-design) section on the wiki for more examples.

### Content-Type Specific Service Implementations

Service implementations can use `Verb{Format}` method names to provide a different implementation for handling a specific Content-Type, e.g. 
the Service below defines several different implementation for handling the same Request:

```csharp
[Route("/my-request")]
public class MyRequest 
{
    public string Name { get; set; }
}

public class ContentTypeServices : Service
{
    // Handles all other unspecified Verbs/Formats to /my-request
    public object Any(MyRequest request) => ...;

    // Handles GET /my-request for JSON responses
    public object GetJson(MyRequest request) => ..; 

    // Handles POST/PUT/DELETE/etc /my-request for HTML Responses
    public object AnyHtml(MyRequest request) =>  
        $@"<html>
            <body>
                <h1>AnyHtml {request.Name}</h1>
            </body>
        </html>";

    // Handles GET /my-request for HTML Responses
    public object GetHtml(MyRequest request) =>   
        $@"<html>
            <body>
                <h1>GetHtml {request.Name}</h1>
            </body>
        </html>";
}
```

This convention can be used for any of the formats listed in `ContentTypes.KnownFormats`, which by default includes:

 - json
 - xml
 - jsv
 - csv
 - html
 - protobuf
 - msgpack
 - wire

### Reverse Routing

If you use `[Route]` metadata attributes (as opposed to the Fluent API) you will be able to generate strong-typed URI's using just the DTOs, letting you create urls outside of ServiceStack web framework as done with [.NET Service Clients](/csharp-client) using the `ToUrl(HttpMethod)` and `ToAbsoluteUri(HttpMethod)`, e.g:

```csharp
[Route("/reqstars/search", "GET")]
[Route("/reqstars/aged/{Age}")]
public class SearchReqstars : IReturn<ReqstarsResponse>
{
    public int? Age { get; set; }
}

var relativeUrl = new SearchReqstars { Age = 20 }.ToGetUrl();
var absoluteUrl = new SearchReqstars { Age = 20 }.ToAbsoluteUri();

relativeUrl.Print(); //=  /reqstars/aged/20
absoluteUrl.Print(); //=  http://www.myhost.com/reqstars/aged/20
```

The [Email Contacts demo](https://github.com/ServiceStack/EmailContacts/) shows an example of using the above Reverse Routing extension methods to [populate routes for HTML Forms and Links in Razor Views](https://github.com/ServiceStack/EmailContacts/#bootstrap-forms). 

#### Other Reverse Routing Extension methods

```csharp
new RequestDto().ToPostUrl();
new RequestDto().ToPutUrl();
new RequestDto().ToDeleteUrl();
new RequestDto().ToOneWayUrl();
new RequestDto().ToReplyUrl();
```

### Populating Complex Type Properties on QueryString

ServiceStack uses the [JSV-Format](/jsv-format) (JSON without quotes) to parse QueryStrings.

JSV lets you embed deep object graphs in QueryString as seen [this example url](https://test.servicestack.net/json/reply/StoreLogs?Loggers=%5B%7BId:786,Devices:%5B%7BId:5955,Type:Panel,TimeStamp:1199303309,Channels:%5B%7BName:Temperature,Value:58%7D,%7BName:Status,Value:On%7D%5D%7D,%7BId:5956,Type:Tank,TimeStamp:1199303309,Channels:%5B%7BName:Volume,Value:10035%7D,%7BName:Status,Value:Full%7D%5D%7D%5D%7D%5D):

```
https://test.servicestack.net/json/reply/StoreLogs?Loggers=[{Id:786,Devices:[{Id:5955,Type:Panel,
Channels:[{Name:Temperature,Value:58},{Name:Status,Value:On}]},
{Id:5956,Type:Tank,TimeStamp:1199303309,
Channels:[{Name:Volume,Value:10035},{Name:Status,Value:Full}]}]}]
```

### Customize urls used with `IUrlFilter`

Request DTO's can customize urls used in Service Clients or any libraries using ServiceStack's typed 
[Reverse Routing](/routing#reverse-routing) by having 
Request DTO's implement 
[IUrlFilter](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/IUrlFilter.cs).

ServiceStack's [Stripe Gateway](https://github.com/ServiceStack/Stripe) takes advantage of ServiceStack's
typed Routing feature to implement its 
[Open-Ended, Declarative Message-based APIs](https://github.com/ServiceStack/Stripe#open-ended-declarative-message-based-apis)
with minimal effort.

In order to match Stripe's unconventional syntax for specifying arrays on the QueryString of their 3rd party
REST API we use `IUrlFilter` to customize the url that's used. E.g. we need to specify `include[]` in order
for the Stripe API to return any optional fields like **total_count**.

```csharp
[Route("/customers")]
public class GetStripeCustomers : IGet, IReturn<StripeCollection<Customer>>, IUrlFilter
{
    public GetStripeCustomers() 
    {
        Include = new[] { "total_count" };
    }

    [IgnoreDataMember]
    public string[] Include { get; set; }

    public string ToUrl(string absoluteUrl) => Include != null 
        ? absoluteUrl.AddQueryParam("include[]", string.Join(",", Include)) 
        : absoluteUrl;
}
```

> `[IgnoreDataMember]` is used to hide the property being emitted using the default convention

Which when sending the Request DTO:

```csharp
var response = client.Get(new GetStripeCustomers());
```

Generates and sends the relative url:

```
/customers?include[]=total_count
```

Which has the effect of populating the `TotalCount` property in the typed `StripeCollection<StripeCustomer>` response.

## Routing Metadata

Most of the metadata ServiceStack knows about your services are accessible internally via `HostContext.Config.Metadata` from within ServiceStack and externally via the `/operations/metadata` route. A link to the **Operations Metadata** page is displayed at the bottom of the /metadata when in ServiceStack is in `DebugMode`.

### Great Performance

Since [Routing in ASP.NET MVC can be slow](http://samsaffron.com/archive/2011/10/13/optimising-asp-net-mvc3-routing) when you have a large number of Routes, it's worthwhile pointing out ServiceStack's Routing implementation is implemented with hash lookups so doesn't suffer the linear performance regression issues you might have had with MVC. So you don't have to worry about degraded performance when registering a large number of Routes.

### Consider "pretty-urls" for public pages

A constant eyesore that hurts my aesthetic eye when surfing the web is how you can immediately tell that a Website is written in ASP.NET
by its `/{Controller}/{Action}` routing convention or `.aspx` suffix. This forces URL abnormalities where instead of choosing
the ideal identifier for your public resource, the path tends to adopt internal method and class names that typically makes more sense
to its developers than to external users. These dictated conventions also results in the `?queryString` becoming a data bag of params
that should otherwise be hidden or included as part of its public URI identifier.

#### Permalinks important for SEO, usability and refactorability

In general it's not a good idea to let a technology to dictate what your public routes end up being. Ideally your external routes 
should be regarded as permalinks and decoupled from their internal implementations as you don't want internal refactors to cause
link rot, break existing inbound navigation or lose any SEO weight they've accumulated. 

If you adopt the ideal URL from the start, you'll never have a reason to change it and the decoupling frees you from being able
to refactor it's mapped implementation or even replacing the underlying technology completely as the ideal routes are already at what 
they should be that's free from any technology bias.

Pretty URLs or [Clean URLs](https://en.wikipedia.org/wiki/Clean_URL) also provide important usability and accessibility benefits to 
non technical users where their prominent location in browsers is a valuable opportunity to add meaningful context on where they are in your Website. 

#### Pre-defined Routes are optimal for machines

In ServiceStack all Services are automatically available using the [pre-defined routes](/routing#pre-defined-routes) which is optimal 
for automated tooling and machinery as they can be predicted without requiring any server meta information.

#### Optimize Custom Routes for humans

Use [Custom Routes](/routing#custom-routes) to also make your **Services** available at the optimal Clean URLs for humans. For **Content Pages** 
you can take advantage of **Page Based Routing** in both **Sharp Pages** and now in **Razor** to specify the ideal route for your page which 
in addition to requiring less effort to define (as they're implicitly defined) they're also less effort to implement as **no Controller or Service**
are needed. They also benefit from being immediately inferrible by looking at the intuitively mapped directory and file names alone which works 
equally well in reverse where the page for a route will be exactly where you think it will be.

#### Designing Clean URLs

Some great references on designing RESTful Pretty URLs are the [Clean URL examples in Wikipedia](https://en.wikipedia.org/wiki/Clean_URL#Structure):

<CleanUrlsMd></CleanUrlsMd>

#### Get Inspired by GitHub

For some real-world inspiration look to [github.com](https://github.com) who are masters at it. You can tell a lot of thought went into 
meticulously choosing the ideal routes they want for all of their sites functionality. This has added tremendous value to GitHub's usability 
whose intuitive routes have made deep navigation possible where you can jump directly to the page you want without always having to navigate 
from their home page as needed in most websites with framework-generated routes who are more susceptible to negatively impacting user engagement
in home page redesigns that move around existing links and navigation. GitHub's logically grouped routes also gets a natural assist
from Autocomplete in browsers who are better able to complete previously visited GitHub URLs.

# Community Resources

  - [Use routes to customize service endpoints](http://dilanperera.wordpress.com/2014/02/23/servicestack-use-routes-to-customise-service-endpoints/)
    - [More on Routes](http://dilanperera.wordpress.com/2014/02/24/servicestack-more-on-routes/)
  - [Using PostSharp to Add ServiceStack Route Attributes](http://jokecamp.wordpress.com/2013/06/11/using-postsharp-to-add-servicestack-route-attributes/) by [@jokecamp](https://twitter.com/jokecamp)
