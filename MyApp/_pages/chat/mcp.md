---
title: MCP Server
---

AI Chat includes a built-in **Model Context Protocol** server that exposes selected Chat tools to external AI Assistants - Claude Code, Cursor, VS Code, OpenCode and any other MCP-compatible client.

<text-block text="https://your-app.example.com/chat/mcp"></text-block>

## Enabling it

Nothing is exposed until the host names something:

```csharp
services.AddPlugin(new ChatFeature {
    Mcp = {
        ToolGroups = ["api_tools"],
    },
});
```

| Property | Default | Description |
| --- | --- | --- |
| `ToolGroups` | `[]` | Tool groups to expose, e.g. `"api_tools"`, `"core_tools"`. Empty disables the endpoint |
| `Tools` | `[]` | Individual tools to expose, in addition to whole groups |
| `ServerName` | assembly name | Server name reported to MCP Clients in `initialize` |
| `ServerVersion` | ServiceStack version | Server version reported to MCP Clients |
| `Instructions` | `null` | Optional usage hint Clients can add to their system prompt |
| `RejectToolsRequiringApproval` | `true` | Refuse tools that need ServiceStack's interactive approval UI |
| `MaxInlineResourceBytes` | `4 MB` | Largest image/audio result inlined as base64 |

`IsEnabled` reports whether anything is exposed; with both lists empty the endpoint isn't registered at all.

```csharp
Mcp = {
    ToolGroups = ["api_tools", "bookings"],
    Tools = ["get_current_time"],
    ServerName = "Acme Operations",
    Instructions = "Use api_search first to find the right API before calling it.",
}
```

## Transport

Streamable HTTP, run **stateless**: every request is a self-contained JSON-RPC POST answered with JSON. There's no SSE stream and no `Mcp-Session-Id`, which a tools-only server doesn't need - there's no server-initiated message to deliver and nothing to keep between calls.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/chat/mcp` | JSON-RPC messages |
| `GET` | `/chat/mcp` | Capability probe |
| `DELETE` | `/chat/mcp` | Session teardown (no-op when stateless) |

Protocol revision `2025-06-18` is offered, negotiating down to earlier supported revisions when a Client asks for one.

## Authentication

MCP Clients authenticate with a **ServiceStack API key** in the Bearer token. `ChatFeature.OnRequestAsync` resolves it onto the request, so tools execute against your APIs with **that user's** access rather than as the App itself.

```json
{
  "type": "remote",
  "url": "https://your-app.example.com/chat/mcp",
  "oauth": false,
  "headers": {
    "Authorization": "Bearer {env:MY_APP_API_KEY}"
  }
}
```

This works with ServiceStack's [ASP.NET Core API Key Feature](/auth/apikeys), which lets you create and manage API keys per user, each scoped with specific roles, permissions and expiry dates:

```csharp
services.AddPlugin(new ApiKeysFeature());
```

<screenshot src="/img/pages/chat/api-tools/opencode-mcp.webp" title="OpenCode connected to a ServiceStack MCP Server"></screenshot>

## Registering with a client

Most MCP clients take a single command or a small JSON block. For example:

<text-block text="/mcp add coffeeshop --url https://your-app.example.com/chat/mcp --token ak-xxxx"></text-block>

Once registered, the client discovers the available tools and lists them alongside its other MCP servers:

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Discovered MCP tools': '/img/pages/chat/api-tools/omp-mcp-list.webp',
    'Tool list': '/img/pages/chat/api-tools/omp-tools.webp',
}"></screenshots-gallery>

<screenshot src="/img/pages/chat/tools/mcp-add.webp" title="Adding an MCP Server"></screenshot>

## What the server publishes

For each exposed tool the server publishes:

- Its input JSON Schema (the same OpenAI function schema the Chat UI uses)
- Its output schema, where one was registered
- Structured results
- Safety annotations derived from `ToolSafety`

Images and audio are inlined as base64 when small enough - an external Agent has no session with your App, so a link to its cache may be unfetchable. Anything above `MaxInlineResourceBytes` is returned as a resource link instead: an Agent can't stream a 40MB wav through its context.

## Approval across the MCP boundary

The built-in Chat UI can pause execution and render ServiceStack's editable approval form. A generic MCP client cannot render or resume that server UI, so MCP uses an explicit boundary policy.

By default `RejectToolsRequiringApproval = true` **fails closed**: if a tool would require interactive approval, the MCP call is refused before execution.

An application using a trusted MCP client with its own confirmation system can delegate that decision:

```csharp
Mcp = {
    ToolGroups = ["api_tools"],
    RejectToolsRequiringApproval = false,
}
```

In this mode ServiceStack publishes the tool's read-only/write/destructive safety annotations and the MCP client is expected to ask the user before allowing the call.

:::info
API authorization and DTO validation are **never** disabled by this setting. Only responsibility for the interactive approval decision moves to the trusted client.
:::

## Model-agnostic by design

Because MCP is model-agnostic, the same ServiceStack endpoint works regardless of which model powers the assistant. The same CoffeeShop workflow completes under very different model families, each discovering the menu, previewing the order and placing it through the same `api_search`, `api_describe` and `api_call` tools:

<screenshot src="/img/pages/chat/api-tools/omp-coffeeshop.webp" title="The same MCP workflow under a different model family"></screenshot>

## Exposing your own tools

Any tool group in the shared [Tool Registry](/chat/tools) can be published, including groups registered by your own extensions:

```csharp
services.AddPlugin(new ChatFeature {
    Extensions = { new BookingToolsExtension() },
    Mcp = {
        ToolGroups = ["api_tools", "bookings"],
    },
});
```

See [Custom Extensions](/chat/custom-extensions) for registering tools.

<screenshot src="/img/pages/chat/tools/mcp-servers.webp" title="MCP servers configured in an AI Assistant"></screenshot>

## Deployment checklist

- Register `ApiKeysFeature` and issue a scoped key per client or per user.
- Name only the tool groups external Assistants should reach.
- Leave `RejectToolsRequiringApproval = true` unless the client has its own confirmation UI.
- Keep `[Tool(Safety)]` accurate - it's what an MCP client uses to decide whether to prompt.
- Remember the key's user is the identity every call runs as: scope its roles accordingly.
