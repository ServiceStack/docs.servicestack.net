---
title: Gemini Operations & Troubleshooting
description: Worker recovery, Search index health, deployment diagnostics, the metadata filter capability probe, storage and access, and common failures.
---

The Gemini extension keeps durable local state for imports, uploads, Search indexing, deployments,
conversations, and analytics. Back up the OrmLite database and AI Chat's `AppDataPath` together.

## Worker recovery and index health

<worker-model>
</worker-model>

Search health reports total, indexed, pending, stale, failed and section counts, the provider, last
successful index time, oldest pending work, and recent errors.

<screenshot src="/img/pages/chat/gemini/gemini-search-index-health.webp" title="Worker recovery and index health"></screenshot>

Use **Rebuild index** after changing extractors or database FTS configuration. A native provider
name means FTS is active; a `*-like` name means initialization or querying fell back safely. SQL
Server requires the optional Full-Text Search component. PostgreSQL, SQL Server and MySQL/MariaDB
support native C# providers; llms-py intentionally supports SQLite only.

## Deployment diagnostics

**Run diagnostics** is available on Search and Assistant deployments. Search checks publication,
public File Store access, indexed/pending/failed content, allowed origins, and widget URL. Assistant
also checks active Gemini documents and the resolved model. Warnings are deployable but deserve
review; failures identify requirements that prevent the public widget from working.

<screenshot src="/img/pages/chat/gemini/gemini-search-deployment-diagnostics.webp" title="Deployment diagnostics results"></screenshot>

## Metadata filter capability probe

Gemini's File Search metadata filters follow AIP-160, but the exact operators and key casing a model
accepts can change. The extension assumes full support and exposes a probe that verifies it against
the live API rather than guessing:

```bash
# Cached result, or the assumed defaults when never probed
curl https://app.example.com/chat/ext/gemini/capabilities

# Run the probe (requires write access)
curl -X POST https://app.example.com/chat/ext/gemini/capabilities/probe
```

The probe creates a temporary File Store, uploads two fixture documents with known metadata, then
issues one filtered retrieval per operator and checks which fixtures were actually cited:

| Key | Expression tested | Enables |
| --- | --- | --- |
| `equality` | `status="published"` | Baseline equality with a lowercase key. |
| `keyCamel` | `docType="guide"` | camelCase keys. |
| `keyLower` | `doctype="guide"` | All-lowercase keys. |
| `keySnake` | `doc_type="guide"` | snake_case keys used by this extension. |
| `listHas` | `versions:"v8"` | Versions, tags, and category subtree filters. |
| `numeric` | `sortkey > 1700000000` | Staleness filters. |
| `numericCamel` | `sortKey > 1700000000` | Numeric comparison on camelCase keys. |
| `and` | `status="published" AND versions:"v8"` | Combining facets. |
| `or` | `status="published" OR status="deprecated"` | Multi-select facets. |
| `not` | `NOT status="deprecated"` | Negative filters. |

Each result records a verdict of `ok`, `filter ignored`, `rejected or no match`, or `error`. If the
unfiltered baseline retrieval cannot cite both fixtures, the run reports `probed: false` with the
reason and leaves every operator assumed working rather than disabling filters on a bad signal. The
temporary store and fixtures are always deleted, and the result is cached until the next probe at:

```text
App_Data/chat/user/default/gemini/capabilities.json
```

The probe model defaults to `gemini-flash-latest` and can be changed from the environment:

```bash
GEMINI_PROBE_MODEL=gemini-flash-latest
```

:::info The probe consumes Gemini quota
It uploads two documents and issues at least one grounded request per operator, retrying up to 34
requests in total when results are inconclusive. Run it after a Gemini API change or when metadata
filters behave unexpectedly - not on a schedule.
:::

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

The local Search queue is independent and follows the same durable desired/completed-hash model.
Open **Search** to see index health, document, indexed, pending, stale, failed and section counts,
last successful indexing time, oldest pending work, and recent failures. Use **Rebuild index** to
regenerate every local section after changing extraction or database configuration. Each Search
and Assistant deployment also provides **Run diagnostics**, which checks publication, public store
access, indexed knowledge, origin restrictions, model selection, and its public widget endpoint.

## Troubleshooting

<troubleshooting-index>
</troubleshooting-index>

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

### Search is using a `*-like` provider

The native full-text feature could not be initialized or a native query failed, so Search safely
fell back to `LIKE`. Confirm the database supports its full-text feature and that the application
user can create or use the required index. SQL Server additionally requires the optional
Full-Text Search component. Restart the App or rebuild the index after correcting the database.

### A document is missing from Search

Open **Search** and inspect the pending and failed counts. Text, Markdown, HTML, and Razor content
are locally indexed; PDF, Word, PowerPoint, and Excel require conversion to a text-based format for
local Search. A Source URL affects where a result opens, not whether its content can match.

## Storage and access

When authentication is enabled, write operations require a signed-in user. A deployment can also
require a role such as `Admin` with `GEMINI_WRITE_ROLE` or `gemini_write_role`.

<storage-map>
</storage-map>

With `RequireAuth = false`, AI Chat uses the shared `default` user. See
[Data & Storage](/chat/data) for AI Chat's complete storage layout. For provider-level API
constraints, consult Google's [File Search documentation](https://ai.google.dev/gemini-api/docs/file-search).

Search content is stored in `ChatSearchSection`; provider-specific full-text indexes reference its
title, heading, and content. Permanent Search deletion removes that deployment's analytics, while
permanent File Store deletion cascades through all owned imports, documents, Search and Assistant
state. See [Overview & Setup](/chat/gemini-rag#storage-economics) for what Google charges for, and
[Data & Storage](/chat/data) for AI Chat's complete storage layout.
