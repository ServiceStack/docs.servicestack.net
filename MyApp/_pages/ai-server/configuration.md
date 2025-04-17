---
title: Configuring AI Server
---

AI Server can be configured in several ways:

- **install.sh Script**: Run the `install.sh` script to set up the AI Server and ComfyUI Agent.
- **.env File**: Update the `.env` file with your API keys and run the AI Server for the first time.
- **Admin Portal**: Use the Admin Portal to add, edit, or remove AI Providers and generate AI Server API keys.

## Running the Installer

The `install.sh` script is the quickest way to get AI Server up and running with the default configuration. This is ideal for local development and testing.

To run the installer:

```sh
git clone https://github.com/ServiceStack/ai-server.git
cd ai-server
cat install.sh | bash
```

The installer will prompt you to configure your AI Providers and optionally add the ComfyUI Agent.

## `.env` Configuration

The installer populates the `.env` file with the choices you made during the installation script. You can also manually configure the `.env` file with your API keys and settings.

```ini
OPENAI_API_KEY=<Your OpenAI API Key>
ANTHROPIC_API_KEY=<Your Anthropic API Key>
OPENROUTER_API_KEY=<Your OpenRouter API Key>
MISTRAL_API_KEY=<Your Mistral API Key>
GOOGLE_API_KEY=<Your GoogleCloud API Key>
GROQ_API_KEY=<Your Groq Cloud API Key>
AUTH_SECRET="p@55wOrd"
ASSETS_BASE_URL="http://localhost:5006"
```

After these values are set in your `.env` file, you can run the AI Server for the first time via docker compose:

```sh
docker compose up
```

This will perform an initial setup, saving providers configuration in the SQLite database. From here, you can manage your AI Providers via the [Admin Portal](http://localhost:5006/admin).

:::info 
The default credentials to access the Admin Portal are `p@55wOrd`, this can be changed in your `.env` file by setting the `AUTH_SECRET` key.
:::

### Using the Admin Portal

The Admin Portal provides a more interactive way to manage your AI Providers after the AI Server is running.

To access the Admin Portal:

1. Navigate to [http://localhost:5006/admin](http://localhost:5005/admin).
2. Log in with the default credentials `p@55wOrd`.
3. Click on the **AI Providers** tab to view and manage your AI Providers.

Here you can add, edit, or remove AI Providers, as well as generate API keys for each provider.

AI Server supports the following AI Providers:

- **OpenAI**: OpenAI Chat API
- **Anthropic**: Anthropic Claude API
- **Google**: Google Cloud AI
- **OpenRouter**: OpenRouter API
- **Mistral**: Mistral API
- **GROQ**: GROQ API
- **Ollama**: Ollama API

Media Providers can also be configured in the Admin Portal. These include:

- **ComfyUI**: ComfyUI Agent
  - **Image Generation**
  - **Text-to-Speech**
  - **Speech-to-Text**
  - **Video & Image Processing**
- **Replicate**: Replicate API
  - **Image Generation**
- **OpenAI**: OpenAI API
  - **Image Generation**
  - **Text-to-Speech**

## Generating AI Server API Keys

API keys are used to authenticate requests to AI Server and are generated via the Admin Portal.

Here you can create new API keys, view existing keys, and revoke keys as needed.

Keys can be created with expiration dates, and restrictions to specific API endpoints, along with notes to help identify the key's purpose.

## Stored File Management

AI Server stores results of the AI operations in a pre-configured paths.

- **Artifacts**: AI generated images, audio, and video files, default path is `App_Data/artifacts`.
- **Files**: Cached variants and processed files, default path is `App_Data/files`.

These paths can be configured in the `.env` file by setting the `ARTIFACTS_PATH` and `AI_FILES_PATH` keys.

## Custom Definitions

AI Server's knowledge is limited to the AI Provider and Model types and definitions defined in its 
[/data](https://github.com/ServiceStack/ai-server/tree/main/AiServer/wwwroot/lib/data) definitions.

These definitions are merged and can be extended with custom definitions you can create in your `/App_Data/overrides/` folder, e.g:

```files
/App_Data
  /overrides
    ai-models.json 
    ai-types.json 
    generation-types.json 
    media-models.json 
    media-types.json 
    prompts.json
    tts-voices.json
```
