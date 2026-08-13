---
title: Custom Extensions
---

Adding your own capability to AI Chat means writing a `ChatExtension`. It's the same API the built-in extensions use — routes, tools, filters, providers, UI and background workers all register through the `ExtensionContext` passed to `Install`.

```csharp
services.AddPlugin(new ChatFeature {
    Extensions = {
        new BookingToolsExtension(),
    },
});
```

## A minimal extension

```csharp
public class BookingToolsExtension() : ChatExtension("booking_tools")
{
    IDbConnectionFactory dbFactory = null!;

    public override void Install(ExtensionContext ctx)
    {
        // Install() runs after the App's services are available
        dbFactory = ctx.Feature.Services.GetRequiredService<IDbConnectionFactory>();

        // routes are prefixed with /ext/booking_tools automatically
        ctx.AddGet("summary", async req => await GetSummaryAsync(req));

        // register a tool the Chat UI's tool loop can call
        ctx.RegisterTool<BookingSummaryCommand>("bookings");
    }
}
```

The constructor argument is the extension **name**, which becomes:

- its `/ext/{name}` route prefix
- the default group for tools it registers
- the key used in `DisableExtensions`
- the folder its static UI assets are served from

Any public properties you add are its configuration, set where the extension is added and readable from `Install` — see [Configuring your own extensions](/chat/configuration#configuring-your-own-extensions).

## Registering tools

### From a ServiceStack Command

The most concise option: the Command's request type generates the tool's JSON Schema, and calls run through `CommandsFeature` so they're executed, validated, retried and logged like any other command.

```csharp
[Description("Summarise this hotel's room bookings: how many, what they're worth, "
             + "and a breakdown by room type")]
[Tool("the user asks about occupancy or booking revenue",
    Name = "booking_summary", Safety = ToolSafety.ReadOnly)]
public class BookingSummaryCommand(IDbConnectionFactory dbFactory)
    : AsyncCommandWithResult<BookingSummary, BookingSummaryResponse>
{
    protected override async Task<BookingSummaryResponse> RunAsync(
        BookingSummary request, CancellationToken token)
    {
        using var db = await dbFactory.OpenAsync(token: token);
        // ...
    }
}
```

```csharp
ctx.RegisterTool<BookingSummaryCommand>("bookings");
ctx.RegisterTool(typeof(BookingSummaryCommand), "bookings");  // runtime type
```

Document the request type **for the Model**, not for a developer — `[Description]` on each property becomes that argument's schema description, and an enum property becomes its allowed values:

```csharp
public class BookingSummary
{
    [Description("Only count bookings starting on or after this date")]
    public DateTime? From { get; set; }

    [Description("Only count bookings of this room type")]
    public RoomType? Type { get; set; }
}
```

### From a raw function definition

When you need full control of the OpenAI function schema:

```csharp
ctx.RegisterTool(new JsonObject {
    ["type"] = "function",
    ["function"] = new JsonObject {
        ["name"] = "booking_summary",
        ["description"] = "Summarise this hotel's room bookings: how many, what they're "
            + "worth, and a breakdown by room type. Use for questions about occupancy or "
            + "revenue instead of querying bookings one by one.",
        ["parameters"] = new JsonObject {
            ["type"] = "object",
            ["properties"] = new JsonObject {
                ["from"] = new JsonObject {
                    ["type"] = "string",
                    ["description"] = "Only count bookings starting on or after this "
                        + "ISO-8601 date, e.g. '2026-01-01'. Omit for all bookings.",
                },
                ["room_type"] = new JsonObject {
                    ["type"] = "string",
                    ["enum"] = new JsonArray("Single", "Double", "Queen", "Twin", "Suite"),
                    ["description"] = "Only count bookings of this room type",
                },
            },
        },
    },
}, BookingSummaryAsync, group: "bookings", safety: ToolSafety.ReadOnly);
```

Tool handlers receive the arguments the Model chose plus the context it's running in:

```csharp
async Task<object?> BookingSummaryAsync(JsonObject args, ChatContext context)
{
    // context.User is the signed-in user this tool acts for, and context.Request the
    // request it's running under — pass it to a Service Gateway to call APIs as that user
    using var db = await dbFactory.OpenAsync();

    var q = db.From<Booking>().Where(x => x.Cancelled == null || x.Cancelled == false);
    if (DateTime.TryParse(args.GetString("from"), out var from))
        q.And(x => x.BookingStartDate >= from);

    var bookings = await db.SelectAsync(q);

    // keep results small and pre-digested: an Agent pays for every row in its context window
    return new {
        Total = bookings.Count,
        TotalCost = bookings.Sum(x => x.Cost),
        Bookings = bookings.Map(x => new { x.Id, x.Name, x.RoomNumber, x.Cost }),
    };
}
```

Return a `string` to pass it through verbatim, or any object to send the Model its JSON.

`RegisterTool` also accepts an `approvalHandler` for tools that should pause for user confirmation, and an `outputSchema` describing the result.

## Routes

Route paths are automatically prefixed with `/ext/{name}`; a leading `/` escapes the prefix:

```csharp
ctx.AddGet("summary", handler);          // /chat/ext/booking_tools/summary
ctx.AddPost("book", handler);            // /chat/ext/booking_tools/book
ctx.AddGet("/transcribe", handler);      // /chat/transcribe
ctx.AddGet("public", handler, allowAnon: true);
```

`AddGet`, `AddPost`, `AddPut`, `AddDelete` and `AddPatch` are available. Routes require an authenticated request satisfying `RequireAuth` + `RequiredRole` unless they opt out with `allowAnon` — which should only be used for what the UI genuinely needs before sign-in.

Handlers receive a `ChatRequestContext`:

```csharp
async Task<object?> GetSummaryAsync(ChatRequestContext req)
{
    var user = req.UserName;                        // signed-in user
    var id = req.GetPathParam("id");                // route parameter
    var body = await req.GetJsonBodyAsync();        // POST body
    var file = req.Request.Files.FirstOrDefault();  // multipart upload
    return new { ok = true };
}
```

Return a `JsonObject`, any serializable object, or a `ChatResult` for explicit status codes.

## Pipeline filters

Filters let an extension observe or modify a completion as it runs:

```csharp
public override void Install(ExtensionContext ctx)
{
    ctx.RegisterChatRequestFilter(async (chat, context) => {
        // mutate the outgoing OpenAI request, e.g. inject a system prompt
    });

    ctx.RegisterChatResponseFilter(async (response, context) => {
        // observe the completed response
    });

    ctx.RegisterChatErrorFilter(async (ex, context) => {
        Log.LogError(ex, "Chat failed for {User}", context.User);
    });
}
```

| Filter | Signature | Fires |
| --- | --- | --- |
| `RegisterChatRequestFilter` | `(JsonObject chat, ChatContext)` | Before the provider request |
| `RegisterChatToolFilter` | `(JsonObject toolCall, ChatContext)` | Around each tool call |
| `RegisterChatApprovalFilter` | `(JsonObject, ChatContext)` | When a call needs approval |
| `RegisterChatStatusFilter` | `(string status, ChatContext)` | On status updates |
| `RegisterChatResponseFilter` | `(JsonObject response, ChatContext)` | After a completion |
| `RegisterChatErrorFilter` | `(Exception, ChatContext)` | On failure |
| `RegisterCacheSavedFilter` | `(CacheSavedContext)` | When bytes are written to the cache |
| `RegisterSetupUserHandler` | `(IRequest)` | First request from each user |
| `RegisterShutdownHandler` | `()` | AppHost disposal |

The `gallery` extension is a good example: it records every cache write as a `ChatMedia` row using nothing but a `RegisterCacheSavedFilter`.

## Files, prefs and the cache

All paths live under `App_Data/chat`:

```csharp
ctx.GetHomePath("my-config.json");        // App_Data/chat/my-config.json
ctx.GetUserPath(user);                    // App_Data/chat/user/{user}
ctx.GetCachePath();                       // App_Data/chat/cache

var prefs = ctx.GetUserPrefs(user);
ctx.SetUserPref("myFeature.enabled", true, user);
var value = ctx.GetUserPref("myFeature.enabled", user);

// write bytes to the content-addressed cache, firing the cache_saved filters
var info = ctx.SaveToCache(bytes, "chart.png", "image/png", user);
```

## Auth helpers

```csharp
ctx.IsAuthEnabled;                 // whether RequireAuth is on
ctx.GetUserName(request);          // null when anonymous
ctx.AssertUserName(request);       // throws when anonymous
ctx.IsAdmin(request);              // true for everyone when auth is disabled
ctx.CheckAuth(request);            // (IsAuthenticated, Session)
```

## Calling the Model from an extension

```csharp
var response = await ctx.ChatCompletionAsync(chat, context);
```

Plus helpers for working with the OpenAI message shape:

```csharp
ctx.LastUserPrompt(chat);
ctx.ChatToSystemPrompt(chat);
ctx.ChatToAspectRatio(chat);
ctx.ChatResponseToMessage(response);
ctx.NextLoadingMessage();
```

## Cross-extension APIs

Extensions publish pluggable interfaces so others don't need a direct reference:

```csharp
ctx.Threads;    // IThreadApi   — provided by the app extension
ctx.Media;      // IMediaApi    — provided by the gallery extension
ctx.Projects;   // IProjectsApi — provided by the projects extension
```

Assigning to them installs your own implementation, which is exactly how `GalleryExtension` registers itself as `IMediaApi`.

## Adding UI

Two options:

**1. Embedded resources.** Ship a `chat/ext/{name}/` folder of embedded files. AI Chat serves them at `/{RoutePrefix}/ext/{name}/{path}` automatically, and if the folder contains an `index.mjs` it's registered in `/ext` so the Chat UI imports it on load.

**2. The `custom` folder.** `chat/custom/**` is served at `/{RoutePrefix}/custom/**` and is never touched by an upstream UI sync — the intended home for an App's own Chat UI code.

```csharp
ctx.RegisterUiExtension();                     // imports /ext/{name}/index.mjs
ctx.RegisterUiExtension("/custom/index.mjs");  // leading '/' escapes the prefix

ctx.AddImportMaps(new() {
    ["my-lib"] = "/custom/lib/my-lib.mjs",
});

ctx.AddIndexHeader("""<link rel="stylesheet" href="/chat/custom/app.css">""");
ctx.AddIndexFooter("<!-- analytics -->");
```

Because the UI is assembled from registered Vue components, registering a component under an existing name replaces that building block — which is how an App rebrands or specializes the experience without forking.

## Disabling from inside Install

Set `ctx.Disabled` when a prerequisite is missing. The extension is skipped and nothing it registered is kept:

```csharp
public override void Install(ExtensionContext ctx)
{
    if (ProcessUtils.FindExePath("mytool") == null)
    {
        Log.LogInformation("mytool not found, extension disabled");
        ctx.Disabled = true;
        return;
    }
    // ...
}
```

## Async initialization

`LoadAsync` runs after every extension has installed, concurrently:

```csharp
public override async Task LoadAsync(ExtensionContext ctx, CancellationToken token = default)
{
    await warmupCache.LoadAsync(token);
}
```

## Exposing your tools over MCP

Once registered, a tool group can be published to external AI Assistants by naming it:

```csharp
services.AddPlugin(new ChatFeature {
    Extensions = { new BookingToolsExtension() },
    Mcp = {
        ToolGroups = ["api_tools", "bookings"],
    },
});
```

See [MCP Server](/chat/mcp).
