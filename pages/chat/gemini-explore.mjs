import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** The three scopes a grounded question can run against */
const RetrievalScopes = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">What you see is what it searches</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Three retrieval scopes</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          The filters applied while browsing are the same filters passed to Gemini File Search, so the
          document set you can see is the document set an answer is drawn from.
        </p>
      </div>

      <div class="grid gap-3 lg:grid-cols-3">
        <div v-for="scope in scopes" :key="scope.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{scope.icon}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{scope.name}}</div>
          </div>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{scope.text}}</p>
          <div class="mt-4 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Chat header shows</div>
          <code class="mt-1.5 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] text-emerald-300 dark:bg-black/50">{{scope.header}}</code>
        </div>
      </div>

      <!-- citation fallback chain -->
      <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/40 sm:p-6">
        <div class="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Where a source link resolves to</div>
        <div class="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <div v-for="(link,i) in links" :key="link.name" class="contents">
            <div :class="['flex-1 rounded-xl border p-3.5', link.accent]">
              <div class="flex items-center gap-2">
                <span class="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[11px] font-black text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">{{i+1}}</span>
                <div class="text-sm font-bold text-slate-900 dark:text-white">{{link.name}}</div>
              </div>
              <p class="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{{link.text}}</p>
            </div>
            <div v-if="i < links.length - 1" class="flex items-center justify-center px-1 text-slate-400" aria-hidden="true">
              <span class="hidden sm:inline">→</span><span class="sm:hidden">↓</span>
            </div>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const scopes = [
            { icon:'🗂', name:'New Chat', text:'Searches the whole File Store. The right starting point for open-ended questions and internal research.',
              header:'docs.example.com' },
            { icon:'📄', name:'One document', text:'A document row’s chat icon searches only that document - useful for interrogating a single long reference page.',
              header:'docs.example.com/auth/login.md' },
            { icon:'🎯', name:'Ask about this', text:'Preserves the current category and every active metadata filter, so the answer is drawn from exactly what you filtered to.',
              header:'docs.example.com/auth (2)' },
        ]
        const links = [
            { name:'Source URL', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'The document’s canonical public page - what you want a customer to land on.' },
            { name:'Gemini URI', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'The URI Gemini returned for the retrieved file.' },
            { name:'Cached download', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'The locally cached copy of the original document.' },
        ]
        return { scopes, links }
    }
}

/** Import vs Push vs Sync - three actions that solve different problems */
const ImportPushSync = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Three actions, three problems</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Which one do you actually need?</h3>
      </div>
      <div class="grid gap-3 lg:grid-cols-3">
        <div v-for="action in actions" :key="action.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', action.accent]">
          <div class="font-bold text-slate-900 dark:text-white">{{action.name}}</div>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Use it when</div>
          <p class="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{{action.when}}</p>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">What it does</div>
          <p class="mt-1 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{action.does}}</p>
          <div class="mt-4 flex items-center gap-2 border-t border-black/5 pt-3 text-xs dark:border-white/10">
            <span class="font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Re-embeds</span>
            <span :class="['rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', action.costTint]">{{action.cost}}</span>
          </div>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        Local metadata edits appear in Explorer immediately, but Gemini keeps searching its
        <b class="text-slate-900 dark:text-white">last indexed metadata</b> until you push. That’s why bulk
        edits are staged: make every correction first, then pay for a single re-indexing pass.
      </p>
    </section>`,
    setup() {
        const actions = [
            { name:'Re-run an import', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              when:'The source content itself has changed upstream.',
              does:'Rescans the source, compares content and metadata hashes independently, and queues only what actually changed.',
              cost:'Changed only', costTint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
            { name:'Push N to Gemini', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              when:'You edited metadata locally and want retrieval to see it.',
              does:'Re-uploads and re-embeds the affected documents, because Gemini cannot patch indexed metadata in place.',
              cost:'Yes', costTint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
            { name:'Sync Store', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              when:'Explorer and Gemini appear to disagree.',
              does:'Audits both sides for documents missing locally or remotely, metadata differences, unmatched fields and duplicate remote copies.',
              cost:'No - read-only audit', costTint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
        ]
        return { actions }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        RetrievalScopes,
        ImportPushSync,
    }
}
