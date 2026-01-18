---
slug: openapi
title: Open API
---

::: info
When using ASP.NET Core **Endpoint Routing** refer to [ASP.NET Core Swashbuckle Open API v3](/openapi) instead
:::

![](/img/pages/openapi/openapi-banner.png)

[Open API](https://www.openapis.org/) is a specification and complete framework implementation for describing, producing, consuming, and visualizing RESTful web services. ServiceStack implements the 
[OpenAPI Spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) back-end and embeds the Swagger UI front-end in a separate plugin which is available under [OpenAPI NuGet package](http://nuget.org/packages/ServiceStack.Api.OpenApi/):

:::copy
`<PackageReference Include="ServiceStack.Api.OpenApi" Version="10.*" />`
:::

## Installation

You can enable Open API by registering the `OpenApiFeature` plugin in AppHost with:

```csharp
public override void Configure(Container container)
{
    ...
    Plugins.Add(new OpenApiFeature());

    // Uncomment CORS feature if it needs to be accessible from external sites 
    // Plugins.Add(new CorsFeature()); 
    ...
}
```

Then you will be able to view the Swagger UI from `/swagger-ui/`. A link to **Swagger UI** will also be available from your `/metadata` [Metadata Page](/metadata-page).

## Open API Attributes

Each route could have a separate summary and description. You can set it with `Route` attribute:

```csharp
[Route("/hello", Summary = @"Default hello service.", 
    Notes = "Longer description for hello service.")]
```

You can set specific description for each HTTP method like shown below:

```csharp
[Route("/hello/{Name}", "GET", Summary="Says 'Hello' to provided Name", 
    Notes = "Longer description of the GET method which says 'Hello'")]
[Route("/hello/{Name}", "POST", Summary="Says 'Hello' to provided Name", 
    Notes = "Longer description of the POST method which says 'Hello'")]
```

You can also document your services in the OpenAPI with the new `[Api]` and `[ApiMember]` annotation attributes, e,g: Here's an example of a fully documented service:

```csharp
[Api("Service Description")]
[Tag("Core Requests")]
[ApiResponse(HttpStatusCode.BadRequest, "Your request was not understood")]
[ApiResponse(HttpStatusCode.InternalServerError, "Oops, something broke")]
[Route("/swagger/{Name}", "GET", Summary = "GET Summary", Notes = "Notes")]
[Route("/swagger/{Name}", "POST", Summary = "POST Summary", Notes="Notes")]
public class MyRequestDto
{
    [ApiMember(Name="Name", Description = "Name Description",
        ParameterType = "path", DataType = "string", IsRequired = true)]
    [ApiAllowableValues("Name", typeof(Color))] //Enum
    public string Name { get; set; }
}
```

Please note, that if you used `ApiMember.DataType` for annotating `OpenApiFeature` then you need to change the types to OpenAPI type when migrating to `OpenApiFeature`. For example, annotation of 
```csharp
[ApiMember(DataType="int")]
```
need to be changed to 
```csharp
[ApiMember(DataType="integer", Format="int32")]
```

Here is the table for type migration

| Swagger Type (DataType) | OpenAPI Type (DataType) | OpenAPI Format (Format)     |
|-------------------------|-------------------------|-----------------------------|
| Array                   | array                   |                             |
| boolean                 | boolean                 |                             |
| byte                    | integer                 | int                         |
| Date                    | string                  | date                        |
|                         | string                  | date-time                   |
| double                  | number                  | double                      |
| float                   | number                  | float                       |
| int                     | integer                 | int32                       |
| long                    | integer                 | int64                       |
| string                  | string                  |                             |

You can use `[ApiAllowableValues]` lets you anotate enum properties as well as a restriction for values in array, e.g:

```csharp
[ApiAllowableValues("Includes", Values = new string[] { "Genres", "Releases", "Contributors" })]
public string[] Includes { get; set; }
```

::: info
The use of `ApiMember` turns your DTO properties as **opt-in only** for OpenApi metadata.
Meaning that only properties annotated with `[ApiMember]` will be included in the OpenApi metadata for classes
that use `[ApiMember]` on any of its properties.
:::

### Group APIs with Tags

You can tag the DTO with `[Tag]` attribute. Attributes are annotated by the same tag are grouped by the tag name in Swagger UI. DTOs can have multiple tags, e.g:

```csharp
[Tag("Core Features")]
[Tag("Scheduler")]
public class MyRequest { ... }
```

You can Exclude **properties** from being listed in OpenAPI with:

```csharp
[IgnoreDataMember]
```

Exclude **properties** from being listed in OpenAPI Schema Body with:

```csharp
[ApiMember(ExcludeInSchema=true)]
```
### Exclude Services from Metadata Pages

To exclude entire Services from showing up in OpenAPI or any other Metadata Services (i.e. Metadata Pages, Postman, NativeTypes, etc), annotate **Request DTO's** with:

```csharp
[ExcludeMetadata]
public class MyRequestDto { ... }
```

### Operation filters

You can override operation or parameter definitions by specifying the appropriate filter in plugin configuration:

```csharp
Plugins.Add(new OpenApiFeature
{
    OperationFilter = (verb, operation) => operation.Tags.Add("all operations")
});
```

Available configuration options:

- `ApiDeclarationFilter` - allows to modify final result of returned OpenAPI json
- `OperationFilter` - allows to modify operations
- `SchemaFilter` - allows to modify OpenAPI schema for user types
- `SchemaPropertyFilter` - allows to modify propery declarations in OpenAPI schema

### Properties naming conventions

You can control naming conventions of generated properties by following configuration options:

- `UseCamelCaseSchemaPropertyNames` - generate camel case property names
- `UseLowercaseUnderscoreSchemaPropertyNames` - generate underscored lower cased property names (to enable this feature `UseCamelCaseModelPropertyNames` must also be set) 

Example:

```csharp
Plugins.Add(new OpenApiFeature
{
    UseCamelCaseSchemaPropertyNames = true,
    UseLowercaseUnderscoreSchemaPropertyNames = true
});
```

### Change default Verbs

If left unspecified, the `[Route]` attribute allows Services to be called from any HTTP Verb which by default 
are listed in the Open API specification under the most popular HTTP Verbs, namely `GET`, `POST`, `PUT` and `DELETE`.

This can be modified with `AnyRouteVerbs` which will let you specify which Verbs should be generated 
for **ANY** Routes with unspecified verbs, e.g. we can restrict it to only emit routes for `GET` and `POST` Verbs with:

```csharp
Plugins.Add(new OpenApiFeature
{
    AnyRouteVerbs =  new List<string> { HttpMethods.Get, HttpMethods.Post }
});
```

### Miscellaneous configuration options

- `DisableAutoDtoInBodyParam` - disables adding `body` parameter for Request DTO to operations
- `LogoUrl` - url of the logo image for Swagger UI

Example:

```csharp
Plugins.Add(new OpenApiFeature
{
    DisableAutoDtoInBodyParam = true
});
```

## Virtual File System

The docs on the Virtual File System shows how to override embedded resources:

### Overriding OpenAPI Embedded Resources

ServiceStack's [Virtual File System](/virtual-file-system) supports multiple file source locations where you can override OpenAPI's embedded files by including your own custom files in the same location as the existing embedded files. This lets you replace built-in ServiceStack embedded resources with your own by simply copying the [/swagger-ui](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Api.OpenApi/swagger-ui) files you want to customize and placing them in your Website Directory at:

```
/swagger-ui
    /css
    /fonts
    /images
    /lang
    /lib
    index.html
    swagger-ui.js
```

#### Injecting custom JavaScript

As part of the customization you can add custom `patch.js` and `patch-preload.js`:

```
/swagger-ui
    patch.js
    patch-preload.js
```

which will be injected in the `/swagger-ui` index page, `patch-preload.js` is embedded before `swaggerUi.load()` is called:

```js
// contents of patch-preload.js

window.swaggerUi.load();
```

So you can use it to customize the `swaggerUi` configuration object before it's loaded, whilst `patch.js` is embedded just before the end of the `</body>` tag, e.g:

```html
<script type='text/javascript'>
// contents of patch.js
</script>
</body>
```

### Swagger UI Security

There are 2 custom security methods supported **Bearer** and **Basic Auth**. 

You can specify to use Swagger's support for API Key Authentication with:

```csharp
Plugins.Add(new OpenApiFeature
{
    UseBearerSecurity = true,
});
```

This will instruct Swagger to use their API Key Authentication when clicking the **Authorize** button which will be sent in API requests to your Authenticated Services. As the **value** field is for the entire Authorization HTTP Header you'd need to add your JWT Token or API Key prefixed with `Bearer `:

![](./img/pages/openapi/bearer-auth.png)

Which you can use to use to Authenticate with "Bearer token" Auth Providers like [API Key](/auth/api-key-authprovider) and [JWT Auth Providers](/auth/jwt-authprovider).

### Basic Auth in OpenAPI

You can instruct Swagger to use HTTP Basic Auth with:

```csharp
Plugins.Add(new OpenApiFeature
{
    UseBasicSecurity = true,
});
```

This lets Users call protected Services using the Username and Password fields in Swagger UI. 
Swagger UI sends these credentials with every API request using HTTP Basic Auth, which can be enabled in your AppHost with:

```csharp
Plugins.Add(new AuthFeature(...,
    new IAuthProvider[] { 
        new BasicAuthProvider(), //Allow Sign-ins with HTTP Basic Auth
    }));
```

To login, you need to click "Authorize" button.

![](./img/pages/openapi/1-swaggerui-authorize.png)

And then enter username and password.

![](./img/pages/openapi/2-swaggerui-password.png)

Also you can click "Try it out" button on services, which requires authentication and browser will prompt a window with user/password field for entering basic auth credentials.

Alternatively you can authenticate outside Swagger (e.g. via an OAuth Provider) which will also let you
call protected Services in `/swagger-ui`.

## Generating AutoRest client

You can use OpenAPI plugin to automatically generate client using [Autorest](https://github.com/Azure/Autorest). 
To use AutoRest first install it from npm:

:::sh
npm install -g autorest
:::

Then you need to download the Open API specification for your Services using a tool like curl:

:::sh
curl http://your.domain/openapi > openapi.json
:::

Or using `iwr` if you have PowerShell installed:

:::sh
iwr http://your.domain/openapi -o openapi.json
:::

You can then use the `openapi.json` with autorest to generate a client for your API in your preferred language, e.g:

:::sh
autorest --latest-release -Input openapi.json -CodeGenerator CSharp -OutputDirectory AutoRestClient -Namespace AutoRestClient
:::

This will generate directory containing your model types and REST operations that you can use with the 
generated client, e.g:

```csharp
using (var client = new SampleProjectAutoRestClient("http://localhost:20000"))
{
    var dto = new SampleDto { /* .... */ }; 
    var result = client.SampleOperation.Post(body: dto);

    // process result
}
```

AutoRest clients will allow usage of tooling that have adopted AutoRest and is a good stop gap solution for generating
native clients for languages that [Add ServiceStack Reference](/add-servicestack-reference) doesn't support yet like
Python and Ruby.

### AutoRest Generated Clients vs Add ServiceStack Reference

However AutoRest generated clients are similar to WCF Service Reference generated clients where it generates RPC-style Clients that emits both implementation logic and models for sending each request that's coupled to external HttpClient 
and JSON.NET dependencies. This approach generates significantly more code generation that populates a directory containing
[multiple implementation and Model classes](https://github.com/ServiceStack/ServiceStack/tree/master/tests/ServiceStack.OpenApi.Tests/GeneratedClient)
generated for each Service.

In contrast [Add ServiceStack Reference](/add-servicestack-reference) adopts the 
venerable [Data Transfer Object](https://martinfowler.com/eaaCatalog/dataTransferObject.html), 
[Gateway](https://martinfowler.com/eaaCatalog/gateway.html) and 
[Remote Facade](https://martinfowler.com/eaaCatalog/remoteFacade.html) Service patterns where it only needs to generate
clean, implementation-free DTO models that it captures in **a single source file** for all supported languages. 

The generated DTOs are cleaner and more reusable where it isn't coupled to any Serialization implementation and
can be reused in any of ServiceStack's message-based 
[Service Clients and Serialization Formats](/csharp-client#httpwebrequest-service-clients)
or different [Service Gateway](/service-gateway) implementations.
The models are also richer where it's able to include additional metadata attributes and marker interfaces 
that isn't possible when tunneling through a generic API specification. 

The use of intelligent generic Service Clients will always be able to provide a richer more productive development 
experience that can enable higher-level, value-added functionality like 
[Structured Error Handling](/error-handling), [Smart HTTP Caching](/cache-aware-clients), 
[Auto Batching](/auto-batched-requests), [Encrypted Messaging](/auth/encrypted-messaging#encrypted-service-client), 
[AutoQuery Streaming](/autoquery/rdbms#service-clients-support), 
[Request Compression](/csharp-client#client--server-request-compression), integrated authentication and lots more.

### Known issues

Autorest generated clients do not support `application/octet-stream` MIME type, which is used when service returns `byte[]` array. You can track [this issue on Github](https://github.com/Azure/autorest/issues/1932).

## Publish Azure Management API

Login to [Azure Portal](https://portal.azure.com) and search for `API management service`.

![](./img/pages/azure-api-management/1-search.png)

Choose `API management service`. In opened window click `Add` button.

![](./img/pages/azure-api-management/2-add.png)

Fill the creation form. Put your own values in `Name`, `Resource Group`, `Organization name` and `Administrator email`. When creation form will be ready, click `Create` button.

![](./img/pages/azure-api-management/3-create.png)

Wait while Management API will be activated. It can take more than forty minutes. When it ready click on created API management resource.

![](./img/pages/azure-api-management/4-activating.png)

In opened window click `APIs - PREVIEW` menu item on the left pane.

![](./img/pages/azure-api-management/5-publisher-portal.png)

Choose `OpenAPI specification` in `Add API` section.

![](./img/pages/azure-api-management/6-add-api.png)

Fill the url with location of you services, ended with `/openapi` or just click `Upload` button and upload OpenAPI json definition, which is available at `/openapi` path of your services.

![](./img/pages/azure-api-management/7-create-api.png)

After successfull import you should see list of available operations for your services

![](./img/pages/azure-api-management/8-created.png)

