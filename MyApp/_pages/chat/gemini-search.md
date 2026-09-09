---
title: Gemini Website Search
description: Publish fast, model-free document search backed by SQLite, PostgreSQL, SQL Server, or MySQL/MariaDB, with tunable ranking and a Shadow DOM widget.
---

The **Search** workspace publishes a conventional documentation search experience from the same
documents as Gemini RAG. It is a separate component from the Assistant: queries run entirely
against the App's local RDBMS index and do not call a Gemini model.

The local index is maintained for every File Store whether or not a Search widget has been created.
This keeps ingestion simple and lets you add Search later without changing import definitions.
Existing File Stores are detected and queued for indexing when the App starts; **Rebuild index** can
also explicitly queue every current document.

<screenshot src="/img/pages/chat/gemini/gemini-search-index-health.webp" title="Website Search index health"></screenshot>

## Local indexing and RDBMS support

<indexing-pipeline>
</indexing-pipeline>

The C# extension selects its search implementation from the configured OrmLite dialect provider's
`DbKind`:

<search-engine-matrix
    eyebrow="Selected from your OrmLite dialect"
    title="Native search per RDBMS"
    description="Native full-text support is initialized automatically. If the database feature is unavailable, cannot be created with the current permissions, or a native query fails, Search transparently uses a bounded LIKE query over document titles, headings and content."
    :columns="2"
    footnote="<b class='text-slate-900 dark:text-white'>SQL Server's Full-Text Search is an optional server component</b> and must be installed in the SQL Server instance to use the native provider. A <code>*-like</code> status means initialization or querying fell back safely."
    :databases="[
      { name:'SQLite', color:'#0f80cc', engine:'FTS5 virtual table',
        text:'Mirrors the section text fields into a ChatSearchSectionFts virtual table.',
        status:'sqlite-fts5', fallback:'sqlite-like' },
      { name:'PostgreSQL', color:'#336791', engine:`GIN index over to_tsvector('simple', …)`,
        text:'Builds its full-text index directly over ChatSearchSection.',
        status:'postgresql-fts', fallback:'postgresql-like' },
      { name:'SQL Server', color:'#cc2927', engine:'Full-Text Catalog and CONTAINSTABLE',
        text:'Requires the optional Full-Text Search component in the SQL Server instance.',
        status:'sqlserver-fulltext', fallback:'sqlserver-like' },
      { name:'MySQL / MariaDB', color:'#00758f', engine:'FULLTEXT index with Boolean mode',
        text:'Both use the same Boolean-mode implementation and report their own provider name.',
        status:['mysql-fulltext','mariadb-fulltext'], fallback:['mysql-like','mariadb-like'] },
    ]"></search-engine-matrix>

Native full-text support is initialized automatically. If the database feature is unavailable,
cannot be created with the current permissions, or a native query fails, Search transparently uses
a bounded `LIKE` query over document titles, headings, and content. SQL Server's Full-Text Search is
an optional server component and must be installed in the SQL Server instance to use the native
provider.

PDF, Word, PowerPoint, and Excel documents can still be uploaded to Gemini, but are not locally
searchable unless their text is first converted into a supported text or Markdown document. Their
local Search status explains why no sections were created.

:::info One import updates both retrieval systems
The local Search worker uses durable desired and completed hashes. A change to content, title,
Source URL, extractor version, or filterable metadata marks the document for re-indexing. Work is
idempotent and pending documents resume after an application restart, independently of the Gemini
upload worker.
:::

## Create and tune a Search widget

Choose **New Search** and configure its visitor-facing title, input placeholder, optional launcher
tooltip, and no-results message. **Document scope** uses the same category, doc type, status,
locale, product, version, and tag dropdowns as Assistants. The server enforces this scope, so a host
page cannot expand it.

When a File Store combines several websites or repositories, visitors can search all of that
knowledge from one box without first knowing where an answer lives. Per-deployment scope can expose
the full corpus or only an approved slice, and ranking weights let you promote authoritative titles,
heading matches, preferred document types and fresher content consistently across every source.

Search first asks the active database provider for matching candidates, then applies one consistent
ranking model across every RDBMS. You can tune each part while the **Test the local index** results
refresh automatically:

| Ranking control | Effect |
| --- | --- |
| **Title weight** | Promotes terms found in the document title. |
| **Heading weight** | Promotes matching section headings. |
| **Content weight** | Controls the contribution from body text. |
| **Phrase boost** | Rewards the complete query appearing together. |
| **Exact title boost** | Strongly promotes an exact document-title match. |
| **Freshness weight** | Promotes `sourceUpdatedAt`, falling back to upload or creation time. |
| **Freshness half-life** | Sets how many days it takes for the freshness boost to halve. |
| **Database relevance weight** | Retains a controlled preference for the native provider's order. |
| **Document type preference** | Promotes or demotes individual doc types with positive or negative values. |

The same saved ranking configuration is used by the test panel, live preview, and published widget.
Changing a weight issues a fresh query, providing immediate feedback without merely reordering an
incomplete client-side result set. Each control's default value and accepted range is listed under
[Ranking defaults](#ranking-defaults) below.

## Search interaction and result behavior

<search-interaction>
</search-interaction>

The Search dialog queries as the visitor types, debounces requests, cancels superseded work, and
keeps the previous result list visible until the next response is ready. Matching text is bold and
underlined in light themes and bold white in dark themes by default; its highlight color can be
overridden.

Results are grouped by document and use the Markdown frontmatter title when available. Visitors can:

- open Search by clicking the launcher, pressing `Ctrl/⌘+K`, or pressing `/`;
- move through results with Up and Down and open the selection with Enter;
- load additional results automatically by scrolling;
- press Escape or the **esc** button to close the active layer;
- return from an open document with Escape or the left-arrow button; and
- revisit recently opened documents, retained in that browser's `localStorage`.

When a result has a Source URL, the published widget navigates to that canonical page and anchor.
The administrative live preview opens it in a new browser window. When a Markdown document has no
Source URL, the widget opens a second dialog containing a sanitized rendered copy; Escape closes
that document first and returns focus to the Search results.

If Search and Assistant widgets are embedded on the same page, Search keeps `Ctrl/⌘+K` and the
Assistant automatically moves to `Ctrl/⌘+Shift+K`. The `/` shortcut can be enabled or disabled
independently. Shortcuts do not fire from editable inputs.

## Appearance and embedding

Search uses Shadow DOM isolation and serves its saved configuration together with the widget as one
self-contained classic script:

```html
<script
  src="https://app.example.com/chat/ext/gemini/public/searches/widget.js?g=abc123"
  async>
</script>
```

Customize **Auto**, **Light**, **Dark**, **Nord**, **Matrix**, or **Soft Pink**, the font family,
highlight color, launcher style, corner, and top/right/bottom/left offsets. Auto first follows the
host page's `color-scheme` value in `localStorage` when it is `light` or `dark`, then falls back to
the visitor's operating-system preference.

As with Assistants, the launcher can float in any corner or render inside a host element using its
saved **Mount element** selector or a `data-mount` override:

```html
<span id="search-slot"></span>
<script
  src="https://app.example.com/chat/ext/gemini/public/searches/widget.js?g=abc123"
  data-mount="#search-slot"
  async>
</script>
```

Set exact or wildcard **Allowed origins** and a per-client request limit before publishing. Search
uses the same familiar deployment lifecycle as Assistants: **Save draft**, **Publish**,
**Unpublish**, **Regenerate ID**, **Archive**, **Restore**, and typed confirmation before permanent
deletion. Regenerating the ID invalidates every old embed immediately.

## Ranking defaults

Results combine database relevance with configurable weights. Change any weight below the Live
Preview to re-query immediately against the same term, so relevance is tuned against real results
rather than a reordered client-side list. The same saved configuration is used by the test panel,
the live preview, and the published widget.

| Control | Config key | Default | Range | Effect |
| --- | --- | --- | --- | --- |
| **Title weight** | `titleWeight` | `8` | 0-50 | Matches in the document title. |
| **Heading weight** | `headingWeight` | `5` | 0-50 | Matches in section headings. |
| **Content weight** | `contentWeight` | `1` | 0-50 | Matches in body text. |
| **Exact phrase boost** | `phraseBoost` | `4` | 0-50 | The complete query appearing together. |
| **Exact title boost** | `exactTitleBoost` | `6` | 0-50 | The whole title equals the query. |
| **Freshness weight** | `freshnessWeight` | `20` | 0-50 | Preference for recently updated sources. |
| **Freshness half-life** | `freshnessHalfLifeDays` | `365` | 1-3650 | Days for the freshness boost to halve. |
| **Database relevance weight** | `nativeWeight` | `2` | 0-20 | Retains a preference for the provider's native rank. |
| **Document type preference** | `docTypeWeights` | none | -20-50 each | Promotes or demotes individual doc types. |

<ranking-playground>
</ranking-playground>

Weights accept half-steps. Freshness uses `sourceUpdatedAt`, falling back to the upload and then the
creation time. Document type preference lists every `docType` present in the store; `0` is neutral,
positive values promote and negative values demote, and up to 50 types can be weighted.
**Reset defaults** restores the whole table to the values above.

A result opens its canonical Source URL; Markdown without one opens a rendered document preview.

<screenshot src="/img/pages/chat/gemini/gemini-59-search-ranking.webp" title="Search ranking with live results"></screenshot>

## Customization reference

Every setting is stored per Search deployment and served with the widget. Values are validated and
clamped on the server, so an out-of-range value is corrected rather than rejected.

| Setting | Config key | Default | Notes |
| --- | --- | --- | --- |
| Title | `identity.title` | `Search documentation` | Shown when the dialog is empty. |
| Input placeholder | `identity.placeholder` | `Search docs` | |
| No results message | `identity.emptyText` | `No matching documents found.` | |
| Button tooltip | `identity.tooltip` | none | Optional launcher tooltip. |
| Results per page | `behavior.maxResults` | `30` | 5-100. |
| Results per document | `behavior.groupLimit` | `8` | 1-30 sections shown per grouped document. |
| Minimum characters | `behavior.minChars` | `2` | 1-10 before the first query runs. |
| Ctrl/⌘+K shortcut | `behavior.commandKShortcut` | `true` | |
| `/` shortcut | `behavior.slashShortcut` | `true` | |
| Theme | `appearance.theme` | `auto` | `auto`, `light`, `dark`, `nord`, `matrix`, `soft-pink`. |
| Highlight color | `appearance.highlightColor` | none | `#rrggbb`; defaults to blue underline in light themes and bold white in dark. |
| Font family | `appearance.fontFamily` | none | CSS `font-family` stack. |
| Button corner | `appearance.position` | `bottom-right` | Any of the four corners. |
| Button style | `appearance.launcherStyle` | `flat` | `flat`, `raised`, or `inset`. |
| Mount element | `appearance.mount` | none | CSS selector; renders the launcher inline instead of floating. |
| Button offsets | `appearance.offset` | `20` each | 0-400px from each viewport edge. |
| Dialog widths | `appearance.width` / `dialogWidth` | `420` / `760` | 240-900 and 420-1200px. |
| Allowed origins | `hosting.allowedOrigins` | empty | Empty allows any site; up to 100 exact or wildcard origins. |
| Request limit | `hosting.requestsPerMinute` | `120` | 1-5000 rolling per-client limit. |

`data-mount` on the script tag overrides the saved **Mount element**, and `data-mount="none"` forces
the floating launcher. An invalid or unmatched selector logs a console warning and falls back to
floating.

:::info Search and Assistant on the same page
When both widgets are embedded together, Search keeps Ctrl/⌘+K and the Assistant automatically moves
to Ctrl/⌘+Shift+K, so the two never compete for the same global shortcut.
:::

Use **Run diagnostics** before release to validate publication, File Store access, index contents,
allowed origins, and the widget endpoint.

<screenshot src="/img/pages/chat/gemini/gemini-61-search-widget.webp" title="Published Search widget"></screenshot>

Use **Run diagnostics** before release to validate publication, File Store access, index contents,
allowed origins, and the widget endpoint - see
[Operations & Troubleshooting](/chat/gemini-operations#deployment-diagnostics).

See [Search Analytics & Privacy](/chat/gemini-analytics) for search-quality metrics and optional
page-view analytics, or [AI Assistants](/chat/gemini-assistants) to publish a grounded chat widget
alongside Search.
