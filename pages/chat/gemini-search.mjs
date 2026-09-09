import { computed, reactive, ref } from "vue"
import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import SearchEngineMatrix from "../components/SearchEngineMatrix.mjs"

/** How a document becomes searchable rows, and what each RDBMS indexes */
const IndexingPipeline = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-emerald-600 dark:text-emerald-400">Local index</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">From document to searchable section</h3>

      <div class="mt-7 grid gap-3 lg:grid-cols-[1fr_auto_1.3fr_auto_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="font-bold text-slate-900 dark:text-white">Text document</div>
          <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Text, Markdown, HTML and Razor. HTML is converted to Markdown first.
          </p>
          <div class="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs leading-5 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            PDF, Word, PowerPoint and Excel reach Gemini but need text conversion to be locally searchable.
          </div>
        </div>

        <div class="flex items-center justify-center text-2xl text-emerald-500" aria-hidden="true">
          <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
        </div>

        <div class="rounded-2xl border-2 border-emerald-500/40 bg-white p-5 shadow-lg shadow-emerald-500/10 dark:bg-slate-900">
          <div class="flex flex-wrap items-center gap-2">
            <code class="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">ChatSearchSection</code>
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">heading-aware rows</span>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            The authoritative searchable content. Snippets strip fenced code, raw HTML and container
            directives while keeping prose and inline code.
          </p>
          <ul class="mt-3 flex flex-wrap gap-1.5">
            <li v-for="f in fields" :key="f"
                class="rounded-lg bg-slate-50 px-2.5 py-1 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{{f}}</li>
          </ul>
        </div>

        <div class="flex items-center justify-center text-2xl text-emerald-500" aria-hidden="true">
          <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="font-bold text-slate-900 dark:text-white">Native full-text index</div>
          <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
            SQLite mirrors the text fields into an FTS5 virtual table; every other provider builds its
            index directly over the section rows.
          </p>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <b class="text-slate-900 dark:text-white">The index is maintained whether or not a Search widget exists.</b>
        Existing File Stores are detected and queued when the App starts, so you can add Search later without
        changing any import definition.
      </p>
    </section>`,
    setup() {
        const fields = ['Frontmatter title','Heading hierarchy','Generated anchor','Source URL','Content','Filterable metadata']
        return { fields }
    }
}

/**
 * Interactive demonstration of how the ranking weights interact.
 * Illustrative: it shows the direction and relative pull of each control on a
 * fixed candidate set - the published widget scores real rows from your index.
 */
const RankingPlayground = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-emerald-600 dark:text-emerald-400">Tune against real results</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">How the ranking weights interact</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Drag a weight and watch the order change for the query
          <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">{{query}}</code>.
          In the product each adjustment re-queries the database immediately, so you tune relevance against
          real results instead of reordering an incomplete client-side list.
        </p>
      </div>

      <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        <!-- controls -->
        <div>
          <div class="flex items-center justify-between">
            <div class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Ranking controls</div>
            <button type="button" @click="reset"
              class="rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 underline decoration-dotted hover:text-indigo-700 dark:text-indigo-400">
              Reset defaults
            </button>
          </div>
          <div class="mt-3 space-y-3.5">
            <div v-for="c in controls" :key="c.key">
              <div class="flex items-baseline justify-between gap-2">
                <label class="text-sm font-semibold text-slate-700 dark:text-slate-200">{{c.label}}</label>
                <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{weights[c.key]}}</code>
              </div>
              <input type="range" v-model.number="weights[c.key]" :min="c.min" :max="c.max" :step="c.step ?? 0.5"
                     class="mt-1.5 w-full accent-emerald-600">
              <div class="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                <span>{{c.min}}</span><span>{{c.hint}}</span><span>{{c.max}}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- results -->
        <div>
          <div class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Ranked results</div>
          <ol class="mt-3 space-y-2">
            <li v-for="(r,i) in ranked" :key="r.title"
                class="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 transition-all duration-300 dark:border-slate-700 dark:bg-slate-800/40">
              <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-xs font-black text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">{{i+1}}</span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span class="font-bold text-slate-900 dark:text-white">{{r.title}}</span>
                  <code class="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-700 dark:text-slate-300">{{r.docType}}</code>
                  <span class="text-[11px] text-slate-400 dark:text-slate-500">updated {{r.ageLabel}}</span>
                </div>
                <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{r.heading}}</div>
                <div class="mt-2 flex flex-wrap gap-1">
                  <span v-for="s in r.signals" :key="s"
                        class="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">{{s}}</span>
                </div>
              </div>
              <div class="shrink-0 text-right">
                <div class="text-lg font-black tabular-nums text-slate-900 dark:text-white">{{r.score.toFixed(1)}}</div>
                <div class="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">score</div>
              </div>
            </li>
          </ol>
          <p class="mt-4 text-xs leading-5 text-slate-400 dark:text-slate-500">
            Illustrative model over a fixed candidate set, to show the direction and relative pull of each
            control. The published widget scores real rows returned by your database.
          </p>
        </div>
      </div>
    </section>`,
    setup() {
        const query = 'auth'
        const defaults = { titleWeight:8, headingWeight:5, contentWeight:1, phraseBoost:4, exactTitleBoost:6, freshnessWeight:20, nativeWeight:2 }
        const controls = [
            { key:'titleWeight',     label:'Title weight',       min:0, max:50, hint:'default 8' },
            { key:'headingWeight',   label:'Heading weight',     min:0, max:50, hint:'default 5' },
            { key:'contentWeight',   label:'Content weight',     min:0, max:50, hint:'default 1' },
            { key:'phraseBoost',     label:'Exact phrase boost', min:0, max:50, hint:'default 4' },
            { key:'exactTitleBoost', label:'Exact title boost',  min:0, max:50, hint:'default 6' },
            { key:'freshnessWeight', label:'Freshness weight',   min:0, max:50, hint:'default 20' },
            { key:'nativeWeight',    label:'Database relevance', min:0, max:20, hint:'default 2' },
        ]
        const weights = reactive({ ...defaults })
        const reset = () => Object.assign(weights, defaults)

        // titleHits / headingHits / contentHits are matches of the query in each field
        const candidates = [
            { title:'Auth', heading:'Overview', docType:'guide', titleHits:1, headingHits:0, contentHits:4,
              exactTitle:true, phrase:true, ageDays:120, ageLabel:'4 months ago', native:0.9 },
            { title:'Authentication and Authorization', heading:'Configuring auth providers', docType:'reference',
              titleHits:1, headingHits:1, contentHits:12, exactTitle:false, phrase:true, ageDays:20, ageLabel:'3 weeks ago', native:1.0 },
            { title:'JWT Auth Provider', heading:'Refresh tokens', docType:'reference',
              titleHits:1, headingHits:0, contentHits:9, exactTitle:false, phrase:true, ageDays:900, ageLabel:'over 2 years ago', native:0.7 },
            { title:'Deployment checklist', heading:'Set up auth secrets', docType:'guide',
              titleHits:0, headingHits:1, contentHits:3, exactTitle:false, phrase:true, ageDays:8, ageLabel:'last week', native:0.5 },
            { title:'Release Notes v10.2', heading:'Hardened ServiceStack', docType:'release-notes',
              titleHits:0, headingHits:0, contentHits:6, exactTitle:false, phrase:false, ageDays:2, ageLabel:'2 days ago', native:0.4 },
        ]

        const halfLifeDays = 365
        const ranked = computed(() => candidates.map(c => {
            const freshness = weights.freshnessWeight * Math.pow(2, -c.ageDays / halfLifeDays)
            const score = c.titleHits   * weights.titleWeight
                        + c.headingHits * weights.headingWeight
                        + c.contentHits * weights.contentWeight
                        + (c.phrase     ? weights.phraseBoost : 0)
                        + (c.exactTitle ? weights.exactTitleBoost : 0)
                        + freshness
                        + c.native * weights.nativeWeight
            const signals = []
            if (c.exactTitle) signals.push('exact title')
            if (c.titleHits) signals.push(`title ×${c.titleHits}`)
            if (c.headingHits) signals.push(`heading ×${c.headingHits}`)
            if (c.contentHits) signals.push(`content ×${c.contentHits}`)
            if (c.phrase) signals.push('phrase match')
            return { ...c, score, signals }
        }).sort((a,b) => b.score - a.score))

        return { query, controls, weights, reset, ranked }
    }
}

/** Everything a visitor can do without touching the mouse */
const SearchInteraction = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div class="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Keyboard</div>
        <dl class="mt-4 space-y-2.5">
          <div v-for="k in keys" :key="k.action" class="flex items-baseline justify-between gap-4 border-b border-dashed border-slate-200 pb-2.5 last:border-0 dark:border-slate-700">
            <dt class="text-sm text-slate-600 dark:text-slate-300">{{k.action}}</dt>
            <dd class="shrink-0">
              <kbd v-for="key in k.keys" :key="key"
                   class="ml-1 rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">{{key}}</kbd>
            </dd>
          </div>
        </dl>
        <p class="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
          Shortcuts never fire from editable inputs. When a Search and an Assistant share a page, Search keeps
          <kbd class="rounded bg-slate-100 px-1 font-mono text-[11px] dark:bg-slate-800">⌘K</kbd> and the
          Assistant automatically moves to
          <kbd class="rounded bg-slate-100 px-1 font-mono text-[11px] dark:bg-slate-800">⌘⇧K</kbd>.
        </p>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div class="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Opening a result</div>
        <div class="mt-4 space-y-3">
          <div v-for="b in behavior" :key="b.name" :class="['rounded-xl border p-4', b.accent]">
            <div class="text-sm font-bold text-slate-900 dark:text-white">{{b.name}}</div>
            <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{b.text}}</p>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const keys = [
            { action:'Open Search', keys:['Ctrl/⌘','K'] },
            { action:'Open Search (alternate)', keys:['/'] },
            { action:'Move through results', keys:['↑','↓'] },
            { action:'Open the selection', keys:['Enter'] },
            { action:'Close the active layer', keys:['Esc'] },
            { action:'Return from an open document', keys:['Esc'] },
        ]
        const behavior = [
            { name:'Has a Source URL', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'The widget navigates to that canonical page and anchor - the outcome you want for a public docs site.' },
            { name:'Markdown with no Source URL', accent:'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40',
              text:'A second dialog opens a sanitized rendered copy. Escape closes it first and returns focus to the results.' },
            { name:'Recently opened', accent:'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40',
              text:'Retained in that browser’s localStorage and offered again the next time Search opens.' },
        ]
        return { keys, behavior }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        SearchEngineMatrix,
        IndexingPipeline,
        RankingPlayground,
        SearchInteraction,
    }
}
