---
title: ChatFeature Configuration
---

Every AI Chat capability is configured from a single `ChatFeature` plugin registration. Extension-specific options are reached through the extension properties it exposes (`Tools`, `ApiTools`, `Mcp`, `Publish`, `Pdf`, …), so a complete configuration reads as one object graph.

```csharp
services.AddPlugin(new ChatFeature {
    RequireAuth = true,
    RequiredRole = "Employee",
    AuthType = ChatAuthType.Credentials,

    DisableExtensions = ["computer", "publish"],

    Tools = {
        EnableApiTools = true,
        EnableFilesystemTools = false,
        EnableCodeExecution = false,
    },
    ApiTools = {
        IncludeTags = ["CoffeeShop", "Bookings"],
    },
    Mcp = {
        ToolGroups = ["api_tools"],
    },

    Setup = ctx => {
        // runs after config + providers are created, before extensions install
    },
});
```

## Hosting

| Property | Default | Description |
| --- | --- | --- |
| `RoutePrefix` | `"/chat"` | Path the Chat UI + APIs are mounted at. `""` mounts at the site root |
| `RequireAuth` | `true` | When false everything runs as the `"default"` user without authentication |
| `RequiredRole` | `null` | Only users in this role can access the Chat UI + APIs |
| `AuthType` | `Credentials` | How the UI signs users in — see [Integrated Auth](/chat/auth) |
| `SignInUrl` | `"/Account/Login"` | Identity login page the UI redirects to when `AuthType = OAuth` |
| `AppDataPath` | `~/App_Data/chat` | Root of AI Chat's file storage |
| `AutoInitSchema` | `true` | Create the OrmLite tables on startup |
| `NamedConnection` | `null` | Use a named OrmLite connection for chat data instead of the default |
| `DisableAdminUi` | `false` | Removes the `/admin-ui/chat` Admin UI and its APIs |
| `SvgIcon` | AI Chat icon | Icon used for the Admin UI link |

### Mounting at the site root

`RoutePrefix = ""` gives full [llms.py](https://llmspy.org) fidelity, serving the Chat UI from `/` — appropriate for a dedicated AI host rather than an App with its own pages:

```csharp
services.AddPlugin(new ChatFeature { RoutePrefix = "" });
```

## Extensions

| Property | Default | Description |
| --- | --- | --- |
| `DisableExtensions` | `[]` | Extension names to remove entirely, from server **and** UI |
| `Extensions` | built-ins | The extension list itself — add your own or reorder |
| `InstalledExtensionNames` | — | Read-only list of what actually installed |

```csharp
services.AddPlugin(new ChatFeature {
    // remove the filesystem + run_bash tools completely
    DisableExtensions = ["computer"],

    // add your App's own extension
    Extensions = {
        new BookingToolsExtension(),
    },
});
```

`disable_extensions` in `llms.json` is merged with `DisableExtensions`, so extensions can also be turned off without a redeploy. See [Extensions](/chat/extensions).

### Configuring your own extensions

An extension's configuration is just its own properties, so your extensions are configured **where they're added** — the same object-initializer syntax the built-ins use, one level deeper:

```csharp
services.AddPlugin(new ChatFeature {
    Extensions = {
        new BookingToolsExtension {
            NamedConnection = "reporting",
            DefaultTake = 50,
            IncludeCancelled = false,
        },
    },
});
```

Those values are set before `Install(ctx)` runs, so an extension can read its own configuration while registering its routes and tools:

```csharp
public class BookingToolsExtension() : ChatExtension("booking_tools")
{
    /// <summary>OrmLite connection bookings are read from</summary>
    public string? NamedConnection { get; set; }
    /// <summary>Rows returned when the Agent doesn't specify a limit</summary>
    public int DefaultTake { get; set; } = 25;
    /// <summary>Whether cancelled bookings are counted in summaries</summary>
    public bool IncludeCancelled { get; set; }

    public override void Install(ExtensionContext ctx)
    {
        if (NamedConnection != null)
            ctx.Log.LogInformation("Bookings using {Db}", NamedConnection);

        ctx.RegisterTool<BookingSummaryCommand>("bookings");
    }
}
```

Configuration that has to see the fully-loaded feature belongs in `Setup` instead, which runs after config and providers load but before extensions install:

```csharp
services.AddPlugin(new ChatFeature {
    Extensions = { new BookingToolsExtension() },
    Setup = ctx => {
        ctx.AssertExtension<BookingToolsExtension>().DefaultTake = ctx.ApiTools.DefaultTake;
    },
});
```

See [Custom Extensions](/chat/custom-extensions) for the full `ExtensionContext` API.

## Providers & config

| Property | Default | Description |
| --- | --- | --- |
| `Config` | seeded `llms.json` | The parsed `llms.json` document |
| `ConfigJson` | — | Write-only setter that parses a JSON string into `Config` |
| `ProviderModels` | seeded `providers.json` | The models.dev model catalog |
| `EnableProviders` | `[]` | Force-enable **only** these providers, overriding `llms.json` |
| `Variables` | `[]` | `$VAR` substitutions checked **before** environment variables |
| `ProviderTypes` | built-ins | npm sdk id → provider factory |
| `Providers` | — | The live (enabled + configured) providers |
| `LoadingMessages` | `["Computing", …]` | Words shown while a response streams |

### Update Provider Models

Each ServiceStack release includes the latest `providers.json`. To update the provider catalog between releases, override it with the latest version from the [ServiceStack/llms](https://raw.githubusercontent.com/ServiceStack/llms/refs/heads/main/llms/providers.json) repo.

Run the following command from your application's `App_Data/chat` directory to download and overwrite `providers.json`:

<shell-command>curl -fL https://raw.githubusercontent.com/ServiceStack/llms/refs/heads/main/llms/providers.json -o providers.json</shell-command>

See [Providers & Models](/chat/providers).

## Limits

`Limits` mirrors the `limits` object in `llms.json`:

| Property | Default | Description |
| --- | --- | --- |
| `ClientTimeout` | `120` (`240` in llms.json) | Seconds before a provider request is abandoned |
| `ClientMaxSize` | `20 MB` | Largest response body accepted from a provider |
| `Retries` | `3` | Provider retry attempts before failing over |
| `MaxIterations` | `10` | Maximum tool-call rounds in one completion |
| `StreamCheckpointInterval` | `250ms` | How often an in-flight streamed response is persisted |

```csharp
services.AddPlugin(new ChatFeature {
    Limits = {
        MaxIterations = 20,
        StreamCheckpointInterval = TimeSpan.FromMilliseconds(500),
    },
});
```

`MaxIterations` is the ceiling on an agentic loop: a Model that keeps calling tools stops after this many rounds. Raise it for long multi-step workflows, lower it to bound cost.

## Request hooks

| Property | Description |
| --- | --- |
| `ValidateRequest` | `Func<IRequest, Task<IHttpResult?>>` run before every Chat UI + API request. Return an `IHttpResult` to reject |
| `ValidateDownloadUrl` | `Action<string>` called before downloading a URL referenced in a chat message |
| `UserNamesResolver` | Extra usernames offered in the Admin analytics user filter |
| `Setup` | `Action<ChatFeature>` run after config + providers load, before extensions install |
| `ImageTransformer` | `(bytes, width, height) => webp` hook used for upload downscaling and `?variant=` thumbnails |

```csharp
services.AddPlugin(new ChatFeature {
    ValidateRequest = async req => {
        if (req.GetSession() is { } session && await IsOverQuotaAsync(session.UserAuthId))
            return HttpError.Forbidden("Monthly AI quota exceeded");
        return null;
    },

    // populate the Admin analytics user filter from the App's Identity users
    UserNamesResolver = req => req.Resolve<IDbConnectionFactory>().Open()
        .Column<string>(db.From<ApplicationUser>().Select(x => x.UserName)),
});
```

`Setup` is the escape hatch for configuration that has to see the fully-loaded feature:

```csharp
Setup = ctx => {
    ctx.Mcp.ToolGroups = ["api_tools", "core_tools", "booking_tools"];
    ctx.Tools.ToolTimeout = TimeSpan.FromSeconds(120);
}
```

## Tool sandboxing

| Property | Default | Description |
| --- | --- | --- |
| `Tools.EnableApiTools` | `true` | Let Models discover and call the App's own ServiceStack APIs |
| `Tools.EnableFilesystemTools` | `false` | Read/write/edit/search files within allowed directories |
| `Tools.EnableCodeExecution` | `false` | `run_bash` and the `run_*` code execution tools |
| `Tools.AllowedDirectories` | `[]` | Directories filesystem/code tools may access |
| `Tools.ToolTimeout` | `60s` | Per tool-call timeout |

```csharp
Tools = {
    EnableFilesystemTools = true,
    AllowedDirectories = ["/srv/workspaces"],
}
```

Higher-risk capabilities are opt-in. Filesystem and code execution tools stay unregistered unless the host turns them on — and even then, [Projects](/chat/projects) further narrows each user's reachable directories. See [Tools](/chat/tools).

## AI Chat and the OpenAI API

`ChatFeature` also registers the typed `ChatCompletion` service at `POST /v1/chat/completions` and an in-process `IChatClient`. Both run the same pipeline — provider selection, retry/failover, the tool loop, usage and cost accounting. See [Chat API](/chat/api).

## Full configuration reference

```csharp
services.AddPlugin(new ChatFeature {
    // ── Hosting ──
    RoutePrefix = "/chat",
    RequireAuth = true,
    RequiredRole = null,
    AuthType = ChatAuthType.Credentials,
    SignInUrl = "/Account/Login",
    AppDataPath = null,             // ~/App_Data/chat
    AutoInitSchema = true,
    NamedConnection = null,
    DisableAdminUi = false,

    // ── Extensions ──
    DisableExtensions = [],
    Extensions = { /* built-ins + your own */ },

    // ── Providers ──
    EnableProviders = [],
    Variables = {},
    LoadingMessages = ["Computing", "Cooking", "Crafting", "Creating"],

    // ── Limits ──
    Limits = {
        ClientTimeout = 120,
        ClientMaxSize = 20 * 1024 * 1024,
        Retries = 3,
        MaxIterations = 10,
        StreamCheckpointInterval = TimeSpan.FromMilliseconds(250),
    },

    // ── Extension config ──
    Tools     = { EnableApiTools = true, EnableFilesystemTools = false, EnableCodeExecution = false },
    ApiTools  = { IncludeTags = [], IncludeTypes = [], ExcludeTypes = [], DefaultTake = 25, MaxTake = 100 },
    Mcp       = { ToolGroups = [], Tools = [], RejectToolsRequiringApproval = true },
    Publish   = { Enabled = false },

    // ── Hooks ──
    ValidateRequest = null,
    ValidateDownloadUrl = null,
    UserNamesResolver = null,
    ImageTransformer = null,
    Setup = null,
});
```
