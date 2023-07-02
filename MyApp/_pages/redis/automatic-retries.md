---
slug: automatic-retries
title: Automatic Retries
---

One feature that improves the resilience of `RedisClient` connections is Auto Retry where the RedisClient will transparently retry failed Redis operations due to Socket and I/O Exceptions in an exponential backoff starting from
**10ms** up until the `RetryTimeout` of **10000ms**. These defaults can be tweaked with:

## Usage

```csharp
RedisConfig.DefaultRetryTimeout = 10000;
RedisConfig.BackOffMultiplier = 10;
```

The `RetryTimeout` can also be configured on the connection string with `?RetryTimeout=10000`.
