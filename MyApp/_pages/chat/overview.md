---
title: AI Chat Overview
---

**AI Chat** is a complete, modular AI application delivered as a single ServiceStack plugin. Registering `ChatFeature` mounts a full multi-provider Chat UI at `/chat` that runs inside your App's existing security boundary - using your App's users, your App's database and your App's file system.

<screenshot src="/img/pages/chat/chat-ui.webp" title="AI Chat mounted at /chat"></screenshot>

## What you get

<chat-anatomy>
</chat-anatomy>

## Two plugins

AI Chat ships as two independent plugins in the **ServiceStack.AI.Chat** package:

<two-plugins>
</two-plugins>

See [Rendering PDFs](/chat/rendering-pdfs) to deploy production rendering on its own.

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

<state-map>
</state-map>

Nothing is stored outside your application. See [Data & Storage](/chat/data).

## Security posture

<security-posture>
</security-posture>

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
