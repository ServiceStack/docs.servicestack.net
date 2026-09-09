/** Two strategies for evolving a stored type */
const MigrationStrategies = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">No DDL, no downtime</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Two ways to change your schema</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        Redis stores binary-safe strings and understands nothing about your types, so a schema change stops being an
        infrastructure problem and becomes ordinary application logic - if it needs handling at all.
      </p>

      <div class="mt-7 grid gap-4 lg:grid-cols-2">
        <div v-for="(s,i) in strategies" :key="s.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', s.tint]">
          <div class="flex items-center gap-2">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/70 text-xs font-black text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700">{{i+1}}</span>
            <span class="font-bold text-slate-900 dark:text-white">{{s.name}}</span>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
          <div class="mt-4">
            <div class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Reach for it when</div>
            <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.when}}</p>
          </div>
          <div class="mt-3">
            <div class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Trade-off</div>
            <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.tradeoff}}</p>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const strategies = [
            { name:'The do-nothing approach', tint:'border-red-300/70 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20',
              text:'Point a typed client at the new type and read the old data with it. Added fields come back as .NET defaults and removed ones are ignored.',
              when:'The change is non-destructive: adding or removing fields, or widening a field type with no loss of information.',
              tradeoff:'Renamed fields lose their data, and new fields get .NET defaults rather than values you choose.' },
            { name:'A custom translation', tint:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Read with a client typed to the old model, project each entity into the new shape in C#, and store it back.',
              when:'You’re renaming fields, restructuring, or want migrated rows to carry specific values.',
              tradeoff:'You write and run the projection - but it’s ordinary code you can test, not a DDL script.' },
        ]
        return { strategies }
    }
}

export default {
    components: { MigrationStrategies }
}
