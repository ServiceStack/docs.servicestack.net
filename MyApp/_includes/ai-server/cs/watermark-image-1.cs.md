```csharp
var response = client.PostFilesWithRequest(new WatermarkImage {
        Position = WatermarkPosition.BottomRight
    },
    [new UploadFile("test_image.jpg", File.OpenRead("files/test_image.jpg"), "image"),
     new UploadFile("watermark_image.png", File.OpenRead("files/watermark_image.png"), "watermark")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
