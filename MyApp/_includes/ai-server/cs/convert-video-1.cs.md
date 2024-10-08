```csharp
var request = new ConvertVideo()
{
    Format = "mp4"
};

var response = client.PostFilesWithRequest<MediaTransformResponse>(
    request,
    [new UploadFile("video", File.OpenRead("video.avi"), "video.avi")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo("converted-video.mp4");
```