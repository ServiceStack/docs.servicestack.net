```csharp
var response = client.PostFilesWithRequest(new QueueImageUpscale(),
    [new UploadFile("image", File.OpenRead("files/test_image.jpg"), "image")]
);
```
