```csharp
using var fsImage = File.OpenRead("files/test_image.jpg");
var response = client.PostFileWithRequest(new ImageUpscale(),
    new UploadFile("image", fsImage, "image"));

File.WriteAllBytes(saveToPath, response.Results[0].Url.GetBytesFromUrl());
```
