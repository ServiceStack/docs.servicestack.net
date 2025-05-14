---
slug: csharp-client
title: C#/.NET Service Clients
---

Using DTOs to define your web service interface makes it possible to provide strong-typed generic service clients without any code-gen or extra build-steps, leading to a productive end-to-end type-safe communication gateway from client to server.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="cbYuem1b2tg" style="background-image: url('https://img.youtube.com/vi/cbYuem1b2tg/maxresdefault.jpg')"></lite-youtube>

 **ServiceStack.Client** is the primary NuGet package containing ServiceStack's client libraries that can be included in your `.csproj` with:

:::copy
`<PackageReference Include="ServiceStack.Client" Version="8.*" />`
:::

Earlier **.NET 6.0** can use the [HttpClient-based JsonHttpClient](/csharp-client#jsonhttpclient) in:

:::copy
`<PackageReference Include="ServiceStack.HttpClient" Version="8.*" />`
:::

### JsonApiClient

From  **.NET 6+** it's recommended to use the newest [JsonApiClient](/releases/v6#jsonapiclient) released in v6+:

```csharp
var client = new JsonApiClient(baseUri);
```

### HttpClient Factory Registration

In client Apps that support it, the recommendation is to use a HttpClient Factory which can be done to register the `JsonApiClient` dependency in your App with:

```csharp
builder.Services.AddJsonApiClient(builder.Configuration["BaseUrl"]);
```

It's now recommended to use `JsonApiClient` when it's available, but for simplification the docs will continue to reference the substitutable & more broadly available `JsonServiceClient`.

#### Blazor Client Registration

**Blazor WASM** should instead use the tailored `AddBlazorApiClient()` which also configures a CORS-enabled typed `JsonApiClient`:

```csharp
builder.Services.AddBlazorApiClient(builder.Configuration["ApiBaseUrl"] ?? builder.HostEnvironment.BaseAddress);
```

### Setup

All ServiceStack's C# clients share the same interfaces and are created by passing in the **Base URI** of your ServiceStack service in the clients constructor, e.g. if your ServiceStack instance was hosted on the root path `/` on the **5001** custom port:

```csharp
var client = new JsonApiClient("https://host:5001");
```

Or if hosted on the `/custom` custom path:

```csharp
var client = new JsonApiClient("https://host/custom/");
```

### Recommended ServiceClient for .NET 6+#

Going forward we'll continue improving `JsonApiClient` with new .NET runtime features and optimizations as they're available and now that .NET's `HttpWebRequest` has been officially **deprecated in .NET 6+** we recommend switching to use `JsonApiClient` in .NET 6+ runtimes.

### Safe Sync HttpClient APIs

Until adding **net6.0** TFM builds there was no officially supported way to perform synchronous requests with `HttpClient`, to implement the complete `IServiceClient` interface, `JsonHttpClient` had to adopt the least problematic sync-over-async solution.

`JsonApiClient` improves its synchronous support by rewriting all Sync methods to use HttpClient's new blocking `Send()` method. Whilst Blocking I/O continues to impact scalability, it's nice to finally have an officially supported safe method to use free from deadlock concerns.

## High level `Api` and `ApiAsync` methods

.NET was originally conceived to use Exceptions for error control flow however there's been a tendency in modern languages & libraries to shun Exceptions and return errors as normal values, an approach we believe is a more flexible & ergonomic way to handle API responses.

### The ApiResult way

The new APIs simply returns a typed `ApiResult<Response>` Value Result that encapsulates either a Typed Response or a structured API Error populated in `ResponseStatus` allowing you to handle API responses programmatically without `try/catch` handling:

```csharp
var api = client.Api(new Hello { Name = name });
if (api.Failed) 
    Console.WriteLine($"Greeting failed! {api.Error.ErrorMessage}");
else
    Console.WriteLine($"API Says: {api.Response.Result}"); //api.Succeeded
```

### C# Example

A preview of what this looks like is visible in [Blazor WASMs Dev Model Preview](/templates/blazor-bootstrap#api-and-apiasync-methods) example code to create a new Booking:

```csharp
CreateBooking request = new();

ApiResult<IdResponse> api = new();

async Task OnSubmit()
{
    api = await Client.ApiAsync(request);

    if (api.Succeeded)
    {
        await done.InvokeAsync(api.Response!);
        request = new();
    }
}
```

Which despite its terseness handles both **success** and **error** API responses, **if successful** it invokes the `done()` callback notifying its parent of the new Booking API Response before resetting the Form's data model with a new Request DTO.

Upon **failure** the error response is populated in `api.Error` which binds to the UI via Blazor's `<CascadingValue Value=@api.Error>` to propagate it to all its child components in order to show contextual validation errors next to their respective Input controls.


### Available in all .NET and TypeScript Clients

The new `Api` and `ApiAsync` methods is available in all .NET Service Clients, including [Service Gateway's](/service-gateway).

## REST API

In addition, the Service Clients provide HTTP verbs (Get, Post & PostFile, Put, Delete, Patch, etc) enabling a productive typed API for consuming ServiceStack Services with their best matching Custom Routes as seen in the examples below:

> See [IServiceClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/IServiceClient.cs) for the full API available

### Using the recommended [API Design](/api-design)

```csharp
HelloResponse response = client.Get(new Hello { Name = "World!" });
response.Result.Print();
```

#### Async Example

Using C# `await`:

```csharp
HelloResponse response = await client.GetAsync(
    new Hello { Name = "World!" });
```

### Alternative API

```csharp
var response = client.Get<HelloResponse>("/hello/World!");
response.Result.Print();
```

#### Async Example

```csharp
var response = await client.GetAsync<HelloResponse>("/hello/World!");
```

## Service Client API

C#/.NET Clients can call the above Hello Service using any of the JSON, JSV, XML or SOAP Service Clients with the code below:

### Using the recommended [API Design](/api-design)

```csharp
var response = client.Send(new Hello { Name = "World!" });
response.Result.Print();
```

#### Async Example

```csharp
var response = await client.SendAsync(new Hello { Name = "World!" });
response.Result.Print();
```

### Alternative API

```csharp
var response = client.Send<HelloResponse>(new Hello { Name = "World!" });
response.Result.Print();
```

#### Async Example

```csharp
var response = await client.SendAsync<HelloResponse>(
    new Hello { Name = "World!" });
```

The service clients use the automatic [pre-defined routes](/endpoints) for each service.

### File Upload with Request

The `PostFileWithRequest*` methods can be used to upload a file with an API Request.

Here's an example calling [AI Server's](/ai-server/) `SpeechToText` API:

### C# Speech to Text

```csharp
using var fsAudio = File.OpenRead("audio.wav");
var response = client.PostFileWithRequest(new SpeechToText(),
    new UploadFile("audio.wav", fsAudio, "audio"));
```

### Multiple File Uploads

Whilst the `PostFilesWithRequest*` methods can be used to upload multiple files with an API Request, e.g:

### C# Watermark Video

```csharp
using var fsVideo = File.OpenRead("video.mp4");
using var fsWatermark = File.OpenRead("watermark.png");
var response = client.PostFilesWithRequest(new QueueWatermarkVideo {
        Position = WatermarkPosition.BottomRight
    }, [
        new UploadFile("video.mp4", fsVideo, "video"),
        new UploadFile("watermark.png", fsWatermark, "watermark")
    ]);
```


<a name="native-responses"></a>

### [Cache Aware Service Clients](/cache-aware-clients)

When [caching is enabled on Services](/http-caching), the Cache-aware Service Clients can dramatically improve performance by eliminating server requests entirely as well as reducing bandwidth for re-validated requests. They also offer an additional layer of resiliency as re-validated requests that result in Errors will transparently fallback to using pre-existing locally cached responses. For bandwidth-constrained environments like Mobile Apps they can dramatically improve the User Experience.

The Cache-Aware clients implement the full `IServiceClient` interface so they should be an easy drop-in enhancement for existing Apps:

```csharp
IServiceClient client = new JsonServiceClient(baseUrl).WithCache(); 

//equivalent to:
IServiceClient client = new CachedServiceClient(new JsonServiceClient(baseUrl));
```

Likewise for the HttpClient-based `JsonHttpClient`:

```csharp
IServiceClient client = new JsonHttpClient(baseUrl).WithCache(); 

//equivalent to:
IServiceClient client = new CachedHttpClient(new JsonHttpClient(baseUrl));
```

## Support for Native built-in Response Types

All of ServiceStack's generic Service Clients also allow you to fetch raw `string`, `byte[]` and `Stream` responses of any existing service, or when you need it, the underlying `HttpWebResponse` allowing fine-grained access to the HTTP Response. e.g With just the Service below:

```csharp
[Route("/poco/{Text}")]
public class Poco : IReturn<PocoResponse>
{
    public string Text { get; set; }
}

public class PocoResponse
{
    public string Result { get; set; }
}

public class NativeTypesExamples : Service
{
    public PocoResponse Any(Poco request)
    {
        base.Response.AddHeader("X-Response", request.Text);
        return new PocoResponse { 
            Result = "Hello, " + (request.Text ?? "World!") 
        };
    }
}
```

You can access it normally with the typed API:

```csharp
PocoResponse response = client.Get(new Poco { Text = "World" });
response.Result //Hello, World
```

Or as get the JSON as a raw string:

```csharp
string responseJson = client.Get<string>("/poco/World");
var dto = responseJson.FromJson<PocoResponse>();
dto.Result //Hello, World
```

Or as raw bytes:

```csharp
byte[] responseBytes = client.Get<byte[]>("/poco/World");
var dto = responseBytes.FromUtf8Bytes().FromJson<PocoResponse>();
dto.Result //Hello, World
```

Or as a Stream:

```csharp
using Stream responseStream = client.Get<Stream>("/poco/World");
var dto = responseStream.ReadFully()
    .FromUtf8Bytes()
    .FromJson<PocoResponse>();
dto.Result //Hello, World
```

Async download & write to file example:

```csharp
using var stream = await client.GetAsync<Stream>(new GetFile { Path = "/path/to/file.png" });
using var fs = File.Create(Path.Combine(uploadsDir, "file.png"));
await stream.CopyToAsync(fs);
```

Or even access the populated `HttpWebResponse` object:

```csharp
HttpWebResponse webResponse = client.Get<HttpWebResponse>("/poco/World");

webResponse.Headers["X-Response"] //= World

using var stream = webResponse.GetResponseStream();
using var sr = new StreamReader(stream);
var dto = sr.ReadToEnd().FromJson<PocoResponse>();
dto.Result //Hello, World
```

### Accessing raw service responses

ServiceStack isn't limited to just returning POCO's as you can effectively [return anything you want](/service-return-types) even images 
[/helloimage/ServiceStack?Width=600&height=300&Foreground=Yellow](https://test.servicestack.net/image-draw/ServiceStack?Width=600&height=300&Foreground=Yellow). These native responses can also be mark on your Request DTO `IReturn<T>` interface marker to give you a terse end-to-end API for fetching raw responses, e.g:

```csharp
[Route("/headers/{Text}")]
public class Headers : IReturn<HttpWebResponse>
{
    public string Text { get; set; }
}

[Route("/strings/{Text}")]
public class Strings : IReturn<string>
{
    public string Text { get; set; }
}

[Route("/bytes/{Text}")]
public class Bytes : IReturn<byte[]>
{
    public string Text { get; set; }
}

[Route("/streams/{Text}")]
public class Streams : IReturn<Stream>
{
    public string Text { get; set; }
}

public class BuiltInTypesService : Service
{
    public void Any(Headers request)
    {
        base.Response.AddHeader("X-Response", request.Text);
    }

    public string Any(Strings request)
    {
        return "Hello, " + (request.Text ?? "World!");
    }

    public byte[] Any(Bytes request)
    {
        return new Guid(request.Text).ToByteArray();
    }

    public byte[] Any(Streams request)
    {
        return new Guid(request.Text).ToByteArray();
    }        
}
```

### Accessing client raw responses

Which let you access the results as you would a normal response:

```csharp
using HttpWebResponse response = client.Get(new Headers { Text = "World" });
response.Headers["X-Response"] // "World"

string response = client.Get(new Strings { Text = "World" });
response // Hello, World

byte[] response = client.Get(new Bytes { 
    Text = Guid.NewGuid().ToString() 
});
var guid = new Guid(response);

using Stream stream = client.Get(new Streams { Text = Guid.NewGuid().ToString() });
var guid = new Guid(response.ReadFully());
```

All these APIs are also available asynchronously as well:

```csharp
using HttpWebResponse response = await client.GetAsync(
    new Strings { Text = "Test" });
response.Headers["X-Response"] // "World"

string response = await client.GetAsync(
    new Strings { Text = "World" });
response // Hello, World

byte[] response = await client.GetAsync(new Bytes { 
    Text = Guid.NewGuid().ToString() 
});
var guid = new Guid(response);

using Stream stream = await client.GetAsync(new Streams { 
    Text = Guid.NewGuid().ToString() 
});
var guid = new Guid(response.ReadFully());
```

::: warning
You must explicitly dispose all APIs returning either `HttpWebResponse` or `Stream` as seen in the above examples.
:::

They all behave the same as the sync versions except for `HttpWebResponse` which gets returned just after
the request is sent (asynchronously) and before any response is read so you can still access the HTTP Headers e.g:

```csharp
var client = new JsonServiceClient("http://localhost:2020/") 
{
    ResponseFilter = httpRes => {
        var header = httpRes.Headers["X-Response"];
    }
};
var response = await client.GetAsync(new Headers { Text = "World" });
```

Which makes a great starting point if you want to stream the responses back asynchronously as seen in this
[Reactive ServiceStack example](https://gist.github.com/bamboo/5078236) by [@rodrigobamboo](https://twitter.com/rodrigobamboo).

More examples can be found in the ServiceClients [Built-in native type response tests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/ServiceClientsBuiltInResponseTests.cs)

## Sending Raw Data

.NET Service Clients can also send raw `string`, `byte[]` or `Stream` Request bodies in their custom Sync or Async API's, e.g:
 
```csharp
string json = "{\"Key\":1}";
client.Post<SendRawResponse>("/sendraw", json);

byte[] bytes = json.ToUtf8Bytes();
client.Put<SendRawResponse>("/sendraw", bytes);

Stream stream = new MemoryStream(bytes);
await client.PostAsync<SendRawResponse>("/sendraw", stream);
```

### Sending Typed Request with Raw Body

The `*Body` and `*BodyAsync` APIs have avaialble in all Service Clients lets you post a separate Request Body for Request DTOs 
that implement `IRequiresRequestStream` where they contain both properties and a custom Request Body, e.g:

```csharp
[Route("/json")]
public class SendJson : IRequiresRequestStream, IReturn<string>
{
    public string Name { get; set; }
    public Stream RequestStream { get; set; }
}

[Route("/text")]
public class SendText : IRequiresRequestStream, IReturn<string>
{
    public string Name { get; set; }
    public string ContentType { get; set; }
    public Stream RequestStream { get; set; }
}

public class SendRawService : Service
{
    [JsonOnly]
    public object Any(SendJson request) => request.RequestStream.ReadFully();

    public object Any(SendText request)
    {
        base.Request.ResponseContentType = request.ContentType ?? base.Request.AcceptTypes[0];
        return request.RequestStream.ReadFully();
    }
}
```

The new APIs accept both a Request DTO which specifies which Service to call and what properties to add to the QueryString and another
object to send in the raw HTTP Request Body, e.g:

```csharp
var client = new JsonServiceClient(BaseUrl);

var json = client.PostBody(new SendJson { Name = "JSON body" }, new PocoRequest { Foo = "Bar" });
json.FromJson<PocoRequest>().Foo //= Bar

json = await client.PutBodyAsync(new SendJson { Name = "JSON body" }, "{\"Foo\":\"Bar\"}");
json.FromJson<PocoRequest>().Foo //= Bar

var client = new JsonHttpClient(BaseUrl);
var request = new SendText { Name = "Text body", ContentType = "text/plain" };

var text = await client.PostBodyAsync(request, "foo");
text //= foo
```

## Client / Server Request Compression

You can  elect to compress HTTP Requests in any C#/.NET Service Clients by specifying the Compression 
Type you wish to use, e.g:

```csharp
var client = new JsonServiceClient(baseUrl) {
    RequestCompressionType = CompressionTypes.GZip,
};

var client = new JsonHttpClient(baseUrl) {
    RequestCompressionType = CompressionTypes.Deflate,
};

var response = client.Post(new Request { ... });
```

Where sending any HTTP Request containing a Request Body (e.g. POST/PUT) will send a compressed Request body
to the Server where it's now able to be transparently decompressed and deserialized into your Request DTO.

## Authentication

ServiceStack's [Auth Tests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/AuthTests.cs#L108) shows different ways of authenticating when using the C# Service Clients. By default BasicAuth and DigestAuth is built into the clients, e.g:

```csharp
var client = new JsonServiceClient(baseUri) {
    UserName = UserName,
    Password = Password,
};

var request = new Secured { Name = "test" };
var response = client.Send<SecureResponse>(request);    
```

Behind the scenes ServiceStack will attempt to send the request normally but when the request is rejected and challenged by the Server the clients will automatically retry the same request but this time with the Basic/Digest Auth headers.

To skip the extra hop when you know you're accessing a secure service, you can tell the clients to always send the BasicAuth header with:

```csharp
client.AlwaysSendBasicAuthHeader = true;
```

### Sending Authenticate Request DTO

The alternative way to Authenticate is to make an explicit call to the `Authenticate` service (this requires `CredentialsAuthProvider` enabled) e.g:

```csharp
AuthenticateResponse authResponse = client.Post(new Authenticate {
    provider = CredentialsAuthProvider.Name, //= credentials
    UserName = "user",
    Password = "p@55word",
    RememberMe = true,                       //important tell client to retain permanent cookies
});

var request = new Secured { Name = "test" };
var response = client.Send<SecureResponse>(request);    
```

After a successful call to the `Authenticate` service the client is Authenticated and if **RememberMe** is set, the client will retain the Session Cookies added by the Server on subsequent requests which is what enables future requests from that client to be authenticated.

### Request and Response Filters

When needing to execute custom logic before and after requests are sent and received you can use Global Request/Response Filters:

```csharp
// Executed for all .NET HttpWebRequest ServiceClient instances like JsonServiceClient:
ServiceClientBase.GlobalRequestFilter = (HttpWebRequest req) => { ... };
ServiceClientBase.GlobalResponseFilter = (HttpWebResponse res) => { ... };

// Executed for all JsonHttpClient instances
JsonHttpClient.GlobalRequestFilter = (HttpRequestMessage req) => { ... };
JsonHttpClient.GlobalResponseFilter = (HttpResponseMessage res) => { ... };
```

Or use instance Request/Response Filters if you only want to run custom logic for a specific instances:

```csharp
var client = new JsonServiceClient(baseUrl) {
    RequestFilter = req => { ... },
    ResponseFilter = res => { ... },
}

var client = new JsonHttpClient(baseUrl) {
    RequestFilter = req => { ... },
    ResponseFilter = res => { ... },
}
```

### Upload and Download Progress on Async API's

The Async API's support on progress updates with the `OnDownloadProgress` and `OnUploadProgress` callbacks which can be used to provide UX Progress updates, e.g:

```csharp
var client = new JsonServiceClient(ListeningOn);

//Available in ASP.NET/HttpListener when downloading responses with known lengths 
//E.g: Strings, Files, etc.
client.OnDownloadProgress = (done, total) =>
    "{0}/{1} bytes downloaded".Print(done, total);

var response = await client.GetAsync(new Request());
```

::: info
total = -1 when 'Transfer-Encoding: chunked'
:::

Whilst the `OnUploadProgress` callback gets fired when uploading files, e.g:

```csharp
client.OnUploadProgress = (bytesWritten, total) => 
    "Written {0}/{1} bytes...".Print(bytesWritten, total);

client.PostFileWithRequest<UploadResponse>(url, 
    new FileInfo(path), new Upload { CreatedBy = "Me" });
```

### Custom Client Caching Strategy

The `ResultsFilter` and `ResultsFilterResponse` delegates on Service Clients can be used to enable a custom caching strategy. 

Here's a basic example implementing a cache for all **GET** Requests:

```csharp
var cache = new Dictionary<string, object>();

client.ResultsFilter = (type, method, uri, request) => {
    if (method != HttpMethods.Get) return null;
    object cachedResponse;
    cache.TryGetValue(uri, out cachedResponse);
    return cachedResponse;
};
client.ResultsFilterResponse = (webRes, response, method, uri, request) => {
    if (method != HttpMethods.Get) return;
    cache[uri] = response;
};

//Subsequent requests returns cached result
var response1 = client.Get(new GetCustomer { CustomerId = 5 });
var response2 = client.Get(new GetCustomer { CustomerId = 5 }); //cached response
```

The `ResultsFilter` delegate is executed with the context of the request before the request is made. Returning a value of type `TResponse` short-circuits the request and returns that response. Otherwise the request continues and its response passed into the `ResultsFilterResponse` delegate where it can be cached. 

### Implicitly populate SessionId and Version Number

Service Clients can be used to auto-populate Request DTO's implementing `IHasSessionId` or `IHasVersion` by assigning the `Version` and `SessionId` properties on the Service Client, e.g:

```csharp
client.Version = 1;
client.SessionId = authResponse.SessionId;
```

Which populates the SessionId and Version number on each Request DTO's that implementing the specific interfaces, e.g:

```csharp
public class Hello : IReturn<HelloResponse>, IHasSessionId, IHasVersion {
    public int Version { get; set; }
    public string SessionId { get; set; }
    public string Name { get; set; }
}

client.Get(new Hello { Name = "World" }); //Auto populates Version and SessionId
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

var response = client.Send(new HelloByGet { Name = "World" }); //GET

await client.SendAsync(new HelloByPut { Name = "World" }); //PUT
```

Interface markers is supported in all .NET Service Clients, they're also included in the generated 
[Add ServiceStack Reference](/add-servicestack-reference) DTO's so they're also available in the
[Java JsonServiceClient](/java-add-servicestack-reference) and
[Swift JsonServiceClient](/swift-add-servicestack-reference). It's also available in our 3rd Party [StripeGateway](https://github.com/ServiceStack/Stripe).

Whilst a simple feature, it enables treating your remote services as a message-based API 
[yielding its many inherent advantages](/advantages-of-message-based-web-services#advantages-of-message-based-designs) 
where your Application API's need only pass Request DTO models around to be able to invoke remote Services, decoupling the Service Request from its implementation which can be now easily managed by a high-level adapter that takes care of proxying the Request to the underlying Service Client. The adapter could also add high-level functionality of it's own including auto retrying of failed requests, generic error handling, logging/telemetrics, event notification, throttling, offline queuing/syncing, etc.

## File Uploads

File uploads can be accessed within Service implementations from the `Request.Files` collection which you can write to the registered
[Writable Virtual Files Provider](/virtual-file-system) with:

```csharp
[Route("/files/upload")]
public class UploadFile {}

public class UploadFileService : Service
{
    readonly string UploadsDir = "uploads";

    public object Post(UploadFile request)
    {
        var uploadedFile = base.Request.Files[0];
        VirtualFiles.WriteFile(UploadsDir.CombineWith(uploadedFile.FileName), uploadedFile.InputStream);
        return new FileUploadResponse { ... };
    }
}
```

Alternatively [Managed File Uploads](/locode/files-overview) can provide a more effortless solution for configuring custom validation, multiple upload locations
and also includes File APIs to access & manage file uploads.

### Uploading File with Request

The Service Clients utilize standard [HTTP multipart/form-data](https://www.ietf.org/rfc/rfc2388.txt) Content-Type for 
uploading files as demonstrated in Talent Blazor's
[FileUploadTests.cs](https://github.com/NetCoreApps/TalentBlazor/blob/main/TalentBlazor.Tests/FileUploadTests.cs)
which uploads a single attachment when creating a Contact with a Profile Image and multiple file attachments when
submitting a Job Application:

```csharp
var profileImg = await ProfileImageUrl.GetStreamFromUrlAsync();
var contact = await client.PostFileWithRequestAsync<Contact>(profileImg, "cody-fisher.png", 
    new CreateContact
    {
        FirstName = "Cody",
        LastName = "Fisher",
        Email = "cody.fisher@gmail.com",
        JobType = "Security",
        PreferredLocation = "Remote",
        PreferredWorkType = EmploymentType.FullTime,
        AvailabilityWeeks = 1,
        SalaryExpectation = 100_000,
        About = "Lead Security Associate",
    }, fieldName:nameof(CreateContact.ProfileUrl));

// contact.ProfileUrl = /profiles/cody-fisher.png

var uploadedImage = await client.BaseUri.CombineWith(contact.ProfileUrl).GetStreamFromUrlAsync();
var coverLetter = new FileInfo($"{AppData}/sample_coverletter.pdf");
var resume = new FileInfo($"{AppData}/sample_resume.pdf");

var attachmentsField = nameof(CreateJobApplication.Attachments);
var uploadAttachments = new UploadFile[] {
    new(coverLetter.Name, coverLetter.OpenRead(), attachmentsField),
    new(resume.Name, coverLetter.OpenRead(), attachmentsField),
    new(contact.ProfileUrl.LastRightPart('/'), uploadedImage, attachmentsField),
};

var jobApp = await client.PostFilesWithRequestAsync<JobApplication>(new CreateJobApplication {
        JobId = 1,
        AppliedDate = DateTime.UtcNow,
        ContactId = contact.Id,
    }, uploadAttachments);

uploadAttachments.Each(x => x.Stream.Dispose());
```

This example also shows APIs are able to submit files from any `Stream` that can be sourced from anywhere,
including the HTTP Response stream of a Remote URI or files from a local hard drive. 

### Using HttpClient MultipartFormDataContent

The [.NET 6+ JsonApiClient](/csharp-client#jsonapiclient) lets us provide an even more flexible approach by utilizing 
`MultipartFormDataContent()` which we've enhanced with high-level extension methods to enable a Fluent API for constructing 
custom API Requests populated from multiple sources, which can be sent using its `ApiForm*` methods:

```csharp
var profileImg = await ProfileImageUrl.GetStreamFromUrlAsync();
using var createContact = new MultipartFormDataContent()
    .AddParams(new CreateContact
    {
        FirstName = "Cody",
        LastName = "Fisher",
        Email = "cody.fisher@gmail.com",
        JobType = "Security",
        PreferredLocation = "Remote",
        PreferredWorkType = EmploymentType.FullTime,
        AvailabilityWeeks = 1,
        SalaryExpectation = 100_000,
        About = "Lead Security Associate",
    })
    .AddFile(nameof(CreateContact.ProfileUrl), "cody-fisher.png", profileImg);

var contactApi = await client.ApiFormAsync<Contact>(typeof(CreateContact).ToApiUrl(), createContact);
// contactApi.Succeeded = true
var contact = contactApi.Response!;
// contact.ProfileUrl   = /profiles/cody-fisher.png

using var uploadedImage = await client.BaseUri.CombineWith(contact.ProfileUrl).GetStreamFromUrlAsync();
var coverLetter = new FileInfo($"{AppData}/sample_coverletter.pdf");
var resume = new FileInfo($"{AppData}/sample_resume.pdf");

var attachmentsField = nameof(CreateJobApplication.Attachments);
var createJobApp = new MultipartFormDataContent()
    .AddParams(new CreateJobApplication {
        JobId = 1,
        AppliedDate = DateTime.UtcNow,
        ContactId = contact.Id,
    })
    .AddFile(attachmentsField, coverLetter)
    .AddFile(attachmentsField, resume)
    .AddFile(attachmentsField, contact.ProfileUrl.LastRightPart('/'), uploadedImage);

var jobAppApi = await client.ApiFormAsync<JobApplication>(
    typeof(CreateJobApplication).ToApiUrl(), createJobApp);
// jobAppApi.Succeeded = true
var jobApp = jobAppApi.Response!;
```

::: tip
All `JsonApiClient` Async APIs also have 
[safe sync equivalents](/csharp-client#safe-sync-httpclient-apis) when access outside an async method is needed 
:::

### Upload a single File

You can use the `PostFile` API to upload a single File, with the Route of the Service you want to call,
the name of the file and the `Stream` of its contents, e.g:

```csharp
var client = new JsonServiceClient(baseUrl);
using var fileStream = new FileInfo(filePath).OpenRead();
var fileName = "upload.html";
var response = client.PostFile<FileUploadResponse>("/files/upload", 
    fileStream, fileName, MimeTypes.GetMimeType(fileName));
```

Files uploaded using the `PostFile*` APIs are uploaded as a HTTP POST using the `multipart/form-data` Content-Type which can 
be accessed from the `IRequest.Files` collection in your Services, e.g:

```csharp
[Route("/files/upload")]
public class UploadFile {}

public class UploadFileService : Service
{
    readonly string UploadsDir = "uploads";

    public object Post(UploadFile request)
    {
        var uploadedFile = base.Request.Files[0];
        VirtualFiles.WriteFile(UploadsDir.CombineWith(uploadedFile.FileName), uploadedFile.InputStream);
        return new FileUploadResponse { ... };
    }
}
```

You can use the `PostFileWithRequest` API To also include additional metadata with your File Upload, e.g:

```csharp
[DataContract]
[Route("/files/upload")]
public class FileUpload : IReturn<FileUploadResponse>
{
    [DataMember]
    public int CustomerId { get; set; }

    [DataMember]
    public DateTime CreatedDate { get; set; }
}

var client = new JsonApiClient(baseUrl);
var fileInfo = new FileInfo(filePath);
using var fileStream = fileInfo.OpenRead();
var request = new FileUpload {
    CustomerId = customerId,
    CreatedDate = fileInfo.CreationTimeUtc,
};

var response = client.PostFileWithRequest<FileUploadResponse>(
    "/files/upload", fileStream, fileInfo.Name, request);
```

### Multiple File Uploads

The `PostFilesWithRequest` APIs available in all .NET Service Clients allow you to easily upload multiple 
streams within a single HTTP request. It supports populating Request DTO with any combination of QueryString 
and POST'ed FormData in addition to multiple file upload data streams:

```csharp
using var stream1 = uploadFile1.OpenRead();
using var stream2 = uploadFile2.OpenRead();

var client = new JsonServiceClient(baseUrl);
var response = client.PostFilesWithRequest<MultipleFileUploadResponse>(
    "/multi-fileuploads?CustomerId=123",
    new MultipleFileUpload { CustomerName = "Foo,Bar" },
    new[] {
        new UploadFile("upload1.png", stream1),
        new UploadFile("upload2.png", stream2),
    });
```

Example using only a Typed Request DTO. The `JsonApiClient` also includes async equivalents for each of the 
`PostFilesWithRequest` APIs:

```csharp
using var stream1 = uploadFile1.OpenRead();
using var stream2 = uploadFile2.OpenRead();

var client = new JsonApiClient(baseUrl);
var response = await client.PostFilesWithRequestAsync<MultipleFileUploadResponse>(
    new MultipleFileUpload { CustomerId = 123, CustomerName = "Foo,Bar" },
    new[] {
        new UploadFile("upload1.png", stream1),
        new UploadFile("upload2.png", stream2),
    });
```

### Versatile Multi Part Content Type APIs

[AutoQueryCrudTests.References.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/tests/ServiceStack.WebHost.Endpoints.Tests/AutoQueryCrudTests.References.cs)
showcases how we can take advantage of `MultipartFormDataContent` to construct custom requests using a combination
of different Content Type sources, including single and multiple file attachments within a single request:

```csharp
public class MultipartRequest : IPost, IReturn<MultipartRequest>
{
    public int Id { get; set; }
    public string String { get; set; }
    
    // Complex types sent as JSV by default
    public Contact Contact { get; set; }
    
    [MultiPartField(MimeTypes.Json)]
    public PhoneScreen PhoneScreen { get; set; }
    
    [MultiPartField(MimeTypes.Csv)]
    public List<Contact> Contacts { get; set; }
    
    [UploadTo("profiles")]
    public string ProfileUrl { get; set; }
    
    [UploadTo("applications")]
    public List<UploadedFile> UploadedFiles { get; set; } 
}
```

[Complex types are sent using JSV](/serialization-deserialization) by default which is a
more human & wrist-friendly and more efficient format than JSON, however we could also take advantage of the flexibility
in HTTP **multipart/form-data** requests to construct an HTTP API Request utilizing multiple Content-Type's optimized
for the data we're sending, e.g:

- JSON/JSV more optimal for hierarchical graph data 
- CSV more optimal for sending tabular data
- File Uploads are more optimal for sending large files

To facilitate this in our Server APIs we can use `[MultiPartField]` attribute to instruct ServiceStack which registered
serializer it should use to deserialize the form-data payload, whilst we can continue using the generic `[UploadTo]`
attribute in normal APIs to handle our File Uploads and populate the Request DTO with the uploaded file metadata.

Our `MultipartFormDataContent` extension methods simplifies our client logic by allowing us to easily populate this 
custom request in a single Fluent construction expression:

```csharp
using var content = new MultipartFormDataContent()
    .AddParam(nameof(MultipartRequest.Id), 1)
    .AddParam(nameof(MultipartRequest.String), "foo")
    .AddParam(nameof(MultipartRequest.Contact), 
        new Contact { Id = 1, FirstName = "First", LastName = "Last" })
    .AddJsonParam(nameof(MultipartRequest.PhoneScreen), 
        new PhoneScreen { Id = 3, JobApplicationId = 1, Notes = "The Notes"})
    .AddCsvParam(nameof(MultipartRequest.Contacts), new[] {
        new Contact { Id = 2, FirstName = "First2", LastName = "Last2" },
        new Contact { Id = 3, FirstName = "First3", LastName = "Last3" },
    })
    .AddFile(nameof(MultipartRequest.ProfileUrl), "profile.txt", file1Stream)
    .AddFile(nameof(MultipartRequest.UploadedFiles), "uploadedFiles1.txt", file2Stream)
    .AddFile(nameof(MultipartRequest.UploadedFiles), "uploadedFiles2.txt", file3Stream));

var api = await client.ApiFormAsync<MultipartRequest>(typeof(MultipartRequest).ToApiUrl(), content);
if (!api.Succeeded) api.Error.PrintDump();
```

## Capture HTTP Headers in .NET Service Clients

A common issue when trying to diagnose service integration issues is wanting to inspect the full HTTP traffic to help identify issues. Inside .NET Applications this would typically require using an external packet sniffer like Fiddler but just like Post Command **raw** HTTP captured output above you can now capture the raw HTTP traffic of all .NET `*ServiceClient` with the new `CaptureHttp()` API.

To print HTTP requests to the Console use:

```csharp
var client = new JsonServiceClient(BaseUrl);
client.CaptureHttp(print:true);

var authResponse = client.Send(new Authenticate { provider = "credentials", UserName = "admin", Password = "test" });
```

Which will print out the raw HTTP Request & Response Headers and body to the Console, e.g:

```
POST /json/reply/Authenticate HTTP/1.1
Host: test.servicestack.net
Accept: application/json
User-Agent: ServiceStack .NET Client 5.121
Accept-Encoding: gzip,deflate
Content-Type: application/json

{"provider":"credentials","UserName":"admin","Password":"test"}

HTTP/1.1 200 OK
Server: nginx/1.18.0, (Ubuntu)
Date: Sat, 21 Aug 2021 09:51:34 GMT
Transfer-Encoding: chunked
Connection: keep-alive
Set-Cookie: ss-id=o7VAdXm7JKLy92XiQcQQ; path=/; samesite=strict; httponly, ss-pid=I2MdbrzWZILqNCOqGlyR; expires=Wed, 21 Aug 2041 09:51:34 GMT; path=/; samesite=strict; httponly, ss-opt=temp; expires=Wed, 21 Aug 2041 09:51:34 GMT; path=/; samesite=strict; httponly, X-UAId=2; expires=Wed, 21 Aug 2041 09:51:34 GMT; path=/; samesite=strict; httponly, ss-tok=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjNuLyJ9.eyJzdWIiOjIsImlhdCI6MTYyOTUzOTQ5NCwiZXhwIjoxNjMwNzQ5MDk0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJGaXJzdCBhZG1pbiIsImZhbWlseV9uYW1lIjoiTGFzdCBhZG1pbiIsIm5hbWUiOiJhZG1pbiBEaXNwbGF5TmFtZSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiQWRtaW4iXSwianRpIjoxMTR9.rHk-OdCwd8wR4AsT7exLRUr59-mzFs0FvKZUeZhvKMI; expires=Sat, 04 Sep 2021 09:51:34 GMT; path=/; samesite=strict; httponly, ss-reftok=eyJ0eXAiOiJKV1RSIiwiYWxnIjoiSFMyNTYiLCJraWQiOiIzbi8ifQ.eyJzdWIiOjIsImlhdCI6MTYyOTUzOTQ5NCwiZXhwIjoxNjYxMDc1NDk0LCJqdGkiOi02OX0.35MpYdz-QIkbVf98y_wNTA9PIYDy_EEQc3zfkpFvuQc; expires=Sun, 21 Aug 2022 09:51:34 GMT; path=/; samesite=strict; httponly
Vary: Accept
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Content-Type, Allow, Authorization, X-Args
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
X-Powered-By: ServiceStack/5.111 NetCore/Linux
X-Cookies: ss-tok,ss-reftok
Content-Type: application/json; charset=utf-8

{"userId":"2","sessionId":"o7VAdXm7JKLy92XiQcQQ","userName":"admin","displayName":"admin DisplayName","bearerToken":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImtpZCI6IjNuLyJ9.eyJzdWIiOjIsImlhdCI6MTYyOTUzOTQ5NCwiZXhwIjoxNjMwNzQ5MDk0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImdpdmVuX25hbWUiOiJGaXJzdCBhZG1pbiIsImZhbWlseV9uYW1lIjoiTGFzdCBhZG1pbiIsIm5hbWUiOiJhZG1pbiBEaXNwbGF5TmFtZSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIiwicm9sZXMiOlsiQWRtaW4iXSwianRpIjoxMTR9.rHk-OdCwd8wR4AsT7exLRUr59-mzFs0FvKZUeZhvKMI","refreshToken":"eyJ0eXAiOiJKV1RSIiwiYWxnIjoiSFMyNTYiLCJraWQiOiIzbi8ifQ.eyJzdWIiOjIsImlhdCI6MTYyOTUzOTQ5NCwiZXhwIjoxNjYxMDc1NDk0LCJqdGkiOi02OX0.35MpYdz-QIkbVf98y_wNTA9PIYDy_EEQc3zfkpFvuQc","profileUrl":"data:image/svg+xml,...","roles":["Admin"],"permissions":[],"responseStatus":{}}
```

Alternatively you can log it to the debug logger with:

```csharp
var client = new JsonServiceClient(BaseUrl);
client.CaptureHttp(log:true);
```

Or if preferred you can capture it in a `StringBuilder` to inspect later by disabling clearing it after each request:

```csharp
var client = new JsonServiceClient(BaseUrl);
client.CaptureHttp(clear:false);
```

Which will begin capturing all HTTP requests made by that client in a `StringBuilder` you can access with:

```csharp
client.HttpLog
```

### ServiceClient URL Resolvers

The urls used in all .NET Service Clients are now customizable with the new `UrlResolver` and `TypedUrlResolver` 
delegates. 

E.g. you can use this feature to rewrite the URL used with the Request DTO Type Name used as the subdomain by:

```csharp
[Route("/test")] 
class Request {}

var client = JsonServiceClient("http://example.org/api") {
    TypedUrlResolver =  (meta, httpMethod, dto) => 
        meta.BaseUri.Replace("example.org", dto.GetType().Name + ".example.org")
            .CombineWith(dto.ToUrl(httpMethod, meta.Format)));
};

var res = client.Get(new Request());  //= http://Request.example.org/api/test
var res = client.Post(new Request()); //= http://Request.example.org/api/test
```

This feature is also implemented in `JsonHttpClient`, examples below shows rewriting APIs that use custom urls:

```csharp
var client = JsonHttpClient("http://example.org/api") {
    UrlResolver = (meta, httpMethod, url) => 
        meta.BaseUri.Replace("example.org", "111.111.111.111").CombineWith(url))
};

await client.DeleteAsync<MockResponse>("/dummy"); 
//=http://111.111.111.111/api/dummy

await client.PutAsync<MockResponse>("/dummy", new Request()); 
//=http://111.111.111.111/api/dummy
```

## [ServiceStack.Discovery.Consul](https://github.com/wwwlicious/servicestack-discovery-consul)

This feature makes it easier to support features like
[ServiceStack.Discovery.Consul](https://github.com/wwwlicious/servicestack-discovery-consul)
plugin which enables external RequestDTO endpoint discovery 
by integrating with [Consul.io](http://consul.io) to provide automatic service registration and health checking.

## Built-in Clients

All REST and ServiceClients share the same interfaces (`IServiceClient`, `IRestClient` and `IRestClientAsync`) so they can easily be replaced (for increased perf/debuggability/etc) with a single line of code.

### JsonHttpClient

The new `JsonHttpClient` is an alternative to the existing generic typed `JsonServiceClient` for consuming ServiceStack Services which instead of using **HttpWebRequest** is based on Microsoft's latest async [HttpClient](https://www.nuget.org/packages/Microsoft.Net.Http). 

JsonHttpClient implements the full [IServiceClient API](https://gist.github.com/mythz/4683438240820b522d39) making it an easy drop-in replacement for your existing JsonServiceClient where in most cases it can simply be renamed to JsonHttpClient, e.g:

```csharp
//IServiceClient client = new JsonServiceClient("https://techstacks.io");
IServiceClient client = new JsonHttpClient("https://techstacks.io");

var response = await client.GetAsync(new GetTechnology { Slug = "servicestack" })
```

::: warning
As .NET's HttpClient only supports async APIs it needs to use "sync over async" to implement sync APIs **which should be avoided**. If your API needs to make sync API calls it should use .NET 6's `JsonApiClient` or the `JsonServiceClient` instead.
:::

#### Install

JsonHttpClient can be downloaded from NuGet at:

:::copy
`<PackageReference Include="ServiceStack.HttpClient" Version="8.*" />`
:::

### Xamarin Native HttpClient

Using the default managed `HttpClient` implementation in Xamarin has a 
[number of issues](https://docs.microsoft.com/en-us/xamarin/cross-platform/macios/http-stack#cons-2) in iOS and Android devices.

Xamarin's MSDN docs explain the advantages of native implementations and show how you can enable 
[native HttpClient implementation for iOS/macOS](https://docs.microsoft.com/en-us/xamarin/cross-platform/macios/http-stack) for your project.

If you want to [programmatically enable it for iOS/macOS](https://docs.microsoft.com/en-us/xamarin/cross-platform/macios/http-stack#programmatically-setting-the-httpmessagehandler), you'll likely want to configure it once on the `GlobalHttpMessageHandlerFactory`
for all `JsonHttpClient` instances to use, e.g:

```csharp
// iOS
JsonHttpClient.GlobalHttpMessageHandlerFactory = () => 
    new NSUrlSessionHandler();
```

Or to only configure it for a specific client you can initialize an instance with:

```csharp
// iOS
var client = new JsonHttpClient(baseUrl) { 
    HttpMessageHandler = new NSUrlSessionHandler()
};
```

Refer to the [Xamarin MSDN docs for Android HttpClient](https://docs.microsoft.com/en-us/xamarin/android/app-fundamentals/http-stack?tabs=windows) for
how to enable it in your project, which can be globally programmatically configured with:

```csharp
// Android
JsonHttpClient.GlobalHttpMessageHandlerFactory = () => 
    new Xamarin.Android.Net.AndroidClientHandler();
```

Or per instance with:

```csharp
// Android
var client = new JsonHttpClient(baseUrl) { 
    HttpMessageHandler = new Xamarin.Android.Net.AndroidClientHandler()
};
```

### Differences with JsonServiceClient

Whilst the goal is to retain the same behavior in both clients, there are some differences resulting from using HttpClient where the Global and Instance Request and Response Filters are instead passed HttpClients `HttpRequestMessage` and `HttpResponseMessage`. 

Also, all API's are **Async** under-the-hood where any Sync API's that doesn't return a `Task<T>` just blocks on the Async `Task.Result` response. As this can dead-lock in certain environments we recommend sticking with the Async API's unless safe to do otherwise. 

### HttpWebRequest Service Clients

Whilst the list below contain the built-in clients based on .NET's built-in `HttpWebRequest`:

- implements both `IRestClient` and `IServiceClient`:
    - [JsonServiceClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Client/JsonServiceClient.cs)
    (uses default endpoint with **JSON**) - recommended
    - [JsvServiceClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Client/JsvServiceClient.cs)
    (uses default endpoint with **JSV**)
    - [XmlServiceClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Client/XmlServiceClient.cs)
    (uses default endpoint with **XML**)
    - [CsvServiceClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Client/CsvServiceClient.cs)
    (uses default endpoint with **CSV**)
    - [MsgPackServiceClient](/messagepack-format)
    (uses default endpoint with **Message-Pack**)
    - [ProtoBufServiceClient](/protobuf-format)
    (uses default endpoint with **Protocol Buffers**)
- implements `IServiceClient` only:
    - [Soap11ServiceClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Client/Soap11ServiceClient.cs) (uses **SOAP 11** endpoint)
    - [Soap12ServiceClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Client/Soap12ServiceClient.cs)
    (uses **SOAP 12** endpoint)

#### Install

The HttpWebRequest clients above are available in:

:::copy
`<PackageReference Include="ServiceStack.Client" Version="8.*" />`
:::

# Community Resources

  - [Reactive ServiceStack](https://gist.github.com/bamboo/5078236) by [@rodrigobamboo](https://twitter.com/rodrigobamboo)
