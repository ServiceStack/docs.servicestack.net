---
title: C#/.NET Client for Redis
---

[ServiceStack's C# Redis Client](https://github.com/ServiceStack/ServiceStack.Redis) is a simple, high-performance and feature-rich C# Client for Redis with native support and [high-level abstractions](./design-nosql.md) for serializing POCOs and Complex Types supporting both native Sync and Async APIs.

<div class="py-8 max-w-7xl mx-auto">
    <lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="jBdOvTvjyqY" style="background-image: url('https://img.youtube.com/vi/jBdOvTvjyqY/maxresdefault.jpg')"></lite-youtube>
</div>

There are a number of different APIs available with the `RedisClient` implementing the following interfaces:

* [Caching Provider](/caching) - If you are using Redis solely as a cache, you should bind to the ServiceStack's common interface as there already are In-Memory an Memcached implementations available in ServiceStack, allowing you to easily switch providers
* [IRedisNativeClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisNativeClient.cs) / [Async](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisNativeClientAsync.cs) - For those wanting a low-level raw byte access (where you can control your own serialization/deserialization) that map 1:1 with Redis operations of the same name.

For most cases if you require access to Redis specific functionality you would want to bind to the interface below:

* [IRedisClient](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisClient.cs) / [Async](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Interfaces/Redis/IRedisClientAsync.cs) - Provides a friendlier, more descriptive API that lets you store values as strings (UTF8 encoding).
* [Redis generic client APIs](https://github.com/ServiceStack/ServiceStack/tree/master/src/ServiceStack.Interfaces/Redis/Generic) - created with `redis.As<T>()` - returns a 'strongly-typed client' that provides a typed-interface for all redis value operations that works against any C#/.NET POCO type.

The interfaces work cleanly with any IOC and allows your app logic to bind to implementation-free interfaces which can easily be mocked and substituted.

An overview of class hierarchy for the C# Redis clients looks like:

```
RedisTypedClient (POCO) > RedisClient (string) > RedisNativeClient (raw byte[])
```

With each client providing different layers of abstraction:

* The RedisNativeClient exposes raw `byte[]` apis and does no marshalling and passes all values directly to redis.
* The RedisClient assumes `string` values and simply converts strings to UTF8 bytes before sending to Redis
* The RedisTypedClient provides a generic interface allowing you to add POCO values. POCOs are serialized using [ServiceStack.Text](https://github.com/ServiceStack/ServiceStack.Text) which is then converted to UTF8 bytes and sent to Redis.

## API Overview

<a href="https://reference.servicestack.net/api/ServiceStack.Redis/"><div class="mx-auto max-w-screen-lg block flex justify-center shadow hover:shadow-lg rounded py-1"><img class="p-4" src="/img/pages/redis/redis-reference.png"></div></a>

### Birds-eye view

<div class="my-8 flex justify-center">
  <a class="max-w-4xl" href="/img/pages/redis/redis-annotated.png"><img src="/img/pages/redis/redis-annotated.png"></a>
</div>
