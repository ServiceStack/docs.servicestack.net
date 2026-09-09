import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** The trade-offs worth knowing before you commit */
const KnownLimits = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Deliberate trade-offs</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Worth knowing before you commit</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          These are consequences of OrmLite’s design rather than gaps waiting to be filled - each one buys something
          elsewhere, and each has a documented way around it.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="l in limits" :key="l.name"
             class="flex flex-col rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm dark:border-amber-900 dark:bg-amber-950/20">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{l.icon}}</span>
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{l.name}}</div>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{{l.text}}</p>
          <p class="mt-3 border-t border-amber-200/60 pt-2.5 text-sm leading-6 text-slate-600 dark:border-amber-900/60 dark:text-slate-300">
            <b class="text-slate-900 dark:text-white">Work with it:</b> {{l.workaround}}
          </p>
        </div>
      </div>
    </section>`,
    setup() {
        const limits = [
            { icon:'🔑', name:'A single primary key', text:'Each model needs one primary key - Id by convention - so the same POCO can persist to a key-value store, a cache or the filesystem, not only an RDBMS.',
              workaround:'Use [Alias] to point at a differently-named column, or [PrimaryKey] to nominate another property. Tables without one can still be SELECTed - you just lose the ById APIs and the implied-filter Update and Delete.' },
            { icon:'🔤', name:'LIKE uses UPPER() by default', text:'To keep case-insensitive LIKE behaving the same on every RDBMS, OrmLite wraps both sides in UPPER() - which stops the database using an index on that column.',
              workaround:'Set OrmLiteConfig.StripUpperInLike = true to get the native RDBMS behavior back and let LIKE searches - including AutoQuery’s - use any available index.' },
        ]
        return { limits }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, KnownLimits }
}
