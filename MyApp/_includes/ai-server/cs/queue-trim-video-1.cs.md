```csharp
using var fsVideo = File.OpenRead("files/test_video.mp4");
var response = client.PostFileWithRequest(new QueueTrimVideo {
        StartTime = "00:05",
        EndTime = "00:10"
    },
    new UploadFile("test_video.mp4", fsVideo, "video"));

GetArtifactGenerationStatusResponse status = new();
while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
{
    status = await client.GetAsync(new GetArtifactGenerationStatus { RefId = response.RefId });
    await Task.Delay(1000);
}

// Download the trimmed video
File.WriteAllBytes(saveToPath, status.Results[0].Url.GetBytesFromUrl());
```
