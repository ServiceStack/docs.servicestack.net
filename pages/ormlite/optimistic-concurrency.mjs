import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** The lost-update problem, and what RowVersion does about it */
const LostUpdate = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One property, no locks</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What <code class="rounded bg-white px-1.5 py-0.5 text-lg dark:bg-slate-800">ulong RowVersion</code> prevents</h3>

      <div class="mt-6 grid gap-4 lg:grid-cols-2">
        <div v-for="s in scenarios" :key="s.name"
             :class="['rounded-2xl border-2 p-5 shadow-sm', s.accent]">
          <div class="flex items-center justify-between gap-2">
            <div class="font-bold text-slate-900 dark:text-white">{{s.name}}</div>
            <span :class="['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', s.tint]">{{s.badge}}</span>
          </div>
          <ol class="mt-3 space-y-2">
            <li v-for="(step,i) in s.steps" :key="step" class="flex items-start gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <span :class="['flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-black', s.numTint]">{{i+1}}</span>
              <span>{{step}}</span>
            </li>
          </ol>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <b class="text-slate-900 dark:text-white">It’s optimistic</b> - nothing is locked and readers are never blocked.
        The cost is that a conflicting write fails and you decide what to do: refetch and retry, merge, or show the user
        what changed underneath them.
      </p>
    </section>`,
    setup() {
        const scenarios = [
            { name:'Without RowVersion', badge:'lost update',
              tint:'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
              numTint:'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
              accent:'border-rose-200 bg-rose-50/40 dark:border-rose-900 dark:bg-rose-950/20',
              steps:[
                'Two users load the same row.',
                'User A saves their change.',
                'User B saves - overwriting A’s change with stale data.',
                'Nobody is told anything happened.',
              ] },
            { name:'With RowVersion', badge:'detected',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              numTint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              steps:[
                'Both users load the row, carrying its version.',
                'User A saves - the version moves on.',
                'User B’s update matches on the old version and affects 0 rows.',
                'OrmLite raises a concurrency error instead of silently winning.',
              ] },
        ]
        return { scenarios }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, LostUpdate }
}
