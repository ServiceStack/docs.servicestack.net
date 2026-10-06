---
title: Chat API
---

Registering `ChatFeature` gives your App an OpenAI-compatible Chat Completions endpoint and an in-process client, both running the **same pipeline**: provider selection, retry and failover, the tool-execution loop, usage and cost accounting, and every registered extension filter.

<api-surfaces>
</api-surfaces>

## POST /v1/chat/completions

The typed `ChatCompletion` service is mounted **unprefixed** at the standard OpenAI path, regardless of `RoutePrefix`:

```bash
curl https://your-app.example.com/v1/chat/completions \
  -H "Authorization: Bearer $MY_APP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "Claude Sonnet 5",
    "messages": [
      { "role": "user", "content": "Capital of France?" }
    ]
  }'
```

Authentication is an Identity cookie **or** a Bearer API Key when [`ApiKeysFeature`](/auth/apikeys) is registered. `ValidateRequest` runs before the completion, so quotas and policy apply here too.

:::info
OpenAI's wire format is richer than any typed DTO can express - message content may be a plain string *or* an array of parts. AI Chat therefore treats the **raw request JSON as the source of truth**, and writes the provider's response back verbatim so provider-specific fields aren't lost in a round-trip.
:::

Because the endpoint is OpenAI-compatible, any OpenAI SDK works against it by changing the base URL - including [typed clients in 15 languages](/add-servicestack-reference) generated from your App's own metadata.

## IChatClient

For C# code inside the App, `IChatClient` runs the same pipeline without the HTTP round-trip:

```csharp
public class SummaryServices(IChatClient chat) : Service
{
    public async Task<object> Any(SummarizeTicket request)
    {
        var ticket = await Db.SingleByIdAsync<Ticket>(request.Id);

        var response = await chat.ChatAsync(new ChatCompletion {
            Model = "Claude Sonnet 5",
            Messages = [
                new() {
                    Role = "user",
                    Content = [new AiTextContent {
                        Type = "text",
                        Text = $"Summarize this support ticket in two sentences:\n\n{ticket.Body}",
                    }],
                },
            ],
        });

        return new SummarizeTicketResponse {
            Summary = response.Choices[0].Message.Content,
        };
    }
}
```

```csharp
public interface IChatClient
{
    Task<ChatResponse> ChatAsync(ChatCompletion request, CancellationToken token = default);
    Task<DecisionResponse> CreateDecisionAsync(CreateDecision request, CancellationToken token = default);
}
```

It **throws on failure** with the same exceptions the service surfaces, e.g. `HttpError.NotFound` when no configured provider serves the requested model.

### Attributing usage to a user

There's no `IRequest` to authenticate an in-process call, so attribute it explicitly with `Metadata["user"]`. Omitting it records the usage against the `"default"` user, matching how the feature behaves with `RequireAuth = false`:

```csharp
var response = await chat.ChatAsync(new ChatCompletion {
    Model = "Claude Sonnet 5",
    Messages = [ /* ... */ ],
    Metadata = new() { ["user"] = base.GetSession().UserName },
});
```

This is what makes the call show up correctly in [Analytics](/chat/analytics) and be billed to the right user.

## Decisions API

Some questions don't need a chat reply, just a typed answer your code can act on: *is this urgent?*, *which
team should handle it?*, *how frustrated is the customer?* `CreateDecisionAsync` sends them to
OpenRouter's [Decisions API](https://openrouter.ai/docs/api/api-reference/alphadecisions/submit-a-decisions-questions-and-answers-request),
which is served by decision models like TypeSafe's [Jev](https://openrouter.ai/docs/guides/community/jev).
The model answers each question about the state you send, and your code owns the workflow:

```csharp
public class TicketServices(IChatClient chat) : Service
{
    public async Task<object> Any(TriageTicket request)
    {
        var ticket = await Db.SingleByIdAsync<Ticket>(request.Id);

        var decision = await chat.CreateDecisionAsync(new CreateDecision {
            State = ticket.Body,
            Questions = {
                ["is_urgent"] = DecisionQuestion.Noul("Does this message convey urgency?",
                    whenTrue: "Explicitly time-sensitive", whenFalse: "No urgency expressed"),
                ["department"] = DecisionQuestion.Choice("Which team should handle this?", new() {
                    ["billing"]   = "Payments, invoicing, refunds",
                    ["technical"] = "Bugs, outages, integrations",
                    ["sales"]     = "Pricing, upgrades, new accounts",
                }),
                ["frustration"] = DecisionQuestion.Score("How frustrated is the customer?",
                    "Calm", "Frustrated", "Very angry"),
            },
        });

        if (decision.Noul("is_urgent") > 0.8 && decision.Choice("department") == "billing")
            await EscalateToBillingAsync(ticket);

        return new TriageTicketResponse {
            Department = decision.Choice("department"),
            Frustration = decision.Score("frustration"),
        };
    }
}
```

Decisions use your [OpenRouter provider](/chat/providers) and its `OPENROUTER_API_KEY`. `Model` defaults to
`~typesafe/jev-latest`.

### Question types

<text-block :rows="[
  ['Noul','A probability from 0 (no) to 1 (yes). Criteria describe what true and false mean'],
  ['Choice','One named option, with the probability of each option'],
  ['Score','A position on an ordered scale (0 = the first description), with its distribution']]"></text-block>

`State` is the content to evaluate. It can be text, or an object or list of related context, e.g. a
`Dictionary<string,object>`, a POCO or a `JsonNode`:

```csharp
State = new Dictionary<string, object> {
    ["subject"] = ticket.Subject,
    ["body"] = ticket.Body,
    ["plan"] = customer.Plan,
},
```

Read answers with `decision.Noul()`, `decision.Choice()` and `decision.Score()`. Each one throws if the
question doesn't exist or has a different type. For the full distribution, use `decision.Answers[name]`:

```csharp
var department = decision.Answers["department"];
department.Probabilities  // { billing: 0.86, technical: 0.12, sales: 0.02 }
department.Confidence     // 0.84

var frustration = decision.Answers["frustration"];
frustration.Legend        // { "0": "Calm", "1": "Frustrated", "2": "Very angry" }

decision.Usage            // InputTokens, OutputTokens and Cost
```

### A single, checked request

A decision is one paid request, so it doesn't go through the chat pipeline:

- **Never retried or failed over.** If OpenRouter doesn't respond in time, the request fails with `504`
  instead of being sent again, since OpenRouter may already have processed (and charged for) it
- **Not part of a conversation.** Nothing is stored in chat history, and no tools or extension filters run
- **Checked before it's sent.** Invalid requests fail with `400` before any call to OpenRouter, e.g. a
  question without instructions, or a Noul question missing its true or false description
- **Checked when it returns.** Every question must be answered, with valid probabilities and an option
  or scale position that matches the question

Failures throw a `ChatDecisionException`, which is an `HttpError`. Its `ProviderStatus` is the status
OpenRouter returned. When OpenRouter rejects the API key, the error is `502` rather than `401`, so it
isn't mistaken for the caller's own authentication failing:

<text-block :rows="[
  ['400','OpenRouter rejected the request, or it failed validation'],
  ['402','The OpenRouter account needs credits'],
  ['413','The state is too large'],
  ['429','OpenRouter is rate limiting requests'],
  ['502','OpenRouter rejected its API key, failed, or returned an invalid answer'],
  ['503','OpenRouter isn’t enabled or has no API key'],
  ['504','OpenRouter didn’t respond in time. The request isn’t retried']]"></text-block>

`User` and `SessionId` are only sent to OpenRouter when you set them, and a decision's usage and cost are
returned in `Usage` rather than recorded in [Analytics](/chat/analytics).

### POST /v1/decisions

The same API is available over HTTP, with the same authentication as `/v1/chat/completions`. It accepts
OpenRouter's request JSON and returns the response with validated answers:

```bash
curl https://your-app.example.com/v1/decisions \
  -H "Authorization: Bearer $MY_APP_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "~typesafe/jev-latest",
    "state": "Help! My payouts have been failing for 3 days.",
    "questions": {
      "is_urgent": {
        "type": "noul",
        "instructions": "Does this message convey urgency?",
        "criteria": { "true": "Explicitly time-sensitive", "false": "No urgency expressed" }
      }
    }
  }'
```

## Chat UI routes

The Chat UI's own endpoints are dispatched through `ChatFeature`'s route registry under `RoutePrefix`:

<text-block :rows="[
  ['GET  /chat','The Chat UI'],
  ['GET  /chat/config','authType, providers, defaults (anonymous)'],
  ['GET  /chat/models','Model catalog across live providers'],
  ['GET  /chat/providers','Providers with their models + server tools'],
  ['GET  /chat/status','all / enabled / disabled provider ids'],
  ['POST /chat/providers/{provider}','Enable or disable a provider'],
  ['GET  /chat/prefs','The signed-in user’s preferences'],
  ['POST /chat/upload','Upload an attachment into the cache'],
  ['GET  /chat/~cache/{path}','Serve a cached asset'],
  ['GET  /chat/ext','UI extension modules to import (anonymous)'],
  ['GET  /chat/ui/{path}','Static UI assets (anonymous)'],
  ['GET  /chat/custom/{path}','Your App’s own Chat UI assets (anonymous)'],
  ['GET  /chat/auth','Current auth info, 401 when signed out'],
  ['POST /chat/auth/logout','Sign out']]"></text-block>

Extension routes are namespaced under `/chat/ext/{extension}/`, e.g. `/chat/ext/gemini/filestores`. See each feature's page for its routes, and [Custom Extensions](/chat/custom-extensions) for adding your own.

## Working with the model catalog

```csharp
var models = feature.GetActiveModels();       // JsonArray across all live providers
var (enabled, disabled) = feature.ProviderStatus();

await feature.EnableProviderAsync("anthropic");
await feature.DisableProviderAsync("openai");
await feature.UpdateProviderModelsAsync();    // refresh from models.dev
```

The model catalog is also available to [#Script](https://sharpscript.net) as `Chat.Models`:

```html
{{ Chat.Models | take(10) | join(', ') }}
```

## Per-thread request args

The Chat UI can set a whitelisted set of per-thread request arguments, which are forwarded to the provider:

<text-block :rows="[
  ['temperature, top_p, seed','Sampling'],
  ['max_completion_tokens','Response length'],
  ['frequency_penalty, presence_penalty, stop','Generation controls'],
  ['reasoning_effort, enable_thinking, verbosity','Reasoning models'],
  ['service_tier, safety_identifier, store','Provider policy'],
  ['top_logprobs','Diagnostics'],
  ['image_config','Image generation']]"></text-block>

`ChatFeature.RequestArgs` is the authoritative set; anything else supplied by the UI is ignored.

## The pipeline in brief

<request-pipeline>
</request-pipeline>

Cancellation is cooperative - `ShouldCancelThread` consults the thread's state, so cancelling in the UI stops the loop.

## Related

- [Providers & Models](/chat/providers) - what `model` names resolve to
- [Tools](/chat/tools) - the registry the tool loop draws from
- [Data & Storage](/chat/data) - what a completion persists
- [Jev on OpenRouter](https://openrouter.ai/docs/guides/community/jev) - the decision model and how to write good questions
