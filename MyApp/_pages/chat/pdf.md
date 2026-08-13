---
title: Rendering PDFs
---

`PdfFeature` owns the published [Typst](https://typst.app) templates in `App_Data/pdf` that your App renders PDFs from - returned by an API, attached to an email or written to a stream from a background job.

Here's the end state: an ordinary ServiceStack API returning a real invoice, with **no LLM anywhere near it**.

```csharp
public class InvoiceServices(IPdfRenderer pdf) : Service
{
    public async Task<object> Any(GetOrderInvoice request)
    {
        var order = await Db.LoadSingleByIdAsync<Order>(request.Id);
        return await pdf.PdfResultAsync(MapToInvoice(order), $"Invoice-{order.InvoiceNo}.pdf");
    }
}
```

## Two plugins, one boundary

| Capability | Plugin | Runtime dependencies |
| --- | --- | --- |
| AI-assisted authoring and live preview | `ChatFeature` PDF extension | Typst + an AI provider |
| Published template management and rendering | `PdfFeature` | Typst |

Rendering has **no dependency on `ChatFeature`** - only publishing does, since that's what reads the designer's folder. An organization can design documents in development with [PDF Studio](/chat/pdf-studio), then deploy only `PdfFeature`, Typst and the published artifacts.

```csharp
services.AddPlugin(new PdfFeature());
```

## Configuration

| Property | Default | Description |
| --- | --- | --- |
| `PdfPath` | `~/App_Data/pdf` | Where published templates live |
| `TypstPath` | `$TYPST_PATH` → `PATH` | Path to the typst CLI |
| `RenderTimeout` | `30s` | How long a single compile may run |
| `PreviewTimeout` | `60s` | Longer budget for rasterizing a preview |
| `PreviewPpi` | `96` | Resolution of `{name}.preview.png` thumbnails |
| `MaxConcurrentRenders` | `ProcessorCount` | Concurrent typst processes |
| `MaxDataBytes` | `64 KB` | Largest data JSON a render accepts |
| `ValidateOnPublish` | `true` | Validate example/fixture data + model contracts before publishing |
| `ChatRoutePrefix` | `/chat` | Where the Chat UI is mounted, for the Admin UI's Edit link |
| `ModelsPath` | resolved | Where the `pdf` AppTask writes generated models |
| `ModelsNamespace` | resolved | Namespace generated models are emitted into |
| `Renderer` | `PdfRenderer` | Replaceable `IPdfRenderer` implementation |
| `PdfCodeGen` | `null` | Code generation config |

`IsAvailable` is `false` when typst isn't installed - templates can still be listed and unpublished, but not rendered.

`ModelsPath` and `ModelsNamespace` are resolved automatically to a `Pdf/` subfolder of the App's ServiceModel, covering both layouts ServiceStack Apps use: a `ServiceModel` folder in the host project, or the sibling `MyApp.ServiceModel` project the templates create.

## Publish is a controlled promotion boundary

Design work stays private until an administrator chooses **Publish**, which does substantially more than copy files:

- Follows JSON data, Typst includes, images, assets and versioned libraries
- Flattens folder-based authoring into a self-contained runtime artifact set
- Rewrites local references for the flattened result
- Validates example data and named fixtures against `.ui.json`
- Exercises C# model generation
- Checks statically visible data paths
- Compiles **every fixture** through the actual flattened Typst template
- Generates the gallery preview
- Records publisher and source metadata
- Prevents silent takeover of a name published by another user
- **Rolls back** the publish if validation or compilation fails
- Saves every successful publish as an **immutable revision**

<screenshot src="/img/pages/chat/pdf/publish-dialog.webp" title="PDF Studio publishing workflow"></screenshot>

This turns publishing from *"copy whatever currently works on my machine"* into a repeatable release step.

### Contract fixtures

One sample invoice cannot represent every production invoice. Add named fixtures beside the template:

<text-block :rows="['invoice.fixture.empty.json','invoice.fixture.long.json','invoice.fixture.international.json','invoice.fixture.maximum-items.json']"></text-block>

At publish time each fixture is checked against the JSON Schema **and rendered** with the flattened template. A payload can be structurally valid yet still block publishing if long text, an empty collection or international characters trigger a Typst failure.

The built-in validator covers the schema features PDF Studio generates: types, required members, object properties, arrays, enums, numeric and string bounds, patterns, date formats, local references and schema composition.

```csharp
services.AddPlugin(new PdfFeature { ValidateOnPublish = false });  // not recommended
```

### Immutable history and rollback

Every successful publish creates a revision:

<text-block text="App_Data/pdf/.versions/{template}/{revision}/"></text-block>

Each revision holds the complete published artifact set, its preview and publishing metadata. Restoring a revision **never edits or deletes history** - it creates a new revision recording which version was restored, so rollback is itself auditable and reversible.

Unpublishing removes the live template but retains its history, giving a lightweight, database-free release history that backs up with the rest of `App_Data/pdf`.

<screenshot src="/img/pages/chat/pdf/template-history.webp" title="PDF template administration and history"></screenshot>

## Admin PDF

`/admin-ui/pdf` is the Admin-only gallery of templates production can currently render, with publish-time thumbnails, search and sorting.

<screenshot src="/img/pages/chat/pdf/saved-pdfs.webp" title="Published template gallery"></screenshot>

Selecting a template opens a two-pane workspace with editable data on one side and the real PDF rendered through the **production renderer** on the other:

| Tab | Purpose |
| --- | --- |
| **Form** | Schema-generated controls for testing without writing JSON |
| **Data** | Raw editable JSON for pasting real payloads |
| **Code** | Generated models and usage examples |

The preview uses pdf.js with live rendering, zoom, fit, page count and download.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Test with real data': '/img/pages/chat/pdf/data-form.webp',
    'Generated C# models': '/img/pages/chat/pdf/generated-types-csharp.webp',
}"></screenshots-gallery>

**Edit** opens the published document back in PDF Studio - copying the published files into the current administrator's workspace first if another user created it. **Unpublish** removes the live runtime files whilst preserving revision history.

Admin PDF is the handoff between document authors and application developers, answering three questions with the real deployed artifact:

1. What templates can production render?
2. Does this template render with this data?
3. What typed code should the App use?

### Admin APIs

Every Admin PDF API requires the `Admin` role:

| API | Purpose |
| --- | --- |
| `AdminPdfTemplates` | List published templates |
| `AdminGetPdfTemplate` | One template's files, data and schema |
| `AdminRenderPdfTemplate` | Render with supplied data |
| `AdminPdfTemplatePreview` | Publish-time thumbnail |
| `AdminPublishPdfTemplate` | Promote a Studio template |
| `AdminEditPdfTemplate` | Copy a published template back into a workspace |
| `AdminDeletePdfTemplate` | Unpublish |
| `AdminPdfTemplateVersions` | Revision history |
| `AdminRollbackPdfTemplate` | Restore a revision |
| `AdminPdfTemplateTypes` | Generate the typed model source |

## Generate typed C# contracts

The `.ui.json` schema generates strongly typed C# models - the same source `dotnet run --AppTasks=pdf` writes, so what you copy from the browser matches what lands in your project.

```csharp
public class LineItem
{
    [JsonPropertyName("description")]
    public string Description { get; set; } = null!;

    [JsonPropertyName("qty")]
    public int Qty { get; set; }

    [JsonPropertyName("rate")]
    public decimal Rate { get; set; }
}

[Pdf("invoice")]
public class Invoice
{
    [JsonPropertyName("items")]
    public List<LineItem> Items { get; set; } = new();
}
```

`[Pdf("invoice")]` binds the root model to its published template, so the template name lives on the model rather than being repeated as a magic string at every call site:

```csharp
[AttributeUsage(AttributeTargets.Class, Inherited = false)]
public class PdfAttribute(string template) : AttributeBase
{
    public string Template { get; set; }   // published name, without .typ
    public string? FileName { get; set; }  // download name, default "{Template}.pdf"
}
```

Dates, UUIDs, decimals, enums, required members and documentation are **inferred from the schema** rather than guessed from sample JSON.

### The pdf AppTask

```csharp
services.AddPlugin(new PdfFeature {
    PdfCodeGen = new() {
        Namespace = "MyApp.ServiceModel.Pdf",
        OutputPath = Path.Combine(contentRootPath, "../MyApp.ServiceModel/Pdf"),
        // Include = ["invoice"],
        // Exclude = ["statement"],
    }
});

AppTasks.Register("pdf", _ => appHost.GetPlugin<PdfFeature>().GeneratePdfs());
```

Regenerate after publishing template changes:

:::sh
dotnet run --AppTasks=pdf
:::

| `PdfCodeGenConfig` | Description |
| --- | --- |
| `Namespace` | Namespace to emit into. Defaults to the App's ServiceModel namespace + `.Pdf` |
| `OutputPath` | Folder to write to, created if missing |
| `Include` | Only these templates. Empty generates all |
| `Exclude` | Templates to leave alone |
| `ResolveFileName` | Names the file a template generates into. Default `"invoice"` → `Invoice.cs` |
| `PreserveModified` | A generated file that's been edited is skipped rather than overwritten |

Generated files contain content hashes, so if a developer adopts and edits one, later generation skips it instead of destroying their work.

:::info
Nothing is ever written outside `GeneratePdfs()` - code generation is an explicit task the App runs, in the same spirit as OrmLite Migrations, not something the server does behind your back.
:::

## Rendering from an API

```csharp
[Route("/orders/{Id}/invoice")]
public class GetOrderInvoice : IGet, IReturn<byte[]>
{
    public int Id { get; set; }
}

public class InvoiceServices(IPdfRenderer pdf) : Service
{
    public async Task<object> Any(GetOrderInvoice request)
    {
        var order = await Db.LoadSingleByIdAsync<Order>(request.Id);

        var invoice = new Invoice {
            InvoiceValue = new InvoiceDetails {
                Number = order.InvoiceNo,
                Date = order.OrderDate.ToString("d MMMM yyyy"),
                Due = order.DueDate,
                Currency = "$",
            },
            Items = order.Details.Map(x => new LineItem {
                Description = x.ProductName,
                Qty = x.Quantity,
                Rate = x.UnitPrice,
            }),
            TaxRate = 0.10m,
        };

        return await pdf.PdfResultAsync(invoice, $"Invoice-{order.InvoiceNo}.pdf");
    }
}
```

`PdfResultAsync` returns an `HttpResult` with `application/pdf` and the correct content-disposition filename. Pass `inline: true` to display it in the browser instead of downloading.

### IPdfRenderer

```csharp
public interface IPdfRenderer
{
    bool IsAvailable { get; }
    List<string> GetTemplateNames();
    string ResolvePath(string name, string ext = ".typ", bool mustExist = true);

    Task<byte[]> RenderAsync(string name, string? dataJson = null,
        PdfRenderOptions? options = null, CancellationToken token = default);

    Task RenderToStreamAsync(string name, Stream output, string? dataJson = null,
        PdfRenderOptions? options = null, CancellationToken token = default);

    Task<byte[]> RenderPngAsync(string name, string? dataJson = null, int page = 1,
        int? ppi = null, CancellationToken token = default);
}
```

Typed extension methods work from a `[Pdf]`-annotated model:

```csharp
byte[] bytes = await pdf.RenderPdfAsync(invoice);
await pdf.RenderPdfAsync(invoice, outputStream);
HttpResult result = await pdf.PdfResultAsync(invoice, "Invoice-1001.pdf");
```

### Render options

`PdfRenderOptions` is passed to Typst as `sys.inputs.options`, letting templates and versioned libraries agree on their own rendering context without expanding the renderer API:

```csharp
var bytes = await pdf.RenderPdfAsync(invoice, new PdfRenderOptions {
    Language = "de",
    Region = "DE",
});
```

### How data reaches the template

Data rides Typst's `--input data=<json>`, which the shared library's `load-data()` reads before falling back to the template's `.json` sidecar. Nothing is written to disk, so concurrent renders of the same template can't clobber each other - which is also why `MaxDataBytes` stays conservative at 64 KB: argv is capped well below 128 KB once the environment is counted.

### Errors

```csharp
try
{
    return await pdf.PdfResultAsync(invoice);
}
catch (PdfRenderException e)
{
    Log.LogError("typst exit {Code}: {Diagnostics}", e.ExitCode, e.Diagnostics);
    throw;
}
```

`Diagnostics` carries raw typst stderr, so an author can be shown the actual compile errors.

## Rendering from background jobs

```csharp
[Worker("smtp")]
public class SendInvoiceEmailCommand(
    IPdfRenderer pdf,
    SmtpConfig config,
    IDbConnectionFactory dbFactory)
    : AsyncCommand<SendInvoiceEmail>
{
    protected override async Task RunAsync(SendInvoiceEmail request, CancellationToken token)
    {
        using var db = await dbFactory.OpenAsync(token: token);
        var order = await db.LoadSingleByIdAsync<Order>(request.OrderId, token: token);

        var invoice = MapToInvoice(order);
        var bytes = await pdf.RenderPdfAsync(invoice, token);

        // Attach bytes to your email message and send it...
    }
}
```

Queue an **identifier, not rendered PDF bytes** - the worker loads current data and renders inside the job, keeping persisted job messages small and retryable. This pattern suits scheduled statements, order confirmations, certificates and reports.

## Deterministic by construction

At runtime:

1. The `[Pdf]` model selects the template.
2. The model serializes to its JSON contract.
3. `IPdfRenderer` invokes the published Typst template.
4. **No LLM is called.**
5. **No personal Studio workspace is read.**
6. Only the live files in `App_Data/pdf` are used.

## Production controls

PDF rendering starts external Typst processes, so `PdfFeature` includes practical operational limits: render and preview timeouts, maximum concurrent renders, maximum data payload size, a restricted Typst root directory, flat validated template names, Admin role requirements on every Admin PDF API, per-user path-checked Studio workspaces and publish-time validation on by default.

:::info
Pin the Typst version and deploy the same fonts used during validation. Put application fonts in `App_Data/pdf/fonts` and back up live artifacts, `.published.json` and `.versions` together.

Typst's root restriction limits document file access but is **not** an operating-system sandbox. Organizations compiling untrusted templates should isolate compilation in an appropriate container or worker.
:::

## Scope

The built-in feature generates PDFs from Typst templates: authoring, AI editing, compilation, publishing, revisions, schema validation, code generation, PDF/PNG rendering and delivery.

It is **not** a general PDF manipulation library. Merging, splitting, encryption, digital signatures, PDF/A, AcroForm filling, OCR and structural import belong in a dedicated PDF library or a custom `IPdfRenderer` pipeline - which you can substitute wholesale:

```csharp
services.AddPlugin(new PdfFeature {
    Renderer = new MyPdfRenderer(),
});
```

<screenshot src="/img/pages/chat/pdf/pdf-lifecycle.webp" title="ServiceStack PDF lifecycle"></screenshot>
