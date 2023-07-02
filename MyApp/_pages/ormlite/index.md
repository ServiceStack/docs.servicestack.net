---
title: Fast, Simple, Typed ORM for .NET
---

OrmLite's goal is to provide a convenient, DRY, config-free, RDBMS-agnostic typed wrapper that retains
a high affinity with SQL, exposing intuitive APIs that generate predictable SQL and maps cleanly to
 disconnected and Data Transfer Object (DTO) friendly, Plain Old C# Objects (POCOs). This approach makes easier to reason-about your data access making
it obvious what SQL is getting executed at what time, whilst mitigating unexpected behavior,
implicit N+1 queries and leaky data access prevalent in Heavy Object Relational Mappers (ORMs).

OrmLite was designed with a focus on the core objectives:

* Provide a set of light-weight C# extension methods around .NET's impl-agnostic `System.Data.*` interfaces
* Map a POCO class 1:1 to an RDBMS table, cleanly by conventions, without any attributes required.
* Create/Drop DB Table schemas using nothing but POCO class definitions
* Simplicity - typed, wrist friendly API for common data access patterns.
* High performance - with support for indexes, text blobs, etc.
    * Amongst the [fastest Micro ORMs](https://servicestackv3.github.io/Mono/src/Mono/benchmarks/default.htm) for .NET.
* Expressive power and flexibility - with access to `IDbCommand` and raw SQL
* Cross-platform - supports multiple dbs (currently: Sql Server, Sqlite, MySql, PostgreSQL, Firebird) running on both .NET Framework and .NET Core platforms.

In OrmLite: **1 Class = 1 Table**. There should be no surprising or hidden behaviour, the Typed API
that produces the Query
[doesn't impact how results get intuitively mapped](http://stackoverflow.com/a/37443162/85785)
to the returned POCO's which could be different to the POCO used to create the query, e.g. containing only
a subset of the fields you want populated.

Any non-scalar properties (i.e. complex types) are text blobbed by default in a schema-less text field
using any of the [available pluggable text serializers](introspection#pluggable-complex-type-serializers).
Support for [POCO-friendly references](reference-support) is also available to provide
a convenient API to persist related models. Effectively this allows you to create a table from any
POCO type, and it should persist as expected in a DB Table with columns for each of the classes 1st
level public properties.

## Community Resources

- [OrmLite and Redis: New alternatives for handling db communication](http://www.abtosoftware.com/blog/servicestack-ormlite-and-redis-new-alternatives-for-handling-db-communication) by [@abtosoftware](https://twitter.com/abtosoftware)
- [Object Serialization as Step Towards Normalization](http://www.unpluggeddevelopment.com/post/85225892120/object-serialization-as-step-towards-normalization) by [@ 82unpluggd](https://twitter.com/82unpluggd)
- [Code Generation using ServiceStack.OrmLite and T4 Text templates](http://jokecamp.wordpress.com/2013/09/07/code-generation-using-servicestack-ormlite-and-t4-text-templates/) by [@jokecamp](https://twitter.com/jokecamp)
- [Simple ServiceStack OrmLite Example](http://www.curlette.com/?p=1068) by [@robrtc](https://twitter.com/robrtc)
- [OrmLite Blobbing done with NHibernate and Serialized JSON](http://www.philliphaydon.com/2012/03/19/ormlite-blobbing-done-with-nhibernate-and-serialized-json/) by [@philliphaydon](https://twitter.com/philliphaydon)
- [Creating An ASP.NET MVC Blog With ServiceStack.OrmLite](http://www.eggheadcafe.com/tutorials/asp-net/285cbe96-9922-406a-b193-3a0b40e31c40/creating-an-aspnet-mvc-blog-with-servicestackormlite.aspx) by [@peterbromberg](https://twitter.com/peterbromberg)

If you know of an article/blog post about ServiceStack.OrmLite that is missing, let us know over on the ServiceStack GitHub Discussions, and we will be sure to include it here.

<div class="my-8 pb-8 flex justify-center">
    <a href="https://github.com/ServiceStack/Discuss/discussions/categories/show-and-tell" class="hover:text-black inline-flex items-center px-6 py-3 border border-gray-300 shadow text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:no-underline">
        <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57c0-.285-.015-1.23-.015-2.235c-3.015.555-3.795-.735-4.035-1.41c-.135-.345-.72-1.41-1.23-1.695c-.42-.225-1.02-.78-.015-.795c.945-.015 1.62.87 1.845 1.23c1.08 1.815 2.805 1.305 3.495.99c.105-.78.42-1.305.765-1.605c-2.67-.3-5.46-1.335-5.46-5.925c0-1.305.465-2.385 1.23-3.225c-.12-.3-.54-1.53.12-3.18c0 0 1.005-.315 3.3 1.23c.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23c.66 1.65.24 2.88.12 3.18c.765.84 1.23 1.905 1.23 3.225c0 4.605-2.805 5.625-5.475 5.925c.435.375.81 1.095.81 2.22c0 1.605-.015 2.895-.015 3.3c0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" fill="currentColor"></path></g>
        </svg>
        <span class="mx-2">ServiceStack/Discuss</span>
    </a>
</div>

## Other notable Micro ORMs for .NET
Many performance problems can be mitigated and a lot of use-cases can be simplified without the use of a heavyweight ORM, and their config, mappings and infrastructure. We can recommend the following list, each with their own unique special blend of features.

* **[Dapper](https://github.com/DapperLib/Dapper)** - by [@samsaffron](http://twitter.com/samsaffron) and [@marcgravell](http://twitter.com/marcgravell)
    - Current performance king, supports both POCO and dynamic access, fits in a single class. Used to solve [StackOverflow's Perf issues](http://samsaffron.com/archive/2011/03/30/How+I+learned+to+stop+worrying+and+write+my+own+ORM)
* **[PetaPoco](http://www.toptensoftware.com/petapoco/)** - by [@toptensoftware](http://twitter.com/toptensoftware)
    - Fast, supports dynamics, expandos and typed POCOs, fits in a single class. Includes optional T4 templates for POCO table generation
* **[Massive](https://github.com/robconery/massive)** - by [@robconery](http://twitter.com/robconery)
    - Fast, supports dynamics and expandos, smart use of optional params for a wrist-friendly api, fits in a single class. Multi RDBMS
* **[Simple.Data](https://github.com/markrendle/Simple.Data)** - by [@markrendle](http://twitter.com/markrendle)
    - A little slower than above ORMS, most wrist-friendly courtesy of a dynamic API, multiple RDBMS support inc. Mongo DB
