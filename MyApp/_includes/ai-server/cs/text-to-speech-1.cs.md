```csharp
var response = client.PostFilesWithRequest(new TextToSpeech {
        Input = "Hello, how are you?"
    },
    [new UploadFile("test_audio.wav", File.OpenRead("files/test_audio.wav"), "audio")]
);
response.Outputs[0].Url.DownloadFileTo(outputFileName);
```
