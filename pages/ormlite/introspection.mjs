import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Ways to see what SQL actually ran */
const SeeTheSql = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">No guessing what ran</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Ways to see the SQL</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Predictable SQL is only useful if you can check it. Pick the tool that matches how far along you are - from
          eyeballing one query to asserting on generated SQL in a test.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="t in tools" :key="t.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', t.accent]">
          <div class="flex items-start justify-between gap-2">
            <code class="min-w-0 break-words text-sm font-bold text-slate-900 dark:text-white">{{t.name}}</code>
            <span :class="['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', t.tint]">{{t.when}}</span>
          </div>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{t.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const dev = 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
        const test = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
        const plain = 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
        const tools = [
            { name:'q.ToSelectStatement()', when:'anywhere', tint:dev, accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'Ask a SqlExpression for the SQL it would run, plus its parameters - no execution, no logging setup.' },
            { name:'BeforeExecFilter', when:'dev', tint:dev, accent:plain,
              text:'Run code just before every command executes - the usual place to print the SQL while developing.' },
            { name:'AfterExecFilter', when:'dev', tint:dev, accent:plain,
              text:'The same hook after execution, for timing or logging what came back.' },
            { name:'CaptureSqlFilter', when:'test', tint:test, accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Capture every statement in a scope without executing any of them - assert on the SQL your code generates.' },
            { name:'Replay Exec Filter', when:'test', tint:test, accent:plain,
              text:'Re-run captured commands, e.g. to replay a recorded workload.' },
            { name:'Mockable extension methods', when:'test', tint:test, accent:plain,
              text:'Substitute results for OrmLite’s extension methods so a unit test needs no database at all.' },
        ]
        return { tools }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, SeeTheSql }
}
