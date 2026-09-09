import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** The path from installed package to first query */
const FirstQueryPath = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Four things to set up</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">From an installed package to your first query</h3>

      <div class="mt-7 grid gap-3 sm:grid-cols-2">
        <div v-for="(s,i) in steps" :key="s.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', s.accent]">
          <div class="flex items-center gap-2.5">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">{{i+1}}</span>
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{s.name}}</div>
          </div>
          <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] leading-5 text-emerald-300 dark:bg-black/50">{{s.code}}</code>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">There is no mapping step.</b> No configuration class, no fluent
        mapping file, no attributes needed - the POCO is the schema, and the connection factory is the only thing you
        register.
      </p>
    </section>`,
    setup() {
        const steps = [
            { name:'A connection factory', code:'new OrmLiteConnectionFactory(connStr,\n    SqliteDialect.Provider)',
              accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'The connection string plus the dialect for your RDBMS. Register it once in your IOC.' },
            { name:'A connection', code:'using var db = dbFactory.Open();',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'An ordinary IDbConnection. Every OrmLite API is an extension method on it.' },
            { name:'A table', code:'db.CreateTableIfNotExists<Customer>();',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Created from the POCO itself, so the class and the schema can’t drift apart.' },
            { name:'A query', code:'db.Select<Customer>(x => x.Age > 40)',
              accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Typed, checked by the compiler, and producing SQL you could have predicted.' },
        ]
        return { steps }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, FirstQueryPath }
}
