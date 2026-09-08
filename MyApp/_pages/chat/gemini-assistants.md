---
title: Gemini AI Assistants
description: Publish citation-backed Gemini RAG assistants over a controlled File Store scope.
---

An Assistant uses Gemini File Search to answer from one File Store or a server-enforced metadata
scope. Its private prompt, model choice, filters, rate limit, and origin policy stay on the server;
the public embed contains only presentation and endpoint configuration.

## Grounding controls

Choose a documentation, troubleshooting, support, developer, product, onboarding, or policy
template, then edit its specialist prompt and response style. **Require grounded answers** instructs
Gemini to retrieve from the store. **Require retrieved evidence** enforces the result on the server:
if fewer than **Minimum citations** are returned, the configured fallback replaces the answer.
This defaults to one citation. Strict streaming responses are buffered until evidence is validated,
so unsupported partial text is never emitted. Citations can be hidden from visitors while still
being checked internally.

<screenshot src="/img/pages/chat/gemini/gemini-assistant-grounding.webp" title="Assistant grounding controls"></screenshot>

## Publication and lifecycle

Customize identity, suggested questions, open behavior, themes, typography, panel, launcher,
allowed origins, and requests per minute. Save as a draft, explicitly publish, then use the generated
script. Assistants can be unpublished, assigned a regenerated public ID, archived, restored, or
permanently deleted with their conversations. **Run diagnostics** checks deployment state, public
store access, active/failed Gemini documents, model selection, origins, and widget URL.

<screenshot src="/img/pages/chat/gemini/gemini-assistant-deployment.webp" title="Assistant publication and diagnostics"></screenshot>

The conversation viewer groups customer threads and retains citations alongside each answer. Treat
conversation content as customer data and define an appropriate operational retention policy.

<screenshot src="/img/pages/chat/gemini/gemini-assistant-conversations.webp" title="Customer conversation viewer"></screenshot>

See the [canonical Assistant reference](/chat/gemini-rag#publish-a-website-assistant) for every UI
option and embedding example.
