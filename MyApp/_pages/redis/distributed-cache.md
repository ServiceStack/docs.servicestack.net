---
slug: distributed-cache
title: Microsoft IDistributedCache
---

**ServiceStack.Redis** includes Microsoft `IDistributedCache` integration for **.NET 10**. It uses existing
Redis client managers, stores payloads as raw bytes and supports absolute and sliding expiration with atomic
expiry refresh. No additional ServiceStack package is needed: the adapter and its Microsoft caching/DI package
references are only included in the `net10.0` build, so the `net472`, `net6.0` and `net8.0` targets don't expose
these APIs or take on these dependencies.

:::youtube bb5ThR6ZV9w
Redis Caching in .NET: IDistributedCache, HybridCache and Atomic TTLs
:::

## Registration

```csharp
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.DependencyInjection;
using ServiceStack.Redis;

builder.Services.AddServiceStackRedisCache("localhost:6379", options => {
    options.KeyPrefix = "myapp:distributed-cache:v1:";
});
```

This creates one lazy `RedisManagerPool`, owned and disposed by the cache registration. The cache is registered
as a singleton. An existing `IDistributedCache` registration is preserved; repeated calls do not replace it.

To share a manager already registered in DI:

```csharp
builder.Services.AddSingleton<IRedisClientsManager>(_ => new RedisManagerPool("localhost:6379"));
builder.Services.AddServiceStackRedisCache(options => {
    options.KeyPrefix = "myapp:distributed-cache:v1:";
});
```

The existing manager keeps its existing owner. A manager created by a DI singleton factory is disposed by DI;
an externally supplied instance remains externally owned. The cache adapter does not independently dispose
shared managers.

For dedicated manager configuration, the factory overload transfers ownership of a **new** manager to the cache:

```csharp
builder.Services.AddServiceStackRedisCache(_ => new RedisManagerPool("localhost:6379", new RedisPoolConfig {
    MaxPoolSize = 10,
    MaxLiveConnections = 20,
    MaxWaitingClients = 100,
    PoolTimeout = 2000
}), options => options.KeyPrefix = "myapp:distributed-cache:v1:");
```

Options are copied at registration/construction. Direct construction is also supported with
`new RedisDistributedCache(manager, options)`; direct instances leave the manager externally owned unless
`ownsManager: true` is explicitly supplied. The manager must implement both `IRedisClientsManager` and
`IRedisClientsManagerAsync`, and leased clients must provide the corresponding native client APIs.

## Binary Data and Expiration

Inject `IDistributedCache` and use its standard operations or Microsoft string extensions:

```csharp
await cache.SetStringAsync("status", "ready", new DistributedCacheEntryOptions {
    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
    SlidingExpiration = TimeSpan.FromMinutes(2)
}, token);

string status = await cache.GetStringAsync("status", token);
await cache.RefreshAsync("status", token);
await cache.RemoveAsync("status", token);
```

<sliding-expiry-timeline>
</sliding-expiry-timeline>

- `Get` / `GetAsync` returns `null` for a miss and preserves stored zero-length arrays.
- `Set` / `SetAsync` accepts raw `byte[]`; the adapter adds no JSON payload envelope.
- Absolute expiration can use a `DateTimeOffset` or an interval relative to Set. If both absolute options are
  supplied, the relative interval takes precedence. Past absolute deadlines are rejected before acquisition.
- Get and explicit Refresh extend sliding expiry while respecting the stored absolute deadline. Refreshing a
  missing or expired entry does not recreate it.
- Set replaces all expiry metadata and clears an old TTL when the new entry has no expiration.
- Expiration has millisecond precision, rounded up for positive sub-millisecond durations. Absolute deadlines
  are computed from client UTC at Set; Redis TIME enforces the stored deadline during atomic operations.

Set, Get/refresh and explicit Refresh execute as atomic Lua operations on one hash key. A concurrent refresh
cannot apply old metadata to a replacement value. An entry whose absolute deadline passes while waiting for a
lease is removed when Set reaches Redis. Even reads borrow **writer** leases because expiry refresh can mutate
state. The adapter does not expose transaction/pipeline batching.

Async calls pass cancellation tokens through pool acquisition and commands, including default async connection
setup. Legacy/custom synchronous resolution retains its existing timeout behavior. Cancellation can leave an uncertain write outcome; it does not prove that
a mutation was undone. Leases are returned on success, errors and cancellation.

## Namespace and Server Requirements

The default prefix is `ss:cache:v1:`. Configure a distinct, nonempty prefix per application/cache
sharing a database. This prefix is independent of a manager's `NamespacePrefix`. Entries use a private versioned
hash format containing raw data and expiry metadata. Use a fresh prefix when migrating data from another cache
provider; existing ServiceStack cache/entity keys remain separate.

Requires **Redis 5+** with `EVAL`, `EVALSHA`, `TIME`, `HGET`, `HEXISTS`, `HMGET`, `HMSET`, `PEXPIRE`, `PERSIST` and `DEL`
permissions, plus normal connection/authentication commands. Script/ACL/server errors propagate without a
non-atomic fallback. Scripts run by SHA1 with `EVALSHA`; if the server's script cache was flushed
(`NOSCRIPT`), the adapter reruns the call with `EVAL`, which also reloads the script. Validation covered Redis 6.2.24, Redis 8.10.1 and Valkey 8.1.11 on .NET 10. The cache adapter
is available only in the `net10.0` build of ServiceStack.Redis.

## HybridCache

Install Microsoft's `Microsoft.Extensions.Caching.Hybrid` package in the consuming application and register it
alongside the adapter:

```csharp
builder.Services.AddServiceStackRedisCache("localhost:6379",
    options => options.KeyPrefix = "myapp:hybrid:v1:");
builder.Services.AddHybridCache();
```

HybridCache supplies serialization, its local cache and coordination within each instance; the adapter supplies
the distributed byte storage. Separate HybridCache instances keep independent local caches. This registration
adds no cross-process stampede coordination or local-cache invalidation backplane. Integration was verified
with HybridCache 10.11.0 using independent service providers reading the same Redis L2 after publication.
