```csharp
var request = new QueueImageToImage()
{
    PositivePrompt = "A beautiful sunset over the ocean",
    NegativePrompt = "A pixelated, low-quality image"
};

var response = client.PostFilesWithRequest<QueueGenerationResponse>(
    request,
    [new UploadFile("image", File.OpenRead("files/comfyui_upload_test.png"), "image")]
);
```
