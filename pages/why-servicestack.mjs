import StatsHero from "./components/StatsHero.mjs"
import FeaturePillars from "./components/FeaturePillars.mjs"
import CodeCompare from "./components/CodeCompare.mjs"
import FeatureMatrix from "./components/FeatureMatrix.mjs"
import UiShowcase from "./components/UiShowcase.mjs"
import WorkflowShowcase from "./components/WorkflowShowcase.mjs"
import TabbedFeatureShowcase from "./components/TabbedFeatureShowcase.mjs"
import DtoQuickStart from "./components/DtoQuickStart.mjs"
import DtoValueDeck from "./components/DtoValueDeck.mjs"

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

/** One Request DTO, and everything ServiceStack generates from it */
const DtoDeck = {
    components: { DtoValueDeck },
    template: `<DtoValueDeck
        eyebrow="The multiplier, one slide at a time"
        title="What a single Request DTO is worth"
        description="That one contract is the entire input. Step through what ServiceStack generates from it - each slide highlights the part of the DTO responsible and the capabilities it enables."
        :contract="contract"
        :slides="slides" />`,
    setup() {
        const contract = {
            label: 'Your Request DTO',
            badge: '1 POCO · 25 lines',
            lang: 'csharp',
            code: `[Tag("Bookings")]
[Description("Create a new Booking")]
[Notes("Only Employees can create Bookings")]
[ValidateHasRole("Employee")]
[AutoApply(Behavior.AuditCreate)]
public class CreateBooking
    : ICreateDb<Booking>, IReturn<IdResponse>
{
    [ValidateNotEmpty]
    public string Name { get; set; }

    public RoomType RoomType { get; set; }

    [ValidateGreaterThan(0)]
    public int RoomNumber { get; set; }

    [ValidateGreaterThan(0)]
    public decimal Cost { get; set; }

    public DateTime BookingStartDate { get; set; }
    public DateTime? BookingEndDate { get; set; }

    [Input(Type = "textarea")]
    public string Notes { get; set; }
}`,
        }

        const slides = [
            {
                name: 'REST API', icon: '⇄', title: 'A working, RESTful API', cost: 'No Service impl',
                kicker: 'Implemented for you',
                focus: ['public class CreateBooking', ': ICreateDb<Booking>'],
                description: '`ICreateDb<Booking>` tells ServiceStack this message creates a `Booking`, so AutoQuery CRUD implements the Service. You get a pre-defined route immediately, and can add any custom route you prefer without changing a consumer.',
                code: {
                    label: 'HTTP', lang: 'http',
                    code: `POST /api/CreateBooking HTTP/1.1
Content-Type: application/json

{ "name": "Team Offsite", "roomType": "Suite",
  "roomNumber": 12, "cost": 250,
  "bookingStartDate": "2026-09-04" }

HTTP/1.1 200 OK
{ "id": 34 }`,
                },
                items: [
                    { title: 'Pre-defined routes', text: 'Every API is callable at `/api/{Request}`' },
                    { title: 'Content negotiation', text: 'JSON, CSV, JSONL, Protobuf, MessagePack, XML, SOAP and a human-friendly HTML view, all for free' },
                ],
                href: '/autoquery/crud', linkText: 'AutoQuery CRUD',
            },
            {
                name: 'Validation', icon: '✓', title: 'Validation enforced everywhere', cost: '3 attributes',
                kicker: 'Declared on the contract',
                focus: ['[ValidateNotEmpty]', '[ValidateGreaterThan(0)]'],
                description: 'Rules like `[ValidateNotEmpty]` and `[ValidateGreaterThan(0)]` live on the message, not in a handler, so every consumer sees the same truth: the server enforces them, the generated UIs pre-validate against them, and the OpenAPI spec documents them.',
                code: {
                    label: 'Structured error response', lang: 'json',
                    code: `{
  "responseStatus": {
    "errorCode": "GreaterThan",
    "message": "'Cost' must be greater than '0'.",
    "errors": [{
      "errorCode": "NotEmpty",
      "fieldName": "Name",
      "message": "'Name' must not be empty."
    }]
  }
}`,
                },
                items: [
                    { title: 'One consistent shape', text: 'every typed client parses the same `ResponseStatus` into idiomatic errors' },
                    { title: 'Editable at runtime', text: 'add or change rules in the Admin UI without a redeploy' },
                ],
                href: '/declarative-validation', linkText: 'Declarative Validation',
            },
            {
                name: 'Auth', icon: 'ID', title: 'Authorization on every path in', cost: '1 attribute',
                kicker: 'Enforced before your code runs',
                focus: ['[ValidateHasRole("Employee")]'],
                description: '`[ValidateHasRole("Employee")]` is attached to the message, so it holds no matter how the message arrives - an HTTP call, a queued MQ message, a gRPC request, an auto-batched array or an AI tool call. There is no second policy to keep in sync.',
                items: [
                    { title: 'Identity Auth, API Keys & JWT', text: 'the same declarative attributes work across all of them' },
                    { title: 'Applies to AI too', text: 'a model calling this API can never do anything the signed-in user could not do themselves' },
                    { title: 'Visible in every UI', text: 'API Explorer, Locode and the generated forms only show what the current user may call' },
                ],
                href: '/auth/', linkText: 'Authentication & Authorization',
            },
            {
                name: 'API Explorer', icon: '▷', title: 'An executable API Explorer UI', cost: '0 lines',
                kicker: 'Generated at runtime',
                focus: ['[Tag("Bookings")]', '[Description(', '[Notes('],
                description: 'Your `[Description]`, `[Tag]` and `[Notes]` metadata becomes a browsable, executable workbench for every API - with a form built from the DTO, live request inspection and ready-to-paste code samples in each supported language.',
                img: { src: '/img/pages/admin-ui/carousel/api-explorer.webp', alt: 'API Explorer', w: 2130, h: 1413 },
                href: '/api-explorer', linkText: 'API Explorer',
            },
            {
                name: 'JSON Schema', icon: '{}', title: 'A portable JSON Schema & OpenAPI spec', cost: '0 lines',
                kicker: 'Published by your App',
                focus: ['public string Name', 'public RoomType RoomType', 'public int RoomNumber', 'public decimal Cost', 'public DateTime'],
                description: 'Every API publishes its contract at `/schema/CreateBooking.json` - a portable document any tool can consume - while `/schema/CreateBooking` renders that same schema as a complete executable UI. The properties are the schema; there is nothing to annotate twice.',
                img: { src: '/img/pages/api-schema/api-schema-query-bookings.webp', alt: 'API Schema UI', w: 2560, h: 1440 },
                items: [
                    { title: 'Accurate OpenAPI v3', text: 'routes, verbs, types, constraints and docs, generated from the same metadata' },
                ],
                href: '/api-schema', linkText: 'API Schemas',
            },
            {
                name: 'CRUD App', icon: '▦', title: 'An authorized CRUD App', cost: '0 screens',
                kicker: 'Forms built from the contract',
                focus: ['[Input(Type = "textarea")]', 'public RoomType RoomType', '[ValidateNotEmpty]'],
                description: 'Locode renders a complete management App over your data model - grid, filters, paging, reference lookups and guarded deletes - with the create and edit forms laid out from this DTO. A `RoomType` enum becomes a select, and an `[Input]` hint is all it takes to override a field.',
                img: { src: '/img/pages/autoquery-schema/create-booking.webp', alt: 'Generated Create Booking form', w: 1600, h: 900 },
                href: '/locode/', linkText: 'Locode',
            },
            {
                name: 'Typed clients', icon: '15', title: 'Native typed clients in 15 languages', cost: '0 SDK repos',
                kicker: 'The contract is the SDK',
                description: 'One `npx get-dtos` run generates a single native source file of DTOs plus an idiomatic Service Client that already understands the response type, route, verb, auth and error shape. Re-run it when the API changes and removed or renamed members become compile errors in the consuming App instead of runtime surprises.',
                chips: { label: 'Generated for', values: ['C#', 'F#', 'VB.NET', 'TypeScript', 'JavaScript', 'Python', 'PHP', 'Ruby', 'Java', 'Kotlin', 'Swift', 'Dart', 'Go', 'Rust', 'Zig'] },
                code: {
                    label: 'npx get-dtos typescript https://your-api.com', lang: 'typescript',
                    code: `const client = new JsonServiceClient(baseUrl)

const { id } = await client.post(new CreateBooking({
    name: 'Team Offsite',
    roomType: RoomType.Suite,
    roomNumber: 12,
    cost: 250,
}))`,
                },
                href: '/add-servicestack-reference', linkText: 'Add ServiceStack Reference',
            },
            {
                name: 'Any transport', icon: '⇉', title: 'The same Service over any transport', cost: '0 rewrites',
                kicker: 'Decoupled from HTTP',
                focus: ['public class CreateBooking', 'IReturn<IdResponse>'],
                description: 'Because the Service accepts a message rather than HTTP primitives, anything that can carry the message can invoke it - and `IReturn<IdResponse>` keeps the response typed on every one of them. The implementation does not change when the transport does.',
                items: [
                    { title: 'HTTP & gRPC', text: 'REST-ful routes and gRPC endpoints from one implementation' },
                    { title: 'Message queues', text: 'host it as an MQ consumer on Rabbit MQ, Redis MQ, SQS, Azure Service Bus or in-memory' },
                    { title: 'Auto-batching', text: 'clients can send an array of these messages in a single call, with no extra server code' },
                    { title: 'In-process', text: 'call it directly through the `IServiceGateway` - no serialization, no network hop' },
                ],
                href: '/messaging', linkText: 'Messaging',
            },
            {
                name: 'AI tools', icon: 'AI', title: 'An AI-callable tool, safely', cost: '0 tool definitions',
                kicker: 'No parallel AI backend',
                focus: ['[Description(', '[Notes(', '[ValidateHasRole("Employee")]'],
                description: 'The description and notes that documented this API for humans also let a model discover it, load its exact schema just-in-time and call it as the signed-in user. Because it runs through your normal pipeline, your auth, validation and business logic all still apply.',
                items: [
                    { title: 'Discoverable', text: '`api_search` ranks candidates from metadata you already publish, so the whole API surface never enters the context window' },
                    { title: 'Human approval', text: '`api_call` routes consequential requests into editable forms, generated from the same schema API Explorer uses' },
                    { title: 'MCP included', text: 'expose the same approved APIs to external AI Assistants over the Model Context Protocol' },
                ],
                href: '/chat/api-tools', linkText: 'API Tools',
            },
            {
                name: 'Analytics', icon: '▤', title: 'Analytics, logs and audit history', cost: '1 attribute',
                kicker: 'Observable by default',
                focus: ['[AutoApply(Behavior.AuditCreate)]'],
                description: '`[AutoApply(Behavior.AuditCreate)]` stamps who created each row and when. Alongside it, every call to this API is logged, profiled and charted per user, API Key and IP - with no external service to wire up and nothing to instrument by hand.',
                img: { src: '/img/pages/admin-ui/carousel/analytics.webp', alt: 'API Analytics', w: 1704, h: 1131 },
                items: [
                    { title: 'Executable audit history', text: 'inspect and replay what changed, from the Admin UI' },
                ],
                href: '/admin-ui-analytics', linkText: 'API Analytics',
            },
        ]
        return { contract, slides }
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

/** Searchable index of everything in the box */
const FeatureExplorer = {
    components: { FeatureMatrix },
    template: `<FeatureMatrix
        eyebrow="Everything in the box"
        title="Explore the feature set"
        description="Search or filter the capabilities included with ServiceStack. Every card links to its documentation."
        :features="features" />`,
    setup() {
        const features = [
            // APIs
            { category: 'APIs', name: 'Add ServiceStack Reference', href: '/add-servicestack-reference', badge: '15 langs', keywords: 'dtos codegen typed clients',
              text: 'End-to-end typed DTOs and idiomatic Service Clients for 15 languages.' },
            { category: 'APIs', name: 'API Explorer', href: '/api-explorer', keywords: 'ui swagger docs',
              text: 'A generated, executable UI with forms, docs and code samples for every API.' },
            { category: 'APIs', name: 'API Schemas', href: '/api-schema', badge: 'New', keywords: 'json schema ui',
              text: 'Every API publishes a portable JSON Schema that renders its own executable UI.' },
            { category: 'APIs', name: 'OpenAPI', href: '/openapi', keywords: 'swagger spec',
              text: 'Accurate OpenAPI v3 specs generated from your DTOs, attributes and routes.' },
            { category: 'APIs', name: 'Routing', href: '/routing', keywords: 'routes rest urls',
              text: 'Auto-generated pre-defined routes plus custom RESTful route definitions.' },
            { category: 'APIs', name: 'Endpoint Routing', href: '/endpoint-routing', keywords: 'aspnetcore minimal apis',
              text: 'Run ServiceStack APIs on ASP.NET Core endpoint routing.' },
            { category: 'APIs', name: 'Service Gateway', href: '/service-gateway', keywords: 'modular in-process',
              text: 'Call Services in-process or remotely through one substitutable interface.' },
            { category: 'APIs', name: 'Auto Batched Requests', href: '/auto-batched-requests', keywords: 'batching performance',
              text: 'Send many typed requests in a single HTTP call with no extra server code.' },
            { category: 'APIs', name: 'Auto HTML API', href: '/auto-html-api', keywords: 'html browser',
              text: 'Human-friendly HTML responses for any API viewed in a browser.' },
            { category: 'APIs', name: 'Post Command', href: '/post-command', keywords: 'cli curl terminal',
              text: 'Inspect and invoke any API from the command line with a JS object literal.' },

            // Data
            { category: 'Data', name: 'AutoQuery', href: '/autoquery/', keywords: 'query filter paging',
              text: 'Fully queryable, paged, authorized APIs from a single Request DTO.' },
            { category: 'Data', name: 'AutoQuery CRUD', href: '/autoquery/crud', keywords: 'create update delete',
              text: 'Declarative typed CRUD APIs with audit history and optimistic concurrency.' },
            { category: 'Data', name: 'AutoQuery Schemas', href: '/autoquery-schema', badge: 'New', keywords: 'json crud app',
              text: 'One JSON document renders an entire authorized CRUD App for a data model.' },
            { category: 'Data', name: 'OrmLite', href: '/ormlite/', keywords: 'orm sql rdbms poco',
              text: 'Fast, typed, POCO-first data access for every major RDBMS.' },
            { category: 'Data', name: 'Locode', href: '/locode/', keywords: 'admin crud ui database first',
              text: 'An instant, customizable CRUD App over your data models.' },
            { category: 'Data', name: 'AutoGen', href: '/autoquery/autogen', keywords: 'database first scaffold',
              text: 'Generate typed AutoQuery APIs for an existing database at runtime.' },
            { category: 'Data', name: 'okai', href: '/autoquery/okai-models', keywords: 'ai models text to blazor',
              text: 'Generate data models, APIs and Admin UIs from a natural language prompt.' },
            { category: 'Data', name: 'Scalable SQLite', href: '/ormlite/scalable-sqlite', keywords: 'litestream replication',
              text: 'Litestream-replicated SQLite for fast, inexpensive production hosting.' },
            { category: 'Data', name: 'Redis', href: '/redis/', keywords: 'cache nosql',
              text: 'A rich, typed C# Redis client with an integrated Admin UI.' },

            // AI
            { category: 'AI', name: 'AI Chat', href: '/chat/overview', badge: 'New', keywords: 'llm assistant',
              text: 'A complete modular multi-provider AI App inside your own App.' },
            { category: 'AI', name: 'API Tools', href: '/chat/api-tools', badge: 'New', keywords: 'agents tool calling',
              text: 'Let models discover and call your real APIs as the signed-in user.' },
            { category: 'AI', name: 'MCP Server', href: '/chat/mcp', badge: 'New', keywords: 'model context protocol',
              text: 'Expose approved APIs to external AI Assistants over MCP.' },
            { category: 'AI', name: 'Agents & Skills', href: '/chat/agents', badge: 'New', keywords: 'workflows prompts',
              text: 'Reusable agents, skills and system prompts backed by your own data.' },
            { category: 'AI', name: 'PDF Studio', href: '/chat/pdf-studio', badge: 'New', keywords: 'typst documents reports',
              text: 'AI-assisted document design with deterministic, versioned production rendering.' },
            { category: 'AI', name: 'AI Server', href: '/ai-server/', keywords: 'llm comfyui ffmpeg',
              text: 'A self-hosted API server for LLMs, image generation and media transforms.' },

            // Security
            { category: 'Security', name: 'Identity Auth', href: '/auth/identity-auth', keywords: 'aspnet identity login',
              text: 'Deep integration with ASP.NET Core Identity Auth and its admin UIs.' },
            { category: 'Security', name: 'API Keys', href: '/auth/apikeys', keywords: 'tokens scopes',
              text: 'Fine-grained, integrated API Key management with per-key analytics.' },
            { category: 'Security', name: 'JWT Auth', href: '/auth/jwt-identity-auth', keywords: 'tokens refresh stateless',
              text: 'Stateless JWT authentication with refresh tokens for distributed Apps.' },
            { category: 'Security', name: 'Declarative Validation', href: '/declarative-validation', keywords: 'rules attributes fluent',
              text: 'Validation rules declared on the contract, enforced for every consumer.' },
            { category: 'Security', name: 'Rate Limiting', href: '/rate-limiting', keywords: 'throttling quotas',
              text: 'Per-API and per-user request limits enforced in the request pipeline.' },
            { category: 'Security', name: 'Encrypted Messaging', href: '/auth/encrypted-messaging', keywords: 'crypto secure',
              text: 'End-to-end encrypted API calls over plain HTTP.' },
            { category: 'Security', name: 'Multitenancy', href: '/multitenancy', keywords: 'tenants isolation',
              text: 'Route requests to per-tenant databases and configuration.' },

            // Operations
            { category: 'Operations', name: 'Background Jobs', href: '/background-jobs', keywords: 'queues scheduled tasks cron',
              text: 'Durable background jobs and scheduled tasks with full execution history.' },
            { category: 'Operations', name: 'Commands', href: '/commands', keywords: 'cqrs observable retries',
              text: 'Observable, retryable building blocks with timings and failure history.' },
            { category: 'Operations', name: 'Admin UI', href: '/admin-ui', keywords: 'dashboard management',
              text: 'Built-in management UIs for users, roles, data, logs, jobs and more.' },
            { category: 'Operations', name: 'API Analytics', href: '/admin-ui-analytics', keywords: 'metrics usage reporting',
              text: 'Interactive analytics per API, user, API Key and IP with no external service.' },
            { category: 'Operations', name: 'Request Logging', href: '/sqlite-request-logs', keywords: 'audit history sqlite',
              text: 'Rich, queryable, rolling request logs persisted in SQLite.' },
            { category: 'Operations', name: 'Profiling', href: '/admin-ui-profiling', keywords: 'diagnostics performance',
              text: 'A diagnostic event viewer over .NET Observable Diagnostic Sources.' },
            { category: 'Operations', name: 'Caching', href: '/caching', keywords: 'redis memory response',
              text: 'Pluggable server caching plus declarative HTTP caching for any API.' },
            { category: 'Operations', name: 'Messaging', href: '/messaging', keywords: 'mq rabbit redis sqs',
              text: 'Host the same Services as MQ consumers across five MQ Servers.' },
            { category: 'Operations', name: 'Server Events', href: '/server-events', keywords: 'sse realtime push',
              text: 'Real-time server push to web, mobile and desktop clients.' },
            { category: 'Operations', name: 'Testing', href: '/testing', keywords: 'unit integration tests',
              text: 'Typed clients make integration tests as terse as unit tests.' },

            // Tooling
            { category: 'Tooling', name: 'Project Templates', href: '/templates/', keywords: 'scaffold start new dotnet new',
              text: 'Ready-to-run templates for every popular .NET App and front-end stack.' },
            { category: 'Tooling', name: 'mix', href: '/mix-tool', keywords: 'compose features gists',
              text: 'Compose features into existing projects from a library of layered gists.' },
            { category: 'Tooling', name: 'x dotnet tool', href: '/dotnet-tool', keywords: 'cli scripts',
              text: 'One CLI for DTOs, templates, mixes, scripts and deployment tasks.' },
            { category: 'Tooling', name: 'npx get-dtos', href: '/npx-get-dtos', keywords: 'node cli typed',
              text: 'Generate typed DTOs for any language without installing .NET.' },
            { category: 'Tooling', name: 'Vue Components', href: '/vue/', keywords: 'tailwind ui library',
              text: 'A typed, metadata-aware Tailwind component library for Vue.' },
            { category: 'Tooling', name: 'React Components', href: '/react/overview', keywords: 'tailwind ui library',
              text: 'The same typed component approach for React Apps.' },
            { category: 'Tooling', name: 'Jupyter Notebooks', href: '/jupyter-notebooks', keywords: 'python data science',
              text: 'Generate ready-to-run notebooks for any AutoQuery API.' },
            { category: 'Tooling', name: 'Servicify', href: '/servicify', keywords: 'legacy modernize',
              text: 'Put a typed, documented API in front of existing systems and databases.' },
        ]
        return { features }
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
