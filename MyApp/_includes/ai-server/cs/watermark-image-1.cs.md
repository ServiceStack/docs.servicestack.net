```csharp
using var fsImage = File.OpenRead("files/test_image.jpg");
using var fsWatermark = File.OpenRead("files/watermark_image.png");
var response = client.PostFilesWithRequest(new WatermarkImage {
        Position = WatermarkPosition.BottomRight
    }, [
        new UploadFile("test_image.jpg", fsImage, "image"),
        new UploadFile("watermark_image.png", fsWatermark, "watermark")
    ]);

var videoUrl = response.Results[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
