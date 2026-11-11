/** Which caching pattern solves which problem */
const CachePatternMap = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Pick by the problem you have</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Caching patterns at a glance</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <a v-for="p in patterns" :key="p.name" :href="p.href"
           class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-red-700">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">{{p.problem}}</div>
          <div class="mt-1 font-bold text-slate-900 group-hover:text-red-700 dark:text-white dark:group-hover:text-red-300">{{p.name}}</div>
          <p class="mt-1.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{p.text}}</p>
          <code class="mt-3 self-start whitespace-pre-wrap break-words rounded-md bg-slate-50 px-2 py-1 text-[11px] font-bold text-red-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-red-300 dark:ring-slate-700">{{p.api}}</code>
        </a>
      </div>
    </section>`,
    setup() {
        const patterns = [
            { problem:'Slow reads', name:'Cache-aside', href:'#cache-aside', api:'GetOrCreate(key, ttl, fn)',
              text:'Read from the cache, load and store on a miss. The right default for almost everything.' },
            { problem:'Synchronized expiry', name:'TTL jitter', href:'#add-jitter-to-expirations', api:'ttl + random offset',
              text:'Spread out expirations of entries written together so they don’t all miss at once.' },
            { problem:'Hot key expires', name:'Stampede protection', href:'#stop-cache-stampedes', api:'SET NX EX',
              text:'One caller rebuilds the value while everyone else waits for it, instead of all hitting the database.' },
            { problem:'Idle data', name:'Sliding expiration', href:'#sliding-expiration', api:'GetAndExpireValue()',
              text:'Reset the expiry on every read with GETEX, so active entries stay and idle ones leave.' },
            { problem:'Related entries change', name:'Tags', href:'#invalidate-related-entries-with-tags', api:'Set + Lua UNLINK',
              text:'Track which keys belong to a tag, then remove the whole group atomically.' },
            { problem:'Everything is stale', name:'Generations', href:'#invalidate-a-namespace-with-generations', api:'INCR ns:gen',
              text:'Bump a version number in every key, invalidating a whole namespace with one command.' },
            { problem:'Maintenance cleanup', name:'Delete by pattern', href:'#delete-keys-by-pattern', api:'UnlinkByPattern()',
              text:'SCAN + UNLINK in batches, without blocking the server with KEYS.' },
            { problem:'Network round trips', name:'Two-tier cache', href:'#two-tier-cache-with-pubsub-invalidation', api:'Memory + Pub/Sub',
              text:'A short-lived in-process copy on each server, evicted everywhere by a Pub/Sub message.' },
            { problem:'Library integration', name:'IDistributedCache', href:'/redis/distributed-cache', api:'AddServiceStackRedisCache()',
              text:'Back HybridCache, output caching and other ASP.NET Core caches with Redis.' },
        ]
        return { patterns }
    }
}

/** Without vs with a rebuild lock when a hot key expires */
const StampedeComparison = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">The moment a hot key expires</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Concurrent requests hitting one expired key</h3>

      <div class="mt-6 grid gap-4 lg:grid-cols-2">
        <div v-for="side in sides" :key="side.name" :class="['rounded-2xl border p-5 shadow-sm', side.tint]">
          <div class="flex items-baseline justify-between gap-3">
            <span class="font-bold text-slate-900 dark:text-white">{{side.name}}</span>
            <span :class="['rounded-full px-2.5 py-0.5 text-[11px] font-black', side.badge]">{{side.result}}</span>
          </div>
          <div class="mt-4 space-y-1.5" aria-hidden="true">
            <div v-for="(row,i) in side.rows" :key="i" class="flex items-center gap-2">
              <span class="w-14 shrink-0 text-right text-[10px] font-bold text-slate-400 dark:text-slate-500">req {{i+1}}</span>
              <div class="relative h-3 flex-1 rounded-full bg-slate-100 dark:bg-slate-800">
                <div v-for="(seg,si) in row" :key="si" :class="['absolute inset-y-0 rounded-full', seg.cls]" :style="{ left: seg.left + '%', width: seg.width + '%' }"></div>
              </div>
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span v-for="l in side.legend" :key="l.text" class="flex items-center gap-1.5"><span :class="['h-2.5 w-2.5 rounded-full', l.cls]"></span>{{l.text}}</span>
          </div>
          <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{{side.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const n = 8
        const dbCls = 'bg-red-500/80 dark:bg-red-500/70'
        const waitCls = 'bg-slate-300 dark:bg-slate-600'
        const hitCls = 'bg-emerald-500/80 dark:bg-emerald-500/70'
        // each row is a list of timeline segments: { left%, width%, cls }
        const without = Array.from({ length:n }, (_,i) => [{ left: i*2, width: 62 + (i%3)*8, cls: dbCls }])
        const withLock = Array.from({ length:n }, (_,i) => i === 0
            ? [{ left: 0, width: 42, cls: dbCls }]
            : [{ left: i*2, width: 42 - i*2, cls: waitCls }, { left: 43, width: 5, cls: hitCls }])
        const sides = [
            { name:'Without a lock', result:'a query per request', rows: without,
              tint:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              badge:'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
              legend:[{ text:'rebuilding from the database', cls: dbCls }],
              text:'Every request misses at once and runs the expensive query. The database slows down, so each query takes longer than normal.' },
            { name:'With SET NX', result:'1 database query', rows: withLock,
              tint:'border-red-300/60 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20',
              badge:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              legend:[{ text:'rebuilding', cls: dbCls }, { text:'waiting', cls: waitCls }, { text:'served from cache', cls: hitCls }],
              text:'The first caller wins the lock and rebuilds. The others poll the cache, and receive the new value as soon as it is written.' },
        ]
        return { sides }
    }
}

/** In-process copies kept consistent with a Pub/Sub eviction message */
const TwoTierCache = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Memory first, Redis second, database last</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">A two-tier cache across app servers</h3>

      <div class="mt-6 grid gap-3 md:grid-cols-3">
        <div v-for="s in servers" :key="s.name"
             :class="['rounded-2xl border p-4 shadow-sm', s.active ? 'border-red-300/70 bg-red-50/50 dark:border-red-800 dark:bg-red-950/25' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900']">
          <div class="flex items-center justify-between">
            <span class="text-sm font-bold text-slate-900 dark:text-white">{{s.name}}</span>
            <span class="text-[11px] font-bold text-slate-400 dark:text-slate-500">MemoryCacheClient</span>
          </div>
          <div class="mt-3 rounded-lg bg-white px-3 py-2 font-mono text-[11px] ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-700">
            <span :class="s.active ? 'text-red-700 line-through dark:text-red-300' : 'text-slate-400 line-through dark:text-slate-500'">product:1</span>
            <span class="ml-2 text-slate-400 dark:text-slate-500">{{s.active ? 'Invalidate()' : 'evicted'}}</span>
          </div>
        </div>
      </div>

      <div class="my-3 flex flex-col items-center gap-1 text-center" aria-hidden="true">
        <span class="text-xs font-bold text-slate-400 dark:text-slate-500">↓ DEL product:1 + PUBLISH cache:invalidate &nbsp;·&nbsp; ↑ every subscriber removes its copy</span>
      </div>

      <div class="rounded-2xl border-2 border-red-400/50 bg-white p-4 text-center shadow-sm dark:border-red-800 dark:bg-slate-900">
        <div class="font-bold text-slate-900 dark:text-white">Redis</div>
        <div class="mt-1 text-sm text-slate-500 dark:text-slate-400">shared cache entry &nbsp;+&nbsp; <code class="font-bold text-red-700 dark:text-red-300">cache:invalidate</code> channel</div>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-3">
        <div v-for="t in tiers" :key="t.name" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-baseline justify-between gap-2">
            <span class="text-sm font-bold text-slate-900 dark:text-white">{{t.name}}</span>
            <span class="text-[11px] font-black text-red-600 dark:text-red-400">{{t.cost}}</span>
          </div>
          <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{t.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const servers = [
            { name:'App server A', active:true },
            { name:'App server B', active:false },
            { name:'App server C', active:false },
        ]
        const tiers = [
            { name:'1. Local memory', cost:'no network', text:'Short-lived copy, 30s in the example, bounding staleness if a message is missed.' },
            { name:'2. Redis', cost:'1 round trip', text:'Shared by every server, populated once per expiry.' },
            { name:'3. Database', cost:'a query', text:'Only reached when neither tier has the value.' },
        ]
        return { servers, tiers }
    }
}

export default {
    components: { CachePatternMap, StampedeComparison, TwoTierCache }
}
