/** The three client layers, and what each one does to your value on the way to redis-server */
const ClientLayers = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">One connection, three levels of abstraction</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Pick the layer that matches your data</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        Every client is a thin wrapper over the one below it. Nothing is hidden - you can always drop a layer to send raw bytes,
        or move up a layer to work in POCOs.
      </p>

      <div class="mt-7 space-y-3">
        <div v-for="(l,i) in layers" :key="l.name"
             :class="['rounded-2xl border p-5 shadow-sm', l.tint]">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <code class="text-sm font-bold text-slate-900 dark:text-white">{{l.name}}</code>
            <span :class="['rounded-full px-2 py-0.5 text-[11px] font-bold', l.badgeTint]">works in {{l.type}}</span>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{l.text}}</p>
          <div class="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
            <span class="font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">On the wire</span>
            <span v-for="(s,si) in l.steps" :key="s" class="flex items-center gap-2">
              <span v-if="si" class="text-slate-300 dark:text-slate-600" aria-hidden="true">→</span>
              <code class="whitespace-pre-wrap break-words rounded-md bg-white px-2 py-0.5 font-bold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700">{{s}}</code>
            </span>
          </div>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-red-900 dark:bg-red-950/25 dark:text-slate-200">
        All three are interfaces, so app logic binds to implementation-free abstractions that are easy to mock and substitute.
      </p>
    </section>`,
    setup() {
        const layers = [
            { name:'RedisTypedClient', type:'POCOs',
              tint:'border-red-300/60 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20',
              badgeTint:'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
              text:'Created with redis.As<T>(). Provides a typed interface for every Redis value operation against any C#/.NET POCO, serialized with ServiceStack.Text.',
              steps:['POCO','JSON','UTF8 bytes','redis'] },
            { name:'RedisClient', type:'strings',
              tint:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              badgeTint:'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
              text:'A friendlier, more descriptive API over the Redis command set that stores values as strings. This is what you want for Redis-specific functionality.',
              steps:['string','UTF8 bytes','redis'] },
            { name:'RedisNativeClient', type:'raw byte[]',
              tint:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              badgeTint:'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
              text:'Low-level raw byte access that maps 1:1 with the Redis operations of the same name. No marshalling - you control your own serialization.',
              steps:['byte[]','redis'] },
        ]
        return { layers }
    }
}

/** Which interface to bind to, by intent */
const InterfacePicker = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Which interface should I use?</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Bind to the smallest API that does the job</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <a v-for="o in options" :key="o.name" :href="o.href"
           class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-red-700">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">{{o.when}}</div>
          <code class="mt-1 whitespace-pre-wrap break-words font-bold text-slate-900 group-hover:text-red-700 dark:text-white dark:group-hover:text-red-300">{{o.name}}</code>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{o.text}}</p>
        </a>
      </div>
    </section>`,
    setup() {
        const options = [
            { when:'Redis is just my cache', name:'ICacheClient', href:'/caching',
              text:'Bind to the common caching interface and you can swap in the In-Memory or Memcached providers without touching app code.' },
            { when:'I want the friendly API', name:'IRedisClient', href:'/redis/client',
              text:'The descriptive string API - the right default whenever you need Redis-specific functionality.' },
            { when:'I store POCOs', name:'redis.As<T>()', href:'/redis/typed-client',
              text:'A strongly-typed client whose Lists, Sets, SortedSets and Hashes are all typed to your POCO.' },
            { when:'I control serialization', name:'IRedisNativeClient', href:'/redis/client-managers#accessing-the-redis-client',
              text:'Raw byte[] APIs mapping 1:1 to Redis commands, for when you want nothing between you and the server.' },
        ]
        return { options }
    }
}

/** The documentation, arranged by what you're trying to do */
const RedisDocMap = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Where to go next</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">The ServiceStack.Redis documentation</h3>
      </div>
      <div v-for="stage in stages" :key="stage.name" class="mb-4 last:mb-0">
        <div class="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span :class="['flex h-7 items-center rounded-lg px-2.5 text-[11px] font-black uppercase tracking-wider', stage.tint]">{{stage.name}}</span>
          <span class="text-sm text-slate-500 dark:text-slate-400">{{stage.caption}}</span>
        </div>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a v-for="doc in stage.docs" :key="doc.title" :href="doc.href"
             class="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-red-700">
            <div class="font-bold text-slate-900 group-hover:text-red-700 dark:text-white dark:group-hover:text-red-300">{{doc.title}}</div>
            <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{doc.text}}</p>
          </a>
        </div>
      </div>
    </section>`,
    setup() {
        const stages = [
            { name:'Start', caption:'Get a server running and your first value stored',
              tint:'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
              docs:[
                { title:'Getting Started', href:'/redis/getting-started', text:'Run Redis in Docker, install the client and connect end to end.' },
                { title:'Client Managers', href:'/redis/client-managers', text:'Connection strings and the thread-safe pool you register as a singleton.' },
                { title:'Client Usage', href:'/redis/client-usage', text:'A tour of the APIs over Redis Lists, Sets, Sorted Sets and Hashes.' },
                { title:'Async APIs', href:'/redis/async', text:'The async client, and how to resolve it inside a ServiceStack Service.' },
              ] },
            { name:'The APIs', caption:'The interfaces you bind to',
              tint:'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
              docs:[
                { title:'Redis Client', href:'/redis/client', text:'The full IRedisClient string API surface.' },
                { title:'Typed Client', href:'/redis/typed-client', text:'redis.As<T>() - every value operation, typed to your POCO.' },
                { title:'Custom Commands', href:'/redis/custom-commands', text:'Call any Redis command, including ones the client has no API for yet.' },
              ] },
            { name:'Atomicity', caption:'Make several operations act as one',
              tint:'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              docs:[
                { title:'Transactions', href:'/redis/transactions', text:'MULTI/EXEC/DISCARD behind a typed queue-then-commit API.' },
                { title:'Typed Transactions', href:'/redis/typed-transactions', text:'The same transaction API against a POCO type.' },
                { title:'Distributed Locking', href:'/redis/distributed-locking', text:'Multi-server locks in a using block, built on SETNX.' },
                { title:'LUA APIs', href:'/redis/lua', text:'Server-side scripts, and ExecCachedLua for self-healing SHA1 execution.' },
              ] },
            { name:'Scale & operate', caption:'Run it in production',
              tint:'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              docs:[
                { title:'Redis Sentinel', href:'/redis/sentinel', text:'Automatic failover and instance discovery for a highly available setup.' },
                { title:'Pub/Sub Server', href:'/redis/pubsub', text:'A managed, auto-reconnecting background subscriber.' },
                { title:'Automatic Retries', href:'/redis/automatic-retries', text:'Transparent retries on socket and retryable exceptions.' },
                { title:'Redis Stats', href:'/redis/stats', text:'Command, failover, pool and retry counters for a running instance.' },
                { title:'Profiling', href:'/redis/profiling', text:'See every Redis command your app sends.' },
                { title:'Troubleshooting', href:'/redis/troubleshooting', text:'Diagnosing corrupted data from a shared client instance.' },
              ] },
            { name:'Modelling', caption:'Designing data for a key-value store',
              tint:'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
              docs:[
                { title:'Designing a NoSQL DB', href:'/redis/design-nosql', text:'A worked blog schema - entities, indexes and denormalization.' },
                { title:'Schemaless Migration', href:'/redis/schemaless-migration', text:'Evolving your types without a migration script.' },
                { title:'Admin Desktop', href:'/redis/redis-desktop', text:'Browse and edit your Redis data from the Admin UI.' },
              ] },
        ]
        return { stages }
    }
}

export default {
    components: { ClientLayers, InterfacePicker, RedisDocMap }
}
