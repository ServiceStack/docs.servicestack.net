```csharp
var request = new CropImage()
{
    X = 50,
    Y = 50,
    Width = 150,
    Height = 150
};

var response = client.PostFilesWithRequest<MediaTransformResponse>(
    request,
    [new UploadFile("test_image.jpg", File.OpenRead("files/test_image.jpg"), "image")]
);

var videoUrl = response.Outputs[0].Url;
videoUrl.DownloadFileTo(outputFileName);
```
