```csharp
var response = client.PostFilesWithRequest(new CropVideo {
        X = 100,
        Y = 100,
        Width = 500,
        Height = 300
    },
    [new UploadFile("test_video.mp4", File.OpenRead("files/test_video.mp4"), "video")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
