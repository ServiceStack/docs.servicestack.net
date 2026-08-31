---
title: Startup Tasks
---

Startup Tasks let you run development-time initialization after your ASP.NET Core App has fully started.
They're useful for keeping generated files synchronized with your server without requiring developers to remember an additional command after every server change.

Unlike [App Tasks](/app-tasks), which are explicitly run from the command-line before the App exits, `StartupTasks`:

- Run automatically after the application has started
- Only run when ServiceStack's `DebugMode` is enabled
- Have access to the fully initialized `AppHost` and its plugins
- Log failures without preventing the App from starting or other Startup Tasks from running

This makes them well suited to repeatable development conveniences like regenerating client DTOs on every restart.

In ASP.NET Core Apps, ServiceStack enables `DebugMode` when the host environment is `Development`, so registered Startup Tasks are automatically disabled when the App runs in `Production`.

## Automatically regenerate client DTOs

ServiceStack projects can register a Startup Task that finds existing `dtos.*` [ServiceStack References](/add-servicestack-reference) and regenerates them from the current server's metadata:

```csharp
public class ConfigureGeneratedDtos : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(afterAppHostInit: appHost => {
            StartupTasks.Register("dtos", () =>
                appHost.GetPlugin<NativeTypesFeature>().GenerateDtos());
        });
}
```

`afterAppHostInit` is the recommended place to register the task in an `IHostingStartup` configuration class. At this point the `AppHost` and `NativeTypesFeature` are initialized, but the registered delegate isn't executed until ASP.NET Core reports that the application has started. This later execution point is important as it allows ServiceStack to inspect the addresses the web server is actually listening on.

:::info
All ServiceStack project templates which require TypeScript `.ts` or JavaScript `.mjs` DTOs include this Startup Task, so their client DTOs stay synchronized with their server APIs during development without any additional setup.
:::

### Benefits

Previously, after adding or changing a Request DTO, Response DTO or Service, developers needed to manually regenerate client DTOs with:

:::sh
npx get-dtos
:::

Registering the `dtos` Startup Task removes this manual step. Restarting the App is enough to update its local client contracts, which provides:

- Immediate feedback when server contract changes break client code
- Fewer stale DTOs committed to source control
- Consistent DTO options and output across every developer's environment
- No dependency on Node.js or an HTTP request for regeneration
- Less context switching during server and client development

## How DTO generation works

`NativeTypesFeature.GenerateDtos()` provides the same regeneration behavior as `npx get-dtos`, but runs entirely inside the App:

1. Recursively scans the configured directory for recognized `dtos.*` files.
2. Reads the `BaseUrl` and enabled options from each ServiceStack Reference header.
3. Ignores files belonging to a different server.
4. Invokes `NativeTypesService` directly with the equivalent `/types/{lang}` request.
5. Replaces the existing file with the generated DTOs when its contents have changed.

No HTTP request is made. The in-process request uses the same Native Types generators and honors the same uncommented options in the DTO header, e.g:

```text
/* Options:
Date: 2026-08-31 10:00:00
Version: 8.0
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

IncludeTypes: CreateBooking,CreateBookingResponse
//AddServiceStackTypes: True
*/
```

Only existing ServiceStack Reference files are regenerated. `GenerateDtos()` doesn't create references for languages that aren't already present in the scanned directory.

### Supported DTO files

Files can use the standard name or any name ending in a recognized ServiceStack Reference suffix, e.g. both `dtos.ts` and `admin.dtos.ts` are supported:

| Language | File suffix |
| --- | --- |
| C# | `dtos.cs` |
| TypeScript | `dtos.ts` |
| TypeScript declarations | `dtos.d.ts` |
| JavaScript ES modules | `dtos.mjs` |
| Python | `dtos.py` |
| Dart | `dtos.dart` |
| PHP | `dtos.php` |
| Java | `dtos.java` |
| Kotlin | `dtos.kt` |
| Swift | `dtos.swift` |
| F# | `dtos.fs` |
| VB.NET | `dtos.vb` |
| Go | `dtos.go` |
| Ruby | `dtos.rb` |
| Rust | `dtos.rs` |
| Zig | `dtos.zig` |

## BaseUrl safety

As a project can contain DTOs for multiple APIs, a reference is only regenerated when its header `BaseUrl` belongs to the current AppHost.

ServiceStack determines the App's URLs from:

- URLs explicitly added to `GenerateDtosOptions.BaseUrls`
- `NativeTypesFeature.MetadataTypesConfig.BaseUrl`
- `HostConfig.WebHostUrl`
- The addresses the ASP.NET Core server is listening on

Matching includes the URL scheme, port and PathBase. Loopback aliases like `localhost`, `127.0.0.1` and `::1` are treated as the same local host, and wildcard listening addresses can match their corresponding loopback URL.

If none of the App's URLs can be determined, only references using these conventional local development URLs are eligible:

```text
https://localhost:5001
http://localhost:5000
```

The localhost fallback is only used when no configured or listening URL is available. A DTO pointing to another local port, staging server or production server won't be overwritten accidentally.

## Configure DTO generation

Pass `GenerateDtosOptions` to customize where references are found and which directories and URLs are eligible:

```csharp
public class ConfigureGeneratedDtos : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(afterAppHostInit: appHost => {
            var options = new GenerateDtosOptions {
                Directory = appHost.MapProjectPath("~/Client"),
                BaseUrls = ["https://api.example.test"],
            };
            options.IgnoreDirectories.Add("storybook-static");

            StartupTasks.Register("dtos", () =>
                appHost.GetPlugin<NativeTypesFeature>().GenerateDtos(options));
        });
}
```

| `GenerateDtosOptions` | Description |
| --- | --- |
| `Directory` | Physical directory to recursively scan. Defaults to the AppHost project content root. |
| `IgnoreDirectories` | Directory names excluded from the scan. Add project-specific build or generated folders here. |
| `BaseUrls` | Additional absolute URLs considered to belong to this AppHost, useful for public or reverse-proxy URLs. |
| `FallbackBaseUrls` | URLs accepted only when the App's configured or listening URL can't be determined. Defaults to the standard HTTPS and HTTP localhost URLs. |
| `SkipUnchanged` | Avoids writing files when only the generated `Date` header changed. Defaults to `true`. |

The default ignored directory names are:

```text
.git, .vscode, .idea, node_modules, bin, obj, dist, build, .venv,
packages, gradle, dart_tool, vendor
```

`IgnoreDirectories` is initialized with these defaults. Use `Add()` to append an exclusion, as in the example above. Assign a new list when you want to replace the defaults completely.

### Avoiding restart loops

Native Types references include a generated `Date` header. If the generated DTOs are otherwise identical, `SkipUnchanged` prevents the file from being written just to update its timestamp.

This avoids unnecessary client rebuilds and prevents file-watching development tools from restarting the App continuously when its API contract hasn't changed.

## Generation results

`GenerateDtos()` returns a `GenerateDtosResult` which can be used by custom Startup Tasks or tooling to inspect what happened:

```csharp
var result = appHost.GetPlugin<NativeTypesFeature>()
    .GenerateDtos(new GenerateDtosOptions {
        Directory = appHost.MapProjectPath("~/Client"),
    });

log.LogInformation("Updated {Count} DTO references", result.Updated.Count);
```

| `GenerateDtosResult` | Description |
| --- | --- |
| `Directory` | Full physical directory that was scanned. |
| `Scanned` | Number of recognized DTO files inspected. |
| `Updated` | Files whose generated DTOs changed and were rewritten. |
| `Unchanged` | Files already synchronized with the server. |
| `Skipped` | Files not regenerated, together with the reason, such as a different `BaseUrl` or invalid reference header. |
| `Errors` | Files or directories that couldn't be processed, together with their error message. |

Each file is processed independently. An invalid or inaccessible reference is reported without preventing other matching DTOs from being regenerated.

## Registering other Startup Tasks

`StartupTasks` can run any parameterless development task which requires a fully started App:

```csharp
StartupTasks.Register("search-index", () =>
    appHost.Resolve<SearchIndexer>().Update());
```

Every registered Startup Task runs once after application startup when `DebugMode` is enabled. Exceptions are logged and isolated so one task doesn't prevent the remaining tasks from running or stop the App from starting.

Use [App Tasks](/app-tasks) instead when a task should be explicitly invoked from the command-line, receive arguments, return an exit status and stop the App after it completes.
