import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Everything Apple requires before a single line of code */
const AppleRequirements = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Configured at Apple, before any code</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What Sign in with Apple needs from you</h3>

      <div class="mt-7 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div v-for="(step,i) in steps" :key="step.name" class="contents">
          <div :class="['rounded-2xl border p-5 shadow-sm', step.accent]">
            <div class="flex items-center gap-2.5">
              <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">{{i+1}}</span>
              <div class="min-w-0 font-bold text-slate-900 dark:text-white">{{step.name}}</div>
            </div>
            <p class="mt-2.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{step.text}}</p>
          </div>
          <div v-if="i < steps.length - 1" class="flex items-center justify-center text-2xl text-indigo-400" aria-hidden="true">
            <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
          </div>
        </div>
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-3">
        <div v-for="a in artifacts" :key="a.name" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <code class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{a.name}}</code>
          <p class="mt-1.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{{a.text}}</p>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">The order matters.</b> A Service ID is created from an App ID, and the
        private key is issued against the App ID - so working backwards from the key means starting over.
      </p>
    </section>`,
    setup() {
        const steps = [
            { name:'Team ID', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Your membership identifier, from the Apple Developer membership page.' },
            { name:'App ID', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Create and configure an App ID with Sign in with Apple enabled.' },
            { name:'Service ID', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'Created from the App ID - this is what a web sign-in flow identifies itself as.' },
        ]
        const artifacts = [
            { name:'Team ID', text:'Identifies your developer account.' },
            { name:'Service ID', text:'The client id your web App sends.' },
            { name:'Private key (.p8)', text:'Signs the client secret. Downloadable once - store it safely.' },
        ]
        return { steps, artifacts }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, AppleRequirements }
}
