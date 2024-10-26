```csharp
var response = client.PostFilesWithRequest(new QueueSpeechToText()
    [new UploadFile("test_audio.wav", File.OpenRead("files/test_audio.wav"), "audio")]
);
```
