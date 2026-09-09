import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Why code-first migrations rather than generated state diffs */
const MigrationPhilosophy = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div v-for="a in approaches" :key="a.name"
           :class="['flex flex-col rounded-2xl border-2 p-6 shadow-sm', a.accent]">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-lg font-bold text-slate-900 dark:text-white">{{a.name}}</div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{a.tagline}}</div>
          </div>
          <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', a.tint]">{{a.badge}}</span>
        </div>
        <ul class="mt-4 flex-1 space-y-2">
          <li v-for="p in a.points" :key="p" class="flex items-start gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-200">
            <span :class="['mt-0.5 shrink-0 font-black', a.markTint]">{{a.mark}}</span><span>{{p}}</span>
          </li>
        </ul>
      </div>
      <p class="lg:col-span-2 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        The practical payoff: a migration is <b class="text-slate-900 dark:text-white">checked in alongside the feature
        that needs it</b>, so CI and every other developer run the exact same change you did, in the same order.
      </p>
    </section>`,
    setup() {
        const approaches = [
            { name:'State-based', tagline:'Generated from a schema snapshot', badge:'the alternative',
              tint:'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              mark:'•', markTint:'text-slate-400',
              points:[
                'A tool diffs the database against a model and emits the change.',
                'Schema edits happen out-of-band from the code that needs them.',
                'What actually runs is opaque until you read the generated output.',
              ] },
            { name:'OrmLite migrations', tagline:'The change you meant, written down', badge:'code-first',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              mark:'✓', markTint:'text-emerald-500',
              points:[
                'You write the schema change you want, as ordinary maintainable code.',
                'It lives in source control with a connected audit history.',
                'The same exact change runs everywhere - your machine, CI, a teammate’s checkout.',
              ] },
        ]
        return { approaches }
    }
}

/** Ordering, Up/Down and the two authoring styles */
const MigrationMechanics = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Three things to know</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">How migrations are ordered and run</h3>

      <div class="mt-6 grid gap-3 lg:grid-cols-3">
        <div v-for="m in mechanics" :key="m.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{m.icon}}</span>
            <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{m.name}}</div>
          </div>
          <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{m.text}}</p>
          <code v-if="m.code" class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] text-emerald-300 dark:bg-black/50">{{m.code}}</code>
        </div>
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        <div v-for="s in styles" :key="s.name"
             :class="['rounded-xl border p-4', s.accent]">
          <div class="text-sm font-bold text-slate-900 dark:text-white">{{s.name}}</div>
          <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const mechanics = [
            { icon:'🔢', name:'Class name sets the order', code:'class Migration1000 : MigrationBase',
              text:'A numeric naming convention keeps the sequence visible in a file listing, lets the compiler reject duplicates, and makes a conflicting migration obvious in source control before it’s merged.' },
            { icon:'⬆', name:'Up() is required', code:'public override void Up() {}',
              text:'The change you want to apply. This is the only method a migration must implement.' },
            { icon:'⬇', name:'Down() is optional', code:'public override void Down() {}',
              text:'Skip it if you roll forward - fixing issues in a later migration instead of reverting, so earlier ones can be refactored and re-run.' },
        ]
        const styles = [
            { name:'Declarative', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Copy the new shape of your Data Model into the migration and let OrmLite work out the Add, Remove and Rename statements.' },
            { name:'Imperative', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Write the schema statements yourself with the Modify Schema APIs, for anything the declarative form can’t express.' },
        ]
        return { mechanics, styles }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, MigrationPhilosophy, MigrationMechanics }
}
