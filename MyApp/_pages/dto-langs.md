### C# - Productive End-to-end typed APIs for .NET

The `JsonApiClient` in [ServiceStack.Client](https://nuget.org/packages/ServiceStack.Client) consumes the same DTOs your API is defined with - except consumers generate them from the **deployed API** instead of taking a binary dependency on it, so client and server teams can ship on their own release schedules:

```csharp
var api = await client.ApiAsync(new Hello { Name = "World" });
if (api.Succeeded)
    Console.WriteLine(api.Response.Result);
```

`Api`/`ApiAsync` return an `ApiResult<T>` so success and structured validation errors are handled as values instead of exceptions - the pattern Blazor, MAUI, WPF, WinForms and console Apps use to bind server errors directly to their UI. Everything else in the .NET clients comes along too: authentication, typed AutoQuery, batched and one-way requests, file uploads and Service Gateway support, covered in the [C# Add ServiceStack Reference docs](/csharp-add-servicestack-reference).

### F# - Typed contracts for functional .NET

F# gets the same first-class .NET clients, with DTOs generated into a single namespace that's immediately usable from projects, `dotnet fsi` scripts and [Jupyter notebooks](/jupyter-notebooks-fsharp):

```fsharp
let client = JsonApiClient(baseUrl)

let response = client.Send(Hello(Name = "World"))
printfn $"{response.Result}"
```

That combination suits the teams F# tends to live in - quantitative, data and integration work where a short script needs to call a production API with real types rather than parse JSON by hand. Typed AutoQuery, authentication, structured errors and file uploads all work exactly as they do in C#, as described in the [F# Add ServiceStack Reference docs](/fsharp-add-servicestack-reference).

### VB.NET - Modern typed APIs for long-lived business Apps

Plenty of organizations still run substantial VB.NET line-of-business software that has to keep talking to new services. Adding a reference gives those Apps the same generated DTOs and full .NET client - no rewrite, no hand-rolled HTTP layer:

```vbnet
Dim client = New JsonApiClient(baseUrl)

Dim response = Await client.SendAsync(New Hello With {.Name = "World"})
Console.WriteLine(response.Result)
```

Both async and blocking APIs are available, so it fits event-driven desktop code as naturally as it does batch jobs and scheduled integrations. See the [VB.NET Add ServiceStack Reference docs](/vbnet-add-servicestack-reference) for the generated type conventions.

### TypeScript - The contract your web App builds against

The [@servicestack/client](https://www.npmjs.com/package/@servicestack/client) `JsonServiceClient` turns your API into part of the frontend's type system - completion for every request, response and enum, in Vue, React, Angular, Svelte, Node and Deno alike:

```ts
const api = await client.api(new Hello({ name: 'World' }))
console.log(api.response.result)
```

Because the DTOs are regenerated from the running API, a removed field or renamed enum surfaces as a **TypeScript compile error in CI** - the earliest and cheapest place for a frontend team to find out the backend changed. Includes structured `ResponseStatus` errors ready to bind to form validation, authentication, typed AutoQuery, batch and one-way requests and file uploads, detailed in the [TypeScript Add ServiceStack Reference docs](/typescript-add-servicestack-reference).

### JavaScript - Typed APIs without a build step

Generated ES module DTOs are annotated with JSDoc types, so plain JavaScript gets the same editor intelli-sense TypeScript does - and they can be imported straight from a running API, with no bundler, transpiler or toolchain involved:

```js
import { JsonServiceClient } from '@servicestack/client'
import { Hello } from 'https://example.org/types/mjs'

const client = new JsonServiceClient('https://example.org')
const api = await client.api(new Hello({ name: 'World' }))
```

Ideal for the code that isn't a SPA: server-rendered Razor and MVC pages, admin screens, embedded widgets, internal dashboards and quick Node scripts - anywhere adding a build pipeline would cost more than the feature. The [JavaScript Add ServiceStack Reference docs](/javascript-add-servicestack-reference) also cover saving annotated DTOs locally for static analysis.

### Python - Typed APIs for data, scripting and automation

The [servicestack](https://pypi.org/project/servicestack/) package generates dataclass DTOs that follow PEP 8 naming, so they read like Python rather than translated C#, and populate in a single constructor expression:

```python
client = JsonServiceClient(base_url)

response: HelloResponse = client.send(Hello(name="World"))
print(response.result)
```

That makes it a natural fit for the parts of an organization that live outside the App - data and analytics notebooks, ETL and ML pipelines, DevOps automation and internal tooling - all calling the same authenticated business APIs the product uses, with type hints driving completion in PyCharm and VS Code. Structured errors, authentication, typed AutoQuery, batch and one-way requests and file uploads are covered in the [Python Add ServiceStack Reference docs](/python-add-servicestack-reference).

### PHP - Typed APIs for the web's most deployed stack

The [servicestack/client](https://packagist.org/packages/servicestack/client) Composer package generates DTOs using PHP 8's promoted constructors and typed properties, so requests are populated with named arguments and checked by static analysis:

```php
$client = new JsonServiceClient($baseUrl);

/** @var HelloResponse $response */
$response = $client->send(new Hello(name: "World"));
echo $response->result;
```

For organizations with an established PHP presence - Laravel and Symfony Apps, CMS and intranet sites, hosting and billing portals - it's the shortest path to consuming a .NET backend without either side changing platforms. Includes structured errors with field validation details, authentication, typed AutoQuery, batch and one-way requests and file uploads, documented in the [PHP Add ServiceStack Reference docs](/php-add-servicestack-reference).

### Ruby - ServiceStack productivity in a dynamic language

The [servicestack](https://rubygems.org/gems/servicestack) gem provides generated DTOs with explicit properties and API metadata, giving editors and developers a discoverable model of every request and response:

```ruby
client = ServiceStack::JsonServiceClient.new(base_url)

response = client.send(Hello.new(name: 'World'))
puts response.result
```

Implemented with Ruby's standard library and no external runtime dependencies. Includes structured `WebServiceException` errors, field validation details, authentication, typed AutoQuery conventions, batch calls, one-way requests, custom URLs and file uploads - each documented in the [Ruby Add ServiceStack Reference docs](/ruby-add-servicestack-reference).

### Swift - Native, async-first APIs for Apple platforms

Added with Swift Package Manager, [ServiceStack.Swift](https://github.com/ServiceStack/ServiceStack.Swift) generates `Codable` DTOs whose request types declare the response they return, letting the client infer the entire call under `async/await`:

```swift
let client = JsonServiceClient(baseUrl: baseUrl)

let response = try await client.getAsync(Hello(name: "World"))
print(response.result)
```

For iOS, iPadOS and macOS teams this replaces the usual `URLSession` plumbing and hand-written response structs with a contract that Xcode understands - so a backend change shows up as a Swift compile error rather than a nil field in a shipped App. Structured errors, authentication, typed AutoQuery, batch and one-way requests and multipart uploads are covered in the [Swift Add ServiceStack Reference docs](/swift-add-servicestack-reference).

### Java - Typed APIs for Android and the JVM

The `net.servicestack:client` package adds a `JsonServiceClient` closely modelled on ServiceStack's .NET clients, with generated DTOs using fluent setters that chain into a single expression:

```java
JsonServiceClient client = new JsonServiceClient(baseUrl);

HelloResponse response = client.get(new Hello().setName("World"));
System.out.println(response.getResult());
```

Java remains the backbone of both Android and large enterprise back offices, and the same generated file serves each: Android Apps get async variants that marshal results back to the UI thread, whilst server-side integrations get a typed client for calling business APIs from existing JVM services. IntelliJ IDEA, Android Studio and Eclipse can add and refresh references directly from the IDE - see the [Java Add ServiceStack Reference docs](/java-add-servicestack-reference).

### Kotlin - Concise, null-safe clients for Android and JVM services

Kotlin uses the same JVM client with DTOs generated as idiomatic Kotlin classes, keeping calls terse whilst nullability stays explicit in the type system:

```kotlin
val client = JsonServiceClient(baseUrl)

val response = client.get(Hello().apply { Name = "World" })
println(response.Result)
```

As the default language for new Android development, it's typically where an organization's mobile client meets the same backend its web App uses - with async APIs for background calls, structured errors, authentication, typed AutoQuery, batch and one-way requests and multipart uploads. Both Android Studio and IntelliJ can update the reference in place, as described in the [Kotlin Add ServiceStack Reference docs](/kotlin-add-servicestack-reference).

### Dart - One typed client for every Flutter target

The [servicestack](https://pub.dev/packages/servicestack) package generates DTOs and a `JsonServiceClient` that works unchanged across every platform Flutter builds for - iOS, Android, web, desktop and server-side Dart:

```dart
var client = JsonServiceClient(baseUrl);

var response = await client.get(Hello(name: 'World'));
print(response.result);
```

That's the real leverage for a team that chose Flutter to build one App for several platforms: one API contract, one client and one set of DTOs behind all of them, with `dart:io` and `dart:html` implementations sharing the same `IServiceClient` interface. Structured errors, authentication, typed AutoQuery, batch and one-way requests and file uploads are covered in the [Dart Add ServiceStack Reference docs](/dart-add-servicestack-reference).

### Go - Simple, typed APIs for cloud software

The new [servicestack-go](https://github.com/ServiceStack/servicestack-go) client preserves everything that makes Go appealing: simplicity, fast builds and straightforward deployment. Generated Request DTOs carry their response type and HTTP method, allowing Go's generic client to infer the complete API call:

```go
res, err := ss.Send(client, dtos.Hello{Name: "World"})
if err != nil {
    log.Fatal(err)
}
fmt.Println(res.Result)
```

Built on Go's standard library with **no external runtime dependencies**. Provides `context.Context` variants for cancellation and deadlines, structured `ResponseStatus` errors, field validation errors, typed AutoQuery responses, multipart uploads, batched and one-way requests, and authentication using Basic Auth, API Keys, JWTs, refresh tokens or session cookies - all covered in the [Go Add ServiceStack Reference docs](/go-add-servicestack-reference).

### Rust - Correctness from the wire to application code

The [servicestack](https://crates.io/crates/servicestack) crate brings Rust's priorities to API integration. Generated DTOs implement the traits that associate each request with its response, route and HTTP method:

```rust
let response = client.send(&Hello {
    name: "World".to_string(),
}).await?;

println!("{}", response.result);
```

The async client is the default, with an optional blocking client. Supports structured errors, authentication with automatic token refresh, typed AutoQuery, multipart uploads, batch and one-way calls, and access to the underlying `reqwest` configuration when finer control is needed.

Most importantly, changes at the API boundary become **ordinary Rust compiler feedback** - no scattering `serde_json::Value` through business logic. See the [Rust Add ServiceStack Reference docs](/rust-add-servicestack-reference) for the complete client API.

### Zig - Explicit, efficient APIs for systems software

[servicestack-zig](https://github.com/ServiceStack/servicestack-zig) uses Zig's standard library with no third-party dependencies, infers the response type at compile time and makes ownership explicit:

```zig
var client = try ss.JsonServiceClient.init(allocator, base_url);
defer client.deinit();

var response = try client.send(dtos.Hello{
    .name = "World",
});
defer response.deinit();
```

The caller supplies the allocator and owns the parsed response lifecycle, whilst the client still provides structured errors, validation details, authentication, session cookies, typed AutoQuery, batch and one-way requests, custom URLs and multipart uploads. Allocation and ownership conventions are explained in the [Zig Add ServiceStack Reference docs](/zig-add-servicestack-reference).
