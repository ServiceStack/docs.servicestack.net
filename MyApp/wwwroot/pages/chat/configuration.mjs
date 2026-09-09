import { computed, ref } from "vue"
import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Searchable index of every ChatFeature option, grouped the way the page is */
const ConfigExplorer = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One object graph</p>
          <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Every ChatFeature option</h3>
          <p class="mt-2 max-w-2xl leading-7 text-slate-600 dark:text-slate-300">
            Search by name or behavior, or pick a group to see what it controls. Each row shows the default you get
            without configuring anything.
          </p>
        </div>
        <label class="relative block lg:w-72">
          <span class="sr-only">Search options</span>
          <svg class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input v-model="query" type="search" placeholder="Search…"
                 class="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-600 dark:bg-slate-950 dark:text-white">
        </label>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <button type="button" @click="group=''"
          :class="['rounded-full px-3.5 py-1.5 text-xs font-bold transition', group === ''
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">
          All <span class="opacity-60">{{options.length}}</span>
        </button>
        <button v-for="g in groups" :key="g.name" type="button" @click="group = group === g.name ? '' : g.name"
          :class="['rounded-full px-3.5 py-1.5 text-xs font-bold transition', group === g.name
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700']">
          {{g.name}} <span class="opacity-60">{{g.count}}</span>
        </button>
      </div>

      <div v-if="results.length" class="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
            <tr>
              <th class="px-4 py-2.5 font-bold">Property</th>
              <th class="hidden px-4 py-2.5 font-bold sm:table-cell">Default</th>
              <th class="px-4 py-2.5 font-bold">Controls</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr v-for="opt in results" :key="opt.name" class="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-900 dark:even:bg-slate-800/30">
              <td class="px-4 py-2.5 align-top">
                <code class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{{opt.name}}</code>
                <div class="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{{opt.group}}</div>
              </td>
              <td class="hidden px-4 py-2.5 align-top sm:table-cell">
                <code v-if="opt.default" class="whitespace-nowrap rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{opt.default}}</code>
                <span v-else class="text-xs italic text-slate-400 dark:text-slate-500">-</span>
              </td>
              <td class="px-4 py-2.5 align-top text-slate-600 dark:text-slate-300">{{opt.text}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        No options match <b class="text-slate-700 dark:text-slate-200">{{query}}</b>.
        <button type="button" @click="query=''; group=''" class="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">Clear filters</button>
      </p>
    </section>`,
    setup() {
        const options = [
            // Hosting
            { group:'Hosting', name:'RoutePrefix', default:'"/chat"', text:'Path the Chat UI and APIs are mounted at. "" mounts at the site root.' },
            { group:'Hosting', name:'RequireAuth', default:'true', text:'When false everything runs as the "default" user without authentication.' },
            { group:'Hosting', name:'RequiredRole', default:'null', text:'Only users in this role can access the Chat UI and APIs.' },
            { group:'Hosting', name:'AuthType', default:'Credentials', text:'How the UI signs users in.' },
            { group:'Hosting', name:'SignInUrl', default:'"/Account/Login"', text:'Identity login page the UI redirects to when AuthType = OAuth.' },
            { group:'Hosting', name:'AppDataPath', default:'~/App_Data/chat', text:'Root of AI Chat’s file storage.' },
            { group:'Hosting', name:'AutoInitSchema', default:'true', text:'Create the OrmLite tables on startup.' },
            { group:'Hosting', name:'NamedConnection', default:'null', text:'Use a named OrmLite connection for chat data instead of the default.' },
            { group:'Hosting', name:'DisableAdminUi', default:'false', text:'Removes the /admin-ui/chat Admin UI and its APIs.' },
            { group:'Hosting', name:'SvgIcon', default:'AI Chat icon', text:'Icon used for the Admin UI link.' },
            // Extensions
            { group:'Extensions', name:'DisableExtensions', default:'[]', text:'Extension names to remove entirely, from server and UI together.' },
            { group:'Extensions', name:'Extensions', default:'built-ins', text:'The extension list itself - add your own or reorder.' },
            { group:'Extensions', name:'InstalledExtensionNames', default:'', text:'Read-only list of what actually installed.' },
            // Providers
            { group:'Providers', name:'Config', default:'seeded llms.json', text:'The parsed llms.json document.' },
            { group:'Providers', name:'ConfigJson', default:'', text:'Write-only setter that parses a JSON string into Config.' },
            { group:'Providers', name:'ProviderModels', default:'seeded providers.json', text:'The models.dev model catalog.' },
            { group:'Providers', name:'EnableProviders', default:'[]', text:'Force-enable only these providers, overriding llms.json.' },
            { group:'Providers', name:'Variables', default:'[]', text:'$VAR substitutions checked before environment variables.' },
            { group:'Providers', name:'ProviderTypes', default:'built-ins', text:'npm sdk id → provider factory.' },
            { group:'Providers', name:'Providers', default:'', text:'The live (enabled and configured) providers.' },
            { group:'Providers', name:'LoadingMessages', default:'["Computing", …]', text:'Words shown while a response streams.' },
            // Limits
            { group:'Limits', name:'Limits.ClientTimeout', default:'120s', text:'Seconds before a provider request is abandoned.' },
            { group:'Limits', name:'Limits.ClientMaxSize', default:'20 MB', text:'Largest response body accepted from a provider.' },
            { group:'Limits', name:'Limits.Retries', default:'3', text:'Provider retry attempts before failing over.' },
            { group:'Limits', name:'Limits.MaxIterations', default:'10', text:'Ceiling on the agentic loop - maximum tool-call rounds in one completion.' },
            { group:'Limits', name:'Limits.StreamCheckpointInterval', default:'250ms', text:'How often an in-flight streamed response is persisted.' },
            // Tools
            { group:'Tools', name:'Tools.EnableApiTools', default:'true', text:'Let Models discover and call the App’s own ServiceStack APIs.' },
            { group:'Tools', name:'Tools.EnableFilesystemTools', default:'false', text:'Read/write/edit/search files within allowed directories.' },
            { group:'Tools', name:'Tools.EnableCodeExecution', default:'false', text:'run_bash and the run_* code execution tools.' },
            { group:'Tools', name:'Tools.AllowedDirectories', default:'[]', text:'Directories filesystem and code tools may access.' },
            { group:'Tools', name:'Tools.ToolTimeout', default:'60s', text:'Per tool-call timeout.' },
            // Hooks
            { group:'Hooks', name:'ValidateRequest', default:'', text:'Run before every Chat UI and API request. Return an IHttpResult to reject - quotas, tenancy, kill switches.' },
            { group:'Hooks', name:'ValidateDownloadUrl', default:'', text:'Called before downloading a URL referenced in a chat message.' },
            { group:'Hooks', name:'UserNamesResolver', default:'', text:'Extra usernames offered in the Admin analytics user filter.' },
            { group:'Hooks', name:'Setup', default:'', text:'Runs after config and providers load, before extensions install - the escape hatch for configuration that must see the loaded feature.' },
            { group:'Hooks', name:'ImageTransformer', default:'', text:'(bytes, width, height) => webp hook used for upload downscaling and ?variant= thumbnails.' },
        ]
        const query = ref('')
        const group = ref('')
        const groups = computed(() => {
            const counts = new Map()
            options.forEach(o => counts.set(o.group, (counts.get(o.group) ?? 0) + 1))
            return [...counts].map(([name, count]) => ({ name, count }))
        })
        const results = computed(() => {
            const q = query.value.trim().toLowerCase()
            return options.filter(o => (!group.value || o.group === group.value) &&
                (!q || `${o.name} ${o.group} ${o.default} ${o.text}`.toLowerCase().includes(q)))
        })
        return { options, query, group, groups, results }
    }
}

/** Capabilities that are off until the host opts in */
const SafeDefaults = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Higher-risk capabilities are opt-in</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">What is on before you configure anything</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="cap in caps" :key="cap.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', cap.on ? onAccent : offAccent]">
          <div class="flex items-start justify-between gap-2">
            <code class="min-w-0 break-words text-sm font-bold text-slate-900 dark:text-white">{{cap.name}}</code>
            <span :class="['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', cap.on ? onTint : offTint]">{{cap.on ? 'on' : 'off'}}</span>
          </div>
          <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{cap.text}}</p>
          <p v-if="cap.note" class="mt-3 border-t border-black/5 pt-2.5 text-xs leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400">{{cap.note}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const onAccent = 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25'
        const offAccent = 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
        const onTint = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
        const offTint = 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
        const caps = [
            { name:'RequireAuth', on:true, text:'Access is gated by the authentication your App already enforces.',
              note:'Set false only for a single-user or internal deployment.' },
            { name:'Tools.EnableApiTools', on:true, text:'Models can discover and call your APIs - but only ones you opt in by tag or attribute, as the signed-in user.' },
            { name:'Tools.EnableFilesystemTools', on:false, text:'Reading, writing, editing and searching files stays unregistered until you turn it on.',
              note:'Then bounded by Tools.AllowedDirectories, and narrowed further per user by Projects.' },
            { name:'Tools.EnableCodeExecution', on:false, text:'run_bash and the run_* tools are not registered at all by default.',
              note:'A multi-user web host should keep this off unless the sandbox is deliberate.' },
            { name:'Mcp.ToolGroups', on:false, text:'The MCP server exposes nothing until you name the tool groups external assistants may reach.' },
            { name:'DisableAdminUi', on:false, text:'Cost, token and activity reporting is available at /admin-ui/chat to your Admin users.' },
        ]
        return { caps, onAccent, offAccent, onTint, offTint }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        ConfigExplorer,
        SafeDefaults,
    }
}
