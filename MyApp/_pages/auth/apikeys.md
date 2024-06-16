---
title: API Keys
---

As we continue to embrace and natively integrate with ASP.NET Core's .NET 8 platform, we've reimplemented the last major
feature missing from ServiceStack Auth - support for API Keys that's available from **ServiceStack v8.3**.

### What are API Keys?

API Keys are a simple and effective way to authenticate and authorize access to your APIs, which are typically used 
for machine-to-machine communication, where a client application needs to access an API without user intervention. 
API Keys are often used to control access to specific resources or features in your API, providing a simple way 
to manage access control.

### Redesigning API Keys

Building on our experience with API Keys in previous versions of ServiceStack, we've taken the opportunity to redesign
how API Keys work to provide a more flexible and powerful way to manage access control for your APIs.

The existing [API Key Auth Provider](https://docs.servicestack.net/auth/api-key-authprovider) was implemented as 
another Auth Provider that provided another way to authenticate a single user. The consequences of this was:

 - Initial API Request was slow as it required going through the Authentication workflow to authenticate the user and setup authentication for that request
 - No support for fine-grained access control as API Keys had same access as the authenticated user
 - API Keys had to be associated with a User which was unnecessary for machine-to-machine communication

Given the primary use-case for API Keys is for machine-to-machine communication where the client is not a User,
nor do they want systems they give out their API Keys to, to have access to their User Account, we've changed
how API Keys work in .NET 8.

## .NET 8 API Keys Feature

:::youtube U4vqOIHOs_Q
New .NET 8 API Keys Feature with Built-In UIs!
:::

The first design decision to overcome the above issues was to separate API Keys from Users and Authentication itself,
where the new `ApiKeysFeature` is now just a plugin instead of an Auth Provider, which can be added to existing Identity
Auth Apps with:

:::sh
x mix apikeys
:::

Which will add the API Keys [Modular Startup](https://docs.servicestack.net/modular-startup) to your Host project, a minimal example of which looks like:

```csharp
public class ConfigureApiKeys : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            services.AddPlugin(new ApiKeysFeature());
        })
        .ConfigureAppHost(appHost => {
            using var db = appHost.Resolve<IDbConnectionFactory>().Open();
            var feature = appHost.GetPlugin<ApiKeysFeature>();
            feature.InitSchema(db);
        });
}
```

Where it registers the `ApiKeysFeature` plugin and creates the `ApiKey` table in the App's configured database if it
doesn't already exist.

### Creating Seed API Keys

The plugin can also be used to programatically generate API Keys for specified Users:

```csharp
if (feature.ApiKeyCount(db) == 0)
{
    var createApiKeysFor = new [] { "admin@email.com", "manager@email.com" };
    var users = IdentityUsers.GetByUserNames(db, createApiKeysFor);
    foreach (var user in users)
    {
        // Create a super API Key for the admin user
        List<string> scopes = user.UserName == "admin@email.com"
            ? [RoleNames.Admin] 
            : [];
        var apiKey = feature.Insert(db, new() { 
            Name="Seed Key", UserId=user.Id, UserName=user.UserName, Scopes=scopes });
        
        var generatedApiKey = apiKey.Key;
    }
}
```

### Basic Usage

With the plugin registered, you can now use the `ValidateApiKey` attribute to limit APIs to only be accessible with a 
valid API Key, e.g:

```csharp
[ValidateApiKey]
public class MyRequest {}
```

### Use API Keys with our without Users and Authentication

API Keys can optionally be associated with a User, but they don't have to be, nor do they run in the context of a User
or are able to invoke any Authenticated APIs on their own. Users who create them can also limit their scope to only
call APIs they have access to, which can be done with user-defined scopes:

### Scopes

Scopes are user-defined strings that can be used to limit APIs from only being accessible with API Keys that have the 
required scope. For example, we could create generate API Keys that have **read only**, **write only** or **read/write** 
access to APIs by assigning them different scopes, e.g: 

```csharp
public static class Scopes
{
    public const string TodoRead = "todo:read";
    public const string TodoWrite = "todo:write";
}

[ValidateApiKey(Scopes.TodoRead)]
public class QueryTodos : QueryDb<Todo> {}

[ValidateApiKey(Scopes.TodoWrite)]
public class CreateTodo : ICreateDb<Todo>, IReturn<Todo> {}

[ValidateApiKey(Scopes.TodoWrite)]
public class UpdateTodo : IUpdateDb<Todo>, IReturn<Todo> {}

[ValidateApiKey(Scopes.TodoWrite)]
public class DeleteTodos : IDeleteDb<Todo>, IReturnVoid {}
```

Where only API Keys with the `todo:read` scope can access the `QueryTodos` API, and only API Keys with the `todo:write`
scope can access the `CreateTodo`, `UpdateTodo` and `DeleteTodos` APIs.

APIs that aren't assigned a scope can be accessed by any valid API Key.

The only built-in Scope is `Admin` which like the `Admin` role enables full access to all `[ValidateApiKeys]` APIs.

### Fine-grained Access Control

Alternatively API Keys can be restricted to only be able to access specific APIs.

### Features

In addition to scopes, API Keys can also be tagged with user-defined **Features** which APIs can inspect to enable 
different behavior, e.g. a **Paid** feature could be used to increase rate limits or return premium content whilst a 
**Tracking** feature could be used to keep a record of API requests, etc.

These can be accessed in your Services with:

```csharp
public object Any(QueryTodos request)
{
    if (Request.GetApiKey().HasFeature(Features.Paid))
    {
        // return premium content
    }
}
```

## Integrated UIs

Like many of ServiceStack's other premium features, API Keys are fully integrated into [ServiceStack's built-in UIs](https://servicestack.net/auto-ui)
including [API Explorer](https://docs.servicestack.net/api-explorer) and the [Admin UI](https://docs.servicestack.net/admin-ui).

### API Explorer

Your Users and API Consumers can use API Explorer to invoke protected APIs with their API Key. API Key protected APIs
will display a **key** icon next to the API instead of the **padlock** which is used to distinguish APIs that require
Authentication.

Users can configure API Explorer with their API Key by either clicking the **key** icon on the top right or by clicking
the **API Key** link on the alert message that appears when trying to access an API requiring an API Key:

![](/img/pages/auth/apikeys/apiexplorer-apikeys.png)

Both of these will open the **API Key** dialog where they can paste their API Key:

![](/img/pages/auth/apikeys/apiexplorer-apikeys-dialog.png)

:::info NOTE
API Keys are not stored in localStorage and only available in the current session
:::

### Admin UI

Whilst **Admin** users can view and manage API Keys in the API Key [Admin UI](https://docs.servicestack.net/admin-ui) at:

:::{.text-4xl .text-center .text-indigo-800}
/admin-ui/apikeys
:::

![](/img/pages/auth/apikeys/admin-ui-apikeys.png)

This will let you view and manage all API Keys in your App, including the ability to revoke API Keys, extend their 
Expiration date as well as manage any Scopes and Features assigned to API Keys.

### Customizing API Key UIs

The `ApiKeysFeature` plugin can be configured to specify which **Scopes** and **Features** can be assigned to API Keys
as well as the different Expiration Options you want available in the API Key management UIs, e.g:

```csharp
services.AddPlugin(new ApiKeysFeature {
    // Optional: Available Scopes Admin Users can assign to any API Key
    Features = [
        Features.Paid,
        Features.Tracking,
    ],
    // Optional: Available Features Admin Users can assign to any API Key
    Scopes = [
        Scopes.TodoRead,
        Scopes.TodoWrite,
    ],
    // Optional: Limit available Expiry options that can be assigned to API Keys
    // ExpiresIn = [
    //     new("", "Never"),
    //     new("7", "7 days"),
    //     new("30", "30 days"),
    //     new("365", "365 days"),
    // ],
});
```

### Admin User API Keys

When the `ApiKeysFeature` plugin is registered, the [User Admin UI](https://docs.servicestack.net/admin-ui-identity-users) 
will be enhanced to include the ability to create and manage API Keys for the user at the bottom of the **Edit User** form:   

![](/img/pages/auth/apikeys/admin-ui-user-apikeys.png)

#### Creating User API Keys

When creating API Keys, you can assign them a **Name**, its **Expiration** date and any **Scopes**, **Features** and **Notes**.

![](/img/pages/auth/apikeys/admin-ui-user-apikeys-create.png)

### Restrict to APIs

`Scopes` provide a simple way to logically group a collection of related APIs behind UX-friendly names without Users 
needing to know the behavior of each individual API. 

In addition, Users who want fine-grained control can also restrict API Keys to only be able to access specific APIs that 
their systems make use of by selecting them from the **Restrict to APIs** option:

![](/img/pages/auth/apikeys/apikeys-restrict-to.png)

#### One Time only access of generated API Key

All UIs limit access to the generated API Key token so that it's only accessible at the time of creation:

![](/img/pages/auth/apikeys/admin-ui-user-apikeys-create-dialog.png)

#### Editing User API Keys

Everything about the API Key can be edited after it's created except for the generated API Key token itself, in addition
to be able to cancel and revoke the API Key:

![](/img/pages/auth/apikeys/admin-ui-user-apikeys-edit.png)

Invalid API Keys that have expired or have been disabled will appear disabled in the UI:

![](/img/pages/auth/apikeys/admin-ui-user-apikeys-disabled.png)

## User Management API Keys

In addition to the built-in Admin UIs to manage API Keys, all Identity Auth Tailwind templates have also been updated
to include support for managing API Keys in their User Account pages:

<div class="not-prose mt-8 grid grid-cols-2 gap-4">
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700 flex flex-col justify-between" href="https://blazor.web-templates.io">
        <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/blazor.png">
        <div class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">blazor.web-templates.io</div>
    </a>
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700" href="https://blazor-vue.web-templates.io">
        <div style="max-height:350px;overflow:hidden">
        <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/blazor-vue.png"></div>
        <div class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">blazor-vue.web-templates.io</div>
    </a>
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700" href="https://blazor-wasm.web-templates.io">
        <div style="max-height:350px;overflow:hidden">
        <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/blazor-wasm.png"></div>
        <div class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">blazor-wasm.web-templates.io</div>
    </a>
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700" href="https://razor.web-templates.io">
        <div style="max-height:350px;overflow:hidden">
        <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/razor.png"></div>
        <div class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">razor.web-templates.io</div>
    </a>
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700" href="https://mvc.web-templates.io">
        <div style="max-height:350px;overflow:hidden">
        <img class="p-2" src="https://raw.githubusercontent.com/ServiceStack/Assets/master/csharp-templates/mvc.png"></div>
        <div class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold group-hover:bg-indigo-700 group-hover:text-white text-center py-2">mvc.web-templates.io</div>
    </a>
</div>

The templates aren't configured to use API Keys by default, but new projects can be configured to use API Keys by 
selecting the **API Keys** feature on the [Start Page](/start):

[![](/img/pages/auth/apikeys/start-apikeys.png)](/start)

Or by mixing the `apikeys` project in your host project:

:::sh
x mix apikeys
:::

Which add the `Configure.ApiKeys.cs` modular startup to your Host project, which registers the `ApiKeysFeature` plugin
where you'd use the `UserScopes` and `UserFeatures` collections instead to control which scopes and features Users
can assign to their own API Keys, e.g:

```csharp
services.AddPlugin(new ApiKeysFeature {
    // Optional: Available Scopes Admin Users can assign to any API Key
    Features = [
        Features.Paid,
        Features.Tracking,
    ],
    // Optional: Available Features Admin Users can assign to any API Key
    Scopes = [
        Scopes.TodoRead,
        Scopes.TodoWrite,
    ],
    
    // Optional: Limit available Scopes Users can assign to their own API Keys
    UserScopes = [
        Scopes.TodoRead,
    ],
    // Optional: Limit available Features Users can assign to their own API Keys
    UserFeatures = [
        Features.Tracking,
    ],
});
```

### Identity Auth API Keys

When enabled users will be able to create and manage their own API Keys from their Identity UI pages
which will use any configured `UserScopes` and `UserFeatures`:

![](/img/pages/auth/apikeys/identity-auth-apikeys.png)

### Client Usage

Like most API Key implementations, API Keys can be passed in a [HTTP Authorization Bearer Token](https://datatracker.ietf.org/doc/html/rfc6750#section-2.1)
that can be configured in ServiceStack Service Clients with: 

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

Or use a different HTTP Header by configuring `ApiKeysFeature.HttpHeader`, e.g:

```csharp
services.AddPlugin(new ApiKeysFeature {
    HttpHeader = "X-Alt-Key"
});
```