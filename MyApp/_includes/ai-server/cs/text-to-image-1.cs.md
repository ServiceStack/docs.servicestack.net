```csharp
var request = new TextToImage()
{
    Height = 768,
    Width = 768,
    Model = "flux-schnell",
    PositivePrompt = "A happy llama",
    NegativePrompt = "bad quality, blurry image",
    Sync = true
};

var response = await client.PostAsync(request);
response.Outputs[0].Url.DownloadFileTo("llama.jpg");
```