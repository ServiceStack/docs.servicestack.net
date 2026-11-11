/** Key-level expiry vs per-field expiry over the same hash */
const FieldExpiryComparison = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Redis 7.4+ · Valkey 9+</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">One lifetime per key, or one per field</h3>

      <div class="mt-6 grid gap-4 lg:grid-cols-2">
        <div v-for="side in sides" :key="side.name" :class="['rounded-2xl border p-5 shadow-sm', side.tint]">
          <div class="flex items-baseline justify-between gap-3">
            <span class="font-bold text-slate-900 dark:text-white">{{side.name}}</span>
            <code class="text-[11px] font-bold text-red-700 dark:text-red-300">{{side.cmd}}</code>
          </div>
          <div class="mt-4 rounded-xl bg-white p-3 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-700">
            <div class="mb-2 flex items-center justify-between font-mono text-[11px] font-bold">
              <span class="text-slate-900 dark:text-white">presence:room:42</span>
              <span :class="side.keyTtl ? 'text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'">{{side.keyTtl || 'no key TTL'}}</span>
            </div>
            <div v-for="f in side.fields" :key="f.name" class="mt-1.5 grid grid-cols-[4rem_minmax(0,1fr)_3.5rem] items-center gap-2">
              <span class="font-mono text-[11px] text-slate-600 dark:text-slate-300">{{f.name}}</span>
              <div class="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div :class="['h-2 rounded-full', f.left === 0 ? '' : 'bg-red-500/80 dark:bg-red-400/80']" :style="{ width: f.left + '%' }"></div>
              </div>
              <span :class="['text-right font-mono text-[11px] font-bold', f.left === 0 ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-700 dark:text-slate-200']">{{f.ttl}}</span>
            </div>
          </div>
          <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{{side.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const sides = [
            { name:'Key expiry', cmd:'EXPIRE key', keyTtl:'12s',
              tint:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              fields:[ { name:'alice', ttl:'12s', left:40 }, { name:'bob', ttl:'12s', left:40 }, { name:'carol', ttl:'12s', left:40 } ],
              text:'Every field shares the key’s deadline. Refreshing it for one member keeps everyone, including members who left.' },
            { name:'Field expiry', cmd:'HPEXPIRE key ms FIELDS', keyTtl:'',
              tint:'border-red-300/60 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20',
              fields:[ { name:'alice', ttl:'28s', left:93 }, { name:'bob', ttl:'6s', left:20 }, { name:'carol', ttl:'gone', left:0 } ],
              text:'Each heartbeat refreshes only that member. Members who stop sending heartbeats are removed on their own.' },
        ]
        return { sides }
    }
}

export default {
    components: { FieldExpiryComparison }
}
