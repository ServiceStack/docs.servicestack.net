import { computed, ref } from "vue"

/**
 * Clickable grid of capability pillars with an expanding detail panel.
 *
 *   <FeaturePillars eyebrow="…" title="…" :pillars="[{
 *      icon:'⚡', name:'AutoQuery', tagline:'…', summary:'…',
 *      points:['…','…'], links:[{ text:'Docs', href:'/autoquery/' }] }]" />
 */
export default {
    props: {
        eyebrow: String,
        title: String,
        description: String,
        /** [{ icon, name, tagline, summary, points:[], links:[{text,href}] }] */
        pillars: { type: Array, default: () => [] },
        /** Index of the pillar selected on load */
        selected: { type: Number, default: 0 },
    },
    template: `
    <section class="not-prose my-10">
      <div v-if="eyebrow || title || description" class="mb-6">
        <p v-if="eyebrow" class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">{{eyebrow}}</p>
        <h3 v-if="title" class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{{title}}</h3>
        <p v-if="description" class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">{{description}}</p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <button v-for="(pillar,index) in pillars" :key="pillar.name" type="button"
          @click="active = index" :aria-pressed="active === index"
          :class="['group rounded-2xl border p-5 text-left transition duration-200', active === index
            ? 'border-indigo-500 bg-indigo-600 shadow-lg shadow-indigo-500/20'
            : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600']">
          <span :class="['flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black', active === index
            ? 'bg-white/15 text-white'
            : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300']">{{pillar.icon}}</span>
          <div :class="['mt-4 text-base font-bold', active === index ? 'text-white' : 'text-slate-900 dark:text-white']">{{pillar.name}}</div>
          <div :class="['mt-1 text-sm leading-6', active === index ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400']">{{pillar.tagline}}</div>
        </button>
      </div>

      <div v-if="current" class="mt-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 dark:border-indigo-900 dark:from-indigo-950/40 dark:to-slate-900 sm:p-8">
        <div class="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <h4 class="text-xl font-bold text-slate-900 dark:text-white">{{current.name}}</h4>
            <p class="mt-3 leading-7 text-slate-600 dark:text-slate-300">{{current.summary}}</p>
            <div v-if="current.links?.length" class="mt-5 flex flex-wrap gap-2">
              <a v-for="link in current.links" :key="link.href" :href="link.href"
                 class="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-600 hover:text-white hover:ring-indigo-600 dark:bg-slate-900 dark:text-indigo-300 dark:ring-indigo-800">
                {{link.text}} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <ul v-if="current.points?.length" class="grid gap-2 sm:grid-cols-2">
            <li v-for="point in current.points" :key="point"
                class="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
              <span class="mt-0.5 shrink-0 text-emerald-500">✓</span><span>{{point}}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>`,
    setup(props) {
        const active = ref(props.selected)
        const current = computed(() => props.pillars[active.value])
        return { active, current }
    }
}
