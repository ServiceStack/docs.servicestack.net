import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import FeatureMatrix from "../components/FeatureMatrix.mjs"

/** Why interrupted work resumes instead of disappearing */
const WorkerModel = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Durable by design</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Why a restart never loses queued work</h3>

      <div class="mt-7 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <code class="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">desired hash</code>
          <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            What the document <i>should</i> look like once indexed. Recomputed when content, title, Source URL,
            extractor version or filterable metadata changes.
          </p>
        </div>
        <div class="flex flex-col items-center justify-center gap-1 text-center">
          <span class="text-2xl text-indigo-400" aria-hidden="true">≠</span>
          <span class="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">work to do</span>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <code class="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">completed hash</code>
          <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            What was actually indexed last time. Attempts and errors are recorded in the database beside it.
          </p>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        Both workers simply select the documents whose two hashes differ. Because that queue lives in the
        database rather than in memory, an App restart resumes unfinished work instead of losing it - and the
        work is idempotent, so retrying is always safe.
      </p>

      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        <div v-for="w in workers" :key="w.name" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="font-bold text-slate-900 dark:text-white">{{w.name}}</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">{{w.text}}</p>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <span v-for="tag in w.tags" :key="tag"
                  class="rounded-lg bg-slate-50 px-2 py-1 text-[11px] text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{{tag}}</span>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const workers = [
            { name:'Gemini upload worker', text:'Uploads and indexes documents into the remote File Search store.',
              tags:['Sort Explorer by Uploading','Sort by Failed to retry','Bounded concurrency + backoff'] },
            { name:'Local Search worker', text:'Rebuilds heading-aware sections in your RDBMS, entirely independently of the upload worker.',
              tags:['Index health panel','Rebuild index','Oldest pending work'] },
        ]
        return { workers }
    }
}

/** Where every piece of durable state lives */
const StorageMap = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Back these up together</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Where Gemini state is stored</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Structured state lives in the App's OrmLite database (created automatically with
          <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">AutoInitSchema = true</code>);
          original file bodies and crawl workspaces live under AI Chat's <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">AppDataPath</code>.
          Back up both so catalogue records and cached originals stay consistent.
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="group in groups" :key="group.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{group.icon}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{group.name}}</div>
          </div>
          <ul class="mt-3 flex-1 space-y-1.5">
            <li v-for="t in group.tables" :key="t">
              <code class="block truncate rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700" :title="t">{{t}}</code>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <div v-for="path in paths" :key="path.path" class="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/40">
          <div class="text-sm font-bold text-slate-900 dark:text-white">{{path.name}}</div>
          <code class="mt-2 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] text-emerald-300 dark:bg-black/50">{{path.path}}</code>
          <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{{path.text}}</p>
        </div>
      </div>

      <div class="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3.5 dark:border-amber-900 dark:bg-amber-950/20">
        <span class="mt-0.5 text-lg" aria-hidden="true">👤</span>
        <p class="text-sm leading-6 text-slate-700 dark:text-slate-200">
          <b class="text-slate-900 dark:text-white">Rows are partitioned by authenticated username</b>, so a
          File Store one user creates isn’t visible to another. For a genuinely shared organizational knowledge
          base, create it under a shared account, expose it through an
          <a href="/chat/api-tools" class="font-semibold text-indigo-600 underline decoration-dotted dark:text-indigo-400">API Tool</a>,
          or publish it as a Search widget or Assistant - the supported way to serve one store to an anonymous
          public audience.
        </p>
      </div>
    </section>`,
    setup() {
        const groups = [
            { icon:'📚', name:'Catalogue', tables:['ChatFilestore','ChatDocument'] },
            { icon:'🔄', name:'Imports', tables:['ChatSource','ChatSourceRun'] },
            { icon:'⌘K', name:'Search', tables:['ChatSearchSection','ChatSearchWidget','ChatSearchQuery','ChatSearchClick','ChatSearchPageView'] },
            { icon:'💬', name:'Assistants', tables:['ChatAssistant','ChatAssistantConversation','ChatAssistantMessage'] },
        ]
        const paths = [
            { name:'Cached document bodies', path:'App_Data/chat/cache/[prefix]/[hash].[ext]',
              text:'SHA-256 content-addressed, with a .info.json sidecar retaining the original filename, MIME type, size, date and cache URL.' },
            { name:'Crawl workspaces', path:'App_Data/chat/user/<user>/gemini/imports/',
              text:'Per-user Markdown workspaces produced by website crawls, before anything is handed to Folder import.' },
        ]
        return { groups, paths }
    }
}

/** Searchable symptom → cause → fix index */
const TroubleshootingIndex = {
    components: { FeatureMatrix },
    template: `<FeatureMatrix eyebrow="Start here" title="Troubleshooting by symptom"
        description="Search or filter by area to find the check that matches what you're seeing. Each entry links to its full explanation below."
        placeholder="Search symptoms…" :features="features" />`,
    setup() {
        const features = [
            { name:'The Gemini icon is missing', category:'Setup', href:'#the-gemini-icon-is-missing',
              text:'Confirm the API key and IDbConnectionFactory, check DisableExtensions, and restart. The extension logs which prerequisite is missing.',
              keywords:'disabled hidden not showing api key GOOGLE_API_KEY GEMINI_API_KEY DisableExtensions' },
            { name:'No Gemini model is available', category:'Setup', href:'#no-gemini-model-is-available',
              text:'Configure a Google provider chat model - the picker excludes other providers and incompatible model types.',
              keywords:'model picker empty google provider' },
            { name:'A folder cannot be imported', category:'Imports', href:'#a-folder-cannot-be-imported',
              text:'Check the resolved folder. Non-admin users must stay beneath a trusted import root, re-checked whenever a saved import runs.',
              keywords:'permission denied trusted root path symlink importRoots' },
            { name:'Files were skipped', category:'Imports', href:'#files-were-skipped',
              text:'Open Skipped & failed in the preview - unsupported binaries, very short prose, globs, Category root or an explicit skip rule.',
              keywords:'missing documents excluded glob preview binary pdf short' },
            { name:'An upload failed or appears stuck', category:'Imports', href:'#an-upload-failed-or-appears-stuck',
              text:'Sort Explorer by Failed or Uploading, hover the status for the provider message, and retry. Pending work resumes after a restart.',
              keywords:'pending queue hung retry provider error' },
            { name:'A metadata filter returns no results', category:'Retrieval', href:'#a-metadata-filter-returns-no-results',
              text:'Clear other chips and verify exact values in Coverage. Versions and tags are lists, and every active facet combines with the category.',
              keywords:'empty facet chips filter versions tags coverage' },
            { name:'Citations open cached files', category:'Retrieval', href:'#citations-open-cached-files',
              text:'Add or correct Source URL metadata, then push pending metadata changes so future filtered retrieval uses the new values.',
              keywords:'source url citation link local download push metadata' },
            { name:'Explorer and Gemini disagree', category:'Retrieval', href:'#explorer-and-gemini-disagree',
              text:'Run Sync Store, then use its issue links to push metadata, retry missing uploads and prune duplicate remote copies.',
              keywords:'out of sync mismatch duplicates missing remote reconcile' },
            { name:'Search is using a *-like provider', category:'Search', href:'#search-is-using-a-like-provider',
              text:'Native full-text could not be initialized or a native query failed. Check the database feature and the app user’s permissions.',
              keywords:'fts5 fulltext fallback LIKE slow sqlserver postgres mysql permissions' },
            { name:'A document is missing from Search', category:'Search', href:'#a-document-is-missing-from-search',
              text:'Check pending and failed counts. PDF, Word, PowerPoint and Excel need conversion to a text format to be locally searchable.',
              keywords:'not indexed pdf docx office pending failed sections' },
        ]
        return { features }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        FeatureMatrix,
        WorkerModel,
        StorageMap,
        TroubleshootingIndex,
    }
}
