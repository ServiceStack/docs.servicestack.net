---
title: AI Server API Usage
---

AI Server provides a unified API to process requests for AI services to access LLMs, Image Generation, Transcription, and more. The API is designed to be simple to use and easy to integrate into your applications providing many supported languages and frameworks.

## Making a Chat Request

To make a chat request to AI Server, you can use the `/api/CreateOpenAiChat` endpoint. This endpoint requires a `CreateOpenAiChat` request DTO that contains a property matching the `OpenAI` API.

```csharp
var response = client.Post(new CreateOpenAiChat {
    Request = new OpenAiChat {
        Model = "gpt-4-turbo",
        Messages = new List<OpenAiMessage> {
            new OpenAiMessage { Role = "system", Content = "You are a helpful AI assistant." },
            new OpenAiMessage { Role = "user", Content = "How do LLMs work?" }
        },
        MaxTokens = 50
    },
    RefId = "<unique-id>", // Optional
    Provider = "openai", // Optional
    ReplyTo = "https://myapp.com/reply", // Optional
    Sync = true // Optional
});
```

Additional optional features on the request to enhance the usage of AI Server include:

- **RefId**: A unique identifier for the request specified by the client to more easily track the progress of the request.
- **Provider**: Force the request to use a specific provider, overriding the selection logic.
- **ReplyTo**: A HTTP URL to send the response to on completion of the request.
- **Tag**: A tag to help categorize the request for easier tracking.
- **Sync**: A boolean value to determine if the request should be processed synchronously (default is `false`).

These additional request properties are consistent across all AI Server endpoints, providing a common interface for all AI services.

## Using the AI Server Request DTOs with other OpenAI compatible APIs

One advantage of using AI Server is that it provides a common set of request DTOs in 11 different languages that are compatible with OpenAI's API. This allows you to switch between OpenAI and AI Server without changing your client code.
This means you can switch to using typed APIs in your preferred language with your existing service providers OpenAI compatible APIs, and optionally switch to AI Server when you're ready to self-host your AI services for better value.

```csharp
// Using OpenAI API directly via JsonApiClient
var client = new JsonApiClient("https://api.openai.com/v1");
client.AddHeader("Authorization", "Bearer " + Environment.GetEnvironmentVariable("OPENAI_API_KEY"));

// Using AI Server DTOs with OpenAI API
var request = new OpenAiChat {
    Model = "gpt-4-turbo",
    Messages = new List<OpenAiMessage> {
        new OpenAiMessage { Role = "system", Content = "You are a helpful AI assistant." },
        new OpenAiMessage { Role = "user", Content = "How do LLMs work?" }
    },
    MaxTokens = 50
};

// Typed response DTO
var response = await client.PostAsync<OpenAiChatResponse>("/chat/completions", request);
```

This shows usage of the `OpenAiChat` request DTO directly with OpenAI's API using the ServiceStack `JsonApiClient`, so you get the benefits of using typed APIs in your preferred language with your existing service providers OpenAI compatible APIs.





