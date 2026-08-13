---
title: Agent Profiles
---

One system prompt cannot be ideal for every task. **Agent Profiles** package a model, system prompt, theme, avatar, allowed tools, allowed skills and workflow actions into a named assistant.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Choose an Agent Profile': '/img/pages/chat/profiles/profiles-menu.webp',
    'Inspect a built-in profile': '/img/pages/chat/profiles/readonly-profile.webp',
}"></screenshots-gallery>

## Built-in profiles

| Profile | Purpose |
| --- | --- |
| `chat` | General-purpose assistant |
| `planner` | Decomposes a goal and writes `PLAN.md` |
| `coder` | Implements an approved plan with the tools allowed in the selected Project |

Bundled profiles are read-only until a user saves their own copy of the same name, at which point the user's version takes precedence.

## Where profiles live

Profiles are resolved from three roots, lowest precedence first:

<text-block :rows="[
  ['(bundled)','chat/profiles/** shipped with the package'],
  ['App_Data/chat/user/default/profiles/','Shared profiles for every user'],
  ['App_Data/chat/user/{user}/profiles/','The signed-in user’s own profiles']]"></text-block>

A profile is a folder:

```text
profiles/support-assistant/
    config.json
    SYSTEM.md
    avatar.png
```

### config.json

```json
{
  "theme": "nord",
  "model": "GLM-5.2",
  "onlyTools": ["api_tools"],
  "onlySkills": ["incident-response"]
}
```

| Key | Purpose |
| --- | --- |
| `model` | Default model this profile runs on |
| `theme` | [UI theme](/chat/themes) applied while the profile is active |
| `onlyTools` | Restrict the profile to these tools/groups. `null` allows all |
| `onlySkills` | Restrict the profile to these skills. `null` allows all |

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Choose the profile’s default model': '/img/pages/chat/profiles/profile-models.webp',
    'Restrict the profile’s tools': '/img/pages/chat/profiles/profile-tools.webp',
}"></screenshots-gallery>

## Composing a system prompt

The simplest profile has a `SYSTEM.md` used verbatim. For anything organizational, a `SYSTEM.template` composes the prompt from sibling Markdown files with `{VAR}` substitutions:

```text
profiles/policy-analyst/
    SYSTEM.template
    POLICY.md
    PROCEDURES.md
    DOMAIN.md
    memory/
        2026-08-01.md
        2026-08-12.md
```

```text
You are a policy analyst for Acme Corp.

## Organizational policy
{POLICY}

## Standard procedures
{PROCEDURES}

## Domain knowledge
{DOMAIN}

## Recent context
{MEMORY_LATEST}
```

Each `{VAR}` resolves to the contents of the sibling `VAR.md`. `{MEMORY_LATEST}` resolves to the newest file in `memory/`, giving a profile a rolling working memory without rewriting the prompt.

If no `SYSTEM.template` exists, `SYSTEM.md` is returned as-is.

## Actions

A profile can declare workflow actions the UI offers, optionally conditional on the user's workspace. Only `file` conditions are evaluated - a glob match within the user's allowed directories - and unconditional actions always show:

```json
{
  "actions": [
    { "label": "Implement PLAN.md", "prompt": "Implement the approved plan in PLAN.md",
      "condition": { "file": "PLAN.md" } },
    { "label": "Summarize this project", "prompt": "Summarize what this project does" }
  ]
}
```

This is what drives the built-in **Planner → Coder** handoff: the Planner writes `PLAN.md`, and the Coder profile's action only appears once that file exists in the active [Project](/chat/projects).

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Planner Agent Profile': '/img/pages/chat/profiles/profiles-planner.webp',
    'Coder Agent Profile': '/img/pages/chat/profiles/profiles-coder.webp',
}"></screenshots-gallery>

## The Profile Manager

The Chat UI can inspect built-in profiles, override their default model and theme, and create new profiles entirely from the browser - editing prompt files, uploading an avatar and choosing which tools and skills a profile may use.

Profiles created in the UI are written to the signed-in user's own `profiles/` folder, so a user can never modify a shared profile by accident. To publish a profile to everyone, put it in `App_Data/chat/user/default/profiles/`.

## API

Profile routes live under the `agents` extension:

<text-block :rows="[
  ['GET    /chat/ext/agents','All visible profiles'],
  ['GET    /chat/ext/agents/{profile}/system','The resolved system prompt'],
  ['GET    /chat/ext/agents/{profile}/avatar','Profile avatar'],
  ['GET    /chat/ext/agents/{profile}/actions','Actions whose conditions pass'],
  ['GET    /chat/ext/agents/tools-skills','Tools + skills available to assign'],
  ['POST   /chat/ext/agents','Create a profile'],
  ['POST   /chat/ext/agents/{profile}/config','Update config.json'],
  ['GET    /chat/ext/agents/{profile}/files','List the profile’s files'],
  ['PUT    /chat/ext/agents/{profile}/files/{filename}','Save a prompt file'],
  ['DELETE /chat/ext/agents/{profile}','Delete a user profile']]"></text-block>

## Profiles as governed job descriptions

For an organization, profiles become the unit of AI governance - Support Assistant, Policy Analyst, Release Planner, Sales Researcher, Finance Reviewer - each with only the context and capabilities its role needs:

```json
{
  "model": "Claude Sonnet 5",
  "onlyTools": ["api_tools"],
  "onlySkills": ["refund-policy", "escalation-matrix"]
}
```

Combined with [API Tools](/chat/api-tools), a profile restricted to `api_tools` can operate your business systems and nothing else - no filesystem, no code execution, no web access - whilst still running as the signed-in user with their existing permissions.

## Related

- [Skills](/chat/skills) - reusable procedures a profile can be restricted to
- [Projects](/chat/projects) - the directory boundary a profile's tools operate in
- [Tools](/chat/tools) - the registry `onlyTools` selects from
- [Themes](/chat/themes) - the themes `theme` selects from, and how to add your own
