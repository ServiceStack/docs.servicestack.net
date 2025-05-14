---
slug: multitenancy
title: Multitenancy
---

ServiceStack provides a number of ways of changing the database connection used at runtime based on an incoming Request. 
You can use a [Request Filter](/request-and-response-filters#global-request-filters), use the `[ConnectionInfo]` 
[Request Filter Attribute](/filter-attributes#request-filter-attributes), use the `[NamedConnection]` attribute on 
[Auto Query](/autoquery/) Services, access named connections in Custom Service implementations or override 
`GetDbConnection(IRequest)` in your AppHost.

### Change Database Connection at Runtime

The default implementation of `IAppHost.GetDbConnection(IRequest)` includes an easy way to change the DB Connection that can be done by populating the 
[ConnectionInfo](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack.Common/ConnectionInfo.cs) 
POCO in any
[Request Filter in the Request Pipeline](/order-of-operations):

```csharp
req.Items[Keywords.DbInfo] = new ConnectionInfo {
    NamedConnection  = ... //Use a registered NamedConnection for this Request
    ConnectionString = ... //Use a different DB connection for this Request
    ProviderName     = ... //Use a different Dialect Provider for this Request
};
```

To illustrate how this works we'll go through a simple example showing how to create an AutoQuery Service 
that lets the user change which DB the Query is run on. We'll control which of the Services we want to allow 
the user to change the DB it's run on by having them implement the interface below:

```csharp
public interface IChangeDb
{
    string NamedConnection { get; set; }
    string ConnectionString { get; set; }
    string ProviderName { get; set; }
}
```

We'll create one such AutoQuery Service, implementing the above interface:

```csharp
[Route("/rockstars")]
public class QueryRockstars : QueryBase<Rockstar>, IChangeDb
{
    public string NamedConnection { get; set; }
    public string ConnectionString { get; set; }
    public string ProviderName { get; set; }
}
``` 

For this example we'll configure our Database to use a default **SQL Server 2012** database, 
register an optional named connection looking at a "Reporting" **PostgreSQL** database and 
register an alternative **Sqlite** RDBMS Dialect that we also want the user to be able to use:

#### ChangeDB AppHost Registration

```csharp
container.Register<IDbConnectionFactory>(c => 
    new OrmLiteConnectionFactory(defaultDbConn, SqlServer2012Dialect.Provider));

var dbFactory = container.Resolve<IDbConnectionFactory>() as OrmLiteConnectionFactory;

//Register NamedConnection
dbFactory.RegisterConnection("Reporting", ReportConnString, PostgreSqlDialect.Provider);

//Register DialectProvider
dbFactory.RegisterDialectProvider("Sqlite", SqliteDialect.Provider);
```

#### ChangeDB Request Filter

To enable this feature we just need to add a Request Filter that populates the `ConnectionInfo` with properties
from the Request DTO:

```csharp
GlobalRequestFilters.Add((req, res, dto) => {
   var changeDb = dto as IChangeDb;
   if (changeDb == null) return;

   req.Items[Keywords.DbInfo] = new ConnectionInfo {
       NamedConnection = changeDb.NamedConnection,
       ConnectionString = changeDb.ConnectionString,
       ProviderName = changeDb.ProviderName,
   };
});
```

Since our `IChangeDb` interface shares the same property names as `ConnectionInfo`, the above code can be 
further condensed using a 
[Typed Request Filter](/request-and-response-filters#typed-request-filters)
and ServiceStack's built-in [AutoMapping](/auto-mapping)
down to just:

```csharp
RegisterTypedRequestFilter<IChangeDb>((req, res, dto) =>
    req.Items[Keywords.DbInfo] = dto.ConvertTo<ConnectionInfo>());
```

#### Change Databases via QueryString

With the above configuration the user can now change which database they want to execute the query on, e.g:

```csharp
var response = client.Get(new QueryRockstars()); //SQL Server

var response = client.Get(new QueryRockstars {   //Reporting PostgreSQL DB
    NamedConnection = "Reporting"
}); 

var response = client.Get(new QueryRockstars {   //Alternative SQL Server Database
    ConnectionString = "Server=alt-host;Database=Rockstars;User Id=test;Password=test;"
}); 

var response = client.Get(new QueryRockstars {   //Alternative SQLite Database
    ConnectionString = "C:\backups\2016-01-01.sqlite",
    ProviderName = "Sqlite"
}); 
```

### ConnectionInfo Attribute

To make it even easier to use we've also wrapped this feature in a simple
[ConnectionInfoAttribute.cs](https://github.com/ServiceStack/ServiceStack/blob/master/src/ServiceStack/ConnectionInfoAttribute.cs)
which allows you to declaratively specify which database a Service should be configured to use, e.g we can
configure the `Db` connection in the Service below to use the PostgreSQL **Reporting** database with:

```csharp
[ConnectionInfo(NamedConnection = "Reporting")]
public class ReportingServices : Service
{
    public object Any(Sales request)
    {
        return new SalesResponse { Results = Db.Select<Sales>() };
    }
}
```

### Auto Query Named Connection

[Auto Query](/autoquery/) can also easily be configured to query any number of [different databases registered in your AppHost](/autoquery/rdbms#named-connection). 

In the example below we configure our main RDBMS to use SQL Server and register a **Named Connection** 
to point to a **Reporting** PostgreSQL RDBMS:

```csharp
var dbFactory = new OrmLiteConnectionFactory(connString, SqlServer2012Dialect.Provider);
container.Register<IDbConnectionFactory>(dbFactory);

dbFactory.RegisterConnection("Reporting", pgConnString, PostgreSqlDialect.Provider);
```

Any normal AutoQuery Services like `QueryOrders` will use the default SQL Server connection whilst 
`QuerySales` will execute its query on the PostgreSQL `Reporting` Database instead:

```csharp
public class QueryOrders : QueryDb<Order> {}

[ConnectionInfo(NamedConnection = "Reporting")]
public class QuerySales : QueryDb<Sales> {}
```

An alternative to specifying the `[ConnectionInfo]` Request Filter Attribute on the AutoQuery Request DTO, is to specify the named connection on the **POCO Table** instead, e.g:

```csharp
[NamedConnection("Reporting")]
public class Sales { ... }

public class QuerySales : QueryDb<Sales> {}
```

Which can also be added on the Request DTO itself:

```csharp
[NamedConnection("Reporting")]
public class ViewSales : IReturn<ViewSalesResponse> { }
```

### Resolving Named Connections in Services

Whilst inside a Service you can change which DB connection to use by passing in the NamedConnection when opening a DB Connection. E.g. The example below allows the user to change which database to retrieve all sales records for otherwise fallbacks to "Reporting" database by default:

```csharp
public class SalesServices : Service
{
   public IDbConnectionFactory ConnectionFactory { get; set; } 

   public object Any(GetAllSales request)
   {
       var namedConnection = request.NamedConnection ?? "Reporting";
       using (var db = ConnectionFactory.Open(namedConnection)) 
       {
           return db.Select<Sales>();
       }
   }
}
```

### Override Connection used per request at Runtime

All built-in dependencies available from `Service` base class, AutoQuery, Razor View pages, etc are resolved 
from a central overridable location in your `AppHost`. This lets you control which pre-configured 
dependency gets used based on the incoming Request for each Service by overriding any of the `AppHost` methods below: 

```csharp
public IDbConnection Db => db ??= HostContext.AppHost.GetDbConnection(Request);

public IRedisClient Redis => redis ??= HostContext.AppHost.GetRedisClient(Request);

public ICacheClient Cache => cache ??= HostContext.AppHost.GetCacheClient(Request);

public MemoryCacheClient LocalCache => localCache ??= HostContext.AppHost.GetMemoryCacheClient(Request);

public IMessageProducer MessageProducer => messageProducer ??= 
    HostContext.AppHost.GetMessageProducer(Request);
```

E.g. to change the DB Connection your Service uses you can override `GetDbConnection(IRequest)` in your `AppHost`.

## Multitenancy RDBMS AuthProvider

ServiceStack resolves its `IAuthProvider` from the overridable `GetAuthRepository(IRequest)` AppHost factory method just like the other "Multitenancy-aware" dependencies above letting you dynamically change which AuthProvider should be used 
based on the incoming request.

This can be used with the new `OrmLiteAuthRepositoryMultitenancy` provider to maintain isolated 
User Accounts per tenant in all [major supported RDBMS](/ormlite/installation)

Since each tenant database uses their own isolated UserAuth tables we need to provide the list of db 
connection strings that the OrmLite AuthRepository uses to check and create any missing User Auth tables:

```csharp
var connectionStrings = 100.Times(i => GetConnectionStringForTenant(i));
container.Register<IAuthRepository>(c =>
    new OrmLiteAuthRepositoryMultitenancy(c.TryResolve<IDbConnectionFactory>(),
        connectionStrings));

container.Resolve<IAuthRepository>().InitSchema(); // Create any missing UserAuth tables
```

However if you've already created all UserAuth table schema's for each tenant or are manually creating 
them out-of-band you can register it without the list of connection strings:

```csharp
container.Register<IAuthRepository>(c =>
    new OrmLiteAuthRepositoryMultitenancy(c.TryResolve<IDbConnectionFactory>()));
```

Then to specify which AuthRepository should be used for each request we can override `GetAuthRepository()` 
in your AppHost and return the `OrmLiteAuthRepositoryMultitenancy` configured to use the same Multitenant 
DB connection used in that request, e.g:

```csharp
public override IAuthRepository GetAuthRepository(IRequest req = null)
{
    return req != null
        ? new OrmLiteAuthRepositoryMultitenancy(GetDbConnection(req)) //At Runtime
        : TryResolve<IAuthRepository>();                              //On Startup
}
```


Now when `GetAuthRepository()` is called within the context of a request it uses the same Multitenancy 
DB as your other services, otherwise when called outside (e.g. on Startup) it uses the default IOC 
Registration configured with the connectionStrings for each Multitenant DB that it can use to create any
missing UserAuth table schemas not found in any of the Multitenant databases. 

#### Extending UserAuth tables

In the same way that you can use [Custom UserAuth tables in OrmLiteAuthRepository](/auth/authentication-and-authorization#extending-userauth-tables), you can 
also extend `OrmLiteAuthRepositoryMultitenancy` to utilize your own custom `UserAuth` tables with extended fields by configuring them to use its generic class, e.g:

```csharp
public class MyUserAuth : UserAuth { .... }
public class MyUserAuthDetails : UserAuthDetails { .... }
```

```csharp
container.Register<IAuthRepository>(c =>
    new OrmLiteAuthRepositoryMultitenancy<MyUserAuth, MyUserAuthDetails>(c.Resolve<IDbConnectionFactory>()) {
        UseDistinctRoleTables = true
    });
```

### Multi Tenancy Example

To show how easy it is to implement a Multi Tenancy Service with this feature we've added a stand-alone
[Multi Tenancy AppHost Example](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/MultiTenantAppHostTests.cs) 
showing 2 different ways we can configure a Service to use different databases based on an incoming request.

In this example we've configured our AppHost to use the **master.sqlite** database as default and registered
3 different named connections referencing 3 different databases. Each database is then initialized with a 
different row in the `TenantConfig` table to identify the database that it's in.

```csharp
public class MultiTenantChangeDbAppHost : AppSelfHostBase
{
    public MultiTenantChangeDbAppHost()
        : base("Multi Tenant Test", typeof (MultiTenantChangeDbAppHost).Assembly) {}

    public override void Configure(Container container)
    {
        container.Register<IDbConnectionFactory>(new OrmLiteConnectionFactory(
            "~/App_Data/master.sqlite".MapAbsolutePath(), SqliteDialect.Provider));

        var dbFactory = container.Resolve<IDbConnectionFactory>();

        const int noOfTenants = 3;

        using (var db = dbFactory.OpenDbConnection()) {
            InitDb(db, "MASTER", "Masters inc.");
        }

        noOfTenants.Times(i => {
            var tenantId = "T0" + (i + 1);
            using var db = dbFactory.OpenDbConnectionString(GetTenantConnString(tenantId));
            InitDb(db, tenantId, "ACME {0} inc.".Fmt(tenantId));
        });

        RegisterTypedRequestFilter<IForTenant>((req,res,dto) => 
            req.Items[Keywords.DbInfo] = new ConnectionInfo { 
                ConnectionString = GetTenantConnString(dto.TenantId)
            }
        );
    }

    public void InitDb(IDbConnection db, string tenantId, string company)
    {
        db.DropAndCreateTable<TenantConfig>();
        db.Insert(new TenantConfig { Id = tenantId, Company = company });
    }

    public string GetTenantConnString(string tenantId) => tenantId != null 
        ? "~/App_Data/tenant-{0}.sqlite".Fmt(tenantId).MapAbsolutePath()
        : null;
}
```

This example uses only contains a single Service which returns the first result in the `TenantConfig` table:

```csharp
public interface IForTenant
{
    string TenantId { get; }
}

public class TenantConfig
{
    public string Id { get; set; }
    public string Company { get; set; }
}

public class GetTenant : IForTenant, IReturn<GetTenantResponse>
{
    public string TenantId { get; set; }
}

public class GetTenantResponse
{
    public TenantConfig Config { get; set; }
}

public class MultiTenantService : Service
{
    public object Any(GetTenant request)
    {
        return new GetTenantResponse
        {
            Config = Db.Select<TenantConfig>().FirstOrDefault(),
        };
    }
}
```

Calling this Service with a different `TenantId` value changes which database the Service is configured with:

```csharp
var client = new JsonApiClient(Config.AbsoluteBaseUri);

var response = client.Get(new GetTenant()); //= Company: Masters inc. 

var response = client.Get(new GetTenant { TenantId = "T01" }); //= Company: ACME T01 inc.

var response = client.Get(new GetTenant { TenantId = "T02" }); //= Company: ACME T02 inc.

var response = client.Get(new GetTenant { TenantId = "T03" }); //= Company: ACME T03 inc.

client.Get(new GetTenant { TenantId = "T04" }); // throws WebServiceException
```

An alternative way to support Multitenancy using a Custom DB Factory is available in 
[MultiTenantAppHostTests.cs](https://github.com/ServiceStack/ServiceStack/blob/master/tests/ServiceStack.WebHost.Endpoints.Tests/MultiTennantAppHostTests.cs#L129).

```csharp
public class MultiTenantCustomDbFactoryAppHost : AppSelfHostBase
{
    public MultiTenantCustomDbFactoryAppHost()
        : base("Multi Tenant Test", typeof(MultiTenantCustomDbFactoryAppHost).Assembly) { }

    public override void Configure(Container container)
    {
        var dbFactory = new OrmLiteConnectionFactory(
            "~/App_Data/master.sqlite".MapAbsolutePath(), SqliteDialect.Provider);

        const int noOfTenants = 3;

        container.Register<IDbConnectionFactory>(c =>
            new MultiTenantDbFactory(dbFactory));

        var multiDbFactory = (MultiTenantDbFactory)container.Resolve<IDbConnectionFactory>();

        using (var db = multiDbFactory.OpenTenant()) {
            InitDb(db, "MASTER", "Masters inc.");
        }

        noOfTenants.Times(i => {
            var tenantId = "T0" + (i + 1);
            using var db = multiDbFactory.OpenTenant(tenantId);
            InitDb(db, tenantId, "ACME {0} inc.".Fmt(tenantId));
        });

        GlobalRequestFilters.Add((req, res, dto) => {
            if (dto is IForTenant forTenant)
                RequestContext.Instance.Items.Add("TenantId", forTenant.TenantId);
        });
    }

    public void InitDb(IDbConnection db, string tenantId, string company)
    {
        db.DropAndCreateTable<TenantConfig>();
        db.Insert(new TenantConfig { Id = tenantId, Company = company });
    }

    public class MultiTenantDbFactory : IDbConnectionFactory
    {
        private readonly IDbConnectionFactory dbFactory;

        public MultiTenantDbFactory(IDbConnectionFactory dbFactory)
        {
            this.dbFactory = dbFactory;
        }

        public IDbConnection OpenDbConnection()
        {
            var tenantId = RequestContext.Instance.Items["TenantId"] as string;
            return OpenTenant(tenantId);
        }

        public IDbConnection OpenTenant(string tenantId = null)
        {
            return tenantId != null
                ? dbFactory.OpenDbConnectionString(
                    "~/App_Data/tenant-{0}.sqlite".Fmt(tenantId).MapAbsolutePath())
                : dbFactory.OpenDbConnection();
        }

        public IDbConnection CreateDbConnection() => dbFactory.CreateDbConnection();
    }
}
```
