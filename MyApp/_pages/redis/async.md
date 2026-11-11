---
slug: async
title: Redis Async APIs
---

All Redis Client Managers implement both `IRedisClientsManager` and `IRedisClientsManagerAsync` so IOC registrations remain the same which can continue to register against the existing `IRedisClientsManager` interface, e.g:

```csharp
container.Register<IRedisClientsManager>(c => 
    new RedisManagerPool(redisConnectionString));
```

Where it can be used to resolve both sync `IRedisClient` and async `IRedisClientAsync` clients, e.g:

```csharp
using var syncRedis = container.Resolve<IRedisClientsManager>().GetClient();
await using var asyncRedis = await container.Resolve<IRedisClientsManager>().GetClientAsync();
```

If you want to force async-only API usage could choose to just register `IRedisClientsManagerAsync` where it only lets you resolve async only `IRedisClientAsync` and `ICacheClientAsync` clients, e.g:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<IRedisClientsManagerAsync>(c => new RedisManagerPool());
}

//... 

public class MyDep(IRedisClientsManagerAsync manager)
{
    public async Task<long> Incr(string key, uint value)
    {
        await using var redis = await manager.GetClientAsync();
        return await redis.IncrementAsync(key, value);
    }
}
```

## Fully Async Connection Setup

From v10.5, async commands open cold connections using asynchronous DNS, TCP connect, TLS authentication,
AUTH (including ACL usernames), SELECT, CLIENT SETNAME and initial INFO discovery. The default RedisResolver
also verifies master roles asynchronously during manager acquisition. Async database resets on reused
PooledRedisClientManager leases run outside the pool lock.

```csharp
using var pool = new RedisManagerPool("localhost:6379?ConnectTimeout=2000");
await using var redis = await ((IRedisClientsManagerAsync)pool).GetClientAsync(token);
await redis.PingAsync(token);

// Optional eager setup on a concrete, exclusively used client:
using var direct = new RedisClient("rediss://redis.example:6380?ConnectTimeout=2000");
await direct.ConnectAsync(token);
```

A positive ConnectTimeout supplies one deadline across DNS addresses, TCP, TLS and connection initialization,
including the compatibility reconnect if INFO is unsupported. Default master resolution includes ROLE verification
in that budget. When a host resolves to several addresses, sync and async connections try IPv4 addresses
before IPv6, and give each attempt except the last an equal share of the remaining budget, so an unreachable
address can't consume all of it. Zero or
negative values add no connection deadline. Caller cancellation or a shorter command
SendTimeout can end setup earlier. Timeout throws TimeoutException; caller cancellation throws
OperationCanceledException and preserves the caller's token. An interrupted connection is closed before reuse.
PoolTimeout continues to bound capacity waiting separately; command send/receive timeouts retain their roles.

When master verification fails with a role or connection error, async resolution retries with backoff within
the endpoint's `RetryTimeout`, like the sync path. A `ConnectTimeout` expiry is not retried, since retrying
would restart the connection deadline. This means async acquisition can fail sooner than sync acquisition
while a failed master is unreachable.
Async EOF handling closes the interrupted connection and never opens a synchronous replacement from a response reader.

For asynchronous initialization, RedisClient and all three managers expose ConnectionFilterAsync:

```csharp
pool.ConnectionFilterAsync = async (client, cancellationToken) => {
    await client.PingAsync(cancellationToken);
};
```

Configure the hook before borrowing clients. It runs once on each connection opened asynchronously, after
OnConnected and the existing ConnectionFilter, and receives the connection deadline/cancellation token.
Use that token in asynchronous work. Synchronous connection APIs do not invoke this hook. Existing synchronous
hooks and client factories retain their execution behavior; user code that blocks cannot be interrupted.

RedisResolver and BasicRedisResolver implement the optional IRedisResolverAsync contract. Custom resolvers
can implement it to provide nonblocking creation/verification; existing custom resolvers and Sentinel discovery
keep their synchronous resolution policy. Subclasses overriding RedisResolver.CreateRedisClient also retain
that synchronous override during async acquisition, including its credential/TLS/routing configuration.
An explicit CreateRedisClientAsync override supplies the subclass's async implementation instead.
PooledRedisClientManager.UseGetClientBlocking=true retains legacy
blocking acquisition. On older target frameworks, cancellation stops awaiting DNS and observes late failures;
the underlying platform lookup may finish in the background without creating a client socket. TLS certificate
and hostname validation defaults are unchanged.

## Atomic Key Commands

The v10.5 key-command extensions also support `IRedisClientAsync`, including cancellation tokens:

```csharp
using var manager = new RedisManagerPool("localhost:6379");
await using var redis = await ((IRedisClientsManagerAsync)manager).GetClientAsync(token);

string value = await redis.GetAndExpireValueAsync("status", new RedisGetExOptions {
    ExpiryMilliseconds = 60_000
}, token);
string removed = await redis.GetAndDeleteValueAsync("status", token);
long count = await redis.UnlinkAsync(new[] { "large:key", "another:key" }, token);
```

Use a writer lease for all three operations. GETEX/GETDEL require Redis 6.2+; UNLINK requires Redis 4.0+.
The native `IRedisNativeClientAsync` extensions `GetExAsync` and `GetDelAsync` return raw bytes, while the rich
methods above return UTF-8 strings. Missing keys return `null`. Options, optional capability contracts and
unsupported-server behavior are described in [atomic key commands](/redis/client#atomic-key-commands).

Cancellation uses the existing async transport behavior. Once a command may have reached the server, cancellation
does not prove that its mutation was undone. Keep a borrowed client exclusive to one operation flow.

<async-pairs>
</async-pairs>

## Hash Field Expiration

The [hash-field expiration APIs](/redis/hash-field-expiration) include cancellation-aware async relative/absolute
expiry, TTL/deadline inspection and persistence methods. Results remain per field; malformed or interrupted
replies close/reset the connection before reuse. These commands require standalone calls and native server
support (Redis 7.4+ or compatible Valkey 9+).

## Streams

Sync/async Streams commands, typed JSON entries and explicit consumer-group recovery are available in v10.5. See the [Streams guide](/redis/streams) for usage, server requirements and blocking-connection semantics.

## Usage in ServiceStack

Inside ServiceStack Services & Controllers we recommend using `GetRedisAsync()` to resolve an `IRedisClientAsync`:

```csharp
public class MyService : Service
{
    public async Task<object> Any(MyRequest request)
    {
        await using var redis = await GetRedisAsync();
        await redis.IncrementAsync(nameof(MyRequest), 1);
    }
}

public class HomeController : ServiceStackController
{
    public async Task<ActionResult> Index()
    {
        await using var redis = await GetRedisAsync();
        await redis.IncrementAsync(nameof(HomeController), 1);
    }
}
```