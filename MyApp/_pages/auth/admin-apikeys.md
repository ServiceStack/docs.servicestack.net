---
title: Simple Auth for .NET 8 Apps
---

With ServiceStack now fully [integrated with ASP.NET Identity Auth](/auth/identity-auth),
our latest [.NET 8 Tailwind Templates](/start) offer a full-featured Auth Configuration complete with User Registration, 
Login, Password Recovery, Two Factory Auth, and more.

Whilst great for Web Applications that need it, it neglects the class of Apps which don't need User Auth and
the additional complexity it brings inc. Identity and Password Management, EF Migrations, Token Expirations, OAuth Integrations, etc. 

For these stand-alone Apps, Microservices and Docker Appliances that would still like to restrict Access to their APIs
but don't need the complexity of ASP .NET Core's Authentication machinery, a simpler Auth Story would be preferred.

With the introduction of API Keys in this release we're able to provide a simpler Auth Story for .NET 8 Microservices 
that's easy for **Admin** Users to manage and control which trusted clients and B2B Integrations can access their functionality.

:::youtube 0ceU91ZBhTQ
Simple Auth Story with API Keys ideal for .NET 8 Microservices
:::

The easiest way to get started is by creating a new Empty project with API Keys enabled with your preferred database
to store the API Keys in. SQLite is a good choice for stand-alone Apps as it doesn't require any infrastructure dependencies.

<div class="not-prose mx-auto">
  <h3 id="template" class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
      Create a new Empty project with API Keys
  </h3>
  <auth-templates></auth-templates>
</div>

### Existing Projects

Existing projects not configured with Authentication can enable this simple Auth configuration by running:

:::sh
x mix apikeys-auth
:::

Which will add the [ServiceStack.Server](https://nuget.org/packages/ServiceStack.Server) dependency and the 
[Modular Startup](/modular-startup) configuration below:

```csharp
public class ConfigureApiKeys : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
    .ConfigureServices(services =>
    {
        services.AddPlugin(new AuthFeature(new AuthSecretAuthProvider("p@55wOrd")));
        services.AddPlugin(new ApiKeysFeature
        {
            // Optional: Available Scopes Admin Users can assign to any API Key
            // Features = [
            //     "Paid",
            //     "Tracking",
            // ],
            // Optional: Available Features Admin Users can assign to any API Key
            // Scopes = [
            //     "todo:read",
            //     "todo:write",
            // ],
        });
    })
    .ConfigureAppHost(appHost =>
    {
        using var db = appHost.Resolve<IDbConnectionFactory>().Open();
        var feature = appHost.GetPlugin<ApiKeysFeature>();
        feature.InitSchema(db);
    });
}
```

Which configures the **AuthSecretAuthProvider** with the **Admin** password and **ApiKeysFeature** to enable [API Keys](/auth/apikeys) support.

### Admin UI

The **Admin** password will give you access to the [Admin UI](/admin-ui) at:

:::{.text-4xl .text-center .text-indigo-800}
/admin-ui
:::

![](/img/pages/auth/simple/admin-ui-signin.png)

![](/img/pages/auth/simple/admin-ui-dashboard.png)

### API Keys Admin UI

Clicking on **API Keys** menu item will take you to the API Keys Admin UI where you'll be able to create new API Keys 
that you can distribute to different API consumers you want to be able to access your APIs:

![](/img/pages/auth/simple/admin-ui-apikeys.png)

The **ApiKeysFeature** plugin will let you control different parts of the UI, including what **Features** you want to
assign to API Keys and what **Scopes** you want individual API Keys to be able to have access to.

```csharp
services.AddPlugin(new ApiKeysFeature
{
    Features = [
        "Paid",
        "Tracking",
    ],
    Scopes = [
        "todo:read",
        "todo:write",
    ],
    // ExpiresIn =[
    //     new("", "Never"),
    //     new("30", "30 days"),
    //     new("365", "365 days"),
    // ],    
    // Hide = ["RestrictTo","Notes"],
});
```

Any configuration on the plugin will be reflected in the UI:

![](/img/pages/auth/simple/admin-ui-apikeys-new.png)

The API Keys Admin UI also lets you view and manage all API Keys in your App, including the ability to revoke API Keys, 
extend their Expiration date as well as manage any Scopes and Features assigned to API Keys.

![](/img/pages/auth/simple/admin-ui-apikeys-edit.png)

### Protect APIs with API Keys

You'll now be able to protect APIs by annotating Request DTOs with the `[ValidateApiKey]` attribute:

```csharp
[ValidateApiKey]
public class Hello : IGet, IReturn<HelloResponse>
{
    public required string Name { get; set; }
}
```

Which only allows requests with a **valid API Key** to access the Service.

### Scopes

We can further restrict API access by assigning them a scope which will only allow access to Valid API Keys configured 
with that scope, e.g:

```csharp
[ValidateApiKey("todo:read")]
public class QueryTodos : QueryDb<Todo>
{
    public long? Id { get; set; }
    public List<long>? Ids { get; set; }
    public string? TextContains { get; set; }
}

[ValidateApiKey("todo:write")]
public class CreateTodo : ICreateDb<Todo>, IReturn<Todo>
{
    [ValidateNotEmpty]
    public required string Text { get; set; }
    public bool IsFinished { get; set; }
}

[ValidateApiKey("todo:write")]
public class UpdateTodo : IUpdateDb<Todo>, IReturn<Todo>
{
    public long Id { get; set; }
    [ValidateNotEmpty]
    public required string Text { get; set; }
    public bool IsFinished { get; set; }
}

[ValidateApiKey("todo:write")]
public class DeleteTodos : IDeleteDb<Todo>, IReturnVoid
{
    public long? Id { get; set; }
    public List<long>? Ids { get; set; }
}
```

### Restrict To APIs

Scopes allow for coarse-grained access control allowing a single scope to access a logical group of APIs. For more 
fine-grained control you can use **Restrict To APIs** to specify just the APIs an API Key can access:

![](/img/pages/auth/simple/admin-ui-apikeys-restrict-to.png)

Unlike scopes which can access APIs with the **same scope** or **without a scope**, Valid API Keys configured with
**Restrict To APIs** can only access those specific APIs.

### Features

Features are user-defined strings accessible within your Service implementation to provide different behavior
based on Features assigned to the API Key, e.g:

```csharp
public object Any(QueryTodos request)
{
    if (Request.GetApiKey().HasFeature("Paid"))
    {
        //...
    }
}
```

### API Explorer

Support for API Keys is also integrated into the [API Explorer](/api-explorer) allowing
users to use their API Keys to access API Key protected Services which are highlighted with a **Key** Icon:

![](/img/pages/auth/simple/apiexplorer-requires-apikey.png)

Users can enter their API Key by clicking on the **Key** Icon in the top right, or the link in the Warning alert
when trying to access an API Key protected Service:

![](/img/pages/auth/simple/apiexplorer-apikey-dialog.png)

### Client Usage

All HTTP and existing [Service Clients](https://docs.servicestack.net/clients-overview) can be configured to use API Keys
for machine-to-machine communication, which like most API Key implementations can be passed in a [HTTP Authorization Bearer Token](https://datatracker.ietf.org/doc/html/rfc6750#section-2.1)
that can be configured in Service Clients with:

#### C#

```csharp
var client = new JsonApiClient(BaseUrl) {
    BearerToken = apiKey
};
```

#### TypeScript

```ts
const client = new JsonServiceClient(BaseUrl)
client.bearerToken = apiKey
```

### API Key HTTP Header

Alternatively, API Keys can also be passed in the `X-Api-Key` HTTP Header which allows clients to be configured
with an alternative Bearer Token allowing the same client to call both **Authenticated** and **API Key** protected APIs, e.g:

#### C#

```csharp
var client = new JsonApiClient(BaseUrl) {
    BearerToken = jwt,
    Headers = {
        [HttpHeaders.XApiKey] = apiKey
    }
};
```

#### TypeScript

```ts
const client = new JsonServiceClient(BaseUrl)
client.bearerToken = apiKey
client.headers.set('X-Api-Key', apiKey)
```

### Summary

We hope this shows how stand-alone .NET 8 Microservices and self-contained Docker Apps can use the 
simple **Admin** and **API Keys** configuration to easily secure their APIs, complete with **Management UI** 
and **typed Service Client** integrations.
