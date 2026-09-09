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

<design-goals>
</design-goals>

<one-class-one-table>
</one-class-one-table>

Complex properties are blobbed using any of the
[pluggable text serializers](introspection#pluggable-complex-type-serializers), and
[POCO-friendly references](reference-support) provide a convenient API for persisting related models.
OrmLite is amongst the [fastest Micro ORMs](https://servicestackv3.github.io/Mono/src/Mono/benchmarks/default.htm)
for .NET and runs on both .NET Framework and .NET.

<ormlite-doc-map>
</ormlite-doc-map>

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
