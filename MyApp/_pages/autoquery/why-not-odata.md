---
slug: why-not-odata
title: Why not OData?
---

[Microsoft's own Services Design guidelines](http://msdn.microsoft.com/en-us/library/ms954638.aspx) provides a good initial summary on why OData-like services are a Services anti-pattern:

 - There is virtually no contract. A service consumer has no idea how to use the service (for example, what are valid Command arguments, encoding expectations, and so on).
 - The interface errs on the side of being too liberal in what it will accept. 
 - The contract does not provide enough information to consumers on how to use the service. If a consumer must read something other than the service's signature to understand how to use the service, the factoring of the service should be reviewed.
 - Consumers are expected to be familiar with the database and table structures prior to consuming the Web service. This results in a tight coupling between service providers and consumers.
 - Performance will suffer due to dependencies on late binding and encoding/decoding between boundaries within the same service.

This is ultimately where many auto querying solutions fall down, they're typically executed with black-box binary implementations 
which only understand their opaque query languages normal Services wouldn't support, are exposed on unnatural routes you wouldn't use 
and return unclean verbose wire formats normal Services wouldn't return. So when it comes to needing to replace their 
implementation-specific APIs, it's often not feasible to reverse engineer a new implementation to match its existing Services contract and 
would need to resort in creating a new incompatible API, breaking existing clients and violating its Systems

### OData Example

We previously used one of [Netflix's OData examples to illustrate this](http://stackoverflow.com/a/9579090/85785) showing how to query for movies with specific ratings, a service available before [Netflix retired their OData catalog](http://developer.netflix.com/blog/read/Changes_to_the_Public_API_Program):

 > http://odata.netflix.com/Catalog/Titles?$filter=Type%20eq%20'Movie'%20and%20(Rating%20eq%20'G'%20or%20Rating%20eq%20'PG-13')

This service is effectively coupled to a Table/View called `Titles` and a column called `Type`. You're also coupled to the OData binary implementation inhibiting future optimizations or the ability to move to an optimal implementation in future e.g. leveraging a Search Index to serve part or the entire request. Use of special operators illegal in C#/.NET variable names like `$filter` shows that OData makes a point of exposing an API that wouldn't be developed naturally, it's effectively an isolated technology stack processing queries tunneled within its own custom namespace.

### Out of band knowledge in Free-form expressions

In order to understand how to consume this service you also have to be familiar with [the OData specification](http://www.odata.org/documentation/odata-version-4-0/) which due to its size and complexity ensures OData queries effectively become an opaque text blob invisible to your application that can only be processed by an OData binary that understands the OData spec. This was one of the major disadvantages of SOAP and WS-* specifications which due to its size and complexity forced the use of a SOAP Framework to be able to create services as opposed to simple HTTP API's which allow any language on any platform with a HTTP Server to be able to create Web Services. A pitfall free-form expressions encourage is having knowledge and opinions baked into client libraries, eventually mandating the use of specific consumer implementations. This is avoided with well-defined API boundaries ensuring that any service, of any complexity, can be called with just a URL and the API's published message forms.

### Tight Coupling of Internals

This service also requires knowledge of the internal structure of Netflix's DB schema to know what table and columns to query, more importantly once an OData API for your data model is published and has clients binded to it in production, the DB schema effectively becomes frozen since the OData query-space can reference any table and any column that was exposed.

### The ideal impl-agnostic movie ratings API

In contrast, if you were to create the service without using OData it would something like:

> http://api.netflix.com/movies?ratings=G,PG-13

i.e. just capturing the actual intent of the query, leaves complete freedom in how to best service the request whilst retaining the ability to evolve the underlying implementation without breaking existing clients.

## Goals of Service Design

The primary benefits of Services are that they offer the highest level of software re-use, they're [Real Computers all the way down](https://mythz.servicestack.net/#messaging) retaining the ability to represent anything. Especially at this level, encapsulation and its external interactions are paramount which sees the [Service Layer as its most important Contract](http://stackoverflow.com/a/15369736/85785), constantly evolving to support new capabilities whilst serving and outliving its many consumers. 

Extra special attention should be given to Service design with the primary goals of exposing its capabilities behind [consistent and self-describing](/why-servicestack#goals-of-service-design), intent-based [tell-dont-ask](http://pragprog.com/articles/tell-dont-ask) APIs - given its importance, it's not something that should be dictated by an internal implementation. 

A Services ability to encapsulate complexity is what empowers consumers to be able to perform higher-level tasks like provisioning a cluster of AWS servers or being able to send a tweet to millions of followers in seconds with just a simple HTTP request, i.e. being able to re-use existing hardened functionality without the required effort, resources and infrastructure to facilitate the request yourself. To maximize accessibility it's recommended for Service Interfaces to retain a flat structure, customizable with key value pairs so they're accessible via the built-in QueryString and FormData support present in all HTTP clients, from HTML Forms to command-line utilities like [curl](http://curl.haxx.se/).

## Unnecessary Complexity

Another reason we're opposed to considering technologies like OData is the sheer amount of unnecessary complexity of the implementation itself. Minimizing complexity is at the core essence of ServiceStack, it's why ServiceStack exists and remains the primary design goal in how features are implemented with the least complexity and cognitive overhead required.

### OData is Big

By contrast OData is comically large, there's literally an [entire Organization](http://www.odata.org/) created around it, sporting its own [blog](http://www.odata.org/blog/), [mailing list](http://www.odata.org/join-the-odata-discussion/), multiple [spec versions](http://www.odata.org/documentation/odata-version-4-0/) and [client libraries](http://www.odata.org/documentation/odata-version-4-0/) of which it appears only the Microsoft sponsored client libraries implement the latest v4 of the OData spec, as-is the nature of complicated rolling specs. 

Measuring size by weight shows `Microsoft.Data.OData.dll` alone weighs in at **1,287kb**, even more than `ServiceStack.dll`, surprising given [ServiceStack does a lot](https://servicestack.net/features). Include OData's required `Microsoft.Data.Edm.dll` and `System.Spatial.dll` NuGet dependencies and the payload increases another 50%, include integration with WebApi and client OData libraries and it bloats up further again.

### Why not Complexity

Imagine how much knowledge and cognitive overhead would be required to create a simple web app if every feature was over-engineered in this way? Every new feature introduces a complexity cost which is [why it's critically important](https://mythz.servicestack.net/#engineering) to ensure any complexity introduced [remains proportional](https://gist.github.com/cookrn/4015437) with the [needs being solved](http://worrydream.com/ABriefRantOnTheFutureOfInteractionDesign/). 

The needs in this case is [simplifying](http://www.infoq.com/presentations/Simple-Made-Easy) the creation and consumption of data-driven services, something which could easily have been implemented as a single feature point, has instead [been over-engineered](http://www.tele-task.de/player/embed/5819/0/?iframe) beyond belief and turned into something you can go on a training course and get certifications for! 

[Large implementations](http://steve-yegge.blogspot.com/2007/12/codes-worst-enemy.html) weakens our ability to reason about a system, to make informed decisions, to understand the impact of customization's and optimizations or identify the underlying cause of unintended behavior.

### Adding new Features without new Complexity

Rather than tacking on new libraries or inventing different ways/concepts/specs/dsl's for doing new things, features in ServiceStack are applied thoughtfully so they naturally integrate with its [existing architecture](/architecture-overview) maximizing re-use and leveraging existing functionality wherever possible, strengthening the existing mental model and ensuring new abstractions or concepts only get added for that of which is truly new.

## [Introducing AutoQuery](/autoquery#introducing-autoquery)

The solution to overcome most of OData issues is ultimately quite simple: enhance the ideal API the developer would naturally write and complete their implementation for them! This is essentially the philosophy behind AutoQuery which utilizes conventions to automate creation of intent-based self-descriptive APIs that are able to specify configurable conventions and leverage extensibility options to maximize the utility of AutoQuery services.
