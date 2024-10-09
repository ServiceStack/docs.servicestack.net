---
title: Image Endpoints
description: Processing images with AI Server
---

AI Server incorporates various image processing capabilities. It wraps some common operations into easier-to-use endpoints, such as:

- **Crop Image**: Crop an image to a specific size.
- **Convert Image**: Convert an image to a different format.
- **Scale Image**: Scale an image to a different resolution.
- **Watermark Image**: Add a watermark to an image.

:::info
These operations are processed on the AI Server itself, rather than an external API or agent.
:::

## Using Image Endpoints

These endpoints are used in a similar way to the other AI Server endpoints, e.g., you can provide a RefId and Tag to help categorize the request, and for Queue requests, you can provide a ReplyTo URL to send a POST request to when the request is complete.

### Crop Image {#crop-image}

::include ai-server/cs/crop-image-1.cs.md::

### Queue Crop Image {#crop-image}

::include ai-server/cs/queue-crop-image-1.cs.md::

### Convert Image {#convert-image}

::include ai-server/cs/convert-image-1.cs.md::

### Queue Convert Image {#convert-image}

::include ai-server/cs/queue-convert-image-1.cs.md::

### Scale Image {#scale-image}

::include ai-server/cs/scale-image-1.cs.md::

### Queue Scale Image {#scale-image}

::include ai-server/cs/queue-scale-image-1.cs.md::

### Watermark Image {#watermark-image}

::include ai-server/cs/watermark-image-1.cs.md::

### Queue Watermark Image {#watermark-image}

::include ai-server/cs/queue-watermark-image-1.cs.md::
