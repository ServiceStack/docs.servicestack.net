---
title: Quick Start
description: Get AI Server up and running quickly
---

To get started with AI Server, we need can use the following steps:

- **Clone the Repository**: Clone the AI Server repository from GitHub.
- **Edit the example.env File**: Update the example.env file with your desired settings.
- **Run the Docker Compose**: Start the AI Server with Docker Compose.

### Clone the Repository

Clone the AI Server repository from GitHub:

```sh
git clone https://github.com/ServiceStack/ai-server
```

### Edit the example.env File

Create your own `.env` file by copying the `example.env` file:

```sh
cp example.env .env
```

And then edit the `.env` file with your desired settings:

```sh
# OpenAI API Key - Head to https://platform.openai.com/account/api-keys to get your API key
# OPENAI_API_KEY=your-openai-api-key
# Google Cloud API Key - Head to https://console.cloud.google.com/apis/credentials to get your API key
# GOOGLE_API_KEY=your-google-api-key
# OpenRouter API Key - Head to https://openrouter.io/ to get your API key
# OPENROUTER_API_KEY=your-openrouter-api-key
# Mistral API Key - Head to https://mistral.ai/ to get your API key
# MISTRAL_API_KEY=your-mistral-api-key
# GROQ API Key - Head to https://groq.com/ to get your API key
# GROQ_API_KEY=your-groq-api-key
# Custom Port for the AI Server
PORT=5005
```

These keys are used during the AI Server initial database setup to configure the AI providers based on the keys you *uncomment and provide*.

### Run the Docker Compose

Start the AI Server with Docker Compose:

```sh
docker compose up
```

## Accessing AI Server

Once the AI Server is running, you can access the Admin Portal at [http://localhost:5005/admin](http://localhost:5005/admin) to configure your AI providers and generate API keys.
If you first ran the AI Server with configured API Keys in your `.env` file, you providers will be automatically configured for the related services.

> You can reset the process by deleting your local `App_Data` directory and rerunning `docker compose up`.

You will then be able to make requests to the AI Server API endpoints, and access the Admin Portal user interface like the [Chat interface](http://localhost:5005/admin/Chat) to use your AI Provider models. 