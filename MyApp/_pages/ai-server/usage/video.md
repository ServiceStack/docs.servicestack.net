---
title: Video Endpoints
description: Processing videos with AI Server
---

Also incorporated into the ComfyUI Agent is FFmpeg, which can be used to process videos. AI Server wraps some common operations into easier-to-use endpoints, such as:

- **Crop Video**: Crop a video to a specific size.
- **Convert Video**: Convert a video to a different format.
- **Scale Video**: Scale a video to a different resolution.
- **Watermark Video**: Add a watermark to a video.
- **Trim Video**: Trim a video to a specific length.

## Using Video Endpoints

These endpoints are used in a similar way to the other AI Server endpoints, e.g., you can provide a RefId and Tag to help categorize the request, and for Queue requests, you can provide a ReplyTo URL to send a POST request to when the request is complete.

### Crop Video {#crop-video}

::include ai-server/cs/crop-video-1.cs.md::

### Queue Crop Video {#crop-video}

::include ai-server/cs/queue-crop-video-1.cs.md::

### Convert Video {#convert-video}

::include ai-server/cs/convert-video-1.cs.md::

### Queue Convert Video {#convert-video}

::include ai-server/cs/queue-convert-video-1.cs.md::

### Scale Video {#scale-video}

::include ai-server/cs/scale-video-1.cs.md::

### Queue Scale Video {#scale-video}

::include ai-server/cs/queue-scale-video-1.cs.md::

### Watermark Video {#watermark-video}

::include ai-server/cs/watermark-video-1.cs.md::

### Queue Watermark Video {#watermark-video}

::include ai-server/cs/queue-watermark-video-1.cs.md::

### Trim Video {#trim-video}

::include ai-server/cs/trim-video-1.cs.md::

### Queue Trim Video {#trim-video}

::include ai-server/cs/queue-trim-video-1.cs.md::