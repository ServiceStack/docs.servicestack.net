```csharp
var request = new TrimVideo
{
    StartTime = "00:05",
    EndTime = "00:10"
};

var response = client.PostFilesWithRequest<MediaTransformResponse>(
    request,
    [new UploadFile("test_video.mp4", File.OpenRead("files/test_video.mp4"), "video")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```