---
title: MCP Clients
---

AI Chat can connect to **remote Model Context Protocol (MCP) servers** and use their tools in a
conversation. A user can add a personal connection in the Tools page; a host can provide shared
connections. Discovered tools appear alongside [API Tools](/chat/api-tools) and other
[Chat tools](/chat/tools), with per-call review before execution.

This is the **outbound** MCP client. The separate [MCP Server](/chat/mcp_server) publishes your App's tools to
external assistants. Enabling either feature does not enable the other, and remote tools are not
automatically republished through your App's MCP endpoint.

<screenshot src="/img/pages/chat/mcp_client/mcp_client-01-tools.webp" title="MCP Connections alongside the built-in MCP Server and conversation tools"></screenshot>

## Enable MCP connections

The C# `McpClientExtension` is opt-in. Enable it on `ChatFeature` before registering the plugin:

```csharp
services.AddPlugin(new ChatFeature {
    McpClient = {
        Enabled = true,
    },
});
```

An enabled client with no connections does not contact a remote server. Connections are made when a
user connects one or a conversation needs its tools. Personal connections require an authenticated
Chat host. Bearer tokens and OAuth credentials require ASP.NET Core Data Protection with **persistent
keys**; instances serving the same users must share those keys and the Chat database. OAuth also
requires a host-configured callback URL, described [below](#connect-with-oauth).

## Add a connection in the UI

Open **Tools → MCP Connections → Add connection**. Give the server a name and its Streamable HTTP URL,
choose **Authentication**, then select **Connect**. For a server with no credentials, leave
Authentication at **None**. The connection's status and discovered tools appear on the same page.

Personal connections belong to the signed-in user. Host-provided connections are marked **Shared**;
users can connect and select their tools, while the host controls their settings. Personal connections
can be edited or removed with **Settings** and **Connection options**.

### Connect with a Bearer token

For GitHub's hosted MCP server:

1. Set **Name** to `GitHub` and **Server URL** to `https://api.githubcopilot.com/mcp/`.
2. Select **Bearer token / personal access token** under Authentication.
3. Paste your GitHub PAT into **Bearer token**, without the `Bearer ` prefix, and select **Connect**.
4. Open **Tools** on the connected server and choose the tools for your conversation.

<screenshot src="/img/pages/chat/mcp_client/mcp_client-02-add-connection-bearer-token.webp" title="Add the GitHub MCP server with a personal access token"></screenshot>

AI Chat sends the token as `Authorization: Bearer <token>`. The token is encrypted in the host's
credential store, scoped to this account and connection, and is **not** written into `config.json` or
returned to the browser. When editing a connection, leave the token field blank to retain the saved
token; enter a new one to rotate it. A settings change may require you to enter it again. **Clear saved
credentials** deletes the stored token; **Disable** retains it. Tokens that expire or are revoked must
be replaced in Settings.

### Connect with OAuth

OAuth requires a client registered with the provider. Configure the callback URL on the host, using
the public HTTPS URL that the browser will return to:

```csharp
services.AddPlugin(new ChatFeature {
    McpClient = {
        Enabled = true,
        OAuthRedirectUri = new Uri("https://chat.example.com/chat/ext/mcp_client/oauth/callback"),
    },
});
```

The Chat host must require sign-in and use persistent Data Protection keys. Register an OAuth App
with the remote provider using the **exact callback URL** shown in the connection form. Then add an
MCP connection with Authentication set to **OAuth**, supplying the registered **Client ID**.
The connection requests scopes advertised by the MCP server automatically. Advanced OAuth settings
can supply fallback scopes if the server advertises none. The sign-in provider is discovered from the MCP
server URL. If the server advertises more than one, choose the provider where you registered your App.
Only servers without discovery metadata need an **Issuer URL** in Advanced OAuth settings. Supply a
**Client secret** when the provider requires one; it is stored encrypted, not in the connection JSON.

For GitHub's hosted MCP server, use `https://api.githubcopilot.com/mcp/` as the Server URL. The
connection discovers GitHub's authorization server automatically. A GitHub OAuth App needs a client ID and secret.
Register the callback URL displayed by your Chat host with that App. GitHub's hosted MCP server
does not dynamically register the OAuth client for you.

<screenshot src="/img/pages/chat/mcp_client/mcp_client-09-add-connection-oauth.webp" title="Configure GitHub OAuth with a registered client, secret and callback URL"></screenshot>

Select **Connect**, open the provider's sign-in page, and authorize the App. On success, the sign-in
page attempts to close and the Tools page loads the connection's tools. If the browser keeps the tab
open, select **Close this tab**; use **Load tools** on the Tools page if it has not refreshed yet.
If an existing connection reports `access_denied`, choose **Reauthorize** under its Connection
options and grant the requested access at the provider.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Authorize the OAuth App': '/img/pages/chat/mcp_client/mcp_client-10-oauth-signin.webp',
    'Connected OAuth tools': '/img/pages/chat/mcp_client/mcp_client-11-oauth-connected-show-tools.webp',
}"></screenshots-gallery>

Clearing credentials removes the saved OAuth tokens but keeps the encrypted client secret so the
account can sign in again. Removing or reconfiguring the connection clears that secret; an edited
connection may need it to be entered again. Revoking the provider's authorization is a separate
action in the provider's account settings. A host restart during an in-progress sign-in requires a
new sign-in attempt.

## Choose tools for a conversation

Select **Tools** on a connected server to inspect its discovered tools and input schemas. Search by
name or description, select individual tools, or use **Select all results** to select everything in
the current filtered search. The chosen tools become available to the model in that conversation.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Search the connected server catalog': '/img/pages/chat/mcp_client/mcp_client-04-connected-filter-tools.webp',
    'Select all matching tools': '/img/pages/chat/mcp_client/mcp_client-05-connected-select-tools.webp',
}"></screenshots-gallery>

Each server has a tool group such as `mcp_github`; tool aliases are generated by AI Chat, so use the
names shown in the Tools page instead of constructing them yourself. Selecting **All** in a
conversation includes local tools by default. A host can explicitly opt a remote connection into
that selection with `includeInAll`; otherwise select its group or tools directly.

The **refresh icon** reloads the displayed connection status. **Connect all** contacts every enabled
connection and refreshes its tools with saved credentials. Use **Connection options → Disable** to
exclude one from Connect all and tool discovery without deleting its credentials; **Enable & connect**
restores it. **Refresh tools** reloads one server's catalog. OAuth connections that need a browser
sign-in must be connected individually.

<screenshot src="/img/pages/chat/mcp_client/mcp_client-08-connection-options.webp" title="Refresh, disable or clear a connection without changing other servers"></screenshot>

## Review and approve remote calls

A new personal MCP tool call pauses the conversation for approval. The request shows the connection,
tool description, input schema and proposed JSON arguments. You can edit the arguments before
choosing **Approve and run**, or reject the call.

<screenshot src="/img/pages/chat/mcp_client/mcp_client-07-approve-new-request.webp" title="Review and edit the arguments before a remote MCP call runs"></screenshot>

**Always approve this tool** remembers approval for that particular tool on this connection, for
future calls with any arguments. Use it only when that is the access you intend to grant. The Tools
list shows an approval label beside the tool; remove it with its **×** to require approval again.
Host-defined shared connections can set approval policy separately. Server-provided read-only hints
do not, by themselves, bypass approval.

The call and response remain in the conversation. Text and structured JSON are displayed directly;
supported images and audio remain attached to the user's conversation rather than being published
to a shared media cache.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'MCP request in a conversation': '/img/pages/chat/mcp_client/mcp_client-06-github-request.webp',
    'Inspect the returned result': '/img/pages/chat/mcp_client/mcp_client-08-view-response.webp',
}"></screenshots-gallery>

If a call was dispatched but its response was lost, AI Chat marks its outcome **uncertain**. It does
not replay the operation. Check the remote service for its actual result, then use **I checked —
continue without replay** to let the conversation proceed. That acknowledgment does not re-run the
tool or guarantee that the remote operation did or did not occur.

## Host-managed connections

The host can offer connections to everyone or to an authorized audience. Configuration is scoped to
the `App_Data/chat` user folders:

| File | Purpose |
| --- | --- |
| `user/default/mcp_client/config.json` | Shared, host-managed connections |
| `user/<username>/mcp_client/config.json` | Personal connections managed through that user's UI |

For example, a shared connection to a service without remote authentication can be configured as:

```json
{
  "servers": [
    {
      "id": "knowledge",
      "displayName": "Company Knowledge",
      "endpoint": "https://knowledge.example.com/mcp",
      "auth": { "mode": "anonymous" },
      "allowedTools": ["search", "read_document"],
      "deniedTools": [],
      "includeInAll": false
    }
  ]
}
```

The host can also define a connection in code when it needs a secret manager or custom authorization:

```csharp
var chat = new ChatFeature();
chat.McpClient.Enabled = true;
chat.McpClient.CredentialStore = mySecretStore; // IMcpClientCredentialStore
chat.McpClient.Servers.Add(new McpClientServer {
    Id = "knowledge",
    DisplayName = "Company Knowledge",
    Endpoint = new Uri("https://knowledge.example.com/mcp"),
    Auth = McpClientAuth.HostSecret("knowledge-token"),
    AllowedTools = ["search", "read_document"],
    RequiredRoles = ["Employee"],
    Authorize = (context, operation) => Task.FromResult(context.User != null),
});
services.AddPlugin(chat);
```

`IMcpClientCredentialStore` resolves the secret reference to an access token and a revision; update
the revision when rotating the secret. A shared host-secret connection must name an audience with
`AllowedUsers` or an `Authorize` callback. Shared files can also set `requiredRoles`, `approval`,
`toolsWithoutApproval` and `revision`. Personal connections cannot override a shared ID or weaken
host limits, audiences and network policy.

`allowedTools` is a host exposure policy: an empty list exposes nothing, `"*"` permits every
discovered tool, and `deniedTools` always takes precedence. A user's conversation selection is
separate from this host allow-list. New personal connections allow discovered tools by default,
while every new tool call still asks for approval. Configuration files are re-read without a host
restart; host-level changes such as callback URL or network policy require one.

The config files contain connection metadata, **not Bearer or OAuth tokens**. Personal saves are
atomic and use a revision check to reject stale browser tabs. For multiple App Servers, share the
configuration directory as well as the Chat database and Data Protection keys.

### Durable agent runs

A paused agent can continue after approval or a process restart only if it is still authorized to
use the connection. For background continuation, set `McpClient.ReauthorizeBackgroundRequest` to
return a **current host-authorized request** for the saved username. Return `null` when the account,
tenant or roles no longer allow access. A stored username or tool catalog is not an authorization
grant, and a remote invocation with an uncertain outcome is never replayed on recovery.

## Limits and troubleshooting

Outbound connections use HTTPS on port 443 with normal certificate checks by default. The host
must explicitly allow other ports or private destinations through `McpClient.NetworkPolicy`.
Automatic redirects, ambient cookies and proxy credentials are not inherited. Discovery has a
15-second deadline; a tool call has a 60-second deadline, also bounded by the Chat tool timeout.
Catalogs and responses have size limits, and schemas are validated before arguments are sent.

| Symptom | What to check |
| --- | --- |
| **MCP Connections** does not appear | The host has enabled `chat.McpClient.Enabled` and loaded the `mcp_client` extension. |
| **Invalid MCP configuration** | The server URL and host network policy; for Bearer or OAuth, authenticated Chat and persistent Data Protection; for OAuth, `OAuthRedirectUri`, client ID and a discoverable sign-in provider or Advanced issuer override. |
| **Could not connect** | Server availability, HTTPS certificate, saved credentials and the host logs. Reconnect after rotating a token. |
| **Connected but no tools** | Open **Tools**, refresh the catalog, check the host's `allowedTools` policy, and select tools for the conversation. |
| **Authorization finished but tools are not loaded** | Return to the original Tools tab and select **Load tools**. A host restart during sign-in requires a new sign-in. |
| **Remote result is uncertain** | Inspect the remote service, then continue without replay. The operation is not automatically repeated. |

Only Streamable HTTP tool discovery and calls are supported here. Local stdio MCP processes,
legacy HTTP+SSE transport, MCP prompts and resources browsing, and server-initiated
sampling/elicitation are outside this client feature.
