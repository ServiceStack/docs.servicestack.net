```csharp
using var fsVideo = File.OpenRead("files/test_video.mp4");
using var fsWatermark = File.OpenRead("files/watermark_image.png");
var response = client.PostFilesWithRequest(new QueueWatermarkVideo {
        Position = WatermarkPosition.BottomRight
    }, [
        new UploadFile("test_video.mp4", fsVideo, "video"),
        new UploadFile("watermark_image.png", fsWatermark, "watermark")
    ]);

GetArtifactGenerationStatusResponse status = new();
while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
{
    status = await client.GetAsync(new GetArtifactGenerationStatus { RefId = response.RefId });
    await Task.Delay(1000);
}

// Download the watermarked video
File.WriteAllBytes(saveToPath, status.Results[0].Url.GetBytesFromUrl());
```
