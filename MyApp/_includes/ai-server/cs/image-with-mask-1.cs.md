```csharp
var request = new ImageWithMask()
{
    PositivePrompt = "A beautiful sunset over the ocean",
    NegativePrompt = "A pixelated, low-quality image",
    Sync = true
};

var response = client.PostFilesWithRequest<GenerationResponse>(
    request,
    [new UploadFile("image", File.OpenRead("sunset.jpg"), "sunset.jpg"),
        new UploadFile("mask", File.OpenRead("mask.jpg"), "mask.jpg")]
);
response.Outputs[0].Url.DownloadFileTo("ocean-sunset.webp");
```