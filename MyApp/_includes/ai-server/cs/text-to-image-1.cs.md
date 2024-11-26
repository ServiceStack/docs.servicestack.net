```csharp
var response = client.Post(new TextToImage
{
    Height = 768,
    Width = 768,
    Model = "sdxl-lightning",
    PositivePrompt = "A happy llama",
    NegativePrompt = "bad quality, blurry image"
});
File.WriteAllBytes(saveToPath, response.Results[0].Url.GetBytesFromUrl());
```
