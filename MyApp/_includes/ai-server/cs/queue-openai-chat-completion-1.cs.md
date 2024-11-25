```csharp
var client = GetLocalApiClient(AiServerUrl);

var response = client.Post(new QueueOpenAiChatCompletion
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

// Poll for Job Completion Status
GetOpenAiChatStatusResponse status = new();
while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
{
    status = await client.GetAsync(new GetOpenAiChatStatus { RefId = response.RefId });
    await Task.Delay(1000);
}

var answer = status.Result.Choices[0].Message.Content;
```
