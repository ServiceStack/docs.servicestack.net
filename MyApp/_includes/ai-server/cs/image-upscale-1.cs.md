```csharp
var response = client.PostFilesWithRequest(new ImageUpscale(),
    [new UploadFile("image", File.OpenRead("files/test_image.jpg"), "image")]
);
response.Outputs[0].Url.DownloadFileTo(outputFileName);
```
