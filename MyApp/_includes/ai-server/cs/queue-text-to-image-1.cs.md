```csharp
var response = client.Post(new QueueTextToImage
{
    Height = 768,
    Width = 768,
    Model = "sdxl-lightning",
    PositivePrompt = "A happy llama",
    NegativePrompt = "bad quality, blurry image"
});

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
