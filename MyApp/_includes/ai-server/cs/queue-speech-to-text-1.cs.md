```csharp
var request = new QueueSpeechToText{};

var response = client.PostFilesWithRequest<QueueGenerationResponse>(
    request,
    [new UploadFile("test_audio.wav", File.OpenRead("files/test_audio.wav"), "audio")]
);
```
