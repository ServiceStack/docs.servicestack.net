```csharp
var request = new QueueCropVideo()
{
    X = 100,
    Y = 100,
    Width = 500,
    Height = 300
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

// Download the cropped video
var videoUrl = status.Outputs[0].Url;
videoUrl.DownloadFileTo($"cropped-video-{status.RefId}.mp4");
```
