---
title: Extensions
---

Modern AI applications evolve too quickly for a fixed collection of hard-coded screens. New model providers, tools, modalities and workflows arrive continuously, and enterprises need to disable capabilities, replace UI and integrate their own systems without maintaining a fork.

AI Chat solves this with a shared extension architecture spanning the server and the browser. Everything above the hosting layer is an extension, including the core conversation UI.

<screenshot src="/img/pages/chat/modular-overview.webp" title="AI Chat modular settings and extensions"></screenshot>

## Built-in extensions

<extension-catalog>
</extension-catalog>

The shared UI also includes these built-ins:

| Extension | Capability | Setup |
| --- | --- | --- |
| `projects` | [Workspace Explorer](/chat/workspace-explorer), stable project IDs, reorder/archive, managed creation | Per-user App_Data workspaces |
| `git` | [Diffs, commits, stashes, remote actions](/chat/git) | Git on PATH; hosted transport policy by default |
| `jev` | [Decision Studio](/chat/decision-studio) | OpenRouter key for execution |
| `openai_auth` | [ChatGPT subscription sign-in](/chat/chatgpt) | Eligible personal account and plan-usage consent |
| `share_static` | [Static project exports](/chat/publishing#publish-to-a-static-folder) | Enabled by default; no publisher account |
| `share_llmspy` | [Public links and worked recipes](/chat/publishing) | `ShareLlmspy.Enabled = true` and per-user connection |

The Git extension disables itself when Git or Projects is unavailable. Workspace file browsing remains
available without Git. All UI modules use the same native Vue ES modules as llms.py.

## What an extension can contribute

<extension-surface>
</extension-surface>

## Disabling extensions

<disable-routes>
</disable-routes>

```csharp
services.AddPlugin(new ChatFeature {
    DisableExtensions = ["computer", "share_llmspy", "katex"],
});
```

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
    ShareLlmspy = { Enabled = true },
});
```

| Property | Extension |
| --- | --- |
| `SystemPrompts` | `system_prompts` |
| `App` | `app` |
| `Agents` | `agents` |
| `Projects` | `projects` |
| `Git` | `git` |
| `Jev` | `jev` |
| `OpenAiAuth` | `openai_auth` |
| `Tools` | `tools` |
| `CoreTools` | `core_tools` |
| `Computer` | `computer` |
| `Gallery` | `gallery` |
| `Skills` | `skills` |
| `Voice` | `voice` |
| `ShareStatic` | `share_static` |
| `ShareLlmspy` | `share_llmspy` |
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

### Independent sharing destinations

`ShareStatic` exports project builds beneath the host's web content directory, normally `wwwroot/p`.
`ShareLlmspy` publishes to ai.llmspy.org and is an explicit opt-in. Use either, both, or neither;
disabling remote publishing does not disable Folder exports. With no available sharing tabs, core
hides the Share icon. See [Publishing](/chat/publishing) for the typed `StaticPublishConfig` override
and global configuration file.

Custom extensions register ordered sharing tabs with
[`ctx.setShareOptions`](/chat/custom-extensions#sharing-options); core owns the toolbar icon and panel.

## Install order

Extensions install in the order they appear in `ChatFeature.Extensions`. The built-in list ends with `CustomExtension`, so your App's own extension sees everything the built-ins registered - letting it override a tool, replace a UI component or reconfigure a group after the fact.

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

An `Install` that throws logs the failure and skips that extension rather than failing App startup. Shutdown handlers are independent - one throwing doesn't skip the rest.

## Static assets

An extension with a `chat/ext/{name}/` folder of embedded resources gets its files served automatically at `/{RoutePrefix}/ext/{name}/{path}`, and one containing an `index.mjs` is registered in the `/ext` list so the Chat UI dynamically imports it on load.

Nothing under `chat/custom/**` is ever overwritten by an upstream UI sync, which makes it the place to put your own UI. See [Custom Extensions](/chat/custom-extensions).
