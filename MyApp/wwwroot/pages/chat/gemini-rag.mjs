import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import GeminiPipeline from "../components/GeminiPipeline.mjs"

/** The documentation set laid out as the lifecycle of a knowledge base */
const GeminiDocMap = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">The shape of these docs</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Follow the lifecycle of a knowledge base</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Each guide picks up where the last one ends. Read them in order for a first knowledge base,
          or jump to the stage you're working on.
        </p>
      </div>

      <div v-for="stage in stages" :key="stage.name" class="mb-4 last:mb-0">
        <div class="mb-2 flex items-center gap-3">
          <span :class="['flex h-7 items-center rounded-lg px-2.5 text-[11px] font-black uppercase tracking-wider', stage.tint]">{{stage.name}}</span>
          <span class="text-sm text-slate-500 dark:text-slate-400">{{stage.caption}}</span>
        </div>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a v-for="guide in stage.guides" :key="guide.title" :href="guide.href"
             class="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
            <div class="flex items-start gap-3">
              <span class="mt-0.5 text-lg">{{guide.icon}}</span>
              <div class="min-w-0">
                <div class="font-bold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{{guide.title}}</div>
                <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{guide.text}}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>`,
    setup() {
        const stages = [
            { name:'Build', caption:'Get content in, and make it retrievable',
              tint:'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              guides:[
                { icon:'📥', title:'Importing Documents', href:'/chat/gemini-imports',
                  text:'Uploads, ZIP archives, folder imports, previews and recurring synchronization.' },
                { icon:'🌐', title:'Crawling Websites', href:'/chat/gemini-crawling',
                  text:'Fetch a site into an inspectable Markdown workspace before anything is indexed.' },
                { icon:'🏷', title:'Metadata & Source URLs', href:'/chat/gemini-metadata',
                  text:'The fields that scope retrieval, and the templates that make citations durable.' },
              ] },
            { name:'Use', caption:'Query it privately and keep it healthy',
              tint:'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
              guides:[
                { icon:'🔎', title:'Explore & Ask', href:'/chat/gemini-explore',
                  text:'Browse, filter, maintain the catalogue and ask grounded questions with citations.' },
              ] },
            { name:'Publish', caption:'Serve the same content to your visitors',
              tint:'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              guides:[
                { icon:'⌘K', title:'Website Search', href:'/chat/gemini-search',
                  text:'A model-free search widget answered by your own RDBMS.' },
                { icon:'💬', title:'AI Assistants', href:'/chat/gemini-assistants',
                  text:'A branded, citation-backed chat widget published with one script tag.' },
                { icon:'📈', title:'Search Analytics & Privacy', href:'/chat/gemini-analytics',
                  text:'Search quality signals and optional first-party traffic analytics.' },
              ] },
            { name:'Operate', caption:'Keep it working in production',
              tint:'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              guides:[
                { icon:'🩺', title:'Operations & Troubleshooting', href:'/chat/gemini-operations',
                  text:'Index health, diagnostics, storage, access and common failures.' },
              ] },
        ]
        return { stages }
    }
}

/** Where each piece of state lives, and what Google actually charges for */
const StorageEconomics = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-3">
      <div v-for="card in cards" :key="card.title"
           :class="['rounded-2xl border p-5 shadow-sm', card.accent]">
        <div class="flex items-center gap-2.5">
          <span class="text-lg">{{card.icon}}</span>
          <div class="font-bold text-slate-900 dark:text-white">{{card.title}}</div>
        </div>
        <div :class="['mt-3 text-2xl font-black', card.priceTint]">{{card.price}}</div>
        <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{card.text}}</p>
      </div>
    </section>`,
    setup() {
        const cards = [
            { icon:'🧮', title:'Indexing documents', price:'Charged', priceTint:'text-amber-600 dark:text-amber-400',
              accent:'border-amber-200 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/20',
              text:'Embeddings are billed when a document is indexed. Content-addressed deduplication means the same document uploaded twice is indexed once.' },
            { icon:'🗄', title:'Storage & queries', price:'Free', priceTint:'text-emerald-600 dark:text-emerald-400',
              accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20',
              text:'No recurring vector-storage charge. Stores persist until you delete them, with project capacity scaling by usage tier.' },
            { icon:'💬', title:'Retrieved tokens', price:'Model context', priceTint:'text-indigo-600 dark:text-indigo-400',
              accent:'border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/20',
              text:'Billed as normal model context when a question actually retrieves them - so you pay when content is indexed and when users query.' },
        ]
        return { cards }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        GeminiPipeline,
        GeminiDocMap,
        StorageEconomics,
    }
}
