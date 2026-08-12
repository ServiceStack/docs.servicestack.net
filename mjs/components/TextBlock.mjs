import { ref } from "vue"

export default {
    props: {
        title: String,
        text: String,
        rows: Array,
    },
    template: `
      <section class="group relative not-prose my-7 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/80 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
        <button type="button" @click.stop.prevent="copy" :title="copied ? 'Copied' : 'Copy text'"
                :aria-label="copied ? 'Copied' : 'Copy text'"
                class="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white/95 text-slate-500 opacity-0 shadow-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-700 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 group-focus-within:opacity-100 group-hover:opacity-100 dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-800 dark:hover:text-white">
          <svg v-if="copied" class="h-4 w-4 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
          <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
        </button>
        <div v-if="title" class="border-b border-slate-200 px-5 py-3 pr-14 text-xs font-bold uppercase tracking-wider text-slate-500 dark:border-slate-700 dark:text-slate-400 sm:px-6 sm:pr-14">
          {{ title }}
        </div>
        <div v-if="rows?.length" class="divide-y divide-slate-200 dark:divide-slate-700">
          <div v-for="(row,index) in rows" :key="index"
               :class="['grid gap-x-8 gap-y-1 px-5 py-3 sm:px-6 md:grid-cols-[minmax(16rem,auto)_1fr] md:items-baseline', index === 0 ? 'pr-14 sm:pr-14' : '']">
            <code class="overflow-x-auto whitespace-nowrap bg-transparent p-0 font-mono text-[0.95rem] font-semibold text-indigo-700 before:content-none after:content-none dark:text-indigo-300">{{ Array.isArray(row) ? row[0] : row }}</code>
            <span v-if="Array.isArray(row) && row.length > 1" class="text-sm leading-6 text-slate-600 dark:text-slate-300">{{ row[1] }}</span>
          </div>
        </div>
        <div v-else ref="contentRef" class="overflow-x-auto whitespace-pre-wrap break-words px-5 py-4 pr-14 font-mono text-[0.95rem] leading-7 text-slate-700 dark:text-slate-200 sm:px-6 sm:pr-14"><slot>{{ text }}</slot></div>
      </section>`,
    setup(props) {
        const copied = ref(false)
        const contentRef = ref(null)

        function value() {
            if (props.rows?.length) {
                return props.rows.map(row => Array.isArray(row)
                    ? row.map(cell => cell == null ? '' : String(cell)).join('\t')
                    : String(row)
                ).join('\n')
            }
            return props.text ?? contentRef.value?.innerText?.trim() ?? ''
        }

        async function copy() {
            const text = value()
            try {
                await navigator.clipboard.writeText(text)
            } catch {
                const el = document.createElement('textarea')
                el.value = text
                el.style.position = 'fixed'
                el.style.opacity = '0'
                document.body.appendChild(el)
                el.select()
                document.execCommand('copy')
                document.body.removeChild(el)
            }
            copied.value = true
            setTimeout(() => copied.value = false, 2000)
        }

        return { copied, contentRef, copy }
    },
}
