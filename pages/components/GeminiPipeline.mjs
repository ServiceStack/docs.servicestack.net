/**
 * The Gemini RAG content pipeline: many sources -> one curated File Store
 * (local catalogue + Gemini index) -> two published public experiences.
 *
 *   <GeminiPipeline />
 */
export default {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/30 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One content pipeline</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Import once, publish two customer experiences</h3>

      <!-- 1. Sources -->
      <div class="mt-7 text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Content you already maintain</div>
      <div class="mt-3 grid gap-3 sm:grid-cols-3">
        <div v-for="src in sources" :key="src.name"
             class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="mt-0.5 text-lg">{{src.icon}}</span>
          <div>
            <div class="text-sm font-bold text-slate-900 dark:text-white">{{src.name}}</div>
            <div class="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{{src.text}}</div>
          </div>
        </div>
      </div>

      <div class="flex justify-center py-3 text-2xl text-indigo-400" aria-hidden="true">↓</div>

      <!-- 2. File Store -->
      <div class="rounded-2xl border-2 border-indigo-500/40 bg-white p-5 shadow-lg shadow-indigo-500/10 dark:bg-slate-900 sm:p-6">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div class="text-base font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">File Store</div>
          <span class="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Previewable sync</span>
          <span class="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Metadata scoped</span>
          <p class="w-full text-sm leading-6 text-slate-500 dark:text-slate-400 lg:w-auto lg:flex-1">
            One curated catalogue. Re-run an import and only what actually changed is indexed again.
          </p>
        </div>
        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
            <div class="text-sm font-bold text-slate-900 dark:text-white">Your database</div>
            <ul class="mt-2 flex flex-wrap gap-1.5">
              <li v-for="x in local" :key="x" class="rounded-lg bg-white px-2.5 py-1 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">{{x}}</li>
            </ul>
          </div>
          <div class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
            <div class="text-sm font-bold text-slate-900 dark:text-white">Gemini index</div>
            <ul class="mt-2 flex flex-wrap gap-1.5">
              <li v-for="x in remote" :key="x" class="rounded-lg bg-white px-2.5 py-1 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700">{{x}}</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="flex justify-center py-3 text-2xl text-indigo-400" aria-hidden="true">↓</div>

      <!-- 3. Published experiences -->
      <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Published to any website</div>
      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <div v-for="out in outputs" :key="out.name"
             :class="['rounded-xl border p-5 shadow-sm', out.accent]">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{out.icon}}</span>
            <div class="text-base font-bold text-slate-900 dark:text-white">{{out.name}}</div>
          </div>
          <div class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{out.text}}</div>
          <code class="mt-4 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-200 dark:bg-black/50">&lt;script src="…/{{out.widget}}"&gt;</code>
        </div>
      </div>
    </section>`,
    setup() {
        const sources = [
            { icon:'📄', name:'Files & ZIPs', text:'PDF, Markdown, HTML, CSV, JSON, YAML - ZIP folders become categories' },
            { icon:'📁', name:'Folders & repos', text:'Maintained docs folders, saved and re-runnable' },
            { icon:'🌐', name:'Website crawl', text:'Extracted to Markdown you can clean before anything is sent' },
        ]
        const local  = ['Document catalogue','Metadata & categories','Search sections','Imports & conversations']
        const remote = ['Embedded copies','Semantic File Search','Metadata filters','Grounded citations']
        const outputs = [
            { icon:'💬', name:'Website Assistant', widget:'assistants/widget.js', accent:'border-indigo-200 bg-indigo-50/60 dark:border-indigo-800 dark:bg-indigo-950/40',
              text:'Grounded, citation-backed answers from your approved content.' },
            { icon:'⌘K', name:'Website Search', widget:'searches/widget.js', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30',
              text:'Instant results from your own RDBMS - no model, no per-query cost.' },
        ]
        return { sources, local, remote, outputs }
    }
}
