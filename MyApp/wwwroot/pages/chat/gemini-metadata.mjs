import { computed, ref } from "vue"
import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** The two jobs metadata does, and the fields that do each one */
const MetadataJobs = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div v-for="job in jobs" :key="job.title"
           :class="['rounded-2xl border p-6 shadow-sm sm:p-7', job.accent]">
        <div class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm dark:bg-slate-900/70">{{job.icon}}</span>
          <div>
            <div class="text-lg font-bold text-slate-900 dark:text-white">{{job.title}}</div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{job.tagline}}</div>
          </div>
        </div>
        <p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{{job.text}}</p>
        <dl class="mt-5 space-y-2">
          <div v-for="field in job.fields" :key="field.name"
               class="flex flex-col gap-1 rounded-xl bg-white/80 px-3.5 py-2.5 ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10 sm:flex-row sm:items-baseline sm:gap-3">
            <dt class="shrink-0 text-sm font-bold text-slate-900 dark:text-white sm:w-24">{{field.name}}</dt>
            <dd class="min-w-0 flex-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              <code class="inline-block max-w-full break-words rounded bg-slate-100 px-1.5 py-0.5 align-middle text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{field.example}}</code>
              <span class="ml-1.5">{{field.text}}</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>`,
    setup() {
        const jobs = [
            { icon:'🎯', title:'Narrow what a question searches', tagline:'Retrieval scope',
              accent:'border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'These become facet filters in Explorer, the scope of a grounded chat, and the server-enforced scope of every published Search widget and Assistant.',
              fields:[
                { name:'Category', example:'guides/auth', text:'Hierarchical location, derived at import.' },
                { name:'Doc type', example:'guide', text:'reference, api, faq, policy, changelog…' },
                { name:'Status', example:'published', text:'draft, deprecated, archived.' },
                { name:'Locale', example:'en-AU', text:'One locale per document.' },
                { name:'Product', example:'ServiceStack', text:'Product, module or service owner.' },
                { name:'Versions', example:'v2, v3', text:'A list - each value is independently searchable.' },
                { name:'Tags', example:'redis, security', text:'A list of topic labels.' },
              ] },
            { icon:'🔗', title:'Decide where a citation leads', tagline:'Durable evidence',
              accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Without a Source URL a citation falls back to Gemini’s URI or the locally cached download - neither of which is a page you can send a customer to.',
              fields:[
                { name:'Source URL', example:'https://docs.example.com/guides/auth', text:'Canonical public page opened by citations.' },
              ] },
        ]
        return { jobs }
    }
}

/** Interactive Source URL template resolver */
const SourceUrlBuilder = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Try it</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Source URL template builder</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Pick a sample document, edit the template, and click a variable to append it. This resolves the
          same placeholders the import does, including the optional
          <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">{variable:/pattern/}</code> form.
        </p>
      </div>

      <div class="px-6 py-5 sm:px-8">
        <!-- sample document -->
        <div class="flex flex-wrap gap-2">
          <button v-for="(doc,i) in docs" :key="doc.label" type="button" @click="select(i)"
            :class="['rounded-full px-4 py-2 text-sm font-semibold transition', selected === i
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">
            {{doc.label}}
          </button>
        </div>

        <div class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/50">
          <span class="font-bold text-slate-500 dark:text-slate-400">Source file</span>
          <code class="ml-2 text-slate-800 dark:text-slate-200">{{doc.fullPath}}</code>
          <span v-if="doc.categoryRoot" class="ml-3 font-bold text-slate-500 dark:text-slate-400">Category root</span>
          <code v-if="doc.categoryRoot" class="ml-2 text-slate-800 dark:text-slate-200">{{doc.categoryRoot}}</code>
        </div>

        <!-- template input -->
        <label class="mt-5 block text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Source URL template</label>
        <input v-model="template" spellcheck="false"
               class="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-mono text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-white">

        <div class="mt-3 flex flex-wrap gap-1.5">
          <button v-for="v in variables" :key="v.name" type="button" @click="append(v.name)"
            :disabled="doc.values[v.name] == null"
            :class="['rounded-lg px-2.5 py-1.5 font-mono text-xs font-semibold transition', doc.values[v.name] == null
              ? 'cursor-not-allowed bg-slate-100 text-slate-300 line-through dark:bg-slate-800 dark:text-slate-600'
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-600 dark:hover:text-white']">
            {{'{'}}{{v.name}}{{'}'}}
          </button>
          <button type="button" @click="template = doc.template"
            class="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 underline decoration-dotted hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400">
            reset
          </button>
        </div>

        <!-- result -->
        <div class="mt-5 rounded-xl border-2 p-4"
             :class="result.ok
               ? 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25'
               : 'border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/25'">
          <div class="text-[11px] font-black uppercase tracking-wider"
               :class="result.ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'">
            {{ result.ok ? 'Resolved Source URL' : 'No Source URL for this document' }}
          </div>
          <code v-if="result.ok" class="mt-1.5 block break-all font-mono text-sm text-slate-900 dark:text-white">{{result.url}}</code>
          <p v-else class="mt-1.5 text-sm leading-6 text-slate-700 dark:text-slate-200">{{result.reason}}</p>
        </div>

        <!-- resolved variable table -->
        <div class="mt-5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
          <table class="w-full text-left text-sm">
            <thead class="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
              <tr><th class="px-4 py-2.5 font-bold">Variable</th><th class="px-4 py-2.5 font-bold">Value for this document</th><th class="hidden px-4 py-2.5 font-bold sm:table-cell">Meaning</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr v-for="v in variables" :key="v.name" class="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-900 dark:even:bg-slate-800/30">
                <td class="px-4 py-2.5"><code class="text-xs text-indigo-600 dark:text-indigo-400">{{'{'}}{{v.name}}{{'}'}}</code></td>
                <td class="px-4 py-2.5">
                  <code v-if="doc.values[v.name] != null" class="text-xs text-slate-700 dark:text-slate-200">{{doc.values[v.name]}}</code>
                  <span v-else class="text-xs italic text-slate-400 dark:text-slate-500">not available</span>
                </td>
                <td class="hidden px-4 py-2.5 text-xs text-slate-500 dark:text-slate-400 sm:table-cell">{{v.text}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
          A document that can’t resolve its template omits its Source URL and logs a warning - it doesn’t stop
          the import. Choose <b class="text-slate-700 dark:text-slate-200">Require a Source URL</b> to exclude
          those documents instead, which is how Razor layouts and partials are kept out of the index entirely.
        </p>
      </div>
    </section>`,
    setup() {
        const variables = [
            { name:'fullPath',  text:'Full source path.' },
            { name:'path',      text:'Path after removing Category root.' },
            { name:'pathNoExt', text:'Root-relative path without extension.' },
            { name:'dir',       text:'Directory portion of the full path.' },
            { name:'filename',  text:'Filename with extension.' },
            { name:'name',      text:'Filename without extension.' },
            { name:'ext',       text:'Extension without a leading dot.' },
            { name:'category',  text:'Final category, including any destination prefix.' },
            { name:'title',     text:'Extracted document title, falling back to {name}.' },
            { name:'route',     text:'Route from a quoted Razor @page directive.' },
        ]
        const docs = [
            { label:'Markdown doc', fullPath:'docs/guides/auth.md', categoryRoot:'docs',
              template:'https://docs.example.com/{pathNoExt}',
              values:{ fullPath:'docs/guides/auth.md', path:'guides/auth.md', pathNoExt:'guides/auth',
                       dir:'docs/guides', filename:'auth.md', name:'auth', ext:'md',
                       category:'guides', title:'Authentication', route:null } },
            { label:'Razor page', fullPath:'Pages/AddReference.cshtml', categoryRoot:'',
              template:'https://servicestack.net{route}',
              values:{ fullPath:'Pages/AddReference.cshtml', path:'Pages/AddReference.cshtml', pathNoExt:'Pages/AddReference',
                       dir:'Pages', filename:'AddReference.cshtml', name:'AddReference', ext:'cshtml',
                       category:'Pages', title:'Add ServiceStack Reference', route:'/add-servicestack-reference' } },
            { label:'Razor layout (no @page)', fullPath:'Pages/Shared/_Layout.cshtml', categoryRoot:'',
              template:'https://servicestack.net{route}',
              values:{ fullPath:'Pages/Shared/_Layout.cshtml', path:'Pages/Shared/_Layout.cshtml', pathNoExt:'Pages/Shared/_Layout',
                       dir:'Pages/Shared', filename:'_Layout.cshtml', name:'_Layout', ext:'cshtml',
                       category:'Pages/Shared', title:'_Layout', route:null } },
            { label:'Dated blog post', fullPath:'posts/2026-09-04_servicestack-pdf.md', categoryRoot:'posts',
              template:'https://servicestack.net/posts/{name:/^[^_]+_(.+)$/}',
              values:{ fullPath:'posts/2026-09-04_servicestack-pdf.md', path:'2026-09-04_servicestack-pdf.md',
                       pathNoExt:'2026-09-04_servicestack-pdf', dir:'posts',
                       filename:'2026-09-04_servicestack-pdf.md', name:'2026-09-04_servicestack-pdf', ext:'md',
                       category:'posts', title:'Rendering PDFs with ServiceStack', route:null } },
        ]

        const selected = ref(0)
        const doc = computed(() => docs[selected.value])
        const template = ref(docs[0].template)
        const select = i => { selected.value = i; template.value = docs[i].template }
        const append = name => { template.value += '{' + name + '}' }

        /** Resolve {name} and {name:/pattern/}, mirroring the import's placeholder rules */
        const result = computed(() => {
            const values = doc.value.values
            let missing = null, badPattern = null
            const url = template.value.replace(/\{(\w+)(?::\/(.*?)\/)?\}/g, (_, name, pattern) => {
                const key = variables.find(v => v.name.toLowerCase() === name.toLowerCase())?.name
                const value = key ? values[key] : null
                if (value == null) { missing ??= name; return '' }
                if (!pattern) return value
                try {
                    const m = new RegExp(pattern).exec(value)
                    if (!m) { missing ??= name; return '' }
                    return m[1] ?? m[0]
                } catch { badPattern ??= pattern; return '' }
            })
            if (badPattern) return { ok:false, reason:`The pattern /${badPattern}/ isn't a valid regular expression. Patterns are validated when the template is saved.` }
            if (missing) return { ok:false, reason:`{${missing}} has no value for this document, so its Source URL is omitted and a warning is logged. Previewing or importing the remaining documents continues.` }
            return { ok:true, url }
        })

        return { variables, docs, selected, doc, template, select, append, result }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        MetadataJobs,
        SourceUrlBuilder,
    }
}
