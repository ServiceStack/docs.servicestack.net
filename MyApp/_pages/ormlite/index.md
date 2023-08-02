---
title: Fast, Simple, Typed ORM for .NET
---

OrmLite's goal is to provide a convenient, DRY, config-free, RDBMS-agnostic typed wrapper that retains
a high affinity with SQL, exposing intuitive APIs that generate predictable SQL and maps cleanly to
 disconnected and Data Transfer Object (DTO) friendly, Plain Old C# Objects (POCOs). This approach makes easier to reason-about your data access making
it obvious what SQL is getting executed at what time, whilst mitigating unexpected behavior,
implicit N+1 queries and leaky data access prevalent in Heavy Object Relational Mappers (ORMs).

<div class="py-8 max-w-7xl mx-auto">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="vUbpwjfEYzg" style="background-image: url('https://img.youtube.com/vi/vUbpwjfEYzg/maxresdefault.jpg')"></lite-youtube>
</div>

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

## Getting Started

Get Started with OrmLite by installing your preferred RDBMS provider and configuring it with your .NET Application:

<div class="not-prose my-16 flex items-center justify-center gap-x-6">
    <a href="/ormlite/installation" class="rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Get OrmLite
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
