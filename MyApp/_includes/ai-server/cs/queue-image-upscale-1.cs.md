```csharp
using var fsImage = File.OpenRead("files/test_image.jpg");
var response = client.PostFileWithRequest(new QueueImageUpscale(),
    new UploadFile("image", fsImage, "image"));
```
