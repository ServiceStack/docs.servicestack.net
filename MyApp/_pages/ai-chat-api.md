---
title: AI Chat
---

**AI Chat** is our refreshingly simple solution for integrating AI into your applications by unlocking the full value 
of the OpenAI Chat API. Unlike most other OpenAI SDKs and Frameworks, all of AI Chat's features are centered around 
arguably the most important API in our time - OpenAI's simple 
[Chat Completion API](https://platform.openai.com/docs/api-reference/chat)
i.e. the primary API used to access Large Language Models (LLMs).

## Install

AI Chat can be added to any .NET 8+ project by installing the **ServiceStack.AI.Chat** NuGet package and 
configuration with:

:::sh
x mix chat
:::

Which drops this simple [Modular Startup](/modular-startup) that adds the `ChatFeature`
and registers a link to its UI on the [Metadata Page](/metadata-page) if you want it:

```csharp
public class ConfigureAiChat : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            services.AddPlugin(new ChatFeature());
             
            services.ConfigurePlugin<MetadataFeature>(feature => {
                feature.AddPluginLink("/chat", "AI Chat");
            });
       });
}
```

#### Prerequisites:

As AI Chat protects its APIs and UI with Identity Auth or API Keys, you'll need to enable the [API Keys Feature](/auth/apikeys) if you haven't already:

:::sh
x mix apikeys
:::

## Single Powerful API

Your App logic needs only bind to a simple `IChatClient` interface that accepts a Typed `ChatCompletion` Request DTO 
and returns a Typed `ChatResponse` DTO:

```csharp
public interface IChatClient
{
    Task<ChatResponse> ChatAsync(
        ChatCompletion request, CancellationToken token=default);
}
```

An impl-free easily substitutable interface for calling any OpenAI-compatible Chat API, using clean
Typed `ChatCompletion` and `ChatResponse` DTOs.

Unfortunately since the API needs to be typed and .NET Serializers don't have support for de/serializing union types
yet, the DTO adopts OpenAI's more verbose and flexible multi-part Content Type which looks like: 

```csharp
IChatClient client = CreateClient();

var request = new ChatCompletion
{
    Model = "gpt-5",
    Messages = [
        new() {
            Role = "user",
            Content = [
                new AiTextContent {
                    Type = "text", Text = "Capital of France?"
                }
            ],
        }
    ]
};

var response = await client.ChatAsync(request);
```

To improve the UX we've added a [Message.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.AI.Chat/Message.cs) helper
which encapsulates the boilerplate of sending **Text**, **Image**, **Audio** and **Files** into more 
succinct and readable code where you'd typically only need to write: 

```csharp
var request = new ChatCompletion
{
    Model = "gpt-5",
    Messages = [
        Message.SystemPrompt("You are a helpful assistant"),
        Message.Text("Capital of France?"),
    ]
};
var response = await client.ChatAsync(request);
string? answer = response.GetAnswer(); 
```

### Same ChatCompletion DTO, Used Everywhere

That's all that's required for your internal App Logic to access your App's configured AI Models. However, as 
AI Chat also makes its own OpenAI Compatible API available, your external .NET Clients can use the 
**same exact DTO** to get the **same Response** by calling your API with a 
[C# Service Client](/csharp-client):

```csharp
var client = new JsonApiClient(BaseUrl) {
    BearerToken = apiKey
};
var response = await client.SendAsync(request);
```

### Support for Text, Images, Audio & Files

For Multi-modal LLMs which support it, you can also send Images, Audio & File attachments with your AI Request
using **URLs**, e.g:

```csharp
var image = new ChatCompletion
{
    Model = "qwen2.5vl",
    Messages = [
        Message.Image(imageUrl:"https://example.org/image.webp",
            text:"Describe the key features of the input image"),
    ]
}

var audio = new ChatCompletion
{
    Model = "gpt-4o-audio-preview",
    Messages = [
        Message.Audio(data:"https://example.org/speaker.mp3",
            text:"Please transcribe and summarize this audio file"),
    ]
};

var file = new ChatCompletion
{
    Model = "gemini-flash-latest",
    Messages = [
        Message.File(
            fileData:"https://example.org/order.pdf",
            text:"Please summarize this document"),
    ]
};
```

#### Relative File Path

If a [VirtualFiles Provider](/virtual-file-system) was configured, you can specify a relative path instead:

```csharp
var image = new ChatCompletion
{
    Model = "qwen2.5vl",
    Messages = [
        Message.Image(imageUrl:"/path/to/image.webp",
            text:"Describe the key features of the input image"),
    ]
};
```

#### Manual Download & Embedding

Alternatively you can embed and send the raw Base64 Data or Data URI yourself:

```csharp
var bytes = await "https://example.org/image.webp".GetBytesFromUrlAsync();
var dataUri = $"data:image/webp;base64,{Convert.ToBase64String(bytes)}";
var image = new ChatCompletion
{
    Model = "qwen2.5vl",
    Messages = [
        Message.Image(imageUrl:dataUri,
            text:"Describe the key features of the input image"),
    ]
};
```

Although sending references to external resources allows keeping AI Requests payloads small, making them 
easier to store in Databases, send in MQs and client workflows, etc.

This illustrates some of the "value-added" features of AI Chat where it will automatically download any URL Resources
and embed it as Base64 Data in the `ChatCompletion` Request DTO.

### Configure Downloads

Relative paths can be enabled by configuring a `VirtualFiles` Provider to refer to a safe path that you want to allow 
access to.

Whilst URLs are downloaded by default, but its behavior can be customized with `ValidateUrl` or replaced entirely with 
`DownloadUrlAsBase64Async`: 

```csharp
services.AddPlugin(new ChatFeature {
    // Enable Relative Path Downloads
    VirtualFiles = new FileSystemVirtualFiles(assetDir),

    // Validate URLs before download
    ValidateUrl = url => {
        if (!IsAllowedUrl(url))
            throw HttpError.Forbidden("URL not allowed");
    },
    
    // Use Custom URL Downloader
    // DownloadUrlAsBase64Async = async (provider, url) => {
    //     var (base64, mimeType) = await MyDownloadAsync(url);
    //     return (base64, mimeType);
    // },
});
```

## Configure AI Providers

By default AI Chat is configured with a list of providers in its `llms.json`
which is pre-configured with the best models from the leading LLM providers.

The easiest way to use a custom `llms.json` is to add a local modified copy of
[llms.json](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.AI.Chat/chat/llms.json) 
to your App's `/wwwroot/chat` folder:

```files
/wwwroot
  /chat
    llms.json
```

If you just need to change which providers are enabled you can specify them in `EnableProviders`:

```csharp
services.AddPlugin(new ChatFeature {
    // Specify which providers you want to enable
    EnableProviders =
    [
        "openrouter_free",
        "groq",
        "google_free",
        "codestral",
        "ollama",
        "openrouter",
        "google",
        "anthropic",
        "openai",
        "grok",
        "qwen",
        "z.ai",
        "mistral",
    ],

    // Use custom llms.json configuration
    ConfigJson = vfs.GetFile("App_Data/llms.json").ReadAllText(),
});
```

Alternatively you can use `ConfigJson` to load a custom JSON provider configuration from a different source, which 
you'll want to use if you prefer to keep your provider configuration and API Keys all in `llms.json`.

### llms.json - OpenAI Provider Configuration

[llms.json](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.AI.Chat/chat/llms.json)
contains a list of OpenAI Compatible Providers you want to make available along with a user-defined **model alias**
you want to use for model routing along with the provider-specific model name it maps to when the model is used 
with that provider, e.g:

```json
{
  "providers": {
    "openrouter": {
      "enabled": false,
      "type": "OpenAiProvider",
      "base_url": "https://openrouter.ai/api",
      "api_key": "$OPENROUTER_API_KEY",
      "models": {
        "grok-4": "x-ai/grok-4",
        "glm-4.5-air": "z-ai/glm-4.5-air",
        "kimi-k2": "moonshotai/kimi-k2",
        "deepseek-v3.1:671b": "deepseek/deepseek-chat",
        "llama4:400b": "meta-llama/llama-4-maverick"
      }
    },
    "anthropic": {
      "enabled": false,
      "type": "OpenAiProvider",
      "base_url": "https://api.anthropic.com",
      "api_key": "$ANTHROPIC_API_KEY",
      "models": {
        "claude-sonnet-4-0": "claude-sonnet-4-0"
      }
    },
    "ollama": {
      "enabled": false,
      "type": "OllamaProvider",
      "base_url": "http://localhost:11434",
      "models": {},
      "all_models": true
    },
    "google": {
      "enabled": false,
      "type": "GoogleProvider",
      "api_key": "$GOOGLE_API_KEY",
      "models": {
        "gemini-flash-latest": "gemini-flash-latest",
        "gemini-flash-lite-latest": "gemini-flash-lite-latest",
        "gemini-2.5-pro": "gemini-2.5-pro",
        "gemini-2.5-flash": "gemini-2.5-flash",
        "gemini-2.5-flash-lite": "gemini-2.5-flash-lite"
      },
      "safety_settings": [
        {
          "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
          "threshold": "BLOCK_ONLY_HIGH"
        }
      ],
      "thinking_config": {
        "thinkingBudget": 1024,
        "includeThoughts": true
      }
    },
    //...
  }
}
```

The only non-OpenAI Chat Provider AI Chat supports is `GoogleProvider`, where an exception was made to add explicit 
support for Gemini's Models given its low cost and generous free quotas.

### Provider API Keys

API Keys can be either be specified within the `llms.json` itself, alternatively API Keys starting with `$` like 
`$GOOGLE_API_KEY` will first try to resolve it from `Variables` before falling back to checking Environment Variables.

```csharp
services.AddPlugin(new ChatFeature {
    EnableProviders =
    [
        "openrouter",
        "anthropic",
        "google",
    ],
    Variables =
    {
        ["OPENROUTER_API_KEY"] = secrets.OPENROUTER_API_KEY,
        ["ANTHROPIC_API_KEY"] = secrets.ANTHROPIC_API_KEY,
        ["GOOGLE_API_KEY"] = secrets.GOOGLE_API_KEY,
    }
});
```

### Model Routing and Failover

Providers are invoked in the order they're defined in `llms.json` that supports the requested model. 
If a provider fails, it tries the next available provider.

This enables scenarios like:
- Routing different request types to different providers
- Optimize by Cost, Performance, Reliability, or Privacy
- A/B testing different models
- Added resilience with fallback when a provider is unavailable

The model aliases don't need to identify a model directly, e.g. you could use your own artificial names for use-cases 
you need like `image-captioner`, `audio-transcriber`, `pdf-extractor` then map them to different models different providers 
should use to achieve the desired task.

#### Use Model Routing with Fallback

To make use of the model routing and fallback you would call `ChatAsync` on `IChatClient` directly:

```csharp
class MyService(IChatClient client)
{
    public async Task<object> Any(DefaultChat request)
    {
        return await client.ChatAsync(new ChatCompletion {
            Model = "glm-4.6",
            Messages = [
                Message.Text(request.UserPrompt)
            ],
        });
    }
}
```

#### Use Specific Provider

Alternatively to use a specific provider, you can use `IChatClients` dependency `GetClient(providerId)` method 
to resolve the provider then calling `ChatAsync` will only use that provider:

```csharp
class MyService(IChatClients clients)
{
    public async Task<object> Any(ProviderChat request)
    {
        var groq = clients.GetClient("groq");
        return await groq.ChatAsync(new ChatCompletion {
            Model = "kimi-k2",
            Messages = [
                Message.Text(request.UserPrompt)
            ],
        });
    }
}
```

## Persist AI Chat History

By default AI Chat is designed to be minimally invasive and doesn't require anything other than the API Keys
needed to access the AI Models it should use. 

If preferred you can choose to persist AI Chat History made through the external ChatCompletion API with the
`OnChatCompletionSuccessAsync` and `OnChatCompletionFailedAsync` callbacks which can be used to store successful
and failed requests in your preferred data store using the included 
[ChatCompletionLog](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/src/ServiceStack.AI.Chat/ChatCompletionLog.cs)
or your own data model:

```csharp
public class ConfigureAiChat : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureServices(services => {
            services.AddPlugin(new ChatFeature
            {
                OnChatCompletionSuccessAsync = async (request, response, req) => {
                    using var db = await req.Resolve<IDbConnectionFactory>().OpenAsync();
                    await db.InsertAsync(req.ToChatCompletionLog(request, response));
                },
                OnChatCompletionFailedAsync = async (request, exception, req) => {
                    using var db = await req.Resolve<IDbConnectionFactory>().OpenAsync();
                    await db.InsertAsync(req.ToChatCompletionLog(request, exception));
                },
            });
       }).ConfigureAppHost(appHost => {
            using var db = appHost.Resolve<IDbConnectionFactory>().Open();
            db.CreateTableIfNotExists<ChatCompletionLog>();
       });
}
```

### Compatible with llms.py 

The other benefit of simple configuration and simple solutions, is that they're easy to implement. A perfect example
of this being that this is the 2nd implementation done using this configuration. The same configuration, UI, APIs
and functionality is also available in our [llms.py](https://github.com/ServiceStack/llms) Python CLI and server gateway we've developed 
in order to have a dependency-free LLM Gateway solution needed in our ComfyUI Agents.  

:::sh
pip install llms-py
:::

This also means you can use and test your own custom `llms.json` configuration on the command-line or in shell 
automation scripts:

```sh
# Simple question
llms "Explain quantum computing"

# With specific model
llms -m gemini-2.5-pro "Write a Python function to sort a list"

# With system prompt
llms -s "You are a helpful coding assistant" "Reverse a string in Python?"

# With image (vision models)
llms --image image.jpg "What's in this image?"
llms --image https://example.com/photo.png "Describe this photo"

# Display full JSON Response
llms "Explain quantum computing" --raw

# Start the UI and an OpenAI compatible API on port 8000:
llms --serve 8000
```

Incidentally as [llms.py UI](https://servicestack.net/posts/llms-py-ui) and AI Chat utilize the same UI you can 
use its **import/export** features to transfer your AI Chat History between them.

Checkout the [llms.py GitHub repo](https://github.com/ServiceStack/llms) for even more features.