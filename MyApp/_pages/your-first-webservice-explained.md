---
slug: your-first-webservice-explained
title: Your first Web Service Explained
---

Let's look a bit deeper into the [Hello World service](/create-your-first-webservice#how-does-it-work) you created:

As you have seen, the convention for response DTO is `RequestDTO` and  `RequestDTOResponse`. **Note, request and response DTO should be in the same namespace if you want ServiceStack to recognize the DTO pair**.

To support automatic exception handling, you also need to add a `ResponseStatus` property to the response DTO:

```csharp
// Request DTO
public class Hello : IReturn<HelloResponse>
{
    public string Name { get; set; }
}

// Response DTO (follows naming convention)
public class HelloResponse
{
    public string Result { get; set; }

    public ResponseStatus ResponseStatus { get; set; } //Automatic exception handling
}
```

Services are implemented in a class that either inherits from the `Service` base class or implements the `IService` empty marker interface. Inheriting from the convenient `Service` base class provides easy access to the most common functionality.  

```csharp
public class HelloService : Service
{
    public object Any(Hello request)
    {
        return new HelloResponse { Result = $"Hello, {request.Name}" };
    }
}
```

The above service can be called with **Any** HTTP Verb (e.g. GET, POST,..) from any endpoint or format (e.g. JSON, XML, etc). You can also choose to handle a specific Verb by changing the method name to suit. 

E.g. you can limit the Service to only handle HTTP **GET** requests by using the `Get` method:

```csharp
public class HelloService : Service
{
    public object Get(Hello request) => new HelloResponse { Result = $"Hello, {request.Name}" };
}
```

## Calling Web Services

Thanks to the above `IReturn<T>` interface marker you'll be able to use the terse, typed Service Client APIs, e.g:

```csharp
var client = new JsonServiceClient(BaseUri);

HelloResponse response = client.Get(new Hello { Name = "World" }); 
```

Request DTOs that don't implement `IReturn<T>` will need to explicitly specify the Response DTO on their call-site, e.g:

```csharp
HelloResponse response = client.Get<HelloResponse>(new Hello { Name = "World" }); 
HelloResponse response = client.Get<HelloResponse>("/hello/World!"); 
```

Alternatively you could use a general purpose HTTP Client like [HTTP Utils](/http-utils):

```csharp
HelloResponse response = "http://base.url/hello/World"
    .GetJsonFromUrl()
    .FromJson<HelloResponse>();
```

We highly recommend annotating Request DTO's with the above `IReturn<T>` marker as it enables a generic typed API without clients having to know and specify the Response at each call-site, which would be invalidated and need to be manually updated if the Service Response Type changes.

More details on the Service Clients is available on the [C#/.NET Service Clients page](/csharp-client).

### Registering Custom Routes

If no routes are defined the .NET Service Clients will use the [pre-defined Routes](/routing#pre-defined-routes).
You can annotate your Request DTO with the `[Route]` attribute to register additional Custom Routes, e.g:

```csharp
//Request DTO
[Route("/hello")]
[Route("/hello/{Name}")]
public class Hello : IReturn<HelloResponse>
{
    public string Name { get; set; }
}
```

The .NET ServiceClients will then use the best matching Route based on the populated properties on the Request DTO.

### Routing Tips

No **?queryString** or POST Form Data should be included in the route as ServiceStack automatically populates Request DTOs with all matching params, e.g:

```csharp
[Route("/hello")]
```

Matches both `/hello` and `/hello?name=World` with the latter populating the `Name` Request DTO **public property**.

When the route includes a variable, e.g:

```csharp
[Route("/hello/{Name}")]
```

It only matches:

```
/hello/name
```

Whereas using a wildcard:

```csharp
[Route("/hello/{Name*}")]
```

Matches all routes:

```
/hello
/hello/name
/hello/my/name/is/ServiceStack 
```

More details about Routing is available on the [Routing page](/routing).
