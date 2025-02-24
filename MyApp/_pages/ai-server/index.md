---
title: Overview
description: Introduction to AI Server and its key features
---

AI Server allows you to orchestrate your systems AI requests through a single self-hosted application to control what AI Providers App's should use without impacting their client integrations. It serves as a private gateway to process LLM, AI, and image transformation requests, dynamically delegating tasks across multiple providers including Ollama, OpenAI, Anthropic, Mistral AI, Google Cloud, OpenRouter, GroqCloud, Replicate, Comfy UI, utilizing models like Whisper, SDXL, Flux, and tools like FFmpeg.

[![](/img/pages/ai-server/overview.svg)](https://openai.servicestack.net)

:::youtube Ojo80oFQte8
Self Hosted AI Server gateway for LLM APIs, Ollama, ComfyUI & FFmpeg servers
:::

## Why Use AI Server?

AI Server simplifies the integration and management of AI capabilities in your applications:

- **Centralized Management**: Manage your LLM, AI and Media Providers, API Keys and usage from a single App
- **Flexibility**: Easily switch 3rd party providers without impacting your client integrations
- **Scalability**: Distribute workloads across multiple providers to handle high volumes of requests efficiently
- **Security**: Self-hosted private gateway to keep AI operations behind firewalls, limit access with API Keys
- **Developer-Friendly**: Simple development experience utilizing a single client and endpoint and Type-safe APIs
- **Manage Costs**: Monitor and control usage across your organization with detailed request history

## Key Features

- **Unified AI Gateway**: Centralize all your AI requests & API Key management through a single self-hosted service
- **Multi-Provider Support**: Seamlessly integrate with Leading LLMs, Ollama, Comfy UI, FFmpeg, and more
- **Type-Safe Integrations**: Native end-to-end typed integrations for 11 popular programming languages
- **Secure Access**: Use simple API key authentication to control which AI resources Apps can use
- **Managed File Storage**: Built-in cached asset storage for AI-generated assets, isolated per API Key
- **Background Job Processing**: Efficient handling of long-running AI tasks, capable of distributing workloads
- **Monitoring and Analytics**: Real-time monitoring performance and statistics of executing AI Requests
- **Recorded**: Auto archival of completed AI Requests into monthly rolling databases
- **Custom Deployment**: Run as a single Docker container, with optional GPU-equipped agents for advanced tasks

## Supported AI Capabilities

- **Large Language Models**: Integrates with Ollama, OpenAI, Anthropic, Mistral, Google, OpenRouter and Groq
- **Image Generation**: Leverage self-hosted ComfyUI Agents and SaaS providers like Replicate, DALL-E 3
- **Image Transformations**: Dynamically transform and cache Image Variations for stored assets
- **Audio Processing**: Text-to-speech, and speech-to-text with Whisper integration
- **Video Processing**: Format conversions, scaling, cropping, and more with via FFmpeg

## Getting Started for Developers

1. **Setup**: Follow the [Quick Start guide](/ai-server/quickstart) to deploy AI Server
2. **Configuration**: Use the Admin Portal to add your AI providers and generate API keys
3. **Integration**: Choose your preferred language and use AI Server's type-safe APIs
4. **Development**: Start making API calls to AI Server from your application, leveraging the full suite of AI capabilities

## Learn More

- Hosted Example: [openai.servicestack.net](https://openai.servicestack.net)
- Source Code: [github.com/ServiceStack/ai-server](https://github.com/ServiceStack/ai-server)

AI Server is actively developed and continuously expanding its capabilities.