import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** What SQLite is unusually good at, and the one thing to work around */
const SqliteTradeoff = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One limitation, several advantages</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Why server-side SQLite is worth the workaround</h3>
      </div>

      <div class="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div class="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/25">
          <div class="text-sm font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">What you gain</div>
          <div class="mt-3 grid gap-2.5 sm:grid-cols-2">
            <div v-for="a in advantages" :key="a.name"
                 class="rounded-xl bg-white/80 p-3.5 ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10">
              <div class="text-sm font-bold text-slate-900 dark:text-white">{{a.name}}</div>
              <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{{a.text}}</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border-2 border-amber-300 bg-amber-50/50 p-5 shadow-sm dark:border-amber-800 dark:bg-amber-950/20">
          <div class="text-sm font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">The limitation</div>
          <div class="mt-3 text-lg font-bold text-slate-900 dark:text-white">A single concurrent writer</div>
          <p class="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
            Reads scale freely; concurrent writes to the same database have to coordinate. Everything on this page
            exists to make that coordination cheap.
          </p>
        </div>
      </div>

      <div class="mt-4">
        <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Ways to coordinate writes</div>
        <div class="mt-2.5 grid gap-3 sm:grid-cols-3">
          <div v-for="s in strategies" :key="s.name"
               class="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div class="text-sm font-bold text-slate-900 dark:text-white">{{s.name}}</div>
            <p class="mt-1 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{s.text}}</p>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const advantages = [
            { name:'No network latency', text:'The database runs in-process, next to your code.' },
            { name:'No N+1 problem', text:'A query that would be pathological over a network is cheap here.' },
            { name:'35% faster than the filesystem', text:'SQLite’s own benchmark for reading and writing small blobs.' },
            { name:'Your C# inside SQL', text:'Application-defined SQL functions can call your own logic.' },
        ]
        const strategies = [
            { name:'Multiple databases', text:'Split writes across separate SQLite files so unrelated work never contends.' },
            { name:'Database locks', text:'Coordinate writers explicitly when they do need the same database.' },
            { name:'SyncCommand queue', text:'Queue writes to execute serially, without routing every write through an MQ.' },
        ]
        return { advantages, strategies }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, SqliteTradeoff }
}
