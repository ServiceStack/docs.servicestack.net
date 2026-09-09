import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Where a converter sits in the round trip */
const ConverterFlow = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One type, one converter</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Where a Type Converter sits</h3>

      <div class="mt-7 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="font-bold text-slate-900 dark:text-white">Your .NET type</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">A property on your POCO.</p>
        </div>
        <div class="flex items-center justify-center text-2xl text-indigo-400" aria-hidden="true">
          <span class="hidden lg:inline">⇄</span><span class="lg:hidden">⇅</span>
        </div>
        <div class="rounded-2xl border-2 border-indigo-500/40 bg-white p-5 shadow-lg shadow-indigo-500/10 dark:bg-slate-900">
          <code class="rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white">OrmLiteConverter</code>
          <ul class="mt-3 space-y-1.5">
            <li v-for="r in responsibilities" :key="r"
                class="flex items-start gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <span class="mt-0.5 shrink-0 text-emerald-500">✓</span><span>{{r}}</span>
            </li>
          </ul>
        </div>
        <div class="flex items-center justify-center text-2xl text-indigo-400" aria-hidden="true">
          <span class="hidden lg:inline">⇄</span><span class="lg:hidden">⇅</span>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="font-bold text-slate-900 dark:text-white">The column</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">Whatever this RDBMS calls that type.</p>
        </div>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-3">
        <div v-for="u in uses" :key="u.name"
             class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-sm font-bold text-slate-900 dark:text-white">{{u.name}}</div>
          <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{u.text}}</p>
        </div>
      </div>

      <p class="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Because each type’s handling is <b class="text-slate-900 dark:text-white">decoupled into its own converter</b>,
        you can enhance one, replace it entirely, or register a converter for a type OrmLite has never heard of - which
        is exactly how the SQL Server-specific types are supported.
      </p>
    </section>`,
    setup() {
        const responsibilities = [
            'The column definition to create',
            'The value to send as a parameter',
            'The value to read back from the reader',
        ]
        const uses = [
            { name:'Enhance', text:'Subclass an existing converter to change one part of its behavior.' },
            { name:'Replace', text:'Register your own for a type OrmLite already handles.' },
            { name:'Extend', text:'Add support for a type it has no knowledge of at all.' },
        ]
        return { responsibilities, uses }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, ConverterFlow }
}
