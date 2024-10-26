```csharp
var response = client.PostFilesWithRequest(new QueueConvertVideo {
        Format = "mp4",
        ReplyTo = "https://example.com/my/reply/endpoint"
    },
    [new UploadFile("video", File.OpenRead("video.avi"), "video.avi")]
);

var status = await client.GetAsync(new GetJobStatus { RefId = response.RefId });
var timeout = DateTime.UtcNow.AddMinutes(5);
while (status.JobState is not BackgroundJobState.Completed &&
       DateTime.UtcNow < timeout)
{
    await Task.Delay(1000);
    status = await client.GetAsync(new GetJobStatus { RefId = response.RefId });
}

// Download the converted video
var videoUrl = status.Outputs[0].Url;
videoUrl.DownloadFileTo("converted-video.mp4");
```
