---
title: Gemini Imports & Synchronization
description: Upload, transform, crawl, and continuously synchronize documents into Gemini File Stores and the local Search index.
---

The Gemini extension imports the same managed document catalogue into two independent destinations:
Gemini File Search for semantic RAG and the App database for model-free Website Search. See the
[canonical Gemini reference](/chat/gemini-rag) for setup and shared configuration.

## Import methods

- **Upload** individual files or ZIP archives.
- **Folder imports** scan an approved server directory with include/exclude globs, category roots,
  metadata defaults, and dry-run previews.
- **Website crawl** follows allowed links and converts useful HTML into clean Markdown.

<screenshot src="/img/pages/chat/gemini/gemini-import-methods.webp" title="Gemini import methods and configuration"></screenshot>

Text, Markdown, HTML, and Razor files can feed the local index. HTML is converted to Markdown before
indexing. Razor is treated as HTML after removing lines whose first non-whitespace character is `@`
and balanced `{ ... }` blocks at the same or lower indentation. Binary Office and PDF files can be
sent to Gemini but need text conversion to participate in local Search.

## Change detection and recovery

Saved imports retain `SourceId`, `SourceKey`, source ETag/updated time, content hash, metadata hash,
and extractor version per document. A later Sync classifies each source as unchanged, added,
updated, metadata-only, missing, or failed. Content changes replace both the Gemini document and its
local Search sections; metadata-only changes avoid unnecessary content work.

Both upload and Search workers use durable desired/completed state. Pending work survives an App
restart and resumes automatically. Failed documents retain their error for inspection and retry.
Use **Sync Store** to reconcile the local catalogue with remote Gemini state, and **Rebuild index**
when extraction or database search configuration changes.

<screenshot src="/img/pages/chat/gemini/gemini-sync-preview.webp" title="Import preview and synchronization changes"></screenshot>

## Source URLs and metadata

Metadata fields include category, document type, status, locale, product, versions, and tags. They
can be used as server-enforced Assistant and Search scopes. Source URL templates build the canonical
link opened by citations and Search results.

Templates support values such as `{name}` and regex extraction with `{name:/pattern/}`. The first
capture group is used. For `2026-09-04_servicestack-pdf`, use
`{name:/^[^_]+_(.+)$/}`. A failed regex logs a warning and omits Source URL for only that document;
it does not fail the preview or import.

Razor `.cshtml` imports also extract the route from a quoted `@page` directive. For example,
`@page "/add-servicestack-reference"` supplies `{route}` as `/add-servicestack-reference`, so this
Source URL template uses the public site as its base URL:

```text
https://servicestack.net{route}
```

`https://servicestack.net/{route}` is also accepted; URL expansion removes the duplicate slash
between the base URL and route without changing the `https://` scheme.

Only static Razor routes are extracted. Parameterized routes such as `@page "/products/{id}"` or
`@page "/products/{id:int}"` cannot identify one canonical page and leave `{route}` unresolved.

If a document has no Razor page route, a template requiring `{route}` omits its Source URL and logs
a warning without interrupting the rest of the import.

Enable **Require a Source URL** when documents without a canonical public page should not be
indexed. Preview lists unresolved documents as skipped. This is particularly useful with
`https://servicestack.net{route}`: Razor layouts, partials, and other `.cshtml` files without an
`@page` route are excluded while routed pages are imported normally.

<screenshot src="/img/pages/chat/gemini/gemini-source-url-regex.webp" title="Source URL regex configuration"></screenshot>

For complete field behavior, previews, crawl rules, and reconciliation states, see
[Gemini File Search](/chat/gemini-rag#importing-knowledge).
