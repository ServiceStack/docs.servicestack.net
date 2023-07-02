---
title: Getting started with OrmLite
---

After [installing OrmLite](installation) we now need to configure OrmLite's DB Connection Factory containing the RDBMS Dialect you want to use and the primary DB connection string you wish to connect to. Most NuGet OrmLite packages only contain a single provider listed below:

```csharp
SqlServerDialect.Provider      // SQL Server Version 2012+
SqliteDialect.Provider         // Sqlite
PostgreSqlDialect.Provider     // PostgreSQL 
MySqlDialect.Provider          // MySql
OracleDialect.Provider         // Oracle
FirebirdDialect.Provider       // Firebird
```

### SQL Server Dialects

Except for SQL Server which has a number of different dialects to take advantage of features available in each version, please use the best matching version closest to your SQL Server version:

```csharp
SqlServer2008Dialect.Provider  // SQL Server <= 2008
SqlServer2012Dialect.Provider  // SQL Server 2012
SqlServer2014Dialect.Provider  // SQL Server 2014
SqlServer2016Dialect.Provider  // SQL Server 2016
SqlServer2017Dialect.Provider  // SQL Server 2017+
```

## OrmLite Connection Factory

To configure OrmLite you'll need your App's DB Connection string along the above RDBMS Dialect Provider, e.g:

```csharp
var dbFactory = new OrmLiteConnectionFactory(
    connectionString,  
    SqlServerDialect.Provider);
```

If you're using an IOC register `OrmLiteConnectionFactory` as a **singleton**:

```csharp
services.AddSingleton<IDbConnectionFactory>(
    new OrmLiteConnectionFactory(":memory:", SqliteDialect.Provider)); //InMemory Sqlite DB
```

Which can then be used to open DB Connections to your RDBMS.

### Creating Table and Seed Data Example

If connecting to an empty database you can use OrmLite's Create Table APIs to create any missing tables you need, which OrmLite creates
based solely on the Schema definition of your POCO data models.

`CreateTableIfNotExists` returns **true** if the table didn't exist and OrmLite created it, where it can be further populated with any initial seed data it should have, e.g:

```csharp
using var db = dbFactory.Open();

if (db.CreateTableIfNotExists<Poco>())
{
    db.Insert(new Poco { Id = 1, Name = "Seed Data"});
}

var result = db.SingleById<Poco>(1);
result.PrintDump(); //= {Id: 1, Name:Seed Data}
```

### Multiple database connections

Any number of named RDBMS connections can be registered OrmLite's DbFactory `RegisterConnection`, e.g:

```csharp
// SqlServer with a named "Reporting" PostgreSQL connection as a part of the same `dbFactory`
var dbFactory = new OrmLiteConnectionFactory(connString, SqlServer2012Dialect.Provider);
container.Register<IDbConnectionFactory>(dbFactory);

dbFactory.RegisterConnection("Reporting", pgConnString, PostgreSqlDialect.Provider);
```

Named connections can be opened by its name:

```csharp
using var db = dbFactory.Open("Reporting");
```

If using ServiceStack the `[NamedConnection]` attribute can be used to configure Services `base.Db` connection with the named connection RDBMS, e.g:

```csharp
[NamedConnection("Reporting")]
public class QueryReports {}

public class ReportServices : Service
{
    public object Any(QueryReports request) => Db.Select<Reports>();
}
```

Or if using [AutoQuery](/autoquery/) it can be used to associate Data Models with the named connection:

```csharp
[NamedConnection("Reporting")]
public class Reports { ... }

public class QueryReports : QueryDb<Reports> {}
```

More examples available in [Multitenancy](/multitenancy) docs.

## OrmLite Interactive Tour

A quick way to learn about OrmLite is to take the [OrmLite Interactive Tour](https://gist.cafe/87164fa870ac7503b43333d1d275456c?docs=8a70f8bf2755f0a755afeca6b2a5238e) which lets you try out and explore different OrmLite features immediately from the comfort of your own
browser without needing to install anything:

[![](/img/pages/gistcafe/ormlite-tour-screenshot.png)](https://gist.cafe/87164fa870ac7503b43333d1d275456c?docs=8a70f8bf2755f0a755afeca6b2a5238e)

