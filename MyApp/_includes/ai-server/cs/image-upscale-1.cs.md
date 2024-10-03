```csharp
var request = new ImageUpscale()
{
    Sync = true
};

var response = client.PostFilesWithRequest<GenerationResponse>(
    request,
    [new UploadFile("image", File.OpenRead("low-res.jpg"), "low-res.jpg")]
);
response.Outputs[0].Url.DownloadFileTo("high-res.webp");
```