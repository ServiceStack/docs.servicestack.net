---
title: AutoQuery DynamoDB Data Source
---

AutoQuery Data's `DynamoDbSource` provides the most productive development experience for effortlessly creating rich, queryable and optimized Services for [DynamoDB data stores](https://aws.amazon.com/dynamodb/).

[![](https://raw.githubusercontent.com/ServiceStack/Assets/master/img/release-notes/dynamodb-banner.png)](/aws-pocodynamo)

DynamoDB is the near perfect solution if you're on AWS and in need of a managed NoSQL data storage solution 
that can achieve near-infinite scale whilst maintaining constant single-digit millisecond performance. 
The primary issue with DynamoDB however is working with it's unstructured schema and API's which is reflected 
in the official .NET DynamoDB client providing a flexible but low-level and cumbersome development experience 
to work with directly. Most of these shortcomings are resolved with our POCO-friendly 
[PocoDynamo](/aws-pocodynamo) client which provides an intuitive and idiomatic 
Typed .NET API that lets you reuse your DTO's and OrmLite POCO Data Models for persistence in DynamoDB.

Querying in DynamoDB is even more cumbersome, unlike an RDBMS which can process ad hoc queries on non-indexed 
fields with decent performance, every query in DynamoDB needs to be performed on an index defined ahead-of-time. 
Any queries not on an index needs to be sent as a Filter Expression and even more limiting is that queries 
can only be executed against rows containing the same hash id. If you need to query data spanning across 
multiple hash ids you either need to create a separate 
[Global Index](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html) 
or perform a full 
[SCAN operation](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/QueryAndScan.html#QueryAndScan.Scan) 
which is even slower than full table scans on an RDBMS as they need to be performed on all underlying sharded 
nodes which can quickly eat up your reserved provisioned throughput allotted to your DynamoDB table.

## Optimal DynamoDB Queries

With AutoQuery's `DynamoDbSource` a lot of these nuances are transparently handled where it will automatically 
create the most optimal DynamoDB Query based on the fields populated on the incoming AutoQuery Request DTO. 
E.g. it will perform a 
[DynamoDB Query](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/QueryAndScan.html#QueryAndScan.Query)
when the **Hash** field is populated otherwise transparently falls back into a 
[Scan Operation](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/QueryAndScan.html#QueryAndScan.Scan). 
Any conditions that query an Index field are added to the 
[Key Condition](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/QueryAndScan.html#QueryAndScan.Query), 
starting first with the **Range Key** (if specified), otherwise uses any populated **Local Indexes** it can 
find before any of the remaining conditions are added to the 
[Filter Expression](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/QueryAndScan.html#FilteringResults).

Transparently adopting the most optimal queries dramatically reduces development time as it lets you quickly
create, change and delete DynamoDB Services without regard for Indexes where it will often fallback to 
**SCAN** operations (performance of which is unnoticeable during development). Then once you're project is 
ready to deploy to production, go back and analyze all remaining queries your System relies on at the end 
then re-create tables with the appropriate indexes so that all App queries are efficiently querying an index.

::: info
When needed you can specify `.DynamoDbSource<T>(allowScans:false)` to disable anyone from executing SCAN 
requests when deployed to production
:::

## Download

To Get Started Install [ServiceStack's AWS Support package](https://github.com/ServiceStack/ServiceStack/tree/main/ServiceStack.Aws) from NuGet:

:::copy
`<PackageReference Include="ServiceStack.Aws" Version="8.*" />`
:::

## Simple AutoQuery Data Example

To illustrate how to use AutoQuery with DynamoDB we'll walk through a simple example of querying Rockstars Albums. 
For this example we'll specify
[explicit conventions](/autoquery#explicit-conventions)
so we can use ServiceStack's 
[typed .NET Service Clients](/csharp-client) 
to show which fields we're going to query and also lets us call the Service with a convenient typed API:

```csharp
[Route("/rockstar-albums")]
public class QueryRockstarAlbums : QueryData<RockstarAlbum>
{
    public int? Id { get; set; }         // Primary Key | Range Key
    public int? RockstarId { get; set; } // Foreign key | Hash Key
    public string Name { get; set; }
    public string Genre { get; set; }
    public int[] IdBetween { get; set; }
}
```

Here we see that creating DynamoDB Queries is no different to any other AutoQuery Data Service, where the 
same definition is used irrespective if the data source was populated from a `MemorySource`, `ServiceSource` 
or `DynamoDbSource` and the only thing that would need to change to have it query an RDBMS instead is the 
`QueryDb<T>` base class.

The text in comments highlight that when the `RockstarAlbum` POCO is stored in an RDBMS 
[OrmLite](https://github.com/ServiceStack/ServiceStack.OrmLite) 
creates the table with the `Id` as the Primary Key and `RockstarId` as a Foreign Key to the `Rockstar` table. 
This is different in DynamoDB where 
[PocoDynamo](/aws-pocodynamo) behavior is to keep related records together so
they can be efficiently queried and will instead Create the `RockstarAlbum` DynamoDB Table with the 
`RockstarId` as the Hash Key and its unique `Id` as the Range Key.

### Register DynamoDbSource

To use DynamoDB AutoQuery's you need to first configure 
[PocoDynamo](/aws-pocodynamo#download) 
which is just a matter of passing an an initialized `AmazonDynamoDBClient` and telling PocoDynamo which 
DynamoDB tables you intend to use:

```csharp
container.Register(c => new PocoDynamo(new AmazonDynamoDBClient(...))
    .RegisterTable<Rockstar>()
    .RegisterTable<RockstarAlbum>()
);
```

Then before using PocoDynamo, call `InitSchema()` to tell it to automatically go through and create all 
DynamoDB Tables that were registered but don't yet exist in DynamoDB: 

```csharp
var dynamo = container.Resolve<IPocoDynamo>();
dynamo.InitSchema();
```

So the first time `InitSchema()` is run it will create both `Rockstar` and `RockstarAlbum` tables but will 
no longer create any tables on any subsequent runs. After `InitSchema()` has completed we're assured that 
both `Rockstar` and `RockstarAlbum` tables exist so we can start using PocoDynamo's typed APIs to populate 
them with Data:

```csharp
dynamo.PutItems(new Rockstar[] { ... });
dynamo.PutItems(new RockstarAlbum[] { ... });
```

> Behind the scenes PocoDynamo efficiently creates the minimum number of 
[BatchWriteItem](http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html)
requests as necessary to store all Rockstar and RockstarAlbum's.

Now that we have data we can query we can register the AutoQuery Data plugin along with the `Rockstar` 
and `RockstarAlbum` DynamoDB Tables we want to be able to query: 

```csharp
Plugins.Add(new AutoQueryDataFeature { MaxLimit = 100 }
    .AddDataSource(ctx => ctx.DynamoDbSource<Rockstar>())
    .AddDataSource(ctx => ctx.DynamoDbSource<RockstarAlbum>())
);
```

### RockstarAlbum POCO Table Definition

Where `RockstarAlbum` is just a simple POCO and can be used as-is throughout all of ServiceStack's libraries
inc. OrmLite, Redis, Caching Providers, Serializers, etc:

```csharp
public class RockstarAlbum
{
    [AutoIncrement]
    public int Id { get; set; }

    [References(typeof(Rockstar))]
    public int RockstarId { get; set; }

    [Index]
    public string Genre { get; set; }

    public string Name { get; set; }
}
```

PocoDynamo uses the same generic metadata attributes in **ServiceStack.Interfaces** as OrmLite. 

When this POCO is created in OrmLite it creates: 

 - A `RockstarAlbum` table with an `Id` auto incrementing **Primary Key**
 - The `RockstarId` as the **Foreign Key** for the `Rockstar` table 
 - Adds an **Index** on the `Genre` column. 

Whereas in DynamoDB, PocoDynamo creates: 

 - The `RockstarAlbum` table with the `Id` as an auto incrementing **Range Key**
 - The `RockstarId` as the **Hash Key** 
 - Creates a [Local Secondary Index](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LSI.html) for the Genre attribute.

## Typed AutoQuery DynamoDB Queries

Since the properties we want to query are explicitly typed we can make use of ServiceStack's nice typed 
Service Client API's to call this Service and fetch Kurt Cobains **Grunge** Albums out of the first 5 recorded:

```csharp
var response = client.Get(new QueryRockstarAlbums { //QUERY 
    RockstarId = kurtCobainId, //Key Condition
    IdBetween = new[]{ 1, 5 }, //Key Condition
    Genre = "Grunge",          //Filter Condition
});

response.PrintDump(); // Pretty print results to Console
```

As illustrated in the comments, DynamoDB AutoQuery performs the most efficient DynamoDB Query required in 
order to satisfy this request where it will create a 
[Query Request](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/QueryAndScan.html#QueryAndScan.Query)
with the `RockstarId` and `IdBetween` conditions added to the **Key Condition** and the remaining `Genre`
added as a **Filter Expression**.

If we instead wanted to fetch all of Kurt Cobains **Grunge** Albums where there was no longer a condition on 
the Album `Id` **Range Key**, i.e:

```csharp
var response = client.Get(new QueryRockstarAlbums { //QUERY
    RockstarId = kurtCobainId, //Key Condition
    Genre = "Grunge",          //Key Condition
});
```

It would instead create a **Query Request** configured to use the Genre **Local Secondary Index** and have
added both `RockstarId` Hash Key and index `Genre` to the **Key Condition**.

But if you instead wanted to view all Grunge Albums, i.e:

```csharp
var response = client.Get(new QueryRockstarAlbums { //SCAN
    Genre = "Grunge"            //Filter Condition
});
```

As no Hash Key was specified it would instead create a **SCAN Request** where as there's no index, it adds 
all conditions to the **Filter Expression**.

## AutoQuery DynamoDB Global Index Queries

For times when you need to perform an efficient **Query Request** across multiple hash keys you will need to 
create a [Global Secondary Index](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html).
Luckily this is easy to do in PocoDynamo where you can define Global Indexes with a simple POCO class definition:

```csharp
public class RockstarAlbumGenreIndex : IGlobalIndex<RockstarAlbum>
{
    [HashKey]
    public string Genre { get; set; }

    [RangeKey]
    public int Id { get; set; }

    public string Name { get; set; }    // projected property
    public int RockstarId { get; set; } // projected property
}
```

Global Indexes can be thought of as "automatically synced tables" specified with a different Hash Key. 
Just like DynamoDB tables you can specify the **Hash Key** you want to globally query and create the Index 
on as well as a separate **Range Key** you want to be able to perform efficient **Key Condition** queries on. 
You'll also want to specify any properties you want returned when querying the Global Index so they'll be 
automatically projected and stored with the Global Index, ensuring fast access.

Then to have PocoDynamo create the Global Index it should be referenced on the table the Global Index is on:

```csharp
[References(typeof(RockstarAlbumGenreIndex))]
public class RockstarAlbum { ... }
```

When referenced, `InitSchema()` will create the `RockstarAlbumGenreIndex` Global Secondary Index when it
creates the `RockstarAlbum` DynamoDB Table.

With the Global Index created we can now query it just like we would any other DynamoDB AutoQuery but instead
of querying a table, we query the Index instead:

```csharp
public class QueryRockstarAlbumsGenreIndex : QueryData<RockstarAlbumGenreIndex>
{
    public string Genre { get; set; }     // Hash Key
    public int[] IdBetween { get; set; }  // Range Key
    public string Name { get; set; }
}
```

Once defined you can query it just like any other AutoQuery Service where you're now able to perform 
efficient queries by **Genre** across all Rockstar Album's:

```csharp
var response = client.Get(new QueryRockstarAlbumsGenreIndex //QUERY
{
    Genre = "Grunge",              //Key Condition
    IdBetween = new[] { 1, 1000 }, //Key Condition
});
```

## Custom POCO Result Mappings

A noticeable difference from querying a Global Index instead of the Table directly is that results are
returned in a different `RockstarAlbumGenreIndex` POCO. Luckily we can use AutoQuery's 
[Custom Results Feature](/autoquery#returning-custom-results)
to map the properties back into the original table `RockstarAlbum` with:

```csharp
public class QueryRockstarAlbumsGenreIndex : QueryData<RockstarAlbumGenreIndex,RockstarAlbum> 
{ 
    public string Genre { get; set; }
    public int[] IdBetween { get; set; }
    public string Name { get; set; }
}
```

Now when we query the Index we get our results populated in `RockstarAlbum` DTO's instead:

```csharp
QueryResponse<RockstarAlbum> response = client.Get(new QueryRockstarAlbumsGenreIndex
{
    Genre = "Grunge",              //Key Condition
    IdBetween = new[] { 1, 1000 }, //Key Condition
});
```

## Caching AutoQuery Services

One of the many benefits of AutoQuery Services being just regular ServiceStack Services is that we get
access to ServiceStack's rich ecosystem of enhanced functionality around existing Services. An example added
in this release is ServiceStack's new HTTP Caching feature which lets you easily cache a Service with
the new `[CacheResponse]` attribute, letting you declaratively specify how long you want to cache identical 
requests for on the **Server** as well as a `MaxAge` option for instructing the **Client** how long they should
consider their local cache is valid for and any custom `Cache-Control` behavior you want them to have, e.g:

```csharp
[Route("/rockstar-albums")]
[CacheResponse(Duration = 60, MaxAge = 30, CacheControl = CacheControl.MustRevalidate)]
public class QueryRockstarAlbums : QueryData<RockstarAlbum>
{
    public int? Id { get; set; }         
    public int? RockstarId { get; set; }
    public string Genre { get; set; }
    public int[] IdBetween { get; set; }
}
```

So with just the above single Request DTO we've declaratively created a fully-queryable DynamoDB AutoQuery 
Service that transparently executes the most ideal DynamoDB queries for each request, has it's optimal 
representation efficiently cached on both Server and clients, whose Typed DTO can be reused as-is on the 
client to call Services with an end-to-end Typed API using any
[.NET Service Client](/csharp-client), 
that's also available to external developers in a clean typed API, natively in their preferred language of 
choice, accessible with just a right-click menu integrated inside VS.NET, Xcode, Android Studio, IntelliJ 
and Eclipse - serving both PCL Xamarin.iOS/Android as well as native iOS and Android developers by just  
[Adding a ServiceStack Reference](/add-servicestack-reference)
to the base URL of a remote ServiceStack Instance - all without needing to write any implementation!

## More Info

For more examples exploring different AutoQuery Data features checkout the
[AutoQuery Data Tests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/AutoQueryDataTests.cs)
and [AutoQuery DynamoDB Tests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/AutoQueryDataTests.Dynamo.cs)
that can be compared on a feature-by-feature basis against the existing
[AutoQuery Tests](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/AutoQueryTests.cs)
they were originally based on.
