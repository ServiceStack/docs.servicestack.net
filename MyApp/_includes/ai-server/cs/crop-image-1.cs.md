```csharp
using var fsImage = File.OpenRead("files/test_image.jpg");
var response = client.PostFileWithRequest(new CropImage {
        X = 50,
        Y = 50,
        Width = 150,
        Height = 150
    },
    new UploadFile("test_image.jpg", fsImage, "image"));

var videoUrl = response.Results[0].Url;
videoUrl.DownloadFileTo(saveToPath);
```
