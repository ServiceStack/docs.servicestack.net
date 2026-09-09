import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Transaction scope, isolation and savepoints at a glance */
const TransactionScope = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Attached to the connection</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">How a transaction scopes your commands</h3>

      <div class="mt-7 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <code class="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">db.OpenTransaction()</code>
          <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Creates the transaction and <b class="text-slate-900 dark:text-white">attaches it to the connection</b>, so
            every command you run on that <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">db</code>
            joins it automatically - you never pass the transaction around.
          </p>
        </div>
        <div class="flex items-center justify-center text-2xl text-indigo-400" aria-hidden="true">
          <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
        </div>
        <div class="grid gap-3">
          <div v-for="e in endings" :key="e.name"
               :class="['rounded-xl border p-4 shadow-sm', e.accent]">
            <div class="flex items-center justify-between gap-2">
              <code class="text-sm font-bold text-slate-900 dark:text-white">{{e.name}}</code>
              <span :class="['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', e.tint]">{{e.badge}}</span>
            </div>
            <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{e.text}}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-2">
        <div v-for="f in features" :key="f.name"
             class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-sm font-bold text-slate-900 dark:text-white">{{f.name}}</div>
          <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{f.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const endings = [
            { name:'Commit()', badge:'explicit', tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Nothing is persisted until you say so.' },
            { name:'Rollback() / dispose', badge:'the default', tint:'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
              accent:'border-rose-200 bg-rose-50/40 dark:border-rose-900 dark:bg-rose-950/20',
              text:'Leaving the using block without committing rolls back - so an exception can’t half-apply your work.' },
        ]
        const features = [
            { name:'Custom isolation level', text:'Pass an IsolationLevel when opening, for the cases where the database default isn’t what you want.' },
            { name:'Savepoints', text:'Roll part of a transaction back without abandoning all of it - useful for a retryable step inside a larger unit of work.' },
        ]
        return { endings, features }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, TransactionScope }
}
