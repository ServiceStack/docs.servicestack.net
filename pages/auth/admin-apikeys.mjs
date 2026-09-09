import Templates, { Index } from "../templates/Templates.mjs"
import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

const AuthTemplates = {
    components: { Templates },
    template:`<Templates :templates="[Index['blazor'], Index['blazor-vue'], Index['razor'], Index['mvc']]" hide="demo" />`,
    setup() {
        return { Index }
    }
}

/** Full user auth vs the API-key-only story */
const SimpleAuthChoice = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Not every App needs users</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">How much Auth machinery does this App actually need?</h3>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <div v-for="o in options" :key="o.name"
             :class="['flex flex-col rounded-2xl border-2 p-6 shadow-sm', o.accent]">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="text-lg font-bold text-slate-900 dark:text-white">{{o.name}}</div>
              <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{o.tagline}}</div>
            </div>
            <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', o.tint]">{{o.badge}}</span>
          </div>

          <div class="mt-4 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">You take on</div>
          <ul class="mt-2 flex flex-wrap gap-1.5">
            <li v-for="c in o.carries" :key="c"
                class="rounded-lg bg-white/80 px-2.5 py-1 text-xs text-slate-700 ring-1 ring-black/5 dark:bg-slate-900/70 dark:text-slate-300 dark:ring-white/10">{{c}}</li>
          </ul>

          <div class="mt-4 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Fits</div>
          <p class="mt-1 flex-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{{o.fits}}</p>

          <code class="mt-4 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] text-emerald-300 dark:bg-black/50">{{o.cmd}}</code>
        </div>
      </div>

      <p class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        <b class="text-slate-900 dark:text-white">API keys are managed by Admin users</b>, so controlling which trusted
        clients and B2B integrations can reach your functionality stays an operational task rather than a code change.
      </p>
    </section>`,
    setup() {
        const options = [
            { name:'Full Identity Auth', tagline:'Users sign in', badge:'web apps',
              tint:'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              carries:['User registration','Password recovery','Two-factor auth','EF migrations','Token expiration','OAuth integrations'],
              fits:'Applications with real end users who need accounts, profiles and self-service.',
              cmd:'npx add-in auth' },
            { name:'API Keys only', tagline:'Trusted callers, no user database', badge:'recommended here',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              carries:['A key table','An Admin UI'],
              fits:'Stand-alone Apps, microservices and Docker appliances that need to restrict access but have no users to manage.',
              cmd:'npx add-in apikeys-auth' },
        ]
        return { options }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, AuthTemplates, SimpleAuthChoice }
}
