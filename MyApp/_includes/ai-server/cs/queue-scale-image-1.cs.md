```csharp
using var fsImage = File.OpenRead("files/test_image.jpg");
var response = client.PostFileWithRequest(new QueueScaleImage {
        Width = 1280,
        Height = 720,
        ReplyTo = "https://example.com/my/reply/endpoint" // optional
    },
    new UploadFile("test_image.jpg", fsImage, "image"));

GetArtifactGenerationStatusResponse status = new();
while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
{
    status = await client.GetAsync(new GetArtifactGenerationStatus { RefId = response.RefId });
    await Task.Delay(1000);
}

// Download the scaled image
File.WriteAllBytes(saveToPath, status.Results[0].Url.GetBytesFromUrl());
```
