---
title: Image Upscale
---

## Image Upscale UI

AI Server's Image Upscale UI lets you use AI to 2x upscale and image from its active Comfy UI Agents:

<div class="not-prose">
    <h3 class="text-4xl text-center text-indigo-800 pb-3">
        <span class="text-gray-300">https://localhost:5006</span>/ImageUpscale
    </h3>
</div>

![](/img/pages/ai-server/uis/ImageUpscale.webp)

## Using Image Upscale Endpoints

::include ai-server/endpoint-usage.md::

### Image Upscale {#image-upscale}

::include ai-server/cs/image-upscale-1.cs.md::

### Queue Image Upscale {#queue-image-upscale}

::include ai-server/cs/queue-image-upscale-1.cs.md::

## Additional Functionality

AI Server also provides Image-To-Text generation using the ComfyUI Agent that utilizes the [Florence 2 model](https://huggingface.co/microsoft/Florence-2-base). The ComfyUI Agent must have this model downloaded and installed to support this functionality.

