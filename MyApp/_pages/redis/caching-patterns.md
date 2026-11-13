---
slug: caching-patterns
title: Redis Caching Patterns
---

Caching is the most common reason teams add Redis to an app, and the hard parts are not storing a value:
they are keeping it fresh, stopping a popular key's expiry from flooding your database, and removing related
entries together. This page covers the patterns that solve those problems, from a one-line cache-aside to a
two-tier cache shared across app servers.

<cache-pattern-map>
</cache-pattern-map>

All examples use a `RedisManagerPool` registered as a singleton, with `ICacheClient` resolved from it:

```csharp
services.AddSingleton<IRedisClientsManager>(c => 
    new RedisManagerPool("localhost:6379"));
services.AddSingleton<ICacheClient>(c => 
    c.GetRequiredService<IRedisClientsManager>().GetCacheClient());
```

`ICacheClient` serializes POCOs as JSON, and the same calls work against the In-Memory, OrmLite and DynamoDB
[caching providers](/caching). Drop down to `IRedisClient` when a pattern needs a Redis-specific command.

## Cache-aside

The default pattern: read from the cache, and on a miss, load from the source of truth and populate the cache
for next time. `GetOrCreate` does this in one call:

```csharp
public class ProductServices(ICacheClient cache) : Service
{
    public object Any(GetProduct request) =>
        cache.GetOrCreate($"product:{request.Id}", TimeSpan.FromMinutes(10),
            () => Db.SingleById<Product>(request.Id));
}
```

The async version takes a `Func<Task<T>>`:

```csharp
public async Task<object> Any(GetProduct request) =>
    await CacheAsync.GetOrCreateAsync($"product:{request.Id}", TimeSpan.FromMinutes(10),
        () => Db.SingleByIdAsync<Product>(request.Id));
```

Always give cached entries an expiry. It caps how long stale data can survive a missed invalidation, and it
keeps memory bounded even when keys are never read again.

The Redis `ICacheClient` writes a value and its expiry in one atomic command, including the `Set`, `Add` and
`Replace` overloads that take an absolute `DateTime` expiry (using `SET PXAT` on Redis 6.2+, or an atomic Lua
script on older servers), so a dropped connection can't leave a key cached without a TTL.

::: tip
`GetOrCreate` treats `default(T)` as a miss, so a `null` result is never cached and every request for a
missing row reaches the database. If misses are common, cache a sentinel value, e.g. an empty DTO, with a
short expiry.
:::

For whole Service responses, the declarative [[CacheResponse] attribute](/cacheresponse-attribute) caches the
serialized output, including per-user and per-QueryString variations, without writing any caching code.

## Add jitter to expirations

Entries written at the same time with the same TTL also expire at the same time. After a deploy or cache flush,
that can produce a wave of simultaneous misses. Spread expirations out with a small random offset:

```csharp
public static TimeSpan WithJitter(TimeSpan expireIn, double maxJitter = 0.1) =>
    expireIn + TimeSpan.FromMilliseconds(
        Random.Shared.NextDouble() * expireIn.TotalMilliseconds * maxJitter);

cache.Set($"product:{id}", product, WithJitter(TimeSpan.FromMinutes(10))); // 10-11 minutes
```

## Stop cache stampedes

When a hot key expires, every request that misses at the same moment recomputes the value, and an expensive
query that normally runs once can run hundreds of times at once. The fix is to let only one caller rebuild it,
using an atomic `SET NX` with an expiry as a short-lived lock:

<stampede-comparison>
</stampede-comparison>

```csharp
public static T GetOrCreateOnce<T>(this IRedisClient redis, string key, TimeSpan expireIn,
    Func<T> createFn, TimeSpan? waitFor = null) where T : class
{
    var value = redis.Get<T>(key);
    if (value != null) return value;

    var lockKey = key + ":rebuilding";
    var waitUntil = DateTime.UtcNow + (waitFor ?? TimeSpan.FromSeconds(5));
    while (DateTime.UtcNow < waitUntil)
    {
        // Only the caller that creates the lock key rebuilds the value
        if (redis.SetValueIfNotExists(lockKey, "1", TimeSpan.FromSeconds(30)))
        {
            try
            {
                value = createFn();
                redis.Set(key, value, expireIn);
                return value;
            }
            finally
            {
                redis.RemoveEntry(lockKey);
            }
        }

        Thread.Sleep(50); // Everyone else waits for the rebuilt value
        value = redis.Get<T>(key);
        if (value != null) return value;
    }
    return createFn(); // The rebuild is taking too long, fall back to loading it ourselves
}
```

With 20 concurrent callers hitting an expired key, `createFn` runs exactly once and every caller receives the
rebuilt value:

```csharp
using var redis = redisManager.GetClient();
var report = redis.GetOrCreateOnce("report:daily", TimeSpan.FromMinutes(5),
    () => BuildDailyReport());
```

Choose a lock expiry comfortably longer than the slowest rebuild. The expiry is what recovers from a process
that crashes while holding the lock; if it is shorter than the rebuild, a second caller can start rebuilding too.

## Sliding expiration

Session-like data should stay cached while it's in use and expire once it goes idle. On Redis 6.2+,
`GetAndExpireValue` reads a value and resets its expiry in a single `GETEX` command:

```csharp
using var redis = redisManager.GetClient();
string session = redis.GetAndExpireValue($"session:{sessionId}",
    new RedisGetExOptions { ExpirySeconds = 20 * 60 }); // idle timeout: 20 minutes
```

Because it's one command, no other client can observe the value between the read and the expiry reset.
Use `RedisGetExOptions.Persist = true` to remove the expiry instead. See
[Atomic Key Commands](/redis/client#atomic-key-commands) for all options.

## Invalidate related entries with tags

Entries often need to be invalidated as a group: every cached product in a category, or every response that
includes a customer's data. Record each key in a Redis Set for each tag it belongs to, in the same transaction
that stores the value:

```csharp
public static void SetWithTags<T>(IRedisClient redis, string key, T value, TimeSpan expireIn,
    params string[] tags)
{
    using var trans = redis.CreateTransaction();
    trans.QueueCommand(r => r.Set(key, value, expireIn));
    foreach (var tag in tags)
    {
        trans.QueueCommand(r => r.AddItemToSet(tag, key));
        // Let the tag outlive its entries, then expire with them
        trans.QueueCommand(r => r.ExpireEntryIn(tag, expireIn + TimeSpan.FromMinutes(1)));
    }
    trans.Commit();
}

SetWithTags(redis, "product:10", product10, TimeSpan.FromMinutes(10), "tag:category:tools");
SetWithTags(redis, "product:11", product11, TimeSpan.FromMinutes(10), "tag:category:tools", "tag:brand:acme");
```

Invalidating a tag must read its members and delete them without another client adding a key in between.
A small Lua script does both atomically on the server:

```csharp
const string InvalidateTagLua = """
    local keys = redis.call('SMEMBERS', KEYS[1])
    for i = 1, #keys, 500 do
        redis.call('UNLINK', unpack(keys, i, math.min(i + 499, #keys)))
    end
    redis.call('UNLINK', KEYS[1])
    return #keys
    """;

public static long InvalidateTag(IRedisClient redis, string tag) =>
    redis.ExecLuaAsInt(InvalidateTagLua, new[] { tag }, Array.Empty<string>());

InvalidateTag(redis, "tag:category:tools"); // removes product:10 and product:11
```

`UNLINK` reclaims memory in a background thread, so a tag with thousands of large entries doesn't block
the server. The script deletes keys it reads from the Set rather than keys passed in `KEYS`, so it's suited to
standalone Redis and Sentinel, not Redis Cluster.

## Invalidate a namespace with generations

When a whole class of entries goes stale at once, such as after a catalog import, you don't need to find and
delete them. Include a generation number in each key, and increment it to switch every reader to new keys:

```csharp
public static string GenerationKey(IRedisClient redis, string ns, string key) =>
    $"{ns}:v{redis.GetValue($"{ns}:gen") ?? "0"}:{key}";

var key = GenerationKey(redis, "catalog", $"product:{id}"); // catalog:v0:product:1
redis.Set(key, product, TimeSpan.FromMinutes(10));

redis.IncrementValue("catalog:gen");                         // readers now use catalog:v1:...
```

Invalidation is a single `INCR`, regardless of how many entries exist. The orphaned entries are never read
again and are removed by their expiry, so this pattern requires every entry to have one.

## Delete keys by pattern

To remove keys that share a prefix, `UnlinkByPattern` (v10.5) scans with cursor-based `SCAN` in batches and
deletes each batch with `UNLINK`, without the server-blocking `KEYS` command:

```csharp
long removed = redis.UnlinkByPattern("product:*");

// or with IRedisClientAsync
removed = await redisAsync.UnlinkByPatternAsync("product:*", token: token);
```

A pattern scan visits every key in the database, so prefer tags or generations for invalidation on hot paths
and keep pattern deletes for maintenance tasks. See
[SCAN + UNLINK Pattern Cleanup](/redis/client#scan-unlink-pattern-cleanup) for its guarantees.

## Two-tier cache with Pub/Sub invalidation

Reading from Redis costs a network round trip. For small, very hot values, keep a short-lived copy in each app
server's memory and use Redis Pub/Sub to tell every server to evict its copy when the value changes:

<two-tier-cache>
</two-tier-cache>

```csharp
public sealed class TwoTierCache : IDisposable
{
    const string Channel = "cache:invalidate";
    readonly IRedisClientsManager redisManager;
    readonly ICacheClient local;
    readonly RedisPubSubServer subscriber;

    public TwoTierCache(IRedisClientsManager redisManager, ICacheClient local)
    {
        this.redisManager = redisManager;
        this.local = local;
        // Every app server evicts its in-memory copy when any server invalidates a key
        subscriber = new RedisPubSubServer(redisManager, Channel) {
            OnMessage = (channel, key) => local.Remove(key),
        };
        subscriber.Start();
    }

    public T GetOrCreate<T>(string key, TimeSpan expireIn, Func<T> createFn) where T : class
    {
        var value = local.Get<T>(key);
        if (value != null) return value;

        using var redis = redisManager.GetClient();
        value = redis.Get<T>(key);
        if (value == null)
        {
            value = createFn();
            redis.Set(key, value, expireIn);
        }
        // Keep the local copy short-lived so a missed message can only serve stale data briefly
        local.Set(key, value, TimeSpan.FromSeconds(30));
        return value;
    }

    public void Invalidate(string key)
    {
        using var redis = redisManager.GetClient();
        redis.RemoveEntry(key);
        redis.PublishMessage(Channel, key);
    }

    public void Dispose() => subscriber.Dispose();
}
```

Register it as a singleton with a `MemoryCacheClient` for the local tier:

```csharp
services.AddSingleton(c => new TwoTierCache(
    c.GetRequiredService<IRedisClientsManager>(), new MemoryCacheClient()));
```

Redis Pub/Sub is fire-and-forget: a server that is disconnected when the message is published never receives
it. `RedisPubSubServer` reconnects automatically, and the short local expiry bounds how long a missed
invalidation can serve stale data. Keep the local tier for data where that bound is acceptable.

## Microsoft IDistributedCache and HybridCache

Libraries written against ASP.NET Core's `IDistributedCache`, including `HybridCache` and output caching, can
store their entries in Redis through ServiceStack.Redis. See [IDistributedCache](/redis/distributed-cache).

## Production checklist

- **Expire everything.** An expiry is the safety net for every missed invalidation.
- **Configure an eviction policy.** Set `maxmemory` and `maxmemory-policy allkeys-lru` (or `allkeys-lfu`) on
  servers used only for caching, so Redis evicts old entries instead of rejecting writes when full.
- **Namespace your keys.** A consistent `{type}:{id}` scheme makes tags, generations and pattern cleanup possible.
- **Treat the cache as optional.** Catch Redis errors on reads and fall back to the source of truth, so a cache
  outage slows your app down instead of taking it down.
- **Watch the hit rate.** `INFO stats` reports `keyspace_hits` and `keyspace_misses`; [Redis Stats](/redis/stats)
  shows pool and command counters for the client.
