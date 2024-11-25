```csharp
using var fsVideo = File.OpenRead("files/test_video.mp4");
using var fsWatermark = File.OpenRead("files/watermark_image.png");
var response = client.PostFilesWithRequest(new WatermarkVideo {
        Position = WatermarkPosition.BottomRight
    },
    [
        new UploadFile("test_video.mp4", fsVideo, "video"),
        new UploadFile("watermark_image.png", fsWatermark, "watermark")
    ]);

File.WriteAllBytes(saveToPath, response.Results[0].Url.GetBytesFromUrl());
```
