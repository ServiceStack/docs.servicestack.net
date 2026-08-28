import FeatureMatrix from "./FeatureMatrix.mjs"

/** Searchable index of everything in the box */
export default {
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