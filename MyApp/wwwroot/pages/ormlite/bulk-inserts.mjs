import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** One API, each RDBMS's fastest native import path */
const BulkPaths = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One call, six implementations</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">What <code class="rounded bg-slate-100 px-1.5 py-0.5 text-2xl dark:bg-slate-800">db.BulkInsert()</code> actually does</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          It resolves to the fastest import each database offers, so you get the native path without writing against it
          - and switching database doesn’t change the calling code.
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="db in databases" :key="db.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="'background:' + db.color"></span>
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{db.name}}</div>
          </div>
          <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] leading-5 text-emerald-300 dark:bg-black/50">{{db.mechanism}}</code>
          <p class="mt-2.5 flex-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{{db.text}}</p>
        </div>
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        <div v-for="c in config" :key="c.name"
             class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40">
          <code class="text-sm font-bold text-slate-900 dark:text-white">{{c.name}}</code>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{c.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const databases = [
            { name:'PostgreSQL', color:'#336791', mechanism:'COPY (binary)', text:'Npgsql’s Binary Copy import - the fastest path Postgres has.' },
            { name:'SQL Server', color:'#cc2927', mechanism:'SqlBulkCopy', text:'Imports rows written into an in-memory DataTable.' },
            { name:'MySQL', color:'#00758f', mechanism:'MySqlBulkLoader', text:'Writes a temporary CSV file that the loader imports directly.' },
            { name:'MySqlConnector', color:'#00758f', mechanism:'MySqlBulkLoader + SourceStream', text:'Streams the data instead, avoiding the temporary file entirely.' },
            { name:'SQLite', color:'#0f80cc', mechanism:'Batched multi-row INSERT', text:'SQLite has no import feature, so batches reduce I/O calls instead.' },
            { name:'Firebird', color:'#f28d3c', mechanism:'EXECUTE BLOCK', text:'Multi-row inserts inside a block, up to Firebird’s 256-statement maximum.' },
        ]
        const config = [
            { name:'Mode = BulkInsertMode.Sql', text:'Force portable multi-row INSERTs everywhere instead of the native path. Values are inlined rather than parameterized, which is how a large statement avoids the RDBMS max-parameter limit.' },
            { name:'BatchSize = 1000', text:'Rows per statement. 1000 is the default and SQL Server’s maximum; Firebird caps at 256; other databases can go higher.' },
        ]
        return { databases, config }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, BulkPaths }
}
