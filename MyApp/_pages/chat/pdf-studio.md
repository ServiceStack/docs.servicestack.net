---
title: PDF Studio
---

**PDF Studio** is an AI-assisted development environment for creating [Typst](https://typst.app) templates, mounted by the `pdf` extension at `/chat/pdf`. It combines a Typst editor, a live PDF preview, schema-generated data forms, visual formatting controls and AI-assisted editing.

<screenshot src="/img/pages/chat/pdf/designer-overview.webp" title="PDF Studio designer"></screenshot>

This page covers **authoring**. For publishing, production rendering and typed C# integration see [Rendering PDFs](/chat/pdf).

## The lifecycle

<text-block text="AI Chat PDF Studio → Publish → Admin PDF → Generate C# → Render in your App"></text-block>

PDF Studio is only the authoring half. Everything after Publish is a controlled software artifact, and **production rendering never calls an LLM**.

| Capability | Plugin | Runtime dependencies |
| --- | --- | --- |
| AI-assisted authoring and live preview | `ChatFeature` PDF extension | Typst and an AI provider |
| Published template management and rendering | `PdfFeature` | Typst |

## Requirements

PDF Studio shells out to the Typst CLI and **disables itself** when it isn't found:

:::sh
brew install typst
:::

:::sh
cargo install --locked typst-cli
:::

The extension resolves `typst` from `PATH`. `PdfFeature` additionally honours `$TYPST_PATH`.

```csharp
services.AddPlugin(new ChatFeature {
    DisableExtensions = ["pdf"],   // remove PDF Studio explicitly
});
```

## Per-user workspaces

Each user's templates live under:

<text-block text="App_Data/chat/user/{user}/pdf"></text-block>

Developers and designers experiment independently, and nothing becomes a shared runtime template until an administrator explicitly publishes it. PDF Studio inherits [Integrated Auth](/chat/auth), so existing application users enter with their current identity while their drafts, assets and experiments stay isolated.

Publishing is a separate Admin-authorized boundary - access to the designer does not imply permission to change the templates production uses.

## Anatomy of a document

A document named `invoice` normally consists of:

<text-block :rows="[
  ['invoice.typ','Owns layout and rendering'],
  ['invoice.json','Supplies realistic preview data'],
  ['invoice.ui.json','Describes the data contract as JSON Schema'],
  ['invoice.fixture.*.json','Exercises important payload shapes'],
  ['lib/v1.typ','Versioned shared styles and helpers']]"></text-block>

This separation makes templates easier to design, test, review and integrate than documents where layout and business data are inseparable.

## Editing document data

The JSON data can be edited directly in **Code View**, or through a **Form View** generated from `invoice.ui.json` - labels, date inputs, enum selections and add/remove controls for line items, without requiring anyone to edit JSON.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Form View - generated from the data contract': '/img/pages/chat/pdf/data-form.webp',
    'Code View - edit the raw JSON payload': '/img/pages/chat/pdf/data-code.webp',
}"></screenshots-gallery>

Every edit uses the same data contract that later generates the application's C# model, so the preview isn't a disconnected design mock-up - it's an executable example of the production template.

## Edit with AI

The **Edit with AI** panel gives the Model the current template, its data and any referenced partials, then applies the complete updated files it returns and recompiles immediately.

> Add a Paid watermark when the outstanding balance is zero.

> Move the totals into a bordered box and show tax on a separate row.

> Reformat this as a 4×6 shipping label with no page margins.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Before the AI edit': '/img/pages/chat/pdf/edit-with-ai-before.webp',
    'After the AI edit': '/img/pages/chat/pdf/edit-with-ai-after.webp',
}"></screenshots-gallery>

If the first edit fails to compile, the Model gets a repair pass with the compiler error.

AI edits update **editor buffers** rather than silently committing files - unsaved changes stay visible and the previous contents can be restored, which makes experimentation fast and reversible.

## Recreate a document with vision

Starting from a blank page is rarely necessary. Attach screenshots, photos or rasterized pages from an existing PDF and ask a vision-capable model to reproduce the design as a reusable Typst template with its own JSON data model.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Create a template from an attachment': '/img/pages/chat/pdf/ai-attachment-new.webp',
    'Refine the reconstructed template': '/img/pages/chat/pdf/ai-attachment-edit.webp',
}"></screenshots-gallery>

:::info
This is **visual reconstruction**, not structural PDF conversion. The original document's text objects, fonts, forms, annotations and metadata are not preserved - but it's an extraordinarily fast way to turn a legacy document into maintainable source.
:::

## Visual formatting controls

For authors who don't want to memorize Typst:

- Font discovery and preview
- Font size, weight and line height
- Page sizes from A3–A6, Letter, Legal and presentation formats
- Portrait and landscape orientation
- Margins
- Image and asset selection
- Shared library previews

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Font discovery and preview': '/img/pages/chat/pdf/font-picker.webp',
    'Page size and orientation': '/img/pages/chat/pdf/page-setup.webp',
}"></screenshots-gallery>

The controls **modify source rather than hiding it** - developers keep a readable Typst template whilst less experienced authors can make common visual changes confidently.

## Versioned design systems

Shared document design belongs in a library, but changing that library shouldn't unexpectedly reflow every historical template.

New workspaces use explicit imports such as `lib/v1.typ`, holding shared fonts, colors, formatters, headers and footers. An incompatible redesign becomes `lib/v2.typ`, letting templates migrate one at a time.

`lib/v1.preview.typ` renders the design system itself, so typography and components can be checked independently:

<screenshot src="/img/pages/chat/pdf/lib-preview.webp" title="Shared design system preview"></screenshot>

PDF Studio tracks direct and transitive dependencies: a referenced library **cannot be renamed or deleted** until its dependants are moved, and publishing captures the exact imported library with the document's artifact set.

## Assets

Images a template can `#image()` are limited to what Typst reads - `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp` - and uploads are checked against their magic bytes rather than trusted by extension.

| Setting | Default |
| --- | --- |
| `Pdf.AssetExtensions` | `.png .jpg .jpeg .gif .svg .webp` |
| `Pdf.MaxAssetBytes` | 20 MB |
| `Pdf.MaxPdfBytes` | 50 MB |
| `Pdf.RenderTimeout` | 30s |

```csharp
services.AddPlugin(new ChatFeature {
    Pdf = {
        RenderTimeout = TimeSpan.FromSeconds(60),
        MaxAssetBytes = 5 * 1024 * 1024,
    },
});
```

Renders are serialized per user, since a user's templates all compile out of the same mirror directory.

## API

<text-block :rows="[
  ['GET  /chat/ext/pdf/files','List the user’s templates and assets'],
  ['GET  /chat/ext/pdf/file/{name}','Read a template file'],
  ['POST /chat/ext/pdf/file/{name}','Save a template file'],
  ['DELETE /chat/ext/pdf/file/{name}','Delete a template file'],
  ['POST /chat/ext/pdf/render','Compile and return the PDF'],
  ['POST /chat/ext/pdf/ai','Edit with AI'],
  ['POST /chat/ext/pdf/asset','Upload an image asset'],
  ['GET  /chat/ext/pdf/fonts','Available fonts'],
  ['GET  /chat/ext/pdf/dependencies','Direct + transitive template dependencies'],
  ['POST /chat/ext/pdf/schema','Generate a JSON Schema from document data'],
  ['POST /chat/ext/pdf/duplicate','Copy a template'],
  ['POST /chat/ext/pdf/rename','Rename a template']]"></text-block>

## Next

Once a document is ready, an administrator publishes it into `App_Data/pdf`, where it becomes a validated immutable revision your application can render deterministically.

[Rendering PDFs →](/chat/pdf)
