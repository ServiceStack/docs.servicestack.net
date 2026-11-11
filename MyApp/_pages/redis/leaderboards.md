---
slug: leaderboards
title: Leaderboards and Rankings with Sorted Sets
---

A Sorted Set keeps its members ordered by a numeric score, and Redis maintains that order on every write.
Ranking, top-N, "your position" and score-range queries are all `O(log N)` lookups rather than a database
`ORDER BY` over the whole table. That makes Sorted Sets the natural fit for leaderboards, trending lists,
priority queues and anything else that's read in order.

<sorted-set-leaderboard>
</sorted-set-leaderboard>

## Record and update scores

`AddItemToSortedSet` sets a member's score, adding the member if it doesn't exist. `IncrementItemInSortedSet`
adds to the current score atomically and returns the new total, so concurrent updates from different servers
can't overwrite each other:

```csharp
const string Board = "leaderboard:global";

using var redis = redisManager.GetClient();
redis.AddItemToSortedSet(Board, "alice", 1200);
redis.AddItemToSortedSet(Board, "bob",    950);
redis.AddItemToSortedSet(Board, "carol", 1100);
redis.AddItemToSortedSet(Board, "dave",   700);
redis.AddItemToSortedSet(Board, "erin",  1300);

double bobScore = redis.IncrementItemInSortedSet(Board, "bob", 200); // 1150
```

Use the player's ID as the member and keep the profile in its own key, e.g. a Hash or a POCO stored with
the [typed client](/redis/typed-client). Sorted Set members are unique, so a player is never listed twice.

## Top N

`GetRangeWithScoresFromSortedSetDesc` returns members from highest to lowest score, with their scores, by
0-based rank range:

```csharp
IDictionary<string, double> top3 = redis.GetRangeWithScoresFromSortedSetDesc(Board, 0, 2);
// erin: 1300, alice: 1200, bob: 1150
```

The returned dictionary preserves rank order. Pages are just rank ranges: page `n` of size `20` is
`GetRangeWithScoresFromSortedSetDesc(Board, n * 20, n * 20 + 19)`. Use `GetRangeFromSortedSetDesc` when you only
need the members.

## A player's rank and score

```csharp
long rank = redis.GetItemIndexInSortedSetDesc(Board, "carol"); // 3, i.e. 4th place
double score = redis.GetItemScoreInSortedSet(Board, "carol");  // 1100
```

Ranks are 0-based. A member that isn't in the set returns a rank of `-1` and a score of `double.NaN`, so
check for both before displaying them.

## Players around me

Most players are nowhere near the top, so show them their neighbours instead. Read their rank, then the range
around it:

```csharp
public record RankedPlayer(long Rank, string Player, double Score);

public static List<RankedPlayer> AroundPlayer(IRedisClient redis, string board, string player,
    int neighbours = 2)
{
    var rank = redis.GetItemIndexInSortedSetDesc(board, player);
    if (rank < 0) return new();
    var from = (int)Math.Max(0, rank - neighbours);
    var results = redis.GetRangeWithScoresFromSortedSetDesc(board, from, (int)rank + neighbours);
    return results.Select((x, i) => new RankedPlayer(from + i + 1, x.Key, x.Value)).ToList();
}

AroundPlayer(redis, Board, "carol", neighbours: 1);
// 3: bob 1150, 4: carol 1100, 5: dave 700
```

## Score ranges and percentiles

Score queries answer questions like "how many players have at least 1,000 points" and "what share of players
does carol beat":

```csharp
long above1000 = redis.GetSortedSetCount(Board, 1000, double.MaxValue);       // 4
long total     = redis.GetSortedSetCount(Board);                              // 5
double beats   = 100.0 * (total - rank - 1) / total;                       // carol: 20%

List<string> gold = redis.GetRangeFromSortedSetByHighestScore(Board, 1200, double.MaxValue);
```

## Daily, weekly and all-time boards

Keep a board per period and let old ones expire. Record each score in the current day's board as well as
the all-time board, in one pipeline:

```csharp
public static void RecordScore(IRedisClient redis, string player, int points)
{
    var today = $"leaderboard:{DateTime.UtcNow:yyyy-MM-dd}";
    using var pipeline = redis.CreatePipeline();
    pipeline.QueueCommand(r => r.IncrementItemInSortedSet("leaderboard:global", player, points));
    pipeline.QueueCommand(r => r.IncrementItemInSortedSet(today, player, points));
    pipeline.QueueCommand(r => r.ExpireEntryIn(today, TimeSpan.FromDays(35)));
    pipeline.Flush();
}
```

Build a weekly board by summing the daily ones. `StoreUnionFromSortedSets` adds the scores of members that
appear in several sets and stores the result as a new Sorted Set:

```csharp
var days = Enumerable.Range(0, 7)
    .Select(i => $"leaderboard:{DateTime.UtcNow.AddDays(-i):yyyy-MM-dd}")
    .ToArray();

redis.StoreUnionFromSortedSets("leaderboard:week", days);
redis.ExpireEntryIn("leaderboard:week", TimeSpan.FromMinutes(5));

var weeklyTop10 = redis.GetRangeWithScoresFromSortedSetDesc("leaderboard:week", 0, 9);
```

The weekly board is a cache: recompute it on a schedule, or when it has expired, rather than on every request.
Pass `"AGGREGATE", "MAX"` as `args` to `StoreUnionFromSortedSets(intoSetId, setIds, args)` to keep each player's
best day instead of their total.

## Removing players and trimming

```csharp
redis.RemoveItemFromSortedSet(Board, "dave");                 // remove one player
redis.RemoveRangeFromSortedSet(Board, 0, -1001);              // keep only the top 1,000
redis.RemoveRangeFromSortedSetByScore(Board, 0, 99);          // remove everyone under 100 points
```

`RemoveRangeFromSortedSet` removes by ascending rank, so `0..-1001` removes everything except the 1,000
highest scores. Trimming bounds memory on boards that only ever display the top entries.

## Typed leaderboards

The typed client stores POCOs as members, serialized as JSON. It's convenient for small boards that should be
read with their data in one call:

```csharp
var typed = redis.As<Player>();
var board = typed.SortedSets["leaderboard:typed"];
typed.AddItemToSortedSet(board, new Player { Id = 1, Name = "alice" }, 1200);
List<Player> top = typed.GetRangeFromSortedSetDesc(board, 0, 9);
```

Because the whole serialized POCO is the member, changing any of its properties creates a different member.
For boards whose profiles change, store IDs as members as shown above.

## Async

Every Sorted Set API has an async equivalent on `IRedisClientAsync`:

```csharp
await using var redis = await redisManager.GetClientAsync(token);
double score = await redis.IncrementItemInSortedSetAsync(Board, "bob", 200, token);
var top10 = await redis.GetRangeWithScoresFromSortedSetDescAsync(Board, 0, 9, token);
long rank = await redis.GetItemIndexInSortedSetDescAsync(Board, "bob", token);
```

## Beyond games

The same operations solve many other ordering problems:

| Use-case | Member | Score |
| --- | --- | --- |
| Trending posts | Post ID | Votes, decayed by age |
| Recently viewed | Product ID | Unix time of the view |
| Delayed jobs | Job payload | Unix time it becomes due, see [Queues](/redis/queues#delayed-and-scheduled-jobs) |
| Sliding-window rate limits | Request ID | Unix time of the request, see [Rate Limiting](/redis/rate-limiting#sliding-window) |
| Autocomplete | Search term | Popularity, or `0` with lexical range queries, see [Lex Operations](/redis/client-usage#lex-operations) |
| Geospatial | Location ID | A geohash, see [Geospatial](/redis/geo) |
