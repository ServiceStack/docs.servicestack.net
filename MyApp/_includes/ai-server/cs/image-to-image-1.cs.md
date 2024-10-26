```csharp
var response = client.PostFilesWithRequest(new ImageToImage {
        PositivePrompt = "A beautiful sunset over the ocean",
        NegativePrompt = "A pixelated, low-quality image"
    },
    [new UploadFile("image", File.OpenRead("files/comfyui_upload_test.png"), "image")]
);
response.Outputs[0].Url.DownloadFileTo(outputFileName);
```
