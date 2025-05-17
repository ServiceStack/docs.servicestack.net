---
title: Blazor Server Tailwind Template
---

<div class="not-prose">
    <div id="blazor-server" class="hide-title mt-12 ml-20 flex flex-col items-center">
        <div class="flex">
            <svg class="w-24 h-24 text-purple-600 mr-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M23.834 8.101a13.912 13.912 0 0 1-13.643 11.72a10.105 10.105 0 0 1-1.994-.12a6.111 6.111 0 0 1-5.082-5.761a5.934 5.934 0 0 1 11.867-.084c.025.983-.401 1.846-1.277 1.871c-.936 0-1.374-.668-1.374-1.567v-2.5a1.531 1.531 0 0 0-1.52-1.533H8.715a3.648 3.648 0 1 0 2.695 6.08l.073-.11l.074.121a2.58 2.58 0 0 0 2.2 1.048a2.909 2.909 0 0 0 2.695-3.04a7.912 7.912 0 0 0-.217-1.933a7.404 7.404 0 0 0-14.64 1.603a7.497 7.497 0 0 0 7.308 7.405s.549.05 1.167.035a15.803 15.803 0 0 0 8.475-2.528c.036-.025.072.025.048.061a12.44 12.44 0 0 1-9.69 3.963a8.744 8.744 0 0 1-8.9-8.972a9.049 9.049 0 0 1 3.635-7.247a8.863 8.863 0 0 1 5.229-1.726h2.813a7.915 7.915 0 0 0 5.839-2.578a.11.11 0 0 1 .059-.034a.112.112 0 0 1 .12.053a.113.113 0 0 1 .015.067a7.934 7.934 0 0 1-1.227 3.549a.107.107 0 0 0-.014.06a.11.11 0 0 0 .073.095a.109.109 0 0 0 .062.004a8.505 8.505 0 0 0 5.913-4.876a.155.155 0 0 1 .055-.053a.15.15 0 0 1 .147 0a.153.153 0 0 1 .054.053A10.779 10.779 0 0 1 23.834 8.1zM8.895 11.628a2.188 2.188 0 1 0 2.188 2.188v-2.042a.158.158 0 0 0-.15-.15Z"/></svg>
            <svg class="w-28 h-28" xmlns="http://www.w3.org/2000/svg" width="256" height="154" viewBox="0 0 256 154"><defs><linearGradient id="logosTailwindcssIcon0" x1="-2.778%" x2="100%" y1="32%" y2="67.556%"><stop offset="0%" stop-color="#2298BD"/><stop offset="100%" stop-color="#0ED7B5"/></linearGradient></defs><path fill="url(#logosTailwindcssIcon0)" d="M128 0C93.867 0 72.533 17.067 64 51.2C76.8 34.133 91.733 27.733 108.8 32c9.737 2.434 16.697 9.499 24.401 17.318C145.751 62.057 160.275 76.8 192 76.8c34.133 0 55.467-17.067 64-51.2c-12.8 17.067-27.733 23.467-44.8 19.2c-9.737-2.434-16.697-9.499-24.401-17.318C174.249 14.743 159.725 0 128 0ZM64 76.8C29.867 76.8 8.533 93.867 0 128c12.8-17.067 27.733-23.467 44.8-19.2c9.737 2.434 16.697 9.499 24.401 17.318C81.751 138.857 96.275 153.6 128 153.6c34.133 0 55.467-17.067 64-51.2c-12.8 17.067-27.733 23.467-44.8 19.2c-9.737-2.434-16.697-9.499-24.401-17.318C110.249 91.543 95.725 76.8 64 76.8Z"/></svg>
        </div>
    </div>
    <div class="relative bg-white dark:bg-black py-4">
      <div class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
        <p class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Blazor Server Tailwind Template</p>
        <p class="mx-auto mt-5 max-w-prose text-xl text-gray-500">
          Ultimate dev model & UX ideal for low-latency Intranet environments
        </p>
      </div>
    </div>
    <a href="https://blazor.web-templates.io">
      <div class="block flex justify-center shadow hover:shadow-lg rounded py-1">
        <img class="p-4" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/blazor.png">
      </div>
    </a>
</div>

[ServiceStack.Blazor's Tailwind Components](/templates/blazor-components) also work flawlessly in [Blazor Server Apps](https://learn.microsoft.com/en-us/aspnet/core/blazor/hosting-models?view=aspnetcore-6.0#blazor-server) which benefits from fast startup and exceptional responsiveness in low latency environments thanks to its architecture of running your App in a server session that only needs to propagate thin UI Virtual DOM updates to clients.

The Blazor Server App template offers a number compelling advantages over Blazor WASM, including:

 - A superior dev model and debugging experience
 - Improved live-reload and faster iterative dev cycles
 - Full access to .NET Server functionality
 - Better start times & UI responsiveness
 - Less complexity from unnecessary client project or pre-rendering solutions

Although [the limitations](https://learn.microsoft.com/en-us/aspnet/core/blazor/hosting-models?view=aspnetcore-6.0#blazor-server) of its highly-coupled stateful server rendering session architecture does make it a poor fit for most high latency Internet sites which we continue to recommend our [Blazor WASM project template](/templates/blazor-tailwind) for.

To better showcase our growing Blazor functionality we've created the new Blazor Gallery websites showcasing usage of available rich Blazor Components for rapidly develop beautiful Tailwind Web Apps:

<div id="blazor-component-gallery" class="relative bg-white dark:bg-black py-4">
  <div class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
    <p class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">Blazor Gallery</p>
    <p class="mx-auto mt-5 max-w-prose text-xl text-gray-500">
      Discover ServiceStack.Blazor Rich UI Components and Integrated Features
    </p>
  </div>
</div>

[![](/img/pages/blazor/gallery-splash.png)](https://blazor-gallery.servicestack.net)

As our components support both hosting models we're maintaining identical Gallery sites running on both **Blazor Server** and **WASM**:

<div class="not-prose mb-16 mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
  <div class="rounded-md shadow">
    <a href="https://blazor-gallery.servicestack.net" class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg hover:no-underline">
      Blazor Server
    </a>
  </div>
  <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
    <a href="https://blazor-gallery.jamstacks.net" class="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-indigo-600 hover:bg-gray-50 md:py-4 md:px-10 md:text-lg hover:no-underline">
      Blazor WASM
    </a>
  </div>
</div>

For a closer look at ServiceStack.Blazor Components in action, download & run them to see how good they'll run in your Environment:

<div class="flex flex-col">
  <a href="https://github.com/NetCoreApps/BlazorGallery" class="flex text-xl text-gray-800">
    <svg class="w-6 h-6 mr-2 align-text-bottom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
    <span>NetCoreApps/BlazorGallery</span>
  </a>
  <a href="https://github.com/NetCoreApps/BlazorGalleryWasm" class="flex mt-2 text-xl text-gray-800">
    <svg class="w-6 h-6 mr-2 align-text-bottom" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
    <span>NetCoreApps/BlazorGalleryWasm</span>
  </a>
  <a href="https://docs.servicestack.net/vue/" class="flex mt-2 text-xl text-gray-800">
    <svg class="w-6 h-6 mr-2 align-text-bottom" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="w-28 h-28 sm:w-44 sm:h-44 iconify iconify--vscode-icons" width="1em" height="1em" viewBox="0 0 32 32"><path fill="#41b883" d="M24.4 3.925H30l-14 24.15L2 3.925h10.71l3.29 5.6l3.22-5.6Z"></path><path fill="#41b883" d="m2 3.925l14 24.15l14-24.15h-5.6L16 18.415L7.53 3.925Z"></path><path fill="#35495e" d="M7.53 3.925L16 18.485l8.4-14.56h-5.18L16 9.525l-3.29-5.6Z"></path></svg>
    <span>Vue Component Gallery</span>
  </a>
</div>

<p class="hide-h2"></p>

## Getting Started

Customize and Download a new Blazor WASM Bootstrap project with your preferred project name:

<h3 class="text-center">Download new C# Blazor Project</h3>

<blazor-templates class="not-prose pb-8"></blazor-templates>

Alternatively you can create & download a new Blazor Project with the [x dotnet tool](/dotnet-new):

:::sh
x new blazor ProjectName
:::


## Universal Blazor Components

Blazor Server has become our preferred platform for Interactive **Intranet** Apps which excels in **low-latency environments** to enable a best-in-class responsive end-user UX that also offers a superior development experience in Visual Studio's live reload where it enables a fast iterative development workflow and good debugging experience.

A fantastic property of Blazor is its support for multiple hosting modes which allows the same components from being able to run in the Browser with Blazor WASM or rendered on the Server with Blazor Server. But whilst Blazor is capable of it, this trait is typically conceded in most Apps with database access where it recommends using
[EF Core directly in Blazor components](https://learn.microsoft.com/en-us/aspnet/core/blazor/blazor-server-ef-core?view=aspnetcore-7.0) - effectively prohibiting reuse in Blazor WASM should you ever want to utilize Blazor's preferred hosting model for hosting your Blazor App's on the Internet.

<div class="my-8 flex justify-center">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="66DgLHExC9E" style="background-image: url('https://img.youtube.com/vi/66DgLHExC9E/maxresdefault.jpg')"></lite-youtube>
</div>

## Blazing Fast Networkless APIs

Whilst better performing, having Blazor components access DB's directly encourages a more tightly-coupled and less reusable & testable architecture than the traditional well-defined API dev model used in client/server Mobile & Desktop Apps or Web SPA Apps like WASM.

To achieve the best of both worlds, we've enabled support for utilizing the In Process [Service Gateway](/service-gateway) in Blazor Server Apps which lets you retain the traditional client/server dev model for invoking your Server APIs **In Process** - avoiding any serialization, HTTP networking or even Kestrel middleware overhead to invoke your APIs directly!

This enables using the **exact same source code** to call APIs in Blazor Server and WASM which allows us to develop reusable Blazor Components to invoke the same Server APIs that serve Web, Mobile and Desktop Apps in Blazor Server Apps. Where instead of using HttpClient to invoke your APIs, they're invoked directly from a C# method which will preserve its StackTrace where you'll be able to track the API call down to the Blazor UI component calling it.

ServiceStack's [Message-based API Design](/api-design) makes it possible for all API calls in ServiceStack.Blazor components and project templates to be routed through these 2 methods:

```csharp
public interface IServiceGatewayAsync
{
  Task<TResponse> SendAsync<TResponse>(object dto, CancellationToken ct=default);
  //...
}

public interface IServiceGatewayFormAsync
{
  Task<TResponse> SendFormAsync<TResponse>(object dto, MultipartFormDataContent form, CancellationToken ct);
}
```

::: info
The `SendFormAsync` API is a new method added to support multi-part API requests with File Uploads
:::

Which allows the HTTP `JsonApiClient` and networkless `InProcessGateway` clients to be used interchangeably. By default Blazor Server Apps now use the InProcess Gateway but can be switched over to invoke APIs using the HTTP `JsonApiClient` with:

```csharp
BlazorConfig.Set(new() {
    UseInProcessClient = false
});
```

Which changes all `Api*` methods in Blazor components and Pages inheriting ServiceStack.Blazor's [BlazorComponentBase](https://reference.servicestack.net/api/ServiceStack.Blazor/BlazorComponentBase) to use the registered `JsonApiClient` client.

Other components can access both the InProcess Gateway or `JsonApiClient` by injecting the `IClientFactory` dependency into their components, e.g:

```csharp
public class MyComponent : ComponentBase
{
    [Inject] public IClientFactory? ClientFactory { get; set; }

    public IServiceGateway Gateway => ClientFactory!.GetGateway();
    public JsonApiClient Client => ClientFactory!.GetClient();
}
```

This capability is what has made it possible for high-level "API-enabled" components like [AutoQuery Grids](https://blazor-gallery.jamstacks.net/grid) and [AutoForm](https://blazor-gallery.jamstacks.net/gallery/autoform) to support both Blazor Server and Blazor WASM utilizing the most efficient API client available to its platform.

The Blazor Gallery websites themselves are also good demonstrations of being able to run **entire Web Apps** in both Blazor Server and WASM, with all development being done with Blazor Server to take advantage of its superior iterative dev model then a script is used to "export" all pages to an identical Blazor WASM project.

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

### Public Pages & Components

To reduce boiler plate, your Blazor Pages & components can inherit the templates local [AppComponentBase.cs](https://github.com/NetCoreTemplates/blazor-wasm/blob/main/MyApp.Client/AppComponentBase.cs) which inherits `BlazorComponentBase` that gets injected with the `IClientFactory` and provides convenient access to most common APIs:

```csharp
public class BlazorComponentBase : ComponentBase, IHasJsonApiClient
{
    [Inject] public IClientFactory? ClientFactory { get; set; }
    public IServiceGateway Gateway => ClientFactory!.GetGateway();
    public JsonApiClient Client => ClientFactory!.GetClient();

    public virtual Task<ApiResult<TResponse>> ApiAsync<TResponse>(IReturn<TResponse> request) => UseGateway
        ? Gateway.ManagedApiAsync(request)
        : Client.ManagedApiAsync(request);

    public virtual Task<ApiResult<EmptyResponse>> ApiAsync(IReturnVoid request); /*...*/
    public virtual Task<TResponse> SendAsync<TResponse>(IReturn<TResponse> request);
    public virtual Task<IHasErrorStatus> ApiAsync<Model>(object request);
    public virtual Task<ApiResult<Model>> ApiFormAsync<Model>(object requestDto, MultipartFormDataContent request);
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

### Blazor Server Example

Developing your Blazor Server UI however, you just change your shared request/response DTO in the shared `ServiceModel` project, and both your client and server compile against the same request/response DTO classes.
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

## ServiceStack.Blazor Components

The [ServiceStack.Blazor Components library](/templates/blazor-components) contains integrated functionality for Blazor including API-enabled base components, HTML Utils and Tailwind UI Input components heavily utilized throughout the template.
