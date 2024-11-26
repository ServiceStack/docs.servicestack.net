```csharp
using var fsImage = File.OpenRead("files/test_image.jpg");
var response = client.PostFileWithRequest(new ScaleImage {
        Width = 1280,
        Height = 720,
    },
    new UploadFile("test_image.jpg", fsImage, "image"));

File.WriteAllBytes(saveToPath, response.Results[0].Url.GetBytesFromUrl());
```
