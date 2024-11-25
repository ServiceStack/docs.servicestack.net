```csharp
using var fsImage = File.OpenRead("files/test_image.jpg");
var response = client.PostFileWithRequest(new QueueConvertImage {
        OutputFormat = ImageOutputFormat.Png
    },
    new UploadFile("test_image.jpg", fsImage, "image"));

GetArtifactGenerationStatusResponse status = new();
while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
{
    status = await client.GetAsync(new GetArtifactGenerationStatus { RefId = response.RefId });
    await Task.Delay(1000);
}

// Download the converted video
var videoUrl = status.Results[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
