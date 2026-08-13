---
title: Tools
---

AI Chat has a single **Tool Registry** shared by chat models, custom extensions, ServiceStack Commands, [API Tools](/chat/api-tools) and the [MCP Server](/chat/mcp). Tools are described with JSON Schema, grouped for selection, and rendered as compact expandable calls in conversation history.

<screenshot src="/img/pages/chat/tools/llm-tool-call.webp" title="A tool call rendered in conversation history"></screenshot>

## Configuration

```csharp
services.AddPlugin(new ChatFeature {
    Tools = {
        EnableApiTools = true,          // on by default
        EnableFilesystemTools = false,  // off by default
        EnableCodeExecution = false,    // off by default
        AllowedDirectories = [],
        ToolTimeout = TimeSpan.FromSeconds(60),
    },
});
```

| Property | Default | Description |
| --- | --- | --- |
| `EnableApiTools` | `true` | Let Models discover and call the App's own ServiceStack APIs |
| `EnableFilesystemTools` | `false` | The `computer` extension's read/write/edit/search/list tools |
| `EnableCodeExecution` | `false` | `run_bash` and the `core_tools` `run_*` tools |
| `AllowedDirectories` | `[]` | Directories filesystem and code tools may access |
| `ToolTimeout` | `60s` | Per tool-call timeout |

:::warning
`EnableFilesystemTools` and `EnableCodeExecution` give a Model the ability to read, write and execute on your server. They are **off by default** and should stay off unless you've deliberately scoped them with `AllowedDirectories` and [Projects](/chat/projects). A web host is not a localhost sandbox.
:::

## Tool groups

Every tool belongs to a group, defaulting to the name of the extension that registered it. Groups are what users toggle in the tools panel and what the host names when exposing tools over MCP.

| Group | Tools |
| --- | --- |
| `core_tools` | `get_current_time`, `calc`, and the `run_*` code execution tools |
| `computer` | `run_bash` |
| `filesystem` | Read, write, edit, move, search and list files |
| `api_tools` | `api_search`, `api_describe`, `api_call` |
| *your extension* | Whatever it registers |

A tool selector is `"all"`, `"none"`, or a comma-separated list of tool **or** group names:

```csharp
var tools = feature.Tools.SelectTools("api_tools,booking_summary");
```

## Built-in tools

### Always available

| Tool | Description |
| --- | --- |
| `get_current_time` | Current date/time, so a Model doesn't guess |
| `calc` | Arithmetic and expression evaluation |
| `skill` | Load a [Skill](/chat/skills)'s detailed instructions on demand |

### Filesystem tools — opt-in

Ported from Anthropic's Filesystem MCP server. Every path is validated against the user's resolved allowed directories before use, and `edit_file` returns a unified diff of what changed.

```csharp
Tools = {
    EnableFilesystemTools = true,
    AllowedDirectories = ["/srv/workspaces"],
}
```

The desktop-only tools (screen control, window management) aren't ported — they don't apply to a web host.

### Code execution — opt-in

```csharp
Tools = {
    EnableCodeExecution = true,
}
```

Enables `run_bash` (a fresh shell per invocation, running in the first allowed directory) and the `core_tools` `run_*` language runners. Execution is bounded by `ulimit -t` CPU seconds and an address-space cap.

:::info
When [Projects](/chat/projects) is installed, the active project's folder **replaces** the user's allowed directories — so filesystem and code tools operate inside a per-user workspace rather than anywhere on the server.
:::

### Provider-hosted server tools

Some providers expose their own capabilities — web search, web fetch, code execution. AI Chat surfaces whichever the selected provider advertises, generating the configuration UI from the tool's JSON Schema and passing the resulting definitions to the Model.

## Registering your own tools

The full API is covered in [Custom Extensions](/chat/custom-extensions). In short:

```csharp
public class BookingToolsExtension() : ChatExtension("booking_tools")
{
    public override void Install(ExtensionContext ctx)
    {
        // a ServiceStack Command becomes a tool: its request type is the JSON Schema
        ctx.RegisterTool<BookingSummaryCommand>("bookings");

        // or supply the OpenAI function definition directly
        ctx.RegisterTool(definition, HandlerAsync, group: "bookings",
            safety: ToolSafety.ReadOnly);
    }
}
```

## Tool safety

`ToolSafety` classifies how much damage a call can do, which determines whether an Agent may make it unattended:

| Value | Meaning |
| --- | --- |
| `Auto` *(default)* | Inferred from the API's HTTP verb — GET/HEAD is read-only, DELETE is destructive, everything else is a write |
| `ReadOnly` | Only reads data. Safe to call unattended and safe to retry |
| `Write` | Creates or updates data. Recoverable, but retrying may duplicate the change |
| `Destructive` | Deletes data or triggers a real-world side effect. Should require approval |

```csharp
[Tool("the user has finished choosing an order and wants to place it",
    Safety = ToolSafety.Write,
    RequiresApproval = true)]
public class CreateCoffeeShopOrder : IPost, IReturn<CreateCoffeeShopOrderResponse> { }
```

Set `Safety` explicitly when the verb lies about the consequences — a POST that only runs a report is `ReadOnly`; a POST that emails every customer is `Destructive`.

## Human approval

Reads execute immediately. Writes and destructive operations pause and render an **editable, schema-generated approval form** in the Chat UI, so the user sees the exact request that will be sent and can correct it before approving.

<screenshot src="/img/pages/chat/api-approval.webp" title="Schema-generated approval form for a proposed tool call"></screenshot>

No tool-specific Chat component has to be written — the form comes from the tool's own JSON Schema, so every tool you add later gets the same treatment. See [API Schemas](/releases/v10_01#api-schemas) for how that rendering works.

Approvals are durable: a paused call survives a page reload, and the Model is told afterwards whether the user approved the proposal as-is or modified it.

## Executing a tool directly

The `tools` extension exposes the registry to the UI and can run a tool outside a conversation:

<text-block :rows="[
  ['GET  /chat/ext/tools','List registered tool groups and definitions'],
  ['POST /chat/ext/tools/exec/{name}','Execute a tool directly'],
  ['GET  /chat/ext/tools/server','Provider-hosted server tools config']]"></text-block>

<screenshot src="/img/pages/chat/tools/tools-exec-results.webp" title="Executing a tool directly from the tools panel"></screenshot>

## Limiting tools per Agent Profile

An [Agent Profile](/chat/agents) can restrict which tools and skills are available to it, reducing both risk and model confusion:

```json
{
  "theme": "nord",
  "model": "GLM-5.2",
  "onlyTools": ["api_tools", "booking_summary"],
  "onlySkills": ["incident-response"]
}
```

<screenshot src="/img/pages/chat/profiles/profile-tools.webp" title="Restricting the tools available to an Agent Profile"></screenshot>

## Bounding the tool loop

`Limits.MaxIterations` (default `10`) caps how many tool-call rounds one completion may run. Raise it for long multi-step workflows, lower it to bound cost:

```csharp
services.AddPlugin(new ChatFeature {
    Limits = { MaxIterations = 20 },
});
```
