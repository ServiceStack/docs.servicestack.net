---
title: Gemini Explore & Ask
description: Browse categories, apply metadata filters, maintain the catalogue, and ask grounded questions scoped to exactly the documents you selected.
---

Explorer is where a File Store is inspected and maintained - and where grounded questions start.
The filters you apply while browsing are the same filters passed to Gemini File Search, so the
document set you can see is the document set an answer is drawn from.

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

Folder rows also provide a recursive delete action. It previews the exact number and a sample of
documents that will be removed from that category and every nested category before asking for
confirmation. A recurring folder import can restore those documents on its next run, so update the
source's include or exclude rules as well when the deletion should be permanent.

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

<import-push-sync>
</import-push-sync>

---

## Ask grounded questions

<retrieval-scopes>
</retrieval-scopes>

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

Grounding is implemented by including an OpenAI-shaped `file_search` tool in the thread, which the
Google provider forwards to Gemini together with the active File Store and metadata filter. Sources
are retained with each response, so users can verify where an answer came from instead of treating
fluent output as evidence.

Gemini File Search is a built-in retrieval tool. When a File Search request is active, the Gemini
provider sends only `file_search` and temporarily omits other selected function tools, avoiding an
unsupported built-in-tool/function-calling combination. Your normal tool selections are not
changed.

For the metadata fields these filters operate on, see
[Metadata & Source URLs](/chat/gemini-metadata). To make the same grounded retrieval available to
visitors on your website, publish an [AI Assistant](/chat/gemini-assistants).
