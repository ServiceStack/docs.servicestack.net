```csharp
using var fsVideo = File.OpenRead("files/test_video.webm");
var response = client.PostFileWithRequest(new ConvertVideo {
        OutputFormat = ConvertVideoOutputFormat.MOV
    },
    new UploadFile("test_video.webm", fsVideo, "video"));

File.WriteAllBytes(saveToPath, response.Results[0].Url.GetBytesFromUrl());
```
