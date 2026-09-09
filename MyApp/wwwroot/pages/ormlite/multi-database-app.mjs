import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** How a named connection is registered and reached */
const NamedConnections = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One factory, many databases</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Working across several databases</h3>

      <div class="mt-7 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div class="rounded-2xl border-2 border-indigo-500/40 bg-white p-5 shadow-lg shadow-indigo-500/10 dark:bg-slate-900">
          <code class="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">IDbConnectionFactory</code>
          <p class="mt-2.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
            One registration holds the default connection plus any number of named ones - each with its own connection
            string <b class="text-slate-900 dark:text-white">and its own dialect</b>, so they need not be the same RDBMS.
          </p>
        </div>
        <div class="flex items-center justify-center text-2xl text-indigo-400" aria-hidden="true">
          <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
        </div>
        <div class="grid gap-2.5">
          <div v-for="c in connections" :key="c.name"
               :class="['rounded-xl border p-4 shadow-sm', c.accent]">
            <code class="text-sm font-bold text-slate-900 dark:text-white">{{c.name}}</code>
            <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{{c.text}}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-3">
        <div v-for="u in uses" :key="u.name"
             class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-sm font-bold text-slate-900 dark:text-white">{{u.name}}</div>
          <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{u.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const connections = [
            { name:'db = OpenDbConnection()', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'The default connection - what every OrmLite API uses when you don’t say otherwise.' },
            { name:'OpenDbConnection("reporting")', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'A named connection, registered up front with RegisterConnection.' },
            { name:'[NamedConnection("reporting")]', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Attach the name to a Data Model so its queries always go to the right database.' },
        ]
        const uses = [
            { name:'Separation of concerns', text:'Keep reporting, auditing or archive data out of the transactional database.' },
            { name:'Mixed RDBMS', text:'A Postgres primary alongside a SQLite cache or a legacy SQL Server - one API over both.' },
            { name:'Multi-tenancy', text:'Route a request to a tenant’s own database at runtime.' },
        ]
        return { connections, uses }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, NamedConnections }
}
