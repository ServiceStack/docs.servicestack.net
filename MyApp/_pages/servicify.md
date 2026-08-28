---
title: Instantly Servicify existing Systems
---

Most legacy systems don't need a rewrite so much as a **contract**. ServiceStack's
[AutoGen](/autoquery/autogen) reads an existing database's schema at startup and generates a complete,
typed API over it — Request DTOs, data models, implementations and human-friendly pluralized routes —
without migrating a single row.

From there the whole framework applies: [instant UIs](/api-explorer), [typed clients in 15 languages](/add-servicestack-reference),
[gRPC](/grpc/) and MQ endpoints, declarative validation, authorization and audit history.

<div class="not-prose my-8 grid gap-3 sm:grid-cols-3">
  <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
    <div class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Step 1</div>
    <div class="mt-1.5 font-semibold text-slate-900 dark:text-white">Register your database</div>
  </div>
  <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
    <div class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Step 2</div>
    <div class="mt-1.5 font-semibold text-slate-900 dark:text-white">Enable <code class="text-[.95em]">GenerateCrudServices</code></div>
  </div>
  <div class="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
    <div class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Step 3</div>
    <div class="mt-1.5 font-semibold text-slate-900 dark:text-white">You have a typed API</div>
  </div>
</div>

<div class="not-prose">
<servicify-videos></servicify-videos>
</div>

## How it works

<div class="not-prose">
<servicify-steps></servicify-steps>
</div>

Enabling it is a single plugin option — AutoGen inspects the registered connection and registers
AutoQuery and CRUD Services for each table it finds:

```csharp
services.AddPlugin(new AutoQueryFeature {
    MaxLimit = 1000,
    GenerateCrudServices = new GenerateCrudServices {
        DbFactory = ormLite.DbFactory,
    }
});
```

<div class="not-prose">
<servicify-deck></servicify-deck>
</div>

::: info
Prefer to review the models before they become APIs? [okai TypeScript Data Models](/autoquery/okai-db) takes the
other route — export the DB schema to editable TypeScript models first, then generate the APIs, C# data models and
migrations from those.
:::

## Your conventions, not just ours

AutoGen's code generation is programmatically customizable. Generated types can be augmented with declarative
attributes so your App's existing conventions — authorization, validation rules, tags, descriptions, formatting —
are baked into the generated Services rather than bolted on afterwards.

When the conventions are right, the generated classes can be **ejected** into code-first C# and developed as
normal. AutoGen is a way in, not something you're stuck with.

<div class="not-prose">
<servicify-unlocks></servicify-unlocks>
</div>

## Reachable from everywhere

Because AutoGen produces ordinary ServiceStack Services, they inherit every endpoint and client the framework
supports. That makes it the fastest route to putting **gRPC** in front of an existing system — which in turn opens it
to [every language in gRPC's protoc universe](https://grpc.io/docs/languages/).

<div class="not-prose my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <a href="/grpc/" class="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
    <img src="/img/pages/svg/grpc-icon-color.svg" alt="" class="h-8 w-8 shrink-0 object-contain">
    <span>
      <span class="block font-semibold text-slate-900 dark:text-white">gRPC</span>
      <span class="block text-xs text-slate-500 dark:text-slate-400">High-performance endpoints</span>
    </span>
  </a>
  <a href="/grpc/dart" class="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
    <img src="/img/pages/svg/dart-logo.svg" alt="" class="h-8 w-8 shrink-0 object-contain">
    <span>
      <span class="block font-semibold text-slate-900 dark:text-white">Dart</span>
      <span class="block text-xs text-slate-500 dark:text-slate-400">Scriptable protoc clients</span>
    </span>
  </a>
  <a href="/grpc/flutter" class="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
    <img src="/img/pages/svg/flutter-logo.svg" alt="" class="h-8 w-8 shrink-0 object-contain">
    <span>
      <span class="block font-semibold text-slate-900 dark:text-white">Flutter</span>
      <span class="block text-xs text-slate-500 dark:text-slate-400">Mobile, web &amp; desktop</span>
    </span>
  </a>
  <a href="/typescript-add-servicestack-reference" class="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
    <img src="/img/pages/svg/react-native-logo.svg" alt="" class="h-8 w-8 shrink-0 object-contain">
    <span>
      <span class="block font-semibold text-slate-900 dark:text-white">React Native</span>
      <span class="block text-xs text-slate-500 dark:text-slate-400">Typed TypeScript DTOs</span>
    </span>
  </a>
</div>

The [Smart, Generic C# / F# / VB.NET Service Clients](/grpc/generic) still give the best UX for consuming gRPC
Services, but the [protoc-generated Dart client](/grpc/dart) is a close second — a high-level language with
native-class performance and script-like productivity, which makes it an ideal way to explore a freshly
servicified system. And anything Dart reaches, [Flutter](https://flutter.dev) reaches too.

## Modernizing without rewriting

This is what makes AutoGen useful beyond greenfield work: it lets you modernize parts of a legacy system
incrementally, at low cost. Once a database is behind typed contracts you can enable
[Multitenancy](/multitenancy), [Optimistic Concurrency](/ormlite/optimistic-concurrency),
[declarative validation](/declarative-validation) and Executable Audit History without changing the schema.

Business users can maintain validation rules in the RDBMS and manage them through the
[Admin UI](/admin-ui-validation), where they're applied instantly at runtime and surfaced through
ServiceStack's [client UI auto-binding options](/world-validation). [Locode](/locode/) then gives stakeholders an
instant UI to search their data, export queries to Excel, or work through a custom UI with fine-grained
control over which tables and operations each user can reach.

## Next steps

<div class="not-prose my-8 grid gap-4 md:grid-cols-3">
  <a href="/autoquery/autogen" class="group rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6 transition hover:-translate-y-0.5 hover:shadow-md dark:border-indigo-800 dark:bg-indigo-950/40">
    <div class="font-bold text-slate-900 dark:text-white">AutoGen docs</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">Configure, customize and export the generated APIs and data models.</p>
    <div class="mt-3 text-sm font-semibold text-indigo-600 group-hover:translate-x-1 dark:text-indigo-400">Read the guide →</div>
  </a>
  <a href="/autoquery/rdbms" class="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
    <div class="font-bold text-slate-900 dark:text-white">AutoQuery RDBMS</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">Understand the queryable APIs AutoGen is generating for each table.</p>
    <div class="mt-3 text-sm font-semibold text-indigo-600 group-hover:translate-x-1 dark:text-indigo-400">Learn AutoQuery →</div>
  </a>
  <a href="/locode/database-first" class="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
    <div class="font-bold text-slate-900 dark:text-white">Locode database-first</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">Turn the generated APIs into a branded CRUD App for your stakeholders.</p>
    <div class="mt-3 text-sm font-semibold text-indigo-600 group-hover:translate-x-1 dark:text-indigo-400">Build the UI →</div>
  </a>
</div>
