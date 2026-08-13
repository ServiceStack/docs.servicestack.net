---
title: Integrated Auth
---

AI Chat is installed **inside** your ServiceStack App, so it doesn't need a separate user directory, a second login experience or a new identity silo. Existing users sign in with the account they already have, and every user-facing capability is scoped to that identity.

<screenshot src="/img/pages/chat/auth/signin.webp" title="Signing in to AI Chat with the host App's users"></screenshot>

## Choosing an AuthType

```csharp
services.AddPlugin(new ChatFeature {
    RequireAuth = true,
    AuthType = ChatAuthType.Credentials,
});
```

| `ChatAuthType` | Sign-in experience | Requires |
| --- | --- | --- |
| `Credentials` *(default)* | Username/password form rendered **inside** the Chat UI | `AuthFeature` with `CredentialsAuth()`, or Identity Auth |
| `OAuth` | Redirects to the host's Identity login page at `SignInUrl` | ASP.NET Identity Auth |
| `ApiKey` | `GET /auth` with an `Authorization: Bearer` header | [`ApiKeysFeature`](/auth/apikeys) |

### Credentials

The `credentials` extension replaces the stock sign-in component with a username/password form that authenticates through ServiceStack's `Authenticate` API — so it signs in against your existing ASP.NET Identity users and shares the App's auth cookie. User management stays with the host (Identity's [Admin Users](/admin-ui-identity-users) UI), not a separate users file.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Manage users in the host App': '/img/pages/chat/auth/manage-users.webp',
    'Create a user': '/img/pages/chat/auth/create-user.webp',
}"></screenshots-gallery>

### OAuth

Use when your App already has a branded Identity login page and you'd rather send users to it:

```csharp
services.AddPlugin(new ChatFeature {
    AuthType = ChatAuthType.OAuth,
    SignInUrl = "/Account/Login",
});
```

The `identity` extension swaps the sign-in component for a redirect, and the Chat UI then rides the host's Identity Auth cookie.

### API Keys

Programmatic clients and MCP Assistants authenticate with a ServiceStack API key in the Bearer token:

```csharp
services.AddPlugin(new ApiKeysFeature());
services.AddPlugin(new ChatFeature { AuthType = ChatAuthType.ApiKey });
```

API keys are resolved on every Chat request regardless of `AuthType`, because Chat UI routes bypass the `ApiKeysFeature` request filter — so an API key is always a valid way in, including to `/chat/mcp`. Each key carries its own roles, permissions and expiry. See [API Keys](/auth/apikeys).

## Restricting access

```csharp
services.AddPlugin(new ChatFeature {
    RequireAuth = true,
    RequiredRole = "Employee",
});
```

`RequiredRole` gates the **entire** Chat UI and its APIs. Users in the `Admin` role always satisfy `RequiredRole`.

### Open access

```csharp
services.AddPlugin(new ChatFeature { RequireAuth = false });
```

With auth disabled every request runs as the `"default"` user, all state is stored under `App_Data/chat/user/default`, and `ctx.IsAdmin()` returns true for everyone. This matches llms.py's behaviour with no auth extension installed and is appropriate for a single-user or trusted-network deployment only.

## Per-user isolation

Authentication is the boundary for AI Chat's state. Everything below is scoped to the authenticated identity:

- Conversation threads and history
- Generated images, audio and media
- Agent Profile customizations
- Projects and their allowed directories
- Personal Skills and preferences
- Gemini File Stores and document catalogs
- PDF Studio workspaces
- Provider and model preferences

<screenshot src="/img/pages/chat/user-profile.webp" title="An authenticated user's AI Chat workspace"></screenshot>

One user's working context never becomes another user's prompt history or project filesystem. Shared and administrator-managed capabilities are explicit rather than emerging from a common global workspace.

Database rows carry the username in a `user` column (`ChatThread`, `ChatRequest`, `ChatMedia`), and file storage is partitioned at `App_Data/chat/user/{username}/`.

## Agents act as the signed-in user

This is the property that makes AI Chat safe to point at a real application. [API Tools](/chat/api-tools) search, describe and invoke ServiceStack APIs **within the current request and authenticated identity**:

- APIs the user cannot access are omitted from search results.
- They cannot be described.
- They cannot be called.
- Existing authentication requirements, API-key rules, roles, permissions, claims and scopes remain enforced.

Calls are deserialized into the real Request DTO and executed through ServiceStack's in-process Service Gateway, so DTO validation, Service filters and business rules stay authoritative.

An Assistant cannot reach an API merely because the server process could.

## Request validation

`ValidateRequest` runs before every Chat UI and API request, giving you one place to add quotas, tenancy checks or policy:

```csharp
services.AddPlugin(new ChatFeature {
    ValidateRequest = async req => {
        var session = await req.GetSessionAsync();
        if (session.UserAuthId != null && await IsSuspendedAsync(session.UserAuthId))
            return HttpError.Forbidden("AI access suspended");
        return null;   // null = allow
    },
});
```

## Anonymous routes

A small number of routes answer anonymously because the UI needs them **before** it knows whether anyone is signed in:

<text-block :rows="[
  ['GET /chat/config','authType + signInUrl so the UI can pick a SignIn component'],
  ['GET /chat/ext','List of UI extension modules to import'],
  ['GET /chat/models','Empty array when unauthenticated'],
  ['GET /chat/prefs','Empty object when unauthenticated'],
  ['GET /chat/auth','Returns 401 until signed in'],
  ['GET /chat/ui/**','Static UI assets']]"></text-block>

`/chat/config` exposes provider ids, their enabled/disabled state and default model names to anonymous callers. Everything else — threads, media, tools, API discovery — requires an authenticated request that satisfies `RequireAuth` and `RequiredRole`.

## Administration

Admin users get system-wide visibility through role-protected Admin UIs at `/admin-ui/chat`, whilst ordinary users retain their own scoped experience. See [Analytics & Admin](/chat/analytics).

<screenshot src="/img/pages/chat/auth/lock-user.webp" title="Locking a user in the host App's Admin UI"></screenshot>

Because AI Chat has no user store of its own, account lifecycle — password policy, lockouts, roles, deactivation — remains owned by your App and applies to AI Chat immediately.

## The boundaries, stated plainly

| Question | Answer |
| --- | --- |
| Where does conversation data live? | Your App's database via OrmLite, and `App_Data/chat` on your server |
| Who can reach `/chat`? | Whoever `RequireAuth` and `RequiredRole` allow — enforced by your existing auth |
| Can one user see another's threads, media or projects? | No. Admin cross-user access is explicit and role-gated |
| What can an Agent call? | Only APIs the *signed-in user* is authorized to call |
| Can it write to the filesystem or run code? | Only if you enable those tools, and only within configured project directories |
| What is exposed over MCP? | Nothing until you name tool groups; tools needing interactive approval are rejected by default |
| Does any of it require an outbound AI provider? | Only the providers you configure |

Which providers see your prompts is entirely your decision — including *"none outside this network"* if you point AI Chat at a local Ollama or LM Studio endpoint.
