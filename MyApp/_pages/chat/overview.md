---
title: AI Chat Overview
---

**AI Chat** is a complete, modular AI application delivered as a single ServiceStack plugin. Registering `ChatFeature` mounts a full multi-provider Chat UI at `/chat` that runs inside your App's existing security boundary — using your App's users, your App's database and your App's file system.

<screenshot src="/img/pages/chat/chat-ui.webp" title="AI Chat mounted at /chat"></screenshot>

## What you get

| Capability | Where it lives |
| --- | --- |
| Multi-provider Chat UI | `/chat` |
| OpenAI-compatible Chat Completions API | `POST /v1/chat/completions` |
| In-process client for your own C# code | `IChatClient` |
| Discovery + invocation of your App's own APIs | [API Tools](/chat/api-tools) |
| MCP Server for external AI Assistants | `/chat/mcp` |
| Managed RAG over your documents | [Gemini File Search](/chat/gemini) |
| PDF template designer | `/chat/pdf` |
| Production PDF rendering | `IPdfRenderer` + `PdfFeature` |
| Cost, token and activity reporting | `/admin-ui/chat` |

## Two plugins

AI Chat ships as two independent plugins in the **ServiceStack.AI.Chat** package:

| Plugin | Provides | Requires |
| --- | --- | --- |
| `ChatFeature` | Chat UI, providers, tools, API Tools, MCP, RAG, PDF Studio | An AI provider API key |
| `PdfFeature` | Published PDF template management + rendering | The `typst` CLI |

`PdfFeature` has no dependency on `ChatFeature` — an App can deploy production PDF rendering without installing any AI capability at all. See [Rendering PDFs](/chat/pdf).

## Architecture

Everything in AI Chat above the hosting layer is an **extension**. The Chat UI is assembled at runtime from the Vue components each installed extension registers, and the server half of each extension owns its own routes, tools, tables and background workers.

<screenshot src="/img/pages/chat/modular-overview.webp" title="AI Chat modular settings and extensions"></screenshot>

```csharp
services.AddPlugin(new ChatFeature {
    RequireAuth = true,
    DisableExtensions = ["computer"],   // remove a capability from server + UI together
    Tools = {
        EnableApiTools = true,          // on by default
        EnableFilesystemTools = false,  // off by default
        EnableCodeExecution = false,    // off by default
    },
});
```

A disabled extension registers no routes, no tools and no UI components. See [Extensions](/chat/extensions) for the full list and [Custom Extensions](/chat/custom-extensions) for adding your own.

## Where state lives

| State | Location |
| --- | --- |
| Threads, requests, media | Your App's database via OrmLite (`ChatThread`, `ChatRequest`, `ChatMedia`) |
| Config | `App_Data/chat/llms.json`, `App_Data/chat/providers.json` |
| Per-user files | `App_Data/chat/user/{user}/` |
| Content-addressed cache | `App_Data/chat/cache/` |
| Published PDF templates | `App_Data/pdf/` |

Nothing is stored outside your application. See [Data & Storage](/chat/data).

## Security posture

| Question | Answer |
| --- | --- |
| Who can reach `/chat`? | Whoever `RequireAuth` and `RequiredRole` allow, enforced by your existing auth |
| Can one user see another's threads, media or projects? | No — state is scoped to the authenticated identity |
| What can an Agent call? | Only APIs the **signed-in user** is authorized to call |
| Can it write files or run code? | Only if you enable those tools, and only within configured directories |
| What is exposed over MCP? | Nothing until you name tool groups |
| Does it require an outbound AI provider? | Only the providers you configure |

See [Integrated Auth](/chat/auth).

## Next steps

<div class="not-prose my-8 grid gap-4 sm:grid-cols-2">
  <a href="/chat/install" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
    <div class="font-semibold text-slate-900 dark:text-white">Install</div>
    <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Add AI Chat to an existing .NET 8+ App and configure your first provider.</p>
  </a>
  <a href="/chat/configuration" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
    <div class="font-semibold text-slate-900 dark:text-white">Configuration</div>
    <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Every <code>ChatFeature</code> option, what it defaults to and when to change it.</p>
  </a>
  <a href="/chat/api-tools" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
    <div class="font-semibold text-slate-900 dark:text-white">API Tools</div>
    <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Let Models discover and call your existing ServiceStack APIs safely.</p>
  </a>
  <a href="/chat/pdf-studio" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
    <div class="font-semibold text-slate-900 dark:text-white">PDF Studio</div>
    <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Design Typst documents with AI and publish validated templates.</p>
  </a>
</div>
