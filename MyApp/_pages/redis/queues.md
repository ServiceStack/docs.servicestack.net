---
slug: queues
title: Queues and Background Work with Redis
---

Redis Lists push and pop from either end in constant time, and can block a consumer until an item arrives,
which makes them a simple, fast work queue shared by every app server. This page builds up from a basic queue
to reliable, delayed and prioritized queues, and explains when to use Redis Streams or a complete messaging
solution instead.

<queue-chooser>
</queue-chooser>

## A simple work queue

Producers add to one end of a List with `EnqueueItemOnList` (`LPUSH`), and consumers take from the other end
with `BlockingDequeueItemFromList` (`BRPOP`), which waits for an item instead of polling:

```csharp
const string Queue = "queue:emails";

// Producer
using var redis = redisManager.GetClient();
redis.EnqueueItemOnList(Queue, new SendEmail { To = "alice@example.org" }.ToJson());
```

```csharp
// Consumer: a dedicated, long-running worker
using var redis = redisManager.GetClient();
while (!token.IsCancellationRequested)
{
    var json = redis.BlockingDequeueItemFromList(Queue, TimeSpan.FromSeconds(5));
    if (json == null) continue; // timed out, check for shutdown and wait again
    await SendEmailAsync(json.FromJson<SendEmail>());
}
```

Items are returned in the order they were added. The timeout lets the worker notice shutdown regularly; a
`null` result means no item arrived in time.

::: warning Dedicate a client to each blocking consumer
A blocking call holds its client for the whole wait. Give each worker its own client for its lifetime rather
than borrowing one per iteration, and make sure the client's `ReceiveTimeout` is longer than the blocking
timeout, so the client doesn't time out a read that the server is still legitimately waiting on.
:::

This queue removes an item the moment it's taken. If the worker crashes before finishing, the item is lost.
That's acceptable for work that's safe to drop, like cache warming; otherwise use a reliable queue.

## A reliable queue

`BlockingPopAndPushItemBetweenLists` (`BRPOPLPUSH`) takes the next item and atomically pushes it onto a second,
per-worker "processing" List. The item is never only in memory: it's either waiting in the queue, or recorded
as in progress by a named worker until that worker removes it:

<reliable-queue-flow>
</reliable-queue-flow>

```csharp
public class ReliableQueue(IRedisClient redis, string queue, string workerId)
{
    public string ProcessingList { get; } = $"{queue}:processing:{workerId}";

    public void Enqueue(string job) => redis.EnqueueItemOnList(queue, job);

    // Atomically moves the next job into this worker's processing list
    public string Take(TimeSpan timeout) =>
        redis.BlockingPopAndPushItemBetweenLists(queue, ProcessingList, timeout);

    public void Complete(string job) => redis.RemoveItemFromList(ProcessingList, job, 1);

    // On startup, return any jobs a previous run of this worker never completed
    public int RecoverUnfinished()
    {
        var count = 0;
        while (redis.PopAndPushItemBetweenLists(ProcessingList, queue) != null) count++;
        return count;
    }
}
```

A worker recovers its own unfinished jobs when it starts, then processes jobs until it's stopped:

```csharp
using var redis = redisManager.GetClient();
var worker = new ReliableQueue(redis, "queue:jobs", workerId: Environment.MachineName);
worker.RecoverUnfinished();

while (!token.IsCancellationRequested)
{
    var job = worker.Take(TimeSpan.FromSeconds(5));
    if (job == null) continue;
    await ProcessAsync(job);
    worker.Complete(job);
}
```

Use a stable worker ID, like the machine or pod name, so a restarted worker finds its own processing list.
A job that's recovered may have been partly processed before the crash, so jobs must be safe to run more than
once: use an ID in the payload to skip work that already completed.

## Delayed and scheduled jobs

A List is ordered by arrival, not by time. To run a job later, add it to a Sorted Set scored by the Unix time
it becomes due, and move due jobs onto the ready queue with an atomic script:

```csharp
public class DelayedJobs(IRedisClient redis, string scheduledKey, string readyQueue)
{
    public void Schedule(string job, TimeSpan delay) =>
        redis.AddItemToSortedSet(scheduledKey, job,
            DateTimeOffset.UtcNow.Add(delay).ToUnixTimeMilliseconds());

    const string PromoteLua = """
        local t = redis.call('TIME')
        local now = tonumber(t[1]) * 1000 + math.floor(tonumber(t[2]) / 1000)
        local due = redis.call('ZRANGEBYSCORE', KEYS[1], '-inf', now, 'LIMIT', 0, tonumber(ARGV[1]))
        for _, job in ipairs(due) do
            redis.call('ZREM', KEYS[1], job)
            redis.call('LPUSH', KEYS[2], job)
        end
        return #due
        """;

    public long PromoteDueJobs(int batchSize = 100) =>
        redis.ExecLuaAsInt(PromoteLua, new[] { scheduledKey, readyQueue }, new[] { batchSize.ToString() });
}
```

```csharp
var scheduler = new DelayedJobs(redis, "jobs:scheduled", "queue:jobs");
scheduler.Schedule(new SendReminder { OrderId = 42 }.ToJson(), TimeSpan.FromHours(24));

// In a background loop, e.g. every second
scheduler.PromoteDueJobs();
```

Because the script removes each job from the Sorted Set and pushes it onto the queue in one step, several
servers can run the promoter at the same time without moving a job twice. The existing workers then process
promoted jobs like any other.

Sorted Set members are unique, so two identical payloads are stored once. Include a unique job ID in each payload
unless you want that deduplication.

## Priority queues

`BlockingDequeueItemFromLists` waits on several Lists and always takes from the first non-empty one in the
order given. Put higher-priority queues first:

```csharp
ItemRef next = redis.BlockingDequeueItemFromLists(
    new[] { "queue:high", "queue:normal", "queue:low" }, TimeSpan.FromSeconds(5));

if (next != null)
    Console.WriteLine($"{next.Item} from {next.Id}"); // Id is the List it came from
```

Strict priority means low-priority jobs wait as long as there's higher-priority work. If they must still
progress under load, give some workers a different queue order.

## Fan-out and broadcast

A List delivers each item to exactly one consumer. To deliver every message to every subscriber, use:

- [Redis Pub/Sub](/redis/pubsub) for live notifications to connected subscribers, like cache invalidation.
  Messages aren't stored, so a subscriber that's offline misses them.
- [Redis Streams](/redis/streams) when each consumer group needs every message durably, can read from a past
  position, and must recover messages a crashed consumer didn't acknowledge.

## Streams consumer groups

Streams give you, out of the box, much of what the reliable and delayed queue recipes build by hand: per-group
delivery, explicit acknowledgment, a pending list per consumer, and claiming stale messages from crashed consumers:

```csharp
// Provision once, e.g. at deployment: creating an existing group fails with BUSYGROUP
await redis.XGroupCreateAsync("orders", "workers", makeStream: true, token: token);

var entries = await redis.ReadStreamGroupEntriesAsync<OrderEvent>("workers", "worker-1",
    new[] { new RedisStreamPosition { Stream = "orders", Id = ">" } },
    count: 100, blockMilliseconds: 1000, token: token);

foreach (var entry in entries)
{
    if (!entry.HasValue) continue;
    await ProcessOrder(entry.Value);
    await redis.XAckAsync("orders", "workers", new[] { entry.Id }, token);
}
```

See [Redis Streams](/redis/streams#consumer-groups-and-recovery) for recovery with `XAutoClaim`.

## When to use a messaging solution

The recipes on this page are building blocks. When you need retries with back-off, dead-letter queues,
reply messages and monitoring, use one of ServiceStack's complete solutions instead:

- **[Background Jobs](/jobs/)** runs commands and APIs in the background with retries, scheduling, recurring
  jobs, and a dashboard in the Admin UI. Its state is stored in SQLite, so it works without Redis.
- **[Redis MQ](/redis-mq)** executes ServiceStack Services from Redis-backed queues, with automatic retries,
  dead-letter queues and responses published to reply queues.

| | Lists | Streams | Redis MQ | Background Jobs |
| --- | --- | --- | --- | --- |
| Delivery | One consumer | Each consumer group | One consumer | One worker |
| Survives a worker crash | With the reliable queue recipe | Pending entries + claim | Yes | Yes |
| Retries & dead letters | Build it yourself | Build it yourself | Built in | Built in |
| Scheduling | Sorted Set recipe | Build it yourself | No | Built in, including recurring |
| Message history | No | Yes, until trimmed | No | Yes, in the database |
