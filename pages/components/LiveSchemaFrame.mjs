export default {
    props: {
        eyebrow: String,
        title: String,
        description: String,
        uiUrl: String,
        schemaUrl: String,
        apiUrl: String,
        height: { type: Number, default: 680 },
    },
    template: `
      <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-5 py-5 dark:border-slate-700 sm:px-7">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="max-w-2xl">
              <p class="text-xs font-bold uppercase tracking-[.18em] text-emerald-600 dark:text-emerald-400">{{ eyebrow }}</p>
              <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">{{ title }}</h3>
              <p class="mt-2 leading-7 text-slate-600 dark:text-slate-300">{{ description }}</p>
            </div>
            <div class="flex flex-wrap gap-2 text-sm font-semibold">
              <a :href="uiUrl" target="_blank" rel="noopener" class="rounded-full bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">Open full UI ↗</a>
              <a :href="schemaUrl" target="_blank" rel="noopener" class="rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">View JSON ↗</a>
              <a v-if="apiUrl" :href="apiUrl" target="_blank" rel="noopener" class="rounded-full bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">Call API ↗</a>
            </div>
          </div>
        </div>
        <iframe :src="uiUrl" :title="title" :style="{ height: height + 'px' }" class="block w-full border-0 bg-white" allow="clipboard-write"></iframe>
        <div class="border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-400 sm:px-7">
          Live from blazor-gallery.servicestack.net — this is the schema-generated UI, not a screenshot.
        </div>
      </section>`,
}
