---
title: Text to Image
description: Generating images from text with AI Server
---

As well as interacting with LLMs to generate text, AI Server can also generate images from text from a few different providers. 

- **DALL-E**
- **Replicate API**
- **Comfy UI**

## DALL-E

When you configure AI Server with an OpenAI API key, you can use the DALL-E model to generate images from text.

You can control these providers via the Admin Dashboard in AI Server if you want to enable or disable them on a per model basis.

## Replicate API

Replicate is another provider that can generate images from text. You can configure Replicate in the Admin Dashboard in AI Server or include the `REPLICATE_API_KEY` in your `.env` file during the first run of AI Server.

Replicate provides access to the Flux family of models, which can generate images from text using:

- **Flux Schnell**
- **Flux Dev**
- **Flux Pro**

## Comfy UI

Comfy UI is a self-hosted agent that can process image requests and other modalities. You can configure Comfy UI in the Admin Dashboard in AI Server after you have set a ComfyUI instance using [the related ComfyUI Extension](https://github.com/ServiceStack/agent-comfy).

When configuring the Comfy AI Provider, you can provide the URL of your ComfyUI instance, and any API key required to authenticate with it, and you will get a list of the models available in your ComfyUI instance to enable for the provider.

## Using Text to Image

Once you have configured your AI Server with the providers you want to use, you can make requests to the AI Server API to generate images from text.

::include ai-server/cs/text-to-image-1.cs.md::

This request will generate an image of a happy llama using the Flux Schnell model. The `PositivePrompt` and `NegativePrompt` properties are used to guide the model on what to generate, and what to avoid. The `Sync` property is used to determine if the request should be processed synchronously or asynchronously. By default, requests are processed asynchronously.

Flux Schnell is also available in the Comfy UI agent, so you can use the same model with multiple providers, or switch between providers without changing your client code.

