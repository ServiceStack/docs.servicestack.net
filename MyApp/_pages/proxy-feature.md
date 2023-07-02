---
title: Proxy Feature
slug: proxy-feature
---

The `ProxyFeature` plugin is an application-level proxy that can be used to transparently proxy HTTP Requests through to
downstream servers whose behavior can be customized with custom C# hooks to control how requests are proxied.
 
`ProxyFeature` registers an async/non-blocking `RawHttpHandler` which bypasses ServiceStack's Request Pipeline that in ASP.NET is executed as an ASP.NET `IHttpAsyncHandler` so it should be flexible and performant enough to handle many demanding workloads.

## Usage

The example configuration below registers multiple proxies which proxies all requests to `/techstacks`, `/marketing` or `/finance` endpoints to their configured downstream servers:
 
```csharp
Plugins.Add(new ProxyFeature(
    matchingRequests: req => req.PathInfo.StartsWith("/techstacks"),
    resolveUrl:req => $"http://{resolve(req)}.techstacks.io" + req.RawUrl.Replace("/techstacks","/")))
 
Plugins.Add(new ProxyFeature(
    matchingRequests: req => req.PathInfo.StartsWith("/marketing"),
    resolveUrl:req => "http://marketing.domain.com" + req.RawUrl.Replace("/marketing", "/")))
 
Plugins.Add(new ProxyFeature(
    matchingRequests: req => req.PathInfo.StartsWith("/finance"),
    resolveUrl:req => "http://finance.domain.com" + req.RawUrl.Replace("/finance", "/")))
```
 
Just like a normal HTTP Proxy, `ProxyFeature` forwards all the HTTP Request Headers and returns all the HTTP Response Headers and body of the downstream server inc. HTTP Error Responses. This works especially well with ServiceStack's message-based design as the proxied endpoint e.g `/techstacks` can be treated as if it were the **BaseUrl** for the downstream server which allows external clients to treat it like they're communicating with the downstream server directly despite every request being transparently proxied behind a central external ServiceStack instance.

## Use Cases
 
One potential use-case is to enable smart load balancing which lets you use C# to dynamically control which external downstream server requests are proxied to. 

Thanks to ServiceStack's clean Service Gateway design you can use the clean POCO DTOs from any server instance, which you can get using the 
[x dotnet tool](/dotnet-tool) or [npm servicestack-cli](https://github.com/ServiceStack/servicestack-cli) utils from either the public url or proxy endpoint url, e.g:
 
```bash
x csharp https://techstacks.io
x csharp https://external.domain.com/techstacks
```
 
The resulting DTOs can be used with any [.NET Service Client](/csharp-client#built-in-clients), configured with the proxy endpoint as the **BaseUrl**:
 
```csharp
var client = new JsonServiceClient("https://external.domain.com/techstacks");
 
var request = new GetTechnology { Slug = "ServiceStack" };
var response = client.Get(request);
response.PrintDump();
```
 
Another potential use-case is to have the proxy act like a facade to access multiple internal microservices that can be made available behind a single external URL, e.g:
 
```csharp
var authRequest = new Authenticate { ... };
 
var marketingClient = new JsonServiceClient("https://external.domain.com/marketing");
var authResponse = marketingClient.Post(authRequest);
 
var financeClient = new JsonHttpClient("https://external.domain.com/finance");
var authResponse = await financeClient.PostAsync(authRequest);
```
 
When needed, there's a number of customization options available which enables complete control in how the request is proxied and ultimately what response is returned to clients:
 
```csharp
class ProxyFeature
{
    // Required filters to specify which requests to proxy and which url to use
    ProxyFeature(
        Func<IHttpRequest, bool> matchingRequests, // Which requests should be proxied
        Func<IHttpRequest, string> resolveUrl);    // Which downstream url to use 
 
    // Customize the HTTP Request Headers that are sent to downstream server
    Action<IHttpRequest, HttpWebRequest> ProxyRequestFilter
 
    // Customize the downstream HTTP Response Headers that are returned to client
    Action<IHttpResponse, HttpWebResponse> ProxyResponseFilter
 
    // Inspect or Transform the HTTP Request Body that's sent downstream
    Func<IHttpRequest, Stream, Task<Stream>> TransformRequest
 
    // Inspect or Transform the downstream HTTP Response Body that's returned
    Func<IHttpResponse, Stream, Task<Stream>> TransformResponse
}
```
 
So you could use the `TransformResponse` delegate for instance to rewrite any internal urls to use external urls with something like:
 
```csharp
Plugins.Add(new ProxyFeature(
    matchingRequests: req => req.PathInfo.StartsWith("/techstacks"),
    resolveUrl: req => $"http://{resolve(req)}.techstacks.io" + req.RawUrl.Replace("/techstacks","/"))
    {
        TransformResponse = async (res, responseStream) => 
        {
            using var reader = new StreamReader(responseStream, Encoding.UTF8);
            var responseBody = await reader.ReadToEndAsync();
            var replacedBody = responseBody.Replace(
                "https://techstacks.io",
                "https://external.domain.com/techstacks");
            return MemoryStreamFactory.GetStream(replacedBody.ToUtf8Bytes());
        }
    });
```
