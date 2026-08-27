---
slug: rust-add-servicestack-reference
title: Rust Add ServiceStack Reference
---

ServiceStack's **Add ServiceStack Reference** feature allows clients to generate Native Types for Rust - providing a simple way to give Rust clients typed access to your ServiceStack Services.

### Rust - Correctness from the wire to application code

The [servicestack](https://crates.io/crates/servicestack) crate brings Rust's priorities to API integration. Generated DTOs implement the traits that associate each request with its response, route and HTTP method:

```rust
let response = client.send(&Hello {
    name: "World".to_string(),
}).await?;

println!("{}", response.result);
```

The async client is the default, with an optional blocking client. Supports structured errors, authentication with automatic token refresh, typed AutoQuery, multipart uploads, batch and one-way calls, and access to the underlying `reqwest` configuration when finer control is needed.

Most importantly, changes at the API boundary become **ordinary Rust compiler feedback** - no scattering `serde_json::Value` through business logic.

### First class development experience

[Rust](https://www.rust-lang.org) continues to see rapid adoption for systems programming, WebAssembly, CLI tooling and high-performance network services, where its ownership model delivers memory safety without a garbage collector. To maximize the experience for calling ServiceStack APIs from these environments, Rust is supported as a 1st class Add ServiceStack Reference language which gives Rust developers an end-to-end typed API for consuming ServiceStack APIs, with DTOs generated from a single command-line.

### Ideal idiomatic Typed Message-based API

Rust DTOs are generated as plain structs deriving [serde](https://serde.rs)'s `Serialize`/`Deserialize` along with `Debug`, `Clone`, `PartialEq` and `Default`, following Rust's `snake_case` naming conventions with `#[serde(rename)]` attributes mapping them to their wire names. Optional properties are generated as `Option<T>`, whilst the built-in ServiceStack types are referenced from the [servicestack](https://crates.io/crates/servicestack) crate.

Here's a sample of generated Rust DTOs containing a string Enum, an AutoQuery Request and a standard Request DTO:

```rust
use serde::{Serialize, Deserialize};
use serde_json::Value;
use std::collections::HashMap;
use servicestack::*;

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Default)]
pub enum RoomType {
    #[default]
    #[serde(rename = "Single")]
    Single,
    #[serde(rename = "Queen")]
    Queen,
}

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Default)]
#[serde(default)]
pub struct HelloResponse {
    pub result: String,
}

// Route("/hello/{Name}")
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Default)]
#[serde(default)]
pub struct Hello {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
}

impl IRequest for Hello {
    const NAME: &'static str = "Hello";
    const VERB: &'static str = "GET";
}
impl IReturn for Hello { type Response = HelloResponse; }

/// Find Bookings
// Route("/bookings", "GET")
#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Default)]
#[serde(default)]
pub struct QueryBookings {
    #[serde(flatten)]
    pub query_db: QueryDb,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub id: Option<i32>,
}

impl IRequest for QueryBookings {
    const NAME: &'static str = "QueryBookings";
    const VERB: &'static str = "GET";
}
impl IReturn for QueryBookings { type Response = QueryResponse<Booking>; }
```

The generated `IRequest` and `IReturn` impls are what enable the end-to-end typed API, where the associated `Response` type lets the client resolve each API's Response Type from its Request DTO, whilst the `NAME` and `VERB` associated consts resolve its route and HTTP Method - all at compile time with no runtime reflection.

Types that inherit a base class have its properties flattened into them with `#[serde(flatten)]`, as Rust has no inheritance.

## Installation

The only requirements for Rust Apps to perform typed API Requests are the generated Rust DTOs and the generic `JsonServiceClient` in the [servicestack](https://crates.io/crates/servicestack) crate:

:::sh
cargo add servicestack
:::

Or in your `Cargo.toml`:

```toml
[dependencies]
servicestack = "0.1"
serde = { version = "1", features = ["derive"] }
```

Requires **Rust 1.75+**.

### Features

| Feature     | Description                                                  |
|-------------|--------------------------------------------------------------|
| `blocking`  | Sync client in `servicestack::blocking` for CLIs and scripts |
| `multipart` | `multipart/form-data` file uploads                           |

```toml
servicestack = { version = "0.1", features = ["blocking"] }
```

### Simple command-line utility for Rust

Rust DTOs can be generated from the command-line with the cross-platform [get-dtos](/npx-get-dtos) script which can be run with [Node.js](https://nodejs.org) without needing to install anything:

:::sh
npx get-dtos
:::

Running it without any arguments displays the available options for adding and updating ServiceStack References.

### Adding a ServiceStack Reference

To Add a Rust ServiceStack Reference just call `npx get-dtos rust` with the URL of a remote ServiceStack instance:

:::sh
npx get-dtos rust https://blazor-vue.web-templates.io
:::

Result:

```
Saved to: dtos.rs
```

Calling `npx get-dtos rust` with just a URL will save the DTOs using the Host name, you can override this by specifying a FileName as the 2nd argument:

:::sh
npx get-dtos rust https://blazor-vue.web-templates.io Bookings
:::

Result:

```
Saved to: Bookings.dtos.rs
```

### Updating a ServiceStack Reference

To Update an existing ServiceStack Reference, call `npx get-dtos rust` with the Filename:

:::sh
npx get-dtos rust dtos.rs
:::

Result:

```
Updated: dtos.rs
```

Which will update the File with the latest Rust Server DTOs. You can also customize how DTOs are generated by uncommenting the [Rust DTO Customization Options](#dto-customization-options) and updating them again.

### Updating all Rust DTOs

Calling `npx get-dtos rust` without any arguments will update all Rust DTOs in the current directory:

:::sh
npx get-dtos rust
:::

### Smart Generic JsonServiceClient

The generic `JsonServiceClient` is a 1st class client with the same rich featureset of the smart ServiceClients in other [1st class supported languages](/add-servicestack-reference#supported-languages) sporting a terse, typed flexible API with support for additional untyped params, custom URLs and HTTP Methods and raw Response bodies.

It includes built-in support for a number of [ServiceStack Auth options](/auth/authentication-and-authorization) including [HTTP Basic Auth](https://en.wikipedia.org/wiki/Basic_access_authentication) and stateless Bearer Token Auth Providers like [API Key](/auth/api-key-authprovider) and [JWT Auth](/auth/jwt-authprovider) as well as [stateful Sessions](/auth/sessions) used by the popular **credentials** Auth Provider, whose Session Cookies are maintained in the client's cookie store. [Refresh Tokens](/auth/jwt-authprovider#refresh-tokens) are also supported, where expired JWT Bearer Tokens are transparently refreshed behind-the-scenes before automatically retrying the failed Request.

The client is built on [reqwest](https://crates.io/crates/reqwest) and is cheap to clone and safe to share between tasks, where clones share the same connection pool, cookie store and auth tokens:

```rust
impl JsonServiceClient {
    pub fn new(base_url: &str) -> Self                  // sends Requests to /api
    pub fn new_json_service_client(base_url: &str) -> Self // sends Requests to /json/reply
    pub fn with_client(base_url: &str, http: reqwest::Client) -> Self

    pub fn set_base_path(&mut self, base_path: &str) -> &mut Self
    pub fn set_bearer_token(&mut self, token: &str) -> &mut Self
    pub fn set_refresh_token(&mut self, token: &str) -> &mut Self
    pub fn set_credentials(&mut self, user_name: &str, password: &str) -> &mut Self
    pub fn set_header(&mut self, name: &str, value: &str) -> &mut Self

    // Typed API
    pub async fn send<T: IReturn>(&self, request: &T) -> Result<T::Response>
    pub async fn get<T: IReturn>(&self, request: &T) -> Result<T::Response>
    pub async fn post<T: IReturn>(&self, request: &T) -> Result<T::Response>
    pub async fn put<T: IReturn>(&self, request: &T) -> Result<T::Response>
    pub async fn patch<T: IReturn>(&self, request: &T) -> Result<T::Response>
    pub async fn delete<T: IReturn>(&self, request: &T) -> Result<T::Response>
    pub async fn send_void<T: IReturnVoid>(&self, request: &T) -> Result<()>
    pub async fn api<T: IReturn>(&self, request: &T) -> ApiResult<T::Response>
    pub async fn authenticate(&self, user_name: &str, password: &str) -> Result<AuthenticateResponse>
    pub fn set_on_authentication_required<F>(&mut self, callback: F) -> &mut Self

    // Batched and one-way Requests
    pub async fn send_all<T: IReturn>(&self, requests: &[T]) -> Result<Vec<T::Response>>
    pub async fn publish<T: IRequest>(&self, request: &T) -> Result<()>

    // URL API
    pub async fn get_url<R: DeserializeOwned>(&self, path: &str) -> Result<R>
    pub async fn post_url<R: DeserializeOwned, B: Serialize>(&self, path: &str, body: &B) -> Result<R>
    pub async fn get_url_string(&self, path: &str) -> Result<String>
}
```

### Making Typed API Requests

Making API Requests in Rust is the same as all other [ServiceStack's Service Clients](/clients-overview) by sending a populated Request DTO using a `JsonServiceClient` which returns a typed Response DTO:

```rust
use servicestack::JsonServiceClient;
mod dtos; use dtos::*;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = JsonServiceClient::new("https://blazor-vue.web-templates.io");

    let res = client.send(&Hello { name: Some("World".into()) }).await?; // res is a HelloResponse
    println!("{}", res.result);
    Ok(())
}
```

`send` uses the HTTP Method the API is annotated with, use `get`, `post`, `put`, `patch` or `delete` to send a Request DTO with a specific HTTP Method:

```rust
let res = client.post(&CreateBooking { name: Some("Booking".into()), ..Default::default() }).await?;
```

APIs that don't return a Response Body are sent with `send_void`:

```rust
client.send_void(&DeleteBooking { id: 1 }).await?;
```

### Sync client

Enable the `blocking` feature for the same API without `async`/`await`, ideal for CLIs and scripts:

```rust
use servicestack::blocking::JsonServiceClient;

let client = JsonServiceClient::new("https://blazor-vue.web-templates.io");
let res = client.send(&Hello { name: Some("World".into()) })?;
```

::: warning
As it creates its own runtime, the blocking client can't be used from within an async context, e.g. inside a `#[tokio::main]` fn - use the async client there instead.
:::

### AutoQuery Requests

AutoQuery APIs return a typed `QueryResponse<T>`, with the query params of their base type flattened into the Request DTO:

```rust
use servicestack::QueryDb;

let res = client.send(&QueryBookings {
    query_db: QueryDb { take: Some(5), order_by_desc: Some("id".into()), ..Default::default() },
    ..Default::default()
}).await?;

for booking in res.results { // booking is a Booking
    println!("{} {}", booking.id, booking.name);
}
```

Properties of a Type's base class are accessed through the field they're flattened into, e.g. a `Booking` inheriting `AuditBase` accesses its audit fields with:

```rust
println!("{:?}", booking.audit_base.created_by);
```

### Making API Requests with URLs

In addition to making Typed API Requests you can also call Services using relative or absolute urls:

```rust
let res: HelloResponse = client.get_url("/hello/World").await?;

let res: HelloResponse = client.post_url("/custom-path", &request).await?;
```

### Raw Data Responses

Use `get_url_string` to access a raw Response Body, useful for APIs returning content like CSV:

```rust
let csv = client.get_url_string("/api/QueryBookings.csv").await?;
```

### Batched Requests

Multiple Request DTOs of the same Type can be sent together in a single Request with `send_all`, which returns all their Responses:

```rust
let responses = client.send_all(&[
    Hello { name: Some("A".into()) },
    Hello { name: Some("B".into()) },
]).await?;
```

Or send a Request to a one-way endpoint that ignores its Response:

```rust
client.publish(&Hello { name: Some("World".into()) }).await?;
```

### Error Handling

Failed API Requests return an `Error` containing the HTTP Status Code and the API's structured [ResponseStatus](/error-handling) error:

```rust
match client.send(&CreateBooking::default()).await {
    Ok(res) => println!("{}", res.id),
    Err(err) => {
        println!("{:?}", err.status_code());        // Some(400)
        println!("{:?}", err.error_code());         // Some("NotEmpty")
        println!("{:?}", err.error_message());      // Some("'Name' must not be empty.")
        println!("{:?}", err.field_error("Name"));  // Some("'Name' must not be empty.")
        println!("{}", err.is_unauthorized());      // false
    }
}
```

Which also works with the standard `errors` matching:

```rust
let mut web_ex: &servicestack::WebServiceException;
if let servicestack::Error::Api(ex) = &err { /* ... */ }
```

Alternatively `api` returns errors in its result instead of a separate `Err`, which can be preferable when handling validation errors is part of normal control flow:

```rust
let api = client.api(&CreateBooking::default()).await;
if api.failed() {
    println!("{:?} {:?}", api.error_code(), api.field_error("Name"));
} else {
    println!("{}", api.response().unwrap().id);
}
```

### Authenticating using Basic Auth

Basic Auth support is implemented in `JsonServiceClient` and follows the same API made available in the C# Service Clients:

```rust
let mut client = JsonServiceClient::new(base_url);
client.set_credentials("username", "password");

let res = client.send(&SecureRequest::default()).await?;
```

### Authenticating using Credentials

Alternatively you can authenticate using userName/password credentials with the `authenticate` API:

```rust
let auth = client.authenticate("username", "password").await?;
```

This will populate the `JsonServiceClient` with [Session Cookies](/auth/sessions#cookie-session-ids) which will transparently be sent on subsequent requests to make authenticated requests, as well as using any Bearer Token the Server returns.

### Authenticating using JWT

Use `set_bearer_token` to Authenticate with a [ServiceStack JWT Provider](/auth/jwt-authprovider) using a JWT Token:

```rust
client.set_bearer_token(&jwt);
```

Alternatively you can use just a [Refresh Token](/auth/jwt-authprovider#refresh-tokens) instead:

```rust
client.set_refresh_token(&refresh_token);
```

Where the client will automatically fetch a new JWT Bearer Token using the Refresh Token for authenticated requests.

### Authenticating using an API Key

Use `set_bearer_token` to Authenticate with an [API Key](/auth/api-key-authprovider):

```rust
client.set_bearer_token("ak-87949de37e894627a9f6173154e7cafa");
```

### Transparently handle 401 Unauthorized Responses

If the server returns a 401 Unauthorized Response either because the client was Unauthenticated or the configured Bearer Token or API Key used had expired or was invalidated, you can use `set_on_authentication_required` to re-configure the client before automatically retrying the original request, e.g:

```rust,ignore
client.set_on_authentication_required(|client| {
    Box::pin(async move {
        client.authenticate("username", "password").await?;
        Ok(())
    })
});

// Automatically retries requests returning 401 Responses
let res = client.send(&Secured::default()).await?;
```

The client is cheap to clone, so the callback receives its own handle sharing the same cookie store and auth tokens. The `blocking` client uses the same API without the boxed future:

```rust,ignore
client.set_on_authentication_required(|client| {
    client.authenticate("username", "password")?;
    Ok(())
});
```

A configured Refresh Token takes precedence over the callback, which is only used when no Refresh Token is set or refreshing it failed.

Requires **servicestack v0.1.1+**.

### Uploading Files

Enable the `multipart` feature to upload files with an API Request:

```rust
use servicestack::UploadFile;

let res = client.post_files_with_request(&UploadPhoto { album: "Holiday".into() }, vec![
    UploadFile {
        field_name: "file".into(),
        file_name: "photo.png".into(),
        content_type: Some("image/png".into()),
        data: std::fs::read("photo.png")?,
    },
]).await?;
```

### Client Configuration

```rust
let mut client = JsonServiceClient::new("https://example.org");
client.set_header("X-Custom", "Value");
client.set_user_agent("my-app/1.0");

// Or supply a pre-configured reqwest Client for timeouts, proxies and TLS
let http = reqwest::Client::builder()
    .timeout(std::time::Duration::from_secs(30))
    .build()?;
let client = JsonServiceClient::with_client("https://example.org", http);
```

`JsonServiceClient::new` sends Requests to ServiceStack's pre-defined `/api` route. Use `JsonServiceClient::new_json_service_client` for older ServiceStack instances that only have the `/json/reply` routes enabled, or `set_base_path` for a custom base path.

## DTO Customization Options

In most cases you'll just use the generated Rust DTOs as-is, however you can further customize how the DTOs are generated by overriding the default options.

The header in the generated DTOs show the different options Rust native types support with their defaults. To override a value, remove the `//` and specify the value to the right of the `:`. Any uncommented value will be sent to the server to override any server defaults.

```rust
/* Options:
Date: 2026-08-06 15:38:36
Version: 10.09
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://blazor-vue.web-templates.io

//GlobalNamespace:
//MakePropertiesOptional: False
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion:
//AddDescriptionAsComments: True
//IncludeTypes:
//ExcludeTypes:
//DefaultImports: serde::{Serialize, Deserialize},serde_json::Value,std::collections::HashMap
*/
```

### AddResponseStatus

Automatically add a `response_status` property on all Response DTOs, regardless if it wasn't already defined:

```rust
pub struct GetTechnologyResponse {
    #[serde(rename = "responseStatus")]
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub response_status: Option<ResponseStatus>,
}
```

### IncludeTypes

Is used as a Whitelist to specify only the types you would like to have code-generated:

```
/* Options:
IncludeTypes: GetTechnology,GetTechnologyResponse
*/
```

To include a Request DTO and all its dependent types, use the `.*` suffix:

```
/* Options:
IncludeTypes: GetTechnology.*
*/
```

Or include all types within a [Tag Group](/api-design#group-services-by-tag) with:

```
/* Options:
IncludeTypes: {tag}
*/
```

### ExcludeTypes

Is used as a Blacklist to specify which types you would like excluded from being generated:

```
/* Options:
ExcludeTypes: GetTechnology,GetTechnologyResponse
*/
```

### Change Default Server Configuration

The above defaults are also overridable on the ServiceStack Server by modifying the default config on the `NativeTypesFeature` Plugin, e.g:

```csharp
//Server example in C#
var nativeTypes = this.GetPlugin<NativeTypesFeature>();
nativeTypes.MetadataTypesConfig.AddResponseStatus = true;
```

Rust specific functionality can be added by the `RustGenerator`, e.g. to change the crate generated DTOs reference:

```csharp
RustGenerator.LibraryCrate = "my_servicestack";
```

Properties of abstract Types with sub types are emitted as `serde_json::Value` since Rust doesn't support sub classing, which can be disabled with:

```csharp
RustGenerator.PolymorphicPropertiesAsAny = false;
```

### Customize DTO Type generation

Additional Rust specific customization can be statically configured like `PreTypeFilter`, `InnerTypeFilter` & `PostTypeFilter` (available in all languages) which can be used to inject custom code in the generated DTOs output, e.g:

```csharp
RustGenerator.PreTypeFilter = (sb, type) => {
    if (type.IsInterface != true)
    {
        sb.AppendLine("#[allow(dead_code)]");
    }
};
```

There's also `PrePropertyFilter` & `PostPropertyFilter` for generating source before and after properties.

Whilst the generic `[EmitCode]` attribute lets you emit the same code in multiple languages with the same syntax.
