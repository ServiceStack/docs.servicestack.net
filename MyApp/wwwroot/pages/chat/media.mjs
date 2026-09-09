import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Voice in, media out, catalogued on the way through */
const MediaPipeline = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Beyond text</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Every modality lands in the same catalog</h3>

      <div class="mt-7 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">In</div>
          <div class="mt-2 space-y-2">
            <div v-for="i in inputs" :key="i.name" class="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
              <div class="text-sm font-bold text-slate-900 dark:text-white">{{i.name}}</div>
              <div class="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{{i.text}}</div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center text-2xl text-indigo-400" aria-hidden="true">
          <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
        </div>

        <div class="rounded-2xl border-2 border-indigo-500/40 bg-white p-5 shadow-lg shadow-indigo-500/10 dark:bg-slate-900">
          <div class="text-sm font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Content-addressed cache</div>
          <p class="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Hashed once and stored once, whatever produced it.
          </p>
          <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] text-emerald-300 dark:bg-black/50">/chat/~cache/{hash}.{ext}</code>
          <div class="mt-3 rounded-lg bg-indigo-50 px-3 py-2 text-xs leading-5 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-200">
            Each write fires <code>cache_saved</code>, which is how the gallery records a <code>ChatMedia</code> row.
          </div>
        </div>

        <div class="flex items-center justify-center text-2xl text-indigo-400" aria-hidden="true">
          <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
        </div>

        <div class="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/25">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Out</div>
          <div class="mt-2 text-sm font-bold text-slate-900 dark:text-white">A queryable gallery</div>
          <p class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
            Not lost inside a transient provider response. Recorded per item:
          </p>
          <ul class="mt-2.5 flex flex-wrap gap-1">
            <li v-for="f in fields" :key="f"
                class="rounded bg-white/80 px-1.5 py-0.5 text-[10px] text-slate-600 ring-1 ring-black/5 dark:bg-slate-900/70 dark:text-slate-300 dark:ring-white/10">{{f}}</li>
          </ul>
        </div>
      </div>

      <p class="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
        Media is scoped to the user who generated it, and every modality is a
        <b class="text-slate-900 dark:text-white">sub-provider on a provider definition</b> - so an unsupported modality
        drops just that capability rather than disabling the whole provider.
      </p>
    </section>`,
    setup() {
        const inputs = [
            { name:'Voice', text:'POST /chat/transcribe - multipart audio, speech to text.' },
            { name:'Attachments', text:'POST /chat/upload - images and documents.' },
            { name:'Generation', text:'Image, audio and speech modality sub-providers.' },
        ]
        const fields = ['name','type','prompt','model','cost','seed','dimensions','size','duration','aspect','hash','reactions','caption','tags','rating']
        return { inputs, fields }
    }
}

/** Transcription backends, in the order they're tried */
const VoiceOptions = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">First available wins</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">How transcription is resolved</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          The <code class="rounded bg-slate-100 px-1.5 py-0.5 text-sm dark:bg-slate-800">LLMS_VOICE</code> order decides
          which backend handles speech. Set it to prefer a hosted service over local CLIs, or the reverse.
        </p>
      </div>
      <div class="grid gap-3 lg:grid-cols-3">
        <div v-for="(opt,i) in options" :key="opt.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', opt.accent]">
          <div class="flex items-center gap-2.5">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">{{i+1}}</span>
            <code class="font-bold text-slate-900 dark:text-white">{{opt.name}}</code>
          </div>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Requires</div>
          <p class="mt-1 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{opt.requires}}</p>
          <span :class="['mt-3 w-fit rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider', opt.tint]">{{opt.where}}</span>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">When none are available the extension disables itself</b> - no route,
        no microphone button, no half-working feature for users to discover.
      </p>
    </section>`,
    setup() {
        const options = [
            { name:'voxtype', requires:'The voxtype CLI on PATH, plus ffmpeg.', where:'Local',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900' },
            { name:'transcribe', requires:'The transcribe CLI on PATH, plus ffmpeg.', where:'Local',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900' },
            { name:'voxtral-*', requires:'The mistral provider enabled with MISTRAL_API_KEY.', where:'Hosted',
              tint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30' },
        ]
        return { options }
    }
}

/** Narrowing what users can reach */
const MediaControls = {
    template: `
    <section class="not-prose my-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="c in controls" :key="c.name"
           class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <code class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{c.name}}</code>
        <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{c.text}}</p>
      </div>
    </section>`,
    setup() {
        const controls = [
            { name:'EnableProviders', text:'Restrict which vendors and models users can reach at all - ["ollama"] means nothing leaves the network.' },
            { name:'DisableExtensions', text:'Drop voice, gallery or katex entirely from the server and UI together.' },
            { name:'ImageTransformer', text:'Downscale uploads and serve ?variant= thumbnails. Without one, originals are served as-is.' },
            { name:'ValidateDownloadUrl', text:'Vet any URL referenced in a chat message before AI Chat fetches it.' },
        ]
        return { controls }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, MediaPipeline, VoiceOptions, MediaControls }
}
