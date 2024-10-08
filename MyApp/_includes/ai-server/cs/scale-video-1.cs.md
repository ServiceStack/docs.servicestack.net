```csharp
var request = new ScaleVideo()
{
    Width = 1280,
    Height = 720,
};

var response = client.PostFilesWithRequest<MediaTransformResponse>(
    request,
    [new UploadFile("test_video.mp4", File.OpenRead("files/test_video.mp4"), "video")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo($"scaled-video.mp4");
```