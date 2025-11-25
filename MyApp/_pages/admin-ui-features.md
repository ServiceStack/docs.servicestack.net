---
title: Admin UI Features
---

Built into ServiceStack v6+ Apps is the [Admin UI](/admin-ui) providing **Admin** Users a UX Friendly UI to access App features & summary insights from:

<div class="not-prose">
    <h3 class="text-center font-medium text-4xl text-indigo-800 m-0 py-3">/admin-ui</h3>
</div>

Which after authenticating will take you to the Admin UI dashboard showing the authenticated Admin User details and general API stats:

<div class="block p-4 rounded shadow">
    <img src="/img/pages/admin-ui/dashboard.png">
</div>

Further Admin UI functionality can be enabled by adding the necessary dependencies and Admin APIs necessary to implement the Admin UI Features.

### Disabling the Admin UI

If desired, the **/admin-ui** features can be selectively or entirely disabled using the `AdminUi` Enum flags:

```csharp
ConfigurePlugin<UiFeature>(feature => feature.AdminUi = AdminUi.None);
```

## Admin Users

User management functionality for creating & modifying users, assigning Roles & Permissions, locking users or updating their passwords can be enabled by registering `AdminUsersFeature` plugin:

```csharp
Plugins.Add(new AdminUsersFeature());
```

Which enables a familiar UI for searching & managing users:

<div class="block p-4 rounded shadow">
    <a href="/admin-ui-users"><img src="/img/pages/admin-ui/users.png"></a>
</div>

::: info
See [Admin UI User Docs](/admin-ui-users) to learn about Admin User features and available customization options
:::

## Redis Admin

The [Redis Admin UI](/admin-ui-redis) lets you manage your App's configured Redis Server with a user-friendly UX for managing core Redis data types, simple search functionality to quickly find Redis values, quick navigation between related values, first class support for JSON values and a flexible command interface and command history to inspect all previously run redis commands.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="AACZtTOcQbg" style="background-image: url('https://img.youtube.com/vi/AACZtTOcQbg/maxresdefault.jpg')"></lite-youtube>

It can be enabled by registering the `AdminRedisFeature` plugin:

```csharp
services.AddPlugin(new AdminRedisFeature());
```

Which will enable the **Redis** Admin UI:

[![](/img/pages/admin-ui/admin-ui-redis.png)](/admin-ui-redis)

::: info
See [Redis Admin docs](/admin-ui-redis) for more info.
:::

## Database Admin

The [Database Admin UI](/admin-ui-database) lets you quickly browse and navigate your App's configured RDBMS schemas and tables:

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="NZkeyuc_prg" style="background-image: url('https://img.youtube.com/vi/NZkeyuc_prg/maxresdefault.jpg')"></lite-youtube>

It can be enabled by registering the `AdminDatabaseFeature` plugin from [ServiceStack.Server](https://nuget.org/packages/ServiceStack.Server):

```csharp
services.AddPlugin(new AdminDatabaseFeature());
```

Which will enable the **Database** Admin UI:

[![](/img/pages/admin-ui/admin-ui-database.png)](/admin-ui-database)

::: info
See [Database Admin docs](/admin-ui-database) for more info.
:::

## Request Logging & Profiling

Enables invaluable observability into your App, from being able to quickly inspect and browse incoming requests, to tracing their behavior:

:::sh
npx add-in profiling
:::

Which will add the [Modular Startup](/modular-startup) configuration to your Host project that registers both Request Logging & Profiling features when running your App in [DebugMode](/debugging#debugmode) (i.e. Development):

```csharp
[assembly: HostingStartup(typeof(MyApp.ConfigureProfiling))]

namespace MyApp;

public class ConfigureProfiling : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {
            if (context.HostingEnvironment.IsDevelopment())
            {
                services.AddPlugin(new ProfilingFeature
                {
                    IncludeStackTrace = true,
                });
            }
        });
}
```

Which will enable the Request Logging & Profiling UIs:

<div class="block p-4 rounded shadow">
    <a href="/admin-ui-profiling"><img src="/img/pages/admin-ui/admin-ui-logging.png"></a>
</div>

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="LgQHTSHSk1g" style="background-image: url('https://img.youtube.com/vi/LgQHTSHSk1g/maxresdefault.jpg')"></lite-youtube>

::: info
See [Admin Logging & Profiling UI docs](/admin-ui-profiling) to learn about Admin Profiling feature and available customization options.
:::

## Validation

The Admin Validation feature enables adding dynamically sourced validation rules that can be applied & modified at runtime.

The most popular `IValidationSource` for maintaining dynamic validation rules is `OrmLiteValidationSource` for maintaining them
in the App's registered database's `ValidationRule` RDBMS Table:

```csharp
[assembly: HostingStartup(typeof(MyApp.ConfigureValidation))]

namespace MyApp;

public class ConfigureValidation : IHostingStartup
{
    // Add support for dynamically generated db rules
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => services.AddSingleton<IValidationSource>(c =>
            new OrmLiteValidationSource(c.Resolve<IDbConnectionFactory>(), HostContext.LocalCache)))
        .ConfigureAppHost(appHost => {
            // Create `ValidationRule` table if it doesn't exist in AppHost.Configure() or Modular Startup
            appHost.Resolve<IValidationSource>().InitSchema();
        });
}
```

Which can be quickly added to your project with:

:::sh
npx add-in validation-source
:::

Which the built-in [Validation Feature](/validation.html#validation-feature) detects to register the `GetValidationRules` and `ModifyValidationRules` APIs used by the Admin Validation Feature:

<div class="block p-4 rounded shadow">
    <a href="/admin-ui-validation"><img src="/img/pages/admin-ui/validation.png"></a>
</div>

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="W5OJAlOxH98" style="background-image: url('https://img.youtube.com/vi/W5OJAlOxH98/maxresdefault.jpg')"></lite-youtube>

::: info
See [Admin UI Validation Docs](/admin-ui-validation) to learn about dynamic DB Validation Rules
:::

## Recommend Admin UI Features

The Admin UI was designed with room to grow. You can let us know what features you would find most valuable on our [GitHub Discussions](https://github.com/ServiceStack/Discuss/discussions/2).
