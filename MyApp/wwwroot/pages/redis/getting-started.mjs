/** What Redis is good at, as pillars rather than prose */
const RedisPillars = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Why Redis</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">An in-memory data structure server</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="p in pillars" :key="p.name"
             class="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg dark:bg-slate-800">{{p.icon}}</span>
          <div class="min-w-0 flex-1">
            <div class="font-bold text-slate-900 dark:text-white">{{p.name}}</div>
            <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{p.text}}</p>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const pillars = [
            { icon:'⚡', name:'In-memory speed', text:'Data lives in RAM, so reads and writes complete in a fraction of a millisecond - fast enough that locking and counters become trivial.' },
            { icon:'🧱', name:'Real data structures', text:'Not just strings: Lists, Sets, Sorted Sets, Hashes, HyperLogLogs and GEO indexes, each with atomic server-side operations.' },
            { icon:'💾', name:'Durable when you need it', text:'Point-in-time RDB snapshots and an append-only log let you choose how much durability to trade for throughput.' },
            { icon:'🛡', name:'Highly available', text:'Replication plus Sentinel gives automatic failover; Cluster shards a keyspace across many nodes.' },
            { icon:'📡', name:'Pub/Sub built in', text:'Publish and subscribe channels power ServiceStack’s Server Events and Redis MQ out of the box.' },
            { icon:'📜', name:'Extensible with LUA', text:'Ship your own atomic operations to the server as scripts when a single command isn’t enough.' },
        ]
        return { pillars }
    }
}

/** Zero to first value stored */
const RedisQuickstart = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Four steps</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">From nothing to a value in Redis</h3>

      <div class="mt-7 space-y-4">
        <div v-for="(s,i) in steps" :key="s.name" class="flex items-start gap-4">
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-600 text-sm font-black text-white">{{i+1}}</span>
          <div class="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div class="font-bold text-slate-900 dark:text-white">{{s.name}}</div>
            <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
            <div class="mt-3 whitespace-pre-wrap break-words rounded-lg bg-slate-900 p-3 font-mono text-[11px] leading-5 text-slate-200 dark:bg-black/50">{{s.code}}</div>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const steps = [
            { name:'Run a local redis-server', text:'Docker is the quickest way to get an instance listening on the default port.',
              code:'docker run --name redis -p 6379:6379 -d redis' },
            { name:'Add the client to your project', text:'One NuGet package, no other dependencies.',
              code:'dotnet add package ServiceStack.Redis' },
            { name:'Register a clients manager as a singleton', text:'The manager is the thread-safe factory - never share a single client.',
              code:'services.AddSingleton<IRedisClientsManager>(\n    new RedisManagerPool("localhost:6379"));' },
            { name:'Resolve a client and use it', text:'Always resolve inside a using block so the connection returns to the pool.',
              code:'using var redis = redisManager.GetClient();\nredis.Set("key", "value");\nvar value = redis.Get<string>("key");' },
        ]
        return { steps }
    }
}

export default {
    components: { RedisPillars, RedisQuickstart }
}
