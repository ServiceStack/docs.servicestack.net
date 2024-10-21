---
slug: async
title: Redis Async APIs
---

All Redis Client Managers implement both `IRedisClientsManager` and `IRedisClientsManagerAsync` so IOC registrations remain the same which can continue to register against the existing `IRedisClientsManager` interface, e.g:

```csharp
container.Register<IRedisClientsManager>(c => 
    new RedisManagerPool(redisConnectionString));
```

Where it can be used to resolve both sync `IRedisClient` and async `IRedisClientAsync` clients, e.g:

```csharp
using var syncRedis = container.Resolve<IRedisClientsManager>().GetClient();
await using var asyncRedis = await container.Resolve<IRedisClientsManager>().GetClientAsync();
```

If you want to force async-only API usage could choose to just register `IRedisClientsManagerAsync` where it only lets you resolve async only `IRedisClientAsync` and `ICacheClientAsync` clients, e.g:

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<IRedisClientsManagerAsync>(c => new RedisManagerPool());
}

//... 

public class MyDep(IRedisClientsManagerAsync manager)
{
    public async Task<long> Incr(string key, uint value)
    {
        await using var redis = await manager.GetClientAsync();
        return await redis.IncrementAsync(key, value);
    }
}
```

## Usage in ServiceStack

Inside ServiceStack Services & Controllers we recommend using `GetRedisAsync()` to resolve an `IRedisClientAsync`:

```csharp
public class MyService : Service
{
    public async Task<object> Any(MyRequest request)
    {
        await using var redis = await GetRedisAsync();
        await redis.IncrementAsync(nameof(MyRequest), 1);
    }
}

public class HomeController : ServiceStackController
{
    public async Task<ActionResult> Index()
    {
        await using var redis = await GetRedisAsync();
        await redis.IncrementAsync(nameof(HomeController), 1);
    }
}
```