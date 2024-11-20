---
title: Quick Start
description: Get AI Server up and running quickly
---

To get started with AI Server, we need can use the following steps:

- **Clone the Repository**: Clone the AI Server repository from GitHub.
- **Run the Installer**: Run the `install.sh` to set up the AI Server and ComfyUI Agent.

### Supported OS

The AI Server installer is supported on Linux, macOS, and Windows with WSL2, and all require Docker and Docker Compose to be installed at a minimum.

### Quick Start Commands

```sh
git clone https://github.com/ServiceStack/ai-server
cd ai-server
cat install.sh | bash
```
### Running the Installer

The installer will detect common environment variables for the supported AI Providers like OpenAI, Google, Anthropic, and others, and prompt ask you if you want to add them to your AI Server configuration.

<div data-asciicinema="/pages/ai-server/ai-server-install.cast" 
     data-options="{loop:true,poster:'npt:00:08',theme:'dracula',rows:13}"></div>

Alternatively, you can specify which providers you want and provide the APIs before continuing with the installation.

## Accessing AI Server

Once the AI Server is running, you can access the Admin Portal at [http://localhost:5006/admin](http://localhost:5005/admin) to configure your AI providers and generate API keys.
If you first ran the AI Server with configured API Keys in your `.env` file, you providers will be automatically configured for the related services.

::: info
The default password to access the Admin Portal is `p@55wOrd`. You can change this in your `.env` file by setting the `AUTH_SECRET` or providing it during the installation process.
You can reset the process by deleting your local `App_Data` directory and rerunning `docker compose up` or re-running the `install.sh`.
:::

You will then be able to make requests to the AI Server API endpoints, and access the Admin Portal user interface like the [Chat interface](http://localhost:5005/admin/Chat) to use your AI Provider models.

### Optional ComfyUI Agent

The installer will also ask if you want to install the ComfyUI Agent locally if you run AI server from the installer.

If you choose to run AI Server, it will prompt you to install the ComfyUI Agent as well, and assume you want to run it locally.

If you want to run the ComfyUI Agent separately, you can follow these steps:

```sh
git clone https://github.com/ServiceStack/agent-comfy.git
cd agent-comfy
cat install.sh | bash
```

Providing your AI Server URL and Auth Secret when prompted will automatically register the ComfyUI Agent with your AI Server to handle related requests.

:::info
You will be prompted to provide the AI Server URL and ComfyUI Agent URL during the installation.
These should be the accessible URLs for your AI Server and ComfyUI Agent. When running locally, the ComfyUI Agent will be populated with a docker accessible path as `localhost` won't be accessible from the AI Server container.
If you want to reset the ComfyUI Agent settings, remember to remove the provider from the AI Server Admin Portal.
:::

### Prerequisites AI Server - Windows with WSL2

Windows with WSL2 requires the following prerequisites:

- Docker Engine accessible from WSL2 like [Docker Desktop](https://www.docker.com/products/docker-desktop)
- WSL2 with Ubuntu 20.04 LTS or later

### Prerequisites ComfyUI Agent - Windows with WSL2

To run the ComfyUI Agent locally, you will also need:

- Nvidia GPU with [WSL2 CUDA support](https://docs.nvidia.com/cuda/wsl-user-guide/index.html)

### Prerequisites AI Server - macOS

macOS requires the following prerequisites:

- Docker Engine
- Docker Compose

:::info
ComfyUI Agent will likely not run on macOS as it requires Nvidia GPU with CUDA support.
:::

### Prerequisites AI Server - Linux

Linux requires the following prerequisites:

- Docker Engine
- Docker Compose
- Git

### Prerequisites ComfyUI Agent - Linux

To run the ComfyUI Agent locally, you will also need:

- Nvidia GPU with CUDA support
- Nvidia Container Toolkit for [Docker](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html)


