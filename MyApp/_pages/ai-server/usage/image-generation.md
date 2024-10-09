---
title: Image Generation
description: Generating images with AI Server using ComfyUI workflows
---

AI Server has built-in ComfyUI workflows for performing image generation tasks using AI models like SDXL and Flux.

The following tasks are available for image generation:

- **Text to Image**: Generate an image based on provided text prompts.
- **Image to Image**: Generate a new image based on an input image and provided prompts.
- **Image with Mask**: Generate a new image based on an input image, a mask, and provided prompts (applied only to the masked area).
- **Image Upscale**: Upscale an input image to a higher resolution (currently 2x only).

## Using Image Generation Endpoints

These endpoints are used in a similar way to other AI Server endpoints. You can provide a RefId and Tag to help categorize the request, and for Queue requests, you can provide a ReplyTo URL to send a POST request to when the request is complete.

### Text to Image {#text-to-image}

::include ai-server/cs/text-to-image-1.cs.md::

### Queue Text to Image {#queue-text-to-image}

::include ai-server/cs/queue-text-to-image-1.cs.md::

### Image to Image {#image-to-image}

::include ai-server/cs/image-to-image-1.cs.md::

### Queue Image to Image {#queue-image-to-image}

::include ai-server/cs/queue-image-to-image-1.cs.md::

### Image with Mask {#image-with-mask}

::include ai-server/cs/image-with-mask-1.cs.md::

### Queue Image with Mask {#queue-image-with-mask}

::include ai-server/cs/queue-image-with-mask-1.cs.md::

### Image Upscale {#image-upscale}

::include ai-server/cs/image-upscale-1.cs.md::

### Queue Image Upscale {#queue-image-upscale}

::include ai-server/cs/queue-image-upscale-1.cs.md::

## Additional Functionality

AI Server also provides Image-To-Text generation using the ComfyUI Agent that utilizes the [Florence 2 model](https://huggingface.co/microsoft/Florence-2-base). The ComfyUI Agent must have this model downloaded and installed to support this functionality.

### Image to Text {#image-to-text}

::include ai-server/cs/image-to-text-1.cs.md::

### Queue Image to Text {#queue-image-to-text}

::include ai-server/cs/queue-image-to-text-1.cs.md::

:::info
Ensure that the ComfyUI Agent has the Florence 2 model downloaded and installed for the Image-To-Text functionality to work.
:::