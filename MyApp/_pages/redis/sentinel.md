---
slug: sentinel
title: Redis Sentinel
---

[Redis Sentinel](http://redis.io/topics/sentinel) is the official recommendation for running a highly
available Redis configuration by running a number of additional redis sentinel processes to actively monitor
existing redis master and slave instances ensuring they're each working as expected. If by consensus it's
determined that the master is no longer available it will automatically failover and promote one of the
replicated slaves as the new master. The sentinels also maintain an authoritative list of available
redis instances providing clients a centeral repositorty to discover available instances they can connect to.

Support for Redis Sentinel is available with the `RedisSentinel` class which listens to the available
Sentinels to source its list of available master, slave and other sentinel redis instances which it uses
to configure and maintain the Redis Client Managers, initiating any failovers as they're reported.

## Usage

To use the new Sentinel support, instead of populating the Redis Client Managers with the connection string
of the master and slave instances you would create a single `RedisSentinel` instance configured with
the connection string of the running Redis Sentinels:

```csharp
var sentinelHosts = new[]{ "sentinel1", "sentinel2:6390", "sentinel3" };
var sentinel = new RedisSentinel(sentinelHosts, masterName: "mymaster");
```

This shows a typical example of configuring a `RedisSentinel` which references 3 sentinel hosts (i.e.
the minimum number for a highly available setup which can survive any node failing).
It's also configured to look at the `mymaster` configuration set (the default master group).

::: info
Redis Sentinels can monitor more than 1 master / slave group, each with a different master group name.
:::

The default port for sentinels is **26379** (when unspecified) and as RedisSentinel can auto-discover
other sentinels, the minimum configuration required is just:

```csharp
var sentinel = new RedisSentinel("sentinel1");
```

::: info
Scanning and auto discovering of other Sentinels can be disabled with `ScanForOtherSentinels=false`
:::

### Advanced Configuration

More advanced configuration of the internal RedisManager used by `RedisSentinel` can be done by overriding
the `RedisManagerFactory` where you can specify the RedisManager it should use along with fine-grained configuration
such as configuring individual **master** and **replica** pool sizes, e.g:

```csharp
var sentinel = new RedisSentinel(sentinelHost, masterName)
{
    RedisManagerFactory = (masters, replicas) => new PooledRedisClientManager(masters, replicas,
        new RedisClientManagerConfig {
            MaxWritePoolSize = 100,
            MaxReadPoolSize = 200,
        })
};
```

## Start monitoring Sentinels

Once configured, you can start monitoring the Redis Sentinel servers and access the pre-configured
client manager with:

```csharp
IRedisClientsManager redisManager = sentinel.Start();
```

Which as before, can be registered in your preferred IOC as a **singleton** instance:

```csharp
container.Register<IRedisClientsManager>(c => sentinel.Start());
```

## Advanced Sentinel Configuration

RedisSentinel by default manages a configured `PooledRedisClientManager` instance which resolves both master
Redis clients for read/write `GetClient()` and slaves for readonly `GetReadOnlyClient()` API's.

This can be changed to use the newer `RedisManagerPool` with:

```csharp
sentinel.RedisManagerFactory = (master,slaves) => new RedisManagerPool(master);
```

## Custom Redis Connection String

The host the RedisSentinel is configured with only applies to that Sentinel Host, you can still use the flexibility of
[Redis Connection Strings](https://github.com/ServiceStack/ServiceStack.Redis#redis-connection-strings)
to configure the individual Redis Clients by specifying a custom `HostFilter`:

```csharp
sentinel.HostFilter = host => "{0}?db=1&RetryTimeout=5000".Fmt(host);
```

This will return clients configured to use Database 1 and a Retry Timeout of 5 seconds (used in new
Auto Retry feature).

## Other RedisSentinel Configuration

Whilst the above covers the popular Sentinel configuration that would typically be used, nearly every aspect
of `RedisSentinel` behavior is customizable with the configuration below:

<table>
    <tr>
        <td><b>OnSentinelMessageReceived</b></td><td>Fired when the Sentinel worker receives a message from the Sentinel Subscription</td>
    </tr>
    <tr>
        <td><b>OnFailover</b></td><td>Fired when Sentinel fails over the Redis Client Manager to a new master</td>
    </tr>
    <tr>
        <td><b>OnWorkerError</b></td><td>Fired when the Redis Sentinel Worker connection fails</td>
    </tr>
    <tr>
        <td><b>IpAddressMap</b></td><td>Map internal redis host IP's returned by Sentinels to its external IP</td>
    </tr>
    <tr>
        <td><b>ScanForOtherSentinels</b></td><td>Whether to routinely scan for other sentinel hosts (default true)</td>
    </tr>
    <tr>
        <td><b>RefreshSentinelHostsAfter</b></td><td>What interval to scan for other sentinel hosts (default 10 mins)</td>
    </tr>
    <tr>
        <td><b>WaitBetweenFailedHosts</b></td><td>How long to wait after failing before connecting to next redis instance (default 250ms)</td>
    </tr>
    <tr>
        <td><b>MaxWaitBetweenFailedHosts</b></td><td>How long to retry connecting to hosts before throwing (default 60s)</td>
    </tr>
    <tr>
        <td><b>WaitBeforeForcingMasterFailover</b></td><td>How long after consecutive failed attempts to force failover (default 60s)</td>
    </tr>
    <tr>
        <td><b>ResetWhenSubjectivelyDown</b></td><td>Reset clients when Sentinel reports redis is subjectively down (default true)</td>
    </tr>
    <tr>
        <td><b>ResetWhenObjectivelyDown</b></td><td>Reset clients when Sentinel reports redis is objectively down (default true)</td>
    </tr>
    <tr>
        <td><b>SentinelWorkerConnectTimeoutMs</b></td><td>The Max Connection time for Sentinel Worker (default 100ms)</td>
    </tr>
    <tr>
        <td><b>SentinelWorkerSendTimeoutMs</b></td><td>Max TCP Socket Send time for Sentinel Worker (default 100ms)</td>
    </tr>
    <tr>
        <td><b>SentinelWorkerReceiveTimeoutMs</b></td><td>Max TCP Socket Receive time for Sentinel Worker (default 100ms)</td>
    </tr>
</table>

## [Configure Redis Sentinel Servers](https://github.com/ServiceStack/redis-config)

[![Instant Redis Setup](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/redis/instant-sentinel-setup.png)](https://github.com/ServiceStack/redis-config)

The
[redis config project](https://github.com/ServiceStack/redis-config) simplifies setting up and running a highly-available multi-node Redis Sentinel configuration including
start/stop scripts for instantly setting up the minimal
[highly available Redis Sentinel configuration](https://github.com/ServiceStack/redis-config/blob/master/README.md#3x-sentinels-monitoring-1x-master-and-2x-slaves)
on a single (or multiple) Windows, OSX or Linux servers. This single-server/multi-process configuration
is ideal for setting up a working sentinel configuration on a single dev workstation or remote server.

The redis-config repository also includes the
[MS OpenTech Windows redis binaries](https://github.com/ServiceStack/redis-windows#running-microsofts-native-port-of-redis)
and doesn't require any software installation.

## Windows Usage

To run the included Sentinel configuration, clone the redis-config repo on the server you want to run it on:

```
git clone https://github.com/ServiceStack/redis-config.git
```

Then Start 1x Master, 2x Slaves and 3x Sentinel redis-servers with:

```
cd redis-config\sentinel3\windows
start-all.cmd
```

Shutdown started instances:

```
stop-all.cmd
```

If you're running the redis processes locally on your dev workstation the minimal configuration to connect
to the running instances is just:

```csharp
var sentinel = new RedisSentinel("127.0.0.1:26380");
container.Register(c => sentinel.Start());
```

## Localhost vs Network IP's

The sentinel configuration assumes all redis instances are running locally on **127.0.0.1**.
If you're instead running it on a remote server that you want all developers in your network to be
able to access, you'll need to either change the IP Address in the `*.conf` files to use the servers
Network IP. Otherwise you can leave the defaults and use the `RedisSentinel` IP Address Map feature
to transparently map localhost IP's to the Network IP that each pc on your network can connect to.

E.g. if this is running on a remote server with a **10.0.0.9** Network IP, it can be configured with:

```csharp
var sentinel = new RedisSentinel("10.0.0.9:26380") {
    IpAddressMap = {
        {"127.0.0.1", "10.0.0.9"},
    }
};
container.Register(c => sentinel.Start());
```

## Google Cloud - [Click to Deploy Redis](https://github.com/ServiceStack/redis-config/blob/master/README.md#google-cloud---click-to-deploy-redis)

The easiest Cloud Service we've found that can instantly set up a multi node-Redis Sentinel Configuration
is using Google Cloud's
[click to deploy Redis feature](https://cloud.google.com/solutions/redis/click-to-deploy)
available from the Google Cloud Console under **Deploy & Manage**:

![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/redis/sentinel3-gcloud-01.png)

Clicking **Deploy** button will let you configure the type, size and location where you want to deploy the
Redis VM's. See the
[full Click to Deploy Redis guide](https://github.com/ServiceStack/redis-config/blob/master/README.md#google-cloud---click-to-deploy-redis)
for a walk-through on setting up and inspecting a highly-available redis configuration on Google Cloud.

## Change to use RedisManagerPool

By default, RedisSentinel uses a `PooledRedisClientManager`, this can be changed to use the
newer `RedisManagerPool` with:

```csharp
sentinel.RedisManagerFactory = (master,replicas) => new RedisManagerPool(master);
```

## Start monitoring Sentinels

Once configured, you can start monitoring the Redis Sentinel servers and access the pre-configured
client manager with:

```csharp
IRedisClientsManager redisManager = sentinel.Start();
```

Which as before, can be registered in your preferred IOC as a **singleton** instance:

```csharp
container.Register<IRedisClientsManager>(c => sentinel.Start());
```

## [Configure Redis Sentinel Servers](https://github.com/ServiceStack/redis-config)

[![Instant Redis Setup](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/redis/instant-sentinel-setup.png)](https://github.com/ServiceStack/redis-config)

See the
[redis config project](https://github.com/ServiceStack/redis-config) for a quick way to setup up
the minimal
[highly available Redis Sentinel configuration](https://github.com/ServiceStack/redis-config/blob/master/README.md#3x-sentinels-monitoring-1x-master-and-2x-slaves)
including start/stop scripts for instantly running multiple redis instances on a single (or multiple)
Windows, OSX or Linux servers.

## Redis Stats

You can use the `RedisStats` class for visibility and introspection into your running instances.
The [Redis Stats](/redis/stats) lists the stats available.

## Automatic Retries

The built-in [Automatic Retries](/redis/automatic-retries) support improves the resilience of client connections, 
`RedisClient` will transparently retry failed Redis operations due to Socket and I/O Exceptions in an exponential 
backoff starting from **10ms** up until the `RetryTimeout` of **10000ms**. These defaults can be tweaked with:

```csharp
RedisConfig.DefaultRetryTimeout = 10000;
RedisConfig.BackOffMultiplier = 10;
```