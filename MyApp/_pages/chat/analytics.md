---
title: Analytics & Admin
---

Enterprise AI needs observability. AI Chat records every completion — provider, model, tokens, duration and cost — so administrators can understand usage instead of discovering it on a provider invoice.

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-2 gap-4" :images="{
    'Cost analysis': '/img/pages/chat/analytics/analytics-costs.webp',
    'Per-user activity': '/img/pages/chat/analytics/analytics-users-page.webp',
}"></screenshots-gallery>

## Two places to look

| Surface | Audience | Location |
| --- | --- | --- |
| Analytics extension | Admins, inside the Chat UI | `/chat` → Analytics |
| Chat Admin UI | Admins, inside ServiceStack's Admin UI | `/admin-ui/chat` |

Both read the same `ChatRequest` rows, so the numbers agree.

## What's recorded

Every completion writes a `ChatRequest` row:

| Field | Description |
| --- | --- |
| `User`, `ThreadId` | Who ran it and in which conversation |
| `Model`, `Provider`, `ProviderModel` | What served it |
| `InputTokens`, `InputCachedTokens`, `OutputTokens`, `TotalTokens` | Token accounting |
| `InputPrice`, `OutputPrice`, `Cost` | Priced from the model catalog |
| `Duration`, `StartedAt`, `CompletedAt` | Latency |
| `FinishReason`, `Usage` | Provider-reported outcome |
| `Error`, `StackTrace` | Populated when a completion fails |

Threads carry their own rollup (`Cost`, `InputTokens`, `OutputTokens`, `Stats`), so a conversation's total is available without re-aggregating.

## The Analytics extension

<screenshots-gallery grid-class="grid grid-cols-1 md:grid-cols-3 gap-4" :images="{
    'Costs': '/img/pages/chat/analytics/analytics-costs.webp',
    'Tokens': '/img/pages/chat/analytics/analytics-tokens.webp',
    'Activity': '/img/pages/chat/analytics/analytics-activity.webp',
}"></screenshots-gallery>

Admin users can filter metrics by user, compare request and token totals, sort users by activity and inspect conversation transcripts when operational review is required.

<screenshot src="/img/pages/chat/analytics/analytics-users-filter.webp" title="Filtering analytics by user"></screenshot>

### Populating the user filter

By default the user filter lists everyone who has made a request. To also offer users who haven't yet, supply a resolver:

```csharp
services.AddPlugin(new ChatFeature {
    UserNamesResolver = req => {
        using var db = req.Resolve<IDbConnectionFactory>().Open();
        return db.Column<string>(db.From<ApplicationUser>().Select(x => x.UserName));
    },
});
```

The extension is UI-only — it consumes the `app` extension's requests/summary APIs, so disabling it removes the dashboards but keeps the data:

```csharp
services.AddPlugin(new ChatFeature {
    DisableExtensions = ["analytics"],
});
```

## The Chat Admin UI

`ChatFeature` registers an **AI Chat** link in ServiceStack's Admin UI, protected by the `Admin` role:

<text-block text="/admin-ui/chat"></text-block>

It's backed by typed ServiceStack APIs you can also call directly:

| API | Purpose |
| --- | --- |
| `AdminQueryChatRequests` | AutoQuery over `ChatRequest` — filter, sort, page by any field |
| `AdminMonthlyChatAnalytics` | Monthly rollup |
| `AdminDailyChatAnalytics` | Daily rollup |
| `AdminGetChatThread` | A thread's messages and per-request stats for operational review |

Because `AdminQueryChatRequests` is an AutoQuery API, the whole of [AutoQuery](/autoquery/rdbms)'s conventions apply:

<text-block text="/api/AdminQueryChatRequests?userStartsWith=alice&costGreaterThan=1&orderBy=-createdAt&take=50"></text-block>

To remove the Admin UI and its APIs entirely:

```csharp
services.AddPlugin(new ChatFeature {
    DisableAdminUi = true,
});
```

## Querying usage yourself

The tables are ordinary OrmLite tables in your App's database, so cost reporting can go wherever your other reporting goes:

```csharp
using var db = dbFactory.Open();

var monthlyCost = db.Scalar<decimal>(db.From<ChatRequest>()
    .Where(x => x.CreatedAt >= DateTime.UtcNow.AddMonths(-1))
    .Select(x => Sql.Sum(x.Cost)));

var byModel = db.Select<(string Model, long Requests, double Cost)>(db.From<ChatRequest>()
    .GroupBy(x => x.Model)
    .Select(x => new { x.Model, Requests = Sql.Count("*"), Cost = Sql.Sum(x.Cost) }));
```

`ChatUserSummary` is the shape returned by the per-user rollup:

```csharp
public class ChatUserSummary
{
    public string? User { get; set; }
    public long Requests { get; set; }
    public double? Cost { get; set; }
    public long? InputTokens { get; set; }
    public long? OutputTokens { get; set; }
    public DateTime? LastActive { get; set; }
}
```

## Enforcing quotas

There's no built-in quota, but `ValidateRequest` runs before every Chat request and has everything it needs:

```csharp
services.AddPlugin(new ChatFeature {
    ValidateRequest = async req => {
        var session = await req.GetSessionAsync();
        if (session.UserAuthId == null) return null;

        using var db = await dbFactory.OpenAsync();
        var spent = await db.ScalarAsync<double?>(db.From<ChatRequest>()
            .Where(x => x.User == session.UserName && x.CreatedAt >= MonthStart)
            .Select(x => Sql.Sum(x.Cost))) ?? 0;

        return spent > MonthlyBudget
            ? HttpError.Forbidden("Monthly AI budget exceeded")
            : null;
    },
});
```

## Costing accuracy

Costs are derived from the model catalog in `providers.json`, sourced from [models.dev](https://models.dev). Refresh it periodically so pricing stays current:

```csharp
await feature.UpdateProviderModelsAsync();
```

Models you added yourself in `providers-extra.json` should carry their own pricing if you want them costed. See [Providers & Models](/chat/providers).

## Related

- [Data & Storage](/chat/data) — the tables and file layout behind these numbers
- [Integrated Auth](/chat/auth) — who can reach the Admin UIs
