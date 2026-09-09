import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Upsert vs Save vs Insert vs Update, as a decision */
const WriteChooser = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Four ways to write a row</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Which one do you actually want?</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          The difference is what you know about the row before you write it - and what should happen when you’re wrong.
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="a in apis" :key="a.name"
             :class="['flex flex-col rounded-2xl border-2 p-5 shadow-sm', a.accent]">
          <div class="flex items-start justify-between gap-3">
            <code class="min-w-0 break-words text-base font-bold text-slate-900 dark:text-white">{{a.name}}</code>
            <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', a.tint]">{{a.statements}}</span>
          </div>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">You know</div>
          <p class="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{{a.knows}}</p>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Reach for it when</div>
          <p class="mt-1 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{a.when}}</p>
        </div>
      </div>

      <p class="mt-4 flex items-start gap-3 rounded-xl border-2 border-amber-300 bg-amber-50/60 px-4 py-3.5 text-sm leading-6 text-slate-700 dark:border-amber-800 dark:bg-amber-950/25 dark:text-slate-200">
        <span class="mt-0.5 shrink-0 text-lg" aria-hidden="true">⚠</span>
        <span><b class="text-slate-900 dark:text-white">Upsert is not optimistic concurrency.</b> It converges on your
        value regardless of what changed underneath it. If a write must <i>fail</i> when someone else has touched the
        row, use a <a href="/ormlite/optimistic-concurrency" class="font-semibold underline decoration-dotted">RowVersion</a>
        field instead.</span>
      </p>
    </section>`,
    setup() {
        const apis = [
            { name:'Upsert', statements:'1 statement',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              knows:'The primary key - but not whether the row exists yet.',
              when:'Imports, synchronization, event handlers and retryable jobs that should converge on the same row. The database resolves the conflict atomically.' },
            { name:'Save', statements:'2 statements',
              tint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              knows:'The same as Upsert, but checks first.',
              when:'You need its higher-level behavior - particularly saving [Reference] data with references:true, which Upsert doesn’t do.' },
            { name:'Insert', statements:'1 statement',
              tint:'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              knows:'The row is new.',
              when:'A duplicate key should stay an error rather than silently becoming an update.' },
            { name:'Update / UpdateOnly', statements:'1 statement',
              tint:'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              knows:'The row already exists.',
              when:'The condition is something other than the primary key, or you’re updating many rows by a WHERE expression - which Upsert can’t do.' },
        ]
        return { apis }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, WriteChooser }
}
