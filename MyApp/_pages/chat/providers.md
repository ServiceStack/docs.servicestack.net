---
title: Providers & Models
---

AI Chat normalizes commercial, open and locally-hosted providers behind one model selector. Users move between fast inexpensive models, frontier reasoning models, private local models and specialized generation models without learning a different application for each.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Model selector': '/img/pages/chat/models/model-selector.webp',
    'Filter by provider': '/img/pages/chat/models/model-selector-providers.webp',
}"></screenshots-gallery>

## Built-in providers

| Provider | `llms.json` key | API Key |
| --- | --- | --- |
| OpenAI | `openai` | `OPENAI_API_KEY` |
| Anthropic | `anthropic` | `ANTHROPIC_API_KEY` |
| Google Gemini | `google` | `GEMINI_API_KEY` |
| Groq | `groq` | `GROQ_API_KEY` |
| xAI | `xai` | `XAI_API_KEY` |
| Cerebras | `cerebras` | `CEREBRAS_API_KEY` |
| Mistral | `mistral` | `MISTRAL_API_KEY` |
| Codestral | `codestral` | `CODESTRAL_API_KEY` |
| OpenRouter | `openrouter` | `OPENROUTER_API_KEY` |
| Fireworks | `fireworks-ai` | `FIREWORKS_API_KEY` |
| DeepSeek | `deepseek` | `DEEPSEEK_API_KEY` |
| Moonshot | `moonshotai` | `MOONSHOT_API_KEY` |
| Z.ai | `zai` / `zai-coding-plan` | `ZAI_API_KEY` / `ZHIPU_API_KEY` |
| MiniMax | `minimax` | `MINIMAX_API_KEY` |
| Nvidia | `nvidia` | `NVIDIA_API_KEY` |
| Chutes | `chutes` | `CHUTES_API_KEY` |
| Alibaba | `alibaba` | — |
| Hugging Face | `huggingface` | — |
| GitHub Copilot / Models | `github-copilot`, `github-models` | — |
| Ollama | `ollama` | none (local) |
| Ollama Cloud | `ollama-cloud` | `OLLAMA_API_KEY` |
| LM Studio | `lmstudio` | none (local) |
| OpenAI-compatible (local) | `openai-local` | — |
| llms.py | `llmspy` | — |

The `ChatApiKey` static class names every environment variable AI Chat looks for:

```csharp
ChatApiKey.OpenAI      // "OPENAI_API_KEY"
ChatApiKey.Anthropic   // "ANTHROPIC_API_KEY"
ChatApiKey.Gemini      // "GEMINI_API_KEY"
```

## How a provider becomes live

A provider is created and registered when **all** of these hold:

1. It has an entry in `llms.json`'s `providers` object.
2. It is enabled — either `"enabled": true` in its definition, or named in `ChatFeature.EnableProviders`.
3. Its `npm` sdk id resolves to a factory in `ChatFeature.ProviderTypes`.
4. `provider.Test()` passes, which normally means an API key was resolved.

API keys are resolved in this order:

<text-block :rows="[
  ['ChatFeature.Variables','Programmatic values, checked first'],
  ['Environment variables','$OPENAI_API_KEY etc.'],
  ['api_key in llms.json','A literal value, or a $VAR reference resolved as above']]"></text-block>

```csharp
services.AddPlugin(new ChatFeature {
    Variables = {
        ["OPENAI_API_KEY"] = context.Configuration["OpenAi:ApiKey"]!,
        ["ANTHROPIC_API_KEY"] = context.Configuration["Anthropic:ApiKey"]!,
    },
});
```

:::tip
Providers that can't resolve a key are simply skipped with an informational log entry — a missing key never fails startup.
:::

## Restricting the providers users can reach

`EnableProviders` overrides every `enabled` flag in `llms.json`, which makes it the simplest way to pin a deployment to an approved set:

```csharp
services.AddPlugin(new ChatFeature {
    // only these providers, whatever llms.json says
    EnableProviders = ["anthropic", "ollama"],
});
```

For a fully self-hosted deployment, enable only `ollama` or `lmstudio` — nothing then leaves your network.

## llms.json

`App_Data/chat/llms.json` is seeded from an embedded default on first run and is yours to edit:

```json
{
  "version": 3,
  "disable_extensions": [],
  "defaults": {
    "headers": { "Content-Type": "application/json" },
    "text":  { "model": "DeepSeek V4 Flash", "messages": [] },
    "image": { "model": "MiMo-V2.5", "messages": [] }
  },
  "limits": {
    "client_timeout": 240,
    "client_max_size": 20971520,
    "retries": 3
  },
  "loading": ["Computing", "Cooking", "Crafting"],
  "providers": {
    "groq":      { "enabled": true },
    "anthropic": { "enabled": true },
    "ollama":    { "enabled": true }
  }
}
```

| Key | Purpose |
| --- | --- |
| `defaults` | Default model + message shape per modality, and headers sent to every provider |
| `limits` | Maps onto `ChatFeature.Limits` |
| `loading` | Words shown while a response streams |
| `disable_extensions` | Merged with `ChatFeature.DisableExtensions` |
| `providers` | Which providers are enabled, plus any per-provider overrides |

### Supplying config in code

Set `Config` (or `ConfigJson`) to bypass the `App_Data` file entirely — useful when configuration should come from your appsettings or a secret store:

```csharp
services.AddPlugin(new ChatFeature {
    ConfigJson = File.ReadAllText("llms.json"),
});
```

Top-level `$VAR` values in `Config` are substituted on load, so `"api_key": "$MY_KEY"` works anywhere a key is expected.

## providers.json and the model catalog

`App_Data/chat/providers.json` holds the model catalog — ids, display names, context sizes, pricing and capability flags — sourced from [models.dev](https://models.dev). A provider definition in `llms.json` is **merged over** its `providers.json` entry, with the definition winning.

Refresh the catalog at runtime, keeping only your configured providers and layering in your own overrides:

```csharp
var count = await feature.UpdateProviderModelsAsync();
```

### providers-extra.json

Models that aren't in models.dev — a private deployment, a preview model, a self-hosted checkpoint — go in `App_Data/chat/providers-extra.json` and survive every catalog refresh:

```json
{
  "openai-local": {
    "models": {
      "my-finetune-v3": {
        "name": "My Finetune v3",
        "limit": { "context": 128000, "output": 8192 }
      }
    }
  }
}
```

## Enabling and disabling at runtime

Providers can be toggled without a restart. Both persist the change to `llms.json` and rebuild the live provider set:

```csharp
// returns null on success, or the reason it couldn't be enabled
var error = await feature.EnableProviderAsync("anthropic");

await feature.DisableProviderAsync("openai");
```

```csharp
var (enabled, disabled) = feature.ProviderStatus();
```

The Chat UI exposes the same operations, so an administrator can enable a provider from the browser once its key is present.

## Local models

Ollama and LM Studio need no API key — AI Chat just needs to reach their endpoint:

```json
{
  "providers": {
    "ollama": {
      "enabled": true,
      "base_url": "http://localhost:11434/v1"
    }
  }
}
```

Any other OpenAI-compatible endpoint can be added under `openai-local`, or registered as a new sdk id — see [Custom Extensions](/chat/custom-extensions).

## Modalities

A provider definition can declare sub-providers for non-text modalities. Each is created as its own provider and attached to the parent:

```json
{
  "providers": {
    "openai": {
      "enabled": true,
      "modalities": {
        "image": { "npm": "openai/image" }
      }
    }
  }
}
```

Built-in modality sdk ids include `openai/image`, `openrouter/image`, `openrouter/audio`, `openrouter/text-to-speech`, `fireworks/image`, `zai/image`, `chutes/image`, `nvidia/image` and `mistral/transcriptions`.

An unsupported modality sdk drops just that modality rather than disabling the whole provider. See [Voice & Media](/chat/media).

## Server tools

Some providers host their own tools — web search, web fetch, code execution. AI Chat surfaces whatever the selected provider advertises, generating the configuration UI from the tool's JSON Schema:

<screenshot src="/img/pages/chat/tools/llm-tool-call.webp" title="Provider-hosted server tool configuration"></screenshot>

## Adding a provider type

Register a new npm sdk id from an extension's `Install`:

```csharp
public override void Install(ExtensionContext ctx)
{
    ctx.AddProvider("my-company/llm", () => new MyCompanyProvider());
}
```

Then reference it from `llms.json`:

```json
{
  "providers": {
    "my-company": { "enabled": true, "npm": "my-company/llm", "api_key": "$MY_COMPANY_KEY" }
  }
}
```

Most services only need `OpenAiCompatibleProvider` with a different `base_url`.
