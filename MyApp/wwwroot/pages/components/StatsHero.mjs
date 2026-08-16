import { onMounted, onUnmounted, ref } from "vue"

/**
 * Marketing hero with animated stat counters.
 *
 *   <StatsHero eyebrow="…" title="…" highlight="…" description="…"
 *              :stats="[{ value:15, label:'Typed languages' }]"
 *              :primary="{ text:'Get Started', href:'/…' }"
 *              :secondary="{ text:'Docs', href:'/…' }" />
 *
 * Numeric `value`s count up the first time the component scrolls into view,
 * non-numeric values (e.g. '20+ yrs') are rendered as-is.
 */
export default {
    props: {
        eyebrow: String,
        title: String,
        /** Rendered after `title` in the accent gradient */
        highlight: String,
        description: String,
        /** [{ value, label, prefix, suffix }] */
        stats: { type: Array, default: () => [] },
        primary: Object,
        secondary: Object,
    },
    template: `
    <section ref="root" class="not-prose relative isolate overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 px-6 py-14 shadow-2xl dark:border-slate-800 sm:px-10 sm:py-16">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
        <div class="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl"></div>
        <div class="absolute -bottom-40 -right-16 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"></div>
        <div class="absolute inset-0 opacity-[.07]"
             style="background-image:linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px);background-size:56px 56px"></div>
      </div>

      <div class="mx-auto max-w-4xl text-center">
        <p v-if="eyebrow" class="text-xs font-bold uppercase tracking-[.22em] text-indigo-300">{{eyebrow}}</p>
        <h1 class="mt-4 text-balance text-4xl font-black tracking-tight text-white sm:text-6xl">
          {{title}}
          <span v-if="highlight" class="block bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">{{highlight}}</span>
        </h1>
        <p v-if="description" class="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-300">{{description}}</p>

        <div v-if="primary || secondary" class="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a v-if="primary" :href="primary.href"
             class="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-400">
            {{primary.text}}
          </a>
          <a v-if="secondary" :href="secondary.href"
             class="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/10">
            {{secondary.text}} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <dl v-if="stats.length" class="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-4">
        <div v-for="(stat,i) in stats" :key="stat.label" class="bg-slate-950/80 px-4 py-6 text-center backdrop-blur">
          <dt class="order-2 mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">{{stat.label}}</dt>
          <dd class="order-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
            <span v-if="stat.prefix" class="text-indigo-300">{{stat.prefix}}</span>{{display[i]}}<span v-if="stat.suffix" class="text-indigo-300">{{stat.suffix}}</span>
          </dd>
        </div>
      </dl>
    </section>`,
    setup(props) {
        const root = ref(null)
        const display = ref(props.stats.map(x => typeof x.value === 'number' ? 0 : x.value))
        let observer = null

        function animate() {
            const started = performance.now()
            const duration = 1100
            const tick = now => {
                // easeOutCubic
                const t = Math.min(1, (now - started) / duration)
                const eased = 1 - Math.pow(1 - t, 3)
                display.value = props.stats.map(x => typeof x.value === 'number'
                    ? Math.round(x.value * eased).toLocaleString()
                    : x.value)
                if (t < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
        }

        onMounted(() => {
            if (!props.stats.length) return
            const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
            if (reduced || typeof IntersectionObserver === 'undefined') {
                display.value = props.stats.map(x => typeof x.value === 'number' ? x.value.toLocaleString() : x.value)
                return
            }
            observer = new IntersectionObserver(entries => {
                if (entries.some(e => e.isIntersecting)) {
                    animate()
                    observer.disconnect()
                    observer = null
                }
            }, { threshold: .25 })
            if (root.value) observer.observe(root.value)
        })
        onUnmounted(() => observer?.disconnect())

        return { root, display }
    }
}
