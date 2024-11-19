---
title: Image to Text
---

## Image to Text UI

AI Server's Image to Text UI lets you request image classifications from its active Comfy UI Agents:

<div class="not-prose">
    <h3 class="text-4xl text-center text-indigo-800 pb-3">
        <span class="text-gray-300">https://localhost:5006</span>/ImageToText
    </h3>
</div>

![](/img/pages/ai-server/uis/ImageToText.webp)

## Using Image to Text Endpoints

::include ai-server/endpoint-usage.md::

### Image to Text {#image-to-text}

::include ai-server/cs/image-to-text-1.cs.md::

### Queue Image to Text {#queue-image-to-text}

::include ai-server/cs/queue-image-to-text-1.cs.md::

:::info
Ensure that the ComfyUI Agent has the Florence 2 model downloaded and installed for the Image-To-Text functionality to work.
This can be done by setting the `DEFAULT_MODELS` environment variable in the `.env` file to include `image-to-text`
:::