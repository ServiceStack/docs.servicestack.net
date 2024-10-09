```csharp
        var request = new QueueImageUpscale() { };

        var response = client.PostFilesWithRequest<QueueGenerationResponse>(
            request,
            [new UploadFile("image", File.OpenRead("files/test_image.jpg"), "image")]
        );
```
