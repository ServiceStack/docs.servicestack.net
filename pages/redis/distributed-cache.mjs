/** How sliding expiry is refreshed by reads but capped by the absolute deadline */
const SlidingExpiryTimeline = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Sliding 2 min · absolute 10 min</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Reads extend an entry, up to its absolute deadline</h3>

      <div class="mt-8 px-1" aria-hidden="true">
        <div class="relative h-16">
          <div class="absolute inset-x-0 top-7 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
          <div class="absolute top-7 h-1.5 rounded-full bg-red-500/80 dark:bg-red-400/80" :style="{ left: '0%', width: alive + '%' }"></div>
          <div class="absolute top-0 h-7 border-l-2 border-dashed border-slate-900 dark:border-white" :style="{ left: pct(10) }">
            <span class="absolute -top-1 left-1.5 whitespace-nowrap text-[10px] font-black text-slate-900 dark:text-white">absolute deadline</span>
          </div>
          <div v-for="e in events" :key="e.t" class="absolute top-5" :style="{ left: pct(e.t) }">
            <span :class="['block h-5 w-5 -translate-x-1/2 rounded-full ring-4 ring-white dark:ring-slate-900', e.cls]"></span>
            <span class="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-slate-600 dark:text-slate-300">{{e.label}}</span>
          </div>
        </div>
        <div class="relative mt-6 h-4 text-[10px] text-slate-400 dark:text-slate-500">
          <span v-for="m in [0,2,4,6,8,10,12]" :key="m" :class="['absolute whitespace-nowrap', m === 12 ? '-translate-x-full' : m === 0 ? '' : '-translate-x-1/2']" :style="{ left: pct(m) }">{{m}} min</span>
        </div>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-3">
        <div v-for="s in steps" :key="s.name" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-sm font-bold text-slate-900 dark:text-white">{{s.name}}</div>
          <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{s.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const span = 12
        const pct = m => (m / span * 100) + '%'
        const events = [
            { t:0, label:'Set', cls:'bg-slate-900 dark:bg-white' },
            { t:1.5, label:'Get', cls:'bg-red-600 dark:bg-red-400' },
            { t:3, label:'Get', cls:'bg-red-600 dark:bg-red-400' },
            { t:4.5, label:'Get', cls:'bg-red-600 dark:bg-red-400' },
            { t:6, label:'Get', cls:'bg-red-600 dark:bg-red-400' },
            { t:7.5, label:'Get', cls:'bg-red-600 dark:bg-red-400' },
            { t:9, label:'Get', cls:'bg-red-600 dark:bg-red-400' },
            { t:10, label:'removed', cls:'bg-slate-400 dark:bg-slate-500' },
        ]
        const alive = 10 / span * 100
        const steps = [
            { name:'Each read slides it', text:'Get and Refresh push the expiry to 2 minutes from now, in the same atomic script that reads it.' },
            { name:'Idle entries leave', text:'If no read had followed the one at 4.5 min, the entry would have expired 2 minutes later, at 6.5 min.' },
            { name:'Never past the deadline', text:'The read at 9 min would slide it to 11 min, so the expiry is capped at the 10 min deadline instead.' },
        ]
        return { pct, events, alive, steps }
    }
}

export default {
    components: { SlidingExpiryTimeline }
}
