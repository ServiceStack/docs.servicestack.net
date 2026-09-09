import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** One plugin, and everything it mounts inside your App's existing boundary */
const ChatAnatomy = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50/40 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/30 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One plugin</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What <code class="rounded bg-white px-1.5 py-0.5 text-lg dark:bg-slate-800">AddPlugin(new ChatFeature())</code> gives you</h3>

      <div class="mt-7 rounded-2xl border-2 border-indigo-500/30 bg-white/70 p-4 dark:bg-slate-900/60 sm:p-5">
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-white">Your ServiceStack App</span>
          <span class="text-xs text-slate-500 dark:text-slate-400">your users · your database · your file system · your authorization rules</span>
        </div>

        <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="surface in surfaces" :key="surface.name"
               class="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div class="flex items-center gap-2.5">
              <span class="text-lg">{{surface.icon}}</span>
              <div class="font-bold text-slate-900 dark:text-white">{{surface.name}}</div>
            </div>
            <p class="mt-1.5 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{surface.text}}</p>
            <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] text-emerald-300 dark:bg-black/50">{{surface.where}}</code>
          </div>
        </div>
      </div>

      <p class="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Nothing here is a separate service to deploy or a second identity silo to maintain - every surface runs
        in-process, behind the authentication your App already enforces.
      </p>
    </section>`,
    setup() {
        const surfaces = [
            { icon:'💬', name:'Chat UI', where:'/chat',
              text:'A complete multi-provider chat application, assembled from installed extensions.' },
            { icon:'🔌', name:'OpenAI-compatible API', where:'POST /v1/chat/completions',
              text:'Point any OpenAI client at your App instead of a third-party endpoint.' },
            { icon:'⚙', name:'In-process client', where:'IChatClient',
              text:'Call models from your own C# without an HTTP hop or a second SDK.' },
            { icon:'⚡', name:'API Tools', where:'/chat/api-tools',
              text:'Models discover and call your existing APIs as the signed-in user.' },
            { icon:'🔗', name:'MCP Server', where:'/chat/mcp',
              text:'Expose a named subset of tools to external AI assistants.' },
            { icon:'📚', name:'Gemini RAG', where:'/chat/gemini-rag',
              text:'Managed knowledge bases, Website Search and published Assistants.' },
            { icon:'📄', name:'PDF Studio', where:'/chat/pdf-studio',
              text:'Design Typst documents with AI and publish validated templates.' },
            { icon:'🖨', name:'PDF rendering', where:'IPdfRenderer + PdfFeature',
              text:'Deterministic production rendering with no model at runtime.' },
            { icon:'📊', name:'Admin reporting', where:'/admin-ui/chat',
              text:'Cost, token and activity reporting across users and providers.' },
        ]
        return { surfaces }
    }
}

/** ChatFeature and PdfFeature are independent */
const TwoPlugins = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div v-for="plugin in plugins" :key="plugin.name"
           :class="['flex flex-col rounded-2xl border p-6 shadow-sm', plugin.accent]">
        <div class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm dark:bg-slate-900/70">{{plugin.icon}}</span>
          <code class="text-lg font-bold text-slate-900 dark:text-white">{{plugin.name}}</code>
        </div>
        <div class="mt-4 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Provides</div>
        <ul class="mt-2 flex flex-wrap gap-1.5">
          <li v-for="item in plugin.provides" :key="item"
              class="rounded-lg bg-white/80 px-2.5 py-1 text-xs text-slate-700 ring-1 ring-black/5 dark:bg-slate-900/70 dark:text-slate-300 dark:ring-white/10">{{item}}</li>
        </ul>
        <div class="mt-4 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Requires</div>
        <p class="mt-1 flex-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{{plugin.requires}}</p>
      </div>
      <p class="lg:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        <b class="text-slate-900 dark:text-white">They are independent.</b>
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">PdfFeature</code> has no dependency on
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">ChatFeature</code>, so an App can deploy
        production PDF rendering without installing any AI capability at all.
      </p>
    </section>`,
    setup() {
        const plugins = [
            { icon:'💬', name:'ChatFeature', accent:'border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30',
              provides:['Chat UI','Providers','Tools','API Tools','MCP','Gemini RAG','PDF Studio'],
              requires:'An AI provider API key.' },
            { icon:'📄', name:'PdfFeature', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              provides:['Published template management','Deterministic rendering','Typed C# models'],
              requires:'The typst CLI on PATH (or $TYPST_PATH). Self-disables when missing.' },
        ]
        return { plugins }
    }
}

/** Where each kind of state is persisted */
const StateMap = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Nothing leaves your App</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Where state lives</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="row in rows" :key="row.name"
             :class="['rounded-2xl border p-5 shadow-sm', row.accent]">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{row.icon}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{row.name}}</div>
          </div>
          <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] text-emerald-300 dark:bg-black/50">{{row.where}}</code>
          <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{{row.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const rows = [
            { icon:'🗄', name:'Threads, requests, media', where:'ChatThread · ChatRequest · ChatMedia',
              accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/25',
              text:'Your App’s own database through OrmLite - backed up and queried like every other table.' },
            { icon:'⚙', name:'Configuration', where:'App_Data/chat/llms.json · providers.json',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Plain JSON that is yours to edit and check into source control.' },
            { icon:'👤', name:'Per-user files', where:'App_Data/chat/user/{user}/',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Preferences, projects, profiles, skills and PDF work, partitioned by identity.' },
            { icon:'📦', name:'Cached assets & templates', where:'App_Data/chat/cache/ · App_Data/pdf/',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Content-addressed uploads and downloads, plus published PDF template versions.' },
        ]
        return { rows }
    }
}

/** The questions a reviewer asks before enabling an AI feature */
const SecurityPosture = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Before you enable it</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">The questions a reviewer will ask</h3>
      </div>
      <div class="divide-y divide-slate-200 dark:divide-slate-700">
        <div v-for="row in rows" :key="row.q" class="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-start sm:gap-6 sm:px-8">
          <div class="flex items-start gap-2.5 sm:w-72 sm:shrink-0">
            <span :class="['mt-0.5 shrink-0 text-sm font-black', row.tint]">{{row.mark}}</span>
            <div class="text-sm font-semibold text-slate-900 dark:text-white">{{row.q}}</div>
          </div>
          <p class="min-w-0 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{row.a}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const no  = { mark:'✕', tint:'text-rose-500' }
        const yes = { mark:'✓', tint:'text-emerald-500' }
        const rows = [
            { ...yes, q:'Who can reach /chat?', a:'Whoever RequireAuth and RequiredRole allow, enforced by the authentication your App already has.' },
            { ...no,  q:'Can one user see another’s threads, media or projects?', a:'No. Every piece of state is scoped to the authenticated identity.' },
            { ...yes, q:'What can an Agent call?', a:'Only APIs the signed-in user is authorized to call - the request runs through your normal ServiceStack pipeline.' },
            { ...no,  q:'Can it write files or run code?', a:'Not unless you enable those tools, and then only within the directories you configure.' },
            { ...no,  q:'What is exposed over MCP?', a:'Nothing, until you explicitly name tool groups.' },
            { ...yes, q:'Does it require an outbound AI provider?', a:'Only the providers you configure. Local models through Ollama or LM Studio need no outbound call at all.' },
        ]
        return { rows }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        ChatAnatomy,
        TwoPlugins,
        StateMap,
        SecurityPosture,
    }
}
