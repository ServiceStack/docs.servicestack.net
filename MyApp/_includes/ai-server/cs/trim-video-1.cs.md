```csharp
using var fsVideo = File.OpenRead("files/test_video.mp4");
var response = client.PostFileWithRequest(new TrimVideo {
        StartTime = "00:05",
        EndTime = "00:10"
    },
    new UploadFile("test_video.mp4", fsVideo, "video"));

var videoUrl = response.Results[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
