---
title: ComfyUI Agent
description: Installing and configuring the ComfyUI Agent for AI Server
---

ComfyUI is a powerful workflow tool for various AI related tasks including the ability to create images from text, images from images, and more. It is a key component of AI Server that provides a wide range of processing capabilities.

One issue it has though is that it can be difficult to integrate with other systems. The ComfyUI API consists of converting a JSON workflow definition to an API format with very specific requirements.

As a way to leverage the ComfyUI API in a more accessible manner, we have created a [ComfyUI Agent](https://github.com/serviceStack/agent-comfy) repository so you can more easily use ComfyUI workflows and add it to be a provider in AI Server. This allows you to integrate a ComfyUI Agent into your AI Server instance using it as a remote self-hosted agent capable of processing image requests, and other modalities.

Since a lot of AI workloads require GPUs or other specialized hardware, the ComfyUI Agent can be run on a separate machine with the necessary hardware, and AI Server can be configured to use it as a provider for these kinds of tasks.

## Installing the ComfyUI Agent

To install this more easily, [we have put together a Docker image and a Docker Compose file](https://github.com/serviceStack/agent-comfy) that you can use to get started with ComfyUI Agent in AI Server that is already bundled with the pretty simple extension, and all the necessary dependencies.

### Running the ComfyUI Agent

To run the ComfyUI Agent, you can use the following steps:

1. **Clone the Repository**: Clone the ComfyUI Agent repository from GitHub.

    ```sh
    git clone https://github.com/ServiceStack/agent-comfy.git
    ```
   
2. **Edit the example.env File**: Update the example.env file with your desired settings.

    ```sh
    cp example.env .env
    ```
   
    And then edit the `.env` file with your desired settings:

    ```sh
    DEFAULT_MODELS=sdxl-lightning,flux-schnell
    API_KEY=your_agent_api_key
    HF_TOKEN=your_hf_token
    CIVITAI_TOKEN=your_civitai_api_key
   ```

3. **Run the Docker Compose**: Start the ComfyUI Agent with Docker Compose.

    ```sh
    docker compose up
    ```
   
### .env Configuration

The `.env` file is used to configure the ComfyUI Agent during the initial setup, and is the easiest way to get started.

The keys available in the `.env` file are:

- **DEFAULT_MODELS**: Comma-separated list of models to load on startup. This will be used to automatically download the models and their related dependencies. The full list of options can be found on your AI Server at `/lib/data/media-models.json`.
- **API_KEY**: This is the API key that will be used by your AI Server to authenticate with the ComfyUI. If not provided, there will be no authentication required to access your ComfyUI Agent instance.
- **HF_TOKEN**: This is the Hugging Face token that will be used to authenticate with the Hugging Face API when trying to download models. If not provided, models requiring Hugging Face authentication like those with user agreements will not be downloaded.
- **CIVITAI_TOKEN**: This is the Civitai API key that will be used to authenticate with the Civitai API when trying to download models. If not provided, models requiring Civitai authentication like those with user agreements will not be downloaded.

::: info 
Models requiring authentication to download are also flagged in the `/lib/data/media-models.json` file.
:::

### Accessing the ComfyUI Agent

Once the ComfyUI Agent is running, you can access the ComfyUI Agent instance at [http://localhost:7860](http://localhost:7860) and can be used as a standard ComfyUI.
The AI Server has pre-defined workflows to interact with your ComfyUI Agent instance to generate images, audio, text, and more.

These workflows are found in the AI Server AppHost project under `workflows`. These are templated JSON versions of workflows you save in the ComfyUI web interface.

### Advanced Configuration

ComfyUI workflows can be changed or overridden on a per model basis by editing the `workflows` folder in the AI Server AppHost project. Flux Schnell is an example of overriding text-to-image for just a single workflow for which the code can be found in `AiServer/Configure.AppHost.cs`.