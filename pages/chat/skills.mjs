import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Why a description-first design keeps prompts small */
const ProgressiveDisclosure = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Specialists stay specialists</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Fifty skills cost fifty lines, not fifty documents</h3>

      <div class="mt-7 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center justify-between gap-2">
            <div class="font-bold text-slate-900 dark:text-white">Always in context</div>
            <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">one line each</span>
          </div>
          <div class="mt-3 space-y-1.5">
            <div v-for="s in visible" :key="s" class="truncate rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{{s}}</div>
          </div>
          <p class="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Every skill’s <b class="text-slate-700 dark:text-slate-200">description</b> - just enough for the Model to
            recognise when it is relevant.
          </p>
        </div>

        <div class="flex flex-col items-center justify-center gap-2 text-center">
          <code class="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-bold text-white">skill</code>
          <span class="text-2xl text-indigo-400" aria-hidden="true"><span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span></span>
          <span class="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">only when called</span>
        </div>

        <div class="rounded-2xl border-2 border-indigo-400/50 bg-indigo-50/50 p-5 shadow-sm dark:border-indigo-800 dark:bg-indigo-950/25">
          <div class="font-bold text-slate-900 dark:text-white">Loaded on demand</div>
          <div class="mt-3 rounded-lg bg-white p-3 ring-1 ring-indigo-200 dark:bg-slate-900 dark:ring-indigo-800">
            <div class="text-xs font-bold text-slate-900 dark:text-white">incident-response/</div>
            <div class="mt-1.5 space-y-1 pl-3 text-[11px] text-slate-500 dark:text-slate-400">
              <div v-for="f in files" :key="f">{{f}}</div>
            </div>
          </div>
          <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            The full procedure, runbooks and templates enter context only once the Model decides it needs them.
          </p>
        </div>
      </div>
    </section>`,
    setup() {
        const visible = [
            'incident-response — Triage and respond to a production incident…',
            'customer-onboarding — Take a signed customer to first value…',
            'code-review — Review a change for correctness and risk…',
            'compliance-check — Verify a release against policy…',
        ]
        const files = ['SKILL.md','runbooks/database-failover.md','runbooks/cache-eviction.md','templates/postmortem.md']
        return { visible, files }
    }
}

/** The SKILL.md frontmatter contract */
const SkillManifest = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One manifest, any supporting files</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What SKILL.md declares</h3>
      </div>
      <div class="divide-y divide-slate-200 dark:divide-slate-700">
        <div v-for="key in keys" :key="key.name" class="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-start sm:gap-5 sm:px-8">
          <code class="shrink-0 text-sm font-bold text-indigo-600 dark:text-indigo-400 sm:w-36">{{key.name}}</code>
          <div class="min-w-0 flex-1">
            <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">{{key.text}}</p>
            <p v-if="key.note" class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{{key.note}}</p>
          </div>
        </div>
      </div>
      <p class="border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 sm:px-8">
        <b class="text-slate-900 dark:text-white">description is the one line that decides everything.</b> It is all the
        Model sees before choosing whether to load the skill, so write it as a trigger - what situation this is for -
        rather than a summary of the contents.
      </p>
    </section>`,
    setup() {
        const keys = [
            { name:'name', text:'Skill identifier.', note:'Defaults to the folder name.' },
            { name:'description', text:'The one line the Model sees before deciding to load the skill.' },
            { name:'license', text:'Optional license attribution.' },
            { name:'allowed-tools', text:'Tools this skill expects to be available.', note:'e.g. api_search, api_describe, api_call' },
            { name:'metadata.*', text:'Arbitrary additional properties for your own tooling.' },
        ]
        return { keys }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, ProgressiveDisclosure, SkillManifest }
}
