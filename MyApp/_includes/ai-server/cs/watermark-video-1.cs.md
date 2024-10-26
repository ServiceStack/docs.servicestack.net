```csharp
var response = client.PostFilesWithRequest(new WatermarkVideo {
        Position = WatermarkPosition.BottomRight
    },
    [new UploadFile("test_video.mp4", File.OpenRead("files/test_video.mp4"), "video"),
     new UploadFile("watermark_image.png", File.OpenRead("files/watermark_image.png"), "watermark")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
