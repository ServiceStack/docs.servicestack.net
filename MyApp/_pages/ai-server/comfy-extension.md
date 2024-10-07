---
title: ComfyUI Extension
description: Installing and configuring the ComfyUI extension
---

# ComfyUI Extension

ComfyUI is a powerful image generation and manipulation tool that can be used to create images from text, images from images, and more. It is a key component of AI Server that provides a wide range of image processing capabilities.
As a way to leverage the ComfyUI API in a more accessible manner, we have support for ComfyUI as a provider type in AI Server. This allows you to easily integrate ComfyUI into your AI Server instance using it as a remote self-hosted agent capable of processing image requests, and other modalities.

## Installing the ComfyUI Extension

To install this more easily, [we have put together a Docker image and a Docker Compose file](https://github.com/serviceStack/agent-comfy) that you can use to get started with ComfyUI in AI Server that is already bundled with the ComfyUI extension, and all the necessary dependencies.

### Running the ComfyUI Extension

To run the ComfyUI extension, you can use the following steps:

1. **Clone the Repository**: Clone the ComfyUI extension repository from GitHub.

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

3. **Run the Docker Compose**: Start the ComfyUI extension with Docker Compose.

    ```sh
    docker compose up
    ```
   
### .env Configuration

The `.env` file is used to configure the ComfyUI extension during the initial setup, and is the easiest way to get started.

The keys available in the `.env` file are:

- **DEFAULT_MODELS**: Comma-separated list of models to load on startup. This will be used to automatically download the models and their related dependencies. The full list of options can be found on your AI Server at `/lib/data/ai-models.json`.
- **API_KEY**: This is the API key that will be used by your AI Server to authenticate with the ComfyUI. If not provided, there will be no authentication required to access your ComfyUI instance.
- **HF_TOKEN**: This is the Hugging Face token that will be used to authenticate with the Hugging Face API when trying to download models. If not provided, models requiring Hugging Face authentication like those with user agreements will not be downloaded.
- **CIVITAI_TOKEN**: This is the Civitai API key that will be used to authenticate with the Civitai API when trying to download models. If not provided, models requiring Civitai authentication like those with user agreements will not be downloaded.

> Models requiring authentication to download are also flagged in the `/lib/data/ai-models.json` file.

### Accessing the ComfyUI Extension

Once the ComfyUI extension is running, you can access the ComfyUI instance at [http://localhost:7860](http://localhost:7860) and can be used as a standard ComfyUI instance.
The AI Server has pre-defined workflows to interact with your ComfyUI instance to generate images, audio, text, and more.

These workflows are found in the AI Server AppHost project under `workflows`. These are templated JSON versions of workflows you save in the ComfyUI web interface.

### Advanced Configuration

ComfyUI workflows can be changed or overridden on a per model basis by editing the `workflows` folder in the AI Server AppHost project. Flux Schnell is an example of overriding text-to-image for just a single workflow for which the code can be found in `AiServer/Configure.AppHost.cs`.