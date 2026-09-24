import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue"
import CopyBlock from "./CopyBlock.mjs"

const site = 'https://react-templates.net'
const docs = `${site}/docs/next-saas`

const groups = [
    {
        name: 'Public Site',
        tagline: 'Marketing, pricing & sign up',
        shots: [
            { file: 'landing-hero', title: 'Product landing page', desc: 'A polished public product site ready to rebrand as your own.', href: `${docs}/getting-started/customize-the-product` },
            { file: 'pricing-page', title: 'Pricing', desc: 'Plans, prices and trials rendered from published plan versions.', href: `${docs}/features/plans-pricing-trials` },
            { file: 'signup-page', title: 'Sign up', desc: 'ASP.NET Core Identity registration, sign-in and account management.', href: `${docs}/security/authentication-and-accounts` },
            { file: 'stripe-checkout', title: 'Stripe Checkout', desc: 'Hosted checkout with trials, coupons and promotion codes.', href: `${docs}/features/billing-and-subscriptions` },
        ],
    },
    {
        name: 'Customer App',
        tagline: 'Everything your customers manage',
        shots: [
            { file: 'dashboard-overview', title: 'Organization dashboard', desc: 'Plan, usage, storage and trial status at a glance.', href: `${docs}/getting-started/project-tour` },
            { file: 'documents-manager', title: 'Documents', desc: 'Organization-scoped file storage with quota reservations.', href: `${docs}/features/file-storage` },
            { file: 'usage-analytics', title: 'Usage & quotas', desc: 'Real-time meters, allowances and usage analytics.', href: `${docs}/features/usage-analytics` },
            { file: 'billing-subscription', title: 'Plans & billing', desc: 'Upgrade, change billing period and open the Stripe Customer Portal.', href: `${docs}/features/billing-and-subscriptions` },
            { file: 'team-roles', title: 'Team & roles', desc: 'Invite members with Owner, Admin, Billing and Member roles.', href: `${docs}/features/organizations-and-members` },
            { file: 'api-keys-manager', title: 'API keys', desc: 'Organization-scoped API keys for programmatic access.', href: `${docs}/features/api-keys` },
            { file: 'audit-events', title: 'Audit log', desc: 'Who did what, when, for every sensitive organization change.', href: `${docs}/features/audit-logs` },
            { file: 'lifecycle-settings', title: 'Data lifecycle', desc: 'Data export, ownership transfer and delayed organization deletion.', href: `${docs}/features/data-lifecycle` },
        ],
    },
    {
        name: 'Operations Center',
        tagline: 'Run the business behind the product',
        shots: [
            { file: 'operations-center', title: 'Operations overview', desc: 'Commercial and operational health of the whole platform.', href: `${docs}/features/support-operations` },
            { file: 'customer-360', title: 'Customer 360', desc: 'Subscription, usage, members and exceptions for any customer.', href: `${docs}/features/support-operations` },
            { file: 'plan-editor', title: 'Plan editor', desc: 'Immutable plan versions with features, prices and quotas.', href: `${docs}/features/plans-pricing-trials` },
            { file: 'coupons-manager', title: 'Coupons', desc: 'Create coupons and promotion codes synced to Stripe.', href: `${docs}/features/coupons` },
            { file: 'platform-usage', title: 'Platform usage', desc: 'Usage analytics and quota pressure across all customers.', href: `${docs}/features/usage-analytics` },
            { file: 'operations-queue-failed-work', title: 'Failed work queues', desc: 'Inspect and recover failed webhooks, jobs and integrations.', href: `${docs}/operations/background-jobs-and-recovery` },
            { file: 'configuration-ownership', title: 'Platform settings', desc: 'See which settings are owned by configuration vs the database.', href: `${docs}/operations/configuration` },
        ],
    },
]

// lucide icons
const icons = {
    building: '<path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/>',
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    scroll: '<path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>',
    headset: '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>',
}

const highlights = [
    { icon: icons.building, label: 'Multi-tenant orgs' },
    { icon: icons.card, label: 'Stripe subscriptions' },
    { icon: icons.gauge, label: 'Plans & quotas' },
    { icon: icons.chart, label: 'Usage metering' },
    { icon: icons.scroll, label: 'Audit logs' },
    { icon: icons.headset, label: 'Operations Center' },
]

const autoplayMs = 5000

const allShots = groups.flatMap(g => g.shots)

export default {
    components: { CopyBlock },
    template: `
    <section class="not-prose relative w-full overflow-hidden border-b border-slate-200 bg-gradient-to-b from-sky-50 via-white to-white">
      <!-- Grid Pattern -->
      <div class="absolute inset-0 pointer-events-none opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
        style="background-image: linear-gradient(to right, rgb(148 163 184 / 0.18) 1px, transparent 1px), linear-gradient(to bottom, rgb(148 163 184 / 0.18) 1px, transparent 1px); background-size: 40px 40px"></div>
      <div class="absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-[48rem] max-w-full rounded-full bg-sky-200/50 blur-[100px] pointer-events-none"></div>

      <div class="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-24">
        <!-- Heading -->
        <div class="text-center space-y-6">
          <div class="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white px-1.5 py-1 pr-4 text-sm font-medium text-sky-700 shadow-sm">
            <span class="rounded-full bg-sky-600 px-2 py-0.5 text-xs font-bold text-white">NEW</span>
            Production SaaS Template
          </div>
          <h2 class="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Next <span class="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600">SaaS</span>
          </h2>
          <p class="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Launch your <strong class="text-slate-900">multi-tenant B2C or B2B SaaS</strong> on .NET 10, ServiceStack and Next.js 16.
            Teams, Stripe subscriptions, plans, quotas and an Operations Center are built in. Take the tour:
          </p>
          <ul class="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            <li v-for="h in highlights" :key="h.label" class="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
              <svg class="size-4 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="h.icon"></svg>
              {{ h.label }}
            </li>
          </ul>
        </div>

        <!-- Group tabs -->
        <div class="mt-12 flex justify-center">
          <div role="tablist" class="inline-flex flex-wrap justify-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
            <button v-for="(g, i) in groups" :key="g.name" type="button" role="tab" :aria-selected="i === groupIndex"
              @click="go(allShots.indexOf(g.shots[0]))"
              :class="['rounded-full px-4 py-2 text-sm font-semibold transition-colors', i === groupIndex
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100']">
              {{ g.name }}
              <span :class="['ml-2 text-xs', i === groupIndex ? 'text-sky-100' : 'text-slate-400']">{{ g.shots.length }}</span>
            </button>
          </div>
        </div>
        <p class="mt-3 text-center text-sm text-slate-500">{{ groups[groupIndex].tagline }}</p>

        <!-- Stage -->
        <div ref="stage" class="mt-8 group relative" @mouseenter="hovering = true" @mouseleave="hovering = false">
          <div class="absolute -inset-6 rounded-[2rem] bg-gradient-to-r from-sky-300/50 via-blue-300/30 to-indigo-300/50 blur-3xl pointer-events-none"></div>
          <div class="relative rounded-2xl bg-gradient-to-br from-sky-300 via-slate-200 to-indigo-300 p-px shadow-2xl shadow-slate-400/40">
          <div class="relative rounded-[15px] bg-white overflow-hidden">
            <div class="relative flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
              <span class="size-3 rounded-full bg-red-400"></span>
              <span class="size-3 rounded-full bg-yellow-400"></span>
              <span class="size-3 rounded-full bg-green-400"></span>
              <span class="ml-3 truncate text-xs font-medium text-slate-500">{{ shot.title }}</span>
              <span class="ml-auto text-xs text-slate-400 tabular-nums">{{ index + 1 }} / {{ allShots.length }}</span>
              <button type="button" @click="autoplay = !autoplay" :aria-label="autoplay ? 'Pause tour' : 'Play tour'"
                class="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700">
                <svg v-if="autoplay" class="size-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h3v14H7zM14 5h3v14h-3z" /></svg>
                <svg v-else class="size-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              </button>
              <!-- autoplay progress -->
              <span v-if="autoplay" :key="index" @animationend="advance"
                :class="['absolute inset-x-0 -bottom-px h-0.5 origin-left bg-gradient-to-r from-sky-500 to-indigo-500 animate-gallery-progress', playing ? '' : '[animation-play-state:paused]']"
                :style="{ animationDuration: autoplayMs + 'ms' }"></span>
            </div>
            <button type="button" @click="fullscreen = true" :aria-label="'View ' + shot.title + ' fullscreen'" class="block w-full cursor-zoom-in bg-white aspect-[16/9]">
              <img :key="shot.file" :src="src(shot)" :alt="shot.title" class="size-full object-contain">
            </button>
          </div>
          </div>
          <button type="button" aria-label="Previous screenshot" @click="prev" :class="[arrow, 'left-3']">
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button type="button" aria-label="Next screenshot" @click="next" :class="[arrow, 'right-3']">
            <svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <!-- Caption -->
        <div class="mt-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-slate-900">{{ shot.title }}</h3>
            <p class="text-slate-600">{{ shot.desc }}</p>
          </div>
          <a :href="shot.href" class="shrink-0 text-sm font-semibold text-sky-600 hover:text-sky-700">
            Read the guide →
          </a>
        </div>

        <!-- Thumbnails -->
        <div ref="thumbs" class="relative mt-6 flex gap-3 overflow-x-auto px-1 pt-1 pb-3 snap-x [scrollbar-width:thin]">
          <button v-for="(s, i) in allShots" :key="s.file" type="button" :data-index="i" @click="go(i)" :aria-label="s.title" :aria-current="i === index"
            :class="['shrink-0 snap-start w-36 md:w-44 rounded-lg overflow-hidden border bg-white transition-all', i === index
              ? 'border-sky-500 ring-2 ring-sky-500/30 shadow-md'
              : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300 hover:shadow-sm']">
            <img :src="src(s)" alt="" loading="lazy" class="aspect-[16/9] w-full object-cover object-top">
          </button>
        </div>

        <!-- Call to action -->
        <div class="mt-12 flex flex-col lg:flex-row items-center justify-center gap-6">
          <CopyBlock class="w-full lg:w-auto">npx create-net next-saas ProjectName</CopyBlock>
          <div class="flex flex-wrap justify-center gap-4">
            <a :href="docs + '/getting-started/overview'"
              class="inline-flex items-center justify-center px-6 py-3 font-bold text-white transition-all duration-200 bg-sky-600 rounded-full shadow-sm hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-500/30">
              Get Started
            </a>
            <a :href="docs"
              class="inline-flex items-center justify-center px-6 py-3 font-bold text-slate-700 transition-all duration-200 bg-white border border-slate-300 rounded-full shadow-sm hover:border-sky-400 hover:text-sky-700">
              Read the Docs
            </a>
            <a href="https://github.com/NetCoreTemplates/next-saas" target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center justify-center px-4 py-3 font-medium text-slate-600 hover:text-slate-900">
              GitHub →
            </a>
          </div>
        </div>
      </div>

      <!-- Fullscreen Lightbox -->
      <Teleport to="body">
        <div v-if="fullscreen" role="dialog" aria-modal="true" :aria-label="shot.title" @click="fullscreen = false"
          class="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-3 bg-black/90 p-4 backdrop-blur-sm cursor-zoom-out">
          <button type="button" aria-label="Close" @click.stop="fullscreen = false"
            class="absolute top-4 right-4 rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white">
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <button type="button" aria-label="Previous image" @click.stop="prev" :class="[navButton, 'left-4']">
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button type="button" aria-label="Next image" @click.stop="next" :class="[navButton, 'right-4']">
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
          <img :src="src(shot)" :alt="shot.title" class="max-h-[calc(100vh-6rem)] max-w-full rounded-lg object-contain shadow-2xl">
          <p class="text-sm text-white/80">
            {{ shot.title }} — {{ shot.desc }}
            <span class="ml-3 text-white/50">{{ index + 1 }} / {{ allShots.length }}</span>
          </p>
        </div>
      </Teleport>
    </section>
    `,
    setup() {
        const index = ref(0)
        const fullscreen = ref(false)
        const thumbs = ref(null)
        const stage = ref(null)
        const autoplay = ref(true)
        const hovering = ref(false)
        const inView = ref(false)

        const shot = computed(() => allShots[index.value])
        const groupIndex = computed(() => groups.findIndex(g => g.shots.includes(shot.value)))
        const advance = () => index.value = (index.value + 1) % allShots.length
        const prev = () => { autoplay.value = false; index.value = (index.value - 1 + allShots.length) % allShots.length }
        const next = () => { autoplay.value = false; advance() }
        const go = i => { autoplay.value = false; index.value = i }
        const playing = computed(() => autoplay.value && inView.value && !hovering.value && !fullscreen.value)
        const src = s => `${site}/img/next-saas/${s.file}.png`

        const arrow = 'absolute top-1/2 -translate-y-1/2 z-10 rounded-full border border-slate-200 bg-white/95 p-2.5 text-slate-700 shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-sky-600 hover:border-sky-300 transition-opacity'
        const navButton = 'absolute top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/80 hover:bg-white/20 hover:text-white'

        // keep the active thumbnail in view
        watch(index, async () => {
            await nextTick()
            const strip = thumbs.value
            const el = strip?.querySelector(`[data-index="${index.value}"]`)
            if (el) strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' })
        })

        // lock page scroll while fullscreen
        watch(fullscreen, open => document.body.style.overflow = open ? 'hidden' : '')

        function onKey(e) {
            if (!fullscreen.value) return
            if (e.key === 'Escape') fullscreen.value = false
            else if (e.key === 'ArrowLeft') prev()
            else if (e.key === 'ArrowRight') next()
        }
        // auto-advance the tour (driven by the progress bar) while visible, until the user takes over
        let observer
        onMounted(() => {
            document.addEventListener('keydown', onKey)
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) autoplay.value = false
            observer = new IntersectionObserver(([e]) => inView.value = e.isIntersecting, { threshold: 0.4 })
            if (stage.value) observer.observe(stage.value)
        })
        onUnmounted(() => {
            document.removeEventListener('keydown', onKey)
            observer?.disconnect()
        })

        return { groups, allShots, highlights, docs, index, fullscreen, thumbs, stage, autoplay, autoplayMs, hovering, playing, shot, groupIndex, advance, prev, next, go, src, arrow, navButton }
    }
}
