```csharp
var response = client.PostFilesWithRequest(new QueueConvertImage {
        OutputFormat = ImageOutputFormat.Png
    },
    [new UploadFile("test_image.jpg", File.OpenRead("files/test_image.jpg"), "image")]
);

var status = await client.GetAsync(new GetJobStatus { RefId = response.RefId });
while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
{
    await Task.Delay(1000);
    status = await client.GetAsync(new GetJobStatus { RefId = response.RefId });
}

// Download the converted video
var videoUrl = status.Outputs[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
