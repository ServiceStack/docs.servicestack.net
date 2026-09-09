import { computed, ref } from "vue"
import AudioPlayer from "../podcasts/AudioPlayer.mjs"
import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import WorkflowShowcase from "../components/WorkflowShowcase.mjs"
import FeaturePillars from "../components/FeaturePillars.mjs"
import FeatureMatrix from "../components/FeatureMatrix.mjs"
import CodeCompare from "../components/CodeCompare.mjs"
import GeminiPipeline from "../components/GeminiPipeline.mjs"
import SearchEngineMatrix from "../components/SearchEngineMatrix.mjs"

/** Top-of-page index of everything in this release */
const ReleaseHighlights = {
    template:`
      <section class="not-prose my-10">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a v-for="item in items" :key="item.title" :href="item.href"
             class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-black text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">{{item.icon}}</span>
              <div class="text-xs font-bold uppercase tracking-[.16em] text-indigo-600 dark:text-indigo-400">{{item.eyebrow}}</div>
            </div>
            <h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">{{item.title}}</h3>
            <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{item.text}}</p>
            <div class="mt-4 text-sm font-semibold text-indigo-600 transition group-hover:translate-x-1 dark:text-indigo-400">Read more →</div>
          </a>
        </div>
      </section>`,
    setup() {
        const items = [
            { icon:'◈', eyebrow:'Gemini RAG', title:'Knowledge Bases you own', href:'#gemini-rag-knowledge-bases-website-search-and-assistants',
              text:'Import files, folders and entire websites into managed, metadata-rich File Stores that can be previewed, re-synced and audited - with the catalogue in your own database.' },
            { icon:'💬', eyebrow:'One script tag', title:'Website Assistants', href:'#publish-a-website-assistant-with-one-script-tag',
              text:'Publish a branded AI support experience on any site, grounded in approved content with citations customers can open and verify.' },
            { icon:'⌘K', eyebrow:'Zero model usage', title:'Website Search', href:'#publish-site-search-that-costs-nothing-per-query',
              text:'Instant documentation search from the same documents, answered by your App’s own RDBMS - no search service to host and no per-query bill.' },
            { icon:'📈', eyebrow:'First-party data', title:'Search & Site Analytics', href:'#understand-what-visitors-are-looking-for',
              text:'See what customers search for and what returns nothing, with optional cookie-free website analytics that never leave your database.' },
            { icon:'{}', eyebrow:'OrmLite', title:'Typed JSON Queries', href:'#portable-type-safe-json-queries',
              text:'Query JSON columns with the same typed SqlExpression<T> you already use - one C# query that runs on SQLite, PostgreSQL, SQL Server and MySQL.' },
            { icon:'⇅', eyebrow:'OrmLite', title:'Native Upsert APIs', href:'#native-upsert-apis',
              text:'Insert-or-update in a single native statement: no extra existence query and no race between checking for a row and writing it.' },
            { icon:'↻', eyebrow:'Development', title:'Startup Tasks', href:'#development-startup-tasks',
              text:'Automate development-time work on every App restart - starting with client DTOs and PDF models that stay in sync by themselves.' },
            { icon:'ID', eyebrow:'AI Chat', title:'ServiceStack Auth support', href:'#ai-chat-now-supports-servicestack-auth',
              text:'AI Chat now signs in against ServiceStack Auth as well as Identity Auth - adopting it no longer implies migrating your existing users.' },
            { icon:'🔒', eyebrow:'Every package', title:'Hardened ServiceStack', href:'#hardened-servicestack',
              text:'A codebase-wide security and reliability audit, with every fix published in per-package reports your security team can review.' },
        ]
        return { items }
    }
}


/** The repeatable knowledge lifecycle */
const GeminiWorkflow = {
    components: { WorkflowShowcase },
    template: `<WorkflowShowcase eyebrow="A repeatable content supply chain" title="From existing content to answers customers can verify" :steps="steps" />`,
    setup() {
        const steps = [
            { name:'Import', caption:'Files, folders, websites', title:'Bring content in the way that suits each source', tags:['ZIP & folders','Web crawl','Resumable'],
              description:'Upload files and ZIPs, synchronize a maintained documentation folder, or crawl a site into a private Markdown workspace you can inspect and clean before anything is sent to Gemini. Pending uploads survive App restarts and continue from the local catalogue.' },
            { name:'Preview', caption:'Before anything changes', title:'See exactly what an import will do', tags:['New / changed','Metadata-only','Removed'],
              description:'Folder and website imports are previewed first, identifying new, changed, metadata-only, unchanged and removed documents. Embedding work and destructive changes are visible before they are applied - and unchanged documents are never re-embedded.' },
            { name:'Curate', caption:'Metadata & Explorer', title:'Make retrieval precise instead of merely large', tags:['Category & status','Locale & version','Coverage reports'],
              description:'Every document carries category, type, status, locale, product, versions, tags and a canonical Source URL. The Explorer turns that metadata into navigable categories, filters and coverage reports - and the same server-generated filter is what Gemini File Search receives.' },
            { name:'Publish', caption:'Assistant + Search', title:'Two public experiences, one script tag each', tags:['Shadow DOM','Server-enforced','Branded'],
              description:'Publish a citation-backed Website Assistant and a model-free Website Search from the same curated documents. Retrieval rules, private prompts, model choice, allowed origins and rate limits stay on the server where the host page cannot weaken them.' },
            { name:'Learn', caption:'Searches & conversations', title:'Close the loop with what customers actually ask', tags:['No-result searches','Conversation review','Gaps'],
              description:'No-result searches point straight at the documentation you have not written yet, and retained Assistant conversations show how well the answers held up. Improve the source material and the next synchronized import improves every experience grounded in it.' },
        ]
        return { steps }
    }
}

/** Assistant vs Search - two experiences from the same documents */
const TwoExperiences = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Same documents, two jobs</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Choose the experience each visitor needs - or ship both</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          They can share a page: Search keeps <kbd class="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-800">⌘K</kbd>
          and the Assistant automatically moves to <kbd class="rounded bg-slate-100 px-1 font-mono text-xs dark:bg-slate-800">⌘⇧K</kbd>.<!---->
        </p>
      </div>
      <div class="grid gap-px bg-slate-200 dark:bg-slate-700 sm:grid-cols-2">
        <div v-for="col in columns" :key="col.name" class="bg-white p-6 dark:bg-slate-900 sm:p-8">
          <div class="flex items-center gap-3">
            <span :class="['flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black', col.tint]">{{col.icon}}</span>
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white">{{col.name}}</div>
              <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{col.tagline}}</div>
            </div>
          </div>
          <dl class="mt-6 space-y-3">
            <div v-for="row in col.rows" :key="row.label" class="flex items-baseline justify-between gap-4 border-b border-dashed border-slate-200 pb-3 dark:border-slate-700">
              <dt class="shrink-0 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{row.label}}</dt>
              <dd class="text-right text-sm font-semibold text-slate-800 dark:text-slate-200">{{row.value}}</dd>
            </div>
          </dl>
          <p class="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{col.summary}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const columns = [
            { icon:'💬', name:'Website Assistant', tagline:'Grounded answers', tint:'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300',
              rows:[
                { label:'Answered by', value:'Gemini, grounded in your index' },
                { label:'Returns', value:'Written answer + citations' },
                { label:'Per-query cost', value:'Gemini usage' },
                { label:'Best for', value:'“Why doesn’t this work?”' },
                { label:'Scope', value:'Server-enforced metadata filter' },
              ],
              summary:'For questions whose answer is spread across several documents, or isn’t written down as a single page. Every claim keeps the sources behind it, so readers can check the evidence instead of trusting the model.' },
            { icon:'⌘K', name:'Website Search', tagline:'Instant navigation', tint:'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300',
              rows:[
                { label:'Answered by', value:'Your own RDBMS' },
                { label:'Returns', value:'Ranked document sections' },
                { label:'Per-query cost', value:'None - no model involved' },
                { label:'Best for', value:'“Take me to that page”' },
                { label:'Scope', value:'Same imported documents' },
              ],
              summary:'For visitors who already know what they’re looking for. Queries never reach a model, never incur usage costs and never leave your App - so it stays fast and free no matter how much traffic it gets.' },
        ]
        return { columns }
    }
}


/** What stays in your App vs what lives in Gemini */
const DataOwnership = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div v-for="side in sides" :key="side.title"
           :class="['rounded-2xl border p-6 shadow-sm sm:p-7', side.accent]">
        <div class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/70 text-lg font-black shadow-sm dark:bg-slate-900/70">{{side.icon}}</span>
          <div>
            <div class="text-lg font-bold text-slate-900 dark:text-white">{{side.title}}</div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{side.tagline}}</div>
          </div>
        </div>
        <ul class="mt-5 grid gap-2 sm:grid-cols-2">
          <li v-for="item in side.items" :key="item"
              class="flex items-start gap-2 rounded-xl bg-white/80 px-3.5 py-2.5 text-sm leading-6 text-slate-700 ring-1 ring-black/5 dark:bg-slate-900/70 dark:text-slate-300 dark:ring-white/10">
            <span class="mt-0.5 shrink-0 text-emerald-500">✓</span><span>{{item}}</span>
          </li>
        </ul>
        <p class="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{side.text}}</p>
      </div>
    </section>`,
    setup() {
        const sides = [
            { icon:'🗄', title:'Stays in your App', tagline:'OrmLite database + file storage',
              accent:'border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30',
              items:['Authoritative document catalogue','Original source files','Saved imports & sync history','Document metadata & categories','Search index sections','Assistants & customer conversations'],
              text:'This is the copy you back up, query, export and keep. Coverage reports expose missing metadata and bulk metadata edits can be staged, counted and applied.' },
            { icon:'☁', title:'Lives in the Gemini File Store', tagline:'Semantic retrieval only',
              accent:'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40',
              items:['Indexed document copies','Embeddings for semantic search','Metadata used for filtering','Retrieved excerpts for citations'],
              text:'Synchronization reports reconcile the two: detecting local/remote differences, missing documents and duplicate indexed copies, so administrators can push intentional changes and prune duplicates.' },
        ]
        return { sides }
    }
}

/** One typed C# expression → each database's native JSON functions */
const JsonPortability = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Write once, run on four databases</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">The same typed query, every provider’s native JSON</h3>
      </div>

      <div class="px-6 pt-6 sm:px-8">
        <pre class="overflow-x-auto rounded-xl bg-slate-900 p-4 text-[13px] leading-6 text-slate-200 dark:bg-black/50"><code class="nohighlight">db.From&lt;OrderEvent&gt;().Where(x =&gt;
    <span class="text-sky-300">Sql.Json</span>&lt;OrderDocument&gt;(x.Data).Customer.Address.State == <span class="text-emerald-300">"WA"</span>)</code></pre>
      </div>

      <div class="px-6 pb-6 pt-5 sm:px-8">
        <div class="flex flex-wrap gap-2">
          <button v-for="(db,index) in databases" :key="db.name" type="button" @click="selected=index"
            :class="['rounded-full px-4 py-2 text-sm font-semibold transition', selected === index
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">
            {{db.name}}
          </button>
        </div>

        <div class="mt-5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
              <tr><th class="px-4 py-2.5 font-bold">Operation</th><th class="px-4 py-2.5 font-bold">{{active.name}} translates to</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr v-for="(op,i) in operations" :key="op" class="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-900 dark:even:bg-slate-800/30">
                <td class="px-4 py-2.5 text-slate-600 dark:text-slate-300">{{op}}</td>
                <td class="px-4 py-2.5">
                  <code v-if="active.fns[i] !== '-'" class="rounded bg-slate-900 px-2 py-1 text-xs text-sky-300 dark:bg-black/50">{{active.fns[i]}}</code>
                  <span v-else class="text-xs italic text-slate-400 dark:text-slate-500">not supported</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Your C# never names any of these. Change database and the query compiles and runs unchanged -
          and refactoring <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">OrderDocument</code>
          updates the query with it.
        </p>
      </div>
    </section>`,
    setup() {
        const operations = ['Validate JSON','Read a scalar','Read an object or array','Path exists','Read a value’s type','Array length','Array membership','Document containment']
        const databases = [
            { name:'SQLite',      fns:['json_valid','json_extract','json_extract','json_type','json_type','json_array_length','json_each','-'] },
            { name:'PostgreSQL',  fns:['IS JSON','jsonb_path_query_first','jsonb_path_query_first','jsonb_path_exists','jsonb_typeof','jsonb_array_length','jsonb containment','@>'] },
            { name:'SQL Server',  fns:['ISJSON','JSON_VALUE','JSON_QUERY','JSON_PATH_EXISTS','OPENJSON','OPENJSON','OPENJSON','-'] },
            { name:'MySQL',       fns:['JSON_VALID','JSON_EXTRACT','JSON_EXTRACT','JSON_CONTAINS_PATH','JSON_TYPE','JSON_LENGTH','JSON_CONTAINS','JSON_CONTAINS'] },
        ]
        const selected = ref(0)
        const active = computed(() => databases[selected.value])
        return { operations, databases, selected, active }
    }
}

/** Save() vs Upsert() */
const UpsertCompare = {
    components: { CodeCompare },
    template: `<CodeCompare eyebrow="One row, one statement" title="Insert-or-update without the round trip"
        description="Save() asks the database whether the row exists, then inserts or updates it. Upsert() expresses the intent directly and lets the database resolve the conflict in a single native statement."
        :tabs="tabs" />`,
    setup() {
        const tabs = [
            { name:'Insert or update',
              left: { label:'Before - Save()', badge:'2 statements', lang:'csharp', code:`
                    // SELECT to discover whether Id=1 exists,
                    // then INSERT or UPDATE accordingly
                    db.Save(customer);

                    // Another writer can insert Id=1 between
                    // the two statements
              ` },
              right:{ label:'v10.2 - Upsert()', badge:'1 statement', lang:'csharp', code:`
                    // ON CONFLICT / MERGE / ON DUPLICATE KEY
                    // resolved natively by the database
                    db.Upsert(customer);

                    // No existence query, no race window
              ` },
              footnote:'Native single-statement conflict handling on SQLite, PostgreSQL, SQL Server and MySQL/MariaDB.' },
            { name:'Update selected fields',
              left: { label:'The problem', lang:'csharp', code:`
                    // A full upsert would overwrite fields owned
                    // by another part of the application
                    customer.InternalNotes = null; // clobbered
              ` },
              right:{ label:'updateOnly', lang:'csharp', code:`
                    // New rows still insert every insertable field,
                    // existing rows only update these
                    db.Upsert(customer,
                        updateOnly: x => new { x.Name, x.Email });
              ` },
              footnote:'Primary Key and RowVersion fields can’t be updated and [IgnoreOnUpdate] properties stay excluded. A string field-name overload covers field sets chosen at runtime.' },
            { name:'Batches & async',
              left: { label:'Many rows', lang:'csharp', code:`
                    db.UpsertAll(customers);

                    db.UpsertAll(customers,
                        updateOnly: x => new { x.Name, x.Email });
              ` },
              right:{ label:'Async equivalents', lang:'csharp', code:`
                    await db.UpsertAsync(customer,
                        token: cancellationToken);

                    await db.UpsertAllAsync(customers,
                        token: cancellationToken);
              ` },
              footnote:'UpsertAll inserts and updates together in a transaction. Every single-row, batch, typed-field and runtime-field API has an async equivalent with optional CancellationToken support.' },
        ]
        return { tabs }
    }
}

/** The development loop Startup Tasks close */
const DevLoop = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Development loop</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">The step you keep forgetting, removed</h3>

      <div class="mt-7 grid gap-4 sm:grid-cols-2">
        <div v-for="(step,i) in steps" :key="step.title"
             :class="['relative flex min-w-0 items-start gap-4 rounded-2xl border p-5', step.gone
               ? 'border-dashed border-rose-300 bg-rose-50/60 dark:border-rose-900 dark:bg-rose-950/20'
               : 'border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900']">
          <span :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black', step.gone
            ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300'
            : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300']">{{i+1}}</span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span :class="['font-bold', step.gone ? 'text-rose-700 line-through decoration-2 dark:text-rose-300' : 'text-slate-900 dark:text-white']">{{step.title}}</span>
              <span v-if="step.gone" class="shrink-0 rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">No longer yours</span>
              <span v-else-if="step.badge" class="shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{{step.badge}}</span>
            </div>
            <p :class="['mt-2 text-sm leading-6', step.gone ? 'text-rose-600/90 dark:text-rose-300/80' : 'text-slate-600 dark:text-slate-300']">{{step.text}}</p>
          </div>
        </div>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <span v-for="task in tasks" :key="task.name"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
          <code class="rounded bg-indigo-50 px-1.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{{task.name}}</code>
          <span class="text-slate-600 dark:text-slate-300">{{task.text}}</span>
        </span>
      </div>
    </section>`,
    setup() {
        const steps = [
            { title:'Change a server API', text:'Add a property to a Request DTO, rename a Response field, or add a new Service.' },
            { title:'Run npx get-dtos', text:'Remember the command, install the toolchain, run it in the right directory - or don’t, and ship a stale client.', gone:true },
            { title:'Restart the App', text:'Startup Tasks run once ASP.NET Core and ServiceStack have fully started, with the configured AppHost and plugins available.', badge:'Automatic' },
            { title:'Clients are already in sync', text:'DTOs are regenerated in-process - no HTTP, no Node.js - and unchanged files aren’t rewritten, so no needless frontend rebuild.', badge:'Development only' },
        ]
        const tasks = [
            { name:'dtos', text:'TypeScript & JavaScript client DTOs' },
            { name:'pdf',  text:'Typed C# models from PDF template schemas' },
            { name:'…',    text:'Any development-time work you register' },
        ]
        return { steps, tasks }
    }
}

/** What in-process DTO regeneration actually guarantees */
const DtosGuarantees = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Why it’s safe to run on every restart</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Regeneration you can leave switched on</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          A step that runs on every restart only stays useful if it’s fast, non-destructive and impossible to break the App with.
          Each of these properties exists to remove a reason you’d otherwise turn it off.
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="g in guarantees" :key="g.name"
             class="flex min-w-0 items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg dark:bg-slate-800">{{g.icon}}</span>
          <div class="min-w-0 flex-1">
            <div class="font-bold text-slate-900 dark:text-white">{{g.name}}</div>
            <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{g.text}}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 grid gap-3 lg:grid-cols-2">
        <div v-for="a in adoption" :key="a.name"
             :class="['flex min-w-0 flex-col rounded-2xl border p-5 shadow-sm', a.featured
               ? 'border-indigo-300/70 bg-indigo-50/40 dark:border-indigo-800 dark:bg-indigo-950/20'
               : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900']">
          <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span class="min-w-0 font-bold text-slate-900 dark:text-white">{{a.name}}</span>
            <span :class="['shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider', a.featured
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300']">{{a.tag}}</span>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{a.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const guarantees = [
            { icon:'⚡', name:'No HTTP, no Node.js', text:'DTOs are generated in-process from Native Types metadata - there’s no toolchain to install and no server to be listening first.' },
            { icon:'🧩', name:'Your options are preserved', text:'Each existing dtos reference keeps the generation options it was created with, so regenerating never silently reshapes a client.' },
            { icon:'📄', name:'Unchanged files aren’t rewritten', text:'Output is compared before writing, so an unchanged API doesn’t trigger a frontend rebuild or a file-watcher restart loop.' },
            { icon:'🔍', name:'Contract breaks surface early', text:'A renamed field or removed Service shows up in your client build while you’re still on the server - not later in CI or another developer’s checkout.' },
            { icon:'🧪', name:'Development only', text:'The task doesn’t run in Production, so generated artifacts can never be produced on a deployed App.' },
            { icon:'🛟', name:'Failures stay isolated', text:'A task that throws is logged and contained - a convenience step can’t stop the App from starting.' },
        ]
        const adoption = [
            { name:'New projects', tag:'Already configured', featured:true,
              text:'Every project template with TypeScript .ts or JavaScript .mjs client DTOs now registers the dtos Startup Task, so a typed client that stays in sync is the default.' },
            { name:'Existing projects', tag:'One line to opt in', featured:false,
              text:'Add the StartupTasks.Register("dtos", …) registration above and the same behavior applies to the references you already have.' },
        ]
        return { guarantees, adoption }
    }
}

/** The six areas the security audit strengthened */
const HardeningPillars = {
    components: { FeaturePillars },
    template: `<FeaturePillars eyebrow="Codebase-wide audit" title="Where the hardening landed"
        description="The most consequential fixes strengthen trust boundaries and the handling of untrusted input. Select an area to see what changed."
        :pillars="pillars" />`,
    setup() {
        const pillars = [
            { icon:'ID', name:'Authorization', tagline:'Identity & tenant isolation',
              summary:'Corrected checks that could grant access to the wrong user, tenant or connection - the failures that matter most because nothing else downstream can catch them.',
              points:['Fixed inverted Blazor role and permission checks','Prevented cross-circuit UI state leakage','Preserved tenant-specific Stripe Connect and Redis ACL identities','Fixed auth repository logic that could validate or update the wrong account'] },
            { icon:'{}', name:'Serialization', tagline:'Safe parsing of untrusted input',
              summary:'Removed the paths where hostile documents could turn into code execution, outbound requests or a crashed process.',
              points:['Removed process-wide insecure-deserialization bypasses','Restricted untrusted runtime type creation','Deprecated BinaryFormatter paths','Enforced safe XML reader settings','Bounded recursive parsing against stack exhaustion','Closed XXE and SSRF vectors'] },
            { icon:'SQL', name:'Injection & encoding', tagline:'Queries, webhooks & output',
              summary:'Closed the gaps where attacker-controlled text could change the meaning of a query, a document or a page.',
              points:['Closed SQL validation and quoted-identifier bypasses','Added Stripe webhook signature and replay-window verification','Hardened process argument handling','Protected CSV exports from formula injection','Encoded dynamic HTML, JavaScript and Swagger UI content'] },
            { icon:'URL', name:'Paths & redirects', tagline:'File and URL boundaries',
              summary:'Made virtual file access and redirect targets behave consistently across every provider, so a crafted path or return URL cannot escape its boundary.',
              points:['Canonicalized virtual-file paths across local, S3, Azure and Google Cloud','Enforced directory boundaries','Sanitized desktop file names','Rejected unsafe return URLs and URI schemes'] },
            { icon:'#', name:'Cryptography', tagline:'Comparisons, randomness & keys',
              summary:'Modernized the primitives behind authentication so verification leaks nothing through timing and malformed material is rejected rather than misinterpreted.',
              points:['Fixed-time comparisons for password, digest and anti-forgery verification','Modernized random-number generation and certificate loading','Safely rejected malformed hashes and signatures','Ensured native cryptographic resources are disposed'] },
            { icon:'DoS', name:'Availability', tagline:'DoS defenses & leaks',
              summary:'Bounded the work a single request can cause and fixed the slow leaks that degrade a long-running server.',
              points:['Added regex timeouts, upload limits and parser bounds checks','Propagated cancellation','Bounded caches and acknowledgement tracking','Fixed temporary-file, socket, stream, native-memory, OS-handle and event-subscription leaks'] },
        ]
        return { pillars }
    }
}

/** Searchable index of every published per-package audit report */
const AuditReports = {
    components: { FeatureMatrix },
    template: `<FeatureMatrix eyebrow="Published for review" title="Audit reports for every package"
        description="Every change from the audit is documented in its package's SECURITY_CHANGES.md, so your security team can review exactly what was fixed rather than take an upgrade on faith."
        placeholder="Search packages…" :features="features" />`,
    setup() {
        const gh = 'https://github.com/ServiceStack/ServiceStack/blob/main/'
        const src = name => `${gh}ServiceStack/src/${name}/SECURITY_CHANGES.md`
        const repo = name => `${gh}${name}/SECURITY_CHANGES.md`
        const features = [
            { name:'ServiceStack', category:'Core', href:src('ServiceStack'), text:'Core runtime, request pipeline, authentication, sessions and virtual file system.', keywords:'apphost pipeline auth session vfs' },
            { name:'ServiceStack.Common', category:'Core', href:src('ServiceStack.Common'), text:'Shared utilities, validation helpers and extension methods used across the stack.', keywords:'utils validation' },
            { name:'ServiceStack.Interfaces', category:'Core', href:src('ServiceStack.Interfaces'), text:'Contracts and attributes shared by every ServiceStack library.', keywords:'contracts attributes dtos' },
            { name:'ServiceStack.Text', category:'Serialization', href:repo('ServiceStack.Text'), text:'JSON, JSV and CSV serialization, type resolution and parsing bounds.', keywords:'json jsv csv serializer parsing' },
            { name:'ServiceStack.MsgPack', category:'Serialization', href:src('ServiceStack.MsgPack'), text:'MessagePack serialization format support.', keywords:'msgpack binary' },
            { name:'ServiceStack.ProtoBuf', category:'Serialization', href:src('ServiceStack.ProtoBuf'), text:'Protocol Buffers serialization format support.', keywords:'protobuf binary grpc' },
            { name:'ServiceStack.OrmLite', category:'Data', href:repo('ServiceStack.OrmLite'), text:'SQL generation, quoted identifiers, database metadata and query construction.', keywords:'sql rdbms database orm injection' },
            { name:'ServiceStack.Redis', category:'Data', href:repo('ServiceStack.Redis'), text:'Client pooling, master/replica routing, ACL identities and distributed locks.', keywords:'redis cache lock pool' },
            { name:'ServiceStack.Server', category:'Data', href:src('ServiceStack.Server'), text:'Server-side data, caching and messaging providers.', keywords:'cache mq server' },
            { name:'ServiceStack.Caching.Memcached', category:'Data', href:src('ServiceStack.Caching.Memcached'), text:'Memcached cache client integration.', keywords:'cache memcached' },
            { name:'ServiceStack.Extensions', category:'Data', href:src('ServiceStack.Extensions'), text:'gRPC, Identity and additional .NET integrations.', keywords:'grpc identity' },
            { name:'ServiceStack.Authentication.MongoDb', category:'Auth', href:src('ServiceStack.Authentication.MongoDb'), text:'MongoDB-backed authentication repository.', keywords:'mongo auth repository users' },
            { name:'ServiceStack.Authentication.RavenDb', category:'Auth', href:src('ServiceStack.Authentication.RavenDb'), text:'RavenDB-backed authentication repository.', keywords:'ravendb auth repository users' },
            { name:'ServiceStack.Stripe', category:'Auth', href:repo('ServiceStack.Stripe'), text:'Stripe gateway, Connect identities and webhook signature verification.', keywords:'stripe payments webhook connect billing' },
            { name:'ServiceStack.Jobs', category:'Messaging', href:src('ServiceStack.Jobs'), text:'Background jobs, scheduled tasks and worker lifecycle.', keywords:'jobs background worker scheduled' },
            { name:'ServiceStack.RabbitMq', category:'Messaging', href:src('ServiceStack.RabbitMq'), text:'RabbitMQ transport, acknowledgement tracking and recovery.', keywords:'rabbitmq mq queue ack' },
            { name:'ServiceStack.Aws', category:'Cloud', href:repo('ServiceStack.Aws'), text:'S3 virtual files, DynamoDB and SQS integrations.', keywords:'aws s3 dynamodb sqs' },
            { name:'ServiceStack.Azure', category:'Cloud', href:repo('ServiceStack.Azure'), text:'Azure Blob virtual files and Service Bus messaging.', keywords:'azure blob servicebus' },
            { name:'ServiceStack.GoogleCloud', category:'Cloud', href:src('ServiceStack.GoogleCloud'), text:'Google Cloud Storage virtual files and Pub/Sub messaging.', keywords:'gcp google storage pubsub' },
            { name:'ServiceStack.AI', category:'AI', href:src('ServiceStack.AI'), text:'AI Chat, providers, API Tools and MCP surface area.', keywords:'ai chat llm mcp tools' },
            { name:'ServiceStack.Blazor', category:'UI', href:repo('ServiceStack.Blazor'), text:'Blazor components, role and permission checks and circuit state isolation.', keywords:'blazor components circuit roles' },
            { name:'ServiceStack.Mvc', category:'UI', href:src('ServiceStack.Mvc'), text:'ASP.NET MVC integration and view helpers.', keywords:'mvc razor views' },
            { name:'ServiceStack.Razor', category:'UI', href:src('ServiceStack.Razor'), text:'Razor view engine hosting and rendering.', keywords:'razor views templates' },
            { name:'ServiceStack.Desktop', category:'UI', href:src('ServiceStack.Desktop'), text:'Desktop app hosting, file dialogs and name sanitization.', keywords:'desktop chromium files' },
            { name:'ServiceStack.Kestrel', category:'UI', href:src('ServiceStack.Kestrel'), text:'Kestrel self-hosting integration.', keywords:'kestrel host' },
            { name:'ServiceStack.ImageSharp', category:'Media', href:src('ServiceStack.ImageSharp'), text:'Image resizing, decoding limits and resource disposal.', keywords:'image resize imagesharp' },
            { name:'ServiceStack.Skia', category:'Media', href:src('ServiceStack.Skia'), text:'SkiaSharp image processing and native resource handling.', keywords:'skia image native' },
            { name:'ServiceStack.Client', category:'Clients', href:src('ServiceStack.Client'), text:'Typed Service Client, redirect handling and URI scheme validation.', keywords:'client jsonserviceclient redirect' },
            { name:'ServiceStack.HttpClient', category:'Clients', href:src('ServiceStack.HttpClient'), text:'HttpClient-based Service Client implementation.', keywords:'httpclient client' },
            { name:'ServiceStack.GrpcClient', category:'Clients', href:src('ServiceStack.GrpcClient'), text:'gRPC Service Client and channel lifecycle.', keywords:'grpc client channel' },
            { name:'ServiceStack.NetFramework', category:'Clients', href:src('ServiceStack.NetFramework'), text:'.NET Framework compatibility support.', keywords:'netfx net472 framework' },
            { name:'ServiceStack.Logging', category:'Diagnostics', href:repo('ServiceStack.Logging'), text:'Logging providers and diagnostic output handling.', keywords:'logging serilog nlog' },
            { name:'ServiceStack.Api.OpenApi', category:'OpenAPI', href:src('ServiceStack.Api.OpenApi'), text:'Swagger UI content encoding and OpenAPI schema generation.', keywords:'openapi swagger xss' },
            { name:'ServiceStack.AspNetCore.OpenApi', category:'OpenAPI', href:src('ServiceStack.AspNetCore.OpenApi'), text:'ASP.NET Core OpenAPI document generation.', keywords:'openapi aspnetcore' },
            { name:'ServiceStack.OpenApi.Microsoft', category:'OpenAPI', href:src('ServiceStack.OpenApi.Microsoft'), text:'Microsoft OpenAPI library integration.', keywords:'openapi microsoft' },
            { name:'ServiceStack.OpenApi.Swashbuckle', category:'OpenAPI', href:src('ServiceStack.OpenApi.Swashbuckle'), text:'Swashbuckle integration for OpenAPI documents.', keywords:'openapi swashbuckle swagger' },
        ]
        return { features }
    }
}

export default {
    install(app) {
    },
    components: {
        AudioPlayer,
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        ReleaseHighlights,
        GeminiPipeline,
        GeminiWorkflow,
        TwoExperiences,
        SearchEngineMatrix,
        DataOwnership,
        JsonPortability,
        UpsertCompare,
        DevLoop,
        DtosGuarantees,
        HardeningPillars,
        AuditReports,
    },
    setup() {
        return { }
    }
}
