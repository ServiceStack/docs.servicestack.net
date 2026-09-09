import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Why crawling is deliberately two stages, with a hard line before Gemini */
const CrawlStages = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Deliberately two stages</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Inspect the site before it reaches your index</h3>

      <div class="mt-7 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div v-for="(step,i) in steps" :key="step.name" class="contents">
          <div :class="['rounded-2xl border p-5 shadow-sm', step.accent]">
            <div class="flex items-center gap-2.5">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">{{i+1}}</span>
              <div class="font-bold text-slate-900 dark:text-white">{{step.name}}</div>
            </div>
            <p class="mt-2.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{step.text}}</p>
            <code v-if="step.code" class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-200 dark:bg-black/50">{{step.code}}</code>
            <div v-if="step.tags" class="mt-3 flex flex-wrap gap-1.5">
              <span v-for="tag in step.tags" :key="tag"
                    class="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700">{{tag}}</span>
            </div>
          </div>
          <div v-if="i < steps.length - 1" class="flex items-center justify-center text-2xl text-indigo-400" aria-hidden="true">
            <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
          </div>
        </div>
      </div>

      <div class="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3.5 dark:border-emerald-900 dark:bg-emerald-950/30">
        <span class="mt-0.5 text-lg" aria-hidden="true">🔒</span>
        <p class="text-sm leading-6 text-slate-700 dark:text-slate-200">
          <b class="text-slate-900 dark:text-white">Nothing is sent to Gemini during the crawl itself.</b>
          The workspace is private and local, so noisy navigation, duplicate content and extraction mistakes
          are visible - and fixable - before they can affect retrieval quality or cost you an embedding.
        </p>
      </div>
    </section>`,
    setup() {
        const steps = [
            { name:'Fetch', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Crawl within the boundaries you set and write clean Markdown into a private per-user workspace.',
              code:'App_Data/…/gemini/imports/<domain>/',
              tags:['Include/exclude','Max pages & depth','robots.txt'] },
            { name:'Clean', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'Apply ordered regex transforms to strip navigation, footers and boilerplate, then read the result page by page.',
              tags:['Ordered rules','Capture groups','View crawled pages'] },
            { name:'Hand off', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Import this folder opens the normal Folder pipeline with the workspace path and metadata pre-populated.',
              tags:['Previews','Recurring sync','import.json'] },
        ]
        return { steps }
    }
}

/** How a crawled URL becomes a file path in the workspace */
const CrawlPathMap = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Clean paths</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">How a URL becomes a document</h3>
      </div>
      <div class="divide-y divide-slate-200 dark:divide-slate-700">
        <div v-for="row in rows" :key="row.url"
             class="flex flex-col gap-2 px-6 py-3.5 sm:flex-row sm:items-center sm:gap-4 sm:px-8">
          <code class="min-w-0 flex-1 truncate rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">{{row.url}}</code>
          <span class="shrink-0 text-slate-400" aria-hidden="true">→</span>
          <code class="min-w-0 flex-1 truncate rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs text-emerald-300 dark:bg-black/50">{{row.file}}</code>
        </div>
      </div>
      <p class="border-t border-slate-200 px-6 py-4 text-sm leading-6 text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:px-8">
        Each file begins with frontmatter carrying the page's title, source URL, path, query string,
        description and tags - and that per-page metadata overwrites matching crawl-wide defaults.
      </p>
    </section>`,
    setup() {
        const rows = [
            { url:'/docs/templates/next-rsc', file:'docs/templates/next-rsc.md' },
            { url:'/docs/', file:'docs/index.md' },
            { url:'/  (site root)', file:'index.md' },
            { url:'http://localhost:5000', file:'localhost-5000/  (import folder)' },
        ]
        return { rows }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        CrawlStages,
        CrawlPathMap,
    }
}
