---
slug: hash-field-expiration
title: Hash Field Expiration
---

ServiceStack.Redis v10.5 adds native expiration for individual hash fields on Redis 7.4+ and compatible servers
(Valkey 9+). Related values can stay in a hash while each field has its own lifetime. These APIs use server
commands directly, with no Lua or alternate-key emulation.

:::youtube bb5ThR6ZV9w
Redis Caching in .NET: IDistributedCache, HybridCache and Atomic TTLs
:::

<field-expiry-comparison>
</field-expiry-comparison>

## Expire Hash Fields

Borrow an exclusive writer lease for expiry changes and persistence operations:

```csharp
using var pool = new RedisManagerPool("localhost:6379");
await using var redis = await ((IRedisClientsManagerAsync)pool).GetClientAsync(token);

await redis.SetEntryInHashAsync("users:42", "presence", "online", token);
long[] results = await redis.HPExpireAsync("users:42", 30_000,
    new[] { "presence", "missing" }, RedisHashExpiryCondition.NX, token);
// [1, -2]: expiry set for presence; missing field was not created

long[] ttl = await redis.HPTtlAsync("users:42", new[] { "presence" }, token);
long[] persisted = await redis.HPersistAsync("users:42", new[] { "presence" }, token);
```

| Command / async counterpart | Numeric units and purpose |
| --- | --- |
| `HExpire` / `HExpireAsync` | Relative seconds |
| `HPExpire` / `HPExpireAsync` | Relative milliseconds |
| `HExpireAt` / `HExpireAtAsync` | Absolute Unix seconds |
| `HPExpireAt` / `HPExpireAtAsync` | Absolute Unix milliseconds |
| `HTtl` / `HTtlAsync` | Remaining seconds per field |
| `HPTtl` / `HPTtlAsync` | Remaining milliseconds per field |
| `HExpireTime` / `HExpireTimeAsync` | Expiration as Unix seconds |
| `HPExpireTime` / `HPExpireTimeAsync` | Expiration as Unix milliseconds |
| `HPersist` / `HPersistAsync` | Remove independent field expiration |

Native absolute arguments are Unix timestamps, not local dates. Convert DateTimeOffset values with
ToUnixTimeSeconds/ToUnixTimeMilliseconds. Expiration arguments must be nonnegative: zero relative expiration
or a past absolute deadline deletes an existing field when the condition permits. Server-specific numeric
limits are still enforced by the server.

## Conditions and Per-Field Results

The four expiry setters accept one RedisHashExpiryCondition:

- `None`: set/update expiration unconditionally.
- `NX`: only when the field has no independent expiration.
- `XX`: only when it already has an expiration.
- `GT`: only when the new deadline is greater than its current deadline.
- `LT`: only when the new deadline is less than its current deadline.

For GT/LT, a field without expiration has an infinite lifetime. Conditions cannot be combined; invalid or
combined enum values are rejected locally. Each field is evaluated independently.

Every API returns a `long[]` in requested order, including duplicate field occurrences:

| Operation | Result per field |
| --- | --- |
| Set expiration | `-2` missing hash/field; `0` condition rejected; `1` expiration set; `2` field deleted immediately |
| TTL / expiration-time query | `-2` missing hash/field; `-1` no independent field expiration; otherwise the time in the command's units |
| Remove expiration | `-2` missing hash/field; `-1` already has no expiration; `1` expiration removed |

An expiring parent key still bounds the lifetime of every field. Setting/removing a field TTL does not reset
the parent key's deadline. Redis can remove a hash when its last field disappears. Replacing a field with HSET
clears that field's expiration; incrementing its numeric value retains it. HSET followed by an expiry command
is two separate operations; this increment does not add atomic value-write-and-expire semantics. Existing typed POCO and private
IDistributedCache hash formats are unchanged; use these APIs on application-owned hashes deliberately.

## Use-cases

### Presence with per-field expiry

To show who's online in a room, store each member as a field and refresh its expiry on every heartbeat.
Members whose client stops sending heartbeats disappear on their own, while the room's other members stay:

```csharp
public class Presence(IRedisClient redis)
{
    // Each member is its own field, with its own lifetime (Redis 7.4+ / Valkey 9+)
    public void Heartbeat(string room, string userId, TimeSpan ttl)
    {
        redis.SetEntryInHash(room, userId, DateTime.UtcNow.ToString("O"));
        redis.HPExpire(room, (long)ttl.TotalMilliseconds, new[] { userId });
    }

    public List<string> Online(string room) => redis.GetHashKeys(room);
}

var presence = new Presence(redis);
presence.Heartbeat("presence:room:42", "alice", TimeSpan.FromSeconds(30));
presence.Heartbeat("presence:room:42", "bob", TimeSpan.FromSeconds(30));
List<string> online = presence.Online("presence:room:42"); // alice, bob - until a heartbeat is missed
```

`SetEntryInHash` replaces the field, which clears its previous expiry, so the expiry is always set again
straight after it. Before Redis 7.4 this needed a Sorted Set of last-seen times and a cleanup job; see the
[driver tracking example](/redis/geo#track-moving-objects) for that approach.

### Temporary grants

Absolute expiry fits access that ends at a known time, such as a trial feature or a support engineer's
temporary access. Store grants for one user in one hash and each grant ends independently:

```csharp
var grants = $"grants:user:{userId}";
redis.SetEntryInHash(grants, "export-reports", "trial");
redis.HExpireAt(grants, DateTimeOffset.UtcNow.AddDays(14).ToUnixTimeSeconds(), new[] { "export-reports" });

bool canExport = redis.HashContainsEntry(grants, "export-reports");
long[] secondsLeft = redis.HTtl(grants, new[] { "export-reports" });
```

Use `RedisHashExpiryCondition.GT` when extending a grant, so a shorter extension can never cut an existing
grant short:

```csharp
redis.HExpireAt(grants, newEnd.ToUnixTimeSeconds(), new[] { "export-reports" }, RedisHashExpiryCondition.GT);
```

## Binary Data and Compatibility

String extensions are available on IRedisClient/IRedisClientAsync. Native overloads accept raw `byte[]` hash
keys and `byte[][]` field names; IRedisNativeClient/Async extensions also accept a string hash key with binary
field names. Arbitrary bytes, Unicode, empty names and empty values retain their existing storage format.
Empty field lists and null keys/fields are rejected locally.

RedisNativeClient/RedisClient implement optional IRedisHashExpiryCommands/IRedisHashExpiryCommandsAsync
capabilities. Existing client interfaces gain no required members. Third-party implementations can opt in;
otherwise the extensions throw NotSupportedException. No new package dependencies are introduced, and this
command family is available across the client's supported target frameworks.

These methods require standalone calls. Pipelines and transactions are rejected before sending hash-expiry
commands; deferred integer-array callback support is outside this increment. Mutations require writers;
TTL/time queries may use read-only leases with ordinary replica-staleness semantics.

Unsupported-command, wrong-type and ACL errors propagate without fallback. Caller cancellation closes an
interrupted reply and preserves the caller token. Malformed/truncated arrays close the connection and reset
buffered commands before reuse; they are not replayed as a parser fallback. Ordinary transport retry behavior
and uncertain-write outcomes still apply. HGETEX/HSETEX are not part of this increment.

Behavior was validated on Redis 7.4.12, Redis 8.10.1 and Valkey 9.1.3. Redis 6.2.24 and Valkey 8.1.11 were
tested for unsupported-command behavior without emulation. See the server references for individual command
semantics: [Redis HEXPIRE](https://redis.io/docs/latest/commands/hexpire/),
[HPTTL](https://redis.io/docs/latest/commands/hpttl/), [HPERSIST](https://redis.io/docs/latest/commands/hpersist/)
and [Valkey HEXPIRE](https://valkey.io/commands/hexpire/).
