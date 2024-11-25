```csharp
var client = new JsonApiClient("https://api.openai.com");
client.AddHeader("Authorization", "Bearer " + Environment.GetEnvironmentVariable("OPENAI_API_KEY"));

// Using AI Server DTOs with OpenAI API
var request = new OpenAiChatCompletion {
    Model = "gpt-4-turbo",
    Messages = [
        new() { Role = "system", Content = "You are a helpful AI assistant." },
        new() { Role = "user", Content = "What is the capital of France?" }
    ],
    MaxTokens = 20
};

var response = await client.PostAsync<OpenAiChatResponse>(
    "/v1/chat/completions", 
    request);
```
