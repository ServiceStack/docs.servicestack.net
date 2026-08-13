---
title: Skills
---

**Skills** package specialized instructions, references and supporting files that Models load only when relevant. Instead of adding every procedure to every system prompt, an organization maintains focused skills for incident response, customer onboarding, code review, compliance checks or internal systems.

<screenshot src="/img/pages/chat/skills.webp" title="Skill management in AI Chat"></screenshot>

## Progressive disclosure

A skill's *description* is always visible to the Model; its detailed instructions are only loaded when the Model calls the `skill` tool for it. This keeps prompts small and helps specialists remain specialists — a Model with fifty available skills pays for fifty one-line descriptions, not fifty procedure documents.

## Anatomy of a skill

A skill is a folder containing a `SKILL.md` manifest and whatever supporting files it needs:

```text
incident-response/
    SKILL.md
    runbooks/
        database-failover.md
        cache-eviction.md
    templates/
        postmortem.md
```

`SKILL.md` starts with YAML frontmatter:

```markdown
---
name: incident-response
description: Triage and respond to a production incident, including severity
  classification, comms templates and the postmortem process
license: MIT
allowed-tools: api_search, api_describe, api_call
---

## When to use this

Use when a production alert fires, a customer reports an outage, or someone
asks how to run an incident.

## Severity classification

...
```

| Frontmatter key | Purpose |
| --- | --- |
| `name` | Skill identifier. Defaults to the folder name |
| `description` | The one line the Model sees before deciding to load the skill |
| `license` | Optional license attribution |
| `allowed-tools` | Tools this skill expects to be available |
| `metadata.*` | Arbitrary additional properties |

The `description` is doing the selection work — write it as the situation the skill applies to, the same way you'd write `[Tool(WhenToUse)]`.

## Where skills live

<text-block :rows="[
  ['App_Data/chat/.agent/skills/','Shared skills, seeded from the bundled set on first run'],
  ['App_Data/chat/user/{user}/skills/','The signed-in user’s own skills']]"></text-block>

A user's skill overrides a shared skill of the same name. The localhost-only roots that llms.py scans (`~/.claude/skills`, `./.agent/skills`) are deliberately **not** scanned on a web host.

To publish a skill to everyone in your organization, put it in `App_Data/chat/.agent/skills/` and check it into source control alongside your App.

## Installing skills

Skills can be installed from a GitHub repository via a shallow clone:

<text-block text="POST /chat/ext/skills/install/{id}"></text-block>

The Chat UI provides browse, search, install, create and edit experiences over the same APIs.

## API

<text-block :rows="[
  ['GET    /chat/ext/skills','All visible skills, keyed by name'],
  ['GET    /chat/ext/skills/search','Search available skills'],
  ['GET    /chat/ext/skills/contents/{name}','A skill’s SKILL.md contents'],
  ['GET    /chat/ext/skills/file','Read a file inside a skill'],
  ['POST   /chat/ext/skills/file','Write a file inside a skill'],
  ['POST   /chat/ext/skills/install/{id}','Install a skill from its source repo'],
  ['DELETE /chat/ext/skills/skill/{name}','Delete a user skill']]"></text-block>

Every file path is validated against the resolving skill's own folder, so a skill cannot read or write outside itself.

## The `skill` tool

Skills are surfaced to Models as a single `skill` tool. The Model calls it with a skill name to load that skill's instructions into the conversation, then proceeds with the procedure it describes.

This means skills work with **any** provider and model — there's no provider-specific skills feature involved, just a tool call.

## Restricting skills per profile

An [Agent Profile](/chat/agents) can limit which skills it may load:

```json
{
  "model": "Claude Sonnet 5",
  "onlySkills": ["incident-response", "escalation-matrix"]
}
```

A Support Assistant profile that can only load support procedures won't wander into your deployment runbooks.

## Skills vs Agent Profiles vs API Tools

| | Loaded | Best for |
| --- | --- | --- |
| **Agent Profile** | Chosen up front | Who the assistant *is* — model, persona, standing context, allowed capabilities |
| **Skill** | On demand, when relevant | A *procedure* that only some conversations need |
| **API Tool** | Discovered on demand | A *capability* — reading or changing real application data |

They compose: a profile restricted to a handful of skills and one tool group is a tightly-scoped assistant that can still do real work.

## Writing effective skills

- Lead with the situation the skill applies to, in the `description`.
- Keep `SKILL.md` to the decision-making — push reference material into supporting files the Model can read when it needs them.
- Name the tools the procedure depends on in `allowed-tools`.
- Prefer several narrow skills over one that covers everything; selection is the hard part, and narrow descriptions select better.
