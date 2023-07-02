---
slug: client-usage
title: Getting Started with Redis Client APIs
---

Below is a simple example to give you a flavour of how easy it is to use some of Redis's advanced data structures - in this case Redis Lists:
_Full source code of this example is [viewable online](https://github.com/ServiceStack/ServiceStack.Redis/blob/master/tests/ServiceStack.Redis.Tests/ShippersExample.cs)_

```csharp
using var redisClient = new RedisClient();
//Create a 'strongly-typed' API that makes all Redis Value operations to apply against Shippers
IRedisTypedClient<Shipper> redis = redisClient.As<Shipper>();

//Redis lists implement IList<T> while Redis sets implement ICollection<T>
var currentShippers = redis.Lists["urn:shippers:current"];
var prospectiveShippers = redis.Lists["urn:shippers:prospective"];

currentShippers.Add(
    new Shipper {
        Id = redis.GetNextSequence(),
        CompanyName = "Trains R Us",
        DateCreated = DateTime.UtcNow,
        ShipperType = ShipperType.Trains,
        UniqueRef = Guid.NewGuid()
    });

currentShippers.Add(
    new Shipper {
        Id = redis.GetNextSequence(),
        CompanyName = "Planes R Us",
        DateCreated = DateTime.UtcNow,
        ShipperType = ShipperType.Planes,
        UniqueRef = Guid.NewGuid()
    });

var lameShipper = new Shipper {
    Id = redis.GetNextSequence(),
    CompanyName = "We do everything!",
    DateCreated = DateTime.UtcNow,
    ShipperType = ShipperType.All,
    UniqueRef = Guid.NewGuid()
};

currentShippers.Add(lameShipper);

Dump("ADDED 3 SHIPPERS:", currentShippers);

currentShippers.Remove(lameShipper);

Dump("REMOVED 1:", currentShippers);

prospectiveShippers.Add(
    new Shipper {
        Id = redis.GetNextSequence(),
        CompanyName = "Trucks R Us",
        DateCreated = DateTime.UtcNow,
        ShipperType = ShipperType.Automobiles,
        UniqueRef = Guid.NewGuid()
    });

Dump("ADDED A PROSPECTIVE SHIPPER:", prospectiveShippers);

redis.PopAndPushBetweenLists(prospectiveShippers, currentShippers);

Dump("CURRENT SHIPPERS AFTER POP n' PUSH:", currentShippers);
Dump("PROSPECTIVE SHIPPERS AFTER POP n' PUSH:", prospectiveShippers);

var poppedShipper = redis.PopFromList(currentShippers);
Dump("POPPED a SHIPPER:", poppedShipper);
Dump("CURRENT SHIPPERS AFTER POP:", currentShippers);

//reset sequence and delete all lists
redis.SetSequence(0);
redis.Remove(currentShippers, prospectiveShippers);
Dump("DELETING CURRENT AND PROSPECTIVE SHIPPERS:", currentShippers);
```

EXAMPLE OUTPUT:

```
ADDED 3 SHIPPERS:
Id:1,CompanyName:Trains R Us,ShipperType:Trains,DateCreated:2010-01-31T11:53:37.7169323Z,UniqueRef:d17c5db0415b44b2ac5da7b6ebd780f5
Id:2,CompanyName:Planes R Us,ShipperType:Planes,DateCreated:2010-01-31T11:53:37.799937Z,UniqueRef:e02a73191f4b4e7a9c44eef5b5965d06
Id:3,CompanyName:We do everything!,ShipperType:All,DateCreated:2010-01-31T11:53:37.8009371Z,UniqueRef:d0c249bbbaf84da39fc4afde1b34e332

REMOVED 1:
Id:1,CompanyName:Trains R Us,ShipperType:Trains,DateCreated:2010-01-31T11:53:37.7169323Z,UniqueRef:d17c5db0415b44b2ac5da7b6ebd780f5
Id:2,CompanyName:Planes R Us,ShipperType:Planes,DateCreated:2010-01-31T11:53:37.799937Z,UniqueRef:e02a73191f4b4e7a9c44eef5b5965d06

ADDED A PROSPECTIVE SHIPPER:
Id:4,CompanyName:Trucks R Us,ShipperType:Automobiles,DateCreated:2010-01-31T11:53:37.8539401Z,UniqueRef:67d7d4947ebc4b0ba5c4d42f5d903bec

CURRENT SHIPPERS AFTER POP n' PUSH:
Id:4,CompanyName:Trucks R Us,ShipperType:Automobiles,DateCreated:2010-01-31T11:53:37.8539401Z,UniqueRef:67d7d4947ebc4b0ba5c4d42f5d903bec
Id:1,CompanyName:Trains R Us,ShipperType:Trains,DateCreated:2010-01-31T11:53:37.7169323Z,UniqueRef:d17c5db0415b44b2ac5da7b6ebd780f5
Id:2,CompanyName:Planes R Us,ShipperType:Planes,DateCreated:2010-01-31T11:53:37.799937Z,UniqueRef:e02a73191f4b4e7a9c44eef5b5965d06

PROSPECTIVE SHIPPERS AFTER POP n' PUSH:

POPPED a SHIPPER:
Id:2,CompanyName:Planes R Us,ShipperType:Planes,DateCreated:2010-01-31T11:53:37.799937Z,UniqueRef:e02a73191f4b4e7a9c44eef5b5965d06

CURRENT SHIPPERS AFTER POP:
Id:4,CompanyName:Trucks R Us,ShipperType:Automobiles,DateCreated:2010-01-31T11:53:37.8539401Z,UniqueRef:67d7d4947ebc4b0ba5c4d42f5d903bec
Id:1,CompanyName:Trains R Us,ShipperType:Trains,DateCreated:2010-01-31T11:53:37.7169323Z,UniqueRef:d17c5db0415b44b2ac5da7b6ebd780f5

DELETING CURRENT AND PROSPECTIVE SHIPPERS:
```

More examples are available in the [RedisExamples Redis examples page] and in the comprehensive
[test suite](https://github.com/ServiceStack/ServiceStack.Redis/tree/master/tests/ServiceStack.Redis.Tests)


## Speed
One of the best things about Redis is the speed - it is quick.

[This example](https://github.com/ServiceStack/ServiceStack.Redis/blob/master/tests/ServiceStack.Redis.Tests/RedisClientTests.cs)
below stores and gets the entire [Northwind database](http://code.google.com/p/servicestack/source/browse/trunk/Common/Northwind.Benchmarks/Northwind.Common/DataModel/NorthwindData.cs) (3202 records) in less *1.2 secs* - we've never had it so quick!

_(Running inside a VS.NET/R# unit test on a 3 year old iMac)_

```csharp
using var client = new RedisClient();

var before = DateTime.Now;
client.StoreAll(NorthwindData.Categories);
client.StoreAll(NorthwindData.Customers);
client.StoreAll(NorthwindData.Employees);
client.StoreAll(NorthwindData.Shippers);
client.StoreAll(NorthwindData.Orders);
client.StoreAll(NorthwindData.Products);
client.StoreAll(NorthwindData.OrderDetails);
client.StoreAll(NorthwindData.CustomerCustomerDemos);
client.StoreAll(NorthwindData.Regions);
client.StoreAll(NorthwindData.Territories);
client.StoreAll(NorthwindData.EmployeeTerritories);

Console.WriteLine("Took {0}ms to store the entire Northwind database ({1} records)",
    (DateTime.Now - before).TotalMilliseconds, totalRecords);

before = DateTime.Now;
var categories = client.GetAll<Category>();
var customers = client.GetAll<Customer>();
var employees = client.GetAll<Employee>();
var shippers = client.GetAll<Shipper>();
var orders = client.GetAll<Order>();
var products = client.GetAll<Product>();
var orderDetails = client.GetAll<OrderDetail>();
var customerCustomerDemos = client.GetAll<CustomerCustomerDemo>();
var regions = client.GetAll<Region>();
var territories = client.GetAll<Territory>();
var employeeTerritories = client.GetAll<EmployeeTerritory>();

Console.WriteLine("Took {0}ms to get the entire Northwind database ({1} records)",
    (DateTime.Now - before).TotalMilliseconds, totalRecords);
/*
== EXAMPLE OUTPUT ==

Took 1020.0583ms to store the entire Northwind database (3202 records)
Took 132.0076ms to get the entire Northwind database (3202 records)
*/
```


Note: The total time taken includes an extra Redis operation for each record to store the id in a Redis set for each
type as well as serializing and de-serializing each record using Service Stack's TypeSerializer.

## Lex Operations

The new [ZRANGEBYLEX](http://redis.io/commands/zrangebylex) sorted set operations allowing you to query a sorted set lexically have been added.
A good showcase for this is available on [autocomplete.redis.io](http://autocomplete.redis.io/).

These new operations are available as a 1:1 mapping with redis-server on `IRedisNativeClient`:

```csharp
public interface IRedisNativeClient
{
    ...
    byte[][] ZRangeByLex(string setId, string min, string max, int? skip, int? take);
    long ZLexCount(string setId, string min, string max);
    long ZRemRangeByLex(string setId, string min, string max);
}
```

And the more user-friendly APIs under `IRedisClient`:

```csharp
public interface IRedisClient
{
    ...
    List<string> SearchSortedSet(string setId, string start=null, string end=null);
    long SearchSortedSetCount(string setId, string start=null, string end=null);
    long RemoveRangeFromSortedSetBySearch(string setId, string start=null, string end=null);
}
```

Just like NuGet version matchers, Redis uses `[` char to express inclusiveness and `(` char for exclusiveness.
Since the `IRedisClient` APIs defaults to inclusive searches, these two APIs are the same:

```csharp
Redis.SearchSortedSetCount("zset", "a", "c")
Redis.SearchSortedSetCount("zset", "[a", "[c")
```

Alternatively you can specify one or both bounds to be exclusive by using the `(` prefix, e.g:

```csharp
Redis.SearchSortedSetCount("zset", "a", "(c")
Redis.SearchSortedSetCount("zset", "(a", "(c")
```

More API examples are available in [LexTests.cs](https://github.com/ServiceStack/ServiceStack.Redis/blob/master/tests/ServiceStack.Redis.Tests/LexTests.cs).

## HyperLog API

The development branch of Redis server (available when v3.0 is released) includes an ingenious algorithm to approximate the unique elements in a set with maximum space and time efficiency. For details about how it works see Redis's creator Salvatore's blog who [explains it in great detail](http://antirez.com/news/75). Essentially it lets you maintain an efficient way to count and merge unique elements in a set without having to store its elements.
A Simple example of it in action:

```csharp
redis.AddToHyperLog("set1", "a", "b", "c");
redis.AddToHyperLog("set1", "c", "d");
var count = redis.CountHyperLog("set1"); //4

redis.AddToHyperLog("set2", "c", "d", "e", "f");

redis.MergeHyperLogs("mergedset", "set1", "set2");

var mergeCount = redis.CountHyperLog("mergedset"); //6
```

## Scan APIs

Redis v2.8 introduced a beautiful new [SCAN](http://redis.io/commands/scan) operation that provides an optimal strategy for traversing a redis instance entire keyset in managable-size chunks utilizing only a client-side cursor and without introducing any server state. It's a higher performance alternative and should be used instead of [KEYS](http://redis.io/commands/keys) in application code. SCAN and its related operations for traversing members of Sets, Sorted Sets and Hashes are now available in the Redis Client in the following APIs:

```csharp
public interface IRedisClient
{
    ...
    IEnumerable<string> ScanAllKeys(string pattern = null, int pageSize = 1000);
    IEnumerable<string> ScanAllSetItems(string setId, string pattern = null, int pageSize = 1000);
    IEnumerable<KeyValuePair<string, double>> ScanAllSortedSetItems(string setId, string pattern = null, int pageSize = 1000);
    IEnumerable<KeyValuePair<string, string>> ScanAllHashEntries(string hashId, string pattern = null, int pageSize = 1000);    
}

public interface IRedisClientAsync
{
    IAsyncEnumerable<string> ScanAllKeysAsync(string pattern = null, int pageSize, CancellationToken ct);
    IAsyncEnumerable<string> ScanAllSetItemsAsync(string setId, string pattern = null, int pageSize, CancellationToken ct);
    IAsyncEnumerable<KeyValuePair<string, double>> ScanAllSortedSetItemsAsync(string setId, string pattern = null, int pageSize, ct);
    IAsyncEnumerable<KeyValuePair<string, string>> ScanAllHashEntriesAsync(string hashId, string pattern = null, int pageSize, ct);
}

//Low-level API
public interface IRedisNativeClient
{
    ...
    ScanResult Scan(ulong cursor, int count = 10, string match = null);
    ScanResult SScan(string setId, ulong cursor, int count = 10, string match = null);
    ScanResult ZScan(string setId, ulong cursor, int count = 10, string match = null);
    ScanResult HScan(string hashId, ulong cursor, int count = 10, string match = null);
}

public interface IRedisNativeClientAsync 
{
    ValueTask<ScanResult> ScanAsync(ulong cursor, int count = 10, string match = null, CancellationToken ct);
    ValueTask<ScanResult> SScanAsync(string setId, ulong cursor, int count = 10, string match = null, CancellationToken ct);
    ValueTask<ScanResult> ZScanAsync(string setId, ulong cursor, int count = 10, string match = null, CancellationToken ct);
    ValueTask<ScanResult> HScanAsync(string hashId, ulong cursor, int count = 10, string match = null, CancellationToken ct);
}
```

The `IRedisClient` provides a higher-level API that abstracts away the client cursor to expose a lazy Enumerable sequence to provide an optimal way to stream scanned results that integrates nicely with LINQ, e.g:

```csharp
var scanUsers = Redis.ScanAllKeys("urn:User:*");
var sampleUsers = scanUsers.Take(10000).ToList(); //Stop after retrieving 10000 user keys 
```
