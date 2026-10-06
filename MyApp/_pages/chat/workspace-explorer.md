---
title: Workspace Explorer
description: Browse project files, preview highlighted source and images, and review your agent's workspace
---

Open the **workspace button at the top right** to browse the files behind your conversation. The Files
tab keeps the directory tree visible beside a preview in the main panel, so you can inspect generated
code, documents, and images without leaving AI.Chat.

<screenshot src="/img/pages/chat/workspace-explorer/workspace-files.webp" title="Workspace Explorer with an expanded project file tree and syntax-highlighted Python source"></screenshot>

## Choose the workspace

The selected chat or draft supplies its project. Switch chats to inspect the appropriate project;
changing the chat's project resets file selections. Without a project, the browser uses the user's
initial allowed directories, rather than the legacy global active project.

Click the root breadcrumb below the toolbar to choose an allowed directory. Click folder rows to expand
or collapse them; parents and siblings remain visible. Directory listings load on demand. **Refresh**
reloads them while keeping expanded folders open.

The browser is read-only. It does not change an agent's captured workspace or grant additional file
access. Paths and symlink targets must stay inside the authenticated user's allowed workspace.

## Preview source and images

Click a file to show its contents in the main panel. Breadcrumbs return to parent directories, and
**Copy** copies text. Recognized filenames use syntax highlighting; unsupported source types show plain
text. The wrap icon keeps long lines readable or allows horizontal scrolling, and your browser remembers
the choice across files and reloads.

PNG, WebP, JPEG, GIF, BMP, AVIF, and ICO files open as fitted image previews. SVG starts in rendered view;
the header toggle switches between the image and highlighted source. The browser remembers the SVG view.
Image decode failures offer **Retry**.

Text/SVG previews support files up to 1 MiB; raster images up to 10 MiB. Other binary and larger files
show an explanation. Directory listings are capped at 2,000 entries.

## Navigation that stays with your work

The URL retains the open workspace, directory, selected file, and tab. Reload, Back, and Forward restore
those selections. Navigating to another feature keeps the sidebar open while clearing the main preview
so the destination page remains visible. Close the sidebar to return to the normal page layout.

The [Git tab](/chat/git) adds working and staged diffs, commit history, staging, commits, stashes,
and remote synchronization when Git is installed. Files browsing works independently of Git.

## Extension panels

Extensions can register workspace tabs and optional main previews using
[`ctx.setRightIcons()`](/chat/custom-extensions#workspace-panels). A panel receives the validated workspace,
project ID, and refresh key. This allows additional workspace tools to use the same navigation and layout.

[Skills](/chat/skills#browsing-skill-files) also gains clickable file breadcrumbs, expandable
nested directories, and URL-restored selection, with confirmation before discarding unsaved edits.
