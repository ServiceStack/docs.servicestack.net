---
slug: messagepack-format
title: MsgPack Format
---

[Message Pack](http://msgpack.org/) is an efficient binary serialization format. It lets you exchange data among multiple languages like JSON but it's faster and smaller. 

If you ever wished to use JSON for convenience (e.g. storing an image with metadata) but could not for technical reasons (encoding, size, speed...), MessagePack offers a great replacement. Despite the name it ends up being a much [better "Binary JSON" than BSON is](http://stackoverflow.com/questions/6355497/performant-entity-serialization-bson-vs-messagepack-vs-json), as it's much faster, smaller and doesn't require the foreign types like "ObjectId", "UUID" that BSON has.

MsgPack is a great addition to your ServiceStack's web services as it has [similar performance to Protocol Buffers](http://theburningmonk.com/2012/02/performance-test-binary-serializers-part-iii/) (.NET's fastest binary serializer) but is also schema-less like JSON so already works with your Un-Attributed, **Clean POCOs** - no code-changes required. (as opposed to [Protobuf format](/protobuf-format) which requires decorating every serializable property with `[DataMember(Order=N)]`).

## Installing via NuGet

Message Pack is easily installed with the [ServiceStack.MsgPack](https://nuget.org/packages/ServiceStack.MsgPack) NuGet package:

::: nuget
`<PackageReference Include="ServiceStack.MsgPack" Version="6.*" />`
:::

After the NuGet Package is added to your Project, enable the MsgPack format in your `AppHost` with:

```cs
Plugins.Add(new MsgPackFormat());
```

The NuGet plugin also includes the **MsgPackServiceClient** client below so you can easily call it from any C# Client.

## Client Usage

Just like the rest of ServiceStack C# Clients, MsgPackServiceClient is interchangeable with the other clients that equally supports all your ServiceStack's services including the [New API Design](/api-design), e.g:

```csharp
var client = new MsgPackServiceClient(BaseUri);
List<Todo> all = client.Get(new Todos());           // Count = 0

var todo = client.Post(
    new Todo { Content = "New TODO", Order = 1 });  // todo.Id = 1
all = client.Get(new Todos());                      // Count = 1

todo.Content = "Updated TODO";
todo = client.Put(todo);                            // todo.Content = Updated TODO

client.Delete(new Todos(todo.Id));
all = client.Get(new Todos());   
```

More examples of using MsgPackServiceClient can be found in the [New APIs Integration Test Suite](https://github.com/ServiceStack/ServiceStack/blob/master/tests/RazorRockstars.Console.Files/ReqStarsService.cs).
