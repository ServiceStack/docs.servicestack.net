---
title: Redis Admin
---

The Redis Admin UI lets you manage your App's configured Redis Server with a user-friendly UX for managing core Redis data types, simple search functionality to quickly find Redis values, quick navigation between related values, first class support for JSON values and a flexible command interface and command history to inspect all previously run redis commands that's easily editable & rerun.

<lite-youtube class="w-full mx-4 my-4" width="560" height="315" videoid="AACZtTOcQbg" style="background-image: url('https://img.youtube.com/vi/AACZtTOcQbg/maxresdefault.jpg')"></lite-youtube>

To add Redis support to your project:

:::sh
npx add-in redis
:::

Or if you already have Redis configured, enable it by registering the `AdminRedisFeature` plugin:

```csharp
services.AddPlugin(new AdminRedisFeature());
```

### Redis Stats on Dashboard

The [Admin Dashboard](/admin-ui#dashboard) contains valuable insight into monitoring the health of your App's redis usage with both client & server counters:

[![](/img/pages/admin-ui/admin-ui-redis-stats.png)](/admin-ui#dashboard)

::: tip
A description of each of these stats is available in the [Redis Stats docs](/redis/stats)
:::

## Info

The Redis Admin home page shows the output of the Redis [INFO](https://redis.io/commands/info/) command containing detailed information on the remote redis server:

![](/img/pages/admin-ui/admin-ui-redis.png)

By default it uses the App's configured database but can easily switch between Redis databases with the numbered Database dropdown.

### Modify Redis Connection

Changing your App's Redis Configuration at runtime can be enabled with:

```csharp
Plugins.Add(new AdminRedisFeature {
    ModifiableConnection = true
});
```

Which will linkify the Redis Connection string to open the **Change Connection** Dialog:

![](/img/pages/admin-ui/admin-ui-redis-connection.png)

Be aware this will change your App's Redis Connection at runtime to different redis server than what it was configured with, which can be useful if you have a warm stand-by Redis server you want to switch to without redeploying your App.

## Search

The Search tab is where you'll find the primary functionality for being able to quickly search through the Redis keyspace to find where you can create or edit new Redis [Strings](https://redis.io/docs/data-types/strings/), [Lists](https://redis.io/docs/data-types/lists/), [Sets](https://redis.io/docs/data-types/sets/), [Sorted Sets](https://redis.io/docs/data-types/sorted-sets/) and [Hashes](https://redis.io/docs/data-types/hashes/):

![](/img/pages/admin-ui/admin-ui-redis-new.png)

### Set

Selecting a Redis Data Type displays an optimized form you can use to create a new Value of that type:

![](/img/pages/admin-ui/admin-ui-redis-new-set.png)

Which you can view in a **Pretty** view where collections like sets are displayed in a formatted JS Array letting you can copy all its values:

![](/img/pages/admin-ui/admin-ui-redis-set-pretty.png)

A **Preview** mode displaying the results in a human-friendly table view:

![](/img/pages/admin-ui/admin-ui-redis-set-preview.png)

And an **Edit** mode where you can **add** and **delete** members:

![](/img/pages/admin-ui/admin-ui-redis-set-edit.png)

### String

The same functionality is available for all Data Types, whilst **Strings** contain first-class support for JSON strings in the **Pretty** tab:

![](/img/pages/admin-ui/admin-ui-redis-string-pretty.png)

**Preview**

![](/img/pages/admin-ui/admin-ui-redis-string-preview.png)

and **Edit** views where you can **indent JSON** when creating or editing JSON Strings:

![](/img/pages/admin-ui/admin-ui-redis-string-edit.png)

### Hash

Hashes have the same functionality as **SET** with an additional field to capture the hash entries value:

![](/img/pages/admin-ui/admin-ui-redis-hash-edit.png)

### Sorted Set

Whilst Sorted Sets maintains an extra numerical field to capture Sorted Set scores:

![](/img/pages/admin-ui/admin-ui-redis-zset-edit.png)

## Command

The Command tab gives you a flexible Command bar letting you run custom Redis commands against the selected database, including a Command History capturing all previously run commands that can be reselected to quickly edit & rerun commands:

![](/img/pages/admin-ui/admin-ui-redis-command.png)

By default Redis Admin blocks running dangerous and unsuitable commands from a Web interface which can be modified when registering the `AdminRedisFeature`, that by default prevents the commands below:

```csharp
Plugins.Add(new AdminRedisFeature {
    IllegalCommands = {
        "BLMOVE",
        "BLMPOP",
        "BLPOP",
        "BRPOP",
        "BRPOPLPUSH",
        "FLUSHDB",
        "FLUSHALL",
        "MONITOR",
    }
})
```

## Profile App Redis Usage

The command history maintains a log for all commands executed in the Redis Admin UI, you can inspect the redis commands executed by your Services with the [Redis Profiling](/admin-ui-profiling#redis-profiling) built into the [Admin Profiling UI](/admin-ui-profiling).

[![](/img/pages/admin-ui/profiling-redis-CommandAfter.png)](/admin-ui-profiling#redis-profiling)

## Feedback Welcome

We hope you'll find the Redis Admin feature useful, please let us know what other features you would like in [ServiceStack/Discuss](https://github.com/ServiceStack/Discuss/discussions).
