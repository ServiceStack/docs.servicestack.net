---
slug: rust-add-servicestack-reference
title: Rust ServiceStack Reference
---

:::{.shadow .-ml-12 .w-[940px] .rounded-md}
![](/img/pages/servicestack-reference/rust-info.png)
:::

ServiceStack's **Add ServiceStack Reference** feature allows clients to generate Native Types for Rust - providing a simple way to give Rust clients typed access to your ServiceStack Services.

### Rust - Correctness from the wire to application code

The [servicestack](https://crates.io/crates/servicestack) crate ([source](https://github.com/ServiceStack/servicestack-rust)) brings Rust's priorities to API integration. Generated DTOs implement the traits that associate each request with its response, route and HTTP method:

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

Requires **Rust 1.88+**.

It's a small dependency with a minimal footprint, built on [reqwest](https://crates.io/crates/reqwest) and [serde](https://serde.rs) using **rustls** so it doesn't require OpenSSL or any other system dependencies.

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
    // Client Configuration
    pub fn new(base_url: &str) -> Self                     // sends Requests to /api
    pub fn new_json_service_client(base_url: &str) -> Self // sends Requests to /json/reply
    pub fn with_client(base_url: &str, http: reqwest::Client) -> Self
    pub fn base_url(&self) -> &str
    pub fn reply_base_url(&self) -> &str
    pub fn set_base_path(&mut self, base_path: &str) -> &mut Self
    pub fn set_bearer_token(&mut self, token: &str) -> &mut Self
    pub fn bearer_token(&self) -> Option<String>
    pub fn set_refresh_token(&mut self, token: &str) -> &mut Self
    pub fn set_refresh_token_uri(&mut self, uri: &str) -> &mut Self
    pub fn set_credentials(&mut self, user_name: &str, password: &str) -> &mut Self
    pub fn set_header(&mut self, name: &str, value: &str) -> &mut Self
    pub fn set_user_agent(&mut self, user_agent: &str) -> &mut Self
    pub fn set_on_authentication_required<F>(&mut self, callback: F) -> &mut Self

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

    // Batched and one-way Requests
    pub async fn send_all<T: IReturn>(&self, requests: &[T]) -> Result<Vec<T::Response>>
    pub async fn publish<T: IRequest>(&self, request: &T) -> Result<()>

    // URL API
    pub async fn get_url<R: DeserializeOwned>(&self, path: &str) -> Result<R>
    pub async fn get_url_with<R: DeserializeOwned>(&self, path: &str, args: &[(&str,&str)]) -> Result<R>
    pub async fn post_url<R: DeserializeOwned, B: Serialize>(&self, path: &str, body: &B) -> Result<R>
    pub async fn put_url<R: DeserializeOwned, B: Serialize>(&self, path: &str, body: &B) -> Result<R>
    pub async fn patch_url<R: DeserializeOwned, B: Serialize>(&self, path: &str, body: &B) -> Result<R>
    pub async fn delete_url<R: DeserializeOwned>(&self, path: &str) -> Result<R>
    pub async fn send_url<R: DeserializeOwned, B: Serialize>(&self, method: &str, path: &str, body: Option<&B>) -> Result<R>
    pub async fn get_url_string(&self, path: &str) -> Result<String>

    // File Uploads, requires the `multipart` feature
    pub async fn post_files_with_request<T: IReturn>(&self, request: &T, files: Vec<UploadFile>) -> Result<T::Response>
}
```

The sync `servicestack::blocking::JsonServiceClient` mirrors the same API without `async`/`await`, other than multipart file uploads which are only available on the async client.

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

APIs that don't return a Response Body are sent with `send_void`, which accepts the Request DTOs generated with an `IReturnVoid` impl:

```rust
client.send_void(&DeleteBooking { id: 1 }).await?;
```

### Resolving the HTTP Method

The `VERB` of a Request DTO's generated `IRequest` impl also determines whether it's sent in the QueryString or the JSON Request Body, where only `GET`, `DELETE`, `HEAD` and `OPTIONS` Requests send their populated properties in the QueryString:

```rust
// GET /api/Hello?name=World
client.send(&Hello { name: Some("World".into()) }).await?;

// POST /api/CreateBooking {"name":"Booking"}
client.send(&CreateBooking { name: Some("Booking".into()), ..Default::default() }).await?;
```

Request DTOs that aren't annotated with a Verb default to `POST`, which can be overridden per Request by sending it with an explicit HTTP Method:

```rust
let res = client.get(&Hello { name: Some("World".into()) }).await?;   // GET /api/Hello?name=World
let res = client.post(&Hello { name: Some("World".into()) }).await?;  // POST /api/Hello {"name":"World"}
```

Batched and one-way Requests are sent to their own routes, i.e. `send_all` sends its Requests to the API's batched `/api/Hello[]` route whilst `publish` sends them to the one-way endpoint, e.g. `/json/oneway/Hello` when using `new_json_service_client`.

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

As the query params are `Option<T>` they're only sent when populated, letting the Server apply its own defaults otherwise. In addition to `results`, `QueryResponse<T>` returns the `offset` of the current page and the `total` number of matching results when requested with `include: "Total"`:

```rust
let res = client.send(&QueryBookings {
    query_db: QueryDb {
        skip: Some(10),
        take: Some(10),
        order_by: Some("id".into()),
        include: Some("Total".into()),          // include the Total of matching results
        fields: Some("id,name,roomType".into()), // limit the fields returned
        ..Default::default()
    },
    ..Default::default()
}).await?;

println!("{} {} {}", res.offset, res.total, res.results.len());
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

Where relative paths are resolved against the client's Base URL whilst absolute URLs are sent as-is, letting the same client call APIs on different hosts. `put_url`, `patch_url` and `delete_url` are also available, or use `send_url` to send a Request with any HTTP Method:

```rust
let res: IdResponse = client.put_url("/bookings/1", &request).await?;
let res: EmptyResponse = client.delete_url("/bookings/1").await?;

let res: HelloResponse = client
    .send_url(servicestack::HTTP_POST, "/hello", Some(&request))
    .await?;
```

Use `get_url_with` to append additional args to the QueryString, which are URL encoded and serialized using the same [QueryString Serialization](#querystring-serialization) as Request DTOs:

```rust
let res: HelloResponse = client
    .get_url_with("/hello/World", &[("field", "name"), ("comment", "a b&c")])
    .await?;
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

for res in responses { // res is a HelloResponse
    println!("{}", res.result);
}
```

Which sends them to the API's batched `/api/Hello[]` route in a single Request, returning a `Vec<T::Response>` of all their Responses in the same order.

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

All failures are returned in a single `Error` enum, letting a `match` handle API errors, transport failures and invalid Responses together:

```rust
use servicestack::Error;

match client.send(&Hello::default()).await {
    Ok(res) => println!("{}", res.result),
    Err(Error::Api(ex)) => {          // the API returned an error Response
        println!("{} {}", ex.status_code, ex.error_message());
        for field_error in ex.field_errors() {
            println!("  {}: {}", field_error.field_name, field_error.message);
        }
    }
    Err(Error::Http(err)) => println!("connection failed: {err}"),        // reqwest error
    Err(Error::Serialization(err)) => println!("invalid Response: {err}"), // serde_json error
}
```

`Error::Api` holds a boxed `WebServiceException` with the raw HTTP error Response and the typed accessors you'd expect:

```rust
ex.status_code            // HTTP Status Code, e.g. 400
ex.status_description     // HTTP Status Description, e.g. "Bad Request"
ex.response_status        // Option<ResponseStatus>, the API's structured error
ex.response_body          // raw error body, e.g. when a HTML or plain text error was returned
ex.error_code()           // "NotEmpty"
ex.error_message()        // "'Name' must not be empty."
ex.field_errors()         // &[ResponseError] of all field validation errors
ex.field_error("Name")    // Some("'Name' must not be empty.")
ex.is_validation_error()  // has field validation errors
ex.is_unauthorized()      // 401
ex.is_not_found()         // 404
```

As it implements `std::error::Error` and `Display`, it can be propagated with `?` and formatted directly, e.g. `400 NotEmpty: 'Name' must not be empty.` Non JSON error Responses are also converted into a `WebServiceException` populated from the HTTP Status, so a single error type can be used to handle all API failures.

Field validation errors are returned in typed `ResponseError` structs which can be mapped back to the fields of your UI:

```rust
if let Some(status) = err.response_status() {
    for field_error in &status.errors {
        println!("{} {} {}", field_error.field_name, field_error.error_code, field_error.message);
    }
}
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

`ApiResult<T>` holds the typed `response` and any `ResponseStatus` `error` alongside its `succeeded()`, `failed()`, `error_code()`, `error_message()`, `field_error()` and `response()` helpers. As all errors are converted into a `ResponseStatus`, transport and serialization failures are also returned in `api.error` with an `HttpError` or `SerializationException` Error Code, whilst `into_result()` converts it back into a standard `Result<T, ResponseStatus>`:

```rust
match client.api(&CreateBooking::default()).await.into_result() {
    Ok(res) => println!("{}", res.id),
    Err(status) => println!("{} {}", status.error_code, status.message),
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

This will populate the `JsonServiceClient` with [Session Cookies](/auth/sessions#cookie-session-ids) which will transparently be sent on subsequent requests to make authenticated requests, as well as using any Bearer and Refresh Tokens the Server returns.

Session Cookies are maintained in the client's cookie jar whilst its tokens are available from `bearer_token()`. The `AuthenticateResponse` also returns the authenticated User's info, roles and permissions:

```rust
let auth = client.authenticate("test", "test").await?;

println!("{} {} {}", auth.user_id, auth.user_name, auth.display_name);
println!("{:?} {:?}", auth.roles, auth.permissions);
println!("{:?}", client.bearer_token());

// All subsequent Requests are made with the Authenticated Session
let res = client.send(&HelloSecure { name: Some("World".into()) }).await?;
```

As the auth state is shared behind a lock, Requests sent through a `&self` client (and any of its clones) all see the updated tokens.

### Authenticating using JWT

Use `set_bearer_token` to Authenticate with a [ServiceStack JWT Provider](/auth/jwt-authprovider) using a JWT Token:

```rust
client.set_bearer_token(&jwt);
```

Alternatively you can use just a [Refresh Token](/auth/jwt-authprovider#refresh-tokens) instead:

```rust
client.set_refresh_token(&refresh_token);
```

Where the client will automatically fetch a new JWT Bearer Token using the Refresh Token for authenticated requests, i.e. when a Request fails with a `401 Unauthorized` the client sends its Refresh Token to the [GetAccessToken](/auth/jwt-authprovider#refresh-tokens) API, updates its Bearer Token then transparently retries the original Request:

```
POST /api/Hello           -> 401 Unauthorized
POST /api/GetAccessToken  -> 200 { "accessToken": "..." }
POST /api/Hello           -> 200 { "result": "Hello, World!" }
```

Use `set_refresh_token_uri` to fetch Access Tokens from a different [central Auth Server](/auth/jwt-authprovider#retrieve-token-from-central-auth-server-using-credentials-auth):

```rust
client.set_refresh_token_uri("https://auth.example.org/api/GetAccessToken");
```

### Authenticating using an API Key

Use `set_bearer_token` to Authenticate with an [API Key](/auth/api-key-authprovider):

```rust
client.set_bearer_token("ak-87949de37e894627a9f6173154e7cafa");
```

### Built-in ServiceStack DTOs

The `servicestack` crate includes typed Request DTOs for ServiceStack's built-in APIs, letting you call them without needing to generate them:

```rust
use servicestack::*;

// Authentication
let auth = client.send(&Authenticate {
    provider: Some("credentials".into()),
    user_name: Some("test".into()),
    password: Some("test".into()),
    remember_me: Some(true),
    ..Default::default()
}).await?;

let reg = client.send(&Register {
    user_name: Some("new-user".into()),
    email: Some("user@example.org".into()),
    password: Some("p@55wOrd".into()),
    auto_login: Some(true),
    ..Default::default()
}).await?;

// JWT
let token = client.send(&ConvertSessionToToken::default()).await?;  // Session -> JWT
let access = client.send(&GetAccessToken { refresh_token, ..Default::default() }).await?;

// API Keys
let keys = client.send(&GetApiKeys { environment: "live".into(), ..Default::default() }).await?;
let new_keys = client.send(&RegenerateApiKeys { environment: "live".into(), ..Default::default() }).await?;

// Roles and Permissions
let roles = client.send(&AssignRoles {
    user_name: "user".into(),
    roles: vec!["Employee".into()],
    ..Default::default()
}).await?;
client.send(&UnAssignRoles { user_name: "user".into(), roles: vec!["Employee".into()], ..Default::default() }).await?;

// Navigation
let nav = client.send(&GetNavItems::default()).await?;
```

Together with the built-in Response Types and base types that generated DTOs reference:

| Type                  | Description                                                            |
|-----------------------|------------------------------------------------------------------------|
| `ResponseStatus`      | ServiceStack's structured error response                                |
| `ResponseError`       | An individual field validation error                                    |
| `EmptyResponse`       | Response of APIs that don't return a Response Body                      |
| `IdResponse`          | Response returning the Id of the created or updated entity              |
| `StringResponse`      | Response returning a single `result` string                             |
| `StringsResponse`     | Response returning a list of string `results`                           |
| `AuditBase`           | Audit fields flattened into [AutoQuery CRUD](/autoquery/crud) data models |
| `QueryBase`           | Query params supported by all [AutoQuery](/autoquery/) Requests         |
| `QueryDb`             | Base type of AutoQuery RDBMS Requests                                   |
| `QueryData`           | Base type of [AutoQuery Data](/autoquery/data) Requests                 |
| `QueryResponse<T>`    | Typed Response of AutoQuery Requests                                    |
| `NavItem`             | A [Navigation Item](/navigation) returned by `GetNavItems`              |

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

Any populated properties on the Request DTO are sent as form fields alongside the uploaded files, whilst `field_name` defaults to `file` and `content_type` is detected by the Server when it's `None`. To upload multiple files just send multiple `UploadFile`s:

```rust
let res = client.post_files_with_request(&UploadPhotos { album: "Holiday".into() }, vec![
    UploadFile { field_name: "files".into(), file_name: "1.png".into(),
                 content_type: Some("image/png".into()), data: std::fs::read("1.png")? },
    UploadFile { field_name: "files".into(), file_name: "2.txt".into(),
                 content_type: None, data: b"file contents".to_vec() },
]).await?;
```

::: info
File uploads are only available on the async client
:::

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

`JsonServiceClient::new` sends Requests to ServiceStack's pre-defined `/api` route. Use `JsonServiceClient::new_json_service_client` for older ServiceStack instances that only have the `/json/reply` routes enabled, or `set_base_path` for a custom base path:

```rust
let api_client = JsonServiceClient::new("https://example.org");                  // /api/Hello
let json_client = JsonServiceClient::new_json_service_client("https://example.org"); // /json/reply/Hello

let mut custom_client = JsonServiceClient::new("https://example.org");
custom_client.set_base_path("custom/api");                                       // /custom/api/Hello
```

The default `reqwest::Client` is created with a **60s timeout** and a **cookie store** enabled for maintaining [Session Cookies](/auth/sessions#cookie-session-ids), so supply `.cookie_store(true)` when configuring your own client if you're using Session-based Auth.

### Sharing the Client between tasks

`JsonServiceClient` is cheap to clone and safe to share, where clones share the same connection pool, cookie jar and auth tokens - so a single configured client should be cloned into your App's tasks to benefit from `reqwest`'s connection pooling and to have any refreshed Bearer Tokens visible to all of them:

```rust
let client = JsonServiceClient::new("https://blazor-vue.web-templates.io"); // configure before sharing

let mut tasks = Vec::new();
for name in names {
    let client = client.clone();
    tasks.push(tokio::spawn(async move {
        client.send(&Hello { name: Some(name) }).await
    }));
}

for task in tasks {
    println!("{}", task.await??.result);
}
```

Requests are sent through a `&self` client so a shared client only needs to be `mut` when re-configuring it with its `set_*` methods.

### QueryString Serialization

Request DTO properties and args sent in the QueryString use ServiceStack's [JS Object](/js-utils) notation for complex types, where each Request DTO is first serialized by **serde** then converted into its QueryString representation:

| Rust Value                        | QueryString                     |
|-----------------------------------|---------------------------------|
| `Some("World")`                   | `name=World`                    |
| `Some(true)`                      | `enabled=true`                  |
| `Some(1.5)`                       | `rate=1.5`                      |
| `vec![1,2,3]`                     | `ids=[1,2,3]`                   |
| `HashMap` of `{"a":1,"b":2}`      | `meta={a:1,b:2}`                |
| `None`                            | *(omitted)*                     |

As names and values are percent-encoded, `"a b&c"` is sent as `a+b%26c`, whilst `None` properties generated with `#[serde(skip_serializing_if = "Option::is_none")]` are omitted entirely so the Server can apply its own defaults.

### URL Utils

The utils the client uses to construct its API Requests are also exported in `servicestack::url` for building your own URLs and integrations:

```rust
use servicestack::url::*;

combine_with("https://example.org/", "/api/")           // "https://example.org/api"
to_absolute_url("https://example.org", "/api/Hello")    // "https://example.org/api/Hello"
append_query_string("/api/Hello", &[("name","World")])  // "/api/Hello?name=World"
qs_value(&serde_json::json!([1,2,3]))                   // "[1,2,3]"
encode_uri_component("a b")                             // "a+b"
has_request_body("GET")                                 // false
```

Along with the HTTP constants used in ServiceStack APIs, e.g. `HTTP_GET`, `HTTP_POST`, `HTTP_PUT`, `HTTP_PATCH`, `HTTP_DELETE`, `HTTP_OPTIONS`, `HTTP_HEAD`, `MIME_TYPE_JSON` and `DEFAULT_BASE_PATH`.

### Calling AI Chat and OpenAI compatible APIs

As Request DTOs are just structs, more advanced APIs like [AI Chat](/ai-chat-api)'s OpenAI-compatible `ChatCompletion` API can also be called with typed DTOs, where polymorphic content parts are sent as `serde_json::Value`:

```rust
// The ChatCompletion API requires an authenticated User
client.authenticate("username", "password").await?;

let request = ChatCompletion {
    model: "openai/gpt-oss-120b".to_string(),
    messages: vec![AiMessage {
        role: "user".to_string(),
        // Content parts are polymorphic, e.g. text, image_url or input_audio
        content: Some(vec![serde_json::to_value(AiTextContent {
            ai_content: AiContent { r#type: "text".to_string() },
            text: "Capital of France? Answer in 3 words".to_string(),
        })?]),
        ..Default::default()
    }],
    ..Default::default()
};

let res = match client.send(&request).await {
    Ok(res) => res,
    Err(err) => {
        // Handle rate limited or temporarily unavailable LLMs
        if matches!(err.status_code(), Some(429 | 502 | 503 | 504)) { /* retry */ }
        return Err(err.into());
    }
};

println!("{}", res.choices[0].message.content);
```

### Testing

As `JsonServiceClient` accepts any Base URL, APIs can be tested against a mock HTTP Server like [mockito](https://crates.io/crates/mockito) without needing to mock the client itself:

```rust
#[tokio::test]
async fn sends_get_request_in_query_string() {
    let mut server = mockito::Server::new_async().await;
    let mock = server
        .mock("GET", "/api/Hello?name=World")
        .with_status(200)
        .with_header("content-type", "application/json")
        .with_body(r#"{"result":"Hello, World!"}"#)
        .create_async()
        .await;

    let client = JsonServiceClient::new(&server.url());
    let res = client.send(&Hello { name: Some("World".into()) })
        .await
        .expect("send failed");

    assert_eq!(res.result, "Hello, World!");
    mock.assert_async().await;
}
```

Which is how the client's own [async](https://github.com/ServiceStack/servicestack-rust/blob/main/tests/client_test.rs) and [blocking](https://github.com/ServiceStack/servicestack-rust/blob/main/tests/blocking_test.rs) test suites verify the Requests they send, in addition to its [integration tests](https://github.com/ServiceStack/servicestack-rust/blob/main/tests/integration_test.rs) which are run against the live [test.servicestack.net](https://test.servicestack.net) Services:

:::sh
cargo test --all-features              # unit tests
:::

:::sh
cargo test --all-features -- --ignored # integration tests
:::

Use the `SERVICESTACK_TEST_URL` Environment Variable to run the integration tests against a different ServiceStack instance.

### Examples

The [hello](https://github.com/ServiceStack/servicestack-rust/blob/main/examples/hello.rs) example is a small runnable App calling the live **test.servicestack.net** Services with typed APIs, batched Requests, structured validation errors and authenticated Requests, whilst [hello_blocking](https://github.com/ServiceStack/servicestack-rust/blob/main/examples/hello_blocking.rs) calls the same API with the sync client:

:::sh
cargo run --example hello
:::

:::sh
cargo run --example hello_blocking --features blocking
:::

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
