import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Two halves of AI Chat's state, and how they reference each other */
const StorageOverview = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Two halves, one system</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Where AI Chat keeps everything</h3>

      <div class="mt-7 grid gap-4 lg:grid-cols-2">
        <div v-for="half in halves" :key="half.title"
             :class="['rounded-2xl border p-5 shadow-sm', half.accent]">
          <div class="flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm dark:bg-slate-900/70">{{half.icon}}</span>
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white">{{half.title}}</div>
              <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{half.tagline}}</div>
            </div>
          </div>
          <ul class="mt-4 space-y-1.5">
            <li v-for="item in half.items" :key="item.name"
                class="rounded-xl bg-white/80 px-3 py-2 ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10">
              <code class="text-xs font-bold text-slate-900 dark:text-white">{{item.name}}</code>
              <span class="ml-2 text-xs text-slate-500 dark:text-slate-400">{{item.text}}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-5 flex items-start gap-3 rounded-xl border-2 border-amber-300 bg-amber-50/60 px-4 py-3.5 dark:border-amber-800 dark:bg-amber-950/25">
        <span class="mt-0.5 text-lg" aria-hidden="true">⚠</span>
        <p class="text-sm leading-6 text-slate-700 dark:text-slate-200">
          <b class="text-slate-900 dark:text-white">A database backup on its own is not sufficient.</b> Media rows
          reference cache files by hash and Gemini document rows reference cached bytes, so the database and
          <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">App_Data</code> must be backed up together.
        </p>
      </div>
    </section>`,
    setup() {
        const halves = [
            { icon:'🗄', title:'Your database', tagline:'OrmLite, created on startup',
              accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/25',
              items:[
                { name:'ChatThread', text:'one conversation, JSON message history' },
                { name:'ChatRequest', text:'per-request usage, cost and timing' },
                { name:'ChatMedia', text:'generated and uploaded media rows' },
                { name:'Chat* (gemini)', text:'file stores, documents, search, assistants' },
              ] },
            { icon:'📁', title:'App_Data', tagline:'Filesystem state, yours to edit',
              accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              items:[
                { name:'chat/*.json', text:'llms.json, providers.json, providers-extra.json' },
                { name:'chat/cache/', text:'content-addressed assets + .info.json sidecars' },
                { name:'chat/user/{user}/', text:'prefs, projects, profiles, skills, themes, pdf' },
                { name:'pdf/', text:'published templates, .published.json, .versions' },
              ] },
        ]
        return { halves }
    }
}

/** Content-addressed storage in one picture */
const ContentAddressed = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">The same file twice costs one copy</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">The content-addressed cache</h3>
      </div>
      <div class="p-6 sm:p-8">
        <div class="grid items-center gap-3 lg:grid-cols-[1fr_auto_1fr]">
          <div class="grid gap-2">
            <div v-for="src in sources" :key="src"
                 class="rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300">{{src}}</div>
          </div>
          <div class="flex flex-col items-center justify-center gap-1 text-center">
            <code class="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-bold text-white">SHA-256</code>
            <span class="text-2xl text-indigo-400" aria-hidden="true"><span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span></span>
          </div>
          <div class="rounded-2xl border-2 border-indigo-400/50 bg-indigo-50/40 p-4 dark:border-indigo-800 dark:bg-indigo-950/25">
            <code class="block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] text-emerald-300 dark:bg-black/50">cache/{2ch}/{sha256}.{ext}</code>
            <code class="mt-2 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] text-slate-300 dark:bg-black/50">cache/{2ch}/{sha256}.info.json</code>
            <p class="mt-2.5 text-xs leading-5 text-slate-600 dark:text-slate-300">
              Served at <code class="rounded bg-white px-1 py-0.5 dark:bg-slate-900">{RoutePrefix}/~cache/{path}</code>
              to authenticated users, with a sidecar retaining the original name, type, size and date.
            </p>
          </div>
        </div>
        <p class="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Every write fires the <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">cache_saved</code>
          filters - which is how the gallery records media, and where an App can hook uploads of its own.
        </p>
      </div>
    </section>`,
    setup() {
        const sources = ['Chat attachments', 'Generated images and audio', 'Gemini document uploads']
        return { sources }
    }
}

/** What to get right before this goes to production */
const DeploymentChecklist = {
    template: `
    <section class="not-prose my-10 grid gap-3 sm:grid-cols-2">
      <div v-for="item in items" :key="item.name"
           :class="['flex flex-col rounded-2xl border p-5 shadow-sm', item.accent]">
        <div class="flex items-center gap-2.5">
          <span class="text-lg">{{item.icon}}</span>
          <div class="font-bold text-slate-900 dark:text-white">{{item.name}}</div>
        </div>
        <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{item.text}}</p>
      </div>
    </section>`,
    setup() {
        const items = [
            { icon:'💾', name:'Durable storage', accent:'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20',
              text:'App_Data must survive a restart. On an ephemeral filesystem, mount a volume or point AppDataPath at one.' },
            { icon:'🔗', name:'Shared across instances', accent:'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20',
              text:'User workspaces, the cache and published templates are filesystem state - a multi-instance deployment needs App_Data/chat and App_Data/pdf on a shared volume.' },
            { icon:'📌', name:'Pin Typst and fonts', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Deploy the same Typst version and the same fonts used when templates were validated, so published documents render identically.' },
            { icon:'📏', name:'Quota the user folder', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Consider a disk quota on App_Data/chat/user so a runaway Agent can’t fill the disk.' },
            { icon:'🗓', name:'Retention is yours', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'AI Chat never expires data on your behalf. Threads, requests and media persist until deleted - which suits audit requirements, but means the policy is yours to write.' },
            { icon:'🧹', name:'Deleting a user', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Removing App_Data/chat/user/{user} clears their projects, profiles, skills, PDF workspace and preferences in one step.' },
        ]
        return { items }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, StorageOverview, ContentAddressed, DeploymentChecklist }
}
