```csharp
using var fsAudio = File.OpenRead("files/test_audio.wav");
var response = client.PostFileWithRequest(new QueueSpeechToText(),
    new UploadFile("test_audio.wav", fsAudio, "audio"));
```
