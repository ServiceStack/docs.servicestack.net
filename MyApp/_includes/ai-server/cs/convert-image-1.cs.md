```csharp
using var fsImage = File.OpenRead("files/test_image.jpg");
var response = client.PostFileWithRequest(new ConvertImage {
        OutputFormat = ImageOutputFormat.Gif
    },
    new UploadFile("test_image.jpg", fsImage, "image"));

File.WriteAllBytes(saveToPath, response.Results[0].Url.GetBytesFromUrl());
```
