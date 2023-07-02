---
title: Instantly Servicify existing Systems
---

In addition to [AutoQuery](/autoquery/rdbms) automatically providing your Services implementations,
[Studio](/studio) providing its instant UI, ServiceStack also gained the capability to **[generate your entire API](/autoquery/autogen)** including Typed API contracts, data models, implementations & human-friendly pluralized HTTP API routes over an existing System RDBMS's tables.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="NaJ7TW-Q_pU" style="background-image: url('https://img.youtube.com/vi/NaJ7TW-Q_pU/maxresdefault.jpg')"></lite-youtube>

## AutoGen

ServiceStack's [AutoGen](/autoquery/autogen) enables a number of exciting possibilities, predominantly it's the fastest way to ServiceStack-ify an existing systems RDBMS where it will serve as an invaluable tool for anyone wanting to quickly migrate to ServiceStack and access its functionality ecosystem around ServiceStack Services:

<img src="/img/pages/svg/servicify.svg" width="100%">

**[AutoGen's](/autoquery/autogen)** code generation is programmatically customizable where the generated types can be easily augmented with additional declarative attributes to inject your App's conventions into the auto generated Services & Types to apply custom behavior like Authorization & additional validation rules. 

After codifying your system conventions the generated classes can optionally be "ejected" where code-first development can continue as normal.

This feature enables rewriting parts or modernizing legacy systems with the least amount of time & effort, once Servicified you can take advantage of declarative features like Multitenancy, Optimistic Concurrency & Validation, enable automatic features like Executable Audit History, allow business users to maintain validation rules in its RDBMS, manage them through **Studio** & have them applied instantly at runtime 
and visibly surfaced through ServiceStack's myriad of [client UI auto-binding options](/world-validation). **Studio** can then enable stakeholders with an instant UI to quickly access and search through their data, import custom queries directly into Excel or access them in other registered Content Types through a custom UI where fine-grained app-level access can be applied to customize which tables & operations different users have.

### gRPC's Typed protoc Universe

<img src="/img/pages/svg/grpc-icon-color.svg" height="100" align="right">

**AutoGen** also enables access to ServiceStack's ecosystem of metadata services & connectivity options where it's now become the **fastest way to generate gRPC endpoints** over an existing system. This is especially exciting as in addition to enabling high-performance connectivity to your Systems data, it opens it up to [all languages in gRPC's protoc universe](https://grpc.io/docs/languages/).

Whilst the Smart, Generic [C# / F# / VB.NET Service Clients](/grpc/generic) continue to provide the best UX for consuming gRPC Services, one of the nicest **protoc generated** clients languages is [Dart](http://dart.dev) - a modern high-level language with native class performance & script-like productivity where individual source files can be run immediately without compilation, it's quality tooling, static analysis &
high-level features like async/await make it an ideal exploratory language for consuming gRPC endpoints.

### Dart gRPC Script Playground

<img src="/img/pages/svg/dart-logo.svg" height="75" align="right">

This quick demo shows an example of instantly Servicifying a database & accesses it via gRPC in minutes, starting with a new [grpc](https://github.com/NetCoreTemplates/grpc) project from scratch, it [mixes](/mix-tool) in [autocrudgen](https://gist.github.com/gistlyn/464a80c15cb3af4f41db7810082dc00c) to configure **AutoGen** to generate AutoQuery services for the registered [sqlite](https://gist.github.com/gistlyn/768d7b330b8c977f43310b954ceea668) RDBMS that's copied into the project from the [northwind.sqlite](https://gist.github.com/gistlyn/97d0bcd3ebd582e06c85f8400683e037) gist.

Once the servicified App is running it accesses the gRPC Services in a new Dart Console App using the UX-friendly [Dart gRPC support in the x dotnet tool](/grpc/dart) to call the protoc generated Services:

> YouTube: [youtu.be/5NNCaWMviXU](https://youtu.be/5NNCaWMviXU)

[![](/img/pages/release-notes/v5.9/autogen-grpc.png)](https://youtu.be/5NNCaWMviXU)

### Flutter gRPC Android App

<img src="/img/pages/svg/flutter-logo.svg" height="75" align="right">

And if you can access it from Dart, you can access it from all platforms Dart runs on - the most exciting is Google's [Flutter](https://flutter.dev) UI Kit for building beautiful, natively compiled applications for Mobile, Web, and Desktop from a single codebase:

> YouTube: [youtu.be/3iz9aM1AlGA](https://youtu.be/3iz9aM1AlGA)

[![](/img/pages/release-notes/v5.9/autogen-grpc-flutter.jpg)](https://youtu.be/3iz9aM1AlGA)

## React Native Typed Client

<img src="/img/pages/svg/react-native-logo.svg" width="300" align="right">

gRPC is just [one of the endpoints ServiceStack Services](/why-servicestack#multiple-clients) can be accessed from, for an even richer & more integrated development UX they're also available in all popular Mobile, Web & Desktop languages [Add ServiceStack Reference](/add-servicestack-reference) supports.

Like [TypeScript](/typescript-add-servicestack-reference) which can be used in Browser & Node TypeScript code-bases as well as JavaScript-only code-bases like [React Native](https://reactnative.dev) - a highly productive Reactive UI for developing iOS and Android Apps:

[![](/img/pages/release-notes/v5.9/autogen-react-native.png)](https://youtu.be/6-SiLAbY63w)

::: info YouTube
[youtu.be/6-SiLAbY63w](https://youtu.be/6-SiLAbY63w)
:::
