import { computed, ref } from "vue"

export default {
    props: {
        eyebrow: String,
        title: String,
        steps: Array,
    },
    template: `
      <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">{{ eyebrow }}</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">{{ title }}</h3>
        <div class="mt-6 grid gap-2 md:grid-cols-5">
          <template v-for="(step,index) in steps" :key="step.name">
            <button type="button" @click="selected=index"
              :class="['group rounded-xl border p-4 text-left transition', selected === index
                ? 'border-indigo-500 bg-indigo-600 text-white shadow-md'
                : 'border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600']">
              <span :class="['text-xs font-bold', selected === index ? 'text-indigo-100' : 'text-indigo-600 dark:text-indigo-400']">0{{ index + 1 }}</span>
              <div :class="['mt-2 font-bold', selected === index ? 'text-white' : 'text-slate-900 dark:text-white']">{{ step.name }}</div>
              <div :class="['mt-1 text-xs', selected === index ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400']">{{ step.caption }}</div>
            </button>
          </template>
        </div>
        <div class="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-5 dark:border-indigo-900 dark:bg-indigo-950/40">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h4 class="font-bold text-slate-900 dark:text-white">{{ active.title }}</h4>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in active.tags" :key="tag" class="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 dark:bg-slate-900 dark:text-indigo-300 dark:ring-indigo-800">{{ tag }}</span>
            </div>
          </div>
          <p class="mt-2 leading-7 text-slate-600 dark:text-slate-300">{{ active.description }}</p>
        </div>
      </section>`,
    setup(props) {
        const selected = ref(0)
        const active = computed(() => props.steps[selected.value])
        return { selected, active }
    }
}
