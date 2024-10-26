```csharp
var response = client.Post(new TextToImage {
    Height = 768,
    Width = 768,
    Model = "sdxl-lightning",
    PositivePrompt = "A happy llama",
    NegativePrompt = "bad quality, blurry image"
});
response.Outputs[0].Url.DownloadFileTo(outputFileName);
```
