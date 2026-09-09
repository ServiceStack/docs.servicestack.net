import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import CopyBlock from "../components/CopyBlock.mjs"

/** Which package for which database, and which ADO.NET driver it uses */
const ProviderPackages = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One package per RDBMS</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Pick your provider</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Install the package for your database and the typed API is identical across all of them. Where a database has
          two options, the difference is which ADO.NET driver it wraps.
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="db in databases" :key="db.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2.5">
            <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="'background:' + db.color"></span>
            <div class="font-bold text-slate-900 dark:text-white">{{db.name}}</div>
          </div>
          <div class="mt-3 space-y-2.5">
            <div v-for="pkg in db.packages" :key="pkg.id"
                 :class="['rounded-xl border p-3', pkg.recommended
                   ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20'
                   : 'border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-800/40']">
              <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                <code class="min-w-0 break-words text-[11px] font-bold text-slate-900 dark:text-white">{{pkg.id}}</code>
                <span v-if="pkg.recommended" class="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">preferred</span>
              </div>
              <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{{pkg.text}}</p>
            </div>
          </div>
        </div>
      </div>

      <p class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        All providers support <b class="text-slate-900 dark:text-white">.NET 6+</b>, .NET Framework <b class="text-slate-900 dark:text-white">v4.7.2+</b>
        and .NET Standard 2.0. The two marked <i>Apple Silicon/ARM</i> use Microsoft’s newer drivers, which is what makes
        them the right default on a modern machine.
      </p>
    </section>`,
    setup() {
        const databases = [
            { name:'PostgreSQL', color:'#336791', packages:[
                { id:'ServiceStack.OrmLite.PostgreSQL', recommended:true, text:'The single Postgres provider - nothing to choose between.' },
              ] },
            { name:'SQL Server', color:'#cc2927', packages:[
                { id:'ServiceStack.OrmLite.SqlServer.Data', recommended:true, text:'Microsoft.Data.SqlClient - the actively developed driver. Supports Apple Silicon/ARM.' },
                { id:'ServiceStack.OrmLite.SqlServer', text:'System.Data.SqlClient - the older driver, for existing projects already on it.' },
              ] },
            { name:'MySQL', color:'#00758f', packages:[
                { id:'ServiceStack.OrmLite.MySql', text:'MySql.Data - Oracle’s official connector.' },
                { id:'ServiceStack.OrmLite.MySqlConnector', text:'MySqlConnector - an independent, fully async connector.' },
              ] },
            { name:'SQLite', color:'#0f80cc', packages:[
                { id:'ServiceStack.OrmLite.Sqlite.Data', recommended:true, text:'Microsoft.Data.Sqlite. Supports Apple Silicon/ARM.' },
                { id:'ServiceStack.OrmLite.Sqlite', text:'The classic System.Data.SQLite-based provider.' },
              ] },
        ]
        return { databases }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, CopyBlock, ProviderPackages }
}
