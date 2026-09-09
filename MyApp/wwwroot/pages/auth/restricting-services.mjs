import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Visibility and access are two separate dials */
const RestrictDials = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Two dials, not one</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What <code class="rounded bg-white px-1.5 py-0.5 text-lg dark:bg-slate-800">[Restrict]</code> controls</h3>

      <div class="mt-6 grid gap-4 lg:grid-cols-2">
        <div v-for="d in dials" :key="d.name"
             :class="['rounded-2xl border p-5 shadow-sm', d.accent]">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{d.icon}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{d.name}}</div>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{d.text}}</p>
          <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] text-emerald-300 dark:bg-black/50">{{d.code}}</code>
        </div>
      </div>

      <div class="mt-5">
        <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Restrict by any endpoint attribute</div>
        <div class="mt-2.5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="a in axes" :key="a.name" class="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div class="text-sm font-bold text-slate-900 dark:text-white">{{a.name}}</div>
            <p class="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{{a.text}}</p>
          </div>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">This is about where a request comes from, not who is making it.</b>
        Use it alongside authentication, not instead of it - a localhost restriction protects an admin API from the
        internet, but not from another process on the same box.
      </p>
    </section>`,
    setup() {
        const dials = [
            { icon:'👁', name:'Visibility', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Whether the Service appears on /metadata pages. Hides an internal API from a public API listing without changing who may call it.',
              code:'[Restrict(VisibleInternalOnly = true)]' },
            { icon:'🔒', name:'Access', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'Whether the call is allowed at all. A request that doesn’t match the restriction is refused.',
              code:'[Restrict(LocalhostOnly = true)]' },
        ]
        const axes = [
            { name:'Network', text:'Localhost, internal or external callers.' },
            { name:'Format', text:'Only XML, only JSON, and so on.' },
            { name:'Endpoint', text:'HTTP, message queue or in-process.' },
            { name:'Security', text:'Secure or insecure connections.' },
        ]
        return { dials, axes }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, RestrictDials }
}
