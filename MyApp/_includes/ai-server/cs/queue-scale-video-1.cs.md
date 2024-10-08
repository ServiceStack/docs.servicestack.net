```csharp
var request = new QueueScaleVideo()
{
    Width = 1280,
    Height = 720,
    ReplyTo = "https://example.com/my/reply/endpoint" // optional
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

// Download the scaled video
var videoUrl = status.Outputs[0].Url;
videoUrl.DownloadFileTo($"scaled-video-{status.RefId}.mp4");
```