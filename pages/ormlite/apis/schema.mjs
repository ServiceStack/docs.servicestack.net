import Screenshot from "../../components/Screenshot.mjs"
import ScreenshotsGallery from "../../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../../components/ScreenshotsGalleryView.mjs"

/** From POCO to table, and how to change it later */
const SchemaLifecycle = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Code-first, both directions</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Creating a schema, and changing it later</h3>

      <div class="mt-7 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div v-for="(stage,i) in stages" :key="stage.name" class="contents">
          <div :class="['rounded-2xl border p-5 shadow-sm', stage.accent]">
            <div class="font-bold text-slate-900 dark:text-white">{{stage.name}}</div>
            <div class="mt-2.5 flex flex-wrap gap-1.5">
              <code v-for="api in stage.apis" :key="api"
                    class="rounded bg-white/80 px-2 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-black/5 dark:bg-slate-900/70 dark:text-slate-300 dark:ring-white/10">{{api}}</code>
            </div>
            <p class="mt-2.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{stage.text}}</p>
          </div>
          <div v-if="i < stages.length - 1" class="flex items-center justify-center text-2xl text-indigo-400" aria-hidden="true">
            <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
          </div>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Create* APIs are safe to call on startup</b> - the
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">IfNotExists</code> variants no-op when the
        table is already there. For anything beyond that first creation, reach for
        <a href="/ormlite/db-migrations" class="font-semibold underline decoration-dotted">DB Migrations</a> so the change
        is recorded and repeatable.
      </p>
    </section>`,
    setup() {
        const stages = [
            { name:'Create', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              apis:['CreateTable<T>()','CreateTableIfNotExists<T>()','CreateSchema()'],
              text:'The table, its columns, indexes and constraints come from the POCO and its annotations.' },
            { name:'Inspect', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              apis:['TableExists<T>()','ColumnExists<T>()','GetTableNames()'],
              text:'Ask what already exists before deciding what to change.' },
            { name:'Modify', accent:'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20',
              apis:['AddColumn<T>()','AlterColumn<T>()','RenameColumn<T>()','DropTable<T>()'],
              text:'Targeted schema changes - the primitives DB Migrations are written in terms of.' },
        ]
        return { stages }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, SchemaLifecycle }
}
