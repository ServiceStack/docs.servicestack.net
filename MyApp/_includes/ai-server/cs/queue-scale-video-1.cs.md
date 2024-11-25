```csharp
using var fsVideo = File.OpenRead("files/test_video.mp4");
var response = client.PostFileWithRequest(new QueueScaleVideo {
        Width = 1280,
        Height = 720,
        ReplyTo = "https://example.com/my/reply/endpoint" // optional
    },
    new UploadFile("test_video.mp4", fsVideo, "video"));

GetArtifactGenerationStatusResponse status = new();
while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
{
    status = await client.GetAsync(new GetArtifactGenerationStatus { RefId = response.RefId });
    await Task.Delay(1000);
}

// Download the scaled video
var videoUrl = status.Results[0].Url;
videoUrl.DownloadFileTo($"scaled-video-{status.RefId}.mp4");
```
