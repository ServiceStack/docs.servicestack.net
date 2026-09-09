import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** The whole install, start to first conversation */
const InstallJourney = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Four steps</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">From an existing App to your first conversation</h3>

      <div class="mt-7 grid gap-3 sm:grid-cols-2">
        <div v-for="(step,i) in steps" :key="step.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2.5">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-black text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">{{i+1}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{step.name}}</div>
          </div>
          <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] text-emerald-300 dark:bg-black/50">{{step.cmd}}</code>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{step.text}}</p>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Your existing users sign in immediately</b> with the account they
        already have - there is no separate AI Chat user store to create or migrate.
      </p>
    </section>`,
    setup() {
        const steps = [
            { name:'Add the plugin', cmd:'npx add-in chat',
              text:'Adds the package and writes a Configure.AI.Chat.cs modular startup registering ChatFeature and PdfFeature.' },
            { name:'Configure a provider', cmd:'OPENAI_API_KEY=…',
              text:'Any one key is enough to start. Providers self-enable when their key resolves.' },
            { name:'Run it', cmd:'/chat',
              text:'Open the route in your running App and start a conversation.' },
            { name:'Link to it', cmd:'feature.AddPluginLink("/chat")',
              text:'Surface AI Chat from ServiceStack’s metadata page so your team can find it.' },
        ]
        return { steps }
    }
}

/** Hard requirements vs optional capabilities that self-disable */
const Requirements = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div v-for="group in groups" :key="group.title"
           :class="['rounded-2xl border p-6 shadow-sm', group.accent]">
        <div class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm dark:bg-slate-900/70">{{group.icon}}</span>
          <div>
            <div class="text-lg font-bold text-slate-900 dark:text-white">{{group.title}}</div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{group.tagline}}</div>
          </div>
        </div>
        <dl class="mt-5 space-y-2">
          <div v-for="item in group.items" :key="item.name"
               class="rounded-xl bg-white/80 px-3.5 py-2.5 ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10">
            <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <dt class="text-sm font-bold text-slate-900 dark:text-white">{{item.name}}</dt>
              <dd class="text-xs text-slate-500 dark:text-slate-400">{{item.needed}}</dd>
            </div>
            <dd v-if="item.note" class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{{item.note}}</dd>
          </div>
        </dl>
      </div>
    </section>`,
    setup() {
        const groups = [
            { icon:'✅', title:'Required', tagline:'Already true for most Apps',
              accent:'border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30',
              items:[
                { name:'.NET 8+', needed:'Everything', note:'net8.0 and net10.0 builds ship in the package.' },
                { name:'IDbConnectionFactory', needed:'Threads, analytics, media, Gemini', note:'Registered by every ServiceStack App template.' },
                { name:'One provider API key', needed:'Talking to a model', note:'Or a local model through Ollama / LM Studio.' },
                { name:'AuthFeature or Identity Auth', needed:'RequireAuth = true', note:'Skip only for a single-user or internal deployment.' },
              ] },
            { icon:'🔌', title:'Optional', tagline:'Self-disables when missing',
              accent:'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40',
              items:[
                { name:'typst CLI', needed:'PDF Studio + rendering', note:'Resolved from $TYPST_PATH first, then PATH.' },
                { name:'ffmpeg or Mistral', needed:'Voice transcription', note:'Voice input disappears from the UI when neither is available.' },
              ] },
        ]
        return { groups }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        InstallJourney,
        Requirements,
    }
}
