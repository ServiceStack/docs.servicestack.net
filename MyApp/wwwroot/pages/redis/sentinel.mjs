/** Who talks to whom in a Sentinel setup */
const SentinelTopology = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">The official HA recommendation</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Your app connects to the sentinels, not to Redis</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        You configure <code class="rounded bg-slate-100 px-1 dark:bg-slate-800">RedisSentinel</code> with the sentinel hosts only.
        It discovers the current master and replicas from them, then builds and maintains the client managers for you.
      </p>

      <div class="mt-7 space-y-3">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Your app</div>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <code class="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-300">RedisSentinel</code>
            <span class="text-slate-400" aria-hidden="true">→</span>
            <code class="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Start()</code>
            <span class="text-slate-400" aria-hidden="true">→</span>
            <code class="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">IRedisClientsManager</code>
          </div>
        </div>

        <div class="flex justify-center text-xl text-slate-300 dark:text-slate-600" aria-hidden="true">↓</div>

        <div class="rounded-2xl border-2 border-amber-300/60 bg-amber-50/40 p-4 dark:border-amber-800 dark:bg-amber-950/20">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-amber-700 dark:text-amber-400">Sentinels · default port 26379 · minimum 3</div>
          <div class="mt-2 grid gap-2 sm:grid-cols-3">
            <div v-for="s in sentinels" :key="s"
                 class="rounded-lg bg-white px-3 py-2 text-center text-xs font-bold text-slate-700 ring-1 ring-amber-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-amber-900">{{s}}</div>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Three is the minimum for a setup that survives any single node failing. They also auto-discover each other, so naming one is enough to get started.
          </p>
        </div>

        <div class="flex justify-center text-xl text-slate-300 dark:text-slate-600" aria-hidden="true">↓ monitor</div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div v-for="n in nodes" :key="n.role" :class="['rounded-2xl border p-4 shadow-sm', n.tint]">
            <div class="flex flex-wrap items-baseline gap-2">
              <span class="font-bold text-slate-900 dark:text-white">{{n.role}}</span>
              <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{n.tag}}</span>
            </div>
            <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{n.text}}</p>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const sentinels = ['sentinel1', 'sentinel2:6390', 'sentinel3']
        const nodes = [
            { role:'Master', tag:'read + write', tint:'border-red-300/60 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20',
              text:'Resolved with GetClient(). If the sentinels agree it is down, one replica is promoted to take its place.' },
            { role:'Replicas', tag:'read only', tint:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Resolved with GetReadOnlyClient(). One of them becomes the new master during a failover.' },
        ]
        return { sentinels, nodes }
    }
}

/** What happens, in order, when the master goes away */
const FailoverSequence = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Automatic failover</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">What happens when the master fails</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          None of these steps require a deploy or a config change on your side - your client managers are reconfigured in place.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="(s,i) in steps" :key="s.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-sm font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400">{{i+1}}</span>
          <div class="mt-3 font-bold text-slate-900 dark:text-white">{{s.name}}</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const steps = [
            { name:'Subjective down', text:'A sentinel stops getting replies from the master and flags it sdown - its own opinion only.' },
            { name:'Objective down', text:'Enough sentinels agree and the master is marked odown, which is what authorises a failover.' },
            { name:'Promotion', text:'The sentinels elect a leader, pick a replica and promote it to master, repointing the others at it.' },
            { name:'Clients reconfigured', text:'RedisSentinel is notified, fails the client managers over to the new master and counts it in RedisStats.' },
        ]
        return { steps }
    }
}

export default {
    components: { SentinelTopology, FailoverSequence }
}
