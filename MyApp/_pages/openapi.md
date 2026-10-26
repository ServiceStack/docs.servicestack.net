---
title: Open API v3
---

![](/img/pages/openapi/v3/openapiv3-logo.png)

::: info
For documentation on using `OpenApiFeature` refer to [Open API v2](/openapi-v2) instead
:::

Utilizing the same ASP.NET Core [Endpoint Routing](/endpoint-routing) that the rest of the ASP.NET Core App uses enables 
your ServiceStack APIs to integrate with your wider ASP.NET Core application, opening up more opportunities for greater reuse.

This opens up the ability to use common third party tooling to implement application-wide features like OpenAPI v3 specification 
generation support for your endpoints offered by the `Swashbuckle.AspNetCore` package.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="zAq9hp7ojn4" style="background-image: url('https://img.youtube.com/vi/zAq9hp7ojn4/maxresdefault.jpg')"></lite-youtube>

To make this integration as easy as possible we maintain ServiceStack OpenAPI packages to incorporate additional 
information from your ServiceStack APIs into the generated OpenAPI metadata.

![](/img/pages/openapi/v3/openapi-v3-swagger-ui.png)

In this guide we will look at how you can take advantage of the new OpenAPI v3 Swagger support using mapped Endpoints, 
customizing the generated specification, as well as touch on other related changes when using [Endpoint Routing](/endpoint-routing).

### Which package should I use?

| Target Framework | NuGet Package                       | OpenAPI Generator              | UI          | add-in                |
|------------------|-------------------------------------|--------------------------------|-------------|-----------------------|
| .NET 10+         | `ServiceStack.OpenApi.Swashbuckle`  | `Swashbuckle.AspNetCore` v10   | Swagger UI  | `openapi-swashbuckle` |
| .NET 10+         | `ServiceStack.OpenApi.Microsoft`    | `Microsoft.AspNetCore.OpenApi` | Scalar UI   | `openapi-scalar`      |
| .NET 8           | `ServiceStack.AspNetCore.OpenApi`   | `Swashbuckle.AspNetCore` v8    | Swagger UI  | `openapi3`            |

:::info
.NET 10 Apps should use one of the new **.NET 10** packages which depend on **Microsoft.OpenApi v2**.
The existing `ServiceStack.AspNetCore.OpenApi` package remains for **.NET 8** Apps which depend on **Microsoft.OpenApi v1**.
:::

## AppHost Initialization

To use OpenAPI your ServiceStack App needs to be configured to use [Endpoint Routing](/endpoint-routing) and
[ASP.NET Core IOC](/net-ioc) where registration of your ServiceStack Services and App's Dependencies & Plugins need to be setup
before your `WebApplication` is built, e.g:

#### Program.cs
```csharp
// Register ServiceStack APIs, Dependencies and Plugins:
services.AddServiceStack(typeof(MyServices).Assembly);

var app = builder.Build();
//...

// Register ServiceStack AppHost
app.UseServiceStack(new AppHost(), options => {
    options.MapEndpoints();
});

app.Run();
```

Once configured to use Endpoint Routing you can use the [mix](/mix-tool) tool to apply the OpenAPI configuration
for your App's target framework.

## .NET 10 OpenAPI Support

.NET 10 has added support for generating OpenAPI schemas and API Explorer UIs with there now being multiple ways to 
generate OpenAPI schemas and multiple ways to view them. ServiceStack supports both popular options with 2 new NuGet packages:

### ServiceStack.OpenApi.Swashbuckle

<div class="not-prose">
  <img class="mx-auto my-4 max-w-3xl border" src="/img/pages/openapi/v3/swagger.webp">
</div>

Depends on:
  - Microsoft.OpenApi v2.x
  - Swashbuckle.AspNetCore v10.x

Which can be added to .NET 10 Projects with:

:::sh
npx add-in openapi-swashbuckle
:::

Which uses `Swashbuckle.AspNetCore` for generating OpenAPI schemas and displaying the Swagger UI.

#### Manually Configure Swashbuckle and Swagger UI

Alternatively add the NuGet package:

```xml
<PackageReference Include="ServiceStack.OpenApi.Swashbuckle" Version="10.*" />
```

Then add the `Configure.OpenApi.cs` [Modular Startup](/modular-startup) class to your project:

```csharp
[assembly: HostingStartup(typeof(MyApp.ConfigureOpenApi))]

namespace MyApp;

public class ConfigureOpenApi : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            if (context.HostingEnvironment.IsDevelopment())
            {
                services.AddEndpointsApiExplorer();
                services.AddSwaggerGen(); // Swashbuckle
                services.AddServiceStackSwagger();
                // services.AddBasicAuth<Data.ApplicationUser>();
                // services.AddApiKeys();
                // services.AddJwtAuth();

                services.AddTransient<IStartupFilter,StartupFilter>();
            }
        });

    public class StartupFilter : IStartupFilter
    {
        public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next) => app =>
        {
            // Provided by Swashbuckle library
            app.UseSwagger();
            app.UseSwaggerUI();
            next(app);
        };
    }
}
```

### ServiceStack.OpenApi.Microsoft

<div class="not-prose">
  <img class="mx-auto my-4 max-w-3xl border" src="/img/pages/openapi/v3/scalar.webp">
</div>

Depends on:
  - Microsoft.OpenApi v2.x
  - Microsoft.AspNetCore.OpenApi v10.x

Which can be added to .NET 10 Projects with:

:::sh
npx add-in openapi-scalar
:::

Which uses `Microsoft.AspNetCore.OpenApi` to generate OpenAPI schemas and is configured to use `Scalar.AspNetCore`
to display the Scalar UI from [scalar.com](https://scalar.com).

#### Manually Configure Microsoft.AspNetCore.OpenApi and Scalar UI

Alternatively add the NuGet packages:

```xml
<PackageReference Include="Scalar.AspNetCore" Version="2.*" />
<PackageReference Include="ServiceStack.OpenApi.Microsoft" Version="10.*" />
```

Then add the `Configure.OpenApi.cs` [Modular Startup](/modular-startup) class to your project:

```csharp
using Scalar.AspNetCore;

[assembly: HostingStartup(typeof(MyApp.ConfigureOpenApi))]

namespace MyApp;

public class ConfigureOpenApi : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            if (context.HostingEnvironment.IsDevelopment())
            {
                services.AddOpenApi();
                services.AddServiceStackOpenApi();
                // services.AddBasicAuth<Data.ApplicationUser>();
                // services.AddApiKeys();
                // services.AddJwtAuth();

                services.AddTransient<IStartupFilter,StartupFilter>();
            }
        });

    public class StartupFilter : IStartupFilter
    {
        public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next) => app =>
        {
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapOpenApi();
                endpoints.MapScalarApiReference();
            });
            next(app);
        };
    }
}
```

#### Resolving Microsoft.AspNetCore.OpenApi build errors

Using `Microsoft.AspNetCore.OpenApi` as-is results in build errors which require adding `<InterceptorsNamespaces>` 
to your **MyApp.csproj**:

```xml
<PropertyGroup>
  <InterceptorsNamespaces>$(InterceptorsNamespaces);Microsoft.AspNetCore.OpenApi.Generated</InterceptorsNamespaces>
</PropertyGroup>
```

Alternatively you can resolve build errors by disabling its XML Comment source generator:

```xml
<!-- Disable the XML comment source generator to avoid compatibility issues with Microsoft.OpenApi -->
<Target Name="DisableCompileTimeOpenApiXmlGenerator" BeforeTargets="CoreCompile">
  <ItemGroup>
    <Analyzer Remove="$(PkgMicrosoft_AspNetCore_OpenApi)\analyzers\dotnet\cs\Microsoft.AspNetCore.OpenApi.SourceGenerators.dll"/>
  </ItemGroup>
</Target>
```

Which requires `$(PkgMicrosoft_AspNetCore_OpenApi)` to be defined, by adding a direct package reference with `GeneratePathProperty`:

```xml
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="10.*" GeneratePathProperty="true" />
```

## .NET 8 OpenAPI Support

.NET 8 Apps should continue to use the `ServiceStack.AspNetCore.OpenApi` package which can be added with the 
[openapi3](https://gist.github.com/gistlyn/494a1def5aa9cfa47bfb2fb9d46ca353) Startup Configuration:

:::sh
npx add-in openapi3
:::

### Manually Configure OpenAPI v3 and Swagger UI 

This will install the required ASP.NET Core Microsoft, Swashbuckle and ServiceStack Open API NuGet packages:

```xml
<PackageReference Include="Microsoft.AspNetCore.OpenApi" Version="8.*" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="8.*" />
<PackageReference Include="ServiceStack.AspNetCore.OpenApi" Version="10.*" />
```

Then add the `Configure.OpenApi.cs` [Modular Startup](https://docs.servicestack.net/modular-startup) class to your project:

```csharp
[assembly: HostingStartup(typeof(MyApp.ConfigureOpenApi))]

namespace MyApp;

public class ConfigureOpenApi : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) =>
        {
            if (context.HostingEnvironment.IsDevelopment())
            {
                services.AddEndpointsApiExplorer();
                services.AddSwaggerGen(); // Swashbuckle

                services.AddServiceStackSwagger();
                services.AddBasicAuth<ApplicationUser>(); // Enable HTTP Basic Auth
                //services.AddJwtAuth(); // Enable & Use JWT Auth

                services.AddTransient<IStartupFilter, StartupFilter>();
            }
        });

    public class StartupFilter : IStartupFilter
    {
        public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
            => app => {
                // Provided by Swashbuckle library
                app.UseSwagger();
                app.UseSwaggerUI();
                next(app);
            };
    }
}
```

### API Explorer

ServiceStack's built-in [API Explorer](/api-explorer) is an alternative that doesn't require any additional packages
whose richer metadata enables more optimal form inputs with **validation bound forms** and code-generation for 
[11 programming languages](/add-servicestack-reference).

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

:::{.table}
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
:::

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

## More Control

One point of friction with our previous `OpenApiFeature` plugin was the missing customization ability to the OpenAPI spec to somewhat disconnect from the defined ServiceStack service, and related C# Request and Response DTOs since it used Request DTOs property attributes making the *structure* of the OpenAPI schema mapping quite ridged, preventing the ability for certain customizations.

For example, if we have an `UpdateTodo` Request DTO that looks like the following class:

```csharp
[Route("/todos/{Id}", "PUT")]
public class UpdateTodo : IPut, IReturn<Todo>
{
    public long Id { get; set; }
    [ValidateNotEmpty]
    public string Text { get; set; }
    public bool IsFinished { get; set; }
}
```

Previously, we would get a default Swagger UI that enabled all the properties as `Paramters` to populate:

![](/img/pages/openapi/v3/openapi-v2-defaults.png)

While this correctly describes the Request DTO structure, sometimes as developers we get requirements for how we want to present our APIs to our users from within the Swagger UI. 

With the updated SwaggerUI, and the use of the `Swashbuckle` library, we get the following UI by default:

![](/img/pages/openapi/v3/openapi-v3-defaults-application-json.png)

These are essentially the same, we have a CRUD Todo API that takes a `UpdateTodo` Request DTO, and returns a `Todo` Response DTO. ServiceStack needs to have uniquely named Request DTOs, so we can't have a `Todo` schema as the Request DTO despite the fact that it is the same structure as our `Todo` model. 
This is a good thing, as it allows us to have a clean API contract, and separation of concerns between our Request DTOs and our models. 
However, it might not be desired to present this to our users, since it can be convenient to think about CRUD services as taking the same resource type as the response.

To achieve this, we use the Swashbuckle library to customize the OpenAPI spec generation. Depending on what you want to customize, you can use the `SchemaFilter` or `OperationFilter` options. In this case, we want to customize the matching operation to reference the `Todo` schema for the Request Body.

First, we create a new class that implements the `IOperationFilter` interface.

```csharp
public class OperationRenameFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        if (context.ApiDescription.HttpMethod == "PUT" &&
            context.ApiDescription.RelativePath == "todos/{Id}")
        {
            operation.RequestBody.Content["application/json"].Schema.Reference = 
                new OpenApiReference {
                    Type = ReferenceType.Schema,
                    Id = "Todo"
                };
        }
    }
}
```

The above matches some information about the `UpdateTodo` request we want to customize, and then sets the `Reference` property of the `RequestBody` to the `Todo` schema.
We can then add this to the `AddSwaggerGen` options in the `Program.cs` file.

```csharp
builder.Services.AddSwaggerGen(o =>
{
    o.OperationFilter<OperationRenameFilter>();
});
```

The result is the following Swagger UI:

![](/img/pages/openapi/v3/openapi-v3-customized-application-json.png)

This is just one simple example of how you can customize the OpenAPI spec generation, and `Swashbuckle` has some great documentation on the different ways you can customize the generated spec.
And these customizations impact any of your ASP.NET Core Endpoints, not just your ServiceStack APIs.

Now that ServiceStack APIs can be mapped to standard ASP.NET Core Endpoints, it opens up a lot of possibilities for integrating your 
ServiceStack APIs into the larger ASP.NET Core ecosystem. 
