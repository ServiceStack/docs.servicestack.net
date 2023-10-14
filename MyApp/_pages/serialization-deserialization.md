---
slug: serialization-deserialization
title: Serialization and Deserialization
---

### Passing complex objects in the Query String

ServiceStack uses the [JSV-Format](/jsv-format) (JSON without quotes) to parse QueryStrings.

JSV lets you embed deep object graphs in QueryString as seen [this example url](https://test.servicestack.net/json/reply/StoreLogs?Loggers=%5B%7BId:786,Devices:%5B%7BId:5955,Type:Panel,TimeStamp:1199303309,Channels:%5B%7BName:Temperature,Value:58%7D,%7BName:Status,Value:On%7D%5D%7D,%7BId:5956,Type:Tank,TimeStamp:1199303309,Channels:%5B%7BName:Volume,Value:10035%7D,%7BName:Status,Value:Full%7D%5D%7D%5D%7D%5D):

```
https://test.servicestack.net/json/reply/StoreLogs?Loggers=[{Id:786,Devices:[{Id:5955,Type:Panel,
Channels:[{Name:Temperature,Value:58},{Name:Status,Value:On}]},
{Id:5956,Type:Tank,TimeStamp:1199303309,
Channels:[{Name:Volume,Value:10035},{Name:Status,Value:Full}]}]}]
```

If you want to change the default binding ServiceStack uses, you can register your own **Custom Request Binder**.

## Custom Media Types

ServiceStack serializes and deserializes your DTOs automatically. If you want to override the default serializers or you want to add a new format, you have to register your own `Content-Type`:

### Register a custom format

```csharp
string contentType = "application/yourformat"; //To override JSON eg, write "application/json"
var serialize = (IRequest req, object response, Stream stream) => ...;
var deserialize = (Type type, Stream stream) => ...;

//In AppHost Configure method
//Pass two delegates for serialization and deserialization
this.ContentTypes.Register(contentType, serialize, deserialize);	
```

### Encapsulate inside a plugin

If you're looking to standardize on a custom implementation, it's recommended to wrap the registration inside a plugin.

E.g. here's how you can change ServiceStack to use .NET's `XmlSerializer` instead of its `DataContractSerializer` default:

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

Where it can then be easily registered as a regular [plugin](/plugins):

```csharp
Plugins.Add(new XmlSerializerFormat());
```

### Other ContentType Examples

The [Protobuf-format](/protobuf-format) shows an example of registering a new format whilst the [Northwind VCard Format](https://northwind.netcore.io/vcard-format.htm) shows an example of creating a custom media type in ServiceStack.

For reference see registration examples of ServiceStack's different Formats:

 - [CSV](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Formats/CsvFormat.cs)
 - [MsgPack](https://github.com/ServiceStack/ServiceStack/blob/6e584877125fa0750db10700a6f1a271a7ef918a/src/ServiceStack.MsgPack/MsgPackFormat.cs#L67)
 - [Protobuf](https://github.com/ServiceStack/ServiceStack/blob/6e584877125fa0750db10700a6f1a271a7ef918a/src/ServiceStack.ProtoBuf/ProtoBufFormat.cs#L12)
 - [Wire](https://github.com/ServiceStack/ServiceStack/blob/6e584877125fa0750db10700a6f1a271a7ef918a/src/ServiceStack.Wire/WireServiceClient.cs#L64)
 - [SOAP](https://github.com/ServiceStack/ServiceStack/blob/6e584877125fa0750db10700a6f1a271a7ef918a/src/ServiceStack/Formats/SoapFormat.cs#L29)

#### Async ContentTypes Formats

The async registration APIs are for Content-Type Formats which perform Async I/O, most serialization formats don't except for HTML View Engines which can perform Async I/O when rendering views, which are all registered using the `RegisterAsync` APIs:

```csharp
appHost.ContentTypes.RegisterAsync(MimeTypes.Html, SerializeToStreamAsync, null);
appHost.ContentTypes.RegisterAsync(MimeTypes.JsonReport, SerializeToStreamAsync, null);
appHost.ContentTypes.RegisterAsync(MimeTypes.MarkdownText, SerializeToStreamAsync, null);
```

## Reading in and De-Serializing ad-hoc custom requests

There are 2 ways to deserialize your own custom format, via attaching a custom request binder for a particular service or marking your service with `IRequiresRequestStream` which will skip auto-deserialization and inject the ASP.NET Request stream instead.

### Create a custom request dto binder

You can register custom binders in your AppHost by using the example below:

```cs
appHost.RegisterRequestBinder<MyRequest>(httpReq => ... requestDto);      // or:
appHost.RequestBinders.Add(typeof(MyRequest), httpReq => ... requestDto);
```

This gives you access to the IHttpRequest object letting you parse it manually so you can construct and return the strong-typed Request DTO manually which will be passed to the service instead.

### Uploading Files

You can access uploaded files independently of the Request DTO using `Request.Files`. e.g:

```csharp
public object Post(MyFileUpload request)
{
    if (this.Request.Files.Length > 0)
    {
        var uploadedFile = base.Request.Files[0];
        uploadedFile.SaveTo(MyUploadsDirPath.CombineWith(file.FileName));
    }
    return HttpResult.Redirect("/");
}
```

ServiceStack's [imgur.netcore.io](https://imgur.netcore.io) example shows how to access the [byte stream of multiple uploaded files](https://github.com/ServiceStackApps/Imgur/blob/master/src/Imgur/Global.asax.cs#L62), e.g:

```csharp
public object Post(Upload request)
{
    foreach (var uploadedFile in base.Request.Files
       .Where(uploadedFile => uploadedFile.ContentLength > 0))
    {
        using (var ms = new MemoryStream())
        {
            uploadedFile.WriteTo(ms);
            WriteImage(ms);
        }
    }
    return HttpResult.Redirect("/");
}
```

### Reading directly from the Request Stream

Instead of registering a custom binder you can skip the serialization of the Request DTO, you can add the [IRequiresRequestStream](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Web/IRequiresRequestStream.cs) interface to directly retrieve the stream without populating the Request DTO.

```csharp
//Request DTO
public class RawBytes : IRequiresRequestStream
{
    /// <summary>
    /// The raw Http Request Input Stream
    /// </summary>
    Stream RequestStream { get; set; }
}
```

Which tells ServiceStack to skip trying to deserialize the request so you can read in the raw HTTP Request body yourself, e.g:

```csharp
public async Task<object> PostAsync(RawBytes request)
{
    byte[] bytes = await request.RequestStream.ReadFullyAsync();
    string text = bytes.FromUtf8Bytes(); //if text was sent
}
```

### Buffering the Request and Response Streams

ServiceStack's Request and Response stream are non-buffered (i.e. forward-only) by default. This can be changed at runtime using a `PreRequestFilters` to allow the Request Body and Response Output stream to be re-read multiple times should your Services need it:

```csharp
appHost.PreRequestFilters.Add((httpReq, httpRes) => {
    httpReq.UseBufferedStream = true;  // Buffer Request Input
    httpRes.UseBufferedStream = true;  // Buffer Response Output
});
```

Which you'll then be able to re-read the Request Input Stream with:

```csharp
string textBody = await httpReq.GetRawBodyAsync(); //read as string

ReadOnlySpan<byte> bytes = ((MemoryStream)httpReq.InputStream).GetBufferAsSpan(); //read as bytes
```

### Raw SOAP Message

You can access raw WCF Message when accessed with the SOAP endpoints in your Service with `IHttpRequest.GetSoapMessage()` extension method, e.g:

```csharp
Message requestMsg = base.Request.GetSoapMessage();
```

To tell ServiceStack to skip Deserializing the SOAP request entirely, add the `IRequiresSoapMessage` interface to your Request DTO, e.g:

```csharp
public class RawWcfMessage : IRequiresSoapMessage {
    public Message Message { get; set; }
}

public object Post(RawWcfMessage request) { 
    request.Message... //Raw WCF SOAP Message
}
```
