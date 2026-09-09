import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** What Publish actually does */
const PublishGate = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">More than copying files</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Publish is a controlled promotion boundary</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Design work stays private until an administrator publishes. That step turns
          <i>“copy whatever currently works on my machine”</i> into a repeatable release.
        </p>
      </div>
      <div class="p-6 sm:p-8">
        <div class="grid gap-3 lg:grid-cols-3">
          <div v-for="phase in phases" :key="phase.name"
               :class="['rounded-2xl border p-5 shadow-sm', phase.accent]">
            <div class="flex items-center gap-2.5">
              <span class="text-lg">{{phase.icon}}</span>
              <div class="font-bold text-slate-900 dark:text-white">{{phase.name}}</div>
            </div>
            <ul class="mt-3 space-y-1.5">
              <li v-for="item in phase.items" :key="item"
                  class="flex items-start gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <span class="mt-0.5 shrink-0 text-emerald-500">✓</span><span>{{item}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-5 flex items-start gap-3 rounded-xl border-2 border-rose-300 bg-rose-50/60 px-4 py-3.5 dark:border-rose-900 dark:bg-rose-950/20">
          <span class="mt-0.5 text-lg" aria-hidden="true">↩</span>
          <p class="text-sm leading-6 text-slate-700 dark:text-slate-200">
            <b class="text-slate-900 dark:text-white">If validation or compilation fails, the publish rolls back.</b>
            A payload can be structurally valid and still block a release when long text, an empty collection or
            international characters trigger a Typst failure - which is exactly the point of compiling every fixture.
          </p>
        </div>
      </div>
    </section>`,
    setup() {
        const phases = [
            { icon:'📦', name:'Flatten', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              items:['Follows JSON data, Typst includes, images, assets and versioned libraries','Flattens folder-based authoring into a self-contained artifact set','Rewrites local references for the flattened result'] },
            { icon:'✅', name:'Validate', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              items:['Checks example data and every named fixture against .ui.json','Exercises C# model generation','Checks statically visible data paths','Compiles every fixture through the real flattened template'] },
            { icon:'🔒', name:'Record', accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              items:['Generates the gallery preview','Records publisher and source metadata','Prevents silent takeover of another user’s published name','Saves an immutable revision'] },
        ]
        return { phases }
    }
}

/** Why production output can't drift */
const DeterministicRuntime = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">The same input always renders the same document</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Deterministic by construction</h3>

      <div class="mt-6 grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">At runtime</div>
          <ol class="mt-3 space-y-2">
            <li v-for="(step,i) in steps" :key="step" class="flex items-start gap-2.5">
              <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-[11px] font-black text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">{{i+1}}</span>
              <span class="text-sm leading-6 text-slate-600 dark:text-slate-300">{{step}}</span>
            </li>
          </ol>
        </div>
        <div class="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/25">
          <div class="text-sm font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">What never happens</div>
          <ul class="mt-3 space-y-2">
            <li v-for="never in nevers" :key="never" class="flex items-start gap-2.5">
              <span class="mt-0.5 shrink-0 font-black text-rose-500">✕</span>
              <span class="text-sm leading-6 text-slate-700 dark:text-slate-200">{{never}}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>`,
    setup() {
        const steps = [
            'The [Pdf] model selects the template.',
            'The model serializes to its JSON contract.',
            'IPdfRenderer invokes the published Typst template.',
            'Only the live files in App_Data/pdf are used.',
        ]
        const nevers = [
            'No LLM is called.',
            'No personal Studio workspace is read.',
            'No design-time state affects the output.',
        ]
        return { steps, nevers }
    }
}

/** Operational limits worth knowing before this goes live */
const ProductionControls = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Rendering starts external processes</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Production controls</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="c in controls" :key="c.name"
             class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="mt-0.5 shrink-0 text-emerald-500">✓</span>
          <div class="min-w-0">
            <div class="text-sm font-bold text-slate-900 dark:text-white">{{c.name}}</div>
            <p class="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{{c.text}}</p>
          </div>
        </div>
      </div>
      <div class="mt-4 flex items-start gap-3 rounded-xl border-2 border-amber-300 bg-amber-50/60 px-4 py-3.5 dark:border-amber-800 dark:bg-amber-950/25">
        <span class="mt-0.5 text-lg" aria-hidden="true">⚠</span>
        <p class="text-sm leading-6 text-slate-700 dark:text-slate-200">
          <b class="text-slate-900 dark:text-white">Typst’s root restriction is not an operating-system sandbox.</b>
          It limits which files a document can reach, nothing more - organizations compiling untrusted templates should
          isolate compilation in a container or worker.
        </p>
      </div>
    </section>`,
    setup() {
        const controls = [
            { name:'Render & preview timeouts', text:'A pathological template can’t hold a request open indefinitely.' },
            { name:'Max concurrent renders', text:'Bounds how many Typst processes can run at once.' },
            { name:'Max data payload size', text:'Caps what a caller can hand a template.' },
            { name:'Restricted Typst root', text:'Limits which files a document may reference.' },
            { name:'Flat validated template names', text:'No path traversal through a template name.' },
            { name:'Admin role on every Admin PDF API', text:'Template administration is not an ordinary user capability.' },
            { name:'Per-user path-checked workspaces', text:'One author’s Studio workspace is not reachable from another’s.' },
            { name:'Publish-time validation on by default', text:'ValidateOnPublish = false exists, and is not recommended.' },
            { name:'Pinned Typst and fonts', text:'Deploy the same version and fonts used during validation so output matches.' },
        ]
        return { controls }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, PublishGate, DeterministicRuntime, ProductionControls }
}
