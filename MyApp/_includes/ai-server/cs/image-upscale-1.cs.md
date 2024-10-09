```csharp
var request = new ImageUpscale() { };

var response = client.PostFilesWithRequest<GenerationResponse>(
    request,
    [new UploadFile("image", File.OpenRead("files/test_image.jpg"), "image")]
);
response.Outputs[0].Url.DownloadFileTo(outputFileName);
```
