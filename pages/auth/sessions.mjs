import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** The life of a session, from cookie to cache */
const SessionAnatomy = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">A cookie, an id, a cache entry</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">How a ServiceStack Session works</h3>

      <div class="mt-7 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div v-for="(part,i) in parts" :key="part.name" class="contents">
          <div :class="['rounded-2xl border p-5 shadow-sm', part.accent]">
            <div class="font-bold text-slate-900 dark:text-white">{{part.name}}</div>
            <code class="mt-2.5 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] text-emerald-300 dark:bg-black/50">{{part.code}}</code>
            <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{part.text}}</p>
          </div>
          <div v-if="i < parts.length - 1" class="flex items-center justify-center text-2xl text-indigo-400" aria-hidden="true">
            <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
          </div>
        </div>
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        <div v-for="c in cookies" :key="c.name"
             class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-baseline justify-between gap-2">
            <code class="text-sm font-bold text-slate-900 dark:text-white">{{c.name}}</code>
            <span class="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{c.life}}</span>
          </div>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{c.text}}</p>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Secure cookies are enabled by default</b>, and the session store is
        whatever <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">ICacheClient</code> you registered -
        in-memory for a single server, Redis or an RDBMS when you scale out.
      </p>
    </section>`,
    setup() {
        const parts = [
            { name:'The browser', code:'ss-id / ss-pid', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Holds only an opaque session id in a secure, HttpOnly cookie.' },
            { name:'The cache', code:'urn:iauthsession:{id}', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'The session itself lives in your registered ICacheClient, keyed by that id.' },
            { name:'Your Service', code:'base.SessionAs<T>()', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Resolves to a typed session object you define - not a loose dictionary.' },
        ]
        const cookies = [
            { name:'ss-id', life:'temporary', text:'The session for this browser session only - gone when the browser closes.' },
            { name:'ss-pid', life:'permanent', text:'The persistent session id used when a user chooses to stay signed in.' },
        ]
        return { parts, cookies }
    }
}

/** Hooks available around a session's life */
const SessionHooks = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Where you can intervene</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Session extension points</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="h in hooks" :key="h.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{h.icon}}</span>
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{h.name}}</div>
          </div>
          <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{h.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const hooks = [
            { icon:'🧩', name:'Typed sessions', text:'Define your own session class and carry whatever your App needs on it, resolved with SessionAs<T>().' },
            { icon:'📣', name:'Auth events', text:'Run code on registration, sign-in, sign-out and session creation - audit trails, provisioning, welcome emails.' },
            { icon:'✅', name:'Session validation', text:'Reject a session that should no longer be trusted - a disabled account, a rotated password, a revoked tenant.' },
            { icon:'🍪', name:'Cookie filters', text:'Adjust cookie attributes, including SameSite, before they are written.' },
            { icon:'💾', name:'Intercept saving', text:'Hook every session write, e.g. to mirror it somewhere else or enforce a size budget.' },
            { icon:'⏳', name:'Sliding sessions', text:'Extend a session on activity rather than expiring users mid-task - and inspect the time remaining.' },
        ]
        return { hooks }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, SessionAnatomy, SessionHooks }
}
