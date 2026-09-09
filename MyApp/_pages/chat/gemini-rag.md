---
title: Gemini RAG Overview & Setup
description: What the Gemini extension builds, how to enable it, and the smallest useful RAG workflow from a File Store to a grounded answer.
---

Gemini RAG turns your documents into a managed knowledge system built on Google Gemini's
[File Search API](https://ai.google.dev/api/file-search). Import files, documentation repositories,
or entire websites into isolated **File Stores**, organize them with categories and metadata, then
ask questions over exactly the documents you choose.

The same knowledge base can power private research chats and two independent public experiences:
a fast, model-free **Website Search** and a citation-backed **Website Assistant**. Search runs
against your App's RDBMS without calling Gemini, while Assistant responses stay grounded in the
Gemini index and can include citations that lead readers back to the original source.

Crucially, a knowledge base does not need to mirror a single site. Combine saved imports from
multiple websites, repositories and file collections in one File Store, then give customers one
place to search or ask questions across all of them. Each Assistant and Search deployment can still
apply its own metadata scope, while Search ranking controls decide which titles, headings, document
types and newer content should win across the combined corpus.

<gemini-pipeline>
</gemini-pipeline>

<screenshot src="/img/pages/chat/gemini/gemini-02-filestore.webp" title="Gemini File Store management workspace"></screenshot>

<screenshot src="/img/pages/chat/gemini/gemini-27-explore.webp" title="A combined knowledge base built from five imports across four websites"></screenshot>

<gemini-doc-map>
</gemini-doc-map>

## What you can build

| Capability | What it gives you |
| --- | --- |
| **Managed knowledge bases** | Separate File Stores for products, teams, customers, or security boundaries. |
| **Repeatable ingestion** | Upload files, synchronize local folders, or crawl websites into clean Markdown. |
| **Cross-site knowledge** | Combine multiple websites and repositories behind one Search widget and AI Assistant. |
| **Precise retrieval** | Scope searches by category, document type, status, locale, product, version, and tags. |
| **Verifiable answers** | Grounded responses with inline citations and inspectable source excerpts. |
| **Website Search** | Publish a branded, keyboard-accessible Search widget backed by the local RDBMS index. |
| **Website Assistants** | Publish a branded Shadow DOM chat widget using one script tag. |
| **Search analytics** | Review popular queries, missing results, click-through rates, and frequently selected documents. |
| **Website analytics** | Optionally capture and chart first-party page traffic from the Search widget. |
| **Operational visibility** | Preview changes, watch indexing progress, audit coverage, and reconcile local and Gemini state. |

## Enable and configure

Gemini RAG is a built-in AI Chat extension. It installs automatically when AI Chat can resolve both:

1. a Gemini API key; and
2. the App's `IDbConnectionFactory`, used by OrmLite to persist File Stores, documents, imports,
   Search indexes and analytics, Assistants, conversations, and citations.

Create an API key in [Google AI Studio](https://aistudio.google.com/) and add either variable to the
App's environment:

```bash
GOOGLE_API_KEY=your_api_key
# or
GEMINI_API_KEY=your_api_key
```

AI Chat resolves `GOOGLE_API_KEY`, then `GEMINI_API_KEY`, then the API key on its configured
`google` provider. You can also provide the key programmatically:

```csharp
services.AddPlugin(new ChatFeature {
    Variables = {
        ["GEMINI_API_KEY"] = context.Configuration["Gemini:ApiKey"]!,
    },
});
```

The Gemini integration is a native AI Chat extension and talks directly to Gemini's HTTP APIs. No
Google client SDK or additional Gemini package is required.

Restart the App after changing its environment. You also need at least one Google Gemini chat
model configured in AI Chat; the Gemini model selector only lists compatible Google chat models.
Without an API key or database connection, the extension logs why and disables its routes and UI.

To disable it explicitly:

```csharp
services.AddPlugin(new ChatFeature {
    DisableExtensions = ["gemini"],
});
```

:::info Local catalogue, remote retrieval
AI Chat keeps the document catalogue, cached source files, imports, metadata, local Search index,
published widgets, search analytics, Assistants, and conversation history locally. Gemini File
Search Stores hold the indexed copies used for semantic retrieval. Upload and sync states describe
the relationship between those two systems.
:::

### Upload tuning and MIME type overrides

The upload worker normally lets Gemini infer a file's type. If Gemini rejects or misidentifies a
particular extension, map it explicitly with `GEMINI_UPLOAD_MIME_TYPES`:

```bash
# Comma-separated extension:mime/type pairs; do not include the leading dot
GEMINI_UPLOAD_MIME_TYPES="mdx:text/markdown,cshtml:text/html,ss:text/markdown"
```

The built-in mapping is `mdx:text/markdown,cshtml:text/html`. Setting the environment variable
replaces that mapping, so retain any defaults you still need. Restart the App after changing it.
Use an override only for extensions that need one; forcing the wrong type can reduce indexing and
retrieval quality.

Large imports use bounded concurrency and retry transient provider failures with exponential
backoff. Their defaults can also be overridden from the App's environment:

```bash
GEMINI_UPLOAD_CONCURRENCY=4
GEMINI_UPLOAD_MAX_RETRIES=4
```

Two model selections can also be overridden. `GEMINI_ASSISTANT_MODEL` is the default model for
published Assistants that don't select their own, and `GEMINI_PROBE_MODEL` is used by the
[metadata filter capability probe](/chat/gemini-operations#metadata-filter-capability-probe):

```bash
GEMINI_ASSISTANT_MODEL=gemini-flash-latest
GEMINI_PROBE_MODEL=gemini-flash-latest
```

Write operations can be restricted to a role with `GEMINI_WRITE_ROLE`.

## File Stores

A **File Store** is an isolated searchable corpus. It is also the practical ownership and lifecycle
boundary: documents that should be searched, administered, and deleted together belong in the same
store.

The Gemini home page lists each store with its document count and size. Create a store with a clear,
stable name such as `docs.example.com`, or use the chat icon to immediately query an existing one.

<screenshot src="/img/pages/chat/gemini/gemini-01-filestores.webp" title="Gemini File Stores overview with store creation and chat actions"></screenshot>

Opening a store exposes four deep-linkable workspaces:

- **Explore** - browse categories, search documents, apply metadata filters, edit metadata, inspect
  coverage, monitor uploads, and start grounded chats.
- **Import** - upload files, synchronize folders, or stage a website crawl.
- **Assistants** - design, publish, and review website chat Assistants grounded in the store.
- **Search** - tune and publish model-free website Search widgets backed by the local index.

The selected workspace, Import subsection, Explorer category, saved crawl, Assistant, Search
widget, and conversation are preserved in the URL, so a reload or shared link returns to the same
view.

## Quick start

1. Open **Gemini** from the left toolbar and create a File Store.
2. Open **Import → Upload files** and drop in one or more documents.
3. Optionally choose a destination category and add metadata.
4. Upload the files, then follow **View uploads** to watch Gemini indexing progress.
5. In **Explore**, choose **New Chat** to query the whole store-or apply filters and choose
   **Ask about this**.
6. Expand **Sources** below an answer to inspect the evidence Gemini retrieved.
7. Optionally open **Search**, test the local index, and publish a standalone Search widget.

That is the smallest useful RAG workflow. The guides above show how to turn it into a repeatable,
curated knowledge pipeline.

## Storage economics

Google currently charges for embeddings when documents are **indexed**, whilst **file storage and
query-time embeddings are free**. Retrieved document tokens are billed as normal model context, and
stores persist until deleted, with project capacity scaling by usage tier.

<storage-economics>
</storage-economics>

That removes the recurring vector-storage charge common in managed RAG architectures - an
organization can maintain durable knowledge bases and pay primarily when content is indexed and when
users actually query it. Content-addressed deduplication reinforces this: the same document uploaded
twice is stored and indexed once.

:::info
Pricing and limits are Google's and can change. Check the current
[Gemini File Search pricing and limits](https://ai.google.dev/gemini-api/docs/file-search) before
deployment.
:::

## Where to next

Import your first real source with [Importing Documents](/chat/gemini-imports), or read
[Metadata & Source URLs](/chat/gemini-metadata) first if you want retrieval scoping and durable
citations in place before the initial import.
