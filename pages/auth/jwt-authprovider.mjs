import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** What a JWT buys, and what it costs */
const JwtTradeoffs = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Validated with a key, not a lookup</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Why stateless auth suits microservices</h3>

      <div class="mt-6 grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5 dark:border-emerald-800 dark:bg-emerald-950/25">
          <div class="text-sm font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">What you gain</div>
          <ul class="mt-3 space-y-2">
            <li v-for="g in gains" :key="g" class="flex items-start gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <span class="mt-0.5 shrink-0 text-emerald-500">✓</span><span>{{g}}</span>
            </li>
          </ul>
        </div>
        <div class="rounded-2xl border-2 border-amber-300 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-950/20">
          <div class="text-sm font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">What you take on</div>
          <ul class="mt-3 space-y-2">
            <li v-for="c in costs" :key="c" class="flex items-start gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <span class="mt-0.5 shrink-0 font-black text-amber-500">!</span><span>{{c}}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>`,
    setup() {
        const gains = [
            'A service validates a token with a key alone - no cache, no database, no auth server round trip.',
            'A new instance can accept traffic as soon as it has the key.',
            'The token carries its claims, so downstream services already know who the caller is.',
        ]
        const costs = [
            'A token is valid until it expires - so keep access-token lifetimes short.',
            'Revocation needs a deliberate strategy rather than deleting a session row.',
            'The signing key becomes critical infrastructure: rotate it and every existing token stops verifying.',
        ]
        return { gains, costs }
    }
}

/** Access token vs refresh token */
const TokenPair = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Two tokens, two jobs</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Access tokens and refresh tokens</h3>
      </div>
      <div class="grid gap-4 lg:grid-cols-2">
        <div v-for="t in tokens" :key="t.name"
             :class="['flex flex-col rounded-2xl border-2 p-5 shadow-sm', t.accent]">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="text-base font-bold text-slate-900 dark:text-white">{{t.name}}</div>
              <code class="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">{{t.cookie}}</code>
            </div>
            <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', t.tint]">{{t.life}}</span>
          </div>
          <p class="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{t.text}}</p>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Service Clients refresh transparently.</b> When an access token
        expires the client uses its refresh token to obtain a new one and retries the request, so application code
        never has to handle the expiry itself.
      </p>
    </section>`,
    setup() {
        const tokens = [
            { name:'Access token', cookie:'ss-tok', life:'short-lived',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/25',
              text:'The stateless authenticated session itself. Sent with every request and validated with the signing key alone - which is exactly why it should expire quickly.' },
            { name:'Refresh token', cookie:'ss-reftok', life:'long-lived',
              tint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Exchanged for a new access token when the old one expires. Kept in a Secure, HttpOnly cookie so it never reaches page JavaScript.' },
        ]
        return { tokens }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, JwtTradeoffs, TokenPair }
}
