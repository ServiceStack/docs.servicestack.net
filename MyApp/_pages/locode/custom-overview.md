---
title: Custom Locode Apps
---

Locode also lets you create rich custom user experiences by going beyond the [declarative C# dev model](/locode/declarative)
to create custom HTML & JS Components loaded directly in your Locode Apps.

This lets us provide an enhanced UX beyond Locode's default UI to create [Custom Forms](/locode/custom-forms.html) for 
some of our tables or [override Locode's own components](/locode/custom-components) to create a custom home page 
or customize your [App's branding components](/locode/custom.html#custom-app-example) or make use of
[custom format functions](/locode/formatters.html#custom-format-function) to change how results are rendered.

To facilitate custom HTML/JS UI development we've packaged type definitions for all Locode's functionality in the  
`@servicestack/ui` npm package below to enable its productive typed development UX whose changes load instantly without
App restarts when run in development mode:

:::sh
dotnet watch
:::

## Getting Started

When customizing any ServiceStack UI App you can enable static typing and intelli-sense by installing the `@servicestack/ui` npm package
(containing their TypeScript `.d.ts` definitions) in your host project, where you'll be able to use the standard 
[ES6 import syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 
to enable static analysis on any built-in functionality you want to use.

### Install

Add TypeScript definitions for ServiceStack UI's to your Host project with:

:::sh
npm install -D @servicestack/ui
:::

### Update

Update your local Type definitions to the latest version with:

:::sh
npm install @servicestack/ui@latest
:::

## API Reference

Type definitions for functionality available in ServiceStack UI's

[![](/img/pages/locode/shared-api-reference.png)](https://api.locode.dev/modules/shared.html)

### Library Reference

| Namespace                                            | Description                                                                          |
|------------------------------------------------------|--------------------------------------------------------------------------------------|
| [shared](https://api.locode.dev/modules/shared.html) | Type Definitions for all Types and shared functionality used in all UI's             |
| [client](https://api.locode.dev/modules/client.html) | Type Definitions for the [@servicestack/client](https://github.com/ServiceStack/servicestack-client) library |

### UIs

| UI                                                       | Description                                                                      |
|----------------------------------------------------------|----------------------------------------------------------------------------------|
| [locode](https://api.locode.dev/modules/locode.html)     | Global App and Type instances available in [Locode Apps](https://servicestack.net/locode) |
| [explorer](https://api.locode.dev/modules/explorer.html) | Global App and Type instances available in [API Explorer](/api-explorer)         |
| [admin](https://api.locode.dev/modules/admin.html)       | Global App and Type instances available in ServiceStack's [Admin UI](/admin-ui)  |


## Custom UI

Whilst `@servicestack/ui` isn't used at runtime and therefore not strictly required, it contains the type definitions 
for all built-in ServiceStack Apps to enable superior Developer UX by enabling static analysis, rich-intellisense and 
type safety feedback to provide a helpful guide ensuring correct usage of discoverable built-in functionality. 

All built-in ServiceStack Apps can be customized the same way where each of their HTML components can be replaced by 
adding a local file at their same path in your AppHost Project's `/wwwroot/modules` folder: 

## /wwwroot/modules

To make it easy to customize each App, purpose-specific `custom.*` placeholders can be overridden to include additional
CSS, JS and HTML in each App. Whilst any of their existing components can be replaced by adding a local modified copy
in its `/components/*.html` folder. 

We'll go through each App's folder to better visualize their extension placeholders that's available:  

### /locode

Lets you customize [Locode Apps](https://servicestack.net/locode) where [Custom Forms](/locode/custom-forms) can either be registered in 
`custom.html` or added to `/components/*.mjs` where you can also override any of Locode's components by including 
a locally modified copy from
[/components/*.mjs](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack/src/ServiceStack/modules/locode/components)

```files
/wwwroot/modules/locode
  /components
    *.mjs
  custom.js
  custom.css
  custom.html
```

### /ui

Is where to customize your Services [API Explorer UI](/api-explorer) where each API can
be documented by adding [Custom API Docs](/api-explorer#api-docs) to `/docs/*.mjs`,
whilst existing components can be overridden in 
[/components/*.mjs](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack/src/ServiceStack/modules/ui/components)
and custom UI added to `custom.*`

```files
/wwwroot/modules/ui
  /docs
    *.mjs
  /components
    *.mjs
  custom.js
  custom.css
  custom.html
```

### /admin-ui

Is where to add any customizations to [Admin UI](/admin-ui) by overriding existing components in 
[/components/*.mjs](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack/src/ServiceStack/modules/admin-ui/components)
or adding custom UI to `custom.*`

```files
/wwwroot/modules/admin-ui
  /components
    *.mjs
  custom.js
  custom.css
  custom.html
```

### /shared

The shared folder is where you can customize all Apps by overriding generic components in 
[shared/*.html](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack/src/ServiceStack/modules/shared)
whilst custom HTML can be added to the `<head/>`, at the start and end of the `<body/>` of each App by including
the `custom-*.html` placeholders below:

```files
/wwwroot/modules/shared
  custom-head.html
  custom-body.html
  custom-end.html        
```

### Custom App Example

The [Blazor WASM](/templates/blazor-bootstrap) template includes example App customizations with
[Custom API Docs](/api-explorer#api-docs) for its 
[CreateBooking](https://vue-spa.web-templates.io/ui/CreateBooking?tab=details) and
[Todos APIs](https://vue-spa.web-templates.io/ui/QueryTodos?tab=details):

<ul class="list-none">
    <li>
        <a href="https://github.com/LegacyTemplates/blazor-wasm/tree/main/MyApp/wwwroot/modules" class="font-medium">/modules</a>
        <ul class="list-none">
            <li>
                <span class="font-medium">/ui/docs</span>
                <ul class="list-none">
                    <li>
                        <a href="https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.Blazor/tests/ServiceStack.Blazor.Bootstrap.Tests/Server/modules/ui/docs/CreateBookingDocs.mjs">
                            CreateBookingDocs.mjs
                        </a>
                    </li>
                    <li>
                        <a href="https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.Blazor/tests/ServiceStack.Blazor.Bootstrap.Tests/Server/modules/ui/docs/TodoDocs.mjs">
                            TodoDocs.mjs
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
</ul>

Whilst replacing the existing **shared** `Brand` Component changes the top-left App Branding UI in each App:

<ul class="list-none">
    <li>
        <a href="https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack/src/ServiceStack/js/components" class="font-medium">/js/components</a>
        <ul class="list-none">
            <li>
                <a href="https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.Blazor/tests/ServiceStack.Blazor.Bootstrap.Tests/Server/js/components/Brand.mjs">
                    Brand.mjs
                </a>
            </li>
        </ul>
    </li>
</ul>

Next we'll see how we to create [Custom Forms](/locode/custom-forms) to replace the Auto Form UI in Locode Apps.