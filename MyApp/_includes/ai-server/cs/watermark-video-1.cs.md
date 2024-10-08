```csharp
var request = new WatermarkVideo
{
    Position = WatermarkPosition.BottomRight
};

var response = client.PostFilesWithRequest<MediaTransformResponse>(
    request,
    [
        new UploadFile("test_video.mp4", File.OpenRead("files/test_video.mp4"), "video"),
        new UploadFile("watermark_image.png", File.OpenRead("files/watermark_image.png"), "watermark")
    ]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo("watermarked-video.mp4");
```