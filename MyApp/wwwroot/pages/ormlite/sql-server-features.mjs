import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** SQL Server capabilities OrmLite exposes directly */
const SqlServerExtras = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Beyond the portable API</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">SQL Server-specific capabilities</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Using any of these ties that code to SQL Server - a deliberate trade you make per query, not per application.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="f in features" :key="f.name"
             class="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg dark:bg-slate-800">{{f.icon}}</span>
          <div class="min-w-0 flex-1">
            <div class="font-bold text-slate-900 dark:text-white">{{f.name}}</div>
            <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{f.text}}</p>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const features = [
            { icon:'🔢', name:'Sequences', text:'SQL Server 2012 sequences as a source of ids, for when an identity column isn’t the right shape.' },
            { icon:'💡', name:'Table hints', text:'Attach a hint such as NOLOCK to a specific query, without hand-writing the whole statement.' },
            { icon:'⚡', name:'Memory-optimized tables', text:'Create and query In-Memory OLTP tables through the same typed API.' },
            { icon:'🧬', name:'SQL Server types', text:'Spatial and hierarchy types supported through Type Converters - which is exactly what that extension point is for.' },
        ]
        return { features }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, SqlServerExtras }
}
