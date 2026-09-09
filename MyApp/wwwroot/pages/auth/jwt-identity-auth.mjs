import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Why a JWT needs no server-side lookup */
const StatelessAuth = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">No Auth state, no I/O</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What makes a JWT worth the trade</h3>

      <div class="mt-7 grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Session cookie</div>
          <div class="mt-3 space-y-2">
            <div v-for="s in session" :key="s" class="flex items-start gap-2.5 rounded-lg bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
              <span class="mt-0.5 shrink-0 text-slate-400">•</span><span>{{s}}</span>
            </div>
          </div>
        </div>
        <div class="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/25">
          <div class="text-sm font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">JWT</div>
          <div class="mt-3 space-y-2">
            <div v-for="j in jwt" :key="j" class="flex items-start gap-2.5 rounded-lg bg-white/80 px-3 py-2 text-sm leading-6 text-slate-700 ring-1 ring-black/5 dark:bg-slate-900/70 dark:text-slate-200 dark:ring-white/10">
              <span class="mt-0.5 shrink-0 text-emerald-500">✓</span><span>{{j}}</span>
            </div>
          </div>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">This is ASP.NET Core’s own JWT authentication.</b> ServiceStack’s
        Identity JWT support configures and integrates with
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">.AddJwtBearer()</code> rather than
        reimplementing it - so token validation, key management and the wider .NET ecosystem behave exactly as documented
        by Microsoft.
      </p>
    </section>`,
    setup() {
        const session = [
            'The server holds session state for every signed-in user.',
            'Validating a request means a cache or database lookup.',
            'Scaling out needs shared session infrastructure.',
        ]
        const jwt = [
            'The token carries its own claims - nothing is stored server-side.',
            'Validation is a signature check, with no I/O at all.',
            'A new instance only needs the signing key to accept traffic.',
        ]
        return { session, jwt }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, StatelessAuth }
}
