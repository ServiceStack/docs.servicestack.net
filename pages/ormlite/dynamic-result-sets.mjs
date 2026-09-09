import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Where to put results that don't fit a POCO */
const ResultShapes = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">When a POCO isn’t the answer</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Somewhere to put an ad-hoc result</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          A one-off projection, a report, a join across three tables - none of these deserve a class of their own.
          These options are ordered from most typed to most dynamic.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="s in shapes" :key="s.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', s.accent]">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{s.name}}</div>
            <span :class="['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', s.tint]">{{s.typing}}</span>
          </div>
          <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] leading-5 text-emerald-300 dark:bg-black/50">{{s.code}}</code>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const typed = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
        const loose = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
        const plain = 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
        const shapes = [
            { name:'Value tuples', typing:'typed', tint:typed, accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              code:'db.Select<(int id, string name)>(sql)',
              text:'Named, compile-checked fields with no class to declare. The best default for a one-off shape.' },
            { name:'A custom POCO', typing:'typed', tint:typed, accent:plain,
              code:'db.Select<OrderSummary>(q)',
              text:'Worth declaring once the same projection appears in more than one place.' },
            { name:'Dictionary', typing:'dynamic', tint:loose, accent:plain,
              code:'db.Dictionary<int,string>(sql)',
              text:'Two columns as key/value pairs - ids to names, codes to labels.' },
            { name:'List<object[]>', typing:'dynamic', tint:loose, accent:plain,
              code:'db.SqlList<List<object>>(sql)',
              text:'Rows as positional values, when the columns aren’t known until runtime.' },
            { name:'Dictionary rows', typing:'dynamic', tint:loose, accent:plain,
              code:'db.SqlList<Dictionary<string,object>>(sql)',
              text:'Each row keyed by column name - handy for generic tooling and exports.' },
            { name:'Multiple tables', typing:'typed', tint:typed, accent:plain,
              code:'db.SelectMulti<T1,T2,T3>(q)',
              text:'A joined query returning each row already split back into its own typed POCOs.' },
        ]
        return { shapes }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, ResultShapes }
}
