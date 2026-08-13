---
title: Themes
---

AI Chat ships eight themes users can switch between, and the theming system is open - a host or an individual user can add their own by dropping a JSON file into `App_Data`, with no rebuild and no fork.

<screenshots-gallery grid-class="grid grid-cols-2 md:grid-cols-4 gap-4" :images="{
    'Light': '/img/pages/chat/themes/light.webp',
    'Dark': '/img/pages/chat/themes/dark.webp',
    'Nord': '/img/pages/chat/themes/nord.webp',
    'Matrix': '/img/pages/chat/themes/matrix.webp',
    'Light Sky': '/img/pages/chat/themes/light_sky.webp',
    'Light Slate': '/img/pages/chat/themes/light_slate.webp',
    'Blue Smoke': '/img/pages/chat/themes/blue_smoke.webp',
    'Soft Pink': '/img/pages/chat/themes/soft_pink.webp',
}"></screenshots-gallery>

## Bundled themes

| Theme | `colorScheme` | Background image |
| --- | --- | --- |
| `light` | light | - |
| `light_sky` | light | ✓ |
| `light_slate` | light | ✓ |
| `soft_pink` | light | ✓ |
| `dark` | dark | - |
| `nord` | dark | ✓ |
| `matrix` | dark | ✓ |
| `blue_smoke` | dark | ✓ |

The theme picker splits them into **Light Themes** and **Dark Themes** columns based on each theme's `colorScheme`, with `light` and `dark` pinned first in their respective columns and the rest sorted by display name. Each entry renders a miniature chrome preview from the theme's own `preview` values.

## Anatomy of a theme

A theme is a JSON document with three sections:

```json
{
  "preview": {
    "chromeBorder": "border-frost-700/50",
    "bgBody": "bg-nord-900",
    "bgSidebar": "bg-nord-800",
    "icon": "text-nord-300",
    "heading": "text-nord-200"
  },
  "vars": {
    "colorScheme": "dark",
    "--background-image": "url(/themes/nord/ui/bg.webp)",
    "--background": "#111827",
    "--user-bg": "#3b4252",
    "--user-text": "#eceff4",
    "--assistant-bg": "#0000001A",
    "--assistant-text": "#eceff4"
  },
  "styles": {
    "bgSidebar": "bg-nord-900 lg:bg-nord-900/50",
    "heading": "text-nord-200",
    "primaryButton": "border border-transparent shadow-sm text-white bg-frost-700 hover:bg-frost-700/80 rounded-md"
  }
}
```

| Section | Applied as |
| --- | --- |
| `preview` | The five values the theme picker's mini preview renders with |
| `vars` | `colorScheme`, plus CSS custom properties set on `document.documentElement` |
| `styles` | Named slots mapped to Tailwind class strings, bound throughout the UI |

### vars

`colorScheme` is special: `"dark"` or `"light"` decides which built-in base the theme layers on, which column it appears in, and whether the document is put into dark mode. Everything else beginning with `--` is set directly as a CSS custom property.

The variables worth knowing:

| Variable | Controls |
| --- | --- |
| `--background`, `--background-image` | Page background colour and image |
| `--border`, `--input`, `--ring` | Borders, input borders, focus rings |
| `--primary-bg`, `--secondary-bg`, `--secondary-border` | Surface colours |
| `--scrollbar-track-bg`, `--scrollbar-thumb-bg` | Scrollbars |
| `--user-bg`, `--user-text`, `--user-border` | User message bubbles |
| `--assistant-bg`, `--assistant-text`, `--assistant-border` | Assistant message bubbles |
| `--tw-prose-*` | Rendered Markdown - body, headings, links, code, tables |

`--user-*` and `--assistant-*` do double duty: they're also what generated [avatars](#themed-avatars) are drawn with.

### styles

`styles` is a flat map of **named UI slots** to Tailwind class strings. There are around 60, bound directly to elements throughout the Chat UI - so a theme restyles the App by naming classes, not by shipping CSS.

| Group | Keys |
| --- | --- |
| Chrome | `chromeBorder`, `appInner`, `bgBody`, `bgSidebar`, `bgChat`, `bgPage`, `panel`, `dialog` |
| Text | `heading`, `muted`, `mutedHover`, `mutedActive`, `highlighted`, `link`, `linkHover`, `textLink` |
| Inputs | `bgInput`, `textInput`, `borderInput`, `labelInput`, `helpInput`, `checkbox`, `draggingInput` |
| Buttons | `primaryButton`, `secondaryButton`, `chatButton`, `dropdownButton`, `tabButton` |
| Tags | `tagButtonGroup`, `tagButton`, `tagButtonActive`, `tagButtonLarge`, `tagButtonSmall`, `tagLabel`, `tagLabelHover` |
| Cards | `card`, `cardTitle`, `cardActive`, `cardActiveTitleBar`, `infoCard`, `textBlock` |
| Popovers | `bgPopover`, `popoverButton`, `popoverButtonActive` |
| Icons | `icon`, `bgIcon`, `iconHover`, `iconActive`, `iconPartial`, `iconFull`, `mutedIcon`, `mutedIconHover` |
| Code | `codeTag`, `codeTagStrong` |
| Threads | `threadItem`, `threadItemActive`, `threadItemActiveBorder` |
| Messages | `messageUser`, `messageAssistant` |
| Voice | `voiceButtonDefault`, `voiceButtonRecording`, `voiceButtonProcessing` |
| Status | `bgSuccess`, `bgWarning` |

A theme only needs to define the slots it wants to change - everything else falls through to the base theme.

## How a theme is resolved

Themes are layered, so a custom theme can be as small as a handful of overrides:

<text-block :rows="[
  ['1. Built-in defaults','colorScheme + a transparent --background-image'],
  ['2. shared.json','vars + styles every theme inherits'],
  ['3. Base theme','The built-in light or dark, chosen by colorScheme'],
  ['4. The theme itself','Its own vars + styles win']]"></text-block>

`preview` is taken from the theme when it defines one; otherwise it's derived by looking up each of the base theme's preview keys in the resolved `styles`.

`colorScheme` itself is resolved from the theme's `vars.colorScheme`, falling back to the browser's stored colour scheme and then `prefers-color-scheme`.

## Where themes live

Themes are discovered from three roots and merged, with later roots overriding earlier ones:

<text-block :rows="[
  ['(bundled)','chat/themes/** shipped with the package'],
  ['App_Data/chat/user/default/themes/','Shared themes for every user'],
  ['App_Data/chat/user/{user}/themes/','The signed-in user’s own themes']]"></text-block>

Within each root, a theme can take **either** shape:

<text-block :rows="[
  ['{name}.json','A flat file holding the complete definition'],
  ['{name}/theme.json','A directory, which can also carry assets under {name}/ui/']]"></text-block>

Directories are merged first, then flat files. A directory's `theme.json` overrides only the keys it defines; a flat `{name}.json` is treated as the complete definition, with any `vars` already merged from a directory stub layered back over the top.

That's exactly how the bundled `light` and `dark` themes work - `dark.json` carries the full definition while `dark/theme.json` contributes nothing but its `colorScheme`.

:::info
`shared.json` is **not** a theme. It holds the vars and styles every theme inherits and is deliberately excluded from the theme listing.
:::

## Adding your own theme

The simplest custom theme starts from a built-in base and overrides a few values. Create `App_Data/chat/user/default/themes/company.json` to give it to every user:

```json
{
  "vars": {
    "colorScheme": "light",
    "--user-bg": "#e0f2fe",
    "--user-border": "#bae6fd",
    "--assistant-bg": "#f8fafc",
    "--ring": "#0284c7"
  },
  "styles": {
    "heading": "text-sky-900",
    "primaryButton": "border border-transparent shadow-sm text-white bg-sky-600 hover:bg-sky-500 rounded-md",
    "threadItemActive": "bg-sky-50 border-sky-200"
  }
}
```

It appears in the theme picker's Light column immediately - no rebuild, no plugin change.

### With a background image

Use the directory shape so the theme can carry its own assets:

```text
App_Data/chat/user/default/themes/company/
    theme.json
    ui/
        bg.webp
```

```json
{
  "vars": {
    "colorScheme": "dark",
    "--background-image": "url(/themes/company/ui/bg.webp)"
  },
  "styles": {
    "appInner": "bg-black/40"
  }
}
```

Assets are served at `{RoutePrefix}/themes/{theme}/ui/{file}`. Reference them with a **site-root** URL - `url(/themes/...)` - and AI Chat rebases it onto `RoutePrefix` as the theme is served, so the same theme file works whether the UI is mounted at `/chat` or at the site root.

:::tip
The asset route is deliberately anonymous, so the **sign-in screen renders themed**. The `/themes` listing itself stays authenticated, and the UI falls back to its bundled light/dark defaults until the user signs in.
:::

### Custom Tailwind palettes

Themes like `nord` reference custom colour utilities (`bg-nord-900`, `text-frost-600`). Those resolve because the corresponding `--color-nord-*` and `--color-frost-*` variables are registered in the Chat UI's stylesheet.

A custom theme is safest sticking to Tailwind's built-in palette. To introduce your own colour scale, define the `--color-*` variables from an [extension](/chat/custom-extensions):

```csharp
public override void Install(ExtensionContext ctx)
{
    ctx.AddIndexHeader("""<link rel="stylesheet" href="/chat/custom/theme.css">""");
}
```

```css
/* chat/custom/theme.css */
:root {
    --color-brand-500: #0284c7;
    --color-brand-900: #0c4a6e;
}
```

## How a theme is applied

Selecting a theme sets every `--` variable on `document.documentElement`, sets `document.body.className` from the resolved `bgBody`, and toggles the document's dark mode from `colorScheme`. The resolved `styles` map is exposed to every component, so the UI restyles reactively without a reload.

The catalog is fetched once from `GET {RoutePrefix}/themes` and cached in `localStorage` under `llms.themes`, so the chosen theme is applied on the next load before the network call completes.

## Selection and persistence

The active theme is resolved in this order:

<text-block :rows="[
  ['User preference','theme in the user’s prefs.json'],
  ['localStorage','llms.theme'],
  ['Colour scheme','dark or light']]"></text-block>

Choosing a theme writes to **both** the user's server-side preferences and `localStorage`, so it follows the user across browsers and applies instantly on this one.

An unknown theme name falls back to the built-in theme matching the current colour scheme, so removing a custom theme can't leave a user stranded.

### Agent Profiles can pin a theme

An [Agent Profile](/chat/agents) can specify the theme it runs under, so switching to a Coder or Analyst profile visually signals the change of context:

```json
{
  "theme": "nord",
  "model": "GLM-5.2",
  "onlyTools": ["api_tools"]
}
```

## Themed avatars

Generated user and agent avatars are drawn from the active theme, so they never clash with it:

<text-block :rows="[
  ['GET /chat/avatar/user?theme=nord','The signed-in user’s avatar'],
  ['GET /chat/agents/avatar?theme=nord','An Agent Profile’s avatar']]"></text-block>

The theme's `colorScheme` selects light or dark text, `--user-bg` / `--user-text` colour user avatars, and `--assistant-bg` / `--assistant-text` colour agent avatars. Without a `theme` parameter, sensible light/dark defaults are used.

Uploaded avatars replace generated ones:

<text-block :rows="[
  ['POST /chat/user/avatar','Upload a user avatar'],
  ['POST /chat/agents/avatar','Upload an Agent Profile avatar']]"></text-block>

## API

<text-block :rows="[
  ['GET /chat/themes','The merged theme catalog for the current user'],
  ['GET /chat/themes/{theme}/ui/{file}','A theme’s static assets (anonymous)']]"></text-block>

Both routes belong to the `app` extension. Theme names containing `..` are rejected, and a directory only serves assets when it also contains a `theme.json`.

## Related

- [Agent Profiles](/chat/agents) - pinning a theme per assistant
- [Custom Extensions](/chat/custom-extensions) - adding stylesheets and replacing UI components
- [Data & Storage](/chat/data) - where per-user theme files live
