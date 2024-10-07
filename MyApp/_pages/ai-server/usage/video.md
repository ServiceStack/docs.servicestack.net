---
title: Video Endpoints
description: Processing videos with AI Server
---

Also incorporated into the ComfyUI Agent is FFmpeg, which can be used to process videos. AI Server wraps some common operations into easier-to-use endpoints, such as:

- **Crop Video**: Crop a video to a specific size.
- **Convert Video**: Convert a video to a different format.
- **Scale Video**: Scale a video to a different resolution.
- **Watermark Video**: Add a watermark to a video.

## Using Video Endpoints

These endpoints are used in a similar way to the other AI Server endpoints, eg you can provide a RefId, Tag, ReplyTo, and Sync properties to enhance the usage of AI Server.

### Crop Video

```csharp
var request = new CropVideo()
{
    X = 120,
    Y = 120,
    Width = 720,
    Height = 720,
    Sync = true
};

var response = client.PostFilesWithRequest<TransformResponse>(
    request,
    [new UploadFile("video", File.OpenRead("video.mp4"), "video.mp4")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo("cropped-video.mp4");
```

### Convert Video

```csharp
var request = new ConvertVideo()
{
    OutputFormat = ConvertVideoOutputFormat.WebM,
    Sync = true
};

var response = client.PostFilesWithRequest<TransformResponse>(
    request,
    [new UploadFile("video", File.OpenRead("video.mp4"), "video.mp4")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo("converted-video.webm");
```

