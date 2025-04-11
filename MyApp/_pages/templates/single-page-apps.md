---
title: Single Page App Project Templates
slug: templates-single-page-apps
---

The [ServiceStackVS VS.NET extension](https://github.com/ServiceStack/ServiceStackVS) contains a pre-configured Single Page App VS.NET template for each of the popular JavaScript frameworks:

[![](./img/pages/ssvs/new-spa-project.png)](/create-your-first-webservice#step-1-download-and-install-servicestackvs)

The Single Page App (SPA) project templates can also be created using the [dotnet-new](/templates/dotnet-new) command line tool:

```bash
$ npm install -g @servicestack/cli
```

```bash
$ dotnet-new <template-name> ProjectName
```

Click on the template name below to view a Live Demo and contents of each project template:

| .NET Core C# Templates                                           |                                                              |
|------------------------------------------------------------------|--------------------------------------------------------------|
| [angular-spa](https://github.com/NetCoreTemplates/angular-spa)   | .NET 6.0 Angular CLI Bootstrap App                           |
| [react-spa](https://github.com/NetCoreTemplates/react-spa)       | .NET 6.0 React Create App CLI Bootstrap App                  |
| [vue-nuxt](https://github.com/NetCoreTemplates/vue-nuxt)         | .NET 6.0 Nuxt.js SPA App with Bootstrap                      |
| [vue-spa](https://github.com/NetCoreTemplates/vue-spa)           | .NET 6.0 Vue CLI Bootstrap App                               |


The .NET 6.0 project templates utilizes MSBuild's newer and human-friendly format which can be developed using your preferred C# IDE of VS.NET, VS Code or Rider.

| .NET Framework C# Templates                                                                   |                                                     |
|-----------------------------------------------------------------------------------------------|-----------------------------------------------------|
| [angular-spa-netfx](https://github.com/NetFrameworkTemplates/angular-spa-netfx)               | .NET Framework Angular Bootstrap cli.angular.io App |
| [aurelia-spa-netfx](https://github.com/NetFrameworkTemplates/aurelia-spa-netfx)               | .NET Framework Aurelia Bootstrap Webpack App        |
| [react-desktop-apps-netfx](https://github.com/NetFrameworkTemplates/react-desktop-apps-netfx) | .NET Framework React Desktop Apps                   |
| [react-spa-netfx](https://github.com/NetFrameworkTemplates/react-spa-netfx)                   | .NET Framework React Bootstrap Webpack App          |
| [vue-nuxt-netfx](https://github.com/NetFrameworkTemplates/vue-nuxt-netfx)                     | .NET Framework Vue Nuxt.js SPA Web App              |
| [vue-spa-netfx](https://github.com/NetFrameworkTemplates/vue-spa-netfx)                       | .NET Framework Vue Bootstrap Webpack App            |
| [vuetify-nuxt-netfx](https://github.com/NetFrameworkTemplates/vuetify-nuxt-netfx)             | .NET Framework Vuetify Material Nuxt.js SPA Web App |
| [vuetify-spa-netfx](https://github.com/NetFrameworkTemplates/vuetify-spa-netfx)               | .NET Framework Vuetify Material Webpack App         |

| ASP.NET Core Framework Templates                                                    |                                                                        |
|-------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| [react-lite-corefx](https://github.com/NetFrameworkCoreTemplates/react-lite-corefx) | .NET Framework ASP.NET Core lite (npm-free) React SPA using TypeScript |
| [vue-lite-corefx](https://github.com/NetFrameworkCoreTemplates/vue-lite-corefx)     | .NET Framework ASP.NET Core lite (npm-free) Vue SPA using TypeScript   |


.NET Framework Templates utilize MSBuild's classic project format which can be developed using either VS.NET or Rider.

[![](/img/pages/ssvs/spa-templates-overview.png)](/img/pages/ssvs/spa-templates-overview.png)

Please refer to the documentation in each Project Template for info, scripts and features that's specific to each project template. We'll cover common features
available in most SPA Templates.

Available SPA Project Templates have been bootstrapped with latest CLI tools and are each pre-configured with npm scripts which takes care of all 
packaging and bundling requirements. Gulp is primarily used to provide a GUI to run the 
[templates npm scripts](https://github.com/NetCoreTemplates/vue-spa/blob/9f4c81c9f6dc5e1e812238357853eb0ea08bac51/MyApp/package.json#L7-L15) 
in VS.NET's Task Runner Explorer so all templates features can be accessed without leaving VS.NET, or if preferred each npm script can also be run 
on the command-line with:
 
```bash
$ npm run {script name}
```

All templates also follow our [Recommended Physical Project Structure](/physical-project-structure) ensuring ServiceStack projects starts off from 
an optimal logical project layout, laying the foundation for growing into a more maintainable, cohesive and reusable code-base.

### End-to-end Typed APIs
 
![](/img/pages/ssvs/servicestack-ts.png)
 
Each template is seamlessly integrated with ServiceStack's [TypeScript Add Reference](/typescript-add-servicestack-reference) and generic TypeScript [@servicestack/client](https://github.com/ServiceStack/servicestack-client) to provide an end-to-end Typed API to call your Services that can be synced with your Server DTOs by running the npm (or Gulp) `dtos` script. 

The [Typed API request below](https://github.com/NetCoreTemplates/vue-spa/blob/master/MyApp/src/home/Home.vue) uses the Server Generated 
[dtos.ts](https://github.com/NetCoreTemplates/vue-spa/blob/master/MyApp/src/dtos.ts) and generic `JsonServiceClient` to display a Welcome message on each key-press:
 
```ts
import { client } from '../shared';
import { Hello } from '../dtos';
 
async nameChanged(name: string) {
    if (name) {
        let request = new Hello();
        request.name = name;
        let r = await client.get(request);
        this.result = r.result;
    } else {
        this.result = '';
    }
}
```
 
The imported `client` is an instance of `JsonServiceClient` declared in [shared.ts](https://github.com/NetCoreTemplates/vue-spa/blob/master/MyApp/src/shared.ts) module, configured with the BaseUrl at `/`:
 
```ts
export var client = new JsonServiceClient(global.BaseUrl || '/');
```
 
The `global.BaseUrl` is defined in [package.json](https://github.com/NetCoreTemplates/vue-spa/blob/9f4c81c9f6dc5e1e812238357853eb0ea08bac51/MyApp/package.json#L19) and injected by [Jest](https://facebook.github.io/jest/) or [Karma](https://karma-runner.github.io/2.0/index.html) in order to be able to run end-to-end Integration tests.
 
### Angular 5 HTTP Client

The Angular 5 template is also configured to use Angular's built-in Rx-enabled HTTP Client with ServiceStack's ambient TypeScript declarations, as it's often preferable to utilize Angular's built-in dependencies when available. 

ServiceStack's ambient TypeScript interfaces are leveraged to enable a Typed API, whilst the `createUrl(route,args)` helper lets you reuse your APIs Route definitions (emitted in comments above each Request DTO) to provide a pleasant UX for making API calls using Angular's HTTP Client:

```ts
import { createUrl } from '@servicestack/client';
...

this.http.get<HelloResponse>(createUrl('/hello/{Name}', { name })).subscribe(r => {
    this.result = r.result;
});
```

### TypeScript and Sass
 
![](/img/pages/ssvs/sass-ts.png)
 
All templates are configured with TypeScript which we believe provides the greatest value in enabling a highly-productive and maintainable code-base. TypeScript lets you utilize the latest ES6/7 features including terse ES6 modules and async/await support whilst being able to target down-level browsers. Other benefits include better documented typed APIs, instant compiler feedback, rich intellisense and refactoring support in a graceful superset of JavaScript that scales well to be able develop prototypes quickly then easily go back to harden existing code-bases with optional Type information, catching common errors at compile-time whilst annotating modules with valuable documentation other developers can benefit from.
 
Whilst CSS is a powerful language for styling Web Apps it lacks many of the DRY and reuse features we take for granted in a general purpose programming language. [SASS](http://sass-lang.com/) is designed to close that gap with a number of useful extensions to CSS aimed at enabling a highly-maintainable, modular and configurable css code-base. If you prefer to avoid learning SASS you can continue using vanilla css which has been enhanced with [autoprefixer](https://github.com/postcss/autoprefixer) [online version](https://goonlinetools.com/autoprefixer/) and [precss](https://github.com/jonathantneal/precss) support.

### Optimal Dev Workflow with Hot Reloading

The templates include a hot-reload feature which works similar to [Sharp Pages hot-reloading](https://sharpscript.net/docs/hot-reloading) where in **DebugMode** it will long poll the server to watch for any modified files in `/wwwroot` and automatically refresh the page. 

Hot Reloading works by leveraging [ServiceStack Sharp Pages](https://sharpscript.net/docs/script-pages) which works seamlessly with Webpack's generated `index.html` where it evaluates server Template Expressions when returning the SPA home page. This is leveraged to enable Hot Reloading support by [including the expression](https://github.com/NetCoreTemplates/vue-spa/blob/0c13183b6a5ae20564f650e50d29b9d4e36cbd0c/MyApp/index.template.ejs#L8):

```html
<i hidden>{{ '/js/hot-fileloader.js' | ifDebugIncludeScript }}</i>
```

Which renders the contents of [/js/hot-fileloader.js](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/js/hot-fileloader.js) when running the Web App during development.

Although optional, `#Script` is useful whenever you need to render any server logic in the SPA home page, e.g:

```html 
<div>Copyright &copy; {{ now | dateFormat('yyyy') }}</div>
```

Will be evaluated on the server and render the expected:
 
```
Copyright © 2022
```

### [Quick tour of Webpack](/templates/webpack)

Most SPA projects are pre-configured with tooling to manage their own Webpack app builds, but if you want to learn more please see the [Tour of Webpack](/templates/webpack).

### Watched .NET Core builds

.NET Core projects can also benefit from [Live Coding using dotnet watch](https://dotnetcoretutorials.com/2017/01/31/live-coding-net-core-using-dotnet-watch/) which performs a "watched build" where it automatically stops, recompiles and restarts your .NET Core App when it detects source file changes. You can start a watched build from the command-line with:

```bash
$ dotnet watch run
```

## Single Page App Features
 
Our goals with the Single Page Templates is to provide a highly productive base that's ideal for developing small to medium-sized JavaScript Web Apps including just the core essentials that pack the most productive punch whilst adding minimal complexity and required configuration, whilst still remaining open-ended to easily plug-in other tools into your Webpack configuration you believe will improve your development workflow. 
 
With these goals in mind we've hand-picked and integrated a number of simple best-of-breed technologies so you'll be immediately productive:
 
### Integrated UI framework and Vector Icons
 
![](/img/pages/ssvs/bootstrap-fontawesome-material.png)
 
Vue, React, Angular 5 and Aurelia are pre-configured with [Bootstrap v4](https://getbootstrap.com/) and [font-awesome vector font icons](http://fontawesome.io/icons/) whilst Angular 4 is preconfigured to use [Material Design Lite](https://getmdl.io/) and [Material Design Icons](https://material.io/icons/) providing a solution for utilizing resources which are all developed and maintained by Google.

#### Updating Server TypeScript DTOs
 
To get the latest Server DTOs, build the ASP.NET Web App then either right-click on `dtos.ts` and select **Update ServiceStack Reference** from the Context Menu:
 
![](/img/pages/servicestack-reference/typescript-update-reference.png)
 
Or alternatively you can run the `dtos` Gulp task in Task Runner Explorer GUI, or if preferred, run the script on the command-line with:
 
```bash
$ npm run dtos
```
 
### Routing Enabled, Multi-page Layout
  
All templates have multiple views with Routing enabled so they're all setup to develop multi-page navigable Single Page Apps out-of-the-gate. All templates are designed to be functionally equivalent utilizing a 3 page tabbed layout but implemented using their own idiomatic style so you'll be able to easily inspect and compare the structure and ergonomics of each JavaScript framework to evaluate the one you like best.
 
![](/img/pages/ssvs/routing-overview.png)
 
### Deep linkable Pretty URLs
 
All Single Page Apps are configured to use Pretty URLs (i.e. without `#!`) and are deep-linkable so they behave similarly to server-generated websites in that they support the back button and full-page reloads to refresh the current page. This works behind the scenes using a `[FallbackRoute]` to have all unknown routes return the home page so the route can be handled on the client to load the appropriate view.
 
### JavaScript Unit Testing
 
Aurelia, React and React Desktop Apps are configured to use [Facebook's Jest Testing Framework](https://facebook.github.io/jest/) with the React Templates configured to use [Airbnb's enzyme virtual React DOM](https://github.com/airbnb/enzyme) to enable fast, browser-less tests and includes a few different examples of client/server integration tests.
 
Angular and Vue are configured to use the [Karma test runner](https://karma-runner.github.io/1.0/index.html) with the headless phantomjs WebKit browser so the behavior of Components are tested in a real browser.
 
Tests can be run with the `tests-run` gulp task, or on the command-line using any of npm's testing conventions:
 
```bash
$ npm test
$ npm t
```
 
#### Live Testing
 
Each template also includes support for Live Testing which can be run in the background by clicking the `tests-watch` Gulp task or on the command-line with:
 
```bash
$ npm run test-watch
```
 
Live testing automatically re-runs JavaScript tests after each change to provide instant feedback to detect when changes causes existing tests to fail.
 
![](/img/pages/ssvs/gulp-tests-watch.png)
 
### Track progress whilst templates are being created

The Single Page App templates sources their client dependencies from npm which can take up to few minutes to finish downloading and installing. You'll be able to see its progress by looking at the `Bower/npm` Output Window in VS.NET:

![](/img/pages/ssvs/npm-progress.png)

You'll be able to detect when it's finished by waiting for the original contents of **wwwroot/index.html**:

```html
<!-- auto-generated by webpack -->
```

to be replaced with a [Webpack generated html template](https://github.com/NetCoreTemplates/vue-spa/blob/master/MyApp/wwwroot/index.html).

### Keep Desktop node and VS.NET in sync
 
Unfortunately VS.NET 2017 ships with an outdated version of **node.exe** which can be problematic when trying to run scripts from the command-line with a locally installed version of node as native module packages like **node-sass** are coupled to the specific node version and platform they were installed with. This can easily be resolved by configuring VS.NET to use your Desktop version of node instead by adding its the **C:\Program Files\nodejs** folder as the first path in: 
 
```
Tools > Options > Projects and Solutions > External Web Tools
```
 
![](/img/pages/ssvs/node-external-tools.png)
 
## SPA Project Templates Overview

All templates can be installed using our [dotnet-new](/templates/dotnet-new) tool, which if not already can be installed with:

```bash
$ dotnet tool install --global x 
```

The SPA Project Templates below have been bootstrapped with the latest CLI tools from their respective JS Frameworks:

### [vue-spa](https://github.com/NetCoreTemplates/vue-spa)

Bootstrapped with [Vue CLI 3](https://cli.vuejs.org/).

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/vue-spa.png)](https://github.com/NetCoreTemplates/vue-spa)

Create new Vue 2.5 Project for .NET 6.0:

```bash
$ x new vue-spa ProjectName
```

Create new Vue 2.5 Project for .NET Framework:

```bash
$ x new vue-spa-netfx ProjectName
```

### [react-spa](https://github.com/NetCoreTemplates/react-spa)

Bootstrapped with [create-react-app](https://github.com/facebook/create-react-app).

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/react-spa.png)](https://github.com/NetCoreTemplates/react-spa)

Create new React 16 Project for .NET 6.0:

```bash
$ x new react-spa ProjectName
```

Create new React 16 Project for .NET Framework:

```bash
$ x new react-spa-netfx ProjectName
```

### [angular-spa](https://github.com/NetCoreTemplates/angular-spa)

Bootstrapped with [Angular CLI](https://cli.angular.io).

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/angular-spa-bootstrap.png)](https://github.com/NetCoreTemplates/angular-spa)

Create new Angular Project for .NET 6.0:

```bash
$ x new angular-spa ProjectName
```

Create new Angular Project for .NET Framework:

```bash
$ x new angular-spa-netfx ProjectName
```

### [vuetify-spa](https://github.com/NetCoreTemplates/vuetify-spa)

Bootstrapped with [Vue CLI 3](https://cli.vuejs.org/) and the [vuetify cli plugin](https://github.com/vuetifyjs/vue-cli-plugin-vuetify).

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/vuetify-spa.png)](https://github.com/NetCoreTemplates/vuetify-spa)

Create new Vuetify Project for .NET 6.0:

```bash
$ x new vuetify-spa ProjectName
```

Create new Vuetify Project for .NET Framework:

```bash
$ x new vuetify-spa-netfx ProjectName
```

### [vue-nuxt](https://github.com/NetCoreTemplates/vue-nuxt)

Bootstrapped with [Nuxt.js starter template](https://nuxtjs.org/guide/installation).

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/vue-nuxt.png)](https://github.com/NetCoreTemplates/vue-nuxt)

Create new Nuxt.js v1.4.2 Project for .NET 6.0:

```bash
$ x new vue-nuxt ProjectName
```

Create new Nuxt.js v1.4.2 Project for .NET Framework:

```bash
$ x new vue-nuxt-netfx ProjectName
```

### [vuetify-nuxt](https://github.com/NetCoreTemplates/vuetify-nuxt)

Bootstrapped with [Nuxt.js + Vuetify.js starter template](https://github.com/vuetifyjs/nuxt).

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/vuetify-nuxt.png)](https://github.com/NetCoreTemplates/vuetify-nuxt)

Create new Nuxt Vuetify Project for .NET 6.0:

```bash
$ x new vuetify-nuxt ProjectName
```

Create new Nuxt Vuetify Project for .NET Framework:

```bash
$ x new vuetify-nuxt-netfx ProjectName
```

### SPA Project Templates Dev Workflow 

Whilst the client Application has been generated by the official CLI tool from each project, all templates continue to enjoy seamless integration 
with ServiceStack and follows its recommended [Physical Project Structure](/physical-project-structure). 
As the npm scripts vary slightly between projects, you'll need to refer to the documentation in the GitHub project of each template for 
the functionality available, but they all typically share the same functionality below to manage your projects development lifecycle:

Start a watched client build which will recompile and reload web assets on save:

```bash
$ npm run dev
```

Start a watched .NET Core build which will recompile C# `.cs` source files on save and restart the ServiceStack .NET Core App:

```bash
$ dotnet watch run
```

Leaving the above 2 commands running takes care of most of the development workflow which handles recompilation of both modified client and server source code.

Regenerate your client TypeScript DTOs after making a change to any Services:

```bash
$ npm run dtos
```

Create an optimized client and package a Release build of your App:

```bash
$ npm run publish
```

Which will publish your App to `bin/Release/netcoreapp3.1/publish` ready for deployment.

#### Testing

The major JS Framework Templates are also pre-configured with their preferred unit testing solution which are run with npm's `test` command:

```bash
$ npm test
```

Whilst Vue and Angular also include support for running end-to-end integration tests in a browser:

```bash
$ npm run e2e
```

This also highlights one of the benefits of utilizing npm's vibrant ecosystem where it benefits from significant investments like [cypress.io](https://www.cypress.io) which provides a complete solution for running integration tests:

![](/img/pages/ssvs/vue/cypress.png)

### Parcel SPA Template

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/parcel.png)](https://github.com/NetCoreTemplates/parcel)

Create new Parcel Template:

```bash
$ x new parcel ProjectName
```

[Parcel](https://parceljs.org) aims to provide the simplest out-of-the-box development experience for creating modern npm-powered 
Web Apps by getting out of your way and letting you develop Websites without regard for a bundling solution or JS Framework. 

To enlist its functionality you just point `parcel` to your home page:

```bash
$ parcel index.html
```

This starts a Live Hot Reload Server which inspects all linked `*.html`, script and stylesheet resources to find all dependencies which it automatically 
monitors for changes where it will automatically rebuild and reload your webpage. Then when it's time for deployment you can perform a production build
for your website with the `build` command:

```bash
$ parcel build index.html
```

Where it creates an optimized bundle using advanced minification, compilation and bundling techniques. Despite its instant utility and zero configuration,
it comes pre-configured with [popular auto transforms](https://parceljs.org/transforms.html) for developing modern Web Apps which lets you utilize 
PostCSS transforms and advanced transpilers like TypeScript which the new Parcel Template takes advantage of to enable a pleasant development experience 
by enabling access to the latest ES7/TypeScript language features.

This template starts from a clean slate and does not use any of the [popular JavaScript frameworks](https://github.com/NetCoreTemplates) making it 
ideal when wanting to use any other [micro JS libraries](http://microjs.com) that can be referenced using a simple script include - reminiscent of 
simpler times.

Or [develop without a JS framework](https://twitter.com/mislav/status/1022058279000842240), e.g. [index.ts](https://github.com/NetCoreTemplates/parcel/blob/master/MyApp/src/index.ts) below uses TypeScript and the native HTML DOM APIs for its functionality:

```ts
import { client } from "./shared";
import { Hello } from "./dtos";

const result = document.querySelector("#result")!;

document.querySelector("#Name")!.addEventListener("input", async e => {
  const value = (e.target as HTMLInputElement).value;
  if (value != "") {
    const request = new Hello();
    request.name = value;
    const response = await client.get(request);
    result.innerHTML = response.result;
  } else {
    result.innerHTML = "";
  }
});
```

The Parcel Template also includes customizations to integrate it with .NET Core Project conventions and 
[Sharp Pages](https://sharpscript.net/docs/script-pages) Website enabling access to additional flexibility like dynamic Web Pages and server-side rendering
when needed. See the [Parcel Template docs](https://github.com/NetCoreTemplates/parcel#development-workflow) for information on the
available `dev`, `build`, `dtos` and `publish` npm scripts used to manage the Development workflow.

Seamless Parcel integration is another example of the benefits of `#Script` layered approach and non-intrusive handlebars syntax which 
can be cleanly embedded in existing `.html` pages without interfering with static HTML analyzers like parcel and Webpack HTML plugins and their 
resulting HTML minification in optimized production builds - enabling simplified development workflows and integration that's not possible with Razor.

### Running .NET Core Templates in Visual Studio IIS Express

Currently VS.NET doesn't support .NET 6.0 multiple bindings i.e. `http://localhost:5000/;https://localhost:5001/` which all .NET Core Templates
are configured with. To run in IIS Express change it to specify only 1 binding:

![](https://forums.servicestack.net/uploads/default/931/0a2191581d2774c6.png)

Also if you wanted to re-use an existing registered port like `5000` you will need to run VS.NET in **Administrator** mode where it will let you override
any existing registrations, alternatively you can replace the port with an unused port number which will let you run it as normal.
