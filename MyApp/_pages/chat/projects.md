---
title: Projects
---

**Projects** organize your chats and give AI agents a safe place to work. Each project is a dedicated
folder that the agent's file and code tools can read from and write to, and every chat belongs to a
project, or to none. The chat sidebar groups chats into project folders, and chats without a project are
listed under **Recents**.

<screenshot src="/img/pages/chat/projects.webp" title="Choose a project for your chat workspace"></screenshot>

### Key Concepts

- **Projects own chats**: a chat's project is chosen from the project chip at the top of the chat prompt.
  Moving a chat to another project moves the whole conversation.
- **Captured Workspace**: while an agent works on a chat, its file and code tools are restricted to that
  chat's project folder. The folder is captured when you send a message, so moving a chat later only
  affects future messages, and chats in different projects can run at the same time.
- **Project Folders**: each project has one folder at `App_Data/chat/user/<user>/projects/<folder>`. The folder
  name defaults to a kebab-case slug of the project name (e.g. `tic-tac-toe`) and can be changed.
- **Automatic Folder Creation**: a project's folder is created on disk when the project is saved.
- **Stable Identity**: every project has an `id`, so renaming a project or its folder keeps its chats.

### Using Projects in Chats

- **Choose a chat's project**: click the project chip at the top of the prompt (it shows the project name,
  or **No project**). Search your projects and pick one, choose **Don't work in a project**, or create a
  **New project**, which applies to the chat you're writing. You can't change a chat's project while its
  agent is still running.
- **Start a chat in a project**: hover a project folder in the sidebar and click its new-chat button. A
  folder appears in the sidebar once it has a chat, or an unsent draft.
- **Browse a project's chats**: each folder shows its five most recent chats; **Show more** loads more.
  A folder's `…` menu can start a new chat, edit the project, or hide the folder from the sidebar.

### Creating Git-backed projects

Select **New project** from the sidebar or the prompt's project picker. With Git installed and the
`git` extension enabled, choose an empty **New project** or **Clone repository**.

<screenshot src="/img/pages/chat/projects/clone-project.webp" title="New project dialog with an existing Git repository URL and editable project name and folder"></screenshot>

- Empty projects start with **Initialize Git repository** checked. Uncheck it for a plain folder.
  New repositories use `main` and start without generated files or an automatic commit.
- Clones accept HTTPS or SSH URLs, derive editable name/folder defaults, and preserve history and the
  source remote. **More options** accepts an optional branch; otherwise the remote default is used.
- The destination is shown below the folder input. Existing folders are never overwritten.
- Progress supports cancellation. Closing the dialog leaves creation running; reopening restores its
  active operation. Failure offers Retry or Edit details. **Open project** lets you explicitly open a
  project completed after you switched to a different chat.

Repository scripts, submodules, dependencies, and Git LFS content are not automatically installed or
checked out. AI.Chat defaults to public HTTPS clones on GitHub, GitLab, and Bitbucket. Configure `Git.CloneHosts`
or `git_clone_hosts` for other hosts. It does not reuse operator credentials, and GitHub application
login alone does not authorize repository access. A trusted single-user host can opt into
`Git.UseLocalCredentials` for existing Git helpers/SSH identities; SSH hosts must already be trusted.
See [Git access policy](/chat/git#local-and-hosted-access).

### Managing Projects

Open the project manager from the **Projects** heading in the sidebar: `…` opens the manager and `+`
creates a new project. You can also use a folder's `…` menu → **Edit project…**.

<screenshot src="/img/pages/chat/projects/projects.webp" title="Project Manager"></screenshot>

- **Repository URL**: cloned projects show their original source with copy/open actions. This is the
  saved clone URL, rather than a live lookup of the current remote.
- **Project Name & Folder**: provide a unique name; the folder defaults to its kebab-case slug.
- **Description**: optional summary of the project.
- **Show folder in sidebar**: hide folders you don't use. Hidden projects are still available in the
  prompt's project picker, and selecting one in the project manager shows it again.
- **Publish Build Directory**: optional path, relative to the project folder, to [publish](/chat/publishing)
  (e.g. `dist`); leave empty for the project root.
- **Published folder**: shows the static export as `~/user/project`, with **Open site** when a URL is
  available. Folder and remote publication results remain separate.
- **Select Project**: opens an unsent draft in the project, ready for your first message.
- **Delete Project**: its chats move to **Recents** and keep their messages. A project can't be deleted
  while one of its chats has an agent running.

### Reorder and archive

Select **Reorder** in the manager, then drag folder rows into your preferred order. Touch and arrow
keys on a focused handle work too. Order saves immediately and is shared with the chat sidebar and
project pickers; **Done** hides the handles.

<screenshot src="/img/pages/chat/projects/projects.webp" title="Project manager with reorder handles, saved repository URL, and archive actions"></screenshot>

Use **Archive project** in the manager or a sidebar folder's menu to remove it from active lists and
project pickers. Its files, chats, drafts, and captured run workspaces stay attached to the same ID.
**Archived Projects** opens a searchable list; **Unarchive** appends a project to the active list and
restores its previous sidebar visibility. Archiving keeps the project and its chats; deleting moves
its chats to Recents.

### Inspect and version your workspace

Open the top-right [Workspace Explorer](/chat/workspace-explorer) to browse project files and
preview source or images. Its [Git tab](/chat/git) adds staged/working diffs, history, commits,
AI commit subjects, stashes, and fast-forward remote synchronization.

### Technical Configuration Details

Projects are stored per user in `App_Data/chat/user/<user>/projects/projects.json`, or
`App_Data/chat/user/default/projects/projects.json` when you're not signed in.

#### Schema Example (`projects.json`):

```json
[
  {
    "id": "3ea0eb83-8d61-419b-a5f7-854915456f61",
    "name": "Tic Tac Toe",
    "folder": "tic-tac-toe",
    "description": "Creating a Tic Tac Toe game in React",
    "publish": "dist",
    "showInSidebar": true
  }
]
```

The `id` is generated automatically the first time a project is read or saved. Keep it when editing the
file by hand, since chats refer to their project by `id`.

Chats created before projects were saved with each chat have no project and appear under **Recents**; you
can move them into a project from the prompt's project chip.

Array order controls project display order. Archived records retain `archived: true`,
`showInSidebar: false`, and `archivedSidebarVisibility` for restoration. Keep archived records when
editing configuration by hand so their conversations and stable identities remain connected.

## Host permissions

Agent filesystem and code execution tools remain off by default. Project selection supplies a
workspace; it does not enable those tools. The host controls them separately:

```csharp
services.AddPlugin(new ChatFeature {
    Tools = {
        EnableFilesystemTools = true,
        AllowedDirectories = ["/srv/shared-workspace"],
    },
});
```

No-project runs use the initial allowed roots. Project runs capture the chat's project at submission,
so another browser's selection cannot redirect an existing run. Path and symlink checks confine file
tools to their workspace; code execution still runs on the host and requires its own deployment isolation.

Folder publishing is enabled by default and requires no publisher account. Select a project or open
one of its chats, then use **Share → Folder** to export the build to `wwwroot/p/<user>/<project-folder>/`
(or the configured export root). Empty `BaseUrl` uses the Chat UI's current domain for the project link.

Remote publishing is independently opt-in through `ShareLlmspy.Enabled = true`, then
**Share → ai.llmspy.org → Publish Project** with a connected publisher account. The Folder tab hides
when the open chat has no project; if no other tab is available, the Share icon hides too.
See [Publishing](/chat/publishing) for configuration and serving exported files.
Project creation operations persist in the application's OrmLite database and recover against their
reserved workspace paths. Back up that database together with App_Data, including pending operations.

## API

| Endpoint | Purpose |
| --- | --- |
| `GET /chat/ext/projects/projects.json` | Read the user's project list |
| `POST /chat/ext/projects/projects.json` | Save the project list |
| `POST /chat/ext/projects/save/{name}` | Create or update a plain project |
| `POST /chat/ext/projects/active` | Set the legacy manager selection |
| `PATCH /chat/ext/projects/sidebar/{id}` | Set sidebar visibility |

Use the creation dialog for managed Git initialization and cloning. The manager's legacy active
selection does not override a submitted chat run's captured workspace.
