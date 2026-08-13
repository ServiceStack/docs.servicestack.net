---
title: Gemini File Search (RAG)
---

The `gemini` extension provides a complete UI for managing **Google Gemini File Search Stores** and using them as managed Retrieval Augmented Generation knowledge bases - without asking your team to design a chunking pipeline, vector database, background indexer, retrieval tool and administration UI from scratch.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Gemini File Search stores': '/img/pages/chat/gemini/gemini-filestores.webp',
    'Upload a document folder': '/img/pages/chat/gemini/gemini-filestores-upload-folder.webp',
}"></screenshots-gallery>

## Enabling it

The extension self-enables when both of these are available:

1. A Gemini API key - `GEMINI_API_KEY`, or whatever the `google` provider resolved.
2. A registered `IDbConnectionFactory`, since the document catalog is an OrmLite table.

```bash
export GEMINI_API_KEY=...
```

Or programmatically:

```csharp
services.AddPlugin(new ChatFeature {
    Variables = {
        ["GEMINI_API_KEY"] = context.Configuration["Gemini:ApiKey"]!,
    },
});
```

Without either prerequisite the extension logs why and disables itself - no routes, no tools, no UI.

To turn it off explicitly:

```csharp
services.AddPlugin(new ChatFeature {
    DisableExtensions = ["gemini"],
});
```

## Stores, categories and documents

Teams create separate stores for departments, customers, products or projects, then drag and drop PDFs, Markdown, text and supported business documents into categories within them.

Uploads are:

- **Content-addressed** - written into `App_Data/chat/cache` under their SHA-256
- **Deduplicated** - the same document uploaded twice is stored once
- **Asynchronous** - a background worker performs the Gemini upload, so indexing never blocks the UI

Queued uploads are resumed on startup if the App shut down mid-upload.

## Grounded conversations at three scopes

Once indexed, a user can start a grounded conversation at whichever scope fits the question:

| Scope | Retrieval |
| --- | --- |
| **Ask File Store** | The complete knowledge base |
| **Ask Category** | One department, subject or folder |
| **Ask Document** | A single selected document |

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-3 gap-4" :images="{
    'Ask the complete File Store': '/img/pages/chat/gemini/gemini-search-all.webp',
    'Ask a document category': '/img/pages/chat/gemini/gemini-search-category.webp',
    'Ask a single document': '/img/pages/chat/gemini/gemini-search-document.webp',
}"></screenshots-gallery>

Grounding is implemented by including an OpenAI-shaped `file_search` tool in the thread, which the Google provider forwards to Gemini. Grounding **sources are retained with responses**, so users can verify where an answer came from instead of treating fluent output as evidence.

## Synchronization

The local catalog and Gemini's view of a store can drift - an upload failed, a document was removed remotely, metadata changed. **Sync** reconciles them:

- Matches by the SHA-256 hash Gemini keeps in each document's custom metadata, falling back to the document name
- Refreshes stale local fields
- Records what didn't line up as the document's state

<screenshot src="/img/pages/chat/gemini/gemini-sync.webp" title="Gemini File Search synchronization report"></screenshot>

## Storage economics

Google currently charges for embeddings when documents are **indexed**, whilst **file storage and query-time embeddings are free**. Retrieved document tokens are billed as normal model context, and stores persist until deleted with project capacity scaling by usage tier.

That removes the recurring vector-storage charge common in managed RAG architectures - an organization can maintain durable knowledge bases and pay primarily when content is indexed and when users actually query it.

:::info
Pricing and limits are Google's and can change. Check the current [Gemini File Search pricing and limits](https://ai.google.dev/gemini-api/docs/file-search) before deployment.
:::

## What AI Chat adds around Google's service

- Local document catalog and per-document status
- Store and category organization
- Background upload queue with resume-on-startup
- SHA-256 deduplication
- Remote/local synchronization reports
- Re-upload and delete controls
- User-scoped management
- One-click grounded chat creation

## Per-user isolation

File Stores and their document catalogs are scoped to the authenticated user, like every other piece of AI Chat state. A store one user creates is not visible to another.

For a genuinely shared organizational knowledge base, create it under a shared account or expose it through an [API Tool](/chat/api-tools) that queries it on the user's behalf with your own authorization rules.

## API

<text-block :rows="[
  ['GET    /chat/ext/gemini/filestores','List stores with document counts and sizes'],
  ['POST   /chat/ext/gemini/filestores','Create a store'],
  ['DELETE /chat/ext/gemini/filestores/{id}','Delete a store'],
  ['GET    /chat/ext/gemini/filestores/{id}/categories','Categories within a store'],
  ['GET    /chat/ext/gemini/filestores/{id}/documents','Live document state from Gemini'],
  ['POST   /chat/ext/gemini/filestores/{id}/upload','Multipart upload into a store'],
  ['POST   /chat/ext/gemini/filestores/{id}/sync','Reconcile local + remote'],
  ['GET    /chat/ext/gemini/documents','Query the local document catalog'],
  ['POST   /chat/ext/gemini/documents/{id}/upload','Retry a failed upload'],
  ['DELETE /chat/ext/gemini/documents/{id}','Delete a document']]"></text-block>

## Operational notes

- The document catalog tables are created when `AutoInitSchema` is true.
- The upload worker is stopped cleanly on AppHost disposal via a registered shutdown handler.
- Cached document bytes live under `App_Data/chat/cache` and should be included in your backups - see [Data & Storage](/chat/data).
