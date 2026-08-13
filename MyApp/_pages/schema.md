---
title: API Schema UI
---

The `/schema` pages expose a searchable API catalog and an executable form for each ServiceStack Request DTO. The adjacent `.json` routes return the portable API Schema used to generate those pages.

API Schemas are provided by the existing `MetadataFeature` in .NET 8+ ServiceStack Apps. There is no additional plugin to install.

<screenshot src="/img/pages/api-schema/api-schema-query-bookings.webp" title="The QueryBookings API Schema form and schema document"></screenshot>

## Routes

| Route | Response |
| --- | --- |
| `GET /schema` | Searchable HTML catalog of APIs available to the caller |
| `GET /schema.json` | Authorized API catalog as JSON |
| `GET /schema/{RequestDto}` | Executable HTML workbench for one API |
| `GET /schema/{RequestDto}.json` | JSON Schema contract for one API |

The execution route is separate:

<text-block text="{HTTP Method} /api/{RequestDto}"></text-block>

For example, `GET /schema/QueryBookings.json` describes how to invoke `GET /api/QueryBookings`; it does not execute the API.

## API catalog

`/schema` lists APIs visible to the current request. The catalog supports filtering by Request DTO name, title, description, tag and HTTP method.

<screenshot src="/img/pages/api-schema/api-schema-browser.webp" title="Searchable API Schema catalog"></screenshot>

APIs excluded from metadata or unavailable to the caller are omitted. Signing in can therefore change the catalog when additional role- or permission-protected APIs become available.

## Executable API page

`/schema/{RequestDto}` renders a workbench from a single schema document. It provides:

- A generated request form
- Client-side presentation of validation constraints
- Nested object, collection, enum, date, upload and lookup controls
- A request preview and copyable `curl` command
- API execution and formatted response output
- Server validation errors mapped back to fields

Query-string values initialize the form, making API examples linkable:

<text-block text="/schema/QueryBookings?RoomType=Queen&amp;Take=5"></text-block>

The page remains a normal client of the API. All authentication, authorization, request filters and validation still run on the server when the request is submitted.

## Schema document

The document follows JSON Schema Draft-07 and adds ServiceStack API and UI metadata:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "/api/QueryBookings",
  "title": "Find Bookings",
  "type": "object",
  "request": "QueryBookings",
  "operation": "Query",
  "method": "GET",
  "properties": {
    "Take": {
      "title": "Take",
      "type": "integer"
    }
  },
  "ui": {
    "submitLabel": "Query Bookings"
  }
}
```

| Member | Purpose |
| --- | --- |
| `$schema` | JSON Schema dialect |
| `$id` | API execution route |
| `request` | Request DTO name |
| `operation` | AutoQuery operation, when applicable |
| `method` | HTTP method used to execute the API |
| `title`, `description` | Human-readable API metadata |
| `type`, `properties`, `required` | Request DTO structure and required fields |
| `ui` | Input controls, layout, help, lookup and formatting hints |

Standard JSON Schema constraints such as `minimum`, `maximum`, `minLength`, `maxLength`, `pattern`, `format`, `enum`, `minItems` and `maxItems` are included when present in ServiceStack metadata.

## How metadata maps to the schema

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

Improving Request DTO metadata improves the built-in page and every custom UI consuming the same schema.

## Authorization metadata

Schemas can include requirements such as:

- `requiresAuth`
- `requiresApiKey`
- `requiredRoles` and `requiresAnyRole`
- `requiredPermissions` and `requiresAnyPermission`
- `requiredClaims`
- `requiredScopes`

This metadata lets a client explain why an operation is unavailable. It does not grant access or replace server enforcement. Authorization is checked again when `/api/{RequestDto}` is called.

## Customize schemas

Use `MetadataFeature.OnApiSchema` to augment a generated schema before it is returned:

```csharp
services.ConfigurePlugin<MetadataFeature>(feature => {
    feature.OnApiSchema = (requestType, schema) => {
        if (requestType == typeof(CreateCoffeeShopOrder))
            schema["ui"]!["submitLabel"] = "Place Order";
    };
});
```

The modified document is then used by the JSON endpoint, built-in page and schema-driven components.

Prefer declarative DTO metadata when the change belongs to the API contract. Use `OnApiSchema` for application-wide conventions or cases that cannot be expressed with attributes.

## Disable `/schema`

The API Schema routes can be disabled independently of `/auto`:

```csharp
services.AddServiceStack(typeof(MyServices).Assembly, options => {
    var metadata = options.Plugins.OfType<MetadataFeature>().First();
    metadata.DisableApiSchema = true;
});
```

`MetadataFeature.IsApiSchemaEnabled` reports whether the routes are registered.

## Embed the Vue component

The built-in workbench is composed from `ApiExplorerSchema` in `@servicestack/vue`. `ApiFormSchema` can be used when only the generated form is needed:

```html
<script setup>
import { ref, onMounted } from 'vue'
import { ApiFormSchema } from '@servicestack/vue'

const schema = ref()
onMounted(async () => {
  schema.value = await fetch('/schema/CreateCoffeeShopOrder.json')
    .then(r => r.json())
})
</script>

<template>
  <ApiFormSchema v-if="schema" :schema="schema" />
</template>
```

Use `ApiExplorerSchema` for the complete request preview, execution and response workbench.

## Embed the React component

`@servicestack/react` provides `ApiFormSchema` for rendering and executing a single API Schema. Its render prop exposes the request preview, `curl` command and response state for custom result UIs:

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

Install the required packages with:

<shell-command>npm install @servicestack/react @servicestack/client</shell-command>

## API Schema and `/auto`

An API Schema describes one Request DTO. An [AutoQuery Schema](/auto) groups the model schema with all authorized Query, Create, Update, Patch, Delete and Save API Schemas needed to build a CRUD UI.

| Surface | Scope |
| --- | --- |
| `/schema/{RequestDto}.json` | One API operation |
| `/auto/{ModelName}.json` | One data model and its authorized AutoQuery operations |

## Related documentation

- [API Schema overview](/api-schema) — architecture, schema-driven components and AI approvals
- [AutoQuery CRUD UI](/auto) — model-level query and CRUD pages
- [API Explorer](/api-explorer) — full metadata-driven API Explorer at `/ui`
- [Metadata page](/metadata-page) — ServiceStack API metadata configuration
