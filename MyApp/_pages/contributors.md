---
title: Contributors
---

## Big thanks to our 300+ .NET Open Source Contributors!

These last few weeks have been the most eventful in ServiceStack's history where we've delivered [considerable enhancements](/release-notes-history) to the framework that includes our [compelling new HTML Story](https://razor.netcore.io) followed shortly after by our [new API Design](/api-design) which promotes an even more flexible and enjoyable server and client apis that we we're happy to see was [well received by the Hacker Community](http://news.ycombinator.com/item?id=4564416).

### Our most important milestone yet!

During this time we quietly surpassed another important milestone for the project where we've now amassed contributions from more than **100+ different contributors** to the [ServiceStack projects](https://github.com/ServiceStack). The total at this time stands over **300** putting ServiceStack in rarified air as one of the top active and contributed to Open Source .NET projects! 

### Helping .NET Open Source 

Many of our contributors were new to GitHub and OSS in general so we're ecstatic we've been able to help expand the .NET Open Source community and we'd like to pay special thanks here as without our contributors we'd be more ServiceStick than ServiceStack :)

### Standout contributions

There have been too many valuable contributions, enhancements and fixes to list them all here, but we wanted to say special thanks to some of the highlights we've received over the years:

  - [Steffen Müller](https://github.com/arxisos) - Core Team member leading the development of the async branch, internal dev and our documentation efforts
  - [Sergey Bogdanov](https://github.com/desunit) - Core Team member leading our Windows / Mono CI release builds, packaging, deployments + code maintenance efforts
  - [Thomas Grassauer](https://github.com/brainless83) - OrmLite Core member: MySql owner, Memcached Cache Provider
  - [Angel Colmenares](https://github.com/angelcolmenares) - OrmLite Core member: Firebird owner, Expression Visitor Support in OrmLite
  - [Tomasz Kubacki](https://github.com/tomaszkubacki)   - OrmLite Core member: PostgreSQL owner
  - [Guru Kathiresan](https://github.com/gkathire)  - OrmLite Core member: Oracle owner and T4 POCO code-generator from existing DB schema for OrmLite
  - [Joachim Rosskopf](https://github.com/jrosskopf) - ServiceStack's Virtual File System, Glob search support
  - [Ivan Korneliuk](https://github.com/vansha) - Inspiration for the new API and implementation of auto-generation of REST-ful routes
  - [Jon Canning](https://github.com/JonCanning) - File Upload support, Android support and Integration Template Test project
  - [Dan Barua](https://github.com/danbarua) - Auto-register of conventional REST-ful routes, Redis Hash APIs, redis client password management
  - [Assaf Raman](https://github.com/assaframan) - MongoDB Auth Provider, managed response pipeline
  - [Iain Ballard](https://github.com/i-e-b) - Dynamic Proxy, IDictionary support to text serializers
  - [Andrew](https://github.com/awr) - Polymorphic types, Dictionary object, Custom Serialization and hooks to text serializers
  - [Ethan Brown](https://github.com/Iristyle) - ServiceStack's Logging NuGet packaging and deployments  
  - [Daniel Wertheim](https://github.com/danielwertheim) - Date handling and support for anonymous types in text serializers
  - [Matt Johnson](https://github.com/mj1856) - Maintaining Silverlight 4 & 5 support, Date Handling in text serializers
  - [Derek Beattie](https://github.com/dbeattie71) - Maintaining Silverlight 4 & 5 support
  - [Bo Kingo Damgaard](https://github.com/bokmadsen) - Support for Digest Authentication
  - [Daniel Crenna](https://github.com/danielcrenna) - Dynamic Expando Json API, JSON property convention support in text serializers
  - [Brad Culberson](https://github.com/bculberson) - Redis connection pool and internal byte buffer management enhancements
  - [Nitin Kumar](https://github.com/kumarnitin) - Support for consistent hashing in Redis
  - [Steve Dunn](https://github.com/SteveDunn) - Support for XBox
  - [Kvervo](https://github.com/kvervo) - Windows Phone support
  - [Joshua Lewis](https://github.com/joshilewis) - NHibernate Auth Provider
  - [Manual Nelson](https://github.com/manuelnelson) - Azure Cache Provider
  - [Louis Haußknecht](https://github.com/lhaussknecht) - Bit operations in redis
  - [Paul Duran](https://github.com/paulduran) - Blocking Pops on multiple lists in Redis
  - [Pieter Van Parys](https://github.com/pietervp) - Multi dimensional array support in text serializers
  - [Shawn Neal](https://github.com/sneal) - Embedding of external resources
  - [Damian Hickey](https://github.com/damianh) - VS.NET 2012 and OWIN support

They've been so many contributions that many of the features listed above are still yet to be documented - something we hope to rectify soon. No doubt there are many more valuable contributions we've missed, but so we don't forget, we're maintaining a live list of contributors on the [GitHub Project's Home Page](https://github.com/ServiceStack/ServiceStack#contributors).

## Why Contributors are important

Maintaining a healthy contributor base is vital for the project as it provides us with a constant instant feedback loop telling us what the most popular use-cases are and what real-world features are important. It's imperative when developing a framework that features are driven and shaped by real-world use-cases as every added feature has a complexity cost (both in implementation and understanding) so we've found it best to optimize and provide elegant out-of-the-box solutions for common real-world problems first whilst also providing access to the underlying raw and un-restrictive API so our users are never prohibited in achieving their goals.

## Starting from ideal C# and projecting out

A healthy contributor base is especially important for ServiceStack as our [Message-based Design](/advantages-of-message-based-web-services) lets you implement your service with minimal C# that's unaffected by endpoint concerns. At this level where we **start from ideal C# and project out** your service is in it's most re-usable form, and it's up to our active users and contributor base to determine which contexts are the most important to add support for first to host your services logic in.

The feedback we've received has led us to implement the most popular use-cases, increasing the re-usability and accessibility of your services - where it's now possible to host the **same existing implementation on the number of different Host configurations**, endpoints and formats below:

### Hosts

  - ASP.NET (.NET / Mono)
  - HttpListener / Console App / Windows Service / Linux Daemon (.NET / Mono)
  - [MQ Host](/redis-mq)

### Web Services

  - [HTML (MVC Razor, Markdown Razor, Markdown, HtmlReport)](https://razor.netcore.io/)
  - JSON (+ JSONP)
  - XML
  - [CSV](/csv-format)
  - [JSV](/jsv-format)
  - [SOAP 1.1/1.2](/soap-support)
  - [ProtoBuf](/protobuf-format)
  - [MsgPack](/messagepack-format)

### Message Queue Services

  - [Background MQ Service](/background-mq)
  - [Rabbit MQ Server](/rabbit-mq)
  - [Redis MQ Server](/redis-mq)
  - [Amazon SQS MQ Server](/amazon-sqs-mq)
  - [Azure Service Bus MQ](/azure-service-bus-mq)

There are more useful endpoints and hosts in the pipeline: expanded MQ options, integration with non-.NET platforms are key areas where ServiceStack can add a lot of value and as it's the most cost-effective deployment option to deploy .NET services we're also looking to further simplify and provide more automation and git-deployment options of ServiceStack services in Linux Cloud hosting environments. 

## Where new contributors can add the most value

We're always looking for new Contributors and there's still a plenty of room to fill: more tutorials, posts and example projects to add to the [Community Resources](/community-resources) are always welcomed, as well as expanding the documentation with real-world tips and solutions to common use-cases. 

### Possible Development enhancements

Code-wise more Formats/Endpoints, MQ Hosts, [Caching](/caching) and [Authentication Providers](/auth/authentication-and-authorization) will provide instant utility to all our users, expanding the supported environments and configurations where ServiceStack services can be hosted in.
