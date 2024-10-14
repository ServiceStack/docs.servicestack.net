```csharp
var request = new SpeechToText{};

var response = client.PostFilesWithRequest<GenerationResponse>(
    request,
    [new UploadFile("test_audio.wav", File.OpenRead("files/test_audio.wav"), "audio")]
);

// Two texts are returned
// The first is the timestamped text json with `start` and `end` timestamps
var textWithTimestamps = response.TextOutputs[0].Text;
// The second is the plain text
var textOnly = response.TextOutputs[1].Text;
```
