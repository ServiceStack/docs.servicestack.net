---
slug: lua
title: RedisClient LUA APIs
---

The `IRedisClient` APIs for [redis server-side LUA support](http://redis.io/commands/eval) have been re-factored into the more user-friendly APIs below:

## API

```csharp
public interface IRedisClient 
{
    //Eval/Lua operations 
    T ExecCachedLua<T>(string scriptBody, Func<string, T> scriptSha1);

    RedisText ExecLua(string body, params string[] args);
    RedisText ExecLua(string luaBody, string[] keys, string[] args);
    RedisText ExecLuaSha(string sha1, params string[] args);
    RedisText ExecLuaSha(string sha1, string[] keys, string[] args);

    string ExecLuaAsString(string luaBody, params string[] args);
    string ExecLuaAsString(string luaBody, string[] keys, string[] args);
    string ExecLuaShaAsString(string sha1, params string[] args);
    string ExecLuaShaAsString(string sha1, string[] keys, string[] args);
    
    int ExecLuaAsInt(string luaBody, params string[] args);
    int ExecLuaAsInt(string luaBody, string[] keys, string[] args);
    int ExecLuaShaAsInt(string sha1, params string[] args);
    int ExecLuaShaAsInt(string sha1, string[] keys, string[] args);

    List<string> ExecLuaAsList(string luaBody, params string[] args);
    List<string> ExecLuaAsList(string luaBody, string[] keys, string[] args);
    List<string> ExecLuaShaAsList(string sha1, params string[] args);
    List<string> ExecLuaShaAsList(string sha1, string[] keys, string[] args);

    string CalculateSha1(string luaBody);
    
    bool HasLuaScript(string sha1Ref);
    Dictionary<string, bool> WhichLuaScriptsExists(params string[] sha1Refs);
    void RemoveAllLuaScripts();
    void KillRunningLuaScript();
    string LoadLuaScript(string body);
}
```

## Efficient SCAN in LUA

The C# API below returns the first 10 results matching the `key:*` pattern:

```csharp
var keys = Redis.ScanAllKeys(pattern: "key:*", pageSize: 10)
    .Take(10).ToList();
```

However the C# Streaming API above requires an unknown number of Redis Operations (bounded to the number of keys in Redis)
to complete the request. The number of SCAN calls can be reduced by choosing a higher `pageSize` to tell Redis to scan more keys
each time the SCAN operation is called.

As the number of API calls has the potential to result in a large number of Redis Operations, it can end up yielding an unacceptable
delay due to the latency of multiple dependent remote network calls. An easy solution is to instead have the multiple SCAN calls
performed in-process on the Redis Server, eliminating the network latency of multiple SCAN calls, e.g:

```csharp
const string FastScanScript = @"
local limit = tonumber(ARGV[2])
local pattern = ARGV[1]
local cursor = 0
local len = 0
local results = {}
repeat
    local r = redis.call('scan', cursor, 'MATCH', pattern, 'COUNT', limit)
    cursor = tonumber(r[1])
    for k,v in ipairs(r[2]) do
        table.insert(results, v)
        len = len + 1
        if len == limit then break end
    end
until cursor == 0 or len == limit
return results";

RedisText r = redis.ExecLua(FastScanScript, "key:*", "10");
r.Children.Count.Print() //= 10
```

The `ExecLua` API returns this complex LUA table response in the `Children` collection of the `RedisText` Response.

### Alternative Complex API Response

Another way to return complex data structures in a LUA operation is to serialize the result as JSON

```lua
return cjson.encode(results)
```

Which you can access as raw JSON by parsing the response as a String with:

```csharp
string json = redis.ExecLuaAsString(FastScanScript, "key:*", "10");
```

::: info
This is also the approach used in Redis React's [RedisServices](https://github.com/ServiceStackApps/RedisReact/blob/a1b66603d52d2f18b96227fc455ecb5323e424c8/src/RedisReact/RedisReact.ServiceInterface/RedisServices.cs#L60).
:::

## ExecCachedLua

ExecCachedLua is a convenient high-level API that eliminates the bookkeeping required for executing high-performance server LUA
Scripts which suffers from many of the problems that RDBMS stored procedures have which depends on pre-existing state in the RDBMS
that needs to be updated with the latest version of the Stored Procedure.

With Redis LUA you either have the option to send, parse, load then execute the entire LUA script each time it's called or
alternatively you could pre-load the LUA Script into Redis once on StartUp and then execute it using the Script's SHA1 hash.
The issue with this is that if the Redis server is accidentally flushed you're left with a broken application relying on a
pre-existing script that's no longer there. The new `ExecCachedLua` API provides the best of both worlds where it will always
execute the compiled SHA1 script, saving bandwidth and CPU but will also re-create the LUA Script if it no longer exists.

You can instead execute the compiled LUA script above by its SHA1 identifier, which continues to work regardless if it never existed
or was removed at runtime, e.g:

```csharp
// #1: Loads LUA script and caches SHA1 hash in Redis Client
r = redis.ExecCachedLua(FastScanScript, sha1 =>
    redis.ExecLuaSha(sha1, "key:*", "10"));

// #2: Executes using cached SHA1 hash
r = redis.ExecCachedLua(FastScanScript, sha1 =>
    redis.ExecLuaSha(sha1, "key:*", "10"));

// Deletes all existing compiled LUA scripts 
redis.ScriptFlush();

// #3: Executes using cached SHA1 hash, gets NOSCRIPT Error, 
//     re-creates then re-executes the LUA script using its SHA1 hash
r = redis.ExecCachedLua(FastScanScript, sha1 =>
    redis.ExecLuaSha(sha1, "key:*", "10"));
```

## Usage Examples

Here's how you can implement a **ZPOP** in Lua to remove the items with the lowest rank from a sorted set:

```csharp
var luaBody = @"
    local val = redis.call('zrange', KEYS[1], 0, ARGV[1]-1)
    if val then redis.call('zremrangebyrank', KEYS[1], 0, ARGV[1]-1) end
    return val";

var i = 0;
var alphabet = 26.Times(c => ((char)('A' + c)).ToString());
alphabet.ForEach(x => Redis.AddItemToSortedSet("zalphabet", x, i++));

//Remove the letters with the lowest rank from the sorted set 'zalphabet'
var letters = Redis.ExecLuaAsList(luaBody, keys: new[] { "zalphabet" }, args: new[] { "3" });
letters.PrintDump(); //[A, B, C]
```

And how to implement **ZREVPOP** to remove items with the highest rank from a sorted set:

```csharp
var luaBody = @"
    local val = redis.call('zrange', KEYS[1], -ARGV[1], -1)
    if val then redis.call('zremrangebyrank', KEYS[1], -ARGV[1], -1) end
    return val";

var i = 0;
var alphabet = 26.Times(c => ((char)('A' + c)).ToString());
alphabet.ForEach(x => Redis.AddItemToSortedSet("zalphabet", x, i++));

//Remove the letters with the highest rank from the sorted set 'zalphabet'
List<string> letters = Redis.ExecLuaAsList(luaBody, 
    keys: new[] { "zalphabet" }, args: new[] { "3" });

letters.PrintDump(); //[X, Y, Z]
```

## Other examples

Returning an `int`:

```csharp
int intVal = Redis.ExecLuaAsInt("return 123"); //123
int intVal = Redis.ExecLuaAsInt("return ARGV[1] + ARGV[2]", "10", "20"); //30
```

Returning an `string`:

```csharp
//Hello, Redis Lua!
var strVal = Redis.ExecLuaAsString(@"return 'Hello, ' .. ARGV[1] .. '!'", "Redis Lua");
```

Returning a `List` of strings:

```csharp
Enum.GetNames(typeof(DayOfWeek)).ToList()
    .ForEach(x => Redis.AddItemToList("DaysOfWeek", x));

var daysOfWeek = Redis.ExecLuaAsList("return redis.call('LRANGE', 'DaysOfWeek', 0, -1)");
daysOfWeek.PrintDump(); //[Sunday, Monday, Tuesday, ...]
```

More examples can be found in the [Redis Eval Lua tests](https://github.com/ServiceStack/ServiceStack.Redis/blob/master/tests/ServiceStack.Redis.Tests/RedisClientEvalTests.cs)
