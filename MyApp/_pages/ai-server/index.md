---
title: Overview
description: Introduction to AI Server and its key features
---

# Overview

AI Server is a way to orchestrate your AI requests through a single self-hosted application to control what AI Providers you use without impacting your client integrations. It serves as a private gateway to process LLM, AI, and image transformation requests, dynamically delegating tasks across multiple providers including Ollama, OpenRouter, Replicate, Comfy UI, Whisper, and ffmpeg.


## Key Features

- **Unified AI Gateway**: Centralize all your AI requests through a single self-hosted service.
- **Multi-Provider Support**: Seamlessly integrate with Ollama, Open AI, Comfy UI, and more.
- **Type-Safe Integrations**: Native end-to-end typed integrations for 11 popular languages including C#, TypeScript, Python, and more.
- **Secure Access**: API key authentication to protect your AI resources.
- **Managed File Storage**: Built-in cached storage for AI-generated assets.
- **Background Job Processing**: Efficient handling of long-running AI tasks, capable of distributing workloads to many different providers, both managed and self-hosted.
- **Custom Deployment**: Run as a single Docker container, with optional GPU-equipped agents for advanced tasks.

## Why Use AI Server?

AI Server simplifies the integration and management of AI capabilities in your applications:

1. **Centralized Management**: Manage all your AI providers and requests from a single interface.
2. **Cost Control**: Monitor and control usage across your organization with detailed request history.
3. **Flexibility**: Easy to scale and adapt as your AI needs evolve.
4. **Security**: Keep your AI operations behind your firewall with a private, managed gateway.
5. **Developer-Friendly**: Type-safe APIs and integrations for a smooth development experience.

## Supported AI Capabilities

- **Large Language Models**: Integrate with Open AI Chat, Ollama, and various API gateways.
- **Image Generation and Manipulation**: Leverage Comfy UI for text-to-image, image-to-image, and more.
- **Audio Processing**: Text-to-speech, speech-to-text, and audio manipulations.
- **Video Processing**: Format conversions, scaling, cropping, and more with ffmpeg integration.

## Getting Started for Developers

1. **Setup**: Follow the [Quick Start guide](/ai-server/install) to deploy AI Server.
2. **Configuration**: Use the Admin Portal to add your AI providers and generate API keys.
3. **Integration**: Choose your preferred language and use AI Server's type-safe APIs to make requests with AI providers, including directly with OpenAI compatible APIs.
4. **Development**: Start making API calls to AI Server from your application, leveraging the full suite of AI capabilities.

## Learn More

- Website: [openai.servicestack.net](https://openai.servicestack.net)
- GitHub: [github.com/ServiceStack/ai-server](https://github.com/ServiceStack/ai-server)

AI Server is actively developed and continuously expanding its capabilities.