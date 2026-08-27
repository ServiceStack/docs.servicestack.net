---
title: AutoQuery CRUD UI
---

<screenshot src="/img/pages/autoquery-schema/autoquery-schema-info.webp"></screenshot>

If your App has [AutoQuery](/autoquery/rdbms) APIs, open `/auto` in any **.NET 8+** ServiceStack App and you already have an admin application: a searchable list of your data models, and behind each one a working CRUD app with a results grid, paging, sorting, filters, saved preferences, Create and Edit forms, reference lookups and guarded Delete actions.

<screenshots-gallery-view grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Searchable data model gallery': '/img/pages/autoquery-schema/auto-gallery.webp',
    'Job Applications': '/img/pages/autoquery-schema/auto-job-applications.webp',
    'Job Application': '/img/pages/autoquery-schema/auto-job-application.webp',
}"></screenshots-gallery-view>

No frontend project, no generated source files, no scaffolding step. Every action it offers is one the signed-in user is **authorized** to perform, because the page is assembled at runtime from your APIs and the current session.

That changes what a data UI costs. A back-office screen that would have been a sprint of grid, form, validation, lookup and permission work is now the thing you get *before* deciding whether a bespoke UI is worth building.

## Model-level, not API-level

Where an [API Schema](/api-schema) describes how one `/api/{RequestDto}` endpoint can be rendered and executed, an **AutoQuery Schema** describes the whole data capability: its Query API, returned model and every authorized Create, Update, Patch, Delete or Save API.

| Route | Response |
| --- | --- |
| `GET /auto` | Every AutoQuery data model available to the current user |
| `GET /auto.json` | The model catalog as JSON |
| `GET /auto/{ModelName}` | A complete authorized CRUD App for one model |
| `GET /auto/{ModelName}.json` | The model-level schema envelope |

The integration is deliberately small - fetch that one document and give it to the generic component:

```html
<AutoQuerySchema :schema="schema" />
```

These routes belong to the existing [Metadata feature](/metadata-page), so there's nothing to install. The catalog and individual schemas are generated for each request, and models and operations that are not available to the current authenticated user are omitted.

## Requirements

The UI is available in .NET 8+ ServiceStack Apps that have:

- `MetadataFeature` enabled
- A registered AutoQuery feature
- At least one AutoQuery Query API

A model needs an authorized Query API to appear in `/auto`. Create, Update, Patch, Delete and Save controls are added only when corresponding authorized AutoQuery CRUD APIs exist.

For example, these services produce a query grid with Create, Patch and Delete actions:

```csharp
public class QueryBookings : QueryDb<Booking> {}
public class CreateBooking : ICreateDb<Booking>, IReturn<IdResponse>
{
    public string Name { get; set; }
    public RoomType RoomType { get; set; }
    public DateTime BookingStartDate { get; set; }
    public DateTime BookingEndDate { get; set; }
}
public class UpdateBooking : IPatchDb<Booking>, IReturn<IdResponse>
{
    public int Id { get; set; }
    public string? Name { get; set; }
}
public class DeleteBooking : IDeleteDb<Booking>, IReturnVoid
{
    public int Id { get; set; }
}
```

## The schema envelope

`/auto/Booking.json` combines a model and every API available for working with it:

```json
{
  "name": "Booking",
  "title": "Booking",
  "primaryKey": "Id",
  "model":  { "type": "object", "properties": {} },
  "query":  { "$id": "/api/QueryBookings", "method": "GET",    "operation": "Query",  "properties": {} },
  "create": { "$id": "/api/CreateBooking", "method": "POST",   "operation": "Create", "properties": {} },
  "update": { "$id": "/api/UpdateBooking", "method": "PATCH",  "operation": "Patch",  "properties": {} },
  "delete": { "$id": "/api/DeleteBooking", "method": "DELETE", "operation": "Delete", "properties": {} }
}
```

| Key | Description |
| --- | --- |
| `name` | The data model type name |
| `title` | From `[Description]`, or the humanized model name |
| `primaryKey` | Which property identifies a row, so UIs can deep link to one |
| `model` | The writable model schema used by CRUD forms |
| `viewModel` | Only present when the query returns a **different** shape |
| `query` | The Query API - required; without access there is no schema |
| `create` `update` `delete` `save` | Present only when an authorized API exists |

Each of those API entries is a full [API Schema](/api-schema), including its request fields, validation constraints, HTTP method, route and UI metadata - so the same generic form components render them.

:::info
`viewModel` matters when a query joins, projects or enriches stored data. Rows returned by `IQueryDb<From, Into>` are the `Into` type, whilst Create/Update/Delete still write through the `From` type - so grids display the returned view whilst forms use the writable model.
:::

<screenshot src="/img/pages/autoquery-schema/tag-filter.webp" title="AutoQuery data models filtered by tag"></screenshot>

## A full AutoQuery grid with no frontend code

The results grid calls the schema's Query API and provides:

- Server-side paging and per-column sorting
- AutoQuery's typed filter conventions and multiple filter expressions
- Selectable visible columns and configurable page sizes
- Formatted values from `[Intl]` and `[Format]` metadata
- Persistent per-model preferences stored in the browser
- Deep links through query-string state
- Responsive light/dark modes

Query state is kept in the URL, so a filtered view can be bookmarked, refreshed or shared:

<text-block text="/auto/Booking?RoomType=Queen&amp;orderBy=-BookingStartDate&amp;skip=20"></text-block>

That URL is not a screenshot of transient client state - it's a durable link back to the same server-side query.

<screenshots-gallery-view class="not-prose mb-8" grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Grid filters, ordering and pagination': '/img/pages/autoquery-schema/grid-filters.webp',
    'Query preferences': '/img/pages/autoquery-schema/query-preferences.webp',
    'Grid filters dialog': '/img/pages/autoquery-schema/grid-filters-dialog.webp',
    'Grid filtered results': '/img/pages/autoquery-schema/grid-filters-results.webp',
}"></screenshots-gallery-view>

## Schema-driven Create, Edit and Delete

Forms are generated independently from each write API. This matters when Create and Update DTOs expose different fields or validation rules - each form preserves the exact behavior of its own API, with required values and validation constraints shown before submission, server validation errors bound back to their fields, enums and allowable values as selections, editable nested objects and collections, multipart uploads for file properties, and HTTP methods and payloads taken from the schema.

- Create uses the `create` schema.
- Edit prefers Patch, then Update or Save when available.
- Delete is shown only when an authorized Delete API exists, and requires confirmation.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Generated Create Booking form': '/img/pages/autoquery-schema/create-booking.webp',
    'Edit dialog with guarded delete': '/img/pages/autoquery-schema/edit-booking.webp',
}"></screenshots-gallery>

Patch APIs receive **only changed values**. When a user clears an existing field the UI adds ServiceStack's `reset` instruction so the server can distinguish *"set this to empty"* from *"leave this field unchanged"* - the kind of edge case custom CRUD UIs frequently get wrong, solved once for every model.

Server-side validation remains authoritative. Validation failures are returned as normal ServiceStack `ResponseStatus` field errors and displayed beside their inputs.

## References become live lookup UIs

Foreign keys are often where generated CRUD tools stop feeling like real applications. Asking a user to remember that *"Customer 1042"* is *"Acme Inc."* is technically accurate and practically unusable.

AutoQuery Schemas preserve reference metadata from `[Ref]`, `[References]`, `[ForeignKey]` and related attributes. The renderer displays a lookup control that resolves the current label and opens a full searchable picker for the referenced model - with the same paging, sorting, filters and column preferences as the main grid.

```csharp
public class Booking
{
    public int Id { get; set; }

    [References(typeof(Customer))]
    public int CustomerId { get; set; }

    [Reference]
    public Customer Customer { get; set; }
}
```

<screenshot src="/img/pages/autoquery-schema/customer-lookup.webp" title="Reference lookup opened from the Booking form"></screenshot>

Referenced model schemas are loaded on demand from `/auto/{ReferencedModel}.json`, so the parent schema stays compact.

## Authorization shapes the App

`/auto` is a client of the same APIs as any other UI - it does not bypass API authorization. The catalog, model schema and CRUD UI are all generated for the current authenticated session:

- A model is only listed when its Query API can be accessed.
- **Query access is required** - without it, requesting the schema returns 401 or 403.
- Create appears only when the user can call the Create API.
- Rows become editable only when Update or Patch is available.
- Delete appears only when the selected Delete API is authorized.
- APIs excluded from metadata are not included.
- Each action can carry different roles, permissions, claims, scopes or API-key requirements.

This is more precise than a single *"admin page"* permission. A support user may have read access, an operator may create and edit, and an administrator may also delete - all from the same generated UI.

The generated UI is therefore caller-specific, but the API remains the final security boundary: authentication, roles, permissions and validation rules are all revalidated when it's invoked.

## Conventions for real AutoQuery APIs

ServiceStack derives the most useful CRUD surface from whichever API shapes are available:

| Convention | Behavior |
| --- | --- |
| Query API | Required - it's what grants access to the schema at all |
| Update | `IPatchDb<T>` is preferred over `IUpdateDb<T>` when both exist |
| Delete | A single-row delete is preferred over a bulk delete |
| Availability | Operations are included only when they exist **and** are authorized |
| Primary key | Discovered from `[PrimaryKey]`, `[AutoIncrement]`, `Id` or `{Model}Id` |
| View models | Represented separately when they differ from the write model |

## Where this fits alongside Locode

|  | `/auto` | [Locode](/locode/) | Custom UI |
| --- | --- | --- | --- |
| **Best for** | Embedding data UIs in your own App | A complete standalone admin App | Product surfaces users live in |
| **Loads** | One model's schema at a time | The App's full metadata | Whatever you build |
| **Customization** | Compose the Vue/React components yourself | Locode's customization model | Total |
| **Runs where** | Built-in page *or* inside your App | Built-in page | Your App |

They aren't competing and neither is going away. Locode remains the fuller standalone back-office experience. `/auto` is the schema-driven equivalent that scales to very large API surfaces and - the part that matters most - can be *taken apart*: the grid, the forms, the lookups and the field inputs are components you can drop into your own application's navigation and design system.

## Customize the generated controls

The UI consumes the metadata already attached to Request DTOs and data models. Use the same attributes used by API Explorer and AutoQuery components:

```csharp
public class CreateBooking : ICreateDb<Booking>, IReturn<IdResponse>
{
    [Input(Type = "select", EvalAllowableValues = "['Single','Queen','Suite']")]
    public RoomType RoomType { get; set; }

    [ValidateGreaterThan(0)]
    public decimal Cost { get; set; }
}
```

Useful metadata includes `[Description]`, `[Input]`, validation attributes, `[Ref]`, `[References]`, `[Intl]` and `[Format]`. To get more out of the generated UIs, improve the **APIs** rather than the UI - the same metadata also improves API Explorer and every generated client.

## Use AutoQuerySchema in your own Apps

The built-in page uses the `AutoQuerySchema` component from `@servicestack/vue`. It can also be used in your own Vue UI:

```html
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AutoQuerySchema } from '@servicestack/vue'

const schema = ref()

onMounted(async () => {
    schema.value = await fetch('/auto/Booking.json').then(r => r.json())
})
</script>

<template>
  <AutoQuerySchema v-if="schema" :schema="schema" />
</template>
```

`@servicestack/react` ships the same components with the same names. Pass it the model schema and a `JsonServiceClient` for the App serving the AutoQuery APIs:

```tsx
import { useEffect, useMemo, useState } from 'react'
import { JsonServiceClient } from '@servicestack/client'
import { AutoQuerySchema } from '@servicestack/react'

export default function Bookings() {
  const client = useMemo(() => new JsonServiceClient('/'), [])
  const [schema, setSchema] = useState<any>()

  useEffect(() => {
    fetch('/auto/Booking.json', { credentials: 'include' })
      .then(r => r.json())
      .then(setSchema)
  }, [])

  return schema
    ? <AutoQuerySchema schema={schema} client={client} take={25} />
    : null
}
```

For more specialized experiences, both libraries expose the lower-level components independently:

| Component | Purpose |
| --- | --- |
| `AutoQuerySchema` | The complete CRUD App for one model |
| `SchemaResults` | A schema-powered query grid |
| `SchemaGrid` / `SortableColumn` | Building blocks for a custom results view |
| `SchemaInput` | Individual generated fields |
| `SchemaLookup` | Reference pickers |
| `JsonSchemaForm` | Arbitrary nested JSON Schema forms |

## From database to App in minutes

```csharp
[Tag("Bookings")]
[Route("/bookings", "GET")]
public class QueryBookings : QueryDb<Booking> { }

[ValidateHasRole("Employee")]
[AutoApply(Behavior.AuditCreate)]
public class CreateBooking : ICreateDb<Booking>, IReturn<IdResponse>
{
    [ValidateNotEmpty]
    public string Name { get; set; } = "";

    public RoomType RoomType { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
```

Once the AutoQuery CRUD APIs exist, `/auto/Booking` is immediately useful. Add descriptions, validation, references and input metadata to refine both the APIs **and** their generated experience.

<screenshot src="/img/pages/autoquery-schema/dto-to-crud.webp" title="Schema-generated Booking CRUD application"></screenshot>

## The structured foundation for AI-operated data

Because each write operation carries its own [API Schema](/api-schema), [AI Chat](/chat/api-tools) can render an editable preview and approval form whenever a Model proposes an AutoQuery Create, Update, Patch, Delete or Save - for **every model**, with no per-API Chat component to write.

This supports experiences such as:

- *"Show overdue invoices over $5,000, ordered by customer."*
- *"Find tomorrow's bookings and move this one to the available conference room."*
- *"Create a follow-up task for every high-priority support case assigned to me."*
- *"Find products below their reorder threshold and prepare updates for approval."*

<screenshot src="/img/pages/autoquery-schema/chat-approval.webp" title="Schema-generated approval form"></screenshot>

The grid UI and AI Assistant are two clients over the same typed capability layer: one starts with visual exploration, the other with natural language.

## Configuration

The `/auto` routes belong to the Metadata feature and can be disabled independently of `/schema`:

```csharp
services.AddServiceStack(typeof(MyServices).Assembly, options => {
    var metadata = options.Plugins.OfType<MetadataFeature>().First();
    metadata.DisableAutoQuerySchema = true;
});
```

`MetadataFeature.IsAutoQuerySchemaEnabled` reports whether they're registered. An App can therefore keep its API workbench whilst withholding the AutoQuery data UIs, or the reverse.

Schemas can be augmented before they're returned, which applies everywhere the schema is used:

```csharp
services.ConfigurePlugin<MetadataFeature>(feature => {
    feature.OnAutoQuerySchema = (dataModel, schema) => {
        if (dataModel == typeof(Booking))
            schema["title"] = "Room Bookings";
    };
});
```

## Get Started

Nothing to install. Run your App and open:

<text-block :rows="['/auto','/auto/{ModelName}','/auto.json','/auto/{ModelName}.json']"></text-block>

To embed the components in your own App:

:::sh
npm install @servicestack/vue
:::

:::sh
npm install @servicestack/react
:::

<screenshot src="/img/pages/autoquery-schema/autoquery-overview.webp" title="AutoQuery Schema overview"></screenshot>

## Related

- [API Schema](/api-schema) - the per-API contract each CRUD entry above contains
- [AutoQuery RDBMS](/autoquery/rdbms) - the APIs these UIs are generated from
- [Locode](/locode/) - the standalone metadata-driven admin App
- [API Explorer](/api-explorer) - the full metadata-driven API UI at `/ui`
