```csharp
using var fsVideo = File.OpenRead("files/test_video.webm");
var response = client.PostFileWithRequest(new QueueConvertVideo {
        OutputFormat = ConvertVideoOutputFormat.MP4
    },
    new UploadFile("test_video.webm", fsVideo, "video"));

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
