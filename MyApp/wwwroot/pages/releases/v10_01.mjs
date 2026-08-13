import { onMounted, onUnmounted, reactive, ref, computed } from "vue"
import AudioPlayer from "../podcasts/AudioPlayer.mjs"
import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import WorkflowShowcase from "../components/WorkflowShowcase.mjs"
import TabbedFeatureShowcase from "../components/TabbedFeatureShowcase.mjs"
import LiveSchemaFrame from "../components/LiveSchemaFrame.mjs"
import OpenAiChatLangs from "../components/OpenAiChatLangs.mjs"
import DtoQuickStart from "../components/DtoQuickStart.mjs"

/** Top-of-page index of everything in this release */
const ReleaseHighlights = {
    template:`
      <section class="not-prose my-10">
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a v-for="item in items" :key="item.title" :href="item.href"
             class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
            <div class="flex items-center gap-3">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-black text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">{{item.icon}}</span>
              <div class="text-xs font-bold uppercase tracking-[.16em] text-indigo-600 dark:text-indigo-400">{{item.eyebrow}}</div>
            </div>
            <h3 class="mt-4 text-lg font-bold text-slate-900 dark:text-white">{{item.title}}</h3>
            <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{item.text}}</p>
            <div class="mt-4 text-sm font-semibold text-indigo-600 transition group-hover:translate-x-1 dark:text-indigo-400">Read more →</div>
          </a>
        </div>
      </section>`,
    setup() {
        const items = [
            { icon:'15', eyebrow:'Add ServiceStack Reference', title:'Go, Rust, Ruby & Zig', href:'#typed-apis-in-15-languages',
              text:'End-to-end typed APIs and idiomatic Service Clients now span 15 languages — from websites and mobile Apps to cloud services and systems software.' },
            { icon:'AI', eyebrow:'ChatFeature', title:'AI Chat v4', href:'#ai-chat-v4',
              text:'A complete, modular AI application at /chat using your App’s existing users, database and security boundary — multi-provider chat, RAG, agents, skills and analytics.' },
            { icon:'⚡', eyebrow:'API Tools + MCP', title:'Your APIs become AI Tools', href:'#api-tools',
              text:'Models discover and call your existing ServiceStack APIs as the signed-in user, with editable approval forms and a built-in MCP Server for external Assistants.' },
            { icon:'{}', eyebrow:'Metadata feature', title:'API Schemas', href:'#api-schemas',
              text:'Every API now publishes a portable JSON Schema at /schema/{RequestDto}.json — and a complete executable UI at the adjacent URL.' },
            { icon:'▦', eyebrow:'Metadata feature', title:'AutoQuery Schemas', href:'#autoquery-schemas',
              text:'One /auto/{Model}.json document renders an entire authorized CRUD App: grid, filters, paging, forms, reference lookups and guarded deletes.' },
            { icon:'📄', eyebrow:'PdfFeature', title:'PDF Studio', href:'#pdf-studio',
              text:'Design Typst documents with AI, publish validated immutable revisions, generate typed C# models and render production PDFs with no LLM at runtime.' },
        ]
        return { items }
    }
}

/** 15 languages calling the same typed ChatCompletion API */
const OpenAiChat = {
    components: { OpenAiChatLangs },
    template: `
        <OpenAiChatLangs baseUrl="https://ai.llmspy.org" :routes="routes">
            <div class="lg:max-w-lg">
                <h2 class="text-base font-semibold leading-7 text-indigo-600">One typed API everywhere</h2>
                <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    OpenAI Chat Completions
                </p>
                <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                    Select any language to see its native Service Client call the same typed
                    <code>ChatCompletion</code> API.
                </p>
                <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                    The generated Request DTO describes its response type, route and HTTP method,
                    whilst each client preserves the conventions of its language.
                </p>
            </div>
        </OpenAiChatLangs>`,
    setup() {
        const getLang = () => new URLSearchParams(location.search).get('lang') || 'go'
        const routes = reactive({ lang: getLang() })
        const updateRoute = () => routes.lang = getLang()
        onMounted(() => window.addEventListener('popstate', updateRoute))
        onUnmounted(() => window.removeEventListener('popstate', updateRoute))
        return { routes }
    }
}

/** How Models progressively discover and call your APIs */
const ApiToolsJourney = {
    components: { WorkflowShowcase },
    template: `<WorkflowShowcase eyebrow="Progressive discovery" title="Three small tools unlock every approved API" :steps="steps" />`,
    setup() {
        const steps = [
            { name:'Ask', caption:'Natural language intent', title:'The user describes an outcome', tags:['User intent','Authenticated'],
              description:'The model starts with intent—not a route name, DTO or hand-written tool definition. It can ask for a coffee order, a booking, a report or any workflow exposed by the application.' },
            { name:'Search', caption:'api_search', title:'Find only the APIs relevant to the task', tags:['Low context','Ranked results'],
              description:'api_search returns compact candidates ranked from ServiceStack metadata, tags, descriptions, keywords and tool guidance. The model avoids loading the application’s entire API surface into context.' },
            { name:'Learn', caption:'api_describe', title:'Load the exact contract just in time', tags:['JSON Schema','Validation'],
              description:'api_describe supplies the selected request schema, response shape, validation, safety and workflow metadata only when it is needed.' },
            { name:'Review', caption:'Approval UI', title:'Turn consequential calls into editable proposals', tags:['Human approval','Editable'],
              description:'Calls requiring approval are rendered as schema-driven forms. Users can inspect and modify nested request data before anything is submitted.' },
            { name:'Call', caption:'api_call', title:'Execute through the normal ServiceStack pipeline', tags:['Policy enforced','Typed response'],
              description:'The approved request runs as the signed-in user with the same authentication, authorization, validation, filters and business logic as every other client.' },
        ]
        return { steps }
    }
}

/** Design → Publish → Admin → Typed C# → Render */
const PdfLifecycle = {
    components: { WorkflowShowcase },
    template: `<WorkflowShowcase eyebrow="Design to production" title="One governed PDF lifecycle" :steps="steps" />`,
    setup() {
        const steps = [
            { name:'Design', caption:'PDF Studio', title:'Create against representative data', tags:['Visual preview','Typst'],
              description:'Start from Typst, a reusable library template, an uploaded document or an AI-assisted draft. Form and Code views keep the document data visible and editable.' },
            { name:'Refine', caption:'AI + editor', title:'Iterate with natural language and source control', tags:['AI assisted','Editable source'],
              description:'Ask AI to change the layout, typography or structure, then inspect and refine the generated Typst directly. Every saved revision remains explicit.' },
            { name:'Publish', caption:'Promotion gate', title:'Validate before production', tags:['Validation','Contract fixtures'],
              description:'Publish is a controlled boundary that validates templates and fixtures before promoting an immutable version into Admin PDF.' },
            { name:'Integrate', caption:'Typed C#', title:'Generate the production data contract', tags:['Typed DTOs','IntelliSense'],
              description:'Generate strongly typed C# models from the template data so application code and document design share a compile-time contract.' },
            { name:'Operate', caption:'Admin PDF', title:'Render, audit and roll back safely', tags:['History','Rollback'],
              description:'Production rendering uses the published template history with administrative visibility, reversible rollback and the controls expected in a multi-user ServiceStack App.' },
        ]
        return { steps }
    }
}

/** The three surfaces one API Schema powers */
const ApiSchemaSurfaces = {
    components: { TabbedFeatureShowcase },
    template: `<TabbedFeatureShowcase eyebrow="One encapsulated contract" title="The right API schema becomes the right UI" :tabs="tabs" />`,
    setup() {
        const tabs = [
            { name:'HTML workbench', icon:'UI', title:'/schema/{RequestDto}', description:'Open the route without .json and ServiceStack composes a complete API workbench from the selected operation’s schema.', features:[
                {title:'Generated form',text:'Nested objects, collections, enums, lookups and validation render automatically.'},
                {title:'Invoke and inspect',text:'Send the request, review generated HTTP and inspect the formatted response in one place.'},
                {title:'Authorization aware',text:'The server remains responsible for access and only executes requests the current user may call.'},
                {title:'No frontend project',text:'A useful, responsive interface exists as soon as the API does.'},
            ]},
            { name:'JSON contract', icon:'{}', title:'/schema/{RequestDto}.json', description:'Add .json to retrieve the same rich, portable JSON Schema for code, tooling and custom user interfaces.', features:[
                {title:'Small by design',text:'Fetch one operation instead of serializing metadata for thousands of unrelated APIs.'},
                {title:'Self-contained',text:'The selected request includes the definitions and annotations required to render it.'},
                {title:'Cacheable boundary',text:'Independent screens and tools can load contracts only when users navigate to them.'},
                {title:'Framework neutral',text:'The schema can drive Vue and React components, other UI frameworks or external automation.'},
            ]},
            { name:'AI approval', icon:'AI', title:'Schema-driven Auto UI for assistants', description:'AI Chat uses the same contract to turn a proposed tool call into a trustworthy, editable approval experience.', features:[
                {title:'Human-readable',text:'Descriptions and labels explain what the model intends to submit.'},
                {title:'Fully editable',text:'Users can correct nested values and collections before approving a write.'},
                {title:'Validated',text:'The request is checked by normal ServiceStack validation after submission.'},
                {title:'No duplicate forms',text:'API Explorer, custom Apps and AI assistants share the same schema foundation.'},
            ]},
        ]
        return { tabs }
    }
}

/** Everything one AutoQuery Schema encodes */
const AutoQueryAppShowcase = {
    components: { TabbedFeatureShowcase },
    template: `<TabbedFeatureShowcase eyebrow="One model, a complete data App" title="Explore the capabilities encoded by AutoQuery" :tabs="tabs" />`,
    setup() {
        const tabs = [
            { name:'Query', icon:'Q', title:'Fast, typed data exploration', description:'The model schema gives /auto everything needed to present a capable query experience without a custom page.', features:[
                {title:'Data grid',text:'Responsive columns, formatting and metadata-aware values out of the box.'},
                {title:'Filtering',text:'Use the query conventions already supported by the AutoQuery API.'},
                {title:'Sorting & paging',text:'Navigate large datasets without downloading them into the browser.'},
                {title:'Preferences',text:'Users choose visible columns and page size for the task at hand.'},
            ]},
            { name:'Create', icon:'+', title:'Create records from schema-generated forms', description:'Create DTO metadata becomes a rich form with the right fields, descriptions, validation and referenced data.', features:[
                {title:'Validation',text:'Required fields and constraints are visible before the request reaches the server.'},
                {title:'Enums & options',text:'Finite choices render as intentional controls instead of free-form text.'},
                {title:'Reference lookups',text:'Foreign keys become searchable lookup experiences for related records.'},
                {title:'Server authority',text:'The ordinary AutoQuery CRUD Service still owns validation and persistence.'},
            ]},
            { name:'Edit & delete', icon:'✎', title:'Safe administration without bespoke CRUD screens', description:'Update and delete capabilities appear only when their APIs and authorization rules make them available.', features:[
                {title:'Partial updates',text:'Edit the relevant fields using the generated update contract.'},
                {title:'Guarded deletes',text:'Consequential operations are explicit and confirmable.'},
                {title:'Role scoped',text:'Users see actions appropriate to their roles and permissions.'},
                {title:'Consistent errors',text:'Validation and API failures return through the same structured experience.'},
            ]},
        ]
        return { tabs }
    }
}

/** Live /schema/Hello UI from blazor-gallery */
const LiveApiSchemaExample = {
    components: { LiveSchemaFrame },
    template: `<LiveSchemaFrame
        eyebrow="One API, described and executable"
        title="A live UI generated from the Hello API Schema"
        description="The schema describes the fields, method and execution URL. The same generic UI can therefore render the request, invoke /api/Hello and display its response."
        ui-url="https://blazor-gallery.servicestack.net/schema/Hello?Name=Schema"
        schema-url="https://blazor-gallery.servicestack.net/schema/Hello.json"
        api-url="https://blazor-gallery.servicestack.net/api/Hello?Name=Schema"
        :height="835" />`,
}

/** Live /auto/Booking CRUD App from blazor-gallery */
const LiveAutoQueryExample = {
    components: { LiveSchemaFrame },
    template: `<LiveSchemaFrame
        eyebrow="One model, a complete CRUD surface"
        title="A live Booking App generated from one AutoQuery Schema"
        description="The model envelope combines its Query and authorized CRUD APIs so one generic component can provide the grid, filters, paging and data forms."
        ui-url="https://blazor-gallery.servicestack.net/auto/Booking"
        schema-url="https://blazor-gallery.servicestack.net/auto/Booking.json"
        :height="620" />`,
}

export default {
    install(app) {
    },
    components: {
        AudioPlayer,
        ReleaseHighlights,
        Screenshot,
        ScreenshotsGallery,
        OpenAiChat,
        DtoQuickStart,
        ApiToolsJourney,
        PdfLifecycle,
        ApiSchemaSurfaces,
        AutoQueryAppShowcase,
        LiveApiSchemaExample,
        LiveAutoQueryExample,
    },
    setup() {
        return { }
    }
}
