---
title: AutoQuery Data
---

AutoQuery Data is a new implementation that closely follows the dev model you're used to with [AutoQuery RDBMS](/autoquery/rdbms)
where any experience gained in creating RDBMS AutoQuery Services previously are now also applicable to 
Querying alternative data sources as well.

### Getting Started

The AutoQuery Data Feature is enabled by registering:

```csharp
Plugins.Add(new AutoQueryDataFeature { MaxLimit = 100 });
```

### Learn Once, Query Everywhere 

All features from [AutoQuery RDBMS](/autoquery/rdbms) except for the RDBMS-specific 
[Joining Tables](/autoquery#joining-tables) and
[Raw SQL Filters](/autoquery#raw-sql-filters) features
also have an equivalent in AutoQuery Data as well. 

Like AutoQuery you can declaratively create AutoQuery Data Services using just Request DTO's but instead of 
inheriting from `QueryDb<T>` you'd instead inherit from `QueryData<T>`, e.g:

```csharp
//AutoQuery RDBMS
public class QueryCustomers : QueryDb<Customer> {}

//AutoQuery Data - Multiple / Open Data Sources 
public class QueryCustomers : QueryData<Customer> {}
```

The API to call and consume both RDBMS AutoQuery and AutoQuery Data Services are indistinguishable to 
external clients where both are queried using the same 
[implicit](/autoquery#implicit-conventions) and
[explicit conventions](/autoquery#explicit-conventions)
and both return the same `QueryResponse<T>` Response DTO. 

### Use AutoQuery Viewer

A direct result of this means you can reuse [AutoQuery Viewer](https://github.com/ServiceStack/Admin) 
to access a rich auto UI for querying all AutoQuery implementations together in the same UI, whether queries are served from an RDBMS or an alternative data source.

[![](https://raw.githubusercontent.com/ServiceStack/Admin/master/img/query-default-values.png)](https://github.com/ServiceStack/Admin)


## AutoQuery Data Sources

AutoQuery Data supports an Open Data provider model requiring an extra piece of configuration Services 
need to function - the Data Source that it will query. Data Sources are registered with the 
`AutoQueryDataFeature` plugin by calling using its fluent `AddDataSource()` API to register all Data Sources 
you want available to query. 

At launch there are 3 different data sources that are available - all of which are accessible as 
extension methods on the `QueryDataContext` parameter for easy discoverability:

```csharp
Plugins.Add(new AutoQueryDataFeature()
    .AddDataSource(ctx => ctx.MemorySource(...))
    .AddDataSource(ctx => ctx.ServiceSource(...))
    .AddDataSource(ctx => ctx.DynamoDBSource(...))
);
```

AutoQuery Data Open Provider model supports querying of multiple data source back-ends. The 3 data source providers available include:

 - [AutoQuery Memory](/autoquery/memory) - for querying static or dynamic in-memory .NET collections, some example uses include showing querying a flat-file **.csv** file and querying a throttled 3rd Party API with it's built-in configurable caching.
 - [AutoQuery Service](/autoquery/service) - a step higher than `MemorySource` where you can decorate the response of existing Services with AutoQuery's rich querying capabilities.
 - [AutoQuery DynamoDB](/autoquery/dynamodb) - adds rich querying capabilities over an AWS DynamoDB Table, offering a leap of greater productivity than constructing DynamoDB queries manually.

