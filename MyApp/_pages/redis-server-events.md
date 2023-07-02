---
title: Redis ServerEvents
---

One limitation the default `MemoryServerEvents` implementation has is being limited for use within a single App Server where all client connections are maintained. This is no longer a limitation with the new **Redis ServerEvents back-end** which utilizes a distributed redis-server back-end to provide a scale-out option capable of serving fan-out/load-balanced App Servers. If you're familiar with SignalR, this is akin to [SignalR's scaleout with Redis back-end](http://www.asp.net/signalr/overview/signalr-20/performance-and-scaling/scaleout-with-redis).

`RedisServerEvents` is a drop-in replacement for the built-in `MemoryServerEvents` that's effectively a transparent implementation detail, invisible to Server or Client API's where both implementations even [share the same integration Tests](https://github.com/ServiceStack/ServiceStack/blob/b9eb34eb80ff64fa1171d2f7f29ef359c3580eed/tests/ServiceStack.WebHost.Endpoints.Tests/ServerEventTests.cs#L169-L189).

![Redis ServerEvents Scale Out](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/gap/Chat/redis-scaleout.png)

## Enable Redis ServerEvents

As a drop-in replacement it can easily be configured with just a few lines of code, as seen in the updated Chat App which can run on either [Memory or Redis ServerEvents providers](https://github.com/ServiceStackApps/Chat/blob/326617e88272d7cc0a8b7513272cf055378957e2/src/Chat/Global.asax.cs#L46-L54):

```csharp
var redisHost = AppSettings.GetString("RedisHost");
if (redisHost != null)
{
    container.Register<IRedisClientsManager>(
        new RedisManagerPool(redisHost));

    container.Register<IServerEvents>(c => 
        new RedisServerEvents(c.Resolve<IRedisClientsManager>()));
    
    container.Resolve<IServerEvents>().Start();
}
```

The above configuration will use Redis ServerEvents if there's a `RedisHost` **appSetting** in Chat's [Web.config](https://github.com/ServiceStackApps/Chat/blob/326617e88272d7cc0a8b7513272cf055378957e2/src/Chat/Web.config#L21):

```xml
<add key="RedisHost" value="localhost:6379" />
```

RedisServerEvents is in the [ServiceStack.Server](http://www.nuget.org/packages/ServiceStack.Server) NuGet Package:

::: nuget
`<PackageReference Include="ServiceStack.Redis" Version="6.*" />`
:::

### Cross-platform Memory and Redis ServerEvent Enabled Chat.exe

To showcase Redis ServerEvents in action, we've prepared a stand-alone [ServiceStack.Gap](https://github.com/ServiceStack/ServiceStack.Gap) version of [Chat](http://chat.netcore.io) compiled down into a single **Chat.exe** that can run on either Windows and OSX with Mono which can be downloaded from: 

### [Chat.zip](https://github.com/ServiceStack/ServiceStack.Gap/raw/master/deploy/Chat.zip) (1.2MB)

[![Redis ServerEvents Preview](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/redis-server-events.gif)](https://github.com/ServiceStack/ServiceStack.Gap/raw/master/deploy/Chat.zip)

### Redis ServerEvents Chat Usage

Running **Chat.exe** without any arguments will run Chat using the default **Memory ServerEvents**. This can be changed to use **Redis ServerEvents** by [un-commenting this line in appsettings.txt](https://github.com/ServiceStack/ServiceStack.Gap/blob/master/src/Chat/Chat/appsettings.txt#L5):

```
#redis localhost
```

This will require a **redis-server** running on `localhost`. If you don't have redis yet, [download redis-server for Windows](https://github.com/ServiceStack/redis-windows).

Alternatively you can specify which **port** to run Chat on and change it to use Redis ServerEvents by specifying the **redis** instance it should connect to on the command-line with:

```
Chat.exe /port=1337 /redis=localhost
```

Also included in `Chat.zip` are [test-fanout-redis-events.bat](https://github.com/ServiceStack/ServiceStack.Gap/blob/master/src/Chat/build/test-fanout-redis-events.bat) and equivalent [test-fanout-redis-events.sh](https://github.com/ServiceStack/ServiceStack.Gap/blob/master/src/Chat/build/test-fanout-redis-events.sh) helper scripts for **spawning multiple versions of Chat.exe** on different ports (and backgrounds) for **Windows or OSX**, showing how multiple clients are able to send messages to each other via Redis whilst being subscribed to different HTTP Servers:

```
START Chat.exe /port=1337 /redis=localhost /background=/port-1337.jpg
START Chat.exe /port=2337 /redis=localhost /background=/port-2337.jpg
START Chat.exe /port=3337 /redis=localhost /background=/port-3337.jpg
```

This script was used to create the animated gif above to launch **3 self-hosting instances of Chat.exe** running on **different ports**, all connected to each other via Redis. This enables some interesting peer-to-peer scenarios where users are able to run a network of (CPU/resource isolated) decentralized stand-alone HTTP Servers on their local machines, but can still communicate with each other via redis.
