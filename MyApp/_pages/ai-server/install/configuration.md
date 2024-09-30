---
title: Configuring AI Server
---

# Configuring AI Server

AI Server makes orchestration of various AI providers easy by providing a unified gateway to process LLM, AI, and image transformation requests.
It comes with an Admin Dashboard that allows you to configure your AI providers and generate API keys to control access.

## Accessing the Admin Dashboard

Running AI Server will land you on a page showing access to:

- **[Admin Dashboard](http://localhost:5005/admin)**: Centralized management of AI providers and API keys.
- **[Admin UI](http://localhost:5005/admin-ui**: ServiceStack built in Admin UI to manage your AI Server.
- **[API Explorer](http://localhost:5005/ui**: Explore and test the AI Server API endpoints in a friendly UI.
- **[AI Server Documentation](https://docs.servicestack.net/ai-server/)**: Detailed documentation on how to use AI Server.

## Configuring AI Providers

AI Providers are the external LLM based services like OpenAI, Google, Mistral etc that AI Server interacts with to process Chat requests.

There are two ways to configure AI Providers:

1. **.env File**: Update the `.env` file with your API keys and run the AI Server for the first time.
2. **Admin Dashboard**: Use the Admin Dashboard to add, edit, or remove AI Providers and generate AI Server API keys.

### Using the .env File

The `.env` file is used to configure AI Providers during the initial setup of AI Server, and is the easiest way to get started.

The .env file is located in the root of the AI Server repository and contains the following keys:

- **OPENAI_API_KEY**: OpenAI API Key
- **GOOGLE_API_KEY**: Google Cloud API Key
- **OPENROUTER_API_KEY**: OpenRouter API Key
- **MISTRAL_API_KEY**: Mistral API Key
- **GROQ_API_KEY**: GROQ API Key

Providing the API keys in the .env file will automatically configure the AI Providers when you run the AI Server for the first time.

### Using the Admin Dashboard

The Admin Dashboard provides a more interactive way to manage your AI Providers after the AI Server is running.

To access the Admin Dashboard:

1. Navigate to [http://localhost:5005/admin](http://localhost:5005/admin).
2. Log in with the default credentials `p@55wOrd`.
3. Click on the **AI Providers** tab to view and manage your AI Providers.

Here you can add, edit, or remove AI Providers, as well as generate API keys for each provider.

AI Server supports the following AI Providers:

- **OpenAI**: OpenAI Chat API
- **Google**: Google Cloud AI
- **OpenRouter**: OpenRouter API
- **Mistral**: Mistral API
- **GROQ**: GROQ API
- **Ollama**: Ollama API

## Generating AI Server API Keys

API keys are used to authenticate requests to AI Server and are generated via the Admin Dashboard.

Here you can create new API keys, view existing keys, and revoke keys as needed.

Keys can be created with expiration dates, and restrictions to specific API endpoints, along with notes to help identify the key's purpose.


