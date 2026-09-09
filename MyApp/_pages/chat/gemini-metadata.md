---
title: Gemini Metadata & Source URLs
description: The metadata fields that scope retrieval, and Source URL templates that make citations lead to a real public page.
---

Metadata does two jobs in a Gemini File Store. It narrows what a question searches, and it decides
where a citation takes the reader. Both are worth getting right before a large import, because
Gemini cannot patch indexed metadata in place - correcting it later re-uploads and re-embeds the
affected documents.

## Metadata fields

<metadata-jobs>
</metadata-jobs>

Versions and tags are lists: entering `v2, v3` creates two searchable values rather than one string.
Import metadata can define defaults for every document and ordered path rules that skip matches or
override individual fields. Scalar fields are overwritten by the most specific matching value;
list values such as versions and tags accumulate.

## Source URL templates

Source URL templates generate a canonical link for each imported document. The editor validates
braces and variable names, and clicking a variable appends it with the appropriate `/` or `.`
separator.

<source-url-builder>
</source-url-builder>

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
| `{title}` | `Authentication` | Extracted document title, falling back to `{name}`. |
| `{route}` | `/add-servicestack-reference` | Route extracted from a quoted Razor `.cshtml` `@page` directive. |

:::copy
`https://docs.example.com/{pathNoExt}`
:::

resolves to `https://docs.example.com/guides/auth`.

For a Razor page beginning with `@page "/add-servicestack-reference"`, use the site's base URL with
the extracted route:

:::copy
`https://servicestack.net{route}`
:::

A trailing slash on the base URL is safe, so `https://servicestack.net/{route}` produces the same
URL instead of `https://servicestack.net//add-servicestack-reference`.

Route extraction is limited to static routes. Dynamic templates containing `{` or `}`, such as
`@page "/products/{id}"`, do not produce a `{route}` value because they cannot resolve to a single
canonical Source URL.

Documents without an extracted route omit their Source URL and log a warning when `{route}` is
required; they do not stop the preview or import.

Select **Require a Source URL** in the import form to exclude those documents instead. Preview
reports them as skipped, and subsequent runs of a recurring import remove previously indexed
documents that no longer resolve to a Source URL.

Each placeholder can optionally apply a regular expression using
`{variable:/pattern/}`. When the expression contains a capture group, the first group becomes the
placeholder value; otherwise the whole match is used. For example, this removes a leading date and
underscore from a filename such as `2026-09-04_servicestack-pdf.md`:

:::copy
`https://servicestack.net/posts/{name:/^[^_]+_(.+)$/}`
:::

The result is `https://servicestack.net/posts/servicestack-pdf`. A pattern is validated when the
template is saved. If it does not match a particular document, that document's Source URL is
omitted and a warning is logged; previewing or importing the remaining documents continues.

:::tip Citations should lead somewhere useful
Set Source URL metadata to the public documentation page whenever possible. Without it, a citation
may fall back to Gemini's URI or the locally cached document download.
:::

## Razor page routes

Razor `.cshtml` imports extract the route from a quoted `@page` directive. For example,
`@page "/add-servicestack-reference"` supplies `{route}` as `/add-servicestack-reference`.

**Require a Source URL** pairs well with `https://servicestack.net{route}`: Razor layouts, partials,
and other `.cshtml` files without an `@page` route are excluded from the index entirely, while
routed pages are imported normally.

Variable names are case-insensitive, and the editor validates both names and brace balance when the
template is saved.

<screenshot src="/img/pages/chat/gemini/gemini-import-webcrawl-sharpscript-import-metadata.webp" title="Source URL regex configuration"></screenshot>

Metadata is applied during import (see [Importing Documents](/chat/gemini-imports)), can be edited
in bulk afterwards, and is what the facet filters and grounded-chat scopes in
[Explore & Ask](/chat/gemini-explore) operate on. The same fields become server-enforced scopes for
published [Search widgets](/chat/gemini-search) and [Assistants](/chat/gemini-assistants).
