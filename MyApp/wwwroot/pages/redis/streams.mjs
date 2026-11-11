/** A stream, one consumer group, and where each entry is in its lifecycle */
const ConsumerGroupFlow = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Delivered ≠ processed</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">How a consumer group tracks every entry</h3>

      <div class="mt-6">
        <div class="flex items-baseline justify-between">
          <code class="text-sm font-bold text-slate-900 dark:text-white">orders</code>
          <span class="text-[11px] font-bold text-slate-400 dark:text-slate-500">XADD appends →</span>
        </div>
        <div class="mt-2 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          <div v-for="e in entries" :key="e.id" :class="['rounded-lg px-2 py-2 text-center ring-1', states[e.state].cls]">
            <div class="font-mono text-[11px] font-bold">{{e.id}}</div>
            <div class="mt-0.5 text-[10px] font-bold opacity-80">{{states[e.state].label}}<span v-if="e.owner"> · {{e.owner}}</span></div>
            <div v-if="e.cursor" class="mt-1 text-[9px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">last delivered</div>
          </div>
        </div>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="s in steps" :key="s.cmd" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <code class="text-xs font-bold text-red-700 dark:text-red-300">{{s.cmd}}</code>
          <div class="mt-1 text-sm font-bold text-slate-900 dark:text-white">{{s.name}}</div>
          <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{s.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const states = {
            acked:   { label:'acked', cls:'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900' },
            pending: { label:'pending', cls:'bg-red-50 text-red-800 ring-red-200 dark:bg-red-950/40 dark:text-red-200 dark:ring-red-900' },
            stale:   { label:'stale', cls:'bg-amber-50 text-amber-800 ring-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-800' },
            fresh:   { label:'new', cls:'bg-white text-slate-600 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700' },
        }
        const entries = [
            { id:'…-1', state:'acked' },
            { id:'…-2', state:'stale', owner:'w-1' },
            { id:'…-3', state:'pending', owner:'w-2' },
            { id:'…-4', state:'pending', owner:'w-2', cursor:true },
            { id:'…-5', state:'fresh' },
            { id:'…-6', state:'fresh' },
        ]
        const steps = [
            { cmd:'XREADGROUP … >', name:'Read new entries', text:'Delivers entries after the group’s last delivered ID, and records each one as pending for that consumer.' },
            { cmd:'XACK', name:'Acknowledge', text:'After processing succeeds, removes the entry from the pending list. Until then it can be redelivered.' },
            { cmd:'XPENDING', name:'Inspect', text:'Shows each pending entry’s owner, idle time and delivery count, for retry and dead-letter policies.' },
            { cmd:'XAUTOCLAIM', name:'Recover', text:'Moves entries idle too long, like w-1’s crashed work, to a healthy consumer. It doesn’t acknowledge them.' },
        ]
        return { states, entries, steps }
    }
}

export default {
    components: { ConsumerGroupFlow }
}
