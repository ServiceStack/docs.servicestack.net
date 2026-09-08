---
title: Gemini Website Search
description: Publish fast, model-free document search backed by SQLite, PostgreSQL, SQL Server, or MySQL/MariaDB.
---

Website Search is independent of Gemini model inference. Imported text is split into heading-aware
sections and queried through the App's configured RDBMS. SQLite uses FTS5, PostgreSQL uses text
search vectors, SQL Server uses Full-Text Search, and MySQL/MariaDB uses FULLTEXT indexes. Each
provider safely falls back to bounded `LIKE` search when its native facility is unavailable.

<screenshot src="/img/pages/chat/gemini/gemini-search-index-health.webp" title="Website Search index health"></screenshot>

## Ranking

Results combine database relevance with configurable weights for title, heading, body content,
exact phrases, exact titles, source freshness, native search rank, and preferred document types.
Change ranking below the Live Preview to re-query immediately against the same term. A result opens
its canonical Source URL; Markdown without one opens a rendered document preview.

<screenshot src="/img/pages/chat/gemini/gemini-search-ranking.webp" title="Search ranking with live results"></screenshot>

## Widget behavior

Create a Search, set its document scope and allowed origins, then explicitly publish it. Embed the
generated script on any page. The Shadow DOM widget supports:

- launcher position, offsets, style, font, theme, and highlight color;
- host `color-scheme` light/dark selection when theme is `auto`;
- independent Ctrl/⌘+K and `/` shortcuts;
- keyboard result navigation and Enter selection;
- responsive grouped results, match highlighting, infinite scrolling, and recent links in
  `localStorage`; and
- inline Markdown preview when no Source URL exists.

<screenshot src="/img/pages/chat/gemini/gemini-search-widget.webp" title="Published Search widget"></screenshot>

If an Assistant and Search are on the same page, Search keeps Ctrl/⌘+K and the Assistant uses
Ctrl/⌘+Shift+K. Use **Run diagnostics** before release to validate publication, File Store access,
index contents, allowed origins, and the widget endpoint.

See [Analytics & Privacy](/chat/gemini-analytics) for search-quality metrics and optional page-view
analytics, or the [canonical reference](/chat/gemini-rag#publish-website-search) for all settings.
