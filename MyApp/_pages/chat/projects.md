---
title: Projects
---

**Projects** give each user a persistent workspace and define the directories filesystem and code-execution tools may access. Switching Projects changes the active boundary for read, write, edit, search and listing operations.

<screenshot src="/img/pages/chat/projects.webp" title="AI Chat project workspace selector"></screenshot>

This is what allows capable coding and document Agents without granting them ambient access to the whole server.

## How the boundary works

Each project is a dedicated folder under the signed-in user's own storage:

<text-block text="App_Data/chat/user/{user}/projects/{folder}"></text-block>

When a project is active, that folder **replaces** the user's allowed directories. Every path a filesystem tool receives is normalized to a full path and checked against it, so `..` segments and absolute paths can't escape.

With no active project, AI Chat falls back to the explicitly configured `Tools.AllowedDirectories` - which is empty by default, and is the only thing that enables filesystem tools in the first place:

```csharp
services.AddPlugin(new ChatFeature {
    Tools = {
        EnableFilesystemTools = true,
        AllowedDirectories = ["/srv/shared-workspace"],
    },
});
```

:::info
Projects narrow access; they don't grant it. `EnableFilesystemTools` and `EnableCodeExecution` remain **off by default** and must be enabled by the host before any of this applies. See [Tools](/chat/tools).
:::

## Project storage

`projects.json` in the user's `projects/` folder is the file-backed project list, and the active project is a user preference:

```json
[
  { "name": "Marketing Site", "folder": "marketing-site", "publish": "dist" },
  { "name": "Quarterly Report", "folder": "quarterly-report" }
]
```

| Key | Purpose |
| --- | --- |
| `name` | Display name |
| `folder` | Folder name, defaulting to a kebab-case slug of `name` |
| `publish` | Build output directory, relative to the project folder |

`"My App (v2)"` slugs to `my-app-v2`. The `publish` path is coerced to a relative path inside the project folder - absolute paths, a leading `/`, a redundant `{folder}/` prefix and any `..` segments are all reduced away, and the project root is `""`.

## Applying a project on sign-in

The `projects` extension registers a setup-user handler, so the first request from each user applies their active project's directory automatically:

```
Projects [alice] quarterly-report: /srv/app/App_Data/chat/user/alice/projects/quarterly-report
```

## What projects hold

Projects are ordinary folders, so they can hold anything an Agent produces:

- Generated websites and single-page apps
- Games and interactive demos
- Reports, plans and documents
- Source code

They're also the natural collaboration unit for [Agent Profiles](/chat/agents). The built-in Planner → Coder workflow uses one: the Planner writes `PLAN.md` into the active project, and the Coder profile's action only appears once that file exists.

## Publishing

When the `publish` extension is enabled, a project's build folder can be published as a tar.gz to a remote llms.py site:

```csharp
services.AddPlugin(new ChatFeature {
    Publish = { Enabled = true },
});
```

Publishing is **disabled by default** in ServiceStack AI Chat, so each host decides whether content may leave its application boundary. Connection config is stored per user at `App_Data/chat/user/{user}/publish/config.json`, and the publish dialog's folder browser is confined to the project folder - every path in and out is relative to it, so the UI never sees a server path.

The extension can also publish selected chat threads and individual gallery media items.

## API

<text-block :rows="[
  ['GET  /chat/ext/projects/projects.json','The user’s project list'],
  ['POST /chat/ext/projects/projects.json','Replace the project list'],
  ['POST /chat/ext/projects/save/{name}','Create or update one project'],
  ['POST /chat/ext/projects/active','Set the active project']]"></text-block>

The publish extension adds:

<text-block :rows="[
  ['GET  /chat/ext/publish/config.json','Publish connection config (API key obscured)'],
  ['POST /chat/ext/publish/config.json','Save publish config'],
  ['POST /chat/ext/publish/disconnect','Forget the publish config'],
  ['GET  /chat/ext/publish/detect-dist','Detect a build output folder'],
  ['GET  /chat/ext/publish/list-subdirs','Browse folders inside the project'],
  ['POST /chat/ext/publish/project/{name}','Publish the project’s build folder'],
  ['POST /chat/ext/publish/thread/{id}','Publish a thread'],
  ['POST /chat/ext/publish/media/{id}','Publish a media item']]"></text-block>

## Disabling projects

```csharp
services.AddPlugin(new ChatFeature {
    DisableExtensions = ["projects", "publish"],
});
```

With `projects` disabled, filesystem tools fall back to `Tools.AllowedDirectories` for every user - appropriate when a single shared workspace is what you want, or when you've disabled filesystem tools entirely.

## Operational guidance

- Keep `EnableCodeExecution` off unless you need it; a project folder bounds file access but `run_bash` still runs on your host.
- Consider mounting `App_Data/chat/user` on a volume with a quota so a runaway Agent can't fill the disk.
- Typst's root restriction and the project path check limit file access but are **not** operating-system sandboxes. Untrusted workloads belong in a container or dedicated worker.
