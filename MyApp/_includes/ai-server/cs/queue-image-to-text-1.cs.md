```csharp
using var fsImage = File.OpenRead("files/test_image.jpg");
var response = client.PostFileWithRequest(new QueueImageToText(),
    new UploadFile("image", fsImage, "image"));

// Poll for Job Completion Status
GetTextGenerationStatusResponse status = new();
while (status.JobState is BackgroundJobState.Queued or BackgroundJobState.Started)
{
    status = client.Get(new GetTextGenerationStatus { JobId = response.JobId });
    Thread.Sleep(1000);
}
if (status.Results?.Count > 0)
{
    var answer = status.Results[0].Text;
}
```
