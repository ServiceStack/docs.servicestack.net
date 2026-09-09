import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import WorkflowShowcase from "../components/WorkflowShowcase.mjs"

/** Why three stable tools beat one tool per API */
const ThreeTools = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Context is the constraint</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Three tools, not one per API</h3>

      <div class="mt-6 grid gap-3 sm:grid-cols-2">
        <div class="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 dark:border-rose-900 dark:bg-rose-950/20">
          <div class="text-sm font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">The naive approach</div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900 dark:text-white">156K</span>
            <span class="text-sm text-slate-600 dark:text-slate-300">tokens of schema</span>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            What 270 APIs cost if every schema is sent on every request - expensive, slow and confusing, before the
            Model has done anything.
          </p>
        </div>
        <div class="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/25">
          <div class="text-sm font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">API Tools</div>
          <div class="mt-3 flex items-baseline gap-2">
            <span class="text-3xl font-black text-slate-900 dark:text-white">1</span>
            <span class="text-sm text-slate-600 dark:text-slate-300">compact search index</span>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Only the index is loaded eagerly. A Model pays for an API’s schema only when it actually decides to use it.
          </p>
        </div>
      </div>

      <div class="mt-4 grid gap-3 lg:grid-cols-3">
        <div v-for="(tool,i) in tools" :key="tool.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2.5">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-black text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">{{i+1}}</span>
            <code class="font-bold text-slate-900 dark:text-white">{{tool.name}}</code>
          </div>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{tool.text}}</p>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <span v-for="tag in tool.tags" :key="tag"
                  class="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700">{{tag}}</span>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const tools = [
            { name:'api_search', text:'Find the APIs relevant to the user’s intent from a compact, ranked index.', tags:['Low context','Ranked'] },
            { name:'api_describe', text:'Return complete schemas and workflow metadata for just the APIs it selected.', tags:['Just in time','JSON Schema'] },
            { name:'api_call', text:'Invoke an API using its typed Request DTO - as the current user, through the normal pipeline.', tags:['Authorized','Validated'] },
        ]
        return { tools }
    }
}

/** The CoffeeShop order, step by step */
const DiscoveryJourney = {
    components: { WorkflowShowcase },
    template: `<WorkflowShowcase eyebrow="“Two grande hot oat milk lattes with light vanilla syrup for Sam”"
        title="How a Model gets from intent to a persisted order" :steps="steps" />`,
    setup() {
        const steps = [
            { name:'Search', caption:'api_search', title:'Find APIs related to ordering coffee', tags:['Compact index','Ranked'],
              description:'The Model starts from intent - not a route name, a DTO or a hand-written tool definition. api_search returns compact candidates ranked from your ServiceStack metadata, tags, descriptions and [Tool] guidance.' },
            { name:'Describe', caption:'api_describe', title:'Load the exact contracts it needs', tags:['JSON Schema','Workflow metadata'],
              description:'It pulls full schemas for just the menu, preview and create-order APIs it found - so the rest of your API surface never enters context.' },
            { name:'Resolve', caption:'api_call (menu)', title:'Ask the live application, don’t guess', tags:['Live data','No snapshot'],
              description:'Calling the menu API resolves the current product Id, supported sizes and available options. Nothing about the menu was memorized from a prompt, so the same conversation keeps working as products and prices change.' },
            { name:'Preview', caption:'api_call (preview)', title:'Let the App validate and price it', tags:['Defaults','Validation','Price'],
              description:'The preview API applies defaults, validates the customizations and calculates the current price. Deterministic business rules stay in your App where they belong.' },
            { name:'Approve', caption:'Schema-driven form', title:'The user sees the exact request first', tags:['Editable','Human in the loop'],
              description:'The proposed CreateCoffeeShopOrder is rendered as an editable form generated from its own schema. On approval it is submitted and the persisted order number is reported back.' },
        ]
        return { steps }
    }
}

/** Where this pattern pays off */
const UseCases = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Past the demo page</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Where API Tools fit</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          CoffeeShop is deliberately easy to follow, but any workflow expressible as well-designed APIs can be reached
          in natural language - still bounded by the caller’s own permissions.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="c in cases" :key="c.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{c.icon}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{c.name}}</div>
          </div>
          <p class="mt-2 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{c.text}}</p>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        Because the <a href="/chat/tools" class="font-semibold text-indigo-600 underline decoration-dotted dark:text-indigo-400">Tool Registry</a>
        is shared, your business APIs run alongside search, files, images, audio and custom extensions in the
        <b class="text-slate-900 dark:text-white">same conversation</b>.
      </p>
    </section>`,
    setup() {
        const cases = [
            { icon:'🎧', name:'Customer service', text:'Look up recent orders, inspect delivery status, issue an approved refund or add an account note - bounded by that staff member’s permissions.' },
            { icon:'📅', name:'Bookings & scheduling', text:'Search availability, resolve customers and resources, preview a booking, then approve before committing it.' },
            { icon:'🛒', name:'Commerce & procurement', text:'Find products from live inventory, price them, validate quantities and submit an approved purchase - with no catalog snapshot in the prompt.' },
            { icon:'📊', name:'Business intelligence', text:'Focused read-only reporting and AutoQuery APIs answer questions in natural language, with Fields and Take keeping results within useful context limits.' },
            { icon:'⚙', name:'Internal operations', text:'Create tickets, update CRM records, run reports or start deployment workflows, with destructive actions explicitly classified and guarded.' },
            { icon:'🤖', name:'Vertical assistants', text:'Package the domain knowledge already in your APIs. The App stays responsible for validation and authorization, the Model for language and orchestration.' },
        ]
        return { cases }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        ThreeTools,
        DiscoveryJourney,
        UseCases,
    }
}
