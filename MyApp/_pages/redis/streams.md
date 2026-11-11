---
slug: streams
title: Redis Streams
---

ServiceStack.Redis v10.5 adds sync and async Streams APIs with binary-safe field pairs, lossless
string IDs, explicit consumer-group acknowledgments and pending-message recovery.

:::youtube RhNCEMj1gQA
Build a Redis Streams Work Queue in C# That Survives Worker Crashes
:::

## Native and Rich APIs

The native byte-oriented commands are available on `RedisNativeClient` and `RedisClient`, and through extensions
on existing `IRedisNativeClient` / `IRedisClient` references. Async counterparts accept `CancellationToken` on
`IRedisNativeClientAsync` / `IRedisClientAsync`. Implementations opt in through the additive
`IRedisStreamCommands` / `IRedisStreamCommandsAsync` contracts; existing interfaces gain no required members.
Third-party providers without that capability receive `NotSupportedException` before a command is sent.

| APIs | Purpose |
| --- | --- |
| `XAdd`, `XRange`, `XLen` | Append entries, read ranges (including `reverse: true`) and inspect length |
| `XRead` | Read one or more streams from explicit positions, optionally blocking |
| `XTrim`, `XDel` | Trim using MAXLEN or delete explicit IDs |
| `XGroupCreate`, `XGroupDestroy` | Provision or remove a consumer group |
| `XReadGroup`, `XAck` | Read new/pending messages and acknowledge explicitly |
| `XPending`, `XPendingEntries` | Inspect pending totals, consumers, idle time and delivery counts |
| `XClaim`, `XAutoClaim` | Transfer pending ownership or scan/reclaim with a continuation cursor |

Core commands require Redis 5+; `XAutoClaim` requires Redis 6.2+. Tested on Redis
6.2.24, Redis 8.10.1 and Valkey 8.1.11. Newer optional server flags are not automatically exposed. Unsupported
commands, ACL denials and errors such as BUSYGROUP/NOGROUP propagate without Lua or multi-command emulation.

```csharp
using var manager = new RedisManagerPool("localhost:6379");
using var redis = manager.GetClient(); // Writer lease

string id = redis.XAdd("events", new[] {
    new RedisStreamField {
        Name = "message".ToUtf8Bytes(),
        Value = "Order received".ToUtf8Bytes()
    }
});
RedisStreamEntry[] entries = redis.XRange("events", count: 100);
```

Field names and values are raw `byte[]`; duplicate field names, empty values and arbitrary binary data are
preserved. Stream IDs remain strings; do not convert them to floating-point values or DateTime. `XRange`
accepts logical lower/upper bounds even when `reverse: true`. MAXLEN can be exact or approximate; approximate
trimming does not promise a strict length cap.

## Typed JSON Entries

The typed facade stores one ServiceStack.Text JSON payload in a field named `json`. It does not change existing
cache/entity storage or maintain typed entity index sets. Use application-owned payload versions when evolving
schemas. Readers retain all raw fields, including fields they do not recognize.

```csharp
await using var redis = await ((IRedisClientsManagerAsync)manager).GetClientAsync(token);
string id = await redis.AddStreamEntryAsync("orders", new OrderEvent { OrderId = 1 }, token:token);

RedisTypedStreamEntry<OrderEvent>[] entries = await redis.ReadStreamEntriesAsync<OrderEvent>(
    new[] { new RedisStreamPosition { Stream = "orders", Id = "0-0" } },
    count: 100, token: token);

public class OrderEvent {
    public int OrderId { get; set; }
}
```

`HasValue` distinguishes an explicit JSON `null` from an absent JSON field. Deleted pending payloads have
`Fields == null`; an empty field value is different. Malformed JSON or duplicate `json` fields produce a
parsing error, and are not acknowledged automatically. Raw commands remain available for other encodings.

## Pipelines and Bulk Append

`XAdd`, `XAck`, `XDel`, `XTrim` and `XLen`, including async counterparts, support existing pipelines. Results
reach their string/integer callbacks when the pipeline is flushed. The typed `AddStreamEntry` helpers inherit
the XADD support. Open an async connection before queueing, since queue delegates must only buffer commands:

```csharp
await redis.PingAsync(token);
await using (var pipeline = redis.CreatePipeline()) {
    pipeline.QueueCommand(r => r.AddStreamEntryAsync("orders", new OrderEvent { OrderId = 1 }),
        id => Console.WriteLine($"Added {id}"));
    pipeline.QueueCommand(r => r.XLenAsync("orders"),
        length => Console.WriteLine($"Length: {length}"));
    await pipeline.FlushAsync(token);
}
```

Structured reads, group creation/destruction, pending/claim operations and blocking reads still require
standalone calls. Streams transactions remain unsupported. `XAck` and `XDel` already accept multiple IDs in a
single command. Pipelines batch independent operations; an acknowledgment should follow successful application
processing rather than merely queueing a read and acknowledgment together.

For bulk writes, `AddStreamEntries` and `AddStreamEntriesAsync` on `IRedisClient` / `IRedisClientAsync` accept
either binary field arrays or typed values using the same `json` convention as `AddStreamEntry`:

```csharp
var events = Enumerable.Range(1, 1000).Select(i => new OrderEvent { OrderId = i });
string[] ids = await redis.AddStreamEntriesAsync("orders", events,
    batchSize: 100, maxLength: 10_000, token: token);
```

The binary overload accepts `IEnumerable<RedisStreamField[]>`. Both forms generate IDs with `XADD *`, return
confirmed IDs in input order on success, and optionally apply exact/approximate MAXLEN to each append. Keep
field buffers stable while the operation runs. `batchSize` defaults to 100 and must be positive; it caps XADD
commands in each pipeline, not payload bytes or the size of the final ID array. Enumeration and serialization
are incremental, and every field set in a batch is validated before that batch is sent. Empty input opens no
connection. These helpers require a concrete ServiceStack RedisClient writer lease and reject nesting inside
another pipeline or transaction. They open the connection before queueing and do not borrow extra clients.

Bulk append is not atomic. A server error stops after the failed batch; other commands in that already-sent
batch may succeed, and completed earlier batches remain. Transport failures or cancellation close uncertain
connections and do not replay the batch. No partial ID array is returned on failure. Retrying generated-ID
appends, or explicitly replaying a pipeline, can create duplicates; include an application event ID when you
need deduplication. Caller cancellation is checked during enumeration, between batches and during async
flush; use a cancellation deadline when bounding the entire operation. Async flushing also honors the client's
SendTimeout for sending a batch and ReceiveTimeout separately for each queued reply; configured I/O timeout
throws TimeoutException and closes the connection. Caller cancellation retains its original token.
This is not an exactly-once API.

## Consumer Groups and Recovery

<consumer-group-flow>
</consumer-group-flow>

Provision groups explicitly, e.g. `XGroupCreate("orders", "workers", makeStream: true)` to start at `0-0`, or
use `id: "$"` to start after current entries. Recreating a group produces BUSYGROUP rather than resetting its
position. Consumer names identify logical workers, not a connection lifetime.

```csharp
// Use a dedicated, exclusively leased client for blocking reads.
var entries = await redis.ReadStreamGroupEntriesAsync<OrderEvent>("workers", "worker-1",
    new[] { new RedisStreamPosition { Stream = "orders", Id = ">" } },
    count: 100, blockMilliseconds: 1000, token: token);

foreach (var entry in entries) {
    if (!entry.HasValue) continue; // Apply your own policy for missing/deleted/unknown payloads
    await ProcessOrder(entry.Value);
    await redis.XAckAsync("orders", "workers", new[] { entry.Id }, token);
}
```

`>` selects new messages for a group; an explicit ID reads that consumer's pending history. Processing and
acknowledgment are separate. If a worker stops after a side effect but before acknowledgment, its message can
be delivered again. Handlers need application deduplication/idempotency; this API does not promise exactly-once
processing. Native `XReadGroup` also exposes an explicit `noAck` option; typed group reads keep acknowledgment
explicit by default.

To recover stale pending messages, call `XAutoClaim("orders", "workers", "worker-2", minIdleMilliseconds: 60000,
start: "0-0", count: 100)` and continue with `NextStartId` until it returns `0-0`. Claiming does not acknowledge.
Use the returned entry IDs with `XAck` only after successful handling. `XPendingEntries` exposes idle times and
delivery counts for application-owned retry/dead-letter policies.

Redis 7+ reports deleted pending IDs in `RedisStreamAutoClaimResult.DeletedIds`. Redis 6.2 has an older reply
shape and can return a nil claim entry without identifying its ID; this is represented by an entry with
`Id == null` and `Fields == null`. No ID is invented and no extra mutation is sent to compensate.

## Connection and Failure Semantics

Use writer leases for consumer-group operations and dedicate a lease to each blocking reader. Clients remain
stateful and exclusive; do not run parallel commands on the same borrowed client. Omitted `blockMilliseconds`
is nonblocking; `0` blocks indefinitely. Configure receive timeouts to allow the requested blocking period, and
use cancellation tokens for shutdown.

Cancellation of a server-blocked async read closes uncertain protocol state before the client can be reused.
The new Streams APIs surface caller cancellation as `OperationCanceledException`. Cancellation does not prove
that a message was never delivered or that a mutation was undone. Existing transport retries still apply;
application idempotency remains necessary for uncertain outcomes.

The five primitive commands listed above support pipelines; other Streams methods reject batching before
sending commands. Streams transactions remain unsupported; raw command APIs retain their existing behavior. Streams retention is not a durability guarantee: persistence and replication
configuration still determine recovery after server failure. This feature adds no background consumer loop,
automatic retry/acknowledgment, MQ adapter, Redis Cluster routing or change to existing Redis MQ/Pub/Sub keys.
