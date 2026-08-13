---
title: AutoQuery CRUD UI
---

The `/auto` pages provide a schema-driven browser and CRUD UI for the AutoQuery data models available to the current user. They are served by ServiceStack's existing `MetadataFeature`; no separate plugin or frontend build is required.

Open `/auto` to browse models, or `/auto/{ModelName}` to work with a specific model:

<screenshot src="/img/pages/autoquery-schema/booking-grid.webp" title="The generated Booking CRUD UI at /auto/Booking"></screenshot>

## Routes

| Route | Response |
| --- | --- |
| `GET /auto` | Searchable HTML catalog of available AutoQuery models |
| `GET /auto.json` | Model catalog as JSON |
| `GET /auto/{ModelName}` | HTML query and CRUD UI for a model |
| `GET /auto/{ModelName}.json` | Model-level AutoQuery schema |

The catalog and individual schemas are generated for each request. Models and operations that are not available to the current authenticated user are omitted.

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

## Model schema

`/auto/Booking.json` returns a model envelope containing the data model and the API schemas used to operate on it:

```json
{
  "name": "Booking",
  "title": "Booking",
  "primaryKey": "Id",
  "model":  { "type": "object", "properties": {} },
  "query":  { "$id": "/api/QueryBookings", "method": "GET", "operation": "Query" },
  "create": { "$id": "/api/CreateBooking", "method": "POST", "operation": "Create" },
  "update": { "$id": "/api/UpdateBooking", "method": "PATCH", "operation": "Patch" },
  "delete": { "$id": "/api/DeleteBooking", "method": "DELETE", "operation": "Delete" }
}
```

| Member | Purpose |
| --- | --- |
| `name` | Data model type name |
| `title` | Display title derived from metadata or the model name |
| `primaryKey` | Property used to identify and deep-link rows |
| `model` | Writable model schema used by CRUD forms |
| `viewModel` | Optional projected result type for `IQueryDb<From, Into>` queries |
| `query` | Query API schema; required for the model to be listed |
| `create`, `update`, `delete`, `save` | Authorized write API schemas, when available |

Each operation is a complete [API Schema](/schema), including its request fields, validation constraints, HTTP method, route and UI metadata.

## Query UI

The generated query view supports:

- Server-side paging and sorting
- AutoQuery filters and multiple filter expressions
- Selectable columns and page sizes
- Deep links through query-string state
- Per-model preferences stored in the browser
- Formatting supplied by `[Intl]` and `[Format]`

For example:

<text-block text="/auto/Booking?RoomType=Queen&amp;orderBy=-BookingStartDate&amp;skip=20"></text-block>

<screenshot src="/img/pages/autoquery-schema/grid-filters.webp" title="AutoQuery filters, ordering and pagination"></screenshot>

## Create, edit and delete

Forms are generated independently from each write API. This is important when Create and Update DTOs expose different fields or validation rules.

- Create uses the `create` schema.
- Edit prefers Patch, then Update or Save when available.
- Patch sends changed fields only.
- Clearing an existing value uses ServiceStack's `reset` instruction where necessary.
- Delete is shown only when an authorized Delete API exists and requires confirmation.

Server-side validation remains authoritative. Validation failures are returned as normal ServiceStack `ResponseStatus` field errors and displayed beside their inputs.

## References and lookup controls

`[Ref]`, `[References]` and foreign-key metadata can render searchable lookup controls. Referenced schemas are loaded on demand from `/auto/{ReferencedModel}.json`, keeping the initial model schema small.

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

<screenshot src="/img/pages/autoquery-schema/customer-lookup.webp" title="A reference lookup generated from model metadata"></screenshot>

## Authorization

`/auto` is a client of the same APIs as any other UI. It does not bypass API authorization:

- The catalog omits models without an accessible Query API.
- A model schema omits write operations the caller cannot access.
- The API revalidates authentication, roles, permissions and validation rules when invoked.
- APIs excluded from metadata are not included.

The generated UI is therefore caller-specific, but the Service remains the final security boundary.

## Customize generated controls

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

Useful metadata includes `[Description]`, `[Input]`, validation attributes, `[Ref]`, `[References]`, `[Intl]` and `[Format]`.

To modify the generated envelope programmatically:

```csharp
services.ConfigurePlugin<MetadataFeature>(feature => {
    feature.OnAutoQuerySchema = (dataModel, schema) => {
        if (dataModel == typeof(Booking))
            schema["title"] = "Room Bookings";
    };
});
```

## Disable `/auto`

The AutoQuery schema routes can be disabled without disabling `/schema`:

```csharp
services.AddServiceStack(typeof(MyServices).Assembly, options => {
    var metadata = options.Plugins.OfType<MetadataFeature>().First();
    metadata.DisableAutoQuerySchema = true;
});
```

`MetadataFeature.IsAutoQuerySchemaEnabled` reports whether the routes are registered.

## Embed the Vue component

The built-in page uses the `AutoQuerySchema` component from `@servicestack/vue`. It can also be used in an application's own Vue UI:

```html
<script setup>
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

## Embed the React component

The React package provides the equivalent `AutoQuerySchema` component. Pass it the model schema and a `JsonServiceClient` for the App serving the AutoQuery APIs:

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

Install the required packages with:

<shell-command>npm install @servicestack/react @servicestack/client</shell-command>

## Related documentation

- [AutoQuery Schema overview](/autoquery-schema) — architecture, components and broader use cases
- [API Schema](/schema) — per-Request DTO schemas used by every CRUD operation
- [AutoQuery RDBMS](/autoquery/rdbms) — defining Query and CRUD APIs
- [Locode](/locode/) — standalone metadata-driven data management UI
