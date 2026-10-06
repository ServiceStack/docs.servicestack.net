---
title: Data & Storage
---

AI Chat stores everything inside your application: structured data in your App's database via OrmLite, and files under `App_Data`. There is no external service holding your conversation history.

<storage-overview>
</storage-overview>

## Database tables

Tables are created on startup when `AutoInitSchema` is true (the default), using the host's `IDbConnectionFactory` - or a named connection if you'd rather keep chat data separate:

```csharp
services.AddPlugin(new ChatFeature {
    NamedConnection = "chat",
    AutoInitSchema = true,
});
```

### ChatThread

One conversation. Complex fields are stored as raw JSON strings so the wire shape matches the OpenAI format exactly, and are only parsed at the DTO boundary.

| Column | Notes |
| --- | --- |
| `Id` | Auto-increment |
| `User` | **Data partition key** - the authenticated username, or `default` |
| `CreatedAt`, `UpdatedAt` | Indexed |
| `Title`, `SystemPrompt`, `Model` | |
| `ModelInfo`, `Modalities`, `Args` | JSON |
| `Messages` | JSON - the durable conversation |
| `StreamingMessage` | JSON - in-flight assistant message while streaming |
| `Tools`, `ToolHistory` | JSON |
| `Cost`, `InputTokens`, `OutputTokens`, `Stats` | Thread rollup |
| `Provider`, `ProviderModel` | |
| `StartedAt`, `CompletedAt`, `Status` | |
| `Metadata` | JSON |

`StreamingMessage` is deliberately separate from `Messages`: a failed or abandoned stream can never damage the durable conversation, and checkpointing writes one small column rather than rewriting the whole thread.

### ChatRequest

Per-completion accounting behind the [Analytics](/chat/analytics) dashboards - user, thread, model, provider, duration, token counts, prices, cost, finish reason, and `Error`/`StackTrace` when a completion fails.

### ChatMedia

The generated and uploaded media catalog - name, type, prompt, model, cost, seed, dimensions, size, duration, aspect ratio, content hash, reactions, caption, tags, rating and publish state. Written by the `gallery` extension from a cache-saved filter. See [Voice & Media](/chat/media).

### Gemini tables

The `gemini` extension owns its own document catalog tables, created the same way. See [Gemini RAG, Search & Analytics](/chat/gemini-rag).

### Querying

They're ordinary OrmLite tables:

```csharp
using var db = dbFactory.Open();

var recent = db.Select<ChatThread>(db.From<ChatThread>()
    .Where(x => x.User == userName)
    .OrderByDescending(x => x.UpdatedAt)
    .Take(20));
```

`AdminQueryChatRequests` additionally exposes `ChatRequest` as an [AutoQuery](/autoquery/rdbms) API for admins.

## File storage

Rooted at `App_Data/chat` by default, overridable with `AppDataPath`:

<text-block :rows="[
  ['App_Data/chat/llms.json','Providers, defaults, limits, disabled extensions'],
  ['App_Data/chat/providers.json','Model catalog from models.dev'],
  ['App_Data/chat/providers-extra.json','Your own model overrides'],
  ['App_Data/chat/cache/{2ch}/{sha256}.{ext}','Content-addressed asset cache'],
  ['App_Data/chat/cache/**/*.info.json','Sidecar metadata for cached assets'],
  ['App_Data/chat/.agent/skills/','Shared skills'],
  ['App_Data/chat/user/{user}/','Everything scoped to one user']]"></text-block>

### Per-user layout

<text-block :rows="[
  ['user/{user}/prefs.json','Model, theme and feature preferences'],
  ['user/{user}/projects/','projects.json + one folder per project'],
  ['user/{user}/profiles/','Agent Profiles'],
  ['user/{user}/skills/','Personal skills'],
  ['user/{user}/themes/','Custom themes'],
  ['user/{user}/pdf/','PDF Studio workspace'],
  ['user/{user}/share_llmspy/config.json','Remote publisher connection config']]"></text-block>

With `RequireAuth = false` everything runs as the `default` user, so all of the above lives under `user/default/`.

Path resolution is guarded: any relative path that would escape `App_Data/chat` throws `UnauthorizedAccessException`.

### Static project exports

The global `user/default/share_static/config.json` configures static folder sharing. By default,
exports live outside App_Data at `<WebContentDirectory>/p/<user>/<project-folder>/`, typically
`wwwroot/p/...`. A custom `Directory` can select another export root. The UI abbreviates this root to
`~/`; it does not display the full destination path.

Project `staticPublication` metadata remains in the user's project configuration, separately from the
remote publication link. Folder exports can be served by a static server without AI.Chat running.
Include the export directory in deployment or backup if you need to retain the served copies.
See [Publishing](/chat/publishing#publish-to-a-static-folder).

### The content-addressed cache

<content-addressed>
</content-addressed>

Cache writes fire the `cache_saved` filters, which is how the gallery records media and how an App can hook uploads:

```csharp
ctx.RegisterCacheSavedFilter(saved => {
    Log.LogInformation("Cached {Url} ({Size} bytes)", saved.Url, saved.Size);
});
```

Cached files are served at `{RoutePrefix}/~cache/{path}` to authenticated users.

### Seeded config files

`llms.json` is seeded only when missing and preserves user settings across restarts. Provider
catalogs (`providers.json` and `providers-extra.json`) refresh from bundled defaults on startup unless
their filenames are listed in `PreserveConfigs`. Preserved catalog files are seeded when missing.

```csharp
services.AddPlugin(new ChatFeature {
    PreserveConfigs = ["providers-extra.json"],
});
```

Alternatively, bypass `llms.json` entirely by setting `ChatFeature.Config` in code. See [Providers & Models](/chat/providers).

## PDF storage

`PdfFeature` uses a separate root, `App_Data/pdf` by default:

<text-block :rows="[
  ['App_Data/pdf/{name}.typ','The published template'],
  ['App_Data/pdf/{name}.json','Example data'],
  ['App_Data/pdf/{name}.ui.json','JSON Schema data contract'],
  ['App_Data/pdf/{name}.preview.png','Publish-time thumbnail'],
  ['App_Data/pdf/.published.json','Publisher and source metadata'],
  ['App_Data/pdf/.versions/{template}/{revision}/','Immutable revision history'],
  ['App_Data/pdf/fonts/','Application fonts available to typst']]"></text-block>

See [Rendering PDFs](/chat/rendering-pdfs).

## Backup and deployment

**Back up together:**

- Your App's database (threads, requests, media, Gemini catalog)
- `App_Data/chat` - config, cache and every user's workspace
- `App_Data/pdf` - including `.published.json` and `.versions`

A database backup on its own is not sufficient: media rows reference cache files by hash, and Gemini document rows reference cached bytes.

**Deployment notes:**

<deployment-checklist>
</deployment-checklist>

## Retention

AI Chat doesn't expire data on your behalf, so retention policy is yours to implement:

```csharp
// example: delete threads untouched for a year
using var db = dbFactory.Open();
var cutoff = DateTime.UtcNow.AddYears(-1);
var ids = db.Column<long>(db.From<ChatThread>()
    .Where(x => x.UpdatedAt < cutoff).Select(x => x.Id));

db.Delete<ChatRequest>(x => Sql.In(x.ThreadId, ids));
db.Delete<ChatThread>(x => Sql.In(x.Id, ids));
```

Deleting a user's folder under `App_Data/chat/user/{user}` removes their projects, profiles, skills, PDF workspace and preferences.

## Decision, subscription, and creation state

| Location | State |
| --- | --- |
| `App_Data/chat/user/{user}/jev/` | Portable recipes, immutable history, index, initialization receipt, and publication journals |
| `App_Data/chat/user/{user}/credentials/openai_subscription.json` | Private per-user ChatGPT grant |
| `App_Data/chat/openai-agent-host.json` | Public-sign-in host registration identity |
| App database | Durable project-creation reservations, chat/run identities, and Gemini desired/completed work |

Use a single owning host process per App_Data root for Decision Studio and rotating subscription
credentials. Stop hosts before moving profiles and preserve hidden files and pending receipts.
Back up the database and App_Data together. A downgrade requires restoring the matching pre-upgrade
backup rather than handing migrated state to an older binary.
