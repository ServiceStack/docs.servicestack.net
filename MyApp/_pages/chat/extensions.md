---
title: Extensions
---

Modern AI applications evolve too quickly for a fixed collection of hard-coded screens. New model providers, tools, modalities and workflows arrive continuously, and enterprises need to disable capabilities, replace UI and integrate their own systems without maintaining a fork.

AI Chat solves this with a shared extension architecture spanning the server and the browser. Everything above the hosting layer is an extension, including the core conversation UI.

<screenshot src="/img/pages/chat/modular-overview.webp" title="AI Chat modular settings and extensions"></screenshot>

## Built-in extensions

| Extension | What it adds |
| --- | --- |
| `app` | Threads, history, avatars and the core conversation UI |
| `agents` | [Agent Profiles](/chat/agents) and the Profile Manager |
| `analytics` | [Cost, token and activity reporting](/chat/analytics) for admins |
| `api_tools` | [Discovery and invocation](/chat/api-tools) of the App's own ServiceStack APIs |
| `computer` | Filesystem tools and `run_bash` — **off by default** |
| `core_tools` | Utilities, math and code execution tools |
| `credentials` | Username/password sign-in for the Chat UI |
| `custom` | Your App's own UI + routes, served from `chat/custom/**` |
| `gallery` | Browsable catalog of generated images and audio |
| `gemini` | [Gemini File Search](/chat/gemini) stores for RAG |
| `identity` | Sign-in using the host App's ASP.NET Identity users |
| `katex` | Mathematical typesetting |
| `mcp` | The built-in [MCP Server](/chat/mcp) at `/chat/mcp` |
| `pdf` | [PDF Studio](/chat/pdf-studio) at `/chat/pdf` |
| `projects` | [Per-user workspaces](/chat/projects) and directory boundaries |
| `publish` | Sharing threads, projects and media — **off by default** |
| `skills` | [Skill](/chat/skills) management, search, install and authoring |
| `system_prompts` | The system prompt library |
| `tools` | The shared [Tool Registry](/chat/tools) and tools panel |
| `voice` | [Voice input](/chat/media) and transcription |

## What an extension can contribute

Each extension can register only what it needs:

- ServiceStack routes and APIs, under `/{RoutePrefix}/ext/{name}/`
- Model tools and tool groups
- UI components and pages
- Sidebar and toolbar actions
- Chat request, tool, approval, status, response and error filters
- Import maps and client dependencies
- Per-user files and preferences
- Database tables and background workers
- Startup and shutdown lifecycle hooks

The entire UI is assembled from registered Vue components, so an extension can add a new component or deliberately **replace** an existing building block by registering the same component name.

## Disabling extensions

```csharp
services.AddPlugin(new ChatFeature {
    DisableExtensions = ["computer", "publish", "katex"],
});
```

`DisableExtensions` removes the capability from the server **and** the UI together — a disabled extension registers no routes, no tools and no components.

The same list can be set in `App_Data/chat/llms.json`, which is merged with the programmatic list:

```json
{
  "disable_extensions": ["computer"]
}
```

An extension can also disable itself. `gemini` does so when no Gemini API key is configured, `voice` when neither ffmpeg nor Mistral is available, and `pdf` when the `typst` CLI isn't on `PATH`. `InstalledExtensionNames` reports what actually loaded:

```csharp
var installed = feature.InstalledExtensionNames;   // ["app","agents","tools",...]
```

## Configuring an extension

`ChatFeature` exposes each built-in extension as a typed property, so configuration reads as one object graph:

```csharp
services.AddPlugin(new ChatFeature {
    Tools    = { EnableCodeExecution = true, EnableFilesystemTools = true },
    ApiTools = { IncludeTags = ["CoffeeShop"] },
    Mcp      = { ToolGroups = ["api_tools"] },
    Publish  = { Enabled = true },
});
```

| Property | Extension |
| --- | --- |
| `SystemPrompts` | `system_prompts` |
| `App` | `app` |
| `Agents` | `agents` |
| `Projects` | `projects` |
| `Tools` | `tools` |
| `CoreTools` | `core_tools` |
| `Computer` | `computer` |
| `Gallery` | `gallery` |
| `Skills` | `skills` |
| `Voice` | `voice` |
| `Publish` | `publish` |
| `Gemini` | `gemini` |
| `Katex` | `katex` |
| `Pdf` | `pdf` |
| `Analytics` | `analytics` |
| `ApiTools` | `api_tools` |
| `Mcp` | `mcp` |
| `IdentityUi` | `identity` |
| `Credentials` | `credentials` |
| `Custom` | `custom` |

`AssertExtension<T>()` resolves any of them, including extensions you add yourself:

```csharp
var bookings = feature.AssertExtension<BookingToolsExtension>();
```

## Install order

Extensions install in the order they appear in `ChatFeature.Extensions`. The built-in list ends with `CustomExtension`, so your App's own extension sees everything the built-ins registered — letting it override a tool, replace a UI component or reconfigure a group after the fact.

Adding your own extension appends it before that final `custom` extension:

```csharp
services.AddPlugin(new ChatFeature {
    Extensions = {
        new BookingToolsExtension(),
    },
});
```

To run before a built-in instead, replace the list outright or insert at an index in `Setup`.

## Lifecycle

| Hook | When |
| --- | --- |
| `Install(ctx)` | During plugin registration, after config + providers are created |
| `LoadAsync(ctx, token)` | After all extensions install, run concurrently |
| `ctx.RegisterSetupUserHandler` | First request from each user |
| `ctx.RegisterShutdownHandler` | AppHost disposal |

An `Install` that throws logs the failure and skips that extension rather than failing App startup. Shutdown handlers are independent — one throwing doesn't skip the rest.

## Static assets

An extension with a `chat/ext/{name}/` folder of embedded resources gets its files served automatically at `/{RoutePrefix}/ext/{name}/{path}`, and one containing an `index.mjs` is registered in the `/ext` list so the Chat UI dynamically imports it on load.

Nothing under `chat/custom/**` is ever overwritten by an upstream UI sync, which makes it the place to put your own UI. See [Custom Extensions](/chat/custom-extensions).
