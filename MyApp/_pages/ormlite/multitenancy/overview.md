---
title: Multitenancy
---

A multi-tenant App serves many customers from one deployment, and has to keep each customer's data separate. 

:::youtube 86ff8gs4h3w
Multi-Tenant .NET Apps: Enforce Tenant Isolation on the Connection, Not Every Query
:::

This page covers the model where every tenant shares one database and each row says which tenant owns it, which OrmLite enforces on the database connection so it doesn't depend on every query remembering its tenant.

| Model | How tenants are separated | See |
|-|-|-|
| Shared database | A tenant column on each row, enforced by the connection | This page |
| Database per tenant | Each request uses its tenant's database | [Multitenancy with multiple databases](/multitenancy) |

The risk of the shared model is a query that forgets its tenant: it returns another customer's data and nothing
fails. [Connection filters and write rules](/ormlite/connection-filters) remove that risk by making the tenant a
property of the connection:

<generated-sql>

```csharp
using var db = dbFactory.Open().ForTenant(tenantId);

var orders = db.Select<Order>(x => x.Total > 100);
```

```sql
SELECT "Id", "TenantId", "CustomerId", "Total"
FROM "Order"
WHERE ("Order"."TenantId" = @0) AND (("Total" > @1))
-- @0 = 1, @1 = 100
```

</generated-sql>

## What the connection enforces

| | On a connection confined to a tenant |
|-|-|
| Selects | Only return the tenant's rows, including joins, sub queries and referenced rows |
| Lookups by id | Return `null` for another tenant's row |
| Updates and deletes | Only change the tenant's rows |
| Inserts | Get the tenant when it isn't set |
| Writes for another tenant | Throw an `InvalidOperationException` |
| [AutoQuery](/autoquery/) and AutoQuery CRUD | The same, including conditions sent by clients |

It applies to every typed API where OrmLite creates the SQL. See [what isn't covered](#what-isnt-covered) for the
exceptions.

## Tenant-owned tables

Mark the tables a tenant owns with an interface, so one filter covers all of them:

```csharp
public interface IHasTenantId
{
    int TenantId { get; }
}

public class Order : IHasTenantId
{
    [AutoIncrement]
    public int Id { get; set; }
    public int TenantId { get; set; }
    public int CustomerId { get; set; }
    public decimal Total { get; set; }
}
```

Every table is either owned by tenants or it isn't:

| Kind of table | Tenant column | Example |
|-|-|-|
| Owned by a tenant | Required, never nullable | Orders, files, members |
| Shared by every tenant | None | Plans, countries |
| Run by the platform | None | Webhook inbox, platform audit log |

::: info
Avoid a nullable tenant column. It means a table holds two kinds of row, a tenant's and the platform's, which can't
use `Ensure` as that sets the tenant on every row. Split it into two tables instead, e.g. a tenant's audit log
and the platform's.
:::

Avoid owning a table indirectly too, e.g. an `OrderLine` that only has an `OrderId`. Give it its own `TenantId`, so
it's filtered directly instead of relying on every query to join its parent.

## Confining a connection

Declare your App's rules once in a [FilterSet](/ormlite/connection-filters), and use it for every connection, so every
connection is confined the same way:

```csharp
public static class TenantDb
{
    // The tenant's rows are the only rows a connection can read or change, and rows are written with the tenant
    public static readonly FilterSet<int> TenantFilters = FilterSet.Create<int>(f =>
        f.Ensure<IHasTenantId>(x => x.TenantId, tenantId => tenantId));

    public static IDbConnection ForTenant(this IDbConnection db, int tenantId) =>
        db.SetItem("TenantId", tenantId).UseFilters(TenantFilters.For(tenantId));

    public static int? GetTenantId(this IDbConnection db) => db.GetItem<int?>("TenantId");
}
```

| API | Purpose |
|-|-|
| [Ensure](/ormlite/connection-filters#tenant-rows-with-ensure) | The rows the connection can read, update and delete, and the tenant of the rows it writes |
| [SetItem and GetItem](/ormlite/connection-filters#connection-items) | Lets code that's given a connection ask which tenant it's confined to |

`Ensure` guards both sides: without filtering, an update could move another tenant's row into the connection's
tenant, and without the write rule an insert could be written for another tenant.

## In ServiceStack Apps

ServiceStack opens the connections used by `Db` in your Services, AutoQuery, AutoQuery CRUD and the API Keys feature
for the current request. Register a `DbConnectionRequestFilter` in your AppHost to confine every one of them:

```csharp
public override void Configure()
{
    DbConnectionRequestFilters.Add((db, req) => {
        var userId = req.GetUserId(); // the signed in user, or the user of an API Key
        if (userId != null)
            db.ForTenant(GetTenantId(userId)); // defined by your App
    });
}
```

Your existing Services and AutoQuery APIs don't need to change:

```csharp
public class OrderServices : Service
{
    public object Get(GetOrder request) =>
        Db.SingleById<Order>(request.Id)   // null if it's another tenant's order
        ?? throw HttpError.NotFound("Order not found");
}
```

Return `404` for a row that isn't found rather than `403`, as saying a row exists in another tenant leaks information.

## Fail closed until the tenant is known

Confining a connection when it's opened needs the tenant to be known then. Often it isn't: working out which tenant a
user is working in needs the database, e.g. to look up their membership. A connection that's left unconfined until
then is a connection where a forgotten check returns every tenant's rows.

Use a scope that belongs to the request, which throws until the tenant is resolved:

```csharp
public class TenantScope
{
    public int? TenantId { get; set; }

    public int AssertTenantId() => TenantId
        ?? throw new InvalidOperationException("Resolve the request's tenant before using tables owned by a tenant.");
}

public static readonly FilterSet<TenantScope> TenantFilters = FilterSet.Create<TenantScope>(f =>
    f.Ensure<IHasTenantId>(x => x.TenantId, s => s.AssertTenantId()));

public static IDbConnection ForTenant(this IDbConnection db, TenantScope scope) =>
    db.SetItem("TenantScope", scope).UseFilters(TenantFilters.For(scope));
```

Rules read the scope for each statement, so the connection behaves differently before and after:

| When | Tenant-owned tables |
|-|-|
| Before the tenant is resolved | Any query or write throws |
| After it's resolved | Confined to the tenant |

Keep the scope in `IRequest.Items`, so every connection the request opens shares it, including the one AutoQuery
opens:

```csharp
public static TenantScope GetTenantScope(this IRequest req)
{
    if (req.Items.TryGetValue(nameof(TenantScope), out var existing) && existing is TenantScope scope)
        return scope;
    req.Items[nameof(TenantScope)] = scope = new TenantScope();
    return scope;
}

DbConnectionRequestFilters.Add((db, req) => db.ForTenant(req.GetTenantScope()));
```

### The request says which tenant it's for

When users can belong to more than one tenant, have APIs for a tenant say which one in their Request DTO. It's then
part of your API's contract, and users can work in different tenants in different browser tabs:

```csharp
public interface IRequireTenant
{
    int TenantId { get; set; }
}

public class QueryOrders : QueryDb<Order>, IRequireTenant
{
    public int TenantId { get; set; }
}
```

The `TenantId` only says which tenant a request is for. The Request DTO is available from `IRequest.Dto`, so the
first connection that's opened for the request can check the user can use that tenant, before setting the request's
scope which confines every connection it opens:

```csharp
DbConnectionRequestFilters.Add((db, req) =>
{
    var scope = req.GetTenantScope();
    db.ForTenant(scope);

    if (req.Dto is IRequireTenant requireTenant && scope.TenantId == null)
    {
        // Whether the user is a member isn't known yet, so it's looked up across tenants
        var userId = req.GetUserId();
        if (!db.WithoutFilters().Exists<TenantMember>(x => x.TenantId == requireTenant.TenantId && x.UserId == userId))
            throw HttpError.Forbidden("You do not have access to this tenant");

        scope.TenantId = requireTenant.TenantId;
    }
});
```

The connection is disposed when a filter throws, and the `HttpError` is returned to the client.

An API that uses a tenant-owned table and forgets `IRequireTenant` then fails on its first request, instead of
returning another tenant's data in production.

## Writing rows

Rows inserted on a confined connection get its tenant, so your App doesn't set it:

```csharp
var order = new Order { CustomerId = 1, Total = 100 };
db.Insert(order);

order.TenantId; // 1
```

The object has the values that were written, so it can be returned from an API without reading it back. Writing a row
for another tenant throws instead of being silently changed, as it's a bug in your App:

```csharp
// Order.TenantId must be '1' on this connection
db.Insert(new Order { TenantId = 2, CustomerId = 1, Total = 100 });

// Rows can't be moved to another tenant either
db.UpdateOnly(() => new Order { TenantId = 2 }, where: x => x.Id == 1);
```

## Working across tenants

Some code legitimately works on more than one tenant: finding which tenants a user belongs to, a check that must be
unique across tenants, and platform administration. `WithoutFilters()` returns the same connection and transaction
without its filters and rules:

```csharp
// Is the address taken by any tenant?
var taken = db.WithoutFilters().Exists<Tenant>(x => x.Slug == slug);
```

It's the only way to opt-out, so searching your code base for it finds every place tenant isolation is bypassed. Wrap
it in a method of your own and limit which files can call it, e.g. with a test, so each new use is reviewed.

The connection it returns can use filter sets of its own, to drop the tenant filter and keep others, e.g. the
[audit rules](#auditing):

```csharp
public static IDbConnection AcrossTenants(this IDbConnection db, string userId) =>
    db.WithoutFilters().UseFilters(AuditRules.For(userId));
```

For platform APIs that act on a single tenant, confine the request to that tenant instead of opting out, so the rest
of the API can't reach anyone else's rows. With a [scope](#fail-closed-until-the-tenant-is-known) that's setting the
tenant an administrator asked for, after checking they're allowed to:

```csharp
public object Any(GetCustomer request)
{
    RequireAdmin();
    Request.GetTenantScope().TenantId = request.TenantId; // every query below is for this customer
    //...
}
```

::: info
A connection is confined once. Confining it again to another tenant throws, as its rows would need to belong to
both, see [Using a set more than once](/ormlite/connection-filters#using-a-set-more-than-once).
:::

## Auditing

[Write rules](/ormlite/connection-filters#auditing-with-oninsert-onupdate-and-onwrite) record who changed a row and
when on every write, replacing any value from your App so the columns can be trusted:

```csharp
public static readonly FilterSet<string> AuditRules = FilterSet.Create<string>(f => {
    f.OnInsert<IAudit>(x => x.CreatedBy, userId => userId);
    f.OnInsert<IAudit>(x => x.CreatedDate, _ => DateTime.UtcNow);
    f.OnWrite<IAudit>(x => x.ModifiedBy, userId => userId);
    f.OnWrite<IAudit>(x => x.ModifiedDate, _ => DateTime.UtcNow);
});

db.UseFilters(AuditRules.For(userId));
```

Add `[IgnoreOnUpdate]` to the created columns, so an update of every column can't change them.

## Background jobs

A connection a job opens itself isn't confined. Put the tenant in the job's request and confine its connection before
it reads anything, so an id for another tenant's row is treated as if it doesn't exist:

```csharp
public class DeleteFile
{
    public int TenantId { get; set; }
    public int FileId { get; set; }
}

using var db = dbFactory.Open().ForTenant(request.TenantId);
var file = db.SingleById<StoredFile>(request.FileId); // null if it isn't this tenant's
```

Jobs that process every tenant either run a statement across tenants with explicit conditions, or loop over tenants
opening a confined connection for each, which also bounds their memory by the largest tenant.

## API Keys

[API Keys](/auth/apikeys) can be bound to a tenant with their `RefId` or `RefIdStr`. The API Keys feature opens the
request's connection for its own APIs, so a filter on its table confines them:

```csharp
f.Filter<ApiKeysFeature.ApiKey>((x, tenantId) => x.RefId == tenantId);
```

Users then only see and manage the API Keys of their tenant. To let a tenant's API Key call the same APIs as its
user, see [Allow Authenticated User APIs to API Keys](/auth/apikeys#allow-authenticated-user-apis-to-api-keys).

## Indexes

Every query on a tenant-owned table is filtered by its tenant, so give each one an index or unique constraint that
starts with the tenant column, followed by the columns it's queried by:

```csharp
[UniqueConstraint(nameof(TenantId), nameof(Reference))]
[CompositeIndex(nameof(TenantId), nameof(Status), nameof(CreatedDate))]
public class Order : IHasTenantId
```

Make business keys unique within a tenant, not globally. A globally unique key lets one tenant discover or block the
values another tenant uses.

## What isn't covered

| Not covered | What to do |
|-|-|
| Complete SQL statements in `SqlList`, `SqlScalar` and `ExecuteSql` | Include the tenant in the statement. SQL fragments in typed APIs are filtered |
| Connections you open yourself, e.g. `dbFactory.Open()` in a job | Confine them, e.g. with `.ForTenant(tenantId)` |
| Plugins that open a connection without the request | Check any plugin that stores rows per tenant |
| Files, caches and other stores | Include the tenant in their keys |
| Authorization | Confinement decides which rows are reachable. Roles and permissions are still checked by your App |

See [What isn't filtered](/ormlite/connection-filters#what-isnt-filtered) for the full list.

## Testing

As tenant-owned tables share an interface, one set of tests can cover all of them, including tables added later:

```csharp
static readonly Type[] TenantTables = typeof(IHasTenantId).Assembly.GetTypes()
    .Where(x => x.IsClass && !x.IsAbstract && typeof(IHasTenantId).IsAssignableFrom(x))
    .ToArray();

[TestCaseSource(nameof(TenantTables))]
public void A_confined_connection_only_reads_its_tenants_rows(Type table)
{
    using var db = dbFactory.Open().ForTenant(1);
    Assert.That(SelectTenantIds(db, table), Is.EqualTo(new[] { 1 }));
}

static int[] SelectTenantIds(IDbConnection db, Type table) =>
    db.CreateTypedApi(table).Select().Cast<IHasTenantId>().Select(x => x.TenantId).ToArray();
```

Seed two tenants, then assert that a confined connection can't select, update or delete the other tenant's rows, that
inserts get its tenant, and that an unresolved connection throws.

Tests don't catch a Service that forgets to resolve its tenant, which is why [failing closed](#fail-closed-until-the-tenant-is-known)
matters: it fails on its first request.

## Checklist

For each tenant-owned table:

1. A required tenant column, implementing your tenant interface
2. An index or unique constraint that starts with the tenant column
3. Business keys that are unique within a tenant
4. Included in your export and deletion of a tenant

For the App:

1. Request connections are confined with a `DbConnectionRequestFilter`, and fail until the tenant is resolved
2. `WithoutFilters()` is only called from reviewed code
3. Jobs carry their tenant and confine their connection
4. Raw SQL includes the tenant
5. Tests run against every tenant-owned table

## Next steps

- [Multitenancy Guide](/ormlite/multitenancy/guide) walks through how a complete SaaS App applies each of these
- [Connection Filters & Write Rules](/ormlite/connection-filters) is the reference for every API on this page
