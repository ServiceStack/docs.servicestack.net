import Screenshot from "../../components/Screenshot.mjs"
import ScreenshotsGallery from "../../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../../components/ScreenshotsGalleryView.mjs"

/** Which insert API to reach for */
const InsertChooser = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Five ways to write a row</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Which insert API do you want?</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="a in apis" :key="a.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', a.accent]">
          <code class="text-sm font-bold text-slate-900 dark:text-white">{{a.name}}</code>
          <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{a.text}}</p>
          <p class="mt-3 border-t border-black/5 pt-2.5 text-xs leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400">
            <b class="text-slate-700 dark:text-slate-200">Use when:</b> {{a.when}}
          </p>
        </div>
      </div>
    </section>`,
    setup() {
        const plain = 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
        const apis = [
            { name:'Insert()', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'Inserts every insertable field on the POCO.', when:'The default - you have a complete object to write.' },
            { name:'Insert(selectIdentity: true)', accent:plain,
              text:'Inserts and returns the generated auto-increment id in one round trip.', when:'The row has an [AutoIncrement] key and you need its id back.' },
            { name:'InsertOnly()', accent:plain,
              text:'Writes only the fields you name, leaving the rest to their database defaults.', when:'A partial row, or letting the database fill in the rest.' },
            { name:'InsertAll()', accent:plain,
              text:'Inserts a collection, one statement per row.', when:'A handful of rows. For thousands, use BulkInsert.' },
            { name:'Save()', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Inserts when the primary key is new, updates when it isn’t - after checking whether the row exists.', when:'You don’t know which it is. See Upsert for the single-statement version.' },
        ]
        return { apis }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, InsertChooser }
}
