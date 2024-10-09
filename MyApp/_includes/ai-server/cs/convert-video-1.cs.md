```csharp
var request = new ConvertVideo()
{
    OutputFormat = ConvertVideoOutputFormat.MOV
};

var response = client.PostFilesWithRequest<MediaTransformResponse>(
    request,
    [new UploadFile("test_video.webm", File.OpenRead("files/test_video.webm"), "video")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
