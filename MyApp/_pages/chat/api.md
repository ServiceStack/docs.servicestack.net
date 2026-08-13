---
title: Chat API
---

Registering `ChatFeature` gives your App an OpenAI-compatible Chat Completions endpoint and an in-process client, both running the **same pipeline**: provider selection, retry and failover, the tool-execution loop, usage and cost accounting, and every registered extension filter.

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

1. `OnRequestAsync` resolves any Bearer API key onto the request and runs first-request-per-user setup handlers.
2. `ValidateRequest` may reject the request.
3. Chat request filters run, letting extensions mutate the outgoing request.
4. A provider is selected for the requested model, with retry and failover per `Limits.Retries`.
5. Tool calls are executed in a loop, bounded by `Limits.MaxIterations`, pausing for approval where required.
6. Streamed responses are checkpointed every `Limits.StreamCheckpointInterval` into `ChatThread.StreamingMessage`, kept out of the durable `Messages` so a failed stream can't damage the conversation.
7. Chat response filters run, and usage and cost are recorded as a `ChatRequest` row.

Cancellation is cooperative - `ShouldCancelThread` consults the thread's state, so cancelling in the UI stops the loop.

## Related

- [Providers & Models](/chat/providers) - what `model` names resolve to
- [Tools](/chat/tools) - the registry the tool loop draws from
- [Data & Storage](/chat/data) - what a completion persists
