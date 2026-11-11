---
slug: analytics
title: Counters and Real-time Analytics
---

Redis updates counters atomically in memory, so every app server can record page views, API calls and
active users into the same keys, thousands of times a second, without locks or database writes. This page
covers exact counters, time-bucketed statistics, and the probabilistic and bit-level structures that count
millions of unique items in kilobytes.

## Atomic counters

`IncrementValue` and `IncrementValueBy` add to an integer and return the new value. Concurrent increments
from different servers are never lost:

```csharp
long views = redis.IncrementValue($"views:post:{postId}");
long credits = redis.IncrementValueBy($"credits:{userId}", -5);   // decrement with a negative count
double total = redis.IncrementValueBy("revenue:today", 19.99);    // floating point
```

Keep several counters for one entity in a Hash, so they're read in one call and stored compactly:

```csharp
redis.IncrementValueInHash($"stats:post:{postId}", "views", 1);
redis.IncrementValueInHash($"stats:post:{postId}", "likes", 1);

Dictionary<string, string> stats = redis.GetAllEntriesFromHash($"stats:post:{postId}");
// { views: "1", likes: "1" }
```

## Time-bucketed statistics

Put the period in the key, e.g. one Hash per day with a field per page, and give each bucket an expiry so
history is retained for a fixed time without cleanup jobs. A pipeline sends all the updates in one round trip:

```csharp
public static void TrackPageView(IRedisClient redis, string path, string visitorId, DateTime day)
{
    var date = day.ToString("yyyy-MM-dd");
    using var pipeline = redis.CreatePipeline();
    pipeline.QueueCommand(r => r.IncrementValueInHash($"pageviews:{date}", path, 1));
    pipeline.QueueCommand(r => r.AddToHyperLog($"visitors:{date}", visitorId));
    pipeline.QueueCommand(r => r.ExpireEntryIn($"pageviews:{date}", TimeSpan.FromDays(90)));
    pipeline.QueueCommand(r => r.ExpireEntryIn($"visitors:{date}", TimeSpan.FromDays(90)));
    pipeline.Flush();
}

TrackPageView(redis, "/pricing", visitorId, DateTime.UtcNow);

var today = redis.GetAllEntriesFromHash($"pageviews:{DateTime.UtcNow:yyyy-MM-dd}");
// { "/pricing": "3", "/docs": "12", ... }
```

Choose the bucket size from how the data is read: per-minute buckets for a live dashboard, per-day buckets for
reports. Reading a range is one `GetAllEntriesFromHash` per bucket, which can itself be pipelined.

## Unique visitors with HyperLogLog

Counting unique items exactly means storing every item. A HyperLogLog estimates the count of unique items in
a fixed ~12 KB, however many there are, with a standard error of 0.81%:

```csharp
redis.AddToHyperLog($"visitors:{date}", visitorId);   // PFADD
long uniques = redis.CountHyperLog($"visitors:{date}"); // PFCOUNT
```

HyperLogLogs merge without double-counting, so unique visitors over a week are the union of the daily ones,
not their sum:

```csharp
public static long UniqueVisitors(IRedisClient redis, DateTime from, DateTime to)
{
    var keys = new List<string>();
    for (var d = from.Date; d <= to.Date; d = d.AddDays(1))
        keys.Add($"visitors:{d:yyyy-MM-dd}");

    var merged = $"visitors:{from:yyyy-MM-dd}..{to:yyyy-MM-dd}";
    redis.MergeHyperLogs(merged, keys.ToArray());          // PFMERGE
    redis.ExpireEntryIn(merged, TimeSpan.FromHours(1));
    return redis.CountHyperLog(merged);
}
```

A visitor seen on Monday and Tuesday is counted once. You can't list or remove the items in a HyperLogLog;
it only answers "how many".

## Daily active users with bitmaps

When users have sequential integer IDs, a bitmap stores one bit per user: bit `userId` is set when that user
was active. A million users take 128 KB per day, and the count is exact:

```csharp
var native = (IRedisNativeClient)redis;
native.SetBit($"active:{date}", userId, 1);                        // SETBIT

bool wasActive = native.GetBit($"active:{date}", userId) == 1;      // GETBIT
long dau = long.Parse(redis.Custom("BITCOUNT", $"active:{date}").Text);
```

Combine days with `BITOP` through `Custom`, e.g. users active on every day of a week (`AND`) or on any day
(`OR`), then `BITCOUNT` the result:

```csharp
redis.Custom("BITOP", "AND", "active:week-all",
    "active:2026-11-09", "active:2026-11-10", "active:2026-11-11");
long activeEveryDay = long.Parse(redis.Custom("BITCOUNT", "active:week-all").Text);
```

A bitmap is as large as its highest set bit, so it only suits dense integer IDs: setting bit 2,000,000,000
allocates 256 MB. Use a HyperLogLog for string or sparse IDs.

## Choosing a structure for unique counts

We measured each structure with `MEMORY USAGE` after adding the same 1,000,000 unique IDs on Redis 8:

<unique-count-memory>
</unique-count-memory>

| | Set | HyperLogLog | Bitmap |
| --- | --- | --- | --- |
| Memory for 1M IDs | 37.3 MB | 14 KB | 128 KB |
| Count | Exact | ±0.81% (999,674 here) | Exact |
| "Is X in it?" | Yes, `SetContainsItem` | No | Yes, `GetBit` |
| List the members | Yes | No | Scan the bits |
| IDs | Any string | Any string | Dense integers |
| Combine | `SUNION`, `SINTER`, `SDIFF` | `PFMERGE` (union) | `BITOP AND/OR/XOR/NOT` |

## Trending and top-N

To rank items by activity, increment their score in a Sorted Set and read the highest scores. For example,
the most-viewed pages today:

```csharp
redis.IncrementItemInSortedSet($"top-pages:{date}", path, 1);
var top10 = redis.GetRangeWithScoresFromSortedSetDesc($"top-pages:{date}", 0, 9);
```

See [Leaderboards](/redis/leaderboards) for ranks, ranges and combining periods.

## Exporting to a database

Redis is ideal for collecting high-frequency counters, but long-term reporting belongs in a database. Run a
periodic job that reads completed buckets and writes them with [OrmLite](/ormlite/):

```csharp
var date = DateTime.UtcNow.AddDays(-1).ToString("yyyy-MM-dd");
var views = redis.GetAllEntriesFromHash($"pageviews:{date}");
var uniques = redis.CountHyperLog($"visitors:{date}");

db.InsertAll(views.Select(x => new PageViewStat {
    Date = date, Path = x.Key, Views = long.Parse(x.Value),
}));
db.Insert(new DailyStat { Date = date, UniqueVisitors = uniques });
```

Only export buckets for completed periods, so the export never misses late increments to the current one.
[Background Jobs](/jobs/) can run the export as a recurring job.

## Async

Every API used on this page has an async equivalent on `IRedisClientAsync`:

```csharp
await using var redis = await redisManager.GetClientAsync(token);
long views = await redis.IncrementValueAsync($"views:post:{postId}", token);
await redis.IncrementValueInHashAsync($"stats:post:{postId}", "likes", 1, token);
await redis.AddToHyperLogAsync($"visitors:{date}", new[] { visitorId }, token);
long uniques = await redis.CountHyperLogAsync($"visitors:{date}", token);
```
