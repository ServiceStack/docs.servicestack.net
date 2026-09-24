import { ref, computed, watch, onMounted, onUnmounted } from "vue"
import CopyBlock from "./CopyBlock.mjs"

const site = 'https://react-templates.net'
const docs = `${site}/docs/next-license`

// lucide icons
const icons = {
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    webhook: '<path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"/><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"/>',
    user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    wifiOff: '<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',
    tags: '<path d="M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z"/><path d="M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193"/><circle cx="10.5" cy="6.5" r=".5" fill="currentColor"/>',
    download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
    key: '<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>',
    dashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    search: '<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
    file: '<path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    plug: '<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    maximize: '<path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/>',
}

const Icon = {
    props: { name: String, strokeWidth: { default: 2 } },
    template: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" :stroke-width="strokeWidth" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="icons[name]"></svg>`,
    setup: () => ({ icons }),
}

/* ---------- Purchase → unlock flow ---------- */

const steps = [
    { icon: 'card', title: 'Purchase', desc: 'Customer picks an offer and pays with Stripe Checkout' },
    { icon: 'webhook', title: 'Fulfill', desc: 'Webhook confirms payment and signs an ES256 JWT' },
    { icon: 'user', title: 'Deliver', desc: 'Customer copies the key from My licenses' },
    { icon: 'wifiOff', title: 'Unlock', desc: 'Your app verifies it offline and enables Pro' },
]

/* ---------- Build coverage demo ---------- */

const builds = [
    { version: '1.0', date: '2026-03-02' },
    { version: '1.4', date: '2026-09-21' },
    { version: '2.0', date: '2027-01-14' },
    { version: '2.3', date: '2027-03-10' },
    { version: '3.0', date: '2027-08-05' },
    { version: '3.2', date: '2028-01-19' },
]
const updatesThrough = '2027-03-21'
const cutoffAfter = builds.filter(b => b.date <= updatesThrough).length - 1
// cutoff sits halfway between the last covered and first uncovered build
const cutoffAt = (cutoffAfter + 0.5) / (builds.length - 1)

// illustrative token segments: header and payload are real base64url of the claims shown
const jwt = {
    header: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9',
    payload: 'eyJpc3MiOiJhY21lLXN0dWRpbyIsImF1ZCI6ImFjbWUtc3R1ZGlvIiwic3ViIjoiMTNhMjU4MTktM2VkOS00NDFmLThiY2QtNmE5NGVlNTZkYzAwIiwibmFtZSI6IkFsZXggTW9yZ2FuIiwib3JnYW5pemF0aW9uIjoiTm9ydGhzdGFyIFN0dWRpbyIsInNlYXRzIjozLCJlZGl0aW9uIjoiUHJvIn0',
    signature: 'q7Vd2kGm1xR0cN8wZpE4sYtB6aHfLj3uKo9WnXi5MvQe0rTyDcUgPb2Sl7AaFzOk1hJw4NmVxC8sRe6iYtLq3g',
}

/* ---------- Screenshots ---------- */

const groups = [
    {
        name: 'Storefront & Account',
        screens: [
            { file: 'pricing', title: 'Pricing', path: '/pricing', icon: 'tags', desc: 'Free, dated and Lifetime offers sold as one-time Stripe Checkout purchases.', href: `${docs}/getting-started/connect-stripe-sandbox` },
            { file: 'downloads', title: 'Downloads', path: '/download', icon: 'download', desc: 'Published GitHub releases become platform download buttons, with a cached fallback.', href: `${docs}/features/releases-and-downloads` },
            { file: 'customer-licenses', title: 'My licenses', path: '/account', icon: 'key', desc: 'Copy or download the signed key, see update coverage, renew or upgrade to Lifetime.', href: `${docs}/features/customer-licenses` },
            { file: 'account-settings', title: 'Account settings', path: '/account', icon: 'user', desc: 'Transfer licenses to another verified account and choose lifecycle emails.', href: `${docs}/features/transfers-and-preferences` },
        ],
    },
    {
        name: 'Operations Center',
        screens: [
            { file: 'operations-center', title: 'Overview', path: '/admin', icon: 'dashboard', desc: 'Active licenses, orders needing review, pending payments and a launch checklist.', href: `${docs}/features/operations-center` },
            { file: 'products-pricing', title: 'Products & pricing', path: '/admin/catalog', icon: 'package', desc: 'Save prices, create the matching Stripe prices and approve offerings.', href: `${docs}/getting-started/connect-stripe-sandbox` },
            { file: 'releases', title: 'Releases', path: '/admin/releases', icon: 'rocket', desc: 'Published GitHub releases with their notes and installer assets.', href: `${docs}/features/releases-and-downloads` },
            { file: 'licenses', title: 'Licenses', path: '/admin/licenses', icon: 'key', desc: 'Search, extend coverage, grant Lifetime updates or reissue any license.', href: `${docs}/features/operations-center` },
            { file: 'customer-lookup', title: 'Issue a license', path: '/admin/licenses', icon: 'search', desc: 'Search registered customers and issue complimentary or replacement licenses.', href: `${docs}/features/operations-center` },
            { file: 'orders', title: 'Orders', path: '/admin/orders', icon: 'receipt', desc: 'Search orders, open Stripe payments and review refunds and disputes.', href: `${docs}/features/operations-center` },
            { file: 'license-terms', title: 'License terms', path: '/admin/agreements', icon: 'file', desc: 'Publish license agreement versions with a live Markdown preview.', href: `${docs}/getting-started/connect-stripe-sandbox` },
            { file: 'integrations', title: 'Integrations', path: '/admin/settings', icon: 'plug', desc: 'Stripe, webhook, signing key and GitHub configuration status at a glance.', href: `${docs}/operations/configuration` },
        ],
    },
]

const allScreens = groups.flatMap(g => g.screens)

export default {
    components: { CopyBlock, Icon },
    template: `
    <section class="not-prose relative w-full overflow-hidden border-b border-white/10 bg-[#07120c] text-white">
      <!-- Background -->
      <div class="absolute inset-0 pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        style="background-image: radial-gradient(circle, rgb(190 242 100 / 0.18) 1px, transparent 1px); background-size: 24px 24px"></div>
      <div class="absolute -top-40 left-1/2 -translate-x-1/2 h-[28rem] w-[56rem] max-w-full rounded-full bg-emerald-500/20 blur-[120px] pointer-events-none"></div>
      <div class="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-lime-400/10 blur-[120px] pointer-events-none"></div>
      <div class="absolute bottom-0 -left-40 h-96 w-96 rounded-full bg-emerald-600/15 blur-[120px] pointer-events-none"></div>
      <!-- Key watermark -->
      <Icon name="key" :stroke-width="0.6" class="absolute -left-24 top-24 size-[28rem] -rotate-12 text-lime-300/[0.03] pointer-events-none" />

      <div class="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-28">
        <!-- Heading -->
        <div class="text-center space-y-6">
          <div class="inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/5 px-1.5 py-1 pr-4 text-sm font-medium text-lime-200 backdrop-blur">
            <span class="rounded-full bg-lime-300 px-2 py-0.5 text-xs font-bold text-emerald-950">NEW</span>
            Desktop Licensing Template
          </div>
          <h2 class="text-4xl md:text-6xl font-bold tracking-tight text-white">
            Next <span class="bg-clip-text text-transparent bg-gradient-to-r from-lime-200 via-lime-300 to-emerald-400">License</span>
          </h2>
          <p class="text-lg md:text-xl text-emerald-100/70 max-w-3xl mx-auto leading-relaxed">
            Sell <strong class="text-white">perpetual, offline-verified licenses</strong> for your .NET and Electron desktop apps.
            Stripe Checkout, signed JWT license keys, GitHub-hosted downloads and an Operations Center,
            with no activation server to run.
          </p>
        </div>

        <!-- Purchase → unlock flow -->
        <div class="relative mt-16">
          <svg class="absolute left-[12.5%] right-[12.5%] top-7 hidden h-2 w-3/4 md:block" preserveAspectRatio="none" viewBox="0 0 100 2" aria-hidden="true">
            <line x1="0" y1="1" x2="100" y2="1" stroke="rgb(190 242 100 / 0.45)" stroke-width="2" stroke-dasharray="4 4" vector-effect="non-scaling-stroke" class="animate-dash-flow motion-reduce:animate-none" />
          </svg>
          <ol class="relative grid grid-cols-2 md:grid-cols-4 gap-8">
            <li v-for="(s, i) in steps" :key="s.title" class="flex flex-col items-center text-center">
              <div class="relative flex size-14 items-center justify-center rounded-2xl border border-lime-300/25 bg-[#0d1f15] shadow-lg shadow-black/40 ring-4 ring-[#07120c]">
                <Icon :name="s.icon" class="size-6 text-lime-300" />
                <span class="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-lime-300 font-mono text-[10px] font-bold text-emerald-950">{{ i + 1 }}</span>
              </div>
              <h3 class="mt-4 font-semibold text-white">{{ s.title }}</h3>
              <p class="mt-1 max-w-[14rem] text-sm text-emerald-100/60">{{ s.desc }}</p>
            </li>
          </ol>
        </div>

        <!-- License demo -->
        <div class="mt-20">
          <div class="text-center">
            <p class="font-mono text-xs uppercase tracking-[0.25em] text-lime-300/80">Try it</p>
            <h3 class="mt-3 text-2xl md:text-3xl font-bold text-white">One signed key. One local check.</h3>
            <p class="mt-3 text-emerald-100/60 max-w-2xl mx-auto">
              Licenses cover every build released on or before their update cutoff, forever. Pick a build or switch to Lifetime to see what your app decides.
            </p>
          </div>

          <div class="mt-10 grid gap-6 lg:grid-cols-2">
            <!-- License key -->
            <div :class="panel">
              <div class="mb-4 flex items-center justify-between gap-3">
                <span :class="panelTitle"><span :class="panelDot"></span>license.jwt</span>
                <span class="font-mono text-[11px] text-emerald-100/50">ES256 · signed, not encrypted</span>
              </div>
              <div class="relative overflow-hidden rounded-lg border border-white/10 bg-black/30 p-4">
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-lime-200/10 to-transparent animate-shimmer motion-reduce:hidden pointer-events-none"></div>
                <p class="relative font-mono text-[12px] leading-relaxed break-all"><span class="text-rose-300">{{ jwt.header }}</span><span class="text-white/40">.</span><span class="text-lime-300">{{ jwt.payload }}</span><span class="text-white/40">.</span><span class="text-sky-300">{{ jwt.signature }}</span></p>
              </div>
              <div class="mt-3 flex gap-4 font-mono text-[11px] text-emerald-100/50">
                <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-rose-300"></span>header</span>
                <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-lime-300"></span>claims</span>
                <span class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-sky-300"></span>signature</span>
              </div>
              <pre :class="[code, 'mt-4']"><span class="text-white/40">{</span>
<span v-for="(c, i) in claims" :key="c.k" :class="['block -mx-4 px-4', c.highlight ? 'bg-lime-300/10' : '']">  <span class="text-sky-300">"{{ c.k }}"</span><span class="text-white/40">: </span><span :class="c.num ? 'text-amber-200' : 'text-lime-200'">{{ c.v }}</span><span v-if="i < claims.length - 1" class="text-white/40">,</span></span><span class="text-white/40">}</span></pre>
            </div>

            <!-- Your app -->
            <div :class="panel">
              <div class="mb-4 flex items-center justify-between gap-3">
                <span :class="panelTitle"><span :class="panelDot"></span>Your desktop app</span>
                <div class="flex rounded-md border border-white/10 bg-black/30 p-0.5 text-xs font-medium">
                  <button v-for="l in langs" :key="l.k" type="button" @click="lang = l.k" :aria-pressed="lang === l.k"
                    :class="['rounded px-2.5 py-1 transition-colors', lang === l.k ? 'bg-lime-300 text-emerald-950' : 'text-emerald-100/60 hover:text-white']">
                    {{ l.label }}
                  </button>
                </div>
              </div>
              <pre v-if="lang === 'csharp'" :class="[code, 'text-slate-200']"><span class="text-violet-300">var</span> result = <span class="text-emerald-300">LicenseJwt</span>.<span class="text-sky-300">Verify</span>(
    pastedKey, embeddedPublicKeyPem,
    issuer: <span class="text-lime-200">"acme-studio"</span>,
    product: <span class="text-lime-200">"acme-studio"</span>,
    buildDate: <span :class="buildDateCls">"{{ buildDate }}"</span>);

<span class="text-violet-300">bool</span> enablePro = result.Valid;</pre>
              <pre v-else :class="[code, 'text-slate-200']"><span class="text-violet-300">const</span> result = <span class="text-sky-300">verifyLicense</span>(savedKey, {
  publicKey: bundledPublicKeyPem,
  issuer: <span class="text-lime-200">'acme-studio'</span>,
  product: <span class="text-lime-200">'acme-studio'</span>,
  buildDate: <span :class="buildDateCls">'{{ buildDate }}'</span>,
});
<span class="text-violet-300">const</span> enablePro = result.valid;</pre>

              <!-- Result -->
              <div aria-live="polite" :class="['mt-4 rounded-xl border p-4 transition-colors duration-300', valid ? 'border-lime-300/40 bg-lime-300/10' : 'border-amber-300/40 bg-amber-300/10']">
                <div class="flex items-center gap-3">
                  <div :class="['flex size-9 shrink-0 items-center justify-center rounded-full', valid ? 'bg-lime-300 text-emerald-950' : 'bg-amber-300 text-amber-950']">
                    <Icon :name="valid ? 'shield' : 'alert'" class="size-5" />
                  </div>
                  <div class="min-w-0">
                    <p class="font-mono text-sm text-white">
                      status: <span :class="valid ? 'text-lime-300' : 'text-amber-300'">{{ valid ? 'valid' : 'buildNotCovered' }}</span>
                    </p>
                    <p class="text-sm text-emerald-100/70">
                      {{ valid
                        ? 'Pro enabled · Registered to Alex Morgan, Northstar Studio · 3 seats'
                        : 'Registered to Alex Morgan · renew to use this version, older builds keep working' }}
                    </p>
                  </div>
                </div>
              </div>
              <p class="mt-3 flex items-center gap-2 text-xs text-emerald-100/50">
                <Icon name="wifiOff" class="size-3.5" /> No network, activation server or expiry date. Nothing compares against today.
              </p>
            </div>
          </div>

          <!-- Coverage timeline -->
          <div class="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8 backdrop-blur">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 class="font-semibold text-white">Build coverage</h4>
                <p class="text-sm text-emerald-100/60">Your app embeds its own release date. Select a build:</p>
              </div>
              <div role="radiogroup" aria-label="License type" class="inline-flex self-start rounded-full border border-white/10 bg-black/30 p-1 text-sm font-medium">
                <button v-for="lt in [false, true]" :key="String(lt)" type="button" role="radio" :aria-checked="lifetime === lt" @click="lifetime = lt"
                  :class="['rounded-full px-4 py-1.5 transition-colors', lifetime === lt ? 'bg-lime-300 text-emerald-950' : 'text-emerald-100/60 hover:text-white']">
                  {{ lt ? 'Lifetime · $129' : '12 months · $49' }}
                </button>
              </div>
            </div>

            <div class="relative mt-10 mb-2 px-2">
              <!-- track -->
              <div class="absolute left-[1.75rem] right-[1.75rem] top-[18px] h-1 rounded-full bg-white/10"></div>
              <div class="absolute left-[1.75rem] top-[18px] h-1 rounded-full bg-gradient-to-r from-emerald-500 to-lime-300 transition-[width] duration-500"
                :style="{ width: 'calc((100% - 3.5rem) * ' + (lifetime ? 1 : cutoffAt) + ')' }"></div>
              <!-- cutoff marker -->
              <div :class="['absolute -top-7 flex -translate-x-1/2 flex-col items-center transition-opacity duration-300', lifetime ? 'opacity-0' : 'opacity-100']"
                :style="{ left: 'calc(1.75rem + (100% - 3.5rem) * ' + cutoffAt + ')' }">
                <span class="whitespace-nowrap rounded bg-lime-300/15 px-1.5 py-0.5 font-mono text-[10px] text-lime-200">updatesThrough {{ updatesThrough }}</span>
                <span class="h-12 w-px bg-lime-300/50"></span>
              </div>

              <div class="relative flex justify-between">
                <button v-for="(b, i) in builds" :key="b.version" type="button" @click="build = i" :aria-pressed="i === build"
                  :aria-label="'Build ' + b.version + ' released ' + b.date + ', ' + (covered(b) ? 'covered' : 'not covered')"
                  class="group flex w-10 flex-col items-center focus:outline-none">
                  <span :class="['flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-lime-300/60',
                    i === build
                      ? covered(b)
                        ? 'scale-110 border-lime-300 bg-lime-300 text-emerald-950 shadow-[0_0_24px_rgb(190_242_100/0.6)]'
                        : 'scale-110 border-amber-300 bg-[#0d1f15] text-amber-300 shadow-[0_0_24px_rgb(252_211_77/0.4)]'
                      : covered(b)
                        ? 'border-lime-300 bg-[#0d1f15] text-lime-300 group-hover:scale-105'
                        : 'border-white/20 bg-[#0d1f15] text-white/40 group-hover:scale-105']">
                    <Icon :name="covered(b) ? 'check' : 'alert'" :stroke-width="covered(b) ? 3 : 2" class="size-4" />
                  </span>
                  <span :class="['mt-2 font-mono text-xs font-semibold', i === build ? 'text-white' : 'text-emerald-100/60']">v{{ b.version }}</span>
                  <span class="hidden sm:block font-mono text-[10px] text-emerald-100/40 whitespace-nowrap">{{ b.date }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Screen gallery -->
        <div class="mt-24">
          <div class="text-center">
            <p class="font-mono text-xs uppercase tracking-[0.25em] text-lime-300/80">The complete storefront</p>
            <h3 class="mt-3 text-2xl md:text-3xl font-bold text-white">Everything needed to sell your software</h3>
          </div>

          <div class="mt-10 grid gap-6 lg:grid-cols-[16rem_1fr]">
            <!-- Screen navigator -->
            <nav aria-label="Next License screens" class="flex gap-6 overflow-x-auto pb-2 lg:flex-col lg:gap-5 lg:overflow-visible lg:pb-0 [scrollbar-width:thin]">
              <div v-for="g in groups" :key="g.name" class="shrink-0 lg:shrink">
                <p class="mb-2 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-100/40">{{ g.name }}</p>
                <ul class="flex gap-1 lg:flex-col">
                  <li v-for="s in g.screens" :key="s.file">
                    <button type="button" @click="index = allScreens.indexOf(s)" :aria-current="s === screen"
                      :class="['flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                        s === screen ? 'bg-lime-300/15 text-lime-200 ring-1 ring-inset ring-lime-300/30' : 'text-emerald-100/60 hover:bg-white/5 hover:text-white']">
                      <Icon :name="s.icon" class="size-4 shrink-0" />
                      {{ s.title }}
                    </button>
                  </li>
                </ul>
              </div>
            </nav>

            <!-- Stage -->
            <div class="min-w-0">
              <div class="group relative">
                <div class="absolute -inset-4 rounded-3xl bg-gradient-to-br from-lime-300/20 via-emerald-500/10 to-transparent blur-2xl pointer-events-none"></div>
                <div class="relative overflow-hidden rounded-xl border border-white/15 bg-[#0d1f15] shadow-2xl shadow-black/60">
                  <div class="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
                    <span class="size-3 rounded-full bg-white/15"></span>
                    <span class="size-3 rounded-full bg-white/15"></span>
                    <span class="size-3 rounded-full bg-white/15"></span>
                    <span class="mx-auto flex min-w-0 max-w-sm flex-1 items-center justify-center gap-1.5 truncate rounded-md bg-black/30 px-3 py-1 font-mono text-[11px] text-emerald-100/60">
                      <Icon name="shield" class="size-3 shrink-0 text-lime-300/70" />
                      acme.studio<span class="text-emerald-100/90">{{ screen.path }}</span>
                    </span>
                    <button type="button" @click="fullscreen = true" :aria-label="'View ' + screen.title + ' fullscreen'" class="text-emerald-100/50 hover:text-lime-200">
                      <Icon name="maximize" class="size-4" />
                    </button>
                  </div>
                  <button type="button" @click="fullscreen = true" :aria-label="'View ' + screen.title + ' fullscreen'" class="block w-full cursor-zoom-in bg-white aspect-[16/10] overflow-hidden">
                    <img :key="screen.file" :src="src(screen)" :alt="screen.title"
                      class="size-full object-cover object-top transition-[object-position] duration-[4000ms] ease-in-out group-hover:object-bottom motion-reduce:transition-none">
                  </button>
                </div>
              </div>

              <div class="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div class="flex-1">
                  <h4 class="text-lg font-semibold text-white">{{ screen.title }}</h4>
                  <p class="text-emerald-100/60">{{ screen.desc }}</p>
                </div>
                <div class="flex shrink-0 items-center gap-4">
                  <a :href="screen.href" class="text-sm font-semibold text-lime-300 hover:text-lime-200">Read the guide →</a>
                  <div class="flex gap-1">
                    <button type="button" @click="prev" aria-label="Previous screen" :class="stepButton">
                      <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button type="button" @click="next" aria-label="Next screen" :class="stepButton">
                      <svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Call to action -->
        <div class="mt-16 flex flex-col lg:flex-row items-center justify-center gap-6">
          <CopyBlock class="w-full lg:w-auto">npx create-net next-license ProjectName</CopyBlock>
          <div class="flex flex-wrap justify-center gap-4">
            <a :href="docs + '/getting-started/overview'"
              class="inline-flex items-center justify-center px-6 py-3 font-bold text-emerald-950 transition-all duration-200 bg-lime-300 rounded-full shadow-sm hover:bg-lime-200 hover:shadow-lg hover:shadow-lime-300/30">
              Get Started
            </a>
            <a :href="docs"
              class="inline-flex items-center justify-center px-6 py-3 font-bold text-white transition-all duration-200 bg-white/5 border border-white/15 rounded-full hover:border-lime-300/50 hover:text-lime-200">
              Read the Docs
            </a>
            <a href="https://github.com/NetCoreTemplates/next-license" target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center justify-center px-4 py-3 font-medium text-emerald-100/60 hover:text-white">
              GitHub →
            </a>
          </div>
        </div>
      </div>

      <!-- Fullscreen Lightbox -->
      <Teleport to="body">
        <div v-if="fullscreen" role="dialog" aria-modal="true" :aria-label="screen.title" @click="fullscreen = false"
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
          <img :src="src(screen)" :alt="screen.title" class="max-h-[calc(100vh-6rem)] max-w-full rounded-lg object-contain shadow-2xl">
          <p class="text-sm text-white/80">
            {{ screen.title }} - {{ screen.desc }}
            <span class="ml-3 text-white/50">{{ index + 1 }} / {{ allScreens.length }}</span>
          </p>
        </div>
      </Teleport>
    </section>
    `,
    setup() {
        const build = ref(2)
        const lifetime = ref(false)
        const lang = ref('csharp')
        const index = ref(0)
        const fullscreen = ref(false)

        const langs = [{ k: 'csharp', label: '.NET' }, { k: 'js', label: 'Electron' }]
        const buildDate = computed(() => builds[build.value].date)
        const covered = b => lifetime.value || b.date <= updatesThrough
        const valid = computed(() => covered(builds[build.value]))
        const claims = computed(() => [
            { k: 'iss', v: '"acme-studio"' },
            { k: 'aud', v: '"acme-studio"' },
            { k: 'name', v: '"Alex Morgan"' },
            { k: 'organization', v: '"Northstar Studio"' },
            { k: 'seats', v: '3', num: true },
            { k: 'edition', v: '"Pro"' },
            { k: 'lifetime', v: String(lifetime.value), num: true, highlight: true },
            ...(lifetime.value ? [] : [{ k: 'updatesThrough', v: `"${updatesThrough}"`, highlight: true }]),
        ])

        const screen = computed(() => allScreens[index.value])
        const prev = () => index.value = (index.value - 1 + allScreens.length) % allScreens.length
        const next = () => index.value = (index.value + 1) % allScreens.length
        const src = s => `${site}/img/next-license/${s.file}.png`

        const panel = 'flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/30 backdrop-blur'
        const panelTitle = 'flex items-center gap-2 font-mono text-sm text-emerald-100/80'
        const panelDot = 'size-2 rounded-full bg-lime-300 shadow-[0_0_8px_rgb(190_242_100)]'
        const code = 'overflow-x-auto rounded-lg border border-white/10 bg-black/30 p-4 font-mono text-[12.5px] leading-6'
        const buildDateCls = 'rounded bg-lime-300/15 px-1 text-lime-200 ring-1 ring-lime-300/30'
        const stepButton = 'rounded-full border border-white/15 p-2 text-emerald-100/70 hover:border-lime-300/50 hover:text-lime-200'
        const navButton = 'absolute top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white/80 hover:bg-white/20 hover:text-white'

        // lock page scroll while fullscreen
        watch(fullscreen, open => document.body.style.overflow = open ? 'hidden' : '')

        function onKey(e) {
            if (!fullscreen.value) return
            if (e.key === 'Escape') fullscreen.value = false
            else if (e.key === 'ArrowLeft') prev()
            else if (e.key === 'ArrowRight') next()
        }
        onMounted(() => document.addEventListener('keydown', onKey))
        onUnmounted(() => document.removeEventListener('keydown', onKey))

        return {
            docs, steps, builds, updatesThrough, cutoffAt, jwt, groups, allScreens,
            build, lifetime, lang, langs, buildDate, covered, valid, claims,
            index, fullscreen, screen, prev, next, src,
            panel, panelTitle, panelDot, code, buildDateCls, stepButton, navButton,
        }
    }
}
