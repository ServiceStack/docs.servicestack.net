import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Every gate a page view passes through before it is stored */
const PrivacyPipeline = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Enforced server-side</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What a page view passes through before it is stored</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Every one of these rules is applied on the server before geo resolution or persistence - none of the
          exclusion lists are included in the public widget configuration, so they can't be inspected or
          bypassed from the host page.
        </p>
      </div>

      <div class="p-6 sm:p-8">
        <div class="space-y-2">
          <div v-for="(gate,i) in gates" :key="gate.name"
               :class="['flex flex-col gap-x-4 gap-y-2 rounded-xl border p-4 lg:flex-row lg:items-center', gate.accent]">
            <div class="flex shrink-0 items-center gap-3 lg:w-44">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">{{i+1}}</span>
              <div class="text-sm font-bold text-slate-900 dark:text-white">{{gate.name}}</div>
            </div>
            <code class="w-fit shrink-0 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] text-slate-200 dark:bg-black/50">{{gate.key}}</code>
            <p class="min-w-0 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{gate.text}}</p>
            <span :class="['w-fit shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', gate.defaultTint]">{{gate.default}}</span>
          </div>
        </div>

        <div class="mt-4 flex items-center gap-3 rounded-xl border-2 border-emerald-300 bg-emerald-50/70 px-4 py-3.5 dark:border-emerald-800 dark:bg-emerald-950/25">
          <span class="text-lg" aria-hidden="true">🗄</span>
          <p class="text-sm leading-6 text-slate-700 dark:text-slate-200">
            <b class="text-slate-900 dark:text-white">Stored in your database</b> - and removed automatically
            once it passes the retention window. <b class="text-slate-900 dark:text-white">Clear retained
            analytics</b> deletes that Search deployment's queries, clicks and page views immediately.
          </p>
        </div>
      </div>
    </section>`,
    setup() {
        const on  = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
        const off = 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
        const gates = [
            { name:'Capture enabled?', key:'analytics.enabled', default:'off by default', defaultTint:off,
              accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'Page-view capture is opt-in. Customer search analytics are always available; website traffic is not.' },
            { name:'Consent callback', key:'analytics.requireConsent', default:'off by default', defaultTint:off,
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'When required, a host-page callback must return true. Failure, absence or any other value suppresses capture.' },
            { name:'Do Not Track', key:'analytics.respectDoNotTrack', default:'on by default', defaultTint:on,
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Collection is suppressed when the browser sends DNT.' },
            { name:'Bot exclusion', key:'analytics.excludeBots', default:'on by default', defaultTint:on,
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Common crawler and monitoring user agents are excluded.' },
            { name:'Denied user agents', key:'analytics.deniedUserAgents', default:'crawler list', defaultTint:on,
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Case-insensitive substrings, trimmed and deduplicated. Also omits matching searches and clicks.' },
            { name:'Denied IP ranges', key:'analytics.deniedIpRanges', default:'empty', defaultTint:off,
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Exact addresses, CIDR ranges, or trailing IPv4 wildcards such as 114.119.* normalized to CIDR.' },
            { name:'Excluded paths', key:'analytics.excludedPaths', default:'empty', defaultTint:off,
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Page-path globs such as /admin/* or /preview/*. Query strings are ignored.' },
            { name:'Geo enrichment', key:'IGeminiSearchGeoResolver', default:'not registered', defaultTint:off,
              accent:'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20',
              text:'Without a registered resolver no country, region, city, coordinates, ASN or organization is stored at all.' },
            { name:'IP anonymization', key:'analytics.anonymizeIp', default:'on by default', defaultTint:on,
              accent:'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20',
              text:'Geo is resolved first, then the stored IP is truncated to an IPv4 /24 or IPv6 /48. Python stores no IP or geo at all.' },
            { name:'Retention', key:'analytics.retentionDays', default:'90 days', defaultTint:on,
              accent:'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20',
              text:'Older queries, clicks and page views are removed automatically.' },
        ]
        return { gates }
    }
}

/** Collected vs never collected */
const DataCollected = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div v-for="side in sides" :key="side.title"
           :class="['rounded-2xl border p-6 shadow-sm', side.accent]">
        <div class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm dark:bg-slate-900/70">{{side.icon}}</span>
          <div>
            <div class="text-lg font-bold text-slate-900 dark:text-white">{{side.title}}</div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{side.tagline}}</div>
          </div>
        </div>
        <ul class="mt-5 flex flex-wrap gap-1.5">
          <li v-for="item in side.items" :key="item"
              class="rounded-lg bg-white/80 px-2.5 py-1.5 text-xs text-slate-700 ring-1 ring-black/5 dark:bg-slate-900/70 dark:text-slate-300 dark:ring-white/10">{{item}}</li>
        </ul>
        <p class="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{side.text}}</p>
      </div>
    </section>`,
    setup() {
        const sides = [
            { icon:'📊', title:'What is collected', tagline:'Non-blocking, after page load',
              accent:'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40',
              items:['Navigation timings','Page URL and title','Browser-supplied referrer','UTM campaign values','Locale','Screen & viewport size','Device characteristics','Network Information hints'],
              text:'Sent as a text/plain request after the page loads, so it can never delay navigation. Visitor and 30-minute session identifiers are random values scoped to that Search deployment and kept in the visitor’s localStorage.' },
            { icon:'🚫', title:'What is never collected', tagline:'By design, not by configuration',
              accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              items:['Cookies','Precise location','Cross-site identifiers','Third-party trackers'],
              text:'The raw IP is used transiently for optional geo resolution and then anonymized before storage. Nothing leaves your App unless you explicitly register a geo resolver - which does transmit uncached visitor IPs to an external service.' },
        ]
        return { sides }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        PrivacyPipeline,
        DataCollected,
    }
}
