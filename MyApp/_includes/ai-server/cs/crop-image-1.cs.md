```csharp
var client = CreateClient(); // JsonApiClient

using var imageStream = File.OpenRead("files/comfyui_upload_test.png");
var response = client.PostFilesWithRequest<MediaTransformResponse>(new CropImage
{
    X = 10,
    Y = 10,
    Width = 100,
    Height = 100
}, [
    new UploadFile("image.png", imageStream) { FieldName = "image" }
]);

var croppedImageUrl = response.Outputs[0].Url;
croppedImageUrl.DownloadFileTo("files/comfyui_upload_test_cropped.png");
```