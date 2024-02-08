---
title: Endpoint Routing
---

::: info
For docs on routing with ServiceStack prior to .NET 8 and v8.1 [ServiceStack Routing](/routing)
:::


## /api pre-defined route

Over the last decade [JSON](https://www.json.org/json-en.html) has stood out and become more popular than all others combined, where it's the lingua franca for calling APIs in Web Apps and what our [Add ServiceStack Reference](/add-servicestack-reference) ecosystem of languages relies on. Due to its overwhelming dominance for usage in APIs it's configured as the default format for the pre-defined route at:

<div class="not-prose">
<h3 class="text-4xl text-center text-indigo-800 pb-3">/api/{Request}</h3>
</div>

This simple convention makes it easy to remember what route APIs are available on & pairs nicely with [API Explorer's](/api-explorer):

<div class="not-prose">
<h3 class="text-4xl text-center text-indigo-800 pb-3">/ui/{Request}</h3>
</div>

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

### Other Service Clients

The latest versions of generic Service Clients in other languages are pre-configured to use `/api` by default:

#### JavaScript/TypeScript

```ts
const client = new JsonServiceClient(baseUrl)
```

#### Java/Kotlin

```java
JsonServiceClient client = new JsonServiceClient(baseUrl);
```

#### Python

```python
client = JsonServiceClient(baseUrl)
```

#### PHP

```php
$client = new JsonServiceClient(baseUrl);
```

#### Dart

```dart
var client = ClientFactory.api(baseUrl);
```

### Content Negotiation

The JSON API Route also supports returning API responses in multiple [registered content types](/formats) by using its extension, e.g:

<h3 class="text-4xl text-center text-indigo-800 pb-3">/api/{Request}.{ext}</h3>

- [/api/QueryBookings](https://blazor-vue.web-templates.io/api/QueryBookings)
- [/api/QueryBookings.jsonl](https://blazor-vue.web-templates.io/api/QueryBookings.jsonl)
- [/api/QueryBookings.csv](https://blazor-vue.web-templates.io/api/QueryBookings.csv)
- [/api/QueryBookings.xml](https://blazor-vue.web-templates.io/api/QueryBookings.xml)
- [/api/QueryBookings.html](https://blazor-vue.web-templates.io/api/QueryBookings.html)

#### Query String Format

That continues to support specifying the Mime Type via the `?format` query string, e.g:
 
- [/api/QueryBookings?format=jsonl](https://blazor-vue.web-templates.io/api/QueryBookings?format=jsonl)
- [/api/QueryBookings?format=csv](https://blazor-vue.web-templates.io/api/QueryBookings?format=csv)

### Endpoint Routing

From [ServiceStack v8.1](/releases/v8_01) ServiceStack **.NET 8** Apps support an integrated way to run all of ServiceStack 
requests including all APIs, metadata and built-in UIs with support for 
[ASP.NET Core Endpoint Routing](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/routing) -
enabled by calling `MapEndpoints()` when configuring ServiceStack:

```csharp
services.AddServiceStack(typeof(MyServices).Assembly);

var app = builder.Build();
//...

app.UseServiceStack(new AppHost(), options => {
    options.MapEndpoints();
});

app.Run();
```

Which configures ServiceStack APIs to be registered and executed along-side Minimal APIs, Razor Pages, SignalR, MVC 
and Web API Controllers, etc, utilizing the same routing, metadata and execution pipeline.

#### View ServiceStack APIs along-side ASP.NET Core APIs

Amongst other benefits, this integration is evident in endpoint metadata explorers like the `Swashbuckle` library 
which can now show ServiceStack APIs in its Swagger UI along-side other ASP.NET Core APIs in ServiceStack's
[Open API v3](/openapi) support.

### Routing Syntax

Using Endpoint Routing also means using ASP.NET Core's Routing System which now lets you use ASP.NET Core's
[Route constraints](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/routing#route-constraints)
for defining user-defined routes for your ServiceStack APIs, e.g:

```csharp
[Route("/users/{Id:int}")]
[Route("/users/{UserName:string}")]
public class GetUser : IGet, IReturn<User>
{
    public int? Id { get; set; }
    public int? UserName { get; set; }
}
```

For the most part ServiceStack Routing implements a subset of ASP.NET Core's Routing features so your existing user-defined 
routes should continue to work as expected. 

### Wildcard Routes

[Wildcard or catch-all parameters](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/routing#route-templates) 
can be used as a prefix to a route parameter to bind to the rest of the URI by using a `*` or `**` prefix, e.g:

```csharp
[Route("/wildcard/{*Path}")]  //escape path
[Route("/wildcard/{**Path}")] //leave unescaped
public class GetFile : IGet, IReturn<byte[]>
{
    public string Path { get; set; }
}
```

### Route Constraints

The Route Constraints built into ASP.NET Core Routing include:

:::{.table}
| constraint          | Example                                     | Example Matches                        | Notes                                                                                     |
|---------------------|---------------------------------------------|----------------------------------------|-------------------------------------------------------------------------------------------|
| `int`               | `{id:int}`                                  | `123456789`, `-123456789`              | Matches any integer                                                                       |
| `bool`              | `{active:bool}`                             | `true`, `FALSE`                        | Matches `true` or `false`. Case-insensitive                                               |
| `datetime`          | `{dob:datetime}`                            | `2016-12-31`, `2016-12-31 7:32pm`      | Matches a valid `DateTime` value in the invariant culture. See preceding warning.         |
| `decimal`           | `{price:decimal}`                           | `49.99`, `-1,000.01`                   | Matches a valid `decimal` value in the invariant culture. See preceding warning.          |
| `double`            | `{weight:double}`                           | `1.234`, `-1,001.01e8`                 | Matches a valid `double` value in the invariant culture. See preceding warning.           |
| `float`             | `{weight:float}`                            | `1.234`, `-1,001.01e8`                 | Matches a valid `float` value in the invariant culture. See preceding warning.            |
| `guid`              | `{id:guid}`                                 | `CD2C1638-1638-72D5-1638-DEADBEEF1638` | Matches a valid `Guid` value                                                              |
| `long`              | `{ticks:long}`                              | `123456789`, `-123456789`              | Matches a valid `long` value                                                              |
| `minlength(value)`  | `{username:minlength(4)}`                   | `Rick`                                 | String must be at least 4 characters                                                      |
| `maxlength(value)`  | `{filename:maxlength(8)}`                   | `MyFile`                               | String must be no more than 8 characters                                                  |
| `length(length)`    | `{filename:length(12)}`                     | `somefile.txt`                         | String must be exactly 12 characters long                                                 |
| `length(min,max)`   | `{filename:length(8,16)}`                   | `somefile.txt`                         | String must be at least 8 and no more than 16 characters long                             |
| `min(value)`        | `{age:min(18)}`                             | `19`                                   | Integer value must be at least 18                                                         |
| `max(value)`        | `{age:max(120)}`                            | `91`                                   | Integer value must be no more than 120                                                    |
| `range(min,max)`    | `{age:range(18,120)}`                       | `91`                                   | Integer value must be at least 18 but no more than 120                                    |
| `alpha`             | `{name:alpha}`                              | `Rick`                                 | String must consist of one or more alphabetical characters, `a`-`z` and case-insensitive. |
| `regex(expression)` | `{ssn:regex(^\\d{{3}}-\\d{{2}}-\\d{{4}}$)}` | `123-45-6789`                          | String must match the regular expression. See tips about defining a regular expression.   |
| `required`          | `{name:required}`                           | `Rick`                                 | Used to enforce that a non-parameter value is present during URL generation               |
:::

### Primary HTTP Method

An API will only register its Endpoint Route for its [primary HTTP Method](/api-design#all-apis-have-a-preferred-default-method), 
if you want an API to be registered for multiple HTTP Methods you can specify them in the `Route` attribute, e.g:

```csharp
[Route("/users/{Id:int}", "GET,POST")]
public class GetUser : IGet, IReturn<User>
{
    public required int Id { get; set; }
}
```

As such we recommend using the IVerb `IGet`, `IPost`, `IPut`, `IPatch`, `IDelete` interface markers to specify the primary HTTP Method
for an API. This isn't needed for [AutoQuery Services](/autoquery/) which are implicitly configured
to use their optimal HTTP Method.

If no HTTP Method is specified, the Primary HTTP Method defaults to HTTP **POST**.

### Authorization

Using Endpoint Routing also means ServiceStack's APIs are authorized the same way, where ServiceStack's 
[Declarative Validation attributes](/auth/#declarative-validation-attributes) are converted
into ASP.NET Core's `[Authorize]` attribute to secure the endpoint:

```csharp
[ValidateIsAuthenticated]
[ValidateIsAdmin]
[ValidateHasRole(role)]
[ValidateHasClaim(type,value)]
[ValidateHasScope(scope)]
public class Secured {}
```

#### Authorize Attribute on ServiceStack APIs

Alternatively you can use ASP.NET Core's `[Authorize]` attribute directly to secure ServiceStack APIs should
you need more fine-grained Authorization:

```csharp
[Authorize(Roles = "RequiredRole")]
[Authorize(Policy = "RequiredPolicy")]
[Authorize(AuthenticationSchemes = "Identity.Application,Bearer")]
public class Secured {}
```

#### Configuring Authentication Schemes

ServiceStack will default to using the major Authentication Schemes configured for your App to secure the APIs endpoint with, 
this can be overridden to specify which Authentication Schemes to use to restrict ServiceStack APIs by default, e.g:

```csharp
app.UseServiceStack(new AppHost(), options => {
    options.AuthenticationSchemes = "Identity.Application,Bearer";
    options.MapEndpoints();
});
```

### Hidden ServiceStack Endpoints

Whilst ServiceStack Requests are registered and executed as endpoints, most of them are marked with
`builder.ExcludeFromDescription()` to hide them from polluting metadata and API Explorers like Swagger UI and 
[API Explorer](/api-explorer).

To also hide your ServiceStack APIs you can use `[ExcludeMetadata]` attribute to hide them from all metadata services
or use `[Exclude(Feature.ApiExplorer)]` to just hide them from API Explorer UIs:

```csharp
[ExcludeMetadata]
[Exclude(Feature.ApiExplorer)]
public class HiddenRequest {}
```

### Customize Endpoint Mapping

You can register a RouteHandlerBuilders to customize how ServiceStack APIs endpoints are registered which is also
what ServiceStack uses to annotate its API endpoints to enable its new [Open API v3](/openapi) support:

```csharp
options.RouteHandlerBuilders.Add((builder, operation, method, route) =>
{
    builder.WithOpenApi(op => { ... });
});
```

### Endpoint Routing Compatibility Levels

The default behavior of `MapEndpoints()` is the strictest and recommended configuration that we want future ServiceStack Apps to use,
however if you're migrating existing App's you may want to relax these defaults to improve compatibility with existing behavior.
The configurable defaults for mapping endpoints are:

```csharp
app.UseServiceStack(new AppHost(), options => {
    options.MapEndpoints(use:true, force:true, useSystemJson:UseSystemJson.Always);
});
```

- `use` - Whether to use registered endpoints for executing ServiceStack APIs
- `force` - Whether to only allow APIs to be executed through endpoints
- `useSystemJson` - Whether to use **System.Text.Json** for JSON API Serialization

So you could for instance register endpoints and not `use` them, where they'll be visible in endpoint API explorers like
[Swagger UI](/openapi) but continue to execute in ServiceStack's Request Pipeline.

`force` disables fallback execution of ServiceStack Requests through ServiceStack's Request Pipeline for requests that
don't match registered endpoints. You may need to disable this if you have existing clients calling ServiceStack APIs through
multiple HTTP Methods, as only the primary HTTP Method is registered as an endpoint.

When enabled `force` ensures the only ServiceStack Requests that are not executed through registered endpoints are
`IAppHost.CatchAllHandlers` and `IAppHost.FallbackHandler` handlers.

`useSystemJson` lets you specify when to use [System.Text.Json for JSON API Serialization](/system-text-json), which
enables your App to standardize on using ASP.NET Core's fast async UTF8 JSON Serializer.