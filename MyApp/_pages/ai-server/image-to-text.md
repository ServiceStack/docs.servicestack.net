---
title: Image to Text
---

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