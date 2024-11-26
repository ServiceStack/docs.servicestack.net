```csharp
using var fsImage = File.OpenRead("files/test_image.jpg");
var response = client.PostFileWithRequest(new QueueImageUpscale(),
    new UploadFile("image", fsImage, "image"));

// Poll for Job Completion Status
GetArtifactGenerationStatusResponse status = new();
while (status.JobState is BackgroundJobState.Queued or BackgroundJobState.Started)
{
    status = client.Get(new GetArtifactGenerationStatus { JobId = response.JobId });
    Thread.Sleep(1000);
}
if (status.Results?.Count > 0)
{
    File.WriteAllBytes(saveToPath, status.Results[0].Url.GetBytesFromUrl());
}
```
