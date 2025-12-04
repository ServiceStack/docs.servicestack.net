---
title: React SPA Project Template
---

## ServiceStack React SPA Template

The new TypeScript [Vite React SPA template](https://react-spa.react-templates.net) is an enhanced version of .NET's
built-in ASP.NET Core React SPA template with many new value-added and high-productivity features.

<div class="not-prose mt-16 flex flex-col items-center">
   <div class="flex">
        <svg class="w-28 h-28" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><g fill="none"><path fill="url(#vscodeIconsFileTypeVite0)" d="m29.884 6.146l-13.142 23.5a.714.714 0 0 1-1.244.005L2.096 6.148a.714.714 0 0 1 .746-1.057l13.156 2.352a.714.714 0 0 0 .253 0l12.881-2.348a.714.714 0 0 1 .752 1.05z"/><path fill="url(#vscodeIconsFileTypeVite1)" d="M22.264 2.007L12.54 3.912a.357.357 0 0 0-.288.33l-.598 10.104a.357.357 0 0 0 .437.369l2.707-.625a.357.357 0 0 1 .43.42l-.804 3.939a.357.357 0 0 0 .454.413l1.672-.508a.357.357 0 0 1 .454.414l-1.279 6.187c-.08.387.435.598.65.267l.143-.222l7.925-15.815a.357.357 0 0 0-.387-.51l-2.787.537a.357.357 0 0 1-.41-.45l1.818-6.306a.357.357 0 0 0-.412-.45"/><defs><linearGradient id="vscodeIconsFileTypeVite0" x1="6" x2="235" y1="33" y2="344" gradientTransform="translate(1.34 1.894)scale(.07142)" gradientUnits="userSpaceOnUse"><stop stop-color="#41d1ff"/><stop offset="1" stop-color="#bd34fe"/></linearGradient><linearGradient id="vscodeIconsFileTypeVite1" x1="194.651" x2="236.076" y1="8.818" y2="292.989" gradientTransform="translate(1.34 1.894)scale(.07142)" gradientUnits="userSpaceOnUse"><stop stop-color="#ffea83"/><stop offset=".083" stop-color="#ffdd35"/><stop offset="1" stop-color="#ffa800"/></linearGradient></defs></g></svg>
        <svg class="w-28 h-28" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><circle cx="16" cy="15.974" r="2.5" fill="#007acc"/><path fill="#007acc" d="M16 21.706a28.385 28.385 0 0 1-8.88-1.2a11.3 11.3 0 0 1-3.657-1.958A3.543 3.543 0 0 1 2 15.974c0-1.653 1.816-3.273 4.858-4.333A28.755 28.755 0 0 1 16 10.293a28.674 28.674 0 0 1 9.022 1.324a11.376 11.376 0 0 1 3.538 1.866A3.391 3.391 0 0 1 30 15.974c0 1.718-2.03 3.459-5.3 4.541a28.8 28.8 0 0 1-8.7 1.191m0-10.217a27.948 27.948 0 0 0-8.749 1.282c-2.8.977-4.055 2.313-4.055 3.2c0 .928 1.349 2.387 4.311 3.4A27.21 27.21 0 0 0 16 20.51a27.6 27.6 0 0 0 8.325-1.13C27.4 18.361 28.8 16.9 28.8 15.974a2.327 2.327 0 0 0-1.01-1.573a10.194 10.194 0 0 0-3.161-1.654A27.462 27.462 0 0 0 16 11.489"/><path fill="#007acc" d="M10.32 28.443a2.639 2.639 0 0 1-1.336-.328c-1.432-.826-1.928-3.208-1.327-6.373a28.755 28.755 0 0 1 3.4-8.593a28.676 28.676 0 0 1 5.653-7.154a11.376 11.376 0 0 1 3.384-2.133a3.391 3.391 0 0 1 2.878 0c1.489.858 1.982 3.486 1.287 6.859a28.806 28.806 0 0 1-3.316 8.133a28.385 28.385 0 0 1-5.476 7.093a11.3 11.3 0 0 1-3.523 2.189a4.926 4.926 0 0 1-1.624.307m1.773-14.7a27.948 27.948 0 0 0-3.26 8.219c-.553 2.915-.022 4.668.75 5.114c.8.463 2.742.024 5.1-2.036a27.209 27.209 0 0 0 5.227-6.79a27.6 27.6 0 0 0 3.181-7.776c.654-3.175.089-5.119-.713-5.581a2.327 2.327 0 0 0-1.868.089A10.194 10.194 0 0 0 17.5 6.9a27.464 27.464 0 0 0-5.4 6.849Z"/><path fill="#007acc" d="M21.677 28.456c-1.355 0-3.076-.82-4.868-2.361a28.756 28.756 0 0 1-5.747-7.237a28.676 28.676 0 0 1-3.374-8.471a11.376 11.376 0 0 1-.158-4A3.391 3.391 0 0 1 8.964 3.9c1.487-.861 4.01.024 6.585 2.31a28.8 28.8 0 0 1 5.39 6.934a28.384 28.384 0 0 1 3.41 8.287a11.3 11.3 0 0 1 .137 4.146a3.543 3.543 0 0 1-1.494 2.555a2.59 2.59 0 0 1-1.315.324m-9.58-10.2a27.949 27.949 0 0 0 5.492 6.929c2.249 1.935 4.033 2.351 4.8 1.9c.8-.465 1.39-2.363.782-5.434A27.212 27.212 0 0 0 19.9 13.74a27.6 27.6 0 0 0-5.145-6.64c-2.424-2.152-4.39-2.633-5.191-2.169a2.327 2.327 0 0 0-.855 1.662a10.194 10.194 0 0 0 .153 3.565a27.465 27.465 0 0 0 3.236 8.1Z"/></svg>
   </div>
</div>
<div class="not-prose mt-4 px-4 sm:px-6">
<div class="text-center"><h3 id="docker-containers" class="text-4xl sm:text-5xl md:text-6xl tracking-tight font-extrabold text-gray-900">
    Vite React SPA Template
</h3></div>
<p class="mx-auto mt-5 max-w-3xl text-xl text-gray-500">
    Explore the high productivity features in the new ServiceStack React SPA template
</p>
<div class="py-8 max-w-7xl mx-auto px-4 sm:px-6">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="WXLF0piz6G0" style="background-image: url('https://img.youtube.com/vi/WXLF0piz6G0/maxresdefault.jpg')"></lite-youtube>
</div>
</div>

<vibe-template
  template="react-spa"
  title="React SPA"
  description="A feature-rich React Single Page Application powered by Vite. Includes Blog functionality, Todos, shadcn/ui components, API Keys management, AI Chat capabilities, and Swagger UI - all integrated with a robust .NET backend."
  href="https://react-templates.net/docs/templates/react-spa"
  screenshot="https://github.com/ServiceStack/docs.servicestack.net/blob/main/MyApp/wwwroot/img/pages/react/react-spa.webp?raw=true"></vibe-template>

## ASP.NET Core React SPA Template 

The [React and ASP.NET Core](https://learn.microsoft.com/en-us/visualstudio/javascript/tutorial-asp-net-core-with-react) 
template provides a seamless starting solution which runs both the .NET API backend and Vite React frontend during development.

It's a modern template enabling an excellent developer workflow for .NET React Apps, configured with Vite's fast 
HMR (Hot Module Reload), TypeScript support with TSX enabling development of concise and expressive type-safe components.   

### Minimal API integration

Whilst a great starting point, it's still only a basic template configured with a bare-bones React Vite App that's modified
to show an example of calling a Minimal API.

### Built-in API Integration

Although the approach used isn't very scalable, with a proxy rule needed for every user-defined API route:

```ts
export default defineConfig({
    //...
    server: {
        proxy: {
            '^/weatherforecast': {
                target,
                secure: false
            }
        },
    }
})
```

And the need for hand maintained Types to describe the shape of the API responses with [Stringly Typed](https://wiki.c2.com/?StringlyTyped)
fetch API calls referencing **string** routes:

```ts
interface Forecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

function App() {
    const [forecasts, setForecasts] = useState<Forecast[]>();

    useEffect(() => {
        populateWeatherData();
    }, []);
    //...
}

async function populateWeatherData() {
    const response = await fetch('weatherforecast');
    const data = await response.json();
    setForecasts(data);
}
```

Which is used to render the API response in a hand rolled table:

```tsx
function App() {
    //...
    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See 
            <a href="https://aka.ms/jspsintegrationreact">jsps</a> for more details.
            </em></p>
        : <table className="table table-striped" aria-labelledby="tabelLabel">
            <thead>
            <tr>
                <th>Date</th>
                <th>Temp. (C)</th>
                <th>Temp. (F)</th>
                <th>Summary</th>
            </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.date}>
                        <td>{forecast.date}</td>
                        <td>{forecast.temperatureC}</td>
                        <td>{forecast.temperatureF}</td>
                        <td>{forecast.summary}</td>
                    </tr>
                )}
            </tbody>
        </table>;
}
```

### ServiceStack API Integration

Fortunately ServiceStack can significantly improve this development experience with the
[/api pre-defined route](https://docs.servicestack.net/endpoint-routing#api-pre-defined-route) where only a single
proxy rule is needed to proxy all APIs:

```ts
export default defineConfig({
    //...
    server: {
        proxy: {
            '^/api': {
                target,
                secure: false
            }
        },
    }
})
```

### End-to-end Typed APIs

Instead of hand-rolled types and Stringly Typed API calls, it utilizes server
[generated TypeScript DTOs](https://docs.servicestack.net/typescript-add-servicestack-reference)
with a generic JsonServiceClient to enable end-to-end Typed APIs:

```ts
import { useState, useEffect } from "react"
import { useClient } from "@/gateway"
import { GetWeatherForecast } from "@/dtos"

const client = useClient()
const [forecasts, setForecasts] = useState<Forecast[]>([])

useEffect(() => {
    (async () => {
        const api = await client.api(new GetWeatherForecast())
        if (api.succeeded) {
            setForecasts(api.response!)
        }
    })()
}, [])
```

This benefits in less code to maintain, immediate static typing analysis to ensure correct usage of APIs and valuable
feedback when APIs are changed, that's easily updated with a single command:

:::sh
npm run dtos
:::

### React Component Ecosystem

Given it's popularity, React has arguably the richest ecosystem of freely available libraries and components, a good
example are the popular [shadcn/ui](https://ui.shadcn.com) Tailwind components. Unlike most libraries they're source copied 
piecemeal into your project where they're locally modifiable, i.e. instead of an immutable package reference. 

As they're just blueprints, they're not dependent on a single library and will utilize the best library to implement
each component if needed. E.g. the [Data Table](https://ui.shadcn.com/docs/components/data-table) component documents how to implement
your own Data Table utilizing the headless [TanStack Table](https://tanstack.com/table/latest) - a version of which
we've built into [DataTable.tsx](https://github.com/NetCoreTemplates/react-spa/blob/main/MyApp.Client/src/components/DataTable.tsx)
which is used in the template to implement both complex CRUD UIs and 
[weather.tsx](https://github.com/NetCoreTemplates/react-spa/blob/main/MyApp.Client/src/pages/weather.tsx) simple table results:

```tsx
import { columnDefs, DataTable, getCoreRowModel } from "@/components/DataTable.tsx"

const columns = columnDefs(['date', 'temperatureC', 'temperatureF', 'summary'],
  ({ temperatureC, temperatureF}) => {
    temperatureC.header = "Temp. (C)"
    temperatureF.header = "Temp. (F)"
    temperatureC.cell = temperatureF.cell = ({ getValue }) => <>{getValue()}&deg;</>
  })

return (<LayoutPage title="Weather">
  <DataTable columns={columns} data={forecasts} getCoreRowModel={getCoreRowModel()} />
</LayoutPage>)
```

To render the [/weather](https://react-spa.react-templates.net/weather) customized Data Table:

:::{.mx-auto .max-w-lg .shadow .rounded}
[![](/img/pages/release-notes/v8.2/data-table.png)](https://react-spa.react-templates.net/weather)
:::

The template also includes customizable [Form.tsx](https://github.com/NetCoreTemplates/react-spa/blob/main/MyApp.Client/src/components/Form.tsx)
Input components which can be used to create beautiful validation-bound forms which effortlessly integrates with ServiceStack's
[Error Handling](https://docs.servicestack.net/error-handling) and 
[Declarative Validation](https://docs.servicestack.net/declarative-validation) attributes.

## ServiceStack React SPA Features

Other high-productivity features available in the ServiceStack React SPA template include:

### Integrated Identity Auth

Pre-configured with ASP.NET Core Identity Auth, including Sign In and Custom Registration APIs and
UI Pages which can be customized as needed, examples of Role-based security as well as a turn key solution for
Integrating Identity Auth Registration workflow with your [SMTP Provider](https://docs.servicestack.net/auth/identity-auth#smtp-iemailsender)
with all emails sent from a managed non-blocking [Background MQ](https://docs.servicestack.net/background-mq)
for optimal responsiveness and execution.

### tailwindcss

[Tailwind](https://tailwindcss.com) has quickly become the best modern CSS framework for creating scalable,
[mobile-first](https://tailwindcss.com/#mobile-first) responsive websites built
upon a beautiful expert-crafted constraint-based [Design System](https://tailwindcss.com/#constraint-based)
that enables effortless reuse of a growing suite of [Free Community](https://tailwindcomponents.com) and
professionally-designed [Tailwind UI Component](https://tailwindui.com) Libraries, invaluable for quickly creating beautiful websites.

[![](/img/pages/release-notes/v8.2/tailwindui.png)](https://tailwindcss.com)

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="mx-auto w-40 h-40 text-gray-800" viewBox="0 0 24 24">
    <path fill="currentColor" d="M9.37 5.51A7.35 7.35 0 0 0 9.1 7.5c0 4.08 3.32 7.4 7.4 7.4c.68 0 1.35-.09 1.99-.27A7.014 7.014 0 0 1 12 19c-3.86 0-7-3.14-7-7c0-2.93 1.81-5.45 4.37-6.49zM12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26a5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"></path>
</svg>

In addition to revolutionizing how we style mobile-first responsive Apps, Tailwind's
[Dark Mode](https://tailwindcss.com/#dark-mode) does the same for enabling Dark Mode
a feature supported throughout the template and its Tailwind UI Components.

[![](/img/pages/release-notes/v8.2/dark-mode.png)](https://tailwindcss.com/#dark-mode)

### Built for Productivity

So that you're immediately productive out-of-the-box, the template includes a rich set of high-productivity features, including:

|                                                                     |                                                              |
|---------------------------------------------------------------------|--------------------------------------------------------------|
| [tailwind/typography](https://tailwindcss-typography.vercel.app)    | Beautiful css typography for markdown articles & blog posts  |
| [tailwind/forms](https://github.com/tailwindlabs/tailwindcss-forms) | Beautiful css form & input styles that's easily overridable  |
| [Markdown](https://mdxjs.com/docs/getting-started/)                 | Native [mdx](https://mdxjs.com) Markdown integration         |
| [React Router](https://reactrouter.com)                             | Full featured routing library for React                      |
| [plugin/press](https://github.com/ServiceStack/vite-plugin-press)   | Static markdown for creating blogs, videos and other content |
| [plugin/pages](https://github.com/hannoeru/vite-plugin-pages)       | Conventional file system based routing for Vite              |
| [plugin/svg](https://github.com/pd4d10/vite-plugin-svgr)            | Load SVG files as React components                           |
| [Iconify](https://iconify.design)                                   | Unified registry to access 100k+ high quality SVG icons      |

### Bookings CRUD Pages

The [Bookings CRUD example](https://react-spa.react-templates.net/bookings-crud) shows how you can utilize a customized 
Data Table and templates Form components to create a beautifully styled CRUD UI with minimal effort.

## Vite Press Plugin

[![](https://images.unsplash.com/photo-1524668951403-d44b28200ce0?crop=entropy&fit=crop&h=384&w=768)](https://vue-spa.web-templates.io/posts/vite-press-plugin)

Most Apps typically have a mix of dynamic functionality and static content which in our experience is best maintained
in Markdown, which is why excited about the new [Vite Press Plugin](https://vue-spa.web-templates.io/posts/vite-press-plugin)
which brings the same Markdown features in our
[razor-ssg](https://razor-ssg.web-templates.io), [razor-press](https://razor-press.web-templates.io) and our
[blazor-vue](https://blazor-vue.web-templates.io) templates, and re-implements them in Vite where they can be used
to add the same rich content features to Vite Vue and Vite React Apps.

A goal for vite-press-plugin is to implement a suite of universal markdown-powered features that can be reused across all
our Vue, React and .NET Razor and Blazor project templates, allowing you to freely copy and incorporate same set of
markdown feature folders to power markdown content features across a range of websites built with different technologies.

All of Razor SSG's features are available in Vite Press Plugin, including:

- [Blog](https://vue-spa.web-templates.io/blog) - Full Featured, beautiful Tailwind Blog with multiple discoverable views
- [What's New](https://vue-spa.web-templates.io/whatsnew) - Build Product and Feature Release pages
- [Videos](https://vue-spa.web-templates.io/videos) - Maintain Video Libraries and Playlists
- [Metadata APIs](https://vue-spa.web-templates.io/posts/vite-press-plugin#metadata-apis-feature) - Generate queryable static .json metadata APIs for all content
- [Includes](https://vue-spa.web-templates.io/posts/vite-press-plugin#includes-feature) - Create and reuse Markdown fragments

It also supports an enhanced version of markdown for embedding richer UI markup in markdown content where most of
[VitePress Containers](https://vitepress.dev/guide/markdown#custom-containers) are supported, including:

- [Custom Markdown Containers](https://vue-spa.web-templates.io/posts/vite-press-plugin#markdown-containers)
    - **Alerts**
        - `info`
        - `tip`
        - `warning`
        - `danger`
    - `copy`
    - `sh`
    - `youtube`
- [Markdown Fenced Code Blocks](https://vue-spa.web-templates.io/posts/vite-press-plugin#markdown-fenced-code-blocks) - Convert fenced code blocks into Richer UIs

### React Components In Markdown

At the cost of reduced portability, you’re also able to embed richer Interactive Vue components directly in markdown:

- [React Components in Markdown](https://react-spa.react-templates.net/posts/markdown-components-in-react)