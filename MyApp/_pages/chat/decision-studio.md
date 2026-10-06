---
title: Decision Studio
description: Build, run, and share reusable recipes for typed AI decisions with probabilities
---

**Decision Studio** turns a recurring judgment into a reusable recipe: define an input form, ask focused
questions, then inspect typed answers and their probability distributions. Use it for message sentiment,
support triage, email intent, feedback classification, content relevance, or claim support.

Open the decision tree icon in the left navigation, or browse to `/chat/jev` (using your configured route prefix). The built-in `jev` extension
uses OpenRouter's Decisions API independently of chat completions.

<screenshot src="/img/pages/chat/decision-studio/decision-studio.webp" title="Decision Studio showing a company-news input form and typed results with probability distributions"></screenshot>

*Illustrative recipe and results using sample data.*

## Run your first decision

1. Open **Message sentiment**, the editable starter recipe created for a new account.
2. Select **Try example**, or enter an email, tweet, or comment.
3. Configure an OpenRouter API key in **Models & providers**, or configure
   `OPENROUTER_API_KEY` for the application host. OpenRouter must be enabled.
4. Select **Run decision** and inspect the results. Expand **Question & criteria** to see what each
   answer measures; inspect the request and call details when needed.

Browsing, editing, importing, and validating recipes need no provider key. Running a decision sends
its input and questions to OpenRouter and uses that provider's billing. **Check examples** makes one
Decisions request per example; AI recipe authoring uses your separately selected text model.

## Three answer types

| Type | Define | Result |
| --- | --- | --- |
| **Yes / no · Noul** | A focused question and criteria for yes and no | A probability of yes between 0 and 1 |
| **Choose one · Choice** | Named alternatives with criteria | A selected alternative and probabilities for every option |
| **Ordered scale · Score** | 2–10 ordered levels with descriptions | A fractional score from 0 to the last level and probabilities for every level |

The probability distribution helps you inspect uncertainty. Choice and Score confidence describes how
concentrated that distribution is; it is not measured accuracy. Decisions provide typed answers rather
than a free-form reasoning explanation. The company-news recipe assesses the article's reported business
implications, not future stock prices.

## Create and edit recipes

Use **+** to create a recipe, or open **Edit** on one you already own. Define input fields, questions,
criteria, and readable result labels. Stable question and option keys remain available for integrations.

Use **Recipe JSON** for advanced edits and **Apply JSON** to validate and activate them. Invalid or
unapplied JSON cannot be saved or run. **Check** validates a recipe without a provider call; **Save**
persists it on the server. **Request JSON & curl** in Run exposes the compiled request and an exportable
curl command with an environment-variable placeholder for the key.

The metadata editor has separate searchable **Content** and **Tags** inputs. Choose one content type and
up to three tags, or enter your own. Enter or comma adds a tag; a chip's X removes it. Search and stars
help you find recipes in your personal library.

## Create or improve with AI

Select **Create with AI** and describe the decision you want, or use **Improve with AI** for a specific
change to a recipe. The model picker searches by name, ID, and provider, filters providers, and sorts by
release date, price, context limit, or name. This text model is independent of the decision model and chat.

Review the proposed fields, questions, and JSON before applying them. **Repair draft** explicitly asks
for a correction when generated JSON is invalid; there are no hidden retry calls.

Generation sends the goal and, for improvements, the recipe and saved examples. Your current input is
included only when you enable **Use my current input to help design the recipe**. Chat history, tools,
and project files are excluded. A late proposal never overwrites edits automatically.

## Recorded examples and history

After a successful run, select **Save as example** in Results. Review the suggested name, change it if
you wish, then save the example and recipe. Naming uses `defaults.summarize` when available; you can
supply a name yourself. Saving the recorded output makes no additional decision call.

Examples retain the run's original input, normalized answers, probabilities, model, and completion time.
New examples come from successful runs; existing imported examples and expected answers remain readable.
**Check examples** runs them sequentially and shows matches and differences. Stop prevents later cases
from being submitted. These comparisons are inspection aids, not a benchmark score.

Changing executable fields, questions, state mapping, or decision model clears affected saved outputs
while retaining compatible inputs. **History** keeps immutable snapshots of every submitted decision's
recipe, input, request, response, model, and usage. Open a record to inspect or export it, or use its
recipe and input as a new draft. Deleting a recipe keeps its recorded history.

Runs continue on the server when you leave the page. **Stop** cancels local execution/tracking, although
OpenRouter may already have processed the request. Failed or interrupted runs are not automatically
resubmitted. After a lost submission reply, **Retry submission** recovers the same record using its
original identifier rather than dispatching a duplicate.

## Import recipes and build your collection

Select **Import recipe → Collection** to browse published recipes, filter by tags, and order by
recommended, most run, newest, or name. Signed-in readers can star recipes. **View** opens the original
public page. Public browsing and importing do not require a publisher key. The host must enable `share_llmspy`
to use the community collection; starring and publishing also require a connected account.

**From JSON** accepts a JSON export URL or file. An ai.llmspy.org share link downloads its `.json` export
automatically; other URLs must return portable recipe JSON.

Imports save an independent, editable personal copy. It looks and behaves like a recipe you created,
with a single **Original recipe** link when a public source is available. Importing never runs a
provider request or counts the published result as your own local execution.

Filename conflicts offer a different filename, cancellation, or confirmed replacement. Replacement
clears that recipe's local history; cancel to retain it. Display names need not be unique. Renaming a
recipe's display name leaves its filename, stars, and history references intact.

## Share a recipe and worked example

Save and successfully run the recipe, then select **Share**. Connect a
[publisher account](/chat/publishing) through `share_llmspy`, choose a matching successful local run, and review
**Preview** or **JSON** before publishing.

The saved definition, selected run's input, compiled prompt, and normalized results become public.
Saved usage examples are included, including explicitly recorded outputs. Other history, credentials,
and raw provider responses remain local. Remove sensitive input before sharing.

The public link displays the recorded result without requiring the reader to run a model. **Update
shared recipe** replaces that snapshot while keeping the link; edits do not publish automatically.
**Stop sharing** removes future public access, but downloaded or imported copies remain usable.
Deleting or replacing the local recipe does not withdraw its public share; manage it separately through
Stop sharing or **My recipes** in the public gallery. Sharing makes no provider calls.

## Portable files and storage

Recipes use plain JSON with `schemaVersion: 1`: `name`, `description`, `content`, `tags`, `decisionModel`,
`inputSchema`, `state`, `questions`, optional presentation labels, and optional examples.
The input schema supports objects, primitive values, arrays of primitives, enums, required fields,
defaults, and bounds. Nested definitions can be edited in Recipe JSON. Remote schema references and
executable templates are rejected. Limits are 512 KB per recipe, 32 questions, and 30 examples.

Files live under `App_Data/chat/user/<user>/jev/`, using the application’s authenticated user identity:

```text
jev/
  recipes/sentiment.json
  history/sentiment/sentiment-00001.md
  index.json
```

History Markdown includes a readable summary and complete JSON record. Browser drafts are separated
by server and signed-in account. Conflicting saves offer a copy or **Reload saved recipe**; edits on disk
also participate in conflict detection. Run one owning host process per App_Data root and back up the
whole Jev directory, including hidden initialization receipts and pending publication journals.

### Move recipes from llms.py

Import an exported JSON file or URL to transfer an individual recipe and recorded examples. This
does not transfer private history or publication ownership. To move a whole profile, stop both hosts,
back up their data, and copy the source user's complete `jev` directory to the destination user's
directory. Reconnect the publisher account separately and review the recipes/history before running.

AI.Chat does not read the older `jev.sqlite` format. Open that profile in current llms.py first so its
migration writes portable files, then stop it before copying. Preserve the initialization receipt and
the original backup; a rollback requires the matching pre-migration data backup.

## Troubleshooting

| Situation | Action |
| --- | --- |
| Cannot run a decision | Enable OpenRouter and configure its API key; recipe authoring's model is separate |
| Cannot share | Enable the `share_llmspy` extension, connect an account, save the recipe, and select a matching successful run |
| Recipe changed after a run | Run the executable definition again before sharing; example-only edits do not require a rerun |
| Save conflict | Save as a copy or reload the saved recipe; preserve your draft before replacing it |
| Need reproducible comparisons | Choose a pinned decision-model version instead of a latest alias |

See [Publishing](/chat/publishing) for public account setup and
[Agent Profiles](/chat/agents) for chat workflows; Decision Studio maintains its own recipes,
inputs, and history.
