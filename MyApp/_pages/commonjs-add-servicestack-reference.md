---
title: ES3 Common.js Add ServiceStack Reference
---

In addition to [TypeScript](/typescript-add-servicestack-reference) support for generating typed Data Transfer Objects (DTOs), JavaScript is now supported.

Unlike TypeScript, JavaScript generated DTOs can be used directly from the browser, removing the need to keep your DTOs in sync with extra tooling by including a direct reference in your HTML Page:

```html
<script src="/types/js"></script>
```

### ES3 Common.js - Typed APIs without modules

Where [/types/mjs](/javascript-add-servicestack-reference) generates modern ES Module DTOs, **/types/js** generates
downlevel **ES3** Common.js DTOs designed for pages that can't use JavaScript Modules - legacy browsers, `file://`
pages, CMS and CRM template systems, embedded WebViews and anywhere `<script>` tags are the only option. Everything is
served by **ServiceStack.dll** itself, so a fully typed API client needs no npm, no bundler and no external CDN.

To make typed API Requests from web pages, you need only include: 

  - **/js/require.js** - containing a simple `require()` to load **CommonJS** libraries
  - **/js/servicestack-client.js** - [built-in UMD @servicestack/client](/servicestack-client-umd) in **ServiceStack.dll**
  - **/types/js** - containing your APIs typed JS DTOs - all built-in ServiceStack

After which you'll have access to the generic `JsonServiceClient` with your APIs Typed Request DTOs, e.g:

```html
<script src="/js/require.js"></script>
<script src="/js/servicestack-client.js"></script>
<script src="/types/js"></script>

<script>
var JsonServiceClient = exports.JsonServiceClient, Hello = exports.Hello

var client = new JsonServiceClient()
client.api(new Hello({ name: 'World' }))
    .then(function (api) {
        document.getElementById('result').innerHTML = api.response.result
    })
</script>    
```

Where modern browsers can use the more succinct destructuring and arrow function syntax:

```js
var { JsonServiceClient, Hello } = exports

client.api(new Hello({ name })).then(api => console.log(api.response))
```

### How it works

**/js/require.js** is a 4 line shim that creates the global `exports` and `module` objects that Common.js modules
assign their exports to:

```js
let exports = { __esModule:true }, module = { exports:exports }
function require(name) { 
    return exports[name] || window[name] 
}
```

Both **/js/servicestack-client.js** (whose UMD wrapper detects the `module` global) and **/types/js** then register
themselves on that shared `exports` object - which is why **require.js must be included first**, before the client
library and your DTOs.

Using **/types/js** has the same behavior as using `dtos.js` generated from `$ tsc dtos.ts` whose outputs are identical, i.e. both containing your API DTOs generated in CommonJS format. It's feasible to simulate the TypeScript compiler's output in this instance as ServiceStack only needs to generate DTO Types and Enums to enable its end-to-end API, and not any other of TypeScript's vast feature set.

The generated DTOs are ES3 prototype-based classes with the same partial constructor and type hint methods as their
TypeScript and ES6 counterparts, e.g. `/types/js?IncludeTypes=Hello.*` returns:

```js
var HelloResponse = /** @class */ (function () {
    function HelloResponse(init) {
        Object.assign(this, init);
    }
    return HelloResponse;
}());
exports.HelloResponse = HelloResponse;
var Hello = /** @class */ (function () {
    function Hello(init) {
        Object.assign(this, init);
    }
    Hello.prototype.getTypeName = function () { return 'Hello'; };
    Hello.prototype.getMethod = function () { return 'POST'; };
    Hello.prototype.createResponse = function () { return new HelloResponse(); };
    return Hello;
}());
exports.Hello = Hello;
```

Where `getTypeName()`, `getMethod()` and `createResponse()` are the type hints the `JsonServiceClient` uses to send
each Request to the right URL with the API's preferred HTTP Method.

### Runtime Requirements

Whilst the generated DTOs and the UMD `@servicestack/client` both use downlevel ES3/ES5 syntax, they still rely on
modern JavaScript built-ins at runtime - `fetch`, `Headers`, `Promise`, `FormData` and `Object.assign` - as does
`/js/require.js` which uses a `let` declaration. All are available in every browser released in the last decade, whilst
genuinely old browsers can add polyfills for them before including the client library:

```html
<script src="https://unpkg.com/promise-polyfill@8/dist/polyfill.min.js"></script>
<script src="https://unpkg.com/whatwg-fetch@3/dist/fetch.umd.js"></script>
<script src="/js/require.js"></script>
<script src="/js/servicestack-client.js"></script>
<script src="/types/js"></script>
```

## Calling Typed APIs

Since the same [@servicestack/client](https://www.npmjs.com/package/@servicestack/client) library is used, the entire
client feature-set documented in [TypeScript Add ServiceStack Reference](/typescript-add-servicestack-reference) is
available - the only difference is APIs are called with `.then()` callbacks instead of `async/await`, and everything is
resolved off the global `exports` object instead of `import` statements.

### The api Method

The `api` method resolves an `ApiResult` containing either the API's Response DTO in `response` or a structured API
Error in `error`, letting you handle both success and error responses in the same callback without `.catch()`:

```js
client.api(new Hello({ name: 'World' }))
    .then(function (api) {
        if (api.succeeded) {
            console.log(api.response.result)
        } else {
            console.log(api.errorCode + ': ' + api.errorMessage)
        }
    })
```

Where an `ApiResult` provides access to both its Response and any structured Error information:

| Member                     | Description                                                                    |
|----------------------------|--------------------------------------------------------------------------------|
| `response`                 | The Response DTO of a successful API Request                                    |
| `error`                    | The structured `ResponseStatus` of a failed API Request                         |
| `succeeded`                | `true` when the API returned a Response and no Error                            |
| `failed`                   | `true` when the API returned an Error                                           |
| `completed`                | `true` when the API returned either a Response or an Error                      |
| `errorCode`                | The Error's `errorCode`, e.g. `NotFound`                                        |
| `errorMessage`             | The Error's summary error message                                               |
| `errors`                   | The collection of `ResponseError` field validation errors                       |
| `fieldError(name)`         | The `ResponseError` for the specified field, if any (case-insensitive)          |
| `fieldErrorMessage(name)`  | The error message for the specified field, if any                               |
| `hasFieldError(name)`      | Whether the specified field has an error                                        |
| `showSummary(except)`      | Whether to show the summary message, excluding fields displaying their own error |
| `summaryMessage(except)`   | The summary error message to display, excluding the specified fields            |

Use `apiVoid` for APIs annotated with `IReturnVoid`, whilst both accept optional `args` for sending additional
QueryString arguments and a `method` to override the HTTP Method the Request is sent with:

```js
client.apiVoid(new DeleteContact({ id: id }))
    .then(function (api) {
        if (api.failed) console.log(api.errorMessage)
    })

client.api(new Hello({ name: name }), null, 'GET')
```

### Error Handling

Alternatively the `get`, `post`, `put`, `patch`, `delete` and `send` methods resolve the Response DTO directly and
reject with an `ErrorResponse` containing the API's structured `ResponseStatus`:

```js
client.get(new Hello({ name: 'World' }))
    .then(function (r) {
        document.getElementById('result').innerHTML = r.result
    })
    .catch(function (e) {
        console.log(e.responseStatus.errorCode, e.responseStatus.message)
        console.log(e.responseStatus.errors)    // field validation errors
    })
```

Field validation errors returned by [Declarative Validation](/declarative-validation) or FluentValidation rules can be
bound to individual inputs with the `ApiResult` field error methods:

```js
client.api(new CreateContact({ email: email }))
    .then(function (api) {
        document.getElementById('emailError').innerHTML = api.fieldErrorMessage('email') || ''
        document.getElementById('summaryError').innerHTML = api.showSummary(['email'])
            ? api.summaryMessage(['email'])
            : ''
    })
```

### Declarative Events

Pages can register all their behavior in a single `bindHandlers` call, where handlers are invoked by elements
annotated with `data-{event}={handler}` attributes - which continues working for dynamically added elements without
needing to rebind event handlers:

```html
<input type="text" data-keyup="sayHello">
<div id="result"></div>
```

```js
var bindHandlers = exports.bindHandlers

bindHandlers({
    sayHello: function (e) {
        client.api(new Hello({ name: e.target.value }))
            .then(function (api) {
                document.getElementById('result').innerHTML = api.response.result
            })
    }
})
```

Which together with `bootstrapForm` for ajaxifying HTML Forms and binding their validation errors, is covered in more
detail in [Embedded UMD @servicestack/client](/servicestack-client-umd).

### AutoQuery Requests

[AutoQuery](/autoquery/) APIs resolve a `QueryResponse` containing the `results` matching the query and the `total`
number of matching results, where filters for properties not explicitly defined on the Request DTO can be sent as
additional untyped `args`:

```js
// GET /api/FindTechnologies?take=3&orderBy=-viewCount&nameStartsWith=Am
client.api(new FindTechnologies({ take:3, orderBy:'-viewCount' }), { nameStartsWith:'Am' })
    .then(function (api) {
        console.log(api.response.total)
        console.log(api.response.results.map(function (x) { return x.name }).join(', '))
    })
```

### Uploading Files

HTML Forms can be submitted with their typed Request DTO using `apiForm`, which benefits from
[FormData's](https://developer.mozilla.org/en-US/docs/Web/API/FormData) native integration in browsers where it can be
populated directly from an HTML Form:

```js
client.apiForm(new CreateContact(), new FormData(document.forms[0]))
    .then(function (api) {
        console.log(api.succeeded)
    })
```

Where `apiFormVoid` can be used for `IReturnVoid` API Requests.

### Batched Requests

Multiple Request DTOs of the same Type can be sent together in a single Request with `sendAll` which resolves all
their Responses:

```js
var requests = ["foo","bar","baz"].map(function (name) { return new Hello({ name: name }) })

// POST /api/Hello[]
client.sendAll(requests)
    .then(function (responses) {
        console.log(responses.map(function (x) { return x.result }).join(', '))
        // Hello, foo!, Hello, bar!, Hello, baz!
    })
```

Or `sendAllOneWay` to send Requests you want to ignore the Responses of, whilst individual Requests can be sent to the
one-way endpoint with `publish`.

### Authentication

Apps using [API Keys](/auth/api-key-authprovider) or [JWT](/auth/jwt-authprovider) can populate the client's
`bearerToken`, whilst HTTP Basic Auth credentials can be set with `setCredentials`:

```js
client.bearerToken = apiKey

client.setCredentials(userName, password)
```

Whilst Apps using [Session Cookies](/auth/sessions#cookie-session-ids) can authenticate by sending a populated
`Authenticate` Request DTO, after which the Browser transparently sends its Session Cookies on subsequent Requests:

```js
client.api(new Authenticate({
    provider: 'credentials',
    userName: userName,
    password: password,
    rememberMe: true
}))
```

### Client Configuration and Filters

Custom Headers can be added to all Requests by populating the client's `headers` collection, whilst its Request,
Response, Exception and URL filters let you decorate clients with generic functionality:

```js
client.headers.set('X-Custom','Value')

client.requestFilter = function (req) { console.log(req.method, req.url) }
client.responseFilter = function (res) { console.log(res.status) }
client.exceptionFilter = function (res, error) { console.log('ERROR:', error.responseStatus.message) }
client.urlFilter = function (url) { console.log('URL:', url) }
```

By default Requests are sent to ServiceStack's [/api pre-defined route](/routing#json-api-pre-defined-route), which
older ServiceStack instances that only have the `/json/reply` routes registered can revert to with:

```js
client.basePath = null
```

### Other Utils

Everything else exported by `@servicestack/client` is available on the same `exports` object, including its URL,
String, Date and Object utils, the `Inspect` API Response visualizers, `JSV`, `StringBuffer` and its Event Bus - all
of which are documented in [TypeScript Client Utils](/typescript-add-servicestack-reference#client-utils), e.g:

```js
var Inspect = exports.Inspect, humanify = exports.humanify

client.api(new FindTechnologies({ take:10 }))
    .then(function (api) {
        Inspect.printDumpTable(api.response.results)
    })
```

## Enhanced Dev Time productivity with TypeScript

Even when no longer using TypeScript DTOs in your Apps, it's still useful to have TypeScript's `dtos.ts` included in your project (inc. Vanilla JS projects) to serve as optional type annotations enabling rich intelli-sense and static analysis in IDEs that support it, but as it's no longer used at runtime you're free to generate it at optimal times that don't interrupt your dev workflow.


## DTO Customization Options

In most cases you'll just use the generated JavaScript DTO's as-is, however you can further customize how
the DTOs are generated by overriding the default options.

The header in the generated DTOs show the different options JavaScript types support with their
defaults. Default values are shown with the comment prefix of `//`. To override a value, remove the `//`
and specify the value to the right of the `:`. Any uncommented value will be sent to the server to override
any server defaults.

The DTO comments allows for customizations for how DTOs are generated. The default options that were used
to generate the DTOs are repeated in the header comments of the generated DTOs, options that are preceded
by a TypeScript comment `//` are defaults from the server, any uncommented value will be sent to the server
to override any server defaults.

```js
/* Options:
Date: 2022-01-28 02:10:26
Version: 6.00
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://vue-static.web-templates.io

//AddServiceStackTypes: True
//AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
//DefaultImports: 
*/
```

We'll go through and cover each of the above options to see how they affect the generated DTO's:

### Change Default Server Configuration

Above defaults are also overridable on the ServiceStack Server by modifying the default config on the `NativeTypesFeature` Plugin, e.g:

```csharp
//Server example in CSharp
var nativeTypes = this.GetPlugin<NativeTypesFeature>();
nativeTypes.MetadataTypesConfig.IgnoreTypesInNamespaces = "test";
...
```

We'll go through and cover each of the above options to see how they affect the generated DTO's:

### IncludeTypes

Is used as a Whitelist to specify only the types you would like to have code-generated:

```
/* Options:
IncludeTypes: Hello, HelloResponse
```

Will only generate `Hello` and `HelloResponse` DTOs:

```js
var HelloResponse = /** @class */ (function () {
    function HelloResponse(init) {
        Object.assign(this, init);
    }
    return HelloResponse;
}());
exports.HelloResponse = HelloResponse;
var Hello = /** @class */ (function () {
    function Hello(init) {
        Object.assign(this, init);
    }
    Hello.prototype.getTypeName = function () { return 'Hello'; };
    Hello.prototype.getMethod = function () { return 'POST'; };
    Hello.prototype.createResponse = function () { return new HelloResponse(); };
    return Hello;
}());
exports.Hello = Hello;
```

#### Include Generic Types

Use .NET's Type Name to include Generic Types, i.e. the Type name separated by the backtick followed by the number of generic arguments, e.g:

```
IncludeTypes: IReturn`1,MyPair`2
```

#### Include Request DTO and its dependent types

You can include a Request DTO and all its dependent types with a `.*` suffix on the Request DTO, e.g:

```
/* Options:
IncludeTypes: GetTechnology.*
```

Which will include the `GetTechnology` Request DTO, the `GetTechnologyResponse` Response DTO and all Types that they both reference.

#### Include All Types within a C# namespace

If your DTOs are grouped into different namespaces they can be all included using the `/*` suffix, e.g:

```
/* Options:
IncludeTypes: MyApp.ServiceModel.Admin/*
```

This will include all DTOs within the `MyApp.ServiceModel.Admin` C# namespace.

#### Include All Services in a Tag Group

Services [grouped by Tag](/api-design#group-services-by-tag) can be used in the `IncludeTypes` where tags can be specified using braces in the format `{tag}` or `{tag1,tag2,tag3}`, e.g:

```
/* Options:
IncludeTypes: {web,mobile}
```

Or individually:

```
/* Options:
IncludeTypes: {web},{mobile}
```

### ExcludeTypes
Is used as a Blacklist to specify which types you would like excluded from being generated:

```
/* Options:
ExcludeTypes: GetTechnology,GetTechnologyResponse
```

Will exclude `GetTechnology` and `GetTechnologyResponse` DTOs from being generated.

### Cache

When using `/types/js` directly from a `script` tag, the server will cache the result by default when not running in [DebugMode](/debugging#debugmode).

This caching process can be disabled if required by using `?cache=false`.

