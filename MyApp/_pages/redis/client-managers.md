---
slug: client-managers
title: Managing connections
---

## Redis Connection Strings

Redis Connection strings have been expanded to support the more versatile URI format which is now able to capture most of Redis Client
settings in a single connection string (akin to DB Connection strings).

Redis Connection Strings supports multiple URI-like formats, from a simple **hostname** or **IP Address and port** pair to a
fully-qualified **URI** with multiple options specified on the QueryString.

<connection-anatomy>
</connection-anatomy>

Some examples of supported formats:

```
localhost
127.0.0.1:6379
redis://localhost:6379
password@localhost:6379
clientid:password@localhost:6379
redis://clientid:password@localhost:6380?ssl=true&db=1
[::1]:6379
rediss://redis.example
rediss://user:p%40ss@redis.example:6380/2
```

`rediss://` URIs connect over TLS and use standard Redis URI semantics, i.e. `user:password@` are
[ACL credentials](https://redis.io/docs/latest/operate/oss_and_stack/management/security/acl/) (URL-encoded)
and the optional path is the database number. IPv6 addresses need to be wrapped in brackets.
See [IPv6 and Redis URI Endpoints](#ipv6-and-opt-in-redis-uri-endpoints) for details.

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
        <td>Timeout in ms for TCP connection; async setup shares this budget across DNS, TCP, TLS and initialization</td>
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

Or as a standard `rediss://` TLS URI with the ACL credentials in the userinfo:

```csharp
var connString = $"rediss://{Username.UrlEncode()}:{Password.UrlEncode()}@{Host}";
var redisManager = new RedisManagerPool(connString);
```

### [Connecting to Azure Redis](/ssl-redis-azure)

As connecting to [Azure Redis Cache](http://azure.microsoft.com/en-us/services/cache/) via SSL was the primary use-case for this feature,
we've added a new
[Getting connected to Azure Redis via SSL](/ssl-redis-azure) to help you get started.

## IPv6 and Opt-in Redis URI Endpoints

Redis connections now support IPv6 literals and dual-stack DNS hosts. Bracket IPv6 addresses in connection
strings, e.g. `[::1]:6379`; endpoint formatting and pool failover preserve that form. Hostnames that resolve to
both IPv4 and IPv6 addresses try IPv4 first, so hosts reachable over IPv4 connect exactly as in earlier versions,
even when IPv6 is broken on the network.

`rediss://` opts into TLS URI semantics, with escaped ACL credentials and an optional database path:

```csharp
using var tls = new RedisClient("rediss://user:p%40ss@redis.example:6380/2");
var endpoint = RedisEndpoint.ParseUri("redis://user:p%40ss@[::1]:6379/2");
using var redis = new RedisClient(endpoint);
```

`RedisEndpoint.ParseUri` explicitly selects modern URI semantics for either scheme. Existing `redis://`
connection strings retain their client-name/password userinfo convention. Default ports are 6379 for `redis`
and 6380 for `rediss`; explicit ports take precedence. Supported query options include client name, namespace,
connection/send/receive/retry/idle timeouts and TLS protocols. Unknown or duplicate options and conflicting
SSL/auth/database query overrides are rejected. URI validation errors do not include credentials.

TLS certificate and hostname validation remain enabled, and clones preserve TLS and ACL configuration.
See [fully async connection setup](/redis/async#fully-async-connection-setup) for async DNS, connect and TLS behavior.

## Redis Client Managers

The recommended way to access `RedisClient` instances is to use one of the available Thread-Safe Client Managers below. Client Managers are connection factories which should be registered as a Singleton either in your IOC or static class.

<manager-picker>
</manager-picker>

Long-running work, like a blocking Streams consumer, should hold its own client from the pool for its lifetime
rather than borrowing one per command. This video builds a crash-safe work queue that does exactly that:

:::youtube RhNCEMj1gQA
Build a Redis Streams Work Queue in C# That Survives Worker Crashes
:::

### RedisManagerPool

With the enhanced Redis URI Connection Strings we've been able to simplify and streamline the existing `PooledRedisClientManager` implementation and have extracted it out into a new clients manager called `RedisManagerPool`.

In addition to removing all above options on the Client Manager itself, readonly connection strings have also been removed so the configuration ends up much simpler and more aligned with the common use-case:

```csharp
container.Register<IRedisClientsManager>(c => 
    new RedisManagerPool(redisConnectionString));
```

**Pooling Behavior**

By default, any connections required after the maximum Pool size has been reached will be created and disposed outside of the Pool. By not being restricted to a maximum pool size, the pooling behavior in `RedisManagerPool` can maintain a smaller connection pool size at the cost of potentially having a higher opened/closed connection count.

### Optional Bounded Admission

New in v10.5, `RedisManagerPool` can limit admitted clients independently of the number retained for reuse:

```csharp
using var pool = new RedisManagerPool("localhost:6379", new RedisPoolConfig {
    MaxPoolSize = 20,          // Retain up to 20 clients for reuse
    MaxLiveConnections = 40,  // Admit at most 40 clients, including creation/closing reservations
    MaxWaitingClients = 100,  // Queue at most 100 acquisitions when saturated
    PoolTimeout = 2000       // One pool-wait timeout in milliseconds
});

await using var redis = await ((IRedisClientsManagerAsync)pool).GetClientAsync(token);
await redis.PingAsync(token);
```

| Setting | Default | Behavior |
| --- | --- | --- |
| `MaxPoolSize` | Existing configured pool size | Maximum retained clients; this alone does not cap overflow |
| `MaxLiveConnections` | `null` | Unbounded overflow by default; a positive value enables bounded admission |
| `MaxWaitingClients` | `0` | Fail immediately at the live-client limit; a positive value allows bounded waiting |
| `PoolTimeout` | `30000` | Total admission wait deadline across notifications; `null` or `-1` allows an indefinite wait |

The waiting settings apply when `MaxLiveConnections` is configured. Settings are copied when constructing the
manager. Both sync and async acquisitions, including read-only aliases, share the same capacity. Sync callers
block on their own wait handle while queued, so waking them never needs a free thread-pool thread; async waiters
accept cancellation tokens. Queued callers are served in arrival order: each returned client or freed slot wakes
one waiter. A new caller arriving at the moment a client is returned can still take it first.

When the limit is reached with no waiting capacity, acquisition throws `InvalidOperationException` before
creating another client. A queued caller receives `TimeoutException` when its deadline expires,
`OperationCanceledException` when its token is cancelled, or `ObjectDisposedException` if the manager is disposed.
Repeated notifications do not restart the deadline. Default async acquisition also supports cancellable
connection setup and role verification, whether bounded admission is enabled or disabled.

Overflow clients above the retained pool size are closed on return. Creation reservations and clients still
closing count toward the cap. During failover, old active leases continue to count until returned and closed;
new callers cannot bypass the limit by creating replacements for those leases. Connections created against a
superseded topology are discarded before hand-off. Disposing the manager wakes waiters and closes its clients;
in-flight async creation observes caller cancellation and checks disposal before hand-off. Custom synchronous
creation is cleaned up when it returns.

The cap covers clients admitted by this manager, including idle retained clients. It is not a server-wide
connection limit: resolver discovery probes, custom factory internals and independently created clients are
outside that accounting. `PoolTimeout` bounds waiting for capacity; a positive `ConnectTimeout` separately
bounds async setup. Legacy blocking acquisition, Sentinel/custom synchronous resolvers and synchronous hooks
retain their execution behavior; see [async setup](/redis/async#fully-async-connection-setup).

In bounded mode, `GetStats()` adds `clientsLive`, `clientsCreating`, `clientsWaiting`, `clientsMaxLive` and
`clientsMaxWaiting`. `clientsLive` counts occupied capacity, including creation/closing reservations, rather
than only established sockets. Existing retained-pool statistics keep their existing meaning.

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

## Redis Configuration

In addition to configuring Redis Client Managers directly, management and behavior of Redis connections can also configured using the static [RedisConfig.cs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack.Redis/src/ServiceStack.Redis/RedisConfig.cs) class, e.g:

#### Configure Pool Size of Redis Client Managers

```csharp
RedisConfig.DefaultMaxPoolSize = 100;
```

Available Redis Client Configuration options and their defaults:

| Property | Default | Description |
| - | - | - |
| `DefaultConnectTimeout`         | **-1** (none)     | The default RedisClient Socket ConnectTimeout |
| `DefaultSendTimeout`            | **-1** (none)     | The default RedisClient Socket SendTimeout |
| `DefaultReceiveTimeout`         | **-1** (none)     | The default RedisClient Socket ReceiveTimeout |
| `DefaultIdleTimeOutSecs`        | **240** seconds   | Default Idle TimeOut before a connection is considered to be stale |
| `DefaultRetryTimeout`           | **10000** ms      | The default RetryTimeout for auto retry of failed operations |
| `DefaultMaxPoolSize`            | **null** (none)   | Max Pool Size for Pooled Redis Client Managers (overrides DefaultPoolSizeMultiplier) |
| `DefaultPoolSizeMultiplier`     | **50**            | The default pool size multiplier if no pool size is specified |
| `BackOffMultiplier`             | **10** ms         | The BackOff multiplier failed Auto Retries starts from |
| `CommandKeysBatchSize`          | **10000** keys    | Batch size of keys to include in a single Redis Command (e.g. DEL k1 k2...) |
| `VerifyMasterConnections`       | **true**          | Whether Connections to Master hosts should be verified they're still a master |
| `RetryReconnectOnFailedMasters` | **true**          | Whether to retry re-connecting on same connection if not a master instance |
| `HostLookupTimeoutMs`           | **200** ms        | The ConnectTimeout on clients used to find the next available host |
| `AssumeServerVersion`           | **null** (none)   | Skip ServerVersion Checks by specifying Min Version number |
| `DeactivatedClientsExpiry`      | **0** seconds     | How long to hold deactivated clients for before disposing their connection |
| `EnableVerboseLogging`          | **false**         | Whether Debug Logging should log detailed Redis operations |
| `AssertAccessOnlyOnSameThread`  | **false**         | Assert all access using pooled RedisClient instance is limited to same thread |


### [ServiceStack.Redis SSL Support](/ssl-redis-azure)

ServiceStack.Redis supports **SSL connections** making it suitable for accessing remote Redis server instances over a
**secure SSL connection**.

![Azure Redis Cache](https://github.com/ServiceStack/Assets/raw/master/img/wikis/redis/azure-redis-instance.png)

The simplest way to connect over TLS is with a `rediss://` URI, which defaults to port **6380**:

```csharp
var redisManager = new RedisManagerPool("rediss://user:p%40ss@redis.example:6380");
```

This is equivalent to `redis://redis.example:6380?ssl=true&username=user&password=p%40ss`.
TLS certificate and hostname validation are always enabled. With `rediss://` the credentials, database and SSL
must be specified in the URI itself, so `ssl`, `db`, `username` and `password` QueryString options are rejected.

#### Specify SSL Protocol

Support for changing the Ssl Protocols used for encrypted SSL connections can be set on the connection string using the `sslprotocols` modifier, e.g:

```csharp
var connString = $"redis://{Host}?ssl=true&sslprotocols=Tls12&password={Password.UrlEncode()}";
// or
var connString = $"rediss://:{Password.UrlEncode()}@{Host}?sslprotocols=Tls12";

var redisManager = new RedisManagerPool(connString);
using var client = redisManager.GetClient();
//...
```

If needed the `RedisConfig` Certificate selecation and validation callbacks can be used to [Validate SSL Certificates](http://msdn.microsoft.com/en-us/library/office/dd633677(v=exchg.80).aspx):

```csharp
RedisConfig.CertificateSelectionCallback = (object sender, 
    string targetHost, 
    X509CertificateCollection localCertificates,
    X509Certificate remoteCertificate, 
    string[] acceptableIssuers) => ...

RedisConfig.CertificateValidationCallback = (object sender,
    X509Certificate certificate,
    X509Chain chain,
    SslPolicyErrors sslPolicyErrors) => ...
```

### Read Only Clients

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

## [Redis GEO](https://github.com/ServiceStackApps/redis-geo)

The [release of Redis 3.2.0](http://antirez.com/news/104) brings [GEO capabilities](http://redis.io/commands/geoadd) 
which will let you store Lat/Long coordinates in Redis and query locations within a specified radius. 
To demonstrate this functionality we've created a new
[Redis GEO Live Demo](https://github.com/ServiceStackApps/redis-geo) which lets you click on anywhere in
the U.S. to find the list of nearest cities within a given radius, Live Demo at: https://redis.netcore.io


## Microsoft Distributed Cache

On .NET 10, ServiceStack.Redis includes a built-in [IDistributedCache adapter](/redis/distributed-cache) that exposes a ServiceStack.Redis manager through Microsoft `IDistributedCache`, including absolute/sliding expiration and HybridCache L2 support.
