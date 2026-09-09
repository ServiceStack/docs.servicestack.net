---
title: Gemini Crawling Websites
description: Crawl a public site into an inspectable Markdown workspace, clean it with regex transforms, then hand it to Folder import.
---

<crawl-stages>
</crawl-stages>

## Define crawl boundaries

Enter a **Start URL** and the import folder is pre-populated from its host. A port uses a dash, so
`http://localhost:5000` becomes `localhost-5000`. Crawls are stored beneath:

:::copy
`App_Data/chat/user/<user>/gemini/imports/<domain>/`
:::

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

<crawl-path-map>
</crawl-path-map>

## Transform and inspect extracted pages

Regex transforms provide an ordered, repeatable cleanup pass over the crawled Markdown. Each rule
defines a file glob, regex pattern, replacement, and flags:

- `g` - global
- `i` - ignore case
- `m` - multiline
- `s` - `.` matches line breaks

Replacement capture groups are supported. 

For example, pattern `\b0(\d)\b` with replacement
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

Because the workspace is imported through the normal folder pipeline, everything in
[Importing Documents](/chat/gemini-imports) applies to it - previews, recurring synchronization,
trusted roots, and `import.json` manifests. Crawl frontmatter supplies per-page metadata described
in [Metadata & Source URLs](/chat/gemini-metadata), where a crawled page's own source URL becomes
the citation link.
