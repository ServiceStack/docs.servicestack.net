import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Postgres types OrmLite maps natively */
const PostgresExtras = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Beyond the portable API</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">PostgreSQL-specific capabilities</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          These map real Postgres types onto ordinary C# properties, so a feature you’d normally reach for raw SQL to
          use stays inside the typed API. Using them ties that model to Postgres.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="f in features" :key="f.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{f.icon}}</span>
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{f.name}}</div>
          </div>
          <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] leading-5 text-emerald-300 dark:bg-black/50">{{f.maps}}</code>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{f.text}}</p>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        For JSON specifically, prefer the <a href="/ormlite/json" class="font-semibold text-indigo-600 underline decoration-dotted dark:text-indigo-400">portable JSON API</a>
        unless you need something only Postgres offers - it gives you the same typed queries across four databases.
      </p>
    </section>`,
    setup() {
        const features = [
            { icon:'📚', name:'Arrays', maps:'string[] · int[] · Guid[]', text:'A .NET array maps to a real Postgres array column, not a serialized blob - so it stays queryable.' },
            { icon:'🗂', name:'Hstore', maps:'Dictionary<string,string>', text:'Key/value pairs stored in a native hstore column.' },
            { icon:'{ }', name:'JSON and JSONB', maps:'[PgSqlJson] · [PgSqlJsonB]', text:'Store a complex property as native json or jsonb rather than text.' },
            { icon:'🎛', name:'Postgres params', maps:'Sql.* extensions', text:'Reach Postgres-specific operators and functions from within a typed expression.' },
        ]
        return { features }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, PostgresExtras }
}
