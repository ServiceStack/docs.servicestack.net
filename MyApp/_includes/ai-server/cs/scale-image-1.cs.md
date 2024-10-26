```csharp
var response = client.PostFilesWithRequest(new ScaleImage {
        Width = 1280,
        Height = 720,
    },
    [new UploadFile("test_image.jpg", File.OpenRead("files/test_image.jpg"), "image")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
