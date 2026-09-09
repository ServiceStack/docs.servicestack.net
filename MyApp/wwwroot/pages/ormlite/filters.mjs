import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Where the filters fire, and where they don't */
const FilterScope = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div v-for="s in scopes" :key="s.name"
           :class="['flex flex-col rounded-2xl border-2 p-5 shadow-sm', s.accent]">
        <div class="flex items-center justify-between gap-2">
          <div class="font-bold text-slate-900 dark:text-white">{{s.name}}</div>
          <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', s.tint]">{{s.badge}}</span>
        </div>
        <ul class="mt-3 flex-1 space-y-1.5">
          <li v-for="item in s.items" :key="item" class="flex items-start gap-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
            <span :class="['mt-0.5 shrink-0 font-black', s.markTint]">{{s.mark}}</span><span>{{item}}</span>
          </li>
        </ul>
      </div>
      <p class="lg:col-span-2 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">This boundary is the thing to remember.</b> Auto-maintained audit
        fields are populated by the typed APIs and silently skipped by dynamic SQL and anonymous-type partial updates -
        so if a row shows a stale ModifiedDate, check which API wrote it.
      </p>
    </section>`,
    setup() {
        const scopes = [
            { name:'Filters fire', badge:'typed APIs',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              markTint:'text-emerald-500', mark:'✓',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              items:['db.Insert(row)','db.Update(row)','db.Save(row)','db.InsertAll(rows) / UpdateAll(rows)'] },
            { name:'Filters don’t fire', badge:'raw & partial',
              tint:'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
              markTint:'text-rose-500', mark:'✕',
              accent:'border-rose-200 bg-rose-50/40 dark:border-rose-900 dark:bg-rose-950/20',
              items:['Dynamic / raw SQL','Partial updates using anonymous types','db.ExecuteSql(...)','Bulk insert paths'] },
        ]
        return { scopes }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, FilterScope }
}
