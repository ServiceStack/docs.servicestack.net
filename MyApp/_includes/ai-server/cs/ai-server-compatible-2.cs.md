```csharp
// Using OpenAI API directly via JsonApiClient
var client = new JsonApiClient("https://api.openai.com/v1");
client.AddHeader("Authorization", "Bearer " + Environment.GetEnvironmentVariable("OPENAI_API_KEY"));

// Using AI Server DTOs with OpenAI API
var request = new OpenAiChat {
    Model = "gpt-4-turbo",
    Messages = new List<OpenAiMessage> {
        new OpenAiMessage { Role = "system", Content = "You are a helpful AI assistant." },
        new OpenAiMessage { Role = "user", Content = "How do LLMs work?" }
    },
    MaxTokens = 50
};

// Typed response DTO
var response = await client.PostAsync<OpenAiChatResponse>("/chat/completions", request);
```