---
slug: why-servicestack
title: Why ServiceStack
---

Developed in the modern age, ServiceStack provides an alternate, cleaner POCO-driven way of creating web services.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="Vae0ALalIP0" style="background-image: url('https://img.youtube.com/vi/Vae0ALalIP0/maxresdefault.jpg')"></lite-youtube>

### Features Overview

ServiceStack is a simple, fast, versatile and highly-productive full-featured [Web](https://blazor-vue.web-templates.io) and 
[Web Services](/web-services) Framework that's 
thoughtfully-architected to [reduce artificial complexity](/autoquery/why-not-odata#why-not-complexity) and promote 
[remote services best-practices](/advantages-of-message-based-web-services) 
with a [message-based design](/what-is-a-message-based-web-service) 
that allows for maximum re-use that can leverage an integrated 
[Service Gateway](/service-gateway) 
for the creation of loosely-coupled 
[Modularized Service](/modularizing-services) Architectures.
ServiceStack Services are consumable via an array of built-in fast data formats (inc. 
[JSON](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Text/src/ServiceStack.Text), 
XML,
[CSV](/csv-format),
[JSONL](/jsonl-format),
[JSV](/jsv-format), 
[ProtoBuf](/protobuf-format) and 
[MsgPack](/messagepack-format)) 
as well as XSD/WSDL for [SOAP endpoints](/soap-support) and 
[Rabbit MQ](/rabbit-mq), 
[Redis MQ](/redis-mq),
[Azure Service Bus](/azure-service-bus-mq),
[Amazon SQS](/aws#sqsmqserver) and
[Background MQ](/background-mq),
MQ hosts. 

Its design and simplicity focus offers an unparalleled suite of productivity features that can be declaratively enabled 
without code, from creating fully queryable Web API's with just a single Typed Request DTO with
[Auto Query](/autoquery/) supporting 
[every major RDBMS](/ormlite/#ormlite-rdbms-providers) 
to the built-in support for
[Auto Batched Requests](/auto-batched-requests) 
or effortlessly enabling rich [HTTP Caching](/http-caching) and
[Encrypted Messaging](/auth/encrypted-messaging) 
for all your existing services via [Plugins](/plugins).

<img src="/img/pages/svg/servicify.svg" width="100%">

Your same Services also serve as the Controller in ServiceStack's [Smart Razor Views](https://razor.netcore.io/)
reducing the effort to serve both 
[Web and Single Page Apps](https://github.com/ServiceStackApps/LiveDemos) as well as 
[Rich Desktop and Mobile Clients](https://github.com/ServiceStackApps/HelloMobile) that are able to deliver instant interactive 
experiences using ServiceStack's real-time [Server Events](/server-events).

ServiceStack Services also maximize productivity for consumers providing an 
[instant end-to-end typed API without code-gen](/csharp-client) enabling
the most productive development experience for developing .NET to .NET Web Services.

### Benefits
 
- **Simplicity** - All features are centered around APIs that accept and return Typed DTOs
- **Speed** - Built for speed on high-performance components utilizing performance APIs available in each .NET runtime
- **Web Services Best Practices** - Adopts time-tested SOA Integration Patterns for APIs and client integrations
- **Message-based Services** - Model-driven, code-first, friction-free development
- **Native Clients** - Clean, end-to-end typed idiomatic APIs for most major platforms
- **Modern** - No XML config, IOC built-in, no code-gen, conventional defaults
- **Smart** - Infers greater intelligence from your strongly typed DTOs
- **Effortless Features** - Most features enhance your existing DTOs making them trivial to enable
- **Multi Platform** - Supports .NET 4.5 and .NET Core platforms for hosting on Windows, OSX, Linux
- **Multiple Hosts** - Run in Web, Console, native Windows/OSX Desktop Apps, Windows Services
- **Host Agnostic** - Services are decoupled from HTTP and can be hosted in MQ Services
- **Highly testable** - Typed, idiomatic client APIs enable succinct, intuitive Integration tests
- **Mature** - Stable with over 10+ years of development 
- **Preserve Investment** - modern libraries that are [Continuously Improved](/release-notes-history) (not abandoned or replaced)
- **Dependable** - Commercially supported and actively developed
- **Increasing Value** - ServiceStack's [ever-growing features](https://servicestack.net/features) adds more capabilities around your Services with each release


### Generate Instant Typed APIs from within all Major IDEs!

ServiceStack now [integrates with all Major IDE's](/add-servicestack-reference) used for creating the best native experiences 
on the most popular platforms to enable a highly productive dev workflow for consuming Web Services, making ServiceStack the ideal 
back-end choice for powering rich, native iPhone and iPad Apps on iOS with Swift, Mobile and Tablet Apps on the Android platform 
with Java, OSX Desktop Applications as well as targeting the most popular .NET PCL platforms including Xamarin.iOS, Xamarin.Android, 
Windows Store, WPF, WinForms and Silverlight: 

[![](./img/pages/servicestack-reference/ide-plugins-splash.png)](https://www.youtube.com/watch?v=JKsgrstNnYY)

#### [JetBrains Rider ServiceStack Plugin](https://www.youtube.com/watch?v=JKsgrstNnYY)

The **ServiceStack** Rider plugin is installable directly from JetBrains Marketplace and enables seamless integration with JetBrains Rider for easily generating C#, TypeScript, F# and VB.NET Typed APIs from just a remote ServiceStack Base URL.

#### [VS.NET integration with ServiceStackVS](/create-your-first-webservice#step-1-download-and-install-servicestackvs)

Providing instant Native Typed API's for 
[C#](/csharp-add-servicestack-reference), 
[TypeScript](/typescript-add-servicestack-reference),
[F#](/fsharp-add-servicestack-reference) and 
[VB.NET](/vbnet-add-servicestack-reference) 
directly in Visual Studio for the 
[most popular .NET platforms](https://github.com/ServiceStackApps/HelloMobile) including iOS and Android using 
[Xamarin.iOS](https://github.com/ServiceStackApps/HelloMobile#xamarinios-client) and 
[Xamarin.Android](https://github.com/ServiceStackApps/HelloMobile#xamarinandroid-client) on Windows.

#### [Xamarin Studio integration with ServiceStackXS](/csharp-add-servicestack-reference.html#xamarin-studio)

Providing [C# Native Types](/csharp-add-servicestack-reference) 
support for developing iOS and Android mobile Apps using 
[Xamarin.iOS](https://github.com/ServiceStackApps/HelloMobile#xamarinios-client) and 
[Xamarin.Android](https://github.com/ServiceStackApps/HelloMobile#xamarinandroid-client) with 
[Xamarin Studio](https://www.xamarin.com/studio) on OSX. The **ServiceStackXS** plugin also provides a rich web service 
development experience developing Client applications with 
[Mono Develop on Linux](/csharp-add-servicestack-reference.html#xamarin-studio-for-linux)

#### [Android Studio integration with ServiceStack Plugin](/java-add-servicestack-reference)

Providing [an instant Native Typed API in Java](/java-add-servicestack-reference) 
and [Kotlin](/kotlin-add-servicestack-reference)
including idiomatic Java Generic Service Clients supporting Sync and Async Requests by leveraging Android's AsyncTasks to enable the creation of services-rich and responsive native Java or Kotlin Mobile Apps on the Android platform - directly from within Android Studio!

#### [JetBrains IDEs integration with ServiceStack IDEA plugin](/java-add-servicestack-reference.html#install-servicestack-idea-from-the-plugin-repository)

The ServiceStack IDEA plugin is installable directly from IntelliJ's Plugin repository and enables seamless integration with IntelliJ Java Maven projects for generating a Typed API to quickly and effortlessly consume remote ServiceStack Web Services from pure cross-platform Java or Kotlin Clients.

#### [Eclipse integration with ServiceStackEclipse](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/ServiceStackEclipse#eclipse-integration-with-servicestack)

The unmatched productivity offered by [Java Add ServiceStack Reference](/java-add-servicestack-reference) is also available in the 
[ServiceStackEclipse IDE Plugin](https://github.com/ServiceStack/ServiceStack.Java/tree/master/src/ServiceStackEclipse#eclipse-integration-with-servicestack) that's installable 
from the [Eclipse MarketPlace](https://marketplace.eclipse.org/content/servicestackeclipse) to provide deep integration of Add ServiceStack Reference with Eclipse Java Maven Projects
enabling Java Developers to effortlessly Add and Update the references of their evolving remote ServiceStack Web Services.

#### [Simple command-line utilities for ServiceStack](/add-servicestack-reference.html#simple-command-line-utilities)

In addition to our growing list of supported IDE's, the [x dotnet tool](/dotnet-tool) allows VS Code and other cross-platform IDEs, build servers, shell scripts and other automated tasks to easily Add and Update ServiceStack References with a single command.

#### [Invoke ServiceStack APIs from the command-line](/post-command)

Easily inspect and invoke C# .NET Web APIs from the command-line with Post Command which allows you to both inspect and
call any ServiceStack API with just its name and a JS Object literal. API Responses returned in human-friendly markdown tables by default or 
optionally as JSON & raw HTTP.

## Simple Customer Database REST Services Example

This example is also available as a [stand-alone integration test](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/CustomerRestExample.cs):

```csharp
//Web Service Host Configuration
public class AppHost : AppSelfHostBase
{
    public AppHost() 
        : base("Customer REST Example", typeof(CustomerService).Assembly) {}

    public override void Configure(Container container)
    {
        //Register which RDBMS provider to use
        container.Register<IDbConnectionFactory>(c => 
            new OrmLiteConnectionFactory(":memory:", SqliteDialect.Provider));

        using (var db = container.Resolve<IDbConnectionFactory>().Open())
        {
            //Create the Customer POCO table if it doesn't already exist
            db.CreateTableIfNotExists<Customer>();
        }
    }
}

//Web Service DTOs
[Route("/customers", "GET")]
public class GetCustomers : IReturn<GetCustomersResponse> {}

public class GetCustomersResponse
{
    public List<Customer> Results { get; set; } 
}

[Route("/customers/{Id}", "GET")]
public class GetCustomer : IReturn<Customer>
{
    public int Id { get; set; }
}

[Route("/customers", "POST")]
public class CreateCustomer : IReturn<Customer>
{
    public string Name { get; set; }
}

[Route("/customers/{Id}", "PUT")]
public class UpdateCustomer : IReturn<Customer>
{
    public int Id { get; set; }

    public string Name { get; set; }
}

[Route("/customers/{Id}", "DELETE")]
public class DeleteCustomer : IReturnVoid
{
    public int Id { get; set; }
}

// POCO DB Model
public class Customer
{
    [AutoIncrement]
    public int Id { get; set; }

    public string Name { get; set; }
}

//Web Services Implementation
public class CustomerService : Service
{
    public object Get(GetCustomers request)
    {
        return new GetCustomersResponse { Results = Db.Select<Customer>() };
    }

    public object Get(GetCustomer request)
    {
        return Db.SingleById<Customer>(request.Id);
    }

    public object Post(CreateCustomer request)
    {
        var customer = new Customer { Name = request.Name };
        Db.Save(customer);
        return customer;
    }

    public object Put(UpdateCustomer request)
    {
        var customer = Db.SingleById<Customer>(request.Id);
        if (customer == null)
            throw HttpError.NotFound($"Customer '{request.Id}' does not exist");

        customer.Name = request.Name;
        Db.Update(customer);

        return customer;
    }

    public void Delete(DeleteCustomer request)
    {
        Db.DeleteById<Customer>(request.Id);
    }
}

```

### [Calling the above REST Service from any C#/.NET Client](/csharp-add-servicestack-reference)

No code-gen required, can re-use above Server DTOs:

```csharp
var client = new JsonApiClient(BaseUri);

//GET /customers
var all = client.Get(new GetCustomers());                         // Count = 0

//POST /customers
var customer = client.Post(new CreateCustomer { Name = "Foo" });

//GET /customer/1
customer = client.Get(new GetCustomer { Id = customer.Id });      // Name = Foo

//GET /customers
all = client.Get(new GetCustomers());                             // Count = 1

//PUT /customers/1
customer = client.Put(
    new UpdateCustomer { Id = customer.Id, Name = "Bar" });       // Name = Bar

//DELETE /customers/1
client.Delete(new DeleteCustomer { Id = customer.Id });

//GET /customers
all = client.Get(new GetCustomers());                             // Count = 0
```

Same code also works with [Android, iOS, Xamarin.Forms, UWP and WPF clients](https://github.com/ServiceStackApps/HelloMobile).

::: info
[F#](/fsharp-add-servicestack-reference) and 
[VB.NET](/vbnet-add-servicestack-reference) can re-use same 
[.NET Service Clients](/csharp-client) and DTOs
:::

### [Calling from TypeScript](/typescript-add-servicestack-reference.html#ideal-typed-message-based-api)

```ts
const client = new JsonServiceClient(baseUrl);
const { results } = await client.get(new GetCustomers());
```

### [Calling from Swift](/swift-add-servicestack-reference.html#jsonserviceclientswift)

```swift
let client = JsonServiceClient(baseUrl: BaseUri)

client.getAsync(GetCustomers())
    .then {
        let results = $0.results;
    }
```

### [Calling from Java](/java-add-servicestack-reference.html#jsonserviceclient-usage)

```java
JsonServiceClient client = new JsonServiceClient(BaseUri);

GetCustomersResponse response = client.get(new GetCustomers());
List<Customer> results = response.results; 
```

### [Calling from Kotlin](/kotlin-add-servicestack-reference.html#jsonserviceclient-usage)

```kotlin
val client = JsonServiceClient(BaseUri)

val response = client.get(GetCustomers())
val results = response.results
```

### Calling the from [Dart](/dart-add-servicestack-reference#example-usage)

```dart
var client = new JsonServiceClient(baseUri);
var response = await client.get(new GetCustomers());
```

### [Calling from jQuery using TypeScript Definitions](/typescript-add-servicestack-reference.html#typescript-interface-definitions)

```js
$.getJSON($.ss.createUrl("/customers", request), request, 
    function (r: dtos.GetCustomersResponse) {
    	alert(r.Results.length == 1);
    });
```

### Calling from jQuery

```js
$.getJSON(baseUri + "/customers", function(r) {
	alert(r.Results.length == 1);
});
```

That's all the application code required to create and consume a simple database-enabled REST Web Service!


### Define web services following Martin Fowlers Data Transfer Object Pattern

ServiceStack was heavily influenced by [**Martin Fowlers Data Transfer Object Pattern**](http://martinfowler.com/eaaCatalog/dataTransferObject):

>When you're working with a remote interface, such as Remote Facade (388), each call to it is expensive. 
>As a result you need to reduce the number of calls, and that means that you need to transfer more data 
>with each call. One way to do this is to use lots of parameters. 
>However, this is often awkward to program - indeed, it's often impossible with languages such as Java 
>that return only a single value.
>
>The solution is to create a Data Transfer Object that can hold all the data for the call. It needs 
to be serializable to go across the connection. 
>Usually an assembler is used on the server side to transfer data between the DTO and any domain objects.

The Request- and Response DTO's used to define web services in ServiceStack are standard POCO's while 
the implementation just needs to inherit from a testable and dependency-free `IService` marker interface. 
As a bonus for keeping your DTO's in a separate dependency-free .dll, you're able to re-use them in 
your C#/.NET clients providing a strongly-typed API without any code-gen what-so-ever. Also your DTO's 
*define everything* ServiceStack does not pollute your web services with any additional custom 
artifacts or markup.

### Multiple Clients

Our generic Service clients covers the most popular Mobile, Desktop and Server platforms with first-class implementations for Xamarin, Android, Java and TypeScript which now includes:

 - [.NET Service Clients](/csharp-client)
    - C# / VB.NET / F#
    - .NET Core 2.1+
    - .NET Framework 4.5+
    - Blazor WASM
    - Xamarin.iOS
    - Xamarin.Android
    - UWP
    - Silverlight
 - [TypeScript Service Client](/typescript-add-servicestack-reference#typescript-serviceclient)
    - Web
    - Node.js Server
    - React Native
        - iOS
        - Android
 - [Python Service Client](/python-add-servicestack-reference)
 - [Dart](/dart-add-servicestack-reference)
   - Flutter
        - iOS
        - Android
   - Web / Angular.dart
 - [Java Service Client](/java-add-servicestack-reference#jsonserviceclient-api)
    - Android
    - JVM 1.7+ (Java, Kotlin, Scala, etc)
        - Java Clients
        - Java Servers
 - [Kotlin Service Client](/kotlin-add-servicestack-reference)
 - [Swift Service Client](/swift-add-servicestack-reference#swift-client-usage)
    - iOS
    - OSX
    - [Swift Package Manager Apps](https://github.com/ServiceStackApps/swift-techstacks-console)
 - [JavaScript (jQuery)](/ss-utils-js)
   - Web
 - [MQ Clients](/messaging#mq-client-architecture)
   - Background MQ
   - Rabbit MQ
   - Redis MQ
   - Amazon SQS
   - Azure Service Bus

### Multiple pluggable Formats

ServiceStack re-uses the custom artifacts above and with zero-config and without imposing any extra 
burden on the developer adds discoverability and provides hosting of your web service on a number 
of different formats, including: 
 
 - [JSON]/json-format)
 - XML
 - [JSV](/jsv-format)
 - [CSV](/csv-format)
 - [MsgPack](/messagepack-format)
 - [ProtoBuf](/protobuf-format)
 - [gRPC](/grpc/)
 - [SOAP 1.1/1.2](/soap-support)
 - HTML
   - [Auto HTML API](/auto-html-api)
   - [Blazor](https://blazor-vue.web-templates.io)
   - [Razor](https://razor.netcore.io/)
   - [Sharp Pages](https://sharpscript.net/docs/script-pages)
   - [Markdown Razor](/markdown-razor)

### Multiple Endpoints

Whilst ServiceStack is fundamentally a premier HTTP Framework, its Services can also be consumed from new [gRPC](/grpc/) as well as legacy [SOAP 1.1 and 1.2](/soap-support) endpoints as well as a number of [MQ Servers](/messaging):

  - [Background MQ Service](/background-mq)
  - [Rabbit MQ Server](/rabbit-mq)
  - [Redis MQ Server](/redis-mq)
  - [Amazon SQS MQ Server](/amazon-sqs-mq)
  - [Azure Service Bus MQ](/azure-service-bus-mq)

### Multiple Hosting Options

In addition to supporting multiple formats and endpoints, ServiceStack can also be hosted within a multitude of different hosting options:

#### Windows, OSX or Linux
- **.NET 10+**
  - [ASP .NET Identity Auth Templates](https://servicestack.net/start)
  - [ServiceStack Auth Templates](https://servicestack.net/start-auth#projects)

 - **.NET Core 2.1+**
   - [Web App or SelfHost](https://github.com/NetCoreApps/LiveDemos#servicestack-net-core-live-demos)
   - [Worker Service](/messaging#worker-service-templates)

#### Windows
 - **.NET Framework 4.7.2+**
   - [ASP.NET Core 2.1 LTS](/templates/corefx)
   - [Classic ASP.NET System.Web](https://github.com/ServiceStackApps/LiveDemos#live-servicestack-demos)
   - [Stand-alone, Self-Hosted HttpListener](/self-hosting)
   - [Stand-alone Windows Service](/templates/windows-service)
   - [Hosted inside WinForms with Chromium Embedded Framework](https://github.com/ServiceStack/ServiceStack.Gap#winforms-with-chromium-embedded-framework)
   - [Windows and Azure Service Fabric](https://github.com/ServiceStackApps/HelloServiceFabric)

#### OSX
 - [Hosted inside Mac OSX Cocoa App with Xamarin.Mac](https://github.com/ServiceStack/ServiceStack.Gap#mac-osx-cocoa-app-with-xmarainmac)

### Target Multiple platforms

With multi-targeted projects creating both .NET Framework and .NET Standard builds you can optionally run your same ServiceStack App on multiple platforms as seen with the [Hello Mobile Shared Gateway](/releases/v5_0_0#run-aspnet-core-apps-on-the-net-framework) project where its same shared [ServiceStack Server.Common project](https://github.com/ServiceStackApps/HelloMobile#servicestack-server-app) is used to host the same App running on:

 - [Server.NetCore](https://github.com/ServiceStackApps/HelloMobile/tree/master/src/Server.NetCore) - hosting the ServiceStack Services in a **ASP.NET Core 2.1 App**
 - [Server.NetCoreFx](https://github.com/ServiceStackApps/HelloMobile/tree/master/src/Server.NetCoreFx) - hosting in a **ASP.NET Core App** on the **.NET Framework**
 - [Server.AspNet](https://github.com/ServiceStackApps/HelloMobile/tree/master/src/Server.AspNet) - hosting classic **ASP.NET Framework** Web Applications
 - [Server.HttpListener](https://github.com/ServiceStackApps/HelloMobile/tree/master/src/Server.HttpListener) - host in a .NET Framework Self-Hosting **HttpListener** AppHost

### VS.NET Templates

There's a [VS.NET Template](/templates/) for creating solutions targeting most of the above platforms.

E.g. the [React Desktop Apps](https://github.com/ServiceStackApps/ReactDesktopApps) VS.NET Template provides an easy and integrated way to host a Single Page React App on multiple platforms.

## Goals of Service Design

The primary benefits of Services are that they offer the highest level of software re-use, they're [Real Computers all the way down](https://mythz.servicestack.net/#messaging) retaining the ability to represent anything. Especially at this level, encapsulation and its external interactions are paramount which sees the [Service Layer as its most important Contract](http://stackoverflow.com/a/15369736/85785), constantly evolving to support new capabilities whilst serving and outliving its many consumers. 

Extra special attention should be given to Service design with the primary goals of exposing its capabilities behind [consistent and self-describing](/why-servicestack#goals-of-service-design), intent-based [tell-dont-ask](https://pragprog.com/articles/tell-dont-ask) APIs. 

A Services ability to encapsulate complexity is what empowers consumers to be able to perform higher-level tasks like provisioning a cluster of AWS servers or being able to send a tweet to millions of followers in seconds with just a simple HTTP request, i.e. being able to re-use existing hardened functionality without the required effort, resources and infrastructure to facilitate the request yourself. To maximize accessibility it's recommended for Service Interfaces to be orientated around resources and verbs, retain a flat structure, customizable with key value pairs so they're accessible via the built-in QueryString 
and FormData support present in all HTTP clients, from HTML Forms to command-line utilities like [curl](https://curl.haxx.se).

### WCF the anti-DTO Web Services Framework

Unfortunately this best-practices convention is effectively discouraged by Microsoft's WCF SOAP Web Services framework as they encourage you to develop API-specific RPC method calls by mandating the use of method signatures to define your web services API. This results in less re-usable, more client-specific APIs that encourages more remote method calls. 

Unhappy with this perceived anti-pattern in WCF, ServiceStack was born providing a Web Service framework that embraces best-practices for calling remote services, using config-free, convention-based DTO's.

### Encourages development of message-style, re-usable and batch-full web services

Entire POCO types are used to define the request- and response DTO's to promote the creation well-defined coarse-grained web services. Message-based interfaces are best-practices when dealing with out-of-process calls as they can batch more work using less network calls and are ultimately more re-usable as the same operation can be called using different calling semantics. This is in stark contrast to WCF's Operation or Service contracts which encourage RPC-style, application-specific web services by using method signatures to define each operation.

As it stands in general-purpose computing today, there is nothing more expensive you can do than a remote network call. Although easier for the newbie developer, by using _methods_ to define web service operations, WCF is promoting bad-practices by encouraging them to design and treat web-service calls like normal function calls even though they are millions of times slower. Especially at the app-server tier, nothing hurts performance and scalability of your client and server than multiple dependent and synchronous web service calls.

Batch-full, message-based web services are ideally suited in development of SOA services as they result in fewer, richer and more re-usable web services that need to be maintained. RPC-style services normally manifest themselves from a *client perspective* that is the result of the requirements of a single applications data access scenario. Single applications come and go over time while your data and services are poised to hang around for the longer term. Ideally you want to think about the definition of your web service from a *services and data perspective* and how you can expose your data so it is more re-usable by a number of your clients.

## Difference between an RPC-chatty and message-based API

```csharp
public interface IWcfCustomerService
{
    Customer GetCustomerById(int id);
    List<Customer> GetCustomerByIds(int[] id);
    Customer GetCustomerByUserName(string userName);
    List<Customer> GetCustomerByUserNames(string[] userNames);
    Customer GetCustomerByEmail(string email);
    List<Customer> GetCustomerByEmails(string[] emails);
}
```

### contrast with an equivalent message based service:

```csharp
public class Customers : IReturn<List<Customer>> 
{
   public int[] Ids { get; set; }
   public string[] UserNames { get; set; }
   public string[] Emails { get; set; }
}
```

**Any combination of the above can be fulfilled by 1 remote call, by the same single web service - i.e what ServiceStack encourages!**

Fewer and more batch-full services require less maintenance and promote the development of more re-usable and efficient services. 
In addition, message APIs are much more resilient to changes as you're able to safely add more functionality or return more data without breaking or needing to re-gen existing clients. Message-based APIs also lend them better for cached, asynchronous, deferred, proxied and reliable execution with the use of brokers and proxies.

Comparatively there is almost no win for a remote RPC API, except to maybe [hide a remote service even exists](https://en.wikipedia.org/wiki/Fallacies_of_Distributed_Computing) by making a remote call look like a method call even though they're millions of times slower, leading new developers to develop inefficient, brittle systems from the start. 
