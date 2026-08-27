---
slug: zig-add-servicestack-reference
title: Zig ServiceStack Reference
---

:::{.shadow .-ml-12 .w-[940px] .rounded-md}
![](/img/pages/servicestack-reference/zig-info.webp)
:::

ServiceStack's **Add ServiceStack Reference** feature allows clients to generate Native Types for Zig - providing a simple way to give Zig clients typed access to your ServiceStack Services.

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

The caller supplies the allocator and owns the parsed response lifecycle, whilst the client still provides structured errors, validation details, authentication with transparent token refresh, session cookies, typed AutoQuery, batch and one-way requests, custom URLs and multipart uploads:

| Feature                    | Description                                                                     |
|----------------------------|---------------------------------------------------------------------------------|
| **Zero dependencies**      | Only uses the Zig standard library, no C or third-party dependencies             |
| **comptime typed APIs**    | Response Types, routes and HTTP Methods resolved from Request DTOs at comptime   |
| **Structured errors**      | Typed `ResponseStatus` errors with field validation errors and Status Code helpers |
| **Authentication**         | Basic Auth, API Keys, JWT Bearer Tokens, Refresh Tokens and Session Cookies       |
| **AutoQuery**              | Typed `QueryResponse(T)` Responses with query params flattened into Request DTOs  |
| **File Uploads**           | `multipart/form-data` uploads of single and multiple files with a Request DTO     |
| **Batched Requests**       | Send multiple Requests in a single call, or one-way Requests ignoring Responses   |
| **Custom URLs**            | Call any relative or absolute URL, incl. raw non-JSON Responses like CSV          |
| **Explicit ownership**     | Responses are parsed into their own arena freed with a single `deinit()`          |

### First class development experience

[Zig](https://ziglang.org) is a fast-growing systems language offering a simpler alternative to C with compile-time metaprogramming, explicit allocators and no hidden control flow, which sees it increasingly used for performance-critical services, embedded software and cross-compilation toolchains. To maximize the experience for calling ServiceStack APIs from these environments, Zig is supported as a 1st class Add ServiceStack Reference language which gives Zig developers an end-to-end typed API for consuming ServiceStack APIs, with DTOs generated from a single command-line.

### Ideal idiomatic Typed Message-based API

Zig DTOs are generated as plain structs whose field names match the JSON they're serialized with, so they work directly with `std.json` without any custom parsing. Every field is given a default value so Responses that omit them parse cleanly, and inherited properties are flattened into their sub types since Zig has no inheritance.

Here's a sample of generated Zig DTOs containing a string Enum, a standard Request DTO and an AutoQuery Request:

```zig
const std = @import("std");
const ss = @import("servicestack");

pub const RoomType = enum {
    Single,
    Double,
    Queen,
    Twin,
    Suite,
};

pub const HelloResponse = struct {
    result: ?[]const u8 = null,
};

// @Route("/hello/{Name}")
pub const Hello = struct {
    pub const ss_name = "Hello";
    pub const ss_verb = "GET";
    pub const Response = HelloResponse;

    name: ?[]const u8 = null,
};

/// Find Bookings
// @Route("/bookings", "GET")
pub const QueryBookings = struct {
    pub const ss_name = "QueryBookings";
    pub const ss_verb = "GET";
    pub const Response = ss.QueryResponse(Booking);

    // Inherited AutoQuery params
    skip: ?i32 = null,
    take: ?i32 = null,
    orderBy: ?[]const u8 = null,
    orderByDesc: ?[]const u8 = null,

    id: ?i32 = null,
};
```

The generated `ss_name`, `ss_verb` and `Response` declarations are what enable the end-to-end typed API, letting the client resolve each API's route, HTTP Method and Response Type from its Request DTO at **comptime** - so `client.send()` returns the correct Response Type with no type arguments and no runtime overhead.

### Zig Type Mappings

C# Types are mapped to the closest Zig Type that `std.json` can parse without any custom (de)serializers, where Types without a native Zig equivalent are emitted as the strings and `std.json.Value`'s they're serialized in JSON with:

| C# Type                                    | Zig Type                                              |
|--------------------------------------------|-------------------------------------------------------|
| `string`                                   | `?[]const u8`                                          |
| `bool`                                     | `bool`                                                 |
| `byte` `short` `int` `long`                | `u8` `i16` `i32` `i64`                                 |
| `ushort` `uint` `ulong`                    | `u16` `u32` `u64`                                      |
| `float` `double` `decimal`                 | `f32` `f64` `f64`                                      |
| `DateTime` `DateTimeOffset` `TimeSpan` `Guid` | `?[]const u8` (ISO-8601 / XSD Duration / GUID strings) |
| Nullable Value Types, e.g. `int?`          | `?i32`                                                 |
| `List<T>` and `T[]`                        | `[]T`                                                  |
| `Dictionary<K,V>` and `object`             | `?std.json.Value`                                      |
| `byte[]`                                   | `?[]const u8` (base64)                                 |
| C# `enum`                                  | Zig `enum`                                             |
| Abstract Types with sub Types              | `std.json.Value`                                       |

Enums are generated as Zig enums whose members are serialized as their string names, whilst `[Flags]` enums retain their `i32` values. Members that aren't valid Zig identifiers are emitted with `@""` syntax:

```zig
pub const EnumWithValues = enum {
    None,
    @"Member 1",
    Value2,
};

// @Flags()
pub const EnumFlags = enum(i32) {
    Value0 = 0,
    Value1 = 1,
    Value2 = 2,
    Value3 = 4,
    Value123 = 7,
};
```

Every field is given a default value, i.e. `null` for optional reference types and `0` or `&.{}` for value types and collections, so partial Responses parse cleanly whilst unknown fields the Server returns are ignored - letting you add properties to your APIs without breaking existing Zig clients.

## Installation

The only requirements for Zig Apps to perform typed API Requests are the generated Zig DTOs and the generic `JsonServiceClient` in the [servicestack-zig](https://github.com/ServiceStack/servicestack-zig) module, which only uses the Zig standard library:

:::sh
zig fetch --save https://github.com/ServiceStack/servicestack-zig/archive/refs/tags/v0.1.3.tar.gz
:::

Then add the module to your `build.zig`:

```zig
const servicestack = b.dependency("servicestack", .{ .target = target, .optimize = optimize });

const exe = b.addExecutable(.{
    .name = "myapp",
    .root_module = b.createModule(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
        .imports = &.{
            .{ .name = "servicestack", .module = servicestack.module("servicestack") },
        },
    }),
});
```

Requires **Zig 0.15+**.

### Simple command-line utility for Zig

Zig DTOs can be generated from the command-line with the cross-platform [get-dtos](/npx-get-dtos) script which can be run with [Node.js](https://nodejs.org) without needing to install anything:

:::sh
npx get-dtos
:::

Running it without any arguments displays the available options for adding and updating ServiceStack References.

### Adding a ServiceStack Reference

To Add a Zig ServiceStack Reference just call `npx get-dtos zig` with the URL of a remote ServiceStack instance:

:::sh
npx get-dtos zig https://blazor-vue.web-templates.io
:::

Result:

```
Saved to: dtos.zig
```

Calling `npx get-dtos zig` with just a URL will save the DTOs using the Host name, you can override this by specifying a FileName as the 2nd argument:

:::sh
npx get-dtos zig https://blazor-vue.web-templates.io Bookings
:::

Result:

```
Saved to: Bookings.dtos.zig
```

### Updating a ServiceStack Reference

To Update an existing ServiceStack Reference, call `npx get-dtos zig` with the Filename:

:::sh
npx get-dtos zig dtos.zig
:::

Result:

```
Updated: dtos.zig
```

Which will update the File with the latest Zig Server DTOs. You can also customize how DTOs are generated by uncommenting the [Zig DTO Customization Options](#dto-customization-options) and updating them again.

### Updating all Zig DTOs

Calling `npx get-dtos zig` without any arguments will update all Zig DTOs in the current directory:

:::sh
npx get-dtos zig
:::

### Smart Generic JsonServiceClient

The generic `JsonServiceClient` is a 1st class client with the same rich featureset of the smart ServiceClients in other [1st class supported languages](/add-servicestack-reference#supported-languages) sporting a terse, typed flexible API with support for custom URLs and HTTP Methods and raw Response bodies.

It includes built-in support for a number of [ServiceStack Auth options](/auth/authentication-and-authorization) including [HTTP Basic Auth](https://en.wikipedia.org/wiki/Basic_access_authentication) and stateless Bearer Token Auth Providers like [API Key](/auth/api-key-authprovider) and [JWT Auth](/auth/jwt-authprovider) as well as [stateful Sessions](/auth/sessions) used by the popular **credentials** Auth Provider, whose Session Cookies are retained by the client's built-in `CookieJar` which `std.http.Client` doesn't provide. [Refresh Tokens](/auth/jwt-authprovider#refresh-tokens) are also supported, where expired JWT Bearer Tokens are transparently refreshed behind-the-scenes before automatically retrying the failed Request.

```zig
pub const JsonServiceClient = struct {
    pub fn init(allocator: std.mem.Allocator, base_url: []const u8) !Self
    pub fn deinit(self: *Self) void

    pub fn setBasePath(self: *Self, base_path: []const u8) !void
    pub fn setBearerToken(self: *Self, token: []const u8) void
    pub fn setOwnedBearerToken(self: *Self, token: []const u8) !void
    pub fn setCredentials(self: *Self, user_name: []const u8, password: []const u8) void
    pub fn setHeader(self: *Self, name: []const u8, value: []const u8) !void
    pub fn getError(self: *Self) ?WebServiceException
    cookies: CookieJar // Session Cookies returned by the Server

    // Typed API
    pub fn send(self: *Self, request: anytype) !std.json.Parsed(ResponseTypeOf(@TypeOf(request)))
    pub fn get(self: *Self, request: anytype) !std.json.Parsed(...)
    pub fn post(self: *Self, request: anytype) !std.json.Parsed(...)
    pub fn put(self: *Self, request: anytype) !std.json.Parsed(...)
    pub fn patch(self: *Self, request: anytype) !std.json.Parsed(...)
    pub fn delete(self: *Self, request: anytype) !std.json.Parsed(...)
    pub fn sendVoid(self: *Self, request: anytype) !void
    pub fn sendAs(self: *Self, comptime ResponseType: type, request: anytype) !std.json.Parsed(ResponseType)
    pub fn sendMethod(self: *Self, comptime ResponseType: type, method: std.http.Method, request: anytype) !std.json.Parsed(ResponseType)
    pub fn api(self: *Self, request: anytype) !ApiResult(...)
    pub fn authenticate(self: *Self, user_name: []const u8, password: []const u8) !std.json.Parsed(AuthenticateResponse)
    pub fn setRefreshToken(self: *Self, token: []const u8) void
    on_authentication_required: ?*const fn (client: *Self) anyerror!void

    // File Uploads
    pub fn postFileWithRequest(self: *Self, request: anytype, file: UploadFile) !std.json.Parsed(...)
    pub fn postFilesWithRequest(self: *Self, request: anytype, files: []const UploadFile) !std.json.Parsed(...)
    pub fn postFilesWithRequestUrl(self: *Self, path: []const u8, request: anytype, files: []const UploadFile) ![]u8

    // Batched and one-way Requests
    pub fn sendAll(self: *Self, comptime ResponseType: type, requests: anytype) !std.json.Parsed([]const ResponseType)
    pub fn publish(self: *Self, request: anytype) !void

    // URL API
    pub fn getUrl(self: *Self, comptime ResponseType: type, path: []const u8) !std.json.Parsed(ResponseType)
    pub fn postUrl(self: *Self, comptime ResponseType: type, path: []const u8, request: anytype) !std.json.Parsed(ResponseType)
    pub fn sendUrlString(self: *Self, method: std.http.Method, path: []const u8, request: anytype) ![]u8
};
```

### Making Typed API Requests

Making API Requests in Zig is the same as all other [ServiceStack's Service Clients](/clients-overview) by sending a populated Request DTO using a `JsonServiceClient` which returns a typed Response DTO:

```zig
const std = @import("std");
const ss = @import("servicestack");
const dtos = @import("dtos.zig");

pub fn main() !void {
    var gpa: std.heap.GeneralPurposeAllocator(.{}) = .{};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    var client = try ss.JsonServiceClient.init(allocator, "https://blazor-vue.web-templates.io");
    defer client.deinit();

    var res = try client.send(dtos.Hello{ .name = "World" });
    defer res.deinit();

    std.debug.print("{s}\n", .{res.value.result.?});
}
```

Responses are returned as a `std.json.Parsed(T)` that owns the memory of its `value`, so call `deinit()` when you're done with it.

`send` uses the HTTP Method the API is annotated with, use `get`, `post`, `put`, `patch` or `delete` to send a Request DTO with a specific HTTP Method:

```zig
var res = try client.post(dtos.CreateBooking{ .name = "Booking" });
defer res.deinit();
```

APIs that don't return a Response Body are sent with `sendVoid`:

```zig
try client.sendVoid(dtos.DeleteBooking{ .id = 1 });
```

### Resolving the HTTP Method

A Request DTO's `ss_verb` also determines whether its populated properties are sent in the QueryString or the JSON Request Body, where only `GET`, `DELETE`, `HEAD` and `OPTIONS` Requests send their properties in the QueryString:

```zig
// GET /api/Hello?name=World
var res = try client.send(dtos.Hello{ .name = "World" });

// POST /api/CreateBooking {"name":"Booking"}
var res = try client.send(dtos.CreateBooking{ .name = "Booking" });
```

Request DTOs that aren't annotated with a Verb default to `POST`, which can be overridden per Request with `get`, `post`, `put`, `patch` and `delete` or by sending it with an explicit `std.http.Method` and Response Type:

```zig
var res = try client.sendMethod(dtos.HelloResponse, .GET, dtos.Hello{ .name = "World" });
defer res.deinit();
```

Whilst `sendAs` lets you specify the Response Type of Request DTOs that don't declare one, e.g. APIs whose Response Type couldn't be inferred from the Server's metadata:

```zig
var res = try client.sendAs(dtos.HelloResponse, dtos.Hello{ .name = "World" });
defer res.deinit();
```

Batched and one-way Requests are sent to their own routes, i.e. `sendAll` sends its Requests to the API's batched `/api/Hello[]` route whilst `publish` sends them to the one-way `/json/oneway/Hello` endpoint.

### AutoQuery Requests

AutoQuery APIs return a typed `ss.QueryResponse(T)`, with the query params of their base type flattened into the Request DTO:

```zig
var res = try client.send(dtos.QueryBookings{ .take = 5, .orderByDesc = "id" });
defer res.deinit();

for (res.value.results.?) |booking| { // booking is a dtos.Booking
    std.debug.print("{d} {s}\n", .{ booking.id, booking.name.? });
}
```

### Making API Requests with URLs

In addition to making Typed API Requests you can also call Services using relative or absolute urls:

```zig
var res = try client.getUrl(dtos.HelloResponse, "/hello/World");
defer res.deinit();
```

Use `postUrl` to POST a Request DTO or any serializable struct to a custom URL:

```zig
var res = try client.postUrl(dtos.HelloResponse, "/hello", dtos.Hello{ .name = "World" });
defer res.deinit();
```

Both accept relative or absolute URLs, so they can also be used to call APIs on a different host to the client's Base URL.

### Raw Data Responses

Use `sendUrlString` to access a raw Response Body, useful for APIs returning content like CSV:

```zig
const csv = try client.sendUrlString(.GET, "/api/QueryBookings.csv", null);
defer allocator.free(csv);
```

### Batched Requests

Multiple Request DTOs of the same Type can be sent together in a single Request with `sendAll`, which returns all their Responses:

```zig
const requests = [_]dtos.Hello{ .{ .name = "A" }, .{ .name = "B" } };
var res = try client.sendAll(dtos.HelloResponse, requests[0..]);
defer res.deinit();
```

Or send a Request to a one-way endpoint that ignores its Response:

```zig
try client.publish(dtos.Hello{ .name = "World" });
```

### Request DTOs that inherit a Collection

Request DTOs that inherit a Collection in C#, e.g. `List<Rockstar>`, are generated with their collection flattened into an `items` field, annotated with an `ss_collection` declaration:

```zig
// @Route("/rockstars", "POST")
pub const StoreRockstars = struct {
    pub const ss_name = "StoreRockstars";
    pub const ss_verb = "POST";
    pub const ss_collection = "items";

    items: []Rockstar = &.{},
};
```

Which the client uses to send and parse them as the JSON Array their C# base type is serialized with, instead of a JSON Object:

```zig
const rockstars = [_]dtos.Rockstar{
    .{ .id = 1, .firstName = "Jimi", .lastName = "Hendrix" },
    .{ .id = 2, .firstName = "Jim", .lastName = "Morrison" },
};

// Sends [{"id":1,...},{"id":2,...}] to /api/StoreRockstars
var res = try client.sendAs(ss.EmptyResponse, dtos.StoreRockstars{ .items = rockstars[0..] });
defer res.deinit();
```

### Error Handling

As Zig errors can't carry a payload, failed API Requests return `error.WebServiceException` with the HTTP Status Code and the API's structured [ResponseStatus](/error-handling) error available from `client.getError()`:

```zig
if (client.send(dtos.CreateBooking{})) |res| {
    defer res.deinit();
} else |_| {
    const web_ex = client.getError().?;
    std.debug.print("{d} {s}: {s}\n", .{
        web_ex.status_code,     // 400
        web_ex.errorCode(),     // "NotEmpty"
        web_ex.errorMessage(),  // "'Name' must not be empty."
    });
    std.debug.print("{?s}\n", .{web_ex.fieldError("Name")});
    std.debug.print("{}\n", .{web_ex.isUnauthorized()}); // false
}
```

`WebServiceException` includes helpers for inspecting the different error Responses APIs can return:

| Method                  | Description                                                         |
|-------------------------|---------------------------------------------------------------------|
| `status_code`           | HTTP Status Code of the error Response, e.g. `400`                   |
| `status_description`    | HTTP Status Description, e.g. `"Bad Request"`                        |
| `errorCode()`           | The `ErrorCode` of the error, e.g. `"NotFound"`                      |
| `errorMessage()`        | The error message                                                    |
| `fieldError(name)`      | The validation error message for a field, if it has one              |
| `isUnauthorized()`      | Whether the Request requires Authentication (401)                    |
| `isForbidden()`         | Whether the User was denied access to the Request (403)              |
| `isNotFound()`          | Whether the Request returned 404 NotFound                            |
| `isValidationError()`   | Whether the Response contains field validation errors                |
| `response_status`       | The API's structured `ResponseStatus`, if it returned one            |
| `response_body`         | Raw error Response Body, useful for Services returning non JSON errors |

Which lets you handle each class of error appropriately:

```zig
if (client.send(dtos.ThrowType{ .type = "NotFound" })) |res| {
    res.deinit();
} else |_| {
    const web_ex = client.getError().?;
    if (web_ex.isNotFound()) {
        std.debug.print("{s}: {s}\n", .{ web_ex.errorCode(), web_ex.errorMessage() });
    } else if (web_ex.isValidationError()) {
        // Iterate all field validation errors
        for (web_ex.response_status.?.errors.?) |err| {
            std.debug.print("{?s}: {?s}\n", .{ err.fieldName, err.message });
        }
    } else if (web_ex.isUnauthorized()) {
        // Re-authenticate...
    }
}
```

APIs that return a non JSON error Response, e.g. an HTML error page from an intermediary proxy, can be inspected from the raw `response_body`.

::: info
The `WebServiceException` returned by `getError()` is owned by the client's error arena which is reset on the next failed Request, so `dupe()` any of its fields you need to retain
:::

Alternatively `api` returns errors in its result instead of an error union, which can be preferable when handling validation errors is part of normal control flow:

```zig
const api = try client.api(dtos.CreateBooking{});
defer api.deinit();

if (api.failed()) {
    std.debug.print("{s} {?s}\n", .{ api.errorCode(), api.fieldError("Name") });
} else {
    std.debug.print("{s}\n", .{api.response.?.id.?});
}
```

Unlike `getError()`, the `ApiResult` owns its own arena so its `error` and `response` remain valid until you `deinit()` it, with `succeeded()`, `failed()`, `errorCode()`, `errorMessage()` and `fieldError()` for inspecting its result:

```zig
const api = try client.api(dtos.HelloSecure{ .name = "World" });
defer api.deinit();

if (api.failed()) {
    std.debug.print("{s}\n", .{api.errorCode()}); // "Unauthorized"
}
```

### Authenticating using Basic Auth

Basic Auth support is implemented in `JsonServiceClient` and follows the same API made available in the C# Service Clients:

```zig
client.setCredentials("username", "password");

var res = try client.send(dtos.SecureRequest{});
defer res.deinit();
```

### Authenticating using Credentials

Alternatively you can authenticate using userName/password credentials with the `authenticate` API:

```zig
var auth = try client.authenticate("username", "password");
defer auth.deinit();
```

This will populate the client's `CookieJar` with [Session Cookies](/auth/sessions#cookie-session-ids) which will transparently be sent on subsequent requests to make authenticated requests, as well as using any Bearer Token the Server returns.

### Authenticating using JWT

Use `setBearerToken` to Authenticate with a [ServiceStack JWT Provider](/auth/jwt-authprovider) using a JWT Token:

```zig
client.setBearerToken(jwt);
```

Alternatively you can use just a [Refresh Token](/auth/jwt-authprovider#refresh-tokens) instead:

```zig
client.setRefreshToken(refresh_token);
```

Where the client will automatically fetch a new JWT Bearer Token using the Refresh Token before retrying requests that returned 401 Unauthorized (**v0.1.2+**).

### Authenticating using an API Key

Use `setBearerToken` to Authenticate with an [API Key](/auth/api-key-authprovider):

```zig
client.setBearerToken("ak-87949de37e894627a9f6173154e7cafa");
```

### Built-in ServiceStack DTOs

The `servicestack` module includes typed Request DTOs for ServiceStack's built-in APIs, letting you call them without needing to generate them:

```zig
const ss = @import("servicestack");

// Authentication
var auth = try client.send(ss.Authenticate{
    .provider = "credentials",
    .userName = "test",
    .password = "test",
    .rememberMe = true,
});
defer auth.deinit();

var reg = try client.send(ss.Register{
    .userName = "new-user",
    .email = "user@example.org",
    .password = "p@55wOrd",
    .autoLogin = true,
});
defer reg.deinit();

// JWT
var token = try client.send(ss.ConvertSessionToToken{});   // Session -> JWT
defer token.deinit();

var access = try client.send(ss.GetAccessToken{ .refreshToken = refresh_token });
defer access.deinit();

// API Keys
var keys = try client.send(ss.GetApiKeys{ .environment = "live" });
defer keys.deinit();

var new_keys = try client.send(ss.RegenerateApiKeys{ .environment = "live" });
defer new_keys.deinit();

// Roles and Permissions
const roles = [_][]const u8{"Employee"};
var assigned = try client.send(ss.AssignRoles{ .userName = "user", .roles = roles[0..] });
defer assigned.deinit();

var unassigned = try client.send(ss.UnAssignRoles{ .userName = "user", .roles = roles[0..] });
defer unassigned.deinit();
```

Together with the built-in Response Types and base types that generated DTOs reference:

| Type                  | Description                                                            |
|-----------------------|------------------------------------------------------------------------|
| `ss.ResponseStatus`   | ServiceStack's structured error response                                |
| `ss.ResponseError`    | An individual field validation error                                    |
| `ss.EmptyResponse`    | Response of APIs that don't return a Response Body                      |
| `ss.IdResponse`       | Response returning the Id of the created or updated entity              |
| `ss.StringResponse`   | Response returning a single `result` string                             |
| `ss.StringsResponse`  | Response returning a list of string `results`                           |
| `ss.QueryResponse(T)` | Typed Response of [AutoQuery](/autoquery/) Requests                     |
| `ss.UploadFile`       | A file uploaded in a `multipart/form-data` Request                      |
| `ss.CookieJar`        | Session Cookies the client retains between Requests                     |
| `ss.WebServiceException` | Structured error details of a failed Request                         |

`ResponseStatus` also includes `fieldError(name)` and `getFieldError(name)` for looking up an individual field's validation error message or its typed `ResponseError`:

```zig
if (res.value.responseStatus) |status| {
    std.debug.print("{?s}\n", .{status.fieldError("Name")});
    if (status.getFieldError("Name")) |err| {
        std.debug.print("{?s} {?s}\n", .{ err.errorCode, err.message });
    }
}
```

### Uploading Files

Use `postFileWithRequest` to upload a file with an API Request:

```zig
var res = try client.postFileWithRequest(dtos.UploadPhoto{ .album = "Holiday" }, .{
    .field_name = "file",
    .file_name = "photo.png",
    .content_type = "image/png",
    .contents = bytes,
});
defer res.deinit();
```

The Request DTO's populated properties are sent as form fields alongside the file. To upload multiple files use `postFilesWithRequest`:

```zig
const files = [_]ss.UploadFile{
    .{ .field_name = "file1", .file_name = "a.png", .contents = a },
    .{ .field_name = "file2", .file_name = "b.png", .contents = b },
};
var res = try client.postFilesWithRequest(dtos.UploadPhoto{ .album = "Holiday" }, files[0..]);
defer res.deinit();
```

Or use `postFilesWithRequestUrl` to upload files to a custom URL, which returns the raw Response Body the caller owns:

```zig
const body = try client.postFilesWithRequestUrl("/api/UploadPhoto", dtos.UploadPhoto{ .album = "Holiday" }, files[0..]);
defer allocator.free(body);
```

Requires **servicestack v0.1.2+**.

### Transparently handle 401 Unauthorized Responses

If the server returns a 401 Unauthorized Response either because the client was Unauthenticated or the configured Bearer Token or API Key used had expired or was invalidated, you can use the `on_authentication_required` callback to re-authenticate before automatically retrying the original request, e.g:

```zig
fn signIn(client: *ss.JsonServiceClient) anyerror!void {
    var auth = try client.authenticate("username", "password");
    auth.deinit();
}

client.on_authentication_required = signIn;

// Automatically retries requests returning 401 Responses
var res = try client.send(dtos.Secured{});
defer res.deinit();
```

Alternatively configure a [Refresh Token](/auth/jwt-authprovider#refresh-tokens), which takes precedence over the callback and is used to transparently fetch a new JWT Bearer Token before retrying:

```zig
client.setRefreshToken(refresh_token);
```

Requires **servicestack v0.1.2+**.

### Client Configuration

```zig
try client.setHeader("X-Custom", "Value");
try client.setBasePath("");   // use the /json/reply pre-defined routes
client.cookies.clear();       // clear the Session Cookies
```

`JsonServiceClient.init` sends Requests to ServiceStack's pre-defined `/api` route. Use `setBasePath("")` for older ServiceStack instances that only have the `/json/reply` routes enabled.

### Memory Management

As with all Zig libraries, memory ownership is explicit. The client takes the allocator it should use in `init` and owns everything it allocates until `deinit()`, whilst everything it returns is owned by the caller:

| Returns                  | Owned by                                                                          |
|--------------------------|------------------------------------------------------------------------------------|
| `std.json.Parsed(T)`     | The caller's `deinit()`, which frees the arena its `value` was parsed into           |
| `ApiResult(T)`           | The caller's `deinit()`, which frees both its `response` and `error`                 |
| `[]u8` from `sendUrlString` | The caller, which should `allocator.free()` it                                    |
| `WebServiceException`    | The client's error arena, reset on the next failed Request                           |

Since Responses are parsed into their own arena, Request DTOs only need to outlive the Request they're sent in, letting you send stack-allocated DTOs referencing string literals or borrowed slices:

```zig
var res = try client.send(dtos.Hello{ .name = "World" });
defer res.deinit(); // frees the entire Response, incl. every string it parsed
```

Tokens are the exception, where `setBearerToken` retains a reference to the token you give it, so use `setOwnedBearerToken` to have the client copy a token it should own, e.g. one parsed from a Response that's about to be freed:

```zig
try client.setOwnedBearerToken(auth.value.bearerToken.?);
auth.deinit();
```

`authenticate()` does this for you, copying any Bearer Token the Server returns into memory the client owns. Its Session Cookies are likewise retained in the client's `CookieJar`, which `std.http.Client` doesn't provide.

::: info
`JsonServiceClient` maintains mutable state so it isn't synchronized for concurrent access - use a client per thread or guard access to a shared client with a `std.Thread.Mutex`
:::

### QueryString Serialization

Request DTO properties sent in the QueryString use ServiceStack's [JS Object](/js-utils) notation for complex types, where each Request DTO is first serialized with `std.json` then converted into its QueryString representation:

| Zig Value                              | QueryString      |
|----------------------------------------|------------------|
| `.name = "World"`                      | `name=World`     |
| `.enabled = true`                      | `enabled=true`   |
| `.rate = 1.5`                          | `rate=1.5`       |
| `.ids = &.{1,2,3}`                     | `ids=[1,2,3]`    |
| `std.json.Value` of `{"a":1,"b":2}`    | `meta={a:1,b:2}` |
| `null`                                 | *(omitted)*      |

As names and values are percent-encoded, `"a b&c"` is sent as `a+b%26c`, whilst `null` properties are omitted entirely so the Server can apply its own defaults.

### URL Utils

The utils the client uses to construct its API Requests are also exported in `ss.url` for building your own URLs and integrations:

```zig
const url = @import("servicestack").url;

const api = try url.combineWith(allocator, "https://example.org/", "/api/");    // "https://example.org/api"
const abs = try url.toAbsoluteUrl(allocator, "https://example.org", "/hello");  // "https://example.org/hello"
const qs = try url.appendDtoQueryString(allocator, "/api/Hello", dtos.Hello{ .name = "World" });
// "/api/Hello?name=World"

url.hasRequestBody(.GET);        // false
url.parseMethod("PATCH");        // std.http.Method.PATCH
```

Along with `url.encodeUriComponent` and `url.writeQsValue` for writing an encoded value or a `std.json.Value` in its QueryString representation to a `std.Io.Writer`, and the `url.HttpMethods` constants used in ServiceStack APIs, e.g. `HttpMethods.GET`, `HttpMethods.POST`, `HttpMethods.PUT`, `HttpMethods.PATCH`, `HttpMethods.DELETE`, `HttpMethods.OPTIONS` and `HttpMethods.HEAD`.

### Calling AI Chat and OpenAI compatible APIs

As Request DTOs are just structs, more advanced APIs like [AI Chat](/ai-chat-api)'s OpenAI-compatible `ChatCompletion` API can also be called with typed DTOs, where polymorphic content parts are sent as `std.json.Value`:

```zig
/// Converts a typed DTO into the JSON Value that polymorphic properties hold
fn jsonValueOf(allocator: std.mem.Allocator, dto: anytype) !std.json.Parsed(std.json.Value) {
    const json = try std.fmt.allocPrint(allocator, "{f}", .{
        std.json.fmt(dto, .{ .emit_null_optional_fields = false }),
    });
    defer allocator.free(json);
    return std.json.parseFromSlice(std.json.Value, allocator, json, .{});
}

// The ChatCompletion API requires an authenticated User
var auth = try client.authenticate("username", "password");
auth.deinit();

// Content parts are polymorphic, e.g. text, image_url or input_audio, so they're
// held as the JSON Value of the typed content part being sent
var text_part = try jsonValueOf(allocator, dtos.AiTextContent{
    .type = "text",
    .text = "Capital of France? Answer in 3 words",
});
defer text_part.deinit();

var content = [_]std.json.Value{text_part.value};
var messages = [_]dtos.AiMessage{.{ .role = "user", .content = content[0..] }};

var res = try client.send(dtos.ChatCompletion{
    .model = "openai/gpt-oss-120b",
    .messages = messages[0..],
});
defer res.deinit();

std.debug.print("{?s}\n", .{res.value.choices[0].message.?.content});
```

Where rate limited or temporarily unavailable LLMs can be handled by inspecting the failed Request's Status Code:

```zig
var res = client.send(request) catch |err| {
    const web_ex = client.getError() orelse return err;
    switch (web_ex.status_code) {
        429, 502, 503, 504 => return error.ChatUnavailable,
        else => return err,
    }
};
```

### Testing

As `JsonServiceClient` accepts any Base URL, APIs can be tested against a mock HTTP Server or a local instance of your App without needing to mock the client itself. Which is how the client's own [integration tests](https://github.com/ServiceStack/servicestack-zig/blob/main/tests/integration.zig) verify the Requests they send against the live [test.servicestack.net](https://test.servicestack.net) Services, in addition to the offline [unit tests](https://github.com/ServiceStack/servicestack-zig/blob/main/src/client.zig) covering comptime DTO resolution, JSON serialization, its Cookie Jar and `multipart/form-data` bodies:

:::sh
zig build test
:::

:::sh
zig build test-integration
:::

Use the `SERVICESTACK_TEST_URL` Environment Variable to run the integration tests against a different ServiceStack instance.

As all Zig tests are run with `std.testing.allocator` which fails tests that leak, the test suite also verifies every API is free of memory leaks:

```zig
test "sends typed request" {
    const allocator = std.testing.allocator;

    var client = try JsonServiceClient.init(allocator, "https://test.servicestack.net");
    defer client.deinit();

    var res = try client.send(dtos.Hello{ .name = "World", .title = "Mr" });
    defer res.deinit();

    try std.testing.expectEqualStrings("Hello, Mr. World!", res.value.result.?);
}
```

### Examples

The [hello](https://github.com/ServiceStack/servicestack-zig/blob/main/examples/hello.zig) example is a small runnable App calling the live **test.servicestack.net** Services with typed APIs, batched Requests, structured validation errors and authenticated Requests:

:::sh
zig build example
:::

## DTO Customization Options

In most cases you'll just use the generated Zig DTOs as-is, however you can further customize how the DTOs are generated by overriding the default options.

The header in the generated DTOs show the different options Zig native types support with their defaults. To override a value, remove a `/` from its `///` prefix and specify the value to the right of the `:`. Any uncommented value will be sent to the server to override any server defaults.

```zig
/// Options:
/// Date: 2026-08-06 15:38:36
/// Version: 10.09
/// Tip: To override a DTO option, remove "/" prefix before updating
/// BaseUrl: https://blazor-vue.web-templates.io
///
/// GlobalNamespace:
/// MakePropertiesOptional: False
/// AddServiceStackTypes: True
/// AddResponseStatus: False
/// AddImplicitVersion:
/// AddDescriptionAsComments: True
/// IncludeTypes:
/// ExcludeTypes:
/// DefaultImports: const std = @import("std");
```

### AddResponseStatus

Automatically add a `responseStatus` property on all Response DTOs, regardless if it wasn't already defined:

```zig
pub const GetTechnologyResponse = struct {
    responseStatus: ?ss.ResponseStatus = null,
};
```

### IncludeTypes

Is used as a Whitelist to specify only the types you would like to have code-generated:

```
IncludeTypes: GetTechnology,GetTechnologyResponse
```

To include a Request DTO and all its dependent types, use the `.*` suffix:

```
IncludeTypes: GetTechnology.*
```

Or include all types within a [Tag Group](/api-design#group-services-by-tag) with:

```
IncludeTypes: {tag}
```

### ExcludeTypes

Is used as a Blacklist to specify which types you would like excluded from being generated:

```
ExcludeTypes: GetTechnology,GetTechnologyResponse
```

### Change Default Server Configuration

The above defaults are also overridable on the ServiceStack Server by modifying the default config on the `NativeTypesFeature` Plugin, e.g:

```csharp
//Server example in C#
var nativeTypes = this.GetPlugin<NativeTypesFeature>();
nativeTypes.MetadataTypesConfig.AddResponseStatus = true;
```

Zig specific functionality can be added by the `ZigGenerator`, e.g. to change the module generated DTOs reference:

```csharp
ZigGenerator.LibraryModule = "my_servicestack";
```

Properties of abstract Types with sub types are emitted as `std.json.Value` since Zig doesn't support sub classing, which can be disabled with:

```csharp
ZigGenerator.PolymorphicPropertiesAsAny = false;
```

### Customize DTO Type generation

Additional Zig specific customization can be statically configured like `PreTypeFilter`, `InnerTypeFilter` & `PostTypeFilter` (available in all languages) which can be used to inject custom code in the generated DTOs output, e.g:

```csharp
ZigGenerator.PreTypeFilter = (sb, type) => {
    if (type.IsEnum != true)
    {
        sb.AppendLine("// Generated DTO");
    }
};
```

There's also `PrePropertyFilter` & `PostPropertyFilter` for generating source before and after properties.

Whilst the generic `[EmitCode]` attribute lets you emit the same code in multiple languages with the same syntax.
