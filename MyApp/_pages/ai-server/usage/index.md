---
title: AI Server API Usage
---

# AI Server API Usage

AI Server provides a unified API to process requests for AI services to access LLMs, Image Generation, Transcription, and more. The API is designed to be simple to use and easy to integrate into your applications providing many supported languages and frameworks.

## Making a Chat Request

To make a chat request to AI Server, you can use the `/api/CreateOpenAiChat` endpoint. This endpoint requires a `CreateOpenAiChat` request DTO that contains a property matching the `OpenAI` API.

```csharp
var response = client.Post(new CreateOpenAiChat {
    Request = new OpenAiChat {
        Model = "gpt-3.5-turbo",
        Messages = new List<OpenAiMessage> {
            new OpenAiMessage { Role = "system", Content = "You are a helpful AI assistant." },
            new OpenAiMessage { Role = "user", Content = "How do I ..." }
        }
    }
});
```

Additional optional features on the request to enhance the usage of AI Server include:

- **RefId**: A unique identifier for the request specified by the client to more easily track the progress of the request.
- **Provider**: Force the request to use a specific provider, overriding the selection logic.
- **ReplyTo**: A HTTP URL to send the response to on completion of the request.
- **Tag**: A tag to help categorize the request for easier tracking.

## Using the AI Server Request DTOs with other OpenAI compatible APIs

One advantage of using AI Server is that it provides a common set of request DTOs in 11 different languages that are compatible with OpenAI's API. This allows you to switch between OpenAI and AI Server without changing your client code.
This means you can switch to using typed APIs in your preferred language with your existing service providers OpenAI compatible APIs, and optionally switch to AI Server when you're ready to self-host your AI services for better value.

```csharp
// Using OpenAI API
var request = new OpenAiChat {
    Model = "gpt-3.5-turbo",
    Messages = new List<OpenAiMessage> {
        new OpenAiMessage { Role = "system", Content = "You are a helpful AI assistant." },
        new OpenAiMessage { Role = "user", Content = "How do I ..." }
    }
};

var response = await client.PostAsync("https://api.openai.com/v1/", request);
```