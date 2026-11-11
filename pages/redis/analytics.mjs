/** Measured MEMORY USAGE after adding the same 1,000,000 unique IDs (Redis 8) */
const UniqueCountMemory = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Measured, not estimated</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Memory to count 1,000,000 unique IDs</h3>
      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">MEMORY USAGE on Redis 8. Log scale: each gridline is 10× the one before.</p>

      <div class="mt-6 space-y-4">
        <div v-for="r in rows" :key="r.name" class="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[8rem_minmax(0,1fr)]"
             :title="r.name + ': ' + r.bytes.toLocaleString() + ' bytes, ' + r.accuracy">
          <div>
            <div class="text-sm font-bold text-slate-900 dark:text-white">{{r.name}}</div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400">{{r.accuracy}}</div>
          </div>
          <div class="relative h-8">
            <div class="absolute inset-0 flex" aria-hidden="true">
              <span v-for="t in ticks" :key="t.label" class="h-full border-l border-slate-100 dark:border-slate-800" :style="{ position:'absolute', left: t.x + '%' }"></span>
            </div>
            <div class="absolute inset-y-1 left-0 rounded-r bg-red-600 dark:bg-red-500" :style="{ width: r.width + '%' }"></div>
            <span v-if="r.width > 80" class="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pr-2 text-sm font-bold text-white"
                  :style="{ right: (100 - r.width) + '%' }">{{r.label}}</span>
            <span v-else class="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-2 text-sm font-bold text-slate-700 dark:text-slate-200"
                  :style="{ left: r.width + '%' }">{{r.label}}</span>
          </div>
        </div>
        <div class="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 sm:grid-cols-[8rem_minmax(0,1fr)]" aria-hidden="true">
          <span></span>
          <div class="relative h-4 text-[10px] text-slate-400 dark:text-slate-500">
            <span v-for="t in ticks" :key="t.label" :class="['absolute whitespace-nowrap', t.x === 100 ? '-translate-x-full' : t.x === 0 ? '' : '-translate-x-1/2']" :style="{ left: t.x + '%' }">{{t.label}}</span>
          </div>
        </div>
      </div>

      <p class="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
        The Set is <b class="text-slate-900 dark:text-white">2,600×</b> larger than the HyperLogLog, which counted 999,674 (0.03% off).
        The bitmap is exact, because the IDs were the dense integers 0 to 999,999.
      </p>
    </section>`,
    setup() {
        const min = 3, max = 8 // log10 of 1 KB .. 100 MB
        const x = bytes => (Math.log10(bytes) - min) / (max - min) * 100
        const rows = [
            { name:'Set', bytes:37277587, label:'37.3 MB', accuracy:'exact' },
            { name:'Bitmap', bytes:131106, label:'128 KB', accuracy:'exact, integer IDs' },
            { name:'HyperLogLog', bytes:14369, label:'14 KB', accuracy:'±0.81%' },
        ].map(r => ({ ...r, width: x(r.bytes) }))
        const ticks = [
            { label:'1 KB', x:0 }, { label:'10 KB', x:20 }, { label:'100 KB', x:40 },
            { label:'1 MB', x:60 }, { label:'10 MB', x:80 }, { label:'100 MB', x:100 },
        ]
        return { rows, ticks }
    }
}

export default {
    components: { UniqueCountMemory }
}
