```csharp
var client = GetLocalApiClient(AiServerUrl);

var response = client.Post(new OpenAiChatCompletion {
    Model = "llama3.1:8b",
    Messages =
    [
        new() { Role = "system", Content = "You are a helpful AI assistant." },
        new() { Role = "user", Content = "How do LLMs work?" }
    ],
    MaxTokens = 50
});
var answer = response.Choices[0].Message.Content;
```
