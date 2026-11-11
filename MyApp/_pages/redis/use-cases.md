---
slug: use-cases
title: Solving Problems with Redis
---

Redis is more than a cache. Each of its data structures has operations that are atomic, run in memory and are
shared by every app server, so problems that need coordination, ordering or counting across servers often have a
short solution in Redis. This page maps common application problems to the structure and ServiceStack.Redis APIs
that solve them, with a link to a complete recipe for each.

<use-case-map>
</use-case-map>

## The data structures

Every solution builds on a handful of structures. Choosing one is mostly a matter of how the data is read:

<data-structure-guide>
</data-structure-guide>

## A taste of each

The snippets below are the core of each recipe; follow the links for complete, tested implementations and their
trade-offs. They all use a client from a registered `IRedisClientsManager`:

```csharp
using var redis = redisManager.GetClient();
```

### Cache a query

```csharp
var product = cache.GetOrCreate($"product:{id}", TimeSpan.FromMinutes(10),
    () => db.SingleById<Product>(id));
```

[Caching Patterns](/redis/caching-patterns) adds stampede protection, tags, generations and a two-tier cache.

### Limit requests across servers

```csharp
var count = redis.ExecLuaAsInt("""
    local count = redis.call('INCR', KEYS[1])
    if count == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
    return count
    """, new[] { $"ratelimit:{userId}" }, new[] { "60000" });

if (count > 100) throw new HttpError(429, "TooManyRequests", "Rate limit exceeded");
```

[Rate Limiting](/redis/rate-limiting) covers sliding windows, token buckets and a global request filter.

### Rank players

```csharp
redis.IncrementItemInSortedSet("leaderboard", playerId, points);
var top10 = redis.GetRangeWithScoresFromSortedSetDesc("leaderboard", 0, 9);
long myRank = redis.GetItemIndexInSortedSetDesc("leaderboard", playerId);
```

[Leaderboards](/redis/leaderboards) adds neighbours, percentiles and daily or weekly boards.

### Process work in the background

```csharp
redis.EnqueueItemOnList("queue:emails", email.ToJson());                         // producer
var json = redis.BlockingDequeueItemFromList("queue:emails", TimeSpan.FromSeconds(5)); // worker
```

[Queues](/redis/queues) makes it reliable, adds delayed and priority jobs, and compares Streams, Redis MQ and
Background Jobs.

### Count unique visitors

```csharp
redis.AddToHyperLog($"visitors:{date}", visitorId);
long uniques = redis.CountHyperLog($"visitors:{date}");
```

[Counters & Analytics](/redis/analytics) covers time buckets, bitmaps and exporting to a database.

### Find what's nearby

```csharp
redis.AddGeoMember("stores", longitude, latitude, "store:42");
var nearest = redis.FindGeoResultsInRadius("stores", lng, lat, 10, RedisGeoUnit.Kilometers,
    count: 5, sortByNearest: true);
```

[Geospatial](/redis/geo) adds live tracking of moving objects and geofencing.

### Run something on one server at a time

```csharp
using (redis.AcquireLock("lock:nightly-report", TimeSpan.FromMinutes(5)))
{
    GenerateNightlyReport();
}
```

[Distributed Locking](/redis/distributed-locking) explains timeouts and lock lifetimes.

### Show who's online

```csharp
redis.SetEntryInHash("presence:room:42", userId, "online");
redis.HPExpire("presence:room:42", 30_000, new[] { userId }); // Redis 7.4+
List<string> online = redis.GetHashKeys("presence:room:42");
```

[Hash Field Expiration](/redis/hash-field-expiration#presence-with-per-field-expiry) explains per-field lifetimes.

### Notify every server

```csharp
redis.PublishMessage("cache:invalidate", "product:42");
```

[Redis Pub/Sub](/redis/pubsub) runs a managed, auto-reconnecting subscriber in the background.

### Process an event log

```csharp
redis.AddStreamEntry("orders", new OrderPlaced { OrderId = 42 });
```

[Redis Streams](/redis/streams) covers consumer groups, acknowledgments and recovering stalled messages.

## Production guidance

- **Use one pooled manager.** Register a single `RedisManagerPool` as a singleton, borrow a client per operation
  and dispose it straight away. See [Client Managers](/redis/client-managers).
- **Never share a client between threads.** A client is a single connection; concurrent use corrupts its
  responses. See [Troubleshooting](/redis/troubleshooting).
- **Make multi-step updates atomic.** Use a [transaction](/redis/transactions) for a fixed set of writes, and a
  [Lua script](/redis/lua) when a write depends on a value read in the same step.
- **Expire what you create.** Caches, counters, rate limits and temporary results should all expire, so nothing
  depends on a cleanup job to bound memory.
- **Plan for failover.** Use [Redis Sentinel](/redis/sentinel) for high availability, and remember that writes
  not yet replicated when a master fails can be lost.
