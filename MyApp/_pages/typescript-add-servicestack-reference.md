---
slug: typescript-add-servicestack-reference
title: TypeScript Add ServiceStack Reference
---

:::{.shadow .-ml-12 .w-[940px] .rounded-md}
![](/img/pages/servicestack-reference/typescript-info.webp)
:::

ServiceStack's **Add ServiceStack Reference** feature allows clients to generate Native Types from directly within VS.NET using [ServiceStackVS VS.NET Extension](/create-your-first-webservice) - providing a simple way to give clients typed access to your ServiceStack Services.

### TypeScript - The contract your web App builds against

The [@servicestack/client](https://www.npmjs.com/package/@servicestack/client) `JsonServiceClient` turns your API into part of the frontend's type system - completion for every request, response and enum, in Vue, React, Angular, Svelte, Node and Deno alike:

```ts
const api = await client.api(new Hello({ name: 'World' }))
console.log(api.response.result)
```

Because the DTOs are regenerated from the running API, a removed field or renamed enum surfaces as a **TypeScript compile error in CI** - the earliest and cheapest place for a frontend team to find out the backend changed. Includes structured `ResponseStatus` errors ready to bind to form validation, authentication, typed AutoQuery, batch and one-way requests and file uploads.

## Install

::include ref-servicestack-client.md::

### First class development experience

[TypeScript](https://www.typescriptlang.org/) has become a core part of our overall recommended solution 
for Web Apps that's integrated into all ServiceStackVS's 
[React and Aurelia Single Page App VS.NET Templates](https://github.com/ServiceStack/ServiceStackVS) 
offering a seamless development experience with access to advanced ES6 features like modules, classes 
and arrow functions whilst still being able to target most web browsers with its down-level ES5 support. 
TypeScript also goes beyond ES6 with optional Type Annotations enabling better tooling support and compiler 
type feedback than what's possible in vanilla ES6 - invaluable when scaling large JavaScript codebases.

### Ideal Typed Message-based API

The TypeScript `JsonServiceClient` available in the 
[@servicestack/client npm package](https://www.npmjs.com/package/@servicestack/client) enables the same 
productive, typed API development experience available in our other 1st-class supported client platforms. 

ServiceStack embeds additional type hints in each Request DTO in order to achieve the ideal typed, 
message-based API. You can see an example of this is below which shows how to create a C# Gist in 
[Gistlyn](https://gistlyn.com) after adding a ServiceStack Reference to `gistlyn.com` and installing the 
[@servicestack/client](https://www.npmjs.com/package/@servicestack/client) npm package: 

```ts
import { JsonApiClient } from '@servicestack/client'
import { StoreGist, GithubFile } from './dtos'

const client = JsonApiClient.create("https://gistlyn.com")

const request = new StoreGist({
    files: {
        'main.cs': new GithubFile({
            filename: 'main.cs',
            content: 'var greeting = "Hi, from TypeScript!";'
        })
    }
})

const api = await client.api(request)  // ApiResult<StoreGistResponse>
if (api.succeeded) {
    console.log(`New C# Gist was created with id: ${api.response.gist}`)
} else {
    console.log("Failed to create Gist: ", api.errorMessage)
}
```

Where `api.response` is typed to the `StoreGistResponse` DTO Type whilst `api.error` contains the structured
`ResponseStatus` of any error - letting you handle both success and error responses without any `try/catch` handling.

### Supports JavaScript only Environments

Despite generating Typed TypeScript DTOs, the generic `JsonServiceClient` and generated TypeScript DTOs can also be utilized in
JavaScript-Only development environments like [React Native](https://youtu.be/T3KTDPdovOw) or in the [Nuxt Templates](/templates/nuxt)
which doesn't use TypeScript in its build, but can be easily integrated by adding an npm script to using the 
[get-dtos](/npx-get-dtos) script to generate the DTOs and the global `typescript` npm tool to compile it into the module we want,
which in React Native projects would look like:

```json
"scripts": {
    "dtos": "cd src/shared && npx get-dtos typescript && tsc -m ES6 dtos.ts",
}
```


### @servicestack/client API

The public TypeScript Definition containing the public API for all functionality contained in any of the above `@servicestack/client` libraries is available from [index.d.ts](https://github.com/ServiceStack/servicestack-client/blob/master/src/index.d.ts). 

Here are direct links to the 2 primary API Clients:

 - [JsonServiceClient](https://github.com/ServiceStack/servicestack-client/blob/4d17350f77c6461965f3bf0a5451a4e60e35f992/src/index.d.ts#L288)
 - [ServerEventsClient](https://github.com/ServiceStack/servicestack-client/blob/4d17350f77c6461965f3bf0a5451a4e60e35f992/src/index.d.ts#L167)

### TypeScript Ambient Interface Definitions or Concrete Types

You can get both concrete types and interface definitions for your Services at the following routes:

  - [/types/typescript](https://techstacks.io/types/typescript) - for generating concrete types
  - [/types/typescript.d](https://techstacks.io/types/typescript.d) - for generating ambient interface definitions

## Simple command-line utilities for TypeScript

The cross-platform [get-dtos](/npx-get-dtos) script includes built in support for generating TypeScript references 
from the command-line, which can be run with [Node.js](https://nodejs.org) without needing to install anything:

:::sh
npx get-dtos
:::

Running it without any arguments displays the available options for adding and updating ServiceStack References.

### Adding a ServiceStack Reference

To Add a TypeScript ServiceStack Reference just call `npx get-dtos typescript` with the URL of a remote ServiceStack instance:

:::sh
`npx get-dtos typescript https://techstacks.io`
:::

Result:

```
Saved to: dtos.ts
```

Calling `npx get-dtos typescript` with just a URL will save the DTOs using the Host name, you can override this by specifying a FileName as the 2nd argument:

:::sh
`npx get-dtos typescript https://techstacks.io Tech`
:::

Result:

```
Saved to: Tech.dtos.ts
```

### Updating a ServiceStack Reference

To Update an existing ServiceStack Reference, call `npx get-dtos typescript` with the Filename:

:::sh
npx get-dtos typescript dtos.ts
:::

Result:

```
Updated: dtos.ts
```

Which will update the File with the latest TypeScript Server DTOs from [techstacks.io](https://techstacks.io). You can also customize how DTOs are generated by uncommenting the [TypeScript DTO Customization Options](/typescript-add-servicestack-reference#dto-customization-options) and updating them again.

### Updating all TypeScript DTOs

Calling `npx get-dtos typescript` without any arguments will update all TypeScript DTOs in the current directory:

:::sh
npx get-dtos typescript
:::

Result:

```
Updated: Tech.dtos.ts
Updated: dtos.ts
```

### dotnet tools

An alternative to `npx get-dtos` for .NET developers is the [x dotnet tool](/dotnet-tool) which requires the .NET SDK installed:

:::sh
dotnet tool install --global x 
:::

Where any `npx get-dtos <lang>` command can be replaced with `x <lang>`, e.g. `x typescript`.

## Add TypeScript Reference

The easiest way to 
[Add a ServiceStack Reference](/add-servicestack-reference) 
to your project is to **right-click** on a folder to bring up 
[ServiceStackVS's](/create-your-first-webservice)
VS.NET context-menu item, then click on `Add -> TypeScript Reference...`. This opens a dialog where you can 
add the url of the ServiceStack instance you want to typed DTO's for, as well as the name of the DTO source 
file that's added to your project.

![Add ServiceStack Reference](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/servicestackvs/add-typescript-reference-js.png)

After clicking OK, the servers DTO's are added to the project, yielding an instant typed API:

![TypeScript native types](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/servicestackvs/add-typescript-reference-dtos.png)


### Change Default Server Configuration

The above defaults are also overridable on the ServiceStack Server by modifying the default config on the `NativeTypesFeature` Plugin, e.g:

```csharp
var nativeTypes = this.GetPlugin<NativeTypesFeature>();
nativeTypes.MetadataTypesConfig.MakeVirtual = false;
...
```

### Customize DTO Type generation

Additional TypeScript specific customization can be statically configured like `PreTypeFilter`, `InnerTypeFilter` & `PostTypeFilter` (available in all languages) can be used to inject custom code in the generated DTOs output. 

Use the `PreTypeFilter` to generate source code before and after a Type definition, e.g. this will append the `[Validate]` attribute on non enum & interface types:

```csharp
TypeScriptGenerator.PreTypeFilter = (sb, type) => {
    if (!type.IsEnum.GetValueOrDefault() && !type.IsInterface.GetValueOrDefault())
    {
        sb.AppendLine("@Validate()");
    }
};
```

The `InnerTypeFilter` gets invoked just after the Type Definition which can be used to generate common members for all Types and interfaces, e.g:

```csharp
TypeScriptGenerator.InnerTypeFilter = (sb, type) => {
    sb.AppendLine("id:string = `${Math.random()}`.substring(2);");
};
```

There's also `PrePropertyFilter` & `PostPropertyFilter` for generating source before and after properties, e.g:

```csharp
TypeScriptGenerator.PrePropertyFilter = (sb , prop, type) => {
    if (prop.Name == "Id")
    {
        sb.AppendLine("@IsInt()");
    }
};
```

### Emit custom code

To enable greater flexibility when generating complex Typed DTOs, you can use `[Emit{Language}]` attributes to generate code before each type or property.

These attributes can be used to generate different attributes or annotations to enable client validation for different validation libraries in different languages, e.g:

```csharp
[EmitTypeScript("@Validate()")]
[EmitCode(Lang.TypeScript | Lang.Swift | Lang.Dart, "// App User")]
public class User : IReturn<User>
{
    [EmitTypeScript("@IsNotEmpty()", "@IsEmail()")]
    [EmitCode(Lang.Swift | Lang.Dart, new[]{ "@isNotEmpty()", "@isEmail()" })]
    public string Email { get; set; }
}
```

Which will generate `[EmitTypeScript]` code in TypeScript DTOs:

```typescript
@Validate()
// App User
export class User implements IReturn<User>
{
    @IsNotEmpty()
    @IsEmail()
    public email: string;

    public constructor(init?: Partial<User>) { (Object as any).assign(this, init); }
    public createResponse() { return new User(); }
    public getTypeName() { return 'User'; }
}
```

Whilst the generic `[EmitCode]` attribute lets you emit the same code in multiple languages with the same syntax.

### Update ServiceStack Reference

If your server has been updated and you want to update the client DTOs, simply **right-click** on the DTO file 
within VS.NET and select **Update ServiceStack Reference** for **ServiceStackVS** to download a fresh update. 

### TypeScript Reference Example

Lets walk through a simple example to see how we can use ServiceStack's TypeScript DTO annotations in our 
JavaScript clients. Firstly we'll need to add a TypeScript Reference to the remote ServiceStack Service by 
**right-clicking** on your project and clicking on `Add > TypeScript Reference...` 
(as seen in the above screenshot).

This will import the remote Services dtos into your local project which looks similar to:

```ts
/* Options:
Date: 2025-06-04 09:47:09
Version: 8.71
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://techstacks.io

//GlobalNamespace: 
//MakePropertiesOptional: False
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
//DefaultImports: 
*/

// @Route("/technology/{Slug}")
export class GetTechnology implements IReturn<GetTechnologyResponse>, IRegisterStats, IGet
{
    public slug: string;

    public constructor(init?: Partial<GetTechnology>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetTechnology'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new GetTechnologyResponse(); }
}

export class GetTechnologyResponse
{
    public created: string;
    public technology: Technology;
    public technologyStacks: TechnologyStack[];
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<GetTechnologyResponse>) { (Object as any).assign(this, init); }
}
```

In keeping with idiomatic style of local `.ts` sources, generated types are not wrapped within a module 
by default. This lets you reference the types you want directly using normal import destructuring syntax:

```ts
import { GetTechnology, GetTechnologyResponse } from './dtos';
```

Or import all Types into your preferred variable namespace with:

```ts
import * as dtos from './dtos';

const request = new dtos.GetTechnology();
```

Or if preferred, you can instead have the types declared in a module by specifying a `GlobalNamespace`:

```ts
/* Options:
...

GlobalNamespace: dtos
*/
```

Looking at the types we'll notice the DTO's are plain TypeScript Types with any .NET attributes 
added in comments using AtScript's proposed 
[meta-data annotations format](https://docs.google.com/document/d/11YUzC-1d0V1-Q3V0fQ7KSit97HnZoKVygDxpWzEYW0U/mobilebasic?viewopt=127). 
This lets you view helpful documentation about your DTO's like the different custom routes available 
for each Request DTO.

By default DTO properties are optional but can be made a required field by annotating the .NET property 
with the `[Required]` attribute or by uncommenting `MakePropertiesOptional: False` in the header comments 
which instead defaults to using required properties.

Properties always reflect to match the remote servers JSON Serialization configuration, 
i.e. will use **camelCase** properties when the `AppHost` is configured with:

```csharp
JsConfig.Init(new Config { TextCase = TextCase.CamelCase });
```

### Creating a Service Client

Modern **v6+** ServiceStack Apps should use `JsonApiClient.create()` to create clients configured to use the
[JSON /api pre-defined route](/routing#json-api-pre-defined-route):

```ts
import { JsonApiClient } from '@servicestack/client'

const client = JsonApiClient.create("https://example.org")
```

Which is configured to not send any JSON HTTP Headers so Browser requests can avoid the additional
[CORS preflight request](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#preflight_requests). It also accepts a
configuration lambda for customizing the client it creates:

```ts
const client = JsonApiClient.create(baseUrl, c => {
    c.bearerToken = apiKey
    c.headers.set('X-Custom','Value')
})
```

Apps hosted at the same origin as their APIs can omit the **baseUrl** to have APIs sent to the same server:

```ts
const client = JsonApiClient.create()
```

Alternatively all other Apps can use the `JsonServiceClient` constructor:

```ts
import { JsonServiceClient } from '@servicestack/client'

const client = new JsonServiceClient("https://example.org")
```

Which also defaults to sending requests to the `/api` route, that older ServiceStack instances which only have the
`/json/reply` pre-defined routes registered can revert to with:

```ts
const client = new JsonServiceClient(baseUrl).useBasePath()
```

### Making Typed API Requests

Making API Requests in TypeScript is the same as all other
[ServiceStack's Service Clients](/clients-overview)
by sending a populated Request DTO using a `JsonServiceClient` which returns typed Response DTO.

So the only things we need to make any API Request is the `JsonServiceClient` from the `@servicestack/client` 
package and any DTO's we're using from generated TypeScript ServiceStack Reference, e.g:

```ts
import { JsonServiceClient } from '@servicestack/client'
import { GetTechnology } from './dtos'

const client = new JsonServiceClient("https://techstacks.io")

const request = new GetTechnology({ slug: "ServiceStack" })

const r = await client.get(request)  // typed to GetTechnologyResponse
const tech = r.technology            // typed to Technology

console.log(`${tech.name} by ${tech.vendorName} (${tech.productUrl})`)
console.log(`${tech.name} TechStacks:`, r.technologyStacks)
```

The `get`, `post`, `put`, `patch`, `delete` and `send` methods return the Typed Response DTO directly and throw an
`ErrorResponse` on failure, whilst the `api` methods below return an `ApiResult<T>` "Value Result" which contains
either the Typed Response or a structured API Error, letting you handle both without `try/catch`.

### Partial Constructors

All TypeScript Reference DTOs also includes support for **Partial Constructors**
making them much nicer to populate using object initializer syntax we're used to in C#, so instead of:

```ts
const request = new Authenticate();
request.provider = 'credentials'
request.userName = this.userName;
request.password = this.password;
request.rememberMe = this.rememberMe;
const response = await client.post(request);
```

You can populate DTOs with object literal syntax without any loss of TypeScript's Type Safety benefits:

```ts
const response = await client.post(new Authenticate({
    provider: 'credentials',
    userName: this.userName,
    password: this.password,
    rememberMe: this.rememberMe,
}));
```

### The api Method

The `api` method returns a typed `ApiResult<TResponse>` "Value Result" that encapsulates either a Typed Response or
a structured API Error populated in its `error` `ResponseStatus`, allowing you to handle API responses
programmatically without `try/catch` handling:

```ts
const api = await client.api(new Hello({ name }))
if (api.succeeded) {
    console.log(`API Says: ${api.response.result}`)
} else {
    console.log(`${api.errorCode}: ${api.errorMessage}`)
}
```

Where an `ApiResult<T>` provides access to both its Typed Response and any structured Error information:

| Member                     | Description                                                                    |
|----------------------------|--------------------------------------------------------------------------------|
| `response`                 | The Typed Response DTO of a successful API Request                              |
| `error`                    | The structured `ResponseStatus` of a failed API Request                         |
| `succeeded`                | `true` when the API returned a Response and no Error                            |
| `failed`                   | `true` when the API returned an Error                                           |
| `completed`                | `true` when the API returned either a Response or an Error                      |
| `errorCode`                | The Error's `errorCode`, e.g. `NotFound`                                        |
| `errorMessage`             | The Error's summary error message                                               |
| `errors`                   | The collection of `ResponseError` field validation errors                       |
| `errorSummary`             | The summary error message, only when there are no field errors                  |
| `fieldError(name)`         | The `ResponseError` for the specified field, if any (case-insensitive)          |
| `fieldErrorMessage(name)`  | The error message for the specified field, if any                               |
| `hasFieldError(name)`      | Whether the specified field has an error                                        |
| `showSummary(except)`      | Whether to show the summary message, excluding fields displaying their own error |
| `summaryMessage(except)`   | The summary error message to display, excluding the specified fields            |
| `addFieldError(name,msg)`  | Add or update a field error on the result's existing `error`                    |

APIs annotated with `IReturnVoid` should use `apiVoid` which returns an `ApiResult<EmptyResponse>`:

```ts
const api = await client.apiVoid(new DeleteContact({ id }))
if (api.failed) console.log(api.errorMessage)
```

Both accept optional `args` for sending additional QueryString arguments and a `method` to override the HTTP Method
the Request is sent with, e.g:

```ts
const api = await client.apiVoid(new HelloReturnVoid({ id:1 }), null, 'GET')
```

### Simplified API Handling

Being able to treat errors as values greatly increases the ability to programmatically handle and genericize API
handling, simplifying functionality needing to handle both successful and error responses like binding to UI
components.

An example of this is below where we're able to concurrently fire off multiple unrelated async requests in parallel,
wait for them all to complete, print out the ones that have succeeded or failed then access their strong typed
responses:

```ts
import { JsonServiceClient, ApiRequest, ApiResponse } from '@servicestack/client'

const client = new JsonServiceClient("https://techstacks.io")

let requests:ApiRequest[] = [
    new AppOverview(),            // GET  => AppOverviewResponse
    new DeleteTechnology(),       // DELETE => IReturnVoid (requires auth)
    new GetAllTechnologies(),     // GET  => GetAllTechnologiesResponse
    new GetAllTechnologyStacks(), // GET  => GetAllTechnologyStacksResponse
]

let results = await Promise.all(requests.map(async (request) =>
    ({ request, api: await client.api(request) as ApiResponse }) ))

let failed = results.filter(x => x.api.failed)
console.log(`${failed.length} failed:`)
failed.forEach(x =>
    console.log(`    ${x.request.getTypeName()} Request Failed: ${x.api.errorMessage}`))

let succeeded = results.filter(x => x.api.succeeded)
console.log(`\n${succeeded.length} succeeded: ${succeeded.map(x => x.request.getTypeName()).join(', ')}`)

let r = succeeded.find(x => x.request.getTypeName() == 'AppOverview')?.api.response as AppOverviewResponse
if (r) console.log(`Top 5 Technologies: ${r.topTechnologies.slice(0,5).map(tech => tech.name).join(', ')}`)
```

Output:

```
1 failed:
    DeleteTechnology Request Failed: Unauthorized

3 succeeded: AppOverview, GetAllTechnologies, GetAllTechnologyStacks
Top 5 Technologies: Redis, MySQL, Python, PostgreSQL, node.js
```

Being able to treat Errors as values has dramatically reduced the effort required to accomplish the same feat if
needing to handle errors with `try/catch`.

### Binding Validation Errors to UI

APIs with [Declarative Validation](/declarative-validation) or FluentValidation rules return each field validation
error in `errors`, with the first error also captured in the summary `errorCode` and `errorMessage`:

```ts
const api = await client.api(new ThrowValidation({ email:'invalidemail' }))

console.log(api.errorCode)     // InclusiveBetween
console.log(api.errorMessage)  // 'Age' must be between 1 and 120. You entered 0.

api.errors.forEach(x => console.log(`${x.fieldName}: ${x.errorCode} ${x.message}`))
// Age: InclusiveBetween 'Age' must be between 1 and 120. You entered 0.
// Required: NotEmpty 'Required' must not be empty.
// Email: Email 'Email' is not a valid email address.
```

Which UI components can bind to individual field errors with `fieldError()` and `hasFieldError()`, e.g:

```ts
if (api.hasFieldError('email')) {
    emailError.textContent = api.fieldErrorMessage('email')
}
```

Whilst `showSummary()` and `summaryMessage()` let you display the summary error message for any errors that aren't
already being displayed next to their field inputs:

```ts
const displayedFields = ['email','age']
if (api.showSummary(displayedFields)) {
    summaryError.textContent = api.summaryMessage(displayedFields)
}
```

Client-side validation errors can be surfaced through the same UI components by creating an `ApiResult` populated
with `createErrorStatus()` for summary errors or `createFieldError()` for field validation errors:

```ts
import { ApiResult, createErrorStatus, createFieldError } from '@servicestack/client'

const failed = new ApiResult({ error: createErrorStatus("Not Authorized", "Unauthorized") })
failed.errorCode     // Unauthorized
failed.errorMessage  // Not Authorized

const invalid = new ApiResult({ error: createFieldError('confirmPassword', 'Passwords do not match') })
invalid.fieldErrorMessage('confirmPassword')  // Passwords do not match
```

Where `addFieldError()` can add additional field errors to an `ApiResult` that already has a populated `errors`
collection.

### Sending additional arguments with Typed API Requests

Many AutoQuery Services utilize [implicit conventions](/autoquery/rdbms#implicit-conventions) to 
query fields that aren't explicitly defined on AutoQuery Request DTOs, these can be queried by specifying
additional arguments with the typed Request DTO, e.g:

```ts
const request = new FindTechStacks();

var r = client.get(request, { VendorName: "ServiceStack" }); // typed to QueryResponse<TechnologyStack>
```

### AutoQuery Requests

[AutoQuery](/autoquery/) APIs return a typed `QueryResponse<T>` containing the `results` matching the query, the
`total` number of matching results and any `meta` data returned:

```ts
const api = await client.api(new FindTechnologies({ take:3 }), { VendorName: "Amazon" })

const r = api.response  // typed to QueryResponse<Technology>
console.log(r.total)    // 20
console.log(r.results.map(x => x.name).join(', '))
// Amazon EC2, AWS RDS, Amazon DynamoDB
```

Where all [AutoQuery filters](/autoquery/rdbms#implicit-conventions) can be sent in the typed Request DTO for
explicitly defined properties, or in the untyped `args` for querying any other field, e.g:

```ts
// GET /api/FindTechnologies?take=3&orderBy=-viewCount&nameStartsWith=Am
const api = await client.api(new FindTechnologies({ take:3, orderBy:'-viewCount' }), {
    nameStartsWith: 'Am'
})
```

### Resolving the HTTP Method

Request DTOs annotated with a `IVerb` interface marker (i.e. `IGet`, `IPost`, `IPut`, `IPatch`, `IDelete`) generate a
`getMethod()` method on the DTO which `api()` uses to send the Request with the API's preferred HTTP Method,
defaulting to `POST` when unspecified:

```ts
import { getMethod } from '@servicestack/client'

getMethod(new Hello())          // POST  (no IVerb marker)
getMethod(new GetTechnology())  // GET   (implements IGet)
getMethod(new Hello(), 'GET')   // GET   (explicit override)
```

Which can be overridden by passing an explicit `method` to `api()`, or by calling the HTTP Method's client method
directly:

```ts
const api = await client.api(new Hello({ name }), null, 'GET')

const response = await client.get(new Hello({ name }))
```

### Making API Requests with URLs

In addition to making Typed API Requests you can also call Services using relative or absolute urls, e.g:

```ts
client.get<GetTechnologyResponse>("/technology/ServiceStack")

client.get<GetTechnologyResponse>("https://techstacks.io/technology/ServiceStack")

// https://techstacks.io/technology?Slug=ServiceStack
client.get<GetTechnologyResponse>("/technology", { Slug: "ServiceStack" }) 
```

as well as POST Request DTOs to custom urls:

```ts
client.postToUrl("/custom-path", request, { Slug: "ServiceStack" });

client.putToUrl("http://example.org/custom-path", request);
```

### Uploading Files 

We can populate custom requests by either programmatically constructing the 
[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) object, which also benefits from native integration
in browsers where it can be populated directly from an HTML Form:

```ts
let client = new JsonServiceClient(BaseUrl)
let formData = new FormData(document.forms[0])
let api = await client.apiForm(new MultipartRequest(), formData)
```

Where `apiForm` can be used to submit `FormData` requests for normal API Requests, or `apiFormVoid` for `IReturnVoid` API requests.

### TypeScript Speech to Text

Here's an example calling [AI Server's](/ai-server/) `SpeechToText` API:

```js
// Create FormData and append the file
const formData = new FormData()
const audioFile = fs.readFileSync('audio.wav')
const blob = new Blob([audioFile], { type: 'audio/wav' })

// Explicitly set the field name as 'audio'
formData.append('audio', blob, 'audio.wav')

const api = await client.apiForm(new SpeechToText(), formData)
```

### Raw Data Responses

The `JsonServiceClient` also supports Raw Data responses like `string` and `byte[]` which also get a Typed API 
once declared on Request DTOs using the `IReturn<T>` marker:

```csharp
public class ReturnString : IReturn<string> {}
public class ReturnBytes : IReturn<byte[]> {}
```

Which can then be accessed as normal, with their Response typed to a JavaScript `string` or `Uint8Array` for 
raw `byte[]` responses:

```ts
let str:string = await client.get(new ReturnString());

let data:Uint8Array = await client.get(new ReturnBytes());
```

### Batched Requests

Multiple Request DTOs of the same Type can be sent together in a single Request with `sendAll` which returns all
their Responses:

```ts
const requests = ["foo","bar","baz"].map(name => new Hello({ name }))

// POST /api/Hello[]
const responses = await client.sendAll(requests)

console.log(responses.map(x => x.result).join(', '))
// Hello, foo!, Hello, bar!, Hello, baz!
```

Or use `sendAllOneWay` to send Requests you want to ignore the Responses of:

```ts
const requests = [1,2,3].map(id => new HelloReturnVoid({ id }))

// POST /api/HelloReturnVoid[]
await client.sendAllOneWay(requests)
```

All Requests in a batch are sent to the same `/api/{Request}[]` endpoint (or `/json/reply/{Request}[]` and
`/json/oneway/{Request}[]` when the client is configured with `useBasePath()`) where the Server executes them in order
and returns the number of Requests it completed in the `X-AutoBatch-Completed` HTTP Response Header:

```ts
client.responseFilter = res => console.log(res.headers.get('X-AutoBatch-Completed'))  // 3
```

### One-way Requests

APIs whose Responses you're not interested in can be sent to the one-way endpoint with `publish` for `IReturnVoid`
APIs or `sendOneWay` for APIs returning a Response, e.g:

```ts
await client.publish(new HelloReturnVoid({ id:1 }))

await client.sendOneWay(new Hello({ name:'World' }))
```

### Sending Raw Request Bodies

APIs that accept a custom Request Body can be sent with `postBody`, `putBody` and `patchBody` where the Request DTO's
properties are sent in the QueryString and the `body` is sent as the HTTP Request Body:

```ts
// POST /api/SendJson?id=1&name=name {"foo":"bar"}
const json = await client.postBody(new SendJson({ id:1, name:"name" }), { foo:"bar" })

// POST /api/SendText?id=1&name=name foo
const text = await client.postBody(new SendText({ id:1, name:"name", contentType:"text/plain" }), "foo")
```

Where an object body is serialized to JSON whilst a `string` body is sent as-is.

### Error Handling

The `api` methods return any structured error information in its `ApiResult` `error` `ResponseStatus` which is
populated for both Application Errors and transport errors like `401 Unauthorized` responses:

```ts
const api = await client.api(new ThrowType({ type:"NotFound", message:"not here" }))

console.log(api.failed)        // true
console.log(api.errorCode)     // NotFound
console.log(api.errorMessage)  // not here
```

Whilst the `get/post/put/patch/delete/send` methods instead throw an `ErrorResponse` containing the API's structured
`ResponseStatus` in its `responseStatus` property:

```ts
try {
    await client.post(new ThrowType({ type:"NotFound", message:"not here" }))
} catch (e) {
    console.log(e.responseStatus.errorCode)  // NotFound
    console.log(e.responseStatus.message)    // not here
    console.log(e.responseStatus.errors)     // field validation errors
}
```

Which can be more conveniently accessed with `getResponseStatus()` that returns a normalized `ResponseStatus` from
an Error Response DTO, a bare `ResponseStatus` or a JavaScript `Error`:

```ts
import { getResponseStatus } from '@servicestack/client'

const status = getResponseStatus(e)
```

Failed Requests using a [Refresh Token](/auth/jwt-authprovider#refresh-tokens) that was invalid or expired throw an
`ErrorResponse` with its `type` set to `RefreshTokenException`:

```ts
client.refreshToken = "Invalid.Refresh.Token"
try {
    await client.get(new Secured())
} catch (e) {
    console.log(e.type)                      // RefreshTokenException
    console.log(e.responseStatus.errorCode)  // ArgumentException
    console.log(e.responseStatus.message)    // Illegal base64url string!
}
```

Use the `exceptionFilter` to inspect all Error Responses, useful for logging or generically handling API errors:

```ts
client.exceptionFilter = (res, error) => {
    console.log(`${res.status}: ${error.responseStatus.message}`)
}
```

### Access Request / Response Headers

You can use the [JsonServiceClient](https://github.com/ServiceStack/servicestack-client/blob/master/src/index.d.ts)
instance `requestFilter` and `responseFilter` to inspect the underlying W3C
[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API's
[Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) and
[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) objects, e.g. to send a custom Request Header
and read a custom Response Header:

```ts
const client = new JsonServiceClient(baseUrl)
client.requestFilter = req => req.headers.set('X-Custom','Value')
client.responseFilter = res => console.log(res.headers.get('X-Args'))

const response = await client.get(new MyRequest())
```

Where `requestFilter` is passed an `IRequestInit` which extends fetch's `RequestInit` with the `url` the Request will
be sent to:

```ts
export interface IRequestInit extends RequestInit {
    url?: string;
    compress?: boolean;
}
```

### Request, Response and Exception Filters

Clients can be decorated with generic functionality using instance and static Request, Response and Exception filters,
useful for logging, adding headers or inspecting Responses:

```ts
// Instance filters only apply to this client
client.requestFilter = req => req.headers.set('X-Custom','Value')
client.responseFilter = res => console.log(res.status, res.headers)
client.exceptionFilter = (res,error) => console.log('ERROR:', error.responseStatus.message)
client.urlFilter = url => console.log('URL:', url)

// Static filters apply to all clients
JsonServiceClient.globalRequestFilter = req => console.log(`${req.method} ${req.url}`)
JsonServiceClient.globalResponseFilter = res => console.log(res.status)
```

Request Filters can modify the Request's URL, HTTP Method, Headers and Body before it's sent, e.g. this appends a
[JS Config](/customize-json-responses) QueryString to every Request:

```ts
client.requestFilter = req => req.url += "?jsconfig=EmitCamelCaseNames:false"
```

Instance filters are invoked before their global counterparts. The `urlFilter` is invoked with the absolute URL of
each Request which is useful for logging or inspecting the URLs your typed API Requests are sent to:

```ts
client.urlFilter = url => console.log(url)

await client.sendAll(["foo","bar","baz"].map(name => new Hello({ name })))
// https://test.servicestack.net/api/Hello[]
```

### Client Configuration

The `JsonServiceClient` sends Requests to ServiceStack's pre-defined `/api` route, which can be changed with
`basePath` or `useBasePath()`:

```ts
const client = new JsonServiceClient("https://test.servicestack.net")
client.replyBaseUrl   // https://test.servicestack.net/api/
client.oneWayBaseUrl  // https://test.servicestack.net/api/

client.basePath = null
client.replyBaseUrl   // https://test.servicestack.net/json/reply/
client.oneWayBaseUrl  // https://test.servicestack.net/json/oneway/
```

Use `apply()` to configure a client inline as it's created:

```ts
const client = new JsonServiceClient(baseUrl)
    .apply(c => {
        c.basePath = '/api'
        c.headers = new Headers()
        c.bearerToken = apiKey
    })
```

Custom Headers can be added to all Requests by populating its `headers`
[Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) collection:

```ts
client.headers.set('X-Custom','Value')
```

Other client properties available for customizing how Requests are sent:

| Property                 | Description                                                                                 |
|--------------------------|---------------------------------------------------------------------------------------------|
| `baseUrl`                | The Base URL Requests are sent to                                                            |
| `basePath`               | The path APIs are sent to, e.g. `api` (default), `null` uses `/json/reply` & `/json/oneway`  |
| `headers`                | HTTP Headers sent with each Request                                                          |
| `mode`                   | The fetch [Request Mode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode), e.g. `cors` |
| `credentials`            | The fetch [credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials) policy, e.g. `include` |
| `userName` / `password`  | Credentials to send with HTTP Basic Auth                                                     |
| `bearerToken`            | JWT or API Key to send in the `Authorization: Bearer` HTTP Header                             |
| `refreshToken`           | Refresh Token used to automatically fetch new JWT Access Tokens                              |
| `refreshTokenUri`        | Alternate URL to send Refresh Token Requests to                                              |
| `enableAutoRefreshToken` | Whether to automatically fetch new Access Tokens (default `true`)                            |
| `manageCookies`          | Whether the client should manage Cookies itself (default in Node.js)                          |
| `cookies`                | The Cookies the client is managing, keyed by Cookie name                                     |
| `parseJson`              | Override how JSON Responses are parsed                                                        |

In Node.js (where there's no browser Cookie jar) the client manages the Cookies the Server returns itself in its
`cookies` collection which are sent on subsequent Requests - so use a separate client instance for each Authenticated
Session you want to maintain. Individual cookies can be removed with:

```ts
client.deleteCookie('ss-pid')
```

### TypeScript Nullable properties

The default TypeScript generated for a C# DTO like:

```csharp
public class Data
{
    [Required]
    public int Value { get; set; }
    public int? OptionalValue { get; set; }
    public string Text { get; set; }
}
```

Will render the DTO with optional properties:

```csharp
export class Data
{
    // @Required()
    public value: number;

    public optionalValue?: number;
    public text?: string;

    public constructor(init?: Partial<Data>) { (Object as any).assign(this, init); }
}
```

This behavior can be changed to emit nullable properties instead with:

```csharp
TypeScriptGenerator.UseNullableProperties = true;
```

Where it will instead emit nullable properties:

```ts
export class Data
{
    public value: number|null;
    public optionalValue: number|null;
    public text: string|null;

    public constructor(init?: Partial<Data>) { (Object as any).assign(this, init); }
}
```

If finer-grained customization is needed to control which type and property should be nullable, you can 
use the customizable `TypeScriptGenerator` filters (which `UseNullableProperties` defaults to):

```csharp
TypeScriptGenerator.IsPropertyOptional = (generator, type, prop) => false;

TypeScriptGenerator.PropertyTypeFilter = (gen, type, prop) => 
    gen.GetPropertyType(prop, out var isNullable) + "|null";
```

### Authenticating using Basic Auth

Basic Auth support is implemented in `JsonServiceClient` and follows the same API made available in the C# 
Service Clients where the `userName/password` properties can be set individually, e.g:

```ts
var client = new JsonServiceClient(baseUrl);
client.userName = user;
client.password = pass;

const response = await client.get(new SecureRequest());
```

Or use `client.setCredentials()` to have them set both together:

```ts
client.setCredentials(user, pass);
```

### Authenticating using Credentials

Alternatively you can authenticate using userName/password credentials by 
[adding a TypeScript Reference](/typescript-add-servicestack-reference#add-typescript-reference) 
to your remote ServiceStack Instance and sending a populated `Authenticate` Request DTO, e.g:

```ts
let request = new Authenticate();
request.provider = "credentials";
request.userName = userName;
request.password = password;
request.rememberMe = true;

const response = await client.post(request);
```

This will populate the `JsonServiceClient` with 
[Session Cookies](/auth/sessions#cookie-session-ids) 
which will transparently be sent on subsequent requests to make authenticated requests.

### Authenticating using JWT

Use the `bearerToken` property to Authenticate with a [ServiceStack JWT Provider](/auth/jwt-authprovider) using a JWT Token:

```ts
client.bearerToken = jwtToken;
```

Alternatively you can use a [Refresh Token](/auth/jwt-authprovider#refresh-tokens) instead:

```ts
client.refreshToken = refreshToken;
```

### Authenticating using an API Key

Use the `bearerToken` property to Authenticate with an [API Key](/auth/api-key-authprovider):

```ts
client.bearerToken = apiKey;
```

### Transparently handle 401 Unauthorized Responses

If the server returns a 401 Unauthorized Response either because the client was Unauthenticated or the 
configured Bearer Token or API Key used had expired or was invalidated, you can use `onAuthenticationRequired`
callback to re-configure the client before automatically retrying the original request, e.g:

```ts
client.onAuthenticationRequired = async () => {
    const authClient = new JsonServiceClient(authBaseUrl);
    authClient.userName = userName;
    authClient.password = password;
    const response = await authClient.get(new Authenticate());
    client.bearerToken = response.bearerToken;
};

//Automatically retries requests returning 401 Responses with new bearerToken
var response = await client.get(new Secured());
```

### Automatically refresh Access Tokens

With the [Refresh Token support in JWT](/auth/jwt-authprovider#refresh-tokens) 
you can use the `refreshToken` property to instruct the Service Client to automatically fetch new 
JWT Tokens behind the scenes before automatically retrying failed requests due to invalid or expired JWTs, e.g:

```ts
//Authenticate to get new Refresh Token
const authClient = new JsonServiceClient(authBaseUrl);
authClient.userName = userName;
authClient.password = password;
const authResponse = await authClient.get(new Authenticate());

//Configure client with RefreshToken
client.refreshToken = authResponse.RefreshToken;

//Call authenticated Services and clients will automatically retrieve new JWT Tokens as needed
const response = await client.get(new Secured());
```

Use the `refreshTokenUri` property when refresh tokens need to be sent to a different ServiceStack Server, e.g:

```ts
client.refreshToken = refreshToken;
client.refreshTokenUri = authBaseUrl + "/access-token";
```

When authenticating against Apps using [JWT Token Cookies](/auth/jwt-authprovider#json-web-tokens) the client
automatically switches to using its `ss-tok` and `ss-reftok` Cookies to fetch new Access Tokens, which is reflected in
its `useTokenCookie` property:

```ts
const authResponse = await client.post(new Authenticate({
    provider:"credentials", userName, password }))

client.useTokenCookie // true
```

Automatically fetching new Access Tokens can be disabled with:

```ts
client.enableAutoRefreshToken = false
```

### Complex Type Support

Generated DTOs support the full breadth of .NET Types used in ServiceStack APIs, including nested POCOs, Lists,
Arrays, Dictionaries and Dictionaries of Lists of POCOs which are all serialized into their equivalent JavaScript
types:

```ts
const request = new HelloAllTypes({
    name: "name",
    allTypes: new AllTypes({
        id: 1,
        int: 4,
        double: 2.2,
        string: "string",
        dateTime: toDateTime(new Date(Date.UTC(2001,0,1))),
        timeSpan: "PT1H",
        guid: "ea762009b66c410b9bf5ce21ad519249",
        stringList: ["A", "B", "C"],
        stringArray: ["D", "E", "F"],
        stringMap: { A:"D", B:"E", C:"F" },
        intStringMap: { 1:"A", 2:"B", 3:"C" },
        subType: new SubType({ id:1, name:"name" }),
    }),
    allCollectionTypes: new AllCollectionTypes({
        intArray: [1,2,3],
        intList: [4,5,6],
        byteArray: toBase64String("ABC"),
        pocoArray: [new Poco({ name:"pocoArray" })],
        pocoLookup: { A: [new Poco({ name:"B" }), new Poco({ name:"C" })] },
        pocoLookupMap: { A: [{ B: new Poco({ name:"C" }), D: new Poco({ name:"E" }) }] },
    })
})

const api = await client.api(request)
```

### Serialization Utils

.NET Types without a native JavaScript equivalent are serialized as strings which can be converted to and from their
JavaScript types using the built-in conversion functions:

```ts
import {
    toDateTime, fromDateTime,
    toTimeSpan, fromTimeSpan,
    toGuid, fromGuid,
    toByteArray, fromByteArray,
    toBase64String,
} from '@servicestack/client'
```

| .NET Type          | Serialized as                             | Convert with                    |
|--------------------|-------------------------------------------|---------------------------------|
| `DateTime`         | WCF JSON Date, e.g. `/Date(978307200000)/`| `toDateTime()` / `fromDateTime()` |
| `DateTimeOffset`   | WCF JSON Date                              | `toDateTime()` / `fromDateTime()` |
| `TimeSpan`         | XSD Duration, e.g. `PT1H`                  | `toTimeSpan()` / `fromTimeSpan()` |
| `Guid`             | String, e.g. `ea762009b66c410b9bf5ce21ad519249` | `toGuid()` / `fromGuid()`  |
| `byte[]`           | Base64 String                              | `toByteArray()` / `fromByteArray()` |

E.g. converting a JS `Date` to a .NET `DateTime` and back:

```ts
const dateTime = toDateTime(new Date(Date.UTC(2001,0,1)))  // /Date(978307200000)/
const date = fromDateTime(dateTime)                        // Date
```

Whilst `toDate()` can parse a .NET `DateTime` from any of its serialized formats:

```ts
import { toDate, dateFmt, toLocalISOString } from '@servicestack/client'

toDate('/Date(978307200000)/')
toDate('2001-01-01T00:00:00.0000000Z')

dateFmt(new Date(Date.UTC(2001,0,1)))  // 2001/01/01
toLocalISOString(new Date())           // ISO 8601 date in local time
```

### Node.js and Deno

As `fetch` is built into Node.js v18+ LTS, `@servicestack/client` **v2+** is dependency-free and can be used as-is in
Node.js, Deno, Bun and Browser Apps. Node.js projects using
[ServerEventsClient](/typescript-server-events-client) (e.g. in tests) will need to polyfill `EventSource`:

:::sh
npm install eventsource
:::

```ts
globalThis.EventSource = require("eventsource")
```

Older Node.js runtimes can continue using the **v1.x** version of `@servicestack/client` or polyfill `fetch` with
[cross-fetch](https://www.npmjs.com/package/cross-fetch):

:::sh
npm install cross-fetch
:::

```js
require('cross-fetch/polyfill')
```

## DTO Customization Options 

In most cases you'll just use the generated TypeScript DTO's as-is, however you can further customize how
the DTO's are generated by overriding the default options.

The header in the generated DTO's show the different options TypeScript native types support with their 
defaults. Default values are shown with the comment prefix of `//`. To override a value, remove the `//` 
and specify the value to the right of the `:`. Any uncommented value will be sent to the server to override 
any server defaults.

The DTO comments allows for customizations for how DTOs are generated. The default options that were used 
to generate the DTO's are repeated in the header comments of the generated DTOs, options that are preceded 
by a TypeScript comment `//` are defaults from the server, any uncommented value will be sent to the server 
to override any server defaults.

```ts
/* Options:
Date: 2018-05-01 08:09:43
Version: 5.10
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://techstacks.io

//GlobalNamespace: 
//MakePropertiesOptional: True
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
//DefaultImports: 
*/
```

We'll go through and cover each of the above options to see how they affect the generated DTO's:

### Change Default Server Configuration

The above defaults are also overridable on the ServiceStack Server by modifying the default config on the 
`NativeTypesFeature` Plugin, e.g:

```csharp
//Server example in CSharp
var nativeTypes = this.GetPlugin<NativeTypesFeature>();
nativeTypes.MetadataTypesConfig.GlobalNamespace = "dtos";
...
```

We'll go through and cover each of the above options to see how they affect the generated DTO's:

### GlobalNamespace

Changes the name of the module that contain the generated TypeScript definitions:

```ts
declare module dtos
{
    ...
}
```

### ExportAsTypes

Changes whether types should be generated as ambient interface definitions or exported as concrete Types:

```ts
module dtos
{
    export interface IReturnVoid
    {
    }
    ...
}
```

### MakePropertiesOptional

Changes whether the default of whether each property is optional or not:

```ts
interface Answer
{
    AnswerId: number;
    Owner: User;
    IsAccepted: boolean;
    Score: number;
    LastActivityDate: number;
    LastEditDate: number;
    CreationDate: number;
    QuestionId: number;
}
```

### AddResponseStatus

Automatically add a `ResponseStatus` property on all Response DTO's, regardless if it wasn't already defined:

```ts
interface GetAnswers extends IReturn<GetAnswersResponse>
{
    ...
    ResponseStatus: ResponseStatus;
}
```

### AddImplicitVersion

Lets you specify the Version number to be automatically populated in all Request DTO's sent from the client: 

```ts
interface GetAnswers extends IReturn<GetAnswersResponse>
{
    Version: number; //1
    ...
}
```

This lets you know what Version of the Service Contract that existing clients are using making it easy 
to implement ServiceStack's [recommended versioning strategy](http://stackoverflow.com/a/12413091/85785). 

### IncludeTypes

Is used as a Whitelist to specify only the types you would like to have code-generated:

```
/* Options:
IncludeTypes: GetTechnology,GetTechnologyResponse
```

Will only generate `GetTechnology` and `GetTechnologyResponse` DTO's:

```csharp
export class class GetTechnology { ... }
export class class GetTechnologyResponse { ... }
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

### DefaultImports

The `Symbol:module` short-hand syntax can be used for specifying additional imports in your generated TypeScript DTOs, e.g:

```ts
/* Options:
...
DefaultImports: Symbol:module,Zip:./ZipValidator
*/
```

Which will generate the popular import form of:

```ts
import { Symbol } from "module";
import { Zip } from "./ZipValidator";
```

## React Native JsonServiceClient

React Native Android JavaScript Example using VS Code:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="T3KTDPdovOw" style="background-image: url('https://img.youtube.com/vi/T3KTDPdovOw/maxresdefault.jpg')"></lite-youtube>

## TypeScript Interface Definitions

By checking **Only TypeScript Definitions** check-box on the dialog when Adding a TypeScript Reference
you can instead import Types as a
[TypeScript declaration file](http://www.typescriptlang.org/Handbook#writing-dts-files) (.d.ts).

TypeScript declarations are just pure static type annotations, i.e. they don't generate any code or 
otherwise have any effect on runtime behavior. This makes them useful as a non-invasive drop-in into 
existing JavaScript code where it's just used to provide type annotations on existing JavaScript objects, 
letting you continue using your existing data types and ajax libraries.

### Referencing TypeScript DTO's

Once added to your project, use VS.NET's JavaScript doc comments to reference the TypeScript definitions 
in your `.ts` scripts. The example below shows how to use the above TypeScript definitions to create a 
typed Request/Response utilizing jQuery's Ajax API to fire off a new Ajax request on every keystroke:

```xml
/// <reference path="dtos.d.ts"/>
...

<input type="text" id="txtHello" data-keyup="sayHello" /> 
<div id="result"></div>

<script>
bindHandlers({
    sayHello: function () {
        var request: dtos.Hello = {};
        request.title = "Dr";
        request.name = this.value;
        
        $.getJSON(createUrl("/hello/{Name}", request), request, 
            function (r: HelloResponse) {
                $("#result").html(r.result);
            });
    }
});
</script>
```

Here we're using the built-in `createUrl()` servicestack client API to create the url for the **GET** HTTP Request 
using the Route definition for the API you want to call and the Request DTO which results in:

```
hello/World?title=Dr
```

We're also able to use the `HelloResponse` type definition to take advantage of typed DTO compile time safety in TypeScript code bases.

### Angular HTTP Client

Likewise you can use `createUrl()` to utilize Angular's built-in Rx-enabled HTTP Client with ServiceStack’s ambient TypeScript declarations when utilizing Angular's built-in dependencies is preferable.

ServiceStack’s ambient TypeScript interfaces are leveraged to enable a Typed that lets you reuse your APIs Route definitions (emitted in comments above each Request DTO) to provide a pleasant UX for making API calls using Angular's HTTP Client:

```ts
import { createUrl } from '@servicestack/client';
...

this.http.get<HelloResponse>(createUrl('/hello/{Name}', { name })).subscribe(r => {
    this.result = r.result;
});
```

### ss-utils.js 

Likewise if using [ss-utils.js](/ss-utils-js) you can use the `$.ss.createUrl()` API for the same functionality, e.g:

```js
$(document).bindHandlers({
    sayHello: function () {
        var request: dtos.Hello = {};
        request.title = "Dr";
        request.name = this.value;
        
        $.getJSON($.ss.createUrl("/hello/{Name}", request), request, 
            function (r: dtos.HelloResponse) {
                $("#result").html(r.result);
            });
    }
});
```

Which results in a HTTP GET request with the expected Url:

```
/hello/World?title=Dr
```

### [ServerEvents Client](/typescript-server-events-client)

The [TypeScript ServerEventClient](/typescript-server-events-client) is an idiomatic port of ServiceStack's 
[C# Server Events Client](/csharp-server-events-client) in native TypeScript providing a productive 
client to consume ServiceStack's [real-time Server Events](/server-events) that can be used in both 
TypeScript Web and node.js server applications.

```ts
const channels = ["home"];
const client = new ServerEventsClient("/", channels, {
    handlers: {
        onConnect: (sub:ServerEventConnect) => {  // Successful SSE connection
            console.log("You've connected! welcome " + sub.displayName);
        },
        onJoin: (msg:ServerEventJoin) => {        // User has joined subscribed channel
            console.log("Welcome, " + msg.displayName);
        },
        onLeave: (msg:ServerEventLeave) => {      // User has left subscribed channel
            console.log(user.displayName + " has left the building");
        },
        onUpdate: (msg:ServerEventUpdate) => {    // User's subscribed channels have changed
            console.log(user.displayName + " channels subscription were updated");
        },        
        onMessage: (msg:ServerEventMessage) => {} // Invoked for each other message
        //... Register custom handlers
        CustomMessage: (msg:CustomMessage) = {}   // Handle CustomMessage Request DTO
    },
    receivers: { 
        //... Register any receivers
        tv: {
            watch: function (id) {                 // Handle 'tv.watch {url}' messages 
                var el = document.querySelector("#tv");
                if (id.indexOf('youtu.be') >= 0) {
                    var v = splitOnLast(id, '/')[1];
                    el.innerHTML = templates.youtube.replace("{id}", v);
                } else {
                    el.innerHTML = templates.generic.replace("{id}", id);
                }
                el.style.display = 'block'; 
            },
            off: function () {                     // Hanndle 'tv.off' messages
                var el = document.querySelector("#tv");
                el.style.display = 'none';
                el.innerHTML = '';
            }
        }
    }
}).start();
```

When publishing a DTO Type for your Server Events message, your clients will be able to benefit from 
the generated DTOs in [TypeScript ServiceStack References](/typescript-add-servicestack-reference).

## Client Utils

In addition to its API Clients, `@servicestack/client` is a dependency-free library of utils useful in any TypeScript
or JavaScript App, all of which are documented in its
[index.d.ts](https://github.com/ServiceStack/servicestack-client/blob/master/src/index.d.ts) TypeScript definition.

### Inspect Utils

To help with inspecting API Responses the `Inspect` class includes utils for quickly visualizing API outputs.

For a basic indented object graph use `Inspect.dump()` to capture and `Inspect.printDump()` to print the output of any
API Response, e.g:

```ts
import { Inspect } from '@servicestack/client'

const orgName = "nodejs"
const orgRepos = (await (await fetch(`https://api.github.com/orgs/${orgName}/repos`)).json())
    .map(x => ({
        name: x.name,
        description: x.description,
        lang: x.language,
        watchers: x.watchers_count,
        forks: x.forks
    }))

orgRepos.sort((a, b) => b.watchers - a.watchers)

console.log(`Top 3 ${orgName} GitHub Repos:`)
Inspect.printDump(orgRepos.slice(0, 3))
```

Output:

```
Top 3 nodejs GitHub Repos:
[
    {
        name: node,
        description: Node.js JavaScript runtime ✨🐢🚀✨,
        lang: JavaScript,
        watchers: 119635,
        forks: 36612
    },
    {
        name: node-v0.x-archive,
        description: Moved to https://github.com/nodejs/node,
        lang: null,
        watchers: 34286,
        forks: 7219
    },
    {
        name: node-gyp,
        description: Node.js native addon build tool,
        lang: Python,
        watchers: 10685,
        forks: 1878
    }
]
```

For tabular result-sets use `Inspect.dumpTable()` to capture and `Inspect.printDumpTable()` to print result-sets in a
human-friendly markdown table, e.g:

```ts
console.log(`\nTop 10 ${orgName} GitHub Repos:`)
Inspect.printDumpTable(orgRepos.map(x => ({
    name: x.name, lang: x.lang, watchers: x.watchers, forks: x.forks
})).slice(0, 10))
```

Output:

```
Top 10 nodejs GitHub Repos:
+-----------------------------------------------------+
|        name         |    lang    | watchers | forks |
|-----------------------------------------------------|
| node                | JavaScript |   119635 | 36612 |
| node-v0.x-archive   | null       |    34286 |  7219 |
| node-gyp            | Python     |    10685 |  1878 |
| docker-node         | Dockerfile |     8585 |  1985 |
| http-parser         | C          |     6446 |  1522 |
| nan                 | C++        |     3353 |   529 |
| node-addon-examples | C++        |     2589 |   602 |
| readable-stream     | JavaScript |     1048 |   240 |
| diagnostics         | null       |      550 |    69 |
| build               | Jinja      |      541 |   183 |
+-----------------------------------------------------+
```

Both accept the same data structures so they can be used to inspect any API Response or its `results` collection, e.g:

```ts
const api = await client.api(new FindTechnologies({ take:10 }))
Inspect.printDumpTable(api.response.results)
```

### URL Utils

Utils for constructing URLs from your API's Route definitions and QueryStrings:

```ts
import { combinePaths, createUrl, createPath, appendQueryString, setQueryString, queryString } from '@servicestack/client'

combinePaths('/api','Hello')                     // /api/Hello
createPath('/hello/{Name}', { name:'World' })    // hello/World
createUrl('/hello/{Name}', { name:'World', title:'Dr' })  // hello/World?title=Dr
appendQueryString('/hello', { name:'World' })    // /hello?name=World
setQueryString('/hello?name=Foo', { name:'World' })       // /hello?name=World
queryString('/hello?name=World&title=Dr')        // { name:'World', title:'Dr' }
```

### String Utils

```ts
import { humanify, humanize, toPascalCase, toCamelCase, toKebabCase,
         splitOnFirst, splitOnLast, leftPart, rightPart, lastLeftPart, lastRightPart } from '@servicestack/client'

humanify('TheIDWithWord')   // The ID With Word
humanize('the_id')          // The Id
toPascalCase('theId')       // TheId
toCamelCase('TheId')        // theId
toKebabCase('TheId')        // the-id

splitOnFirst('a:b:c', ':')  // ['a','b:c']
splitOnLast('a:b:c', ':')   // ['a:b','c']
leftPart('a:b:c', ':')      // a
rightPart('a:b:c', ':')     // b:c
lastLeftPart('a:b:c', ':')  // a:b
lastRightPart('a:b:c', ':') // c
```

Where `humanify()` is useful for converting DTO property names into human-friendly form labels.

### Date and Time Utils

```ts
import { toDate, dateFmt, dateFmtHM, timeFmt12, toLocalISOString, toTime, msToTime,
         fromXsdDuration, toXsdDuration } from '@servicestack/client'

toDate('/Date(978307200000)/')  // Date
toDate('2001-01-01T00:00:00Z')  // Date

dateFmt(new Date(Date.UTC(2001,0,1)))  // 2001/01/01
toLocalISOString(new Date())           // ISO 8601 date in local time

fromXsdDuration('PT1H')         // 3600 (total seconds)
toXsdDuration(3600)             // PT1H
toTime(3600000)                 // 01:00:00
```

### Object Utils

```ts
import { pick, omit, omitEmpty, uniq, flatMap, each, apply, map, classNames } from '@servicestack/client'

pick({ a:1, b:2, c:3 }, ['a','c'])   // { a:1, c:3 }
omit({ a:1, b:2, c:3 }, ['b'])       // { a:1, c:3 }
omitEmpty({ a:1, b:null, c:'' })     // { a:1 }
uniq(['b','a','b'])                  // ['a','b']
flatMap(x => [x,x], [1,2])           // [1,1,2,2]

classNames('btn', isActive && 'active', { 'btn-lg':isLarge })
```

Where `apply()` is useful for configuring objects inline, e.g:

```ts
const client = apply(new JsonServiceClient(baseUrl), c => c.basePath = '/api')
```

### Form Utils

Browser Apps can use the built-in Form utils to serialize and populate HTML Forms:

```ts
import { serializeToObject, serializeToUrlEncoded, serializeToFormData, populateForm, toFormData } from '@servicestack/client'

const form = document.forms[0]

serializeToObject(form)      // { name:'World', title:'Dr' }
serializeToUrlEncoded(form)  // name=World&title=Dr
serializeToFormData(form)    // FormData
toFormData({ name:'World' }) // FormData

populateForm(form, { name:'World', title:'Dr' })
```

Which can be sent with the API's typed Request DTO using `apiForm`:

```ts
const api = await client.apiForm(new CreateContact(), new FormData(document.forms[0]))
```

### Event Bus

A minimal pub/sub `EventBus` is included for loosely-coupled communication between components:

```ts
import { createBus } from '@servicestack/client'

const bus = createBus()

const sub = bus.subscribe('theEvent', arg => console.log('got', arg))

bus.publish('theEvent', 1)   // got 1

sub.unsubscribe()
bus.publish('theEvent', 2)   // (no handlers)
```

### JSV Format

APIs using the [JSV Format](/jsv-format) can serialize objects into their compact JSV representation with:

```ts
import { JSV } from '@servicestack/client'

JSV.stringify({ Id:1234, Name:"TEST", Obj:[{ Id:1, Key:"Value" }] })
// {Id:1234,Name:TEST,Obj:[{Id:1,Key:Value}]}
```

### StringBuffer

An efficient `StringBuffer` for building large strings:

```ts
import { StringBuffer } from '@servicestack/client'

const sb = new StringBuffer()
sb.append('Four score')
sb.append(' ')
sb.append('and seven years ago.')

sb.toString()    // Four score and seven years ago.
sb.getLength()   // 31
sb.clear()
```

## ServiceStackIDEA plugin

<img align="right" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/img/servicestackidea/supported-ides.png" />
ServiceStackIDEA is a plugin for JetBrains IntelliJ based IDEs to simplify development of client applications for ServiceStack services with integrated support for Add ServiceStack Reference feature.

ServiceStackIDEA now supports many of the most popular JetBrains IDEs including:

 - WebStorm, RubyMine, PhpStorm & PyCharm
   - TypeScript
 - IntelliJ
   - Java, Kotlin and TypeScript

### TypeScript Support

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/servicestackidea/webstorm-add-typescript.png)

By right clicking on any folder in your Project explorer, you can add a TypeScript reference by simply providing any based URL of your ServiceStack server.

![](https://raw.githubusercontent.com/ServiceStack/Assets/7474c03bdb0ea1982db2e7be57567ad1b8a4ad38/img/servicestackidea/add-typescript-ref.png)

Once this file as been added to your project, you can update your service DTOs by right clicking `Update ServiceStack Reference` or using the light bulb action (`Alt+Enter` by default).

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/servicestackidea/webstorm-update-typescript.png)

This now means you can integrate with a ServiceStack service easily from your favorite JetBrains IDE when working with TypeScript!

#### Install ServiceStack IDEA from the Plugin repository

The ServiceStack IDEA is now available to install directly from within a supported IDE Plugins Repository, to Install Go to: 

 1. `File -> Settings...` Main Menu Item
 2. Select **Plugins** on left menu then click **Browse repositories...** at bottom
 3. Search for **ServiceStack** and click **Install plugin**
 4. Restart to load the installed ServiceStack IDEA plugin

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/servicestackidea/android-plugin-download.gif)


## Troubleshooting

### Enabling TypeScript async/await 

To make API requests using TypeScript's async/await feature you'll need to create a TypeScript `tsconfig.json` config file that imports ES6 promises and W3C fetch definitions with:

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "commonjs",
    "lib": [ "es2015", "dom" ]
  }
}
```

