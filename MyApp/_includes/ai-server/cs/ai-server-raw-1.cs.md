```csharp
var apiClient = GetLocalApiClient("https://localhost:5005");
apiClient.BearerToken = Environment.GetEnvironmentVariable("AI_SERVER_API_KEY");

var request = new OpenAiChatCompletion() 
    {
        Model = "llama3:8b",
        Messages = new List<OpenAiMessage>
        {
            new() { Role = "system", Content = "You are a helpful AI assistant." },
            new() { Role = "user", Content = "How do LLMs work?" }
        },
        MaxTokens = 50
    };

var response = await apiClient.ApiAsync(request);
response.ThrowIfError();
var openAiResponse = response; // compatible with openai response schema
Console.WriteLine(openAiResponse.Response.Choices[0].Message.Content);
```
