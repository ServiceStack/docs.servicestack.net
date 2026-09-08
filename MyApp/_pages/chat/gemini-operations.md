---
title: Gemini Operations & Diagnostics
description: Monitor workers, Search index health, deployment readiness, recovery, storage, and database capabilities.
---

The Gemini extension keeps durable local state for imports, Gemini uploads, Search indexing,
deployments, conversations, and analytics. Back up the OrmLite database and AI Chat `AppDataPath`
together.

## Worker recovery and index health

Upload and Search workers select documents whose desired hash differs from their completed hash.
They mark attempts and errors in the database, so application restarts resume unfinished work rather
than losing an in-memory queue. Search health reports total, indexed, pending, stale, failed and
section counts, the provider, last successful index time, oldest pending work, and recent errors.

<screenshot src="/img/pages/chat/gemini/gemini-worker-index-health.webp" title="Worker recovery and index health"></screenshot>

Use **Rebuild index** after changing extractors or database FTS configuration. A native provider
name means FTS is active; a `*-like` name means initialization or querying fell back safely. SQL
Server requires the optional Full-Text Search component. PostgreSQL, SQL Server and MySQL/MariaDB
support native C# providers; llms-py intentionally supports SQLite only.

## Deployment diagnostics

**Run diagnostics** is available on Search and Assistant deployments. Search checks publication,
public File Store access, indexed/pending/failed content, allowed origins, and widget URL. Assistant
also checks active Gemini documents and the resolved model. Warnings are deployable but deserve
review; failures identify requirements that prevent the public widget from working.

<screenshot src="/img/pages/chat/gemini/gemini-deployment-diagnostics.webp" title="Deployment diagnostics results"></screenshot>

## Storage and deletion

Search content is stored in `ChatSearchSection`; provider-specific indexes reference its title,
heading, and content. Analytics uses `ChatSearchQuery`, `ChatSearchClick`, and `ChatSearchPageView`.
Assistant deployments, conversations, and messages use their corresponding `ChatAssistant*`
tables. Permanent Search deletion removes its analytics, while permanent File Store deletion
cascades through all owned imports, documents, Search and Assistant state.

See the [canonical Gemini troubleshooting reference](/chat/gemini-rag#troubleshooting) for common
configuration, upload, citation, filter, and index failures.
