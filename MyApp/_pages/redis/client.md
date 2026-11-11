---
slug: client
title: Redis Client
---

Details of the IRedisClient API implemented by the [ServiceStack.Redis client](https://github.com/ServiceStack/ServiceStack.Redis)

## Introduction

This is a friendly, more descriptive API implemented by the [ServiceStack.Redis client](https://github.com/ServiceStack/ServiceStack.Redis)
that provides access to key values as strings (or collection of strings for Redis lists and sets).

Use this API if you just need to access values as strings or you want to have control over your own text serialization format.

<client-api-map>
</client-api-map>

## Atomic Key Commands

New in v10.5, the following extensions are available on clients returned by ServiceStack.Redis managers:

| Command | String API | Native byte API | Server requirement |
| --- | --- | --- | --- |
| GETEX | `GetAndExpireValue` | `GetEx` | Redis 6.2+ |
| GETDEL | `GetAndDeleteValue` | `GetDel` | Redis 6.2+ |
| UNLINK | `Unlink` | `Unlink` | Redis 4.0+ |

All three commands require a **writer connection**, including GETEX without an expiration option. Borrow a
client with `GetClient()` rather than `GetReadOnlyClient()`:

```csharp
using var manager = new RedisManagerPool("localhost:6379");
using var redis = manager.GetClient();

redis.SetValue("status", "ready");
string value = redis.GetAndExpireValue("status", new RedisGetExOptions {
    ExpirySeconds = 60
}); // Returns "ready" and sets its TTL in one atomic command

string removed = redis.GetAndDeleteValue("status"); // Returns "ready" and deletes the key atomically
long count = redis.Unlink("large:key", "another:key"); // Number of existing keys removed
```

`RedisGetExOptions` accepts at most one of:

- `ExpirySeconds` or `ExpiryMilliseconds` — a positive relative expiration
- `ExpiryAtSeconds` or `ExpiryAtMilliseconds` — a positive absolute Unix timestamp
- `Persist = true` — remove the expiration

Omit the options to preserve the existing TTL. A past absolute timestamp returns the current value and expires
the key. Missing keys return `null`; stored empty values remain empty. GETEX and GETDEL report a server error
for non-string values. UNLINK accepts any value type, removes keys immediately and reclaims their memory in
the background. It does not scan for matching keys or change the behavior of existing `Remove` methods.

The native `GetEx` and `GetDel` methods return raw `byte[]` values. The string APIs decode UTF-8 and do not
apply POCO deserialization. Existing serialized payloads are unchanged. Async counterparts accept cancellation
tokens; see [async key commands](/redis/async#atomic-key-commands).

These APIs use additive `IRedisNativeKeyCommands` / `IRedisNativeKeyCommandsAsync` capabilities implemented by
`RedisNativeClient` and `RedisClient`. Existing client interfaces gain no required members. A third-party
provider must implement the optional capability to use the extensions; otherwise they throw
`NotSupportedException`. Server support is separate: unsupported commands and ACL errors are propagated without
a Lua or multi-command fallback. Pipelines and transactions use the existing command queuing APIs.

## Hash Field Expiration

Expire individual hash fields with `HExpire`/`HPExpire` or absolute Unix timestamps, inspect field TTL/deadlines,
and remove expiration with `HPersist`. Sync/async APIs preserve per-field results and support NX/XX/GT/LT
conditions. Requires Redis 7.4+ or compatible native support (Valkey 9+); standalone calls only.
See [hash-field expiration](/redis/hash-field-expiration) for binary overloads, status codes and examples.

## SCAN + UNLINK Pattern Cleanup

New `UnlinkByPattern` and `UnlinkByPatternAsync` APIs scan matching keys and remove them in bounded UNLINK
batches, with memory reclaimed in the background:

```csharp
long removed = await redis.UnlinkByPatternAsync("cache:reports:*",
    batchSize: 512, scanCount: 1000, token: token);
```

Use an exclusively leased writer. `batchSize` is a hard key-count limit per UNLINK; `scanCount` is a SCAN hint,
not a response-size guarantee. The result sums Redis-confirmed removals. Binary key names are preserved.
Existing `RemoveByPattern` behavior is unchanged. Requires Redis 4.0+ and SCAN/UNLINK permission; errors propagate
without a DEL fallback. Cancellation is checked between scans and batches and may leave partial cleanup.
The scan is not an atomic snapshot; concurrent writes and duplicate observations can affect results. These
multi-command helpers cannot run inside a pipeline or transaction.

## Streams

Sync/async Streams commands, typed JSON entries and explicit consumer-group recovery are available in v10.5. See the [Streams guide](/redis/streams) for usage, server requirements and blocking-connection semantics.

## API

```csharp
public interface IRedisClient
    : IEntityStore, ICacheClient
{
    //Basic Redis Connection operations
    long Db { get; set; }
    long DbSize { get; }
    Dictionary<string, string> Info { get; }
    DateTime LastSave { get; }
    string Host { get; }
    int Port { get; }
    int ConnectTimeout { get; set; }
    int RetryTimeout { get; set; }
    int RetryCount { get; set; }
    int SendTimeout { get; set; }
    string Password { get; set; }
    bool HadExceptions { get; }

    void Save();
    void SaveAsync();
    void Shutdown();
    void RewriteAppendOnlyFileAsync();
    void FlushDb();

    //Basic Redis Connection Info
    string this[string key] { get; set; }

    List<string> GetAllKeys();
    void SetEntry(string key, string value);
    void SetEntry(string key, string value, TimeSpan expireIn);
    bool SetEntryIfNotExists(string key, string value);
    void SetAll(IEnumerable<string> keys, IEnumerable<string> values);
    void SetAll(Dictionary<string, string> map);
    string GetEntry(string key);
    string GetValue(string key);
    string GetAndSetEntry(string key, string value);
    List<string> GetValues(List<string> keys);
    List<T> GetValues<T>(List<string> keys);
    Dictionary<string, string> GetValuesMap(List<string> keys);
    Dictionary<string, T> GetValuesMap<T>(List<string> keys);
    long AppendToValue(string key, string value);
    void RenameKey(string fromName, string toName);

    //store POCOs as hash
    T GetFromHash<T>(object id);
    void StoreAsHash<T>(T entity);

    object StoreObject(object entity);

    bool ContainsKey(string key);
    bool RemoveEntry(params string[] args);
    long IncrementValue(string key);
    long IncrementValueBy(string key, int count);
    long IncrementValueBy(string key, long count);
    double IncrementValueBy(string key, double count);
    long DecrementValue(string key);
    long DecrementValueBy(string key, int count);
    List<string> SearchKeys(string pattern);

    RedisKeyType GetEntryType(string key);
    string GetRandomKey();
    bool ExpireEntryIn(string key, TimeSpan expireIn);
    bool ExpireEntryAt(string key, DateTime expireAt);
    TimeSpan GetTimeToLive(string key);
    List<string> GetSortedEntryValues(string key, int startingFrom, int endingAt);

    //Store entities without registering entity ids
    void WriteAll<TEntity>(IEnumerable<TEntity> entities);

    //Scan APIs
    IEnumerable<string> ScanAllKeys(string pattern = null, int pageSize = 1000);
    IEnumerable<string> ScanAllSetItems(string setId, string pattern = null, int pageSize = 1000);
    IEnumerable<KeyValuePair<string, double>> ScanAllSortedSetItems(string setId, string pattern = null, int pageSize = 1000);
    IEnumerable<KeyValuePair<string, string>> ScanAllHashEntries(string hashId, string pattern = null, int pageSize = 1000);

    //Hyperlog APIs
    bool AddToHyperLog(string key, params string[] elements);
    long CountHyperLog(string key);
    void MergeHyperLogs(string toKey, params string[] fromKeys);

    /// <summary>
    /// Returns a high-level typed client API
    /// </summary>
    /// <typeparam name="T"></typeparam>
    IRedisTypedClient<T> As<T>();

    IHasNamed<IRedisList> Lists { get; set; }
    IHasNamed<IRedisSet> Sets { get; set; }
    IHasNamed<IRedisSortedSet> SortedSets { get; set; }
    IHasNamed<IRedisHash> Hashes { get; set; }

    IRedisTransaction CreateTransaction();
    IRedisPipeline CreatePipeline();

    IDisposable AcquireLock(string key);
    IDisposable AcquireLock(string key, TimeSpan timeOut);

    #region Redis pubsub

    void Watch(params string[] keys);
    void UnWatch();
    IRedisSubscription CreateSubscription();
    long PublishMessage(string toChannel, string message);

    #endregion


    #region Set operations

    HashSet<string> GetAllItemsFromSet(string setId);
    void AddItemToSet(string setId, string item);
    void AddRangeToSet(string setId, List<string> items);
    void RemoveItemFromSet(string setId, string item);
    string PopItemFromSet(string setId);
    void MoveBetweenSets(string fromSetId, string toSetId, string item);
    long GetSetCount(string setId);
    bool SetContainsItem(string setId, string item);
    HashSet<string> GetIntersectFromSets(params string[] setIds);
    void StoreIntersectFromSets(string intoSetId, params string[] setIds);
    HashSet<string> GetUnionFromSets(params string[] setIds);
    void StoreUnionFromSets(string intoSetId, params string[] setIds);
    HashSet<string> GetDifferencesFromSet(string fromSetId, params string[] withSetIds);
    void StoreDifferencesFromSet(string intoSetId, string fromSetId, params string[] withSetIds);
    string GetRandomItemFromSet(string setId);

    #endregion


    #region List operations

    List<string> GetAllItemsFromList(string listId);
    List<string> GetRangeFromList(string listId, int startingFrom, int endingAt);
    List<string> GetRangeFromSortedList(string listId, int startingFrom, int endingAt);
    List<string> GetSortedItemsFromList(string listId, SortOptions sortOptions);
    void AddItemToList(string listId, string value);
    void AddRangeToList(string listId, List<string> values);
    void PrependItemToList(string listId, string value);
    void PrependRangeToList(string listId, List<string> values);

    void RemoveAllFromList(string listId);
    string RemoveStartFromList(string listId);
    string BlockingRemoveStartFromList(string listId, TimeSpan? timeOut);
    ItemRef BlockingRemoveStartFromLists(string[] listIds, TimeSpan? timeOut);
    string RemoveEndFromList(string listId);
    void TrimList(string listId, int keepStartingFrom, int keepEndingAt);
    long RemoveItemFromList(string listId, string value);
    long RemoveItemFromList(string listId, string value, int noOfMatches);
    long GetListCount(string listId);
    string GetItemFromList(string listId, int listIndex);
    void SetItemInList(string listId, int listIndex, string value);

    //Queue operations
    void EnqueueItemOnList(string listId, string value);
    string DequeueItemFromList(string listId);
    string BlockingDequeueItemFromList(string listId, TimeSpan? timeOut);
    ItemRef BlockingDequeueItemFromLists(string[] listIds, TimeSpan? timeOut);

    //Stack operations
    void PushItemToList(string listId, string value);
    string PopItemFromList(string listId);
    string BlockingPopItemFromList(string listId, TimeSpan? timeOut);
    ItemRef BlockingPopItemFromLists(string[] listIds, TimeSpan? timeOut);
    string PopAndPushItemBetweenLists(string fromListId, string toListId);
    string BlockingPopAndPushItemBetweenLists(string fromListId, string toListId, TimeSpan? timeOut);

    #endregion


    #region Sorted Set operations

    bool AddItemToSortedSet(string setId, string value);
    bool AddItemToSortedSet(string setId, string value, double score);
    bool AddRangeToSortedSet(string setId, List<string> values, double score);
    bool AddRangeToSortedSet(string setId, List<string> values, long score);
    bool RemoveItemFromSortedSet(string setId, string value);
    string PopItemWithLowestScoreFromSortedSet(string setId);
    string PopItemWithHighestScoreFromSortedSet(string setId);
    bool SortedSetContainsItem(string setId, string value);
    double IncrementItemInSortedSet(string setId, string value, double incrementBy);
    double IncrementItemInSortedSet(string setId, string value, long incrementBy);
    long GetItemIndexInSortedSet(string setId, string value);
    long GetItemIndexInSortedSetDesc(string setId, string value);
    List<string> GetAllItemsFromSortedSet(string setId);
    List<string> GetAllItemsFromSortedSetDesc(string setId);
    List<string> GetRangeFromSortedSet(string setId, int fromRank, int toRank);
    List<string> GetRangeFromSortedSetDesc(string setId, int fromRank, int toRank);
    IDictionary<string, double> GetAllWithScoresFromSortedSet(string setId);
    IDictionary<string, double> GetRangeWithScoresFromSortedSet(string setId, int fromRank, int toRank);
    IDictionary<string, double> GetRangeWithScoresFromSortedSetDesc(string setId, int fromRank, int toRank);
    List<string> GetRangeFromSortedSetByLowestScore(string setId, string fromStringScore, string toStringScore);
    List<string> GetRangeFromSortedSetByLowestScore(string setId, string fromStringScore, string toStringScore, int? skip, int? take);
    List<string> GetRangeFromSortedSetByLowestScore(string setId, double fromScore, double toScore);
    List<string> GetRangeFromSortedSetByLowestScore(string setId, long fromScore, long toScore);
    List<string> GetRangeFromSortedSetByLowestScore(string setId, double fromScore, double toScore, int? skip, int? take);
    List<string> GetRangeFromSortedSetByLowestScore(string setId, long fromScore, long toScore, int? skip, int? take);
    IDictionary<string, double> GetRangeWithScoresFromSortedSetByLowestScore(string setId, string fromStringScore, string toStringScore);
    IDictionary<string, double> GetRangeWithScoresFromSortedSetByLowestScore(string setId, string fromStringScore, string toStringScore, int? skip, int? take);
    IDictionary<string, double> GetRangeWithScoresFromSortedSetByLowestScore(string setId, double fromScore, double toScore);
    IDictionary<string, double> GetRangeWithScoresFromSortedSetByLowestScore(string setId, long fromScore, long toScore);
    IDictionary<string, double> GetRangeWithScoresFromSortedSetByLowestScore(string setId, double fromScore, double toScore, int? skip, int? take);
    IDictionary<string, double> GetRangeWithScoresFromSortedSetByLowestScore(string setId, long fromScore, long toScore, int? skip, int? take);
    List<string> GetRangeFromSortedSetByHighestScore(string setId, string fromStringScore, string toStringScore);
    List<string> GetRangeFromSortedSetByHighestScore(string setId, string fromStringScore, string toStringScore, int? skip, int? take);
    List<string> GetRangeFromSortedSetByHighestScore(string setId, double fromScore, double toScore);
    List<string> GetRangeFromSortedSetByHighestScore(string setId, long fromScore, long toScore);
    List<string> GetRangeFromSortedSetByHighestScore(string setId, double fromScore, double toScore, int? skip, int? take);
    List<string> GetRangeFromSortedSetByHighestScore(string setId, long fromScore, long toScore, int? skip, int? take);
    IDictionary<string, double> GetRangeWithScoresFromSortedSetByHighestScore(string setId, string fromStringScore, string toStringScore);
    IDictionary<string, double> GetRangeWithScoresFromSortedSetByHighestScore(string setId, string fromStringScore, string toStringScore, int? skip, int? take);
    IDictionary<string, double> GetRangeWithScoresFromSortedSetByHighestScore(string setId, double fromScore, double toScore);
    IDictionary<string, double> GetRangeWithScoresFromSortedSetByHighestScore(string setId, long fromScore, long toScore);
    IDictionary<string, double> GetRangeWithScoresFromSortedSetByHighestScore(string setId, double fromScore, double toScore, int? skip, int? take);
    IDictionary<string, double> GetRangeWithScoresFromSortedSetByHighestScore(string setId, long fromScore, long toScore, int? skip, int? take);
    long RemoveRangeFromSortedSet(string setId, int minRank, int maxRank);
    long RemoveRangeFromSortedSetByScore(string setId, double fromScore, double toScore);
    long RemoveRangeFromSortedSetByScore(string setId, long fromScore, long toScore);
    long GetSortedSetCount(string setId);
    long GetSortedSetCount(string setId, string fromStringScore, string toStringScore);
    long GetSortedSetCount(string setId, long fromScore, long toScore);
    long GetSortedSetCount(string setId, double fromScore, double toScore);
    double GetItemScoreInSortedSet(string setId, string value);
    long StoreIntersectFromSortedSets(string intoSetId, params string[] setIds);
    long StoreUnionFromSortedSets(string intoSetId, params string[] setIds);
    List<string> SearchSortedSet(string setId, string start = null, string end = null, int? skip = null, int? take = null);
    long SearchSortedSetCount(string setId, string start = null, string end = null);
    long RemoveRangeFromSortedSetBySearch(string setId, string start = null, string end = null);

    #endregion


    #region Hash operations

    bool HashContainsEntry(string hashId, string key);
    bool SetEntryInHash(string hashId, string key, string value);
    bool SetEntryInHashIfNotExists(string hashId, string key, string value);
    void SetRangeInHash(string hashId, IEnumerable<KeyValuePair<string, string>> keyValuePairs);
    long IncrementValueInHash(string hashId, string key, int incrementBy);
    double IncrementValueInHash(string hashId, string key, double incrementBy);
    string GetValueFromHash(string hashId, string key);
    List<string> GetValuesFromHash(string hashId, params string[] keys);
    bool RemoveEntryFromHash(string hashId, string key);
    long GetHashCount(string hashId);
    List<string> GetHashKeys(string hashId);
    List<string> GetHashValues(string hashId);
    Dictionary<string, string> GetAllEntriesFromHash(string hashId);

    #endregion


    #region Eval/Lua operations

    string ExecLuaAsString(string luaBody, params string[] args);
    string ExecLuaAsString(string luaBody, string[] keys, string[] args);
    string ExecLuaShaAsString(string sha1, params string[] args);
    string ExecLuaShaAsString(string sha1, string[] keys, string[] args);

    long ExecLuaAsInt(string luaBody, params string[] args);
    long ExecLuaAsInt(string luaBody, string[] keys, string[] args);
    long ExecLuaShaAsInt(string sha1, params string[] args);
    long ExecLuaShaAsInt(string sha1, string[] keys, string[] args);

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

    #endregion

}
```

Generally, if you only have basic persistence needs I would recommend developing against the above common data access API as it is easier for
other persistence providers to implement and increases the likely-hood that your existing library can be reused as-is to have your POCO types
persist against other data stores i.e. against an RDBMS with OrmLite, etc.
