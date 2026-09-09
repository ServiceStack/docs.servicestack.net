import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import FeatureMatrix from "../components/FeatureMatrix.mjs"

/** Every built-in extension, filterable by the area it belongs to */
const ExtensionCatalog = {
    components: { FeatureMatrix },
    template: `<FeatureMatrix eyebrow="Everything above the hosting layer" title="The built-in extensions"
        description="Even the core conversation UI is an extension. Each one owns its own routes, tools, tables, workers and Vue components - and DisableExtensions removes all of them together."
        placeholder="Search…" special-category="Off by default" :features="features" />`,
    setup() {
        const features = [
            { name:'app', category:'Conversation', href:'/chat/overview', text:'Threads, history, avatars and the core conversation UI.', keywords:'chat messages threads' },
            { name:'agents', category:'Conversation', href:'/chat/agents', text:'Agent Profiles and the Profile Manager.', keywords:'profiles personas system prompt' },
            { name:'system_prompts', category:'Conversation', href:'/chat/agents', text:'The system prompt library.', keywords:'prompts library' },
            { name:'skills', category:'Conversation', href:'/chat/skills', text:'Skill management, search, install and authoring.', keywords:'skills packages' },
            { name:'projects', category:'Conversation', href:'/chat/projects', text:'Per-user workspaces and directory boundaries.', keywords:'workspace files scope' },
            { name:'tools', category:'Tools', href:'/chat/tools', text:'The shared Tool Registry and the tools panel.', keywords:'registry groups' },
            { name:'core_tools', category:'Tools', href:'/chat/tools', text:'Utilities, math and code execution tools.', keywords:'calc time run' },
            { name:'api_tools', category:'Tools', href:'/chat/api-tools', text:'Discovery and invocation of the App’s own ServiceStack APIs.', keywords:'api_search api_describe api_call' },
            { name:'mcp', category:'Tools', href:'/chat/mcp', text:'The built-in MCP Server at /chat/mcp.', keywords:'model context protocol external assistants' },
            { name:'computer', category:'Off by default', href:'/chat/tools', badge:'opt-in', text:'Filesystem tools and run_bash.', keywords:'shell bash files dangerous' },
            { name:'publish', category:'Off by default', href:'/chat/overview', badge:'opt-in', text:'Sharing threads, projects and media.', keywords:'share public' },
            { name:'gemini', category:'Knowledge', href:'/chat/gemini-rag', text:'Gemini File Stores for RAG, Website Search and Assistants.', keywords:'rag search assistant filestore' },
            { name:'pdf', category:'Documents', href:'/chat/pdf-studio', text:'PDF Studio at /chat/pdf-studio.', keywords:'typst template designer' },
            { name:'gallery', category:'Media', href:'/chat/media', text:'Browsable catalog of generated images and audio.', keywords:'images audio' },
            { name:'voice', category:'Media', href:'/chat/media', text:'Voice input and transcription.', keywords:'speech ffmpeg mistral microphone' },
            { name:'katex', category:'Media', href:'/chat/overview', text:'Mathematical typesetting.', keywords:'math latex formula' },
            { name:'analytics', category:'Operations', href:'/chat/analytics', text:'Cost, token and activity reporting for admins.', keywords:'usage spend tokens admin' },
            { name:'credentials', category:'Auth', href:'/chat/auth', text:'Username/password sign-in for the Chat UI.', keywords:'login password' },
            { name:'identity', category:'Auth', href:'/chat/auth', text:'Sign-in using the host App’s ASP.NET Identity users.', keywords:'aspnet identity oauth' },
            { name:'custom', category:'Your own', href:'/chat/custom-extensions', text:'Your App’s own UI and routes, served from chat/custom/**.', keywords:'extend custom' },
        ]
        return { features }
    }
}

/** What one extension is allowed to contribute */
const ExtensionSurface = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Server and browser, together</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What one extension can contribute</h3>

      <div class="mt-6 grid gap-3 lg:grid-cols-3">
        <div v-for="side in sides" :key="side.title"
             :class="['rounded-2xl border p-5 shadow-sm', side.accent]">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{side.icon}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{side.title}}</div>
          </div>
          <ul class="mt-3 space-y-1.5">
            <li v-for="item in side.items" :key="item"
                class="flex items-start gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <span class="mt-0.5 shrink-0 text-emerald-500">✓</span><span>{{item}}</span>
            </li>
          </ul>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">The whole UI is assembled from registered Vue components</b>, so an
        extension can add a new one - or deliberately <b class="text-slate-900 dark:text-white">replace</b> an existing
        building block by registering the same component name. No fork required.
      </p>
    </section>`,
    setup() {
        const sides = [
            { icon:'🖥', title:'Server', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              items:['ServiceStack routes under /{RoutePrefix}/ext/{name}/','Model tools and tool groups','Database tables and background workers','Startup and shutdown lifecycle hooks'] },
            { icon:'🎨', title:'Browser', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              items:['UI components and pages','Sidebar and toolbar actions','Import maps and client dependencies','Per-user files and preferences'] },
            { icon:'🔀', title:'Pipeline', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              items:['Chat request filters','Tool and approval filters','Status and response filters','Error filters'] },
        ]
        return { sides }
    }
}

/** The three ways an extension ends up disabled */
const DisableRoutes = {
    template: `
    <section class="not-prose my-10 grid gap-3 lg:grid-cols-3">
      <div v-for="route in routes" :key="route.name"
           :class="['flex flex-col rounded-2xl border p-5 shadow-sm', route.accent]">
        <div class="font-bold text-slate-900 dark:text-white">{{route.name}}</div>
        <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] text-emerald-300 dark:bg-black/50">{{route.code}}</code>
        <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{route.text}}</p>
      </div>
      <p class="lg:col-span-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        A disabled extension registers <b class="text-slate-900 dark:text-white">no routes, no tools and no components</b> -
        the capability disappears from the server and the UI together, rather than being hidden in the browser.
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">InstalledExtensionNames</code> reports what actually loaded.
      </p>
    </section>`,
    setup() {
        const routes = [
            { name:'In code', code:'DisableExtensions = ["computer"]', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'The programmatic list, checked into source control with the rest of your startup configuration.' },
            { name:'In config', code:'"disable_extensions": ["computer"]', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Set in App_Data/chat/llms.json and merged with the programmatic list - useful per environment.' },
            { name:'By itself', code:'// no GEMINI_API_KEY → gemini off', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'gemini without an API key, voice without ffmpeg or Mistral, pdf without typst. A missing prerequisite logs why and disables cleanly.' },
        ]
        return { routes }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        FeatureMatrix,
        ExtensionCatalog,
        ExtensionSurface,
        DisableRoutes,
    }
}
