```csharp
var apiClient = GetLocalApiClient("https://localhost:5005");
apiClient.BearerToken = Environment.GetEnvironmentVariable("AI_SERVER_API_KEY");

var response = await apiClient.PostAsync(new OpenAiChatCompletion {
    Model = "llama3:8b",
    Messages = new List<OpenAiMessage>
    {
        new OpenAiMessage { Role = "system", Content = "You are a helpful AI assistant." },
        new OpenAiMessage { Role = "user", Content = "How do LLMs work?" }
    },
    MaxTokens = 50
});
Console.WriteLine(response.Choices[0].Message.Content);
```
