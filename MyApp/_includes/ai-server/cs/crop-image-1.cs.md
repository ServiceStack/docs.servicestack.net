```csharp
var request = new CropImage()
{
    X = 120,
    Y = 120,
    Width = 720,
    Height = 720
};

// Returns the cropped image directly as a Stream
var response = client.PostFilesWithRequest<Stream>(
    request,
    [new UploadFile("image", File.OpenRead("image.jpg"), "image.jpg")]
);

File.WriteAllBytes("result.jpg",response.ReadFully());
```