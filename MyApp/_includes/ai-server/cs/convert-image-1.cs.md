```csharp
var response = client.PostFilesWithRequest(new ConvertImage {
        OutputFormat = ImageOutputFormat.Gif
    },
    [new UploadFile("test_image.jpg", File.OpenRead("files/test_image.jpg"), "image")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
