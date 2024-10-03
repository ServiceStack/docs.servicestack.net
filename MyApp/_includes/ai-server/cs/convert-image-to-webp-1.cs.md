```csharp
var request = new ConvertImage()
{
    OutputFormat = "webp"
};

var response = client.PostFilesWithRequest<Stream>(
    request,
    [new UploadFile("image", File.OpenRead("image.jpg"), "image.jpg")]
);

File.WriteAllBytes("image.webp",response.ReadFully());
```