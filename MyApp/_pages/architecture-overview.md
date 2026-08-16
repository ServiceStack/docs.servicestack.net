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

![ServiceStack Logical Architecture View](/img/pages/overview/servicestack-logical-view-02.webp) 

## Client Architecture

ServiceStack's [Message-based design](/advantages-of-message-based-web-services) allows us to easily support [typed, generic and re-usable Service Clients](/clients-overview) for all our popular formats:

![ServiceStack HTTP Client Architecture](/img/pages/overview/servicestack-httpclients.webp) 

Having all clients share the same interface allow them to be hot-swappable at run-time without code changes and keep them highly testable where the same unit test can also [serve as an XML, JSON, JSV, SOAP Integration Test](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.IntegrationTests/Tests/WebServicesTests.cs).

By promoting clean (endpoint-ignorant and dependency-free) Service and DTO classes, your web services are instantly re-usable and can be hosted in non-http contexts as well. E.g. The client architecture when one of the [built-in MQ Host is enabled](/redis-mq):

![ServiceStack MQ Client Architecture](/img/pages/overview/servicestack-mqclients.webp) 
