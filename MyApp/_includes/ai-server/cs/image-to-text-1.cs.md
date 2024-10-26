```csharp
var response = client.PostFilesWithRequest(new ImageToText(),
    [new UploadFile("image", File.OpenRead("files/test_image.jpg"), "image")]
);
```
