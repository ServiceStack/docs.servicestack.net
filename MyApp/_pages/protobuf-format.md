---
slug: protobuf-format
title: ProtoBuf Format
---

[Protocol Buffers](http://code.google.com/p/protobuf/) is a high-performance, compact binary wire format invented by Google who use it internally so they can communicate with their internal network services at very high speed.

For .NET [@marcgravell](http://twitter.com/marcgravell) has developed **[protobuf-net](http://code.google.com/p/protobuf-net/)** - a robust implementation of the Protocol Buffers wire format that provides the [fastest serialization](http://www.servicestack.net/benchmarks/#northwind-serializer) option available for .NET.

ProtoBuf is a great addition to your ServiceStack's web services as it provides the **fastest binary serializer** to go along with the **2 fastest text serializers** for .NET in [JSON](http://www.servicestack.net/mythz_blog/?p=344) and [JSV](http://www.servicestack.net/mythz_blog/?p=176) formats (already included by default). 

Otherwise another fast binary serializer that supports attribute-less POCOs is the new [MessagePack Format](/messagepack-format).

## Installing via NuGet

As it requires an external **protobuf-net.dll** dependency ProtoBuf support is not automatically bundled inside ServiceStack, but it is easily installed with the [ServiceStack.ProtoBuf](https://nuget.org/packages/ServiceStack.ProtoBuf) NuGet package:

:::copy
`<PackageReference Include="ServiceStack.ProtoBuf" Version="8.*" />`
:::

After the NuGet Package is added to your Project, enable the ProtoBuf format in your `AppHost` with:

```cs
Plugins.Add(new ProtoBufFormat());
```

The NuGet plugin also includes the **ProtoBufServiceClient** client below so you can easily call it from any C# Client.

## Registering ProtoBuf Manually

The API for adding custom Formats and Content Types in ServiceStack is so easy we use it ourselves :) Where the CSV, HTML, Markdown and now ProtoBuf format are all registered in the same way by registering the new ContentType with your AppHost's **ContentTypeFilters**.

Adding support for ProtoBuf is equally simple.  It can be added by calling a single method:

```csharp
appHost.ContentTypeFilters.Register(ContentType.ProtoBuf,
    (reqCtx, res, stream) => ProtoBuf.Serializer.NonGeneric.Serialize(stream, res),
    ProtoBuf.Serializer.NonGeneric.Deserialize);
```

This makes the ProtoBuf format available in all of ServiceStack:

  - A new **X-PROTOBUF** column added for all services on the metadata pages
  - New `/x-protobuf/syncreply/{Service}` and `/x-protobuf/asynconeway/{Service}` pre-defined routes
  - Clients can request it with `Accept: application/x-protobuf` HTTP Header or **?format=x-protobuf** query string

## End to End happiness

However simply registering ProtoBuf is not enough to ensure end-to-end happiness so we also make it easy to create your own generic strong-typed ProtoBuf ServiceClient with the following code:

```csharp
public class ProtoBufServiceClient : ServiceClientBase
{
    public override string Format
    {
        get { return "x-protobuf"; }
    }

    public ProtoBufServiceClient(string baseUri)
    {
        SetBaseUri(baseUri);
    }

    public ProtoBufServiceClient(string syncReplyBaseUri, string asyncOneWayBaseUri)
        : base(syncReplyBaseUri, asyncOneWayBaseUri) { }

    public override void SerializeToStream(IRequest req, object request, Stream stream)
    {
        Serializer.NonGeneric.Serialize(stream, request);
    }

    public override T DeserializeFromStream<T>(Stream stream)
    {
        return Serializer.Deserialize<T>(stream);
    }

    public override string ContentType
    {
        get { return MimeTypes.ProtoBuf; }
    }

    public override StreamDeserializerDelegate StreamDeserializer
    {
        get { return Deserialize; }
    }

    private static object Deserialize(Type type, Stream source)
    {
        return Serializer.NonGeneric.Deserialize(type, source);
    }
}
```

This now lets you call each of your services with a Strong Typed service client of your very own:

```csharp
var client = new ProtoBufServiceClient(BaseUri);
var response = client.Send<HelloResponse>(new Hello { Name = "ProtoBuf" });
```

The above ProtoBufServiceClient works like all the other strong-typed ServiceClients in ServiceStack where it also implements `IServiceClient` and `IRestClient` interfaces so you can easily swap out your existing clients to take advantage of the performance boost offered by ProtoBuf with minimal effort!


# Community Resources

  - [REST with ProtoBuf - Web Services in 5 easy steps](http://stevenhollidge.blogspot.com/2012/04/servicestack-rest-with-protobuf.html) by [@stevenhollidge](https://twitter.com/stevenhollidge)
