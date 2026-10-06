---
title: Gemini Importing Documents
description: Upload files and ZIP archives, synchronize server folders with previewed diffs, and version import configuration with import.json.
---

The Gemini extension imports the same managed document catalogue into two independent destinations:
Gemini File Search for semantic RAG, and the App database for model-free
[Website Search](/chat/gemini-search). One confirmed import updates both. See
[Overview & Setup](/chat/gemini-rag) for enabling the extension and creating a File Store.

<import-paths>
</import-paths>

<screenshot src="/img/pages/chat/gemini/gemini-import-methods.webp" title="Gemini import methods and configuration"></screenshot>

Text, Markdown, HTML, and Razor files can feed the local Search index. HTML is converted to Markdown
before indexing. Binary Office and PDF files can be sent to Gemini but need text conversion to
participate in local Search.

## Upload files and ZIP archives

The upload drop zone accepts PDF, Markdown/MDX, plain text, HTML, reStructuredText, AsciiDoc, CSV,
JSON, YAML, and ZIP archives containing supported files.

HTML files are converted to Markdown before they are cached, indexed, and uploaded. Razor
`.cshtml` files use the same conversion after removing server-only lines whose first non-whitespace
character is `@`, and code blocks beginning with `{` through the matching `}` at the same or lower
indentation. This keeps rendered page content searchable without leaking Razor directives into
result snippets. When an HTML document has no explicit title, its generated display name uses the
`.md` extension.

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

## Import a local folder

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
| **Ignore files and folders** | Comma/newline-separated paths or globs such as `private/, **/generated/**`. |

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

### Preview before committing

**Preview import** saves the current source settings and scans without changing documents, uploading
content, or spending on embeddings. A dismissed preview leaves the folder in Saved imports.

<preview-ledger>
</preview-ledger>

Only **Import N documents** applies the preview. Progress updates naturally-for example,
`Uploading 16/21 documents to docs.example.com…`-and **View uploads** opens Explorer at the
destination category sorted by active uploads. Pending uploads resume when the application starts
again after an interruption. The same confirmed import queues each changed document for the local
Search index, so one synchronization updates both Website Search and Gemini RAG.

### Saved imports

Folder imports are saved when previewed; web crawls are saved after crawling. Both appear in the same
**Saved imports** list. Give each source a unique name within its File Store. A dismissed preview leaves
its source available to run later.

<screenshot src="/img/pages/chat/gemini/gemini-imports.webp" title="Editing a saved Gemini folder import with file filters, ignore paths, metadata, preview, run, and save actions"></screenshot>

| Action | Result |
| --- | --- |
| **Load import.json** | Browse a server folder or enter a manifest path; save the source and open its editor without uploading |
| **Edit** | Open the existing Folder or Web crawl editor with current manifest settings |
| **Save changes** | Update the source manifest without running an import or spending on embeddings |
| **Preview** | Rescan and compare documents without indexing |
| **Run** | Import the source's current files and resume pending work |
| **Remove** | Stop syncing this source; keep its manifest, source files, and previously imported documents |
| **Close editor** | Clear the current form to start another source; keep the saved import |

Loaded folder manifests open in **Folder**; crawl manifests open in **Web crawl**. **Import folder**
continues from a crawl into Folder to configure attributes before **Run import**. **Edit crawl settings**
and **Edit folder settings** move between those forms without losing their shared configuration.
Preview and Run save current settings first. Selecting another store category does not overwrite the
loaded import's destination.

Removing and reloading the same manifest in the same store reconnects its existing documents. Loading
a crawl workspace outside your private Gemini imports directory copies its manifest, generated Markdown,
and nested metadata into a private named workspace; the original stays untouched. Reloading it refreshes
that same private copy without creating suffixed duplicates.

Re-running compares normalized content, metadata, and titles, reusing document identities. Unchanged,
successfully uploaded files need no new embeddings. Changed documents replace their old remote copy
after the new copy succeeds; removal failures retain the old identity and report an error for retry.
Pending and failed uploads reuse existing document rows. A locally unchanged file can still be
**Awaiting Gemini upload**: use **Resume** or Run to finish its existing queue entry.

Missing upstream files follow the saved deletion policy; the default removes the Gemini copy and
retains a local tombstone. Large deletions still require confirmation through the individual source run.


Saved imports are composable: run several of them into the same File Store to create a unified corpus
from content that remains owned and deployed independently. For example, the Explorer below contains
five saved imports spanning [docs.servicestack.net](https://docs.servicestack.net/),
[servicestack.net](https://servicestack.net/), [react-templates.net](https://react-templates.net/) and
[sharpscript.net](https://sharpscript.net/). Each source keeps its own synchronization definition,
metadata rules and canonical Source URLs, while customers get one Search and Assistant experience
across all four sites.

<screenshot src="/img/pages/chat/gemini/gemini-27-explore.webp" title="Five saved imports combined into one cross-site File Store"></screenshot>

Re-running a saved import compares normalized content and metadata independently. The saved source
key identifies the same document on later runs, while content and metadata hashes determine whether
it changed. Unchanged, successfully indexed files need no new work; locally unchanged files may still await a Gemini upload. Content changes and
metadata-only changes queue both indexes because Gemini cannot patch indexed metadata in place and
Search ranking or filtering may depend on the changed metadata.

When an upstream file disappears, the import removes its Gemini copy and retains a local
`removed upstream` tombstone so the change remains visible. A deletion safety rail refuses an
unexpectedly large removal, protecting against a mistyped path or incomplete source listing.

### Trusted import folders

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

## Change detection and recovery

Saved imports retain `SourceId`, `SourceKey`, source ETag/updated time, content hash, metadata hash,
and extractor version per document. A later run classifies each source as unchanged, added, updated,
metadata-only, missing, or failed. Content changes replace both the Gemini document and its local
Search sections; metadata-only changes avoid unnecessary content work.

Both the upload and Search workers use durable desired/completed state. Pending work survives an App
restart and resumes automatically. Failed documents retain their error for inspection and retry. Use
**Sync Store** to reload enabled saved imports, refresh crawls, import changed sources, and reconcile remote state, and **Rebuild index** when
extraction or database search configuration changes - see
[Explore & Ask](/chat/gemini-explore#coverage-and-synchronization) and
[Operations & Troubleshooting](/chat/gemini-operations).

<screenshot src="/img/pages/chat/gemini/gemini-import-razor-preview.webp" title="Import preview and synchronization changes"></screenshot>

## Versioned import configuration

A folder or ZIP may include `import.json`. A root manifest supplies global defaults; a manifest in
a nested directory inherits and overwrites settings for the files beneath it.

<metadata-precedence>
</metadata-precedence>

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
Saving a folder import writes its effective settings back atomically while preserving
crawl and transform settings. Saving does not run the import.

Metadata defaults and rules in a manifest use the fields described in
[Metadata & Source URLs](/chat/gemini-metadata). To import a public website, stage it first with
[Crawling Websites](/chat/gemini-crawling), which hands its cleaned workspace to Folder import.

### Portable source settings

A root `import.json` can store the complete source alongside metadata:

```json
{
  "version": 1,
  "source": {
    "name": "Product docs",
    "type": "folder",
    "config": {
      "path": ".",
      "include": ["**/*.md", "**/*.html"],
      "ignore": ["drafts/", "private.md", "**/generated/**"],
      "requireSourceUrl": false
    },
    "category": { "root": "docs", "maxDepth": 4, "prefix": "product" },
    "extract": { "minWords": 25 },
    "onDelete": "tombstone"
  },
  "metadata": { "defaults": { "product": "My product" }, "rules": [] }
}
```

Paths are relative to the manifest directory; `.` selects that directory. Absolute paths also work.
`include`, `exclude`, and `ignore` accept arrays of paths or globs. A folder pattern such as `drafts/`
ignores its whole subtree. Nested manifests add exclusions relative to their own folder and can override
metadata. Existing metadata-only manifests remain supported; crawl rules and transforms share this file.
