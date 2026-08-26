---
title: Install AI Chat
---

AI Chat is delivered by the **ServiceStack.AI.Chat** NuGet package and requires a **.NET 8+** ServiceStack App.

## Add the plugin

The fastest way to add AI Chat is with the `add-in` npx script, which adds the package, registers both plugins and writes a starting configuration:

:::sh
npx add-in chat
:::

This creates a `Configure.AI.Chat.cs` [Modular Startup](/modular-startup) registering `ChatFeature` and `PdfFeature`:

```csharp
[assembly: HostingStartup(typeof(MyApp.ConfigureAiChat))]

namespace MyApp;

public class ConfigureAiChat : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices((context, services) => {

            services.AddPlugin(new ChatFeature {
                RequireAuth = true,
                // RequiredRole = "Admin",
                Tools = {
                    // EnableCodeExecution = true,
                    // EnableFilesystemTools = true,
                },
                // ApiTools = {
                //     IncludeTags = ["todos"]
                // },
                // Mcp = {
                //     ToolGroups = ["api_tools"],
                // },
            });

            services.AddPlugin(new PdfFeature());
        });
}
```

### Manual install

```xml
<PackageReference Include="ServiceStack.AI.Chat" Version="10.*" />
```

```csharp
services.AddPlugin(new ChatFeature());
```

## Requirements

| Requirement | Needed for | Notes |
| --- | --- | --- |
| .NET 8+ | Everything | `net8.0` and `net10.0` builds |
| `IDbConnectionFactory` | Threads, analytics, media, Gemini | Registered by every ServiceStack App template |
| At least one provider API key | Talking to a model | See [Providers & Models](/chat/providers) |
| `AuthFeature` or Identity Auth | `RequireAuth = true` | See [Integrated Auth](/chat/auth) |
| `typst` CLI | PDF Studio + PDF rendering | Optional - self-disables when missing |
| `ffmpeg` or Mistral | Voice transcription | Optional - self-disables when missing |

:::info
AI Chat resolves its OrmLite connection from the host's `IDbConnectionFactory` and creates its tables when `AutoInitSchema` is true (the default). Without a registered `IDbConnectionFactory`, threads aren't persisted and the `gemini` extension disables itself.
:::

## Configure a provider

Set an API key for at least one provider as an environment variable before running your App:

<text-block :rows="[
  ['OPENAI_API_KEY','OpenAI'],
  ['ANTHROPIC_API_KEY','Anthropic'],
  ['GEMINI_API_KEY','Google Gemini (also enables Gemini File Search)'],
  ['GROQ_API_KEY','Groq'],
  ['OPENROUTER_API_KEY','OpenRouter'],
  ['MISTRAL_API_KEY','Mistral (also enables voice transcription)'],
  ['XAI_API_KEY','xAI']]"></text-block>

Or supply them in code, which takes precedence over environment variables:

```csharp
services.AddPlugin(new ChatFeature {
    Variables = {
        ["OPENAI_API_KEY"] = context.Configuration["OpenAi:ApiKey"]!,
    },
});
```

A local [Ollama](https://ollama.com) or [LM Studio](https://lmstudio.ai) endpoint needs no key at all - see [Providers & Models](/chat/providers).

## Run it

Start your App and open:

<text-block text="/chat"></text-block>

Your existing users can sign in immediately with the account they already have.

<screenshot src="/img/pages/chat/chat-home.webp" title="AI Chat home and conversation UI"></screenshot>

## Add a link from your App

Surface AI Chat from ServiceStack's metadata page:

```csharp
services.ConfigurePlugin<MetadataFeature>(feature => {
    feature.AddPluginLink("/chat", "AI Chat");
});
```

## Install typst for PDF support

PDF Studio and `PdfFeature` shell out to the [Typst](https://typst.app) CLI. Both self-disable when it isn't found, so this is only needed if you want PDF support:

:::sh
brew install typst
:::

:::sh
cargo install --locked typst-cli
:::

AI Chat resolves `typst` from `$TYPST_PATH` first, then `PATH`. See [PDF Studio](/chat/pdf-studio) and [Rendering PDFs](/chat/rendering-pdfs).

## First-run files

On first request AI Chat seeds its configuration into `App_Data/chat`:

<text-block :rows="[
  ['App_Data/chat/llms.json','Providers, defaults, limits, disabled extensions'],
  ['App_Data/chat/providers.json','Model catalog from models.dev'],
  ['App_Data/chat/providers-extra.json','Your own model overrides'],
  ['App_Data/chat/cache/','Content-addressed asset cache'],
  ['App_Data/chat/user/{user}/','Per-user prefs, projects, profiles, skills, pdf']]"></text-block>

These files are yours to edit and check in. See [Data & Storage](/chat/data).

## What's next

- [Configuration](/chat/configuration) - every `ChatFeature` option
- [Providers & Models](/chat/providers) - enabling providers and refreshing the model catalog
- [Integrated Auth](/chat/auth) - choosing an `AuthType` and restricting access
- [API Tools](/chat/api-tools) - exposing your own APIs to AI Models
