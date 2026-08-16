import { computed, ref } from "vue"

/**
 * Screenshot carousel for showcasing built-in UIs, with keyboard navigation,
 * a tab strip and a click-through link for each screen.
 *
 *   <UiShowcase eyebrow="…" title="…" :screens="[{
 *      name:'API Explorer', title:'…', summary:'…',
 *      img:'/img/…webp', href:'/api-explorer' }]" />
 */
export default {
    props: {
        eyebrow: String,
        title: String,
        description: String,
        /** [{ name, title, summary, img, href, w, h }] - w/h are the image's intrinsic
         *  size, used to reserve space before it loads. Defaults suit the Admin UI carousel. */
        screens: { type: Array, default: () => [] },
        w: { type: Number, default: 2432 },
        h: { type: Number, default: 1442 },
    },
    template: `
    <section tabindex="0" @keydown.left.prevent="step(-1)" @keydown.right.prevent="step(1)" :aria-label="title"
             class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 shadow-sm outline-none ring-indigo-500/40 focus-visible:ring-2 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <div class="text-center">
        <p v-if="eyebrow" class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">{{eyebrow}}</p>
        <h3 v-if="title" class="mt-1 text-balance text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{{title}}</h3>
        <p v-if="description" class="mx-auto mt-3 max-w-2xl text-pretty leading-7 text-slate-600 dark:text-slate-300">{{description}}</p>
      </div>

      <div class="mt-6 flex flex-wrap justify-center gap-2">
        <button v-for="(screen,index) in screens" :key="screen.name" type="button" @click="index_ = index"
          :class="['rounded-full px-3.5 py-1.5 text-xs font-bold transition sm:text-sm', index_ === index
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700']">
          {{screen.name}}
        </button>
      </div>

      <div v-if="current" class="mt-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h4 class="text-lg font-bold text-slate-900 dark:text-white">{{current.title}}</h4>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{{current.summary}}</p>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <button type="button" @click="step(-1)" aria-label="Previous screenshot"
              class="rounded-lg bg-white p-2 text-slate-500 ring-1 ring-slate-200 transition hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19l-7-7 7-7"/></svg>
            </button>
            <span class="tabular-nums text-xs font-semibold text-slate-400">{{index_ + 1}} / {{screens.length}}</span>
            <button type="button" @click="step(1)" aria-label="Next screenshot"
              class="rounded-lg bg-white p-2 text-slate-500 ring-1 ring-slate-200 transition hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <component :is="current.href ? 'a' : 'div'" :href="current.href"
           class="mt-4 block overflow-hidden rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 transition dark:bg-white/5 dark:ring-white/10 sm:p-3">
          <img :src="current.img" :alt="current.title" :width="current.w || w" :height="current.h || h" loading="lazy"
               class="w-full rounded-lg shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10">
        </component>

        <p v-if="current.href" class="mt-3 text-center text-sm">
          <a :href="current.href" class="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">{{current.name}} docs <span aria-hidden="true">→</span></a>
        </p>
      </div>
    </section>`,
    setup(props) {
        const index_ = ref(0)
        const current = computed(() => props.screens[index_.value])
        const step = by => {
            const n = props.screens.length
            index_.value = (index_.value + by + n) % n
        }
        return { index_, current, step }
    }
}
