```csharp
using var fsVideo = File.OpenRead("files/test_video.mp4");
var response = client.PostFileWithRequest(new QueueCropVideo {
        X = 100,
        Y = 100,
        Width = 500,
        Height = 300
    },
    new UploadFile("test_video.mp4", fsVideo, "video")
);

GetArtifactGenerationStatusResponse status = new();
while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
{
    status = await client.GetAsync(new GetArtifactGenerationStatus { RefId = response.RefId });
    await Task.Delay(1000);
}

// Download the cropped video
var videoUrl = status.Results[0].Url;
videoUrl.DownloadFileTo($"cropped-video-{status.RefId}.mp4");
```
