---
title: ComfyUI Agent
description: Installing and configuring the ComfyUI Agent for AI Server
---

ComfyUI is a powerful workflow tool for various AI related tasks including the ability to create images from text, images from images, and more. It is a key component of AI Server that provides a wide range of processing capabilities.

One issue it has though is that it can be difficult to integrate with other systems. The ComfyUI API consists of converting a JSON workflow definition to an API format with very specific requirements.

As a way to leverage the ComfyUI API in a more accessible manner, we have created a [ComfyUI Agent](https://github.com/serviceStack/agent-comfy) repository so you can more easily use ComfyUI workflows and add it to be a provider in AI Server. This allows you to integrate a ComfyUI Agent into your AI Server instance using it as a remote self-hosted agent capable of processing image requests, and other modalities.

Since a lot of AI workloads require GPUs or other specialized hardware, the ComfyUI Agent can be run on a separate machine with the necessary hardware, and AI Server can be configured to use it as a provider for these kinds of tasks.

## Installing the ComfyUI Agent

To install this more easily, you can use the `install.sh` script in the ComfyUI Agent repository. This works the same way as the AI Server installer, and will prompt you for the necessary configuration options.

This installer supports both local and remote installations, and will ask you for the necessary configuration options including the Auth Secret for your AI Server instance. The install process will then register the ComfyUI Agent with your AI Server instance, enabling it for the model selections you make during the installation.

```sh
git clone https://github.com/ServiceStack/agent-comfy.git
cd agent-comfy
cat install.sh | bash
```

This process will also persist the configuration in the `.env` file in the ComfyUI Agent directory, so you can easily restart the ComfyUI Agent with the same configuration.

![](/img/pages/ai-server/agent-install.gif)

:::info
On the first run, the ComfyUI Agent will download the models you selected during the installation process. This can take some time depending on the size of the models and your internet connection speed.
:::

### .env Configuration

The `.env` file is used to configure the ComfyUI Agent during the initial setup, and is the easiest way to get started.

```sh
DEFAULT_MODELS=sdxl-lightning,text-to-speech,speech-to-text,image-upscale-2x,image-to-text
HF_TOKEN=your_huggingface_token
AGENT_PASSWORD=password-to-restrict-access-to-agent
```

::: info 
Models requiring authentication to download are also flagged in the `/lib/data/media-models.json` file of AI Server GitHub repository.
:::

### Accessing the ComfyUI Agent

Once the ComfyUI Agent is running, you can access the ComfyUI Agent instance at [http://localhost:7860](http://localhost:7860) and can be used as a standard ComfyUI.
The AI Server has pre-defined workflows to interact with your ComfyUI Agent instance to generate images, audio, text, and more.

### Overriding Workflows

These workflows are found in the AI Server AppHost project under `workflows`. These are templated JSON versions of workflows you save in the ComfyUI web interface.

You can override these workflows by creating a new JSON file with the same name and path but in the `App_Data/overrides` folder. For example, to override the `text_to_image` workflow, you would create a file at `App_Data/overrides/text_to_image.json`.
This would override all calls that use text-to-image workflow sent to your ComfyUI Agent instance. You can also override just `flux-schnell` by creating a file at `App_Data/overrides/flux1/text_to_image.json`, and Stable Diffusion 3.5 at `App_Data/overrides/sd35/text_to_image.json`.
