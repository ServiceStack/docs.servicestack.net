---
title: Data & Storage
---

AI Chat stores everything inside your application: structured data in your App's database via OrmLite, and files under `App_Data`. There is no external service holding your conversation history.

## Database tables

Tables are created on startup when `AutoInitSchema` is true (the default), using the host's `IDbConnectionFactory` — or a named connection if you'd rather keep chat data separate:

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
| `User` | **Data partition key** — the authenticated username, or `default` |
| `CreatedAt`, `UpdatedAt` | Indexed |
| `Title`, `SystemPrompt`, `Model` | |
| `ModelInfo`, `Modalities`, `Args` | JSON |
| `Messages` | JSON — the durable conversation |
| `StreamingMessage` | JSON — in-flight assistant message while streaming |
| `Tools`, `ToolHistory` | JSON |
| `Cost`, `InputTokens`, `OutputTokens`, `Stats` | Thread rollup |
| `Provider`, `ProviderModel` | |
| `StartedAt`, `CompletedAt`, `Status` | |
| `Metadata` | JSON |

`StreamingMessage` is deliberately separate from `Messages`: a failed or abandoned stream can never damage the durable conversation, and checkpointing writes one small column rather than rewriting the whole thread.

### ChatRequest

Per-completion accounting behind the [Analytics](/chat/analytics) dashboards — user, thread, model, provider, duration, token counts, prices, cost, finish reason, and `Error`/`StackTrace` when a completion fails.

### ChatMedia

The generated and uploaded media catalog — name, type, prompt, model, cost, seed, dimensions, size, duration, aspect ratio, content hash, reactions, caption, tags, rating and publish state. Written by the `gallery` extension from a cache-saved filter. See [Voice & Media](/chat/media).

### Gemini tables

The `gemini` extension owns its own document catalog tables, created the same way. See [Gemini File Search](/chat/gemini).

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
  ['user/{user}/publish/config.json','Publish connection config']]"></text-block>

With `RequireAuth = false` everything runs as the `default` user, so all of the above lives under `user/default/`.

Path resolution is guarded: any relative path that would escape `App_Data/chat` throws `UnauthorizedAccessException`.

### The content-addressed cache

Attachments, generated images and audio, and Gemini document uploads are all hashed with SHA-256 and stored once under `cache/{first 2 chars}/{sha256}.{ext}`. The same file uploaded twice costs one copy.

Cache writes fire the `cache_saved` filters, which is how the gallery records media and how an App can hook uploads:

```csharp
ctx.RegisterCacheSavedFilter(saved => {
    Log.LogInformation("Cached {Url} ({Size} bytes)", saved.Url, saved.Size);
});
```

Cached files are served at `{RoutePrefix}/~cache/{path}` to authenticated users.

### Seeded config files

`llms.json`, `providers.json` and `providers-extra.json` are seeded from embedded defaults on first run and then belong to you — edit them, check them into source control, or bypass them entirely by setting `ChatFeature.Config` in code. See [Providers & Models](/chat/providers).

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

See [Rendering PDFs](/chat/pdf).

## Backup and deployment

**Back up together:**

- Your App's database (threads, requests, media, Gemini catalog)
- `App_Data/chat` — config, cache and every user's workspace
- `App_Data/pdf` — including `.published.json` and `.versions`

A database backup on its own is not sufficient: media rows reference cache files by hash, and Gemini document rows reference cached bytes.

**Deployment notes:**

- `App_Data` must be on durable storage. On an ephemeral filesystem, mount a volume or set `AppDataPath` to one.
- In a multi-instance deployment, `App_Data/chat` and `App_Data/pdf` need to be a **shared** volume — user workspaces, the cache and published templates are all filesystem state.
- Pin the Typst version and deploy the same fonts used during template validation.
- Consider a disk quota on `App_Data/chat/user` so a runaway Agent can't fill the disk.

## Retention

AI Chat doesn't expire data on your behalf. Threads, requests and media persist until deleted, which suits audit requirements but means retention policy is yours to implement:

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
