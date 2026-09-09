import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Why a key beats a password for system-to-system callers */
const KeyRationale = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Why public APIs use keys</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">A key is a better credential than a password</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="r in reasons" :key="r.name"
             class="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg dark:bg-slate-800">{{r.icon}}</span>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span class="font-bold text-slate-900 dark:text-white">{{r.name}}</span>
              <span v-if="r.stat" class="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {{r.stat}} <span class="font-normal opacity-70">{{r.statLabel}}</span>
              </span>
            </div>
            <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{r.text}}</p>
          </div>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">For new .NET 10 Apps use the <a href="/auth/apikeys" class="underline decoration-dotted">ApiKeysFeature</a> instead.</b>
        This provider ties a key to a user account and grants it that user’s full access; the newer feature separates
        keys from users entirely and supports scopes and per-API restrictions.
      </p>
    </section>`,
    setup() {
        const reasons = [
            { icon:'🔌', name:'Simple', text:'Integrates with existing HTTP Auth - a bearer token in a header, nothing bespoke to implement.' },
            { icon:'🧯', name:'Independent of passwords', text:'Limits exposure of the far more sensitive master password, and a password reset doesn’t break every integration configured with a key.' },
            { icon:'🎲', name:'High entropy', text:'Generated from a secure random number generator rather than chosen by a human.', stat:'24 bytes', statLabel:'vs 16 for a Guid' },
            { icon:'⚡', name:'Fast to validate', text:'Checked with a datastore index rather than a deliberately slow password hash - the property that makes hashing safe makes it expensive.' },
        ]
        return { reasons }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, KeyRationale }
}
