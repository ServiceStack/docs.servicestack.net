---
title: Connection Filters & Write Rules
---

Connection filters and write rules are declared once in a `FilterSet`, used by a database connection and applied to
every typed API it runs, making it easy to enforce multi-tenancy, soft deletes and auditing in one place instead of in
every query:

<generated-sql>

```csharp
public static readonly FilterSet<int> TenantFilters = FilterSet.Create<int>(f =>
    f.Ensure<IHasTenantId>(x => x.TenantId, tenantId => tenantId));

db.UseFilters(TenantFilters.For(tenantId));

var orders = db.Select<Order>(x => x.Total > 100);
```

```sql
SELECT "Id", "TenantId", "CustomerId", "Total", "IsDeleted", "CreatedBy", "CreatedDate", "ModifiedBy", "ModifiedDate"
FROM "Order"
WHERE ("Order"."TenantId" = @0) AND (("Total" > @1))
-- @0 = 1, @1 = 100
```

</generated-sql>

A `FilterSet` has these rules:

| Rule | Purpose |
|-|-|
| `Ensure` | Rows have a value, e.g. the tenant: the rows a connection can read, update and delete, and the value it writes |
| `Filter` | The rows a connection can read, update and delete, e.g. rows that aren't soft deleted |
| `OnInsert`, `OnUpdate`, `OnWrite` | The values a connection writes, e.g. who changed a row and when |

A set is declared once for your App, and reads its values from a scope that each connection provides, e.g. the current
request's tenant and user, without static delegates like `OrmLiteConfig.InsertFilter` needing to resolve the current
request.

::: info
Building a multi-tenant App? [Multitenancy](/ormlite/multitenancy/overview) shows how these APIs fit together, and the
[Multitenancy Guide](/ormlite/multitenancy/guide) how a complete SaaS App uses them.
:::

## Example Data Model

The examples on this page use these tables:

```csharp
public interface IHasTenantId
{
    int TenantId { get; }
}

public interface IAudit
{
    string CreatedBy { get; }
    DateTime CreatedDate { get; }
    string ModifiedBy { get; }
    DateTime ModifiedDate { get; }
}

public class Customer : IHasTenantId
{
    public int Id { get; set; }
    public int TenantId { get; set; }
    public string Name { get; set; }
}

public class Order : IHasTenantId, IAudit
{
    [AutoIncrement]
    public int Id { get; set; }
    public int TenantId { get; set; }
    public int CustomerId { get; set; }
    public decimal Total { get; set; }
    public bool IsDeleted { get; set; }

    [IgnoreOnUpdate] // only set when the row is inserted
    public string CreatedBy { get; set; }
    [IgnoreOnUpdate]
    public DateTime CreatedDate { get; set; }
    public string ModifiedBy { get; set; }
    public DateTime ModifiedDate { get; set; }
}
```

## Declaring filters and rules

Declare the filters and rules of your App once in a `FilterSet`, with the type of the scope they read their values
from, e.g. the tenant and user a connection is used for:

```csharp
public record TenantUser(int TenantId, string UserId);

public static class TenantDb
{
    public static readonly FilterSet<TenantUser> UserRules = FilterSet.Create<TenantUser>(f => {
        // The tenant's rows are the only rows it can read or change, and the rows it writes are the tenant's
        f.Ensure<IHasTenantId>(x => x.TenantId, s => s.TenantId);

        // Record who changed a row and when
        f.OnInsert<IAudit>(x => x.CreatedBy, s => s.UserId);
        f.OnInsert<IAudit>(x => x.CreatedDate, _ => DateTime.UtcNow);
        f.OnWrite<IAudit>(x => x.ModifiedBy, s => s.UserId);
        f.OnWrite<IAudit>(x => x.ModifiedDate, _ => DateTime.UtcNow);
    });

    public static IDbConnection ForUser(this IDbConnection db, int tenantId, string userId) =>
        db.UseFilters(UserRules.For(new TenantUser(tenantId, userId)));
}

using var db = dbFactory.Open().ForUser(tenantId, userId);
```

`set.For(scope)` gives the set the scope it reads its values from, and `db.UseFilters()` applies it to the connection.
The scope is typed, so using a set with the wrong type of scope doesn't compile.

- The type of a rule is a table, an interface or a base class. Rules on an interface or base class apply to every
  table implementing or inheriting it, using the table's property of the same name, so column aliases and naming
  strategies apply.
- A connection can use multiple sets, and their filters and rules combine, e.g. a tenant set and a soft delete set.
- They only apply to the connection that uses them, other connections aren't affected.
- They can only be used by connections opened by OrmLite, others throw a `NotSupportedException`, so they're never
  silently ignored.

### Values are read from the scope

Rules read their values from the scope each time they're used, i.e. for each statement and each row written, so a
scope can change while the connection is open, e.g. when a request's tenant is resolved after its connection opens:

```csharp
public class TenantScope
{
    public int? TenantId { get; set; }
    public int AssertTenantId() => TenantId ?? throw new InvalidOperationException("No tenant");
}

public static readonly FilterSet<TenantScope> TenantFilters = FilterSet.Create<TenantScope>(f =>
    f.Ensure<IHasTenantId>(x => x.TenantId, s => s.AssertTenantId()));
```

A filter's condition and an `Ensure` value can only read values from the scope, so a set is the same for every
connection that uses it. Using a variable from outside the rule throws an `ArgumentException` when the set is created:

```csharp
// ArgumentException: FilterSet rules can't use the variable 'tenantId' from outside the rule
FilterSet.Create<TenantScope>(f => f.Filter<IHasTenantId>((x, s) => x.TenantId == tenantId));
```

### Sets without a scope

Sets whose rules don't change, e.g. soft deletes, can be created without a scope:

```csharp
public static readonly FilterSet SoftDeletes = FilterSet.Create(f =>
    f.Filter<Order>(x => !x.IsDeleted));

db.UseFilters(SoftDeletes);
```

### Using a set more than once

It's safe to configure a connection more than once, e.g. a shared SQLite `:memory:` connection that's opened multiple
times in a request:

| Used again | Result |
|-|-|
| With the same scope, the same object or one that's equal to it, e.g. a `record` with the same values | Ignored |
| With a different scope, e.g. another tenant | Throws an `InvalidOperationException`, as rows would need to match both |

### Translated to SQL once

A filter's SQL is generated the first time it's used, then reused by every connection that uses its set. Each
statement only reads the filter's values from the scope and adds them as db params, so filters add little to a query
compared to writing their condition in it.

Everything in a rule that doesn't read the row is still evaluated for each statement, including values that don't
come from the scope, e.g. `DateTime.UtcNow`. A null value has SQL of its own, e.g. `IS NULL`, so it gets its own
statement too.

A collection that has a db param for each of its values, e.g. `s.ProjectIds.Contains(x.ProjectId)`, has SQL for each
size of the collection. Filters whose SQL changes with their values are translated for each statement instead, e.g.
`x.Name.StartsWith(s.Prefix)`, whose `LIKE` has an `ESCAPE` when the text has wildcards. `NotCachedReasons` says which
filters of a set weren't reused and why, which a test can check after using the set's filters:

```csharp
Assert.That(TenantFilters.NotCachedReasons, Is.Empty);
```

### In ServiceStack Apps

ServiceStack opens the connections used by `Db` in Services, AutoQuery, AutoQuery CRUD and other features for the
current request. Register a `DbConnectionRequestFilter` in your AppHost to apply your filter sets to every one of
them:

```csharp
public override void Configure()
{
    DbConnectionRequestFilters.Add((db, req) => {
        var userId = req.GetUserId(); // the signed in user, or the user of an API Key
        if (userId != null)
            db.ForUser(GetTenantId(userId), userId); // ForUser() and GetTenantId() are defined by your App
    });
}
```

| | DbConnectionRequestFilters |
|-|-|
| Called for | Each connection opened for a request, including [named connections](/ormlite/multi-database-app) and [read replicas](/ormlite/getting-started#read-replicas), e.g. `Db`, `ReadDb`, `Request.OpenDb()`, `OpenDbConnection(namedConnection)` in Services, AutoQuery and AutoQuery CRUD |
| Not called for | Connections opened without a request |
| If a filter throws | The connection is disposed and the exception fails the request, e.g. an `HttpError` |

Override `OnDbConnectionRequest(db, req)` in your AppHost instead to run your own logic around the registered filters.

A filter's rules only apply to the tables of their types, so one set of filters can be used with every database of an
App. Filters that query the connection, e.g. to check the user's membership of a tenant, can check which database
it's for with its `NamedConnection`, which is null for the App's main database and its read replica:

```csharp
DbConnectionRequestFilters.Add((db, req) => {
    if (((OrmLiteConnection)db).NamedConnection == null)
        db.ForRequest(req);
});
```

Connections your App opens itself, e.g. with `dbFactory.Open()` in a background job, have no filters or rules until
they use a set, e.g. with `dbFactory.Open().ForUser(tenantId, userId)`.

## Filters

`Ensure` and `Filter` restrict the rows a connection can read, update and delete. They're added to queries as a
mandatory condition, like [Ensure()](/ormlite/ensure-apis), so other conditions can narrow results but never widen them:

<generated-sql>

```csharp
db.ForUser(tenantId, userId);

// OR conditions only apply to the tenant's rows
var q = db.From<Order>().Where(x => x.Total > 100).Or(x => x.CustomerId == 1);
var orders = db.Select(q);
```

```sql
SELECT "Id", "TenantId", "CustomerId", "Total", "IsDeleted", "CreatedBy", "CreatedDate", "ModifiedBy", "ModifiedDate"
FROM "Order"
WHERE ("Order"."TenantId" = @0) AND (("Total" > @1) OR ("CustomerId" = @2))
-- @0 = 1, @1 = 100, @2 = 1
```

</generated-sql>

### Every typed API is filtered

Filters apply to every API where OrmLite creates the SQL, not just `db.From<T>()`, so a filtered connection can't
read other rows through APIs like `SingleById()`:

<generated-sql>

```csharp
var order = db.SingleById<Order>(1);
```

```sql
SELECT "Id", "TenantId", "CustomerId", "Total", "IsDeleted", "CreatedBy", "CreatedDate", "ModifiedBy", "ModifiedDate"
FROM "Order"
WHERE ("Order"."TenantId" = @_f0) AND ("Id" = @Id)
-- @Id = 1, @_f0 = 1
```

</generated-sql>

| API | How the filter is applied |
|-|-|
| `db.From<T>()`, including sub queries, [set operations](/ormlite/set-operations) and [SeekAfter()](/ormlite/keyset-pagination) | A mandatory condition when the query is created |
| Typed APIs: `Select`, `Single`, `Count`, `Exists`, `Scalar`, `Column`, `Dictionary`, `Lookup`, `Where`, `SelectNonDefaults` | A mandatory condition on the query they create |
| SQL fragments, e.g. `db.Select<T>("Total > @min", new { min })` and [Sql.Fmt()](/ormlite/sql-fmt) | `WHERE {filter} AND ({fragment})` |
| By id: `SingleById`, `SelectByIds`, `ExistsById`, `LoadSingleById`, `DeleteById`, `DeleteByIds` | `AND {filter}` |
| Joined tables | Added to the join's `ON` condition |
| [WithRecursive()](/ormlite/recursive-queries) | Its recursive step is filtered, so it can't reach rows that don't match |
| [TopPerGroup()](/ormlite/window-functions) | Rows are filtered before they're ranked |
| `LoadSelect`, `LoadSingleById` and [references](/ormlite/reference-support) | Each referenced table is filtered |
| Updates and deletes, including [returning APIs](/ormlite/returning) and [UpdateFrom()](/ormlite/update-from) | `AND {filter}`, so rows that don't match aren't changed |
| `Save` and `Upsert` | Their check for an existing row and its update are filtered |

All their async and lazy variants are filtered too.

### Joined tables

A joined table's filter is added to its join's `ON` condition instead of the `WHERE`, so a `LEFT JOIN` still returns
rows without a match:

<generated-sql>

```csharp
var q = db.From<Order>()
    .Join<Customer>((o, c) => o.CustomerId == c.Id)
    .Where<Customer>(c => c.Name == "Acme");
var orders = db.Select(q);
```

```sql
SELECT "Order"."Id", "Order"."TenantId", "Order"."CustomerId", "Order"."Total", "Order"."IsDeleted",
       "Order"."CreatedBy", "Order"."CreatedDate", "Order"."ModifiedBy", "Order"."ModifiedDate"
FROM "Order" INNER JOIN "Customer"
  ON ("Order"."CustomerId" = "Customer"."Id") AND ("Customer"."TenantId" = @1)
WHERE ("Order"."TenantId" = @0) AND (("Customer"."Name" = @2))
-- @0 = 1, @1 = 1, @2 = 'Acme'
```

</generated-sql>

### Soft deletes

`Filter` restricts the rows a connection sees without changing what it writes. Filters on a table only apply to that
table, and combine with interface filters:

<generated-sql>

```csharp
public static readonly FilterSet SoftDeletes = FilterSet.Create(f =>
    f.Filter<Order>(x => !x.IsDeleted));

db.ForUser(tenantId, userId).UseFilters(SoftDeletes);

var orders = db.Select<Order>(x => x.Total > 100);
```

```sql
SELECT "Id", "TenantId", "CustomerId", "Total", "IsDeleted", "CreatedBy", "CreatedDate", "ModifiedBy", "ModifiedDate"
FROM "Order"
WHERE "Order"."IsDeleted"=0 AND ("Order"."TenantId" = @0) AND (("Total" > @1))
-- @0 = 1, @1 = 100
```

</generated-sql>

A row is soft deleted with an update, after which the connection can no longer see or change it:

```csharp
db.UpdateOnly(() => new Order { IsDeleted = true }, where: x => x.Id == id);

db.SingleById<Order>(id); // null
```

### Updates and deletes

A filtered connection can't change rows it can't see:

<generated-sql>

```csharp
db.UpdateOnly(() => new Order { Total = 200 }, where: x => x.Id == 1);

db.DeleteById<Order>(99);
```

```sql
UPDATE "Order" SET "Total"=@Total WHERE ("Order"."TenantId" = @0) AND (("Id" = @1))
-- @0 = 1, @1 = 1, @Total = 200

DELETE FROM "Order" WHERE "Id" = @0 AND ("Order"."TenantId" = @_f0)
-- @0 = 99, @_f0 = 1
```

</generated-sql>

Rows that don't match the filter are treated like rows that don't exist:

- Updates and deletes affect 0 rows, so check the returned row count to handle rows that weren't changed.
- Updates and deletes of tables with a `[RowVersion]` throw an `OptimisticConcurrencyException`, as they do when no
  row is changed.
- `Save` and `Upsert` don't see the row as existing, so they insert it, which fails on its primary key instead of
  overwriting the row.

### Filters that only apply sometimes

A condition that only reads the scope decides whether the rest of the filter applies, e.g. admins see every tenant's
rows:

```csharp
public class UserAccess
{
    public int TenantId { get; set; }
    public bool IsAdmin { get; set; }
}

public static readonly FilterSet<UserAccess> AccessFilters = FilterSet.Create<UserAccess>(f =>
    f.Filter<IHasTenantId>((x, s) => s.IsAdmin || x.TenantId == s.TenantId));
```

Conditions that only read the scope are decided before the filter is translated to SQL, so each case gets its own
SQL. An admin's queries have no tenant condition, and everyone else's only have `"TenantId" = @0`. They're evaluated
as C# would, so the rest of a condition isn't evaluated when it can't match:

```csharp
// Tenant rows aren't returned until the tenant is resolved, without calling AssertTenantId()
f.Filter<IHasTenantId>((x, s) => s.TenantId != null && x.TenantId == s.AssertTenantId());
```

## Write rules

Write rules set the values of columns in the rows a connection inserts and updates.

### Which rule to use

| | `Ensure` | `OnInsert`, `OnUpdate`, `OnWrite` |
|-|-|-|
| Use for | A column that's the same for everything the connection writes, e.g. `TenantId` | A column recording an insert or update, e.g. `CreatedBy`, `ModifiedDate` |
| Applies to | Inserts and updates | Inserts, updates or both |
| App sets a different value | Throws, as it's a bug | Replaced with the rule's value |
| App doesn't set a value | Inserts set it, updates leave the column alone | Always set |

As a rule of thumb, use `Ensure` for who owns a row, and `OnInsert`, `OnUpdate` and `OnWrite` for who changed it and
when.

### Auditing with OnInsert, OnUpdate and OnWrite

`OnInsert` sets a column in rows that are inserted, `OnUpdate` in rows that are updated, and `OnWrite` in both. Their
value is read from the scope for each row:

```csharp
f.OnInsert<IAudit>(x => x.CreatedBy, s => s.UserId);
f.OnInsert<IAudit>(x => x.CreatedDate, _ => DateTime.UtcNow);
f.OnWrite<IAudit>(x => x.ModifiedBy, s => s.UserId);
f.OnWrite<IAudit>(x => x.ModifiedDate, _ => DateTime.UtcNow);
```

They replace any value from your App, so audit columns can be trusted:

<generated-sql>

```csharp
db.Insert(new Order { CustomerId = 1, Total = 100, CreatedBy = "mallory" });
```

```sql
INSERT INTO "Order" ("TenantId","CustomerId","Total","IsDeleted","CreatedBy","CreatedDate","ModifiedBy","ModifiedDate")
VALUES (@TenantId,@CustomerId,@Total,@IsDeleted,@CreatedBy,@CreatedDate,@ModifiedBy,@ModifiedDate)
-- @TenantId = 1, @CustomerId = 1, @Total = 100, @IsDeleted = 0,
-- @CreatedBy = 'alice', @CreatedDate = '2026-10-01 09:30:00',
-- @ModifiedBy = 'alice', @ModifiedDate = '2026-10-01 09:30:00'
```

</generated-sql>

Updates of only some columns also set the columns of `OnUpdate` and `OnWrite` rules:

<generated-sql>

```csharp
db.UpdateOnly(() => new Order { Total = 120 }, where: x => x.Id == 1);
```

```sql
UPDATE "Order" SET "Total"=@Total, "ModifiedBy"=@ModifiedBy, "ModifiedDate"=@ModifiedDate
WHERE ("Order"."TenantId" = @0) AND (("Id" = @1))
-- @0 = 1, @1 = 1, @Total = 120, @ModifiedBy = 'alice', @ModifiedDate = '2026-10-01 09:30:00'
```

</generated-sql>

::: info
Use `OnUpdate` instead of `OnWrite` to leave the modified columns empty until a row is first updated.
:::

::: warning
`OnInsert` sets a column when a row is inserted, it doesn't protect it from updates. `db.Update(order)` updates all
the object's columns, so an `Order` that wasn't read from the database would overwrite its `CreatedBy`.
Add `[IgnoreOnUpdate]` to columns that should only be set when a row is inserted.
:::

### Tenant rows with Ensure

`Ensure` filters the rows a connection can see by a column's value, and requires the column to have the value in every
row it writes, so it guards both the rows that are changed and the values that are written:

```csharp
f.Ensure<IHasTenantId>(x => x.TenantId, s => s.TenantId);
```

Inserts set the column when it isn't set, i.e. when it's `null`, its type's default value or an empty string, so your
App doesn't need to:

```csharp
db.Insert(new Order { CustomerId = 1, Total = 100 }); // inserted with the connection's TenantId
```

Writing a different value throws an `InvalidOperationException` instead of replacing it, as it's a bug in your App:

```csharp
// Order.TenantId must be '1' on this connection
db.Insert(new Order { TenantId = 2, CustomerId = 1, Total = 100 });

// Rows can't be moved to another tenant either
db.UpdateOnly(() => new Order { TenantId = 2 }, where: x => x.Id == 1);
```

| Write | Column isn't set | Column is set to a different value |
|-|-|-|
| Inserts of objects and dictionaries, `InsertOnly`, `BulkInsert` | Sets the value | Throws `InvalidOperationException` |
| `InsertIntoSelect` | Sets the value | Throws `NotSupportedException` if the column is selected |
| Updates of all an object's columns: `Update`, `UpdateAll`, `Save`, `Upsert` | Sets the value, so the update keeps it | Throws `InvalidOperationException` |
| Updates of some columns: `UpdateOnly`, `UpdateOnlyFields`, `UpdateNonDefaults`, `UpdateAdd` and updates with dictionaries or anonymous objects | Not updated | Throws `InvalidOperationException` |
| `UpdateFrom` | Not updated | Throws `NotSupportedException` if the column is updated |

::: info
Use `Ensure` for tenant columns rather than a `Filter`, which only filters the rows a connection sees, so an insert
could still write a row for another tenant.
:::

### Which APIs apply rules

| Rule | APIs |
|-|-|
| `OnInsert` | `Insert`, `InsertAll`, `InsertUsingDefaults`, `InsertOnly`, [BulkInsert](/ormlite/bulk-inserts), `InsertIntoSelect`, and the inserts of `Save`, `SaveAll`, `Upsert` and `UpsertAll` |
| `OnUpdate` | `Update`, `UpdateAll`, `UpdateOnly`, `UpdateOnlyFields`, `UpdateNonDefaults`, `UpdateAdd`, [UpdateFrom](/ormlite/update-from), [UpdateOnlyReturning](/ormlite/returning), and the updates of `Save`, `SaveAll`, `Upsert` and `UpsertAll` |
| `OnWrite` | Both of the above |
| `Ensure` | Both of the above |

All their async variants apply rules too.

### Written objects have the values that were saved

The values of rules are set on the objects you write as well as in the database, so an object that was just inserted
or updated can be used or returned from your API without reading it back:

```csharp
var order = new Order { CustomerId = 1, Total = 100 };
db.Insert(order);

order.TenantId;    // 1
order.CreatedBy;   // alice
order.CreatedDate; // 2026-10-01 09:30:00

order.Total = 120;
db.Update(order);

order.ModifiedBy;  // alice
```

| API | The object has the values of |
|-|-|
| `Insert`, `InsertAll`, `InsertOnly`, `BulkInsert`, and the inserts of `Save` and `Upsert` | `Ensure` and `OnInsert` rules |
| `Update`, `UpdateAll`, `UpdateOnlyFields`, `UpdateNonDefaults`, and the updates of `Save` and `Upsert` | `Ensure` and `OnUpdate` rules |

- Only the values of rules are set. Other values populated by the database, like defaults and computed columns,
  still need [Returning APIs](/ormlite/returning).
- An object that's rejected by `Ensure` is left as it was.
- Dictionaries passed to APIs like `db.UpdateOnly<T>(Dictionary<string,object>)` aren't modified.
- Objects written on a connection returned by `WithoutFilters()` aren't modified, as it has no rules.

### Upserts

[Upsert](/ormlite/upsert) of a table with filters or rules uses a filtered check for an existing row followed by an
insert or an update, instead of a single statement. A single statement can't filter the row it updates in every RDBMS,
or use different values for its insert and update. So `OnInsert` columns are only set when the row is inserted, and
`OnUpdate` columns when it's updated. Tables without filters or rules continue to use a single statement.

## WithoutFilters

`WithoutFilters()` returns the same connection without any of its filters or rules, e.g. for admin tasks or a report
across tenants:

<generated-sql>

```csharp
var adminDb = db.WithoutFilters();
var orders = adminDb.Select<Order>(x => x.Total > 100);
```

```sql
SELECT "Id", "TenantId", "CustomerId", "Total", "IsDeleted", "CreatedBy", "CreatedDate", "ModifiedBy", "ModifiedDate"
FROM "Order"
WHERE ("Total" > @0)
-- @0 = 100
```

</generated-sql>

It uses the same underlying connection and transaction, so changes with and without filters can be made in the same
transaction, and disposing it doesn't close the connection:

```csharp
using var trans = db.OpenTransaction();

db.UpdateOnly(() => new Order { Total = 0 });        // the tenant's orders
db.WithoutFilters().Delete<Order>(x => x.IsDeleted); // every tenant's deleted orders

trans.Commit();
```

It's the only way to opt-out: filters and rules can't be removed from a connection or ignored in a query.

### Opting out of some filters

A connection returned by `WithoutFilters()` starts without any filters or rules, and can use its own sets. They only
apply to it: they aren't added to the connection it was created from, or to the next connection returned by
`WithoutFilters()`. Use this to opt-out of some filters and keep others, e.g. an admin connection that sees every
tenant and still records who is writing, by keeping the audit rules in their own set:

```csharp
public static readonly FilterSet<string> AuditRules = FilterSet.Create<string>(f => {
    f.OnInsert<IAudit>(x => x.CreatedBy, userId => userId);
    f.OnWrite<IAudit>(x => x.ModifiedBy, userId => userId);
});

public static IDbConnection AcrossTenants(this IDbConnection db, string userId) =>
    db.WithoutFilters().UseFilters(AuditRules.For(userId));
```

`db.IsWithoutFilters()` returns whether a connection was returned by `WithoutFilters()`.

## Connection Items

Code that's given a connection often needs to know what it was configured with, e.g. which tenant its filters confine
it to. Keep it with the connection using `SetItem()`, which lasts for as long as the connection is open:

```csharp
public static IDbConnection ForUser(this IDbConnection db, int tenantId, string userId)
{
    var user = new TenantUser(tenantId, userId);
    return db.SetItem(nameof(TenantUser), user).UseFilters(UserRules.For(user));
}

public static int GetTenantId(this IDbConnection db) => db.GetItem<TenantUser>(nameof(TenantUser))!.TenantId;
```

| API | |
|-|-|
| `db.SetItem(key, value)` | Keep a value with the connection |
| `db.GetItem<T>(key)` | The value, or the default value of `T` if there isn't one |
| `db.GetOrAddItem(key, () => value)` | The value, adding the value returned by the function if there isn't one |

Items are shared with the connections returned by `WithoutFilters()`, which are the same connection. They aren't kept
for the next time a connection is opened.

Rules read their values from the scope when they're used, so a scope kept as an item can also hold state that changes
while the connection is open, e.g. the user id that's recorded:

```csharp
public class AuditUser
{
    public string Id { get; set; }
}

public static readonly FilterSet<AuditUser> AuditUserRules = FilterSet.Create<AuditUser>(f =>
    f.OnWrite<IAudit>(x => x.ModifiedBy, s => s.Id));

var user = db.GetOrAddItem("AuditUser", () => new AuditUser { Id = userId });
db.UseFilters(AuditUserRules.For(user));

user.Id = "billing-job"; // later writes on the connection are recorded as the job
```

## What isn't filtered

Filters and rules apply to the typed APIs where OrmLite creates the SQL. They don't apply to:

- **Complete SQL statements**: OrmLite doesn't parse or change the SQL you write in APIs like `SqlList`, `SqlScalar`,
  `SqlColumn`, `ExecuteSql`, or in `db.Select<T>("SELECT ...")` and `db.Delete<T>("DELETE ...")`. SQL fragments in typed
  APIs, e.g. `db.Select<T>("Total > @min", new { min })`, are filtered.
- **Queries created without the connection**: only queries created from the filtered connection with `db.From<T>()`
  are filtered, not queries created from another connection or with `OrmLiteConfig.DialectProvider.SqlExpression<T>()`.
- **Legacy APIs without a table type**: `[Obsolete]` APIs taking complete SQL, like `ScalarFmt` and `ColumnFmt`, and
  `UpdateFmt(table, ...)` and `DeleteFmt(table, ...)` with a table name. Other legacy APIs like `SelectFmt<T>` are
  filtered.

## Custom Dialect Providers

Custom dialect providers inheriting `OrmLiteDialectProviderBase` support filters and rules. Providers overriding these
members need to update them:

- `IOrmLiteDialectProvider` has a new `IsFullSelectStatement()` method, implemented by `OrmLiteDialectProviderBase`.
- `SetParameterValues()` overrides need to skip the params of filter conditions, e.g. `@_f0`, where
  `OrmLiteConnectionFiltersApi.IsFilterParam(p.ParameterName)` is `true`.
- `SqlExpression<T>` overrides that create params, e.g. `ConvertToPlaceholderAndParameter()`, need to name them with
  `NextParamName()`.
