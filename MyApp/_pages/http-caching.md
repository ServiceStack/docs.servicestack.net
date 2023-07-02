---
slug: http-caching
title: HTTP Caching
---

ServiceStack's HTTP Caching support transparently improves the behavior of existing `ToOptimized` Cached 
Responses, provides a typed API to opt-in to **HTTP Client** features, introduces a simpler declarative API 
for enabling both **Server and Client Caching** of Services and also includes Cache-aware clients that are 
able to improve the performance and robustness of all existing .NET Service Clients - functionality that's 
especially valuable to bandwidth-constrained Xamarin.iOS / Xamarin.Android clients offering improved 
performance and greater resilience.

The new caching functionality is encapsulated in the new `HttpCacheFeature` plugin that's pre-registered 
by default and can be removed to disable the new HTTP Caching behavior with:

```csharp
Plugins.RemoveAll(x => x is HttpCacheFeature);
```

Caching options in ServiceStack include using the existing `ToOptimizedResult*` API's to create **Server Caches** within your Services as well as returning a customized `HttpResult` to take advantage of **HTTP Caching** Client features. 

## [CacheResponse Attribute](/cacheresponse-attribute)

The new declarative `[CacheResponse]` [Request Filter attribute](/filter-attributes) provides the best of both worlds supporting both Server and HTTP Client features which is both non-invasive and simple to enhance, as a result we expect it to be the most popular option for adding caching to your Services in future.

## [Cache-Aware Clients](/cache-aware-clients)

The **Server Caching** and **HTTP Caching** features in ServiceStack will automatically benefit Websites as browsers have excellent support for HTTP Caching. But .NET Desktop Apps or Xamarin.iOS and Xamarin.Android mobile clients wont see any of these benefits since none of the existing Service Clients have support for **HTTP Caching**. To complete the story we've also developed cache-aware Service Clients that can be used to enhance all existing .NET Service Clients which manages its own local cache as instructed by the HTTP Caching directives.

### Server Caching

To explain the new HTTP Caching features we'll revisit the ServiceStack's previous caching support which
enables what we refer to as **Server Caching** where the response of a Service is cached in the registered
[Caching Provider](/caching)
by calling the `ToOptimizedResult*` API's which lets you programmatically construct the Cache Key and/or
how long the cache should be persisted for, e.g:

```csharp
public class OrdersService : Service
{
    public object Any(GetCustomers request)
    {
        //Good candidates: request.ToGetUrl() or base.Request.RawUrl
        var cacheKey = "unique_key_for_this_request";
        var expireCacheIn = TimeSpan.FromHours(1);

        return Request.ToOptimizedResultUsingCache(Cache, cacheKey, expireCacheIn, 
            () => {
                //Delegate executed only if item doesn't already exist in cache 
                //Any response DTO returned is cached on subsequent requests
            });
    }
}
```

As the name indicates this stores the most optimal representation of the Service Response in the registered 
`ICacheClient`, so for example if a client called the above API with `Accept: application/json` and 
`Accept-Encoding: deflate, gzip` HTTP Request Headers ServiceStack would store the deflated serialized JSON 
bytes in the Cache and on subsequent requests resulting in the same cache key would write the compressed 
deflated bytes directly to the Response OutputStream - saving both CPU and bandwidth.

#### More Optimal OptimizedResults

But there's an even more optimal result we could return instead: **Nothing** :) and save even more CPU and
bandwidth! Which is precisely what the
[HTTP Caching](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html) directives built into the HTTP spec
allow for. To enable it you'd need to return additional HTTP Headers to the client containing the necessary 
metadata they can use to determine when their locally cached responses are valid. Typically this is the 
[Last-Modified](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.3.1) 
date of when the Response/Resource was last modified or an 
[Entity Tag](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.3.2) containing an opaque string
the Server can use to determine whether the client has the most up-to-date response.

The most optimal cache validator we can use for existing `ToOptimizedResult*` API's is the **Last Modified**
date which is now being cached along with the response. An additional instruction we need to return to the 
client is the 
[Cache-Control](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9) HTTP Response Header
which instructs the client what caching behavior to apply to the server response. As we want the new behavior 
to work transparently without introducing caching issues to existing Services, we've opted for a conservative:

```ini
Cache-Control: max-age=0
```
    
Which tells the client to treat the server response as immediately stale and that it should send another
request to the Server for identical requests, but this time the client will append a 
[If-Modified-Since](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.25) HTTP Request Header
which ServiceStack now automatically looks up to determine if the cache the client has is valid. 
If no newer cache for this request has been created since, ServiceStack returns a **304 NotModified** 
Response with an empty Request Body which tells the client it's safe to use their local cache instead.

#### Modify Cache-Control for OptimizedResults

You can change the `Cache-Control` Header returned for existing `ToOptimizedResult` responses by modifying
the pre-registered `HttpCacheFeature`, e.g:

```csharp
var cacheFeature = this.GetPlugin<HttpCacheFeature>();
cacheFeature.CacheControlForOptimizedResults = "max-age=3600, must-revalidate";
```

This tells the client that they can treat their locally cached server responses as **valid for 1hr**  
but **after 1hr** they must check back with the Server to determine if their cache is still valid.

### HTTP Client Caching

The Caching features above revolve around enhancing existing **Server Cached** responses with **HTTP Caching** 
features to further reduce latency and save CPU and bandwidth resources. In addition to **Server Caching** 
pure stand-alone **HTTP Caching** features (i.e. that don't cache server responses) are now available as 
first-class properties on `HttpResult`:

```csharp
// Only one Cache Validator below needs to be specified:
string ETag            // opaque string representing integrity of response
DateTime? LastModified // the last time the response was Modified

// Specify Client/Middleware Cache Behavior
TimeSpan? MaxAge          // How long cached response is considered valid
CacheControl CacheControl // More options to specify Cache-Control behavior:
enum CacheControl {
    None,
    Public,
    Private,
    MustRevalidate,
    NoCache,
    NoStore,
    NoTransform,
    ProxyRevalidate,
}

// Available, but rarely used
TimeSpan? Age      // Used by proxies to indicate how old cache is
DateTime? Expires  // Less preferred alternative to MaxAge
```

We'll walk through a couple of real-world examples to show how we can make use of these new properties
and explain the HTTP Caching behavior they enable. 

#### Using ETags

The minimum properties required for HTTP Caching is to specify either an `ETag` or `LastModified` 
Caching Validator. You can use any opaque string for the `ETag` that uniquely represents a version of the 
response that you can use to determine what version the client has, which could be an MD5 or SHA Hash of
the response but can also be a unique version string. E.g. Adding a `RowVersion` property to your OrmLite 
POCO Data Models turns on 
[OrmLite's Optimistic Concurrency](/ormlite/optimistic-concurrency)
feature where each time a record is modified it's automatically populated with a new version, these 
characteristics makes it ideal for use as an ETag which we can just return as a string:

```csharp
public object Any(GetCustomer request)
{
    var response = Db.SingleById<Customer>(request.Id);    
    return new HttpResult(response) {
        ETag = response.RowVersion.ToString(), 
    };
}
```

Whilst this is the minimum info required in your Services, the client also needs to know how long the 
cache is valid for as typically indicated by the `MaxAge` property. If it's omitted ServiceStack falls back 
to use the `HttpCacheFeature.DefaultMaxAge` of **10 minutes** which can be changed in your `AppHost` with:

```csharp
this.GetPlugin<HttpCacheFeature>().DefaultMaxAge = TimeSpan.FromHours(1);
```

So the HTTP Response Headers the client receives when calling this Service for the first time is something similar to:

```ini
ETag: "42"
Cache-Control: max-age=600
```

Which tells the client that they can use their local cache for identical requests issued within the next
10 minutes. After 10 minutes the cache is considered stale and the client will issue a new request to the 
server but this time it will include the **ETag** it has associated with the Response, i.e:

```ini
If-None-Match: "42"
```

When this happens the Service is still executed as normal and if the Customer hasn't changed, the 
`HttpCacheFeature` will compare the `HttpResult.ETag` response with the clients **ETag** above and if they 
match ServiceStack will instead return a **304 NotModified** with an Empty Response Body to indicate to the 
client that it can continue to use their locally cached response.

So whilst using a `HttpResult` **doesn't cache** the response **on the Server** and save further resources 
used in executing the Service, it still benefits from allowing the client to use their local cache for 
**10 minutes** - eliminating server requests and yielding instant response times. Then after **10 minutes** 
the **304 NotModified** Response Status and **Empty Body** improves latency and saves the Server CPU and 
bandwidth resources it didn't have to use for serializing and writing the executed Services response it 
would have need to do if no Caching was enabled.

#### Using LastModified 

The alternative to using an `ETag` is to use the `Last-Modified` Caching Validator. When you're constructing 
a complex response you'll want to use the **most recent** Last Modified Date from all sources so that you
can determine that the cache is no longer valid when any of the sources have been updated.

If you also want to customize the clients **Cache-Control** behavior you can use the additional `HttpResult` 
properties, below is an example of doing both:

```csharp
public object Any(GetCustomerOrders request)
{
    var response = new GetCustomerOrdersResponse {
        Customer = Db.SingleById<Customer>(request.Id),
        Orders = Db.Select<Order>(x => x.CustomerId == request.Id),
    };

    var allDates = new List<DateTime>(response.Orders.Select(x => x.ModifiedDate)) {
        response.Customer.ModifiedDate,
    };

    return new HttpResult(response)
    {
        LastModified = allDates.OrderByDescending(x => x).First(),
        MaxAge = TimeSpan.FromSeconds(60),
        CacheControl = CacheControl.Public | CacheControl.MustRevalidate,
    };
}
```

Which returns the Last Modified Date of the `Customer` record or any of their `Orders` as well as the 
customized **Cache-Control** Header which together returns Response Headers similar to:

```ini
Last-Modified: Fri, 19 April 2016 05:00:00 GMT
Cache-Control: max-age=60, public, must-revalidate
```

Then after **60 seconds** have elapsed the client will re-issue a request but instead of sending a 
`If-None-Match` Request Header and **ETag**, instead sends `If-Modified-Since` and the **Last-Modified** date:

```ini
If-Modified-Since: Fri, 19 April 2016 05:00:00 GMT
```

The resulting behavior is identical to that of the **ETag** above but instead compares the LastModified dates
instead of ETag strings for validity.

### Short-circuiting HTTP Cache Validation

A further optimization that can be added to the HTTP Cache workflow is using `IRequest.HasValidCache()`
to short-circuit the execution of a Service after you've processed enough information to determine either 
the `ETag` or `LastModified` for the response. 

For example if you had a Service that transcodes video on-the-fly, you can use `Request.HasValidCache()` to 
check whether the client already has the latest version of the video, if it does we can return a 
**304 NotModified** result directly, short-circuiting the Service and saving any resources in executing the 
remainder of the implementation, which in this case would **bypass reading and transcoding** the .mp4 video:

```csharp
public object Any(GetOggVideo request)
{
    var mp4Video = VirtualFileSources.GetFile($"/videos/{request.Id}.mp4");   
    if (mp4Video == null)
        throw HttpError.NotFound($"Video #{request.Id} does not exist");
    
    if (Request.HasValidCache(mp4Video.LastModified))
        return HttpResult.NotModified();
    
    var encodedOggBytes = EncodeToOggVideo(file.ReadAllBytes());
    return new HttpResult(encodedOggBytes, "video/ogg") 
    {
        LastModified = mp4Video.LastModified,
        MaxAge = TimeSpan.FromDays(1),
    };
}
```

## Http Caching of Static Files

Returning a static [Virtual File](/virtual-file-system) or `FileInfo` in a `HttpResult` also sets the **Last-Modified** HTTP Response Header whose behavior instructs the pre-configured `HttpCacheFeature` to generate the necessary HTTP Headers so HTTP Clients are able to validate subsequent requests using the [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since) HTTP Request Header, allowing them to skip redownloading files they've already cached locally.
 
This feature is leveraged in all Single Page App templates in its `[FallbackRoute]` implementation that's used to enable full page reloads by returning the Home **index.html** page for any unknown Requests, allowing routing to be handled on the client:
 
```csharp
[FallbackRoute("/{PathInfo*}")]
public class FallbackForClientRoutes
{
    public string PathInfo { get; set; }
}
 
public class MyServices : Service
{
    //Return default.html for unmatched requests so routing is handled on client
    public object Any(FallbackForClientRoutes request) => 
        new HttpResult(VirtualFileSources.GetFile("index.html"));
}
```
