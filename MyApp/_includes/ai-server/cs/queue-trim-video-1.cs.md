```csharp
var request = new QueueTrimVideo
{
    StartTime = "00:05",
    EndTime = "00:10"
};

var response = client.PostFilesWithRequest<QueueMediaTransformResponse>(
    request,
    [new UploadFile("test_video.mp4", File.OpenRead("files/test_video.mp4"), "video")]
);

var status = await client.GetAsync(new GetJobStatus { RefId = response.RefId });
while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
{
    await Task.Delay(1000);
    status = await client.GetAsync(new GetJobStatus { RefId = response.RefId });
}

// Download the trimmed video
var videoUrl = status.Outputs[0].Url;
videoUrl.DownloadFileTo($"trimmed-video-{status.RefId}.mp4");
```
