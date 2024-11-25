```csharp
using var fsImage = File.OpenRead("files/test_image.jpg");
var response = client.PostFileWithRequest(new QueueImageToText(),
    new UploadFile("image", fsImage, "image"));
```
