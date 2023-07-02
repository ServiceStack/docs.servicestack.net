---
title: Architecture Overview
---

Ultimately behind-the-scenes ServiceStack is just built on top of ASP.NET's Raw 
[IHttpAsyncHandler](https://msdn.microsoft.com/en-us/library/ms227433.aspx). 
Existing abstractions and [xmlconfig-encumbered legacy ASP.NET providers](http://mono.servicestack.net/mvc-powerpack/) have been abandoned, 
in favour of fresh, simple and clean [Caching](/caching), [Session](/auth/sessions) 
and [Authentication](/auth/authentication-and-authorization) providers all based on clean POCOs, 
supporting multiple back-ends and all working seamlessly together. Our best-practices 
architecture is purposely kept simple, introduces minimal new concepts or artificial constructs that 
can all be eloquently captured in the diagram below:

## Server Architecture

![ServiceStack Logical Architecture View](/img/pages/overview/servicestack-logical-view-02.png) 

## Client Architecture

ServiceStack's [Message-based design](/advantages-of-message-based-web-services) allows us to easily support [typed, generic and re-usable Service Clients](/clients-overview) for all our popular formats:

![ServiceStack HTTP Client Architecture](/img/pages/overview/servicestack-httpclients.png) 

Having all clients share the same interface allow them to be hot-swappable at run-time without code changes and keep them highly testable where the same unit test can also [serve as an XML, JSON, JSV, SOAP Integration Test](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.IntegrationTests/Tests/WebServicesTests.cs).

By promoting clean (endpoint-ignorant and dependency-free) Service and DTO classes, your web services are instantly re-usable and can be hosted in non-http contexts as well. E.g. The client architecture when one of the [built-in MQ Host is enabled](/redis-mq):

![ServiceStack MQ Client Architecture](/img/pages/overview/servicestack-mqclients.png) 

## Implementation 

The entry point for all ASP.NET and HttpListener requests is in the [ServiceStack.HttpHandlerFactory](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/HttpHandlerFactory.cs) whose purpose is to return the appropriate IHttpHandler for the incoming request.

There are 2 distinct modes in any ServiceStack application:

1. AppHost Setup and Configuration - Only done once for all services. Run only once on App StartUp.
1. Runtime - Run on every request: uses dependencies, plugins, etc. defined in the AppHost. Each new request re-binds all IOC dependencies to a new service instance which gets disposed at the end of each request.

The implementation of this can be visualized below:

![ServiceStack Overview](/img/pages/overview/servicestack-overview-01.png)

After the `IHttpHandler` is returned, it gets executed with the current ASP.NET or HttpListener request wrapped in a common [IRequest](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IRequest.cs) instance. 
