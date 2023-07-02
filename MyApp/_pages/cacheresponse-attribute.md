---
slug: cacheresponse-attribute
title: CacheResponse Attribute
---

The `[CacheResponse]` is a normal [Request Filter Attribute](/filter-attributes)
which can be added at the top-level of your Service class in which case it will cache the response of 
**All** Service implementations for **60 seconds**, e.g:

```csharp
[CacheResponse(Duration = 60)]
public class CachedServices : Service 
{ 
    public object Any(GetCustomer request) { ... }
    
    public object Any(GetCustomerOrders request) { ... }
}
```

It can also be applied individually on a single Service implementation:

```csharp
[CacheResponse(Duration = 60)]
public object Any(GetCustomer request)
{
    return Db.SingleById<Customer>(request.Id);
}
```

## Caching AutoQuery Services

Request Filter attributes can also be applied on Request DTO's, as we seen with [AutoQuery DynamoDB's QueryRockstarAlbums](/autoquery/dynamodb#caching-autoquery-services) Request DTO:

```csharp
[CacheResponse(Duration = 60)]
public class QueryRockstarAlbums : QueryData<RockstarAlbum> { ... }
```

However adding Request Filter Attributes **on Request DTO's** goes against our recommendation for keeping 
your DTO's in a separate implementation and dependency-free **ServiceModel.dll** as it would require a 
dependency on the non-PCL **ServiceStack.dll** which would prohibit being able to reuse your existing 
DTO .dll in PCL libraries, limiting their potential re-use.

You can still take advantage of the `[CacheResponse]` attribute on AutoQuery Services by defining
a custom implementation, at which point adding the `[CacheResponse]` attribute behaves as normal and 
applies caching to your Service implementations. E.g. you can enable caching for multiple AutoQuery 
Services with:

```csharp
[CacheResponse(Duration = 60)]
public class MyCachedAutoQueryServices : Service 
{
    public IAutoQueryData AutoQuery { get; set; }

    public object Any(QueryRockstars query) =>
        AutoQuery.Execute(query, AutoQuery.CreateQuery(query, Request), Request);
    
    public object Any(QueryRockstarAlbums query) =>
        AutoQuery.Execute(query, AutoQuery.CreateQuery(query, Request), Request);
}
```

### Server Cached and [HTTP Caching](/http-caching) enabled responses

When only specifying a `Duration=60` ServiceStack only **caches the Server Response** so it behaves similar
to using the existing `ToOptimizedResult()` API, e.g:

```csharp
public object Any(GetCustomer request)
{
    return Request.ToOptimizedResultUsingCache(Cache, 
        Request.RawUrl, TimeSpan.FromSeconds(60), 
        () => Db.SingleById<Customer>(request.Id));
}
```

To also enable [HTTP Caching](/http-caching) features you'll need to opt-in by specifying an additional HTTP Caching directive. 
E.g. including a `MaxAge` instructs ServiceStack to apply **HTTP Caching** logic and return the appropriate headers:

```csharp
[CacheResponse(Duration=60, MaxAge=30)]
public object Any(GetCustomer request) => Db.SingleById<Customer>(request.Id);
```

Where subsequent identical requests from a **cache-aware client** will return their locally cached version 
within the first **30 seconds**, between **30-60 seconds** the client will re-validate the request with the 
Server who will return a **304 NotModified** Response with an **Empty Body**, after **60 seconds** the cache 
expires and the next request will **re-execute the Service** and populate the cache with a new response.

#### CacheResponse Properties

The Caching behavior of the `[CacheResponse]` attribute can be further customized using any of the 
additional properties below:

```csharp        
int Duration              // Cache expiry in seconds
int MaxAge                // MaxAge in seconds
CacheControl CacheControl // Customize Cache-Control HTTP Headers
bool VaryByUser           // Vary cache per user
string[] VaryByRoles      // Vary cache for users in these roles
bool LocalCache           // Use In Memory HostContext.LocalCache or HostContext.Cache
```

Using any of the other HTTP Cache properties will also trigger the HTTP Caching features. 
When a `MaxAge` isn't specified, i.e:

```csharp
[CacheResponse(Duration = 10, VaryByUser = true)]
public object Any(GetUserActivity request) { ... }
```

ServiceStack falls back to use the `HttpCacheFeature.DefaultMaxAge` which defaults to **10 minutes**, 
in addition to the `VaryByUser` flag will construct a unique cache key for each user and return an additional 
`Vary: Cookie` HTTP Response Header.

## Advanced CacheInfo Customization

One limitation of using a .NET Attribute to specify caching behavior is that we're limited to using 
.NET constant primitives prohibiting the use of allowing custom lambda's to capture custom behavior. 
This is also the reason why we need to use `int` for `Duration` and `MaxAge` instead of a more appropriate 
`TimeSpan`.

But we can still intercept the way the `[CacheResponse]` attribute works behind-the-scenes and programmatically 
enhance it with custom logic. 
[CacheResponseAttribute](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/CacheResponseAttribute.cs)
is just a wrapper around initializing a populated 
[CacheInfo](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/CacheInfo.cs) POCO
that it drops into the `IRequest.Items` dictionary where it's visible to your Service and any remaining Filters 
in ServiceStack's [Request Pipeline](/order-of-operations). 
Essentially it's just doing this:

```csharp
req.Items[Keywords.CacheInfo] = new CacheInfo { ... };
```

The actual validation logic for processing the `CacheInfo` is encapsulated within the `HttpCacheFeature` 
Response Filter. This gives our Service a chance to modify it's behavior, e.g. in order to generically
handle all Service responses the `[CacheResponse]` attribute uses the `IRequest.RawUrl` 
(the URL minus the domain) for the base CacheKey. Whilst using a RawUrl is suitable in uniquely identifying 
most requests, if QueryString params were sent in a different case or in a different order it would generate 
a different url and multiple caches for essentially the same request. We can remedy this behavior by changing 
the base CacheKey used which is just a matter retrieving the populated the `CacheInfo` and change the 
`KeyBase` to use the predictable [Reverse Routing](/routing#reverse-routing)
`ToGetUrl()` API instead, e.g:

```csharp
[CacheResponse(Duration = 60)]
public async Task<object> Get(MyRequest request)
{
    var cacheInfo = (CacheInfo)base.Request.GetItem(Keywords.CacheInfo);
    cacheInfo.KeyBase = request.ToGetUrl(); //custom cache key
    if (await Request.HandleValidCache(cacheInfo))
        return null;
    ...

    return response;
}
```

Or generically for all cached Services by using a [Global Request Filter](/request-and-response-filters):

```csharp
this.GlobalRequestFiltersAsync.Add(async (req, res, requestDto) =>
{
    var cacheInfo = req.GetItem(Keywords.CacheInfo) as CacheInfo;
    if (cacheInfo?.KeyBase != null)
    {
        cacheInfo.KeyBase = request.ToGetUrl(); //custom cache key
        await req.HandleValidCache(cacheInfo);
    }
});
```

When using a Global Request Filter to customize caching behavior as above, your `[CacheResponse]` should have a priority `<0` in order for it to be executed before any Global Request Filters, e.g:

```csharp
[CacheResponse(Priority = -1, Duration = 10 * 60)]
public class MyCachedServices : Service { ... }
```

`HandleValidCache()` is used to re-validate the client's request with the new Cache Key and if it's determined
the Client has a valid cache, will short-circuit the Service and return a **304 NotModified** Response.
