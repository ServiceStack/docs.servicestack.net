```csharp
        var request = new QueueWatermarkVideo
        {
            Position = WatermarkPosition.BottomRight
        };

        var response = client.PostFilesWithRequest<QueueMediaTransformResponse>(
            request,
            [
                new UploadFile("test_video.mp4", File.OpenRead("files/test_video.mp4"), "video"),
                new UploadFile("watermark_image.png", File.OpenRead("files/watermark_image.png"), "watermark")
            ]
        );

        var status = await client.GetAsync(new GetJobStatus { RefId = response.RefId });
        while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
        {
            await Task.Delay(1000);
            status = await client.GetAsync(new GetJobStatus { RefId = response.RefId });
        }

        // Download the watermarked video
        var videoUrl = status.Outputs[0].Url;
        videoUrl.DownloadFileTo($"watermarked-video-{status.RefId}.mp4");
```
