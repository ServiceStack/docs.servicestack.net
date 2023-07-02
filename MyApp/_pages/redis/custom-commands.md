---
slug: custom-commands
title: Redis Custom Commands
---
Most of the time when waiting to use a new [Redis Command](http://redis.io/commands) you'll need to wait for an updated version of
**ServiceStack.Redis** to add support for the new commands likewise there are times when the Redis Client doesn't offer every permutation
that redis-server supports.

## API

With the new `Custom` and `RawCommand` APIs on `IRedisClient` and `IRedisNativeClient` you can now use the RedisClient to send your own
custom commands that can call adhoc Redis commands:

```csharp
public interface IRedisClient
{
    ...
    RedisText Custom(params object[] cmdWithArgs);
}

public interface IRedisNativeClient
{
    ...
    RedisData RawCommand(params object[] cmdWithArgs);
    RedisData RawCommand(params byte[][] cmdWithBinaryArgs);
}
```

## Examples

These Custom APIs take a flexible `object[]` arguments which accepts any serializable value e.g.
`byte[]`, `string`, `int` as well as any user-defined Complex Types which are transparently serialized
as JSON and send across the wire as UTF-8 bytes.

```csharp
var ret = Redis.Custom("SET", "foo", 1);          // ret.Text = "OK"

byte[] cmdSet = Commands.Set;
ret = Redis.Custom(cmdSet, "bar", "b");           // ret.Text = "OK"

ret = Redis.Custom("GET", "foo");                 // ret.Text = "1"
```

There are also
[convenient extension methods](https://github.com/ServiceStack/ServiceStack.Redis/blob/master/src/ServiceStack.Redis/RedisDataExtensions.cs)
on `RedisData` and `RedisText` that make it easy to access structured data, e.g:

```csharp
var ret = Redis.Custom(Commands.Keys, "*");
var keys = ret.GetResults();                      // keys = ["foo", "bar"]

ret = Redis.Custom(Commands.MGet, "foo", "bar");
var values = ret.GetResults();                    // values = ["1", "b"]

Enum.GetNames(typeof(DayOfWeek)).ToList()
    .ForEach(x => Redis.Custom(Commands.RPush, "DaysOfWeek", x));
ret = Redis.Custom(Commands.LRange, "DaysOfWeek", 1, -2);
var weekDays = ret.GetResults();      

weekDays.PrintDump(); // ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
```

and some more examples using Complex Types with the Custom APIs:

```csharp
var ret = Redis.Custom(Commands.Set, "foo", new Poco { Name = "Bar" }); // ret.Text = "OK"

ret = Redis.Custom(Commands.Get, "foo");          // ret.Text =  {"Name":"Bar"}
Poco dto = ret.GetResult<Poco>();

dto.Name.Print(); // Bar
```

This API is used in most of Redis React UI's
[redis.js](https://github.com/ServiceStackApps/RedisReact/blob/master/src/RedisReact/RedisReact/js/redis.js)
JavaScript client library where Redis server commands are made available via the
[single ServiceStack Service](https://github.com/ServiceStackApps/RedisReact/blob/a1b66603d52d2f18b96227fc455ecb5323e424c8/src/RedisReact/RedisReact.ServiceInterface/RedisServices.cs#L73):

```csharp
public object Any(CallRedis request)
{
    var args = request.Args.ToArray();
    var response = new CallRedisResponse { Result = Redis.Custom(args) };
    return response;
}
```
