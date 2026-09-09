import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import WorkflowShowcase from "../components/WorkflowShowcase.mjs"

/** Three callers, one pipeline */
const ApiSurfaces = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Three ways in, one path through</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Every caller runs the same pipeline</h3>

      <div class="mt-7 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div class="grid gap-2.5">
          <div v-for="c in callers" :key="c.name"
               class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div class="flex items-center gap-2.5">
              <span class="text-lg">{{c.icon}}</span>
              <div class="text-sm font-bold text-slate-900 dark:text-white">{{c.name}}</div>
            </div>
            <code class="mt-2 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] text-emerald-300 dark:bg-black/50">{{c.where}}</code>
            <p class="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{{c.text}}</p>
          </div>
        </div>

        <div class="flex justify-center text-2xl text-indigo-400" aria-hidden="true">
          <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
        </div>

        <div class="rounded-2xl border-2 border-indigo-500/40 bg-white p-5 shadow-lg shadow-indigo-500/10 dark:bg-slate-900">
          <div class="text-sm font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">The same pipeline</div>
          <ul class="mt-3 space-y-1.5">
            <li v-for="s in shared" :key="s"
                class="flex items-start gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <span class="mt-0.5 shrink-0 text-emerald-500">✓</span><span>{{s}}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>`,
    setup() {
        const callers = [
            { icon:'💬', name:'The Chat UI', where:'/chat', text:'What your users see - threads, tools, approvals and media.' },
            { icon:'🔌', name:'OpenAI-compatible API', where:'POST /v1/chat/completions', text:'Point any existing OpenAI client at your App instead of a vendor endpoint.' },
            { icon:'⚙', name:'In-process client', where:'IChatClient', text:'Call a model from your own C# with no HTTP hop and no second SDK.' },
        ]
        const shared = [
            'Provider selection for the requested model',
            'Retry and failover per Limits.Retries',
            'The tool loop, bounded by Limits.MaxIterations',
            'Usage and cost accounting into ChatRequest',
        ]
        return { callers, shared }
    }
}

/** What happens between request and recorded row */
const RequestPipeline = {
    components: { WorkflowShowcase },
    template: `<WorkflowShowcase eyebrow="Request to recorded usage" title="The pipeline in brief" :steps="steps" />`,
    setup() {
        const steps = [
            { name:'Admit', caption:'OnRequestAsync · ValidateRequest', title:'Resolve identity, then decide whether to proceed', tags:['API keys','Per-user setup','Your veto'],
              description:'Any Bearer API key is resolved onto the request and first-request-per-user setup handlers run. ValidateRequest then gets the final say - return an IHttpResult to reject a request over quota, out of hours, or from a suspended tenant.' },
            { name:'Filter', caption:'Chat request filters', title:'Extensions shape the outgoing request', tags:['Extension hooks'],
              description:'Every installed extension can mutate the request before it leaves - adding context, tools or provider arguments without the caller knowing.' },
            { name:'Route', caption:'Provider selection', title:'Pick a provider, with retry and failover', tags:['Limits.Retries','Failover'],
              description:'A provider is selected for the requested model name. Failures retry and then fail over, so one vendor having a bad afternoon doesn’t take your feature down.' },
            { name:'Loop', caption:'Tool calls', title:'Execute tools until the Model is done', tags:['Limits.MaxIterations','Approvals'],
              description:'Tool calls run in a loop bounded by MaxIterations, pausing for human approval wherever a tool’s safety classification requires it.' },
            { name:'Record', caption:'Checkpoint · filters · ChatRequest', title:'Persist safely, then account for it', tags:['Crash-safe streaming','Usage','Cost'],
              description:'Streamed output is checkpointed into ChatThread.StreamingMessage - deliberately kept out of the durable Messages so a failed stream can’t damage the conversation. Response filters run, and usage and cost are written as a ChatRequest row.' },
        ]
        return { steps }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, ApiSurfaces, RequestPipeline }
}
