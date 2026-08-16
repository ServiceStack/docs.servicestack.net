import { computed, ref } from "vue"

/**
 * Searchable, filterable grid of features linking to their docs.
 *
 *   <FeatureMatrix title="…" :features="[
 *      { name:'AutoQuery', category:'Data', href:'/autoquery/', badge:'',
 *        text:'…', keywords:'rdbms crud' }]" />
 *
 * Categories are derived from the features themselves, in first-seen order.
 */
export default {
    props: {
        eyebrow: String,
        title: String,
        description: String,
        /** [{ name, category, text, href, badge, keywords }] */
        features: { type: Array, default: () => [] },
        placeholder: { type: String, default: 'Search features…' },
    },
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p v-if="eyebrow" class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">{{eyebrow}}</p>
          <h3 v-if="title" class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{{title}}</h3>
          <p v-if="description" class="mt-2 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">{{description}}</p>
        </div>
        <label class="relative block lg:w-72">
          <span class="sr-only">{{placeholder}}</span>
          <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input v-model="query" type="search" :placeholder="placeholder"
                 class="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-white">
        </label>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <button type="button" @click="category=''"
          :class="['rounded-full px-3.5 py-1.5 text-xs font-bold transition', category === ''
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">
          All <span class="opacity-60">{{features.length}}</span>
        </button>
        <button v-for="cat in categories" :key="cat.name" type="button" @click="category = category === cat.name ? '' : cat.name"
          :class="['rounded-full px-3.5 py-1.5 text-xs font-bold transition', category === cat.name
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">
          {{cat.name}} <span class="opacity-60">{{cat.count}}</span>
        </button>
      </div>

      <div v-if="results.length" class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <a v-for="feature in results" :key="feature.name" :href="feature.href"
           class="group flex flex-col rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-indigo-600 dark:hover:bg-slate-800">
          <div class="flex items-start justify-between gap-2">
            <span class="font-bold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{{feature.name}}</span>
            <span v-if="feature.badge" class="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{{feature.badge}}</span>
          </div>
          <p class="mt-1.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{{feature.text}}</p>
          <span class="mt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{feature.category}}</span>
        </a>
      </div>
      <p v-else class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        No features match <b class="text-slate-700 dark:text-slate-200">{{query}}</b>.
        <button type="button" @click="query=''; category=''" class="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">Clear filters</button>
      </p>
    </section>`,
    setup(props) {
        const query = ref('')
        const category = ref('')

        const categories = computed(() => {
            const counts = new Map()
            props.features.forEach(x => counts.set(x.category, (counts.get(x.category) ?? 0) + 1))
            return [...counts].map(([name, count]) => ({ name, count }))
        })

        const results = computed(() => {
            const q = query.value.trim().toLowerCase()
            return props.features.filter(x =>
                (!category.value || x.category === category.value) &&
                (!q || `${x.name} ${x.category} ${x.text ?? ''} ${x.keywords ?? ''}`.toLowerCase().includes(q)))
        })

        return { query, category, categories, results }
    }
}
