import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Everything one named profile packages together */
const ProfileAnatomy = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One system prompt is never enough</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What an Agent Profile packages</h3>

      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="part in parts" :key="part.name"
             class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="mt-0.5 text-lg">{{part.icon}}</span>
          <div class="min-w-0">
            <div class="text-sm font-bold text-slate-900 dark:text-white">{{part.name}}</div>
            <p class="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{{part.text}}</p>
          </div>
        </div>
      </div>

      <div class="mt-6 grid gap-3 lg:grid-cols-3">
        <div v-for="p in builtins" :key="p.name"
             :class="['rounded-2xl border p-5 shadow-sm', p.accent]">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{p.icon}}</span>
            <code class="font-bold text-slate-900 dark:text-white">{{p.name}}</code>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{p.text}}</p>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        Bundled profiles are <b class="text-slate-900 dark:text-white">read-only until a user saves their own copy</b> of
        the same name, at which point the user's version takes precedence.
      </p>
    </section>`,
    setup() {
        const parts = [
            { icon:'🧠', name:'Model', text:'The default model this assistant runs on.' },
            { icon:'📝', name:'System prompt', text:'SYSTEM.md - the instructions that define its behavior.' },
            { icon:'🎨', name:'Theme & avatar', text:'A visual identity so you know which assistant you are talking to.' },
            { icon:'🔧', name:'Allowed tools', text:'onlyTools restricts it to named tools or groups. null allows all.' },
            { icon:'📚', name:'Allowed skills', text:'onlySkills keeps a specialist focused on its own procedures.' },
            { icon:'⚡', name:'Workflow actions', text:'The shortcuts this profile offers in the UI.' },
        ]
        const builtins = [
            { icon:'💬', name:'chat', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'The general-purpose assistant - the default when no profile is selected.' },
            { icon:'🗺', name:'planner', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'Decomposes a goal and writes PLAN.md, without executing anything.' },
            { icon:'⚙', name:'coder', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'Implements an approved plan, with the tools allowed in the selected Project.' },
        ]
        return { parts, builtins }
    }
}

/** Bundled → shared → personal */
const ProfilePrecedence = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Most specific wins</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Where profiles are resolved from</h3>
      <div class="mt-6 space-y-2">
        <div v-for="(root,i) in roots" :key="root.name"
             :class="['flex flex-col gap-x-4 gap-y-2 rounded-xl border p-4 lg:flex-row lg:items-center', root.accent]">
          <div class="flex shrink-0 items-center gap-3 lg:w-40">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">{{i+1}}</span>
            <div class="text-sm font-bold text-slate-900 dark:text-white">{{root.name}}</div>
          </div>
          <code class="w-fit shrink-0 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] text-slate-200 dark:bg-black/50">{{root.path}}</code>
          <p class="min-w-0 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{root.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const roots = [
            { name:'Bundled', path:'chat/profiles/**', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Shipped with the package. A sensible starting point you never have to maintain.' },
            { name:'Shared', path:'App_Data/chat/user/default/profiles/', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Your organization’s own profiles, available to every user.' },
            { name:'Personal', path:'App_Data/chat/user/{user}/profiles/', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              text:'The signed-in user’s own profiles - highest precedence, so anyone can adapt a shared assistant without affecting others.' },
        ]
        return { roots }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, ProfileAnatomy, ProfilePrecedence }
}
