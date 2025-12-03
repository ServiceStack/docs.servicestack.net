---
slug: templates-nuxt
title: Nuxt Project Templates
---

:::warning DEPRECATED
The Nuxt .NET Core SPA template is no longer being actively maintained
:::

<div class="not-prose my-8 ml-20 flex justify-center"><svg style="max-width:200px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 298"><g fill="none" fill-rule="nonzero"><path fill="#00C58E" d="M227.92099 82.07407l-13.6889 23.7037-46.8148-81.08641L23.7037 273.58025h97.3037c0 13.0912 10.61252 23.7037 23.70371 23.7037H23.70371c-8.46771 0-16.29145-4.52017-20.5246-11.85382-4.23315-7.33366-4.23272-16.36849.00114-23.70174L146.89383 12.83951c4.23415-7.33433 12.0596-11.85252 20.5284-11.85252 8.46878 0 16.29423 4.51819 20.52839 11.85252l39.97037 69.23456z"/><path fill="#2F495E" d="M331.6642 261.7284l-90.05432-155.95062-13.6889-23.7037-13.68888 23.7037-90.04445 155.95061c-4.23385 7.33325-4.23428 16.36808-.00113 23.70174 4.23314 7.33365 12.05689 11.85382 20.5246 11.85382h166.4c8.46946 0 16.29644-4.51525 20.532-11.84955 4.23555-7.3343 4.23606-16.37123.00132-23.706h.01976zM144.7111 273.58024L227.921 129.48148l83.19012 144.09877h-166.4z"/><path fill="#108775" d="M396.04938 285.4321c-4.23344 7.33254-12.05656 11.85185-20.52345 11.85185H311.1111c13.0912 0 23.7037-10.6125 23.7037-23.7037h40.66173L260.09877 73.74815l-18.4889 32.02963-13.68888-23.7037L239.5753 61.8963c4.23416-7.33433 12.0596-11.85252 20.5284-11.85252 8.46879 0 16.29423 4.51819 20.52839 11.85252l115.41728 199.8321c4.23426 7.33395 4.23426 16.36975 0 23.7037z"/></g></svg></div>

[Nuxt.js](https://nuxtjs.org) is an exciting opinionated structured framework for rapidly developing Web Applications in a single unified solution pre-configured with Vue's high-quality components that abstracts away the complex build systems of Webpack powered JS Apps.

If you've been intimidated with amount of complexity and knowledge required to develop an App using one of the major JS frameworks, we highly recommend evaluating Nuxt.js. Nuxt is an opinionated framework that integrates the most popular Vue components together in a pre-configured solution. It's like developing within guard rails where it lets you develop entire websites using just [Vue Single File Components](https://vuejs.org/v2/guide/single-file-components.html) placed in a [conventional file and directory structure](https://nuxtjs.org/guide/routing) where Nuxt will take care of managing the routing and abstracts away the build configuration to generate optimal production builds where it employs advanced packaging techniques like automatic code splitting, link prefetching, SPA navigation of statically-generated cacheable assets and integrated support for ES6/7 transpilation, linting and js/css bundling and minification.

Its watched builds enables Hot Module Replacement to enable the optimal development experience where it you will be able to see changes in real-time without needing to manually build or refresh pages. The Nuxt templates are also configured to support [.NET Core's watched builds](/templates/websites#watched-net-core-builds) which automatically detects changes to your .NET Core App and re-compiles and restarts them with the new changes. 

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/vue-nuxt.png)](https://github.com/NetCoreTemplates/vue-nuxt)

### ServiceStack Integration

Whilst Nuxt and ServiceStack are 2 different frameworks, we've combined them in a single seamlessly integrated .NET Core project. ServiceStack shines here where as the [TypeScript JsonServiceClient](/typescript-add-servicestack-reference#typescript-serviceclient) utilizes ServiceStack's [pre-defined Routes](/routing#pre-defined-routes) we can proxy all JSON API requests to our .NET Core App with a single config in [nuxt.config.js](https://github.com/NetCoreTemplates/vue-nuxt/blob/master/MyApp/nuxt.config.js) and an additional entry to proxy links to any configured [OAuth Providers](/auth/authentication-and-authorization#oauth-providers):

```js
  proxy: {
    '/json': 'http://localhost:5000/',
    '/auth': 'http://localhost:5000/',
  },
```

This lets us use Nuxt's Web Dev Server during development to take advantage of its incremental compilation, Live Reloading and instant UI updates. 

### Nuxt Templates 

There are 2 variants of Nuxt templates available for both .NET Core and .NET Framework:

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/vue-nuxt.png)](https://github.com/NetCoreTemplates/vue-nuxt)

#### .NET Core

  - [vue-nuxt](https://github.com/NetCoreTemplates/vue-nuxt) - Vue + Nuxt
  - [vuetify-nuxt](https://github.com/NetCoreTemplates/vuetify-nuxt) - Vue + Nuxt + Vuetify

#### .NET Framework

  - [vue-nuxt-netfx](https://github.com/NetFrameworkTemplates/vue-nuxt-netfx) - Vue + Nuxt
  - [vuetify-nuxt-netfx](https://github.com/NetFrameworkTemplates/vuetify-nuxt-netfx) - Vue + Nuxt + Vuetify

### Getting Started 

To experience App development with Nuxt.js, create a new Nuxt Project using [x new](/web-new):

```bash
$ x new vue-nuxt ProjectName
```

Download npm and .NET Core dependencies:

```bash
$ npm install
$ dotnet restore
```

### Dev Workflow

Start a [watched .NET Core build](/templates/websites#watched-net-core-builds) in the background from the command-line with:

```bash
$ dotnet watch run
```

In a new terminal window start a watched Nuxt dev server build with:

```bash
$ npm run dev
```

Then open `http://localhost:3000` in your browser to view your App served directly from Nuxt's dev server which will proxy all Server requests to ServiceStack Server running on `http://localhost:5000`. Any changes you make to your front-end will be automatically re-compiled and reloaded by the watched `Nuxt` build whilst any changes to your Server app will be automatically be rebuilt and restarted by the watched `dotnet` process.

### Update DTOs

Whilst Nuxt is a JavaScript (ES 6/7) App it still benefits from ServiceStack's [TypeScript Add Reference feature](/typescript-add-servicestack-reference) where you can generate typed DTOs with the `dtos` npm script:

```bash
$ npm run dtos
```

This will update the Servers `dtos.ts` and generate its corresponding `dtos.js` which can be natively imported as seen in 
[gateway.js](https://github.com/NetCoreTemplates/vue-nuxt/blob/master/MyApp/src/shared/gateway.js#L3). Despite the App not being built with TypeScript, developing using a "TypeScript-aware" IDE like VS Code will still be able to utilize the generated `dtos.ts` to provide a rich intelli-sense experience.

### Generate Static Production Build

Most of the time during development you'll be viewing your App through Nuxt's dev server to take advantage of it's instant UI updates. At any time you can also view a production build of your App with:

```bash
$ npm run build
```

This will generate a static encapsulated production build of your App in .NET Core's `/wwwroot` which you can view served from your ServiceStack Server App directly at:

    http://localhost:5000


### Publishing App for Deployment

To create a complete client and server build of your App run:

```bash
$ npm run publish
```

This publishes your App to `bin/Release/netcoreapp3.1/publish` that can then be deployed like any normal .NET Core App.

### Host static content on Netlify's CDN for free

One of the advantages of using Nuxt is that it generates a front-end UI with static `.html` files for all pages. This allows the static content of your Web App to be cleanly decoupled from your back-end your Server App and hosted independently on a CDN. Netlify makes this effortless where you can [Sign In with your GitHub account](https://app.netlify.com/signup) and get it to create a new Site from a GitHub repository where you can tell it to host the static content in your .NET Core Apps `/wwwroot` folder on its CDN. It also synchronizes updates with every check-in so it automatically updates whenever you check-in a new version of your .NET Core project. 

Netlify has built first-class support for hosting Single Page Apps like Nuxt where it lets you check-in a [simple _redirects file](https://www.netlify.com/docs/redirects/) with all routes you want to be served by your .NET Core App and it will transparently proxy any API requests to your back-end server without needing to enable CORS. So the same .NET Core App that runs locally will be able to run without code changes when deployed despite having all its bandwidth intensive content served directly from Netlify's CDN. This opens up a nice scalability option for your App Servers, maximizing their efficiency as .NET Core Apps just ends up serving dynamic JSON API requests.
