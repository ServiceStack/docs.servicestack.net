/**
 * Grid of the native full-text engine each RDBMS uses for Website Search.
 *
 *   <SearchEngineMatrix eyebrow="…" title="…" description="…" :databases="[{
 *      name:'SQLite', color:'#0f80cc', engine:'FTS5 virtual table',
 *      status:'sqlite-fts5', fallback:'sqlite-like', text:'…' }]" footnote="…" />
 *
 * `status` and `fallback` are optional - omit them for a marketing-level summary,
 * include them where the reference docs need the provider names Search reports.
 */
const defaultDatabases = [
    { name:'SQLite', color:'#0f80cc', engine:'FTS5 virtual table',
      text:'Full-text search with zero setup - ideal for docs sites and single-server deployments.' },
    { name:'PostgreSQL', color:'#336791', engine:'GIN index over to_tsvector',
      text:'Language-aware indexing that scales with the rest of your Postgres workload.' },
    { name:'SQL Server', color:'#cc2927', engine:'Full-Text Catalog + CONTAINSTABLE',
      text:'Uses the engine your DBAs already operate, backed up and monitored like every other index.' },
    { name:'MySQL / MariaDB', color:'#00758f', engine:'FULLTEXT index in Boolean mode',
      text:'Boolean-mode matching that supports required terms and prefix queries out of the box.' },
]

export default {
    props: {
        eyebrow: { type: String, default: 'No search infrastructure' },
        title: { type: String, default: 'Search runs on the database you already have' },
        description: { type: String, default: 'Documents are split into heading-aware sections and queried through each RDBMS’s own full-text engine - no separate search service to run, no index to host and no per-query bill.' },
        databases: { type: Array, default: () => defaultDatabases },
        footnote: { type: String, default: '<b class="text-slate-900 dark:text-white">Always available:</b> each provider falls back to a bounded <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">LIKE</code> query when its full-text feature isn’t enabled, so Search keeps working on any supported database without extra infrastructure.' },
        /** Grid columns at lg - 4 for the compact set, 2 when cards carry status/fallback names */
        columns: { type: Number, default: 4 },
    },
    methods: {
        /** `status`/`fallback` accept a string or a list, so one card can cover MySQL and MariaDB */
        list(value) {
            return value == null ? [] : (Array.isArray(value) ? value : [value])
        },
    },
    template: `
    <section class="not-prose my-10">
      <div v-if="eyebrow || title || description" class="mb-6">
        <p v-if="eyebrow" class="text-xs font-bold uppercase tracking-[.18em] text-emerald-600 dark:text-emerald-400">{{eyebrow}}</p>
        <h3 v-if="title" class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{{title}}</h3>
        <p v-if="description" class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">{{description}}</p>
      </div>
      <div :class="['grid gap-3 sm:grid-cols-2', columns <= 2 ? 'lg:grid-cols-2' : columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4']">
        <div v-for="db in databases" :key="db.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-600">
          <div class="flex items-center gap-2">
            <span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="'background:' + db.color"></span>
            <div class="font-bold text-slate-900 dark:text-white">{{db.name}}</div>
          </div>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Native engine</div>
          <code class="mt-1.5 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] leading-5 text-emerald-300 dark:bg-black/50">{{db.engine}}</code>
          <p v-if="db.text" class="mt-3 flex-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{{db.text}}</p>
          <dl v-if="db.status" class="mt-3 space-y-2 border-t border-slate-100 pt-3 text-[11px] dark:border-slate-800">
            <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <dt class="w-16 shrink-0 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Active</dt>
              <dd class="flex flex-wrap gap-1.5">
                <code v-for="s in list(db.status)" :key="s"
                      class="whitespace-nowrap rounded bg-emerald-50 px-1.5 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">{{s}}</code>
              </dd>
            </div>
            <div v-if="db.fallback" class="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <dt class="w-16 shrink-0 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Fallback</dt>
              <dd class="flex flex-wrap gap-1.5">
                <code v-for="s in list(db.fallback)" :key="s"
                      class="whitespace-nowrap rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">{{s}}</code>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <p v-if="footnote" class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300" v-html="footnote"></p>
    </section>`,
}
