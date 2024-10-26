```csharp
var response = client.PostFilesWithRequest(new ScaleVideo {
        Width = 1280,
        Height = 720,
    },
    [new UploadFile("test_video.mp4", File.OpenRead("files/test_video.mp4"), "video")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
