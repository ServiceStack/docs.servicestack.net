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
function highlight(src, lang) {
    const hljs = globalThis.hljs
    try {
        if (hljs && lang && hljs.getLanguage(lang)) {
            return hljs.highlight(src, { language: lang, ignoreIllegals: true }).value
        }
    } catch { /* fall through to plain text */ }
    return escapeHtml(src)
}

/**
 * Render prose that may contain `backticked` symbols as inline code.
 * The text is escaped first, so identifiers containing angle brackets -
 * `ICreateDb<Booking>` - are safe to write literally in the slide content.
 */
const INLINE_CODE = 'rounded bg-slate-100 px-1 py-0.5 font-mono text-[.9em] font-semibold ' +
    'text-indigo-700 dark:bg-slate-800 dark:text-indigo-300'
function inlineCode(text) {
    return escapeHtml(text ?? '')
        .replace(/`([^`]+)`/g, `<code class="${INLINE_CODE}">$1</code>`)
}

/**
 * Split highlighted HTML into one string per source line, re-opening any spans that
 * straddle a line break so each line is independently renderable (and dimmable).
 * hljs only ever emits <span …> / </span>, so a simple tag stack is sufficient.
 */
function splitHighlightedLines(html) {
    const lines = []
    const stack = []
    let current = ''
    for (const token of html.match(/<[^>]*>|[^<]+/g) ?? []) {
        if (token[0] === '<') {
            if (token[1] === '/') stack.pop()
            else if (!token.endsWith('/>')) stack.push(token)
            current += token
        } else {
            const parts = token.split('\n')
            parts.forEach((part, i) => {
                if (i > 0) {
                    lines.push(current + '</span>'.repeat(stack.length))
                    current = stack.join('')
                }
                current += part
            })
        }
    }
    lines.push(current)
    return lines
}

/**
 * A "one contract, everything else generated" slide deck.
 *
 * The Request DTO stays pinned on the left of every slide - dimming down to just the
 * lines responsible for the current slide - while the right pane cycles through each
 * artifact ServiceStack generates from it.
 *
 *   <DtoValueDeck eyebrow="…" title="…" :contract="{ label:'…', lang:'csharp', code:'…' }"
 *                 :slides="[{ name:'REST API', icon:'⇄', title:'…', cost:'0 lines',
 *                             focus:['public class'], description:'…',
 *                             code:{ label:'…', lang:'json', code:'…' },
 *                             items:[{ title:'…', text:'…' }],
 *                             chips:{ label:'…', values:['…'] },
 *                             img:{ src:'…', alt:'…', w:1280, h:720 },
 *                             href:'/docs', linkText:'…' }]" />
 */
/** Prev/next arrows - rendered in both the deck header and the footer bar */
const DeckNav = {
    emits: ['step'],
    template: `
    <div class="flex shrink-0 items-center gap-2">
      <button type="button" @click="$emit('step', -1)" aria-label="Previous slide"
        class="rounded-lg bg-white p-2 text-slate-500 ring-1 ring-slate-200 transition hover:text-indigo-600 hover:ring-indigo-300 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700 dark:hover:text-indigo-400">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19l-7-7 7-7"/></svg>
      </button>
      <button type="button" @click="$emit('step', 1)" aria-label="Next slide"
        class="rounded-lg bg-white p-2 text-slate-500 ring-1 ring-slate-200 transition hover:text-indigo-600 hover:ring-indigo-300 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700 dark:hover:text-indigo-400">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>`,
}

export default {
    components: { DeckNav },
    props: {
        eyebrow: String,
        title: String,
        description: String,
        /** { label, badge, lang, code } - the single DTO every slide is generated from */
        contract: { type: Object, default: () => ({}) },
        /** [{ name, icon, title, kicker, cost, focus, description, code, items, chips, img, href, linkText }] */
        slides: { type: Array, default: () => [] },
    },
    template: `
    <section tabindex="0" @keydown.left.prevent="step(-1)" @keydown.right.prevent="step(1)" :aria-label="title"
             class="@container not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm outline-none ring-indigo-500/40 focus-visible:ring-2 dark:border-slate-700 dark:bg-slate-900">

      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <div class="flex items-start justify-between gap-6">
          <div class="min-w-0">
            <p v-if="eyebrow" class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">{{eyebrow}}</p>
            <h3 v-if="title" class="mt-1 text-balance text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{{title}}</h3>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <span class="tabular-nums text-xs font-bold text-slate-400 dark:text-slate-500">{{index_ + 1}} / {{slides.length}}</span>
            <DeckNav @step="step" />
          </div>
        </div>
        <p v-if="description" class="mt-2 max-w-3xl text-pretty leading-7 text-slate-600 dark:text-slate-300">{{description}}</p>
      </div>

      <div class="grid @min-[60rem]:grid-cols-7">

        <!-- The contract: pinned, identical on every slide -->
        <div class="flex min-w-0 flex-col border-b border-slate-200 bg-slate-950 dark:border-slate-700 @min-[60rem]:col-span-3 @min-[60rem]:border-b-0 @min-[60rem]:border-r">
          <div class="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
            <span class="text-xs font-bold uppercase tracking-[.14em] text-slate-400">{{contract.label || 'The contract'}}</span>
            <span v-if="contract.badge" class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300">{{contract.badge}}</span>
          </div>
          <div class="flex-1 overflow-x-auto py-4 @min-[60rem]:sticky @min-[60rem]:top-24">
            <code class="block w-max min-w-full bg-transparent p-0 font-mono text-[12px] leading-[1.7] text-slate-300">
              <div v-for="(line,index) in contractLines" :key="index"
                   :class="['whitespace-pre border-l-2 pl-3.5 pr-4 transition-all duration-300',
                            isFocused(index) ? 'border-emerald-400 bg-emerald-400/10 opacity-100'
                              : hasFocus ? 'border-transparent opacity-60'
                              : 'border-transparent opacity-100']"
                   v-html="line || '&nbsp;'"></div>
            </code>
          </div>
          <p class="border-t border-white/10 px-5 py-3 text-[11px] leading-5 text-slate-500">
            <template v-if="hasFocus">Highlighted: the part of the contract driving this slide.</template>
            <template v-else>This never changes. Everything else here is generated from it.</template>
          </p>
        </div>

        <!-- What you get -->
        <div v-if="active" class="flex min-w-0 flex-col @min-[60rem]:col-span-4">
          <div class="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/60">
            <div class="flex min-w-0 items-center gap-2.5">
              <span aria-hidden="true" class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-[12px] font-bold text-white">{{active.icon}}</span>
              <span class="truncate text-sm font-bold text-slate-900 dark:text-white">{{active.title}}</span>
            </div>
            <span v-if="active.cost" class="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{{active.cost}}</span>
          </div>

          <div class="flex-1 px-5 py-5 sm:px-6">
            <p v-if="active.kicker" class="text-xs font-bold uppercase tracking-[.16em] text-indigo-600 dark:text-indigo-400">{{active.kicker}}</p>
            <p v-if="active.description" class="mt-2 text-pretty leading-7 text-slate-600 dark:text-slate-300" v-html="inline(active.description)"></p>

            <component v-if="active.img" :is="active.href ? 'a' : 'div'" :href="active.href"
               class="mt-4 block overflow-hidden rounded-xl bg-slate-900/5 p-1.5 ring-1 ring-inset ring-slate-900/10 dark:bg-white/5 dark:ring-white/10">
              <img :src="active.img.src" :alt="active.img.alt || active.title"
                   :width="active.img.w || 1280" :height="active.img.h || 720" loading="lazy"
                   class="w-full rounded-lg shadow-xl ring-1 ring-slate-900/10 dark:ring-white/10">
            </component>

            <div v-if="active.code" class="mt-4 overflow-hidden rounded-xl ring-1 ring-inset ring-slate-900/10 dark:ring-white/10">
              <div v-if="active.code.label" class="bg-slate-800 px-4 py-2 font-mono text-[11px] font-semibold tracking-wide text-slate-400">{{active.code.label}}</div>
              <div class="min-w-0 overflow-x-auto bg-slate-950 p-4"><code
                  class="block w-max min-w-full whitespace-pre bg-transparent p-0 font-mono text-[12.5px] leading-6 text-slate-300"
                  v-html="renderCode(active.code)"></code></div>
            </div>

            <ul v-if="active.items?.length" class="mt-4 space-y-2.5">
              <li v-for="item in active.items" :key="item.title" class="flex items-start gap-3">
                <span aria-hidden="true" class="mt-0.5 shrink-0 text-emerald-500">✓</span>
                <div class="min-w-0">
                  <span class="text-sm font-semibold text-slate-900 dark:text-white" v-html="inline(item.title)"></span>
                  <span v-if="item.text" class="text-sm leading-6 text-slate-500 dark:text-slate-400"> — <span v-html="inline(item.text)"></span></span>
                </div>
              </li>
            </ul>

            <div v-if="active.chips?.values?.length" class="mt-4">
              <p v-if="active.chips.label" class="text-xs font-semibold uppercase tracking-wider text-slate-400">{{active.chips.label}}</p>
              <div class="mt-2 flex flex-wrap gap-1.5">
                <span v-for="chip in active.chips.values" :key="chip"
                      class="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11.5px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{chip}}</span>
              </div>
            </div>

            <p v-if="active.href" class="mt-5 text-sm">
              <a :href="active.href" class="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">{{active.linkText || active.title}} <span aria-hidden="true">→</span></a>
            </p>
          </div>
        </div>
      </div>

      <!-- Deck controls -->
      <div class="border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800/40 sm:px-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="text-sm font-semibold text-slate-500 dark:text-slate-400">
            <span class="tabular-nums text-slate-900 dark:text-white">{{index_ + 1}}</span> / {{slides.length}} things you didn't have to write
          </p>
          <DeckNav @step="step" />
        </div>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <button v-for="(slide,index) in slides" :key="slide.name" type="button" @click="index_ = index"
            :class="['rounded-full px-3 py-1.5 text-xs font-bold transition', index_ === index
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700']">
            {{slide.name}}
          </button>
        </div>
      </div>
    </section>`,
    setup(props) {
        const index_ = ref(0)
        const active = computed(() => props.slides[index_.value])

        const source = computed(() => dedent(props.contract.code))
        const sourceLines = computed(() => source.value.split('\n'))
        const contractLines = computed(() => splitHighlightedLines(highlight(source.value, props.contract.lang || 'csharp')))

        const hasFocus = computed(() => !!active.value?.focus?.length)
        const isFocused = index => hasFocus.value &&
            active.value.focus.some(match => (sourceLines.value[index] ?? '').includes(match))

        const step = by => {
            const n = props.slides.length
            index_.value = (index_.value + by + n) % n
        }
        const renderCode = pane => highlight(dedent(pane.code), pane.lang)

        return { index_, active, contractLines, hasFocus, isFocused, step, renderCode, inline: inlineCode }
    }
}
