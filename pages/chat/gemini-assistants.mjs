import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** What the server owns vs what the host page may override */
const EmbedBoundary = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">The trust boundary</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">What the embed can and cannot change</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          One script tag publishes the Assistant, but the parts that decide what it can retrieve and say never
          leave the server - they aren't in the public JavaScript, so a compromised or hostile host page
          cannot widen them.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <div v-for="side in sides" :key="side.title"
             :class="['rounded-2xl border-2 p-6 shadow-sm', side.accent]">
          <div class="flex items-center gap-3">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm dark:bg-slate-900/70">{{side.icon}}</span>
            <div>
              <div class="text-lg font-bold text-slate-900 dark:text-white">{{side.title}}</div>
              <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{{side.tagline}}</div>
            </div>
          </div>
          <ul class="mt-5 space-y-2">
            <li v-for="item in side.items" :key="item.name"
                class="flex items-start gap-2.5 rounded-xl bg-white/80 px-3.5 py-2.5 ring-1 ring-black/5 dark:bg-slate-900/70 dark:ring-white/10">
              <span :class="['mt-0.5 shrink-0 text-sm', side.markTint]">{{side.mark}}</span>
              <div class="min-w-0">
                <div class="text-sm font-semibold text-slate-900 dark:text-white">{{item.name}}</div>
                <code v-if="item.attr" class="mt-0.5 block text-[11px] text-indigo-600 dark:text-indigo-400">{{item.attr}}</code>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        <b class="text-slate-900 dark:text-white">Why the script itself needs no CORS:</b> browsers may load a
        public classic <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">&lt;script&gt;</code>
        across origins. The access check is applied to each <i>chat request</i> using its
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">Origin</code> header - and requests
        without an Origin are refused whenever an allowlist is configured.
      </div>
    </section>`,
    setup() {
        const sides = [
            { icon:'🔒', title:'Server-enforced', tagline:'Not in the public JavaScript',
              accent:'border-indigo-300 bg-indigo-50/60 dark:border-indigo-800 dark:bg-indigo-950/30',
              mark:'✕', markTint:'text-rose-500',
              items:[
                { name:'Document scope (category, type, status, locale, product, version, tag)' },
                { name:'Private system prompt and behavior template' },
                { name:'Gemini model selection' },
                { name:'Required grounding and minimum citations' },
                { name:'Allowed origins allowlist' },
                { name:'Requests-per-minute rate limit' },
              ] },
            { icon:'🎨', title:'Host-overridable', tagline:'Presentation only, via script attributes',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              mark:'✓', markTint:'text-emerald-500',
              items:[
                { name:'Theme', attr:'data-theme="dark"' },
                { name:'Launcher corner', attr:'data-position="bottom-left"' },
                { name:'Accent color', attr:'data-accent="#7c3aed"' },
                { name:'Launcher icon', attr:'data-icon="chat"' },
                { name:'Mount inside your own layout', attr:'data-mount="#assistant-slot"' },
                { name:'Force the floating launcher', attr:'data-mount="none"' },
              ] },
        ]
        return { sides }
    }
}

/** The seven editable behavior templates */
const BehaviorTemplates = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Starting points, not straitjackets</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Seven behavior templates</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Each is an editable specialist prompt. The server combines it with shared RAG rules for retrieval,
          grounding, prompt-injection resistance, conflicting documents, conversation context, fallback
          behavior and response formatting - so the same knowledge base can power several purpose-built
          Assistants without duplicating its content.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="t in templates" :key="t.name"
             class="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{t.icon}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{t.name}}</div>
          </div>
          <p class="mt-2 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{t.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const templates = [
            { icon:'📘', name:'Documentation guide', text:'Product manuals, reference material and general how-to questions.' },
            { icon:'🔧', name:'Technical troubleshooter', text:'Diagnosis that progresses from symptoms to safe checks and fixes.' },
            { icon:'🎧', name:'Customer support', text:'Clear policy and process answers with practical next actions.' },
            { icon:'⌨', name:'Developer / API assistant', text:'Precise APIs, code, commands, prerequisites and version-sensitive guidance.' },
            { icon:'🧭', name:'Product advisor', text:'Capability fit, trade-offs, prerequisites and documented limitations.' },
            { icon:'🚀', name:'Onboarding guide', text:'Ordered milestones leading to a first successful outcome.' },
            { icon:'📋', name:'Policy and procedures', text:'Controlled interpretations of policies, responsibilities and escalation paths.' },
        ]
        return { templates }
    }
}

/** Draft → Published → Unpublished → Archived → Deleted */
const AssistantLifecycle = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Deployment lifecycle</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Every state is reversible except the last one</h3>

      <div class="mt-7 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
        <div v-for="(state,i) in states" :key="state.name" class="contents">
          <div :class="['rounded-2xl border p-4 shadow-sm', state.accent]">
            <div class="flex items-center gap-2">
              <span class="h-2.5 w-2.5 shrink-0 rounded-full" :class="state.dot"></span>
              <div class="font-bold text-slate-900 dark:text-white">{{state.name}}</div>
            </div>
            <p class="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{{state.text}}</p>
            <div v-if="state.public" class="mt-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                 :class="state.publicTint">{{state.public}}</div>
          </div>
          <div v-if="i < states.length - 1" class="flex items-center justify-center text-xl text-slate-400" aria-hidden="true">
            <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
          </div>
        </div>
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-2">
        <div v-for="g in guards" :key="g.name" class="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900 dark:bg-amber-950/20">
          <div class="text-sm font-bold text-slate-900 dark:text-white">{{g.name}}</div>
          <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{g.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const states = [
            { name:'Draft', dot:'bg-slate-400', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Save draft while configuring identity, scope, behavior and appearance.',
              public:'Not public', publicTint:'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
            { name:'Published', dot:'bg-emerald-500', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Available at a stable deployment ID on the g query string, ready to embed.',
              public:'Live', publicTint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
            { name:'Unpublished', dot:'bg-amber-500', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Taken offline while remaining fully editable. Publish again when ready.',
              public:'Offline', publicTint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
            { name:'Archived', dot:'bg-slate-500', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Offline and read-only, retaining configuration and conversations. Restore returns it as a draft.',
              public:'Read-only', publicTint:'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
        ]
        const guards = [
            { name:'Regenerate ID', text:'Invalidates every old embed immediately and issues a replacement deployment ID.' },
            { name:'Delete permanently', text:'Removes the Assistant, conversations, messages and citations. The confirmation shows affected referrer domains and when each was last used, then requires the Assistant name typed exactly.' },
        ]
        return { states, guards }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        EmbedBoundary,
        BehaviorTemplates,
        AssistantLifecycle,
    }
}
