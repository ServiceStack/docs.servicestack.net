---
slug: cache-aware-clients
title: Cache Aware Service Clients
---

To implement a complete end-to-end HTTP Caching story you can use the cache-aware `CachedServiceClient` to enhance all existing `HttpWebRequest` based Service Clients which manages its own local cache as instructed by the Server HTTP Caching directives, whilst the `CachedHttpClient` does the same for the HttpClient-based `JsonHttpClient`.

Both Cache-Aware clients implement the full 
[IServiceClient](https://github.com/ServiceStack/ServiceStack/blob/master/docs/pages/IServiceClient.md)
interface so they should be an easy drop-in enhancement for existing applications:

```csharp
IServiceClient client = new JsonServiceClient(baseUrl).WithCache(); 

//equivalent to:
IServiceClient client = new CachedServiceClient(new JsonServiceClient(baseUrl));
```

Likewise for `JsonHttpClient`:

```csharp
IServiceClient client = new JsonHttpClient(baseUrl).WithCache(); 

//equivalent to:
IServiceClient client = new CachedHttpClient(new JsonHttpClient(baseUrl));
```

As seen above both are decorators over existing .NET Service Clients where they'll append the appropriate HTTP Request Headers and inspect the HTTP Responses of **GET** Requests that contain HTTP Caching directives. All other HTTP Methods are just delegated through to the underlying Service Client.

The Service Clients maintain cached responses in an internal dictionary which can also be injected and shared if your app uses multiple Service Clients. For example they could use the fast binary 
[MsgPack client](/messagepack-format) 
for performance-sensitive queries or Services returning binary data and use a JSON client for everything else:

```csharp
var sharedCache = new ConcurrentDictionary<string, HttpCacheEntry>();

IServiceClient msgPackClient = new MsgPackServiceClient(baseUrl).WithCache(sharedCache);

IServiceClient jsonClient = new JsonHttpClient(baseUrl).WithCache(sharedCache);
```

## Improved Performance and Reliability

When caching is enabled on Services, the Cache-aware Service Clients can dramatically improve performance by eliminating server requests entirely as well as reducing bandwidth for re-validated requests. They also  offer an additional layer of resiliency as re-validated requests that result in Errors will transparently fallback to using pre-existing locally cached responses. For bandwidth-constrained environments like Mobile Apps they can dramatically improve the User Experience and as they're available in all supported PCL client platforms - we recommend their use where HTTP Caching is enabled on the Server.  

## Community Resources

- [Caching Anyone](http://www.mindkin.co.nz/blog/2016/1/5/caching-anyone) by [@JezzSantos](https://twitter.com/JezzSantos) 
