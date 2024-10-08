---
title: AI Server API Usage
---

AI Server provides a unified API to process requests for AI services to access LLMs, Image Generation, Transcription, and more. The API is designed to be simple to use and easy to integrate into your applications providing many supported languages and frameworks.

## Making a Chat Request

To make a chat request to AI Server, you can use the `/api/OpenAiChatCompletion` endpoint. This endpoint requires a `OpenAiChatCompletion` request DTO that contains a property matching the `OpenAI` API.

### Sync Open AI Chat Completion

::include ai-server/cs/ai-server-compatible-1.cs.md::

This request will generate a response from the `llama3:8b` model using the `system` and `user` messages provided. This will perform the operation synchronously, waiting for the response to be generated before returning it to the client.

Alternatively, you can call the same endpoint asynchronously by using the `/api/QueueOpenAiChatCompletion` endpoint. This will queue the request for processing and return a URL to check the status of the request and download the response when it's ready.

### Async Queue Open AI Chat Completion

::include ai-server/cs/ai-server-queue-openai-chat-completion-1.cs.md::

Additional optional features on the request to enhance the usage of AI Server include:

- **RefId**: A unique identifier for the request specified by the client to more easily track the progress of the request.
- **Tag**: A tag to help categorize the request for easier tracking.

`RefId` and `Tag` are available on both synchronous and asynchronous requests, where as Queue requests also support:

- **ReplyTo**: A URL to send a POST request to when the request is complete.

## Using the AI Server Request DTOs with other OpenAI compatible APIs

One advantage of using AI Server is that it provides a common set of request DTOs in 11 different languages that are compatible with OpenAI's API. This allows you to switch between OpenAI and AI Server without changing your client code.
This means you can switch to using typed APIs in your preferred language with your existing service providers OpenAI compatible APIs, and optionally switch to AI Server when you're ready to self-host your AI services for better value.

::include ai-server/cs/ai-server-compatible-2.cs.md::

This shows usage of the `OpenAiChat` request DTO directly with OpenAI's API using the ServiceStack `JsonApiClient`, so you get the benefits of using typed APIs in your preferred language with your existing service providers OpenAI compatible APIs.





