---
title: API Schema UI
---

Open `/schema` in any **.NET 8+** ServiceStack App and you'll find a searchable index of every API the signed-in user can call. Open one and you get a working UI for it - form, validation, request preview, `curl` command, execution and response - with no code written and nothing installed.

<screenshot src="/img/pages/api-schema/api-schema-query-bookings.webp" title="A complete QueryBookings UI rendered and executed from its API Schema"></screenshot>

The page isn't special. It fetches one small JSON document and hands it to a generic component:

```html
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ApiFormSchema } from '@servicestack/vue'

const schema = ref()
onMounted(async () =>
    schema.value = await fetch('/schema/CreateCoffeeShopOrder.json').then(r => r.json()))
</script>

<template>
  <ApiFormSchema v-if="schema" :schema="schema" />
</template>
```

That's the whole integration - for that API, and every other one. The component never learns anything about `CreateCoffeeShopOrder`; the fetched schema supplies the fields, controls, validation, HTTP method and execution URL.

It's also what lets [AI Chat](/chat/) render a trustworthy approval form for any API a Model proposes calling, without anyone building a Chat component per Request DTO.

## Two complementary endpoints

| Route | Response |
| --- | --- |
| `{HTTP Method} /api/{RequestDto}` | Execute - send the typed Request DTO and receive its response |
| `GET /schema` | Searchable HTML catalog of APIs available to the caller |
| `GET /schema.json` | That catalog as JSON |
| `GET /schema/{RequestDto}` | The contract, served as a complete executable HTML workbench |
| `GET /schema/{RequestDto}.json` | The portable JSON Schema contract a generic UI or tool needs |

`/api/{RequestDto}` **executes** the API; `/schema/{RequestDto}.json` explains how to use it. For example, `GET /schema/QueryBookings.json` describes how to invoke `GET /api/QueryBookings`; it does not execute it. The schema carries the API's fields, nested types, validation, authorization requirements, HTTP method and an `$id` pointing back at its execution URL.

These routes belong to the existing [Metadata feature](/metadata-page), so there's **no separate schema plugin** and no frontend project to install.

## Browse every API at /schema

The built-in API browser is a fast searchable launcher designed for large applications. APIs can be filtered by Request DTO name, title, description, tag and HTTP verb, with fuzzy matching that understands the PascalCase names used by Request DTOs.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Search and discover every API available to the current user': '/img/pages/api-schema/api-schema-browser.webp',
    'Filtered by the CoffeeShop tag': '/img/pages/api-schema/coffee-shop-filter.webp',
}"></screenshots-gallery>

APIs excluded from metadata or unavailable to the caller are omitted, so signing in can change the catalog when additional role- or permission-protected APIs become available.

Because the page is generated at runtime it always reflects the application that's actually deployed, which makes it useful throughout an App's lifecycle:

- Developers can explore an unfamiliar codebase without hunting for Service classes.
- Frontend developers can invoke APIs before their production UI exists.
- Testers can reproduce requests and validation errors without writing a client.
- Support teams can use approved operational APIs directly.
- API designers can see immediately whether their descriptions and validation produce a clear experience.
- AI developers can inspect the exact schemas exposed to Models and approval forms.

## What's in a schema

The schema is based on **JSON Schema Draft-07**, but describes more than the structural shape of a DTO - it contains enough to construct and invoke the API without loading ServiceStack's full metadata document.

| Key | Description |
| --- | --- |
| `$schema` | The JSON Schema dialect |
| `$id` | The stable pre-defined API route, e.g. `/api/CreateCoffeeShopOrder` |
| `request` | The Request DTO name |
| `operation` | Which AutoQuery/CRUD operation this is, e.g. `Query`, `Create`, `Patch` |
| `method` | The HTTP method to call it with |
| `title` | From `[Api]`, `[Description]`, or the humanized DTO name |
| `description` | From `[Notes]` or `[Description]` |
| `type`, `properties` | The object shape, including nested objects and collections |
| `required` | Required fields |
| `ui` | Control hints, help text, placeholders, layouts, lookups, uploads and formatting |

Standard JSON Schema constraints such as `minimum`, `maximum`, `minLength`, `maxLength`, `pattern`, `format`, `enum`, `minItems` and `maxItems` are included when present in ServiceStack metadata, along with enum and allowable values and the API's authorization requirements.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "/api/CreateCoffeeShopOrder",
  "request": "CreateCoffeeShopOrder",
  "method": "POST",
  "title": "Submit a Coffee Shop Order",
  "description": "Submits a validated coffee shop order",
  "type": "object",
  "required": ["CustomerName", "Items"],
  "properties": {
    "CustomerName": {
      "type": "string",
      "title": "Name to put on the order"
    },
    "Items": {
      "type": "array",
      "title": "Final order items",
      "items": {
        "type": "object",
        "properties": {
          "ProductId": { "type": "integer", "minimum": 1 },
          "Quantity": { "type": "integer", "minimum": 1 }
        }
      }
    }
  },
  "ui": {
    "submitLabel": "Create Coffee Shop Order"
  }
}
```

:::info
`$id` is deliberately the **pre-defined route** (`/api/{RequestDto}`) rather than a custom `[Route]`. The pre-defined route always exists, never changes, and accepts every property in the body or query string - so it doubles as the URL to call. A custom `[Route]` can put properties in the path, which a generic client would have to reassemble.
:::

## Built to scale beyond thousands of APIs

ServiceStack's [API Explorer](/api-explorer) at `/ui` loads the full `MetadataApp` document - every operation, DTO, data model and related type - before it can show you one API. That's convenient at smaller scales and increasingly expensive at larger ones.

API Schemas invert that dependency:

<text-block :rows="[
  ['/schema','Compact authorized API catalog'],
  ['/schema/CreateBooking.json','Only the schema needed for CreateBooking'],
  ['/schema/QueryInvoices.json','Only the schema needed for QueryInvoices']]"></text-block>

Opening an API loads **only** the schema required to render and invoke that operation. Nested DTOs the form needs are encapsulated within that schema, whilst unrelated APIs and models never enter the page.

- **Smaller payloads** - one focused contract instead of the entire metadata graph.
- **Lower parsing and memory costs** - the browser only materializes types visible in the current UI.
- **No giant JavaScript arguments** - schemas are fetched and parsed as ordinary JSON.
- **Faster first use** - search a compact catalog and open one API without waiting for every definition.
- **Independent caching** - individual schemas can be cached and invalidated separately.
- **Bounded UI complexity** - rendering cost is set by the selected API, not the App's total size.

An application can grow from ten APIs to ten thousand without making a single API form ten thousand times heavier.

<screenshot src="/img/pages/api-schema/schema-architecture.webp" title="API Schema catalog architecture"></screenshot>

This is the same **progressive disclosure** model used by [API Tools](/chat/api-tools):

<text-block text="Discover broadly → Describe selectively → Load only what is needed"></text-block>

For traditional UIs this protects browser resources. For AI it protects the Model's finite context window.

## Existing metadata becomes a richer UI

ServiceStack derives the document from the same metadata used by API Explorer and generated clients:

| ServiceStack metadata | Schema output |
| --- | --- |
| `[Api]`, `[Description]`, `[Notes]` | API and field titles/descriptions |
| Property types and nullability | JSON Schema types and `required` |
| Validation attributes and validators | Structural constraints and validation hints |
| `[Input]` | Widget, layout, placeholder, help and allowable values |
| Enums | Selectable values and labels |
| `[Ref]`, `[References]` | Reference lookup metadata |
| `[Intl]`, `[Format]` | Display formatting |
| Auth attributes | Authentication, role, permission, claim and scope requirements |

So API Schemas reward the metadata already present in well-designed ServiceStack APIs:

```csharp
[Tag("CoffeeShop")]
[Description("Submits a validated coffee shop order")]
[Route("/coffee-shop/orders", "POST")]
public class CreateCoffeeShopOrder : IPost, IReturn<CreateCoffeeShopOrderResponse>
{
    [Description("Name to put on the order")]
    [ValidateNotEmpty]
    public string CustomerName { get; set; } = "";

    [Description("Optional instructions applying to the whole order")]
    [Input(Type = "textarea", Placeholder = "e.g. call when ready")]
    public string? Notes { get; set; }

    [Description("Final order items")]
    [ValidateNotEmpty]
    public List<OrderItemRequest> Items { get; set; } = [];
}
```

The generated form uses the descriptions as labels and help text, marks required values, renders `Notes` as a textarea and turns `Items` into an editable nested form.

Other metadata unlocks richer controls:

- Enums and `[ApiAllowableValues]` become constrained selections.
- `[ValidateGreaterThan]`, `[ValidateLength]`, `[Range]` and related validators become client constraints.
- `[Input]` and `[Field]` select widgets, placeholders, help text, steps and layout.
- `[Ref]`, `[References]` and foreign keys become searchable lookup UIs.
- `[UploadTo]` becomes a file input with accepted file types.
- `[Intl]` and `[Format]` describe how values should be displayed.
- `[FieldCss]` and API form layouts control responsive presentation.
- `[Authenticate]`, roles, permissions, claims and scopes describe who can invoke the API.

None of this is specific to the schema page - it continues to improve ServiceStack's other [Auto UIs](https://servicestack.net/auto-ui), API Explorer and generated clients.

## A complete API workbench

The UI at `/schema/{RequestDto}` is more than a generated form. As values are entered it shows the exact request that will be sent, and can switch to a copyable `curl` command to reproduce it from a terminal. It provides:

- A generated request form
- Client-side presentation of validation constraints
- Nested object, collection, enum, date, upload and lookup controls
- A request preview and copyable `curl` command
- API execution and formatted response output
- Server validation errors mapped back to fields

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
  'Generated curl request and response': '/img/pages/api-schema/curl-response.webp',
  'Nested schema-generated form': '/img/pages/api-schema/nested-form.webp',
}"></screenshots-gallery>

Submitting uses the method and `$id` from the schema - `GET` and `DELETE` values are encoded in the query string, write requests use JSON, and APIs containing file inputs are sent as multipart form data. The response panel shows status, size, duration and formatted JSON, with ServiceStack validation errors bound back to their corresponding fields.

The page remains a normal client of the API. All authentication, authorization, request filters and validation still run on the server when the request is submitted.

### Shareable, executable queries

Query-string values pre-populate the form, making API examples shareable as ordinary links:

<text-block text="/schema/QueryBookings?RoomType=Queen&amp;Take=5"></text-block>

For `GET` APIs, opening a populated link can execute the request immediately. After submission the URL is updated with non-empty values, producing a durable, reloadable API query.

## Powered by reusable Vue and React components

The built-in pages aren't a separate UI framework - they're composed from the same components published in `@servicestack/vue` and `@servicestack/react`.

`ApiFormSchema` is the generic executable API UI. It renders only the form, leaving the surrounding workbench to the host page. Everything else it derives - the HTTP request preview, its `curl` equivalent, the request, the result and any error - is passed to its **default slot**, and completed calls emit `success` and `error` events:

```html
<ApiFormSchema :schema="schema" v-model="request">
  <template #default="{ requestText, curl, result, error, loading }">
    <pre>{{ requestText }}</pre>
    <pre>{{ curl }}</pre>
    <pre v-if="result">{{ result.status }} · {{ result.ms }}ms · {{ result.size }}</pre>
    <pre v-if="result">{{ result.text }}</pre>
  </template>
</ApiFormSchema>
```

| Component | Purpose |
| --- | --- |
| `ApiFormSchema` | The generic executable API form |
| `ApiExplorerSchema` | The full workbench the built-in `/schema/{RequestDto}` page is built from |
| `JsonSchemaForm` | Lower-level renderer for arbitrary JSON Schema values |

`ApiFormSchema` also accepts a `client` for authenticated calls, `auto-execute` to run `GET` APIs on load, and `sync-url` to keep current values in the address bar.

Both libraries export the same component names, so the snippet above translates directly to React - here its render prop is used to build a custom result UI:

```tsx
import { useEffect, useMemo, useState } from 'react'
import { JsonServiceClient } from '@servicestack/client'
import { ApiFormSchema, JsonView } from '@servicestack/react'

export default function HelloForm() {
  const client = useMemo(() => new JsonServiceClient('/'), [])
  const [schema, setSchema] = useState<any>()

  useEffect(() => {
    fetch('/schema/Hello.json', { credentials: 'include' })
      .then(r => r.json())
      .then(setSchema)
  }, [])

  if (!schema) return null

  return (
    <ApiFormSchema schema={schema} client={client} value={{ Name: 'React' }}>
      {({ result, requestText, curl }) => (
        <section>
          <pre>{requestText}</pre>
          <details>
            <summary>curl</summary>
            <pre>{curl}</pre>
          </details>
          {result && <JsonView value={result.json ?? result.text} />}
        </section>
      )}
    </ApiFormSchema>
  )
}
```

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
  'Vue JSON Schema components': '/img/pages/api-schema/vue-jsonschema.webp',
  'React JSON Schema components': '/img/pages/api-schema/react-jsonschema.webp',
}"></screenshots-gallery>

:::sh
npm install @servicestack/vue
:::

:::sh
npm install @servicestack/react
:::

See [Vue JSON Schema](/vue/json-schema) and the [React Schema gallery](https://react.servicestack.net/gallery/schema).

## One schema can describe any UI

The most valuable property of this design is that the schema isn't tied to the built-in page. It's a portable description of an interaction, and any renderer can map the same structure and UI hints into its own native controls:

- A web form can use text fields, selectors, date pickers and nested panels.
- A mobile App can render platform-native inputs.
- A desktop administration tool can build property editors.
- A terminal client can ask interactive questions.
- A workflow engine can generate configuration steps.
- A test tool can synthesize valid requests and boundary cases.
- An AI Assistant can render a human approval form for a proposed tool call.

### Approval UIs in AI Chat

Because the renderer is generic, [AI Chat](/chat/api-tools) creates a Request preview and Approval UI on demand for **any API it can discover**. When a Model proposes a write operation the arguments are rendered with the same schema components used by the standalone API UI, so the user sees an editable form instead of an opaque JSON blob.

<screenshot src="/img/pages/api-schema/chat-approval.webp" title="CoffeeShop schema approval form in AI Chat"></screenshot>

New APIs gain the same preview and approval capability as soon as their schema is available - there's no per-DTO Chat component to write.

## Authorization remains server-owned

Schema discovery respects the current request and authenticated session. APIs excluded from metadata or inaccessible to the caller are not presented as available capabilities.

Schemas carry the API's authentication requirements, which help UIs explain *why* an operation is unavailable:

- `requiresAuth`
- `requiresApiKey`
- `requiredRoles` and `requiresAnyRole`
- `requiredPermissions` and `requiresAnyPermission`
- `requiredClaims`
- `requiredScopes`

These details **do not replace enforcement**. The API remains the final authorization boundary: authorization is checked again when `/api/{RequestDto}` is called, so presentation adapts to the caller whilst security stays deterministic and server-side.

## API Schema and `/auto`

An API Schema describes one Request DTO. An [AutoQuery Schema](/autoquery-schema) groups the model schema with all authorized Query, Create, Update, Patch, Delete and Save API Schemas needed to build a CRUD UI.

| Surface | Scope |
| --- | --- |
| `/schema/{RequestDto}.json` | One API operation |
| `/auto/{ModelName}.json` | One data model and its authorized AutoQuery operations |

## Configuration

The schema routes belong to the Metadata feature, and each set can be disabled independently:

```csharp
services.AddServiceStack(typeof(MyServices).Assembly, options => {
    var metadata = options.Plugins.OfType<MetadataFeature>().First();
    // Don't register /schema and /schema/{RequestDto}
    metadata.DisableApiSchema = true;
    // Don't register /auto and /auto/{DataModel}
    metadata.DisableAutoQuerySchema = true;
});
```

`IsApiSchemaEnabled` and `IsAutoQuerySchemaEnabled` report which are registered. Disabling the HTML pages doesn't affect the JSON contract used by AI Chat and your own components.

Schemas can also be augmented before they're returned. Because there's only one schema, a change applies everywhere it's used - the JSON contract, the built-in UI, your own components and any AI approval form rendered from it:

```csharp
services.ConfigurePlugin<MetadataFeature>(feature => {
    feature.OnApiSchema = (requestType, schema) => {
        if (requestType == typeof(CreateCoffeeShopOrder))
            schema["ui"]!["submitLabel"] = "Place Order";
    };
});
```

Prefer declarative DTO metadata when the change belongs to the API contract. Use `OnApiSchema` for application-wide conventions or cases that cannot be expressed with attributes.

## Get Started

There's nothing to install - API Schemas are part of the Metadata feature, so any .NET 8+ ServiceStack App already serves them. Run your App and open:

<text-block :rows="['/schema','/schema/{RequestDto}','/schema.json','/schema/{RequestDto}.json']"></text-block>

The fastest way to see the value is to open `/schema` on an App you already have and search for an API you wrote months ago. Whatever descriptions and validation you gave it then are the UI you get now.

<screenshot src="/img/pages/api-schema/schema-overview.webp" title="API Schema UI overview"></screenshot>

## Related

- [AutoQuery CRUD UI](/autoquery-schema) - the model-level equivalent for AutoQuery CRUD APIs
- [API Explorer](/api-explorer) - the full metadata-driven API UI at `/ui`
- [API Tools](/chat/api-tools) - how AI Models discover and call these same APIs
- [Metadata page](/metadata-page) - ServiceStack API metadata configuration
