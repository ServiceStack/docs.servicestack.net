---
title: C# Jamstack Project Templates
---

ServiceStack's Jamstack templates encapsulates the latest technologies at the forefront of modern web development to deliver both a great **developer experience** and **performant** end-user UX.

[Jamstack](https://jamstack.org/what-is-jamstack) (**J**avaScript, **A**PIs, and **M**arkup) is a modern architecture pattern to build fast, secure and easy to scale web applications where pre-rendering content, enhancing with JavaScript and leveraging CDN static hosting results in a highly productive, flexible and performant system that takes advantage of CDN edge caches to deliver **greater performance** & efficiency at **lower cost**. 

<div class="not-prose">
<a href="https://jamstacks.net" class="my-8 py-8 flex justify-center text-gray-600 hover:no-underline" title="jamstacks.net">
    <div class="flex justify-center items-end p-4 pt-0 border-2 border-solid border-transparent rounded hover:border-indigo-600">
        <svg viewBox="0 0 256 256" class="w-20 h-20 mr-2" alt="Jamstacks logo"><path d="M128 0C57.221 0 0 57.221 0 128c0 70.778 57.221 128 128 128c70.778 0 128-57.222 128-128V0H128z" fill="#F0047F"></path><path d="M121.04 134.96v93.312c-49.663-2.837-89.64-42.345-93.215-91.81l-.097-1.502h93.312zm90.962 0c-2.6 49.664-38.816 89.64-84.159 93.215l-1.377.097V134.96h85.536zm.112-91.074v85.648h-85.648V43.886h85.648z" fill="#FFF"></path></svg>
        <h1 class="text-8xl font-bold">Jamstacks</h1>
        <div class="ml-4 bg-purple-600 text-white py-1 pb-2 px-3 rounded-md text-7xl">.NET</div>
    </div>
</a>
</div>

### Jamstack Benefits

It's become the preferred architecture for modern performant web apps with 
[benefits](https://jamstack.org/why-jamstack/) extending beyond performance to improved: 

 - **Security** from a reduced attack surface from hosting read-only static resources and requiring fewer App Servers
 - **Scale** with non-essential load removed from App Servers to CDN's architecture capable of incredible scale & load capacity
 - **Maintainability** resulting from reduced hosting complexity and the clean decoupling of UI and server logic
 - **Portability** with your static UI assets being easily capable from being deployed and generically hosted from any CDN or web server
 - **Developer Experience** with major JavaScript Frameworks embracing Jamstack in their dev model, libraries & tooling  

Ultimately, it's hosting your App's pre-rendered static UI assets on Content Delivery Network (CDN) edge caches close to users locations that's primarily responsible for its lightning performance.

![](/img/pages/jamstack/cdn-world-view.png)

### $0.40 /month

Other by-products of generating pre-computed CDN hostable assets, is interchangeable cost-effective hosting and great SEO - characteristics our Jamstack Demos take advantage of with free **UI** hosting on GitHub Pages CDN leaving their only cost to host its **.NET 10 API** back-ends, deployed with SSH in Docker compose containers to a vanilla [Digital Ocean](https://www.digitalocean.com) droplet costing only **$0.40 /month each**.

### Recommended Templates

These templates represent the best-in class experiences for their respective **React**, **Vue** & **Blazor WASM** ecosystems each, packed with features & examples common in many websites including Integrated Auth, rich Markdown content as well as TODOs MVC and CRUD examples with built-in contextual validation binding. As such they're **now recommended** over our existing SPA and C# MVC Templates.

We've put together a quick check list to help decide which templates we'd recommend:

| Project                                                      | Recommendation                                                                  |
|--------------------------------------------------------------|---------------------------------------------------------------------------------|
| [Next.js](https://github.com/NetCoreTemplates/nextjs)        | If you prefer React with Next.js                                                |
| [React SPA](https://github.com/NetCoreTemplates/react-spa)   | If you prefer React                                                             |
| [Blazor Tailwind](/templates/blazor-tailwind)                | If you prefer a full C# Stack or are developing Line of Business (LOB) Apps     |
| [Vue SPA](https://github.com/NetCoreTemplates/vue-vite)      | If you prefer Vue and happy to trade SEO benefits of SSG for a simpler template |

Still not sure? familiarize yourself with their respective dev models by comparing their functionality equivalent TODOs MVC Examples:

### TODOs MVC

<jamstack-todos class="not-prose my-8 pb-8"></jamstack-todos>

All projects utilize the same back-end ServiceStack Services with **TODOs MVC** implemented in
[TodosServices.cs](https://github.com/LegacyTemplates/blazor-wasm/blob/main/MyApp.ServiceInterface/TodosServices.cs).


As **Bookings CRUD** is an [AutoQuery CRUD](/autoquery/crud) API, it defines [all its functionality](/autoquery/crud-bookings) in its declarative
[Bookings.cs](https://github.com/LegacyTemplates/blazor-wasm/blob/main/MyApp.ServiceModel/Bookings.cs) DTOs and serves as a good example for the minimal dev model effort required to implement a typical Authenticated CRUD UI in each framework:

### Bookings CRUD

<jamstack-bookings-crud body="max-w-screen-lg" class="not-prose my-8 pb-8"></jamstack-bookings-crud>

<p class="text-center">Once you know the framework you wish to use, create a new App using your preferred <b>Project Name</b> below:</p>

<h3 class="text-center">Download new C# Jamstack Project Template</h3>

<jamstack-templates class="not-prose pb-8"></jamstack-templates>

::: info
An updated list of available Jamstack project templates is also at https://jamstacks.net (built with Razor SSG)
:::

### Pre-configured Jamstack App Deployments

All project templates supports CDN hostable UI assets and include the necessary GitHub Actions that takes care of building and SSH deploying a Docker compose production build of your App to any Linux Host with just a few GitHub Action Secrets in your GitHub repo. 

The optional `DEPLOY_CDN` secret lets you control whether to deploy your App's static `/wwwroot` assets to your GitHub Pages CDN by specifying the custom domain to use and is what all JamStack Live demos used to deploy a copy of their UIs to GitHub Pages CDN:

| Project Source                                                         | GitHub Pages CDN              | Digital Ocean Docker .NET API     |
| -                                                                      | -                             | -                                 |
| [nextjs](https://github.com/NetCoreTemplates/nextjs)                   | nextjs.jamstacks.net          | nextjs-api.jamstacks.net          |
| [blazor](https://github.com/NetCoreTemplates/blazor)                   | blazor.web-templates.io       | blazor.web-templates.io           |
| [vue-spa](https://github.com/NetCoreTemplates/vue-spa)                 | vue-spa.jamstacks.net         | vue-spa-api.jamstacks.net         |

## Blazor WebAssembly

The [Blazor WebAssembly (WASM)](/templates/blazor-tailwind) template offers a pure end-to-end integrated C# solution to building a high performance web application with [Blazor](https://dotnet.microsoft.com/en-us/apps/aspnet/web-apps/blazor) and ServiceStack. Due to the integrated dev model we've been able to achieve in Blazor it's become **our preferred technology** to use to develop **Line of Business Apps** since it's the only C# Razor solution adopting our preferred [API First Development](/api-first-development) model with Web UIs reusing the same well-defined APIs as Mobile and Desktop Apps.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="TIgjMf_vtCI" style="background-image: url('https://img.youtube.com/vi/TIgjMf_vtCI/maxresdefault.jpg')"></lite-youtube>

### Great Perceived Performance and SEO

Typically the **large download sizes** & slow initial load times of Blazor WASM Apps would make it a poor choice for Internet hosted sites. However, our Blazor WASM template has largely mitigated this with easily maintainable built-in pre-rendering techniques to make every page appear to load quickly, including **instant loading** of its Markdown Pages courtesy of the GitHub Actions publish task generating & deploying pre-rendered content pages.

### Learn more

To find out more watch its [YouTube overview](https://youtu.be/TIgjMf_vtCI) and visit the [Blazor WASM docs](/templates/blazor-tailwind).

## Razor SSG

The [razor-ssg](https://razor-ssg.web-templates.io/posts/razor-ssg) ServiceStack template leverages the power of .NET Razor to provide seamless static site generation (SSG) capabilities. It's perfect for building content-rich applications like product websites, blogs, portfolios, and more. 

This template streamlines the development process while offering versatility in customizing and extending your project. With GitHub Codespaces integration, you can develop, test, and manage your application all within your browser, eliminating the need for a dedicated development environment and expediting your workflow.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="MRQMBrXi5Sc" style="background-image: url('https://img.youtube.com/vi/MRQMBrXi5Sc/maxresdefault.jpg')"></lite-youtube>

## Next.js

For those preferring working with **React**, there's a clear choice in Nextjs.org - currently the flagship & [most popular Jamstack](https://jamstack.org/generators/) framework backed by the folks over at [Vercel](https://vercel.com), where it enjoys deep engineering talent committed to maintaining and continually improving it, so you can be confident in the longevity of the technology and the React framework maintained by [Meta](https://meta.com) (Facebook).

<a href="https://nextjs.jamstacks.net" title="nextjs.jamstacks.net"><img src="/img/pages/jamstack/next-black.svg" class="mx-auto block" /></a>

Designed as an SSG framework from the start, its pre-defined patterns include static generation and UX focused functionality built-in. 

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="3pPLRyPsO5A" style="background-image: url('https://img.youtube.com/vi/3pPLRyPsO5A/maxresdefault.jpg')"></lite-youtube>

### Stale While Revalidate

Its [SWR](https://swr.vercel.app) Data Fetching React Hooks library is one innovative example utilizing the popular 
[stale-while-revalidate](https://web.dev/stale-while-revalidate/) UX pattern to help developers balance 
between **immediacy** — loading cached content right away — and **freshness** — ensuring updates to the cached content are used in the future.

To take advantage of this, the [nextjs](https://github.com/NetCoreTemplates/nextjs) template includes a `swrClient` that provides a typed wrapper for making typed SWR API Requests with ServiceStack's generic [JsonServiceClient](/typescript-add-servicestack-reference):

```tsx
import { swrClient } from "../lib/gateway"
import { Hello } from "../lib/dtos"

const HelloApi = ({ name }) => {
  const {data, error} = swrClient.get(() => 
    new Hello({ name }))
  if (error) return <div>{error.message}</div>
  return <div>{data?data.result:'loading...'}</div>
}
```

This reactively sets up the UI to handle multiple states:
 - `loading` - displays **loading...** message whilst API request is in transit
 - `data` - when completed, populated with a `HelloResponse` and displayed
 - `error` - when failed, populated with `ResponseStatus` and displayed

The primary UX benefits are realized when re-making an existing request in which a locally-cached *stale* version
is **immediately** returned and displayed whilst a new API Request is made behind the scenes, updating the UI if the fresh response was modified.


<p class="hide-h2"></p>

## Vite

<div class="not-prose">
<a href="https://vitejs.dev" class="flex justify-center mt-8 py-8 hover:no-underline text-gray-700">
    <div class="flex flex-col align-center text-center">
        <div class="pl-10">
            <svg class="w-60 h-60" xmlns="http://www.w3.org/2000/svg" width="256" height="257" viewBox="0 0 256 257"><defs><linearGradient id="logosVitejs0" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"/><stop offset="100%" stop-color="#BD34FE"/></linearGradient><linearGradient id="logosVitejs1" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"/><stop offset="8.333%" stop-color="#FFDD35"/><stop offset="100%" stop-color="#FFA800"/></linearGradient></defs><path fill="url(#logosVitejs0)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"/><path fill="url(#logosVitejs1)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"/></svg>
        </div>
        <h3 class="text-6xl mb-3 mt-0">Vite</h3>
        <h4 class="text-2xl text-gray-400 font-normal">Next Generation Frontend Tooling</h4>
    </div>
</a>
</div>

Despite Vercel's full-time resources, Next.js is still reliant on the Webpack ecosystem, who although have done a formidable job managing complex tooling requirements for npm projects over a number of years, has since lost the Developer Experience (DX) crown to [vitejs.dev](https://vitejs.dev)

Vite is being [built for speed](https://vitejs.dev/guide/why.html) in the modern era and takes advantage of modern browser features like native ES modules support to remove bundling entirely during development and adopts performance leading technologies like [esbuild](https://github.com/evanw/esbuild) to pre-bundle dependencies and [transpile TypeScript](https://vitejs.dev/guide/features.html#typescript) which is able to do **20-30x** faster than TypeScript's own `tsc` compiler.

Ultimately its architectural choices allows Vite to deliver Lightning Fast **Hot Module Reload** (HMR) to remain at the developer-experience forefront of modern web development serving a [growing ecosystem](https://vitejs.dev/guide/) of frameworks with a rich typed suite of [Universal Plugins](https://vitejs.dev/plugins/).

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="D-rU0lU_B4I" style="background-image: url('https://img.youtube.com/vi/D-rU0lU_B4I/maxresdefault.jpg')"></lite-youtube>

### Vue SPA

Both Vue & Vite being led by [Evan You](https://github.com/yyx990803), which ensures both have stellar integration and delivers a well-supported & productive development experience making it the clear choice for any new Vue project.

vue-vite.jamstacks.net utilizes the same high-end Vue3, TypeScript and Tailwind components means their included pages like **TODOs MVC**, **Bookings** and **Sign In** contain **identical source code**, the choice on which to use effectively becomes if you need advanced features like [Static Site Generation](https://www.cloudflare.com/en-au/learning/performance/static-site-generator/) **(SSG)** and **Dark Mode** or would otherwise prefer to start with a simpler template.

#### Features list comparison

 - vue-vite.jamstacks.net/features

### Stale-while-revalidate in Vue3

Just like [Next.js's Stale While Revalidate](#stale-while-revalidate), both Vue templates includes a `swrClient` providing a typed wrapper around [SWVR](https://github.com/Kong/swrv) Vue3 composition library around making typed SWR API Requests using ServiceStack’s typed `JsonServiceClient`, e.g:

```html
<template>
  <div v-if="error">{{ error.message }}</div>
  <div v-else>{{data ? data.result :'loading...'}}</div>
</template>

<script setup lang="ts">
import { Hello } from "@/dtos"
import { swrClient } from "@/api"

const props = defineProps<{ name: string }>()

const { data, error } = swrClient.get(() => 
    new Hello({ name: props.name }))
</script>
```

Where it yields the same optimal UX with cached API responses rendered instantly before later updating itself if modified.

## Vue Vite

Don't need SSG or Dark mode? Try the simpler **SPA** template instead:

<a class="flex flex-col justify-center items-center my-8 pb-8" href="https://vue-vite.jamstacks.net">
    <img src="/img/pages/jamstack/vue-vite-home.png" class="max-w-screen-md">
</a>

## /api route

Each Jamstack templates are configured to the `/api` predefined route for JSON APIs:

<div class="not-prose">
<h3 class="text-4xl text-center text-indigo-800 pb-3">/api/{Request}</h3>
</div>

This simple and popular convention makes it easy to remember the route new APIs are immediately available on & also pairs nicely with:

<div class="not-prose">
<h3 class="text-4xl text-center text-indigo-800 pb-3">/ui/{Request}</h3>
</div>

i.e. An easy to remember route for API Explorer's Auto Form UI, together we expect both to yield greater utility [out-of-the-box](https://en.wikipedia.org/wiki/Out_of_the_box_(feature)) in ServiceStack Apps. 

### Benefits in Jamstack Apps

The `/api` route is particularly useful in Jamstack Apps as the 2 ways to call back-end APIs from decoupled UIs hosted on CDNs is to make CORS requests which doesn't send pre-flight CORS requests for [Simple Browser requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests). As such, we can improve the latency of **GET** and **POST** API Requests by configuring our `JsonServiceClient` to use `/api` and to not send the `Content-Type: application/json` HTTP Header which isn't necessary for `/api` who always expects and returns JSON:

### Configuring in TypeScript

```ts
import { JsonServiceClient } from "@servicestack/client"

const client = new JsonServiceClient(baseUrl)
```

It also benefits the **alternative method** to CORS in only needing to define a **single reverse proxy rule** on the CDN host to proxy all API requests to downstream back-end servers.