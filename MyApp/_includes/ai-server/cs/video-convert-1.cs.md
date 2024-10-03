```csharp
var request = new ConvertVideo()
{
    OutputFormat = ConvertVideoOutputFormat.WebM,
    Sync = true
};

var response = client.PostFilesWithRequest<TransformResponse>(
    request,
    [new UploadFile("video", File.OpenRead("video.mp4"), "video.mp4")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo("converted-video.webm");
```