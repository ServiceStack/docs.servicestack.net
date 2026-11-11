---
slug: pubsub
title: Redis Managed Pub/Sub Server
---

The Pub/Sub engine powering
[Redis ServerEvents](/redis-server-events) and [Redis MQ](/redis-mq) has been extracted
and encapsulated it into a re-usable class that can be used independently for handling messages
published to specific [Redis Pub/Sub](http://redis.io/commands#pubsub) channels.

`RedisPubSubServer` processes messages in a managed background thread that **automatically reconnects**
when the redis-server connection fails and works like an independent background Service that can be
stopped and started on command.

<pub-sub-server-lifecycle>
</pub-sub-server-lifecycle>

## API

The public API is captured in the [IRedisPubSubServer](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisPubSubServer.cs) interface:

```csharp
public interface IRedisPubSubServer : IDisposable
{
    IRedisClientsManager ClientsManager { get; }
    // What Channels it's subscribed to
    string[] Channels { get; }

    // Run once on initial StartUp
    Action OnInit { get; set; }
    // Called each time a new Connection is Started
    Action OnStart { get; set; }
    // Invoked when Connection is broken or Stopped
    Action OnStop { get; set; }
    // Invoked after Dispose()
    Action OnDispose { get; set; }

    // Fired when each message is received
    Action<string, string> OnMessage { get; set; }
    // Fired after successfully subscribing to the specified channels
    Action<string> OnUnSubscribe { get; set; }
    // Called when an exception occurs 
    Action<Exception> OnError { get; set; }
    // Called before attempting to Failover to a new redis master
    Action<IRedisPubSubServer> OnFailover { get; set; }

    int? KeepAliveRetryAfterMs { get; set; }
    // The Current Time for RedisServer
    DateTime CurrentServerTime { get; }

    // Current Status: Starting, Started, Stopping, Stopped, Disposed
    string GetStatus();
    // Different life-cycle stats
    string GetStatsDescription();
    
    // Subscribe to specified Channels and listening for new messages
    IRedisPubSubServer Start();
    // Close active Connection and stop running background thread
    void Stop();
    // Stop than Start
    void Restart();
}
```

## Usage

To use `RedisPubSubServer`, initialize it with the channels you want to subscribe to and assign handlers
for each of the events you want to handle. At a minimum you'll want to handle `OnMessage`:

```csharp
var clientsManager = new PooledRedisClientManager();
var redisPubSub = new RedisPubSubServer(clientsManager, "channel-1", "channel-2") {
        OnMessage = (channel, msg) => "Received '{0}' from '{1}'".Print(msg, channel)
    }.Start();
```

Calling `Start()` after it's initialized will get it to start listening and processing any messages
published to the subscribed channels.
## Publishing messages

Any client can publish to a channel; `PublishMessage` returns the number of subscribers that received it:

```csharp
using var redis = redisManager.GetClient();
long receivers = redis.PublishMessage("notifications", "Deploy started");

// Publish typed messages as JSON
redis.PublishMessage("orders:created", new OrderCreated { OrderId = 42 }.ToJson());
```

Deserialize them in the handler with `msg.FromJson<OrderCreated>()`.

## Subscribe to channel patterns

`ChannelsMatching` subscribes to every channel matching a glob-style pattern, using `PSUBSCRIBE`. The handler
receives the concrete channel name, so one subscriber can route several related channels:

```csharp
var pubSub = new RedisPubSubServer(redisManager) {
    ChannelsMatching = new[] { "orders:*" },
    OnMessage = (channel, msg) => {
        switch (channel)
        {
            case "orders:created": OnCreated(msg.FromJson<OrderCreated>()); break;
            case "orders:shipped": OnShipped(msg.FromJson<OrderShipped>()); break;
        }
    },
}.Start();
```

## Run it for the lifetime of your App

Start the subscriber when your App starts and dispose it on shutdown by wrapping it in a hosted service:

```csharp
public class NotificationsSubscriber(IRedisClientsManager redisManager, ILogger<NotificationsSubscriber> log)
    : IHostedService, IDisposable
{
    RedisPubSubServer? pubSub;

    public Task StartAsync(CancellationToken token)
    {
        pubSub = new RedisPubSubServer(redisManager, "notifications") {
            OnMessage = (channel, msg) => log.LogInformation("{Channel}: {Message}", channel, msg),
            OnError = ex => log.LogError(ex, "Redis Pub/Sub error"),
        };
        pubSub.Start();
        return Task.CompletedTask;
    }

    public Task StopAsync(CancellationToken token)
    {
        pubSub?.Stop();
        return Task.CompletedTask;
    }

    public void Dispose() => pubSub?.Dispose();
}

services.AddHostedService<NotificationsSubscriber>();
```

`OnMessage` runs on the subscriber's background thread, one message at a time. Keep handlers fast, and hand
slow work to a queue or [Background Jobs](/jobs/) so later messages aren't delayed.

## Use-cases

- **Cache invalidation across servers.** Evict each server's in-memory copy of a changed value; see the
  [two-tier cache recipe](/redis/caching-patterns#two-tier-cache-with-pubsub-invalidation).
- **Configuration reloads.** Publish to a `config:reload` channel after changing settings, so every server
  reloads them without a restart.
- **Live updates to browsers.** [Redis Server Events](/redis-server-events) uses Pub/Sub to deliver
  Server-Sent Events to browsers connected to any app server.
- **Coordinating workers.** Tell background workers to pause, resume or shut down.

## Delivery guarantees

Pub/Sub delivers each message to the subscribers connected at the moment it's published, and stores nothing.
A subscriber that's disconnected, restarting or failing over misses those messages, and `RedisPubSubServer`
reconnects without replaying them. Design handlers so a missed message only means a short delay, e.g. a local
cache entry that also expires, or use [Redis Streams](/redis/streams) when every message must be processed.
