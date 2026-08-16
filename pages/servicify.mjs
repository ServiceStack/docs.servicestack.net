import VideoGallery from "./components/VideoGallery.mjs"
import WorkflowShowcase from "./components/WorkflowShowcase.mjs"
import TabbedFeatureShowcase from "./components/TabbedFeatureShowcase.mjs"

const svg = name => `/img/pages/svg/${name}.svg`

/** Database -> typed API -> code-first, in five steps */
const ServicifySteps = {
    components: { WorkflowShowcase },
    template: `<WorkflowShowcase eyebrow="No rewrite required" title="From existing database to typed API" :steps="steps" />`,
    setup() {
        const steps = [
            { name: 'Register', caption: 'Your existing RDBMS', title: 'Point ServiceStack at the database you already have', tags: ['No migration', 'Read-only safe'],
              description: 'Register an OrmLite connection to your existing SQL Server, PostgreSQL, MySQL, SQLite, Oracle or Firebird database. Nothing about its schema has to change, and no data is moved.' },
            { name: 'Generate', caption: 'GenerateCrudServices', title: 'AutoGen reflects the schema at startup', tags: ['Runtime', 'Zero code'],
              description: 'AutoGen inspects your tables and dynamically registers typed AutoQuery and CRUD APIs for each one - including Request DTOs, data models and human-friendly pluralized routes.' },
            { name: 'Codify', caption: 'Declarative attributes', title: 'Layer your conventions onto the generated types', tags: ['Auth', 'Validation'],
              description: 'Code generation is programmatically customizable, so you can inject the attributes your App already relies on - authorization, validation, tags, descriptions and formatting - into every generated Service.' },
            { name: 'Eject', caption: 'Export code-first', title: 'Take ownership when you are ready', tags: ['C# DTOs', 'No lock-in'],
              description: 'Export the generated APIs and data models into real C# classes and continue code-first development as normal. AutoGen is a starting point, not a runtime dependency you are stuck with.' },
            { name: 'Consume', caption: 'Clients & UIs', title: 'The whole ServiceStack ecosystem applies', tags: ['15 languages', 'Instant UIs'],
              description: 'Because they are ordinary ServiceStack Services, the generated APIs immediately gain typed clients, generated UIs, alternative endpoints and every declarative feature the framework offers.' },
        ]
        return { steps }
    }
}

/** Everything an existing database gains once it's servicified */
const ServicifyUnlocks = {
    components: { TabbedFeatureShowcase },
    template: `<TabbedFeatureShowcase eyebrow="The payoff" title="What your database gains the moment it's servicified" :tabs="tabs" />`,
    setup() {
        const tabs = [
            { name: 'Instant UIs', icon: '▦', title: 'Usable interfaces before you build a front-end', description: 'Every generated API is described by the same metadata the built-in UIs read, so working screens exist as soon as the Services do.', features: [
                { title: 'API Explorer', text: 'An executable UI for every generated API, with docs and code samples in each language.' },
                { title: 'Locode', text: 'A customizable CRUD App over your tables that stakeholders can actually use.' },
                { title: 'AutoQuery Schemas', text: '/auto/{Model} renders a complete authorized CRUD App from one JSON document.' },
                { title: 'Admin UI', text: 'Users, roles, request logs, analytics, background jobs and a database browser.' },
            ]},
            { name: 'Typed clients', icon: '{}', title: 'Reachable from every platform your teams use', description: 'The generated Request DTOs carry their response type, route and method, so each language gets a native, idiomatic integration.', features: [
                { title: '15 languages', text: 'C#, F#, VB.NET, TypeScript, JavaScript, Python, PHP, Ruby, Swift, Java, Kotlin, Dart, Go, Rust and Zig.' },
                { title: "gRPC's protoc universe", text: 'The fastest way to put high-performance gRPC endpoints over an existing system.' },
                { title: 'Message queues', text: 'The same Services run as Rabbit MQ, Redis MQ, SQS or Azure Service Bus consumers.' },
                { title: 'Service Gateway', text: 'Call them in-process from other .NET code with no serialization or network hop.' },
            ]},
            { name: 'Declarative behaviour', icon: '⚙', title: 'Modernize the rules, not just the transport', description: 'Once your tables are behind typed contracts, ServiceStack’s declarative features apply to them without hand-written plumbing.', features: [
                { title: 'Validation', text: 'Attribute-based rules, plus DB-backed rules editable in the Admin UI and applied at runtime.' },
                { title: 'Authorization', text: 'Per-API authentication, roles, permissions and API Key scopes.' },
                { title: 'Audit history', text: 'Executable Audit History records who changed what, and can replay it.' },
                { title: 'Multitenancy & concurrency', text: 'Per-tenant connections and optimistic concurrency without touching the schema.' },
            ]},
        ]
        return { tabs }
    }
}

/** All the walkthrough videos in one player */
const ServicifyVideos = {
    components: { VideoGallery },
    template: `<VideoGallery
        eyebrow="Walkthroughs"
        title="Watch a database become an API"
        description="Start with the overview, then see the same generated APIs consumed from .NET, gRPC, Flutter and React Native."
        :videos="videos" />`,
    setup() {
        const videos = [
            { id: 'NaJ7TW-Q_pU', icon: svg('sql-db'), tags: ['AutoGen', 'AutoQuery'],
              title: 'Instantly servicify an existing database',
              caption: 'The overview - schema to typed API',
              summary: 'Register an existing RDBMS, enable AutoGen and watch typed AutoQuery and CRUD APIs, routes and data models appear for every table - then browse them in the built-in UIs.' },
            { id: 'mFyMgg7c3vg', icon: svg('csharp'), tags: ['Code-first', 'C#'],
              title: 'Export the generated APIs as code-first C#',
              caption: 'Eject to real C# classes',
              summary: 'Once the conventions are right, export the auto-generated Request DTOs and data models into your ServiceModel project and continue developing code-first.' },
            { id: '5NNCaWMviXU', icon: svg('dart-logo'), tags: ['gRPC', 'Dart'],
              title: 'Call the generated APIs over gRPC from Dart',
              caption: 'New project to gRPC call, from scratch',
              summary: 'Mix AutoGen into a new gRPC project over the Northwind SQLite database, then consume the protoc-generated Services from a Dart console App using the x dotnet tool.' },
            { id: '3iz9aM1AlGA', icon: svg('flutter-logo'), tags: ['gRPC', 'Flutter'],
              title: 'A Flutter Android App over gRPC',
              caption: 'The same endpoints, natively compiled',
              summary: 'Anything Dart can reach, Flutter can reach - the same generated gRPC Services driving a natively compiled mobile App from a single codebase.' },
            { id: '6-SiLAbY63w', icon: svg('react-native-logo'), tags: ['TypeScript', 'React Native'],
              title: 'A React Native App with typed DTOs',
              caption: 'Add ServiceStack Reference on mobile',
              summary: 'gRPC is only one option - the same Services are available to every language Add ServiceStack Reference supports, including TypeScript in a React Native iOS and Android App.' },
        ]
        return { videos }
    }
}

export default {
    components: {
        ServicifySteps,
        ServicifyUnlocks,
        ServicifyVideos,
    },
}
