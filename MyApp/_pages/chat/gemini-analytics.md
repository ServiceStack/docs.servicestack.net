---
title: Gemini Search Analytics & Privacy
description: Analyze searches and opt-in website traffic with retention, consent, bot filtering, anonymization, and optional geo enrichment.
---

Analytics is isolated per Search deployment. **Customer searches** always measures published-widget
queries, related intent frequency, no-result searches, clicks, CTR, popular documents, and clicked
position. Administrative previews do not affect these metrics.

<screenshot src="/img/pages/chat/gemini/gemini-customer-searches.webp" title="Customer search analytics"></screenshot>

## Opt-in website analytics

Page-view capture is off by default. **Capture Analytics** enables it and **Disable Analytics** stops
new events. The dashboard charts 24 hours, 7, 30, or 90 days and reports visitors, sessions, bounce
rate, load time, pages, referrers, campaigns, language, time zone, device, platform, and available
network hints.

<screenshot src="/img/pages/chat/gemini/gemini-website-analytics.webp" title="Website traffic analytics"></screenshot>

Privacy defaults and controls are stored per Search:

| Setting | Default | Behavior |
| --- | --- | --- |
| `analytics.enabled` | `false` | Opts into page-view collection. |
| `analytics.retentionDays` | `90` | Automatically removes older queries, clicks, and page views. |
| `analytics.anonymizeIp` | `true` | Stores IPv4 as `/24` and IPv6 as `/48` in C#. |
| `analytics.respectDoNotTrack` | `true` | Suppresses collection when the browser sends DNT. |
| `analytics.excludeBots` | `true` | Excludes common crawler and monitoring user agents. |
| `analytics.requireConsent` | `false` | Requires a host-page callback to return `true`. |
| `analytics.deniedUserAgents` | known crawler list | Case-insensitive user-agent substrings omitted from searches, clicks, and page views. |
| `analytics.deniedIpRanges` | `[]` | Exact IPv4/IPv6 addresses, CIDR ranges, or trailing IPv4 wildcards such as `114.119.*`. |
| `analytics.excludedPaths` | `[]` | Page-path globs such as `/admin/*`, `/health`, or `/preview/*`; query strings are ignored. |

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

<screenshot src="/img/pages/chat/gemini/gemini-analytics-privacy.webp" title="Analytics privacy configuration"></screenshot>

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

Only register one resolver. Registering either provider sends each uncached public visitor IP to
that external service, so disclose this in your privacy policy and obtain any consent required in
your jurisdiction.

### Custom resolver

For a different provider or an internal database, implement `IGeminiSearchGeoResolver`:

```csharp
public sealed class MyGeoResolver : IGeminiSearchGeoResolver
{
    public async Task<GeminiSearchGeo?> ResolveAsync(string ipAddress,
        CancellationToken token = default) => await LookupAsync(ipAddress, token);
}

services.AddSingleton<IGeminiSearchGeoResolver, MyGeoResolver>();
```

The resolver receives the normalized raw request IP transiently. Geo fields are resolved first,
then the IP stored with the event is anonymized when enabled. Resolver failures are logged and do
not prevent the page view from being recorded. Use a reliable resolver, honor its licence and rate
limits, cache results by network, and configure trusted proxy forwarding correctly.

<screenshot src="/img/pages/chat/gemini/gemini-recent-visitors-geo.webp" title="Recent visitors with geo enrichment"></screenshot>
