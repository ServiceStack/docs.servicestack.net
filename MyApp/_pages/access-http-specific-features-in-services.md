---
slug: access-http-specific-features-in-services
title: Access HTTP-specific Features in Services
---

ServiceStack is based on [http handlers](http://msdn.microsoft.com/en-us/library/system.web.ihttphandler.aspx), but ServiceStack provides a clean, dependency-free [IService](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/IService.cs) to implement your Web Services logic in. The philosophy behind this approach is that the less dependencies you have on your environment and its request context, the more testable and re-usable your services become. 

::: info
The core [IRequest](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IRequest.cs) and [IResponse](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IResponse.cs) interfaces used in filters and Services
:::

### Request Filters

The Request Filters are applied before the service gets called and accepts: (IRequest, IResponse, RequestDto) e.g:

```csharp
//Add a request filter to check if the user has a session initialized
this.RequestFilters.Add((httpReq, httpResponse, requestDto) =>
{
    httpReq.Headers["HttpHeader"];
    httpReq.QueryString["queryParam"];
    httpReq.Form["htmlFormParam"];
    httpReq.GetParam("aParamInAnyOfTheAbove");

    httpReq.Cookies["requestCookie"];
    httpReq.AbsoluteUri;
    httpReq.Items["requestData"] = "Share data between Filters and Services";

     //Access underlying Request in ASP.NET hosts
    var aspNetRequest = httpResponse.OriginalRequest as HttpRequestBase;
     //Access underlying Request in HttpListener hosts
    var listenerRequest = httpResponse.OriginalRequest as HttpListenerRequest;
});
```

#### Services

When inheriting from Service you can access them via `base.Request` and `base.Response`:

```csharp
public class MyService : Service
{
    public object Any(Request request)
    {
        var value = base.Request.GetParam("aParamInAnyHeadersFormOrQueryString");
        base.Response.AddHeader("X-CustomHeader", "Modify HTTP Response in Service");
    }
}
```

#### Response Filters

The Response Filters are applied after your service is called and accepts: (IRequest, IResponse, ResponseDto) e.g Add a response filter to add a 'Content-Disposition' header so browsers treat it as a native .csv file:

```csharp
this.ResponseFilters.Add((req, res, responseDto) => 
{
    if (req.ResponseContentType == ContentType.Csv)
    {
        res.AddHeader(HttpHeaders.ContentDisposition,
            $"attachment;filename={req.OperationName}.csv");
    }

    //Access underlying Response in ASP.NET hosts
    var aspNetResponse = httpResponse.OriginalResponse as HttpResponseBase;
    //Access underlying Response in HttpListener hosts
    var listenerResponse = httpResponse.OriginalResponse as HttpListenerResponse;
});
```

### Communicating throughout the Request Pipeline

The recommended way to pass additional metadata about the request is to use the `IRequest.Items` collection. E.g. you can change what Razor View template the response DTO gets rendered in with: 

```csharp
httpReq.Items["Template"] = "_CustomLayout";

...

var preferredLayout = httpReq.Items["Template"];
```

## Advantages for having dependency-free services

If you don't need to access the HTTP specific features your services can be called by any non-HTTP endpoint,  like from a [message queue](/messaging).

### Injecting the IRequest into your Service

Although working in a clean-room can be ideal from re-usability and testability point of view, you stand the chance of missing out a lot of the features present in HTTP.

Just like using built-in Funq IOC container, the way to tell ServiceStack to inject the request context is by implementing the [IRequiresRequest](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IRequiresRequest.cs) interface which will get the [IRequest](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IRequest.cs) injected before each request.

::: info
ServiceStack's Convenient `Service` base class already implements `IRequiresRequest` which allows you to access the `IRequest` with `base.Request` and the HTTP Response with `base.Response`
:::

::: info
To return a customized HTTP Response, e.g. set Response Cookies or Headers, return the [HttpResult](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/HttpResult.cs) object
:::
