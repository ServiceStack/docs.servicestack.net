```csharp
using var fsAudio = File.OpenRead("files/test_audio.wav");
var response = client.PostFileWithRequest(new SpeechToText(),
    new UploadFile("test_audio.wav", fsAudio, "audio"));

// Two texts are returned
// The first is the timestamped text json with `start` and `end` timestamps
var textWithTimestamps = response.Results[0].Text;
// The second is the plain text
var textOnly = response.Results[1].Text;
```
