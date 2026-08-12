---
title: JSON Schema Components
group: Component Gallery
---

The elegance of this schema-driven approach is that you can render complete UIs directly from API schemas. There is no need to load the full ServiceStack metadata document or build a bespoke screen for every operation:

- Fetch `/schema/{Request}.json` and pass it to [ApiFormSchema](#apiformschema-and-jsonview) to render a complete form for **any API**.
- Fetch `/auto/{DataModel}.json` for an [AutoQuery API](/autoquery/rdbms) and pass it to [AutoQuerySchema](#autoqueryschema) to deliver an **entire CRUD UI** with querying, filtering, sorting, paging, and Create, Edit, and Delete forms.

The components below demonstrate both approaches, together with recursive JSON Schema forms, readable responses, and generated types.

<div class="not-prose mb-10">
<schema-server-picker></schema-server-picker>
</div>

## AutoQuerySchema

`AutoQuerySchema` turns an `/auto/{Model}.json` document into a filterable, sortable, and pageable data browser. Query state is synchronized with the URL so links survive navigation and reloads.

```html
<AutoQuerySchema :schema="bookingSchema" :client="client" :take="5" />
```

```js
const bookingSchema = await fetch(
  'https://blazor-gallery.servicestack.net/auto/Booking.json'
).then(r => r.json())
```

<div class="not-prose prose-table mb-12">
<schema-auto-query></schema-auto-query>
</div>

## ApiFormSchema and JsonView

`ApiFormSchema` maps an API schema to its inputs and exposes request, cURL, response, error, and loading state through its default slot. `JsonView` renders the response with semantic formatting for objects, collections, dates, links, and scalar values.

```html
<ApiFormSchema :schema="helloSchema" :client="client" v-model="request">
  <template #default="{ result, requestText, curl }">
    <pre>{{ requestText }}</pre>
    <pre>{{ curl }}</pre>
    <JsonView v-if="result" :value="result.json ?? result.text" />
  </template>
</ApiFormSchema>
```

<div class="not-prose mb-12">
<schema-api-form></schema-api-form>
</div>

## Recursive JsonSchemaForm

`JsonSchemaForm` supports validation, nested objects, editable arrays, enums, dates, and arbitrary dictionary properties. Bind it with `v-model` to keep the live value synchronized.

```html
<JsonSchemaForm
  ref="form"
  :schema="formSchema"
  v-model="data"
  validate-on="change"
/>
```

<div class="not-prose mb-12">
<schema-form></schema-form>
</div>

## Generate typed models

The same schema and live example value can generate C#, Python, TypeScript, or JavaScript models with `generateTypes`.

```js
import { generateTypes } from '@servicestack/vue'

const generated = generateTypes({
  name: 'launch-plan.json',
  schema: formSchema,
  json: data,
  language: 'typescript',
})
```

<div class="not-prose mb-12">
<schema-types></schema-types>
</div>

## Schema endpoints

ServiceStack serves individual request schemas from `/schema/{RequestDto}.json` and complete AutoQuery model envelopes from `/auto/{Model}.json`. These endpoints let schema-driven pages load only the definitions they use.
