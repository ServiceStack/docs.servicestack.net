import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** The bundled themes, split the way the picker splits them */
const ThemeGallery = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Light and dark columns</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">The bundled themes</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          The picker splits these by each theme’s <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">colorScheme</code>,
          pinning <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">light</code> and
          <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">dark</code> first and sorting the rest
          by display name. Each entry renders a miniature chrome preview from the theme’s own preview values.
        </p>
      </div>
      <div class="grid gap-4 lg:grid-cols-2">
        <div v-for="col in columns" :key="col.name"
             :class="['rounded-2xl border p-5 shadow-sm', col.accent]">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{col.icon}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{col.name}}</div>
          </div>
          <div class="mt-4 grid gap-2 sm:grid-cols-2">
            <div v-for="t in col.themes" :key="t.name"
                 class="flex items-center justify-between gap-2 rounded-xl bg-white/80 px-3 py-2.5 ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10">
              <code class="min-w-0 truncate text-xs font-bold text-slate-900 dark:text-white">{{t.name}}</code>
              <span v-if="t.bg" class="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">image</span>
            </div>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const columns = [
            { icon:'☀', name:'Light themes', accent:'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40',
              themes:[{name:'light'},{name:'light_sky',bg:true},{name:'light_slate',bg:true},{name:'soft_pink',bg:true}] },
            { icon:'🌙', name:'Dark themes', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              themes:[{name:'dark'},{name:'nord',bg:true},{name:'matrix',bg:true},{name:'blue_smoke',bg:true}] },
        ]
        return { columns }
    }
}

/** Four layers, so a custom theme can be a handful of overrides */
const ThemeLayers = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Later layers win</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">How a theme is resolved</h3>

      <div class="mt-6 space-y-2">
        <div v-for="(layer,i) in layers" :key="layer.name"
             :class="['flex flex-col gap-x-4 gap-y-2 rounded-xl border p-4 lg:flex-row lg:items-center', layer.accent]">
          <div class="flex shrink-0 items-center gap-3 lg:w-44">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">{{i+1}}</span>
            <div class="text-sm font-bold text-slate-900 dark:text-white">{{layer.name}}</div>
          </div>
          <p class="min-w-0 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{layer.text}}</p>
        </div>
      </div>

      <div class="mt-6 grid gap-3 lg:grid-cols-3">
        <div v-for="root in roots" :key="root.name"
             class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-sm font-bold text-slate-900 dark:text-white">{{root.name}}</div>
          <code class="mt-2 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] text-emerald-300 dark:bg-black/50">{{root.path}}</code>
          <p class="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{{root.text}}</p>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">shared.json</code> is
        <b class="text-slate-900 dark:text-white">not a theme</b> - it holds the vars and styles every theme inherits and
        is deliberately excluded from the listing.
      </p>
    </section>`,
    setup() {
        const layers = [
            { name:'Built-in defaults', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'colorScheme plus a transparent --background-image.' },
            { name:'shared.json', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'The vars and styles every theme inherits.' },
            { name:'Base theme', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'The built-in light or dark, chosen by the theme’s own colorScheme.' },
            { name:'The theme itself', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Its own vars and styles win - which is why a custom theme can be a handful of overrides rather than a full palette.' },
        ]
        const roots = [
            { name:'Bundled', path:'chat/themes/**', text:'Shipped with the package.' },
            { name:'Shared', path:'…/user/default/themes/', text:'Your organization’s themes, for every user.' },
            { name:'Personal', path:'…/user/{user}/themes/', text:'The signed-in user’s own, overriding both.' },
        ]
        return { layers, roots }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, ThemeGallery, ThemeLayers }
}
