import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** What a Model can reach, and what stays unregistered until you say so */
const ToolPosture = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">A web host is not a localhost sandbox</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">What a Model can reach by default</h3>
      </div>

      <div class="grid gap-3 lg:grid-cols-3">
        <div v-for="tier in tiers" :key="tier.name"
             :class="['flex flex-col rounded-2xl border-2 p-5 shadow-sm', tier.accent]">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <div class="text-base font-bold text-slate-900 dark:text-white">{{tier.name}}</div>
              <code class="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">{{tier.flag}}</code>
            </div>
            <span :class="['shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', tier.tint]">{{tier.state}}</span>
          </div>
          <ul class="mt-4 flex flex-wrap gap-1.5">
            <li v-for="tool in tier.tools" :key="tool"
                class="rounded-lg bg-white/80 px-2 py-1 font-mono text-[11px] text-slate-700 ring-1 ring-black/5 dark:bg-slate-900/70 dark:text-slate-300 dark:ring-white/10">{{tool}}</li>
          </ul>
          <p class="mt-4 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{tier.text}}</p>
          <p v-if="tier.guard" class="mt-3 border-t border-black/5 pt-2.5 text-xs leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400">
            <b class="text-slate-700 dark:text-slate-200">Bounded by:</b> {{tier.guard}}
          </p>
        </div>
      </div>
    </section>`,
    setup() {
        const tiers = [
            { name:'Always available', flag:'no configuration', state:'on', tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20',
              tools:['get_current_time','calc'],
              text:'Harmless utilities so a Model doesn’t guess at the date or do arithmetic in its head.' },
            { name:'Your APIs', flag:'Tools.EnableApiTools', state:'on', tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-indigo-300 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/25',
              tools:['api_search','api_describe','api_call'],
              text:'Models discover and call the App’s own ServiceStack APIs - but only the ones you opt in, and always as the signed-in user.',
              guard:'Your [Tool] opt-in, IncludeTags, and the same authorization every other client goes through.' },
            { name:'Server access', flag:'EnableFilesystemTools · EnableCodeExecution', state:'off', tint:'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
              accent:'border-rose-300 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20',
              tools:['read','write','edit','search','run_bash','run_*'],
              text:'The ability to read, write and execute on your server. Off by default and unregistered entirely until the host turns them on.',
              guard:'Tools.AllowedDirectories, then narrowed further per user by Projects.' },
        ]
        return { tiers }
    }
}

/** How ToolSafety decides what happens without a human */
const SafetyLadder = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Classify the blast radius</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What runs unattended, and what pauses for a human</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">Auto</code> infers safety from the
          HTTP verb. Set it explicitly whenever the verb lies about the consequences - a POST that only runs a report is
          <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">ReadOnly</code>; a POST that emails
          every customer is <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">Destructive</code>.
        </p>
      </div>

      <div class="p-6 sm:p-8">
        <div class="space-y-2">
          <div v-for="level in levels" :key="level.name"
               :class="['flex flex-col gap-x-4 gap-y-2 rounded-xl border p-4 lg:flex-row lg:items-center', level.accent]">
            <div class="flex shrink-0 items-center gap-3 lg:w-40">
              <span class="h-2.5 w-2.5 shrink-0 rounded-full" :class="level.dot"></span>
              <code class="text-sm font-bold text-slate-900 dark:text-white">{{level.name}}</code>
            </div>
            <p class="min-w-0 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{level.text}}</p>
            <span :class="['w-fit shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', level.tint]">{{level.action}}</span>
          </div>
        </div>

        <div class="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-900 dark:bg-indigo-950/30">
          <p class="text-sm leading-6 text-slate-700 dark:text-slate-200">
            <b class="text-slate-900 dark:text-white">No tool-specific UI has to be written.</b> A paused call renders an
            editable form generated from the tool’s own JSON Schema, so the user sees the exact request before approving -
            and every tool you add later gets the same treatment. Approvals are durable: a paused call survives a page
            reload, and the Model is told afterwards whether the proposal was approved as-is or modified.
          </p>
        </div>
      </div>
    </section>`,
    setup() {
        const levels = [
            { name:'ReadOnly', dot:'bg-emerald-500', accent:'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20',
              text:'Only reads data. Safe to call unattended and safe to retry.',
              action:'Runs immediately', tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
            { name:'Write', dot:'bg-amber-500', accent:'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20',
              text:'Creates or updates data. Recoverable, but retrying may duplicate the change.',
              action:'Approval form', tint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
            { name:'Destructive', dot:'bg-rose-500', accent:'border-rose-200 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20',
              text:'Deletes data or triggers a real-world side effect - a refund, an email, a shipment.',
              action:'Approval form', tint:'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
            { name:'Auto', dot:'bg-slate-400', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'The default. Inferred from the HTTP verb - GET/HEAD is read-only, DELETE is destructive, everything else is a write.',
              action:'Inferred', tint:'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
        ]
        return { levels }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        ToolPosture,
        SafetyLadder,
    }
}
