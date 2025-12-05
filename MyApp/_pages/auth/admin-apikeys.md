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

The easiest way to get started is by creating a new Empty project with API Keys enabled with your preferred database to store the API Keys in. SQLite is a good choice for stand-alone Apps as it doesn't require any infrastructure dependencies.

<div class="not-prose mx-auto">
  <h3 id="template" class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
      Create a new Empty project with API Keys
  </h3>
  <auth-templates></auth-templates>
</div>

### Existing Projects

Existing projects not configured with Authentication can enable this simple Auth configuration by running:

:::sh
npx add-in apikeys-auth
:::

Which will add the [ServiceStack.Server](https://nuget.org/packages/ServiceStack.Server) dependency and the [Modular Startup](/modular-startup) configuration below:

```csharp
public class ConfigureApiKeys : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services =>
        {
            services.AddPlugin(new AuthFeature([
                new ApiKeyCredentialsProvider(),
                new AuthSecretAuthProvider("p@55wOrd"),
            ]));
            services.AddPlugin(new SessionFeature());
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

### Admin Only APIs

For APIs that should only be accessible to Admin Users (using AuthSecret) use `[ValidateIsAdmin]`, e.g:

```csharp
[ValidateIsAdmin]
public class AdminResetTodos : IPost, IReturnVoid {}
```

### API Explorer

Support for API Keys is also integrated into the [API Explorer](/api-explorer) allowing
users to use their API Keys to access API Key protected Services which are highlighted with a **Key** Icon:

![](/img/pages/auth/simple/apiexplorer-requires-apikey.png)

Users can enter their API Key by clicking on the **Key** Icon in the top right, or the link in the Warning alert
when trying to access an API Key protected Service:

![](/img/pages/auth/simple/apiexplorer-apikey-dialog.png)

## API Keys and Admin Secret Credentials Auth Provider

The usability of Simple Admin API Keys is greatly improved with the `ApiKeyCredentialsProvider` which enables .NET Microservices to provide persistent UserSession-like behavior for API Keys and Admin Auth Secrets to enable a Credentials Auth implementation which users can use with their API Keys or Admin AuthSecret.

When registered a **Credentials** SignIn dialog will appear for [ServiceStack Built-in UIs](https://servicestack.net/auto-ui) allowing users to Sign In with their **API Keys** or Admin **Auth Secret**.

![](/img/pages/auth/simple/ai-server-auth-apiexplorer.png)

### Session Auth with API Keys

Behind the scenes this creates a Server [Auth Session](/auth/sessions)
but instead of maintaining an Authenticated User Session it saves the API Key in the session then attaches the API Key to each request. This makes it possible to make API Key validated requests with just a session cookie instead of requiring resubmission of API Keys for each request.

### Secure .NET Microservices and Docker Appliances

This is an ideal Auth Configuration for .NET Docker Appliances and Microservices like [AI Server](/ai-server/) that don't need the complexity of ASP .NET Core's Identity Auth machinery and just want to restrict access to their APIs with API Keys and restrict Admin functionality to Administrator's with an Auth Secret.

The benefit of `ApiKeyCredentialsProvider` is that it maintains a persistent Session so that end users
only need to enter their API Key a single time and they'll be able to navigate to all of AI Server's protected pages using their API Key maintained in their Server User Session without needing to re-enter it for each UI and every request.

### User Access with API Keys

AI Server uses **API Keys** to restrict Access to their AI Features to **authorized Users** with Valid API Keys who
are able to use its Built-in UIs for its AI Features with the Users preferred Name and issued API Key:

![](/img/pages/auth/simple/ai-server-auth-user.png)

After signing in a single time they'll be able to navigate to any protected page and start using AI Server's AI features:

![](/img/pages/auth/simple/ai-server-auth-user-chat.png)

### User Access to API Explorer

This also lets users use their existing Auth Session across completely different UIs
like [API Explorer](/api-explorer)
where they'll have the same access to APIs as they would when calling APIs programatically with their API Keys, e.g:

![](/img/pages/auth/simple/ai-server-auth-apiexplorer-api.png)

## Admin Access

AI Server also maintains an Admin UI and Admin APIs that are only accessible to **Admin** users who 
Authenticate with the App's configured Admin Auth Secret who are able to access AI Server's Admin
UIs to monitor Live AI Requests, create new User API Keys, Manage registered AI Providers, etc. 

![](/img/pages/auth/simple/ai-server-auth-admin-jobs.png)

### Admin Restricted APIs

You can restrict APIs to Admin Users by using `[ValidateAuthSecret]`: 

```csharp
[Tag(Tags.Admin)]
[ValidateAuthSecret]
[Api("Add an AI Provider to process AI Requests")]
public class CreateAiProvider : ICreateDb<AiProvider>, IReturn<IdResponse>
{
    //...
}
```

Which are identified in API Explorer with a **padlock** icon whilst APIs restricted by API Key are 
identified with a **key** icon:

![](/img/pages/auth/simple/ai-server-auth-apiexplorer-admin.png)


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
    BearerToken = AuthSecret,
    Headers = {
        [HttpHeaders.XApiKey] = apiKey
    }
};
```

#### TypeScript

```ts
const client = new JsonServiceClient(BaseUrl)
client.bearerToken = AuthSecret
client.headers.set('X-Api-Key', apiKey)
```

## Development

You can avoid having to re-renter AuthSecret and API Keys during Development by populating every request with
the configured Admin AuthSecret which allows you to call both `[ValidateApiKey]` and `[ValidateIsAdmin]` protected APIs:

```csharp
#if DEBUG
PreRequestFilters.Add((req, res) =>
{
    req.Items[Keywords.AuthSecret] = authSecret;
    req.Items[Keywords.Authorization] = "Bearer " + authSecret;
});
#endif
```

### Summary

We hope this shows how stand-alone .NET 8 Microservices and self-contained Docker Apps can use the 
simple **Admin** and **API Keys** configuration to easily secure their APIs, complete with **Management UI** 
and **typed Service Client** integrations.
