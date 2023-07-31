---
slug: rabbit-mq
title: Rabbit MQ
---

A nice advantage of ServiceStack's message-based design is its ability to host its Services on a variety of different endpoints. This design makes it possible to host Services via [MQ Servers](/messaging), enable [SOAP support](/soap-support) in addition to ServiceStack's strong HTTP Web Services story. One MQ Server we support is the extremely popular and robust Open Source AMQP messaging broker: [Rabbit MQ](http://www.rabbitmq.com).

## Getting Started

A great way to get started with Rabbit MQ on Windows is by following the 
[Rabbit MQ Windows Installation guide](https://github.com/mythz/rabbitmq-windows)
which also includes sample source code for accessing Rabbit MQ Server using the .NET [RabbitMQ.Client](https://www.nuget.org/packages/RabbitMQ.Client) on NuGet.

## ServiceStack.RabbitMq

ServiceStack builds on top of **RabbitMQ.Client** to provide concrete implementations for 
[ServiceStack's high-level Messaging APIs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Messaging/)
enabling a number of messaging features including publishing and receiving messages as well as registering and processing message handlers. Like other ServiceStack providers, all MQ Servers are interchangeable, visible in the shared common [MqServerIntroTests.cs](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.Server.Tests/Messaging/MqServerIntroTests.cs) and [MqServerAppHostTests.cs](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.Common.Tests/Messaging/MqServerAppHostTests.cs).

![Messaging API](https://raw.github.com/mythz/rabbitmq-windows/master/img/messaging-api.png)

ServiceStack's Rabbit MQ bindings is available on NuGet at:

:::copy
`<PackageReference Include="ServiceStack.RabbitMq" Version="6.*" />`
:::

#### RabbitMqServer

The package includes **RabbitMqServer**, the Rabbit MQ implementation of ServiceStack's MQ
[IMessageService](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Messaging/IMessageService.cs) Server API.

RabbitMqServer is basically a high-level POCO-based MQ server library that's de-coupled and can operate independently from the ServiceStack web framework.
Given this, we're able to learn its functionality by exploring the library on its own. By default, RabbitMqServer looks for a Rabbit MQ Server instance 
on **localhost** at Rabbit MQ's default port **5672**:

```csharp
var mqServer = new RabbitMqServer();
```

Which is equivalent to these other configurations:

```csharp
var mqServer = new RabbitMqServer("localhost");
var mqServer = new RabbitMqServer("localhost:5672");
var mqServer = new RabbitMqServer("amqp://localhost:5672");
```

More connection strings examples are available on [Rabbit MQ's URI Specification](http://www.rabbitmq.com/uri-spec.html) page.

::: info
Run-able examples of these code-samples are available in the [RabbitMqServerIntroTests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.Server.Tests/Messaging/MqServerIntroTests.cs)
:::

#### Message Filters

There are optional `PublishMessageFilter` and `GetMessageFilter` callbacks which can be used to intercept outgoing and incoming messages. The Type name of the message body that was published is available in `IBasicProperties.Type`, e.g:

```csharp
var mqServer = new RabbitMqServer("localhost") 
{
    PublishMessageFilter = (queueName, properties, msg) => {
        properties.AppId = $"app:{queueName}";
    },
    GetMessageFilter = (queueName, basicMsg) => {
        var props = basicMsg.BasicProperties;
        receivedMsgType = props.Type; //automatically added by RabbitMqProducer
        receivedMsgApp = props.AppId;
    }
};

using (var mqClient = mqServer.CreateMessageQueueClient())
{
    mqClient.Publish(new Hello { Name = "Bugs Bunny" });
}

receivedMsgApp.Print();   // app:mq:Hello.In
receivedMsgType.Print();  // Hello
```

### POCO Messages

Just like the rest of ServiceStack, you can use any POCO for your messages (aka Request DTOs) which are serialized with ServiceStack's JSON Serializer and embedded as the body payload, a simple example is just: 

```csharp
public class Hello
{
    public string Name { get; set; }
}
```

### Registering Message Handlers

Now that we have a message we can use, we can start listening to any of these messages sent via the broker by registering handlers for it.
Here's how to register a simple handler that just prints out each message it receieves:

```csharp
mqServer.RegisterHandler<Hello>(m => {
    Hello request = m.GetBody();
    "Hello, {0}!".Print(request.Name);
    return null;
});
```

Each handler receives an [IMessage](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Messaging/IMessage.cs)
which is just the body of the message that was sent (i.e. `T`) wrapped inside an `IMessage` container containing the metadata of the received message.
Inside your handler you can use `IMessage.GetBody()` to extract the typed body, and in this case we signify the service has no response by returning `null`. 

### Starting the Rabbit MQ Server

Once all your handlers are registered you can start listening to messages by starting the MQ Server:

```csharp
mqServer.Start();
```

Starting the MQ Server spawns 2 threads for each handler, one to listen to the Message Inbox `mq:Hello.inq` and another to listen on the Priority Queue located at `mq:Hello.priorityq`. 

::: info
You can white-list which messages to enable Priority Queue's for with `mqServer.PriorityQueuesWhitelist` or disable them all by setting `mqServer.DisablePriorityQueues = true`.
:::

### Allocating multiple threads for specific operations

By default only 1 thread is allocated to handle each message type, but this is easily configurable at registration. E.g. you can spawn 4 threads to handle a CPU-intensive operation with:

```csharp
mqServer.RegisterHandler<Hello>(m => { .. }, noOfThreads:4);
```

### Publishing messages 

With the mqServer started, you're now ready to start publishing messages, you can do with a message queue client that you can get
from a new **RabbitMqMessageFactory** or the mqServer directly, e.g:

```csharp
using (var mqClient = mqServer.CreateMessageQueueClient())
{
    mqClient.Publish(new Hello { Name = "World" });
}
```

The above shows the most common usage where you can publish POCO's directly, behind the scenes this gets serialized as JSON and embedded as the payload of a new persistent message that's sent using a **routing key** of the same name as the destination queue which by convention is mapped 1:1 to a queue of the same name, i.e: **mq:Hello.inq**. In effect, publishing messages are sent to a distinct **Inbox Queue** that's reserved for each message type, essentially behaving as a work queue.

## Message Workflow

By default, RabbitMqServer will send a response message after it's processed each message, what the response is and which Queue (or HTTP url) the response is published to is dependent on the outcome of the message handler, i.e:

![Rabbit MQ Flowchart](https://docs.google.com/drawings/d/1gsyhAyVxJg37tFlHX1CfwH88OX8Mkt8nTlAIOae1_x0/pub?w=1033&h=653) 

### Messages with no responses are sent to '.outq' Topic

When a handler returns a `null` response, the incoming message is re-published as a "transient" message to the out queue, e.g: `mq:Hello.outq` via the Rabbit MQ "fanout" exchange `mx.servicestack.topic` having the effect of notifying any subscribers to `mq:Hello.outq` each time a message is processed. 

We can use this behavior to block until a message gets processed with:

```csharp
IMessage<Hello> msgCopy = mqClient.Get<Hello>(QueueNames<Hello>.Out);
mqClient.Ack(msgCopy);
msgCopy.GetBody().Name //= World
```

Also shown in this example is an explicit **Ack** (which should be done for each message you receive) to tell Rabbit MQ that you've taken responsibility of the message so it can safely remove it off the queue.

### Messages with Responses are published to the Response .inq

Often message handlers will just return a POCO response after it processes a message, e.g:

```csharp
mqServer.RegisterHandler<Hello>(m =>
    new HelloResponse { Result = $"Hello, {m.GetBody().Name}!" });
```

Whenever there's a response, then instead of the .outq the response message is sent to the **.inq** of the response message type, which for a `HelloResponse` type is just **mq:HelloResponse.inq**, e.g:

```csharp
mqClient.Publish(new Hello { Name = "World" });

var responseMsg = mqClient.Get<HelloResponse>(QueueNames<HelloResponse>.In);
mqClient.Ack(responseMsg);
responseMsg.GetBody().Result //= Hello, World!
```

::: info
this behavior can be limited to only publish responses for types in the `mqServer.PublishResponsesWhitelist`, otherwise all response messages can be disabled entirely by setting `mqServer.DisablePublishingResponses = true`.
:::

### Responses from Messages with ReplyTo are published to that address

Whilst for the most part you'll only need to publish POCO messages, you can also alter the default behavior by providing a customized `IMessage<T>` wrapper which ServiceStack will send instead, e.g. you can specify your own **ReplyTo** address to change the queue where the response gets published, e.g:

```csharp
const string replyToMq = mqClient.GetTempQueueName();
mqClient.Publish(new Message<Hello>(new Hello { Name = "World" }) {
    ReplyTo = replyToMq
});

IMessage<HelloResponse> responseMsg = mqClient.Get<HelloResponse>(replyToMq);
mqClient.Ack(responseMsg);
responseMsg.GetBody().Result //= Hello, World!
```

#### ReplyTo addresses can be URLs

A nice feature unique in ServiceStack is that the ReplyTo address can even be a **HTTP Uri**, in which case ServiceStack will attempt to **POST** the raw response at that address. This works nicely with ServiceStack Services which excel at accepting serialized DTO's.

```csharp
mqClient.Publish(new Message<Hello>(new Hello { Name = "World" }) {
    ReplyTo = "http://example.org/hello/callback"
});
```

### Messages that generate exceptions can be re-tried, then published to the dead-letter-queue (.dlq)

By default Rabbit Mq Server lets you specify whether or not you want messages that cause an exception to be retried by specifying a RetryCount of 1 (default), or if you don't want any messages re-tried, specify a value of 0, e.g:

```csharp
var mqServer = new RabbitMqServer { RetryCount = 1 };
```

To illustrate how this works we'll keep a counter of how many times a message handler is invoked, then throw an exception to force an error condition, e.g:

```csharp
var called = 0;
mqServer.RegisterHandler<Hello>(m => {
    called++;
    throw new ArgumentException("Name");
});
```

Now when we publish a message the response instead gets published to the messages **.dlq**, after it's first transparently retried. We can verify this behavior by checking `called=2`:

```csharp
mqClient.Publish(new Hello { Name = "World" });

IMessage<Hello> dlqMsg = mqClient.Get<Hello>(QueueNames<Hello>.Dlq);
mqClient.Ack(dlqMsg);

Assert.That(called, Is.EqualTo(2));
```

DLQ Messages retains the original message in their body as well as the last exception serialized in the `IMessage.Error` ResponseStatus metadata property, e.g:

```csharp
dlqMsg.GetBody().Name   //= World
dlqMsg.Error.ErrorCode  //= typeof(ArgumentException).Name
dlqMsg.Error.Message    //= Name
```

Since the body of the original message is left in-tact, you're able to retry failed messages by removing them from the dead-letter-queue then re-publishing the original message, e.g:

```csharp
IMessage<Hello> dlqMsg = mqClient.Get<Hello>(QueueNames<Hello>.Dlq);

mqClient.Publish(dlqMsg.GetBody());

mqClient.Ack(dlqMsg);
```

This is useful for recovering failed messages after identifying and fixing bugs that were previously causing exceptions, where you can replay and re-process DLQ messages and continue processing them as normal.

## Adding Rabbit MQ support to ServiceStack

Whilst `RabbitMqServer` is useful on its own, it also has the distinct advantage of being able to directly Execute ServiceStack Services which you can do by just routing the handler for each **Request DTO** you want to process through to ServiceStack's AppHost **ExecuteMessage**, e.g:

```csharp
public class AppHost : AppHostHttpListenerBase
{
    public AppHost() : base("Rabbit MQ Test Host", typeof(HelloService).Assembly) {}

    public override void Configure(Container container)
    {
        container.Register<IMessageService>(c => new RabbitMqServer());

        var mqServer = container.Resolve<IMessageService>();

        mqServer.RegisterHandler<Hello>(ExecuteMessage);
        mqServer.Start();
    }
}
```

Now each message will instead be executed by the best matching ServiceStack Service that handles the message with either a **Post** or **Any** fallback verb, e.g:

```csharp
public class HelloService : Service
{
    public object Any(Hello request)
    {
        return new HelloResponse { Result = $"Hello, {request.Name}!" };
    }
}
```

In addition to executing your service implementation, all Services processed via a MQ Server goes through ServiceStack's standard [MQ Request Pipeline](/order-of-operations#wiki-mq-non-http-custom-hooks).

With everything in place, initialize ServiceStack's AppHost to start the Rabbit MQ Server to listen for any messages published to the Request DTO's **.inq**:

```csharp
var appHost = new AppHost().Init();

using (var mqClient = appHost.Resolve<IMessageService>().CreateMessageQueueClient())
{
    mqClient.Publish(new Hello { Name = "World" });

    var responseMsg = mqClient.Get<HelloResponse>(QueueNames<HelloResponse>.In);
    mqClient.Ack(responseMsg);
    responseMsg.GetBody().Result //= Hello, World!     
}
```

### Process ServiceStack MQ Services without a HTTP host

Whilst it's unlikely to be a common use-case, you can even run a ServiceStack MQ Server without a HTTP host by configuring the mqServer inside the generic BasicAppHost, e.g: 

```csharp
var appHost = new BasicAppHost(typeof(HelloService).Assembly) {
    ConfigureAppHost = host => {
        host.Container.Register<IMessageService>(c => new RabbitMqServer());

        var mqServer = host.Container.Resolve<IMessageService>();

        mqServer.RegisterHandler<Hello>(host.ExecuteMessage);
        mqServer.Start();
    }
}.Init();

using (var mqClient = appHost.Resolve<IMessageService>().CreateMessageQueueClient())
{
    mqClient.Publish(new Hello { Name = "World" });

    var msg = mqClient.Get<HelloResponse>(QueueNames<HelloResponse>.In);
    mqClient.Ack(msg);
    Assert.That(msg.GetBody().Result, Is.EqualTo("Hello, World!"));
}
```

In this way, ServiceStack's AppHost is being used as a pure "logic server", hosting auto-wired services within [its MQ Request Pipeline](/order-of-operations#wiki-mq-non-http-custom-hooks), whilst taking advantage of ServiceStack's flexibility and extensibility options and its plugin ecosystem.

Run-able examples of these code-samples are available in the [RabbitMqServerIntroTests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.Server.Tests/Messaging/MqServerIntroTests.cs#L13).

### Rabbit MQ Filters

The new `CreateQueueFilter` and `CreateTopicFilter` filters let you customize what options Rabbit MQ Queue's and topics are created with. The filters can be used to [declare a queue with a custom TTL](https://www.rabbitmq.com/ttl.html) and have messages automatically expire after 60 seconds with:

```csharp
container.Register<IMessageService>(c => new RabbitMqServer(ConnectionString) {
    CreateQueueFilter = (queueName, args) => {
        if (queueName == QueueNames<MyRequest>.In)
            args["x-message-ttl"] = 60000;
    }
});
```

## Rabbit MQ Features

The [Rabbit MQ Server](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.RabbitMq/RabbitMqServer.cs) have some configuration options that are unique to Rabbit MQ:

  - `ConnectionFactory` **ConnectionFactory** - The [RabbitMQ.Client](https://github.com/mythz/rabbitmq-windows) Connection factory to introspect connection properties and create low-level connections
  - `bool` **AutoReconnect** - Whether Rabbit MQ should auto-retry connecting when a connection to Rabbit MQ Server instance is dropped
  - `bool` **UsePolling** - Whether to use polling for consuming messages instead of a long-term subscription
  - `int` **RetryCount** - How many times a message should be retried before sending to the DLQ. Valid range for Rabbit MQ: 0-1.

In addition to sharing a similar architecture to [Redis MQ](/redis-mq), it also shares a number of common features:

  - `int?` **KeepAliveRetryAfterMs** - Wait before Starting the MQ Server after a restart
  - `IMessageFactory` **MessageFactory** - The MQ Message Factory used by this MQ Server
  - `Func<IMessage, IMessage>` **RequestFilter** - Execute global transformation or custom logic before a request is processed. Must be thread-safe.
  - `Func<object, object>` **ResponseFilter** - Execute global transformation or custom logic on the response. Must be thread-safe.
  - `Action<Exception>` **ErrorHandler** - Execute global error handler logic. Must be thread-safe.
  - `string[]` **PriorityQueuesWhitelist** - If you only want to enable priority queue handlers (and threads) for specific msg types.
  - `bool` **DisablePriorityQueues** - Don't listen on any Priority Queues
  - `string[]` **PublishResponsesWhitelist** - Opt-in to only publish responses on this white list. Publishes all responses by default.
  - `bool` **DisablePublishingResponses** - Don't publish any response messages
