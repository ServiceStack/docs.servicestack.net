---
title: Multitenancy Guide
---

This guide walks through how a complete SaaS App keeps each customer's data separate, using the code of the
[Next SaaS template](/react/#next-saas). It's written as rules to follow, each with the
code that enforces it and the test that protects it, so they can be applied to your own App.

[![](https://react-templates.net/img/next-saas/landing-hero.png)](/react/#next-saas)

See [Multitenancy](/ormlite/multitenancy/overview) for the reference of what's used here, and
[Connection Filters & Write Rules](/ormlite/connection-filters) for the OrmLite APIs behind it.

| | Rule | Enforced by |
|-|-|-|
| 1 | [Classify every table](#classify-every-table) | `IHasWorkspaceId` |
| 2 | [Connections are confined, and fail closed](#connections-are-confined-and-fail-closed) | `IRequireWorkspace`, `ForWorkspace()` |
| 3 | [Working across organizations is explicit](#working-across-organizations-is-explicit) | `AcrossWorkspaces()` |
| 4 | [A table's rows all belong to an organization, or none do](#a-tables-rows-all-belong-to-an-organization-or-none-do) | Separate tables |
| 5 | [The organization's state is checked before the API runs](#the-organizations-state-is-checked-before-the-api-runs) | `[WorkspaceAccess]` |
| 6 | [Audit columns come from the connection](#audit-columns-come-from-the-connection) | `SetUserId()`, `WithUserId()` |
| 7 | [Background work says which organization it's for](#background-work-says-which-organization-its-for) | `OpenForWorkspace()` |
| 8 | [Export and deletion cover every table](#export-and-deletion-cover-every-table) | `WorkspaceData` |
| 9 | [Files are reached through their organization](#files-are-reached-through-their-organization) | `WorkspaceFiles` |
| 10 | [Queries stay fast for every organization](#queries-stay-fast-for-every-organization) | Indexes, SQL paging, atomic counters |
| 11 | [API Keys only call the APIs that allow them](#api-keys-only-call-the-apis-that-allow-them) | `[ValidateHasScope]` |
| 12 | [Tests cover every table](#tests-cover-every-table) | `TenantIsolationTests` |

## The model

- One database is shared by every organization. Its table is `Workspace`
- Each row an organization owns has a `WorkspaceId`
- A user can belong to several organizations, and a request works in one of them
- Platform operators aren't members of the organizations they administer

## 1. Classify every table

Tables owned by an organization implement an interface, so one filter and one set of tests cover all of them:

```csharp
public interface IHasWorkspaceId
{
    string WorkspaceId { get; set; }
}

[UniqueConstraint(nameof(WorkspaceId), nameof(IdempotencyKey))]
[CompositeIndex(nameof(WorkspaceId), nameof(Status), nameof(CreatedDate))]
public class StoredFile : SaasAuditBase, IHasWorkspaceId
{
    [PrimaryKey] public string Id { get; set; } = Guid.NewGuid().ToString("N");
    [References(typeof(Workspace))] public string WorkspaceId { get; set; } = default!;
    //...
}
```

Every other table is either shared by every organization, e.g. plans, or run by the platform, e.g. the Stripe events
it has received. Neither has a `WorkspaceId`.

A test fails when a table created by the migration isn't classified, so the decision can't be skipped.

## 2. Connections are confined, and fail closed

A request's connections open before it's known whether the user can use the organization the request is for, as
checking that needs the database. So each request has a scope that's set once that's been checked, and throws until
then:

```csharp
public sealed class WorkspaceScope
{
    private Workspace? workspace;
    private WorkspaceMember? member;

    // The organization connections are confined to, if any
    public string? WorkspaceId { get; private set; }

    public string AssertWorkspaceId() => WorkspaceId ?? throw new InvalidOperationException(
        "This database connection isn't confined to an organization. APIs that use tables owned by an " +
        "organization need a Request DTO that implements IRequireWorkspace, or use AcrossWorkspaces() for code " +
        "that works on more than one.");

    public void Confine(string workspaceId)
    {
        if (WorkspaceId != null && WorkspaceId != workspaceId)
            throw new InvalidOperationException("This database connection is already confined to another organization.");
        WorkspaceId = workspaceId;
    }

    // A request for an organization also has the organization and the user's membership of it,
    // once the user has been checked to be a member
    public bool HasMember => member != null;
    public Workspace Workspace => workspace ?? throw NotForAnOrganization();
    public WorkspaceMember Member => member ?? throw NotForAnOrganization();
    public string UserId => Member.UserId;
    public bool IsAdmin => Member.Role is WorkspaceMemberRole.Owner or WorkspaceMemberRole.Admin;

    public void Confine(Workspace workspace, WorkspaceMember member)
    {
        Confine(workspace.Id);
        this.workspace = workspace;
        this.member = member;
    }
}
```

The organization's filters and rules are declared once in a [FilterSet](/ormlite/connection-filters) that reads them
from the scope, for each statement. `ForWorkspace()` uses it with the connection's scope:

```csharp
public static readonly FilterSet<WorkspaceScope> WorkspaceFilters = FilterSet.Create<WorkspaceScope>(f => {
    f.Ensure<IHasWorkspaceId>(x => x.WorkspaceId, s => s.AssertWorkspaceId());
    f.Filter<Workspace>((x, s) => x.Id == s.AssertWorkspaceId());
    // API keys aren't filtered until the organization is resolved, see below
    f.Filter<ApiKeysFeature.ApiKey>((x, s) => s.WorkspaceId == null || x.RefIdStr == s.WorkspaceId);
});

public static IDbConnection ForWorkspace(this IDbConnection db, WorkspaceScope scope) =>
    db.SetItem(ScopeItem, scope).UseFilters(WorkspaceFilters.For(scope));
```

The AppHost configures every connection opened for a request with a
[DbConnectionRequestFilter](/ormlite/connection-filters#in-servicestack-apps), which covers
`Db` in Services and the connections AutoQuery opens:

```csharp
public class AppHost() : AppHostBase("Acme"), IHostingStartup
{
    public override void Configure()
    {
        DbConnectionRequestFilters.Add((db, req) => db.ForRequest(req));
    }
}
```

The connection is disposed if the filter throws, e.g. when the user isn't a member of the organization.

`ForRequest()` gives the connection its user and the organization the request is for. The request says which in its
Request DTO, which `IRequest.Dto` has:

```csharp
public static IDbConnection ForRequest(this IDbConnection db, IRequest request)
{
    // Audit columns record who made the request: the signed-in user, or the user of its API key
    db.SetUserId(request.GetUserId());

    // Every connection a request opens shares one scope, which starts without an organization.
    // Setting the organization on the scope confines all of them.
    if (!request.Items.TryGetValue(nameof(WorkspaceScope), out var existing) || existing is not WorkspaceScope scope)
        request.Items[nameof(WorkspaceScope)] = scope = new WorkspaceScope();
    db.ForWorkspace(scope);

    // An API key is for the organization it was created for
    var apiKeyWorkspaceId = request.GetApiKey()?.RefIdStr;

    // An API for an organization says which one in its Request DTO. The first connection opened for it
    // checks the user is a member of that organization, and that it's in a state the API can be used in.
    if (request.Dto is IRequireWorkspace requireWorkspace && !scope.HasMember)
    {
        if (!apiKeyWorkspaceId.IsNullOrEmpty())
        {
            // A request sent with an API key doesn't need to say which organization, but can't say another
            if (requireWorkspace.WorkspaceId.IsNullOrEmpty())
                requireWorkspace.WorkspaceId = apiKeyWorkspaceId!;
            else if (requireWorkspace.WorkspaceId != apiKeyWorkspaceId)
                throw new HttpError(403, "WorkspaceAccessDenied", "This API key is for another organization.");
        }

        // Fails unless the user is a member of the organization, and it's in a state the API can be used in
        var (workspace, member) = request.TryResolve<ISaasManager>().AssertMembership(db, requireWorkspace.WorkspaceId,
            WorkspaceAccessPolicy.For(requireWorkspace.GetType(), request.Verb));

        // Confines every connection of the request, and is what its Services use: Db.GetWorkspaceScope()
        scope.Confine(workspace, member);
    }

    // Any other request sent with an API key can only use the key's organization
    if (!apiKeyWorkspaceId.IsNullOrEmpty())
        scope.Confine(apiKeyWorkspaceId!);

    return db;
}
```

| When | Tables owned by an organization |
|-|-|
| A request that isn't for an organization | Any query or write throws |
| A request for an organization the user is a member of | Selects, updates and deletes only match its rows |
| Inserting a row without a `WorkspaceId` | The row gets the connection's organization |
| Writing a row for another organization | Throws |

### The request says which organization it's for

A user can belong to several organizations, and can have different ones open in different browser tabs. So APIs for
an organization say which one in their Request DTO, by implementing `IRequireWorkspace`:

```csharp
public interface IRequireWorkspace
{
    string WorkspaceId { get; set; }
}

[ValidateIsAuthenticated]
[Route("/saas/files/{Id}", "DELETE")]
public class DeleteStoredFile : IDelete, IReturn<EmptyResponse>, IRequireWorkspace
{
    public string WorkspaceId { get; set; } = default!;
    [ValidateNotEmpty] public string Id { get; set; } = "";
}
```

It's part of the API, so it's in the typed DTOs every client is generated with:

```ts
await client.api(new DeleteStoredFile({ workspaceId, id }))
```

When the connection of an `IRequireWorkspace` API is opened, `ForRequest()` passes its `WorkspaceId` to the
`ISaasManager` dependency, which finds the organization and the user's membership of it:

```csharp
public class SaasManager(SaasConfig config) : ISaasManager
{
    public (Workspace Workspace, WorkspaceMember Member) AssertMembership(IDbConnection db, string workspaceId, WorkspaceAccess access)
    {
        var userId = db.GetUserId() ?? throw HttpError.Unauthorized("Authentication is required.");
        if (workspaceId.IsNullOrEmpty())
            throw new HttpError(400, "WorkspaceIdRequired", "The request needs the WorkspaceId of the organization it's for.");

        // Whether the user is a member isn't known yet, so it's looked up across organizations
        db = db.AcrossWorkspaces();
        var workspace = db.SingleById<Workspace>(workspaceId);
        if (workspace == null || workspace.Status == WorkspaceStatus.Deleted)
            throw new HttpError(403, "WorkspaceAccessDenied", "This organization is no longer available.");
        var member = db.Single<WorkspaceMember>(x =>
                x.WorkspaceId == workspaceId && x.UserId == userId && x.Status == WorkspaceMemberStatus.Active)
            ?? throw new HttpError(403, "WorkspaceAccessDenied", "You do not have access to this organization.");

        // Reject the request if the organization's state doesn't allow the access the API needs
        //...
        return (workspace, member);
    }
}
```

`ForRequest()` then confines the request's scope with them, which confines every connection the request opens.

| Request | Result |
|-|-|
| No `WorkspaceId` | `400 WorkspaceIdRequired` |
| An organization the user isn't an active member of, or that doesn't exist | `403 WorkspaceAccessDenied` |
| Sent with an API key for another organization | `403 WorkspaceAccessDenied` |
| Sent with an API key, without a `WorkspaceId` | The key's organization |

A Service's `Db` is then confined, so it's used without a `WorkspaceId` in sight:

```csharp
public class FileStorageServices(IBackgroundJobs jobs) : Service
{
    public object Any(DeleteStoredFile request)
    {
        var row = Db.SingleById<StoredFile>(request.Id)   // null if it's another organization's
            ?? throw new HttpError(404, "StoredFileNotFound", "The file was not found.");

        // The organization the connection is confined to, and the user's membership of it
        var scope = Db.GetWorkspaceScope();
        if (!scope.IsAdmin)
            throw new HttpError(403, "WorkspaceAdminRequired", "Organization Owner or Admin role is required.");
        //...
    }
}
```

A Request Filter opens the request's connection for every `IRequireWorkspace` API, so the check has happened before
the Service runs, whenever the Service first uses `Db`.

A lookup by id returns `null` for another organization's row, so it's a `404` rather than a `403`.

Worth knowing:

- **The `WorkspaceId` is a claim, not a credential.** It says which organization the request is for. Whether the user
  can use it comes from their membership, which is checked on every request
- **An API that forgets `IRequireWorkspace` fails**, as its connection isn't confined. A test also checks that every
  Request DTO with a `WorkspaceId` implements it
- **A scope can't move.** Once a request is confined it can't be pointed at another organization, as the queries that
  already ran were confined to the first
- **AutoQuery APIs** are covered the same way, by implementing `IRequireWorkspace`:

```csharp
[ValidateIsAuthenticated]
public class QuerySupportNotes : QueryDb<SupportNote>, IRequireWorkspace
{
    public string WorkspaceId { get; set; } = default!;
}
```

- **The client keeps each tab's organization** in `sessionStorage` and sends it with every call. A new tab starts in
  the organization the user last switched to, which is the only thing the saved `UserWorkspacePreference` is used for

## 3. Working across organizations is explicit

`AcrossWorkspaces()` returns the same connection and transaction without the organization filter. It's the one place
`WithoutFilters()` is called, and gives the connection it returns the audit rules again, so its writes still record
who made them:

```csharp
public static IDbConnection AcrossWorkspaces(this IDbConnection db)
{
    if (db.IsWithoutFilters())
        return db;

    return db.GetOrAddItem(AcrossWorkspacesItem, () => {
        // Without the organization's filters, and still recording who is writing
        return db.WithoutFilters().UseFilters(AuditRules.For(GetAuditUser(db)));
    });
}
```

| Code | Connection |
|-|-|
| Checking the user is a member of the organization a request is for | `db.AcrossWorkspaces()`, then the request is confined |
| Listing, switching and creating organizations, accepting an invitation | `Db.AcrossWorkspaces()` |
| A check that's unique across organizations, e.g. the organization's slug | `Db.AcrossWorkspaces()` for that query |
| Platform APIs that list or search customers | `PlatformDb`, after the capability check |
| Platform APIs that act on one customer | `RequireCustomer(workspaceId)` |

The last row matters. An operator's request about one customer is confined to that customer, so the rest of the API
can't read or write anyone else's rows:

```csharp
IDbConnection PlatformDb => Db.AcrossWorkspaces();

Workspace RequireCustomer(string workspaceId)
{
    Db.ForWorkspace(workspaceId);
    return Db.SingleById<Workspace>(workspaceId)
        ?? throw new HttpError(404, "WorkspaceNotFound", "The organization was not found.");
}
```

As it's the only way to opt-out, searching the code base for `AcrossWorkspaces(` and `WithoutFilters(` finds every
place tenant isolation is bypassed. The template keeps that list short and reviewed with a test that fails when
either is called from a file that hasn't been approved. That includes `OpenAcrossWorkspaces()`, which
[jobs that sweep every organization](#background-work-says-which-organization-its-for) open their connection with.

## 4. A table's rows all belong to an organization, or none do

A nullable `WorkspaceId` means a table holds two kinds of row: an organization's and the platform's. It can't be
given the `Ensure` rule, which sets the organization of every row, so a row that forgets its organization is
silently written with none.

The audit log was one of these, as most events are about an organization but publishing a plan isn't. It's two
tables:

| Table | Rows | WorkspaceId |
|-|-|-|
| `SaasAuditEvent` | What happened in one organization | Required |
| `PlatformAuditEvent` | What operators did that isn't about an organization | None |

```csharp
// On a connection confined to an organization, the event gets it
Db.Insert(new SaasAuditEvent { Category = "workspace", Action = "profile.updated", UserId = userId });

Db.Insert(new PlatformAuditEvent { Category = "plan", Action = "version.published", UserId = userId });
```

The organization's log is then an ordinary tenant-owned table, that's isolated, exported and retained like every
other. Operators see both in one list, which queries the two tables and merges them.

## 5. The organization's state is checked before the API runs

An organization can be suspended, read-only or pending deletion. Checking that in each Service means it's checked in
some. So it's checked with the user's membership, from the access each API needs:

| `WorkspaceAccess` | For | Suspended | Read-only or pending deletion |
|-|-|-|-|
| `Account` | The organization itself: billing, members, export, deletion | Allowed | Allowed |
| `Read` | Reading product data, the default for `GET` APIs | `403` | Allowed |
| `Write` | Changing product data, the default for other APIs | `403` | `423` |

An API only says what it needs when it isn't the default for its HTTP method:

```csharp
[ValidateIsAuthenticated]
[Route("/saas/lifecycle/leave", "POST")]
[WorkspaceAccess(WorkspaceAccess.Account)]
public class LeaveWorkspace : IPost, IReturn<EmptyResponse>, IRequireWorkspace
{
    public string WorkspaceId { get; set; } = default!;
}
```

`Account` keeps customers able to see why their organization is unavailable, pay, export their data and cancel a
deletion.

This is deliberately not a connection rule. Confinement decides which rows are reachable, this decides whether the
request may proceed, and roles are still checked separately.

## 6. Audit columns come from the connection

Tables deriving from `SaasAuditBase` have `CreatedDate`, `CreatedBy`, `ModifiedDate` and `ModifiedBy`. They're set by
rules that every connection is given when it opens, and never assigned by the App:

```csharp
public static readonly FilterSet<AuditUser> AuditRules = FilterSet.Create<AuditUser>(f => {
    // The created columns have [IgnoreOnUpdate], so they're only written when the row is inserted
    f.OnInsert<SaasAuditBase>(x => x.CreatedDate, _ => DateTime.UtcNow);
    f.OnInsert<SaasAuditBase>(x => x.CreatedBy, user => user.Id);
    f.OnWrite<SaasAuditBase>(x => x.ModifiedDate, _ => DateTime.UtcNow);
    f.OnWrite<SaasAuditBase>(x => x.ModifiedBy, user => user.Id);
});
```

```csharp
// Configure.Db.cs
OnOpenConnection = db => db.WithAuditRules()
```

| Connection | Recorded as |
|-|-|
| Opened for an authenticated request | The signed-in user |
| Opened by a job or command | Its name: `dbFactory.OpenAcrossWorkspaces("retention-job")` |
| Anything else | `system` |

Jobs and system policies aren't users, so they record their name as the user id. The user id is
[kept with the connection](/ormlite/connection-filters#connection-items) and read for each row, so it can change for
a block of writes, e.g. for a policy the system applies during a user's request:

```csharp
using (db.WithUserId("lifecycle-policy"))
    db.Update(subscription);
```

As written objects have the values that were saved, a row can be returned without reading it back:

```csharp
var note = new SupportNote { Body = request.Body.Trim() };
Db.Insert(note);
return note; // has its WorkspaceId, CreatedDate and CreatedBy
```

The rules replace any value the App assigns, so the one place that writes its own audit dates opts out of them. The
example data is seeded with dates in the past, on the connection without its rules:

```csharp
using var seedDb = dbFactory.OpenAcrossWorkspaces(SeedUserId);
var db = seedDb.WithoutFilters(); // rows keep the CreatedDate and ModifiedDate they're given
```

## 7. Background work says which organization it's for

A job isn't run for a request, so it opens its own connection, and a job that's only given a row's id trusts that id
completely. Work for one organization carries it in its request, and opens a connection confined to it before reading
anything:

```csharp
public class DeleteStoredFileWork
{
    public string WorkspaceId { get; set; } = default!;
    public string FileId { get; set; } = default!;
}

using var db = dbFactory.OpenForWorkspace(request.WorkspaceId, "file-deletion-job");
var row = db.SingleById<StoredFile>(request.FileId); // null if the file isn't this organization's
if (row == null || row.Status == StoredFileStatus.Deleted) return;

// The file is deleted for the user who requested it
using var _ = db.WithUserId(row.ModifiedBy);
```

Jobs are queued with their organization as the job's `TenantId`, so an organization's jobs can be found in the
[Background Jobs](/jobs/) dashboard:

```csharp
jobs.EnqueueForWorkspace<DeleteStoredFileCommand>(scope.Workspace.Id,
    new DeleteStoredFileWork { WorkspaceId = scope.Workspace.Id, FileId = row.Id });

public static BackgroundJobRef EnqueueForWorkspace<TCommand>(this IBackgroundJobs jobs, string workspaceId, object request)
    where TCommand : IAsyncCommand =>
    jobs.EnqueueCommand<TCommand>(request, new BackgroundJobOptions { TenantId = workspaceId });
```

Jobs that process every organization have two shapes:

| Shape | When |
|-|-|
| One organization at a time, on a connection confined to it | The work reads and writes an organization's rows, e.g. building usage rollups |
| One statement across organizations with explicit conditions | A sweep by a condition, e.g. expiring reservations |

The first also bounds memory by the largest organization rather than the total.

Either way the connection says whether it's confined when it's opened, with one of two extension methods:

```csharp
public static IDbConnection OpenForWorkspace(this IDbConnectionFactory dbFactory, string workspaceId, string userId) =>
    dbFactory.Open().SetUserId(userId).ForWorkspace(workspaceId);

public static IDbConnection OpenAcrossWorkspaces(this IDbConnectionFactory dbFactory, string userId) =>
    dbFactory.Open().SetUserId(userId);
```

A test fails when a connection is opened with `dbFactory.Open()` outside the migrations and health check, so a job
can't be left unconfined by forgetting to call `ForWorkspace()`. Both take the job's name, which is recorded in the
audit columns of the rows it writes.

## 8. Export and deletion cover every table

A hand-written list of tables to export or delete is right the day it's written and wrong the day a table is added.
`WorkspaceData` finds every table implementing `IHasWorkspaceId`, so a new table is exported and deleted with its
organization without any change:

```csharp
public static readonly IReadOnlyList<Type> Tables = InDeleteOrder(typeof(IHasWorkspaceId).Assembly.GetTypes()
    .Where(x => x is { IsClass: true, IsAbstract: false } && typeof(IHasWorkspaceId).IsAssignableFrom(x))
    .OrderBy(x => x.Name));

public static Dictionary<string, int> DeleteAll(IDbConnection db)
{
    RequireConfined(db);
    return DeletedTables.ToDictionary(x => x.Name, x => db.DeleteAll(x));
}

public static Dictionary<string, string> ExportJson(IDbConnection db)
{
    RequireConfined(db);
    return ExportedTables.ToDictionary(x => x.Name, x => SelectJson(db, x));
}

static string SelectJson(IDbConnection db, Type table)
{
    // A List of the table's Type, so it's serialized with the table's columns
    var rows = db.CreateTypedApi(table).Select();
    // Columns that are how a row is stored or secured, e.g. a token's hash, aren't the customer's data
    if (Redactions.TryGetValue(table, out var redact))
    {
        foreach (var row in rows)
            redact(row);
    }
    return rows.ToJson();
}
```

The [Untyped APIs](/ormlite/untyped-apis) take the table's `Type` and apply the connection's filters, so they only
delete and read the organization's rows as the connection is confined, which `RequireConfined()` checks by asking the
connection:

```csharp
static string RequireConfined(IDbConnection db) => db.GetWorkspaceId()
    ?? throw new InvalidOperationException("An organization's data is exported and deleted on a connection confined to it.");
```

Leaving a table out is the exception, and has to say why:

```csharp
public static readonly IReadOnlyDictionary<Type, string> KeptAfterDeletion = new Dictionary<Type, string> {
    [typeof(WorkspaceLifecycleRequest)] = "The record of the deletion that was requested and completed",
    [typeof(SaasAuditEvent)] = "The audit trail, which is kept until its retention period ends",
};
```

## 9. Files are reached through their organization

A row is confined by its connection, but a file store takes a key and returns bytes. So keys are created and checked
by a store for one organization, which is used instead of the store itself:

```csharp
var workspaceFiles = files.ForWorkspace(scope.Workspace.Id);

var key = workspaceFiles.NewFileKey();                // workspaces/{id}/files/{opaque id}
await workspaceFiles.WriteAsync(key, stream, maximumBytes);
await workspaceFiles.OpenReadAsync(row.ObjectKey);    // throws if the key isn't this organization's
```

The same applies to anything else that isn't the database, e.g. include the organization in cache keys.

## 10. Queries stay fast for every organization

In a shared database a large organization slows everyone if a query's cost grows with its data.

**Indexes start with the organization**, as every query is filtered by it. Each table has an index or unique
constraint that starts with `WorkspaceId`, which a test checks. Business keys are unique within an organization, not
globally:

```csharp
[UniqueConstraint(nameof(WorkspaceId), nameof(IdempotencyKey))]
```

**The database filters and pages**, instead of selecting a table then filtering the list in C#:

```csharp
var q = Db.From<StoredFile>().Where(x => x.Status != StoredFileStatus.Deleted);
if (!request.Search.IsNullOrEmpty())
{
    var search = request.Search!.Trim().ToLowerInvariant();
    q.And(x => x.Name.ToLower().Contains(search));
}
return new QueryStoredFilesResponse {
    Total = Db.Count(q),
    Results = Db.Select(q.OrderByDescending(x => x.CreatedDate).ThenBy(x => x.Id)
        .Limit(Math.Max(0, request.Skip), Math.Clamp(request.Take, 1, 100))).Select(ToInfo).ToList(),
};
```

`Db.From<T>()` on a confined connection is confined like every typed query.

**Lists that only grow page by the last row seen.** The audit log uses [Keyset Pagination](/ormlite/keyset-pagination)
so it stays fast however far back a customer pages, and events recorded since the first page don't shift the pages
after it. The request has the `Id` of the last event that was shown:

```csharp
var q = AuditQuery(Db, request.Action);
var total = Db.Count(q);

q.OrderByDescending(x => x.CreatedDate).ThenBy(x => x.Id).Take(Math.Clamp(request.Take, 1, 200));
if (!request.AfterId.IsNullOrEmpty())
{
    var last = Db.SingleById<SaasAuditEvent>(request.AfterId) // null for another organization's event
        ?? throw new HttpError(404, "AuditEventNotFound", "The audit event to continue after was not found.");
    q.SeekAfter(last);
}
return new QueryWorkspaceAuditEventsResponse { Total = total, Results = Db.Select(q) };
```

**Limits apply to the organization**, not only the credential. A rate limit on each API Key is a limit an organization
can raise by creating keys, so requests are counted against both their key and their organization.

**Atomic counters use typed APIs where they can.** Reserving units adds to a counter and checks the allowance in
one statement, so concurrent requests can't exceed it. `UpdateAdd()` does that on a confined connection, which adds
the organization's condition and sets the row's audit columns:

```csharp
var updated = db.UpdateAdd(() => new UsageAggregate { ReservedUnits = units },
    where: x => x.Id == aggregate.Id && x.UsedUnits + x.ReservedUnits + units <= limit);
if (updated != 1)
    throw new HttpError(429, "QuotaExceeded", $"This operation would exceed the {usage.DisplayName} allowance.");
```

**Raw SQL carries its own conditions**, as complete statements aren't filtered. Recording usage also keeps the peak
it reached, which needs a `CASE` expression. A test limits `ExecuteSql`, `SqlList` and `SqlScalar` to an allow-list of
files, and to statements written with [Sql.Fmt()](/ormlite/sql-fmt) so every value is sent as a db param:

```csharp
var UsageAggregate = db.TableRef<UsageAggregate>();
var (Id, WorkspaceId, UsedUnits, ReservedUnits, PeakUnits, LastEventDate, ModifiedDate, ModifiedBy) =
    db.ColumnRefs<UsageAggregate>(x => new {
        x.Id, x.WorkspaceId, x.UsedUnits, x.ReservedUnits, x.PeakUnits, x.LastEventDate, x.ModifiedDate, x.ModifiedBy });

var updated = db.ExecuteSql(Sql.Fmt($@"UPDATE {UsageAggregate}
SET {UsedUnits} = {UsedUnits} + {units},
    {PeakUnits} = CASE WHEN {PeakUnits} > {UsedUnits} + {units} THEN {PeakUnits} ELSE {UsedUnits} + {units} END,
    {LastEventDate} = {now},
    {ModifiedDate} = {now},
    {ModifiedBy} = {userId}
WHERE {Id} = {aggregate.Id}
  AND {WorkspaceId} = {workspace.Id}
  AND {UsedUnits} + {ReservedUnits} + {units} <= {limit}"));
```

## 11. API Keys only call the APIs that allow them

An API Key is bound to an organization by its `RefIdStr`, and to the user that created it. With
[AddApiKeyAuth()](/auth/apikeys#allow-authenticated-user-apis-to-api-keys) a request sent with it is authenticated as
that user without their roles, and its organization is the one the key is bound to:

```csharp
services.AddAuthentication().AddApiKeyAuth();
```

That means a key could call anything its user can, including deleting the organization. So APIs are closed to API
Keys unless they name the scope they need with `[ValidateHasScope]`:

```csharp
[ValidateIsAuthenticated]
[ValidateHasScope("usage:write")]
[Route("/saas/usage", "POST")]
public class RecordUsage : IPost, IReturn<RecordUsageResponse>, IRequireWorkspace
```

| Request sent with an API Key | Result |
|-|-|
| The API has `[ValidateHasScope]` and the key has the scope | Runs as the key's user, confined to the key's organization |
| The request's `WorkspaceId` is for another organization | `403` |
| The key doesn't have the scope | `403` |
| The API has no `[ValidateHasScope]` | `403` |
| The key's user is no longer a member of its organization | `403` |
| Unknown, cancelled or expired key | `401` |

`[ValidateHasScope]` checks the request's `scope` claims. An API Key has the scopes it was created with, and a
signed-in user is given all of them at sign-in, so one attribute covers both:

```csharp
// AdditionalUserClaimsPrincipalFactory
claims.AddRange(SaasApiKeys.Scopes.Select(scope => new Claim(JwtClaimTypes.Scope, scope)));
```

A Request Filter closes the APIs that don't name a scope to API Keys.

A request sent with an API Key doesn't need a `WorkspaceId`, as its key says which organization it's for.

Users manage API Keys with the API Keys feature's own APIs, which say which organization a key is for in the same
explicit way:

| API | Organization |
|-|-|
| `CreateUserApiKey` | Its `RefIdStr`, which is required |
| `UpdateUserApiKey`, `DeleteUserApiKey` | The organization the key was created for. A key can't be moved to another |
| `QueryUserApiKeys` | The user's own keys, of every organization they have one for |

A Request Filter checks the user is a member of that organization before a key is created, updated or deleted, then
confines the request to it. The feature's APIs use the request's connection, so a filter on its table limits them to
that organization's keys. A request is authenticated with its key before its organization is known, so this filter
applies once the connection is confined instead of throwing before:

```csharp
f.Filter<ApiKeysFeature.ApiKey>((x, s) => s.WorkspaceId == null || x.RefIdStr == s.WorkspaceId);
```

## 12. Tests cover every table

As tenant-owned tables share an interface, the isolation tests run against all of them, including tables added later:

```csharp
static readonly Type[] TenantTables = typeof(IHasWorkspaceId).Assembly.GetTypes()
    .Where(x => x is { IsClass: true, IsAbstract: false } && typeof(IHasWorkspaceId).IsAssignableFrom(x))
    .OrderBy(x => x.Name)
    .ToArray();

[TestCaseSource(nameof(TenantTables))]
public void A_confined_connection_only_reads_its_organizations_rows(Type table)
{
    using var db = factory.Open().ForWorkspace(OrganizationA);

    Assert.That(SelectWorkspaceIds(table, db), Is.EqualTo(new[] { OrganizationA }));
}

[TestCaseSource(nameof(TenantTables))]
public void A_request_that_has_not_resolved_its_organization_cannot_use_tenant_tables(Type table)
{
    // What the AppHost's DbConnectionRequestFilters apply to every connection opened for a request
    using var db = factory.Open().ForWorkspace(new WorkspaceScope());

    Assert.Throws<InvalidOperationException>(() => SelectWorkspaceIds(table, db));
    Assert.Throws<InvalidOperationException>(() => InsertRow(table, db, OrganizationA));
    Assert.Throws<InvalidOperationException>(() => DeleteAllRows(table, db));
}

static string[] SelectWorkspaceIds(Type table, IDbConnection db) =>
    db.CreateTypedApi(table).Select().Cast<IHasWorkspaceId>().Select(x => x.WorkspaceId).ToArray();
```

| Tests | Protect |
|-|-|
| `TenantIsolationTests` | Selects, updates, deletes and inserts of every tenant-owned table |
| `WorkspaceDataTests` | Deleting an organization leaves every table of another untouched |
| `SaasAuditRuleTests` | Audit columns of requests, jobs and `WithUserId()` |
| `WorkspaceAccessTests` | Suspended and read-only organizations |
| `ArchitectureGuardTests` | Classification, indexes and the allow-lists |

They run on SQLite, and on PostgreSQL when a connection string is configured.

What they don't cover is an API whose Request DTO forgets `IRequireWorkspace`. It fails on its first request, so
call each new API once against a running App.

## Adding a tenant-owned table

1. Implement `IHasWorkspaceId` with a required `WorkspaceId`, and derive from `SaasAuditBase`
2. Give it an index or unique constraint that starts with `WorkspaceId`
3. Implement `IRequireWorkspace` in the Request DTO of each API that uses it, including AutoQuery APIs, then query
   and insert it without a `WorkspaceId`
4. Add `[WorkspaceAccess]` to APIs that need something other than the default for their HTTP method
5. Decide whether it's exported and deleted with its organization. If not, say why in `WorkspaceData`
6. If jobs work on it, put the `WorkspaceId` in their request and confine their connection

Isolation, export and deletion are then covered by the existing tests without changes.
