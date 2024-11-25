```csharp
var client = GetLocalApiClient(AiServerUrl);
client.BearerToken = Environment.GetEnvironmentVariable("AI_SERVER_API_KEY");

var api = await client.ApiAsync(new QueueOpenAiChatCompletion
{
    Request = new()
    {
        Model = "gpt-4-turbo",
        Messages =
        [
            new() { Role = "system", Content = "You are a helpful AI assistant." },
            new() { Role = "user", Content = "How do LLMs work?" }
        ],
        MaxTokens = 50
    },
});
api.ThrowIfError();
// Response only returns the related job information
Console.WriteLine($"RefId: {api.Response.RefId}, JobId: {api.Response.Id}");
```
