---
slug: rate-limiting
title: Distributed Rate Limiting with Redis
---

ASP.NET Core's [rate limiting middleware](/rate-limiting) keeps its counters in each process's memory, so
behind a load balancer every app server enforces its own separate limit. Keeping the counters in Redis gives
every server the same view, so a limit of 100 requests a minute means 100 in total, however many servers
handle them.

Each algorithm below runs as a Lua script, so the check and the update happen in one atomic step on the server.
Two concurrent requests can't both read "99" and both be allowed, and a crash between commands can't leave a
counter without an expiry.

<rate-limit-algorithms>
</rate-limit-algorithms>

## Fixed window

Count requests in the current window, and set the window's expiry when its first request arrives:

```csharp
public const string FixedWindowLua = """
    local count = redis.call('INCR', KEYS[1])
    if count == 1 then
        redis.call('PEXPIRE', KEYS[1], ARGV[1])
    end
    return count
    """;

public static bool FixedWindow(IRedisClient redis, string key, int limit, TimeSpan window)
{
    var count = redis.ExecLuaAsInt(FixedWindowLua,
        new[] { key }, new[] { ((long)window.TotalMilliseconds).ToString() });
    return count <= limit;
}

if (!FixedWindow(redis, $"ratelimit:{userId}", limit: 100, window: TimeSpan.FromMinutes(1)))
    throw new HttpError(429, "TooManyRequests", "Rate limit exceeded");
```

It's the cheapest algorithm, one integer per caller, and the easiest to explain to API consumers. Its
weakness is the boundary: a caller can send 100 requests at the end of one window and 100 more at the start of
the next, briefly doubling the limit.

::: info Why not INCR then EXPIRE?
Sending `IncrementValue` and `ExpireEntryIn` as two commands works until a process dies between them. The key
is then left without an expiry and the caller stays blocked until someone deletes it. Running both inside the
script makes them a single atomic operation.
:::

## Sliding window

Record each request's timestamp in a Sorted Set, remove the ones older than the window, and allow the request
only if fewer than the limit remain:

```csharp
public const string SlidingWindowLua = """
    local t = redis.call('TIME')
    local now = tonumber(t[1]) * 1000 + math.floor(tonumber(t[2]) / 1000)
    local window = tonumber(ARGV[1])
    redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', now - window)
    if redis.call('ZCARD', KEYS[1]) < tonumber(ARGV[2]) then
        redis.call('ZADD', KEYS[1], now, ARGV[3])
        redis.call('PEXPIRE', KEYS[1], window)
        return 1
    end
    return 0
    """;

public static bool SlidingWindow(IRedisClient redis, string key, int limit, TimeSpan window) =>
    redis.ExecLuaAsInt(SlidingWindowLua, new[] { key }, new[] {
        ((long)window.TotalMilliseconds).ToString(),
        limit.ToString(),
        Guid.NewGuid().ToString("n"), // unique member, so requests in the same ms aren't merged
    }) == 1;
```

The limit holds over every window-length period, with no boundary burst. The cost is memory: the set holds one
entry per allowed request, so a limit of 10,000 an hour stores up to 10,000 entries per caller. Use it for low
limits that must be exact, like login attempts or password resets.

The script reads the time from Redis with `TIME`, so app servers with skewed clocks still agree on the window.

## Token bucket

Each caller has a bucket that refills at a steady rate up to a maximum capacity, and each request spends a
token. It permits short bursts up to the capacity while holding the long-run average to the refill rate:

```csharp
public const string TokenBucketLua = """
    local capacity = tonumber(ARGV[1])
    local refillPerSec = tonumber(ARGV[2])
    local cost = tonumber(ARGV[3])
    local t = redis.call('TIME')
    local now = tonumber(t[1]) + tonumber(t[2]) / 1000000

    local bucket = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
    local tokens = tonumber(bucket[1]) or capacity
    local ts = tonumber(bucket[2]) or now
    tokens = math.min(capacity, tokens + (now - ts) * refillPerSec)

    local allowed = 0
    if tokens >= cost then
        tokens = tokens - cost
        allowed = 1
    end
    redis.call('HSET', KEYS[1], 'tokens', tostring(tokens), 'ts', tostring(now))
    redis.call('EXPIRE', KEYS[1], math.ceil(capacity / refillPerSec) + 1)
    return allowed
    """;

public static bool TokenBucket(IRedisClient redis, string key, int capacity,
    double refillPerSecond, int cost = 1) =>
    redis.ExecCachedLua(TokenBucketLua, sha1 => redis.ExecLuaShaAsInt(sha1, new[] { key }, new[] {
        capacity.ToString(),
        refillPerSecond.ToString(CultureInfo.InvariantCulture),
        cost.ToString(),
    })) == 1;
```

A bucket with `capacity: 10, refillPerSecond: 5` allows a burst of 10 requests, then 5 a second after that.
The bucket is a two-field Hash, so memory stays constant regardless of the limit, and `cost` lets expensive
operations spend more than one token. The bucket expires once it would have refilled completely, so idle callers
use no memory.

This example uses [`ExecCachedLua`](/redis/lua#execcachedlua), which runs the script by its SHA1 with
`EVALSHA` and loads it automatically on first use or after a server restart, instead of sending the script
body with every request.

## Enforce limits on every API

Register a global request filter to apply a limit to every ServiceStack API. This example limits each
authenticated user, or each IP address for anonymous callers, to 100 requests a minute per API:

```csharp
public class ConfigureRateLimiting : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(appHost => {
            appHost.GlobalRequestFiltersAsync.Add(async (req, res, requestDto) =>
            {
                var redisManager = req.TryResolve<IRedisClientsManagerAsync>();
                await using var redis = await redisManager.GetClientAsync();

                var session = await req.GetSessionAsync();
                var caller = session.IsAuthenticated
                    ? $"user:{session.UserAuthId}"
                    : $"ip:{req.RemoteIp}";
                var key = $"ratelimit:{requestDto.GetType().Name}:{caller}";

                var count = await redis.ExecLuaAsIntAsync(RateLimits.FixedWindowLua,
                    new[] { key }, new[] { "60000" });
                if (count > 100)
                {
                    res.AddHeader("Retry-After", "60");
                    throw new HttpError(429, "TooManyRequests", "Rate limit exceeded, try again later");
                }
            });
        });
}
```

Throwing an `HttpError` returns a structured `429 Too Many Requests` error response that ServiceStack's
typed clients surface as a `WebServiceException` with `ErrorCode = "TooManyRequests"`.

To apply different limits to different APIs, check for a custom attribute on the Request DTO, or use a
[Request Filter Attribute](/filter-attributes) on the Services that need it.

## Choosing an algorithm

| | Fixed window | Sliding window | Token bucket |
| --- | --- | --- | --- |
| Memory per caller | 1 integer | 1 entry per request in the window | 2 hash fields |
| Accuracy | Up to 2x the limit at a window boundary | Exact | Exact average, allows bursts up to capacity |
| Commands in the script | 2 | 4 | 4 |
| Good for | API quotas, high-volume limits | Logins, password resets, OTP | Public APIs, client SDKs, webhooks |

## Production notes

- **Key on the right identity.** Behind a proxy, `req.RemoteIp` is only the client's address when forwarded
  headers are configured. Prefer an authenticated user or API key where available.
- **Decide what happens when Redis is down.** Catching the exception and allowing the request ("fail open")
  keeps your API available during an outage; rejecting it ("fail closed") is safer for login and payment endpoints.
- **Return `Retry-After`.** Well-behaved clients wait instead of retrying immediately.
- **Use one Redis for limits.** Under Sentinel failover, counters that hadn't replicated before the failover are
  lost, which briefly resets some limits. That's acceptable for rate limiting, but not for billing quotas.
