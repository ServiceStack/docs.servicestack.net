```csharp
        var request = new TextToSpeech
        {
            Text = "Hello, how are you?"
        };
        
        var response = client.PostFilesWithRequest<GenerationResponse>(
            request,
            [new UploadFile("test_audio.wav", File.OpenRead("files/test_audio.wav"), "audio")]
        );
        response.Outputs[0].Url.DownloadFileTo("hello.mp3");
```
