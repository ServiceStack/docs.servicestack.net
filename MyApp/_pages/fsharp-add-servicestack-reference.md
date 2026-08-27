---
slug: fsharp-add-servicestack-reference
title: F# ServiceStack Reference
---

:::{.shadow .-ml-12 .w-[940px] .rounded-md}
![](/img/pages/servicestack-reference/fsharp-info.webp)
:::

Add ServiceStack Reference generates your API's F# DTOs from a running ServiceStack App. It gives F# clients an end-to-end typed API without sharing the server's ServiceModel assembly, so client and server projects can be versioned, deployed and updated independently.

The generated source retains routes, HTTP verb markers, response types, validation metadata, inheritance, collections, enums and AutoQuery conventions. It can be used from compiled applications, `dotnet fsi` scripts and [Jupyter notebooks](/jupyter-notebooks-fsharp).

## Productive typed APIs for F#

F# uses the same current `JsonApiClient` and `ServiceStack.Client` package as C#. Generated classes use named property initialization and expose strongly typed responses:

```fsharp
let client = JsonApiClient("https://api.example.com")

let response = client.Get(Hello(Name = "World"))
printfn "%s" response.Result
```

This is particularly useful for data processing, automation and integration code where a concise F# workflow still needs production API contracts, structured errors and authentication rather than hand-written JSON handling.

## Add ServiceStack Reference

Use the cross-platform [`x` tool](/dotnet-tool) from any IDE or build environment:

```sh
dotnet tool install --global x
x fsharp https://api.example.com
dotnet add package ServiceStack.Client
```

This saves the generated contract to `dtos.fs`. The `fs` alias provides a shorter command:

```sh
x fs https://api.example.com
```

F# compiles files in project order, so ensure `dtos.fs` appears before files which use its types:

```xml
<ItemGroup>
  <Compile Include="dtos.fs" />
  <Compile Include="Program.fs" />
</ItemGroup>
```

Visual Studio users can alternatively use [ServiceStackVS's](/templates/install-servicestackvs) **Add ServiceStack Reference** project context menu.

## Update ServiceStack Reference

After the API contract changes, run this from the client solution:

```sh
x fsharp
```

The tool finds existing references from the `BaseUrl` in their generated headers and preserves uncommented customization options. You can also update one file directly with `x dtos.fs`. In Visual Studio, use **Update ServiceStack Reference** on files ending in `.dto.fs` or `.dtos.fs`.

Generated files should be treated as replaceable source. Put client-only functions and extensions in separate source files.

## What is generated

A `Hello` API is emitted as an F# class with its routes, supported attributes and inferred response marker:

```fsharp
[<Route("/hello")>]
[<Route("/hello/{Name}")>]
[<AllowNullLiteral>]
type Hello() =
    interface IReturn<HelloResponse>

    [<Required>]
    member val Name:String = null with get,set

    member val Title:String = null with get,set

[<AllowNullLiteral>]
type HelloResponse() =
    member val Result:String = null with get,set
```

The generated contract provides:

- `IReturn<HelloResponse>` for compile-time response inference.
- `[<Route>]` metadata for custom route selection and path substitution.
- `IGet`, `IPost`, `IPut`, `IPatch` and `IDelete` markers for `Send`/`SendAsync` HTTP method inference.
- `IReturnVoid` for commands which intentionally return no response body.
- Native F#/.NET representations for enums, arrays, `ResizeArray<_>`, dictionaries, inheritance and interfaces.
- Supported descriptions and serialization attributes for IntelliSense and wire compatibility.

| Generated contract | Typed F# result |
| --- | --- |
| `IReturn<String>` | String |
| `IReturn<Item[]>` | Array |
| `IReturn<ResizeArray<Item>>` | Mutable generic collection |
| `IReturn<Dictionary<String,Item>>` | Typed dictionary |
| `IReturn<QueryResponse<Item>>` | AutoQuery results, totals and metadata |
| `IReturn<Byte[]>` | Raw binary response |
| `IReturn<Stream>` | Response stream |
| `IReturnVoid` | No response body |

## Call generated APIs

The client provides both synchronous and asynchronous typed methods. In asynchronous F# workflows, use a `task` expression:

```fsharp
let callHello cancellationToken = task {
    let client = JsonApiClient("https://api.example.com")

    let! response =
        client.GetAsync(Hello(Name = "World"), cancellationToken)

    printfn "%s" response.Result
}
```

Use an explicit HTTP method when the caller should choose it:

```fsharp
let syncResponse = client.Post(Hello(Name = "World"))
let! asyncResponse = client.PostAsync(Hello(Name = "World"))
```

When the generated request has a verb marker, `SendAsync` chooses it automatically:

```fsharp
[<AllowNullLiteral>]
type HelloGet() =
    interface IReturn<HelloVerbResponse>
    interface IGet
    member val Id:Int32 = 0 with get,set

let! response = client.SendAsync(HelloGet(Id = 1), cancellationToken)
```

### Current `JsonApiClient` capabilities

`JsonApiClient` is the current `HttpClient`-based implementation for .NET 6+. It uses `/api/` as the fallback route, prefers matching custom routes for explicit HTTP methods, and defaults unmarked `Send` requests to `POST`.

It supports:

- Per-call cancellation and .NET typed-client registration with `AddJsonApiClient`.
- Cookie, Basic, Bearer Token and automatic Refresh Token authentication.
- Request/response filters, custom headers, URL resolvers and request compression.
- Direct `String`, `Byte[]` and `Stream` responses in addition to JSON DTOs.
- Batching, one-way publishing, file uploads, multipart forms and custom HTTP methods.

Register it with .NET's typed client factory from application startup:

```fsharp
services.AddJsonApiClient("https://api.example.com") |> ignore
```

Configure automatic token renewal when an authenticated API returns `401`:

```fsharp
let client = JsonApiClient("https://api.example.com")
client.BearerToken <- auth.BearerToken
client.RefreshToken <- auth.RefreshToken
client.EnableAutoRefreshToken <- true
```

The client's `SessionId` and `Version` are also copied onto generated requests implementing `IHasSessionId` and `IHasVersion`.

### Handle errors as values

`ApiAsync` returns `ApiResult<'Response>` so validation and API failures can remain normal application values:

```fsharp
let! api = client.ApiAsync(Hello(Name = form.Name), cancellationToken)

if api.Succeeded then
    printfn "%s" api.Response.Result
else
    printfn "%s" api.ErrorMessage
    printfn "%s" (api.FieldErrorMessage("Name"))
```

`ApiResult<_>` also exposes `Errors`, `ErrorSummary`, `FieldError()`, `FieldErrorMessage()` and `HasFieldError()` for form and validation workflows.

The lower-level client APIs throw `WebServiceException` for failed responses:

```fsharp
try
    let! response = client.PostAsync(Hello(Name = null), cancellationToken)
    printfn "%s" response.Result
with :? WebServiceException as ex ->
    printfn "%i %s" ex.StatusCode ex.StatusDescription
    printfn "%s: %s" ex.ResponseStatus.ErrorCode ex.ResponseStatus.Message
```

### Batch and one-way requests

Send multiple requests of the same type in a single HTTP request:

```fsharp
let requests : IReturn<HelloResponse>[] =
    [| Hello(Name = "A")
       Hello(Name = "B")
       Hello(Name = "C") |]

let! responses = client.SendAllAsync(requests, cancellationToken)
```

Use `PublishAsync` or `PublishAllAsync` for one-way commands which do not need a response DTO:

```fsharp
do! client.PublishAsync(HelloReturnVoid(Id = 1), cancellationToken)
```

### Typed AutoQuery

Generated AutoQuery requests retain their generic query contracts:

```fsharp
[<Route("/rockstars", "GET")>]
[<AllowNullLiteral>]
type QueryRockstars() =
    inherit QueryDb<Rockstar>()
    interface IReturn<QueryResponse<Rockstar>>
```

Use inherited paging, ordering, projection and metadata properties with typed results:

```fsharp
let request = QueryRockstars()
request.Skip <- Nullable 0
request.Take <- Nullable 25
request.OrderBy <- "Age"

let! query = client.GetAsync(request, cancellationToken)
printfn "Showing %i of %i" query.Results.Count query.Total
```

`GetLazy()` also provides lazy synchronous enumeration across AutoQuery pages.

### Rich .NET data contracts

Generated DTOs preserve .NET primitives and compound types including `Nullable<_>`, `Decimal`, `Guid`, `DateTime`, `DateTimeOffset`, `TimeSpan`, byte arrays, F# arrays, `ResizeArray<_>` and nested dictionaries. The same serializer handles route, query-string and request-body values, avoiding transport-specific mapping code.

### File uploads

Combine a generated Request DTO with a file stream:

```fsharp
use audio = File.OpenRead("recording.wav")

let request = SpeechToText(RefId = "task-42", Tag = "meeting")
let file = UploadFile("recording.wav", audio, "Audio")
let! response =
    client.PostFileWithRequestAsync(request, file, cancellationToken)
```

Use `PostFilesWithRequestAsync` for multiple streams or `ApiFormAsync` when multipart form failures should be returned as `ApiResult<_>`.

### Proxy and API gateway endpoints

The Base URL can include a path prefix, allowing the same generated DTOs to call a downstream ServiceStack API through a proxy or gateway:

```fsharp
let client = JsonApiClient("https://gateway.example.com/techstacks")
let! response =
    client.GetAsync(GetTechnology(Slug = "ServiceStack"), cancellationToken)
```

Typed responses and structured `WebServiceException` errors continue to work through the proxy. This is useful for exposing multiple internal services behind one public host or applying tenant-specific routing.

### Integration testing

Generated contracts make black-box API tests concise and representative of production clients:

```fsharp
[<Test>]
let ``echoes supported values`` () = task {
    let client = JsonApiClient(TestConfig.BaseUrl)
    let request = EchoTypes(Int = 3, Float = 1.1f, String = "value")

    let! response = client.PostAsync(request)

    Assert.That(response.Int, Is.EqualTo(request.Int))
    Assert.That(response.Float, Is.EqualTo(request.Float))
    Assert.That(response.String, Is.EqualTo(request.String))
}
```

The same pattern covers authenticated APIs, validation failures, AutoQuery and APIs exposed behind proxy path prefixes.

## Use in any .NET App

Because a ServiceStack Reference is ordinary F# source and `ServiceStack.Client` supports current .NET targets, the same contract and client patterns can be shared across ASP.NET Core, Blazor, MAUI, desktop, console, worker, scripting and test projects.

## F# generation constraints

F# requires dependency-ordered type definitions. To avoid conflicts between dependency order and C# namespace order, the generator places all DTOs in a single namespace. By default it uses the base **ServiceModel** namespace, which can be changed with `GlobalNamespace`:

```csharp
typesConfig.GlobalNamespace = "Client.Namespace";
```

Each generated type name must therefore be unique. C# nested classes are also emitted as top-level F# classes.

## DTO customization options

The options in each generated file's header control how its F# DTOs are generated. Commented options are server defaults. To override one, remove its `//`, change the value, then run `x fsharp` or use Visual Studio's **Update ServiceStack Reference** action:

```fsharp
(* Options:
Date: 2026-08-27 12:00:00
Version: 10.1.5
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://api.example.com

//GlobalNamespace: 
//MakeDataContractsExtensible: False
//AddReturnMarker: True
//AddDescriptionAsComments: True
//AddDataContractAttributes: False
//AddIndexesToDataMembers: False
//AddGeneratedCodeAttributes: False
//AddResponseStatus: False
//AddImplicitVersion: 
//ExportValueTypes: False
//IncludeTypes: 
//ExcludeTypes: 
//InitializeCollections: False
//AddNamespaces: 
*)
```

To override a value, remove the `//` and specify the value to the right of the `:`. Any value uncommented will be sent to the server to override any server defaults.

The following options control the generated source.

### Change Default Server Configuration

The defaults can also be overridden on the ServiceStack server by modifying the `NativeTypesFeature` configuration:

```csharp
var typesConfig = this.GetPlugin<NativeTypesFeature>().MetadataTypesConfig;
typesConfig.AddDataContractAttributes = false;
```

### MakeDataContractsExtensible

Add .NET's DataContract [ExtensionDataObject](https://learn.microsoft.com/en-us/dotnet/api/system.runtime.serialization.extensiondataobject) to all DTOs:

```fsharp
[<AllowNullLiteral>]
type GetAnswersResponse() = 
    interface IExtensibleDataObject with
        member val ExtensionData:ExtensionDataObject = null with get, set
    end
    member val Answer:Answer = null with get,set
    member val ExtensionData:ExtensionDataObject = null with get,set
```

### AddReturnMarker

`AddReturnMarker` annotates Request DTOs with an `IReturn<TResponse>` marker referencing the response type ServiceStack infers the Service returns:

```fsharp
type GetAnswers() = 
    interface IReturn<GetAnswersResponse>
    member val QuestionId:Int32 = new Int32() with get,set
``` 

::: info
The original DTO does not need a return marker. ServiceStack can infer its response from the Service return type or the `%Response` DTO naming convention.
:::

### AddDescriptionAsComments

Converts text from `[Description]` attributes into F# documentation comments, providing IntelliSense in client projects:

```fsharp
///<summary>
///Get a list of Answers for a Question
///</summary>
type GetAnswers() = 
...
```

### AddDataContractAttributes

Decorates all DTO types with `[DataContract]` and properties with `[DataMember]`:

```fsharp
[<DataContract>]
[<AllowNullLiteral>]
type GetAnswers() = 
    interface IReturn<GetAnswersResponse>
    [<DataMember>]
    member val QuestionId:Int32 = new Int32() with get,set
```

### AddIndexesToDataMembers

Populates a DataMember Order index for all properties:

```fsharp
[<DataContract>]
type GetAnswers() = 
    interface IReturn<GetAnswersResponse>
    [<DataMember(Order=1)>]
    member val QuestionId:Int32 = new Int32() with get,set
```

> Requires AddDataContractAttributes=true

### AddGeneratedCodeAttributes

Emits a `[<GeneratedCode>]` attribute on every generated type:

```fsharp
[<GeneratedCode("AddServiceStackReference", "10.1.5")>]
type GetAnswers() = ...
```

### AddResponseStatus

Automatically adds a `ResponseStatus` property to response DTOs which do not already define one:

```fsharp
type GetAnswersResponse() = 
    ...
    member val ResponseStatus:ResponseStatus = null with get,set
```

### AddImplicitVersion

Specifies the version number automatically populated in every Request DTO sent from the client:

```fsharp
type GetAnswers() = 
    interface IReturn<GetAnswersResponse>
    member val Version:int = 1 with get, set
    ...
```

This identifies the service-contract version used by existing clients, making it easier to implement ServiceStack's [recommended versioning strategy](http://stackoverflow.com/a/12413091/85785).

### IncludeTypes

Specifies only the types you want generated:

```fsharp
(* Options:
IncludeTypes: GetTechnology,GetTechnologyResponse
*)
```

Only generates the `GetTechnology` and `GetTechnologyResponse` DTOs:

```fsharp
type GetTechnology() = ...
type GetTechnologyResponse() = ...
```

#### Include Request DTO and its dependent types

You can include a Request DTO and all its dependent types with a `.*` suffix on the Request DTO, e.g:

```fsharp
(* Options:
IncludeTypes: GetTechnology.*
*)
```

This includes the `GetTechnology` Request DTO, its `GetTechnologyResponse` Response DTO and all types referenced by either DTO.

#### Include All Types within a C# namespace

If your DTOs are grouped into different namespaces, include a complete C# namespace with the `/*` suffix:

```fsharp
(* Options:
IncludeTypes: MyApp.ServiceModel.Admin/*
*)
```

This includes all DTOs within the `MyApp.ServiceModel.Admin` C# namespace.

### ExcludeTypes

Specifies types to exclude from generation:

```fsharp
(* Options:
ExcludeTypes: GetTechnology,GetTechnologyResponse
*)
```

Excludes the `GetTechnology` and `GetTechnologyResponse` DTOs from generation.

### InitializeCollections

Automatically initializes collections in generated DTOs:

```fsharp
type SearchQuestions() = 
    interface IReturn<SearchQuestionsResponse>
    member val Tags:ResizeArray<String> = new ResizeArray<String>() with get,set
```

### ExportValueTypes

By default custom value types are represented as strings unless they are enums. Enable `ExportValueTypes` to emit and reference their value type definitions instead:

```fsharp
(* Options:
ExportValueTypes: True
*)
```

### AddNamespaces

Include additional F# namespaces, e.g:

```fsharp
(* Options:
AddNamespaces: System.Drawing,MyApp
*)
```

Where it will generate the specified namespaces in the generated Types:

```fsharp
open System.Drawing
open MyApp
```
