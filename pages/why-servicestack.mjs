import StatsHero from "./components/StatsHero.mjs"
import FeaturePillars from "./components/FeaturePillars.mjs"
import CodeCompare from "./components/CodeCompare.mjs"
import FeatureExplorer from "./components/FeatureExplorer.mjs"
import UiShowcase from "./components/UiShowcase.mjs"
import WorkflowShowcase from "./components/WorkflowShowcase.mjs"
import TabbedFeatureShowcase from "./components/TabbedFeatureShowcase.mjs"
import DtoQuickStart from "./components/DtoQuickStart.mjs"
import DtoDeck from "./components/DtoDeck.mjs"

/** Opening hero */
const WhyHero = {
    components: { StatsHero },
    template: `<StatsHero
        eyebrow="Why ServiceStack"
        title="One typed API."
        highlight="Every client, every UI, every model."
        description="A batteries-included .NET framework where a single POCO Request DTO becomes your API, your docs, your admin UI, your native clients in 15 languages - and now your AI tools."
        :stats="stats"
        :primary="{ text:'Create your first API', href:'/create-your-first-webservice' }"
        :secondary="{ text:'Explore the features', href:'#everything-in-the-box' }" />`,
    setup() {
        const stats = [
            { value: 15, label: 'Typed languages' },
            { value: 20, suffix: '+', label: 'Years shipping' },
            { value: 100, suffix: 'M+', label: 'NuGet downloads' },
            { value: 0, label: 'Lines of code-gen you maintain' },
        ]
        return { stats }
    }
}

/** The four capability pillars */
const CorePillars = {
    components: { FeaturePillars },
    template: `<FeaturePillars
        eyebrow="Four pillars"
        title="What you actually get for a single DTO"
        description="ServiceStack reads the rich metadata your typed DTOs already publish, then generates the surfaces you'd otherwise hand-build and hand-maintain."
        :pillars="pillars" />`,
    setup() {
        const pillars = [
            {
                icon: '{}', name: 'Typed APIs', tagline: 'Define once, consume natively everywhere',
                summary: 'Your Request DTO carries its response type, route, HTTP method, validation and auth requirements. Every client, format and endpoint is generated from that one contract - so there is no parallel SDK to keep in sync.',
                points: [
                    'Native DTOs + idiomatic Service Clients in 15 languages',
                    'JSON, CSV, JSONL, MessagePack, Protobuf, gRPC & SOAP for free',
                    'Same Service callable over HTTP, MQ, gRPC or in-process',
                    'Structured errors and validation the client understands',
                ],
                links: [
                    { text: 'Add ServiceStack Reference', href: '/add-servicestack-reference' },
                    { text: 'API Design', href: '/api-design' },
                    { text: 'Formats', href: '/formats' },
                ],
            },
            {
                icon: '▦', name: 'Instant Data APIs', tagline: 'AutoQuery, OrmLite & a CRUD UI with no code',
                summary: 'Declare a Query DTO and AutoQuery implements a fully queryable, paged, filterable, authorized API over every major RDBMS - plus the Locode admin App to drive it, without writing a Service or a screen.',
                points: [
                    'Filtering, paging, sorting & joins from a single DTO',
                    'Typed CRUD APIs with optimistic concurrency & audit history',
                    'OrmLite: fast, typed, POCO-first RDBMS access',
                    'Locode: an instant CRUD App over your data models',
                ],
                links: [
                    { text: 'AutoQuery', href: '/autoquery/' },
                    { text: 'OrmLite', href: '/ormlite/' },
                    { text: 'Locode', href: '/locode/' },
                ],
            },
            {
                icon: '⚙', name: 'Production Plumbing', tagline: 'The parts every real App needs, built in',
                summary: 'Auth, jobs, caching, messaging, logging, profiling, rate limiting and real-time events ship in the box and integrate with each other - no assembling a stack of unrelated libraries hoping they compose.',
                points: [
                    'ASP.NET Identity Auth, API Keys, JWT & fine-grained permissions',
                    'Durable Background Jobs & Scheduled Tasks backed by SQLite',
                    'Commands for observable, retryable units of work',
                    'Server Events, MQ Servers, HTTP caching & rate limiting',
                ],
                links: [
                    { text: 'Identity Auth', href: '/auth/identity-auth' },
                    { text: 'Background Jobs', href: '/background-jobs' },
                    { text: 'Commands', href: '/commands' },
                    { text: 'Server Events', href: '/server-events' },
                ],
            },
            {
                icon: 'AI', name: 'AI-native', tagline: 'Your existing APIs become safe AI capabilities',
                summary: 'The same metadata that generates typed clients also lets models discover and call your APIs as the signed-in user - behind your existing auth, validation and business logic, with editable human approval for consequential calls.',
                points: [
                    'A complete modular AI Chat App at /chat in any ServiceStack App',
                    'API Tools: models search, learn and call your real APIs',
                    'Built-in MCP Server for external AI Assistants',
                    'PDF Studio: AI-assisted design, deterministic rendering',
                ],
                links: [
                    { text: 'AI Chat', href: '/chat/overview' },
                    { text: 'API Tools', href: '/chat/api-tools' },
                    { text: 'MCP Server', href: '/chat/mcp' },
                ],
            },
        ]
        return { pillars }
    }
}

/** What one DTO replaces */
const OneDtoCompare = {
    components: { CodeCompare },
    template: `<CodeCompare
        eyebrow="The multiplier"
        title="Write the contract. Skip the rest."
        description="Each tab is one thing you would normally hand-write, hand-document and hand-maintain per platform."
        :tabs="tabs" />`,
    setup() {
        const tabs = [
            {
                name: 'Chatty RPC → one message',
                left: {
                    label: 'RPC interface', badge: '6 operations', tone: 'muted', lang: 'csharp',
                    code: `public interface ICustomerService
{
    Customer       GetCustomerById(int id);
    List<Customer> GetCustomerByIds(int[] ids);
    Customer       GetCustomerByUserName(string userName);
    List<Customer> GetCustomerByUserNames(string[] userNames);
    Customer       GetCustomerByEmail(string email);
    List<Customer> GetCustomerByEmails(string[] emails);
}

// …and 6 more for every new way to look one up`,
                },
                right: {
                    label: 'One message-based API', badge: '1 operation', lang: 'csharp',
                    code: `public class GetCustomers : IReturn<List<Customer>>
{
    public int[] Ids { get; set; }
    public string[] UserNames { get; set; }
    public string[] Emails { get; set; }
}`,
                },
                footnote: 'Any combination is fulfilled in a single remote call. Adding a new field never breaks an existing client, and the same message can be cached, queued, batched, proxied or deferred - none of which an RPC method signature allows.',
            },
            {
                name: 'DTO → queryable API',
                left: {
                    label: 'You write', badge: 'No Service impl', lang: 'csharp',
                    code: `public class QueryBookings : QueryDb<Booking>
{
    public int[] Ids { get; set; }
}

[Icon(Svg = Icons.Booking)]
public class Booking : AuditBase
{
    [AutoIncrement] public int Id { get; set; }
    public string Name { get; set; }
    public RoomType RoomType { get; set; }
    public decimal Cost { get; set; }
}`,
                },
                right: {
                    label: 'You get', badge: 'Generated',
                    items: [
                        { title: 'A queryable REST API', text: '/api/QueryBookings?RoomTypeIn=Single,Double&CostGreaterThan=100' },
                        { title: 'Paging, sorting & field selection', text: 'Standard AutoQuery conventions across every implicit and explicit query.' },
                        { title: 'A CRUD admin App', text: 'Locode renders the grid, filters, forms and lookups from the same model.' },
                        { title: 'An executable UI + JSON Schema', text: '/schema/QueryBookings renders a workbench; add .json for the portable contract.' },
                        { title: 'Typed clients in 15 languages', text: 'Each with native AutoQuery response types.' },
                    ],
                },
                footnote: 'AutoQuery works over every major RDBMS as well as in-memory collections, DynamoDB and existing Services.',
            },
            {
                name: 'DTO → validated & secured',
                left: {
                    label: 'You write', badge: 'Declarative', lang: 'csharp',
                    code: `[ValidateIsAuthenticated]
[Tag("bookings"), Description("Create a new Booking")]
public class CreateBooking
    : ICreateDb<Booking>, IReturn<IdResponse>
{
    [ValidateNotEmpty]
    public string Name { get; set; }

    [ValidateGreaterThan(0)]
    public decimal Cost { get; set; }

    [ValidateNotNull]
    public DateTime? BookingStartDate { get; set; }
}`,
                },
                right: {
                    label: 'You get', badge: 'Enforced everywhere',
                    items: [
                        { title: 'Server-side validation', text: 'Returns structured, localizable field errors in a consistent ResponseStatus.' },
                        { title: 'Client-side validation', text: 'The same rules surface in API Explorer, Locode and @servicestack/vue forms.' },
                        { title: 'Enforced authorization', text: 'Applied before your Service runs - for HTTP, MQ, gRPC and AI tool calls alike.' },
                        { title: 'Live-editable rules', text: 'Admin UI validation rules can be added and changed without a redeploy.' },
                        { title: 'Accurate OpenAPI docs', text: 'Descriptions, tags and constraints flow into the generated spec.' },
                    ],
                },
                footnote: 'Declarative attributes keep the rules on the contract itself, so every consumer - including AI approval forms - sees the same truth.',
            },
            {
                name: 'Server → native client',
                left: {
                    label: 'Server DTO', badge: 'C#', lang: 'csharp',
                    code: `public class Hello : IReturn<HelloResponse>
{
    public string Name { get; set; }
}`,
                },
                right: {
                    label: 'Any of 15 clients', badge: 'Generated', lang: 'typescript',
                    code: `// npx get-dtos typescript https://your-api.com
const client = new JsonServiceClient(baseUrl)
const { result } = await client.get(new Hello({
    name: 'World'
}))

// Go
res, err := ss.Send(client, dtos.Hello{Name: "World"})

// Rust
let res = client.send(&Hello { name: name.into() }).await?;

// Python
response = client.get(Hello(name="World"))`,
                },
                footnote: 'No code-gen step in your build, no SDK repo per platform. Re-run one command when the API changes and your compiler tells you what moved.',
            },
        ]
        return { tabs }
    }
}

/** Built-in UIs carousel */
const BuiltInUis = {
    components: { UiShowcase },
    template: `<UiShowcase
        eyebrow="Nothing to install"
        title="Rich UIs your APIs get for free"
        description="Every ServiceStack App ships with capable, authorized management UIs generated from your APIs. Use the arrow keys or the tabs to explore."
        :screens="screens" />`,
    setup() {
        const img = name => `/img/pages/admin-ui/carousel/${name}.webp`
        const screens = [
            { name: 'API Explorer', title: 'API Explorer', href: '/api-explorer', img: img('api-explorer'),
              summary: 'A generated, executable UI for every API - forms, docs, code examples in every language and live request inspection.' },
            { name: 'API Schema', title: 'API Schemas', href: '/api-schema', w: 1264, h: 711,
              img: '/img/pages/api-schema/api-schema-query-bookings.webp',
              summary: 'Every API publishes a portable JSON Schema at /schema/{Request}.json - and the adjacent URL renders it as a complete, executable workbench.' },
            { name: 'AutoQuery Schema', title: 'AutoQuery Schemas', href: '/autoquery-schema', w: 1280, h: 720,
              img: '/img/pages/autoquery-schema/create-booking.webp',
              summary: 'One /auto/{Model}.json document renders an entire authorized CRUD App: grid, filters, paging, forms, reference lookups and guarded deletes.' },
            { name: 'Locode', title: 'Locode', href: '/locode/', img: img('locode'),
              summary: 'An instant, customizable CRUD App over your AutoQuery data models, code-first or database-first.' },
            { name: 'Dashboard', title: 'Admin Dashboard', href: '/admin-ui', img: img('dashboard'),
              summary: 'High-level overview of your App’s APIs, plugins and internal counters the moment it starts.' },
            { name: 'Analytics', title: 'API Analytics', href: '/admin-ui-analytics', img: img('analytics'),
              summary: 'In-depth, interactive analytics per API, user, API Key and IP - with no external service to wire up.' },
            { name: 'AI Chat', title: 'AI Chat', href: '/chat/overview', img: img('ai-chat'),
              summary: 'A complete multi-provider AI App using your existing users, database and security boundary.' },
            { name: 'Background Jobs', title: 'Background Jobs', href: '/background-jobs', img: img('backgroundjobs'),
              summary: 'Monitor, retry and audit durable background jobs and scheduled tasks with full execution history.' },
            { name: 'Commands', title: 'Commands', href: '/commands', img: img('commands'),
              summary: 'Observable building blocks with timings, retries and failure history for every command your App runs.' },
            { name: 'Database', title: 'Database Browser', href: '/admin-ui-database', img: img('database'),
              summary: 'Browse, filter and export the tables of every database your App is configured with.' },
            { name: 'Request Logs', title: 'Request Logging', href: '/admin-ui-profiling', img: img('logging'),
              summary: 'Rich, queryable, rolling request logs persisted in SQLite alongside diagnostic profiling events.' },
            { name: 'API Keys', title: 'API Keys', href: '/auth/apikeys', img: img('apikeys'),
              summary: 'Integrated, fine-grained API Key management with scopes, expiry and per-key analytics.' },
        ]
        return { screens }
    }
}

/** How an API becomes an AI capability */
const AiJourney = {
    components: { WorkflowShowcase },
    template: `<WorkflowShowcase eyebrow="No AI-specific backend" title="How your existing APIs become safe AI capabilities" :steps="steps" />`,
    setup() {
        const steps = [
            { name: 'Ask', caption: 'Natural language', title: 'The user describes an outcome', tags: ['User intent', 'Signed in'],
              description: 'The model starts with intent - not a route, DTO or hand-written tool definition. Nothing about your API surface needs to be duplicated for AI.' },
            { name: 'Search', caption: 'api_search', title: 'Find only the relevant APIs', tags: ['Low context', 'Ranked'],
              description: 'Candidates are ranked from the metadata, tags, descriptions and tool guidance your App already publishes, so the entire API surface never has to be loaded into context.' },
            { name: 'Learn', caption: 'api_describe', title: 'Load the exact contract just in time', tags: ['JSON Schema', 'Validation'],
              description: 'The request schema, response shape, validation and safety metadata are supplied only for the operation the model actually selected.' },
            { name: 'Review', caption: 'Approval UI', title: 'Consequential calls become editable proposals', tags: ['Human approval', 'Editable'],
              description: 'Schema-driven forms let users inspect and correct nested request data before anything is submitted - generated from the same contract API Explorer uses.' },
            { name: 'Call', caption: 'api_call', title: 'Execute through the normal pipeline', tags: ['Policy enforced', 'Typed'],
              description: 'The approved request runs as the signed-in user with the same authentication, authorization, validation, filters and business logic as every other client.' },
        ]
        return { steps }
    }
}

/** Where ServiceStack Apps run */
const DeployAnywhere = {
    components: { TabbedFeatureShowcase },
    template: `<TabbedFeatureShowcase eyebrow="Host it your way" title="One codebase, many hosts and front-ends" :tabs="tabs" />`,
    setup() {
        const tabs = [
            { name: 'Front-ends', icon: '◧', title: 'Pick the UI stack you actually want', description: 'ServiceStack Services are decoupled from any rendering technology, so the same APIs power whichever front-end suits the project.', features: [
                { title: 'Blazor', text: 'Blazor Server, WASM and Blazor Vue templates with Tailwind component libraries.' },
                { title: 'Vue & React', text: 'First-class typed component libraries plus Vite SPA and SSG templates.' },
                { title: 'Razor & Markdown', text: 'Razor Pages, MVC and Markdown-powered content sites like this one.' },
                { title: 'Mobile & desktop', text: 'Flutter, Swift, Kotlin, MAUI and native desktop clients from the same DTOs.' },
            ]},
            { name: 'Hosts', icon: '⬒', title: 'Run wherever .NET runs', description: 'Apps run on Windows, macOS and Linux as web apps, worker services, console apps or containers.', features: [
                { title: 'ASP.NET Core', text: 'Modern endpoint routing on .NET 8+, with a migration path from legacy hosts.' },
                { title: 'Worker Services', text: 'Host the same Services as MQ consumers with no HTTP surface at all.' },
                { title: 'Containers & VMs', text: 'GitHub Actions, Docker Compose, Kamal and rsync deployment templates.' },
                { title: 'SQLite at scale', text: 'Litestream-backed SQLite templates for cheap, fast, replicated hosting.' },
            ]},
            { name: 'Endpoints', icon: '⇄', title: 'The same Service, many transports', description: 'Because Services accept and return messages rather than HTTP primitives, they can be invoked over anything that can carry one.', features: [
                { title: 'HTTP & gRPC', text: 'REST-ful routes, JSON APIs and gRPC endpoints from the same implementation.' },
                { title: 'Message queues', text: 'Rabbit MQ, Redis MQ, Amazon SQS, Azure Service Bus and in-memory Background MQ.' },
                { title: 'Server Events', text: 'Real-time server push to web, mobile and desktop clients over SSE.' },
                { title: 'In-process', text: 'Call Services directly via the Service Gateway - no serialization, no network hop.' },
            ]},
        ]
        return { tabs }
    }
}



export default {
    components: {
        WhyHero,
        DtoDeck,
        CorePillars,
        OneDtoCompare,
        BuiltInUis,
        AiJourney,
        DeployAnywhere,
        FeatureExplorer,
        DtoQuickStart,
    },
}
