```csharp
using var fsVideo = File.OpenRead("files/test_video.mp4");
var response = client.PostFileWithRequest(new CropVideo {
        X = 100,
        Y = 100,
        Width = 500,
        Height = 300
    },
    new UploadFile("test_video.mp4", fsVideo, "video"));

var videoUrl = response.Results[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
