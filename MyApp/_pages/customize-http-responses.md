---
slug: customize-http-responses
title: Customize HTTP Responses
---

ServiceStack provides multiple ways to customize your services HTTP response. Each option gives you complete control of the final HTTP Response that's returned by your service: 

  1. Decorating it inside a `HttpResult` object
  2. Throwing a `HttpError` 
  3. Returning a `HttpError`
  4. Using a Request or Response [Filter Attribute](/filter-attributes) like the built-in `[AddHeader]` (or your own) or using a [Global Request or Response Filter](/request-and-response-filters).
  5. Modifying output by accessing your services `base.Response` [IHttpResponse API](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IHttpResponse.cs)
  6. Returning responses in a decorated `HttpResult`

Here are some code examples below using these different approaches:

```csharp
public class HelloService : Service
{ 
    public object Get(Hello request) 
    { 
        //1. Returning a custom Status and Description with Response DTO body:
        var responseDto = ...;
        return new HttpResult(responseDto, HttpStatusCode.Conflict) {
            StatusDescription = "Computer says no",
        };

        //2. Throw a HttpError:
        throw new HttpError(HttpStatusCode.Conflict, "Some Error Message");

        //3. Return a HttpError:
        return new HttpError(HttpStatusCode.Conflict, "Some Error Message");

        //4. Modify the Request's IHttpResponse
        base.Response.StatusCode = (int)HttpStatusCode.Redirect;
        base.Response.AddHeader("Location", "http://path/to/new/uri");
        base.Response.EndRequest(); //Short-circuits Request Pipeline
    }

    //5. Using a Request or Response Filter 
    [AddHeader(ContentType = "text/plain")]
    [AddHeader(ContentDisposition = "attachment; filename=hello.txt")]
    public string Get(Hello request)
    {
        return $"Hello, {request.Name}!";
    }

    //6. Returning responses in a decorated HttpResult
    public object Get(Hello request)
    {
        return new HttpResult($"Hello, {request.Name}!") {
            ContentType = MimeTypes.PlainText,
            Headers = {
                [HttpHeaders.ContentDisposition] = "attachment; filename=\"hello.txt\""
            }
        };
    }
}
```

### Short-circuiting the Request Pipeline

At anytime you can short-circuit the Request Pipeline and end the response by calling `IResponse.EndRequest()`, e.g:

```csharp
res.EndRequest();
```

If you only have access to the `IRequest` you can access the `IResponse` via the Response property, e.g:

```csharp
req.Response.EndRequest();
```

### Using a [Global Request or Response Filter](/request-and-response-filters)

You can use a Global Request Filter to set Custom HTTP Headers and then short-circuit the request:

```csharp
public override void Configure(Container container) 
{ 
    GlobalRequestFilters.Add((req, res, requestDto) => 
    {
        if (req.Verb == HttpMethods.Head && requestDto is DownloadTrack track)
        {
            var dep = req.TryResolve<IDependency>();

            res.ContentType = "audio/mpeg";
            res.AddHeader("X-Genre", dep.GetGenre(track));
            res.SetContentLength(dep.CalculateLength(track));
            res.EndRequest();
        }
    });
}
```

### Using a [Request or Response Filter Attribute](/filter-attributes)

Example 4). uses the in-built [AddHeaderAttribute](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/AddHeaderAttribute.cs) to modify the HTTP Response using a [Request Filter attribute](/filter-attributes). You can also modify all HTTP Service Responses by using a [Global Request or Response Filter](/request-and-response-filters): 

```csharp
public class AddHeaderAttribute : RequestFilterAttribute
{
    public string Name { get; set; }
    public string Value { get; set; }
    
    public AddHeaderAttribute() { }

    public AddHeaderAttribute(string name, string value)
    {
        Name = name;
        Value = value;
    }

    public override void Execute(IRequest req, IResponse res, object requestDto)
    {
        if (string.IsNullOrEmpty(Name) || string.IsNullOrEmpty(Value)) 
            return;

        if (Name.EqualsIgnoreCase(HttpHeaders.ContentType))
        {
            res.ContentType = Value;
        }
        else
        {
            res.AddHeader(Name, Value);
        }
    }
...
}
```

## Custom Serialized Responses

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

## Request and Response Converters

The [Encrypted Messaging Feature](/auth/encrypted-messaging) takes advantage of Request and Response Converters that let you change the Request DTO and Response DTO's that get used in ServiceStack's Request Pipeline where:

### Request Converters

Request Converters are executed directly after any [Custom Request Binders](/serialization-deserialization#create-a-custom-request-dto-binder):

```csharp
appHost.RequestConverters.Add(async (req, requestDto) => {
    //Return alternative Request DTO or null to retain existing DTO
});
```

### Response Converters

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

### Using a Custom ServiceRunner

The ability to extend ServiceStack's service execution pipeline with Custom Hooks is an advanced customization feature that for most times is not needed as the preferred way to add composable functionality to your services is to use [Request / Response Filter attributes](/filter-attributes) or apply them globally with [Global Request/Response Filters](/request-and-response-filters).

To be able to add custom hooks without needing to subclass any service, we've introduced a [IServiceRunner](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IServiceRunner.cs) that decouples the execution of your service from the implementation of it.

To add your own Service Hooks you just need to override the default Service Runner in your AppHost from its default implementation:

```csharp
public virtual IServiceRunner<TRequest> CreateServiceRunner<TRequest>(
    ActionContext actionContext)
{
    //Cached per Service Action
    return new ServiceRunner<TRequest>(this, actionContext); 
}
```

With your own:

```csharp
public override IServiceRunner<TRequest> CreateServiceRunner<TRequest>(
    ActionContext actionContext)
{           
    //Cached per Service Action
    return new MyServiceRunner<TRequest>(this, actionContext); 
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
