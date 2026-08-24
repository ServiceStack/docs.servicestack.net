---
title: Gemini RAG
description: Build reliable Gemini knowledge bases from files, folders, and websites; query them with metadata-scoped RAG; and publish citation-backed AI Assistants on any website.
---

Gemini RAG turns your documents into a managed knowledge system built on Google Gemini's
[File Search API](https://ai.google.dev/api/file-search). Import files, documentation repositories,
or entire websites into isolated **File Stores**, organize them with categories and metadata, then
ask questions over exactly the documents you choose.

The same knowledge base can power private research chats and public, embeddable **Website
Assistants**. Responses stay grounded in your indexed content and can include citations that lead
readers back to the original source.

<screenshot src="/img/pages/chat/gemini/gemini-02-filestore.webp" title="Gemini File Store showing the Explore, Import, and Assistants workspaces"></screenshot>

## What you can build

| Capability | What it gives you |
| --- | --- |
| **Managed knowledge bases** | Separate File Stores for products, teams, customers, or security boundaries. |
| **Repeatable ingestion** | Upload files, synchronize local folders, or crawl websites into clean Markdown. |
| **Precise retrieval** | Scope searches by category, document type, status, locale, product, version, and tags. |
| **Verifiable answers** | Grounded responses with inline citations and inspectable source excerpts. |
| **Website Assistants** | Publish a branded Shadow DOM chat widget using one script tag. |
| **Operational visibility** | Preview changes, watch upload progress, audit coverage, and reconcile local and Gemini state. |

## Enable and configure

Gemini RAG is a built-in AI Chat extension. It installs automatically when AI Chat can resolve both:

1. a Gemini API key; and
2. the App's `IDbConnectionFactory`, used by OrmLite to persist File Stores, documents, imports,
   Assistants, conversations, and citations.

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
AI Chat keeps the document catalogue, cached source files, imports, metadata, Assistants, and
conversation history locally. Gemini File Search Stores hold the indexed copies used for semantic
retrieval. Upload and sync states describe the relationship between those two systems.
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

## File Stores

A **File Store** is an isolated searchable corpus. It is also the practical ownership and lifecycle
boundary: documents that should be searched, administered, and deleted together belong in the same
store.

The Gemini home page lists each store with its document count and size. Create a store with a clear,
stable name such as `docs.example.com`, or use the chat icon to immediately query an existing one.

<screenshot src="/img/pages/chat/gemini/gemini-01-filestores.webp" title="Gemini File Stores overview with store creation and chat actions"></screenshot>

Opening a store exposes three deep-linkable workspaces:

- **Explore** - browse categories, search documents, apply metadata filters, edit metadata, inspect
  coverage, monitor uploads, and start grounded chats.
- **Import** - upload files, synchronize folders, or stage a website crawl.
- **Assistants** - design, publish, and review website chat Assistants grounded in the store.

The selected workspace, Import subsection, Explorer category, saved crawl, Assistant, and
conversation are preserved in the URL, so a reload or shared link returns to the same view.

## Quick start

1. Open **Gemini** from the left toolbar and create a File Store.
2. Open **Import → Upload files** and drop in one or more documents.
3. Optionally choose a destination category and add metadata.
4. Upload the files, then follow **View uploads** to watch Gemini indexing progress.
5. In **Explore**, choose **New Chat** to query the whole store-or apply filters and choose
   **Ask about this**.
6. Expand **Sources** below an answer to inspect the evidence Gemini retrieved.

That is the smallest useful RAG workflow. The sections below show how to turn it into a repeatable,
curated knowledge pipeline.

---

## Importing knowledge

Choose the ingestion path that matches the source:

| Import type | Best for | How it behaves |
| --- | --- | --- |
| **Upload files** | PDFs, documents, ad-hoc files, and ZIP archives | Queues selected files immediately. ZIP folder structure becomes categories. |
| **Folder** | Documentation repositories and maintained server folders | Previews a diff before importing and can be saved for recurring synchronization. |
| **Web crawl** | Public websites and documentation portals | Crawls into an inspectable Markdown workspace before handing off to Folder import. |

### Upload files and ZIP archives

The upload drop zone accepts PDF, Markdown/MDX, plain text, HTML, reStructuredText, AsciiDoc, CSV,
JSON, YAML, and ZIP archives containing supported files.

<screenshot src="/img/pages/chat/gemini/gemini-22-import-upload-files.webp" title="Upload files and ZIP archives into a Gemini File Store"></screenshot>

Choose an optional **Destination category** before uploading. A ZIP is expanded safely and each
supported entry becomes a document; its internal directories are preserved beneath that category.
For example, `guides/auth/login.md` uploaded to `products` becomes:

```text
products/guides/auth/login.md
```

Hidden system files, macOS metadata, dependencies, build output, and other common archive noise are
excluded automatically.

:::tip Import into the current category
While browsing an Explorer category, choose **Import here**. The Import workspace opens with that
category already set as the destination.
:::

### Import a local folder

Folder import scans a directory on the machine hosting AI Chat. It is designed for sources you
expect to preview and synchronize repeatedly.

| Setting | Purpose |
| --- | --- |
| **Folder path** | Directory to scan. Non-admin users must remain inside a trusted import root. |
| **Category root** | Limits the scan to a subfolder and removes that prefix from derived categories. |
| **Max depth** | `0` imports direct files only; `1` also includes immediate child directories; blank is unlimited. |
| **Include only** | Optional glob such as `**/*.md`. |
| **Exclude** | Optional glob such as `**/drafts/**`. |
| **Destination category** | Prefix applied to every category produced by the import. |
| **Save as recurring import** | Retains the source definition after a confirmed import. |

<screenshots-gallery-view :images="{
    'Folder configuration': '/img/pages/chat/gemini/gemini-23-import-folder.webp',
    'Metadata editor': '/img/pages/chat/gemini/gemini-23-import-folder-metadata-dialog.webp',
    'Applied metadata': '/img/pages/chat/gemini/gemini-24-import-folder-metadata.webp',
    'Preview changes': '/img/pages/chat/gemini/gemini-25-import-folder-preview.webp',
    'Upload progress': '/img/pages/chat/gemini/gemini-26-import-folder-uploading.webp',
}"></screenshots-gallery-view>

Categories come from a document's directory, not its filename. Given
`docs/guides/auth/login.md`, a Category root of `docs` produces `guides/auth`. Adding a destination
of `products` produces `products/guides/auth`.

:::info Import one directory level only
Use **Max depth = 0** to import only files directly inside the selected folder. Use **1** for direct
files plus files in immediate child directories. Depth is measured from Category root when one is
set, otherwise from Folder path.
:::

#### Preview before committing

**Preview import** is read-only: it scans and compares the source without writing documents,
uploading content, or incurring embedding work.

| Preview result | Meaning |
| --- | --- |
| **Discovered** | Files considered by the scan. |
| **New** | Documents not yet present in this source. |
| **Changed** | Existing documents whose extracted content changed. |
| **Metadata only** | Content is unchanged but indexed metadata changed. |
| **Unchanged** | Documents requiring no work. |
| **Removed** | Documents previously imported from this source but no longer present. |
| **Skipped / Failed** | Excluded, unsupported, too short, unreadable, or otherwise rejected files. |
| **Embeds** | Documents Gemini will upload and index after confirmation. |

Only **Import N documents** applies the preview. Progress updates naturally-for example,
`Uploading 16/21 documents to docs.example.com…`-and **View uploads** opens Explorer at the
destination category sorted by active uploads. Pending uploads resume when the application starts
again after an interruption.

#### Saved imports

Enable **Save as a recurring import** and give the import a unique name before confirming it. A
preview alone does not create a saved import; it appears only after the import is actually run.

<screenshot src="/img/pages/chat/gemini/gemini-20-import-saved.webp" title="Saved recurring imports with preview results and trusted folder configuration"></screenshot>

Re-running a saved import compares normalized content and metadata independently. Unchanged files
are not embedded again. Content changes and metadata-only changes both require re-indexing because
Gemini cannot patch indexed metadata in place.

When an upstream file disappears, the import removes its Gemini copy and retains a local
`removed upstream` tombstone so the change remains visible. A deletion safety rail refuses an
unexpectedly large removal, protecting against a mistyped path or incomplete source listing.

#### Trusted import folders

Server-side folder access is privileged:

- Administrators may import any accessible folder.
- Other users are restricted to server-allowed directories and Gemini **Trusted import folders**.
- Real paths are checked so a symlink cannot escape an allowed root.

Trusted roots are saved in `App_Data/chat/user/default/config.json`. They can use any directory
aliases registered in `ChatFeature.AliasedDirectories`, and can also be configured in that file:

```json
{
  "gemini": {
    "importRoots": ["$WORKSPACE/docs", "/srv/knowledge"]
  }
}
```

For example, an App can define the `$WORKSPACE` alias used above when registering AI Chat:

```csharp
services.AddPlugin(new ChatFeature {
    AliasedDirectories = {
        ["$WORKSPACE"] = "/srv/workspace",
    },
});
```

### Crawl a website into Markdown

Web crawl is intentionally a two-stage workflow:

1. Fetch pages into a private, inspectable Markdown workspace.
2. Clean and review that workspace, then import it through the normal Folder pipeline.

Nothing is sent to Gemini during the crawl itself. This separation makes noisy navigation,
duplicate content, or extraction mistakes visible before they affect retrieval quality.

#### Define crawl boundaries

Enter a **Start URL** and the import folder is pre-populated from its host. A port uses a dash, so
`http://localhost:5000` becomes `localhost-5000`. Crawls are stored beneath:

```text
App_Data/chat/user/<user>/gemini/imports/<domain>/
```

<screenshots-gallery-view :images="{
    'Crawl boundaries': '/img/pages/chat/gemini/gemini-03-import-web-crawl.webp',
    'Additional crawl rules': '/img/pages/chat/gemini/gemini-04-import-web-crawl-config.webp',
}"></screenshots-gallery-view>

The common controls cover the safety rules most crawls need:

- **Include / Exclude paths** use folder-style globs such as `/docs/**` and `/archives/**`.
- **Max pages** and **Max depth** bound the crawl.
- Query strings can be ignored, selectively allowed, or included with tracking/session parameters
  excluded and variants capped per path.
- Crawls stay on the same origin unless named supporting hosts are allowed.
- `robots.txt`, `noindex`, `nofollow`, canonical URLs, HTML content types, and duplicate extracted
  content are handled explicitly.
- Ordered additional rules can **Exclude** a match or **Follow links only** without saving the page.

The crawl output uses clean paths: `/docs/templates/next-rsc` becomes
`docs/templates/next-rsc.md`; the site root becomes `index.md`; and a directory URL such as
`/docs/` becomes `docs/index.md`.

Each file begins with frontmatter containing available page information such as title, source URL,
path, query string, description, and tags. Page metadata is more specific than global crawl
metadata and therefore overwrites matching defaults.

#### Transform and inspect extracted pages

Regex transforms provide an ordered, repeatable cleanup pass over the crawled Markdown. Each rule
defines a file glob, regex pattern, replacement, and flags:

- `g` - global
- `i` - ignore case
- `m` - multiline
- `s` - `.` matches line breaks

Replacement capture groups are supported. For example, pattern `\b0(\d)\b` with replacement
`\1.` converts `01` to `1.`.

<screenshots-gallery-view :images="{
    'Define transforms': '/img/pages/chat/gemini/gemini-05-import-web-crawl-transforms.webp',
    'Apply and save': '/img/pages/chat/gemini/gemini-06-import-web-crawl-transforms-applied.webp',
    'Inspect crawled pages': '/img/pages/chat/gemini/gemini-07-import-web-crawl-view-pages.webp',
}"></screenshots-gallery-view>

**Apply transforms** updates the workspace and saves the rules to `import.json`. **View crawled
pages** opens a large read-only browser with directories on the left and vertically scrollable file
content on the right. When the content is ready, **Import this folder** opens Folder import with the
workspace path and metadata pre-populated.

Saved crawl imports are deep-linkable. Reopen one to load its configuration, make more
transformations, inspect the result, and hand it back to Folder import whenever the website changes.

### Versioned import configuration

A folder or ZIP may include `import.json`. A root manifest supplies global defaults; a manifest in
a nested directory inherits and overwrites settings for the files beneath it. Page frontmatter is
more specific, and metadata explicitly entered in the Import UI has the highest precedence.

```json
{
  "version": 1,
  "metadata": {
    "defaults": {
      "product": "ServiceStack",
      "status": "published",
      "tags": ["docs"]
    },
    "rules": [
      {
        "match": "auth/**/*.md",
        "set": { "tags": ["auth"] }
      }
    ]
  },
  "transforms": [
    {
      "match": "**/*.md",
      "pattern": "\\nEdit this page.*$",
      "replacement": "",
      "flags": "gim"
    }
  ]
}
```

When the UI contains no explicit metadata, Preview import automatically loads the root manifest.
Saving a recurring folder import writes its effective metadata back atomically while preserving
crawl and transform settings.

---

## Metadata that improves retrieval

Metadata makes a large store navigable and lets Gemini search only the documents relevant to a
question.

| Field | Typical values and purpose |
| --- | --- |
| **Category** | Hierarchical location such as `guides/auth`; derived during import and editable later. |
| **Doc type** | `guide`, `reference`, `api`, `faq`, `release-notes`, `policy`, `changelog`. |
| **Status** | `published`, `draft`, `deprecated`, `archived`. |
| **Locale** | `en`, `en-AU`, `fr`. |
| **Product** | Product, module, or service owning the content. |
| **Versions** | One or more independently searchable versions such as `v2`, `v3`. |
| **Tags** | One or more topic labels such as `redis`, `security`, `react`. |
| **Source URL** | Canonical public page opened by citations. |

Versions and tags are lists: entering `v2, v3` creates two searchable values rather than one string.
Import metadata can define defaults for every document and ordered path rules that skip matches or
override individual fields. Scalar fields are overwritten by the most specific matching value;
list values such as versions and tags accumulate.

### Source URL templates

Source URL templates generate a canonical link for each imported document. The editor validates
braces and variable names, and clicking a variable appends it with the appropriate `/` or `.`
separator.

For `docs/guides/auth.md` with Category root `docs`:

| Variable | Example | Meaning |
| --- | --- | --- |
| `{fullPath}` | `docs/guides/auth.md` | Full source path. |
| `{path}` | `guides/auth.md` | Path after removing Category root. |
| `{pathNoExt}` | `guides/auth` | Root-relative path without extension. |
| `{dir}` | `docs/guides` | Directory portion of the full path. |
| `{filename}` | `auth.md` | Filename with extension. |
| `{name}` | `auth` | Filename without extension. |
| `{ext}` | `md` | Extension without a leading dot. |
| `{category}` | `guides` | Final category, including any destination prefix. |
| `{title}` | `auth.md` | Source title, or filename when no title exists. |

```text
https://docs.example.com/{pathNoExt}
```

resolves to `https://docs.example.com/guides/auth`.

:::tip Citations should lead somewhere useful
Set Source URL metadata to the public documentation page whenever possible. Without it, a citation
may fall back to Gemini's URI or the locally cached document download.
:::

---

## Explore, filter, and maintain documents

Explorer combines category navigation, full-store search, sorting, facet filters, metadata editing,
upload state, and document actions.

<screenshots-gallery-view :images="{
    'Browse categories': '/img/pages/chat/gemini/gemini-27-explore.webp',
    'Apply metadata filters': '/img/pages/chat/gemini/gemini-30-explore-filters.webp',
}"></screenshots-gallery-view>

Compact dropdowns for **doc type**, **status**, **locale**, **product**, **versions**, and **tags**
sit beside **Categories** and **Coverage**. Selecting a value converts the dropdown into a visible,
removable filter chip; clearing it restores the dropdown. Missing metadata is shown as `(no value)`.

Category and facet filters are deep-linkable. Coverage links operate over the whole File Store, so
they clear the current category before showing a store-wide result that would otherwise appear
empty.

Each document row can:

- open its category or Source URL;
- download the cached source;
- edit metadata;
- retry a failed or pending Gemini upload;
- start a chat scoped to that document; or
- delete the local and Gemini copies.

Work in progress remains visible: uploads show activity, failures show their provider message, and
a document being deleted displays a red struck-through name with a spinner.

### Edit metadata in bulk

Select the current page-or every document matching the current filters-to apply a staged bulk edit.

- Scalar fields support **Set where empty**, **Overwrite**, and **Clear**.
- Versions and tags support **Add**, **Remove**, **Replace**, and **Clear**.

The preview reports how many documents will change. Bulk edits update the local catalogue first,
letting you make several corrections before paying for a single re-indexing pass.

### Coverage and synchronization

**Coverage & filters** answers two separate questions:

1. How consistently is metadata populated?
2. Does the local catalogue agree with Gemini?

<screenshot src="/img/pages/chat/gemini/gemini-21-filestore-sync.webp" title="Gemini File Store synchronization report showing matching local and remote documents"></screenshot>

The sync report detects documents missing locally or remotely, metadata differences, unmatched
fields, and duplicate remote copies. Issue counts link back to an unscoped Explorer result with the
active filter visibly displayed.

Local metadata edits appear immediately in Explorer, but Gemini still searches its last indexed
metadata until you choose **Push N to Gemini**. Because Gemini cannot patch metadata in place, those
documents are uploaded and embedded again. Use **Prune duplicates** when sync detects redundant
remote documents.

:::info Import, push, and sync solve different problems
Re-run an import to discover source changes. Push pending metadata to re-index intentional metadata
edits. Run Sync Store to audit and reconcile local state against Gemini.
:::

---

## Ask grounded questions

Gemini RAG supports three useful scopes:

- **New Chat** searches the whole File Store.
- A document's chat icon searches only that document.
- **Ask about this** preserves the current category and every active metadata filter.

<screenshots-gallery-view :images="{
    'Filtered Explorer scope': '/img/pages/chat/gemini/gemini-30-explore-filters.webp',
    'Preserved chat filters': '/img/pages/chat/gemini/gemini-31-chat-filters.webp',
}"></screenshots-gallery-view>

The chat header makes the retrieval scope visible. A category is displayed as a path, while other
filters are summarized by count:

```text
docs.example.com/auth (2)
```

Hover over it to see each filter on a separate line. The same filter expression shown in Coverage
is passed to Gemini File Search, so Explorer and the grounded query describe the same document set.

### Answers, citations, and source evidence

<screenshots-gallery-view :images="{
    'Grounded answer': '/img/pages/chat/gemini/gemini-28-chat-ask.webp',
    'Source evidence': '/img/pages/chat/gemini/gemini-29-chat-ask-sources.webp',
    'Metadata-scoped RAG': '/img/pages/chat/gemini/gemini-31-chat-filters.webp',
}"></screenshots-gallery-view>

Grounded answers place citation markers beside supported claims. Each assistant response retains
its own **Sources** section as the conversation continues. Expand a source to inspect the retrieved
excerpt, or follow its title to the document's Source URL.

Source links resolve in this order:

1. the document's Source URL;
2. the URI returned by Gemini;
3. the cached document download.

Gemini File Search is a built-in retrieval tool. When a File Search request is active, the Gemini
provider sends only `file_search` and temporarily omits other selected function tools, avoiding an
unsupported built-in-tool/function-calling combination. Your normal tool selections are not
changed.

---

## Publish a Website Assistant

The **Assistants** workspace turns a File Store-or a filtered slice of it-into a branded,
document-grounded support experience for any website.

<screenshot src="/img/pages/chat/gemini/gemini-40-assistants.webp" title="Saved Website Assistants for a Gemini File Store"></screenshot>

Each named Assistant owns its:

- visitor-facing identity and suggested questions;
- server-enforced document scope;
- behavior template, private system prompt, and optional Gemini model;
- theme, typography, panel, and launcher appearance;
- allowed website origins and request limit;
- deployment ID and publish state; and
- retained customer conversations.

The widget is rendered in a **Shadow DOM**, isolating it from the host page's CSS. It also traps its
keyboard events so global website shortcuts do not fire while a visitor is typing.

### 1. Identity, behavior, and document scope

<screenshots-gallery-view :images="{
    'Identity and welcome': '/img/pages/chat/gemini/gemini-41-assistant-identity.webp',
    'Behavior and prompting': '/img/pages/chat/gemini/gemini-42-assistant-behavior.webp',
    'Document scope': '/img/pages/chat/gemini/gemini-43-assistant-document.webp',
}"></screenshots-gallery-view>

Start with the visitor experience:

- **Name** identifies the Assistant in the dashboard and must be unique within the store.
- **Title** and **Description** appear in the widget header.
- **Welcome message** appears when a new thread opens.
- **Suggested questions** are editable single-line rows; press Enter or `+` to add another.

Then define how it should answer:

| Template | Best fit |
| --- | --- |
| **Documentation guide** | Product manuals, reference material, and general how-to questions. |
| **Technical troubleshooter** | Diagnosis that should progress from symptoms to safe checks and fixes. |
| **Customer support** | Clear policy/process answers and practical next actions. |
| **Developer/API assistant** | Precise APIs, code, commands, prerequisites, and version-sensitive guidance. |
| **Product advisor** | Capability fit, trade-offs, prerequisites, and documented limitations. |
| **Onboarding guide** | Ordered milestones leading to a first successful outcome. |
| **Policy and procedures** | Controlled interpretations of policies, responsibilities, and escalation paths. |

Template prompts are editable specialist instructions. The server combines them with shared RAG
rules for retrieval, grounding, prompt-injection resistance, conflicting documents, conversation
context, fallback behavior, and response formatting.

Choose **Concise**, **Balanced**, or **Detailed**, require grounded answers, enable citations, and
customize the fallback and conversation-review notice. A custom Gemini model can be selected per
Assistant; leaving it unset uses the server default.

Assistants open only when initiated by default. They can instead open after page load or when the
visitor reaches the bottom of the page. **Open with Ctrl/⌘+K** is enabled for new Assistants and
opens and focuses the widget independently of the automatic trigger.

Finally, restrict retrieval by category, doc type, status, locale, product, version, or tag. These
filters and the private system prompt are applied by the server: they are not embedded in the
public JavaScript and cannot be changed by the host website.

:::tip Publish only approved content
A common public support scope is `status = published`, optionally combined with a product,
documentation category, locale, or version. Test the equivalent filters in Explorer before
publishing the Assistant.
:::

### 2. Design the widget

Choose **Auto**, **Light**, **Dark**, **Nord**, **Matrix**, or **Soft Pink**. Auto follows the
visitor's `prefers-color-scheme` and uses your independently saved Light or Dark customizations.

<screenshots-gallery-view :images="{
    'Light': '/img/pages/chat/gemini/gemini-44-assistant-appearance-light.webp',
    'Dark': '/img/pages/chat/gemini/gemini-45-assistant-appearance-dark.webp',
    'Nord': '/img/pages/chat/gemini/gemini-46-assistant-appearance-nord.webp',
    'Matrix': '/img/pages/chat/gemini/gemini-12-assistant-appearance-matrix.webp',
    'Soft Pink': '/img/pages/chat/gemini/gemini-47-assistant-appearance-softpink.webp',
}"></screenshots-gallery-view>

Every theme is a preset, not a locked skin. Override and reset individual values for:

- assistant and user bubble backgrounds, borders, and text;
- accent, panel, and conversation backgrounds;
- panel and focus borders;
- primary, muted, link, error, and warning text; and
- a per-theme CSS `font-family` stack.

Only explicit overrides are saved. **Reset theme appearance** restores the complete preset, while
the reset action beside a value restores only that variable. The live preview uses the same SVG
icons, layout, and CSS variables as the real widget.

### 3. Customize the launcher and hosting rules

<screenshots-gallery-view :images="{
    'Launcher button': '/img/pages/chat/gemini/gemini-48-assistant-appearance-button.webp',
    'Hosting and access': '/img/pages/chat/gemini/gemini-49-assistant-hosting.webp',
    'Publish and embed': '/img/pages/chat/gemini/gemini-50-assistant-publish.webp',
}"></screenshots-gallery-view>

The launcher can appear bottom-left or bottom-right. Configure its size, icon size, corner radius,
shadow, border width, border color, background, and icon color. Choose **Sparkles**, **Chat**, or
**Help**, or provide a PNG, JPEG, GIF, WebP, or SVG Data URI for a custom icon.

Leave **Allowed origins** empty to allow the Assistant on any website, or enter one exact HTTP(S)
origin per line:

```text
https://docs.example.com
https://*.example.com
http://localhost:5173
```

An exact origin includes its scheme and port. A wildcard matches subdomains but not the apex, so
add `https://example.com` separately when both are needed. The requests-per-minute setting applies
a rolling per-client limit to public chat requests.

:::info Why the script itself does not need CORS
Browsers may load a public classic `<script>` across origins. The access check is applied to each
chat request using its `Origin` header. Requests without an Origin are refused when an allowlist is
configured.
:::

### 4. Save, publish, and embed

Use **Save draft** while configuring. **Publish** makes the deployment available and produces a
stable embed snippet:

```html
<script
  src="https://app.example.com/chat/ext/gemini/public/assistants/widget.js?g=abc123"
  async>
</script>
```

The deployment identifier is on the `g` query string. The public endpoint merges the saved
configuration with the static widget and Markdown renderer, then returns a self-contained classic
script. The `/chat` segment is AI Chat's default `RoutePrefix`; use your configured prefix when AI
Chat is mounted somewhere else.

The host page may override presentation choices without changing retrieval behavior:

```html
<script
  src="https://app.example.com/chat/ext/gemini/public/assistants/widget.js?g=abc123"
  data-theme="dark"
  data-position="bottom-left"
  data-accent="#7c3aed"
  data-icon="chat"
  async>
</script>
```

The host cannot override document scope, prompts, model, origin rules, or rate limits. Invalid or
unavailable deployments return JavaScript that writes a useful error to the browser console rather
than a JSON response that fails silently.

The widget supports:

- streaming Markdown responses with plain-text fallback;
- citation links and source titles;
- suggested questions and a configurable welcome message;
- smooth fly-in/out animation from the launcher;
- maximized full-screen reading;
- a scrollable conversation thread;
- clearing the current thread without confirmation; and
- browser-local session continuity across page loads.

### Review customer conversations

Authoritative conversations and messages are retained server-side so support teams can understand
what visitors ask, identify missing coverage, and improve documentation.

Open **View Conversations** on a saved Assistant. The sidebar counts user messages, and each
conversation shows its exact originating page. Expand the user-message navigator to jump directly
to the corresponding Assistant response. Responses render as Markdown and retain their source
citations.

The conversation count appears in **View/Hide Conversations**, making new activity visible while
you work. The review view and selected conversation are deep-linkable.

:::warning Treat retained conversations as customer data
Choose an appropriate conversation notice, access policy, retention practice, and privacy review
for your deployment. The notice can be hidden, but doing so does not disable server-side retention.
:::

### Assistant lifecycle

<screenshots-gallery-view :images="{
    'Archive and restore': '/img/pages/chat/gemini/gemini-51-assistant-archive.webp',
    'Delete Assistant': '/img/pages/chat/gemini/gemini-52-assistant-delete.webp',
    'Delete File Store': '/img/pages/chat/gemini/gemini-53-filestore-delete.webp',
}"></screenshots-gallery-view>

- **Unpublish** takes the public deployment offline while leaving the Assistant editable.
- **Regenerate ID** invalidates every old embed immediately and creates a replacement ID.
- **Archive Assistant** takes it offline and makes it read-only while retaining configuration and
  conversations. **Restore Assistant** returns it as an unpublished draft.
- **Delete permanently** removes the Assistant, conversations, messages, and citations. The
  confirmation shows affected referrer domains and when each was last used, then requires the
  Assistant name.

Deleting a File Store is broader: it removes the remote Gemini store, local and remote documents,
saved imports and runs, Assistants, conversations, and messages. Its dedicated impact summary and
typed store-name confirmation are intentionally difficult to bypass.

---

## Operational guidance

### Choose store boundaries deliberately

Use separate File Stores when knowledge must have a different owner, access policy, lifecycle, or
deletion boundary. Use categories and metadata inside a store when the same team should manage the
content but queries need narrower scopes.

### Prefer curated sources over larger sources

Retrieval quality improves when navigation fragments, stale versions, duplicate pages, drafts, and
boilerplate are excluded. Preview folder diffs, inspect crawl Markdown, set `status` and `version`
metadata, and test filtered chats before exposing an Assistant publicly.

### Make citations durable

Use canonical Source URL templates instead of local cache links. Preserve stable page paths across
re-imports, and push metadata changes after correcting URLs so Gemini retrieves the updated values.

### Recover from interrupted uploads

Pending documents remain queued in the local catalogue and resume after application startup. To
inspect them, open Explorer at the destination category and sort by **Uploading**. Sort by
**Failed** to review provider errors and retry individual documents.

---

## Troubleshooting

### The Gemini icon is missing

Confirm `GOOGLE_API_KEY` or `GEMINI_API_KEY` is available to the App, an
`IDbConnectionFactory` is registered, and `gemini` is not listed in `DisableExtensions`. Restart the
App after changing its environment. The extension logs which prerequisite is missing when it
disables itself.

### No Gemini model is available

Configure a Google provider chat model. The Gemini picker excludes other providers and incompatible
model types.

### A folder cannot be imported

Check the resolved folder shown by the picker. Non-admin users must remain beneath a trusted import
root. The permission is checked again whenever a saved import runs.

### Files were skipped

Open **Skipped & failed** in the preview. Common causes include unsupported binary formats during a
folder scan, very short prose, include/exclude globs, Category root, or an explicit skip rule.

### An upload failed or appears stuck

Sort Explorer by **Failed** or **Uploading**, hover the status for the provider message, and retry
the document. Pending work resumes automatically after a server restart.

### A metadata filter returns no results

Clear other chips and verify exact values in Coverage. Versions and tags are lists, and every active
facet is combined with the category when creating the Gemini metadata filter.

### Citations open cached files

Add or correct Source URL metadata, then push pending metadata changes to Gemini. Existing source
cards can resolve locally, but future filtered retrieval uses the newly indexed metadata.

### Explorer and Gemini disagree

Run **Sync Store**. Use its issue links to open the relevant store-wide filter, push intentional
metadata changes, retry missing uploads, and prune duplicates when reported.

## Storage and access

When authentication is enabled, write operations require a signed-in user. A deployment can also
require a role such as `Admin` with `GEMINI_WRITE_ROLE` or `gemini_write_role`.

Structured Gemini state is stored in the App's configured OrmLite database. `AutoInitSchema = true`
creates and updates these tables automatically:

- `ChatFilestore` and `ChatDocument` for the local Gemini catalogue;
- `ChatSource` and `ChatSourceRun` for recurring imports and their history; and
- `ChatAssistant`, `ChatAssistantConversation`, and `ChatAssistantMessage` for published Assistants
  and retained customer conversations.

When authentication is enabled, rows are partitioned by the authenticated username. With
`RequireAuth = false`, AI Chat uses the shared `default` user.

Cached document bodies use SHA-256 content-addressed paths beneath AI Chat's `AppDataPath`, which
defaults to `App_Data/chat`. A JSON sidecar retains the original filename, MIME type, size, date,
and cache URL:

```text
App_Data/chat/cache/[hash_prefix]/[hash].[ext]
App_Data/chat/cache/[hash_prefix]/[hash].info.json
```

User-specific crawl workspaces live beneath
`App_Data/chat/user/<user>/gemini/imports/`. Back up the OrmLite database and `App_Data/chat`
together so catalog records, cached originals, imports, and Assistant state remain consistent. See
[Data & Storage](/chat/data) for AI Chat's complete storage layout. For provider-level API
constraints, consult Google's [File Search documentation](https://ai.google.dev/gemini-api/docs/file-search).
