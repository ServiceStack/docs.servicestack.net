```csharp
using var fsImage = File.OpenRead("files/comfyui_upload_test.png");
using var fsMask = File.OpenRead("files/comfyui_upload_test_mask.png");
var response = client.PostFilesWithRequest(new QueueImageWithMask {
        PositivePrompt = "A beautiful sunset over the ocean",
        NegativePrompt = "A pixelated, low-quality image"
    }, [
        new UploadFile("image", fsImage, "image"),
        new UploadFile("mask", fsMask, "mask")
    ]);

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
