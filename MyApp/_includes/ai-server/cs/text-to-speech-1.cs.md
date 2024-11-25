```csharp
using var fsAudio = File.OpenRead("files/test_audio.wav");
var response = client.PostFileWithRequest(new TextToSpeech {
        Input = "Hello, how are you?"
    },
    new UploadFile("test_audio.wav", fsAudio, "audio"));

response.Results[0].Url.DownloadFileTo(outputFileName);
```
