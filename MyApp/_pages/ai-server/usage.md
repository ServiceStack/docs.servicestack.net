---
title: AI Server APIs
---

AI Server provides a set of APIs for interacting with AI models and services, as well as some common image, video and audio processing tasks. 

Every API provides two modes of operation: synchronous and asynchronous. 

- **Synchronous**: The request is processed immediately and the response returns a URL to download the result. This has a timeout of 60 seconds.
- **Asynchronous**: The request is queued and processed in the background. The response returns a URL to download the result when it's ready.

## Image Generation APIs

AI Server has built-in ComfyUI workflows for performing image generation tasks using AI models like SDXL and Flux.

The following tasks are available for image generation:

- [Text to Image](/ai-server/text-to-image) - Generate an image based on provided text prompts.
- [Image to Image](/ai-server/image-to-image) - Generate a new image based on an input image and provided prompts.
- [Image with Mask](/ai-server/image-with-mask) - Generate a new image based on an input image, a mask, and provided prompts (applied only to the masked area).
- [Image Upscale](/ai-server/image-upscale) - Upscale an input image to a higher resolution (currently 2x only).

## Speech APIs

AI Server provides endpoints for speech-related tasks, including Speech-to-Text and Text-to-Speech conversions. These endpoints utilize AI models to process audio and text data.

The following tasks are available for speech processing:

- [Speech to Text](/ai-server/speech-to-text) - Convert audio input to text output.
- [Text to Speech](/ai-server/text-to-speech) - Convert text input to audio output.


## AI Server API Endpoints

AI Server has endpoints for AI tasks as well as media processing tasks.

### Generative AI Endpoints

- **Chat**: Interact with LLMs to generate text.
  - **Sync**: `/api/OpenAiChatCompletion`
  - **Async**: `/api/QueueOpenAiChatCompletion`
- **Image**: Generate images from text.
    - **Sync**: `/api/TextToImage`
    - **Async**: `/api/QueueTextToImage`
- **Image to Image**: Generate images from images.
    - **Sync**: `/api/ImageToImage`
    - **Async**: `/api/QueueImageToImage`
- **Image With Mask**: Generate images from images with a mask.
    - **Sync**: `/api/ImageWithMask`
    - **Async**: `/api/QueueImageWithMask`
- **Image Upscale**: Upscale images.
    - **Sync**: `/api/ImageUpscale`
    - **Async**: `/api/QueueImageUpscale`
- **Image To Text**: Generate text from images.
    - **Sync**: `/api/ImageToText`
    - **Async**: `/api/QueueImageToText`
- **Speech to Text**: Transcribe audio to text.
    - **Sync**: `/api/SpeechToText`
    - **Async**: `/api/QueueSpeechToText`
- **Text To Speech**: Generate audio from text.
    - **Sync**: `/api/TextToSpeech`
    - **Async**: `/api/QueueTextToSpeech`

:::info
The Chat API is also available as an OpenAI compatible endpoint at `/v1/chat/completions` with matching DTOs.
While not all clients will work with this endpoint, the structure of the request and response is the same.
:::

## Media Processing Endpoints

Media endpoints are used for processing images, and videos. Videos are processed remotely by the [ComfyUI Agent](/ai-server/comfy-extension), while image processing is done by the AI Server itself.

### Video Processing Endpoints

- **[Scale Video](/ai-server/usage/video#scale-video)**: Scale a video to a different resolution.
  - **Sync**: [`/api/ScaleVideo`](/ai-server/usage/video#scale-video)
  - **Async**: [`/api/QueueScaleVideo`](/ai-server/usage/video#scale-video)
- **[Crop Video](/ai-server/usage/video#crop-video)**: Crop a video to a specific size.
  - **Sync**: [`/api/CropVideo`](/ai-server/usage/video#crop-video)
  - **Async**: [`/api/QueueCropVideo`](/ai-server/usage/video#crop-video)
- **[Watermark Video](/ai-server/usage/video#watermark-video)**: Add a watermark to a video.
  - **Sync**: [`/api/WatermarkVideo`](/ai-server/usage/video#watermark-video)
  - **Async**: [`/api/QueueWatermarkVideo`](/ai-server/usage/video#watermark-video)
- **[Convert Video](/ai-server/usage/video#convert-video)**: Convert a video to a different format.
  - **Sync**: [`/api/ConvertVideo`](/ai-server/usage/video#convert-video)
  - **Async**: [`/api/QueueConvertVideo`](/ai-server/usage/video#convert-video)
- **[Trim Video](/ai-server/usage/video#trim-video)**: Trim a video to a specific length via a start and end time.
  - **Sync**: [`/api/TrimVideo`](/ai-server/usage/video#trim-video)
  - **Async**: [`/api/QueueTrimVideo`](/ai-server/usage/video#trim-video)

### Image Processing Endpoints

- **[Scale Image](/ai-server/usage/image#scale-image)**: Scale an image to a different resolution.
  - **Sync**: [`/api/ScaleImage`](/ai-server/usage/image#scale-image)
  - **Async**: [`/api/QueueScaleImage`](/ai-server/usage/image#scale-image)
- **[Crop Image](/ai-server/usage/image#crop-image)**: Crop an image to a specific size.
  - **Sync**: [`/api/CropImage`](/ai-server/usage/image#crop-image)
  - **Async**: [`/api/QueueCropImage`](/ai-server/usage/image#crop-image)
- **[Watermark Image](/ai-server/usage/image#watermark-image)**: Add a watermark to an image.
  - **Sync**: [`/api/WatermarkImage`](/ai-server/usage/image#watermark-image)
  - **Async**: [`/api/QueueWatermarkImage`](/ai-server/usage/image#watermark-image)
- **[Convert Image](/ai-server/usage/image#convert-image)**: Convert an image to a different format.
  - **Sync**: [`/api/ConvertImage`](/ai-server/usage/image#convert-image)
  - **Async**: [`/api/QueueConvertImage`](/ai-server/usage/image#convert-image)

### Architecture

The AI Server is designed to be a lite-weight router for AI services, providing a common interface for AI services to be accessed via APIs with typed client support in many languages. 
As such, heavy processing tasks are offloaded to other services, including self-hosted ones like the ComfyUI Agent.

:::mermaid
graph TD
    A[API Client] -->|API Request| B(<img class="mx-auto block" src="https://raw.githubusercontent.com/ServiceStack/Assets/refs/heads/master/img/artwork/logo-280.png"/>)
    B -->|API Request| C[Replicate API]
    B -->|API Request| I[OpenRouter API]
    B -->|API Request| D[OpenAI API]
    B -->|Video Processing| E[ComfyUI Agent]
    E -->|Video Processing| F[FFmpeg]
    E -->|AI Processing| G[PiperTTS]
    E -->|AI Processing| J[Whisper]
    E -->|AI Processing| K[SDXL]
    E -->|AI Processing| L[Flux.1.Schnell]
    B -->|Image Processing| H[AI Server]
    B -->|AI Processing| E[ComfyUI Agent]
:::