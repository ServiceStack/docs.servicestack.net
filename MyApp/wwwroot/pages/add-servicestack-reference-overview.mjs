/** The 16 supported languages, with the command and client package for each */
const LanguageGrid = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">15 languages, one server</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Pick your language</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Every language gets DTOs generated from the same C# source of truth, and a generic client with the same feature set -
          so an API works the same way whichever side of it you’re on.
        </p>
      </div>

      <div v-for="group in groups" :key="group.name" class="mb-5 last:mb-0">
        <div class="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span :class="['flex h-7 items-center rounded-lg px-2.5 text-[11px] font-black uppercase tracking-wider', group.tint]">{{group.name}}</span>
          <span class="text-sm text-slate-500 dark:text-slate-400">{{group.caption}}</span>
        </div>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <a v-for="lang in group.langs" :key="lang.name" :href="lang.href"
             class="group flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
            <div class="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span class="min-w-0 font-bold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{{lang.name}}</span>
              <code class="shrink-0 text-[11px] font-bold text-slate-400 dark:text-slate-500">{{lang.file}}</code>
            </div>
            <code class="mt-2 whitespace-pre-wrap break-words rounded-md bg-slate-50 px-2 py-1 text-[11px] font-bold text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">{{lang.cmd ? 'npx get-dtos ' + lang.cmd : lang.via}}</code>
            <p class="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{{lang.client}}</p>
          </a>
        </div>
      </div>
    </section>`,
    setup() {
        const groups = [
            { name:'Web', caption:'Browser, Node and Deno front-ends',
              tint:'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              langs:[
                { name:'TypeScript', file:'dtos.ts', cmd:'ts', href:'/typescript-add-servicestack-reference', client:'@servicestack/client - the same typed client across Vue, React, Angular, Svelte, Node and Deno.' },
                { name:'JavaScript', file:'dtos.mjs', cmd:'mjs', href:'/javascript-add-servicestack-reference', client:'JSDoc-annotated ES6 modules - full editor completion with no build step.' },
                { name:'ES3 Common.js', file:'/types/js', cmd:'', via:'<script src="/types/js">', href:'/commonjs-add-servicestack-reference', client:'Referenced straight from a script tag - no npm, no bundler. For legacy browsers, CMS templates and WebViews.' },
              ] },
            { name:'.NET', caption:'Reuse the same clients, libraries and knowledge on both sides',
              tint:'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
              langs:[
                { name:'C#', file:'dtos.cs', cmd:'cs', href:'/csharp-add-servicestack-reference', client:'ServiceStack.Client - Blazor, MAUI, WPF, console and server-to-server calls.' },
                { name:'F#', file:'dtos.fs', cmd:'fs', href:'/fsharp-add-servicestack-reference', client:'ServiceStack.Client with idiomatic F# DTOs.' },
                { name:'VB.NET', file:'dtos.vb', cmd:'vb', href:'/vbnet-add-servicestack-reference', client:'ServiceStack.Client for VB.NET projects.' },
              ] },
            { name:'Mobile', caption:'Native iOS, Android and cross-platform apps',
              tint:'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
              langs:[
                { name:'Swift', file:'dtos.swift', cmd:'swift', href:'/swift-add-servicestack-reference', client:'ServiceStack Swift package for iOS, macOS and server-side Swift.' },
                { name:'Kotlin', file:'dtos.kt', cmd:'kt', href:'/kotlin-add-servicestack-reference', client:'net.servicestack:client for Android and JVM apps.' },
                { name:'Java', file:'dtos.java', cmd:'java', href:'/java-add-servicestack-reference', client:'net.servicestack:client with Android Studio and IntelliJ support.' },
                { name:'Dart', file:'dtos.dart', cmd:'dart', href:'/dart-add-servicestack-reference', client:'servicestack pub package - unchanged across every platform Flutter builds for.' },
              ] },
            { name:'Systems', caption:'Cloud services, CLI tooling and high-throughput workloads',
              tint:'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              langs:[
                { name:'Go', file:'dtos.go', cmd:'go', href:'/go-add-servicestack-reference', client:'servicestack-go - standard library only, safe for concurrent use across goroutines.' },
                { name:'Rust', file:'dtos.rs', cmd:'rust', href:'/rust-add-servicestack-reference', client:'servicestack crate - async by default, API changes become compiler errors.' },
                { name:'Zig', file:'dtos.zig', cmd:'zig', href:'/zig-add-servicestack-reference', client:'servicestack-zig - explicit allocators, response type resolved at compile time.' },
              ] },
            { name:'Scripting', caption:'Extending existing apps and automation',
              tint:'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              langs:[
                { name:'Python', file:'dtos.py', cmd:'py', href:'/python-add-servicestack-reference', client:'servicestack PyPI package - typed dataclasses, works in Jupyter notebooks.' },
                { name:'PHP', file:'dtos.php', cmd:'php', href:'/php-add-servicestack-reference', client:'servicestack/client - call .NET APIs from WordPress, Drupal or Laravel.' },
                { name:'Ruby', file:'dtos.rb', cmd:'ruby', href:'/ruby-add-servicestack-reference', client:'servicestack gem - standard library only, no runtime dependencies.' },
              ] },
        ]
        return { groups }
    }
}

/** C# DTOs in, native DTOs out - what actually happens */
const ReferenceFlow = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">No schema, no code-gen pipeline</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">How a typed client gets built</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        Your C# DTOs are the only source of truth. There’s no intermediate schema to keep in step, and nothing to generate
        at build time - just an HTTP request that returns source code.
      </p>

      <div class="mt-7 space-y-3">
        <div v-for="(s,i) in stages" :key="s.name">
          <div class="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-black text-white">{{i+1}}</span>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span class="min-w-0 font-bold text-slate-900 dark:text-white">{{s.name}}</span>
                <code v-if="s.where" class="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{{s.where}}</code>
              </div>
              <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
            </div>
          </div>
          <div v-if="i < stages.length - 1" class="flex justify-center py-1 text-xl text-slate-300 dark:text-slate-600" aria-hidden="true">↓</div>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-slate-200">
        Only <b class="text-slate-900 dark:text-white">your API’s DTOs</b> are generated - the client itself is a reusable library.
        The same generated DTOs work against any instance running that API, and the same client calls any other ServiceStack API.
      </p>
    </section>`,
    setup() {
        const stages = [
            { name:'Your Services define POCO DTOs', where:'C#',
              text:'Routes, IReturn<T> response types, attributes and descriptions are all captured as metadata - the API contract is ordinary C# you were writing anyway.' },
            { name:'The server publishes them as metadata', where:'/types/metadata',
              text:'NativeTypesFeature (enabled by default) turns your DTOs into a serializable model, then renders it as source for any supported language at /types/<lang>.' },
            { name:'The client saves the generated DTOs', where:'dtos.*',
              text:'One command fetches the file and writes it into your project, with the options it was generated with preserved in a header comment for next time.' },
            { name:'A generic client calls the API', where:'JsonServiceClient',
              text:'Every language ships a smart client that already knows how to authenticate, refresh expired tokens, upload files and surface structured errors - it just needs your DTOs.' },
        ]
        return { stages }
    }
}

/** Three ways to keep generated DTOs current */
const SyncOptions = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Keeping references current</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Three ways to update DTOs</h3>
      </div>
      <div class="grid gap-4 lg:grid-cols-3">
        <div v-for="o in options" :key="o.name"
             :class="['flex min-w-0 flex-col rounded-2xl border p-5 shadow-sm', o.featured
               ? 'border-indigo-300/70 bg-indigo-50/40 dark:border-indigo-800 dark:bg-indigo-950/20'
               : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900']">
          <div class="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <span class="min-w-0 font-bold text-slate-900 dark:text-white">{{o.name}}</span>
            <span v-if="o.featured" class="shrink-0 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">Recommended</span>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{o.text}}</p>
          <code class="mt-3 whitespace-pre-wrap break-words rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{o.code}}</code>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Best for</div>
          <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{o.when}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const options = [
            { name:'Startup Task', featured:true,
              text:'Register the built-in dtos task and every development restart regenerates the App’s own references in-process - no HTTP, no Node.js, and unchanged files aren’t rewritten.',
              code:'StartupTasks.Register("dtos", …)',
              when:'Your own front-end, in the same solution as the API. New project templates already have it.' },
            { name:'npx get-dtos', featured:false,
              text:'A single npm script that adds and updates references in every supported language, without needing .NET installed.',
              code:'npx get-dtos ts <url>',
              when:'External consumers, CI, and any language whose developers don’t have the .NET SDK.' },
            { name:'IDE plugin', featured:false,
              text:'Add and update a reference from the IDE’s context menu in Rider, IntelliJ IDEA, Android Studio, PyCharm, WebStorm, PhpStorm and Eclipse.',
              code:'Right-click → Add Reference',
              when:'Developers who’d rather stay in the IDE than drop to a terminal.' },
        ]
        return { options }
    }
}

/** What every generic client gives you, in every language */
const ClientFeatures = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Generated DTOs are only half of it</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">What the generic clients handle for you</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Each language’s client implements the same behaviors, so this is functionality every consumer of your API gets for free
          instead of re-implementing - correctly or otherwise - in each codebase.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="f in features" :key="f.name"
             class="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="text-lg" aria-hidden="true">{{f.icon}}</span>
          <div class="mt-2 font-bold text-slate-900 dark:text-white">{{f.name}}</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{f.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const features = [
            { icon:'🔐', name:'Authentication', text:'Basic Auth, API Keys, JWTs and session cookies, with transparent JWT and Refresh Token Cookie handling so expired tokens renew themselves.' },
            { icon:'⚠️', name:'Structured errors', text:'A failed API surfaces as a typed exception carrying ResponseStatus and per-field validation errors - ready to bind to a form.' },
            { icon:'📎', name:'File uploads', text:'Single and multiple file uploads alongside a typed Request DTO, in every language.' },
            { icon:'🔎', name:'Typed AutoQuery', text:'AutoQuery responses come back strongly typed, with the same querying conventions across languages.' },
            { icon:'📦', name:'Batched & one-way calls', text:'Send many requests in a single round trip, or fire-and-forget where no response is needed.' },
            { icon:'🧪', name:'Substitutable by design', text:'Clients take a Base URL and are interface-based, so pointing at a local instance or a mock is a constructor argument.' },
        ]
        return { features }
    }
}

/** Server-side control over what gets generated */
const ServerControls = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">The server decides what ships</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Controlling what’s generated</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Consumers can customize their own output from the options header of their generated file, but the server always has the
          final say over what a given client is allowed to see.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="c in controls" :key="c.name"
             class="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <code class="whitespace-pre-wrap break-words font-bold text-indigo-700 dark:text-indigo-300">{{c.name}}</code>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{c.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const controls = [
            { name:'[ExcludeMetadata]', text:'Keep a Request DTO out of the metadata and out of every generated client.' },
            { name:'[Restrict(InternalOnly = true)]', text:'Limit a type to references added from localhost or an internal network, so internal APIs never appear in an external client.' },
            { name:'MetadataTypesConfig.IgnoreTypes', text:'Exclude types from generation without annotating them.' },
            { name:'MetadataTypesConfig.ExportTypes', text:'Emit a BCL type like DayOfWeek that would otherwise be skipped for non-.NET languages.' },
            { name:'Metadata.ForceInclude', text:'Override the built-in generation rules to include specific types, e.g. the Admin APIs a management UI needs.' },
            { name:'MetadataTypesConfig.AddImplicitVersion', text:'Embed a version number in every generated Request DTO to implement a versioning strategy.' },
        ]
        return { controls }
    }
}

export default {
    components: { LanguageGrid, ReferenceFlow, SyncOptions, ClientFeatures, ServerControls }
}
