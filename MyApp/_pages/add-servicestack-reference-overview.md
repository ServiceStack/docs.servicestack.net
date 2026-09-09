---
slug: add-servicestack-reference 
title: Add ServiceStack Reference
---

**Add ServiceStack Reference** gives every consumer of your API an end-to-end typed client, generated from a single URL.

Your C# Request and Response DTOs are the only contract that exists. From them ServiceStack can emit native DTOs for
**15 languages**, which drop into a client project alongside that language's generic Service Client to give it a fully
typed API - with no schema to maintain, no build-time code generation and no DTO assembly to distribute.

<language-grid>
</language-grid>

## How it works

<reference-flow>
</reference-flow>

Behind the scenes ServiceStack captures the metadata on your Service DTOs - routes, the `IReturn<T>` response type,
sub-classes, attributes and textual descriptions - into a serializable model published at `/types/metadata`, which each
language generator renders as idiomatic source code. Adding a reference is a plain HTTP request to `/types/<lang>`; the
options used are written into a comment header at the top of the generated file so a later update reproduces them.

Native Types is enabled by default. It can be removed with:

```csharp
Plugins.RemoveAll(x => x is NativeTypesFeature);
```

## Adding and updating a reference

<sync-options>
</sync-options>

### Keeping your own clients in sync automatically

If the client lives in the same solution as the API, you don't need to run anything. Registering the built-in `dtos`
[Startup Task](/startup-tasks) regenerates the App's own DTO references every time it restarts in development:

```csharp
StartupTasks.Register("dtos", () =>
    appHost.GetPlugin<NativeTypesFeature>().GenerateDtos());
```

Generation happens in-process without HTTP or Node.js, preserves each reference's existing options and doesn't rewrite
unchanged files - so a contract change shows up in your client build immediately, without triggering a needless frontend
rebuild. All project templates with TypeScript `.ts` or JavaScript `.mjs` client DTOs ship with it configured. See
[Startup Tasks](/startup-tasks) for DTO discovery, `BaseUrl` matching and generation options.

### From the command-line

::include npx-get-dtos.md::

The [x dotnet tool](/dotnet-tool) provides the same commands for .NET developers who already have the SDK installed,
where `x <lang>` is interchangeable with `npx get-dtos <lang>`:

:::sh
dotnet tool install --global x 
:::

Both tools follow the same three usages - **add** a reference from a URL, **update** one by filename, or update
**all** references in the current directory (recursively) by passing only the language:

:::sh
npx get-dtos ts https://blazor-vue.web-templates.io
:::

```
Saved to: dtos.ts
```

Pass a name as the 2nd argument to save it under a different file, e.g. when a project consumes more than one API:

:::sh
npx get-dtos ts https://blazor-vue.web-templates.io Bookings
:::

```
Saved to: Bookings.dtos.ts
```

Then later update every TypeScript reference in the directory with:

:::sh
npx get-dtos ts
:::

```
Updated: Bookings.dtos.ts
Updated: dtos.ts
```

### From your IDE

Add ServiceStack Reference is available as a plugin for JetBrains Rider, IntelliJ IDEA, Android Studio, PyCharm,
WebStorm, PhpStorm, RubyMine and Eclipse, letting API consumers add and update a typed reference from the IDE's context
menu with just a URL:

[![](./img/pages/servicestack-reference/ide-plugins-splash.png)](https://www.youtube.com/watch?v=JKsgrstNnYY)

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="JKsgrstNnYY" style="background-image: url('https://img.youtube.com/vi/JKsgrstNnYY/maxresdefault.jpg')"></lite-youtube>

## What you get with the DTOs

<client-features>
</client-features>

The generated DTOs are just data - they're not coupled to an endpoint or format, so the same file works with every
[built-in Service Client](/clients-overview) in that language. In .NET that includes the JSON, JSV, MessagePack and
ProtoBuf clients, all sharing the same interface so swapping between them is a one-line change.

Because only DTOs are generated, the client library itself is reusable: DTOs generated against a hosted instance work
against any deployment of that API, and the same client instance can call any other ServiceStack API.

### Multiple file uploads

Every language's client supports uploading files alongside a typed Request DTO, which is what makes APIs like
[AI Server](/ai-server/)'s `SpeechToText` callable from anywhere:

```csharp
using var fsAudio = File.OpenRead("audio.wav");
var response = client.PostFileWithRequest(new SpeechToText(),
    new UploadFile("audio.wav", fsAudio, "audio"));
```

A `PostFilesWithRequest` variant accepts multiple files in a single request. See each language's reference page for its
idiomatic equivalent.

## Customizing what's generated

Consumers customize their own output by uncommenting options in the header of their generated file - each language
exposes the options that make sense for it. See the language pages for the full list:

* [C# Options](/csharp-add-servicestack-reference#change-default-server-configuration)
* [TypeScript Options](./typescript-add-servicestack-reference.md#customize-dto-type-generation)
* [JavaScript Options](./javascript-add-servicestack-reference.md#customize-dto-type-generation)
* [Python Options](./python-add-servicestack-reference.md#customize-dto-type-generation)
* [Swift Options](/swift-add-servicestack-reference#swift-configuration)
* [Java Options](/java-add-servicestack-reference#java-configuration)
* [Kotlin Options](/kotlin-add-servicestack-reference#kotlin-configuration)
* [Dart Options](/dart-add-servicestack-reference#change-default-server-configuration)
* [F# Options](/fsharp-add-servicestack-reference#change-default-server-configuration)
* [VB.NET Options](/vbnet-add-servicestack-reference)

<server-controls>
</server-controls>

Restricting a type is the important one - an API annotated with `[Restrict(InternalOnly = true)]` is generated for a
reference added from your internal network but is invisible to an external consumer, so internal APIs can't leak into a
public client. `Metadata.ForceInclude` goes the other way, overriding the default rules for types you do want emitted:

```csharp
Metadata.ForceInclude = new() {
    typeof(AdminQueryUsers),
    typeof(AdminGetUser),
    typeof(AdminCreateUser),
};
```

## Why code-first

Add ServiceStack Reference exists because a message-based API doesn't need a client generated for it - only its DTOs do.
Everything else is a reusable generic client, which is what keeps the generated output small enough to read and review.

C# is a good language to define an API contract in: POCO data models are about as terse as a DSL, but come with real IDE
support and can carry richer metadata than a schema - attributes, interfaces, doc comments and response types:

```csharp
[Route("/technology/{Slug}")]
public class GetTechnology : IReturn<GetTechnologyResponse>
{
    public string Slug { get; set; }
}
```

Starting from that model rather than an interim schema avoids the impedance mismatch of adapting your types to a spec
and then adapting them back again. In ServiceStack your code-first DTOs are the master authority that every other
feature - [OpenAPI](/openapi), [gRPC](/grpc/), [Locode](/locode/) and Add ServiceStack Reference - is projected
from.

## Language paths

Each generator is served directly, so you can inspect what a client will receive from a browser:

| Path                | Language |
| --                  | -- |
| /types/csharp       | C# |
| /types/typescript   | TypeScript |
| /types/typescript.d | Ambient TypeScript Definitions |
| /types/mjs          | JavaScript (ES Modules) |
| /types/js           | ES3 Common.js |
| /types/python       | Python |
| /types/php          | PHP |
| /types/swift        | Swift |
| /types/java         | Java |
| /types/kotlin       | Kotlin |
| /types/dart         | Dart |
| /types/go           | Go |
| /types/rust         | Rust |
| /types/ruby         | Ruby |
| /types/zig          | Zig |
| /types/fsharp       | F# |
| /types/vbnet        | VB.NET  |
| /types/metadata     | Metadata |

::include add-servicestack-reference-footer.md::
