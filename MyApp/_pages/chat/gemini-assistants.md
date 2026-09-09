---
title: Gemini AI Assistants
description: Publish a branded, citation-backed Gemini RAG chat widget over a controlled File Store scope with one script tag.
---

The **Assistants** workspace turns a File Store-or a filtered slice of it-into a branded,
document-grounded support experience for any website.

Because a File Store can contain multiple saved website and repository imports, one Assistant can
answer across an entire product ecosystem instead of forcing customers to choose the right site
first. Canonical Source URLs still take each citation back to the owning page, and server-enforced
metadata scope can narrow a broadly shared corpus for a specific product, audience or version.

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

## Configure an Assistant

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

<behavior-templates>
</behavior-templates>

Choose **Concise**, **Balanced**, or **Detailed**, require grounded answers, enable citations, and
customize the fallback and conversation-review notice. **Require retrieved evidence** adds a
server-enforced citation threshold: when Gemini returns fewer than **Minimum citations**, the
Assistant returns the configured fallback instead of exposing an unsupported answer. Strict
grounding defaults to one citation and buffers streaming answers until evidence is checked. A
custom Gemini model can be selected per Assistant; leaving it unset uses the server default.

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

Choose **Auto**, **Light**, **Dark**, **Nord**, **Matrix**, or **Soft Pink**. Auto first follows a
`light` or `dark` value in the host page's `color-scheme` localStorage key, then the visitor's
`prefers-color-scheme`, and uses your independently saved Light or Dark customizations.

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

<embed-boundary>
</embed-boundary>

#### Mounting the launcher inside your own layout

By default the launcher is a floating button anchored to a corner of the viewport. Set a
**Mount element** CSS selector in the Assistant's Appearance settings, or `data-mount` on the script
tag, to render the launcher inside an element you control instead - a nav bar, toolbar, or sidebar:

```html
<nav>
  <a href="/docs">Docs</a>
  <span id="assistant-slot"></span>
</nav>

<script
  src="https://app.example.com/chat/ext/gemini/public/assistants/widget.js?g=abc123"
  data-mount="#assistant-slot"
  async>
</script>
```

The launcher becomes an inline element inside the target, so it participates in that container's
layout like any other button, and the panel is anchored to it - opening below the launcher, or above
it when the viewport has more room there. The panel itself is always rendered from `document.body`,
so it overlays the page without affecting its layout, and it cannot be trapped inside a mount
container that establishes a containing block (a `transform`, `filter`, or `backdrop-filter`
ancestor, common in sticky headers).

`data-mount` on the script tag wins over the saved **Mount element** setting; pass `data-mount="none"`
to force the floating launcher on a page whose layout has no slot for it. If the selector is invalid
or matches nothing the widget writes a console warning and falls back to the floating launcher.

The Search widget accepts the same **Mount element** setting and `data-mount` attribute, so a
documentation site can place a `⌘K` search button and an **Ask AI** button side by side in its
header while both dialogs still overlay the page. Invalid or
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

When an Assistant and Search widget share a page, Search uses `Ctrl/⌘+K` and the Assistant
automatically uses `Ctrl/⌘+Shift+K`, avoiding competing global shortcuts.

## Review customer conversations

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

## Assistant lifecycle

<screenshots-gallery-view :images="{
    'Archive and restore': '/img/pages/chat/gemini/gemini-51-assistant-archive.webp',
    'Delete Assistant': '/img/pages/chat/gemini/gemini-52-assistant-delete.webp',
    'Delete File Store': '/img/pages/chat/gemini/gemini-53-filestore-delete.webp',
}"></screenshots-gallery-view>

<assistant-lifecycle>
</assistant-lifecycle>

**Run diagnostics** checks deployment state, public store access, active and failed Gemini
documents, model selection, origins, and the widget URL.

<screenshot src="/img/pages/chat/gemini/gemini-57-assistant-deployment.webp" title="Assistant publication and diagnostics"></screenshot>

Deleting a File Store is broader: it removes the remote Gemini store, local and remote documents,
local Search sections, Search widgets, query and click analytics, saved imports and runs,
Assistants, conversations, and messages. Its dedicated impact summary and typed store-name
confirmation are intentionally difficult to bypass.

## Configuration reference

Every setting below is stored per Assistant and served with the widget. The private prompt, model,
document scope, origin policy, and rate limit stay on the server; the public embed contains only
presentation and endpoint configuration.

### Behavior templates

The template seeds the specialist prompt only; the server always adds its shared RAG rules.

| Template | `behavior.template` | Best fit |
| --- | --- | --- |
| Documentation guide | `documentation` | Manuals, reference material, general how-to questions. |
| Technical troubleshooter | `troubleshooting` | Symptom-to-fix diagnosis with safe ordered checks. |
| Customer support | `support` | Policy and process answers with practical next actions. |
| Developer/API assistant | `developer` | Precise APIs, code, commands, and version-sensitive guidance. |
| Product advisor | `product` | Capability fit, trade-offs, and documented limitations. |
| Onboarding guide | `onboarding` | Ordered milestones to a first successful outcome. |
| Policy and procedures | `policy` | Controlled interpretations of policies and escalation paths. |

Changing the template replaces the prompt with that template's text, so save a customized prompt
elsewhere before switching.

### Grounding controls

| Setting | Config key | Default | Notes |
| --- | --- | --- | --- |
| Require grounded answers | `behavior.grounded` | `true` | Adds the grounding boundary to the prompt. |
| Show citations | `behavior.citations` | `true` | Hiding them does not disable server-side checking. |
| Require retrieved evidence | `behavior.strictGrounding` | `true` | Enforces the citation threshold on the server. |
| Minimum citations | `behavior.minCitations` | `1` | 1-5; only applies when both grounded and strict. |
| Response style | `behavior.responseStyle` | `balanced` | `concise`, `balanced`, or `detailed`. |
| Fallback message | `behavior.fallback` | `I couldn't find that in the available documents.` | Returned when evidence is insufficient. |
| Conversation notice | `behavior.notice` | `Conversations may be reviewed to improve support.` | Shown to visitors; up to 500 characters. |
| Open behavior | `behavior.openMode` | when initiated | Or `page-load`, or `page-bottom`. |
| Ctrl/⌘+K shortcut | `behavior.keyboardShortcut` | `true` | Moves to Ctrl/⌘+Shift+K when a Search widget shares the page. |

<screenshot src="/img/pages/chat/gemini/gemini-assistant-required-citations.webp" title="Assistant grounding controls"></screenshot>

### Choosing the model

Leave **Model** unset to use the server default, or select any compatible Google chat model to
override it per Assistant. The server default is `gemini-flash-latest` and can be changed for every
Assistant at once from the App's environment:

```bash
GEMINI_ASSISTANT_MODEL=gemini-flash-latest
```

A `models/` prefix is accepted and stripped. An unrecognized value is ignored in favor of the
default rather than failing the deployment.

### Appearance and hosting

| Setting | Config key | Default | Notes |
| --- | --- | --- | --- |
| Theme | `appearance.theme` | `auto` | `auto`, `light`, `dark`, `nord`, `matrix`, `soft-pink`. |
| Suggested questions | `identity.suggestions` | one entry | Up to 6, each 200 characters. |
| Launcher corner | `appearance.position` | `bottom-right` | `bottom-left` or `bottom-right`. |
| Mount element | `appearance.mount` | none | CSS selector; renders the launcher inline. |
| Launcher icon | `appearance.icon` | `sparkles` | `sparkles`, `chat`, `help`, or a PNG/JPEG/GIF/WebP/SVG Data URI. |
| Launcher size | `appearance.button.size` | `50` | 40-96px; icon 16-72px. |
| Launcher radius | `appearance.button.borderRadius` | `50` | 0-50px; border width 0-8px. |
| Launcher shadow | `appearance.button.shadow` | `medium` | `none`, `subtle`, `medium`, `strong`. |
| Panel size | `appearance.panelSize` | `standard` | `standard` or `compact`. |
| Allowed origins | `hosting.allowedOrigins` | empty | Empty allows any site; exact or wildcard subdomain origins. |
| Request limit | `hosting.requestsPerMinute` | `30` | Rolling per-client limit on public chat requests. |

The document scope uses the fields described in
[Metadata & Source URLs](/chat/gemini-metadata) - test the equivalent filters in
[Explore & Ask](/chat/gemini-explore) before publishing. To add a model-free search experience on
the same page, see [Website Search](/chat/gemini-search).
