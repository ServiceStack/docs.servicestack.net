---
title: Service Clients Overview
---

As ServiceStack Services are pure HTTP APIs they're accessible with any HTTP-capable client, but they're also capable of native client integrations with popular languages used to create Web, Mobile and Desktop Apps for maximum productivity and correctness.

The developer workflow is further simplified with IDE plugins that let you generate native client DTOs directly from your favorite IDEs:

<section class="text-center">
    <div class="container">
    <div class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
      <h2 class="text-base font-semibold uppercase tracking-wider  text-indigo-600">Develop faster</h2>
      <p class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Right Click, Integrate</p>
      <p class="mx-auto mt-5 max-w-prose text-xl text-gray-500"> 
        Native client integrations for your APIs in all popular languages and IDEs
      </p>
    </div>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-1/4 mt-4">
            <a href="https://marketplace.visualstudio.com/items?itemName=Mythz.ServiceStackVS">
              <div class="inline-flex justify-center">
                <img src="/img/pages/svg/vs-2019.svg" class="w-20 h-20">
              </div>
              <h3>Visual Studio</h3>
            </a>
            <h4>Languages Supported</h4>
            <p class="italic">
              C#, F#, TypeScript, VB.NET
            </p>
          </div>
          <div class="w-full lg:w-1/4 mt-4">
            <a href="https://plugins.jetbrains.com/plugin/17295-servicestack">
              <div class="inline-flex justify-center">
                <img src="/img/pages/svg/ides/icon-rider.svg"  class="w-20 h-20">
              </div>
              <h3>Rider</h3>
            </a>
            <h4>Languages Supported</h4>
            <p class="italic">
              C#, F#, TypeScript, VB.NET
            </p>
          </div>
          <div class="w-full lg:w-1/4 mt-4">
            <a href="https://plugins.jetbrains.com/plugin/7749-servicestack">
              <div class="inline-flex justify-center">
                <img src="/img/pages/svg/ides/icon-intellij-idea.svg" class="w-20 h-20">
              </div>
              <h3>IntelliJ</h3>
            </a>
            <h4>Languages Supported</h4>
            <p class="italic">
              Java, Kotlin, TypeScript
            </p>
          </div>
          <div class="w-full lg:w-1/4 mt-4">
            <a href="https://plugins.jetbrains.com/plugin/7749-servicestack">
              <div class="inline-flex justify-center">
                <img src="/img/pages/svg/ides/icon-webstorm.svg"  class="w-20 h-20">
              </div>
              <h3>WebStorm</h3>
            </a>
            <h4>Languages Supported</h4>
            <p class="italic">
              TypeScript
            </p>
          </div>
          <div class="w-full lg:w-1/4 mt-4">
            <a href="https://plugins.jetbrains.com/plugin/7749-servicestack">
              <div class="inline-flex justify-center">
                <img src="/img/pages/svg/ides/icon-pycharm.svg"  class="w-20 h-20">
              </div>
              <h3>PyCharm</h3>
            </a>
            <h4>Languages Supported</h4>
            <p class="italic">
              Python, TypeScript
            </p>
          </div>
          <div class="w-full lg:w-1/4 mt-4">
            <a href="https://plugins.jetbrains.com/plugin/7749-servicestack">
              <div class="inline-flex justify-center">
                <img src="/img/pages/svg/ides/icon-rubymine.svg"  class="w-20 h-20">
              </div>
              <h3>RubyMine</h3>
            </a>
            <h4>Languages Supported</h4>
            <p class="italic">
              TypeScript
            </p>
          </div>
          <div class="w-full lg:w-1/4 mt-4">
            <a href="https://plugins.jetbrains.com/plugin/7749-servicestack">
              <div class="inline-flex justify-center">
                <img src="/img/pages/svg/androidstudio.svg" class="w-20 h-20">
              </div>
              <h3>Android Studio</h3>
            </a>
            <h4>Languages Supported</h4>
            <p class="italic">
              Java, Kotlin, TypeScript
            </p>
          </div>
          <div class="w-full lg:w-1/4 mt-4">
            <a href="https://marketplace.eclipse.org/content/servicestackeclipse">
              <div class="inline-flex justify-center">
                <img src="/img/pages/svg/ides/eclipse-11.svg" height="4em" alt="" style="width:70px;height:70px;">
              </div>
              <h3>Eclipse</h3>
            </a>
            <h4>Languages Supported</h4>
            <p class="italic">
              Java
            </p>
          </div>
        </div>
    </div>
</section>

Support for all languages are implemented the same way where the generated DTOs can be used with idiomatic [generic Service Clients](#servicestack-clients) giving developers a consistent way of creating and updating your DTOs regardless of your language of choice.

### Command-line Tooling

The [x dotnet tool](/dotnet-tool) also allows us to generate these native service references from the command-line with the format `x <lang> <url>`, e.g. we can create C# DTOs for our App with:

:::sh
`x csharp https://localhost:5001`
:::

Output:

```
Saved to: dtos.ts
```

Or create a TypeScript ServiceStack Reference with:

:::sh
`x typescript https://localhost:5001`
:::

### Updating a ServiceStack Reference

To Update an existing ServiceStack Reference, call `x typescript` with the Filename, e.g:

:::sh
x typescript dtos.ts
:::

Result:

```
Updated: dtos.ts
```

This will update the File with your App's latest TypeScript Server DTOs. DTO customizations are also available by uncommenting the [TypeScript DTO Customization Options](/typescript-add-servicestack-reference#dto-customization-options) and updating them again.

#### Updating all DTOs

Calling `x typescript` without any arguments will update **all TypeScript DTOs** in the current directory:

:::sh
x typescript
:::


Other available languages include:

<table class="table table-bordered">
<tr>
    <th>Script</th>
    <th>Alias</th>
    <th>Language</th>
</tr>
<tr>
    <td>x csharp</td>
    <td>x cs</td>
    <td>C#</td>
</tr>
<tr>
    <td>x typescript</td>
    <td>x ts</td>
    <td>TypeScript</td>
</tr>
<tr>
    <td>x python</td>
    <td>x py</td>
    <td>Python</td>
</tr>
<tr>
    <td>x java</td>
    <td></td>
    <td>Java</td>
</tr>
<tr>
    <td>x kotlin</td>
    <td>x kt</td>
    <td>Kotlin</td>
</tr>
<tr>
    <td>x swift</td>
    <td></td>
    <td>Swift</td>
</tr>
<tr>
    <td>x dart</td>
    <td></td>
    <td>Dart</td>
</tr>
<tr>
    <td>x vbnet</td>
    <td>x vb</td>
    <td>VB.NET</td>
</tr>
<tr>
    <td>x fsharp</td>
    <td>x fs</td>
    <td>F#</td>
</tr>
</table>

### ServiceStack Clients

To enable its clean end-to-end typed API development model, the generated DTOs can be used with a generic Service Client available for each supported language:

  * [C#/.NET Client](/csharp-client)
  * [TypeScript Client](/typescript-add-servicestack-reference)
  * [Kotlin Client](/kotlin-add-servicestack-reference)
  * [Java Client](/java-add-servicestack-reference)
  * [Swift Client](/swift-add-servicestack-reference)
  * [Dart Client](/dart-add-servicestack-reference#example-usage)
  * [JavaScript Client](/javascript-client)
  * [MQ Clients](/redis-mq)

### Supported Languages

This [Add ServiceStack Reference](/add-servicestack-reference) feature is available for all the popular supported languages below:

<table class="table table-bordered w-full" style="text-align:center">
    <tr>
        <td><a href="/csharp-add-servicestack-reference">C#</a></td>
        <td><a href="/typescript-add-servicestack-reference">TypeScript</a></td>
        <td><a href="/javascript-add-servicestack-reference">JavaScript</a></td>
        <td><a href="/python-add-servicestack-reference">Python</a></td>
        <td><a href="/swift-add-servicestack-reference">Swift</a></td>
        <td><a href="/java-add-servicestack-reference">Java</a></td>
        <td><a href="/kotlin-add-servicestack-reference">Kotlin</a></td>
        <td><a href="/dart-add-servicestack-reference">Dart</a></td>
        <td><a href="/fsharp-add-servicestack-reference">F#</a></td>
        <td><a href="/vbnet-add-servicestack-reference">VB.NET</a></td>
    </tr>
</table>

![](./img/pages/add-ss-ref.svg)

## Development workflow preview

Here's quick walkthrough's installing the **ServiceStack** plugin and using it to add remote ServiceStack References in a new C# App:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="JKsgrstNnYY" style="background-image: url('https://img.youtube.com/vi/JKsgrstNnYY/maxresdefault.jpg')"></lite-youtube>

:::tip
VSCode and other IDEs will be able to use the command-line tool for adding and updating multiple Services references.
:::

### C# Xamarin.Android Example in VS.NET

Using C# to develop native Mobile and Desktop Apps provides a number of benefits including maximum reuse of your investments across multiple Client Apps where they're able to reuse shared functionality, libraries, knowledge, development workflow and environment in both Client and Server Apps. 

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="cbYuem1b2tg" style="background-image: url('https://img.youtube.com/vi/cbYuem1b2tg/maxresdefault.jpg')"></lite-youtube>

### Call ServiceStack APIs from a Flutter App with native Dart client and DTOs

Walk through showing how you can use ServiceStack's Dart client library with your Flutter Android application to quickly get up and running with Add ServiceStack Reference.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="ocH5L-CikQ0" style="background-image: url('https://img.youtube.com/vi/ocH5L-CikQ0/maxresdefault.jpg')"></lite-youtube>

### Call ServiceStack APIs from Python

This video tutorial looks at how we can leverage Add ServiceStack Reference for Python in PyCharm, VSCode and [Python Jupyter Notebooks](/jupyter-notebooks-python).

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="WjbhfH45i5k" style="background-image: url('https://img.youtube.com/vi/WjbhfH45i5k/maxresdefault.jpg')"></lite-youtube>

### Instant Client Apps

[Instant Client Apps](https://apps.servicestack.net/) is a free tool to jump start your native client application development using a wide range of languages and platforms including: C#, NodeJS, Dart, Java, Kotlin, Swift, VB .NET and F#:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="GTnuMhvUayg" style="background-image: url('https://img.youtube.com/vi/GTnuMhvUayg/maxresdefault.jpg')"></lite-youtube>

## gRPC

[ServiceStack gRPC](/grpc/) enables a highly productive development environment for developing high-performance gRPC HTTP/2 Services by making ServiceStack's existing typed Services available from ASP.NET's gRPC endpoints where ServiceStack offers a simplified development model for gRPC Clients for streamlined end-to-end productivity.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="UQlYodNS1xc" style="background-image: url('https://img.youtube.com/vi/UQlYodNS1xc/maxresdefault.jpg')"></lite-youtube>

## C# Mobile and Desktop Apps

[![](https://raw.githubusercontent.com/ServiceStackApps/HelloMobile/master/screenshots/splash-900.png)](https://github.com/ServiceStackApps/HelloMobile)

The generated DTOs provides a highly productive development workflow and enables a succinct end-to-end Typed API that can be used in both **.NET Framework** and **.NET Standard 2.0** [Generic Service Clients](/csharp-client) to facilitate Rapid Development in .NET's most popular Mobile and Desktop platforms:

 - WPF
 - UWP
 - Xamarin.Android
 - Xamarin.iOS
 - Xamarin.OSX
 - Xamarin.Forms
   - iOS
   - Android
   - UWP

The [HelloMobile](https://github.com/ServiceStackApps/HelloMobile) project contains multiple versions of the same App in all the above platforms demonstrating a number of different calling conventions, service integrations and reuse possibilities.

ServiceStack also allows for the maximum reuse possible by letting you reuse the same POCO DTOs used to define the Services contract with, in Clients Apps to provide its end-to-end typed API without any additional custom build tools, code-gen or any other artificial machinery, using just the DTOs in the shared `ServiceModel.dll` with any of the available highly performant [.NET generic Service Clients](/csharp-client) that be design encourages development of [resilient message-based Services](/what-is-a-message-based-web-service) for enabling [highly decoupled](/service-gateway) and easily [substitutable and mockable](/csharp-client#built-in-clients) Service Integrations.


### .NET Clients Message-based API

There are multiple C# service clients included, each optimized for their respective formats:

![ServiceStack HTTP Client Architecture](/img/pages/overview/servicestack-httpclients.png) 

- [JSON Client](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Client/JsonServiceClient.cs)
- [XML Client](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Client/XmlServiceClient.cs)
- [JSV Client](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Client/JsvServiceClient.cs)
- [SOAP 1.1/1.2 Clients](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Client/Soap12ServiceClient.cs)
- [ProtoBuf Client](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.ProtoBuf/ProtoBufServiceClient.cs)

All clients share the same [IServiceClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/IServiceClient.cs) and [IServiceClientAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/IServiceClientAsync.cs) so they're easily swappable at runtime, and is what allows the same Unit test to be re-used as within an [Xml, JSON, JSV, SOAP Integration test](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.IntegrationTests/Tests/WebServicesTests.cs). The JSON, XML and JSV clients also share [IRestClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/IRestClient.cs) and [IRestClientAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/IRestClientAsync.cs)

## What's the best way to expose our services to clients today?

### Native language client libraries

A productive option for clients (and the recommended approach by ServiceStack) would be to provide a native client library for each of the popular languages you wish to support. This is the approach of companies who really, really want to help you use their services like Amazon, Facebook and Windows Azure. This is an especially good idea if you want to support static languages (i.e. C# and Java) where having typed client libraries saves end-users from reverse engineering the types and API calls. It also saves them having to look up documentation since a lot of it can be inferred from the type info. ServiceStack's and Amazons convention of having `ServiceName` and `ServiceNameResponse` for each service also saves users from continually checking documentation to work out what the response of each service will be.

### Packaging client libraries

In terms of packaging your client libraries, sticking a link to a zip file on your Websites APIs documentation page would be the easiest approach. If the zip file was a link to a master archive of a Github repository, that would be better as you'll be able to accept bug fixes and usability tips from the community. Finally we believe the best way to make your client libraries available would be to host them in the target languages native package manager - letting end-users issue 1-command to automatically add it to their project, and another to easily update it when your service has changed.

### Using NuGet

For .NET this means adding it to NuGet, and if you use ServiceStack your package would just need to contain your types with a reference to [ServiceStack.Client](http://nuget.org/packages/ServiceStack.Client). One of the benefits of using ServiceStack is that all your types are already created since it's what you used to define your web services with!


# Community Resources

  - [Servicestack and PHP](http://www.majorsilence.com/servicestack_and_php) by [@majorsilence](https://github.com/majorsilence)
