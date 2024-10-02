---
title: "Image to Image"
description: "Generating images from images with AI Server"
---

# Image to Image

AI Server has built-in ComfyUI workflows for doing image-to-image generation tasks like inpainting. This takes an image as input and generates a new image based on the input image and any additional prompts you provide.

## Other Image to Image Tasks

In addition to just Image to Image, AI Server also supports:

- **ImageWithMask**: This task takes an image and a mask as input and uses the provided prompts only for the matching masked area.
- **ImageUpscale**: This task takes an image and upscales it to a higher resolution using the provided prompts (2x only currently).
- **ImageToText**: This task takes an image and generates text based on the image content.

## Using Image to Image

To generate an image from an image, you can use the `ImageToImage` request:

```csharp
var request = new ImageToImage()
{
    PositivePrompt = "A beautiful sunset over the ocean",
    NegativePrompt = "A pixelated, low-quality image",
    Sync = true
};

var response = client.PostFilesWithRequest<GenerationResponse>(
    request,
    [new UploadFile("image", File.OpenRead("sunset.jpg"), "sunset.jpg")]
);
response.Outputs[0].Url.DownloadFileTo("ocean-sunset.webp");
```

A similar pattern can be used for the `ImageWithMask` request:

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

The `ImageUpscale` request is similar, but only requires the image file:

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

Upscaling is currently limited to 2x the original resolution, and it requires ComfyUI has downloaded the necessary model "RealESRGAN_x2.pth" to perform the upscale.