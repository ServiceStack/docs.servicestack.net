---
title: Redis Profiling
---

## Redis Profiler

The easiest way to view your App's executed Redis commands is by enabling the [Admin Profiling UI](/admin-ui-features#request-logging-profiling) where it's built-in [Redis Profiling](/admin-ui-profiling#redis-profiling) will show generated queries in context with your other App events:

<screenshot src="/img/pages/admin-ui/profiling-redis-CommandAfter.png" title="Redis commands in the Admin Profiling UI">
</screenshot>

## Logging Executed Redis Commands

Alternatively you can see what commands Redis Client executes by configuring it to log verbose debug info with:

```csharp
RedisConfig.EnableVerboseLogging = true;
LogManager.LogFactory = new ConsoleLogFactory(debugEnabled:true);
```

Where it will log verbose commands Redis clients executes to the Console.
