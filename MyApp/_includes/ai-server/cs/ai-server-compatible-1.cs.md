```csharp
var apiClient = GetLocalApiClient(AiServerUrl);
apiClient.BearerToken = Environment.GetEnvironmentVariable("AI_SERVER_API_KEY");

var request = new OpenAiChatCompletion {
    Model = "llama3.1:8b",
    Messages =
    [
        new() { Role = "system", Content = "You are a helpful AI assistant." },
        new() { Role = "user", Content = "How do LLMs work?" }
    ],
    MaxTokens = 50
};

var response = await apiClient.PostAsync(request);
var openAiResponse = response; // The same
Console.WriteLine(openAiResponse.Choices[0].Message.Content);
```
