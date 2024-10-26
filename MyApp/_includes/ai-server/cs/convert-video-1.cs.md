```csharp
var response = client.PostFilesWithRequest(new ConvertVideo {
        OutputFormat = ConvertVideoOutputFormat.MOV
    },
    [new UploadFile("test_video.webm", File.OpenRead("files/test_video.webm"), "video")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
