---
slug: advantages-of-message-based-web-services
title: Advantages of message-based WebServices
---

### This is in response to a recent question from [mailing group](https://groups.google.com/forum/?fromgroups#!topic/servicestack/qkV5fzdnzt8):

> It seems like ServiceStack is designed for use primarily in a greenfield 
SOA implementation where the technology environment is quite homogeneous, 
and more or less the same people have ownership of the servers and all the clients.  
Is that correct?

ServiceStack's message-based design is optimal for the design of **any remote service**. We believe .NET has never gotten web services right, which was the inspiration for starting ServiceStack. If .NET was lucky enough to have had someone like Martin Fowler (or just someone following his decade-old guidance) at the helm of the Microsoft Patterns & Practices and VS.NET tools teams from the start we would've likely been able to avoid the multiple replacement web service frameworks from Microsoft that .NET web service developers have endured over the years - and still haven't got right. This is unfortunate considering remote services are the most important APIs developers can create as they ultimately offer the highest-level of software re-use possible whilst remaining programmatically composable.

## Best-practices for remote services

Inspiration should've ideally been taken from Martin Fowler or from companies that have [SOA](http://en.wikipedia.org/wiki/Service-oriented_architecture) ingrained in their DNA who have successfully run long-term evolving SOA solutions that have enabled rich and complex platforms.
Amazon is a shining example of this, where even Steve Yegge admits [it's the only thing they do better than Google](https://gigaom.com/2011/10/12/419-the-biggest-thing-amazon-got-right-the-platform/). Where their relentless dedication to exposing SOA services over all their systems have enabled their industry leading EC2 and [aws.amazon.com](http://aws.amazon.com/) cloud services.

## The Service API of Amazon's Web Services

If you look at an [example of Amazons EC2 Web Service APIs](http://docs.amazonwebservices.com/AWSEC2/latest/APIReference/ApiReference-query-AttachVolume.html) you'll see a strong similarity with ServiceStack's approach where they accept a Request message and return a response message for all their services, e.g:

### Example Request

```
https://ec2.amazonaws.com/?Action=AttachVolume
&VolumeId=vol-4d826724
&InstanceId=i-6058a509
&Device=/dev/sdh
&AUTHPARAMS
```
 
### Example Response

```xml
<AttachVolumeResponse xmlns="http://ec2.amazonaws.com/doc/2012-06-01/">
    <requestId>59dbff89-35bd-4eac-99ed-be587EXAMPLE</requestId>
    <volumeId>vol-4d826724</volumeId>
    <instanceId>i-6058a509</instanceId>
    <device>/dev/sdh</device>
    <status>attaching</status>
    <attachTime>2008-05-07T11:51:50.000Z</attachTime>
</AttachVolumeResponse>
```

From this we can attest Amazon maintains a Request [DTO](http://en.wikipedia.org/wiki/Data_Transfer_Object) named `AttachVolume` and a Response DTO named `AttachVolumeResponse`. This is the same design ServiceStack encourages and with some minor customisations the Request can be easily made to be more REST-ful with:

```
POST https://ec2.amazonaws.com/volumes/vol-4d826724/attach 
FormData: InstanceId=i-6058a509&Device=/dev/sdh&AUTHPARAMS
```

In-terms of accessibility and interoperability, ServiceStack 1-ups Amazon here since the same Request DTO can be populated with any combination of a [Custom Route, QueryString, FormData or a POST'ed XML, JSON, JSV, SOAP 1.1/1.2 or ProtoBuf Request DTO payload](/architecture-overview). Although this is really inconsequential since both Amazon and ServiceStack also provide **typed service clients** so you're never required to manually construct the request by hand. 

## Messaging at Google

Although Amazon holds the SOA edge, Google, like Amazon also benefits from message-based design for nearly all their internal communications using their own Data Interchange Format - [Protocol Buffers](http://code.google.com/p/protobuf/), which like JSON is both fast, compact and tolerant:

::: info
Protocol Buffers are a way of encoding structured data in an efficient yet extensible format. Google uses Protocol Buffers for almost all of its internal RPC protocols and file formats
:::

A simple DSL is used to define their Protocol Buffer message DTOs:

```js
message Person {
    required int32 id = 1;
    required string name = 2;
    optional string email = 3;
}
```

From this they use their `protoc` command-line utility to generate native types in C++, Java and Python, which like Amazon and ServiceStack, enables them to benefit from using an end-to-end, typed API. 

> Add a reference to [ServiceStack.ProtoBuf](http://nuget.org/packages/ServiceStack.ProtoBuf)  to enable [@marcgravell's](http://stackoverflow.com/users/23354/marc-gravell) excellent implementation of Protocol Buffers: [protobuf-net](https://github.com/mgravell/protobuf-net).

## A Productivity Win 

We've been building SOA systems like this with ServiceStack for years: the productivity boost you get from using typed, end-to-end, resilient, message-based API is unmatched. An example of this was having developed over 100+ Web Services for the [Redis WebServices](http://redisadminui.servicestack.net/redis/metadata) project in just 1 weekend. Others that have tried ServiceStack also agree its ease-of-development and **"pit of success"** design it promotes ultimately yields a productivity win - this positive sentiment is captured in [@ServiceStack's favorites](https://twitter.com/ServiceStack/likes) and throughout the [mailing group](https://groups.google.com/forum/?fromgroups#!forum/servicestack).

### The anatomy of a ServiceStack service

For normal services, ServiceStack is an invisible library i.e. it lets you implement your service in pure, untainted C# accepting any user-defined Request and lets you return any Response DTO without any regard to endpoints and formats. Any dependencies your services need can be declared as public properties and are automatically auto-wired on each request. A complete example of this is the self-contained [Backbone TODO backend persisted using Redis](https://github.com/ServiceStack/ServiceStack.Examples/blob/master/src/Backbone.Todos/Global.asax.cs).

### [In contrast with SOAP](http://www.infoq.com/articles/interview-servicestack)

By contrast we've witnessed .NET devs struggling to implement much fewer SOAP web services within the same timeframe, especially when they're fighting un-expected and unknown WCF interoperability issues. Not only is SOAP more verbose and slower, its less tolerant and version-able, it was never a good choice for the open web and is now effectively deprecated.

## The many webservice frameworks of Microsoft

Unfortunately despite Microsoft having hosted Martin Fowler's respected [Data Transfer Object](http://msdn.microsoft.com/en-us/library/ff649585.aspx) and [Service Gateway](http://msdn.microsoft.com/en-us/library/ff650101.aspx) patterns on MSDN for years - none of their web frameworks have encouraged their use. Instead in .NET we've been forced to code against the multiple generation of replacement web service frameworks they've churned out over the years like .asmx, CSF, WCF, WCF/REST, WSE, WCF DataServices, RIA, MVC (escaping earlier cruft) and now WebApi. Each of these frameworks share the same mistake of mapping to C# methods, which we believe is a terrible idea for network  services since it promotes chatty and brittle remote interfaces, that fail to facilitate the easy creation of SOA-like Apis. 

Throughout all these generations of frameworks ServiceStack's underlying core message-based design has remained 
a constant powerful primitive that drives much of its simplicity. At a minimum ServiceStack Services just need 
to implement the empty marker interface:

```csharp
public interface IService { }
```

Which lets you handle any HTTP Verb, as well as a 'Catch All' **Any** fall-back to handle any un-specified HTTP verbs, e.g:

```csharp
public class MyService : IService 
{
    public Response Get(Request request)  => ...;
    public Response Post(Request request) => ...;

    //Fallback for Anything else e.g DELETE, PUT, PATCH, OPTIONS, etc.
    public Response Any(Request request)  => ...;
}
```

It simply accepts any user-defined Request DTO and returns any Response DTO - that you're given complete freedom to create. If ever more customization/headers is needed you can return the decorated response inside a `HttpResult` or `HttpError` to maintain full control over the HTTP output.

### Message APIs minimizes round-trips, creates fewer, more re-usable and extensible services

Messages APIs are naturally batchful and promote the development of coarse-grained service interfaces. This encourages fewer, more re-usable services that are better positioned for extensibility - this is a key benefit, since well-defined (i.e. non RPC/client-specific) back-end services tend to out live the UIs and clients that consume them. 

This is illustrated in this example between the [different style of services that WCF and ServiceStack encourages](https://gist.github.com/1386381). Another example showcasing the differences is in many of jQuery's APIs that take in an array of key/value pairs, like [$.ajax()](http://api.jquery.com/jQuery.ajax/). Imagine if every configuration permutation was a different or overloaded method? This gets unwieldy, very quickly. A coarse-grained interface enables richer functionality in a single call, whilst sharing the same well-tested code-path.

### Code-first POCO's

Since it promotes clean, re-usable code, ServiceStack has always encouraged the use of code-first [POCO](http://en.wikipedia.org/wiki/Plain_Old_CLR_Object)'s for just about everything. i.e. the same POCO can be used: 

  - In Request and Response DTO's (on client and server) 
  - In [JSON, JSV and CSV Text Serializers](/formats)
  - As the data model in [OrmLite](/ormlite/), [db4o](http://code.google.com/p/servicestack/source/browse/#svn%2Ftrunk%2FCommon%2FServiceStack.DataAccess%2FServiceStack.DataAccess.Db4oProvider) and [NHibernate](http://code.google.com/p/servicestack/source/browse/#svn%2Ftrunk%2FCommon%2FServiceStack.DataAccess%2FServiceStack.DataAccess.NHibernateProvider%253Fstate%253Dclosed)
  - As the entities stored in [Redis](/redis/)
  - As blobs stored in [Caches](/caching) and [Sessions](/auth/sessions)
  - Dropped and executed in [MQ's services](/redis-mq)
  - Dehydrating complex configurations into

Leveraging different technologies whose functionality is built around POCO's offer un-precedented levels of re-use, reduces friction, promotes consistent, more usable and easier to rationale code-bases.

## The case against mapping to method signatures

The programmer convenience and familiarity of using method signatures for Service APIs is just not worth what you give up:
 
It encourages developers to treat web services as just another method call even though they're millions of times slower, the different properties between service endpoints and C# methods highlight more of the short comings of this approach where in order to be able to evolve your services without friction, services should be both forward and backwards compatible - not fail-fast. When you evolve and refactor a C# method you have the opportunity to refactor all the call sites to meet the new method signature - whereas in a disconnected (and already deployed) client/server solution you don't, you need to support both old and new clients requests and the only way to do this cleanly whilst still maintaining the same code-path is to pass messages between them. 

But the main disadvantage of method signature service APIs is that they mandate the use of code-gen in order to provide a typed client API. Using messages allows you to re-use generic service clients for all your service communications. This is how, even up to this day ServiceStack remains the only .NET framework to maintain a terse, (both sync and async), typed, end-to-end client libraries without any code-gen, e.g:

```cs
Todo createdTodo = client.Post(new Todo { Content = "New Todo", Order = 1 });
```

### Code-gen'ing service clients is evil

Although a subject of another post we consider code-gen an arthritis that imposes undue friction to a project, it adds un-necessary build steps, increases compile times, forces lock-step deployment of client/server endpoints (usually requiring downtime), inhibits DRY/code re-use amongst code-gen types, has your domain logic binded to external moving types (that are outside of your control), are less resilient since code-gen types parse the entire payload - so unwanted breakages can occur on changes to un-used parts of the request or response.

The only way to maintain a succinct API that maps to method signatures without code-gen is to use dynamic. We're a fan of dynamic languages for most (fuzzy) development tasks like creating/binding UIs, html generation, scripting, etc. But we don't think they're optimal for creating evolving service APIs with - which stand to benefit most from statically typed annotations, compiler warnings and the refactoring support that statically typed languages can provide. 

### Twitter benefitting from Typed Services

After having rewrote their Ruby APIs in Scala, Twitter also comes to the same conclusion:
http://www.infoq.com/articles/twitter-java-use

> I would say about half of the productivity gain is purely because of accumulated technical debt in the search Rails stack. And the other half is that, as search has moved into a Service Oriented Architecture and exposes various APIs, static typing becomes a big convenience in enforcing coherency across all the systems. You can guarantee that your dataflow is more or less going to work, and focus on the functional aspects. Whereas for something like building a web page you don't want to recompile all the time, you don't really want to worry about whether in some edge condition you are going to get a type you didn't expect. But as we move into a light-weight Service Oriented Architecture model, static typing becomes a genuine productivity boon. And Scala gives you the same thing.

## Advantages of Message-based designs

So in contrast to method signatures, message-based designs offer many advantages:

  - They're easy to version and evolve since you're freely able to add/remove functionality and properties without error
  - They're easy to route, chain and decorate through to different handlers and pipelines
  - They're easy to serialize and proxy through to remote services 
  - They're easy to record, defer and replay - evident by ServiceStack's [IMessaging API](/redis-mq) which can automatically drop one-way services into MQ's and have them executed inside an MQ Host, you get this functionality for free since the MQ host can re-use the same web service implementation. It works the other way too where you can supply a Url in the ReplyTo property to have the MQ response POST'ed to a ServiceStack HTTP Service.
  - They're easy to log, evident by ServiceStack's trivially simple but useful [IRequestLogger service](/request-logger)
  - They're easy to map and translate to and from domain models using convention and auto mappers
  - Ideal for concurrency as immutable messages are thread-safe and can be easily multi-plexed with their handlers over multiple threads.

All these properties make messages a better choice for distributed systems, where all this functionality can be achieved with generic solutions since it's much easier to pass around and serialize messages than method signature invocations.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="Vae0ALalIP0" style="background-image: url('https://img.youtube.com/vi/Vae0ALalIP0/maxresdefault.jpg')"></lite-youtube>

### Message designs are well known

Although none of these qualities are new, message-based designs have been very well known for decades and are used in many of the most highly respected real-time distributed technologies: including Erlang processes, Java's JMS, Scala's Actors, Go's go-routines, Dart's isolates, F#'s Mailboxes as well as in industrial strength Message Queues which (amongst many other benefits) provide deferred, durable and reliable execution - which are a strong force in most other platforms.

### Messaging practically non-existant in .NET

They're just weak in .NET since Microsoft has an un-naturally strong influence over .NET developer mindshare and have been able to steer mainstream .NET into using SOAP Web Services at the expense of MQ's and message-based solutions. Our guess for this was because they've only had a poor, outdated MQ option in MSMQ and that the 1) right-click 'Add Service Reference' and 2) call a remote service like a c# method, demos very well. 

This could change with the advent of [Azure Service Bus](https://azure.microsoft.com/en-us/services/service-bus/) if Microsoft devotes some attention into pointing mainstream .NET devs towards a messaging approach. Although with the imminent release of WebApi and Microsoft's full marketing force, army of employees and full-time developer advocates behind it, they will likely be once again successful into moving most of mainstream .NET onto yet another replacement web-service framework for all their remote communication needs - when often message-based / SOA designs provide a better fit.

For those interested in discovering advantages of MQ's and message-based designs and their abilities in enabling loosely coupled distributed systems, we recommend the excellent book from Martin Fowler's signature series - [Enterprise Integration Patterns](http://www.eaipatterns.com/).

## So is ServiceStack only suitable for homogeneous environments that control client / server? 

This is fairly inaccurate considering ServiceStack's mission is close to the exact opposite: i.e. to encapsulate and empower your services logic and host them in the most accessible and re-usable ways possible on the most popular endpoints and formats. This is, after all what the core objectives of a service should be, i.e. to expose high-level functionality in the most accessible way and consume them in least-effort possible.

### Excellent built-in support of HTTP on most open and popular formats

Not only do all ServiceStack services accept a Request DTO populated with any combination of Custom Routes, QueryString and HTML FormData. You can also POST the serialized Request DTO in any of the in-built formats: i.e. XML, JSON, JSV, SOAP 1.1/1.2, ProtoBuf (when enabled) or your own [custom format](https://northwind.netcore.io/vcard-format.htm). All services immediately support JSONP and its trivial to [enable CORS on all services](http://stackoverflow.com/questions/8211930/servicestack-rest-api-and-cors). Should you wish, you're also able to have all HTTP Verbs execute the same service. 

Support is included for registering raw custom IHttpHandler's, [Request / Response Filters](/request-and-response-filters) and HttpResult/HttpError results - giving you a multitude of options to maintain full control over the entire HTTP Output - should you need to meet any extraneous external requirements. 

### Text serializers are fast, resilient and idiomatic

ServiceStack's JSON & JSV serializers are **case-insensitive** (i.e. supports both camelCase and PascalCase properties) and the 1-line below (already included in most Example templates) emits idiomatic camelCase JSON output:

```cs
JsConfig.Init(Config { TextCase = TextCase.CamelCase });
```

They're both [very resilient and can withstand extreme versioning without error](./redis/schemaless-migration.md) making it easy to consume 3rd party APIs.

### Your services can be consumed by more than just HTTP

Your services implementation can even be re-used inside any [IMessageService hosts](/redis-mq), which at this time includes support for 
[Background MQ, Rabbit MQ, Redis MQ, AWS SQS and Azure Service Bus MQ Servers](/messaging) and for Maximum Performance
Services can also be consumed from [high-performance HTTP/2 gRPC endpoints](/grpc/) and its universe of [protoc Generated Clients](https://grpc.servicestack.net/). All these features actually make ServiceStack one of the most versatile and flexible web service frameworks in existence - enabling your services accessible in a myriad of different use-cases.

### Most examples don't actually have .NET clients

This is also a peculiar assumption in light of the fact that most [ServiceStack Examples](https://github.com/ServiceStack/ServiceStack.Examples/) (as seen on http://servicestack.net) are actually Single Page Apps being consumed with Ajax clients (i.e. no .NET clients in sight). 

The [Backbone TODOs example](http://www.servicestack.net/Backbone.Todos/) shows how trivial it was to retrofit Backbone's REST service with a ServiceStack backend and the [SocialBootstrapApi](https://github.com/ServiceStack/SocialBootstrapApi) example show-cases an internet-ready Single Page Backbone App with Facebook, Twitter, HTML Form credentials, Basic Auth & Digest Auth, all enabled. It also makes use of ServiceStack's [cross-platform node.js bundler](https://github.com/ServiceStack/Bundler) for statically compiling, minifying and concatenating your websites .coffee, .js, .less, .sass and .css assets - and since it works headless and without .NET, is able to be used for non .NET projects as well.

### .NET clients can benefit from a typed API

.NET clients do benefit from being able to re-use the same types you've defined your web services with, which in addition to [pre-defined auto routes](http://www.servicestack.net/ServiceStack.Hello/#predefinedroutes) and generic service clients, is what enables the typed, end-to-end client gateways.

### Just as consumable as any other web service

But even without this, ServiceStack services are just as consumable as any other web service framework since they're just pure DTOs serialized into the preferred Content-Type, with no additional bytes or wrappers added to the response. Different client examples in contrast:

The earlier typed API example of creating a new TODO in C#:

```csharp
var client = new JsonApiClient(baseUrl);
Todo createdTodo = client.Post(new Todo { Content = "New Todo", Order = 1 });
```

Is like this in [TypeScript](/typescript-add-servicestack-reference):

```ts
var client = new JsonApiClient(baseUrl);
var request = Todo();
request.Content = "New Todo";
request.Order = 1;
client.post(request)
    .then((createdTodo) => ...)
```

and this in Dart (using the [Dart JSON Client](https://github.com/mythz/DartJsonClient)):

```dart
var client = new JsonClient(baseUrl);
client.todos({'content':'New Todo', 'order':1})
        .then((createdTodo) => ...);
```

Or in jQuery:

```js
$.post(baseUrl + '/todos', {content:'New Todo', order:1}, 
       function(createdTodo) { ... }, 'json');
```

And you still have the option to consume all services in other Content-Types. Some languages may prefer to deal with XML - which can easily be accessed by adding the appropriate `Accept` and `Content-Type` headers.

## What's the best way to expose our services to clients today?

### What was SOAP's original vision?

Back in the W3C glory days, existed think-tanks who imagined a beautiful world were you could easily discover and connect to services through the magical properties of UDDI and WSDLs. However this pipe-dream never came to pass, the closest .NET got was the 'Add Service Reference' dialog ingrained in VS.NET - which we refer to internally as the technical-debt-creating-anti-pattern dialog :)

### So how should we expose our services now?

The natural choice would be to just document your services' uniform HTTP Interface using XML or JSON REST APIs. This is a popular choice for many companies today, some good examples include [StackOverflow](http://api.stackoverflow.com/1.0/usage) and [GitHub](http://developer.github.com/v3/). This approach easily supports dynamic clients who are able to trivially consume JSON responses.

### Native language client libraries

A more productive option for clients however would be to provide a native client library for each of the popular languages you wish to support. This is generally the approach of companies who really, really want to help you use their services - they tend to call their clients **SDK's** which abstract away the underlying connection transport behind optimal native language bindings. This is especially evident from companies whose business relies on the popular use of their APIs, like [Amazon](http://aws.amazon.com/sdkfornet/), [Facebook](https://developers.facebook.com/docs/sdks/) and [Windows Azure](https://github.com/WindowsAzure). This is an especially good idea if you want to support static languages (i.e. C# and Java) where having typed client libraries saves end-users from reverse engineering the types and API calls. It also saves them having to look up documentation since a lot of it can be inferred from the type info. ServiceStack's and Amazons convention of having `ServiceName` and `ServiceNameResponse` for each service also saves users from continually checking documentation to work out what the response of each service will be.

### Packaging client libraries

In terms of packaging your client libraries, sticking a link to a zip file on your Websites APIs documentation page would be the easiest approach. It would be better if the zip file was a link to a master archive of a Github repository as you'll be able to accept bug fixes and usability tips from the community. Finally we believe the best way to make your client libraries available would be to host them in the target languages native package manager - letting end-users issue 1-command to automatically add it to their project, and another to easily update it when your service has changed. 

### NuGet is the new Add Service Reference

For .NET this means adding it to NuGet. If you use ServiceStack your package would just need to contain your types with a reference to [ServiceStack.Client](http://nuget.org/packages/ServiceStack.Client) - which contains all ServiceStack's generic JSON, XML, JSV and SOAP 1.1/1.2 service clients. Add a reference to [ServiceStack.ProtoBuf](http://nuget.org/packages/ServiceStack.ProtoBuf) if you want to support Protocol Buffers as well. One of the benefits of using ServiceStack is that all your types are already created since it's what you used to define your web services with!
