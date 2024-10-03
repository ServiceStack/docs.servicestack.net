```csharp
var request = new SpeechToText{};

var response = client.PostFilesWithRequest<GenerationResponse>(
    request,
    [new UploadFile("audio", File.OpenRead("audio.wav"), "audio.wav")]
);

// Two texts are returned
// The first is the timestamped text json with `start` and `end` timestamps
var textWithTimestamps = response.TextOutputs[0].Text;
// The second is the plain text
var textOnly = response.TextOutputs[1].Text;
```