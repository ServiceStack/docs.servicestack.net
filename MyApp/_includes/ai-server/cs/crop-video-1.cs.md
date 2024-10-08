```csharp
var request = new CropVideo()
{
    X = 100,
    Y = 100,
    Width = 500,
    Height = 300
};

var response = client.PostFilesWithRequest<MediaTransformResponse>(
    request,
    [new UploadFile("test_video.mp4", File.OpenRead("files/test_video.mp4"), "video")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo("cropped-video.mp4");
```