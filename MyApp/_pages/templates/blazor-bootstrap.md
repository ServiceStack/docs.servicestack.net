---
title: Blazor WASM Bootstrap
---

<div class="not-prose hide-title my-8 ml-20 flex flex-col items-center">
    <div>
        <svg class="w-44 h-44 text-purple-600 mr-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M23.834 8.101a13.912 13.912 0 0 1-13.643 11.72a10.105 10.105 0 0 1-1.994-.12a6.111 6.111 0 0 1-5.082-5.761a5.934 5.934 0 0 1 11.867-.084c.025.983-.401 1.846-1.277 1.871c-.936 0-1.374-.668-1.374-1.567v-2.5a1.531 1.531 0 0 0-1.52-1.533H8.715a3.648 3.648 0 1 0 2.695 6.08l.073-.11l.074.121a2.58 2.58 0 0 0 2.2 1.048a2.909 2.909 0 0 0 2.695-3.04a7.912 7.912 0 0 0-.217-1.933a7.404 7.404 0 0 0-14.64 1.603a7.497 7.497 0 0 0 7.308 7.405s.549.05 1.167.035a15.803 15.803 0 0 0 8.475-2.528c.036-.025.072.025.048.061a12.44 12.44 0 0 1-9.69 3.963a8.744 8.744 0 0 1-8.9-8.972a9.049 9.049 0 0 1 3.635-7.247a8.863 8.863 0 0 1 5.229-1.726h2.813a7.915 7.915 0 0 0 5.839-2.578a.11.11 0 0 1 .059-.034a.112.112 0 0 1 .12.053a.113.113 0 0 1 .015.067a7.934 7.934 0 0 1-1.227 3.549a.107.107 0 0 0-.014.06a.11.11 0 0 0 .073.095a.109.109 0 0 0 .062.004a8.505 8.505 0 0 0 5.913-4.876a.155.155 0 0 1 .055-.053a.15.15 0 0 1 .147 0a.153.153 0 0 1 .054.053A10.779 10.779 0 0 1 23.834 8.1zM8.895 11.628a2.188 2.188 0 1 0 2.188 2.188v-2.042a.158.158 0 0 0-.15-.15Z"/></svg>
    </div>
    <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Blazor WASM Bootstrap Template</h1>
</div>

The feature-rich Blazor WASM Bootstrap template is ideal for teams with strong C# skills building Line Of Business (LOB) applications.
Utilizing Blazor WebAssembly (WASM) with a ServiceStack backend yields an optimal frictionless [API First development model](/api-first-development) where UIs can bind directly to Typed DTOs whilst benefiting from ServiceStack's [structured error handling](/validation) & rich contextual form validation binding.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="TIgjMf_vtCI" style="background-image: url('https://img.youtube.com/vi/TIgjMf_vtCI/maxresdefault.jpg')"></lite-youtube>

## Getting Started

Customize and Download a new Blazor WASM Bootstrap project with your preferred project name:

<h3 class="text-center">Download new C# Blazor WASM Project</h3>

<blazor-templates class="not-prose pb-8"></blazor-templates>

Alternatively you can create & download a new Blazor Project with the [x dotnet tool](/templates/dotnet-new):

:::sh
x new blazor-wasm ProjectName
:::

## Optimal Development Workflow

By utilizing ServiceStack's [decoupled project structure](/physical-project-structure), combined with Blazor enabling C# on the client, we're able to get 100% reuse of your APIs shared DTOs as-is to enable an end-to-end Typed API automatically free from any additional tooling or code-gen complexity.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="BcQqCzm4tK0" style="background-image: url('https://img.youtube.com/vi/BcQqCzm4tK0/maxresdefault.jpg')"></lite-youtube>

## Api and ApiAsync methods

.NET was originally conceived to use Exceptions for error control flow however there's been a tendency in modern languages & libraries to shun Exceptions and return errors as normal values, an approach we believe is a more flexible & ergonomic way to handle API responses.

### The ApiResult way

The `Api(Request)` and `ApiAsync(Request)` APIs returns a typed `ApiResult<Response>` Value Result encapsulating either a Typed Response or a structured API Error populated in `ResponseStatus` allowing you to handle API responses programmatically without `try/catch` handling:

The below example code to create a new Booking:

```csharp
CreateBooking request = new();

ApiResult<IdResponse> api = new();

async Task OnSubmit()
{
    api = await Client.ApiAsync(request);

    if (api.Succeeded)
    {
        await done.InvokeAsync(api.Response!);
        request = new();
    }
}
```

Which despite its terseness handles both **success** and **error** API responses, **if successful** it invokes the `done()` callback notifying its parent of the new Booking API Response before resetting the Form's data model with a new Request DTO.

Upon **failure** the error response is populated in `api.Error` which binds to the UI via Blazor's `<CascadingValue Value=@api.Error>` to propagate it to all its child components in order to show contextual validation errors next to their respective Input controls.

## JSON API Client

The recommended way for configuring a Service Client to use in your Blazor WASM Apps is to use `AddBlazorApiClient()`, e.g:

```csharp
builder.Services.AddBlazorApiClient(builder.Configuration["ApiBaseUrl"] ?? builder.HostEnvironment.BaseAddress);
```

Which registers a typed Http Client factory returning a recommended pre-configured `JsonApiClient` to communicate with your back-end ServiceStack APIs including support for CORS, required when hosting the decoupled UI on a different server (e.g. CDN) to your server. 

If you're deploying your Blazor WASM UI to a CDN you'll need to specify the URL for the server, otherwise if it's deployed together with your Server App you can use the Host's Base Address.

### Public Pages & Components

To reduce boiler plate, your Blazor Pages & components can inherit the templates local [AppComponentBase.cs](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Client/AppComponentBase.cs) which inherits `BlazorComponentBase` which gets injected with the `JsonApiClient` and provides short-hand access to its most common APIs:

```csharp
public class BlazorComponentBase : ComponentBase, IHasJsonApiClient
{
    [Inject]
    public JsonApiClient? Client { get; set; }

    public virtual Task<ApiResult<TResponse>> ApiAsync<TResponse>(IReturn<TResponse> request)  => Client!.ApiAsync(this, request);
    public virtual Task<ApiResult<EmptyResponse>> ApiAsync(IReturnVoid request) => Client!.ApiAsync(this, request);
    public virtual Task<TResponse> SendAsync<TResponse>(IReturn<TResponse> request) => Client!.SendAsync(this, request);
}
```

### Protected Pages & Components

Pages and Components requiring Authentication should inherit from [AppAuthComponentBase](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Client/AppComponentBase.cs) instead which integrates with Blazor's Authentication Model to provide access to the currently authenticated user:

```csharp
public abstract class AppAuthComponentBase : AppComponentBase
{
    [CascadingParameter]
    protected Task<AuthenticationState>? AuthenticationStateTask { get; set; }

    protected bool HasInit { get; set; }

    protected bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;

    protected ClaimsPrincipal? User { get; set; }

    protected override async Task OnParametersSetAsync()
    {
        var state = await AuthenticationStateTask!;
        User = state.User;
        HasInit = true;
    }
}
```

## Benefits of Shared DTOs

Typically with Web Apps, our client is using a different language to C#, so an equivalent request DTOs need to be generated for the client.

### TypeScript Example

For example, TypeScript generated DTOs still give us typed end-to-end services with the help of tooling like [Add ServiceStack Reference](/add-servicestack-reference)

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

Turns into:

```typescript
// @Route("/hello/{Name}")
export class Hello implements IReturn<HelloResponse>
{
    public name: string;

    public constructor(init?: Partial<Hello>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'Hello'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new HelloResponse(); }
}

export class HelloResponse
{
    public result: string;
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<HelloResponse>) { (Object as any).assign(this, init); }
}
```

When Request or Response DTOs changes during development, the client DTOs need to be regenerated using a command like [`x csharp`](./add-servicestack-reference.md#simple-command-line-utilities).

### Blazor WASM Example

Developing your Blazor WASM UI however, you just change your shared request/response DTO in the shared `ServiceModel` project, and both your client and server compile against the same request/response DTO classes.
This eliminates the need for any additional step.

In the `ServiceModel` project, we still have:

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

Which the Blazor C# App can use directly in its **.razor** pages:

```csharp
@code {
    Hello request = new()
    {
        Name = "Blazor WASM"
    };

    ApiResult<HelloResponse> api = new();

    protected override async Task OnInitializedAsync() => await submit();

    async Task submit() => api = await ApiAsync(request);
}
```

## ServiceStack.Blazor

The **ServiceStack.Blazor** library contains integrated functionality for Blazor including an optimal JSON API HttpClient Factory, API-enabled base components, HTML Utils and Bootstrap & Tailwind UI Input components heavily utilized throughout the template.

### Built-in Blazor and Tailwind UI Components

The Built-in UI Components enable a clean & productive dev model and share the same base classes making them functionally equivalent and can be swapped when switching CSS frameworks by updating its namespace in your projects `_Imports.razor`

The Blazor Components in **ServiceStack.Blazor** include:

| Component         | Description                                                                       |
|-------------------|-----------------------------------------------------------------------------------|
| `<TextInput>`     | Text Input control for string properties                                          |
| `<DateTimeInput>` | Date Input control for Date properties                                            |
| `<CheckboxInput>` | Checkbox Input control for Boolean properties                                     |
| `<SelectInput>`   | Select Dropdown for properties with finite list of values like Enums              |
| `<TextAreaInput>` | Text Input control for large strings                                              |
| `<DynamicInput>`  | Dynamic component utilizing the appropriate above Input controls in Auto Forms    |
| `<AlertSuccess>`  | Displaying successful notification feedback                                       |
| `<ErrorSummary>`  | Displaying error summary message when no contextual field validation is available |
| `<FileUpload>`    | Used with `FilesUploadFeature` and `UploadTo` attribute to upload files           |


::: info
All Input controls support contextual validation of ServiceStack's existing [structured Error responses](/error-handling)
:::

### Themable

Should it be needed, all components are themable by running the included [README.ss](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Client/Shared/Components/README.ss) executable documentation that copies its **Razor** UI markup locally into your project enabling customization of UI including controls.

### Bookings CRUD

The C# Service Client `Api*` methods make calling remote ServiceStack APIs similar to calling a C# method as its returned `ApiResult<Response>` encapsulates both a typed **Error** & API **Response** as an alternate way to handle errors as all components can bind directly to its `api.Error`.

The reusability extends to your APIs typed Request DTOs which components can directly 2-way data bind to.

Below is an example of a CRUD Booking form [BookingsCrud/Create.razor](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.Blazor.Tests/Client/Pages/BookingsCrud/Create.razor) used to Create Bookings:

```html
@attribute [Authorize(Roles="Employee")]
@inherits AppAuthComponentBase

<form @onsubmit="_ => OnSubmit()" @onsubmit:preventDefault 
     class=@CssUtils.ClassNames("relative shadow rounded p-4",@class)>
<CascadingValue Value=@api.Error>
    <button type="button" class="close" @onclick="close"><i></i></button>

    <h1 class="fs-4 text-secondary text-center">
        New Booking
    </h1>

    <ErrorSummary Except=@VisibleFields />

    <div class="mb-3 form-floating">
        <TextInput @bind-Value="request.Name" required placeholder="Name for this booking" />
    </div>

    <div class="mb-3 form-floating">
        <SelectInput @bind-Value="request.RoomType" Options=@(Enum.GetValues<RoomType>()) /> 
    </div>

    <div class="d-flex">
        <div class="mb-3 flex-fill form-floating me-1">
            <TextInput type="number" @bind-Value="request.RoomNumber" min="0" required />
        </div>

        <div class="mb-3 flex-fill form-floating">
            <TextInput type="number" @bind-Value="request.Cost" min="0" required />
        </div>
    </div>

    <div class="d-flex">
        <div class="mb-3 flex-fill form-floating me-1">
            <DateTimeInput @bind-Value="request.BookingStartDate" required />
        </div>

        <div class="mb-3 flex-fill form-floating">
            <DateTimeInput @bind-Value="request.BookingEndDate" />
        </div>
    </div>
    
    <div class="mb-3 form-floating">
        <TextAreaInput @bind-Value="request.Notes" placeholder="Notes about this booking" style="height:6rem" />
    </div>

    <div class="d-flex justify-content-between align-items-center">
        <div>
            <button type="submit" class="btn btn-primary">Create Booking</button>
        </div>
    </div>
</CascadingValue>
</form>

@code {
    [Parameter] public EventCallback<IdResponse> done { get; set; }
    [Parameter] public string? @class { get; set; }

    CreateBooking request = new()
    {
        BookingStartDate = DateTime.UtcNow,
    };

    // Hide Error Summary Messages for Visible Fields which displays contextual validation errors
    string[] VisibleFields => new[] {
        nameof(request.Name), 
        nameof(request.RoomType), 
        nameof(request.RoomNumber), 
        nameof(request.BookingStartDate),
        nameof(request.BookingEndDate), 
        nameof(request.Cost), 
        nameof(request.Notes),
    };

    ApiResult<IdResponse> api = new();

    async Task OnSubmit()
    {
        api = await ApiAsync(request);

        if (api.Succeeded)
        {
            await done.InvokeAsync(api.Response!);
            request = new();
        }
    }

    async Task close() => await done.InvokeAsync(null);
}
```

Which binds directly to the [CreateBooking](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.ServiceModel/Bookings.cs) Request DTO:

```csharp
[Tag("bookings"), Description("Create a new Booking")]
[Route("/bookings", "POST")]
[ValidateHasRole("Employee")]
[AutoApply(Behavior.AuditCreate)]
public class CreateBooking : ICreateDb<Booking>, IReturn<IdResponse>
{
    [Description("Name this Booking is for"), ValidateNotEmpty]
    public string Name { get; set; }
    public RoomType RoomType { get; set; }
    [ValidateGreaterThan(0)]
    public int RoomNumber { get; set; }
    [ValidateGreaterThan(0)]
    public decimal Cost { get; set; }
    public DateTime BookingStartDate { get; set; }
    public DateTime? BookingEndDate { get; set; }
    [Input(Type = "textarea")]
    public string? Notes { get; set; }
}
```

To initially render this form:

<a class="flex flex-col justify-center items-center my-8" href="https://blazor-wasm.jamstacks.net/bookings-crud">
    <img src="/img/pages/jamstack/blazor-wasm/booking-new.png" class="max-w-screen-md" />
</a>

Whose `[ValidateNotEmpty]` [declarative validator](/declarative-validation) filters down to the **client Input** UI to prevent unnecessary invalid API requests:

<a class="flex flex-col justify-center items-center my-8" href="https://blazor-wasm.jamstacks.net/bookings-crud">
    <img src="/img/pages/jamstack/blazor-wasm/booking-new-validation-client.png" class="max-w-screen-md" />
</a>

Validation of server error responses looks like:

<a class="flex flex-col justify-center items-center my-8" href="https://blazor-wasm.jamstacks.net/bookings-crud">
    <img src="/img/pages/jamstack/blazor-wasm/booking-new-validation-server.png" class="max-w-screen-md" />
</a>

#### Use of `form`

Validation errors use the standard `<form>` element and `api.Error` responses that can be passed directly to each control or in this case uses Blazor's built-in `<CascadingValue Value=@api.Error>` to cascade it to child components controls that can make use of it to display contextual errors.

#### Integrated Auth

It uses the templates included [AppComponentBase](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Client/AppComponentBase.cs) which integrates with Blazor's Auth model allowing it to use its standard `[Authorize(Roles="Employee")]` attributes and provides access to the Authenticated User's info populated from Secure; HttpOnly JWT Cookies for secure stateless client Authentication that works across App deployments and without any server infrastructure.

Public pages can inherit `AppComponentBase` to access ServiceStack.Blazor's [BlazorComponentBase](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Blazor/BlazorComponentBase.cs) and get access to `JsonApiClient` dependency and related functionality.

#### AutoQuery CRUD Example

`CreateBooking` is an [AutoQuery CRUD](/autoquery/crud) Request DTO, it works without a server implementation as it uses the default (and [overridable](/autoquery/crud#custom-autoquery-crud-services)) implementation generated by AutoQuery.

## Blazor Trade-offs

Blazor WASM enables reuse of C# skills, tooling & libraries offers a compelling advantage for .NET teams, so much so
it has become our preferred technology for developing internal LOB applications as it's better able to reuse existing
C# investments in an integrated SPA Framework utilizing a single toolchain.

It does however come at a cost of a larger initial download size and performance cost resulting in a high Time-To-First-Render (TTFR)
and an overall poor initial User Experience when served over the Internet, that's further exacerbated over low speed Mobile connections.

This is likely an acceptable trade-off for most LOB applications served over high-speed local networks but may not be a
suitable choice for public Internet sites _(an area our other [jamstacks.net](https://jamstacks.net) templates may serve better)_.

As an SPA it also suffers from poor SEO as content isn't included in the initial page and needs to be rendered in the browser after
the App has initialized. For some content heavy sites this can be a deal-breaker either requiring proxy rules so content pages
are served by a different SEO friendly site or otherwise prohibits using Blazor WASM entirely.

### Improving Startup Performance

The solution to both issues is fairly straightforward, by utilizing the mainstay solution behind
[Jamstack Frameworks](https://jamstack.org/generators/) and prerender content at build time.

We know what needs to be done, but how best to do it in Blazor WASM? Unfortunately the
[official Blazor WASM prerendering guide](https://docs.microsoft.com/en-us/aspnet/core/blazor/components/prerendering-and-integration?view=aspnetcore-6.0&pivots=webassembly)
isn't actually a prerendering solution, as is typically used to describe
[Static Site Generators (SSG)](https://www.netlify.com/blog/2020/04/14/what-is-a-static-site-generator-and-3-ways-to-find-the-best-one/)
prerendering static content at build-time, whilst Blazor WASM prerendering docs instead describes
a [Server-Side-Rendering (SSR)](https://www.omnisci.com/technical-glossary/server-side-rendering) solution mandating the additional 
complexity of maintaining your Apps dependencies in both client and server projects. Unfortunately this approach also wont yield an 
optimal result since prerendering is typically used so Apps can host their SSG content on static file hosts, instead SSR does the 
opposite whose forced runtime coupling to the .NET Server Host prohibits Blazor WASM Apps from being served from a CDN.

As this defeats [many of the benefits](https://blazor-wasm.jamstacks.net/docs/hosting) of a Blazor WASM Jamstack App in the first place, 
we've instead opted for a more optimal solution that doesn't compromise its CDN hostability.

### Increasing Perceived Performance

We have little opportunity over improving the startup time of the real C# Blazor App beyond hosting its static assets on CDN edge caches,
but ultimately what matters is [perceived performance](https://marvelapp.com/blog/a-designers-guide-to-perceived-performance/) which
we do have control over given the screen for a default Blazor WASM project is a glaring white screen flash:

![](/img/pages/jamstack/blazor-wasm/loading-default.png)

The longer users have to wait looking at this black loading screen without signs of progress, the more they'll associate your site
with taking forever to load.

One technique many popular sites are using to increase perceived performance is to use content placeholders in place of real-content
which gives the impression that the site has almost loaded and only requires a few moments more for the latest live data to be slotted in.

As an example here's what YouTube content placeholders mimicking the page layout looks like before the real site has loaded:

![](/img/pages/jamstack/youtube-placeholder.png)

But we can do even better than an inert content placeholder, and load a temporary chrome of our App. But as this needs to be done
before Blazor has loaded we need to implement this with a sprinkling of HTML + JS.

First thing we need to do is move the scoped styles of our Apps
[MainLayout](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Client/Shared/MainLayout.razor) and
[NavMenu](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Client/Shared/NavMenu.razor) into an external
[main-layout.css](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Client/wwwroot/css/main-layout.css) so our temp
App chrome can use it.

Then in our [/wwwroot/index.html](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Client/wwwroot/index.html) anything
between `<div id="app"></div>` is displayed whilst our Blazor App is loading, before it's replaced with the real App.

So Here we just paste in the **MainLayout** markup:

```html
<div id="app">
    <!-- loading: render temp static app chrome to improve perceived performance -->
    <div id="app-loading" class="main-layout page">
        <div class="sidebar">
            <div class="top-row navbar navbar-dark">
                <a class="navbar-brand ps-4" href="/">MyApp</a>
                <button class="navbar-toggler">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
            <div class="collapse">
                <ul class="nav flex-column"></ul>
            </div>
        </div>
        <div class="main">
            <div class="main-top-row px-4">
                <ul class="nav nav-pills"></ul>
                <a href="signin?return=docs/deploy" class="btn btn-outline-primary">
                    Login
                </a>
            </div>
            <div class="content px-4">
                <!--PAGE-->
                <div class="spinner-border float-start mt-2 me-2" role="status">
                    <span class="sr-only"></span>
                </div>
                <h1 style="font-size:36px">
                    Loading...
                </h1>
                <!--/PAGE-->
            </div>
        </div>
    </div>
</div>
```

Less our App's navigation menus which we'll dynamically generate with the splash of JS below:

```js
const SIDEBAR = `
    Home,home,/$
    Counter,plus,/counter
    Todos,clipboard,/todomvc
    Bookings CRUD,calendar,/bookings-crud
    Call Hello,transfer,/hello$
    Call HelloSecure,shield,/hello-secure
    Fetch data,list-rich,/fetchdata
    Admin,lock-locked,/admin
    Login,account-login,/signin
`
const TOP = `
    0.40 /mo,dollar,/docs/hosting
    Prerendering,loop-circular,/docs/prerender
    Deployments,cloud-upload,/docs/deploy
`

const path = location.pathname
const NAV = ({ label, cls, icon, route, exact }) => `<li class="nav-item${cls}">
    <a href="${route}" class="nav-link${(exact ? path==route : path.startsWith(route)) ? ' active' : ''}">
        <span class="oi oi-${icon}" aria-hidden="true"></span> ${label}
    </a></li>`
const renderNav = (csv,f) => csv.trim().split(/\r?\n/g).map(s => NAV(f.apply(null,s.split(',')))).join('')
const $1 = s => document.querySelector(s)

$1('#app-loading .sidebar .nav').innerHTML = renderNav(SIDEBAR, (label, icon, route) => ({
    label, cls: ` px-3${route == SIDEBAR[0].route ? ' pt-3' : ''}`,
    icon, route: route.replace(/\$$/, ''), exact: route.endsWith('$')
}))

$1('#app-loading .main-top-row .nav').innerHTML = renderNav(TOP, (label, icon, route) => ({
    label, cls: '', icon, route: route.replace(/\$$/, ''), exact: route.endsWith('$')
}))
```

Which takes care of both rendering the top and sidebar menus as well as highlighting the active menu for the active
nav item being loaded, and because we're rendering our real App navigation with real links, users will be able to navigate
to the page they want before our App has loaded.

So you can distinguish a prerendered page from a Blazor rendered page we've added a **subtle box shadow** to prerendered content
which you'll see initially before being reverting to a flat border when the Blazor App takes over and replaces the entire page:

```html
<style>
#app-loading .content { box-shadow: inset 0 4px 4px 0 rgb(0 0 0 / 0.05) }
</style>
```

With just this, every page now benefits from an instant App chrome to give the perception that our App has loaded instantly
before any C# in our Blazor App is run. E.g. here's what the [Blazor Counter](https://blazor-wasm.jamstacks.net/counter) page looks like while it's loading:

![](/img/pages/jamstack/blazor-wasm/loading.png)

If you click refresh the [/counter](https://blazor-wasm.jamstacks.net/counter) page a few times you'll see the new loading screen prior to the Counter page being available.

Our App is now in a pretty shippable state with decent UX of a loading page that looks like it loaded instantly instead
of the "under construction" Loading... page from the default Blazor WASM project template.

It's not quite a zero maintenance solution but still fairly low maintenance as only the `SIDEBAR` and `TOP` csv lists
need updating when add/removing menu items.

### Improving UX with Prerendering

We'll now turn our focus to the most important page in our App, the [Home Page](https://blazor-wasm.jamstacks.net) which is the page most people will see
when loading the App from the first time.

With the above temp App chrome already in place, a simple generic pre-rendering solution to be able to load any prerendered
page is to check if any prerendered content exists in the
[/prerender](https://github.com/NetCoreTemplates/blazor-wasm/tree/gh-pages/prerender)
folder for the current path, then if it does replace the default index.html `Loading...` page with it:

```js
const pagePath = path.endsWith('/') 
    ? path.substring(0, path.length - 2) + '/index.html' 
    : path
fetch(`/prerender${pagePath}`)
    .then(r => r.text())
    .then(html => {
        if (html.indexOf('<!DOCTYPE html>') >= 0) return // ignore CDN 404.html
        const pageBody = $1('#app-loading .content')
        if (pageBody) 
            pageBody.innerHTML = `<i hidden data-prerender="${path}"></i>` + html
    })
    .catch(/* no prerendered content found for this path */)
```

We also tag which path the prerendered content is for and provide a JS function to fetch the prerendered content
which we'll need to access later in our App:

```html
<script>
/* Loading */
window.prerenderedPage = function () {
    const el = document.querySelector('#app-loading .content')
    return el && el.innerHTML || ''
}
</script>
```

We now have a solution in place to load pre-rendered content from the `/prerender` folder, but still need some way of generating it.

The solution is technology independent in that you can you use any solution your most comfortable with, (even manually construct
each prerendered page if preferred), although it's less maintenance if you automate and get your CI to regenerate it when it publishes
your App.

Which ever tool you choose would also need to be installed in your CI/GitHub Action if that's where it's run, so we've opted for
a dependency-free & least invasive solution by utilizing the existing Tests project, which has both great IDE tooling support and
can easily be run from the command-line and importantly is supported by the [bUnit](https://bunit.dev) testing library which we'll
be using to render component fragments in isolation.

To distinguish prerendering tasks from our other Tests we've tagged
[PrerenderTasks.cs](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Tests/PrerenderTasks.cs)
with the `prerender` Test category. The only configuration the tasks require is the location of the `ClientDir` WASM Project
defined in [appsettings.json](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Tests/appsettings.json)
that's setup in the constructor.

The `Render<T>()` method renders the Blazor Page inside a `Bunit.TestContext` which it saves at the location
specified by its `@page` directive.

```csharp
[TestFixture, Category("prerender")]
public class PrerenderTasks
{
    Bunit.TestContext Context;
    string ClientDir;
    string WwrootDir => ClientDir.CombineWith("wwwroot");
    string PrerenderDir => WwrootDir.CombineWith("prerender");

    public PrerenderTasks()
    {
        Context = new();
        var config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
        ClientDir = config[nameof(ClientDir)] 
            ?? throw new Exception($"{nameof(ClientDir)} not defined in appsettings.json");
        FileSystemVirtualFiles.RecreateDirectory(PrerenderDir);
    }

    void Render<T>(params ComponentParameter[] parameters) where T : IComponent
    {
        WriteLine($"Rendering: {typeof(T).FullName}...");
        var component = Context.RenderComponent<T>(parameters);
        var route = typeof(T).GetCustomAttribute<RouteAttribute>()?.Template;
        if (string.IsNullOrEmpty(route))
            throw new Exception($"Couldn't infer @page for component {typeof(T).Name}");

        var fileName = route.EndsWith("/") ? route + "index.html" : $"{route}.html";

        var writeTo = Path.GetFullPath(PrerenderDir.CombineWith(fileName));
        WriteLine($"Written to {writeTo}");
        File.WriteAllText(writeTo, component.Markup);
    }

    [Test]
    public void PrerenderPages()
    {
        Render<Client.Pages.Index>();
        // Add Pages to prerender...
    }
}
```

Being a unit test gives it a number of different ways it can be run, using any of the NUnit test runners, from the GUI
integrated in C# IDEs or via command-line test runners like `dotnet test` which can be done with:

```bash
$ dotnet test --filter TestCategory=prerender 
```

To have CI automatically run it when it creates a production build of our App we'll add it to our Host `.csproj`:

```xml
<PropertyGroup>
    <TestsDir>$(MSBuildProjectDirectory)/../MyApp.Tests</TestsDir>
</PropertyGroup>
<Target Name="AppTasks" AfterTargets="Build" Condition="$(APP_TASKS) != ''">
    <CallTarget Targets="Prerender" Condition="$(APP_TASKS.Contains('prerender'))" />
</Target>
<Target Name="Prerender">
    <Exec Command="dotnet test --filter TestCategory=prerender --logger:&quot;console;verbosity=detailed&quot;" 
            WorkingDirectory="$(TestsDir)" />
</Target>
```

Which allows [GitHub Actions to run it](https://github.com/NetCoreTemplates/blazor-wasm/blob/9460ebf57d3e46af1680eb3a2ff5080e59d33a54/.github/workflows/release.yml#L80)
when it publishes the App with:

```bash
$ dotnet publish -c Release /p:APP_TASKS=prerender
```

Now when we next commit code, the GitHub CI Action will run the above task to generate our
[/prerender/index.html](https://github.com/NetCoreTemplates/blazor-wasm/blob/gh-pages/prerender/index.html) page
that now loads our [Home Page](https://blazor-wasm.jamstacks.net) instantly!

[![](/img/pages/jamstack/blazor-wasm/home-prerendered.png)](/)

The only issue now is that the default Blazor template behavior will yank our pre-rendered page, once during loading
and another during Authorization. To stop the unwanted yanking we've updated the
[`<Loading/>`](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Client/Shared/Loading.razor) component
to instead load the prerendered page content if it's **for the current path**:

```html
@inject IJSRuntime JsRuntime
@inject NavigationManager NavigationManager

@if (!string.IsNullOrEmpty(prerenderedHtml))
{
    @((MarkupString)prerenderedHtml)
}
else
{
    <div class=@CssUtils.ClassNames("spinner-border float-start mt-2 me-2", @class)>
        <span class="sr-only"></span>
    </div>
    <h1 style="font-size:36px">
        Loading...
    </h1>
}

@code {
    [Parameter]
    public string Message { get; set; } = "Loading...";

    [Parameter]
    public string @class { get; set; } = "";

    public string prerenderedHtml { get; set; } = "";

    protected override async Task OnInitializedAsync()
    {
        var html = await JsRuntime.InvokeAsync<string>("prerenderedPage") ?? "";
        var currentPath = new Uri(NavigationManager.Uri).AbsolutePath;
        if (html.IndexOf($"data-prerender=\"{currentPath}\"") >= 0)
            prerenderedHtml = html;
    }
}
```

Whilst to prevent yanking by the Authorization component we'll also include the current page when rendering
the alternate layout with an `Authenticating...` text that will appear under the Login/Logout buttons on the top-right:

```xml
<AuthorizeRouteView RouteData="@routeData" DefaultLayout="@typeof(MainLayout)">
  <Authorizing>
    <p class="text-muted" style="float:right;margin:1rem 1rem 0 0">Authenticating...</p>
    <RouteView RouteData="@routeData" />
  </Authorizing>
</AuthorizeRouteView>
```

This last change brings us to the optimal UX we have now with the home page loading instantly whilst our Blazor App
is loading in the background that'll eventually replace the home page with its identical looking C# version except
for the **box-shadow under the top navigation** so you can tell when you're looking at the pre-rendered version
instead of the C# Blazor version.

### Prerendering Markdown Content

The other pages that would greatly benefit from prerendering are the Markdown `/docs/*` pages (like this one) that's implemented in
[Docs.razor](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Client/Pages/Docs.razor).

However to enable SEO friendly content our `fetch(/prerender/*)` solution isn't good enough as the initial page download
needs to contain the prerendered content, i.e. instead of being downloaded in after.

### PrerenderMarkdown Task

To do this our `PrerenderMarkdown` Task scans all `*.md` pages in the
[content](https://github.com/NetCoreTemplates/blazor-wasm/tree/main/MyApp.Client/wwwroot/content)
directory and uses the same
[/MyApp.Client/MarkdownUtils.cs](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Client/MarkdownUtils.cs)
implementation [Docs.razor](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Client/Pages/Docs.razor)
uses to generate the markdown and embeds it into the `index.html` loading page to generate the pre-rendered page:

```csharp
[Test]
public async Task PrerenderMarkdown()
{
    var srcDir = WwrootDir.CombineWith("content").Replace('\\', '/');
    var dstDir = WwrootDir.CombineWith("docs").Replace('\\', '/');
            
    var indexPage = PageTemplate.Create(WwrootDir.CombineWith("index.html"));
    if (!Directory.Exists(srcDir)) throw new Exception($"{Path.GetFullPath(srcDir)} does not exist");
    FileSystemVirtualFiles.RecreateDirectory(dstDir);

    foreach (var file in new DirectoryInfo(srcDir).GetFiles("*.md", SearchOption.AllDirectories))
    {
        WriteLine($"Converting {file.FullName} ...");

        var name = file.Name.WithoutExtension();
        var docRender = await Client.MarkdownUtils.LoadDocumentAsync(name, doc =>
            Task.FromResult(File.ReadAllText(file.FullName)));

        if (docRender.Failed)
        {
            WriteLine($"Failed: {docRender.ErrorMessage}");
            continue;
        }

        var dirName = dstDir.IndexOf("wwwroot") >= 0
            ? dstDir.LastRightPart("wwwroot").Replace('\\', '/')
            : new DirectoryInfo(dstDir).Name;
        var path = dirName.CombineWith(name == "index" ? "" : name);

        var mdBody = @$"
<div class=""prose lg:prose-xl min-vh-100 m-3"" data-prerender=""{path}"">
    <div class=""markdown-body"">
        {docRender.Response!.Preview!}
    </div>
</div>";
        var prerenderedPage = indexPage.Render(mdBody);
        string htmlPath = Path.GetFullPath(Path.Combine(dstDir, $"{name}.html"));
        File.WriteAllText(htmlPath, prerenderedPage);
        WriteLine($"Written to {htmlPath}");
    }
}

public class PageTemplate
{
    string? Header { get; set; }
    string? Footer { get; set; }

    public PageTemplate(string? header, string? footer)
    {
        Header = header;
        Footer = footer;
    }

    public static PageTemplate Create(string indexPath)
    {
        if (!File.Exists(indexPath))
            throw new Exception($"{Path.GetFullPath(indexPath)} does not exist");

        string? header = null;
        string? footer = null;

        var sb = new StringBuilder();
        foreach (var line in File.ReadAllLines(indexPath))
        {
            if (header == null)
            {
                if (line.Contains("<!--PAGE-->"))
                {
                    header = sb.ToString(); // capture up to start page marker
                    sb.Clear();
                }
                else sb.AppendLine(line);
            }
            else
            {
                if (sb.Length == 0)
                {
                    if (line.Contains("<!--/PAGE-->")) // discard up to end page marker
                    {
                        sb.AppendLine();
                        continue;
                    }
                }
                else sb.AppendLine(line);
            }
        }
        footer = sb.ToString();

        if (string.IsNullOrEmpty(header) || string.IsNullOrEmpty(footer))
            throw new Exception($"Parsing {indexPath} failed, missing <!--PAGE-->...<!--/PAGE--> markers");

        return new PageTemplate(header, footer);
    }

    public string Render(string body) => Header + body + Footer;
}
```

Whilst the `wwwroot/index.html` is parsed with `PageTemplate` above who uses the resulting layout to generate pages
within `<!--PAGE--><!--/PAGE-->` markers.

After it's also executed by the same MSBuild task run by GitHub Actions it prerenders all `/wwwroot/content/*.md` pages
which are written to the [/wwwroot/docs/*.html](https://github.com/NetCoreTemplates/blazor-wasm/tree/gh-pages/docs) folder.

This results in the path to the pre-generated markdown docs i.e. [/docs/prerender](https://blazor-wasm.jamstacks.net/docs/prerender) having the **exact same path**
as its route in the Blazor App, which when exists, CDNs give priority to over the SPA fallback the Blazor App is loaded with.

It shares similar behavior as the home page where its pre-rendered content is initially loaded before it's replaced with the
C# version once the Blazor App loads. The difference is that it prerenders "complete pages" for better SEO & TTFR.

