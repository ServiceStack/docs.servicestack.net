---
title: AI Chat UI
---

A major value proposition of [AI Chat](/ai-chat-api) is being able to offer a ChatGPT-like UI to your users where you're able to control the API Keys, billing, and sanctioned providers your users can access to maintain your own **Fast, Local, and Private** access to AI from within your own organization.

### Identity Auth or Valid API Key

AI Chat makes of ServiceStack's new [API Keys or Identity Auth APIs](https://servicestack.net/posts/apikey_auth_apis) which allows usage for both Authenticated Identity Auth users otherwise unauthenticated users will need to provide a valid API Key:

:::{.shadow}
[![](/img/pages/ai-chat/ai-chat-ui-apikey.webp)](/img/pages/ai-chat/ai-chat-ui-apikey.webp)
:::

If needed `ValidateRequest` can be used to further restrict access to AI Chat's UI and APIs, e.g. you can restrict access to API Keys with the `Admin` scope with:

```csharp
services.AddPlugin(new ChatFeature {
    ValidateRequest = async req => 
        req.GetApiKey()?.HasScope(RoleNames.Admin) == true 
            ? null 
            : HttpResult.Redirect("/admin-ui"),
});
```

### Import / Export

All data is stored locally in the users local browser's IndexedDB. When needed you can backup and transfer your
entire chat history between different browsers using the **Export** and **Import** features on the home page.

:::{.wideshot}
[![llms-home.webp](/img/pages/ai-chat/llms-home.webp)](/img/pages/ai-chat/llms-home.webp)
:::

## Simple and Flexible UI

Like all of [ServiceStack's built-in UIs](https://servicestack.net/auto-ui), AI Chat is also [naturally customizable](/locode/custom-overview)
where you can override any of [AI Chat's Vue Components](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack/src/ServiceStack.AI.Chat/chat)
and override them with your own by placing them in your
[/wwwroot/chat](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack/tests/AdhocNew/wwwroot/chat) folder:

```files
/wwwroot
  /chat
    Brand.mjs
    Welcome.mjs
```

Where you'll be able to customize the appearance and behavior of AI Chat's UI to match your App's branding and needs.

:::{.wideshot}
[![](/img/pages/ai-chat/ai-chat-custom-ui.webp)](/img/pages/ai-chat/ai-chat-custom-ui.webp)
:::

## Customize

The built-in [ui.json](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.AI.Chat/chat/ui.json)
configuration can be overridden with your own to use your preferred system prompts and other defaults by adding them to your local folder:

```files
/wwwroot
  /chat
    llms.json
    ui.json
```

Alternatively `ConfigJson` and `UiConfigJson` can be used to load custom JSON configuration from a different source, e.g:

```csharp
services.AddPlugin(new ChatFeature {
    // Use custom llms.json configuration
    ConfigJson = vfs.GetFile("App_Data/llms.json").ReadAllText(),

    // Use custom ui.json configuration
    UiConfigJson = vfs.GetFile("App_Data/ui.json").ReadAllText(),
});

```

## Rich Markdown & Syntax Highlighting

To maximize readability there's full support for Markdown and Syntax highlighting for the most popular programming
languages.

:::{.wideshot}
[![llms-syntax.webp](/img/pages/ai-chat/llms-syntax.webp)](/img/pages/ai-chat/llms-syntax.webp)
:::

To quickly and easily make use of AI Responses, **Copy Code** icons are readily available on hover of all messages
and code blocks.

## Rich, Multimodal Inputs

The Chat UI goes beyond just text and can take advantage of the multimodal capabilities of modern LLMs
with support for Image, Audio, and File inputs.

### 🖼️ 1. Image Inputs & Analysis

Images can be uploaded directly into your conversations with vision-capable models for comprehensive image analysis.

Visual AI Responses are highly dependent on the model used. This is a typical example of the visual analysis provided by the latest Gemini Flash of our [ServiceStack Logo](/img/logo.png):

:::{.wideshot}
[![llms-image.webp](/img/pages/ai-chat/llms-image.webp)](/img/pages/ai-chat/llms-image.webp)
:::

### 🎤 2. Audio Input & Transcription

Likewise you can upload Audio files and have them transcribed and analyzed by multi-modal models with audio capabilities.

:::{.wideshot}
[![llms-audio.webp](/img/pages/ai-chat/llms-audio.webp)](/img/pages/ai-chat/llms-audio.webp)
:::

Example of processing audio input. Audio files can be uploaded with system and user prompts
to instruct the model to transcribe and summarize its content where its
multi-modal capabilities are integrated right within the chat interface.

### 📎 3. File and PDF Attachments

In addition to images and audio, you can also upload documents, PDFs, and other files to
capable models to extract insights, summarize content or analyze.

**Document Processing Use Cases:**
- **PDF Analysis**: Upload PDF documents for content extraction and analysis
- **Data Extraction**: Extract specific information from structured documents
- **Document Summarization**: Get concise summaries of lengthy documents
- **Query Content**: Ask questions about specific content in documents
- **Batch Processing**: Upload multiple files for comparative analysis

Perfect for research, document review, data analysis, and content extractions.

:::{.wideshot}
[![llms-files.webp](/img/pages/ai-chat/llms-files.webp)](/img/pages/ai-chat/llms-files.webp)
:::

## Custom AI Chat Requests

Send Custom Chat Completion requests through the settings dialog, allowing Users to fine-tune
their AI requests with advanced options including:

- **Temperature** `(0-2)` for controlling response randomness
- **Max Completion Tokens** to limit response length
- **Seed** values for deterministic sampling
- **Top P** `(0-1)` for nucleus sampling
- **Frequency** & **Presence Penalty** `(-2.0 to 2.0)` for reducing repetition
- **Stop** Sequences to control where the API stops generating
- **Reasoning Effort** constraints for reasoning models
- **Top Logprobs** `(0-20)` for token probability analysis
- **Verbosity** settings

:::{.wideshot}
[![llms-settings.webp](/img/pages/ai-chat/llms-settings.webp)](/img/pages/ai-chat/llms-settings.webp)
:::

## Enable / Disable Providers

**Admin** Users can manage which providers they want enabled or disabled at runtime.
Providers are invoked in the order they're defined in `llms.json` that supports the requested model.
If a provider fails, it tries the next available one.

By default `llms.json` defines providers with Free tiers first, followed by local providers and then 
premium cloud providers which can all be enabled or disabled from the UI:

:::{.wideshot}
[![llms-providers.webp](/img/pages/ai-chat/llms-providers.webp)](/img/pages/ai-chat/llms-providers.webp)
:::

## Search History

Quickly find past conversations with built-in search:

:::{.wideshot}
[![llms-search-python.webp](/img/pages/ai-chat/llms-search-python.webp)](/img/pages/ai-chat/llms-search-python.webp)
:::

## Smart Autocomplete for Models & System Prompts

Autocomplete components are used to quickly find and select the preferred model and system prompt.

Only models from enabled providers will appear in the drop down, which will be available immediately after
providers are enabled.

:::{.wideshot}
[![llms-autocomplete.webp](/img/pages/ai-chat/llms-autocomplete.webp)](/img/pages/ai-chat/llms-autocomplete.webp)
:::

## Comprehensive System Prompt Library

Access a curated collection of 200+ professional system prompts designed for various use cases, from technical assistance to creative writing.

:::{.wideshot}
[![llms-system-prompt.webp](/img/pages/ai-chat/llms-system-prompt.webp)](/img/pages/ai-chat/llms-system-prompt.webp)
:::

System Prompts be can added, removed & sorted in your `ui.json`

```json
{
  "prompts": [
    {
      "id": "it-expert",
      "name": "Act as an IT Expert",
      "value": "I want you to act as an IT expert. You will be responsible..."
    },
    ...
  ]
}
```

### Reasoning

Access the thinking process of advanced AI models with specialized rendering for reasoning and chain-of-thought responses:

:::{.wideshot}
[![llms-reasoning.webp](/img/pages/ai-chat/llms-reasoning.webp)](/img/pages/ai-chat/llms-reasoning.webp)
:::

We're excited to get AI Chat in customers hands. Please [let us know](https://servicestack.net/ideas) of any other missing features you'd love to see implemented.