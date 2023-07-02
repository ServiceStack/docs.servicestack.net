---
slug: adhoc-utils
title: Adhoc Utils
---

## Image Utils

The `Image.ResizeToPng()` and `Image.CropToPng()` [extension methods](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/ImageExtensions.cs) 
can be used to resize and crop `System.Drawing` Images, e.g:

```csharp
[AddHeader(ContentType = "image/png")]
public Stream Get(Resize request)
{
    var imageFile = VirtualFiles.GetFile(request.Path);
    if (imageFile == null)
        throw HttpError.NotFound(request.Path + " was not found");

    using (var stream = imageFile.OpenRead())
    using (var img = Image.FromStream(stream))
    {
        return img.ResizeToPng(request.Width, request.Height);
    }
}

[AddHeader(ContentType = "image/png")]
public Stream Get(Crop request)
{
    var imageFile = VirtualFiles.GetFile(request.Path);
    if (imageFile == null)
        throw HttpError.NotFound(request.Path + " was not found");

    using (var stream = imageFile.OpenRead())
    using (var img = Image.FromStream(stream))
    {
        return img.CropToPng(request.Width, request.Height, request.StartX, request.StartY);
    }
}
```

## Enum Utils

The `EnumUtils.GetValues()`, `IEnumerable<Enum>.ToKeyValuePairs()` and `Enum.ToDescription()` extension methods
makes it easy to create data sources from Enums that can be annotated with `[ApiMember]` and `[Description]` attributes:

```csharp
List<KeyValuePair<string, string>> Titles => EnumUtils.GetValues<Title>()
    .Where(x => x != Title.Unspecified)
    .ToKeyValuePairs();

List<string> FilmGenres => EnumUtils.GetValues<FilmGenres>()
    .Map(x => x.ToDescription());
```
