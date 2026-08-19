---
title: Connect MCP Clients
---

MCP clients can register a ServiceStack MCP server via a single CLI command or by configuring their respective MCP settings.

## Claude Code

Add via the Claude Code CLI:

<copy-block>
claude mcp add --transport http coffeeshop https://example.org/chat/mcp --header "Authorization: Bearer ak-xxxx"
</copy-block>

Or configure directly in `~/.claude.json`:

<view-json>
{
  "mcpServers": {
    "coffeeshop": {
      "url": "https://example.org/chat/mcp",
      "headers": {
        "Authorization": "Bearer ak-xxxx"
      }
    }
  }
}
</view-json>

<screenshot-toggle :images="{
    'Browse Menu': '/img/pages/chat/mcp/claude-coffeeshop-menu.webp',
    'Order Preview': '/img/pages/chat/mcp/claude-order-preview.webp',
    'Order Confirmed': '/img/pages/chat/mcp/claude-order-confirmed.webp',
}"></screenshot-toggle>

## Claude Desktop

Claude Desktop connects to remote MCP servers using `mcp-remote` configured in `claude_desktop_config.json` 
- Windows: `~/Library/Application Support/Claude/claude_desktop_config.json`
- macOS: `%APPDATA%\Claude\claude_desktop_config.json`

<view-json>
{
  "mcpServers": {
    "coffeeshop": {
      "command": "npx",
      "args": [
        "mcp-remote@latest",
        "https://macbook.raptor-elver.ts.net/chat/mcp",
        "--header",
        "Authorization: Bearer ${AUTH_TOKEN}"
      ],
      "env": {
        "AUTH_TOKEN": "ak-3dcd3567656f49fbb5a791a35e464567"
      }
    }
  }
}
</view-json>

<screenshot-toggle :images="{
    'Browse Menu': '/img/pages/chat/mcp/claude-desktop-coffeeshop-menu.webp',
    'Order Preview': '/img/pages/chat/mcp/claude-desktop-order-preview.webp',
    'Order Confirmed': '/img/pages/chat/mcp/claude-desktop-order-confirmed.webp',
}"></screenshot-toggle>

## Codex

Add via the Codex CLI:

<copy-block>
codex mcp add coffeeshop https://example.org/chat/mcp --header "Authorization: Bearer ak-xxxx"
</copy-block>

Or configure in `~/.codex/config.toml`:

```toml
[mcp_servers.coffeeshop]
url = "https://example.org/chat/mcp"
http_headers = { "Authorization" = "Bearer ak-xxxx" }
```

<screenshot-toggle :images="{
    'Browse Menu': '/img/pages/chat/mcp/codex-coffeeshop-menu.webp',
    'Order Preview': '/img/pages/chat/mcp/codex-order-preview.webp',
    'Order Confirmed': '/img/pages/chat/mcp/codex-order-confirmed.webp',
}"></screenshot-toggle>

## Open Code

Configure in `opencode.json` (or `.opencode/mcp.json`):

<view-json>
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "coffeeshop": {
      "type": "remote",
      "url": "https://example.org/chat/mcp",
      "headers": {
        "Authorization": "Bearer ak-xxxx"
      }
    }
  }
}
</view-json>

<screenshot-toggle :images="{
    'Browse Menu': '/img/pages/chat/mcp/opencode-coffeeshop-menu.webp',
    'Order Preview': '/img/pages/chat/mcp/opencode-order-preview.webp',
    'Order Confirmed': '/img/pages/chat/mcp/opencode-order-confirmed.webp',
}"></screenshot-toggle>

## Antigravity

Configure in `~/.gemini/antigravity/mcp_config.json` or `.gemini/mcp.json`:

<view-json>
{
  "mcpServers": {
    "coffeeshop": {
      "url": "https://example.org/chat/mcp",
      "headers": {
        "Authorization": "Bearer ak-xxxx"
      }
    }
  }
}
</view-json>

Or configure via the Antigravity IDE UI under **Settings > MCP Servers**.

<screenshot-toggle :images="{
    'MCP Settings': '/img/pages/chat/mcp/claude-desktop-mcp-connected.webp',
    'Browse Menu': '/img/pages/chat/mcp/anitgravity-coffeeshop-menu.webp',
    'Order Preview': '/img/pages/chat/mcp/antigravity-order-preview.webp',
    'Order Confirmed': '/img/pages/chat/mcp/antigravity-order-confirmed.webp',
}"></screenshot-toggle>

## ZCode

Configure in `~/.zcode/cli/config.json`:

<view-json>
{
  "mcp": {
    "servers": {
      "coffeeshop": {
        "type": "http",
        "url": "http://localhost:5000/chat/mcp",
        "headers": {
          "Authorization": "Bearer ak-xxxx"
        }
      }
    }
  }
}
</view-json>

<screenshot-toggle :images="{
    'Browse Menu': '/img/pages/chat/mcp/zcode-coffeeshop-menu.webp',
    'Order Preview': '/img/pages/chat/mcp/zcode-order-preview.webp',
    'Order Confirmed': '/img/pages/chat/mcp/zcode-order-confirmed.webp',
}"></screenshot-toggle>

## Oh My Pi

Register from the prompt:

<copy-block>
/mcp add coffeeshop --url https://example.org/chat/mcp --token ak-xxxx
</copy-block>

Once registered, the client discovers the available tools and lists them alongside its other MCP servers:

<screenshot-toggle :images="{
    'Discovered Tools': '/img/pages/chat/api-tools/omp-mcp-list.webp',
    'Tool List': '/img/pages/chat/api-tools/omp-tools.webp',
    'Browse Menu': '/img/pages/chat/mcp/omp-coffeeshop-menu.webp',
    'Order Preview': '/img/pages/chat/mcp/omp-order-preview.webp',
    'Order Confirmed': '/img/pages/chat/mcp/omp-order-confirmed.webp',
}"></screenshot-toggle>


### Troubleshooting

:::tip Local Development
For local development, many MCP clients won't accept .NET's self-signed development HTTPS certificate.
:::

Workarounds include:

- Connecting to the plaintext HTTP endpoint instead:

<copy-block>
claude mcp add --transport http coffeeshop http://localhost:5000/chat/mcp --header "Authorization: Bearer ak-xxx"
</copy-block>

- Using [Tailscale Funnel](https://tailscale.com/kb/1223/funnel) to expose your local port with a trusted TLS certificate:

<copy-block>
tailscale funnel 5000
</copy-block>
