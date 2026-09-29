import { computed, reactive, onMounted } from "vue"
import AudioPlayer from "../podcasts/AudioPlayer.mjs"
import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import NextSaasGallery from "../components/NextSaasGallery.mjs"
import NextLicenseShowcase from "../components/NextLicenseShowcase.mjs"
import { BulkPaths } from "../ormlite/bulk-inserts.mjs"
import { Eyebrow, ClusterSimulator, QueueLanes, DedupPlayground, RetryPlanner, WorkflowSimulator, BatchSimulator, TenantOrdering, ResultsDelivery, SchedulePillars, ObservabilityPillars } from "../components/BackgroundJobs.mjs"

/** Top-of-page index of everything in this release */
const ReleaseHighlights = {
    template:`
      <section class="not-prose my-10">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a v-for="item in items" :key="item.title" :href="item.href"
             class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-black text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">{{item.icon}}</span>
              <div class="text-xs font-bold uppercase tracking-[.16em] text-indigo-600 dark:text-indigo-400">{{item.eyebrow}}</div>
            </div>
            <h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">{{item.title}}</h3>
            <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{item.text}}</p>
            <div class="mt-4 text-sm font-semibold text-indigo-600 transition group-hover:translate-x-1 dark:text-indigo-400">Read more →</div>
          </a>
        </div>
      </section>`,
    setup() {
        const items = [
            { icon:'⇆', eyebrow:'RDBMS', title:'Scale out across servers', href:'#scale-out-across-app-servers',
              text:'Run on as many App Servers as you need. Jobs are leased, recovered automatically when a server dies, and never run twice.' },
            { icon:'☰', eyebrow:'Queues', title:'Control your workloads', href:'#control-your-workloads',
              text:'Named queues with priorities, concurrency and rate limits you can pause, resume and re-throttle at runtime.' },
            { icon:'①', eyebrow:'Exactly once', title:'Never do the same work twice', href:'#never-do-the-same-work-twice',
              text:'Idempotent enqueue, singleton Jobs and a transactional outbox for work that must happen once.' },
            { icon:'↻', eyebrow:'Resilience', title:'Smarter failure handling', href:'#resilient-failure-handling',
              text:'Backoff with jitter, a history of every failed attempt, expiring Jobs, enforced timeouts and poison-job protection.' },
            { icon:'⤳', eyebrow:'Orchestration', title:'Workflows & batches', href:'#workflows-and-batches',
              text:'Chain dependent steps, fan out thousands of Jobs with live progress, fan back in, and keep each tenant’s work in order.' },
            { icon:'↩', eyebrow:'Results', title:'Get results back', href:'#get-results-back',
              text:'Await a Job’s result in the same request, or have it delivered to a webhook or MQ when it completes.' },
            { icon:'⏱', eyebrow:'Schedules', title:'Production-grade schedules', href:'#production-grade-schedules',
              text:'Time zones, misfire and overlap policies, start and end dates, run limits, and pause or run-now controls.' },
            { icon:'◉', eyebrow:'Observability', title:'See what your Jobs are doing', href:'#see-what-your-jobs-are-doing',
              text:'OpenTelemetry traces and metrics, Profiling, queue wait times and ASP.NET health checks.' },
            { icon:'⚠', eyebrow:'Before you deploy', title:'Upgrading to v10.3', href:'#upgrading-to-v103',
              text:'The schema is upgraded on startup and in-flight Jobs are cleared - a short checklist for a smooth upgrade.' },
            { icon:'◆', eyebrow:'New Template', title:'Next SaaS', href:'#next-saas',
              text:'Launch multi-tenant B2C and B2B SaaS with teams, Stripe subscriptions, plans, quotas and an Operations Center.' },
            { icon:'✓', eyebrow:'New Template', title:'Next License', href:'#next-license',
              text:'Sell perpetual, offline-verified licenses for .NET and Electron desktop apps, with no activation server to run.' },
            { icon:'↗', eyebrow:'AI Chat', title:'MCP Connections', href:'#connect-ai-chat-to-your-tools-with-mcp',
              text:'Connect GitHub and other remote MCP services with a Bearer token or OAuth, then choose and approve their tools in chat.' },
            { icon:'◷', eyebrow:'APIs', title:'API Rate Limiting', href:'#api-rate-limiting',
              text:'Protect APIs with ASP.NET Core policies. Share one budget across tagged operations and reject excess requests before services run.' },
        ]
        return { items }
    }
}

/** A checklist for upgrading, remembered in the browser */
const UpgradeChecklist = {
    components: { Eyebrow },
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-amber-300 bg-amber-50/50 shadow-sm dark:border-amber-900 dark:bg-amber-950/20">
      <div class="border-b border-amber-200 px-6 py-5 dark:border-amber-900 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-amber-700 dark:text-amber-400">Before you deploy</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Upgrade checklist</h3>
        <div class="mt-4 flex items-center gap-3">
          <div class="h-2.5 flex-1 overflow-hidden rounded-full bg-amber-100 dark:bg-amber-950">
            <div class="h-full rounded-full bg-emerald-500 transition-all duration-300" :style="{ width: (done / items.length * 100) + '%' }"></div>
          </div>
          <span class="text-sm font-bold text-slate-700 dark:text-slate-200">{{done}} / {{items.length}}</span>
        </div>
      </div>
      <ul class="divide-y divide-amber-100 dark:divide-amber-900/50">
        <li v-for="item in items" :key="item.id">
          <label class="flex cursor-pointer items-start gap-3 px-6 py-4 transition hover:bg-amber-50 dark:hover:bg-amber-950/30 sm:px-8">
            <input type="checkbox" v-model="checked[item.id]" @change="save" class="mt-1 h-4 w-4 shrink-0 accent-emerald-600" />
            <div>
              <div :class="['font-semibold', checked[item.id] ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white']">{{item.title}}</div>
              <div class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{item.text}}</div>
            </div>
          </label>
        </li>
      </ul>
      <p v-if="done === items.length" class="border-t border-amber-200 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-700 dark:border-amber-900 dark:bg-emerald-950/40 dark:text-emerald-300 sm:px-8">
        ✓ You’re ready to upgrade to v10.3
      </p>
    </section>`,
    setup() {
        const key = 'v10.3-upgrade-checklist'
        const items = [
            { id:'permissions', title:'Your App’s database user can alter tables and create indexes',
              text:'The schema is upgraded on startup. If you manage schema changes separately, apply them before deploying.' },
            { id:'drain', title:'The queue is drained',
              text:'Jobs still queued, retrying or running when you upgrade are cleared and recorded as Cancelled with QueueClearedOnUpgrade.' },
            { id:'delayed', title:'Delayed Jobs are noted so they can be queued again',
              text:'Jobs scheduled with RunAfter or ScheduleCommand for a future date are cleared too. Recurring Scheduled Tasks aren’t affected.' },
            { id:'servers', title:'Every server will be stopped before the new version starts',
              text:'On the RDBMS provider, don’t do a rolling deploy - v10.2 and v10.3 servers must not process the same database together.' },
            { id:'concurrency', title:'Concurrency is sized for your workload',
              text:'Jobs without a named Worker now run at most MaxConcurrentJobs at a time per queue (default: CPU cores). Raise it or set QueueConcurrency if you need more.' },
            { id:'replyto', title:'ReplyTo only holds addresses you want results sent to',
              text:'ReplyTo is now used to deliver results. Move any other data you stored in it to Args or Meta.' },
        ]
        const checked = reactive({})
        onMounted(() => {
            try { Object.assign(checked, JSON.parse(localStorage.getItem(key) || '{}')) } catch { /* private mode */ }
        })
        const save = () => { try { localStorage.setItem(key, JSON.stringify(checked)) } catch { /* private mode */ } }
        const done = computed(() => items.filter(x => checked[x.id]).length)
        return { items, checked, save, done }
    }
}

/** Full-width template showcases from /react, framed to sit inside the page column */
const NextSaasTemplate = {
    components: { NextSaasGallery },
    template: `<div class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700"><NextSaasGallery /></div>`,
}
const NextLicenseTemplate = {
    components: { NextLicenseShowcase },
    template: `<div class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700"><NextLicenseShowcase /></div>`,
}

export default {
    install(app) {
    },
    components: {
        AudioPlayer,
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        ReleaseHighlights,
        ClusterSimulator,
        QueueLanes,
        DedupPlayground,
        RetryPlanner,
        WorkflowSimulator,
        BatchSimulator,
        TenantOrdering,
        ResultsDelivery,
        SchedulePillars,
        ObservabilityPillars,
        UpgradeChecklist,
        NextSaasTemplate,
        NextLicenseTemplate,
        BulkPaths,
    },
    setup() {
        return { }
    }
}
