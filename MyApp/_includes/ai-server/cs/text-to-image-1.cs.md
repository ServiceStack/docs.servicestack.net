```csharp
var request = new TextToImage()
{
    Height = 768,
    Width = 768,
    Model = "flux-schnell",
    PositivePrompt = "A happy llama",
    NegativePrompt = "bad quality, blurry image"
};

var response = await client.ApiAsync(request);
response.ThrowIfError();
response.Response.Outputs[0].Url.DownloadFileTo("llama.jpg");
```