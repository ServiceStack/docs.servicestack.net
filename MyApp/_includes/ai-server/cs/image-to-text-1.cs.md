```csharp
var request = new ImageToText() { };

var response = client.PostFilesWithRequest<GenerationResponse>(
    request,
    [new UploadFile("image", File.OpenRead("files/test_image.jpg"), "image")]
);
```
