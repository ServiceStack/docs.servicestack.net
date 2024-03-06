---
title: Vue SPA Project Template
---

The latest [Vue SPA](https://github.com/NetCoreTemplates/vue-spa) template is a good example of this, building on and enhancing
the built-in ASP.NET Core Vue SPA template with many high-productivity features.

<div class="not-prose mt-16 flex flex-col items-center">
   <div class="flex">
        <svg class="-mt-3 w-32 h-32" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32"><g fill="none"><path fill="url(#vscodeIconsFileTypeVite0)" d="m29.884 6.146l-13.142 23.5a.714.714 0 0 1-1.244.005L2.096 6.148a.714.714 0 0 1 .746-1.057l13.156 2.352a.714.714 0 0 0 .253 0l12.881-2.348a.714.714 0 0 1 .752 1.05z"/><path fill="url(#vscodeIconsFileTypeVite1)" d="M22.264 2.007L12.54 3.912a.357.357 0 0 0-.288.33l-.598 10.104a.357.357 0 0 0 .437.369l2.707-.625a.357.357 0 0 1 .43.42l-.804 3.939a.357.357 0 0 0 .454.413l1.672-.508a.357.357 0 0 1 .454.414l-1.279 6.187c-.08.387.435.598.65.267l.143-.222l7.925-15.815a.357.357 0 0 0-.387-.51l-2.787.537a.357.357 0 0 1-.41-.45l1.818-6.306a.357.357 0 0 0-.412-.45"/><defs><linearGradient id="vscodeIconsFileTypeVite0" x1="6" x2="235" y1="33" y2="344" gradientTransform="translate(1.34 1.894)scale(.07142)" gradientUnits="userSpaceOnUse"><stop stop-color="#41d1ff"/><stop offset="1" stop-color="#bd34fe"/></linearGradient><linearGradient id="vscodeIconsFileTypeVite1" x1="194.651" x2="236.076" y1="8.818" y2="292.989" gradientTransform="translate(1.34 1.894)scale(.07142)" gradientUnits="userSpaceOnUse"><stop stop-color="#ffea83"/><stop offset=".083" stop-color="#ffdd35"/><stop offset="1" stop-color="#ffa800"/></linearGradient></defs></g></svg>
        <svg class="w-28 h-28" xmlns="http://www.w3.org/2000/svg" width="1.16em" height="1em" viewBox="0 0 256 221"><path fill="#41b883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0z"/><path fill="#41b883" d="m0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0z"/><path fill="#35495e" d="M50.56 0L128 133.12L204.8 0h-47.36L128 51.2L97.92 0z"/></svg>
   </div>
</div>
<div class="not-prose mt-4 px-4 sm:px-6">
<div class="text-center"><h3 id="docker-containers" class="text-4xl sm:text-5xl md:text-6xl tracking-tight font-extrabold text-gray-900">
    Vite Vue SPA Template
</h3></div>
<p class="mx-auto mt-5 max-w-3xl text-xl text-gray-500">
    Explore the high productivity features in the new ServiceStack Vue SPA template
</p>
<div class="py-8 max-w-7xl mx-auto px-4 sm:px-6">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="JlUjWlVslRg" style="background-image: url('https://img.youtube.com/vi/JlUjWlVslRg/maxresdefault.jpg')"></lite-youtube>
</div>
</div>

:::{.text-center}
## Live Demo
:::

:::{.shadow .pb-1}
[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/vue-spa.png)](https://vue-spa.web-templates.io)
:::

## ASP.NET Core Vue SPA Template 

The [Vue and ASP.NET Core](https://learn.microsoft.com/en-us/visualstudio/javascript/tutorial-asp-net-core-with-vue) 
template provides a seamless starting solution which runs both the .NET API backend and Vite Vue frontend during development.

It's a modern template capturing the best Vue has to offer, configured with Vite's fast HMR (Hot Module Reload) and TypeScript support - 
it allows App's to be developed with Vue's typed [Single File Components](https://vuejs.org/guide/scaling-up/sfc.html) enabling
both a productive development experience and an optimal high-performance production build at runtime.

### Minimal API integration

Whilst a great starting point, it's still only a basic template configured with a bare-bones Vue Vite App that's modified
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
import { defineComponent } from 'vue';

type Forecasts = {
    date: string,
    temperatureC: string,
    temperatureF: string,
    summary: string
}[];

interface Data {
    loading: boolean,
    post: null | Forecasts
}

export default defineComponent({
    data(): Data {
        return {
            loading: false,
            post: null
        };
    },
    created() {
        // fetch the data when the view is created and the data is
        // already being observed
        this.fetchData();
    },
    watch: {
        // call again the method if the route changes
        '$route': 'fetchData'
    },
    methods: {
        fetchData(): void {
            this.post = null;
            this.loading = true;

            fetch('weatherforecast')
                .then(r => r.json())
                .then(json => {
                    this.post = json as Forecasts;
                    this.loading = false;
                    return;
                });
        }
    },
});
```

Which is used to render the API response in a hand rolled table: 

```html
<div v-if="post" class="content">
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Temp. (C)</th>
                <th>Temp. (F)</th>
                <th>Summary</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="forecast in post" :key="forecast.date">
                <td>{{ forecast.date }}</td>
                <td>{{ forecast.temperatureC }}</td>
                <td>{{ forecast.temperatureF }}</td>
                <td>{{ forecast.summary }}</td>
            </tr>
        </tbody>
    </table>
</div>
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
import { ref, onMounted } from 'vue'
import { ApiResult } from "@servicestack/client"
import { useClient } from "@servicestack/vue"
import { GetWeatherForecast } from "@/dtos"

const client = useClient()
const api = ref(new ApiResult())

onMounted(async () => {
    api.value = await client.api(new GetWeatherForecast())
})
```

This benefits in less code to maintain, immediate static typing analysis to ensure correct usage of APIs and valuable 
feedback when APIs are changed, that's easily updated with a single command:

:::sh
npm run dtos
:::

### High Productivity Vue Components

With access to the [ServiceStack Vue Components](https://docs.servicestack.net/vue/) library there's also less code to 
maintain in the UI, where you can render a beautiful tailwind styled DataGrid with just:

```html
<DataGrid :items="api.response" />
```

## ServiceStack Vue SPA Features

Other high-productivity features available in the ServiceStack Vue SPA template include:

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

### Dark Mode

In addition to revolutionizing how we style mobile-first responsive Apps, Tailwind's
[Dark Mode](https://tailwindcss.com/#dark-mode) does the same for enabling Dark Mode
a feature supported throughout all of ServiceStack's [Vue Component Library](https://docs.servicestack.net/vue/).

![](/img/pages/release-notes/v8.2/dark-and-light-mode.png)

### Built for Productivity

So that you're immediately productive out-of-the-box, the template includes a rich set of high-productivity features, including:

|                                                                            |                                                              |
|----------------------------------------------------------------------------|--------------------------------------------------------------|
| [tailwind/typography](https://tailwindcss-typography.vercel.app)           | Beautiful css typography for markdown articles & blog posts  |
| [tailwind/forms](https://github.com/tailwindlabs/tailwindcss-forms)        | Beautiful css form & input styles that's easily overridable  |
| [Markdown](https://github.com/markdown-it/markdown-it)                     | Native Markdown integration                                  |
| [plugin/press](https://github.com/ServiceStack/vite-plugin-press)          | Static markdown for creating blogs, videos and other content |
| [plugin/vue-router](https://github.com/posva/unplugin-vue-router)          | Conventional file system based routing for Vue 3 on Vite     |
| [plugin/layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts) | Support for multiple page layouts                            |
| [plugin/components](https://github.com/antfu/unplugin-vue-components)      | Auto importing & registering of components on-demand         |
| [plugin/svg](https://github.com/jpkleemans/vite-svg-loader)                | Load SVG files as Vue components                             |
| [Iconify](https://iconify.design)                                          | Unified registry to access 100k+ high quality SVG icons      |

### Bookings CRUD Pages

Bookings CRUD example shows how you can rapidly develop beautiful responsive, customized CRUD UIs with minimal effort using 
[AutoQuery APIs](https://docs.servicestack.net/autoquery/), [AutoForms](https://docs.servicestack.net/autoform) &
[AutoQueryGrid](https://blazor-gallery.servicestack.net/gallery/autoquerygrid) Vue Components.

### Admin Pages

Whilst Bookings CRUD is a good example of creating custom UI for end users, you may also want to quickly develop a set
of back-office CRUD Admin UIs to manage your App's Database tables, which is easily achievable AutoQueryGrid's default
behavior:

<div class="py-8 max-w-7xl mx-auto px-4 sm:px-6">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="wlRA4_owEsc" style="background-image: url('https://img.youtube.com/vi/wlRA4_owEsc/maxresdefault.jpg')"></lite-youtube>
</div>

The development UX of Admin Pages is further improved in Vue Vite which is able to use SFC Pages and conventional file system
routing to quickly add Admin Pages to manage an App's back-end tables, e.g:

#### [/admin/coupons.vue](https://github.com/NetCoreTemplates/vue-spa/blob/main/MyApp.Client/src/pages/admin/coupons.vue)

```html
<AutoQueryGrid type="Coupon" />
```

#### [/admin/bookings.vue](https://github.com/NetCoreTemplates/vue-spa/blob/main/MyApp.Client/src/pages/admin/bookings.vue)

```html
<AutoQueryGrid type="Booking"
selected-columns="id,name,roomType,roomNumber,bookingStartDate,cost,couponId,discount"
  :header-titles="{ roomNumber:'Room No', bookingStartDate:'Start Date' }"
   :visible-from="{ roomNumber:'lg', cost:'md', couponId:'xl', discount:'never' }" />
```