```csharp
var request = new QueueTextToImage()
{
    Height = 768,
    Width = 768,
    Model = "sdxl-lightning",
    PositivePrompt = "A happy llama",
    NegativePrompt = "bad quality, blurry image"
};

var response = client.Post(request);
```
