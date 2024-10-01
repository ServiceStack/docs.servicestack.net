```csharp  
// Using AI Server DTOs with OpenAI API
var request = new OpenAiChat {
    Model = "gpt-4-turbo",
    Messages = new List<OpenAiMessage> {
        new OpenAiMessage { Role = "system", Content = "You are a helpful AI assistant." },
        new OpenAiMessage { Role = "user", Content = "How do LLMs work?" }
    },
    MaxTokens = 50
};

var json = JsonSerializer.SerializeToString(request);
var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", 
    new StringContent(json, Encoding.UTF8, "application/json"));
```