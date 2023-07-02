---
slug: client-managers
title: Managing connections
---

## Redis Connection Strings

Redis Connection strings have been expanded to support the more versatile URI format which is now able to capture most of Redis Client
settings in a single connection string (akin to DB Connection strings).

Redis Connection Strings supports multiple URI-like formats, from a simple **hostname** or **IP Address and port** pair to a
fully-qualified **URI** with multiple options specified on the QueryString.

Some examples of supported formats:

```
localhost
127.0.0.1:6379
redis://localhost:6379
password@localhost:6379
clientid:password@localhost:6379
redis://clientid:password@localhost:6380?ssl=true&db=1
```

::: info
More examples can be seen in [ConfigTests.cs](https://github.com/ServiceStack/ServiceStack.Redis/blob/master/tests/ServiceStack.Redis.Tests/ConfigTests.cs)
:::

Any additional configuration can be specified as QueryString parameters. The full list of options that can be specified include:

<table>
    <tr>
        <td><b>Ssl</b></td>
        <td>bool</td>
        <td>If this is an SSL connection</td>
    </tr>
    <tr>
        <td><b>Db</b></td>
        <td>int</td>
        <td>The Redis DB this connection should be set to</td>
    </tr>
    <tr>
        <td><b>Client</b></td>
        <td>string</td>
        <td>A text alias to specify for this connection for analytic purposes</td>
    </tr>
    <tr>
        <td><b>Username</b></td>
        <td>string</td>
        <td>Redis Username when using ACLs</td>
    </tr>
    <tr>
        <td><b>Password</b></td>
        <td>string</td>
        <td>UrlEncoded version of the Password for this connection</td>
    </tr>
    <tr>
        <td><b>ConnectTimeout</b></td>
        <td>int</td>
        <td>Timeout in ms for making a TCP Socket connection</td>
    </tr>
    <tr>
        <td><b>SendTimeout</b></td>
        <td>int</td>
        <td>Timeout in ms for making a synchronous TCP Socket Send</td>
    </tr>
    <tr>
        <td><b>ReceiveTimeout</b></td>
        <td>int</td>
        <td>Timeout in ms for waiting for a synchronous TCP Socket Receive</td>
    </tr>
    <tr>
        <td><b>IdleTimeOutSecs</b></td>
        <td>int</td>
        <td>Timeout in Seconds for an Idle connection to be considered active</td>
    </tr>
    <tr>
        <td><b>NamespacePrefix</b></td>
        <td>string</td>
        <td>Use a custom prefix for ServiceStack.Redis internal index colletions</td>
    </tr>
</table>

When using [Redis ACLs](https://redis.io/docs/manual/security/acl/) the Username needs to specified on the QueryString, e.g:

```csharp
var connString = $"redis://{Host}?ssl=true&username={Username}&password={Password.UrlEncode()}";
var redisManager = new RedisManagerPool(connString);
```

## [ServiceStack.Redis SSL Support](/ssl-redis-azure)

ServiceStack.Redis supports **SSL connections** making it suitable for accessing remote Redis server instances over a
**secure SSL connection**.

![Azure Redis Cache](https://github.com/ServiceStack/Assets/raw/master/img/wikis/redis/azure-redis-instance.png)

#### Specify SSL Protocol

Support for changing the Ssl Protocols used for encrypted SSL connections can be set on the connection string using the `sslprotocols` modifier, e.g:

```csharp
var connString = $"redis://{Host}?ssl=true&sslprotocols=Tls12&password={Password.UrlEncode()}";
var redisManager = new RedisManagerPool(connString);
using var client = redisManager.GetClient();
//...
```

### [Connecting to Azure Redis](/ssl-redis-azure)

As connecting to [Azure Redis Cache](http://azure.microsoft.com/en-us/services/cache/) via SSL was the primary use-case for this feature,
we've added a new
[Getting connected to Azure Redis via SSL](/ssl-redis-azure) to help you get started.

## [Redis GEO](https://github.com/ServiceStackApps/redis-geo)

The [release of Redis 3.2.0](http://antirez.com/news/104) brings it exciting new
[GEO capabilities](http://redis.io/commands/geoadd) which will let you store Lat/Long coordinates in Redis
and query locations within a specified radius. To demonstrate this functionality we've created a new
[Redis GEO Live Demo](https://github.com/ServiceStackApps/redis-geo) which lets you click on anywhere in
the U.S. to find the list of nearest cities within a given radius, Live Demo at: https://redis.netcore.io

## Redis Client Managers

The recommended way to access `RedisClient` instances is to use one of the available Thread-Safe Client Managers below. Client Managers are connection factories which should be registered as a Singleton either in your IOC or static class.

### RedisManagerPool

With the enhanced Redis URI Connection Strings we've been able to simplify and streamline the existing `PooledRedisClientManager` implementation and have extracted it out into a new clients manager called `RedisManagerPool`.

In addition to removing all above options on the Client Manager itself, readonly connection strings have also been removed so the configuration ends up much simpler and more aligned with the common use-case:

```csharp
container.Register<IRedisClientsManager>(c => 
    new RedisManagerPool(redisConnectionString));
```

**Pooling Behavior**

Any connections required after the maximum Pool size has been reached will be created and disposed outside of the Pool. By not being restricted to a maximum pool size, the pooling behavior in `RedisManagerPool` can maintain a smaller connection pool size at the cost of potentially having a higher opened/closed connection count.

### PooledRedisClientManager

If you prefer to define options on the Client Manager itself or you want to provide separate Read/Write and ReadOnly
(i.e. Master and Replica) redis-servers, use the `PooledRedisClientManager` instead:

```csharp
container.Register<IRedisClientsManager>(c => 
    new PooledRedisClientManager(redisReadWriteHosts, redisReadOnlyHosts) { 
        ConnectTimeout = 100,
        //...
    });
```

**Pooling Behavior**

The `PooledRedisClientManager` imposes a maximum connection limit and when its maximum pool size has been reached will instead block on any new connection requests until the next `RedisClient` is released back into the pool. If no client became available within `PoolTimeout`, a Pool `TimeoutException` will be thrown.

#### Read Only Clients

By default resolving a RedisClient with `GetRedisClient()` or `GetRedisClientAsync()` will return a client connected to the configured primary (master) host, if you also have replica (slave) hosts configured, you can access it with the `GetReadOnlyClient()` or `GetReadOnlyClientAsync()` APIs, e.g:

```csharp
using var redisReadOnly = clientsManager.GetReadOnlyClient();
```

### BasicRedisClientManager

If don't want to use connection pooling (i.e. you're accessing a local redis-server instance) you can use a basic (non-pooled) Clients Manager which creates a new `RedisClient` instance each time:

```csharp
container.Register<IRedisClientsManager>(c => 
    new BasicRedisClientManager(redisConnectionString));
```

### Accessing the Redis Client

Once registered, accessing the RedisClient is the same in all Client Managers, e.g:

```csharp
var clientsManager = container.Resolve<IRedisClientsManager>();
using var redis = clientsManager.GetClient();

redis.IncrementValue("counter");
List<string> days = redis.GetAllItemsFromList("days");

//Access Typed API
var redisTodos = redis.As<Todo>();

redisTodos.Store(new Todo {
    Id = redisTodos.GetNextSequence(),
    Content = "Learn Redis",
});

var todo = redisTodos.GetById(1);

//Access Native Client
var redisNative = (IRedisNativeClient)redis;

redisNative.Incr("counter");
List<string> days = redisNative.LRange("days", 0, -1);
```

A more detailed list of the available RedisClient APIs used in the example can be seen in the C# interfaces below:

- [IRedisClientsManager](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisClientsManager.cs)
- [IRedisClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisClient.cs)
- [IRedisNativeClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisNativeClient.cs)
- [IRedisSubscription](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisSubscription.cs)

#### Pipeline & Transaction APIs

- [IRedisTransaction](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisTransaction.cs)
- [IRedisPipelineShared](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Pipeline/IRedisPipelineShared.cs)
- [IRedisQueueableOperation](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Pipeline/IRedisQueueableOperation.cs)
- [IRedisQueueCompletableOperation](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Pipeline/IRedisQueueCompletableOperation.cs)

#### Generic Client APIs

- [IRedisTypedClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Generic/IRedisTypedClient.cs)
- [IRedisHash](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Generic/IRedisHash.Generic.cs)
- [IRedisList](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Generic/IRedisList.Generic.cs)
- [IRedisSet](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Generic/IRedisSet.Generic.cs)
- [IRedisSortedSet](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Generic/IRedisSortedSet.Generic.cs)
- [IRedisTypedQueueableOperation](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Generic/IRedisTypedQueueableOperation.cs)

#### Server Collection APIs

- [IRedisHash](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisHash.cs)
- [IRedisList](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisList.cs)
- [IRedisSet](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisSet.cs)
- [IRedisSortedSet](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisSortedSet.cs)

### Async Redis

The async support in ServiceStack.Redis is designed for optimal efficiency and uses `ValueTask` & other modern Async APIs only available in **.NET Standard 2.0** and **.NET Framework v4.7.2+** projects where there's async API equivalents for most sync APIs as contained within the Async Redis interfaces below:

- [IRedisClientsManagerAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisClientsManagerAsync.cs)
- [IRedisClientAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisClientAsync.cs)
- [IRedisNativeClientAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisNativeClientAsync.cs)
- [IRedisSubscriptionAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisSubscriptionAsync.cs)

#### Async Pipeline & Transaction APIs

- [IRedisTransactionAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisTransactionAsync.cs)
- [IRedisPipelineSharedAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Pipeline/IRedisPipelineSharedAsync.cs)
- [IRedisQueueableOperationAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Pipeline/IRedisQueueableOperationAsync.cs)
- [IRedisQueueCompletableOperationAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Pipeline/IRedisQueueCompletableOperationAsync.cs)

#### Async Generic Client APIs

- [IRedisTypedClientAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Generic/IRedisTypedClientAsync.cs)
- [IRedisHashAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Generic/IRedisHash.Generic.Async.cs)
- [IRedisListAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Generic/IRedisList.Generic.Async.cs)
- [IRedisSetAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Generic/IRedisSet.Generic.Async.cs)
- [IRedisSortedSetAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Generic/IRedisSortedSet.Generic.Async.cs)
- [IRedisTypedTransactionAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Generic/IRedisTypedTransactionAsync.cs)
- [IRedisTypedQueueableOperationAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/Generic/IRedisTypedQueueableOperationAsync.cs)

#### Async Server Collection APIs

- [IRedisHashAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisHashAsync.cs)
- [IRedisListAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisListAsync.cs)
- [IRedisSetAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisSetAsync.cs)
- [IRedisSortedSetAsync](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisSortedSetAsync.cs)

