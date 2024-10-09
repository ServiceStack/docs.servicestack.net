```csharp
        var request = new QueueConvertVideo()
        {
            OutputFormat = ConvertVideoOutputFormat.MP4
        };
        
        var response = client.PostFilesWithRequest<QueueMediaTransformResponse>(
            request,
            [new UploadFile("test_video.webm", File.OpenRead("files/test_video.webm"), "video")]
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
