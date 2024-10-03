```csharp
var request = new CropVideo()
{
    X = 120,
    Y = 120,
    Width = 720,
    Height = 720,
    Sync = true
};

var response = client.PostFilesWithRequest<TransformResponse>(
    request,
    [new UploadFile("video", File.OpenRead("video.mp4"), "video.mp4")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo("cropped-video.mp4");
```