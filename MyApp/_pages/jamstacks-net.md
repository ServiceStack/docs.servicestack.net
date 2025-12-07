---
slug: jamstacks-net
title: Jamstack Templates
---

[![](/img/pages/jamstack/jamstacks-net-title.png)](https://jamstacks.net)

We've created 4 new templates following the Jamstack style architecture. 

Jamstack is a broad architecture that is built around pre-rendering your front end, and decoupling your it from the backend APIs it uses.

This aligns with ServiceStack's API first design which makes this architecture easy to recommend for nearly any kind of web application.

To help make these templates easier to use and discover, we've created [Jamstacks.net](https://jamstacks.net) which allows you to provite a name and download a templated application based on your preference of front end technology.

## [Next.js](https://nextjs.jamstacks.net)

For those that prefer working with React, Next.js offers a React based framework with a lot of common features and static generation built in.
This enables developers to be highly productive from the very beginning by using the pre-defined patterns the framework promotes rather than rolling your own.

<img src="/img/pages/jamstack/next-black.svg" class="mx-auto block" />

Next.js is built by the folks over at Vercel, so has a huge engineering effort behind both React and Next.js itself. This gives developers a lot of confidence about the longevity of this framework and base technology, knowing that it won't be a short-lived product.

Although Vercel offers hosting of your Next.js application along with serverless functions (Node only), they can limit their reuse and flexibility.
Having [well-defined APIs that are self-descriptive](/add-servicestack-reference) means regardless of the client language, platform or technology, the utility of your APIs is highly accessible enabling a larger return on investment for their development.

This makes the combination of ServiceStack APIs and Next.js a highly productive technology stack when using Next.js static site generation (SSG).
The Next.js template leverages these features and provides examples like a Bookings client + API as well as Todo list.

[![](/img/pages/jamstack/nextjs-bookings.png)](https://nextjs.jamstacks.net/bookings-crud)

Load times for pages are lightning fast since all the content is static and hosted on a Content Delivery Network (CDN) close to users locations.
One of the by-products of building a Jamstack application is that fast + efficient hosting as well as SEO is something you get by default.
And with your ServiceStack API hosted separately, only functionality that needs to fetch data from your APIs will need to travel that extra distance, 
making use of your API server more efficient and a better experience for your users.

![](/img/pages/jamstack/cdn-world-view.png)

## [Vue3 + Vite](https://vue-static.web-templates.io)

The Vue + Vite template uses the new JavaScript build tool Vite (pronounced Veet) which provides unmatched speed when it comes to hot reload and iteration.

This template provides all the config for using Tailwind, TypeScript, Vue3 and Vite together along with routing, Markdown, static site generation and loads more.

**vue-static** provides a productive Single Page Application template with the added advantage of being out to statically generate the pages to be deployed on a CDN.

![](/img/pages/jamstack/vue-vite-tech.png)

## Bookings

To give developers a head start, we have provided several working examples to demonstrate features that all four templates have.

The Bookings CRUD example allows users to manage bookings resources using a ServiceStack [AutoQuery CRUD service](/autoquery/crud).
Validation and errors are managed using components provided by the template and ServiceStack client libraries.

These generic components, including the new ServiceStack.Blazor client library, mean you can focus on building your application and less on repetitive plumbing.

![](/img/pages/jamstack/bookings-comparison.png)

## Todo

Next is the Todo MVC example. This is made up of standard ServiceStack services for interactions using an in-memory AutoQuery Datasource managing Todos as well as filtering.

![](/img/pages/jamstack/todomvc-comparison.png)

All these UIs have links at the bottom to look at the related source code.

## Markdown Pages.

All templates also provide the ability to create Markdown pages. This is ideal for sites that need to generate a lot of content along side their web application.
Being able to use Markdown means non-developers can contribute written content without needing to learn HTML.