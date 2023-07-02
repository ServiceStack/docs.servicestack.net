---
slug: troubleshooting
title: Troubleshooting issues
---

## Debugging Data Corruption Issues

An issue that can be hard to debug is if the same `RedisClient` instance is shared across multiple threads which can result in returning corrupted data.
Typically, this is a result of using `IRedisClient` field in a singleton instance or sharing it as a static instance. To prevent this, each Thread that
uses Redis should retrieve the redis client within a using statement, e.g:

```csharp
using var redis = redisManager.GetClient();
//...
```

Unfortunately the call-site which returns the corrupted response or runtime Exception doesn't identify where else the Redis client instance was being used.
To help identify where client instances are being used you can assert that the client is only used in the Thread that resolved it from the pool with:

```csharp
RedisConfig.AssertAccessOnlyOnSameThread = true;
```

This captures the Thread's StackTrace each time the client is resolved from the pool which as it adds a lot of overhead, should only be enabled when debugging connection issues.

If it does detect the client is being accessed from a different thread it will throw a `InvalidAccessException` with the message containing the different **Thread Ids** and the **original StackTrace** where the client was resolved from the pool. You can compare this with the StackTrace of the Exception to hopefully identify where the client is being improperly used.

## Avoiding Concurrent Usage issues

What to look out for in your code-base to prevent against multiple concurrent usage of a `IRedisClient` instance:

- Use `IRedisClient` redis instance client within a `using` statement
- Never use a client instance after it has been disposed
- Never use (or return) a "server collection or resource" (e.g. [Redis.Lists](#simple-example-using-redis-lists), lock) after the client has been disposed
- Never keep a Singleton or `static` instance to a redis client (just the `IRedisClientsManager` factory)
- Never use the same redis client in multiple threads, i.e. have each thread resolve their own client from the factory
