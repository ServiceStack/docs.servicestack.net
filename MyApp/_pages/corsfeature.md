---
slug: corsfeature
title: CORS Feature
---

### Enabling Global CORS support

The **CorsFeature** wraps CORS headers into an encapsulated [Plugin][1] to make it much easier to add CORS support to your ServiceStack services. 

Commonly this is now all that's needed:

```csharp
Plugins.Add(new CorsFeature());
```

Which uses the default values:

```csharp
CorsFeature(allowedOrigins:"*", 
    allowedMethods:"GET, POST, PUT, DELETE, OPTIONS", 
    allowedHeaders:"Content-Type", 
    allowCredentials:false);
```

You can leave out any of the values matching the default. E.g. if you just wanted to restrict the allowed methods to just GET and POST requests, you can just do:

```csharp
Plugins.Add(CorsFeature(allowedMethods:"GET, POST"));
```

### Allow specific origins

Use `allowOriginWhitelist` when you want to only allow CORS access by specific sites:

```csharp
Plugins.Add(new CorsFeature(
    allowOriginWhitelist: new[] { "http://localhost","http://localhost:5000","http://run.plnkr.co" },
    allowCredentials: true,
    allowedHeaders: "Content-Type, Allow, Authorization, X-Args"));
```

### Enabling CORS per-service support

Instead of using the plugin above, ServiceStack also allows you to enable CORS on a per-service basis by using **[EnableCors]** [Response Filter attribute][2] which has the same defaults as above. E.g. You can enable just GET, POST as above with:

```csharp
[EnableCors(allowedMethods:"GET,POST")]
public class MyService : Service { ... }
```

## Manually enabling CORS

The beauty of [ServiceStack][3] is that it's built on a highly flexible and simple core. We don't believe in building strong-typed APIs over everything, as it's impossible to predict what new HTTP Headers / StatusCodes will exist in the future. So whilst we provide convenient behavior to accomplish common tasks, we also provide a flexible API that lets you configure any desired HTTP Output. 

### Setting Global HTTP Headers

This is how to globally enable Cross Origin Sharing in you AppHost config:

```csharp
public override void Configure(Container container)
{
    //Permit modern browsers (e.g. Firefox) to allow sending of any HTTP Method
    SetConfig(new HostConfig 
    {
        GlobalResponseHeaders = {
          { "Access-Control-Allow-Origin", "*" },
          { "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS" },
          { "Access-Control-Allow-Headers", "Content-Type" },
        },
    });
}
```

### Returning Custom HTTP Headers in a service

These headers will get sent on every request, alternatively you can also enable it for specific web services, i.e. take the [Hello World Web Service][4] for example:

```csharp
public class Hello {
    public string Name { get; set; }
}

public class HelloResponse {
    public string Result { get; set; }
}

public class HelloService : IService 
{
    public object Any(Hello request)
    {
        var dto = new HelloResponse { Result = "Hello, " + request.Name };
        return new HttpResult(dto) {
            Headers = {
              { "Access-Control-Allow-Origin", "*" },
              { "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE" } 
              { "Access-Control-Allow-Headers", "Content-Type" }, 
            }
        };
    }
}
```

The above is all the C# code you need to develop a web service which is then automatically wired up for you on all HTTP Verbs (GET, POST, etc) and built-in endpoints, i.e. JSON, XML, JSV, HTML, CSV, SOAP 1.1/1.2 - for free, without any config or friction required. Checkout  [the live example of the above web service][5].

## JSONP

In addition to the above endpoints each service is available to be called by [JSONP](https://en.wikipedia.org/wiki/JSONP) (another popular way to enable cross-domain service calls in Ajax apps) where each service can be called via JSONP by simply adding the **?callback=cb** parameter to the querystring, e.g:

[techstacks.io/technology/servicestack?callback=cb](https://techstacks.io/technology/servicestack?callback=cb):

```js
//Response:
cb({ 
    ... 
})
```

  [1]: /plugins
  [2]: /filter-attributes
  [3]: http://www.servicestack.net
  [4]: http://www.servicestack.net/ServiceStack.Hello/
  [5]: http://www.servicestack.net/ServiceStack.Hello/
  [6]: http://stackoverflow.com/questions/6245616/does-servicestack-support-binary-responses
  [7]: http://www.servicestack.net/benchmarks/
