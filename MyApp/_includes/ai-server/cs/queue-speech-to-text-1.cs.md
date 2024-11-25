```csharp
using var fsAudio = File.OpenRead("files/test_audio.wav");
var response = client.PostFileWithRequest(new QueueSpeechToText(),
    new UploadFile("test_audio.wav", fsAudio, "audio"));

// Poll for Job Completion Status
GetTextGenerationStatusResponse status = new();
while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
{
    status = client.Get(new GetTextGenerationStatus { RefId = response.RefId });
    Thread.Sleep(1000);
}

var answer = status.Results[0].Text;
```
