---
slug: templates-angular
title: Angular Project Templates
---

<div class="not-prose my-8 ml-20 flex justify-center"><svg style="max-width:200px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 250 250" xml:space="preserve">
<g>
	<polygon fill="#DD0031" points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2 	"/>
	<polygon fill="#C3002F" points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 125,230 203.9,186.3 218.1,63.2 125,30 	"/>
	<path fill="#FFFFFF" d="M125,52.1L66.8,182.6h0h21.7h0l11.7-29.2h49.4l11.7,29.2h0h21.7h0L125,52.1L125,52.1L125,52.1L125,52.1
		L125,52.1z M142,135.4H108l17-40.9L142,135.4z"/>
</g>
</svg></div>

[Angular](https://angular.io) is the premier JavaScript framework developed by Google for building applications that live on the web, mobile, or the desktop.

## Angular .NET Core and .NET Framework Single Page App Templates

The templates below have been bootstrapped with the latest angular-cli tooling that's 
[seamlessly integrated](/templates/single-page-apps#end-to-end-typed-apis) into 
ServiceStack's [Recommended Physical Project Structure](/physical-project-structure). 

See the documentation in each project for more info on features of each template:

### [Angular 9 SPA Template](https://github.com/NetCoreTemplates/angular-spa)

.NET 6.0 Angular 9 project generated with [Angular CLI](https://github.com/angular/angular-spa).

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/angular-spa.png)

> Browse [source code](https://github.com/NetCoreTemplates/angular-spa) and install with [x new](/web-new):

Create new Angular Project for .NET 6.0:

```bash
$ x new angular-spa ProjectName
```

Create new Angular Project for .NET Framework:

```bash
$ x new angular-spa-netfx ProjectName
```

#### Angular HTTP Client

The Angular template uses Angular's built-in Rx-enabled HTTP Client with ServiceStack's ambient TypeScript declarations, as it's often preferable to utilize Angular's built-in dependencies when available.

ServiceStack's ambient TypeScript interfaces are leveraged to enable a Typed API, whilst the `createUrl(route,args)` helper lets you reuse your APIs Route definitions (emitted in comments above each Request DTO) to provide a pleasant UX for making API calls using Angular's HTTP Client:

```ts
import { createUrl } from '@servicestack/client';
...

this.http.get<HelloResponse>(createUrl('/hello/{Name}', { name })).subscribe(r => {
    this.result = r.result;
});
```

# Angular Examples

## [TechStacks](https://github.com/ServiceStackApps/TechStacks)

TechStacks is an AngularJS App that lets you explore TechStacks of popular StartUps using your favorite technology

[![TechStacks](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/livedemos/techstacks/screenshots/techstacks.png)](http://angular.techstacks.io)

#### Features 

TechStacks is based on a [Bootstrap template](http://getbootstrap.com) with client-side features:

 - HTML5 Routing to enable pretty urls, also supports full page reloads and back button support
 - Same Services supporting both human-readable Slugs or int primary keys
 - Responsive design supporting iPad Landscape and Portrait modes
 - Preloading and background data fetching to reduce flicker and maximize responsiveness
 - [Disqus](https://disqus.com/) commenting system
 - [Chosen](http://harvesthq.github.io/chosen/) for UX-friendly multi combo boxes

and some of TechStacks back-end features include: 

 - [SEO-optimized, Server HTML generated, read-only version of the website](https://techstacks.io/?html=server)
   - Dynamically generated [sitemaps.xml](https://techstacks.io/sitemap.xml)
 - Page-level Locking
 - Record and Restore Page Content Versioning
 - [Twitter and GitHub OAuth Providers](/auth/authentication-and-authorization)
 - Substitutable [OrmLite](https://github.com/ServiceStack/ServiceStack.OrmLite) RDBMS [PostgreSQL and Sqlite](https://github.com/ServiceStackApps/TechStacks/blob/875e78910e43d2230f0925b71d5990497216511e/src/TechStacks/TechStacks/AppHost.cs#L49-L56) back-ends
 - [Auto Query](/autoquery/) for automatic services of RDBMS tables
 - [RDBMS Sessions and In Memory Caching](/caching)
 - [Fluent Validation](/validation)

