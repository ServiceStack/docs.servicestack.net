```csharp
using var fsAudio = File.OpenRead("files/test_audio.wav");
var response = client.PostFileWithRequest(new QueueTextToSpeech {
        Text = "Hello, how are you?"
    },
    new UploadFile("test_audio.wav", fsAudio, "audio"));

GetArtifactGenerationStatusResponse status = new();
while (status.JobState is BackgroundJobState.Started or BackgroundJobState.Queued)
{
    status = client.Get(new GetArtifactGenerationStatus { RefId = response.RefId });
    Thread.Sleep(1000);
}

// Download the watermarked image
File.WriteAllBytes(saveToPath, status.Results[0].Url.GetBytesFromUrl());
```
