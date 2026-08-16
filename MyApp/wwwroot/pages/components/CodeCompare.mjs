import { computed, ref } from "vue"

/** Trim the common leading indentation so code can be indented to match its surrounding source */
function dedent(text) {
    const lines = String(text ?? '').replace(/\t/g, '    ').split('\n')
    while (lines.length && !lines[0].trim()) lines.shift()
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop()
    if (!lines.length) return ''
    const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length))
    return lines.map(l => l.slice(indent)).join('\n')
}

const escapeHtml = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Highlight with the page's global highlight.js when available, otherwise render escaped text */
function highlight(code, lang) {
    const src = dedent(code)
    const hljs = globalThis.hljs
    try {
        if (hljs && lang && hljs.getLanguage(lang)) {
            return hljs.highlight(src, { language: lang, ignoreIllegals: true }).value
        }
    } catch { /* fall through to plain text */ }
    return escapeHtml(src)
}

/**
 * Side-by-side "what you write" vs "what you'd otherwise write / what you get" comparison,
 * switchable between several scenarios.
 *
 *   <CodeCompare eyebrow="…" title="…" :tabs="[{
 *      name:'Define',
 *      left:  { label:'You write', lang:'csharp', code:'…' },
 *      right: { label:'You get', items:[{ title:'…', text:'…' }] },  // or lang + code
 *      footnote:'…' }]" />
 */
export default {
    props: {
        eyebrow: String,
        title: String,
        description: String,
        /** [{ name, left:{label,badge,lang,code}, right:{label,badge,lang,code,items:[{title,text}]}, footnote }] */
        tabs: { type: Array, default: () => [] },
    },
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p v-if="eyebrow" class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">{{eyebrow}}</p>
        <h3 v-if="title" class="mt-1 text-xl font-bold text-slate-900 dark:text-white">{{title}}</h3>
        <p v-if="description" class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">{{description}}</p>
        <div class="mt-5 flex flex-wrap gap-2">
          <button v-for="(tab,index) in tabs" :key="tab.name" type="button" @click="selected=index"
            :class="['rounded-full px-4 py-2 text-sm font-semibold transition', selected === index
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">
            {{tab.name}}
          </button>
        </div>
      </div>

      <div v-if="active" class="grid divide-y divide-slate-200 dark:divide-slate-700 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <div v-for="pane in [active.left, active.right]" :key="pane.label" class="flex min-w-0 flex-col">
          <div class="flex items-center justify-between gap-3 bg-slate-50 px-5 py-3 dark:bg-slate-800/60">
            <span class="text-sm font-bold text-slate-900 dark:text-white">{{pane.label}}</span>
            <span v-if="pane.badge"
                  :class="['rounded-full px-2.5 py-1 text-xs font-bold', pane.tone === 'muted'
                    ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300']">{{pane.badge}}</span>
          </div>

          <!-- Deliberately not a <pre> - the site's global \`pre\` rule sets min-width:fit-content and an
               !important background, which would break out of this grid cell and clash with the panel. -->
          <div v-if="pane.code" class="min-w-0 flex-1 overflow-x-auto bg-slate-950 p-5"><code
              class="block w-max min-w-full whitespace-pre bg-transparent p-0 font-mono text-[13px] leading-6 text-slate-300"
              v-html="render(pane)"></code></div>

          <ul v-else-if="pane.items?.length" class="flex-1 divide-y divide-slate-100 dark:divide-slate-800">
            <li v-for="item in pane.items" :key="item.title" class="flex items-start gap-3 px-5 py-3.5">
              <span class="mt-0.5 shrink-0 text-emerald-500">✓</span>
              <div class="min-w-0">
                <div class="text-sm font-semibold text-slate-900 dark:text-white">{{item.title}}</div>
                <div v-if="item.text" class="mt-0.5 text-sm leading-6 text-slate-500 dark:text-slate-400">{{item.text}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <p v-if="active?.footnote" class="border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300 sm:px-8">
        {{active.footnote}}
      </p>
    </section>`,
    setup(props) {
        const selected = ref(0)
        const active = computed(() => props.tabs[selected.value])
        const render = pane => highlight(pane.code, pane.lang)
        return { selected, active, render }
    }
}
