import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** What Litestream adds to a SQLite deployment */
const ReplicationModel = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Durability without a database server</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What Litestream adds</h3>

      <div class="mt-7 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="font-bold text-slate-900 dark:text-white">Your App + SQLite</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
            One process, one file on local disk. No connection string to a managed database, and no network hop on
            every query.
          </p>
        </div>
        <div class="flex flex-col items-center justify-center gap-1.5 text-center">
          <code class="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-bold text-white">litestream</code>
          <span class="text-2xl text-indigo-400" aria-hidden="true"><span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span></span>
          <span class="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">continuous</span>
        </div>
        <div class="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/25">
          <div class="font-bold text-slate-900 dark:text-white">Object storage</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Every write streamed to S3-compatible storage, giving you point-in-time recovery from a bucket that costs
            almost nothing to keep.
          </p>
        </div>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-3">
        <div v-for="p in points" :key="p.name"
             class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-sm font-bold text-slate-900 dark:text-white">{{p.name}}</div>
          <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{p.text}}</p>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">This is a single-node story.</b> It buys durability and recovery, not
        horizontal write scaling - see <a href="/ormlite/scalable-sqlite" class="font-semibold underline decoration-dotted">Scalable SQLite</a>
        for how far one node goes and how to structure writes to get there.
      </p>
    </section>`,
    setup() {
        const points = [
            { name:'No managed database bill', text:'The most expensive line item on many small deployments simply disappears.' },
            { name:'Nothing in the request path', text:'Replication happens out of band - queries never wait on it.' },
            { name:'Restore is a command', text:'Recover the database to a point in time from the replica.' },
        ]
        return { points }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, ReplicationModel }
}
