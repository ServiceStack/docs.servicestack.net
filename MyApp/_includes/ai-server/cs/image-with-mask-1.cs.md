```csharp
using var fsImage = File.OpenRead("files/comfyui_upload_test.png");
using var fsMask = File.OpenRead("files/comfyui_upload_test_mask.png");
var response = client.PostFilesWithRequest(new ImageWithMask {
        PositivePrompt = "A beautiful sunset over the ocean",
        NegativePrompt = "A pixelated, low-quality image"
    }, [
        new UploadFile("image", fsImage, "image"),
        new UploadFile("mask", fsMask, "mask")
    ]);

File.WriteAllBytes(saveToPath, response.Results[0].Url.GetBytesFromUrl());
```