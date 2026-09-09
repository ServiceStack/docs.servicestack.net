---
slug: create-your-first-webservice
title: Create your first WebService
---

<div class="hide-title"></div>

<div class="not-prose">
<first-api-hero></first-api-hero>
</div>

ServiceStack APIs start from a different place than most frameworks. Instead of writing a method that returns JSON, you describe **what the message is** - and the routes, the docs, the validation, the API Explorer and the native clients are all generated from that one description.

This walkthrough creates a working API from scratch, then shows exactly what each file does and what you got for free.

<div class="not-prose">
<quick-start></quick-start>
</div>

That's it - you now have a running .NET 10 API. The template's home page is already calling it with typed DTOs!

## How it works

<div class="not-prose">
<request-lifecycle></request-lifecycle>
</div>

The important detail is what *isn't* in your Service: no `HttpContext`, no serialization, no routing code, no manual model binding. Your Service accepts a message and returns a message, which is what lets ServiceStack expose it over HTTP, MQs, gRPC or in-process without you changing a line.

## The code

<div class="not-prose">
<code-tour></code-tour>
</div>

## What that one DTO gave you

<div class="not-prose">
<free-surface></free-surface>
</div>

::: tip
Change the return format on any API by adding `?format=json`, `?format=csv` or `?format=jsonl` - or by sending the matching `Accept` header. See [Formats](/formats) for the full list.
:::

## The solution structure

Every ServiceStack template scaffolds the same four projects. The layout isn't ceremony - it's what makes your API contract shareable and your logic testable:

<div class="not-prose">
<solution-layout></solution-layout>
</div>

<div class="not-prose">
<dto-boundary></dto-boundary>
</div>

Read more in [Physical Project Structure](/physical-project-structure).

## Call your API from anywhere

Your App publishes enough metadata to generate a native, typed client for any supported language - so there's no SDK project to write, version or document. Pick a language to see the two commands:

<div class="not-prose my-8">
<dto-quick-start selected="typescript" url="https://web.web-templates.io"></dto-quick-start>
</div>

Re-run the generate command whenever your API changes. New fields show up in the generated DTOs, and removed or renamed members become **compile errors in the consuming App** instead of runtime surprises.

### From a web page, with no build step

The `web` template's home page uses your App's built-in [JavaScript DTOs](/javascript-add-servicestack-reference) from [/types/mjs](/javascript-add-servicestack-reference) with the [@servicestack/client](/javascript-client) library, loaded from an [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap):

```html
<script type="importmap">
{
  "imports": {
    "@servicestack/client":"https://unpkg.com/@servicestack/client/dist/servicestack-client.mjs"
  }
}
</script>
```

Which lets you reference the package name in your source instead of its physical location:

```html
<input type="text" id="txtName">
<div id="result"></div>

<script type="module">
import { JsonServiceClient, $1, on } from '@servicestack/client'
import { Hello } from '/types/mjs'

const client = new JsonServiceClient()
on('#txtName', {
    async keyup(el) {
        const api = await client.api(new Hello({ name:el.target.value }))
        $1('#result').innerHTML = api.response.result
    }
})
</script>
```

#### Enable static analysis and intelli-sense

For IDE intelli-sense during development, save the annotated Typed DTOs to disk:

:::sh
npm run dtos
:::

Then reference the local file to enable static analysis when calling your typed APIs:

```js
import { Hello } from '/js/dtos.mjs'
client.api(new Hello({ name }))
```

To also get type-checking for **@servicestack/client**, install the dependency-free library as a dev dependency:

:::sh
npm install -D @servicestack/client
:::

Only its TypeScript definitions are used by the IDE, so you get a rich typed authoring experience with no bundler and no additional build time:

![](/img/pages/release-notes/v6.6/mjs-intellisense.png)

### From a component framework

The same `JsonServiceClient` works in every JavaScript App, from SPAs to React Native to Node.js servers, e.g. with TypeScript & [Vue Single-File Components](https://vuejs.org/guide/scaling-up/sfc.html):

```html
<template>
  <div v-if="api.error" class="ml-2 text-red-500">{{ error.message }}</div>
  <div v-else class="ml-3 mt-2 text-2xl">{{ api.loading ? 'Loading...' : api.response.result }}</div>
</template>

<script setup lang="ts">
import { JsonServiceClient } from "@servicestack/client"
import { Hello } from "@/dtos"

const props = defineProps<{ name: string }>()
const client = new JsonServiceClient()

const api = client.api(new Hello({ name: props.name }))
</script>
```

Compare the same API call across the major front-end frameworks:

 - [Vue 3 HelloApi.mjs](https://github.com/NetCoreTemplates/blazor-vue/blob/main/MyApp/wwwroot/posts/components/HelloApi.mjs)
 - [Vue HelloApi.vue](https://github.com/NetCoreTemplates/vue-spa/blob/main/MyApp.Client/src/_posts/components/HelloApi.vue)
 - [Next.js with swrClient](https://github.com/NetCoreTemplates/nextjs/blob/main/ui/components/intro.tsx)
 - [React HelloApi.tsx](https://github.com/NetCoreTemplates/react-spa/blob/master/MyApp/src/components/Home/HelloApi.tsx)
 - [Angular HelloApi.ts](https://github.com/NetCoreTemplates/angular-spa/blob/master/MyApp/src/app/home/HelloApi.ts)

Native Mobile and Desktop Apps use the same approach - see [Add ServiceStack Reference](/add-servicestack-reference) for Swift, Java, Kotlin, Dart and .NET clients.

## Where to go next

<div class="not-prose">
<next-steps></next-steps>
</div>

## Start from a full-featured template

The `web` template is deliberately empty. When you want a template that comes with an opinionated front-end, auth, a database and deployment already wired up, start from one of the full project templates instead:

### [C# Project Templates Overview](/templates/)

<div class="not-prose">
<template-videos></template-videos>
</div>

For Blazor WASM and Server see our [Blazor projects & Tailwind components](/templates/blazor-tailwind), and the rich [Vue 3 Tailwind Components](/vue/) library that all Vue templates are pre-configured with.

## Other ways to create a project

::include empty-projects.md::
