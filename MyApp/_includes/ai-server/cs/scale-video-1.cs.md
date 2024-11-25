```csharp
using var fsVideo = File.OpenRead("files/test_video.mp4");
var response = client.PostFileWithRequest(new ScaleVideo {
        Width = 1280,
        Height = 720,
    },
    new UploadFile("test_video.mp4", fsVideo, "video"));

File.WriteAllBytes(saveToPath, response.Results[0].Url.GetBytesFromUrl());
```
