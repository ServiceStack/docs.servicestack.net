```csharp
var client = new JsonApiClient(baseUrl);
client.BearerToken = apiKey;

var api = await client.ApiAsync(new OpenAiChatCompletion {
    Model = "mixtral:8x22b",
    Messages = [
        new() {
            Role = "user",
            Content = "What's the capital of France?"
        }
    ],
    MaxTokens = 50
});
```
