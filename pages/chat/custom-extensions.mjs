import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Every registration point ExtensionContext offers */
const ExtensionApi = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">The same API the built-ins use</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What you can register from <code class="rounded bg-white px-1.5 py-0.5 text-lg dark:bg-slate-800">Install</code></h3>

      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="area in areas" :key="area.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', area.accent]">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{area.icon}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{area.name}}</div>
          </div>
          <ul class="mt-3 flex-1 space-y-1.5">
            <li v-for="item in area.items" :key="item.name">
              <code class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{{item.name}}</code>
              <span class="ml-1.5 text-xs text-slate-500 dark:text-slate-400">{{item.text}}</span>
            </li>
          </ul>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        An extension is <b class="text-slate-900 dark:text-white">the unit of enable/disable</b>: everything it registers
        appears and disappears together, so a capability you add gets the same
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">DisableExtensions</code> treatment as a
        built-in one - and can disable itself when a prerequisite is missing.
      </p>
    </section>`,
    setup() {
        const areas = [
            { icon:'🔧', name:'Tools', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              items:[
                { name:'AddCommandTool', text:'wrap a ServiceStack Command' },
                { name:'AddTool', text:'a raw function definition' },
                { name:'tool groups', text:'default to the extension name' },
              ] },
            { icon:'🛣', name:'Routes', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              items:[
                { name:'/{prefix}/ext/{name}/', text:'your own APIs' },
                { name:'auth helpers', text:'identity of the caller' },
                { name:'cross-extension APIs', text:'call another extension' },
              ] },
            { icon:'🔀', name:'Filters', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              items:[
                { name:'request / response', text:'mutate a completion' },
                { name:'tool / approval', text:'intercept a call' },
                { name:'cache_saved', text:'hook every cached write' },
              ] },
            { icon:'🎨', name:'UI', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              items:[
                { name:'components', text:'or replace one by name' },
                { name:'sidebar & toolbar', text:'actions and pages' },
                { name:'import maps', text:'client dependencies' },
              ] },
            { icon:'💾', name:'State', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              items:[
                { name:'tables', text:'through OrmLite' },
                { name:'per-user files', text:'and preferences' },
                { name:'the cache', text:'content-addressed assets' },
              ] },
            { icon:'♻', name:'Lifecycle', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              items:[
                { name:'startup / shutdown', text:'hooks' },
                { name:'async init', text:'for slow prerequisites' },
                { name:'self-disable', text:'from inside Install' },
              ] },
        ]
        return { areas }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, ExtensionApi }
}
