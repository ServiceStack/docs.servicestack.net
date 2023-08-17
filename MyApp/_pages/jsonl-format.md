---
title: JSON Lines Data Format
---

<div class="not-prose my-8 flex justify-center">
   <a class="block max-w-2xl" href="https://jsonlines.org">
      <div class="block flex justify-center">
         <img class="py-8 h-80" src="/img/pages/release-notes/v6.10/jsonl.png">
      </div>
   </a>
</div>

<div class="py-8 max-w-7xl mx-auto">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="m0tAfjvJaZg" style="background-image: url('https://img.youtube.com/vi/m0tAfjvJaZg/maxresdefault.jpg')"></lite-youtube>
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

It's added by default, which can be removed with:

```csharp
Plugins.RemoveAll(x => x is JsonlFormat);
```

Which lists the `.jsonl` format like other data formats where it's accessible from `.jsonl` extension for `?format=jsonl` query string, e.g:

- https://blazor-gallery.servicestack.net/albums.jsonl
- https://blazor-gallery.servicestack.net/api/QueryAlbums?format=jsonl

In addition to the standard `Accept: text/jsonl` HTTP Header.

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

JSON Lines format is similar to the [CSV format](/csv-format) where each line in the file represents a separate JSON object. 
This makes it easy to process large datasets incrementally, without having to load the entire file into memory.

```json
{"id": 1, "name": "John Doe"}
{"id": 2, "name": "Jane Doe"}
{"id": 3, "name": "John Smith"}
```

These streamable properties in combination of the ubiquitous JSON format has led to its popularity where it can be processed by 
streaming parsers and text processing tools like Unix shell pipelines, making it an ideal format for handling large datasets efficiently, 
or quickly putting together a data pipeline for quick large scale experimentation.

For example, you can pull out the `title` property from a JSON Lines file using the following command line using just `curl` and `jq`:

:::sh
curl https://blazor-gallery.servicestack.net/albums.jsonl -s | jq '.title'
:::

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


## Indexing AI-Generated Art Albums with JSONL

In this example, we will walk you through a practical demonstration of using JSON Lines to index AI-generated art albums. We will fetch data 
from the Blazor Diffusion API, which provides "Creatives" generated based on user-provided text prompts. Our goal is to index the text and 
image URLs of these Creatives into a Typesense search server.

Here is the code snippet with a practical implementation of interacting with `creatives.jsonl` endpoint:

```csharp
const string ApiUrl = "https://localhost:5001/creatives.jsonl";

var provider = TypesenseUtils.InitProvider();
var typesenseClient = provider.GetRequiredService<ITypesenseClient>();
await typesenseClient.InitCollection();
var sw = new Stopwatch();
sw.Start();

var lastIndexedCreative = 0;

while (true)
{
    await using var stream = await ApiUrl.AddQueryParams(new() {
            ["IdGreaterThan"] = lastIndexedCreative,
            ["OrderBy"] = "Id",
        })
        .GetStreamFromUrlAsync();
    await foreach (var line in stream.ReadLinesAsync())
    {
        var creative = line.FromJson<Creative>();
        lastIndexedCreative = creative.Id;
        // processing
        if (creative.Artifacts.Count == 0)
            return;
        var imageId = creative.PrimaryArtifactId 
            ?? creative.CuratedArtifactId 
            ?? creative.Artifacts.First().Id;
        var artifact = creative.Artifacts.First(x => x.Id == imageId);
        var indexedCreative = new IndexedCreative
        {
            Text = creative.Prompt,
            Url = $"https://cdn.diffusion.works{artifact.FilePath}"
        };
        // Process and index the creative data
        await typesenseClient.CreateDocument("Creatives", indexedCreative);
    } 
    
    // sleep if no new data ..
}
```

Here we have the service client initialization with the `TypesenseUtils.InitProvider()`. Then, inside an infinite loop, we fetch data using `GetStreamFromUrlAsync()` and stream it line by line using the `ReadLinesAsync()` method. After processing each line, we index the creative item into typesense.

## Indexing Creative Data into Typesense

With Typesense, implementation of full-text search for our data can be achieved efficiently. Once we have fetched the Creative data from Blazor Diffusion's API, we can proceed to index it into Typesense for easy searching and analysis of the indexed documents. To index the Creative data, we're using [a C# client library built by the community](https://github.com/DAXGRID/typesense-dotnet).

Processed data are saved into IndexedCreative instances and are added into the Typesense server. Under the hood, the C# client library interacts with Typesense's API and handles all HTTP requests and responses for us.

### Memory Foot Print

Our application logs the memory usage over time, and we see it’s constant relative to the size of our process. Streamed JSONL parsing and async indexing allows us processing infinite datasets size without hitting the memory bounds.

## Skipping Already Indexed Data Example

For increased efficiency, instead of re-indexing all the data each time our program runs, we will only fetch and index data that hasn't been indexed already. We use `lastIndexedCreative` integer variable to keep track of the last creative indexed. On subsequent runs of our program, we fetch only new data by modifying the API URL to fetch Creative objects starting from the ID greater than `lastIndexedCreative`.

This is done by appending the `IdGreaterThan` query parameter to our AutoQuery endpoint.

```csharp
await using var stream = await ApiUrl.AddQueryParams(new() {
        ["IdGreaterThan"] = lastIndexedCreative,
        ["OrderBy"] = "Id",
    }).GetStreamFromUrlAsync();
```

## Visualizing Indexed Documents with Typesense Dashboard

Another great community feature is the [Typesense dashboard project](https://github.com/bfritscher/typesense-dashboard), providing a user-friendly interface to manage and browse collections in a Typesense search server. The dashboard, which can be accessed via the browser or as a downloadable desktop app, provides real-time statistics and overview over the indexed collections.

The indexed creative data can now be explored and analyzed using the dashboard's intuitive interface. You can apply filters, perform searches, and manipulate the stored data through the user interface.

## Conclusion

The JSON lines format is a versatile and efficient standard for working with large datasets. Its streamable properties make it particularly useful for handling big data and its ease of use makes it an ideal choice for developers working in any client language.

Streaming data directly to and from HTTP APIs — a major power of the JSON lines format — can dramatically improve the performance of data-intensive applications. Furthermore, ServiceStack's new JSON Lines support makes it straight forward serve and consume these streams.