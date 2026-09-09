import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Every completion writes one row, and everything else reads it */
const AnalyticsFlow = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One row per completion</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Where usage data comes from, and who reads it</h3>

      <div class="mt-7 grid items-center gap-4 lg:grid-cols-[1fr_auto_1.1fr]">
        <div class="rounded-2xl border-2 border-indigo-500/40 bg-white p-5 shadow-lg shadow-indigo-500/10 dark:bg-slate-900">
          <code class="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">ChatRequest</code>
          <p class="mt-2.5 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Written for every completion, successful or failed. An ordinary OrmLite table in your own database.
          </p>
          <ul class="mt-3 flex flex-wrap gap-1.5">
            <li v-for="f in fields" :key="f"
                class="rounded bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{{f}}</li>
          </ul>
        </div>

        <div class="flex justify-center text-2xl text-indigo-400" aria-hidden="true">
          <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
        </div>

        <div class="grid gap-3">
          <div v-for="reader in readers" :key="reader.name"
               :class="['rounded-xl border p-4 shadow-sm', reader.accent]">
            <div class="flex items-center justify-between gap-2">
              <div class="text-sm font-bold text-slate-900 dark:text-white">{{reader.name}}</div>
              <code class="shrink-0 text-[11px] text-slate-500 dark:text-slate-400">{{reader.where}}</code>
            </div>
            <p class="mt-1.5 text-xs leading-5 text-slate-600 dark:text-slate-300">{{reader.text}}</p>
          </div>
        </div>
      </div>

      <p class="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Because it’s just a table, nothing stops you querying it yourself - for a monthly invoice, a per-team
        chargeback, or a quota check inside
        <code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">ValidateRequest</code>.
      </p>
    </section>`,
    setup() {
        const fields = ['User','ThreadId','Model','Provider','InputTokens','OutputTokens','Cost','Duration','FinishReason','Error']
        const readers = [
            { name:'Analytics extension', where:'/chat → Analytics', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'For admins, inside the Chat UI - spend and activity next to the conversations that produced it.' },
            { name:'Chat Admin UI', where:'/admin-ui/chat', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'AutoQuery over ChatRequest plus daily and monthly rollups, in ServiceStack’s Admin UI.' },
            { name:'Your own queries', where:'db.From<ChatRequest>()', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Invoicing, chargeback, quota enforcement - the same table, through OrmLite.' },
        ]
        return { fields, readers }
    }
}

/** The admin APIs available for reporting */
const AdminApis = {
    template: `
    <section class="not-prose my-10 grid gap-3 sm:grid-cols-2">
      <div v-for="api in apis" :key="api.name"
           class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <code class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{api.name}}</code>
        <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{api.text}}</p>
      </div>
    </section>`,
    setup() {
        const apis = [
            { name:'AdminQueryChatRequests', text:'AutoQuery over ChatRequest - filter, sort and page by any field, with the full query surface you already know.' },
            { name:'AdminMonthlyChatAnalytics', text:'Monthly rollup, for invoicing and trend reporting.' },
            { name:'AdminDailyChatAnalytics', text:'Daily rollup, for spotting a spike the day it happens.' },
            { name:'AdminGetChatThread', text:'A thread’s messages and per-request stats, for operational review of what actually happened.' },
        ]
        return { apis }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, AnalyticsFlow, AdminApis }
}
