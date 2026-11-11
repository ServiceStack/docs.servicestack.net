import { ref, computed, watch } from "vue"
import AudioPlayer from "../podcasts/AudioPlayer.mjs"
import RedisDistributedCache from "../redis/distributed-cache.mjs"
import RedisStreams from "../redis/streams.mjs"
import RedisHashFieldExpiration from "../redis/hash-field-expiration.mjs"

/**
 * Template picker with a create command and .zip download.
 * <vite-plus-templates template="tanstack-static"> shows just that template's command and download,
 * without the picker or its descriptions.
 */
const VitePlusTemplates = {
    props: { template: String },
    template: `
    <div class="not-prose my-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-950 p-5 sm:p-8">
      <div v-if="!template" class="space-y-6" role="radiogroup" aria-label="Project template">
        <div v-for="group in groups" :key="group.name">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
            <span :class="['inline-block w-2.5 h-2.5 rounded-full', group.dot]"></span>
            <h4 class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ group.name }}</h4>
            <span class="text-sm text-gray-500 dark:text-gray-400">{{ group.note }}</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button v-for="t in group.templates" :key="t.name" type="button" role="radio" :aria-checked="selected === t.name"
                    @click="selected = t.name"
                    :class="['flex flex-col justify-start text-left rounded-xl border p-4 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                             selected === t.name
                               ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 ring-1 ring-indigo-500'
                               : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700']">
              <span class="block font-mono font-semibold text-gray-900 dark:text-gray-100">{{ t.name }}</span>
              <span class="mt-1.5 block text-sm text-gray-600 dark:text-gray-400">{{ t.description }}</span>
            </button>
          </div>
        </div>
      </div>

      <div :class="['grid gap-6 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] items-start', template ? '' : 'mt-8']">
        <div>
          <label :for="inputId" class="block text-sm font-semibold text-gray-900 dark:text-gray-100">Project Name</label>
          <input :id="inputId" v-model="name" type="text" maxlength="64" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                 :class="['mt-2 block w-full rounded-lg border bg-white dark:bg-gray-900 px-3.5 py-2.5 text-base font-mono text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40',
                          valid ? 'border-gray-300 dark:border-gray-700' : 'border-red-500']"/>
          <p :class="['mt-1.5 text-xs', valid ? 'text-gray-500 dark:text-gray-400' : 'text-red-600']">Letters, numbers and underscores</p>
        </div>
        <div class="min-w-0">
          <span class="hidden lg:block text-sm font-semibold invisible" aria-hidden="true">Command</span>
          <button type="button" @click="copy" :aria-label="copied ? 'Copied' : 'Copy command: ' + command" title="Click to copy" class="group lg:mt-2 flex w-full items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 pl-4 pr-2 py-[9px] font-mono text-sm text-left text-slate-200 cursor-pointer transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
            <div class="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-1"><span class="select-none text-emerald-400 mr-2">$</span>{{ command }}</div>
            <span aria-hidden="true" class="flex-none rounded-lg p-1.5 text-slate-500 group-hover:text-white group-hover:bg-white/10 transition">
              <svg v-if="copied" class="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            </span>
          </button>
        </div>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
        <a :href="valid ? downloadUrl : undefined" :aria-disabled="!valid"
           :class="['inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-indigo-500 hover:no-underline transition', valid ? '' : 'pointer-events-none opacity-50']">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Download <span class="font-mono">{{ projectName }}.zip</span>
        </a>
        <div class="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a v-if="!template" :href="'https://' + current.demo" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Live Demo</a>
          <a v-if="!template" :href="'https://github.com/NetCoreTemplates/' + selected" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Source Code</a>
          <a :href="'https://github.com/new?template_name=' + selected + '&template_owner=NetCoreTemplates'" class="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Create GitHub repo</a>
        </div>
      </div>
    </div>`,
    setup(props) {
        const groups = [
            {
                name: 'React + Vite', dot: 'bg-sky-400', note: 'built with vp build',
                templates: [
                    { name: 'react-static', description: 'Minimal React SPA statically generated by Vite', demo: 'react-static.react-templates.net' },
                    { name: 'react-spa', description: 'Full-featured React SPA with Blog, Todos, shadcn/ui, API Keys & AI Chat', demo: 'react-spa.react-templates.net' },
                    { name: 'tanstack-static', description: 'Statically prerendered TanStack Start App with type-safe routing', demo: 'tanstack-static.react-templates.net' },
                ]
            },
            {
                name: 'Next.js', dot: 'bg-gray-900 dark:bg-gray-100', note: 'Next.js builds, vp checks, lints, formats & tests',
                templates: [
                    { name: 'next-static', description: 'Statically exported Next.js App with a .NET API', demo: 'next-static.react-templates.net' },
                    { name: 'next-rsc', description: 'Next.js React Server Components calling .NET APIs on the server', demo: 'next-rsc.react-templates.net' },
                    { name: 'nextjs', description: 'Full-featured Next.js App with MDX Blog, Todos, shadcn/ui & AI Chat', demo: 'nextjs.react-templates.net' },
                    { name: 'next-saas', description: 'Production-ready SaaS with individual & business accounts, roles, billing & quotas', demo: 'next-saas.react-templates.net' },
                    { name: 'next-license', description: 'Sell one-time licenses that unlock Pro features in .NET or Electron Apps', demo: 'next-license.react-templates.net' },
                ]
            },
            {
                name: 'Astro', dot: 'bg-orange-500', note: 'Astro builds, vp checks, lints, formats & tests',
                templates: [
                    { name: 'astro-static', description: 'Statically generated Astro site with a Markdown/MDX Blog & React islands', demo: 'astro-static.react-templates.net' },
                ]
            },
            {
                name: 'Vue + Vite', dot: 'bg-emerald-500', note: 'built with vp build, .vue SFCs type checked by vue-tsc',
                templates: [
                    { name: 'vue-static', description: 'Minimal Vue SPA statically generated by Vite', demo: 'vue-static.web-templates.io' },
                    { name: 'vue-spa', description: 'Full-featured Vue SPA with Markdown Blog, Todos & ServiceStack Vue Components', demo: 'vue-spa.web-templates.io' },
                ]
            },
        ]
        const all = groups.flatMap(g => g.templates)

        const selected = ref(props.template || 'react-spa')
        const inputId = 'vp-tpl-name-' + (props.template || 'all')
        let saved = ''
        try { saved = localStorage.getItem('tpl-name') || '' } catch (e) {}
        const name = ref(saved || 'MyApp')

        const valid = computed(() => name.value.trim() === '' || /^[A-Za-z][A-Za-z0-9_]*$/.test(name.value.trim()))
        const projectName = computed(() => valid.value && name.value.trim() ? name.value.trim() : 'MyApp')
        const current = computed(() => all.find(t => t.name === selected.value))
        const command = computed(() => `npx create-net ${selected.value} ${projectName.value}`)
        const downloadUrl = computed(() => `https://account.servicestack.net/archive/NetCoreTemplates/${selected.value}?Name=${encodeURIComponent(projectName.value)}`)

        watch(name, v => {
            try { if (/^[A-Za-z][A-Za-z0-9_]*$/.test(v.trim())) localStorage.setItem('tpl-name', v.trim()) } catch (e) {}
        })

        const copied = ref(false)
        function copy() {
            navigator.clipboard?.writeText(command.value)
            copied.value = true
            setTimeout(() => copied.value = false, 1500)
        }

        return { groups, selected, inputId, name, valid, projectName, current, command, downloadUrl, copied, copy }
    }
}

const ToolchainCompare = {
    template: `
    <div class="not-prose my-8 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table class="min-w-full text-sm">
        <thead class="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th class="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Task</th>
            <th class="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400">Before</th>
            <th class="px-4 py-3 text-left font-semibold text-indigo-600 dark:text-indigo-400">Vite+</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
          <tr v-for="row in rows" :key="row.task">
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{{ row.task }}</td>
            <td class="px-4 py-3 text-gray-500 dark:text-gray-400">{{ row.before }}</td>
            <td class="px-4 py-3 text-gray-900 dark:text-gray-100"><code class="text-indigo-600 dark:text-indigo-400">{{ row.cmd }}</code> <span class="text-gray-500 dark:text-gray-400">{{ row.after }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>`,
    setup() {
        const rows = [
            { task: 'Dev Server & Build', before: 'Vite 7 (Rollup + esbuild)', cmd: 'vp dev / vp build', after: 'Vite 8 (Rolldown)' },
            { task: 'Linting',            before: 'ESLint 9 + plugins',       cmd: 'vp lint',            after: 'Oxlint, type-aware' },
            { task: 'Formatting',         before: 'none',                    cmd: 'vp fmt',             after: 'Oxfmt' },
            { task: 'Type Checking',      before: 'tsc (TypeScript 5)',       cmd: 'vp check',           after: 'TypeScript Go (TS 7 in React)' },
            { task: 'Testing',            before: 'Vitest 4',                 cmd: 'vp test',            after: 'Vitest' },
            { task: 'All checks',         before: 'multiple tools & configs', cmd: 'vp check',           after: 'format + lint + types in one pass' },
        ]
        return { rows }
    }
}

export default {
    install(app) {
    },
    components: {
        AudioPlayer,
        VitePlusTemplates,
        ToolchainCompare,
        SlidingExpiryTimeline: RedisDistributedCache.components.SlidingExpiryTimeline,
        ConsumerGroupFlow: RedisStreams.components.ConsumerGroupFlow,
        FieldExpiryComparison: RedisHashFieldExpiration.components.FieldExpiryComparison,
    },
    setup() {
        return { }
    }
}
