---
slug: csv-format
title: CSV Format
---

The [CSV format](http://en.wikipedia.org/wiki/Comma-separated_values) is a first-class supported format which means all your existing web services can automatically take accept and return CSV without any config or code changes. 

### Importance of CSV

CSV is an important format for transferring, migrating and quickly visualizing data as all spreadsheets support viewing and editing CSV files directly whilst its supported by most RDBMS support exporting and importing data. Compared with other serialization formats, it provides a compact and efficient way to transfer large datasets in an easy to read text format.

### Speed

The CSV Serializer used was developed using the same tech that makes [ServiceStack's JSV and JSON serializers fast](http://www.servicestack.net/benchmarks/NorthwindDatabaseRowsSerialization.100000-times.2010-08-17.html) (i.e. no run-time reflection, static delegate caching, etc), which should make it the fastest CSV serializer available for .NET.

### Downloadable Separately

The `CsvSerializer` is maintained in the [ServiceStack.Text](https://github.com/ServiceStack/ServiceStack.Text) project which can be downloaded from NuGet at:

::: nuget
`<PackageReference Include="ServiceStack.Text" Version="6.*" />`
:::

### How to register your own custom format with ServiceStack

Registering a custom format is done by registering the Format's Content-Type with to your AppHost's `ContentTypes` API, e.g:

```csharp
//Register the 'text/csv' content-type format
//Note: Format is inferred from the last part of the content-type, e.g. 'csv'

public class CsvFormat : IPlugin
{
    public void Register(IAppHost appHost)
    {
        appHost.ContentTypes.Register(MimeTypes.Csv,
            SerializeToStream, 
            CsvSerializer.DeserializeFromStream);

        //ResponseFilter to add 'Content-Disposition' header for browsers to open in Spreadsheet
        appHost.GlobalResponseFilters.Add((req, res, dto) => {
            if (req.ResponseContentType == MimeTypes.Csv) {
                var fileName = req.OperationName + ".csv";
                res.AddHeader(HttpHeaders.ContentDisposition, 
                    $"attachment;{HttpExt.GetDispositionFileName(fileName)}");
            }
        });
    }

    void SerializeToStream(IRequest req, object request, Stream stream) =>
        CsvSerializer.SerializeToStream(request, stream);
}
```

We recommend encapsulating Custom Formats registrations into a [Plugin](/plugins) as done with the built-in 
[CsvFormat](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Formats/CsvFormat.cs) which is added by default:

```csharp
Plugins.Add(new CsvFormat()); //added by default
```

Which makes it easy to register, detect and remove. E.g. to remove built-in support for CSV you can just remove it from the `Plugins` collection:

```csharp
Plugins.RemoveAll(x => x is CsvFormat);
```

The ability to automatically to register another format and provide immediate value and added functionality to all your existing web services (without any code-changes or configuration) we believe is a testament to ServiceStack's clean design of using strongly-typed 'message-based' DTOs to let you develop clean, testable and re-usable web services. No code-gen or marshalling is required to bind to an abstract method signature, every request and calling convention maps naturally to your Web Services DTOs.

## Usage

The CSV format is effectively a first-class supported format so everything should work as expected, including being registered as an available format on ServiceStack's metadata index page:

* [/metadata](https://northwind.netcore.io/metadata)

And being able to preview the output of a service:

* [/csv/metadata?op=CustomerDetails](https://northwind.netcore.io/csv/metadata?op=CustomerDetails)

By default they are automatically available using ServiceStack's standard calling conventions, e.g:

* [/csv/reply/Customers](https://northwind.netcore.io/csv/reply/Customers)
    
### REST Usage

CSV also works just as you would expect with user-defined REST-ful urls, i.e. you can append `?format=csv` to specify the format in the url e.g:

* [/customers?format=csv](https://northwind.netcore.io/customers?format=csv)

This is how the above web service output looks when opened up in [google docs](https://spreadsheets.google.com/pub?key=0AjnFdBrbn8_fdDBwX0Rha04wSTNWZDZlQXctcmp2bVE&hl=en_GB&output=html)


Alternative in following with the HTTP specification you can also specify content-type `"text/csv"` in the *Accept* header of your HttpClient as done in [HTTP Utils](/http-utils) extension methods:

```csharp
var csv = "http://nortwind.netcore.io/customers".GetCsvFromUrl();
```

## CSV Deserialization Support

The introduction of the new [AutoQuery Data](/autoquery/data) feature and it's `MemorySource` has made full CSV support
a lot more appealing which caused CSV Deserialization support where it's implementation is now complete. This now unlocks the ability to create fully-queryable Services over flat-file .csv's (or Excel spreadsheets exported to .csv) by just deserializing CSV into a List of POCO's and registering it with AutoQuery Data:

```csharp
var pocos = File.ReadAllText("path/to/data.csv").FromCsv<List<Poco>>();

//AutoQuery Data Plugin
Plugins.Add(new AutoQueryDataFeature()
    .AddDataSource(ctx => ctx.MemorySource(pocos)));

// AutoQuery DTO
[Route("/pocos")]
public class QueryPocos : QueryData<Poco> {}
```

### Super CSV Format

A noteworthy feature that sets ServiceStack's CSV support apart is that it's built on the compact and very fast
[JSV format](/jsv-format) which not only can 
deserialize a tabular flat file of scalar values at high-speed, it also supports deeply nested object graphs
which are encoded in JSV and escaped in a CSV field as normal. An example of this can be seen in a HTTP 
sample log fragment below where the HTTP Request Headers are a serialized from a `Dictionary<string,string>`:

```csv
Id,HttpMethod,AbsoluteUri,Headers
1,GET,http://localhost:55799,"{Connection:keep-alive,Accept:""text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"",Accept-Encoding:""gzip, deflate, sdch"",Accept-Language:""en-US,en;q=0.8"",Host:""localhost:55799"",User-Agent:""Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36"",Upgrade-Insecure-Requests:1}"
```

Being such a versatile file format opens up a lot of new possibilities, e.g. instead of capturing seed data
in code you could maintain them in plain-text .csv files and effortlessly load them on App Startup, e.g:

```csharp
using (var db = container.Resolve<IDbConnectionFactory>().Open())
{
    if (db.CreateTableIfNotExists<Country>()) //returns true if Table created
    {
        List<Country> countries = "~/App_Data/countries.csv".MapHostAbsolutePath()
            .ReadAllText().FromCsv<List<Country>>();
    
        db.InsertAll(countries);
    }
}
```

### All Services now accept CSV Content-Types

Another immediate benefit of CSV Deserialization is that now all Services can now process the CSV Content-Type. 
Being a tabular data format, CSV shines when it's processing a list of DTO's, one way to do that in 
ServiceStack is to have your Request DTO inherit `List<T>`:

```csharp
[Route("/pocos")]
public class Pocos : List<Poco>, IReturn<Pocos>
{
    public Pocos() {}
    public Pocos(IEnumerable<Poco> collection) : base(collection) {}
}
```

It also behaves the same way as CSV Serialization but in reverse where if your Request DTO is annotated 
with either `[DataContract]` or the more explicit `[Csv(CsvBehavior.FirstEnumerable)]` it will automatically 
deserialize the CSV into the first `IEnumerable` property, so these 2 Request DTO's are equivalent to above:

```csharp
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

In addition to the above flexible options for defining CSV-friendly Services, there's also a few different 
options for sending CSV Requests to the above Services. You can use the CSV `PostCsvToUrl()` extension 
methods added to [HTTP Utils](/http-utils):

```csharp
string csvText = File.ReadAllText("pocos.csv");

//Send CSV Text
List<Poco> response = "http://example.org/pocos"
    .PostCsvToUrl(csvText)
    .FromCsv<List<Poco>>();
    
//Send POCO DTO's
List<Poco> dtos = csvText.FromCsv<List<Poco>>();
List<Poco> response = "http://example.org/pocos"
    .PostCsvToUrl(dtos)
    .FromCsv<List<Poco>>();    
```

Alternatively you can use the `CsvServiceClient` which has the nice Typed API's you'd expect from a 
Service Client:

```csharp
var client = new CsvServiceClient(baseUrl);

Pocos response = client.Post(new Pocos(dtos));
```

### Ideal for Auto Batched Requests

The `CsvServiceClient` by virtue of being configured to use a well-defined Tabular data format is perfect 
for sending 
[Auto-Batched Requests](/auto-batched-requests) 
which by definition send a batch of POCO's making the CSV format the most compact text format to send them with:

```csharp
var requests = new[]
{
    new Request { ... },
    new Request { ... },
    new Request { ... },
};

var responses = client.SendAll(requests);
```

## Limitations

As most readers familiar with the CSV format will know there are some inherent limitations with CSV-format namely it is a flat-structured tabular data format that really only supports serialization of a single resultset. 

This limitation remains, although if you decorate your Response DTO with a `[Csv(CsvBehavior.FirstEnumerable)]` or standard .NET `[DataContract]/[DataMember]` attributes the CSV Serializer will change to use the following conventions: 

* If you only return one result in your DTO it will serialize that.
* If you return multiple results it will pick the first IEnumerable<> property or if it doesn't exist picks the first property.
* Non-enumerable results are treated like a single row.

Basically if you only return 1 result it should work as expected otherwise it will chose the best candidate based on the rules above.

The second major limitation is that it doesn't yet include a CSV Deserializer (currently on the TODO list), so while you can view the results in CSV format you can't post data to your web service in CSV and have it automatically deserialize for you. You can however still upload a CSV file and parse it manually yourself.

# Features

Unlike most CSV serializers that can only serialize rows of primitive values, the CsvSerializer uses the [JSV format](/jsv-format) under the hood so even [complex types](https://spreadsheets.google.com/pub?key=0AjnFdBrbn8_fdG83eWdGM1lnVW9PMlplcmVDYWtXeVE&hl=en_GB&output=html) will be serialized in fields in a easy to read format - no matter how deep its hierarchy.
