import Screenshot from "../../components/Screenshot.mjs"
import ScreenshotsGallery from "../../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../../components/ScreenshotsGalleryView.mjs"

/** What each query API returns */
const SelectShapes = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">The name tells you the shape</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">What each query API returns</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Pick the API by the shape you want back, then filter it however you like - all of them take a lambda, a
          SqlExpression or raw SQL.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="a in apis" :key="a.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-start justify-between gap-2">
            <code class="min-w-0 break-words text-sm font-bold text-slate-900 dark:text-white">{{a.name}}</code>
            <code class="shrink-0 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{{a.returns}}</code>
          </div>
          <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{a.text}}</p>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        <b class="text-slate-900 dark:text-white">The POCO you select into needn’t be the one that built the query.</b>
        Project into a smaller type holding just the fields you want and OrmLite maps by name - no extra mapping
        configuration, and no columns fetched that you won’t use.
      </p>
    </section>`,
    setup() {
        const apis = [
            { name:'Select<T>()', returns:'List<T>', text:'Every matching row. The workhorse.' },
            { name:'Single<T>()', returns:'T', text:'One row, or null when nothing matches.' },
            { name:'SingleById<T>()', returns:'T', text:'One row by primary key - the most common lookup there is.' },
            { name:'Scalar<T>()', returns:'T', text:'A single value from a single column - a count, a max, one field.' },
            { name:'Column<T>()', returns:'List<T>', text:'One column across many rows, e.g. a list of ids.' },
            { name:'Count<T>()', returns:'long', text:'How many rows match, without fetching any of them.' },
            { name:'Exists<T>()', returns:'bool', text:'Whether anything matches - cheaper than counting.' },
            { name:'Dictionary<K,V>()', returns:'Dictionary', text:'Two columns as key/value pairs.' },
            { name:'Lookup<K,V>()', returns:'Dictionary<K,List<V>>', text:'Grouped values keyed by the first column.' },
        ]
        return { apis }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, SelectShapes }
}
