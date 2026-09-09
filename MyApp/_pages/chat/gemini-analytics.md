---
title: Gemini Search Analytics & Privacy
description: Analyze customer searches and opt-in website traffic with retention, consent, bot filtering, anonymization, and optional geo enrichment.
---

Analytics is an optional layer over a published [Website Search](/chat/gemini-search) deployment,
and is isolated per deployment. **Customer searches** is always available and measures
published-widget queries. **Website traffic** is off by default and must be explicitly enabled.

<screenshot src="/img/pages/chat/gemini/gemini-search-searches.webp" title="Customer search analytics"></screenshot>

## Analyze customer searches

**View Searches** provides demand and quality signals without adding model usage. It shows:

- total searches, result clicks, and search click-through rate;
- related search intents grouped by normalized wording and conservative stemming;
- frequency, average result count, clicks, CTR, and no-result count for each intent;
- the latest searches with their originating page; and
- popular documents with click count, unique searches, average clicked position, and last-clicked
  time.

Only interactions from a published widget are included. The administrative test and live-preview
panels do not inflate customer metrics. Click reporting is fire-and-forget so analytics can never
delay navigation or document preview.

## Optional website traffic analytics

Because the Search script is normally present on every page, it can also provide a lightweight
first-party view of website traffic. This is disabled by default. Use **Capture Analytics** on a
saved Search deployment to opt in, or **Disable Analytics** to stop collecting new page views.
Configure retention (90 days by default), IP anonymization, Do Not Track handling, bot exclusion,
optional consent, denied user-agent substrings, exact IP/CIDR ranges, and excluded page-path globs
before publishing. IPv4 wildcards such as `114.119.*` are accepted and normalized to CIDR. These
rules are enforced server-side before geo resolution or persistence and also omit matching customer
searches and clicks. **Clear retained analytics** permanently removes that Search deployment's
queries, clicks, and page views immediately.

The **Website traffic** panel can switch between the last 24 hours, 7 days, 30 days, and 90 days.
It charts page views and visitors, and reports sessions, pages per session, bounce rate, average
load time, top pages and referrers, campaigns, languages, time zones, devices, platforms, and
connection types. Visitor and 30-minute session identifiers are random values scoped to that
Search deployment and retained in the visitor's `localStorage`.

<data-collected>
</data-collected>

:::warning Treat search telemetry as customer data
Search records query text and operational request context such as the origin, referring page, and
user agent. Result selections are correlated to their search and document. Apply the same access,
retention, and privacy review used for Assistant conversations.
:::

## Privacy settings reference

Page-view capture is off by default. **Capture Analytics** enables it and **Disable Analytics** stops
new events. The dashboard charts 24 hours, 7, 30, or 90 days and reports visitors, sessions, bounce
rate, load time, pages, referrers, campaigns, language, time zone, device, platform, and available
network hints.

<screenshot src="/img/pages/chat/gemini/gemini-search-analytics-results.webp" title="Website traffic analytics"></screenshot>

<privacy-pipeline>
</privacy-pipeline>

The editable denied user-agent list is trimmed, lowercased, and deduplicated. IP wildcards are
normalized to CIDR (`114.119.*` becomes `114.119.0.0/16`), and **Exclude this IP** adds the current
administrator request IP. These exclusion rules are evaluated by the server before geo resolution
or persistence and are not included in the public widget configuration.

When consent is required, define this before the widget script loads:

```html
<script>
window.ServiceStackSearchAnalyticsConsent = async ({ searchId, origin, pageUrl }) => {
  return window.myConsentManager?.allows('analytics') === true
}
</script>
```

The callback may return a Boolean or Promise. Failure, absence, or any value other than `true`
suppresses capture. **Clear retained analytics** permanently deletes this Search's queries, clicks,
and page views. Python does not persist request IP or geo data.

<screenshot src="/img/pages/chat/gemini/gemini-62-search-analytics.webp" title="Analytics privacy configuration"></screenshot>

## C# geo resolver

Geo resolution is **opt-in and disabled by default**. Without an
`IGeminiSearchGeoResolver` registration, analytics stores no country, region, city, coordinates,
ASN, or organization data. ServiceStack includes two optional resolvers.

### Free IP API

[Free IP API](https://freeipapi.com) uses an HTTPS endpoint:

```csharp
services.AddSingleton<IGeminiSearchGeoResolver,
    FreeIpApiGeminiSearchGeoResolver>();
```

It maps country, region, city, postal code, coordinates, continent, ASN, and organization into
`GeminiSearchGeo`. A time zone is retained only when the API returns one unambiguous value; the
provider commonly returns every time zone in a country, which should not be recorded as the
visitor's time zone.

### IP-API

[IP-API](https://ip-api.com) can be enabled instead:

```csharp
services.AddSingleton<IGeminiSearchGeoResolver,
    IpApiGeminiSearchGeoResolver>();
```

The free IP-API endpoint uses plain HTTP. Review the provider's current licence, rate limits, and
HTTPS requirements before using it in production.

Both built-in resolvers ignore loopback, private, link-local, multicast, and otherwise
non-routable addresses. Successful lookups are cached for one day and time out after five seconds.
These defaults can be customized:

```csharp
services.AddSingleton<IGeminiSearchGeoResolver>(sp =>
    new FreeIpApiGeminiSearchGeoResolver(
        sp.GetRequiredService<IHttpClientFactory>())
    {
        CacheDuration = TimeSpan.FromDays(7),
        RequestTimeout = TimeSpan.FromSeconds(3),
    });
```

:::warning Registering a resolver sends visitor IPs to a third party
Only register one resolver. Either built-in provider transmits each uncached public visitor IP to an
external service you do not control. Disclose this in your privacy policy and obtain any consent
required in your jurisdiction before enabling it.
:::

### Custom resolver

For a different provider or an internal database, implement `IGeminiSearchGeoResolver`:

```csharp
public sealed class MyGeoResolver : IGeminiSearchGeoResolver
{
    public async ValueTask<GeminiSearchGeo?> ResolveAsync(string ipAddress,
        CancellationToken token = default) => await LookupAsync(ipAddress, token);
}

services.AddSingleton<IGeminiSearchGeoResolver, MyGeoResolver>();
```

`ResolveAsync` returns a `ValueTask<GeminiSearchGeo?>` so a cached or unresolved lookup completes
without allocating. Return `null` for any address you don't want enriched.

Registration in the IOC is resolved once during installation. A resolver that needs constructor
arguments the container doesn't have can instead be assigned directly to the Gemini extension
before the plugin is added:

```csharp
var chat = new ChatFeature();
chat.Gemini.SearchGeoResolver = new MyGeoResolver();
services.AddPlugin(chat);
```

An explicitly assigned resolver takes precedence; the IOC is only consulted when none was set.

The resolver receives the normalized raw request IP transiently. Geo fields are resolved first,
then the IP stored with the event is anonymized when enabled. Resolver failures are logged and do
not prevent the page view from being recorded. Use a reliable resolver, honor its licence and rate
limits, cache results by network, and configure trusted proxy forwarding correctly.

<screenshot src="/img/pages/chat/gemini/gemini-search-analytics-recent-visitors.webp" title="Recent visitors with geo enrichment"></screenshot>

Assistant conversations are retained separately and reviewed from the Assistants workspace - see
[AI Assistants](/chat/gemini-assistants#review-customer-conversations).
