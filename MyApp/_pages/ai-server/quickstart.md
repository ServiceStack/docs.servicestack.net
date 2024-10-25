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
cd ai-server
cat install.sh | bash
```

### Optional ComfyUI Agent

The installer will also ask if you want to install the ComfyUI Agent locally if you run AI server from the installer. 

If you want to run the ComfyUI Agent separately, you can follow these steps:

```sh
git clone https://github.com/ServiceStack/agent-comfy.git
cd agent-comfy
cat install.sh | bash
```

Providing your AI Server URL and API Key when prompted will automatically register the ComfyUI Agent with your AI Server to handle related requests.

## Accessing AI Server

Once the AI Server is running, you can access the Admin Portal at [http://localhost:5005/admin](http://localhost:5005/admin) to configure your AI providers and generate API keys.
If you first ran the AI Server with configured API Keys in your `.env` file, you providers will be automatically configured for the related services.

::: info
You can reset the process by deleting your local `App_Data` directory and rerunning `docker compose up`.
:::

You will then be able to make requests to the AI Server API endpoints, and access the Admin Portal user interface like the [Chat interface](http://localhost:5005/admin/Chat) to use your AI Provider models. 