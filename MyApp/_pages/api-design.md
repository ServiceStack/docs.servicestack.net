---
slug: api-design
title: ServiceStack API design
---

The primary difference between developing RPC vs ServiceStack's [Message-based Services](/what-is-a-message-based-web-service) is that the Services entire contract
is defined by its typed messages, specifically the Request DTO which defines both the System inputs and identifies the System output. Typically both are POCO DTOs 
however the [response can be any serializable object](/service-return-types).

The simplest Service example that does this is:

```csharp
public class MyRequest : IReturn<MyRequest> {}

public class MyServices : Service
{
    public object Any(MyRequest request) => request;
}
```

As only the `Any()` wildcard method is defined, it will get executed whenever the `MyRequest` Service is invoked via **any HTTP Verb**, [gRPC](/grpc/), [MQ](/messaging) or [SOAP](/soap-support) Request. 

The Request DTO is also all that's required to invoke it via any [Typed Generic Service Client](/clients-overview) in any supported language, e.g:

```csharp
MyRequest response = client.Get(new MyRequest());
```

All Services are accessible by their [pre-defined routes](/routing#pre-defined-routes), we can turn it into a functional data-driven Service by annotating it with a [user-defined route](/routing) and changing the implementation to return all App Contacts:

```csharp
public class Contact 
{
    public int Id { get; set; }
    public string Name { get; set; }
}

[Route("/contacts")]
public class GetContacts : IReturn<List<Contact>> { }

public class ContactsService : Service
{
    public object Get(GetContacts request) => Db.Select<Contact>();
}
```

Which your C# clients will still be able to call with:

```csharp
List<Contact> response = client.Get(new GetContacts());
```

This will make a **GET** call to the custom `/contacts` URL and returns all rows from the `Contact` Table in the configured RDBMS using [OrmLite](/ormlite/)
`Select()` extension method on the `base.Db` ADO.NET `IDbConnection` property on ServiceStack's convenience `Service` base class. 

Using `Get()` limits access to this service from HTTP **GET** requests only, all other HTTP Verbs requests to `/contacts` will return a **404 NotFound** HTTP Error Response.

### Using explicit Response DTO

Our recommendation instead of returning naked collections is returning an explicit predictable Response DTO, e.g:

```csharp
[Route("/contacts")]
public class GetContacts : IReturn<GetContactsResponse> { }

public class GetContactsResponse 
{
    public List<Contact> Results { get; set; }
    public ResponseStatus ResponseStatus { get; set; }
}

public class ContactsService : Service
{
    public object Get(GetContacts request) => new GetContactsResponse {
        Results = Db.Select<Contact>()
    };
}
```

Whilst slightly more verbose this style benefits from [more resilience in evolving and versioning](https://stackoverflow.com/a/12413091/85785) message-based Services
and more coarse-grained APIs as additional results can be added to the Response DTO without breaking existing clients. 

You'll also need to follow the above convention if you also wanted to [support SOAP endpoints](/soap-support) or if you want to be able to handle Typed [Response Messages in MQ Services](/messaging#message-workflow).

### All APIs have a preferred default method

Like the `Send*` APIs before them, both [API Explorer](/api-explorer) and the new [`Api*` methods](/csharp-client.html#high-level-api-and-apiasync-methods) send API requests using an APIs **preferred HTTP Method** which can be defined either:

 - Explicitly annotating Request DTOs with `IGet`, `IPost`, etc. **IVerb** interface markers
 - Using the verb specified in its user-defined `[Route]` attribute (if single verb specified)
 - Implicitly when using AutoQuery/CRUD Request DTOs
 - Using the Services **Verb()** implementation method if not using **Any()**

If the HTTP Method can't be inferred, it defaults to using HTTP **POST**. But as good API documentation practice, we recommend specifying the HTTP Method each API should use, preferably using the `IVerb` interface marker, so it's embedded into the APIs Services Contract shared with clients (not required for AutoQuery APIs).

## ServiceStack's API Design

We'll walk through a few examples here but for a more detailed look into the usages and capabilities of ServiceStack's API design checkout its
[Comprehensive Test Suite](https://github.com/ServiceStack/ServiceStack/blob/master/tests/RazorRockstars.Console.Files/ReqStarsService.cs)

At a minimum ServiceStack Services only need to implement the `IService` empty interface:

```csharp
public interface IService {}
```

The interface is used as a Marker interface that ServiceStack uses to find, register and auto-wire your existing services. Although you're more likely going to want to inherit from ServiceStack's convenience concrete `Service` class which contains easy access to ServiceStack's providers:

```csharp
public class Service : IService 
{
    IRequest Request { get; }                          // HTTP Request Context
    IResponse Response { get; }                        // HTTP Response Context
    IServiceGateway Gateway { get; }                   // Built-in Service Gateway
    IMessageProducer MessageProducer { get; }          // Message Producer for Registered MQ Server
    void PublishMessage(T message);                    // Publish messages to Registered MQ Server
    IVirtualPathProvider VirtualFileSources { get; }   // Virtual FileSystem Sources
    IVirtualFiles VirtualFiles { get; }                // Writable Virtual FileSystem
    ICacheClient Cache { get; }                        // Registered Caching Provider
    ICacheClientAsync CacheAsync { get; }              // Registered Async Caching Provider (or sync wrapper)
    MemoryCacheClient LocalCache { get; }              // Local InMemory Caching Provider
    IDbConnection Db { get; }                          // Registered ADO.NET IDbConnection
    IRedisClient Redis { get; }                        // Registered RedisClient 
    ValueTask<IRedisClientAsync> GetRedisAsync();      // Registered Async RedisClient 
    IAuthRepository AuthRepository { get; }            // Registered User Repository
    IAuthRepositoryAsync AuthRepositoryAsync { get; }  // Registered Async User Repository
    ISession SessionBag { get; }                       // Dynamic Session Bag
    ISessionAsync SessionBagAsync { get; }             // Dynamic Async Session Bag
    Task<TUserSession> SessionAsAsync<TUserSession>(); // Resolve Typed UserSession Async
    TUserSession SessionAs<TUserSession>();            // Resolve Typed UserSession
    IAuthSession GetSession() { get; }                 // Resolve base IAuthSession
    Task<IAuthSession> GetSessionAsync();              // Resolve base IAuthSession Async
    bool IsAuthenticated { get; }                      // Is Authenticated Request
    T TryResolve<T>();                                 // Resolve dependency at runtime
    T ResolveService<T>();                             // Resolve an auto-wired service
    T GetPlugin<T>();                                  // Resolve optional registered Plugin
    T AssertPlugin<T>();                               // Resolve required registered Plugin
    void Dispose();                                    // Override to implement custom IDispose
    ValueTask DisposeAsync();                          // implement IAsyncDisposable (.NET v4.7.2+)
}
```

### Basic example - Handling Any HTTP Verb

Lets revisit the Simple example from earlier:

```csharp
[Route("/contacts")]
public class GetContacts : IReturn<List<Contact>> { }

public class ContactsService : Service
{
    public object Get(GetContacts request) => Db.Select<Contact>();
}
```

ServiceStack maps HTTP Requests to your Services **Actions**. An Action is any method that:

  - Is `public` 
  - Only contains a **single argument - the typed Request DTO**
  - Has a Method name matching a **HTTP Method** or **Any** (the fallback that can handle "ANY" method)
    - Methods can have **Format** suffix to handle specific formats, e.g. if exists `GetJson` will handle **GET JSON** requests
  - Can specify either `T` or `object` Return type, both have same behavior 

### Content-Type Specific Service Implementations

Service methods can also use `Verb{Format}` method names to provide a different implementation for handling a specific Content-Type. 

The Service below defines several different implementation for handling the same Request:

```csharp
[Route("/my-request")]
public class MyRequest 
{
    public string Name { get; set; }
}

public class ContentTypeServices : Service
{
    public object GetJson(MyRequest request) => ..; // Handles GET /my-request for JSON responses

    public object GetHtml(MyRequest request) =>     // Handles GET /my-request for HTML Responses
        $@"<html>
            <body>
                <h1>GetHtml {request.Name}</h1>
            </body>
        </html>";

    public object AnyHtml(MyRequest request) =>     // Handles other POST/PUT/etc Verbs for HTML Responses
        $@"<html>
            <body>
                <h1>AnyHtml {request.Name}</h1>
            </body>
        </html>";

    public object Any(MyRequest request) => ...;    // Handles all other unspecified Verbs/Formats
}
```

### Optional *Async Suffixes

In addition your Services can optionally have the `*Async` suffix which by .NET Standard (and ServiceStack) guidelines is preferred for Async methods to telegraph to client call sites that its response should be awaited.


```csharp
[Route("/contacts")]
public class GetContacts : IReturn<List<Contact>> { }

public class ContactsService : Service
{
    public async Task<object> GetAsync(GetContacts request) => 
        await Db.SelectAsync<Contact>();

    public object GetHtmlAsync(MyRequest request) =>
        $@"<html>
            <body>
                <h1>GetHtml {request.Name}</h1>
            </body>
        </html>";
}
```

If both exists (e.g. `Post()` and `PostAsync()`) the `*Async` method will take precedence and be invoked instead. 

Allowing both is useful if you have internal services directly invoking other Services using `HostContext.ResolveService<T>()` where you can upgrade your Service to use an Async implementation without breaking existing clients, e.g. this is used in [RegisterService.cs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Auth/RegisterService.cs):

```csharp
[Obsolete("Use PostAsync")]
public object Post(Register request)
{
    try
    {
        var task = PostAsync(request);
        return task.GetResult();
    }
    catch (Exception e)
    {
        throw e.UnwrapIfSingleException();
    }
}

/// <summary>
/// Create new Registration
/// </summary>
public async Task<object> PostAsync(Register request)
{
    //... async impl
}            
```

To change to use an async implementation whilst retaining backwards compatibility with existing call sites, e.g:

```csharp
using var service = HostContext.ResolveService<RegisterService>(Request);
var response = service.Post(new Register { ... });
```

This is important if the response is ignored as the C# compiler wont give you any hints to await the response which can lead to timing issues where the Services is invoked but User Registration hasn't completed as-is often assumed.

Alternatively you can rename your method to use `*Async` suffix so the C# compiler will fail on call sites so you can replace the call-sites to `await` the async `Task` response, e.g:

```csharp
using var service = HostContext.ResolveService<RegisterService>(Request);
var response = await service.PostAsync(new Register { ... });
```

### Group Services by Tag

Related Services by can be grouped by annotating **Request DTOs** with the `[Tag]` attribute where they'll enable functionality in a number of ServiceStack's metadata services where they'll be used to [Group Services in Open API](https://swagger.io/docs/specification/grouping-operations-with-tags/).

This feature could be used to tag which Services are used by different platforms:

```csharp
[Tag("web")]
public class WebApi : IReturn<MyResponse> {}

[Tag("mobile")]
public class MobileApi : IReturn<MyResponse> {}

[Tag("web"),Tag("mobile")]
public class WebAndMobileApi : IReturn<MyResponse> {}
```

Where they'll appear as a tab to additionally filter APIs in metadata pages:

![](/img/pages/metadata/tag-groups.webp)

They're also supported in [Add ServiceStack Reference](/add-servicestack-reference) where it can be used in the [IncludeTypes](/csharp-add-servicestack-reference#includetypes) DTO customization option where tags can be specified using braces in the format `{tag}` or `{tag1,tag2,tag3}`, e.g:

```
/* Options:
IncludeTypes: {web,mobile}
```

Or individually:

```
/* Options:
IncludeTypes: {web},{mobile}
```

It works similar to [Dependent Type References wildcard syntax](/csharp-add-servicestack-reference#include-request-dto-and-its-dependent-types) where it expands all Request DTOs with the tag to include all its reference types so including a `{web}` tag would be equivalent to including all Request DTOs & reference types with that reference, e.g:

```
/* Options:
IncludeTypes: WebApi.*,WebAndMobileApi.*
```


### Micro ORMs and ADO.NET's IDbConnection

Code-First Micro ORMS like [OrmLite](/ormlite/) and 
[Dapper](https://github.com/StackExchange/Dapper) provides a pleasant high-level experience whilst working directly against ADO.NET's low-level `IDbConnection`. They both support all major databases so you immediately have access to a flexible RDBMS option out-of-the-box. At the same time you're not limited to using the providers contained in the `Service` class and can continue to use your own register IOC dependencies (inc. an alternate IOC itself). 

### Micro ORM POCOs make good DTOs

The POCOs used in Micro ORMS are particularly well suited for re-using as DTOs since they don't contain any circular references that the Heavy ORMs have (e.g. EF). OrmLite goes 1-step further and borrows pages from NoSQL's playbook where any complex property e.g. `List<MyPoco>` is transparently blobbed in a schema-less text field, promoting the design of frictionless **Pure POCOS** that are uninhibited by RDBMS concerns. In many cases these POCO data models already make good DTOs and can be returned directly instead of mapping to domain-specific DTOs.

### Calling Services from a Typed C# Client

In Service development your services DTOs provides your technology agnostic **Service Layer** which you want to keep clean and as 'dependency-free' for maximum accessibility and potential re-use. Our recommendation is to follow our [Recommended Physical Project Structure](/physical-project-structure) and keep your DTOs in a separate ServiceModel project which ensures a well-defined
ServiceContract [decoupled from their implementation and accessible from any client](/service-complexity-and-dto-roles#data-transfer-objects---dtos). This recommended Physical project structure is embedded in each [ServiceStack VS.NET Template](/templates/).

One of ServiceStack's strengths is its ability to re-use your Server DTOs on the client enabling ServiceStack's productive end-to-end typed API. 
ServiceStack's use of Typed DTOs in its message-based design enable greater resiliency for your Services where the exact DTOs aren't needed, only the shape of the DTOs is important and clients can also opt to use partial DTOs containing just the fields they're interested in. In the same way extending existing Services with new optional properties wont break existing clients using older DTOs.

When developing both Server and Client applications the easiest way to call typed Services from clients is to just have them reference the same ServiceModel .dll the Server uses to define its Service Contract, or for clients that only need to call a couple of Service you can choose to 
instead copy the class definitions as-is, in both cases calling Services is exactly the same where the Request DTO can be used with any of the generic [C#/.NET Service Clients](/csharp-client) to call Services using a succinct typed API, e.g:

#### Service Model Classes

```csharp
[Route("/contacts")]
public class GetContacts : IReturn<List<Contact>> { }
public class Contact { ... }
```

Which can used in any ServiceClient with:

```csharp
var client = new JsonApiClient(BaseUri);
List<Contact> response = client.Get(new GetContacts());
```

Which makes a **GET** web request to the `/contacts` route. Custom Routes on Request DTO's are also not required as when none are defined the client automatically falls back to using ServiceStack's [pre-defined routes](/routing#pre-defined-routes).

### Generating Typed DTOs

In addition to being able to share your `ServiceModel.dll` on .NET Clients enable a typed end-to-end API without code-gen, clients 
can alternatively choose to use [Add ServiceStack Reference](/csharp-add-servicestack-reference) support to provide an 
alternative way to get the Services typed DTOs on the client. In both cases the exact same source code is used to call the Services:

```csharp
var client = new JsonApiClient(BaseUri);
var response = client.Get(new GetContacts());
```

Add ServiceStack Reference is also available for [most popular languages](/add-servicestack-reference) used in developing Web, Mobile and Desktop Apps.

#### Custom API Requests

When preferred, you can also use the previous more explicit client API (ideal for when you don't have the `IReturn<>` marker) which 
lets you call the Service using just its route:

```csharp
var response = client.Get<List<Contact>>("/contacts");
```

::: info
All these Service Client APIs **have async equivalents** with an `*Async` suffix
:::


### API QueryParams

ServiceStack's message-based design is centered around sending a single message which is all that's required to invoke any Typed API, however there may be times when you need to send additional params where you can't change the API's Request DTO definition or in AutoQuery's case its [Implicit Conventions](/autoquery/rdbms#implicit-conventions) would require too many permutations to be able to type the entire surface area on each Request DTO.

Typically this would inhibit being able to invoke these Services from a typed Service Client API that would instead need to either use the untyped [`Get<T>(relativeUrl)`](https://reference.servicestack.net/api/ServiceStack/IRestClient/#-gettresponsestring) ServiceClient APIs or [HTTP Utils](/http-utils) to construct the API Request path manually.

Alternatively Request DTOs can implement `IHasQueryParams` where any entries will be sent as additional query params along with the typed DTO:

```csharp
public interface IHasQueryParams
{
    Dictionary<string, string> QueryParams { get; set; }
}
```

Which is available in all AutoQuery DTOs where it's added as a non-serializable property so it's only included in the QueryString:

```csharp
[DataContract]
public abstract class QueryBase : IQuery, IHasQueryParams
{
    //...
    [IgnoreDataMember]
    public virtual Dictionary<string, string> QueryParams { get; set; }
}
```

Which allows using existing ServiceClient typed APIs to send a combination of untyped queries in AutoQuery requests, e.g:

```csharp
var api = await client.ApiAsync(new QueryContacts {
  IdsIn = new[]{ 1, 2, 3 },
  QueryParams = new() {
    ["LastNameStartsWith"] = "A"
  }
});
```

## Everything centered around Request DTOs

A nice property of ServiceStack's message-based design is all functionality is centered around Typed Request DTOs which easily lets you take advantage of high-level value-added functionality like [Auto Batched Requests](/auto-batched-requests) or [Encrypted Messaging](/auth/encrypted-messaging) which are enabled automatically without any effort or easily opt-in to enhanced functionality by decorating Request DTOs or thier Services with Metadata and [Filter Attributes](/filter-attributes) and everything works together, binded against typed models naturally.

E.g. you can take advantage of [ServiceStack's Razor support](https://razor.netcore.io/) and create a web page for this service by just adding a Razor view with the same name as the Request DTO in the `/Views` folder,
which for the `GetContacts` Request DTO you can just add `/Views/GetContacts.cshtml` and it will get rendered with the Services Response DTO as its View Model when the Service is called from a browser (i.e. HTTP Request with `Accept: text/html`). 

Thanks to ServiceStack's built-in Content Negotiation you can fetch the HTML contents calling the same url: 

```csharp
var html = $"{BaseUri}/contacts".GetStringFromUrl(accept:"text/html");
```

This [feature is particularly nice](https://razor.netcore.io/#unified-stack) as it lets you **re-use your existing services** to serve both Web and Native Mobile and Desktop clients.

### Action Filters

Service actions can also contain fine-grained application of Request and Response filters, e.g:

```csharp
public class ContactsService : Service
{
    [ClientCanSwapTemplates]
    public object Get(GetContacts request) => Db.Select<Contact>();
}
```

This Request Filter allows the client to [change the selected Razor **View** and **Template**](https://razor.netcore.io/#unified-stack) used at runtime. By default the view with the same name as the **Request** or **Response** DTO is used.

## Handling different HTTP Verbs

ServiceStack Services lets you handle any HTTP Verb in the same way, e.g this lets you respond with CORS headers to a HTTP **OPTIONS** request with:

```csharp
public class ContactsService : Service
{
    [EnableCors]
    public void Options(GetContact request) {}
}
```

Which if you now make an OPTIONS request to the above service, will emit the default `[EnableCors]` headers:

```csharp
var webReq = (HttpWebRequest)WebRequest.Create(Host + "/contacts");
webReq.Method = "OPTIONS";
using var webRes = webReq.GetResponse();
webRes.Headers["Access-Control-Allow-Origin"]     // *
webRes.Headers["Access-Control-Allow-Methods"]    // GET, POST, PUT, DELETE, OPTIONS
webRes.Headers["Access-Control-Allow-Headers"]    // Content-Type
```

### PATCH request example

Handling a PATCH request is just as easy, e.g. here's an example of using PATCH to handle a partial update of a Resource:

```csharp
[Route("/contacts/{Id}", "PATCH")]
public class UpdateContact : IReturn<Contact>
{
    public int Id { get; set; }
    public int Age { get; set; }
}

public Contact Patch(UpdateContact request)
{
    var Contact = request.ConvertTo<Contact>();
    Db.UpdateNonDefaults(Contact);
    return Db.SingleById<Contact>(request.Id);
}
```

And the client call is just as easy as you would expect:

```csharp
var response = client.Patch(new UpdateContact { Id = 1, Age = 18 });
```

Although sending different HTTP Verbs are unrestricted in native clients, they're unfortunately not allowed in some web browsers and proxies. So to simulate a PATCH from an AJAX request you need to set the **X-Http-Method-Override** HTTP Header.

## Structured Error Handling

When following the [explicit Response DTO Naming convention](/error-handling#error-response-types) ServiceStack will automatically populate the `ResponseStatus` property with a structured Error Response otherwise if returning other DTOs like naked collections ServiceStack will instead return a generic `ErrorResponse`, although this is mostly a transparent technical detail you don't need to know about as for schema-less formats like JSON they return the exact same wire-format.

[Error Handling](/error-handling) works naturally in ServiceStack where you can simply throw C# Exceptions, e.g:

```csharp
public List<Contact> Post(Contact request)
{
    if (!request.Age.HasValue)
        throw new ArgumentException("Age is required");

    Db.Insert(request.ConvertTo<Contact>());
    return Db.Select<Contact>();
}
```

This will result in an Error thrown on the client if it tried to create an empty Contact:

```csharp
try
{
    var response = client.Post(new Contact());
}
catch (WebServiceException webEx)
{
    webEx.StatusCode                    // 400
    webEx.StatusDescription             // ArgumentException
    webEx.ResponseStatus.ErrorCode      // ArgumentException
    webEx.ResponseStatus.Message        // Age is required
    webEx.ResponseDto is ErrorResponse  // true
}
```

The same Service Clients Exception handling is also used to handle any HTTP error generated in or outside of your service, e.g. here's how to detect if a HTTP Method isn't implemented or disallowed:

```csharp
try
{
    var response = client.Send(new SearchContacts());
}
catch (WebServiceException webEx)
{
    webEx.StatusCode                   // 405
    webEx.StatusDescription            // Method Not Allowed
}
```

In addition to standard C# exceptions your services can also return multiple, rich and detailed validation errors as enforced by [Fluent Validation's validators](/validation).

### Overriding the default Exception handling

You can override the default exception handling in ServiceStack by registering a `ServiceExceptionHandlers`, e.g:

```csharp
void Configure(Container container) 
{
    this.ServiceExceptionHandlers.Add((req, reqDto, ex) => {
        return ...;
    });
}
```

## Smart Routing

For the most part you won't need to know about this as ServiceStack's routing works as you would expect. Although this should still serve as a good reference to describe the resolution order of ServiceStack's Routes:

  1. Any exact Literal Matches are used first
  2. Exact Verb match is preferred over All Verbs
  3. The more variables in your route the less weighting it has
  4. When Routes have the same weight, the order is determined by the position of the Action in the service or Order of Registration (FIFO)

These Rules only come into play when there are multiple routes that matches the pathInfo of an incoming request.

Lets see some examples of these rules in action using the routes defined in the [API Design test suite](https://github.com/ServiceStack/ServiceStack/blob/master/tests/RazorRockstars.Console.Files/ReqStarsService.cs):

```csharp
[Route("/contacts")]
public class Contact {}

[Route("/contacts", "GET")]
public class GetContacts {}

[Route("/contacts/{Id}", "GET")]
public class GetContact {}

[Route("/contacts/{Id}/{Field}")]
public class ViewContact {}

[Route("/contacts/{Id}/delete")]
public class DeleteContact {}

[Route("/contacts/{Id}", "PATCH")]
public class UpdateContact {}

[Route("/contacts/reset")]
public class ResetContact {}

[Route("/contacts/search")]
[Route("/contacts/aged/{Age}")]
public class SearchContacts {}
```

These are results for these HTTP Requests

```
GET   /contacts           =>	GetContacts
POST  /contacts           =>	Contact
GET   /contacts/search    =>	SearchContacts
GET   /contacts/reset     =>	ResetContact
PATCH /contacts/reset     =>	ResetContact
PATCH /contacts/1         =>	UpdateContact
GET   /contacts/1         =>	GetContact
GET   /contacts/1/delete  =>	DeleteContact
GET   /contacts/1/foo     =>	ViewContact
```

And if there were multiple of the exact same routes declared like:

```csharp
[Route("/req/{Id}", "GET")]
public class Req2 {}

[Route("/req/{Id}", "GET")]
public class Req1 {}

public class MyService : Service {
    public object Get(Req1 request) { ... }		
    public object Get(Req2 request) { ... }		
}
```

The Route on the Action that was declared first gets selected, i.e:

```
GET /req/1              => Req1
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

## Advanced Usages

### Custom Hooks

The ability to extend ServiceStack's service execution pipeline with Custom Hooks is an advanced customization feature that for most times is not needed as the preferred way to add composable functionality to your services is to use [Request / Response Filter attributes](/filter-attributes) or apply them globally with [Global Request/Response Filters](/request-and-response-filters).

### Custom Serialized Responses

The new `IHttpResult.ResultScope` API provides an opportunity to execute serialization within a custom scope, e.g. this can
be used to customize the serialized response of adhoc services that's different from the default global configuration with:

```csharp
return new HttpResult(dto) {
    ResultScope = () => JsConfig.With(new Config { IncludeNullValues =  true })
};
```

Which enables custom serialization behavior by performing the serialization within the custom scope, equivalent to:

```csharp
using (JsConfig.With(new Config { IncludeNullValues =  true }))
{
    var customSerializedResponse = Serialize(dto);
}
```

### Request and Response Converters

The [Encrypted Messaging Feature](/auth/encrypted-messaging) takes advantage of Request and Response Converters that let you change the Request DTO and Response DTO's that get used in ServiceStack's Request Pipeline where:

#### Request Converters

Request Converters are executed directly after any [Custom Request Binders](/serialization-deserialization#create-a-custom-request-dto-binder):

```csharp
appHost.RequestConverters.Add(async (req, requestDto) => {
    //Return alternative Request DTO or null to retain existing DTO
});
```

#### Response Converters

Response Converters are executed directly after the Service:

```csharp
appHost.ResponseConverters.Add(async (req, response) =>
    //Return alternative Response or null to retain existing Service response
});
```

### Intercept Service Requests

As an alternative to creating a [Custom Service Runner](#using-a-custom-servicerunner) to intercept
different events when processing ServiceStack Requests, you can instead override the `OnBeforeExecute()`, `OnAfterExecute()` and `OnExceptionAsync()`
callbacks in your `Service` class (or base class) to intercept and modify Request DTOs, Responses or Error Responses, e.g:

```csharp
class MyServices : Service
{
    // Log all Request DTOs that implement IHasSessionId
    public override void OnBeforeExecute(object requestDto)
    {
        if (requestDto is IHasSessionId dtoSession)
        {
            Log.Debug($"{nameof(OnBeforeExecute)}: {dtoSession.SessionId}");
        }
    }

    //Return Response DTO Name in HTTP Header with Response
    public override object OnAfterExecute(object response)
    {
        return new HttpResult(response) {
            Headers = {
                ["X-Response"] = response.GetType().Name
            }
        };
    }

    //Return custom error with additional metadata
    public override Task<object> OnExceptionAsync(object requestDto, Exception ex)
    {
        var error = DtoUtils.CreateErrorResponse(requestDto, ex);
        if (error is IHttpError httpError)
        {                
            var errorStatus = httpError.Response.GetResponseStatus();
            errorStatus.Meta = new Dictionary<string,string> {
                ["InnerType"] = ex.InnerException?.GetType().Name
            };
        }
        return Task.FromResult(error);
    }
}
```

#### Async Callbacks

For async callbacks your Services can implement `IServiceBeforeFilterAsync` and `IServiceAfterFilterAsync`, e.g:

```csharp
public class MyServices : Service, IServiceBeforeFilterAsync, IServiceAfterFilterAsync
{
    public async Task OnBeforeExecuteAsync(object requestDto)
    {
        //...
    }

    public async Task<object> OnAfterExecuteAsync(object response)
    {
        //...
        return response;
    }
}
```

If you're implementing `IService` instead of inheriting the concrete `Service` class, you can implement the interfaces directly:

```csharp
// Handle all callbacks
public class MyServices : IService, IServiceFilters
{
    //..
}

// Or individually, just the callbacks you want
public class MyServices : IService, IServiceBeforeFilter, IServiceAfterFilter, IServiceErrorFilter
{
    //..
}
```

### Custom Service Runner

The [IServiceRunner](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IServiceRunner.cs) decouples the execution of your service from the implementation of it which provides an alternative custom hook which lets you add custom behavior to all Services without needing to use a base Service class. 

To add your own Service Hooks you just need to override the default Service Runner in your AppHost from its default implementation:

```csharp
public virtual IServiceRunner<TRequest> CreateServiceRunner<TRequest>(ActionContext actionContext)
{           
    return new ServiceRunner<TRequest>(this, actionContext); //Cached per Service Action
}
```

With your own:

```csharp
public override IServiceRunner<TRequest> CreateServiceRunner<TRequest>(ActionContext actionContext)
{           
    return new MyServiceRunner<TRequest>(this, actionContext); //Cached per Service Action
}
```

Where `MyServiceRunner<T>` is just a custom class implementing the custom hooks you're interested in, e.g:

```csharp
public class MyServiceRunner<T> : ServiceRunner<T> 
{
    public override OnBeforeExecute(IRequest req, TRequest request, object service) {
      // Called just before any Action is executed
    }

    public override Task<object> ExecuteAsync(IRequest req, object instance, TRequest requestDto) {
        // Called to execute the Service instance with the requestDto
        return base.ExecuteAsync(req, serviceInstance, requestDto);
    }

    public override object OnAfterExecute(IRequest req, object response, object service) {
      // Called just after any Action is executed, you can modify the response returned here as well
    }

    public override Task<object> HandleExceptionAsync(IRequest req, TRequest requestDto, Exception ex, object instance) {
      // Called whenever an exception is thrown in your Services Action
    }
}
```

## Limitations

One limitation of Services is that you can't split the handling of a single Resource (i.e. Request DTO) over multiple service implementations. If you find you need to do this because your service is getting too big, consider using partial classes to spread the implementation over multiple files. Another option is encapsulating some of the re-usable functionality into Logic dependencies and inject them into your service.

## Other Notes

Although they're not needed or used anywhere [you can also use HTTP Verb interfaces](https://github.com/ServiceStack/ServiceStack/blob/34acc429ee04053ea766e4fb183e7aad7321ef5e/src/ServiceStack.Interfaces/IService.cs#L27) to enforce the correct signature required by the services, e.g:

```csharp
public class MyService : Service, IAny<GetContacts>, IGet<SearchContacts>, IPost<Contact>
{
    public object Any(GetContacts request) { .. }
    public object Get(SearchContacts request) { .. }
    public object Post(Contact request) { .. }
}
```

This has no effect to the runtime behaviour and your services will work the same way with or without the added interfaces.

