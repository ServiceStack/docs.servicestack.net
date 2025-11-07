---
slug: auto-batched-requests
title: Auto Batched Requests
---

One of the best ways to improve performance, efficiency and reduce latency is to minimize the number of network requests required, which is one of the reasons we've always encouraged [Coarse-grained API designs](/why-servicestack#servicestack-encourages-development-of-message-style-re-usable-and-batch-full-web-services) - which also lend themselves to better encapsulation and re-use. 

A common use-case that can be improved are clients making multiple requests to the same API, but due to the lack of a better alternative batched API or control over the server implementation, will default to making multiple N+1 web service requests. 

### Pre-defined Routes

For [Endpoint Routing](/endpoint-routing), the pre-defined route for Auto Batched Requests is:

<div class="not-prose">
<h3 class="text-4xl text-center text-indigo-800 pb-3">/api/{Request}[]</h3>
</div>

For [Leegacy Routing](/routing), the pre-defined route for Auto Batched Requests is:

<div class="not-prose">
<h3 class="text-4xl text-center text-indigo-800 pb-3">/json/reply/{Request}[]</h3>
</div>

## All Services support Batching

Thanks to it's [message-based design](/advantages-of-message-based-web-services), ServiceStack is able to enable high-level generic functionality like Request Batching which is now implicitly available for all Services, without any additional effort - where multiple requests of the same type can be sent together in a single HTTP Request.

This is enabled in all [.NET Service Clients](/csharp-client) via the new `SendAll()` and `SendAllOneWay()` API's, e.g:

```csharp
var client = new JsonApiClient(BaseUrl);
var requests = new[]
{
    new Request { Id = 1, Name = "Foo" },
    new Request { Id = 2, Name = "Bar" },
    new Request { Id = 3, Name = "Baz" },
};

List<Response> responses = client.SendAll(requests);
```

The API works as you would expect where multiple requests can be sent together and the Service Client will return a list of all responses in the same order as the requests were sent. ServiceStack also adds the `X-AutoBatch-Completed` HTTP Response Header containing the **number** of Requests that were executed. E.g. if 
one of the Requests threw an Exception it will contain the number of requests that were processed before the Exception was thrown, which short-circuits processing the remaining Auto Batched requests and returns a populated [structured Error Response](/error-handling) of the Exception.

And on the back-end, your Services are none the wiser, remaining focused on handling a single Request DTO. In the case below the Service does some work then stores the response in Redis before returning it:

```csharp
public class MyServices : Service
{
    public object Any(Request request)
    {
        var response = DoWork(request);
        Redis.Store(response);
        return response;
    }
}
```

## Request Execution Flow

From the Service's point of view nothing changes. Request DTO's still get executed one at a time, through all existing filters just as if they we're sent on their own. They're just delivered together within a single HTTP Request, in this case POST'ed as JSON to the `/json/reply/Request[]` [pre-defined route](/routing#pre-defined-routes):

![Auto Batched Requests](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/auto-batched-requests.png)

## Custom Batched Requests Implementations

If a client was previously calling the same API 100 times, the existing overhead of 100 HTTP Requests would be reduced to just **1 HTTP Request** when batched. Although the above Service would still be calling Redis 100 times to store each Response.

If later this API has become really hot and you want to improve it even further, you can later add a custom implementation that accepts a `Request[]` and it will only get called once, with access to all the Request DTO's together. In this case we can use a custom implementation and take advantage of Redis's own batched API's and reduce this further to 1 Redis operation:

```csharp
public class MyServices : Service
{
    public object Any(Request request)
    {
        var response = DoWork(request);
        Redis.Store(response);
        return response;
    }
    
    public object Any(Request[] requests)
    {
        var responses = requests.Map(DoWork);
        Redis.StoreAll(responses);
        return responses;
    }
}
```

So with this custom implementation we've gone from **100 HTTP Requests + 100 Redis Operations** to **1 HTTP Request + 1 Redis Operation**.

Another scenario where you may consider using a **Custom Batched Implementation** is if you wanted to execute all requests within a single RDBMS transaction, which with [OrmLite](https://github.com/ServiceStack/ServiceStack.OrmLite) would look something like:

```csharp
public class MyServices : Service
{
    public object Any(Request request)
    {
        var response = DoWork(request);
        Db.Insert(request);
        return response;
    }

    public object Any(Request[] requests)
    {
        using (var trans = Db.OpenTransaction())
        {
            var responses = requests.Map(x => Any(x));	

            trans.Commit();
            return responses;
        }
    }
}
```

Just like with normal Batched Requests, Custom Batched implementations are still executed one at a time through all request/response filters, taking advantage of any existing logic/validation. 

## Defining a Request DTO to accept a collection of Types

If you instead only wanted multiple Requests to be treated as a single Request through the entire pipeline you can create a new Request DTO that inherits from `List<TRequest>` which then gets treated as a normal Request DTO e, g:

```csharp
public class Requests : List<Request> {}

public class MyServices : Service
{
	...
    public object Any(Requests requests)
    {
        var responses = requests.Map(DoWork);
        Redis.StoreAll(responses);
        return responses;
    }
}
```

More examples of Auto Batched Requests and its behavior can be found in the [ReplyAllTests suite](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/ReplyAllTests.cs).

## Auto Batch Index

The current index of the Auto Batched Request being processed is now being maintained in `IRequest.Items[Keywords.AutoBatchIndex]`.

In Error Responses the index of the request that failed is now being populated in your Response DTO's `ResponseStatus.Meta["AutoBatchIndex"]`.

To also maintain the active `AutoBatchIndex` in [Custom Batched Requests Implementations](#custom-batched-requests-implementations) 
you can use the `IRequest.EachRequest()` extension method, e.g:

```csharp
public object Any(GetCustomAutoBatchIndex[] requests)
{
    var responses = new List<GetAutoBatchIndexResponse>();

    Request.EachRequest<GetCustomAutoBatchIndex>(dto =>
    {
        responses.Add(Any(dto));
    });

    return responses;
}
```
