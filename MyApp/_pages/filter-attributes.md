---
slug: filter-attributes
title: Filter Attributes
---

ServiceStack also contains interfaces for attributes which can be executed before and after a request like request/response filters. The filter attributes are great for composing re-usable functionality as you can wrap common functionality in a Filter Attribute and selectively annotate which Services they should apply to. 

For example, ServiceStack uses `[Authenticate]` and `[RequiredPermission]` filter attributes to decorate which Services should be protected with authentication or specific permissions (see [Authentication and authorization](/auth/authentication-and-authorization)).

### Request Filter Attributes

Request Filters are executed before Services are called. You can create a Filter Attribute by inheriting from the built-in RequestFilterAttribute's:

```csharp
//Async:
public class CustomAsyncRequestFilterAttribute : RequestFilterAsyncAttribute 
{
    public override async Task ExecuteAsync(IRequest req, IResponse res, object requestDto) 
    {
        string userAgent = req.UserAgent;
        StatisticManager.SaveUserAgent(userAgent);
    }
}

//Sync:
public class CustomRequestFilterAttribute : RequestFilterAttribute 
{
    public override void Execute(IRequest req, IResponse res, object requestDto) { ... }
}
```

Or if you prefer you can instead implement one of the Request or Response Filter interfaces below:

```csharp
public interface IRequestFilterBase
{
    int Priority { get; }      // Prioity of <0 are tun before Global Request Filters. >=0 Run after
    IRequestFilterBase Copy(); // A new shallow copy of this filter is used on every request.
}

public interface IHasRequestFilter : IRequestFilterBase
{
    void RequestFilter(IRequest req, IResponse res, object requestDto);
}

public interface IHasRequestFilterAsync : IRequestFilterBase
{
    Task RequestFilterAsync(IRequest req, IResponse res, object requestDto);
}
```

### Response Filter Attributes

Response Filters are called after Services are executed. 

```csharp
//Async:
public class CustomAsyncResponseFilterAttribute : ResponseFilterAsyncAttribute
{
    public override async Task ExecuteAsync(IRequest req, IResponse res, object responseDto) 
    {
        //This code is executed after the service
        res.AddHeader("Cache-Control", "max-age=3600");
    }
}

//Sync:
public class CustomResponseFilterAttribute : ResponseFilterAttribute
{
    public override void Execute(IRequest req, IResponse res, object responseDto) { ... }
}
```

Alternatively you can implement the `IHasResponseFilter` or `IHasResponseFilterAsync` interfaces instead.

### Action Filter Attributes

All Sync and Async Filter Attributes follow the same [Order of Operations](/order-of-operations) with Async Attributes  executed immediately after any registered sync filters with the same priority.

Filter attributes annotated on methods are always executed immediately before or after the Service, i.e. the Priority is only scoped and sorted between other method-level attributes.

```csharp
public class MyServices : Service
{
    [CustomRequestFilter]
    public object Any(Request request) => ...;
}
```

## Filter Attributes Example

The method signatures for Filter Attributes are the same as Global Request/Response Filters with the `IRequest`, `IResponse` and Request or Response DTO. Filter attributes can change the DTO, the http response (e.g status code) or look for a specific header in the http request. You can also attach any data to this request via the `IHttpRequest.Items` dictionary which all subsequent filters and services can access.

## Example Usage

These two attributes have to be added to a request/response DTO or to the service implementation to enable them.

```csharp

//Request DTO
[Route("/aspect")]
[CustomRequestFilter]
public class User
{
    public string Name { get; set; }
    public string Company { get; set; }
    public int Age { get; set; }
    public int Count { get; set; }
}

//Response DTO
[CustomResponseFilter]
public class UserResponse : IHasResponseStatus
{
    public string Car { get; set; }
    public ResponseStatus ResponseStatus { get; set; }
}
```

...or if you don't want the code-first DTOs messed with attributes:

```csharp
[CustomRequestFilter]
[CustomResponseFilter]
public class AspectService : Service
{
    public object Get(Aspect request)
    {
        ...
    }
}
```

That's all, now ServiceStack recognizes the attributes and executes them on every call!

### Dependencies are auto-wired

Just like in Services and Validators, the filter attributes are also auto-wired, e.g:

```csharp
public class CustomRequestFilterAttribute : RequestFilterAttribute
{
    //This property will be resolved by the IoC container
    public ICacheClient Cache { get; set; }
    
    public void RequestFilter(IRequest req, IResponse res, object requestDto)
    {
        //Access the property 'Cache' here
        
        //This code is executed before the service
        string userAgent = req.UserAgent;
        StatisticManager.SaveUserAgent(userAgent);
    }
}
```

In this case the property `Cache` will be tried to be resolved by the IoC container.

### RequestFilterAttribute base class

ServiceStack also has two base classes, which implement the above interfaces, which make it easier to create contextual filters. Contextual filters are only executed on specific HTTP verbs (GET, POST...).

```csharp
public class StatisticFilterAttribute : RequestFilterAttribute
{
    //This property will be resolved by the IoC container
    public ICacheClient Cache { get; set; }
    
    public StatisticFilterAttribute() {}

    public StatisticFilterAttribute(ApplyTo applyTo)
        : base(applyTo) {}

    public override void Execute(IRequest req, IResponse res, object requestDto)
    {
        //This code is executed before the service
        string userAgent = req.UserAgent;
        StatisticManager.SaveUserAgent(userAgent);
    }
}
```

::: info
The `ResponseFilterAttribute` base class can be used for Response Filter Attributes which works the same as `RequestFilterAttribute` above
:::

### Conditionally Apply Filter Attributes

The base class `RequestFilterAttribute` has an empty constructor and a constructor which takes the `ApplyTo` flag. If the empty constructor is called, the method `Execute` will be called on every HTTP verb (`ApplyTo.All`), with the other constructor it will be called only on the configured HTTP verbs (eg `ApplyTo.Get | ApplyTo.Post`).

So you can use the attribute on your Request DTO/service like that:

```csharp
//Filter will be executed on every request
[StatisticFilter]

//Filter will be executed only on GET and POST requests
[StatisticFilter(ApplyTo.Get | ApplyTo.Post)]
```
