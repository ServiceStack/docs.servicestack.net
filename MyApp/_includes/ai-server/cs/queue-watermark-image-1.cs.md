```csharp
using var fsImage = File.OpenRead("files/test_image.jpg");
using var fsWatermark = File.OpenRead("files/watermark_image.png");
var response = client.PostFilesWithRequest(new QueueWatermarkImage {
        Position = WatermarkPosition.BottomRight
    }, [
        new UploadFile("test_image.jpg", fsImage, "image"),
        new UploadFile("watermark_image.png", fsWatermark, "watermark")
    ]);

GetArtifactGenerationStatusResponse status = new();
while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
{
    status = await client.GetAsync(new GetArtifactGenerationStatus { RefId = response.RefId });
    await Task.Delay(1000);
}

// Download the watermarked image
File.WriteAllBytes(saveToPath, status.Results[0].Url.GetBytesFromUrl());
```
