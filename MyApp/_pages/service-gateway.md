---
slug: service-gateway
title: Service Gateway
---

The Service Gateway is implemented on top of ServiceStack's existing message-based architecture to open up 
exciting new possibilities for development of loosely-coupled
[Modularized Service Architectures](/modularizing-services).

The new [IServiceGateway](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/IServiceGateway.cs)
interfaces represent the minimal surface area required to support ServiceStack's different calling conventions 
in a formalized API that supports both Sync and Async Service Integrations:

```csharp
public interface IServiceGateway
{
    // Normal Request/Reply Services
    TResponse Send<TResponse>(object requestDto);

    // Auto Batched Request/Reply Requests
    List<TResponse> SendAll<TResponse>(IEnumerable<object> requestDtos);

    // OneWay Service
    void Publish(object requestDto);

    // Auto Batched OneWay Requests
    void PublishAll(IEnumerable<object> requestDtos);
}

// Equivalent Async API's
public interface IServiceGatewayAsync
{
    Task<TResponse> SendAsync<TResponse>(object requestDto, 
        CancellationToken token = default(CancellationToken));

    Task<List<TResponse>> SendAllAsync<TResponse>(IEnumerable<object> requestDtos, 
        CancellationToken token = default(CancellationToken));

    Task PublishAsync(object requestDto, 
        CancellationToken token = default(CancellationToken));

    Task PublishAllAsync(IEnumerable<object> requestDtos, 
        CancellationToken token = default(CancellationToken));
}
```

The minimum set of API's above requires the least burden for `IServiceGateway` implementers whilst the
[ServiceGatewayExtensions](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Client/ServiceGatewayExtensions.cs)
overlays convenience API's common to all implementations providing the nicest API's possible for Request DTO's 
implementing the recommended `IReturn<T>` and `IReturnVoid` interface markers. The extension methods also 
provide fallback pseudo-async support for `IServiceGateway` implementations that also don't implement the
optional `IServiceGatewayAsync`, but will use native async implementations for those that do.

Naked Request DTO's without annotations are sent as a **POST** but alternative Verbs are also supported 
by annotating Request DTO's with 
[HTTP Verb Interface Markers](/csharp-client#http-verb-interface-markers)
where Request DTO's containing `IGet`, `IPut`, etc. are sent using the typed Verb API, e.g:

```csharp
[Route("/customers/{Id}")]
public class GetCustomer : IGet, IReturn<Customer>
{
    public int Id { get; set ;}
}

var customer = client.Send(new GetCustomer { Id = 1 }); //GET /customers/1
//Equivalent to:
var customer = client.Get(new GetCustomer { Id = 1 });  
```

### Service Integration API's

To execute existing ServiceStack Services internally you can call `ExecuteRequest(requestDto)` which 
passes the Request DTO along with the current `IRequest` into the `ServiceController.Execute()` to execute. 
The alternative is to call `ResolveService<T>` to resolve an autowired instance of the Service that's 
injected with the current `IRequest` context letting you call methods on the Service instance directly.
Below is an example of using both API's:

```csharp
public object Any(GetCustomerOrders request)
{
    using var orderService = base.ResolveService<OrderService>();
    return new GetCustomerOrders {
        Customer = (Customer)base.ExecuteRequest(new GetCustomer { Id = request.Id }),
        Orders = orderService.Any(new QueryOrders { CustomerId = request.Id })
    };
}
```

The recommended approach now is to instead use the `IServiceGateway` accessible from `base.Gateway` 
available in all Service, Razor Views, MVC ServiceStackController classes, etc. It works similar to
the `ExecuteRequest()` API (which it now replaces) where you can invoke a Service with just a populated 
Request DTO, but instead yields an ideal typed API for Request DTO's implementing the recommended `IReturn<T>`
or `IReturnVoid` markers:

```csharp
public object Any(GetCustomerOrders request)
{
    return new GetCustomerOrders {
        Customer = Gateway.Send(new GetCustomer { Id = request.Id }),
        Orders = Gateway.Send(new QueryOrders { CustomerId = request.Id })
    };
}
```

Or you can use the Async API if you prefer the non-blocking version:

```csharp
public async Task<GetCustomerOrdersResponse> Any(GetCustomerOrders request)
{
    return new GetCustomerOrdersResponse {
        Customer = await Gateway.SendAsync(new GetCustomer { Id = request.Id }),
        Orders = await Gateway.SendAsync(new QueryOrders { CustomerId = request.Id })
    };
}
```

The capability that sets the ServiceGateway apart (other than offering a nicer API to work with) 
is that this System could later have its **Customer** and **Order** Subsystems split out into different 
hosts and this exact Service implementation would continue to function as before, albeit a little slower due 
to the overhead of any introduced out-of-process communications.

The default implementation of `IServiceGateway` uses the 
[InProcessServiceGateway](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/InProcessServiceGateway.cs)
which delegates the Request DTO to the appropriate `ServiceController.Execute()` or 
`ServiceController.ExecuteAsync()` methods to execute the Service. One noticeable difference is that any 
Exceptions thrown by downstream Services are automatically converted into the same `WebServiceException` 
that clients would throw when calling the Service externally, this is so Exceptions are indistinguishable
whether it's calling an internal Service or an external one, which begins touching on the benefits of the 
Gateway... 

The ServiceGateway is the same interface whether you're calling an Internal Service on the Server or a 
remote Service from a client. It exposes an ideal message-based API that's
[optimal for remote Service Integrations](http://www.infoq.com/articles/interview-servicestack) 
that also supports 
[Auto Batched Requests](/auto-batched-requests) 
for combining multiple Service Calls into a single Request, minimizing latency when possible.

### Substitutable Service Gateways

These characteristics makes it easy to substitute and customize the behavior of the Gateway as visible in the
examples below. The easiest scenario to support is to redirect all Service Gateway calls to a remote 
ServiceStack instance which can be done by registering any .NET Service Client against the `IServiceGateway` 
interface, e.g:

```csharp
public override void Configure(Container container)
{
    container.Register<IServiceGateway>(c => new JsonServiceClient(baseUrl));
}
```

A more likely scenario you'd want to support is a mix where internal requests are executed in-process 
and external requests call their respective Service. If your system is split in two this becomes a simple
check to return the local InProcess Gateway for Requests which are defined in this ServiceStack instance
otherwise return a Service Client configured to the alternative host when not, e.g:

```csharp
public class CustomServiceGatewayFactory : ServiceGatewayFactoryBase
{
    public override IServiceGateway GetGateway(Type requestType)
    {
        var isLocal = HostContext.Metadata.RequestTypes.Contains(requestType);
        var gateway = isLocal
            ? (IServiceGateway)base.localGateway
            : new JsonServiceClient(alternativeBaseUrl);
        return gateway;
    }
}
```

For this we needed to implement the
[IServiceGatewayFactory](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IServiceGatewayFactory.cs)
so we can first capture the current `IRequest` that's needed in order to call the In Process Service Gateway with.
The convenience [ServiceGatewayFactoryBase](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/ServiceGatewayFactoryBase.cs)
abstracts the rest of the API away so you're only tasked with returning the appropriate Service Gateway for 
the specified Request DTO. 

Capturing the current `IRequest` makes the Gateway factory instance non-suitable to use as a singleton, 
so we'll need to register it with `AddTransient` or `ReuseScope.None` scope so a new instance is resolved each time:

```csharp
public override void Configure(Container container)
{
    container.AddTransient<IServiceGatewayFactory>(() => new CustomServiceGatewayFactory());
    
// Equivalent to:
//    container.Register<IServiceGatewayFactory>(x => new CustomServiceGatewayFactory())
//        .ReusedWithin(ReuseScope.None);
}
```

### Call Internal and External Services from URLs

The `Metadata.CreateRequestFromUrl()` API lets you create Request DTOs from absolute or relative URLs. This is useful if you need a generic routine to be able to execute a number of different Services from a collection or URL's, e.g:

```csharp
var processUrls = new []{ "https://example.org/invoices/generate?userId=1", "/assets/1/generate" };
foreach (var url in processUrls) 
{
    var request = HostContext.Metadata.CreateRequestFromUrl(url);
    var responseType = HostContext.Metadata.GetResponseTypeByRequest(request.GetType());
    var response = HostContext.AppHost.GetServiceGateway().Send(responseType, request);

    db.Insert(new Task { Url = url, Response = response.ToJson(), Completed = DateTime.UtcNow });
}
```

The Service Gateway provides an optimal way for executing Services where it will transparently execute local requests in process or external requests remotely using either the configured [Service Gateway](#substitutable-service-gateways) or [Service Discovery Solution](/service-discovery).

## [Service Discovery](/service-discovery)

This demonstrates the underpinnings by which we can plug into and intercept all intra-Service calls and apply our own high-level custom logic which sets the foundation for other value-added functionality like [Service Discovery](/service-discovery) which can transparently route service calls to the most appropriate available remote endpoint at run-time, automatically without additional configuration or code-maintenance overhead.

## Designing for Microservices

Whether or not Systems 
[benefit overall from a fine-grained microservices architecture](http://blog.cleancoder.com/uncle-bob/2014/09/19/MicroServicesAndJars.html),
enough to justify the additional latency, management and infrastructure overhead it requires, we still see 
value in the development process of
[designing for Microservices](https://channel9.msdn.com/events/Build/2016/C918) where decoupling naturally 
isolated components into loosely-coupled subsystems has software-architecture benefits with overall complexity 
of an entire system being reduced into smaller, more manageable logical scopes which encapsulates their capabilities behind re-usable, 
[coarse-grained messages to small, well-defined facades](http://stackoverflow.com/a/32940275/85785).

The ServiceGateway and its Services Discovery ecosystem together with ServiceStack's recommended use of 
impl-free reusable POCO DTO's and its ability to 
[modularize Service implementations across multiple projects](/modularizing-services)
naturally promote a microservices-ready architecture where Service interactions are loosely-coupled behind 
well-defined, reusable, coarse-grained messages. Designing systems in this way later allows the isolated
Service Implementation .dll to be extracted from the main System and wrapped into its own AppHost. Together 
with an agreed Service Discovery solution, allows you to spawn multiple instances of the new Service -
letting you scale, deploy and maintain it independently from the rest of the system.
