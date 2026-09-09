import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** How far you can drop down without leaving OrmLite */
const EscapeHatches = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Never a dead end</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">How far down you can drop</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Each step gives up a little typing for a little more control - and you can take just one step rather than
          abandoning the typed API entirely.
        </p>
      </div>
      <div class="grid gap-3 lg:grid-cols-4">
        <div v-for="(l,i) in levels" :key="l.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', l.accent]">
          <div class="flex items-center gap-2.5">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">{{i+1}}</span>
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{l.name}}</div>
          </div>
          <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] leading-5 text-emerald-300 dark:bg-black/50">{{l.code}}</code>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{l.text}}</p>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Results still map into POCOs at every level</b> - dropping to raw SQL
        costs you the typed query, not the typed result.
      </p>
    </section>`,
    setup() {
        const levels = [
            { name:'Typed expression', code:'db.From<Person>()\n  .Where(x => x.Age > 40)',
              accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Fully checked by the compiler.' },
            { name:'Custom select', code:'.Select("COUNT(*) AS Total")',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Keep the typed query but write the projection yourself.' },
            { name:'Custom where', code:'db.Select<Person>(\n  "Age > @age", new { age = 40 })',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'A raw predicate, still parameterized and still mapped.' },
            { name:'Full SQL', code:'db.SqlList<Person>(\n  "EXEC GetPeople @age", …)',
              accent:'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20',
              text:'Anything at all - stored procedures included.' },
        ]
        return { levels }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, EscapeHatches }
}
