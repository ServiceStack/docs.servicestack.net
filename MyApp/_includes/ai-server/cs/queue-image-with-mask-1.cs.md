```csharp
var response = client.PostFilesWithRequest(new QueueImageWithMask {
        PositivePrompt = "A beautiful sunset over the ocean",
        NegativePrompt = "A pixelated, low-quality image"
    },
    [new UploadFile("image", File.OpenRead("files/comfyui_upload_test.png"), "image"),
        new UploadFile("mask", File.OpenRead("files/comfyui_upload_test_mask.png"), "mask")]
);
```
