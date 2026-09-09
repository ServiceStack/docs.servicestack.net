import Screenshot from "../../components/Screenshot.mjs"
import ScreenshotsGallery from "../../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../../components/ScreenshotsGalleryView.mjs"

/** Full vs partial updates - the distinction that bites people */
const UpdateScope = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">The distinction that matters</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">How much of the row are you writing?</h3>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <div v-for="m in modes" :key="m.name"
             :class="['flex flex-col rounded-2xl border-2 p-5 shadow-sm', m.accent]">
          <div class="flex items-start justify-between gap-3">
            <code class="min-w-0 break-words text-sm font-bold text-slate-900 dark:text-white">{{m.name}}</code>
            <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', m.tint]">{{m.badge}}</span>
          </div>
          <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{{m.text}}</p>
          <div class="mt-4 rounded-xl bg-white/80 p-3.5 ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10">
            <div class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Watch out for</div>
            <p class="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{{m.gotcha}}</p>
          </div>
        </div>
      </div>

      <p class="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        Both forms accept a <b class="text-slate-900 dark:text-white">where expression</b>, and without one the primary
        key is used implicitly - so an <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">Update</code>
        with neither will update <i>every row</i>. That’s deliberate, and worth respecting.
      </p>
    </section>`,
    setup() {
        const modes = [
            { name:'Update()', badge:'whole row',
              tint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Writes every updatable field on the POCO you pass in.',
              gotcha:'A field you didn’t populate is written as its default - so a partially-loaded object will blank out the columns it never read.' },
            { name:'UpdateOnly()', badge:'named fields',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              text:'Writes only the fields you name, leaving every other column untouched.',
              gotcha:'Nothing - this is the safe default when another part of the system owns the other columns.' },
        ]
        return { modes }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, UpdateScope }
}
