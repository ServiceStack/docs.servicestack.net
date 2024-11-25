```csharp
using var fsImage = File.OpenRead("files/comfyui_upload_test.png");
var response = client.PostFileWithRequest(new ImageToImage {
        PositivePrompt = "A beautiful sunset over the ocean",
        NegativePrompt = "A pixelated, low-quality image"
    },
    new UploadFile("image", fsImage, "image"));

response.Results[0].Url.DownloadFileTo(outputFileName);
```
