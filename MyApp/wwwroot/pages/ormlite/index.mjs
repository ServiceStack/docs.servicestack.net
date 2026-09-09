import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** The design principle everything else follows from */
const OneClassOneTable = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">No surprises, no hidden behavior</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">1 Class = 1 Table</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        A POCO maps to a table by convention, with no attributes required and no mapping configuration to maintain.
        That single decision is what makes the generated SQL predictable.
      </p>

      <div class="mt-7 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Your POCO</div>
          <pre class="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] leading-5 text-slate-200 dark:bg-black/50"><code class="nohighlight">public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; }
    public Address Address { get; set; }
}</code></pre>
        </div>
        <div class="flex flex-col items-center justify-center gap-1.5 text-center">
          <span class="text-2xl text-indigo-400" aria-hidden="true"><span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span></span>
          <span class="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">by convention</span>
        </div>
        <div class="rounded-2xl border-2 border-indigo-400/50 bg-indigo-50/40 p-5 shadow-sm dark:border-indigo-800 dark:bg-indigo-950/25">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">The table</div>
          <div class="mt-2 space-y-1.5">
            <div v-for="col in cols" :key="col.name"
                 class="flex items-baseline justify-between gap-3 rounded-lg bg-white px-3 py-1.5 ring-1 ring-indigo-100 dark:bg-slate-900 dark:ring-indigo-900">
              <code class="text-xs font-bold text-slate-900 dark:text-white">{{col.name}}</code>
              <span class="text-[11px] text-slate-500 dark:text-slate-400">{{col.note}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-3">
        <div v-for="p in principles" :key="p.name"
             class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-sm font-bold text-slate-900 dark:text-white">{{p.name}}</div>
          <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{p.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const cols = [
            { name:'Id', note:'primary key by convention' },
            { name:'Name', note:'scalar column' },
            { name:'Address', note:'text blobbed' },
        ]
        const principles = [
            { name:'No attributes required', text:'Attributes exist to override the convention, not to establish it.' },
            { name:'Query shape ≠ result shape', text:'The POCO you select into can differ from the one that built the query - map only the fields you want.' },
            { name:'Complex types blob', text:'Any non-scalar property is serialized into a schema-less text field by a pluggable serializer.' },
        ]
        return { cols, principles }
    }
}

/** What OrmLite deliberately is, and is not */
const DesignGoals = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">A micro ORM, on purpose</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">What OrmLite optimizes for</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="g in goals" :key="g.name"
             class="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg dark:bg-slate-800">{{g.icon}}</span>
          <div class="min-w-0 flex-1">
            <div class="font-bold text-slate-900 dark:text-white">{{g.name}}</div>
            <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{g.text}}</p>
          </div>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        The thing it deliberately avoids is a heavy ORM’s <b class="text-slate-900 dark:text-white">implicit behavior</b> -
        surprise N+1 queries, lazy-loaded graphs and leaky data access that only shows up under load.
      </p>
    </section>`,
    setup() {
        const goals = [
            { icon:'🪶', name:'Light-weight', text:'A set of C# extension methods over .NET’s implementation-agnostic System.Data interfaces - not a framework that owns your data layer.' },
            { icon:'🔍', name:'Predictable SQL', text:'It stays obvious what SQL runs and when, so you can reason about a query by reading the code that built it.' },
            { icon:'⚡', name:'High performance', text:'Among the fastest micro ORMs for .NET, with support for indexes, text blobs and bulk operations.' },
            { icon:'🔓', name:'An escape hatch', text:'Full access to IDbCommand and raw SQL whenever the typed API isn’t the right tool.' },
            { icon:'🗄', name:'RDBMS-agnostic', text:'One typed API across SQL Server, PostgreSQL, MySQL, SQLite and Firebird.' },
            { icon:'🧱', name:'Schema from POCOs', text:'Create and drop table schemas from class definitions alone - no migrations DSL to learn first.' },
        ]
        return { goals }
    }
}

/** The documentation, arranged by what you're trying to do */
const OrmliteDocMap = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Where to go next</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">The OrmLite documentation</h3>
      </div>

      <div v-for="stage in stages" :key="stage.name" class="mb-4 last:mb-0">
        <div class="mb-2 flex items-center gap-3">
          <span :class="['flex h-7 items-center rounded-lg px-2.5 text-[11px] font-black uppercase tracking-wider', stage.tint]">{{stage.name}}</span>
          <span class="text-sm text-slate-500 dark:text-slate-400">{{stage.caption}}</span>
        </div>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a v-for="doc in stage.docs" :key="doc.title" :href="doc.href"
             class="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
            <div class="font-bold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{{doc.title}}</div>
            <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{doc.text}}</p>
          </a>
        </div>
      </div>
    </section>`,
    setup() {
        const stages = [
            { name:'Start', caption:'Install a provider and run your first query',
              tint:'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              docs:[
                { title:'Installation', href:'/ormlite/installation', text:'The NuGet package for each RDBMS and the frameworks it supports.' },
                { title:'Getting Started', href:'/ormlite/getting-started', text:'Connections, creating tables and the core query APIs end to end.' },
                { title:'API Overview', href:'/ormlite/ormlite-apis', text:'The shape of the API surface and how the methods are named.' },
              ] },
            { name:'Query', caption:'Read and write data',
              tint:'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
              docs:[
                { title:'Select APIs', href:'/ormlite/apis/select', text:'Typed SqlExpression queries, filters, paging and projections.' },
                { title:'Insert APIs', href:'/ormlite/apis/insert', text:'Inserting rows, returning identities and selective fields.' },
                { title:'Update APIs', href:'/ormlite/apis/update', text:'Full and partial updates, and update expressions.' },
                { title:'Delete APIs', href:'/ormlite/apis/delete', text:'Deleting by id, by filter or by expression.' },
                { title:'Upsert', href:'/ormlite/upsert', text:'Insert-or-update in a single native statement.' },
                { title:'Async APIs', href:'/ormlite/async-apis', text:'The async equivalent of every data API.' },
              ] },
            { name:'Model', caption:'Shape your schema and its types',
              tint:'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              docs:[
                { title:'Schema APIs', href:'/ormlite/apis/schema', text:'Creating and dropping tables, indexes and constraints from POCOs.' },
                { title:'Reference Support', href:'/ormlite/reference-support', text:'POCO-friendly references for persisting related models.' },
                { title:'Typed Joins', href:'/ormlite/typed-joins', text:'Multi-table join expressions that stay strongly typed.' },
                { title:'Type Converters', href:'/ormlite/type-converters', text:'Control how a .NET type maps to a column in each RDBMS.' },
                { title:'Complex Type Serializers', href:'/ormlite/complex-type-serializers', text:'Choose the serializer used for blobbed properties.' },
                { title:'DB Migrations', href:'/ormlite/db-migrations', text:'Versioned, ordered schema changes with up and down steps.' },
              ] },
            { name:'Go further', caption:'When the typed API isn’t enough',
              tint:'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              docs:[
                { title:'Custom SQL', href:'/ormlite/custom-sql', text:'Drop to raw SQL and still map results into POCOs.' },
                { title:'SQL Customizations', href:'/ormlite/customized-sql-features', text:'Hook into how OrmLite generates its SQL.' },
                { title:'Dynamic Result Sets', href:'/ormlite/dynamic-result-sets', text:'Query into tuples, dictionaries and anonymous shapes.' },
                { title:'JSON Support', href:'/ormlite/json', text:'Typed, portable queries over JSON columns.' },
                { title:'Bulk Inserts', href:'/ormlite/bulk-inserts', text:'Native bulk paths for loading many rows at once.' },
                { title:'Transactions', href:'/ormlite/transactions', text:'Scoping work to a transaction, including across async calls.' },
              ] },
            { name:'Operate', caption:'Run it in production',
              tint:'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
              docs:[
                { title:'Logging & Introspection', href:'/ormlite/introspection', text:'See the SQL and parameters a query actually produced.' },
                { title:'Multiple App Databases', href:'/ormlite/multi-database-app', text:'Named connections and working across several databases.' },
                { title:'Scalable SQLite', href:'/ormlite/scalable-sqlite', text:'How far SQLite goes, and how to configure it to get there.' },
                { title:'Litestream', href:'/ormlite/litestream', text:'Continuous replication and point-in-time recovery for SQLite.' },
                { title:'Optimistic Concurrency', href:'/ormlite/optimistic-concurrency', text:'RowVersion conflict detection on updates.' },
                { title:'Limitations', href:'/ormlite/limitations', text:'What OrmLite deliberately doesn’t do - worth reading early.' },
              ] },
        ]
        return { stages }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, OneClassOneTable, DesignGoals, OrmliteDocMap }
}
