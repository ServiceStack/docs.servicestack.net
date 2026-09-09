import { computed, ref } from "vue"
import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Typed expression vs explicit path - when to use which */
const JsonApiChoice = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div v-for="a in apis" :key="a.name"
           :class="['flex flex-col rounded-2xl border-2 p-5 shadow-sm', a.accent]">
        <div class="flex items-start justify-between gap-3">
          <code class="min-w-0 break-words text-base font-bold text-slate-900 dark:text-white">{{a.name}}</code>
          <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', a.tint]">{{a.badge}}</span>
        </div>
        <pre class="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] leading-5 text-slate-200 dark:bg-black/50"><code class="nohighlight">{{a.code}}</code></pre>
        <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{a.text}}</p>
        <p class="mt-3 border-t border-black/5 pt-2.5 text-xs leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400">
          <b class="text-slate-700 dark:text-slate-200">Use when:</b> {{a.when}}
        </p>
      </div>
    </section>`,
    setup() {
        const apis = [
            { name:'Sql.Json<T>()', badge:'preferred',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              code:'Sql.Json<OrderDocument>(x.Data)\n   .Customer.Address.State == "WA"',
              text:'Ordinary C# member access, collection membership and array indexes, translated into each database’s native JSON functions.',
              when:'The document has a C# Data Model - so a rename refactors the query with it.' },
            { name:'Sql.JsonValue / JsonQuery', badge:'dynamic',
              tint:'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              code:'Sql.JsonValue<string>(x.Data,\n  "$.Customer.Address.state") == "WA"',
              text:'An explicit SQL/JSON path, evaluated at runtime.',
              when:'There is no Data Model, the path is chosen at runtime, or you need path existence and type inspection.' },
        ]
        return { apis }
    }
}

/** Version requirements and the one operation that isn't universal */
const JsonSupport = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Portable, with one exception</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">What each database needs</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="db in databases" :key="db.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="'background:' + db.color"></span>
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{db.name}}</div>
          </div>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Recommended</div>
          <div class="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">{{db.version}}</div>
          <p class="mt-2 flex-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{{db.note}}</p>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Every operation works on all four except <code>Sql.JsonContains()</code></b>,
        which needs PostgreSQL or MySQL. Calling an unsupported one throws
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">NotSupportedException</code> while the
        expression is being built - rather than emitting SQL that quietly means something else.
      </p>
    </section>`,
    setup() {
        const databases = [
            { name:'SQLite', color:'#0f80cc', version:'Current, with JSON', note:'Uses SQLite’s built-in json_* functions.' },
            { name:'PostgreSQL', color:'#336791', version:'16+', note:'IS JSON for validation; jsonb and SQL/JSON paths elsewhere.' },
            { name:'SQL Server', color:'#cc2927', version:'2022+', note:'JsonExists() and full value validation need 2022; 2016-2019 support the rest.' },
            { name:'MySQL', color:'#00758f', version:'8.0+', note:'Uses MySQL’s native JSON_* functions.' },
        ]
        return { databases }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, JsonApiChoice, JsonSupport }
}
