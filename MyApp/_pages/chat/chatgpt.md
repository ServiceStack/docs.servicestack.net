---
title: ChatGPT Sign-In
description: Connect your personal ChatGPT account for eligible subscription chat in AI.Chat
---

The built-in **OpenAI Subscription** card connects your personal ChatGPT account for eligible text
chat through OpenAI's public Sign in with ChatGPT flow. It is separate from signing into AI.Chat and
from configuring an OpenAI API key.

Account eligibility, model access, and usage limits are controlled by OpenAI. This integration follows
[OpenAI's public registration protocol](https://developers.openai.com/siwc/token-sharing-open-source/sign-in),
which requires permission to use the plan in addition to signing in.

## Connect your account

1. Open **Settings → OpenAI Subscription**.
2. Select **Sign in with ChatGPT**. If the browser cannot open, use **Copy sign-in link** and open it
   in your preferred browser.
3. Sign into your account and authorize ChatGPT plan usage.
4. Copy the **complete callback URL** from that browser's address bar and paste it into the card's
   callback field. Keep all query parameters; a bare code is insufficient.
5. Complete the connection and select an available OpenAI model for chat.

<screenshot src="/img/pages/chat/openai_auth/openai-sub-start.webp" title="OpenAI Subscription card in Settings"></screenshot>

Once connected, the card shows the signed-in ChatGPT account and offers **Disconnect**:

<screenshot src="/img/pages/chat/openai_auth/openai-sub-connected.webp" title="Connected OpenAI Subscription card"></screenshot>

AI.Chat uses a manual callback workflow, including when self-hosted remotely. The callback page may
fail to load because no loopback listener is running; copy its full address anyway and return to
AI.Chat. A sign-in attempt expires after ten minutes; start a fresh attempt if it expires.

A connection without the required plan-usage permission is rejected. Start a fresh sign-in
and authorize it. Model choices come from your connected account rather
than assuming every OpenAI model is available.

## Subscription usage and API keys

Eligible text requests use the account's authorized ChatGPT plan through the public Responses API.
This is not unlimited usage: OpenAI applies account and app limits. Review and manage access in
[ChatGPT Settings → Usage](https://chatgpt.com/#settings/Usage); see
[OpenAI's accounts and sessions guide](https://developers.openai.com/siwc/token-sharing-open-source/profiles-and-sessions).

Subscription requests do not silently switch to an API-key provider after an expired, invalid, or
failed grant. Sign in again when instructed. Without a personal grant, a configured API key can still
provide ordinary OpenAI access. Explicit non-text output modalities can use their configured API-key
provider and its billing; connecting a subscription does not promise image/audio generation coverage.

Responses stream with `store=false`; incomplete streams and provider failures are shown as failures,
not successful answers. No uncertain inference is automatically restarted through a different provider.
OpenAI's [preview limitations](https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations)
and account-specific catalog determine what is supported.

## Disconnect and reconnect

**Disconnect** stops local use and removes the stored grant, registration, pending sign-in flows,
and account-model cache. It does not revoke access remotely: remove app access in ChatGPT Settings
when you also want to revoke the OpenAI authorization.

Use a fresh public sign-in for older private grants. Existing CLI credentials are not silently
converted or imported. The extension never implicitly reads the operator's `~/.codex/auth.json`.
A host can opt into local import only with both a user-specific `LocalCredentialsPath` resolver and
an additional `CanImportLocalCredentials` authorization check in `OpenAiAuth.Options`.

## Host configuration

The built-in `openai_auth` extension contributes the Settings card and per-user subscription provider.
Disable it with `DisableExtensions = ["openai_auth"]` when the host does not offer personal grants.
`ChatFeature.OpenAiAuth.Options` controls the displayed agent name and flow lifetime:

```csharp
services.AddPlugin(new ChatFeature {
    OpenAiAuth = {
        Options = {
            AgentName = "My AI Workspace",
            FlowLifetime = TimeSpan.FromMinutes(10),
        },
    },
});
```

This connection supplements your application's [Identity authentication](/chat/auth); it does not
sign someone into your host or grant workspace access.

## Privacy and deployment

Each AI.Chat user has a separate server-side grant at:

```text
App_Data/chat/user/<user>/credentials/openai_subscription.json
```

Unix credential writes use owner-only permissions and atomic replacement. Tokens stay off browser
storage and are never shared between users. State, PKCE, a nonce, and signed identity verification
bind a callback to its originating account and sign-in attempt.

Run one server process per data root; token-refresh coordination does not support multiple processes
sharing the same rotating credentials. Only one selected ChatGPT registration is supported per local
user. On Windows, protect the data directory through the host filesystem's access controls.

## Troubleshooting

| Situation | Action |
| --- | --- |
| Callback page will not load | Copy its complete address into Settings; there is no automatic loopback callback listener |
| Callback rejected or expired | Start a fresh sign-in and use the matching complete URL in the same AI.Chat account |
| Signed in but cannot chat | Authorize plan usage and check OpenAI account eligibility and available models |
| Older private grant | Complete a new public sign-in; old private grants cannot be reused automatically |
| Subscription stream fails | Review the error and account limits; AI.Chat does not switch billing providers automatically |
| OpenAI choices disappear | Restore a valid connection; other providers and Settings remain usable |

See [Providers & Models](/chat/providers) for API-key configuration and
[Integrated Auth](/chat/auth) for AI.Chat application login.
