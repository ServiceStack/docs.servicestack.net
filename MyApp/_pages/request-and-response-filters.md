---
slug: request-and-response-filters
title: Request & Response filters
---

ServiceStack's Global Request and Response filter lets you apply your own generic custom behavior to ServiceStack Requests.
These should be registered in your `AppHost.Configure()` Startup: 

## Global Request Filters

The Request Filters are applied before the service gets called and accepts:
([IRequest](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IRequest.cs), [IResponse](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IResponse.cs), RequestDto) e.g:
    
```csharp
//Global Request Filter to check if the user has a session initialized
this.GlobalRequestFilters.Add((req, res, requestDto) => 
{
    var sessionId = req.GetCookieValue("user-session");
    if (sessionId == null)
    {
        res.ReturnAuthRequired();
    }
});
```

### Async 

Use `GlobalRequestFiltersAsync` when you need to make async requests in your Global Request Filters, e.g:

Simplified example of ServiceStack's [Validation Feature](/validation):

```csharp
//Global Async Request Filter to automatically validate a Request DTO
this.GlobalRequestFiltersAsync.Add(async (req, res, requestDto) => 
{    
    var validator = ValidatorCache.GetValidator(req, requestDto.GetType());
    if (validator == null)
        return;

    var validationResult = await Validate(validator, req, requestDto);
    if (validationResult.IsValid)
        return;

    var errorResponse = DtoUtils.CreateErrorResponse(requestDto, validationResult.ToErrorResult());
    
    await res.WriteToResponse(req, errorResponse);
});
```

::: info Tip
If you're writing your own response to the response stream inside the response filter, add `res.EndRequest();` to signal to ServiceStack not to do anymore processing for this request
:::

Simple Rate-limiting example:

```csharp
GlobalRequestFiltersAsync.Add(async (req,res,dto) => {
    var response = await client.Send(new CheckRateLimit { 
        Service = dto.GetType().Name,
        IpAddress = req.UserHostAddress,
     });
     if (response.RateLimitExceeded) 
     {
         res.StatusCode = 403;
         res.StatusDescription = "RateLimitExceeded";
         res.EndRequest();
     }
})
```

## Global Response Filters

The Response Filters are applied after your service is called and accepts:
([IRequest](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IRequest.cs), [IResponse](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IResponse.cs), ResponseDto) e.g:

```csharp
//Add a response filter to add a 'Content-Disposition' header so browsers treat it as a native .csv file
this.GlobalResponseFilters.Add((req, res, responseDto) => 
{
    if (req.ResponseContentType == ContentType.Csv)
    {
        res.AddHeader(HttpHeaders.ContentDisposition,
        string.Format("attachment;filename={0}.csv", req.OperationName));
    }
});
```

## Global Request and Response Filters

  - `PreRequestFilters` - Global Filter executed at the start of all ServiceStack Requests
  - `GlobalRequestFilters` - Global Request Filter for ServiceStack Service Requests
  - `GlobalResponseFilters` - Global Response Filter for ServiceStack Service Requests
  - `GatewayRequestFilters` - Request Filter for [Service Gateway](/service-gateway) Requests
  - `GatewayResponseFilters` - Response Filter for [Service Gateway](/service-gateway) Requests
  - `GlobalMessageRequestFilters` - Request Filter for [Service MQ](/messaging) Requests
  - `GlobalMessageResponseFilters` - Response Filter for [Service MQ](/messaging) Requests

Async versions are also available:

  - `GlobalRequestFiltersAsync` - Global Request Filter for ServiceStack Service Requests
  - `GlobalResponseFiltersAsync` - Global Response Filter for ServiceStack Service Requests
  - `GatewayRequestFiltersAsync` - Request Filter for [Service Gateway](/service-gateway) Requests
  - `GatewayResponseFiltersAsync` - Response Filter for [Service Gateway](/service-gateway) Requests
  - `GlobalMessageRequestFiltersAsync` - Request Filter for [Service MQ](/messaging) Requests
  - `GlobalMessageResponseFiltersAsync` - Response Filter for [Service MQ](/messaging) Requests

### Typed Request Filters

A more typed API to register Global Request and Response filters per Request DTO Type are available under the `RegisterTyped*` API's in AppHost where you can register both typed Request and Response Filters for HTTP and MQ Services independently:

```csharp
void RegisterTypedRequestFilter<T>(Action<IRequest, IResponse, T> filterFn);
void RegisterTypedResponseFilter<T>(Action<IRequest, IResponse, T> filterFn);
void RegisterTypedMessageRequestFilter<T>(Action<IRequest, IResponse, T> filterFn);
void RegisterTypedMessageResponseFilter<T>(Action<IRequest, IResponse, T> filterFn);
```

Here's an example usage that enables more flexibility in multi-tenant solutions by attaching custom data on incoming requests, e.g:

```csharp
public override void Configure(Container container)
{
    RegisterTypedRequestFilter<Resource>((req, res, dto) =>
    {
        var route = req.GetRoute();
        if (route != null && route.Path == "/tenant/{TenantName}/resource")
        {
            dto.SubResourceName = "CustomResource";
        }
    });
}
```

### Autowired Typed Request Filters
 
You can also register Autowired Typed Request and Response Filters which lets you handle Request DTOs in a Typed Filter similar to how Autowired Services handles Typed Request DTOs with access to IOC injected dependencies.
 
Autowired Typed Filters just needs to implement `ITypedFilter<TRequest>` and can be registered in the IOC like a regular dependency, e.g:
 
```csharp
container.RegisterAutoWiredAs<Dependency, IDependency>();
container.RegisterAutoWired<TypedRequestFilter>();
```
 
Then can be registered using the new `RegisterTypedRequestFilter` overload:
 
```csharp
this.RegisterTypedRequestFilter(c => c.Resolve<TypedRequestFilter>());
```
 
Which invokes the Typed Request Filter on each `MyRequest` where it's able to access any IOC injected dependencies, e.g:
 
```csharp
class TypedRequestFilter : ITypedFilter<MyRequest>
{
    public IDependency Dependency { get; set; } // injected by IOC
 
    public void Invoke(IRequest req, IResponse res, MyRequest dto) 
    {
        // Handle MyRequest using a Request Filter
        if (!Dependency.GrantAccess(dto, req))
        {
            res.StatusCode = (int)HttpStatusCode.Forbidden;
            res.StatusDescription = "Thou shall not pass";
            res.EndRequest();
        }
    }
}
```

### Apply custom behavior to multiple DTO's with Interfaces

Typed Filters can also be used to apply custom behavior on Request DTO's sharing a common interface, e.g:

```csharp
public override void Configure(Container container)
{
    RegisterTypedRequestFilter<IHasSharedProperty>((req, res, dtoInterface) => {
        dtoInterface.SharedProperty = "Is Shared";    
    });
}
```

## Message Queue Endpoints

Non-HTTP requests like [Redis MQ](/redis-mq) are treated as _Internal Requests_ which only execute the alternate `GlobalMessageRequestFilters` and `GlobalMessageResponseFilters` and Action [Filter attributes](/filter-attributes). 
