import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** How OrmLite works out what to join on */
const JoinResolution = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Name the table, not the condition</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">How OrmLite works out the join</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">db.From&lt;Customer&gt;().Join&lt;CustomerAddress&gt;()</code>
        needs no ON clause, because the relationship is already declared. These are the sources it checks, and you can
        always state the condition yourself.
      </p>

      <div class="mt-6 grid gap-3 lg:grid-cols-3">
        <div v-for="(s,i) in sources" :key="s.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', s.accent]">
          <div class="flex items-center gap-2.5">
            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">{{i+1}}</span>
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{s.name}}</div>
          </div>
          <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] leading-5 text-emerald-300 dark:bg-black/50">{{s.code}}</code>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
        </div>
      </div>

      <div class="mt-6">
        <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Getting the joined data back</div>
        <div class="mt-2.5 grid gap-3 sm:grid-cols-3">
          <div v-for="r in results" :key="r.name"
               class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <code class="text-sm font-bold text-slate-900 dark:text-white">{{r.name}}</code>
            <p class="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">{{r.text}}</p>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const sources = [
            { name:'Convention', code:'{Parent}Id', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'A CustomerId column on the child resolves to Customer.Id with nothing declared at all. Applied by default.' },
            { name:'Attributes', code:'[References(typeof(Customer))]', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Be explicit when the column isn’t named by convention, or when you also want a real foreign key constraint.' },
            { name:'An expression', code:'.Join<A,B>((a,b) => a.Id == b.AId)', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'State the ON condition yourself - required for self-references and any non-obvious relationship.' },
        ]
        const results = [
            { name:'Select<T>', text:'Columns from the joined tables mapped onto one flat POCO by name.' },
            { name:'SelectMulti<T1,T2>', text:'Each row split back into its own typed POCOs.' },
            { name:'Custom POCO', text:'Project only the columns you want into a purpose-built result type.' },
        ]
        return { sources, results }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, JoinResolution }
}
