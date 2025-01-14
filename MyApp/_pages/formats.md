---
slug: formats
title: Content Types
---

ServiceStack supports the following formats:

- [JSON](json-format)
- [XML](https://docs.microsoft.com/en-us/dotnet/api/system.runtime.serialization.datacontractserializer)
- [CSV](/csv-format)
- [JSONL](/jsonl-format)
- [JSV](/jsv-format) (hybrid CSV-style escaping + JSON format that is optimized for both size and speed)
- [SOAP 1.1/1.2](/soap-support) (requires ASP.NET Framework)
- [Message Pack](/messagepack-format)
- [Protocol Buffers](/protobuf-format)
- HTML
    - [#Script Pages](https://sharpscript.net/docs/script-pages) (Simple, clean, fast alternative to Razor)
    - [Razor](https://razor.netcore.io) (Microsoft's Razor View Engine)
    - [Markdown Razor](/markdown-razor) (Razor-inspired syntax combined with markdown)
    - [HTML5 Report](/html5reportformat) (Human-friendly HTML auto-layout to quickly visualize data returned by services)

### .NET Service Clients

The different Content Types can be easily consumed using [ServiceStack's Typed Generic Service Clients](/csharp-client#httpwebrequest-service-clients).

## HTTP API Formats

ServiceStack Services supports a number of [Content Negotiation](/routing#content-negotiation) options where you can define which 
format should be returned by adding a `.{format}` extension to your `/route.{format}`. Built-in Formats include:

 - `.json`
 - `.xml`
 - `.jsv`
 - `.csv`
 - `.html`

Example: [http://web.web-templates.io/hello/World.json](http://web.web-templates.io/hello/World.json)

Or by appending `?format={format}` to the end of the URL:

- `?format=json`
- `?format=xml`
- `?format=jsv`
- `?format=csv`
- `?format=html`

Example: [http://web.web-templates.io/hello/World?format=json](http://web.web-templates.io/hello/World?format=json)

Alternatively ServiceStack also recognizes which format should be used with the `Accept` [http header](http://en.wikipedia.org/wiki/List_of_HTTP_header_fields):

- `Accept: application/json`
- `Accept: application/xml`

## Default Content-Type

The recommended way to request a specific content type is to add it to the Accept HTTP Request Header, e.g:

```
Accept: application/json
```

Alternatively you can specify to use a specific Content-Type as the default Content Type in your AppHost with:

```csharp
SetConfig(new HostConfig {
     DefaultContentType = MimeTypes.Json 
});
```

Sometimes when calling web services from a web browser they'll ask for `Accept: text/html` and not JSON which by contract ServiceStack obliges by returning back HTML if it is enabled.

To ensure JSON is always returned you can disable the HTML support with:

```csharp
SetConfig(new HostConfig {
    EnableFeatures = Feature.All.Remove(Feature.Html),
});
```

## Pre-defined Routes

    /[xml|json|html|jsv|csv]/[reply|oneway]/[servicename]

Examples:

 - /json/reply/Hello (JSON)
 - /xml/oneway/SendEmail (XML)

### Forcing a Content Type

Whilst ServiceStack Services are typically available on any endpoint and format, there are times when you only want adhoc Services available in a particular format, for instance you may only want the View Models for your dynamic Web Views available in HTML. This can now be easily enabled with the new `[HtmlOnly]` Request Filter Attribute, e.g:
    
```csharp
[HtmlOnly]
public class HtmlServices : Service
{
    public object Any(MyRequest request) => new MyViewModel { .. };
}
```

This feature is also available for other built-in Content Types: `[JsonOnly]`, `[XmlOnly]`, `[JsvOnly]` and `[CsvOnly]`.

## Registering a Custom Format

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

### XmlSerializerFormat Plugin

The `XmlSerializerFormat` plugin changes ServiceStack to serialize XML with .NET `XmlSerializer` instead of .NET XML 
`DataContractSerializer`:

```csharp
Plugins.Add(new XmlSerializerFormat());
```

The implementation provides a typical example of how to register or override different Content-Types in ServiceStack:

```csharp
public class XmlSerializerFormat : IPlugin
{
    public static void Serialize(IRequest req, object response, Stream stream)
    {
        var serializer = new XmlSerializer(response.GetType());
        serializer.Serialize(stream, response);
    }

    public static object Deserialize(Type type, Stream stream)
    {
        var serializer = new XmlSerializer(type.GetType());
        var obj = (Type) serializer.Deserialize(stream);
        return obj;
    }

    public void Register(IAppHost appHost)
    {
        appHost.ContentTypes.Register(MimeTypes.Xml, Serialize, Deserialize);
    }
}
```

## [SOAP Endpoint](/soap-support)

Consume ServiceStack Services via [SOAP](/soap-support) using WCF Add Service Reference or [ServiceStack generic SOAP Clients](/csharp-client#httpwebrequest-service-clients).

## [MQ Endpoint](/messaging)

Consume ServiceStack Services via [Message Queue](/messaging).
