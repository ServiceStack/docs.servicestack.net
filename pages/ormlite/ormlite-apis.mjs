import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** How to read an OrmLite method name */
const ApiNaming = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Guess the method, be right</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">How an OrmLite API name is built</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        Everything hangs off <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">IDbConnection</code>
        as an extension method, so the whole surface is discoverable from <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">db.</code>
        in your editor. The names follow a pattern rather than a vocabulary you have to memorize.
      </p>

      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="part in parts" :key="part.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', part.accent]">
          <div class="font-bold text-slate-900 dark:text-white">{{part.name}}</div>
          <p class="mt-1.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{part.text}}</p>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <code v-for="ex in part.examples" :key="ex"
                  class="rounded bg-white/80 px-2 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-black/5 dark:bg-slate-900/70 dark:text-slate-300 dark:ring-white/10">{{ex}}</code>
          </div>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Every one of these has an <code>*Async</code> twin.</b>
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">SelectAsync</code>,
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">SingleByIdAsync</code>,
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">SaveAllAsync</code> - same name, same
        arguments, plus an optional CancellationToken.
      </p>
    </section>`,
    setup() {
        const parts = [
            { name:'The verb', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'What the statement does. Maps to the SQL you would have written by hand.',
              examples:['Select','Insert','Update','Delete','Save'] },
            { name:'How many', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Whether you get a list, exactly one row, or a single value.',
              examples:['Select','Single','Scalar','Column','Count'] },
            { name:'The suffix', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'How the row is found, or how many rows are affected.',
              examples:['ById','ByIds','All','Only','Where'] },
            { name:'The escape hatch', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Sql* APIs run custom SQL that isn’t a SELECT - stored procedures included - and still map to POCOs.',
              examples:['SqlList','SqlScalar','SqlColumn','ExecuteSql'] },
        ]
        return { parts }
    }
}

/** Three ways to express the same query */
const QueryStyles = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Same API, three levels of control</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Ways to express a query</h3>
      </div>
      <div class="grid gap-3 lg:grid-cols-3">
        <div v-for="s in styles" :key="s.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', s.accent]">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{s.name}}</div>
            <span :class="['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', s.tint]">{{s.level}}</span>
          </div>
          <div class="mt-3 whitespace-pre-wrap break-words rounded-lg bg-slate-900 p-3 font-mono text-[11px] leading-5 text-slate-200 dark:bg-black/50">{{s.code}}</div>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        <b class="text-slate-900 dark:text-white">If your SQL doesn’t start with SELECT, it’s treated as a WHERE clause</b> -
        which is why the first two forms above produce identical SQL. Mixing styles in the same codebase is normal:
        reach for the typed expression by default and drop down only where it earns it.
      </p>
    </section>`,
    setup() {
        const styles = [
            { name:'Lambda expression', level:'typed', tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/25',
              code:'db.Select<Author>(x =>\n    x.Earnings <= 50)',
              text:'Refactor-safe and checked by the compiler. The default choice for most queries.' },
            { name:'SqlExpression', level:'composable', tint:'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              code:'db.From<Author>()\n  .Where(x => x.City == "London")\n  .OrderBy(x => x.Name)\n  .Take(20)',
              text:'Build a query up in pieces - conditionally, across methods - then execute it.' },
            { name:'Raw SQL', level:'full control', tint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              code:'db.Select<Track>(\n  "Artist = @artist",\n  new { artist = "Nirvana" })',
              text:'When the typed API isn’t the right tool. Results still map into POCOs.' },
        ]
        return { styles }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, ApiNaming, QueryStyles }
}
