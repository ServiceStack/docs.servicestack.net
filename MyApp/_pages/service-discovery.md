---
slug: service-discovery
title: Service Discovery
---


::: warning DEPRECATED
These community plugins are no longer maintained however their code bases should still serve useful in different approaches for implementing
a dynamic Service Discovery solution:
:::

## [ServiceStack.Discovery.Consul](https://github.com/MacLeanElectrical/servicestack-discovery-consul)

The [ConsulFeature](https://github.com/MacLeanElectrical/servicestack-discovery-consul) plugin 
by [Scott Mackay](https://github.com/wwwlicious) leverages the hardened distributed Discovery Services and 
highly available features in [consul.io](https://www.consul.io/) to provide automatic registration and 
de-registration of ServiceStack Services on AppHost **StartUp** and **Dispose** that's available from:

:::copy
`<PackageReference Include="ServiceStack.Discovery.Consul" Version="8.*" />`
:::

Without any additional effort beyond registering the `ConsulFeature` plugin and starting a new ServiceStack 
Instance it provides an auto-updating, self-maintaining and periodically checked registry of available Services:

```csharp
public override void Configure(Container container)
{
    SetConfig(new HostConfig {
        WebHostUrl = "http://api.acme.com:1234", // Externally resolvable BaseUrl
    });

    Plugins.Add(new ConsulFeature()); // Register the plugin, that's it!
}
```

<img class="py-20" src="/img/pages/gateway/consul-single.svg">

Once registered, the Service Gateway works as you'd expect where internal requests are executed in process
and external requests queries the Consul registry to discover the appropriate and available Service to call:

```csharp
public class MyService : Service
{
    public void Any(RequestDTO dto)
    {
        // Gateway will automatically route external requests to correct service
        var internalCall = Gateway.Send(new InternalDTO { ... });
        var externalCall = Gateway.Send(new ExternalDTO { ... });
    }
}
```

<img class="py-20" src="/img/pages/gateway/consul-multi.svg" alt="Request DTO Service Discovery">

## [ServiceStack.Discovery.Redis](https://github.com/rsafier/ServiceStack.Discovery.Redis)

The [RedisServiceDiscoveryFeature](https://github.com/rsafier/ServiceStack.Discovery.Redis) by
[Richard Safier](https://github.com/rsafier) has similar goals to provide transparent service discovery 
but only requires access to Redis-backed datastore, but is otherwise just as easy to install:

:::copy
`<PackageReference Include="ServiceStack.Discovery.Redis" Version="8.*" />`
:::

and Configure:

```csharp
public override void Configure(Container container)
{
    container.Register<IRedisClientsManager>(c => new RedisManagerPool(...));
        
    SetConfig(new HostConfig {
        WebHostUrl = "http://api.acme.com:1234"
    });

    Plugins.Add(new RedisServiceDiscoveryFeature());
}
```

Once registered, calling the same Gateway API's function the same way with internal requests executed
internally and external requests sent to the appropriate available node:

```csharp
public class MyService : Service
{
    public void Any(RequestDTO dto)
    {
        var internalCall = Gateway.Send(new InternalDTO { ... });
        var externalCall = Gateway.Send(new ExternalDTO { ... });

        try 
        {
            var unknown = Gateway.Send(new ExternalDTOWithNoActiveNodesOnline());
        }
        catch(RedisServiceDiscoveryGatewayException e) 
        {
           // If a DTO type is not local or resolvable by Redis discovery process 
           // a RedisServiceDiscoveryGatewayException will be thrown
        }
    }
}
```

Since all Redis Discovery data is stored in a redis instance the state of all available nodes can be viewed 
with any Redis GUI:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/RedisDiscoveryScreenshot.png)

### [ServiceStack.SimpleCloudControl](https://github.com/rsafier/ServiceStack.SimpleCloudControl)

In addition to this Redis Discovery Service Richard is also developing a series of ServiceStack plugins 
that enhances the functionality of ServiceStack.Discovery.Redis and provides cluster awareness to 
additional aspects of a ServiceStack AppHost's internal state.

# Community Resources

  - [Service discovery, load balancing and routing](https://www.wwwlicious.com/servicestack-microservices-discovery-routing-3/) by [@wwwlicious](https://twitter.com/wwwlicious)
