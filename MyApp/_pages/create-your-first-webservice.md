---
slug: create-your-first-webservice
title: Create your first WebService
---

This is a quick walkthrough of getting your first web service up and running whilst having a look at the how some of the different components work. 

## Step 1: Install the x dotnet tool

First we want to install the [x dotnet tool](/dotnet-tool):

:::sh
dotnet tool install --global x 
:::

The [dotnet tools](/dotnet-tool) are ServiceStack's versatile companion giving you quick access to a lot of its high-level features including 
generating mobile, web & desktop DTOs with [Add ServiceStack Reference](/add-servicestack-reference) generating [gRPC Clients and proto messages](/grpc/),
quickly [apply gists](/mix-tool) to your project enabled by ServiceStack's effortless [no-touch Modular features](/modular-startup), 
[command-line API access](/post-command), it even includes a [lisp REPL](https://sharpscript.net/lisp/) should you need to explore your [remote .NET Apps in real-time](https://sharpscript.net/lisp/#techstacks-tcp-lisp-repl-demo).

## Step 2: Selecting a template

Importantly, the dotnet tools lets you create [.NET 8, .NET Framework](/dotnet-new) and [ASP.NET Core on .NET Framework](/templates/corefx) projects.
Unless you're restricted to working with .NET Framework you'll want to start with a [.NET 8 project template](/templates/dotnet-new#usage), for this example
we'll start with the Empty [web](https://github.com/NetCoreTemplates/web) template which implicitly uses the folder name for the Project Name:

:::sh
x new web WebApp
:::

## Step 3: Run your project

Press `Ctrl+F5` to run your project!

You should see an already working API integration using [@servicestack/client](/javascript-client) library to call your App's 
[JavaScript DTOs](/javascript-add-servicestack-reference) and links to calling your API from [API Explorer](/api-explorer):

<a href="https://web.web-templates.io"><img class="max-w-lg" src="/img/pages/overview/web-hello.png"></a>

#### Watched builds

A recommended alternative to running your project from your IDE is to run a watched build using `dotnet watch` from a terminal:

:::sh
dotnet watch
:::

Where it will automatically rebuild & restart your App when it detects any changes to your App's source files.

### How does it work?

Now that your new project is running, let's have a look at what we have. The template comes with a single web service route which comes from the Request DTO (Data Transfer Object) which is located in the [Hello.cs](https://github.com/NetCoreTemplates/web/blob/master/MyApp.ServiceModel/Hello.cs) file:

```csharp
[Route("/hello/{Name}")]
public class Hello : IReturn<HelloResponse>
{
    public string Name { get; set; }
}

public class HelloResponse
{
    public string Result { get; set; }
}
```

The `Route` attribute is specifying what path `/hello/{Name}` where `{Name}` binds its value to the public string property of **Name**.

Let's access the route to see what comes back. Go to the following URL in your address bar:

    /hello/world

You will see a snapshot of the Result in a HTML response format. To change the return format to Json, simply add `?format=json` to the end of the URL. You'll learn more about [formats](/formats), endpoints (URLs, etc) when you continue reading the documentation.

If we go back to the solution and find the WebApplication1.ServiceInterface and open the **MyServices.cs** file, we can have a look at the code that is responding to the browser, giving us the **Result** back.

```csharp
public class MyServices : Service
{
    public object Any(Hello request)
    {
        return new HelloResponse { Result = $"Hello, {request.Name}!" };
    }
}
```

If we look at the code above, there are a few things to note. The name of the method `Any` means the server will run this method for any of the valid HTTP Verbs. Service methods are where you control what returns from your service.

## Step 4: Exploring the ServiceStack Solution

The Recommended structure below is built into all ServiceStackVS VS.NET Templates where creating any new ServiceStack 
project will create a solution with a minimum of 4 projects below ensuring ServiceStack solutions starts off from an optimal 
logical project layout, laying the foundation for growing into a more maintainable, cohesive and reusable code-base:

<img align="right" src="/img/pages/solution-layout.png" />

### Host Project

The Host project contains your AppHost which references and registers all your App's concrete dependencies in its IOC and is the central location where all App configuration and global behavior is maintained. It also references all Web Assets like Razor Views, JS, CSS, Images, Fonts, etc. that's needed to be deployed with the App. The AppHost is the top-level project which references all dependencies used by your App whose role is akin to an orchestrator and conduit where it decides what functionality is made available and which concrete implementations are used. By design it references all other (non-test) projects whilst nothing references it and as a goal should be kept free of any App or Business logic.

### ServiceInterface Project

The ServiceInterface project is the implementation project where all Business Logic and Services live which typically references every other project except the Host projects. Small and Medium projects can maintain all their implementation here where logic can be grouped under feature folders. Large solutions can split this project into more manageable cohesive and modular projects which we also recommend encapsulates any dependencies they might use.

### ServiceModel Project

The ServiceModel Project contains all your Application's DTOs which is what defines your Services contract, keeping them isolated from any Server implementation is how your Service is able to encapsulate its capabilities and make them available behind a remote facade. There should be only one ServiceModel project per solution which contains all your DTOs and should be implementation, dependency and logic-free which should only reference the impl/dep-free **ServiceStack.Interfaces.dll** contract assembly to ensure Service contracts are decoupled from its implementation, enforces interoperability ensuring that your Services don't mandate specific client implementations and will ensure this is the only project clients need to be able to call any of your Services by either referencing the **ServiceModel.dll** directly or downloading the DTOs from a remote ServiceStack instance using [Add ServiceStack Reference](/add-servicestack-reference):

![](/img/pages/dtos-role.png)

### Test Project

The Unit Test project contains all your Unit and Integration tests. It's also a Host project that typically references all other non-Host projects in the solution and contains a combination of concrete and mock dependencies depending on what's being tested. See the [Testing Docs](/testing) for more information on testing ServiceStack projects.

## Learn ServiceStack Guide

If you're new to ServiceStack we recommend stepping through [ServiceStack's Getting Started Guide](https://servicestack.net/start/project-overview)
to get familiar with the basics.

## API Client Examples

### jQuery Ajax

ServiceStack's clean Web Services makes it simple and intuitive to be able to call ServiceStack Services from any ajax client, e.g. from a traditional [Bootstrap Website using jQuery](https://github.com/ServiceStack/Templates/blob/master/src/ServiceStackVS/BootstrapWebApp/BootstrapWebApp/default.cshtml):

```html
<input class="form-control" id="Name" type="text" placeholder="Type your name">
<p id="result"></p>
<script>
$('#Name').keyup(function () {
    let name = $(this).val()
    $.getJSON('/hello/' + name)
        .success(function (response) {
            $('#result').html(response.Result)
        })
})
</script>
```

### Rich JsonApiClient & Typed DTOs

The modern recommended alternative to jQuery that works in all modern browsers is using your APIs built-in [JavaScript typed DTOs](/javascript-add-servicestack-reference) with the [@servicestack/client](/javascript-client) library 
from a [JavaScript Module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).

We recommend using an [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) 
to specify where **@servicestack/client** should be loaded from, e.g:

```html
<script async src="https://ga.jspm.io/npm:es-module-shims@1.6.3/dist/es-module-shims.js"></script><!--safari-->
<script type="importmap">
{
    "imports": {
        "@servicestack/client":"https://unpkg.com/@servicestack/client@2/dist/servicestack-client.mjs"
    }
}
</script>
```

This lets us reference the **@servicestack/client** package name in our source code instead of its physical location:
    
```html
<input type="text" id="txtName">
<div id="result"></div>
```

```html
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

### Enable static analysis and intelli-sense 

For better IDE intelli-sense during development, save the annotated Typed DTOs to disk with the [x dotnet tool](/dotnet-tool):

:::sh
x mjs
:::

Then reference it instead to enable IDE static analysis when calling Typed APIs from JavaScript:

```js
import { Hello } from '/js/dtos.mjs'
client.api(new Hello({ name }))
```
    
To also enable static analysis for **@servicestack/client**, install the dependency-free library as a dev dependency:
    
:::sh
npm install -D @servicestack/client
:::

Where only its TypeScript definitions are used by the IDE during development to enable its type-checking and intelli-sense.

### Rich intelli-sense support

Where you'll be able to benefit from rich intelli-sense support in smart IDEs like [Rider](https://www.jetbrains.com/rider/) for 
both the client library:

![](/img/pages/mix/init-rider-ts-client.png)

As well as your App's server generated DTOs:

![](/img/pages/release-notes/v6.6/mjs-intellisense.png)

So even simple Apps without complex bundling solutions or external dependencies can still benefit from a rich typed authoring 
experience without any additional build time or tooling complexity.

## Create Empty ServiceStack Apps

::include empty-projects.md::

### Any TypeScript or JavaScript Web, Node.js or React Native App

The same TypeScript [JsonServiceClient](/javascript-client) can also be used in more sophisticated JavaScript Apps like 
[React Native](/typescript-add-servicestack-reference#react-native-jsonserviceclient) to [Node.js Server Apps](https://github.com/ServiceStackApps/typescript-server-events) such as this example using TypeScript & [Vue Single-File Components](https://vuejs.org/guide/scaling-up/sfc.html):

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

Compare and contrast with other major SPA JavaScript Frameworks:

 - [Vue 3 HelloApi.mjs](https://github.com/NetCoreTemplates/blazor-vue/blob/main/MyApp/wwwroot/posts/components/HelloApi.mjs)
 - [Vue SSG using swrClient](https://github.com/NetCoreTemplates/vue-ssg/blob/main/ui/src/components/HelloApi.vue)
 - [Next.js with swrClient](https://github.com/NetCoreTemplates/nextjs/blob/main/ui/components/intro.tsx)
 - [React HelloApi.tsx](https://github.com/NetCoreTemplates/react-spa/blob/master/MyApp/src/components/Home/HelloApi.tsx)
 - [Angular HelloApi.ts](https://github.com/NetCoreTemplates/angular-spa/blob/master/MyApp/src/app/home/HelloApi.ts)

### Web, Mobile and Desktop Apps

Use [Add ServiceStack Reference](/add-servicestack-reference) to enable typed integrations for the most popular languages to develop Web, Mobile & Desktop Apps.

### Full .NET Project Templates

The above `init` projects allow you to create a minimal web app, to create a more complete ServiceStack App with the recommended project structure, start with one of our C# project templates instead:

### [C# Project Templates Overview](/templates/)

## Simple, Modern Razor Pages & MVC Vue 3 Tailwind Templates

The new Tailwind Razor Pages & MVC Templates enable rapid development of Modern Tailwind Apps without the [pitfalls plaguing SPAs](https://servicestack.net/posts/javascript):

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="SyppvQB7IPs" style="background-image: url('https://img.youtube.com/vi/SyppvQB7IPs/maxresdefault.jpg')"></lite-youtube>

All Vue Tailwind templates are pre-configured with our rich [Vue 3 Tailwind Components](/vue/) library for maximum productivity:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="YIa0w6whe2U" style="background-image: url('https://img.youtube.com/vi/YIa0w6whe2U/maxresdefault.jpg')"></lite-youtube>

## Advanced JAMStack Templates

For more sophisticated Apps that need the best web tooling that npm can offer checkout our JAMStack Vite Vue & SSG templates:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="D-rU0lU_B4I" style="background-image: url('https://img.youtube.com/vi/D-rU0lU_B4I/maxresdefault.jpg')"></lite-youtube>

Or if you prefer Modern React Apps checkout the Next.js template:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="3pPLRyPsO5A" style="background-image: url('https://img.youtube.com/vi/3pPLRyPsO5A/maxresdefault.jpg')"></lite-youtube>

For Blazor WASM and Server checkout our comprehensive [Blazor projects & Tailwind components](/templates/blazor-tailwind).

### Integrated in Major IDEs and popular Mobile & Desktop platforms

ServiceStack Services are also [easily consumable from all major Mobile and Desktop platforms](/why-servicestack#generate-instant-typed-apis-from-within-all-major-ides) including native iPhone and iPad Apps on iOS with Swift, Mobile and Tablet Apps on Android with Java or Kotlin, OSX Desktop Applications as well as targeting the most popular .NET Mobile and Desktop platforms including Xamarin.iOS, Xamarin.Android, Windows Store, WPF and WinForms.

## Instant Client Apps

Generate working native client apps for your live ServiceStack services, in a variety of languages, instantly with our free managed service.

This tool enables your developers, and even your customers, to open a working example native application straight from the web to their favorite IDE.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="GTnuMhvUayg" style="background-image: url('https://img.youtube.com/vi/GTnuMhvUayg/maxresdefault.jpg')"></lite-youtube>

## Fundamentals - AppHost and Configuration

Walk through configuring your ServiceStack Application's `AppHost`:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="mOpx5mUGoqI" style="background-image: url('https://img.youtube.com/vi/mOpx5mUGoqI/maxresdefault.jpg')"></lite-youtube>

## Community Resources

  - [Creating A Simple Service Using ServiceStack](https://www.c-sharpcorner.com/UploadFile/shashijeevan/creating-a-simple-service-using-servicestack779/) by [Shashi Jeevan](http://shashijeevan.net/author/shashijeevan/)
  - [Introducing ServiceStack](https://www.dotnetcurry.com/aspnet/1056/introducing-service-stack-tutorial) by [@dotnetcurry](https://twitter.com/DotNetCurry)
  - [Create web services in .NET in a snap with ServiceStack](https://www.techrepublic.com/article/create-web-services-in-net-in-a-snap-with-servicestack/) by [@techrepublic](https://twitter.com/techrepublic)
  - [How to build web services in MS.Net using ServiceStack](https://kborra.wordpress.com/2014/07/29/how-to-build-web-services-in-ms-net-using-service-stack/) by [@kishoreborra](http://kborra.wordpress.com/about/)
  - [Getting started with ServiceStack – Creating a service](https://dilanperera.wordpress.com/2014/02/22/getting-started-with-servicestack-creating-a-service/)
  - [ServiceStack Quick Start](https://debuggers.domains/post/servicestack-quick-start/) by [@aarondandy](https://github.com/aarondandy) 
  - [Getting Started with ASP.NET MVC, ServiceStack and Bootstrap](https://www.pluralsight.com/courses/getting-started-aspdotnet-mvcservice-stack-bootstrap) by [@pluralsight](http://twitter.com/pluralsight)
  - [Building Web Applications with Open-Source Software on Windows](https://www.pluralsight.com/courses/building-web-application-open-source-software-on-windows) by [@pluralsight](http://twitter.com/pluralsight)
  - [ServiceStack the way I like it](https://www.antonydenyer.co.uk/2012-09-20-servicestack-the-way-i-like-it/) by [@tonydenyer](https://twitter.com/tonydenyer)
  - [Generating a RESTful Api and UI from a database with LLBLGen](https://www.mattjcowan.com/funcoding/2013/03/10/rest-api-with-llblgen-and-servicestack/) by [@mattjcowan](https://twitter.com/mattjcowan)
  - [ServiceStack: Reusing DTOs](https://korneliuk.blogspot.com/2012/08/servicestack-reusing-dtos.html) by [@korneliuk](https://twitter.com/korneliuk)
  - [ServiceStack, Rest Service and EasyHttp](https://blogs.lessthandot.com/index.php/WebDev/ServerProgramming/servicestack-restservice-and-easyhttp) by [@chrissie1](https://twitter.com/chrissie1)
  - [Building a Web API in SharePoint 2010 with ServiceStack](https://www.mattjcowan.com/funcoding/2012/05/04/building-a-web-api-in-sharepoint-2010-with-servicestack/)
  - [REST Raiding. ServiceStack](https://dgondotnet.blogspot.com/2012/04/rest-raiding-servicestack.html) by [Daniel Gonzalez](http://www.blogger.com/profile/13468563783321963413)
  - [JQueryMobile and ServiceStack: EventsManager tutorial](https://kylehodgson.com/2012/04/21/jquerymobile-and-service-stack-eventsmanager-tutorial-post-2/) / [Part 3](https://kylehodgson.com/2012/04/23/jquerymobile-and-service-stack-eventsmanager-tutorial-post-3/) by Kyle Hodgson
  - [Like WCF: Only cleaner!](https://kylehodgson.com/2012/04/18/like-wcf-only-cleaner-9/) by Kyle Hodgson
  - [ServiceStack I heart you. My conversion from WCF to SS](https://www.philliphaydon.com/2012/02/21/service-stack-i-heart-you-my-conversion-from-wcf-to-ss/) by [@philliphaydon](https://twitter.com/philliphaydon)
  - [ServiceStack vs WCF Data Services](https://codealoc.wordpress.com/2012/03/24/service-stack-vs-wcf-data-services/)
  - [Buildiing a Tridion WebService with jQuery and ServiceStack](https://www.curlette.com/?p=161) by [@robrtc](https://twitter.com/#!/robrtc)
  - [Anonymous type + Dynamic + ServiceStack == Consuming cloud has never been easier](https://www.ienablemuch.com/2012/05/anonymous-type-dynamic-servicestack.html) by [@ienablemuch](https://twitter.com/ienablemuch)
  - [Handful of examples of using ServiceStack based on the ServiceStack.Hello Tutorial](https://github.com/jfoshee/TryServiceStack) by [@82unpluggd](https://twitter.com/82unpluggd)
