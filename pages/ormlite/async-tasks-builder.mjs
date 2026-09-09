import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Sequential awaits vs running independent queries together */
const SequentialVsParallel = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Async ≠ concurrent</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">The latency this actually removes</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Async improves thread utilization across many requests. It does nothing for a single request that awaits
          several independent queries one after another - each still waits for the last.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <div v-for="m in modes" :key="m.name"
             :class="['flex flex-col rounded-2xl border-2 p-5 shadow-sm', m.accent]">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{m.name}}</div>
            <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', m.tint]">{{m.total}}</span>
          </div>
          <div class="mt-4 space-y-2">
            <div v-for="q in m.queries" :key="q.name" class="flex items-center gap-3">
              <code class="w-24 shrink-0 text-[11px] text-slate-500 dark:text-slate-400">{{q.name}}</code>
              <div class="h-5 flex-1 rounded bg-slate-100 dark:bg-slate-800">
                <div :class="['h-5 rounded', m.barTint]" :style="{ marginLeft: q.start + '%', width: q.width + '%' }"></div>
              </div>
            </div>
          </div>
          <p class="mt-4 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{m.text}}</p>
        </div>
      </div>

      <p class="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Only for genuinely independent queries.</b> Anything that depends on a
        previous result still has to wait for it, and each concurrent query needs its own connection.
      </p>
    </section>`,
    setup() {
        const modes = [
            { name:'Awaited one at a time', total:'sum of all',
              tint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              barTint:'bg-slate-400 dark:bg-slate-500',
              queries:[{name:'Rockstars', start:0, width:34},{name:'Albums', start:34, width:33},{name:'Genres', start:67, width:33}],
              text:'Three awaits in a row. The request takes as long as all three added together, even though none of them needed the others.' },
            { name:'Started together', total:'the slowest one',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              barTint:'bg-emerald-500',
              queries:[{name:'Rockstars', start:0, width:34},{name:'Albums', start:0, width:33},{name:'Genres', start:0, width:33}],
              text:'All three in flight at once, awaited together. The request now costs whatever the slowest query costs.' },
        ]
        return { modes }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, SequentialVsParallel }
}
