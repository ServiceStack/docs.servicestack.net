---
slug: redis-mq
title: Redis MQ
---

## Enable in an existing Web App

Use the `redismq` mixin to register an [MQ Server](/messaging) for Amazon SQS with an existing .NET App:

:::sh
x mix redismq
:::

## Worker Service Template

To start using Redis MQ in stand-alone MQ Servers (i.e. without HTTP access) is to run the MQ Server in an ASP.NET Core Worker Service by starting from a pre-configured project template:

<worker-templates template="worker-redismq"></worker-templates>

## MQ Examples

The [Reusability ServiceStack.UseCase](https://github.com/ServiceStack/ServiceStack.UseCases/tree/master/Reusability) contains a good introductory demo of using MQ's(message-queues) in ServiceStack where the same services can be called via Web Service or via MQ. Using MQ's provide instant response times, in addition to reliable and durable execution of your services. 

### The SMessage Service 

The [SMessage Service](https://github.com/ServiceStack/ServiceStack.UseCases/blob/master/Reusability/SMessageService.cs#L63) shows an example of dividing a service into multiple subtasks and dispatching them for instant response times and parallel processing of blocking operations without needing any multi-threading code in your application logic, e.g:

```csharp
public object Any(SMessage request)
{
    var sw = Stopwatch.StartNew();
    if (!request.Defer) //Process sequentially or Defer execution
    {
        //Executes service sequentially: N+1 service calls, times out if N too big
        var results = new List<SMessageReceipt>();
        results.AddRange(Email.Send(request));
        results.AddRange(FacebookR.Send(request));
        results.AddRange(Twitter.Send(request));
        Db.InsertAll(results);
    }
    else
    {
        //Split in smaller tasks and defers messages in MQ broker for parallel processing
        Email.CreateMessages(request).ForEach(MessageProducer.Publish);
        Facebook.CreateMessages(request).ForEach(MessageProducer.Publish);
        Twitter.CreateMessages(request).ForEach(MessageProducer.Publish);
    }

    return new SMessageResponse {
        TimeTakenMs = sw.ElapsedMilliseconds,
    };
}
```

#### Process each service concurrently without holding up the processing of other tasks
Another benefit of dispatching messages into multiple sub tasks is if the Email API is slow, it doesn't hold up the processing of the other tasks which are all running concurrently in the background each individually processing messages as fast as they can.

#### Easily Parallelize and Multiply your services throughput
The RedisMqServer also supports spawning any number of background threads for individual requests, so if Posting to twitter was an IO intensive operation you can double the throughput by simply assigning 2 or more worker threads, e.g:

```csharp
mqService.RegisterHandler<PostStatusTwitter>(ExecuteMessage, noOfThreads:2);
mqService.RegisterHandler<CallFacebook>(ExecuteMessage);
mqService.RegisterHandler<EmailMessage>(ExecuteMessage);
```

## Redis MQ Client / Server

A redis-based message queue client/server that can be hosted in any .NET or ASP.NET application. All Redis MQ Hosts lives in the [ServiceStack.Server](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Server/Messaging/Redis) project and brings the many benefits of using a Message Queue. 

:::copy
`<PackageReference Include="ServiceStack.Server" Version="8.*" />`
:::

#### [RedisMqServer](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Server/Messaging/Redis/RedisMqServer.cs)

Works by using a background thread for **each service**. This allows you to process messages from different services concurrently. Recommended if you have any long-running services so other services can still run in parallel.

Major kudos goes to Redis which thanks to its versatility, has Pub/Sub and Lists primitives that makes implementing a Queue trivial.

## MQ Architecture in ServiceStack

The logical architecture of how a MQ Publisher and MQ Host works together in ServiceStack:

![ServiceStack MQ Client Architecture](/img/pages/messaging/servicestack-mqclients.png) 

### Easily testable and swappable

All MQ implementations share the same [IMessageService](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Messaging/IMessageService.cs) so they're easily swappable and testable. There is also an [InMemoryTransientMessageService](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Messaging/InMemoryTransientMessageService.cs) available, useful for development & testing.

These versions already sports the major features you've come to expect from a MQ:

  - Each service maintains its own Standard and Priority MQ's
  - Automatic Retries on messages generating errors with Failed messages sent to a DLQ (Dead Letter Queue) when its Retry threshold is reached.
  - Each message can have a ReplyTo pointing to any Queue, alternatively you can even provide a **ServiceStack endpoint URL** which will send the response to a Web Service instead. If the web service is not available it falls back into publishing it in the default Response Queue so you never lose a message!
MQ/Web Services that don't return any output have their Request DTOs sent to a rolling Out queue which can be monitored by external services (i.e. the publisher/callee) to determine when the request has been processed.

## Re-use your existing Web Services!

Although you can host RedisMqServer in any ASP.NET web app, the benefit of hosting inside ServiceStack is that your web services are **already capable** of processing Redis MQ messages **without any changes required** since they're already effectively designed to work like a Message service to begin with, i.e. C# POCO-in -> C# POCO-out.

This is another example of how ServiceStack's prescribed DTO-first architecture continues to pay dividends since each web service is a DI clean-room allowing your C# logic to be kept pure as it only has to deal with untainted POCO DTOs, allowing your same web service to be re-used in: SOAP, REST (JSON,XML,JSV,CSV,HTML) web services, view models for dynamic HTML pages and now as a MQ service!

## Example

Hooking up a basic send/reply example is as easy as:

```csharp
//DTO messages:
public class Hello { public string Name { get; set; } }
public class HelloResponse { public string Result { get; set; } }

var redisFactory = new PooledRedisClientManager("localhost:6379");
var mqHost = new RedisMqServer(redisFactory, retryCount:2);

//Server - MQ Service Impl:
mqHost.RegisterHandler<Hello>(m =>
    new HelloResponse { Result = "Hello, " + m.GetBody().Name });
mqHost.Start();

...

//Client - Process Response:
mqHost.RegisterHandler<HelloResponse>(m => {
    Console.WriteLine("Received: " + m.GetBody().Result);
});
mqHost.Start();

...

//Producer - Start publishing messages:
var mqClient = mqHost.CreateMessageQueueClient();
mqClient.Publish(new Hello { Name = "ServiceStack" });

```

## Redis

::: info
This is a quote of a [google group topic](https://groups.google.com/d/msg/servicestack/Jl1xjlLH-4E/kz8mL_bq9zMJ) to provide more information about ServiceStack and Redis until more documentation/examples are added
:::

Redis is a  NoSQL datastore that runs as a network server. To start it you need to run an instance of redis-server either locally or remotely accessible.

Probably will help to understand the background concepts behind Redis so you can get a better idea of how it works. This StackOverflow answer has a [good overview about Redis in .NET](http://stackoverflow.com/a/2760282/85785).

The `RedisMqServer` is in [ServiceStack.Server](https://www.nuget.org/packages/ServiceStack.Server) project and can be installed with:

:::copy
`<PackageReference Include="ServiceStack.Server" Version="8.*" />`
:::

Redis MQ works by listening for messages published to the central `mq:topic:in` Redis Channel and processes any messages sent in separate background threads which are started from inside your AppHost when calling `RedisMqServer.Start()`.

For duplex communication each client and server will require its own AppHost + RedisMqServer Host, although unless your server is going to call HTTP services on the client you can use a [BasicAppHost](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/Testing/BasicAppHost.cs).

Here is a simple example of a client/server with HTTP + RedisMQ enabled on the server, and just RedisMQ on the client: 

#### Shared.cs

```csharp
using System;

namespace TestMqShared
{
    public class Hello { 
        public string Name { get; set; } 
    }
    public class HelloResponse { 
        public string Result { get; set; } 
    }
}
```

#### Server.cs

```csharp
using System;
using Funq;
using ServiceStack;
using ServiceStack.Messaging.Redis;
using ServiceStack.Redis;
using ServiceStack.Testing;
using TestMqShared;

namespace TestMq
{
    //Server
    public class HelloService : Service 
    {
        public object Any(Hello req) 
        { 
            return new HelloResponse { Result = "Hello, " + req.Name }; 
        }
    }

    public class ServerAppHost : AppHostHttpListenerBase 
    {
        public ServerAppHost() : base("Test Server", typeof(HelloService).Assembly) {}

        public override void Configure(Container container) 
        {
            base.Routes
                .Add<Hello>("/hello")
                .Add<Hello>("/hello/{Name}");

            var redisFactory = new PooledRedisClientManager("localhost:6379");
            container.Register<IRedisClientsManager>(redisFactory); 
            var mqHost = new RedisMqServer(redisFactory, retryCount:2);

            //Server - MQ Service Impl:

            //Listens for 'Hello' messages sent with: mqClient.Publish(new Hello { ... })
            mqHost.RegisterHandler<Hello>(base.ExecuteMessage);
            mqHost.Start(); //Starts listening for messages
        }
    }

    class MainClass
    {
        public static void Main(string[] args)
        {
            var serverAppHost = new ServerAppHost();
            serverAppHost.Init(); 
            serverAppHost.Start("http://localhost:1400/");
            Console.WriteLine("Server running.  Press enter to terminate...");
            //Prevent server from exiting (when running in ConsoleApp)
            Console.ReadLine(); 
        }
    }
}
```

#### Client.cs

```csharp
using System;
using Funq;
using ServiceStack;
using ServiceStack.Messaging;
using ServiceStack.Messaging.Redis;
using ServiceStack.Redis;
using ServiceStack.Testing;
using TestMqShared;

namespace TestMqCli
{
    class MainClass
    {
        public static void Main(string[] args)
        {
            var redisFactory = new PooledRedisClientManager("localhost:6379");
            var mqServer = new RedisMqServer(redisFactory, retryCount:2);

            //Client - MQ Service Impl:
            //Listens for 'HelloResponse' returned by the 'Hello' Service
            mqServer.RegisterHandler<HelloResponse>(m => {  
                Console.WriteLine("Received: " + m.GetBody().Result);
                // See comments below
                // m.Options = (int)MessageOption.None;
                return null;
            });

            //or to call an existing service with:
            //mqServer.RegisterHandler<HelloResponse>(m =>   
            //    this.ServiceController.ExecuteMessage(m));

            mqServer.Start(); //Starts listening for messages

            var mqClient = mqServer.CreateMessageQueueClient();
            mqClient.Publish(new Hello { Name = "Client 1" });

            Console.WriteLine("Client running.  Press any key to terminate...");
            Console.ReadLine(); //Prevent self-hosted Console App from exiting
        }
    }
}
```

The first RedisMQ host listening to the `Hello` message (i.e. the server) will process the message. 

When the server returns a 'HelloResponse' message it gets put on the 'HelloResponse' Inbox Queue and the first RedisMQ Host listening to the 'HelloResponse' message (i.e. Client) will have their callback fired.

Note that the `HelloResponse` will get put back on a 'transient' message queue, `mq.HelloResponse.outq` with a maximum message limit of 100 (by default).  You can subscribe to this queue to get a notification and do further processing, such as recording the number of messages handled.  Or you can clear the message `NotifyOneWay` option to prevent this.

### RedisMQ Client

Clients can use a `RedisMessageProducer` to be able to publish a message, e.g:

```csharp
var redisManager = new RedisManagerPool("localhost:6379");
using (var mqClient = new RedisMessageProducer(redisManager))
{
    mqClient.Publish(new Hello { Name = "Client 1" });
}
```

Or if preferred can instead use a `RedisMessageFactory` which provide access to both [IMessageQueueClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Messaging/IMessageQueueClient.cs) and [IMessageProducer](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Messaging/IMessageProducer.cs):

```csharp
IMessageFactory redisMqFactory = new RedisMessageFactory(redisManager);
using (var mqClient = redisMqFactory.CreateMessageQueueClient())
{
    mqClient.Publish(new Hello { Name = "Client 1" });
}
```

### Request + Reply MQ Pattern

However MQ's are normally used for async OneWay messages as any client host listening to 'HelloResponse' could receive the response message, and only 1 will, which is not guaranteed to be the client that sent the original message. For this reason you want to make use of the ReplyTo field of the Message for Request/Reply responses.

```csharp
var uniqueCallbackQ = "mq:c1" + ":" Guid.NewGuid().ToString("N");
var clientMsg = new Message<Hello>(new Hello { Name = "Client 1" }) {
   ReplyTo =  uniqueCallbackQ
};
mqClient.Publish( clientMsg );
//Blocks thread on client until reply message is received
var response = mqClient.Get(clientMsg).ToMessage<HelloResponse>();  
```


Note: The ReplyTo callback url could also be a ServiceStack endpoint that expects a 'HelloResponse' e.g.

```csharp
var clientMsg = new Message<Hello>(new Hello { Name = "Client 1" }) {
   ReplyTo =  "http://clienthost:82/helloresponse"
};
```

In this case the server wont put the response message on the back on the MQ and will instead send the response directly to your client web service host.

There's a few MQ concepts covered above here, I invite you to do your own reading on MQ's in general as it works a little different to normal request/reply web services.

See Also: [Redis Commands (PDF)](http://masonoise.files.wordpress.com/2010/03/redis-cheatsheet-v1.pdf)
