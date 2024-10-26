```csharp
var response = client.PostFilesWithRequest(new QueueImageToText(),
    [new UploadFile("image", File.OpenRead("files/test_image.jpg"), "image")]
);
```
