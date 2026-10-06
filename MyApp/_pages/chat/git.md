---
title: Git
description: Review diffs, stage changes, commit, stash, and synchronize project repositories from your workspace
---

The built-in **Git** panel brings repository review into your AI workspace. Inspect what an agent changed,
choose what to stage, write or generate a commit message, and synchronize with your remote without
leaving AI.Chat.

Install Git on the server and leave the `git` extension enabled. Open the top-right workspace button,
then select its Git tab. The panel uses the selected chat's project; without a project, it can browse
repositories inside your initial allowed directories.

<screenshot src="/img/pages/chat/git/git-review.webp" title="Git workspace with a staged Python diff, commit message editor, working changes, and recent history"></screenshot>

*Example repository data showing the staged comparison and commit controls.*

## Bring a repository into your workspace

Use **New project → Clone repository** to clone an existing repository, or create a new project with
**Initialize Git repository** checked. See [Projects](/chat/projects#creating-git-backed-projects)
for URLs, branches, credentials, progress, and cancellation.

The Git panel discovers repositories inside the allowed workspace. A plain folder shows **No Git
repository here**. Existing plain projects are not initialized from this panel; use a Git client if needed.

## Inspect working, staged, and historical diffs

| Selection | Comparison |
| --- | --- |
| **Working changes** | Index → working tree, excluding already staged edits |
| **Staged changes** | HEAD → index, the content your staged commit will include |
| A file in an expanded commit | First parent → selected commit; the initial commit compares against an empty tree |

Click a file to open its unified diff in the main panel. Red marks removals, green marks additions, and
line numbers and hunk headers show where each change belongs. Deleted files remain reviewable;
untracked files compare against an empty file. Binary files, conflicts, and oversized changes show an
explanation instead of an incomplete diff.

Expand a recent commit to load its changed files. Hover or focus a commit for its author, date, full
hash, and message. Right-click it, or press **Shift+F10**, for **Open on GitHub**, **Copy Commit Hash**,
and **Copy Commit Message**. The GitHub link follows the selected remote; other hosts disable that action.

Refresh keeps expanded folders and commits. While the Git panel is open, finishing the selected chat's
agent run refreshes its repository status. URLs retain the selected file, comparison, and historical
revision so reload and Back/Forward can restore the view.

## Stage and commit

1. Review **Working changes** and use a file's **+** to stage it. Section controls stage or unstage all
   listed changes; a staged file's **−** returns it to Working changes.
2. Review the staged diff and enter a commit message. The editor grows as you type.
3. Check the Git author shown below the commit button. If none is configured, enter name and email.
   **Remember for this repository** explicitly saves them to that repository's Git config.
4. Choose **Commit**, or use **Ctrl+Enter / Cmd+Enter** in the message editor.

The regular button commits only the current index. Later working edits stay unstaged. Messages are
kept in browser memory per project/repository, including a separate no-project draft; failed operations
retain the message. A successful commit immediately refreshes status and history. Committing does not push.

### Generate a commit message with AI

Stage changes, then use the sparkle button in the message editor. It sends the complete staged patch
to the configured text model and proposes an editable subject. Review it before committing. Generation
never stages files or creates a commit, and typing while it runs protects your manual edits.

Configure `defaults.commit` in `App_Data/chat/llms.json`:

```json
{
  "defaults": {
    "commit": {
      "model": "openai/gpt-oss-120b",
      "stream": false,
      "messages": [
        { "role": "system", "content": "Write a concise imperative commit subject based only on the supplied staged changes. Return one plain-text line." },
        { "role": "user", "content": "Summarize these staged changes:\n\n{diffs}" }
      ]
    }
  }
}
```

Choose any configured compatible model; set `commit` to `null` to disable generation. Older configs use
the bundled default when this key is absent. The staged patch may contain sensitive code, so select a
provider appropriate for your project. Input beyond the size/context limit is rejected instead of
silently summarized from only part of the changes.

## Repository menu

The ellipsis beside the branch opens **Pull**, **Push**, and **Commit**, **Changes**, and **Stash** submenus.
Keyboard arrows navigate them; on narrow screens, submenus use a Back button.

| Action | Behavior |
| --- | --- |
| **Commit** in the menu | Uses the index; when nothing is staged, asks before staging all changes |
| **Commit Staged** | Commits only the staged index |
| **Commit All** | Stages tracked changes and untracked files, then commits |
| **Undo Last Commit** | Moves the branch back while preserving index and working files; disabled for detached HEAD or a commit on a known remote-tracking branch |
| **Stage / Unstage All Changes** | Moves the reviewed changes into or out of the index |
| **Discard All Changes** | Confirmed removal of unstaged changes while preserving staged content |
| **Stash** | Saves tracked changes |
| **Stash (Include Untracked)** | Also saves new files |
| **Stash Staged** | Saves only the index; requires Git 2.35+ |
| **Apply / Pop Stash** | Applies the reviewed latest stash to a clean tracked/index state; Apply retains it and Pop removes it after success |

Stashing needs an existing commit and Git author. Conflicts retain the stash and require a Git client.
Right-click an individual working file for confirmed **Discard Changes**: tracked files revert to the
index and untracked files are deleted. Review carefully before discarding; these actions change files.

## Pull, push, and Sync Changes

Select a remote when there are several. Ahead/behind counts reflect local remote-tracking references
and update after synchronization.

- **Pull** fetches the selected branch and fast-forwards only. Commit or stash local changes first.
- **Push** sends the reviewed commit without force or implicit tags.
- On a clean tree with pending incoming or outgoing changes, **Sync Changes** fetches and fast-forwards
  before pushing under the same repository lock.

Diverged history is preserved and requires resolution with a Git client. The first sync records an
upstream when none exists. Disabled controls explain missing remotes, detached/unborn branches, dirty
trees, or hosted restrictions in their tooltips.

## Local and hosted access

AI.Chat defaults to hosted access. Public HTTPS clone/pull operations are limited to GitHub, GitLab,
Bitbucket, or the host's configured allowlist. Push and synchronization that pushes are disabled;
the server operator's global Git identity and credentials are not borrowed. Application sign-in,
including GitHub login, does not itself authorize repository access.

Configure the allowlist when registering the plugin:

```csharp
services.AddPlugin(new ChatFeature {
    Git = { CloneHosts = ["github.com", "git.example.org"] },
});
```

For a trusted single-user deployment, the host can explicitly opt into its existing Git credential
helpers and SSH identities:

```csharp
services.AddPlugin(new ChatFeature {
    Git = { UseLocalCredentials = true },
});
```

Remote operations remain non-interactive; SSH hosts must already be trusted in `known_hosts`.
This opt-in uses the host process's credentials, so reserve it for trusted users rather than a shared
multi-user deployment. Do not put secrets in repository URLs. `Git.Executable` can select a Git binary.

Writes are blocked while an agent is queued, running, or awaiting approval in the project or an
overlapping workspace. Read-only review stays available. Reviewed revisions prevent stale commits
and discards; hooks and signing do not run in this UI. Content filters, linked/external Git metadata,
submodules, merge/conflict resolution, and more advanced workflows require a Git client.

Diffs are bounded to 1 MiB or 10,000 lines. Remote requests are bounded operations, not durable jobs;
after losing a remote-operation reply, refresh status and inspect the outcome before retrying.

## Troubleshooting

| Situation | Check |
| --- | --- |
| Git tab missing | Install Git, enable the extension, then restart AI.Chat |
| Writes disabled | Wait for overlapping agent runs to finish and read the control's tooltip |
| Authentication failed | Configure the local Git credential helper/SSH identity; hosted push is unavailable |
| Repository changed since review | Refresh, inspect the new status/diff, and try again |
| AI message unavailable | Configure the model in `defaults.commit`, stage changes, and check the patch size |

See [Workspace Explorer](/chat/workspace-explorer) for file previews and
[Projects](/chat/projects) for project creation and organization.
