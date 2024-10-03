```csharp
var request = new ImageToImage()
{
    PositivePrompt = "A beautiful sunset over the ocean",
    NegativePrompt = "A pixelated, low-quality image",
    Sync = true
};

var response = client.PostFilesWithRequest<GenerationResponse>(
    request,
    [new UploadFile("image", File.OpenRead("ocean-sunset.jpg"), "ocean-sunset.jpg")]
);
response.Outputs[0].Url.DownloadFileTo("ocean-sunset.webp");
```