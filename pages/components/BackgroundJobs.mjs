import { computed, ref, reactive, onMounted, onUnmounted } from "vue"
import FeaturePillars from "./FeaturePillars.mjs"
import CodeCompare from "./CodeCompare.mjs"

/*
 * Interactive Background Jobs components shared by the Background Jobs docs and Release Notes.
 * Register the ones a page uses in its backing /pages/{page}.mjs
 */

/**
 * Runs fn every `ms` while the component is on screen, so simulations further down the page
 * don't burn CPU until they're scrolled into view.
 */
export function useTicker(el, fn, ms) {
    let timer = null
    let observer = null
    const visible = ref(false)
    const start = () => { if (!timer) timer = setInterval(fn, ms) }
    const stop = () => { clearInterval(timer); timer = null }
    onMounted(() => {
        if (typeof IntersectionObserver === 'undefined') { visible.value = true; start(); return }
        observer = new IntersectionObserver(entries => {
            visible.value = entries.some(x => x.isIntersecting)
            visible.value ? start() : stop()
        }, { threshold: 0.15 })
        if (el.value) observer.observe(el.value)
    })
    onUnmounted(() => { stop(); observer?.disconnect() })
    return { visible }
}

export const Eyebrow = {
    props: { text: String },
    template: `<p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">{{text}}</p>`,
}

export const stateTone = {
    Queued: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    Waiting: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    Running: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    Failed: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    Cancelled: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    Skipped: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
}

/** Interactive cluster: kill or drain servers and watch their Jobs fail over */
export const ClusterSimulator = {
    components: { Eyebrow },
    template: `
    <section ref="el" class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <div>
          <Eyebrow text="Try it: take a server down" />
          <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Leases keep every Job running exactly once</h3>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Kill a server mid-Job and its lease expires, then another server recovers the Job. Drain a server and it finishes what it has without taking more.
          </p>
        </div>
        <dl class="flex gap-6 text-center">
          <div><dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</dt><dd class="text-2xl font-black text-emerald-600">{{stats.completed}}</dd></div>
          <div><dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Recovered</dt><dd class="text-2xl font-black text-amber-600">{{stats.recovered}}</dd></div>
          <div><dt class="text-xs font-bold uppercase tracking-wider text-slate-400">Ran twice</dt><dd class="text-2xl font-black text-slate-900 dark:text-white">0</dd></div>
        </dl>
      </div>

      <div class="px-6 py-5 sm:px-8">
        <div class="flex items-center gap-3">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Queue</span>
          <div class="flex min-h-8 flex-1 flex-wrap items-center gap-1.5 rounded-lg bg-slate-50 px-2 py-1.5 dark:bg-slate-800/60">
            <span v-for="job in queue" :key="job.id"
              :class="['rounded-md px-2 py-0.5 font-mono text-xs font-semibold', job.recovered
                ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700']">#{{job.id}}</span>
            <span v-if="!queue.length" class="text-xs text-slate-400">empty</span>
          </div>
        </div>

        <div class="mt-5 grid gap-4 md:grid-cols-3">
          <div v-for="server in servers" :key="server.name"
            :class="['rounded-xl border p-4 transition', server.status === 'dead'
              ? 'border-rose-300 bg-rose-50/60 dark:border-rose-900 dark:bg-rose-950/30'
              : server.status === 'draining'
                ? 'border-amber-300 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/30'
                : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900']">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 font-mono text-sm font-bold text-slate-900 dark:text-white">
                <span :class="['h-2.5 w-2.5 rounded-full', server.status === 'dead' ? 'bg-rose-500' : server.status === 'draining' ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse']"></span>
                {{server.name}}
              </div>
              <span class="text-xs font-semibold capitalize text-slate-500 dark:text-slate-400">{{server.status}}</span>
            </div>
            <div class="mt-3 space-y-2">
              <div v-for="job in server.jobs" :key="job.id" class="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
                <div class="flex items-center justify-between font-mono text-xs">
                  <span class="font-semibold text-slate-700 dark:text-slate-200">#{{job.id}}</span>
                  <span v-if="server.status === 'dead'" class="text-rose-600 dark:text-rose-400">lease expires in {{job.leaseLeft}}s</span>
                  <span v-else class="text-slate-400">{{Math.round(job.progress)}}%</span>
                </div>
                <div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div :class="['h-full rounded-full transition-all duration-500', server.status === 'dead' ? 'bg-rose-400' : 'bg-indigo-500']" :style="{ width: job.progress + '%' }"></div>
                </div>
              </div>
              <div v-if="!server.jobs.length" class="rounded-lg border border-dashed border-slate-200 p-3 text-center text-xs text-slate-400 dark:border-slate-700">idle</div>
            </div>
            <div class="mt-4 flex gap-2">
              <button type="button" @click="toggleKill(server)"
                :class="['flex-1 rounded-lg px-3 py-1.5 text-xs font-bold transition', server.status === 'dead'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-rose-600 text-white hover:bg-rose-500']">
                {{server.status === 'dead' ? 'Restart' : 'Kill'}}
              </button>
              <button type="button" @click="toggleDrain(server)" :disabled="server.status === 'dead'"
                class="flex-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                {{server.status === 'draining' ? 'Resume' : 'Drain'}}
              </button>
            </div>
          </div>
        </div>
        <p class="mt-4 text-xs text-slate-400">Simulated: each server runs 2 Jobs at a time and holds a 3s lease.</p>
      </div>
    </section>`,
    setup() {
        const el = ref(null)
        let nextId = 1
        const queue = ref([])
        const stats = reactive({ completed: 0, recovered: 0 })
        const servers = reactive(['app-1', 'app-2', 'app-3'].map(name => ({ name, status: 'alive', jobs: [] })))

        function tick() {
            // New work keeps arriving
            if (queue.value.length < 8)
                queue.value.push({ id: nextId++ })
            for (const server of servers) {
                if (server.status === 'dead') {
                    for (const job of [...server.jobs]) {
                        if (--job.leaseLeft <= 0) {
                            // Lease expired: the Job goes back to be recovered by a live server
                            server.jobs.splice(server.jobs.indexOf(job), 1)
                            queue.value.unshift({ id: job.id, recovered: true })
                            stats.recovered++
                        }
                    }
                    continue
                }
                for (const job of [...server.jobs]) {
                    job.progress = Math.min(100, job.progress + 12 + Math.random() * 22)
                    if (job.progress >= 100) {
                        server.jobs.splice(server.jobs.indexOf(job), 1)
                        stats.completed++
                    }
                }
                if (server.status === 'alive') {
                    while (server.jobs.length < 2 && queue.value.length) {
                        const job = queue.value.shift()
                        server.jobs.push({ id: job.id, progress: 0, leaseLeft: 3 })
                    }
                }
            }
        }
        useTicker(el, tick, 700)

        function toggleKill(server) {
            if (server.status === 'dead') { server.status = 'alive'; return }
            server.status = 'dead'
            server.jobs.forEach(x => x.leaseLeft = 3)
        }
        function toggleDrain(server) {
            server.status = server.status === 'draining' ? 'alive' : 'draining'
        }
        return { el, queue, servers, stats, toggleKill, toggleDrain }
    }
}

/** Interactive queues: pause, throttle and rate limit while Jobs flow */
export const QueueLanes = {
    components: { Eyebrow },
    template: `
    <section ref="el" class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <Eyebrow text="Try it: operate your queues" />
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Every class of work gets its own lane</h3>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Pause a queue while its dependency is down, give a backlog more concurrency, or cap how many Jobs start per second - all at runtime, on every server.
        </p>
      </div>
      <div class="divide-y divide-slate-200 dark:divide-slate-700">
        <div v-for="lane in lanes" :key="lane.name" class="grid gap-4 px-6 py-5 sm:px-8 lg:grid-cols-[16rem_1fr]">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-sm font-bold text-slate-900 dark:text-white">{{lane.name}}</span>
              <span v-if="lane.paused" class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">paused</span>
            </div>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{lane.caption}}</p>
            <div class="mt-3 flex items-center gap-2 whitespace-nowrap text-xs">
              <button type="button" @click="lane.paused = !lane.paused"
                class="rounded-lg bg-slate-100 px-2.5 py-1 font-bold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                {{lane.paused ? 'Resume' : 'Pause'}}</button>
              <template v-if="lane.rateLimit == null">
                <span class="text-slate-400">Concurrency</span>
                <button type="button" @click="lane.concurrency = Math.max(1, lane.concurrency - 1)" class="h-6 w-6 rounded bg-slate-100 font-bold dark:bg-slate-800 dark:text-slate-200">−</button>
                <span class="w-4 text-center font-bold text-slate-900 dark:text-white">{{lane.concurrency}}</span>
                <button type="button" @click="lane.concurrency = Math.min(6, lane.concurrency + 1)" class="h-6 w-6 rounded bg-slate-100 font-bold dark:bg-slate-800 dark:text-slate-200">+</button>
              </template>
              <template v-else>
                <span class="text-slate-400">Starts / 3s</span>
                <button type="button" @click="lane.rateLimit = Math.max(1, lane.rateLimit - 1)" class="h-6 w-6 rounded bg-slate-100 font-bold dark:bg-slate-800 dark:text-slate-200">−</button>
                <span class="w-4 text-center font-bold text-slate-900 dark:text-white">{{lane.rateLimit}}</span>
                <button type="button" @click="lane.rateLimit = Math.min(6, lane.rateLimit + 1)" class="h-6 w-6 rounded bg-slate-100 font-bold dark:bg-slate-800 dark:text-slate-200">+</button>
              </template>
            </div>
          </div>
          <div class="flex min-w-0 items-center gap-3">
            <div class="flex min-h-9 flex-1 flex-wrap items-center gap-1 overflow-hidden rounded-lg bg-slate-50 px-2 py-1.5 dark:bg-slate-800/60">
              <span v-for="job in lane.queue" :key="job.id"
                :class="['rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold', job.priority
                  ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700']"
                :title="job.priority ? 'Priority 10' : 'Priority 0'">{{job.priority ? '★' : ''}}#{{job.id}}</span>
            </div>
            <span class="text-slate-300 dark:text-slate-600">→</span>
            <div class="flex w-40 shrink-0 flex-wrap gap-1">
              <span v-for="job in lane.running" :key="job.id"
                class="animate-pulse rounded bg-indigo-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">#{{job.id}}</span>
            </div>
            <div class="w-16 shrink-0 text-right">
              <div class="text-lg font-black text-emerald-600">{{lane.done}}</div>
              <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400">done</div>
            </div>
          </div>
        </div>
      </div>
      <p class="border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400 sm:px-8">
        <span class="rounded bg-indigo-600 px-1 font-mono text-white">★</span> high priority Jobs jump the queue.
        Simulated - in your App these are <code>PauseJobQueue()</code>, <code>SetJobQueueConcurrency()</code> and <code>SetJobQueueRateLimit()</code>.
      </p>
    </section>`,
    setup() {
        const el = ref(null)
        let nextId = 100
        let tickNo = 0
        const lanes = reactive([
            { name:'emails', caption:'Password resets (★) go before newsletters', concurrency:2, rateLimit:null, paused:false, queue:[], running:[], done:0, starts:[] },
            { name:'imports', caption:'Bulk imports can’t take over the server', concurrency:1, rateLimit:null, paused:false, queue:[], running:[], done:0, starts:[] },
            { name:'stripe-api', caption:'Rate limited to the provider’s quota', concurrency:6, rateLimit:2, paused:false, queue:[], running:[], done:0, starts:[] },
        ])
        function tick() {
            tickNo++
            for (const lane of lanes) {
                if (lane.queue.length < 10 && Math.random() < 0.8) {
                    const priority = lane.name === 'emails' && Math.random() < 0.3 ? 10 : 0
                    lane.queue.push({ id: nextId++, priority })
                    lane.queue.sort((a, b) => b.priority - a.priority || a.id - b.id)
                }
                for (const job of [...lane.running]) {
                    if (--job.left <= 0) {
                        lane.running.splice(lane.running.indexOf(job), 1)
                        lane.done++
                    }
                }
                if (lane.paused) continue
                lane.starts = lane.starts.filter(t => tickNo - t < 6) // 6 ticks = 3s window
                while (lane.running.length < lane.concurrency && lane.queue.length) {
                    if (lane.rateLimit != null && lane.starts.length >= lane.rateLimit) break
                    const job = lane.queue.shift()
                    lane.running.push({ id: job.id, left: 2 + Math.floor(Math.random() * 3) })
                    lane.starts.push(tickNo)
                }
            }
        }
        useTicker(el, tick, 500)
        return { el, lanes }
    }
}

/** Idempotent enqueue, singleton Jobs and the transactional outbox, one click at a time */
export const DedupPlayground = {
    components: { Eyebrow },
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <Eyebrow text="Try it: click as often as you like" />
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Retries, double-clicks and rollbacks can’t duplicate work</h3>
        <div class="mt-5 flex flex-wrap gap-2">
          <button v-for="(tab,index) in tabs" :key="tab.name" type="button" @click="selected=index"
            :class="['rounded-full px-4 py-2 text-sm font-semibold transition', selected === index
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">{{tab.name}}</button>
        </div>
      </div>
      <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_.8fr]">
        <div class="min-w-0">
          <p class="leading-7 text-slate-600 dark:text-slate-300">{{tab.description}}</p>
          <div class="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4"><code class="block w-max whitespace-pre bg-transparent p-0 font-mono text-[12.5px] leading-6 text-slate-300">{{tab.code}}</code></div>
        </div>
        <div class="flex flex-col">
          <div class="flex flex-wrap gap-2">
            <button v-for="action in tab.actions" :key="action.label" type="button" @click="action.run()"
              :class="['rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition', action.tone === 'danger' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-indigo-600 hover:bg-indigo-500']">
              {{action.label}}</button>
          </div>
          <ol class="mt-4 flex-1 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs dark:border-slate-700 dark:bg-slate-800/50">
            <li v-for="(entry,i) in log" :key="i" class="flex items-start gap-2">
              <span :class="['mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-bold', tones[entry.tone]]">{{entry.tag}}</span>
              <span class="text-slate-700 dark:text-slate-300">{{entry.text}}</span>
            </li>
            <li v-if="!log.length" class="text-slate-400">Click a button above…</li>
          </ol>
        </div>
      </div>
    </section>`,
    setup() {
        const selected = ref(0)
        const logs = reactive([[], [], []])
        const log = computed(() => logs[selected.value])
        let nextJobId = 4201
        const add = (i, tag, tone, text) => { logs[i].unshift({ tag, tone, text }); logs[i].splice(6) }
        const tones = {
            new: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
            same: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
            none: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
        }

        let orderId = 1001
        const charges = {}
        let singleton = null
        let singletonTimer = null

        const tabs = [
            { name:'Idempotent RefId',
              description:'A client times out and retries, a user double-clicks, a message is replayed. With a meaningful RefId, submitting the same Job again returns the one already queued - the customer is only charged once.',
              code:`jobs.EnqueueCommand<ChargePaymentCommand>(
    order, new() {
        RefId = $"charge-order-{order.Id}",
        DuplicateRefIdBehavior =
            DuplicateRefIdBehavior.ReturnExisting,
    });`,
              actions:[
                { label:'Charge order', run() {
                    const existing = charges[orderId]
                    if (existing) add(0, 'SAME', 'same', `Job #${existing} returned - order ${orderId} already charged`)
                    else { charges[orderId] = nextJobId++; add(0, 'NEW', 'new', `Job #${charges[orderId]} queued to charge order ${orderId}`) }
                } },
                { label:'Next order', run() { orderId++; add(0, 'NEW', 'new', `Now charging order ${orderId}`) } },
              ] },
            { name:'Singleton Job',
              description:'Some work only makes sense once at a time, like rebuilding a search index. While a Job with the SingletonKey is queued or running, queueing another returns the active one - enforced by a unique index across every server.',
              code:`jobs.EnqueueCommand<RebuildIndexCommand>(new() {
    SingletonKey = "rebuild-search-index",
});`,
              actions:[
                { label:'Rebuild search index', run() {
                    if (singleton) { add(1, 'SAME', 'same', `Job #${singleton} is still running, returned it instead`); return }
                    singleton = nextJobId++
                    add(1, 'NEW', 'new', `Job #${singleton} started rebuilding the index (takes 6s)`)
                    clearTimeout(singletonTimer)
                    singletonTimer = setTimeout(() => { add(1, 'DONE', 'new', `Job #${singleton} finished - the next rebuild queues a new Job`); singleton = null }, 6000)
                } },
              ] },
            { name:'Transactional outbox',
              description:'Jobs queued on your own connection are written in your transaction. If saving the order fails, its confirmation email and fulfilment Jobs roll back with it - and if it commits, they’re guaranteed to be there.',
              code:`using var trans = db.OpenTransaction();
db.Insert(order);
jobs.EnqueueCommand<EmailOrderCommand>(db, order);
jobs.EnqueueCommand<FulfilOrderCommand>(db, order);
trans.Commit();`,
              actions:[
                { label:'Save order & commit', run() {
                    const a = nextJobId++, b = nextJobId++
                    add(2, 'COMMIT', 'new', `Order saved with Jobs #${a} (email) and #${b} (fulfilment)`)
                } },
                { label:'Save order & roll back', tone:'danger', run() {
                    add(2, 'ROLLBACK', 'none', 'No order and no Jobs - nothing emailed for an order that never existed')
                } },
              ] },
        ]
        const tab = computed(() => tabs[selected.value])
        onUnmounted(() => clearTimeout(singletonTimer))
        return { selected, tabs, tab, log, tones }
    }
}

/** Visualise the retry schedule each backoff strategy produces */
export const RetryPlanner = {
    components: { Eyebrow },
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <Eyebrow text="Try it: plan your retries" />
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Back off without stampeding a recovering service</h3>
        <div class="mt-5 flex flex-wrap gap-2">
          <button v-for="s in strategies" :key="s" type="button" @click="strategy = s"
            :class="['rounded-full px-4 py-2 text-sm font-semibold transition', strategy === s
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">{{s}}</button>
        </div>
      </div>
      <div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[16rem_1fr]">
        <div class="space-y-5 text-sm">
          <label class="block">
            <span class="flex justify-between font-semibold text-slate-700 dark:text-slate-200"><span>RetryDelay</span><span class="font-mono">{{baseSecs}}s</span></span>
            <input type="range" min="1" max="60" v-model.number="baseSecs" class="mt-2 w-full accent-indigo-600" />
          </label>
          <label class="block">
            <span class="flex justify-between font-semibold text-slate-700 dark:text-slate-200"><span>MaxRetryDelay</span><span class="font-mono">{{fmt(maxSecs)}}</span></span>
            <input type="range" min="10" max="1800" step="10" v-model.number="maxSecs" class="mt-2 w-full accent-indigo-600" />
          </label>
          <label class="block">
            <span class="flex justify-between font-semibold text-slate-700 dark:text-slate-200"><span>RetryLimit</span><span class="font-mono">{{retryLimit}}</span></span>
            <input type="range" min="1" max="10" v-model.number="retryLimit" class="mt-2 w-full accent-indigo-600" />
          </label>
          <p class="rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">{{notes[strategy]}}</p>
        </div>
        <div>
          <div class="space-y-2">
            <div v-for="row in rows" :key="row.retry" class="flex items-center gap-3">
              <span class="w-16 shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400">Retry {{row.retry}}</span>
              <div class="relative h-6 flex-1 rounded bg-slate-100 dark:bg-slate-800">
                <div class="absolute inset-y-0 left-0 rounded bg-indigo-500 transition-all duration-300" :style="{ width: pct(row.min) }"></div>
                <div v-if="row.max > row.min" class="absolute inset-y-0 rounded-r bg-indigo-300/70 transition-all duration-300 dark:bg-indigo-700/70"
                  :style="{ left: pct(row.min), width: pct(row.max - row.min) }"></div>
              </div>
              <span class="w-28 shrink-0 text-right font-mono text-xs text-slate-700 dark:text-slate-300">{{row.max > row.min ? fmt(row.min) + '–' + fmt(row.max) : fmt(row.min)}}</span>
            </div>
          </div>
          <p class="mt-4 text-sm text-slate-600 dark:text-slate-300">
            A Job that keeps failing is given up to <strong class="text-slate-900 dark:text-white">{{fmt(total)}}</strong> to recover before it’s recorded as Failed,
            with every failed attempt kept in its history.
          </p>
        </div>
      </div>
    </section>`,
    setup() {
        const strategies = ['ExponentialJitter', 'Exponential', 'Linear', 'Fixed']
        const strategy = ref('ExponentialJitter')
        const baseSecs = ref(5)
        const maxSecs = ref(300)
        const retryLimit = ref(5)
        const notes = {
            ExponentialJitter: 'The default. Delays double each retry, and each is randomised between half and the full delay, so thousands of Jobs that failed together don’t all retry at the same instant.',
            Exponential: 'Delays double each retry, up to MaxRetryDelay.',
            Linear: 'Delays grow by RetryDelay each retry, up to MaxRetryDelay.',
            Fixed: 'Every retry waits RetryDelay.',
        }
        // Mirrors JobUtils.GetRetryDelay()
        const rows = computed(() => {
            const to = []
            for (let n = 1; n <= retryLimit.value; n++) {
                const mult = strategy.value === 'Fixed' ? 1 : strategy.value === 'Linear' ? n : Math.pow(2, Math.min(30, n - 1))
                const capped = Math.min(Math.max(baseSecs.value, maxSecs.value), baseSecs.value * mult)
                to.push(strategy.value === 'ExponentialJitter'
                    ? { retry: n, min: capped / 2, max: capped }
                    : { retry: n, min: capped, max: capped })
            }
            return to
        })
        const longest = computed(() => Math.max(...rows.value.map(x => x.max)))
        const total = computed(() => rows.value.reduce((sum, x) => sum + x.max, 0))
        const pct = secs => (secs / longest.value * 100).toFixed(1) + '%'
        const fmt = secs => secs < 60 ? `${Math.round(secs * 10) / 10}s`
            : secs < 3600 ? `${Math.round(secs / 6) / 10}m` : `${Math.round(secs / 360) / 10}h`
        return { strategies, strategy, baseSecs, maxSecs, retryLimit, notes, rows, total, pct, fmt }
    }
}

/** Run an order workflow and choose which step fails */
export const WorkflowSimulator = {
    components: { Eyebrow },
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <div>
          <Eyebrow text="Try it: break a step" />
          <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">A failed step stops the workflow - the customer still hears about it</h3>
        </div>
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <span class="font-semibold text-slate-500 dark:text-slate-400">Fail at</span>
          <button v-for="opt in failOptions" :key="opt.value" type="button" @click="failAt = opt.value" :disabled="running"
            :class="['rounded-full px-3 py-1.5 text-xs font-bold transition disabled:opacity-50', failAt === opt.value
              ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-rose-50 dark:bg-slate-800 dark:text-slate-300']">{{opt.label}}</button>
          <button type="button" @click="run" :disabled="running"
            class="ml-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">Run workflow</button>
        </div>
      </div>
      <div class="p-6 sm:p-8">
        <div class="grid gap-3 md:grid-cols-4">
          <div v-for="(step,index) in steps" :key="step.name" class="relative">
            <div :class="['h-full rounded-xl border p-4 transition', step.state === 'Running' ? 'border-indigo-400 shadow-md' : 'border-slate-200 dark:border-slate-700']">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400">0{{index + 1}}</span>
                <span :class="['rounded-full px-2 py-0.5 text-[11px] font-bold', tones[step.state]]">{{step.state}}</span>
              </div>
              <div class="mt-2 font-bold text-slate-900 dark:text-white">{{step.name}}</div>
              <div class="mt-1 font-mono text-[11px] text-slate-400">{{step.policy}}</div>
              <div class="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div :class="['h-full rounded-full transition-all duration-300', step.state === 'Failed' ? 'bg-rose-500' : 'bg-indigo-500']" :style="{ width: step.progress + '%' }"></div>
              </div>
              <p v-if="step.note" class="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">{{step.note}}</p>
            </div>
            <span v-if="index < steps.length - 1" class="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-slate-300 md:block dark:text-slate-600">▸</span>
          </div>
        </div>
        <div v-if="callback" class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
          ↩ Callback <code class="font-mono">OrderShippedCommand</code> ran with the shipping result: {{callback}}
        </div>
      </div>
    </section>`,
    setup() {
        const failOptions = [
            { label:'Nothing', value:null }, { label:'Charge', value:'charge' },
            { label:'Reserve', value:'reserve' }, { label:'Ship', value:'ship' },
        ]
        const failAt = ref('reserve')
        const running = ref(false)
        const callback = ref('')
        const initial = () => [
            { key:'charge', name:'Charge payment', policy:'first step' },
            { key:'reserve', name:'Reserve inventory', policy:'DependsOn: charge' },
            { key:'ship', name:'Ship order', policy:'DependsOn: reserve' },
            { key:'notify', name:'Notify customer', policy:'OnFinished: ship' },
        ].map(x => ({ ...x, state:'Queued', progress:0, note:'' }))
        const steps = ref(initial())
        const sleep = ms => new Promise(r => setTimeout(r, ms))

        async function run() {
            running.value = true
            callback.value = ''
            steps.value = initial()
            let failed = null
            for (const step of steps.value) {
                if (step.key === 'notify') {
                    step.state = 'Running'
                    for (let p = 0; p <= 100; p += 25) { step.progress = p; await sleep(120) }
                    step.state = 'Completed'
                    step.note = failed ? `Emailed: “your order is delayed” (shipping ${steps.value[2].state.toLowerCase()})` : 'Emailed: “your order is on its way”'
                    break
                }
                if (failed) {
                    step.state = 'Cancelled'
                    step.note = 'Cancelled because a step it depends on didn’t complete'
                    await sleep(250)
                    continue
                }
                step.state = 'Running'
                const failsHere = failAt.value === step.key
                for (let p = 0; p <= (failsHere ? 60 : 100); p += 20) { step.progress = p; await sleep(150) }
                if (failsHere) {
                    step.state = 'Failed'
                    step.note = { charge:'Card declined', reserve:'Out of stock', ship:'Courier unavailable' }[step.key]
                    failed = step
                } else {
                    step.state = 'Completed'
                    step.note = { charge:'txn_8f2a91 → passed to the next step', reserve:'WH-2 → passed to the next step', ship:'Tracking TRK482913' }[step.key]
                    if (step.key === 'ship') callback.value = 'tracking number TRK482913'
                }
            }
            running.value = false
        }
        return { failOptions, failAt, running, steps, run, callback, tones: stateTone }
    }
}

/** Fan out a batch, watch its progress, then fan back in */
export const BatchSimulator = {
    components: { Eyebrow },
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <div>
          <Eyebrow text="Try it: resize a gallery" />
          <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Fan out, track progress, fan back in</h3>
        </div>
        <div class="flex items-center gap-3 text-sm">
          <label class="flex items-center gap-2 font-semibold text-slate-600 dark:text-slate-300">
            <input type="checkbox" v-model="withFailures" :disabled="running" class="accent-rose-600" /> Include corrupt images
          </label>
          <button type="button" @click="run" :disabled="running"
            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">Start batch</button>
        </div>
      </div>
      <div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_18rem]">
        <div>
          <div class="grid grid-cols-8 gap-1.5 sm:grid-cols-12">
            <div v-for="tile in tiles" :key="tile.id" :title="'photo-' + tile.id + '.jpg: ' + tile.state"
              :class="['aspect-square rounded-md transition-all duration-300', {
                'bg-slate-100 dark:bg-slate-800': tile.state === 'Queued',
                'animate-pulse bg-indigo-400': tile.state === 'Running',
                'bg-emerald-500': tile.state === 'Completed',
                'bg-rose-500': tile.state === 'Failed' }]"></div>
          </div>
          <div class="mt-5">
            <div class="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Batch progress</span>
              <span>{{finished}} / {{tiles.length}} · {{completed}} completed · {{failed}} failed</span>
            </div>
            <div class="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300" :style="{ width: (finished / tiles.length * 100) + '%' }"></div>
            </div>
          </div>
        </div>
        <ol class="space-y-2">
          <li v-for="event in events" :key="event.name" class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
            <div>
              <div class="text-sm font-bold text-slate-900 dark:text-white">{{event.name}}</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{event.caption}}</div>
            </div>
            <span :class="['shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold', tones[event.state]]">{{event.state}}</span>
          </li>
        </ol>
      </div>
    </section>`,
    setup() {
        const running = ref(false)
        const withFailures = ref(false)
        const newTiles = () => Array.from({ length: 24 }, (_, i) => ({ id: i + 1, state: 'Queued' }))
        const tiles = ref(newTiles())
        const newEvents = () => [
            { name:'Callback', caption:'ImportFinishedCommand - always', state:'Waiting' },
            { name:'OnSuccess', caption:'PublishGalleryCommand - if all succeeded', state:'Waiting' },
            { name:'Fan-in Job', caption:'CreateZipArchive - DependsOnBatch', state:'Waiting' },
        ]
        const events = ref(newEvents())
        const completed = computed(() => tiles.value.filter(x => x.state === 'Completed').length)
        const failed = computed(() => tiles.value.filter(x => x.state === 'Failed').length)
        const finished = computed(() => completed.value + failed.value)
        const sleep = ms => new Promise(r => setTimeout(r, ms))

        async function run() {
            running.value = true
            tiles.value = newTiles()
            events.value = newEvents()
            const failIds = withFailures.value ? new Set([5, 14, 19]) : new Set()
            const pending = [...tiles.value]
            const workers = Array.from({ length: 6 }, async () => {
                while (pending.length) {
                    const tile = pending.shift()
                    tile.state = 'Running'
                    await sleep(250 + Math.random() * 550)
                    tile.state = failIds.has(tile.id) ? 'Failed' : 'Completed'
                }
            })
            await Promise.all(workers)
            await sleep(300)
            const [cb, success, fanIn] = events.value
            cb.state = 'Completed'
            await sleep(300)
            success.state = failed.value ? 'Skipped' : 'Completed'
            fanIn.state = 'Running'
            await sleep(900)
            fanIn.state = 'Completed'
            running.value = false
        }
        return { running, withFailures, tiles, events, completed, failed, finished, run, tones: stateTone }
    }
}

/** Compare per-tenant ordering with and without a ConcurrencyKey */
export const TenantOrdering = {
    components: { Eyebrow },
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <div>
          <Eyebrow text="Try it: ConcurrencyKey" />
          <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">In order for each tenant, in parallel for all of them</h3>
        </div>
        <div class="flex items-center gap-2">
          <button v-for="opt in [true,false]" :key="String(opt)" type="button" @click="useKey = opt" :disabled="running"
            :class="['rounded-full px-3 py-1.5 text-xs font-bold transition disabled:opacity-50', useKey === opt
              ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300']">{{opt ? 'With ConcurrencyKey' : 'Without'}}</button>
          <button type="button" @click="run" :disabled="running"
            class="ml-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50">Sync tenants</button>
        </div>
      </div>
      <div class="space-y-4 p-6 sm:p-8">
        <div v-for="tenant in tenants" :key="tenant.name" class="grid items-center gap-3 sm:grid-cols-[6rem_1fr]">
          <div class="font-mono text-sm font-bold text-slate-900 dark:text-white">{{tenant.name}}</div>
          <div class="grid grid-cols-3 gap-2">
            <div v-for="job in tenant.jobs" :key="job.seq"
              :class="['rounded-lg px-3 py-2 text-xs font-semibold transition', {
                'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400': job.state === 'Queued',
                'animate-pulse bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300': job.state === 'Running',
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300': job.state === 'Completed' && !job.outOfOrder,
                'bg-rose-100 text-rose-700 ring-1 ring-rose-300 dark:bg-rose-950 dark:text-rose-300': job.state === 'Completed' && job.outOfOrder }]">
              Sync #{{job.seq}} · {{job.state}}<span v-if="job.outOfOrder"> out of order</span>
            </div>
          </div>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-300">{{summary}}</p>
      </div>
    </section>`,
    setup() {
        const useKey = ref(true)
        const running = ref(false)
        const newTenants = () => ['acme', 'globex', 'initech'].map(name => ({
            name, lastDone: 0, jobs: [1, 2, 3].map(seq => ({ seq, state: 'Queued', outOfOrder: false })),
        }))
        const tenants = ref(newTenants())
        const summary = ref('Each tenant queues 3 syncs that must be applied in order.')
        const sleep = ms => new Promise(r => setTimeout(r, ms))

        async function runJob(tenant, job) {
            job.state = 'Running'
            await sleep(400 + Math.random() * 900)
            job.state = 'Completed'
            job.outOfOrder = job.seq < tenant.lastDone
            tenant.lastDone = Math.max(tenant.lastDone, job.seq)
        }
        async function run() {
            running.value = true
            tenants.value = newTenants()
            await Promise.all(tenants.value.map(async tenant => {
                if (useKey.value) {
                    for (const job of tenant.jobs) await runJob(tenant, job)
                } else {
                    await Promise.all(tenant.jobs.map(job => runJob(tenant, job)))
                }
            }))
            const outOfOrder = tenants.value.flatMap(x => x.jobs).filter(x => x.outOfOrder).length
            summary.value = useKey.value
                ? 'Every tenant’s syncs were applied in order, while all 3 tenants synced at the same time.'
                : outOfOrder
                    ? `${outOfOrder} sync${outOfOrder > 1 ? 's' : ''} finished after a later one - an older update could overwrite a newer one.`
                    : 'This time the syncs happened to finish in order - run it again, nothing guarantees it.'
            running.value = false
        }
        return { useKey, running, tenants, run, summary }
    }
}

export const ResultsDelivery = {
    components: { CodeCompare },
    template: `<CodeCompare eyebrow="Get results back" title="Wait for the result, or have it delivered" :tabs="tabs" />`,
    setup() {
        const tabs = [
            { name:'Await the result',
              left:{ label:'You write', lang:'csharp', code:`
                public async Task<object> Post(CreateReport request)
                {
                    var jobRef = jobs.EnqueueCommand<GenerateReportCommand>(request);
                    var result = await jobs.WaitForJobAsync(jobRef,
                        timeout: TimeSpan.FromSeconds(30));
                    return jobs.CreateResponse(result);
                }` },
              right:{ label:'You get', items:[
                { title:'Heavy work off your web servers', text:'The Job runs on whichever server has capacity, with its retries, timeout and history.' },
                { title:'A synchronous API for your clients', text:'The caller gets the result on the same request, without polling.' },
                { title:'Efficient waiting', text:'Polling backs off from 100ms to 1s, and honours a timeout and cancellation token.' },
              ] } },
            { name:'Webhook',
              left:{ label:'You write', lang:'csharp', code:`
                jobs.EnqueueCommand<GenerateReportCommand>(request, new() {
                    ReplyTo = "https://hooks.example.org/reports",
                });` },
              right:{ label:'Your endpoint receives', items:[
                { title:'A POST with the Job’s result', text:'The Response DTO as JSON, the moment the Job completes.' },
                { title:'Headers to correlate it', text:'X-Job-Id, X-Job-RefId, X-Job-State, X-Job-BatchId and X-Job-Tag.' },
                { title:'Delivery you control', text:'Sign requests or add auth headers with OnJobReplyTo, and restrict destinations with ValidateReplyTo.' },
              ] } },
            { name:'MQ',
              left:{ label:'You write', lang:'csharp', code:`
                jobs.EnqueueCommand<GenerateReportCommand>(request, new() {
                    ReplyTo = "reports.results",
                });` },
              right:{ label:'You get', items:[
                { title:'The result published to your MQ', text:'Any ReplyTo that isn’t a URL is published to that queue on your registered MQ Server.' },
                { title:'Loose coupling between services', text:'Consumers react to finished work without knowing about Background Jobs.' },
              ] } },
        ]
        return { tabs }
    }
}

export const SchedulePillars = {
    components: { FeaturePillars },
    template: `<FeaturePillars eyebrow="Recurring tasks" title="Schedules you can trust in production" :pillars="pillars" />`,
    setup() {
        const pillars = [
            { icon:'🌐', name:'Time zones', tagline:'9am local, not 9am UTC',
              summary:'Give a schedule a TimeZoneId and its cron expression is evaluated in that time zone, including daylight saving changes.',
              points:['Schedule.TimeZoneId = "America/New_York"', 'Invalid time zones are reported per task'] },
            { icon:'⏭', name:'Misfires & overlaps', tagline:'Decide what happens after downtime',
              summary:'After an outage, run a missed occurrence once or skip it. Skip an occurrence while the previous one is still running.',
              points:['ScheduleMisfirePolicy.RunOnce or Skip', 'ScheduleOverlapPolicy.Allow or Skip', 'Each occurrence is queued once, even with many servers'] },
            { icon:'📅', name:'Bounded schedules', tagline:'Campaigns that stop by themselves',
              summary:'Start a task on a future date, end it on another, or stop it after a number of runs - it’s disabled automatically when it’s done.',
              points:['StartDate and EndDate', 'MaxRuns with a persisted RunCount', 'Progress is kept when the task is registered again on startup'] },
            { icon:'🎛', name:'Operator controls', tagline:'Pause, resume, run now',
              summary:'Pause a task, resume it, or run its next occurrence immediately without changing its schedule - from the Admin UI or the API, on every server.',
              points:['SetRecurringTaskEnabled()', 'RunRecurringTaskNow()', 'Last run state, duration and errors per task'] },
        ]
        return { pillars }
    }
}

export const ObservabilityPillars = {
    components: { FeaturePillars },
    template: `<FeaturePillars eyebrow="Observability" title="Know what’s happening before your customers do" :pillars="pillars" />`,
    setup() {
        const pillars = [
            { icon:'◉', name:'OpenTelemetry', tagline:'Traces and metrics',
              summary:'A ServiceStack.Jobs ActivitySource and Meter trace every Job and count Jobs queued, started, completed, failed, retried and cancelled - with execution and wait time histograms.',
              points:['.AddSource("ServiceStack.Jobs")', '.AddMeter("ServiceStack.Jobs")', 'No overhead without a listener'] },
            { icon:'⤳', name:'Connected traces', tagline:'Follow the work',
              summary:'A Job continues the trace of the request that queued it, so an API call and the background work it caused show up as one trace.',
              points:['W3C traceparent stored with each Job'] },
            { icon:'⏳', name:'Wait times', tagline:'Spot a backlog early',
              summary:'The dashboard shows how long Jobs wait before they start, and how long the oldest Job has been waiting right now - the first sign of trouble.',
              points:['Average and longest wait', 'Per-queue statistics'] },
            { icon:'♥', name:'Health checks', tagline:'Where you already look',
              summary:'JobsHealthCheck reports Degraded or Unhealthy on a growing backlog, a stuck queue, or no servers processing Jobs.',
              points:['services.AddHealthChecks().AddCheck<JobsHealthCheck>("background-jobs")', 'Configurable thresholds'] },
        ]
        return { pillars }
    }
}

/** The states a Job moves through, and what moves it between them */
export const JobLifecycle = {
    components: { Eyebrow },
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <Eyebrow text="Job lifecycle" />
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">How a Job moves through its states</h3>
        <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
          Select a transition to see what causes it and how you control it.
        </p>
      </div>
      <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_20rem]">
        <div>
          <div class="grid grid-cols-3 items-center gap-3">
            <div class="col-start-1 row-start-2"><div :class="stateClass('Queued')">Queued</div></div>
            <div class="col-start-2 row-start-2"><div :class="stateClass('Started')">Started</div></div>
            <div class="col-start-3 row-start-1"><div :class="stateClass('Completed')">Completed</div></div>
            <div class="col-start-3 row-start-2"><div :class="stateClass('Failed')">Failed</div></div>
            <div class="col-start-3 row-start-3"><div :class="stateClass('Cancelled')">Cancelled</div></div>
          </div>
          <div class="mt-6 flex flex-wrap gap-2">
            <button v-for="(t,i) in transitions" :key="t.name" type="button" @click="selected = i"
              :class="['rounded-full px-3 py-1.5 text-xs font-semibold transition', selected === i
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">
              {{t.from}} → {{t.to}}<span class="ml-1 font-normal opacity-75">{{t.name}}</span>
            </button>
          </div>
        </div>
        <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div class="text-xs font-bold uppercase tracking-wider text-slate-400">{{t.from}} → {{t.to}}</div>
          <div class="mt-1 font-bold text-slate-900 dark:text-white">{{t.name}}</div>
          <ul class="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <li v-for="point in t.points" :key="point" class="flex gap-2"><span class="text-indigo-500">•</span><span v-html="point"></span></li>
          </ul>
        </div>
      </div>
    </section>`,
    setup() {
        const transitions = [
            { from:'Queued', to:'Started', name:'claimed', points:[
                'A Worker on the Job\'s queue has capacity, and its <code>RunAfter</code> date has passed',
                'Waits for the Job it <code>DependsOn</code>, or every Job in its <code>DependsOnBatch</code>',
                'Held back while its queue is paused, rate limited, or another Job holds its <code>ConcurrencyKey</code>',
                'With RDBMS Background Jobs the Job is leased to the server that claimed it'] },
            { from:'Started', to:'Completed', name:'succeeded', points:[
                'The API or Command returned without throwing',
                'Its <code>Callback</code> runs, and its result is delivered to its <code>ReplyTo</code>',
                'Jobs that <code>DependsOn</code> it are now free to run',
                'It\'s archived in the monthly <code>CompletedJob</code> history'] },
            { from:'Started', to:'Queued', name:'retried', points:[
                'It threw, and has attempts left within its <code>RetryLimit</code>',
                'It waits for its <code>RetryBackoff</code> delay before it runs again',
                'The failed attempt is recorded in its attempt history',
                'Also where a Job goes when its server shuts down or dies mid-run'] },
            { from:'Started', to:'Failed', name:'gave up', points:[
                'It threw on its last attempt, or <code>ShouldRetry</code> returned false',
                'Jobs that depend on it are cancelled, unless queued with <code>DependsOnPolicy.OnFinished</code>',
                'It\'s archived in the monthly <code>FailedJob</code> history, where it can be requeued'] },
            { from:'Started', to:'Cancelled', name:'stopped', points:[
                '<code>CancelJob()</code> was called, or it ran longer than its <code>TimeoutSecs</code>',
                'Its <code>CancellationToken</code> is cancelled on whichever server is running it',
                'Cancelled Jobs aren\'t retried'] },
            { from:'Queued', to:'Cancelled', name:'never ran', points:[
                '<code>CancelJob()</code> was called, or its batch was cancelled',
                'It passed its <code>ExpiresAt</code> deadline before starting, with the <code>JobExpired</code> error code',
                'The Job it <code>DependsOn</code> failed or was cancelled'] },
            { from:'Failed', to:'Queued', name:'requeued', points:[
                '<code>RequeueFailedJob()</code>, or Requeue in the Admin UI',
                'Its previous run state is cleared so it runs as a fresh attempt',
                'Failed Jobs can be requeued in bulk by Tag or Batch'] },
        ]
        const selected = ref(0)
        const t = computed(() => transitions[selected.value])
        const stateClass = state => {
            const active = t.value.from === state || t.value.to === state
            return ['rounded-xl px-4 py-3 text-center text-sm font-bold transition',
                stateTone[state === 'Started' ? 'Running' : state],
                active ? 'ring-2 ring-indigo-500 shadow-md scale-105' : 'opacity-60']
        }
        return { transitions, selected, t, stateClass }
    }
}

/** A grid of linked cards, e.g. to map out a section of the docs */
export const DocCards = {
    props: { items: Array },
    template: `
      <section class="not-prose my-8">
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
}

/** Map of the Background Jobs docs */
export const JobsGuides = {
    components: { DocCards },
    template: `<DocCards :items="items" />`,
    setup() {
        const items = [
            { icon:'⇆', eyebrow:'Guide', title:'Queues & Rate Limits', href:'/jobs/queues',
              text:'Run each class of work in its own queue with its own concurrency and priorities, re-throttle it at runtime, and keep each customer\'s Jobs in order.' },
            { icon:'⤳', eyebrow:'Guide', title:'Workflows & Batches', href:'/jobs/workflows',
              text:'Chain dependent Jobs, track the progress of Job Batches, and await a Job\'s result or have it delivered to a webhook or MQ.' },
            { icon:'↻', eyebrow:'Guide', title:'Retries & Reliability', href:'/jobs/reliability',
              text:'Retry with backoff and jitter, review every failed attempt, expire Jobs that shouldn\'t run late, and never do the same work twice.' },
            { icon:'⏱', eyebrow:'Guide', title:'Recurring Tasks', href:'/jobs/recurring-tasks',
              text:'Run APIs and Commands on a Cron or interval schedule, in any time zone, safely on every server.' },
            { icon:'◉', eyebrow:'Guide', title:'Monitoring & Operations', href:'/jobs/monitoring',
              text:'Tour the Admin UI, see and drain App Servers, and integrate with health checks and OpenTelemetry.' },
            { icon:'⌘', eyebrow:'Guide', title:'Commands in Jobs', href:'/jobs/commands',
              text:'Implement Jobs as reusable, inspectable Commands, and serialize DB writes with named Workers.' },
        ]
        return { items }
    }
}
