---
slug: swagger-api
title: Swagger API
---

::: warning DEPRECATED
`SwaggerFeature` implements Swagger 1.2 whilst **[Open API](/openapi)** implements the newer Swagger 2.0 / Open API specification. For new projects we recommend using **[Open API](/openapi)** which also has broader industry adoption
:::

[Swagger](http://swagger.io/) is a specification and complete framework implementation for describing, producing, consuming, and visualizing RESTful web services. ServiceStack implements the 
[Swagger 1.2 Spec](https://github.com/swagger-api/swagger-spec/blob/master/versions/1.2.md) back-end and embeds the Swagger UI front-end in a separate plugin which is available under [Swagger NuGet package](http://nuget.org/packages/ServiceStack.Api.Swagger/):

:::copy
`<PackageReference Include="ServiceStack.Api.Swagger" Version="8.*" />`
:::

## Installation

You can enable Swagger by registering the `SwaggerFeature` plugin in AppHost with:

```csharp
public override void Configure(Container container)
{
    ...
    Plugins.Add(new SwaggerFeature());

    // uncomment CORS feature if it's has to be available from external sites 
    //Plugins.Add(new CorsFeature()); 
    ...
}
```

Then you will be able to view the Swagger UI from `/swagger-ui/`. A link to **Swagger UI** will also be available from your `/metadata` [Metadata Page](/metadata-page).

#### Configuring ServiceStack with MVC

If you're [Hosting ServiceStack with MVC](/mvc-integration) then you'll need to tell MVC to ignore the path where ServiceStack is hosted, e.g:

```csharp
routes.IgnoreRoute("api/{*pathInfo}"); 
```

For MVC4 projects, you'll also need to disable WebAPI:

```csharp
//WebApiConfig.Register(GlobalConfiguration.Configuration);
```

## Swagger Attributes

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

You can further document your services in the Swagger UI with the new `[Api]` and `[ApiMember]` annotation attributes, e,g: Here's an example of a fully documented service:

```csharp
[Api("Service Description")]
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

You can Exclude **properties** from being listed in Swagger with:

```csharp
[IgnoreDataMember]
```

Exclude **properties** from being listed in Swagger Schema Body with:

```csharp
[ApiMember(ExcludeInSchema=true)]
```

### Exclude Services from Metadata Pages

To exclude entire Services from showing up in Swagger or any other Metadata Services (i.e. Metadata Pages, Postman, NativeTypes, etc), annotate **Request DTO's** with:

```csharp
[Exclude(Feature.Metadata)]
public class MyRequestDto { ... }
```

### Swagger UI Route Summaries

The Swagger UI groups multiple routes under a single top-level route that covers multiple different 
services sharing the top-level route which can be specified using the `RouteSummary` dictionary of 
the `SwaggerFeature` plugin, e.g: 

```csharp
Plugins.Add(new SwaggerFeature {
    RouteSummary = {
        { "/top-level-path", "Route Summary" }
    }
});
```

## Virtual File System

The docs on the Virtual File System shows how to override embedded resources:

### Overriding Swaggers Embedded Resources

ServiceStack's [Virtual File System](/virtual-file-system) supports multiple file source locations where you can override Swagger's embedded files by including your own custom files in the same location as the existing embedded files. This lets you replace built-in ServiceStack embedded resources with your own by simply copying the [/swagger-ui](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Api.Swagger/swagger-ui) or [/swagger-ui-bootstrap](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Api.Swagger/swagger-ui-bootstrap) files you want to customize and placing them in your Website Directory at:

```
/swagger-ui
  /css
  /images
  /lib
  index.html

/swagger-ui-bootstrap
  index.html
  swagger-like-template.html
```

### Basic Auth added to Swagger UI

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/swagger-basicauth.png)

Users can call protected Services using the Username and Password fields in Swagger UI. 
Swagger sends these credentials with every API request using HTTP Basic Auth, 
which can be enabled in your AppHost with:

```csharp
Plugins.Add(new AuthFeature(...,
      new IAuthProvider[] { 
        new BasicAuthProvider(), //Allow Sign-ins with HTTP Basic Auth
      }));
```

Alternatively users can login outside of Swagger, to access protected Services in Swagger UI.

## Demo Project

ServiceStack.UseCases project contains example [SwaggerHelloWorld](https://github.com/ServiceStack/ServiceStack.UseCases/tree/master/SwaggerHelloWorld). It demonstrates how to use and integrate [ServiceStack.Api.Swagger](http://nuget.org/packages/ServiceStack.Api.Swagger/). Take a look at [README.txt](https://github.com/ServiceStack/ServiceStack.UseCases/blob/master/SwaggerHelloWorld/README.txt) for more details. 
