import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Blobbed vs referenced - the choice OrmLite makes you make explicitly */
const BlobOrReference = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Two ways to hold a related object</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Blob it, or reference it</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          A complex property is blobbed into a text column by default. Adding
          <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">[Reference]</code> instead stores
          it in its own table - and OrmLite never guesses which you meant.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <div v-for="o in options" :key="o.name"
             :class="['flex flex-col rounded-2xl border-2 p-5 shadow-sm', o.accent]">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="text-base font-bold text-slate-900 dark:text-white">{{o.name}}</div>
              <code class="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">{{o.trigger}}</code>
            </div>
            <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', o.tint]">{{o.badge}}</span>
          </div>
          <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{{o.text}}</p>
          <dl class="mt-4 space-y-2">
            <div v-for="row in o.rows" :key="row.label" class="flex items-baseline justify-between gap-3 border-b border-dashed border-black/10 pb-2 dark:border-white/10">
              <dt class="shrink-0 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{row.label}}</dt>
              <dd class="text-right text-sm text-slate-700 dark:text-slate-200">{{row.value}}</dd>
            </div>
          </dl>
        </div>
      </div>

      <p class="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">References are never loaded implicitly.</b> A plain
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">Select</code> returns the parent alone;
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">LoadSelect</code> is what fetches the
        related rows. That’s the whole reason OrmLite can’t surprise you with an N+1.
      </p>
    </section>`,
    setup() {
        const options = [
            { name:'Blobbed', trigger:'the default for any complex property', badge:'1 table',
              tint:'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'The object is serialized into a schema-less text column on the parent table.',
              rows:[
                { label:'Read cost', value:'Free - it comes with the parent' },
                { label:'Queryable', value:'Not as columns' },
                { label:'Good for', value:'Owned data you always read together' },
              ] },
            { name:'Referenced', trigger:'[Reference] + a {Parent}Id convention', badge:'own table',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              text:'The object lives in its own table, linked by the child’s {Parent}Id column.',
              rows:[
                { label:'Read cost', value:'An explicit LoadSelect' },
                { label:'Queryable', value:'Yes - real columns and joins' },
                { label:'Good for', value:'Entities with their own lifecycle' },
              ] },
        ]
        return { options }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, BlobOrReference }
}
