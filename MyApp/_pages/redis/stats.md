---
slug: stats
title: Redis Stats
---

The [RedisStats](https://github.com/ServiceStack/ServiceStack.Redis/blob/master/src/ServiceStack.Redis/RedisStats.cs)
class provides better visibility and introspection into your running instances:

<stats-groups>
</stats-groups>

## Redis Stats in Admin UI Dashboard

These Stats are displayed in the [Admin UI Dashboard](/admin-ui-redis#redis-stats-on-dashboard)

[![](/img/pages/admin-ui/admin-ui-redis-stats.png)](/admin-ui-redis#redis-stats-on-dashboard)

## Log to Console

Alternatively you can get and print a dump of all the stats at anytime with:

```csharp
RedisStats.ToDictionary().PrintDump();
```

And Reset all Stats back to `0` with `RedisStats.Reset()`.
