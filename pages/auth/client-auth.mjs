import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** How each client kind carries its credentials */
const ClientAuthModes = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Same APIs, different carriers</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">How a client proves who it is</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="m in modes" :key="m.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', m.accent]">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{m.icon}}</span>
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{m.name}}</div>
          </div>
          <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{m.text}}</p>
          <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] text-emerald-300 dark:bg-black/50">{{m.code}}</code>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">In the browser, cookies are shared with the page.</b> Authenticating
        through the client also authenticates the browser session - so a user who signs in from your SPA can then view
        protected Blazor, MVC or Razor Pages without signing in again.
      </p>
    </section>`,
    setup() {
        const modes = [
            { icon:'🍪', name:'Browser cookies', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'The default for JS and TypeScript clients - requests reuse the browser’s existing authenticated cookies with no extra code.',
              code:'new JsonServiceClient()' },
            { icon:'🔑', name:'Credentials', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Send an Authenticate request with a username and password to establish the session yourself.',
              code:'new Authenticate({ provider:"credentials" })' },
            { icon:'🎫', name:'Bearer token', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'A JWT or API key on the client, sent with every request - the usual choice for a service or daemon.',
              code:'client.bearerToken = token' },
            { icon:'📛', name:'Basic Auth', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Username and password on the client, sent as an HTTP Basic Auth header.',
              code:'client.userName / client.password' },
        ]
        return { modes }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, ClientAuthModes }
}
