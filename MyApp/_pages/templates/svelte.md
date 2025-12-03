---
slug: templates-svelte
title: Svelte Project Templates
---

::: warning DEPRECATED
The Svelte .NET Core SPA template is no longer being actively maintained 
:::

<div class="not-prose my-8 ml-20 flex justify-center"><svg style="max-width:200px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 98.1 118" xml:space="preserve">
<path fill="#FF3E00" d="M91.8,15.6C80.9-0.1,59.2-4.7,43.6,5.2L16.1,22.8C8.6,27.5,3.4,35.2,1.9,43.9c-1.3,7.3-0.2,14.8,3.3,21.3
	c-2.4,3.6-4,7.6-4.7,11.8c-1.6,8.9,0.5,18.1,5.7,25.4c11,15.7,32.6,20.3,48.2,10.4l27.5-17.5c7.5-4.7,12.7-12.4,14.2-21.1
	c1.3-7.3,0.2-14.8-3.3-21.3c2.4-3.6,4-7.6,4.7-11.8C99.2,32.1,97.1,22.9,91.8,15.6"/>
<path fill="#FFFFFF" d="M40.9,103.9c-8.9,2.3-18.2-1.2-23.4-8.7c-3.2-4.4-4.4-9.9-3.5-15.3c0.2-0.9,0.4-1.7,0.6-2.6l0.5-1.6l1.4,1
	c3.3,2.4,6.9,4.2,10.8,5.4l1,0.3l-0.1,1c-0.1,1.4,0.3,2.9,1.1,4.1c1.6,2.3,4.4,3.4,7.1,2.7c0.6-0.2,1.2-0.4,1.7-0.7L65.5,72
	c1.4-0.9,2.3-2.2,2.6-3.8c0.3-1.6-0.1-3.3-1-4.6c-1.6-2.3-4.4-3.3-7.1-2.6c-0.6,0.2-1.2,0.4-1.7,0.7l-10.5,6.7
	c-1.7,1.1-3.6,1.9-5.6,2.4c-8.9,2.3-18.2-1.2-23.4-8.7c-3.1-4.4-4.4-9.9-3.4-15.3c0.9-5.2,4.1-9.9,8.6-12.7l27.5-17.5
	c1.7-1.1,3.6-1.9,5.6-2.5c8.9-2.3,18.2,1.2,23.4,8.7c3.2,4.4,4.4,9.9,3.5,15.3c-0.2,0.9-0.4,1.7-0.7,2.6l-0.5,1.6l-1.4-1
	c-3.3-2.4-6.9-4.2-10.8-5.4l-1-0.3l0.1-1c0.1-1.4-0.3-2.9-1.1-4.1c-1.6-2.3-4.4-3.3-7.1-2.6c-0.6,0.2-1.2,0.4-1.7,0.7L32.4,46.1
	c-1.4,0.9-2.3,2.2-2.6,3.8s0.1,3.3,1,4.6c1.6,2.3,4.4,3.3,7.1,2.6c0.6-0.2,1.2-0.4,1.7-0.7l10.5-6.7c1.7-1.1,3.6-1.9,5.6-2.5
	c8.9-2.3,18.2,1.2,23.4,8.7c3.2,4.4,4.4,9.9,3.5,15.3c-0.9,5.2-4.1,9.9-8.6,12.7l-27.5,17.5C44.8,102.5,42.9,103.3,40.9,103.9"/>
</svg></div>

[Svelte](https://svelte.dev/) is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app.

Instead of using techniques like virtual DOM diffing, Svelte writes code that surgically updates the DOM when the state of your app changes.

[Read the introductory blog post](https://svelte.dev/blog/svelte-3-rethinking-reactivity) to learn more.

## Svelte .NET Core Single Page App Templates

.NET 8.0 svelte v3 rollup App Project Template integrated with ServiceStack Services and built-in Routing, User Registration and Sign Up forms.

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/svelte-spa.png)

> Browse [source code](https://github.com/LegacyTemplates/svelte-spa) and install with [dotnet-new](/dotnet-new):

```bash
$ dotnet tool install -g x
```

## Development workflow

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/screencasts/svelte-spa-youtube.png)](https://youtu.be/cKlFABFECnQ)

::: info YouTube
[youtu.be/cKlFABFECnQ](https://youtu.be/cKlFABFECnQ)
:::

Run the `dev` npm script or Gulp task and leave it running in the background:

```bash
$ npm run dev
```

This initially generates a full development build of your Web App then stays running in the background to process files as they’re changed. This enables the normal dev workflow of running your ASP.NET Web App, saving changes locally which are then reloaded using ServiceStack’s built-in hot reloading. Alternatively hitting `F5` will refresh the page and view the latest changes.

Each change updates the output dev resources so even if you stop the dev task your Web App remains in a working state that’s viewable when running the ASP.NET Web App.

### Watched .NET Core builds

.NET Core projects can also benefit from Live Coding using dotnet watch which performs a “watched build” where it automatically stops, recompiles and restarts your .NET Core App when it detects source file changes. You can start a watched build from the command-line with:

```bash
$ dotnet watch run
```

### Create a production build

Run the `build` npm script or gulp task to generate a static production build of your App saved to your .NET App's `/wwwroot` folder:

```bash
$ npm run build
```

This will let you run the production build of your App that's hosted by your .NET App.

### Updating Server TypeScript DTOs

Run the `dtos` npm script or Gulp task to update your server dtos in `/src/dtos.ts`:

```bash
$ npm run dtos
```

### Deployments

When your App is ready to deploy, run the `publish` npm (or Gulp) script to package your App for deployment:

```bash
$ npm run publish
```

Which will create a production build of your App which then runs `dotnet publish -c Release` to Publish a Release build of your App in the `/bin/netcoreapp3.1/publish` folder which can then copied to remote server or an included in a Docker container to deploy your App.

## Svelte template

This project was bootstrapped with [sveltejs/template](https://github.com/sveltejs/template). To learn more about Svelte we recommend going through 
[Svelte's interactive tutorial](https://svelte.dev/tutorial/basics).
