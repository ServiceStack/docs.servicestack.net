import { computed, ref } from "vue"
import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Choose the ingestion path that matches the source */
const ImportPaths = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Three ways in</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Choose the ingestion path that matches the source</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          All three converge on the same managed catalogue - a web crawl hands its cleaned workspace to
          Folder import, and one confirmed import updates both retrieval systems.
        </p>
      </div>

      <div class="grid gap-3 lg:grid-cols-3">
        <div v-for="path in paths" :key="path.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{path.icon}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{path.name}}</div>
          </div>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Best for</div>
          <p class="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{{path.bestFor}}</p>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">How it behaves</div>
          <p class="mt-1 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{path.behavior}}</p>
          <div class="mt-4 flex flex-wrap gap-1.5">
            <span v-for="tag in path.tags" :key="tag"
                  :class="['rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider', path.tint]">{{tag}}</span>
          </div>
        </div>
      </div>

      <!-- one import, two destinations -->
      <div class="mt-6 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 dark:border-indigo-900 dark:bg-indigo-950/30 sm:p-6">
        <div class="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <div class="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div class="text-sm font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">One confirmed import</div>
            <p class="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">The managed document catalogue in your App database</p>
          </div>
          <div class="text-center text-2xl text-indigo-400" aria-hidden="true">
            <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div v-for="dest in destinations" :key="dest.name"
                 class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div class="text-sm font-bold text-slate-900 dark:text-white">{{dest.name}}</div>
              <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{{dest.text}}</p>
            </div>
          </div>
        </div>
        <p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          The two workers are independent and both use durable desired/completed hashes, so pending work
          resumes after an App restart without losing an in-memory queue.
        </p>
      </div>
    </section>`,
    setup() {
        const paths = [
            { icon:'📄', name:'Upload files', tint:'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
              bestFor:'PDFs, documents, ad-hoc files and ZIP archives.',
              behavior:'Queues selected files immediately. A ZIP is expanded safely and its folder structure becomes categories.',
              tags:['Immediate','ZIP → categories'] },
            { icon:'📁', name:'Folder', tint:'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              bestFor:'Documentation repositories and maintained server folders.',
              behavior:'Previews a diff before importing, and can be saved and re-run as a recurring synchronization.',
              tags:['Previewed','Recurring','Trusted roots'] },
            { icon:'🌐', name:'Web crawl', tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              bestFor:'Public websites and documentation portals.',
              behavior:'Crawls into an inspectable Markdown workspace you can clean, then hands it to Folder import.',
              tags:['Two-stage','Inspectable'] },
        ]
        const destinations = [
            { name:'Gemini File Search', text:'Indexed copies used for semantic RAG and grounded citations.' },
            { name:'Local Search index', text:'Heading-aware sections in your RDBMS for model-free Website Search.' },
        ]
        return { paths, destinations }
    }
}

/** What a preview classifies each discovered file as, and what it costs */
const PreviewLedger = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Read-only, before anything is written</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What a preview tells you</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Preview scans and compares the source without writing documents, uploading content or incurring
          embedding work. Every discovered file lands in exactly one of these buckets.
        </p>
      </div>

      <div class="p-6 sm:p-8">
        <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
          <span class="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white dark:bg-slate-700">Discovered</span>
          <span class="text-sm text-slate-600 dark:text-slate-300">Every file considered by the scan, then classified as:</span>
        </div>

        <div class="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="row in rows" :key="row.name"
               :class="['rounded-xl border p-4', row.accent]">
            <div class="flex items-center justify-between gap-2">
              <div class="font-bold text-slate-900 dark:text-white">{{row.name}}</div>
              <span v-if="row.cost" :class="['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', row.costTint]">{{row.cost}}</span>
            </div>
            <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{row.text}}</p>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/30">
          <span class="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-white">Embeds</span>
          <span class="text-sm leading-6 text-slate-700 dark:text-slate-200">
            The documents Gemini will upload and index after you confirm - the only line that costs anything.
            Nothing is applied until you choose <b class="text-slate-900 dark:text-white">Import N documents</b>.
          </span>
        </div>
      </div>
    </section>`,
    setup() {
        const rows = [
            { name:'New', cost:'Embeds', costTint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              accent:'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20',
              text:'Documents not yet present in this source.' },
            { name:'Changed', cost:'Embeds', costTint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              accent:'border-sky-200 bg-sky-50/40 dark:border-sky-900 dark:bg-sky-950/20',
              text:'Existing documents whose extracted content changed.' },
            { name:'Metadata only', cost:'Re-indexes', costTint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              accent:'border-indigo-200 bg-indigo-50/40 dark:border-indigo-900 dark:bg-indigo-950/20',
              text:'Content is unchanged but indexed metadata changed. Gemini cannot patch metadata in place.' },
            { name:'Unchanged', cost:'Free', costTint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40',
              text:'Documents requiring no work. Never embedded or locally indexed again.' },
            { name:'Removed', cost:'Deletes', costTint:'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
              accent:'border-rose-200 bg-rose-50/40 dark:border-rose-900 dark:bg-rose-950/20',
              text:'Previously imported from this source but no longer present. A deletion safety rail refuses an unexpectedly large removal.' },
            { name:'Skipped / Failed', cost:'', accent:'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40',
              text:'Excluded, unsupported, too short, unreadable or otherwise rejected files.' },
        ]
        return { rows }
    }
}

/** Which layer wins when the same metadata field is set in more than one place */
const MetadataPrecedence = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Most specific wins</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Where a document's metadata comes from</h3>

      <div class="mt-6 space-y-2">
        <div v-for="(layer,i) in layers" :key="layer.name"
             :class="['flex flex-col gap-x-4 gap-y-2 rounded-xl border p-4 lg:flex-row lg:items-center', layer.accent]">
          <div class="flex shrink-0 items-center gap-3 lg:w-44">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">{{i+1}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{layer.name}}</div>
          </div>
          <code class="w-fit shrink-0 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] text-slate-200 dark:bg-black/50">{{layer.source}}</code>
          <p class="flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{layer.text}}</p>
        </div>
      </div>

      <p class="mt-5 text-sm leading-6 text-slate-500 dark:text-slate-400">
        Scalar fields are overwritten by the most specific matching value; list values such as
        <b class="text-slate-700 dark:text-slate-200">versions</b> and
        <b class="text-slate-700 dark:text-slate-200">tags</b> accumulate instead of replacing.
      </p>
    </section>`,
    setup() {
        const layers = [
            { name:'Root manifest', source:'import.json (root)', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Global defaults and ordered path rules for the whole import.' },
            { name:'Nested manifest', source:'import.json (subfolder)', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Inherits the root and overwrites settings for the files beneath it.' },
            { name:'Page frontmatter', source:'--- in the document ---', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'More specific than either manifest - a crawled page carries its own title, source URL and tags.' },
            { name:'Import UI', source:'Metadata editor', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Highest precedence. Metadata entered explicitly in the form wins over everything above it.' },
        ]
        return { layers }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        ImportPaths,
        PreviewLedger,
        MetadataPrecedence,
    }
}
