/**
 * Banner stating where a page sits in the product's lifecycle, and where to go
 * instead. Use on legacy or superseded documentation so a reader knows within a
 * second whether this is the page they want.
 *
 *   <DocStatus status="deprecated" title="…" text="…"
 *              :links="[{ text:'Identity Auth', href:'/auth/identity-auth' }]" />
 */
const styles = {
    current:    { icon:'✓', accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25', tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', label:'Current' },
    legacy:     { icon:'🗄', accent:'border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/25',       tint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',          label:'Legacy' },
    deprecated: { icon:'⚠', accent:'border-rose-300 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20',           tint:'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',              label:'Deprecated' },
}

export default {
    props: {
        status: { type: String, default: 'legacy' },
        title: String,
        text: String,
        /** [{ text, href }] - where to go instead */
        links: { type: Array, default: () => [] },
    },
    template: `
    <section :class="['not-prose my-8 rounded-2xl border-2 p-5 shadow-sm sm:p-6', style.accent]">
      <div class="flex flex-wrap items-center gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm dark:bg-slate-900/70">{{style.icon}}</span>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-base font-bold text-slate-900 dark:text-white">{{title}}</span>
            <span :class="['rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', style.tint]">{{style.label}}</span>
          </div>
        </div>
      </div>
      <p v-if="text" class="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{{text}}</p>
      <div v-if="links.length" class="mt-4 flex flex-wrap gap-2">
        <a v-for="link in links" :key="link.href" :href="link.href"
           class="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-600 hover:text-white hover:ring-indigo-600 dark:bg-slate-900 dark:text-indigo-300 dark:ring-indigo-800">
          {{link.text}} <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>`,
    computed: {
        style() { return styles[this.status] ?? styles.legacy },
    },
}
