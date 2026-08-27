---
slug: csharp-add-servicestack-reference
title: C# ServiceStack Reference
---

:::{.shadow .-ml-12 .w-[940px] .rounded-md}
![](/img/pages/servicestack-reference/csharp-info.webp)
:::

Add ServiceStack Reference generates your API's C# DTOs from a running ServiceStack App. It gives .NET clients an end-to-end typed API without sharing the server's ServiceModel assembly, so client and server projects can be versioned, deployed and updated independently.

The generated source retains the API contract needed by ServiceStack's generic .NET clients, including routes, HTTP verb markers, response types, validation metadata, nullability, inheritance, collections, enums and AutoQuery conventions.

## Productive end-to-end typed APIs for .NET

The recommended `JsonApiClient` in [ServiceStack.Client](https://nuget.org/packages/ServiceStack.Client) consumes the same DTO contract your API is defined with. Consumers generate it from the **deployed API** instead of taking a binary dependency on the server:

```csharp
var api = await client.ApiAsync(new Hello { Name = "World" });
if (api.Succeeded)
{
    Console.WriteLine(api.Response.Result);
}
```

`Api`/`ApiAsync` return an `ApiResult<T>` so success and structured validation errors can be handled as values instead of exceptions. This is ideal for Blazor, MAUI, desktop and console Apps, and the generated DTOs can also use the rest of the .NET client API including authentication, typed AutoQuery, batched and one-way requests, file uploads and Service Gateway support.

## Add ServiceStack Reference

The cross-platform [`x` tool](/dotnet-tool) is the simplest way to generate a C# reference from any IDE or build environment:

```sh
dotnet tool install --global x
x csharp https://api.example.com
dotnet add package ServiceStack.Client
```

This saves the generated contract to `dtos.cs`. The `cs` alias can be used for shorter commands:

```sh
x cs https://api.example.com
```

Visual Studio users can alternatively use [ServiceStackVS's](/templates/install-servicestackvs) **Add ServiceStack Reference** project context menu. Enter the Base URL and destination filename and it will add both the generated DTOs and the `ServiceStack.Client` NuGet package.

The server remains the source of truth in either workflow. No server implementation, database model or binary dependency is copied into the client.

## Update ServiceStack Reference

After the API contract changes, run this from the client solution to refresh its C# references:

```sh
x csharp
```

The tool finds existing references from the `BaseUrl` in each generated file's header and preserves any uncommented customization options. In Visual Studio, the equivalent action is **Update ServiceStack Reference** on the generated DTO file.

Generated files should be treated as replaceable source. Add client-only behavior in separate `partial` class files instead of editing generated type bodies.

## What is generated

A server request such as `Hello` is emitted with its public API metadata and inferred response type:

```csharp
[Route("/hello")]
[Route("/hello/{Name}")]
public partial class Hello : IReturn<HelloResponse>
{
    [Required]
    public virtual string Name { get; set; }
    public virtual string? Title { get; set; }
}

public partial class HelloResponse
{
    public virtual string? Result { get; set; }
}
```

This generated metadata gives the client several useful capabilities:

- `IReturn<HelloResponse>` lets client methods infer their return type at compile time.
- `[Route]` lets the client select a matching custom route and substitute path properties such as `Name`.
- `IGet`, `IPost`, `IPut`, `IPatch` and `IDelete` let `Send`/`SendAsync` infer the HTTP method.
- `IReturnVoid` represents commands which intentionally return no response body.
- Nullable annotations, `[Required]`, descriptions and supported serialization attributes preserve contract intent for IDEs and UI validation.
- Generic types, inheritance, nested types, interfaces, enums, arrays, lists and dictionaries are generated as native C# types.

The generated response marker works for more than response DTO classes:

| Server contract | Typed C# result |
| --- | --- |
| `IReturn<string>` | Scalar value |
| `IReturn<Item[]>` | Array |
| `IReturn<List<Item>>` | Generic collection |
| `IReturn<Dictionary<string,Item>>` | Typed map |
| `IReturn<QueryResponse<Item>>` | AutoQuery results, totals and metadata |
| `IReturn<byte[]>` | Raw binary response |
| `IReturn<Stream>` | Response stream |
| `IReturnVoid` | No response body |

## Call generated APIs

Create one client for the API's Base URL and pass generated Request DTOs to it:

```csharp
var client = new JsonApiClient("https://api.example.com");

HelloResponse response = await client.GetAsync(new Hello {
    Name = "World"
});

Console.WriteLine(response.Result);
```

Both synchronous and asynchronous typed APIs are available. Use an explicit verb when the caller should choose it:

```csharp
var syncResponse = client.Post(new Hello { Name = "World" });
var asyncResponse = await client.PostAsync(new Hello { Name = "World" });
```

When the generated Request DTO has a verb marker, `SendAsync` chooses it automatically:

```csharp
public partial class HelloGet : IReturn<HelloVerbResponse>, IGet
{
    public int Id { get; set; }
}

HelloVerbResponse response = await client.SendAsync(new HelloGet { Id = 1 });
```

This is useful in application layers that queue, log, retry or dispatch request messages generically without coupling that code to URLs or HTTP verbs.

### Current `JsonApiClient` behavior

`JsonApiClient` is the current `HttpClient`-based implementation for .NET 6+. It uses `/api/` as the fallback route for Request DTOs without a matching custom route. Custom routes are preferred when using typed `Get`, `Post`, `Put`, `Patch` and `Delete` methods, whilst `Send`/`SendAsync` use the generated HTTP verb marker and default to `POST` when a Request DTO has none.

It can create and reuse its own `HttpClient`, accept an existing `HttpClient`, or be registered with .NET's typed client factory:

```csharp
builder.Services.AddJsonApiClient("https://api.example.com");
```

All async request methods accept a `CancellationToken`:

```csharp
var response = await client.SendAsync(
    new HelloGet { Id = 1 }, cancellationToken);
```

The client also provides:

- Cookie, Basic, Bearer Token and automatic Refresh Token authentication.
- Per-client and global request/response filters, custom headers and typed URL resolvers.
- Optional request compression; its default handler automatically decompresses Brotli, GZip and Deflate responses.
- Direct `string`, `byte[]` and `Stream` responses in addition to JSON DTOs.
- Batched requests, one-way publishing, file uploads and multipart form APIs.
- Both sync and async APIs, including custom HTTP methods and custom URLs.

For token-authenticated APIs, the client can retry a `401` once after using its Refresh Token to obtain a new Bearer Token:

```csharp
var client = new JsonApiClient("https://api.example.com") {
    BearerToken = auth.BearerToken,
    RefreshToken = auth.RefreshToken,
    EnableAutoRefreshToken = true,
};
```

Its `SessionId` and `Version` settings are also copied onto generated requests which implement `IHasSessionId` and `IHasVersion`.

### Handle errors as values

Use `ApiAsync` when validation and API failures are expected application outcomes, such as submitting a form:

```csharp
var api = await client.ApiAsync(new Hello { Name = form.Name });

if (api.Succeeded)
{
    Console.WriteLine(api.Response.Result);
}
else
{
    Console.WriteLine($"{api.Error?.ErrorCode}: {api.ErrorMessage}");
    Console.WriteLine(api.FieldErrorMessage(nameof(form.Name)));
    // api.Errors is always an array and contains any field validation errors
}
```

`ApiResult<T>` contains either the typed `Response` or the API's structured `ResponseStatus` in `Error`. It also provides `Errors`, `ErrorSummary`, `FieldError()`, `FieldErrorMessage()` and `HasFieldError()` helpers, which makes it easy to bind field errors directly to Blazor or MAUI forms.

The lower-level `Get`, `Post`, `Send` and async equivalents throw `WebServiceException` for failed responses:

```csharp
try
{
    var response = await client.SendAsync(new Authenticate {
        provider = "credentials",
        UserName = userName,
        Password = password,
    });
}
catch (WebServiceException ex)
{
    Console.WriteLine(ex.StatusCode);                    // e.g. 401
    Console.WriteLine(ex.StatusDescription);             // Unauthorized
    Console.WriteLine(ex.ResponseStatus.ErrorCode);      // Unauthorized
    Console.WriteLine(ex.ResponseStatus.Message);        // server message
}
```

This retains both HTTP-level details and ServiceStack's structured error response, including individual validation errors.

### Batch and one-way requests

Request DTOs of the same type can be sent in one HTTP request and returned in the same order:

```csharp
List<HelloResponse> responses = await client.SendAllAsync(new[] {
    new Hello { Name = "A" },
    new Hello { Name = "B" },
    new Hello { Name = "C" },
}, cancellationToken);
```

Use one-way publishing when the client does not need to wait for a response DTO:

```csharp
await client.PublishAsync(new HelloReturnVoid { Id = 1 }, cancellationToken);
```

`PublishAllAsync` provides the batched equivalent. These APIs are useful for commands, background work and high-throughput integrations.

### Typed AutoQuery

AutoQuery Request DTOs retain their generic query and response contracts:

```csharp
[Route("/rockstars", "GET")]
public partial class QueryRockstars
    : QueryDb<Rockstar>, IReturn<QueryResponse<Rockstar>>
{
}
```

They use the same client, with paging, ordering, field selection and typed results provided by `QueryDb<T>` and `QueryResponse<T>`:

```csharp
QueryResponse<Rockstar> query = await client.GetAsync(new QueryRockstars {
    Skip = 0,
    Take = 25,
    OrderBy = "Age"
});

Console.WriteLine($"Showing {query.Results.Count} of {query.Total}");
```

For lazy synchronous enumeration over a large result set, `GetLazy()` follows AutoQuery pages and yields each row without callers managing `Skip` themselves.

### Rich .NET data contracts

Generated DTOs preserve .NET primitives and common compound types including nullable values, `decimal`, `Guid`, `DateTime`, `DateTimeOffset`, `TimeSpan`, `byte[]`, arrays, lists and nested dictionaries. ServiceStack's client serializer also uses the same rules for route, query-string and request-body serialization, so a DTO can move between those transports without hand-written mapping.

For example, route values are substituted into the route and remaining values are encoded in the query string for GET requests. Default value types such as `false` and `0` are preserved when serialized in request bodies.

### File uploads and multipart forms

Upload APIs can combine generated Request DTO metadata with one or more file streams:

```csharp
await using var audio = File.OpenRead("recording.wav");

TextGenerationResponse response = await client.PostFileWithRequestAsync(
    new SpeechToText { RefId = "task-42", Tag = "meeting" },
    new UploadFile("recording.wav", audio, nameof(SpeechToText.Audio)),
    cancellationToken);
```

Use `PostFilesWithRequestAsync` for multiple files, `PostFileAsync` when no Request DTO is needed, or `ApiFormAsync` when multipart form errors should be returned in an `ApiResult<T>`.

### Proxy and API gateway endpoints

The Base URL can include a path prefix, which lets the same generated DTOs call a downstream ServiceStack API through a proxy or API gateway:

```csharp
var client = new JsonApiClient("https://gateway.example.com/techstacks");

var response = await client.GetAsync(new GetTechnology {
    Slug = "ServiceStack"
});
```

Typed responses and structured `WebServiceException` errors continue to work through the proxy. This is useful for exposing multiple internal services behind one public host, tenant-specific routing or custom load balancing.

### Integration testing

Generated DTOs also make black-box integration tests concise: the test exercises the same route, serialization, response and error contract as production clients.

```csharp
[Test]
public async Task Echoes_all_supported_values()
{
    var client = new JsonApiClient(TestConfig.BaseUrl);
    var request = new EchoTypes {
        Byte = 1,
        Short = 2,
        Int = 3,
        Long = 4,
        Float = 1.1f,
        String = "value"
    };

    var response = await client.PostAsync(request);

    Assert.That(response.Int, Is.EqualTo(request.Int));
    Assert.That(response.Float, Is.EqualTo(request.Float));
    Assert.That(response.String, Is.EqualTo(request.String));
}
```

This pattern is equally useful for testing authenticated APIs, AutoQuery responses, validation failures and APIs exposed behind a proxy path.

## Use in any .NET App

Because a ServiceStack Reference is ordinary C# source and `ServiceStack.Client` supports current .NET targets, the same contract and client patterns can be shared across ASP.NET Core, Blazor, MAUI, desktop, console, worker and test projects.

## DTO Customization Options

The options in each generated file's header control how its C# DTOs are generated. Commented options are server defaults. To override one, remove its `//`, change the value, then run `x csharp` or use Visual Studio's **Update ServiceStack Reference** action:

```csharp
/* Options:
Date: 2026-08-27 12:00:00
Version: 10.1.5
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://api.example.com

//GlobalNamespace: 
//MakePartial: True
//MakeVirtual: True
//MakeInternal: False
//MakeDataContractsExtensible: False
//AddNullableAnnotations: True
//AddReturnMarker: True
//AddDescriptionAsComments: True
//AddDataContractAttributes: False
//AddIndexesToDataMembers: False
//AddGeneratedCodeAttributes: False
//AddResponseStatus: False
//AddImplicitVersion: 
//InitializeCollections: False
//ExportValueTypes: False
//IncludeTypes: 
//ExcludeTypes: 
//AddNamespaces: 
//AddDefaultXmlNamespace: http://schemas.servicestack.net/types
*/
```

To override these options on the client, the `//` has to be removed. For example, if we did not want our classes to be partial by default for the C# client, our options would look like below:

```csharp
/* Options:
Date: 2026-08-27 12:00:00
Version: 10.1.5
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://api.example.com

//GlobalNamespace: 
MakePartial: False
//MakeVirtual: True
//MakeInternal: False
//MakeDataContractsExtensible: False
//AddNullableAnnotations: True
//AddReturnMarker: True
//AddDescriptionAsComments: True
//AddDataContractAttributes: False
//AddIndexesToDataMembers: False
//AddGeneratedCodeAttributes: False
//AddResponseStatus: False
//AddImplicitVersion: 
//InitializeCollections: False
//ExportValueTypes: False
//IncludeTypes: 
//ExcludeTypes: 
//AddNamespaces: 
//AddDefaultXmlNamespace: http://schemas.servicestack.net/types
*/
```

Options that do not start with a `//` are sent to the server to override any defaults set by the server.

### Change Default Server Configuration

The above defaults are also overridable on the ServiceStack Server by modifying the default config on the `NativeTypesFeature` Plugin, e.g:

```csharp
var nativeTypes = this.GetPlugin<NativeTypesFeature>();
nativeTypes.MetadataTypesConfig.MakeVirtual = false;
...
```

### Customize DTO Type generation

Additional C# specific customization can be statically configured like `PreTypeFilter`, `InnerTypeFilter` & `PostTypeFilter` (available in all languages) can be used to inject custom code 
in the generated DTOs output. 

Use the `PreTypeFilter` to generate source code before and after a Type definition, e.g. this will append the `[Validate]` attribute on non enum & interface types:

```csharp
CSharpGenerator.PreTypeFilter = (sb, type) => {
    if (!type.IsEnum.GetValueOrDefault() && !type.IsInterface.GetValueOrDefault())
    {
        sb.AppendLine("[Validate]");
    }
};
```

The `InnerTypeFilter` gets invoked just after the Type Definition which can be used to generate common members for all Types and interfaces, e.g:

```csharp
CSharpGenerator.InnerTypeFilter = (sb, type) => {
    sb.AppendLine("public string Id { get; } = Guid.NewGuid().ToString();");
};
```

There's also `PrePropertyFilter` & `PostPropertyFilter` for generating source before and after properties, e.g:

```csharp
CSharpGenerator.PrePropertyFilter = (sb , prop, type) => {
    if (prop.Name == "Id")
    {
        sb.AppendLine("[PrimaryKey]");
    }
};
```

### Emit custom code

To enable greater flexibility when generating complex Typed DTOs, you can use `[Emit{Language}]` attributes to generate code before each type or property.

These attributes can be used to generate different attributes or annotations to enable client validation for different validation libraries in different languages, e.g:

```csharp
[EmitCSharp("[Validate]")]
[EmitCode(Lang.CSharp | Lang.Swift | Lang.Dart, "// App User")]
public class User : IReturn<User>
{
    [EmitCSharp("[IsNotEmpty]","[IsEmail]")]
    [EmitCode(Lang.Swift | Lang.Dart, new[]{ "@isNotEmpty()", "@isEmail()" })]
    public string Email { get; set; }
}
```

Which will generate `[EmitCsharp]` code in C# DTOs:

```csharp
[Validate]
// App User
public partial class User
    : IReturn<User>
{
    [IsNotEmpty]
    [IsEmail]
    public virtual string Email { get; set; }
}
```

Whilst the generic `[EmitCode]` attribute lets you emit the same code in multiple languages with the same syntax.

We'll go through and cover each of the above options to see how they affect the generated DTOs:

### GlobalNamespace

Specify which namespace the generated C# DTOs should use:

```csharp
namespace Acme 
{
    //...
}
```

### MakePartial

Adds the `partial` modifier to all types, letting you extend generated DTOs with your own class separate from the generated types:

```csharp
public partial class GetAnswers { ... }
```

### MakeVirtual

Adds the `virtual` modifier to all properties:

```csharp
public partial class GetAnswers {
    ...
    public virtual int QuestionId { get; set; }
}
```

### MakeInternal

Changes generated top-level types from `public` to `internal`, which is useful when the ServiceStack Reference should remain an implementation detail of the client assembly:

```csharp
internal partial class GetAnswers { ... }
```

### MakeDataContractsExtensible

Add .NET's DataContract [ExtensionDataObject](https://learn.microsoft.com/en-us/dotnet/api/system.runtime.serialization.extensiondataobject) to all DTOs:

```csharp
public partial class GetAnswers
    : IReturn<GetAnswerResponse>, IExtensibleDataObject
{
    ...
    public virtual ExtensionDataObject ExtensionData { get; set; }
}
```

### AddNullableAnnotations

Nullable reference annotations are enabled by default in the current C# generator. Required reference properties are emitted as non-nullable and optional properties are emitted with `?`, e.g:

```csharp
public class Data
{
    public int Value { get; set; }
    public int? OptionalValue { get; set; }
    public string Text { get; set; }
    public string? OptionalText { get; set; }
    public List<string> Texts { get; set; }
    public List<string>? OptionalTexts { get; set; }
}
```

Will generate DTOs, preserving properties with nullable reference type annotations:

```csharp
public class Data
{
    public virtual int Value { get; set; }
    public virtual int? OptionalValue { get; set; }
    public virtual string Text { get; set; }
    public virtual string? OptionalText { get; set; }
    public virtual List<string> Texts { get; set; } = [];
    public virtual List<string>? OptionalTexts { get; set; }
}
```

Optionally if your DTOs do not have nullable reference annotations enabled but you would still like to generate DTOs with them included, you can mark properties as required with the `[Required]` attribute, e.g:

```csharp
public class Data
{
    [Required]
    public string? Text { get; set; }
    [Required]
    public List<string>? Texts { get; set; }
}
```

Where it will generate otherwise optional properties as non-nullable reference types:

```csharp
public class Data
{
    [Required]
    public virtual string Text { get; set; }

    [Required]
    public virtual List<string> Texts { get; set; } = [];
}
```

### AddReturnMarker

When true, annotates Request DTOs with an `IReturn<TResponse>` marker referencing the Response type ServiceStack infers your Service to return:

```csharp
public class GetAnswers
    : IReturn<GetAnswersResponse> { ... }
``` 

> Original DTO doesn't require a return marker as response type can be inferred from Services return type or when using the `%Response` DTO Naming convention

### AddDescriptionAsComments

Converts any textual Description in `[Description]` attributes as C# Doc comments which allows your API to add intellisense in client projects:

```csharp
///<summary>
///Get a list of Answers for a Question
///</summary>
public class GetAnswers { ... }
```

### AddDataContractAttributes

Decorates all DTO types with `[DataContract]` and properties with `[DataMember]` as well as adding default XML namespaces for all C# namespaces used:

```csharp
[assembly: ContractNamespace("http://schemas.servicestack.net/types", 
           ClrNamespace="StackApis.ServiceModel.Types")]
[assembly: ContractNamespace("http://schemas.servicestack.net/types", 
           ClrNamespace="StackApis.ServiceModel")]
...

[DataContract]
public partial class GetAnswers
{
    [DataMember]
    public virtual int QuestionId { get; set; }
}
```

### AddIndexesToDataMembers

Populates a `DataMember` Order index for all properties:

```csharp
[DataContract]
public partial class GetAnswers
{
    [DataMember(Order=1)]
    public virtual int QuestionId { get; set; }
}
```

> Requires AddDataContractAttributes=true

### AddGeneratedCodeAttributes

Emit `[GeneratedCode]` attribute on all generated Types:

```csharp
[GeneratedCode]
public partial class GetAnswers { ... }
```

### AddResponseStatus

Automatically add a `ResponseStatus` property on all Response DTOs, regardless if it wasn't already defined:

```csharp
public class GetAnswersResponse
{
    ...
    public ResponseStatus ResponseStatus { get; set; }
}
```

### AddImplicitVersion

Usage: 
```
/* Options:
AddImplicitVersion: 1
```

Lets you specify the Version number to be automatically populated in all Request DTOs sent from the client: 

```csharp
public partial class GetAnswers
    : IReturn<GetAnswersResponse>
{
    public virtual int Version { get; set; }

    public GetAnswers()
    {
        Version = 1;
    }
    ...
}
```

This lets you know what Version of the Service Contract that existing clients are using making it easy to implement ServiceStack's [recommended versioning strategy](http://stackoverflow.com/a/12413091/85785). 

### InitializeCollections

Usage: 
```
/* Options:
InitializeCollections: True
```

Lets you automatically initialize collections in generated DTOs with current C# collection expressions:

```csharp
public class SearchQuestions
{
    public List<string> Tags { get; set; } = [];
    ...
}
```

Initialized collections lets you take advantage of C#'s collection initializers for a nicer client API:

```csharp
var response = client.Get(new SearchQuestions { 
    Tags = { "redis", "ormlite" }
});
```

### ExportValueTypes

By default custom value types are represented as strings unless they are enums. Enable `ExportValueTypes` to emit and reference their value type definitions instead:

```
/* Options:
ExportValueTypes: True
```

### IncludeTypes
Is used as a Whitelist to specify only the types you would like to have code-generated:

```
/* Options:
IncludeTypes: GetTechnology,GetTechnologyResponse
```

Will only generate `GetTechnology` and `GetTechnologyResponse` DTO's:

```csharp
public class GetTechnology { ... }
public class GetTechnologyResponse { ... }
```

#### Include Generic Types

Use .NET's Type Name to include Generic Types, i.e. the Type name separated by the backtick followed by the number of generic arguments, e.g:

```
IncludeTypes: IReturn`1,MyPair`2
```

#### Include Request DTO and its dependent types

You can include a Request DTO and all its dependent types with a `.*` suffix on the Request DTO, e.g:

```
/* Options:
IncludeTypes: GetTechnology.*
```

Which will include the `GetTechnology` Request DTO, the `GetTechnologyResponse` Response DTO and all Types that they both reference.

#### Include All Types within a C# namespace

If your DTOs are grouped into different namespaces they can be all included using the `/*` suffix, e.g:

```
/* Options:
IncludeTypes: MyApp.ServiceModel.Admin/*
```

This will include all DTOs within the `MyApp.ServiceModel.Admin` C# namespace. 

#### Include All Services in a Tag Group

Services [grouped by Tag](/api-design#group-services-by-tag) can be used in the `IncludeTypes` where tags can be specified using braces in the format `{tag}` or `{tag1,tag2,tag3}`, e.g:

```
/* Options:
IncludeTypes: {web,mobile}
```

Or individually:

```
/* Options:
IncludeTypes: {web},{mobile}
```

### ExcludeTypes
Is used as a Blacklist to specify which types you would like excluded from being generated:

```
/* Options:
ExcludeTypes: GetTechnology,GetTechnologyResponse
```

Will exclude `GetTechnology` and `GetTechnologyResponse` DTOs from being generated.

### AddNamespaces

Include additional C# namespaces, e.g:

```
/* Options:
AddNamespaces: System.Drawing,MyApp
```

Where it will generate the specified namespaces in the generated Types:

```csharp
using System.Drawing;
using MyApp;
```

### AddDefaultXmlNamespace

This lets you change the default DataContract XML namespace used for all C# namespaces:

```csharp
[assembly: ContractNamespace("http://my.types.net", 
           ClrNamespace="StackApis.ServiceModel.Types")]
[assembly: ContractNamespace("http://my.types.net", 
           ClrNamespace="StackApis.ServiceModel")]
```

> Requires AddDataContractAttributes=true
