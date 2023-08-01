---
title: JSON Lines Data Format
---

<div class="not-prose my-8 flex justify-center">
   <a class="block max-w-2xl" href="https://jsonlines.org">
      <div class="block flex justify-center">
         <img class="py-8" src="/img/pages/release-notes/v6.10/jsonl.png">
      </div>
   </a>
</div>

[JSON Lines](https://jsonlines.org) is an efficient JSON data format parseable by streaming parsers and text processing tools
like Unix shell pipelines, whose streamable properties is making it a popular data format for maintaining large datasets
like the large AI datasets maintained on https://huggingface.co which is now accessible on [Auto HTML API](/auto-html-api) pages:

<div class="not-prose my-8 flex justify-center">
   <a class="block max-w-2xl" href="https://blazor-gallery.servicestack.net/albums">
      <div class="block flex justify-center shadow hover:shadow-lg rounded overflow-hidden">
         <img class="py-8" src="/img/pages/release-notes/v6.10/jsonl-format.png">
      </div>
   </a>
</div>

Which lists the `.jsonl` format like other data formats where it's accessible from `.jsonl` extension for `?format=jsonl` query string, e.g:

- https://blazor-gallery.servicestack.net/albums.jsonl
- https://blazor-gallery.servicestack.net/api/QueryAlbums?format=jsonl

### CSV Enumerable Behavior

The JSON Lines data format behaves the same way as the CSV format where if your Request DTO is annotated with either
`[DataContract]` or the more explicit `[Csv(CsvBehavior.FirstEnumerable)]` it will automatically serialize the
**first IEnumerable property**, where all [AutoQuery APIs](/autoquery/) and the Request DTO's below will return their
`IEnumerable` datasets in the streamable JSON Lines format:

```csharp
public class QueryPocos : QueryDb<Poco> {}

[Route("/pocos")]
public class Pocos : List<Poco>, IReturn<Pocos>
{
    public Pocos() {}
    public Pocos(IEnumerable<Poco> collection) : base(collection) {}
}

[Route("/pocos")]
[DataContract]
public class Pocos : IReturn<Pocos>
{
    [DataMember]
    public List<Poco> Items { get; set; }
}

[Route("/pocos")]
[Csv(CsvBehavior.FirstEnumerable)]
public class Pocos : IReturn<Pocos>
{
    public List<Poco> Items { get; set; }
}
```

### Async Streaming Parsing Example

The [HTTP Utils](/http-utils) extension methods makes it trivial to implement async streaming parsing where you can process
each row one at a time to avoid large allocations:

```csharp
const string BaseUrl = "https://blazor-gallery.servicestack.net";
var url = BaseUrl.CombineWith("albums.jsonl");
await using var stream = await url.GetStreamFromUrlAsync();
await foreach (var line in stream.ReadLinesAsync())
{
    var row = line.FromJson<Album>();
    //...
}
```

### JsonlSerializer

Alternatively if streaming the results isn't important it can be deserialized like any other format using the `JsonlSerializer` directly:

```csharp
var jsonl = await url.GetStringFromUrlAsync();
var albums = JsonlSerializer.DeserializeFromString<List<Album>>(jsonl);
```

Which can also serialize to a `string`, `Stream` or `TextWriter`:

```csharp
var jsonl = JsonlSerializer.SerializeToString(albums);
JsonlSerializer.SerializeToStream(albums, stream);
JsonlSerializer.SerializeToWriter(albums, textWriter);
```