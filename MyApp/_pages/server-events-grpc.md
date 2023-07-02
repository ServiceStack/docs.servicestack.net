---
title: gRPC Server Events
slug: server-events-grpc
---

## Server Stream gRPC Services

In addition to standard Services which gRPC Refers to as **Unary RPC**, i.e. where clients sends a single request to the server and 
gets a single response back. Another very useful communication style supported by gRPC is **Server streaming**:

::: info
the client sends a request to the server and gets a stream to read a sequence of messages back. The client reads from the returned stream 
until there are no more messages. gRPC guarantees message ordering within an individual RPC call
:::

### StreamServerEvents

This communication channel is especially useful in [Server Events](/server-events) which operates in a similar style with clients connecting to 
a long-lived HTTP connection that streams back "real-time Events" over the light and efficient 
[SSE](https://www.html5rocks.com/en/tutorials/eventsource/basics/) standard natively supported in modern browsers.

Although as HTTP Requests are not normally used for maintaining long-lived connections they're susceptible to issues like buffering 
from App Servers, middleware and proxies and require implementing a bespoke health-check and auto-reconnect solution in order to maintain
interrupted service.

As a first class supported communication channel clients can instead leverage gRPC's library infrastructure which is perfectly suited for
streaming real-time Server Events over an efficient persistent HTTP/2 channel that's available from the `StreamServerEvents` gRPC Service:

```proto
rpc ServerStreamServerEvents(StreamServerEvents) returns (stream StreamServerEventsResponse) {}
```

Which gives all `protoc` supported languages a Typed Client for consuming your [Server Events](/server-events).

### GrpcServiceClient Streams

When using the generic `GrpcServiceClient` you're able to take advantage of C#'s 8 new `await foreach` syntax sugar for consuming gRPC Server Streams.

Its usage is analogous to all Server Events clients where your initial connection contains the channels you want to subscribe to receive notifications
from, e.g:

```csharp
var stream = client.StreamAsync(new StreamServerEvents {
    Channels = new[] { "todos" }
});
```

Then you can use `await foreach` to consume an endless stream of Server Events. Use `Selector` to identify the type of Server Event
whilst the complex-type body of each event message can be parsed from its JSON body, e.g:

```csharp
await foreach (var msg in stream)
{
    if (msg.Selector.StartsWith("todos.")) //custom todos.* events
    {
        var obj = JSON.parse(msg.Json); //body of message in JSON
        if (obj is Dictionary<string, object> map)
        {
            //todos.create + todos.update properties
            var id = map["id"];
            var title = map["title"];
            $"EVENT {msg.Selector} [{msg.Channel}]: #{id} {title}".Print(); 
        }
        else
        {
            //todos.delete id
            $"EVENT {msg.Selector} [{msg.Channel}]: {obj}".Print();
        }
    }
    else
    {
        // general server events, e.g cmd.onConnect, cmd.onJoin, cmd.onLeave
        $"EVENT {msg.Selector} [{msg.Channel}]: #{msg.UserId} {msg.DisplayName}".Print();
    }
}
```

If connected whilst running the [TodoWorld CRUD Example](https://todoworld.servicestack.net/#user-content-c-local-development-grpc-ssl-crud-example)
this stream will output something similar to:

```
EVENT cmd.onConnect []: #-1 user1
EVENT cmd.onJoin [todos]: #-1 user1
EVENT todos.create [todos]: #1 ServiceStack
EVENT todos.update [todos]: #1 gRPC
EVENT todos.delete [todos]: 1
```

### protoc Dart Streams

Other `protoc` languages will require using their own language constructs for consuming gRPC Streams,
here's the [example for Dart](https://todoworld.servicestack.net/#dart) that also has a pleasant API for consuming Server Streams:

```dart
var stream = client.serverStreamServerEvents(StreamServerEvents()..channels.add('todos'));
await for (var r in stream) {
    var obj = jsonDecode(r.json);
    if (r.selector.startsWith('todos')) {
        if (obj is Map) {
            print('EVENT ${r.selector} [${r.channel}]: #${obj['id']} ${obj['title']}');
        } else {
            print('EVENT ${r.selector} [${r.channel}]: ${obj}');
        }
    } else {
        print('EVENT ${r.selector} ${r.channels}: #${obj['userId']} ${obj['displayName']}');
    }
}
```
