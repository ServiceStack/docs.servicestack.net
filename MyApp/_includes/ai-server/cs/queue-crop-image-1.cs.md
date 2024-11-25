```csharp
using var fsImage = File.OpenRead("files/test_image.jpg");
var response = client.PostFileWithRequest(new QueueCropImage {
        X = 50,
        Y = 50,
        Width = 150,
        Height = 150
    },
    new UploadFile("test_image.jpg", fsImage, "image"));

GetArtifactGenerationStatusResponse status = new();
while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
{
    status = await client.GetAsync(new GetArtifactGenerationStatus { RefId = response.RefId });
    await Task.Delay(1000);
}

// Download the cropped video
var videoUrl = status.Results[0].Url;
videoUrl.DownloadFileTo($"cropped-image-{status.RefId}.jpg");
```
