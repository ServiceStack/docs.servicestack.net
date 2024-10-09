```csharp
var client = GetLocalApiClient("https://localhost:5005");
client.BearerToken = Environment.GetEnvironmentVariable("AI_SERVER_API_KEY");

var request = new QueueOpenAiChatCompletion
{
    Request = new()
    {
        Model = "gpt-4-turbo",
        Messages = new List<OpenAiMessage>
        {
            new() { Role = "system", Content = "You are a helpful AI assistant." },
            new() { Role = "user", Content = "How do LLMs work?" }
        },
        MaxTokens = 50
    }
};

var response = await client.ApiAsync(request);
response.ThrowIfError();
// Response only returns the related job information
Console.WriteLine($"RefId: {response.Response.RefId}, JobId: {response.Response.Id}");
```
