import { computed, ref } from "vue"

export default {
    props: {
        eyebrow: String,
        title: String,
        tabs: Array,
    },
    template: `
      <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
          <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">{{ eyebrow }}</p>
          <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">{{ title }}</h3>
          <div class="mt-5 flex flex-wrap gap-2">
            <button v-for="(tab,index) in tabs" :key="tab.name" type="button" @click="selected=index"
              :class="['rounded-full px-4 py-2 text-sm font-semibold transition', selected === index
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">
              {{ tab.name }}
            </button>
          </div>
        </div>
        <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl font-black text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
              {{ active.icon }}
            </div>
            <h4 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">{{ active.title }}</h4>
            <p class="mt-2 leading-7 text-slate-600 dark:text-slate-300">{{ active.description }}</p>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <div v-for="feature in active.features" :key="feature.title" class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
              <div class="flex items-start gap-3">
                <span class="mt-0.5 text-emerald-500">✓</span>
                <div>
                  <div class="font-semibold text-slate-900 dark:text-white">{{ feature.title }}</div>
                  <div class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{ feature.text }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`,
    setup(props) {
        const selected = ref(0)
        const active = computed(() => props.tabs[selected.value])
        return { selected, active }
    }
}
