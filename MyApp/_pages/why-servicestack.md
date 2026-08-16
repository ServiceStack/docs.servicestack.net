---
slug: why-servicestack
title: Why ServiceStack
---

<div class="hide-title"></div>

<div class="not-prose">
<why-hero></why-hero>
</div>

ServiceStack is a batteries-included framework for building **typed, message-based APIs** in .NET.

Most frameworks give you a way to return JSON from a method. ServiceStack starts one level up: you describe *what the message is*, and everything downstream - the routes, the docs, the validation, the admin UIs, the native clients, the AI tool definitions - is generated from that single description.

The result is a framework where **adding a capability usually means adding an attribute**, not adding a project.

## One contract, everything else generated

Here is a complete, working, queryable, secured API:

```csharp
[ValidateIsAuthenticated]
[Description("Find bookings matching the specified criteria")]
public class QueryBookings : QueryDb<Booking>
{
    public int[] Ids { get; set; }
}
```

That single Request DTO gives you a REST API with filtering, paging and sorting, an executable API Explorer UI, a portable JSON Schema, an entry in your OpenAPI spec, a Locode CRUD App, an AI-callable tool and native typed clients in **15 languages** - with no Service implementation, no controller, no DTO mapping and no SDK project.

<div class="not-prose my-8">
<img src="/img/pages/svg/servicify.svg" width="100%" alt="One Service, many consumers">
</div>

<div class="not-prose">
<core-pillars></core-pillars>
</div>

## Write the contract. Skip the rest.

The clearest way to see the value is to compare what you write against what you'd otherwise have to write - and keep writing, for every platform, forever.

<div class="not-prose">
<one-dto-compare></one-dto-compare>
</div>

## Rich UIs your APIs get for free

Every ServiceStack App ships with capable, authorized management UIs that are **generated from your APIs at runtime**. There is nothing to install, no separate admin project to maintain, and no drift between your API and the tools used to operate it.

<div class="not-prose">
<built-in-uis></built-in-uis>
</div>

::: info
All Admin UIs respect your App's existing authentication and authorization - users only see the screens and actions their roles allow.
:::

## Typed clients in 15 languages

[Add ServiceStack Reference](/add-servicestack-reference) reads the metadata your App already publishes and generates a **single native source file** of DTOs for the target language, paired with an idiomatic Service Client that understands the contract: response types, routes, HTTP methods, authentication, structured errors, validation failures and AutoQuery conventions.

<div class="not-prose my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <div class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">.NET</div>
    <div class="mt-2 font-semibold text-slate-900 dark:text-white">C# · F# · VB.NET</div>
  </div>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <div class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Web &amp; Scripting</div>
    <div class="mt-2 font-semibold text-slate-900 dark:text-white">TypeScript · JavaScript · Python · PHP · Ruby</div>
  </div>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <div class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Mobile</div>
    <div class="mt-2 font-semibold text-slate-900 dark:text-white">Swift · Java · Kotlin · Dart</div>
  </div>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
    <div class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Cloud &amp; Systems</div>
    <div class="mt-2 font-semibold text-slate-900 dark:text-white">Go · Rust · Zig</div>
  </div>
</div>

Two commands in any language - add the client, then generate the DTOs:

<div class="not-prose my-8">
<dto-quick-start selected="typescript" url="https://vue-spa.web-templates.io"></dto-quick-start>
</div>

Re-run the same command whenever your API changes. New fields appear in the generated DTOs; removed or renamed members become **compile errors in the consuming App** instead of runtime surprises in production.

::: tip
This is the opposite of the SDK treadmill. There's no per-platform SDK repo to version, publish and document - the contract *is* the SDK.
:::

## AI-native, without an AI backend

The metadata that generates typed clients also describes your APIs well enough for a model to use them. So instead of building a parallel "AI API" with its own auth, its own schemas and its own risk profile, ServiceStack lets AI call the APIs you already have - **as the signed-in user, through the same pipeline as every other client**.

<div class="not-prose">
<ai-journey></ai-journey>
</div>

Because approval forms are generated from the same schema that powers API Explorer, users can **inspect and correct** what a model is about to submit before anything is written. And since it's your normal request pipeline, your authorization, validation, filters and business logic all still apply - a model cannot do anything the current user couldn't do themselves.

<div class="not-prose my-8 grid gap-4 sm:grid-cols-3">
  <a href="/chat/overview" class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
    <div class="font-bold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">AI Chat</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">A complete multi-provider AI App at <code>/chat</code> using your App's existing users, database and security boundary.</p>
  </a>
  <a href="/chat/mcp" class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
    <div class="font-bold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">MCP Server</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">Expose the same approved APIs to external AI Assistants over the Model Context Protocol.</p>
  </a>
  <a href="/chat/pdf-studio" class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
    <div class="font-bold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">PDF Studio</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">Design documents with AI, publish immutable revisions, then render production PDFs with no LLM at runtime.</p>
  </a>
</div>

## Host it your way

ServiceStack Services are decoupled from HTTP, from any UI technology and from any single host. The same implementation can serve a website, a mobile App, a queue consumer and a gRPC endpoint.

<div class="not-prose">
<deploy-anywhere></deploy-anywhere>
</div>

## Why message-based APIs

ServiceStack's design follows [Martin Fowler's Data Transfer Object pattern](https://martinfowler.com/eaaCatalog/dataTransferObject.html): when a call crosses a process boundary, send *one well-defined message* rather than many fine-grained calls.

This isn't stylistic. A remote call is the most expensive thing in general-purpose computing, and an interface that hides that cost behind method signatures encourages exactly the wrong shape of system.

<div class="not-prose my-8 grid gap-4 md:grid-cols-2">
  <div class="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
    <div class="text-xs font-bold uppercase tracking-[.18em] text-slate-500 dark:text-slate-400">RPC-style</div>
    <ul class="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
      <li>A new method for every way a client wants to ask</li>
      <li>Adding a parameter is a breaking change</li>
      <li>N chatty round-trips where one would do</li>
      <li>Can't be cached, queued, batched or deferred</li>
      <li>Client-shaped APIs that outlive the client</li>
    </ul>
  </div>
  <div class="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-6 dark:border-indigo-800 dark:bg-indigo-950/40">
    <div class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Message-based</div>
    <ul class="mt-3 space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
      <li>One coarse-grained message serves many use cases</li>
      <li>Adding a field is additive and backwards-compatible</li>
      <li>Any combination fulfilled in a single call</li>
      <li>Cacheable, queueable, batchable, proxyable</li>
      <li>Service-shaped APIs that outlive their consumers</li>
    </ul>
  </div>
</div>

Because the message is a plain POCO with no framework artifacts in it, the *same type* is your server contract, your client contract, your validation schema, your documentation, your UI definition and your AI tool definition. That's the entire trick - and it's why enabling a new capability so often costs one attribute instead of one project.

Read the long-form argument in [Advantages of message-based Web Services](/advantages-of-message-based-web-services) and [Why remote services use DTOs](/why-remote-services-use-dtos).

## Everything in the box

<div class="not-prose">
<feature-explorer></feature-explorer>
</div>

## What this means in practice

<div class="not-prose my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
    <div class="font-bold text-slate-900 dark:text-white">Less code to maintain</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">Admin screens, SDKs, docs and API clients are generated from the contract instead of hand-written and left to drift.</p>
  </div>
  <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
    <div class="font-bold text-slate-900 dark:text-white">Fewer moving parts</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">Auth, jobs, caching, messaging, logging and analytics ship together and are designed to work together.</p>
  </div>
  <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
    <div class="font-bold text-slate-900 dark:text-white">Genuinely testable</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">Services are dependency-free classes and typed clients make integration tests read like unit tests.</p>
  </div>
  <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
    <div class="font-bold text-slate-900 dark:text-white">Fast by default</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">Built on high-performance serializers and data access, on the fastest APIs each .NET runtime offers.</p>
  </div>
  <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
    <div class="font-bold text-slate-900 dark:text-white">Investment preserved</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">Libraries are <a href="/release-notes-history" class="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">continuously improved</a> across 20+ years - not abandoned and replaced.</p>
  </div>
  <div class="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
    <div class="font-bold text-slate-900 dark:text-white">Commercially supported</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">Actively developed with paid support, and <a href="https://servicestack.net/free" class="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">free for individuals &amp; OSS</a>.</p>
  </div>
</div>

## Start in 60 seconds

<div class="not-prose my-8 grid gap-4 md:grid-cols-3">
  <a href="https://servicestack.net/start" class="group rounded-2xl border border-indigo-200 bg-indigo-50/60 p-6 transition hover:-translate-y-0.5 hover:shadow-md dark:border-indigo-800 dark:bg-indigo-950/40">
    <div class="text-2xl">🚀</div>
    <div class="mt-3 font-bold text-slate-900 dark:text-white">Create a project</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">Pick a template and download a ready-to-run App - Blazor, Vue, React, MVC, API-only and more.</p>
    <div class="mt-3 text-sm font-semibold text-indigo-600 group-hover:translate-x-1 dark:text-indigo-400">servicestack.net/start →</div>
  </a>
  <a href="/create-your-first-webservice" class="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
    <div class="text-2xl">📘</div>
    <div class="mt-3 font-bold text-slate-900 dark:text-white">Build your first API</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">A guided walkthrough from empty project to a working, documented, typed API.</p>
    <div class="mt-3 text-sm font-semibold text-indigo-600 group-hover:translate-x-1 dark:text-indigo-400">Get started →</div>
  </a>
  <a href="/releases/v10_01" class="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
    <div class="text-2xl">✨</div>
    <div class="mt-3 font-bold text-slate-900 dark:text-white">See what's new</div>
    <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">15 typed languages, AI Chat, API Tools, API Schemas and PDF Studio in the latest release.</p>
    <div class="mt-3 text-sm font-semibold text-indigo-600 group-hover:translate-x-1 dark:text-indigo-400">v10.1 release notes →</div>
  </a>
</div>

<div class="not-prose mx-auto my-10 w-full max-w-3xl overflow-hidden rounded-xl border border-slate-200 shadow-2xl dark:border-slate-700">
  <lite-youtube class="block w-full aspect-video" videoid="Vae0ALalIP0"
                style="max-width: none; background-image: url('https://img.youtube.com/vi/Vae0ALalIP0/maxresdefault.jpg')">
  </lite-youtube>
</div>

::: info
Questions? Join the community on [Discord](https://servicestack.net/discord), ask on [GitHub Discussions](https://servicestack.net/ask) or browse the [Live Demos](https://github.com/NetCoreApps/LiveDemos).
:::
