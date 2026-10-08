---
title: Publishing
description: Export projects to static folders or share conversations, projects, media, and Decision Studio recipes on ai.llmspy.org
---

AI.Chat offers two independent sharing extensions:

- **share_static** exports project builds to a folder that any static server can serve. It is enabled
  by default and requires no publisher account, API key, or internet connection.
- **share_llmspy** publishes conversations, projects, images, audio, and worked Decision Studio recipes
  to [ai.llmspy.org](https://ai.llmspy.org). It is disabled by default and requires a connected publisher
  account to publish. Readers can inspect public results without an account or a model call.

Publishing is an explicit action; subsequent local edits do not update either destination automatically.
Folder and remote publication status are stored separately.

:::youtube -BfooJPT3-I
Prompt It, Publish It: Create AI Works directly from your .NET APIs
:::

## Enable or disable sharing

The application host opts into remote publishing before plugin registration:

```csharp
services.AddPlugin(new ChatFeature {
    ShareLlmspy = { Enabled = true },
});
```

Remove `share_llmspy` from any `DisableExtensions` or `disable_extensions` list as well.
Static publishing works with no configuration. To disable either or both extensions, use their names:

```csharp
services.AddPlugin(new ChatFeature {
    DisableExtensions = ["share_static", "share_llmspy"],
});
```

Each extension also exposes `Enabled`; setting `ShareStatic.Enabled = false` disables folder sharing.
See [extension configuration](/chat/extensions#configuring-an-extension).

## Open the Share panel

Click **Share** in the top toolbar. The destinations appear as tabs: **Folder** first, then
**ai.llmspy.org** when remote sharing is enabled. The subtle X closes the panel without disconnecting
an account.

**Folder** appears only for a selected project or an open chat belonging to a project. When the open
chat has no project, only **ai.llmspy.org** remains, and it is selected automatically. The Share icon
hides when no tabs are available; an open panel closes if its last tab disappears.

Use **Folder** without connecting an account. To publish remotely, select **ai.llmspy.org** and register
or connect a publisher account. The embedded form identifies the requesting host and asks you to
authorize that host explicitly. This account is separate from your application login, ChatGPT
subscription, and model-provider API keys.

The per-user connection lives at `App_Data/chat/user/<user>/share_llmspy/config.json`. Open
**Connected: @username** in the ai.llmspy.org tab to manage the connection. **Disconnect** removes the
local key; previously published content remains available until removed from the publishing platform.

## Publish to a static folder

Select a [project](/chat/projects) or open a chat belonging to it, then choose **Share → Folder**.
Review the saved or detected **Build Directory**, such as `dist` or `build`, or select one with
**Browse**. Paths are relative to the project folder; leave the field empty to export the project root.
Click **Publish folder**, then **Update folder** after changes.

The project link opens the published folder, so the Build Directory needs an `index.html`. Files and
folders whose names start with `.`, such as `.git`, `.env` and `.vscode`, aren't published, so a static
server that doesn't hide them can't serve a project's repository, secrets or tool settings.

The default export is `<WebContentDirectory>/p/<user>/<project-folder>/`, typically
`wwwroot/p/<user>/<project-folder>/`. An unauthenticated installation uses `default` as the local user.
The UI abbreviates the export root to `~/`:

```text
Published 15m ago to ~/alice/my-project
https://example.com/p/alice/my-project/
```

The timestamp's tooltip includes the full date and time; the project link opens in a new window.
Errors appear in the Folder panel with details about the failed operation and a dismiss button.

### Configure the export

Global settings live at `App_Data/chat/user/default/share_static/config.json`. The file is optional;
with no file, folder sharing is enabled, `basePath` is `/p/`, and `baseUrl` is empty. Omit `directory`
to use the host web content directory's `p` folder:

```json
{
  "enabled": true,
  "basePath": "/p/",
  "baseUrl": ""
}
```

| Setting | Purpose |
| --- | --- |
| `enabled` | Set to `false` to omit the Folder option. |
| `directory` | Export root. Omitted defaults to `<WebContentDirectory>/p`; explicit relative paths resolve from the host's startup working directory. |
| `basePath` | Static server URL mount, default `/p/`. Used when `baseUrl` is null or empty. |
| `baseUrl` | Public HTTP(S) URL including the mount path. Its path overrides `basePath`. |

With an empty or null `baseUrl`, links use the Chat UI's current browser origin, independently of
`RoutePrefix`. For example, Chat at `https://example.com/chat` links to
`https://example.com/p/alice/my-project/`. Set `baseUrl` to `http://127.0.0.1:8080/p` or
`https://static.example.com/p` to use a separate static server.

Alternatively, configure the typed `StaticPublishConfig` before plugin registration:

```csharp
var chat = new ChatFeature();
chat.ShareStatic.StaticPublish = new StaticPublishConfig {
    // Omit Directory to use the host web content directory's p folder.
    BasePath = "/p/",
    BaseUrl = "", // Use the current browser origin.
};
services.AddPlugin(chat);
```

The code override replaces the whole file configuration, with class defaults for unspecified fields.
These settings belong to the host; named-user settings and remote account changes do not override them.
Restart after changing file configuration.

### Serve the export

Default exports use the host's normal static-file middleware. Put it before routing so a root-mounted
Chat UI does not capture export requests:

```csharp
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.UseServiceStack(new AppHost(), options => options.MapEndpoints());
```

A custom export directory needs a corresponding middleware mapping or an independent static server.
The export contains ordinary static files and can be served without AI.Chat or llms-py.

Publishing adds a missing `<base href="/p/alice/my-project/">` to the copied root `index.html`, using
the configured URL mount, and makes root-relative HTML `src` and `href` attributes relative. Existing
base elements, scripts, comments, and external URLs are preserved. Source files remain unchanged.
Paths inside CSS/JavaScript and SPA history routing must support the chosen mount path. Updates remove
stale exported files; failed copy, rewrite, or metadata updates restore the previous export.

## Publish chat threads

Open the conversation, choose **Share → ai.llmspy.org → Publish Chat Thread**, review its title and model, and select
**Publish Thread**. The public page retains messages, formatted code, tables, avatars, and referenced
media. Choose a theme and copy or open the resulting link. **Update Thread** refreshes the same URL.
Review the complete conversation and attachments before making them public.

## Publish projects

Open a chat in the [project](/chat/projects), then **Share → ai.llmspy.org → Publish Project**. With no chat open,
the panel uses the last project selected in the manager. Review the detected build directory, or choose
one with **Browse**. Paths are relative to and confined within the user's project; leave the path
empty to publish the project root. **Publish Project** uploads the static output as a tarball and
returns a public link. This publishes generated assets, not a running application backend.

## Publish images and audio

In the Gallery lightbox, select **Share Image** to publish the image and its metadata. Generated audio
has a **share** action beside its player; after completion it becomes an **open link** action.
Prompt and generation metadata may become public alongside the media.

## Publishing decision recipes

Enable **share_llmspy**. In [Decision Studio](/chat/decision-studio), save the recipe and complete a successful local run.
Select **Share**, choose a matching run, and review **Preview** or **JSON** before publishing.
The saved definition, selected input, compiled prompt, normalized answers, and usage examples become
public. Other private history, credentials, and raw provider responses remain local.

**Update shared recipe** replaces that snapshot while retaining its URL. **Stop sharing** withdraws
future public access; downloaded or imported copies remain usable. Deleting a local recipe does not
delete its public share, so manage it through Stop sharing or **My recipes** in the public gallery.

Use **Import recipe → Collection** to browse public recipes, filter tags, sort, and star recipes with
a connected account. **From JSON** accepts an export URL or file. An imported recipe is an independent,
editable personal copy with one **Original recipe** link. Importing and publishing make no provider calls.


## Upgrading sharing configuration

Use the `ShareLlmspy` property and `share_llmspy` extension ID for remote publishing, including disable
lists and extension scopes. Remote API paths use `/chat/ext/share_llmspy/...` with the default route prefix.
Static exports use `ShareStatic` and `share_static`; move any former top-level `staticPublish` settings
into `user/default/share_static/config.json`.

Legacy `user/<user>/publish/config.json` account files remain readable, migrate to
`user/<user>/share_llmspy/config.json` on the next save, and are removed on disconnect. Named users do
not inherit another account's publisher credentials.
