import { computed, ref } from "vue"
import StatsHero from "./components/StatsHero.mjs"
import DtoQuickStart from "./components/DtoQuickStart.mjs"
import VideoGallery from "./components/VideoGallery.mjs"

/* ------------------------------------------------------------------ helpers */

/** Trim the common leading indentation so code can be indented to match its surrounding source */
function dedent(text) {
    const lines = String(text ?? '').replace(/\t/g, '    ').split('\n')
    while (lines.length && !lines[0].trim()) lines.shift()
    while (lines.length && !lines[lines.length - 1].trim()) lines.pop()
    if (!lines.length) return ''
    const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length))
    return lines.map(l => l.slice(indent)).join('\n')
}

const escapeHtml = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Highlight with the page's global highlight.js when available, otherwise render escaped text */
function highlight(code, lang) {
    const src = dedent(code)
    const hljs = globalThis.hljs
    try {
        if (hljs && lang && hljs.getLanguage(lang)) {
            return hljs.highlight(src, { language: lang, ignoreIllegals: true }).value
        }
    } catch { /* fall through to plain text */ }
    return escapeHtml(src)
}

async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        return false
    }
}

/** A single copyable shell command or URL, styled as a terminal line */
const Terminal = {
    props: { cmd: String, prompt: { type: String, default: '$' } },
    template: `
    <div class="group flex items-start gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
      <span class="select-none pt-px font-mono text-sm text-indigo-400">{{prompt}}</span>
      <code class="min-w-0 flex-1 whitespace-pre-wrap break-words font-mono text-[13px] leading-6 text-slate-100">{{cmd}}</code>
      <button type="button" @click="copy" :aria-label="'Copy: ' + cmd"
        class="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-white/10 hover:text-white">
        {{copied ? 'Copied' : 'Copy'}}
      </button>
    </div>`,
    setup(props) {
        const copied = ref(false)
        async function copy() {
            if (await copyText(props.cmd)) {
                copied.value = true
                setTimeout(() => copied.value = false, 1500)
            }
        }
        return { copied, copy }
    }
}

/* --------------------------------------------------------------------- hero */

const FirstApiHero = {
    components: { StatsHero },
    template: `<StatsHero
        eyebrow="Getting started"
        title="Create your first API."
        highlight="Running in under a minute."
        description="One command scaffolds a complete .NET 10 solution. What you write is a single C# class - what you get is a REST API, every serialization format, an executable API Explorer and native typed clients in 15 languages."
        :stats="stats"
        :primary="{ text:'Start the walkthrough', href:'#quick-start' }"
        :secondary="{ text:'Browse all templates', href:'/templates/' }" />`,
    setup() {
        const stats = [
            { value: 1, label: 'Command to start' },
            { value: 4, label: 'Projects scaffolded' },
            { value: 15, label: 'Client languages' },
            { value: 0, label: 'Controllers to write' },
        ]
        return { stats }
    }
}

/* -------------------------------------------------------------- quick start */

const QuickStart = {
    components: { Terminal },
    template: `
    <section id="quick-start" class="not-prose my-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-indigo-950/30">
      <div class="flex flex-col gap-4 border-b border-white/10 bg-white/[.04] px-5 py-5 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[.22em] text-indigo-300">Quick start</p>
          <h3 class="mt-1 text-xl font-bold text-white">Three commands to a running API</h3>
        </div>
        <label class="block lg:w-72">
          <span class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Project name</span>
          <input v-model="name" @keypress="isAlphaNumeric" type="text" spellcheck="false" autocorrect="off" placeholder="MyApp"
            class="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 font-mono text-sm text-white outline-none ring-indigo-400 transition focus:ring-2">
        </label>
      </div>

      <div class="grid lg:grid-cols-3">
        <div v-for="(step,i) in steps" :key="step.title"
             class="border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r lg:last:border-r-0">
          <div class="flex items-center gap-3">
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-black text-white">{{i+1}}</span>
            <div>
              <p class="font-semibold text-white">{{step.title}}</p>
              <p class="text-sm text-slate-400">{{step.caption}}</p>
            </div>
          </div>
          <div class="mt-5">
            <Terminal :cmd="step.cmd" :prompt="step.prompt || '$'" />
          </div>
          <p class="mt-4 text-sm leading-6 text-slate-400" v-html="step.note"></p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 bg-white/[.03] px-5 py-4 text-sm text-slate-400 sm:px-7">
        <span class="font-semibold text-slate-300">Prerequisites</span>
        <span>.NET 10 SDK</span>
        <span class="text-slate-600">•</span>
        <span>Node.js (for <code class="font-mono text-slate-300">npx</code>)</span>
        <span class="text-slate-600">•</span>
        <a href="/dotnet-new" class="font-semibold text-indigo-300 hover:text-indigo-200">Prefer the x dotnet tool? →</a>
      </div>
    </section>`,
    setup() {
        const name = ref('MyApp')
        const project = computed(() => name.value.trim() || 'MyApp')
        const isAlphaNumeric = (e) => {
            const c = e.charCode
            if (c >= 65 && c <= 90 || c >= 97 && c <= 122 || c >= 48 && c <= 57 || c === 95) return
            e.preventDefault()
        }
        const steps = computed(() => [
            {
                title: 'Create the solution',
                caption: 'From the empty web template',
                cmd: `npx create-net web ${project.value}`,
                note: `Scaffolds the recommended 4-project structure. Omit the name to use the current directory's name.`,
            },
            {
                title: 'Run a watched build',
                caption: 'Rebuilds & restarts on save',
                cmd: `cd ${project.value} && dotnet watch --project ${project.value}`,
                note: `Or just press <b class="text-slate-200">Ctrl+F5</b> in your IDE. Every source change is picked up automatically.`,
            },
            {
                title: 'Call your API',
                caption: 'It is already working',
                cmd: 'https://localhost:5001', prompt: '↗',
                note: `The home page calls your <b class="text-slate-200">Hello</b> API with typed DTOs as you type - no build step, no bundler.`,
            },
        ])
        return { name, steps, isAlphaNumeric }
    }
}

/* ------------------------------------------------------------ request cycle */

const RequestLifecycle = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">The request, end to end</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What happens when you hit <code class="font-mono text-indigo-600 dark:text-indigo-400">/hello/World</code></h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">Select a stage to see what ServiceStack does with your message before, during and after your Service runs.</p>

      <div class="mt-6 flex flex-col gap-2 lg:flex-row lg:items-stretch">
        <template v-for="(stage,i) in stages" :key="stage.name">
          <button type="button" @click="selected=i"
            :class="['flex-1 rounded-xl border px-4 py-3 text-left transition', selected === i
              ? 'border-indigo-500 bg-indigo-600 text-white shadow-md'
              : 'border-slate-200 bg-white hover:border-indigo-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600']">
            <span :class="['text-xs font-bold', selected === i ? 'text-indigo-100' : 'text-indigo-600 dark:text-indigo-400']">{{stage.step}}</span>
            <div :class="['mt-1 text-sm font-bold', selected === i ? 'text-white' : 'text-slate-900 dark:text-white']">{{stage.name}}</div>
            <div :class="['mt-0.5 font-mono text-xs', selected === i ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400']">{{stage.token}}</div>
          </button>
          <div v-if="i < stages.length - 1" aria-hidden="true" class="flex items-center justify-center text-slate-300 dark:text-slate-600">
            <span class="lg:hidden">↓</span><span class="hidden lg:inline">→</span>
          </div>
        </template>
      </div>

      <div class="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-5 dark:border-indigo-900 dark:bg-indigo-950/40">
        <h4 class="font-bold text-slate-900 dark:text-white">{{active.title}}</h4>
        <p class="mt-2 leading-7 text-slate-600 dark:text-slate-300">{{active.description}}</p>
        <pre v-if="active.code" class="codeblock mt-4 overflow-x-auto rounded-lg bg-slate-950"><code class="hljs" v-html="codeHtml"></code></pre>
      </div>
    </section>`,
    setup() {
        const stages = [
            {
                step: '01', name: 'HTTP request', token: 'GET /hello/World',
                title: 'A route is matched, not a controller method',
                description: 'Routes are declared on the message itself, so the same DTO defines the URL, the HTTP verb it accepts and the response it returns. Every ServiceStack API also has a pre-defined route, so the custom route is entirely optional.',
                lang: 'csharp',
                code: `[Route("/hello/{Name}")]
public class Hello : IGet, IReturn<HelloResponse>
{
    public required string Name { get; set; }
}`,
            },
            {
                step: '02', name: 'Bind & validate', token: 'Hello { Name }',
                title: 'The request is populated into a typed POCO',
                description: 'Path segments, query string, form fields and the JSON body all populate the same Request DTO. Declarative validation runs before your Service does, returning structured errors every typed client understands.',
                lang: 'csharp',
                code: `public class HelloValidator : AbstractValidator<Hello>
{
    public HelloValidator() => RuleFor(x => x.Name).NotEmpty();
}`,
            },
            {
                step: '03', name: 'Your Service', token: 'Any(Hello)',
                title: 'One method, all the plumbing already done',
                description: 'Name the method after the HTTP Verb it handles, or Any to handle them all. There is nothing HTTP-specific in the signature, which is why the same implementation can also be called from an MQ, gRPC or in-process.',
                lang: 'csharp',
                code: `public class MyServices : Service
{
    public object Any(Hello request) =>
        new HelloResponse { Result = $"Hello, {request.Name}!" };
}`,
            },
            {
                step: '04', name: 'Response DTO', token: 'HelloResponse',
                title: 'Return a message, not a serialized payload',
                description: 'Your Service returns a POCO. ServiceStack decides how to render it from the request - Accept header, format extension or ?format= query string - so a single implementation serves every format.',
                lang: 'json',
                code: `{
  "result": "Hello, World!"
}`,
            },
            {
                step: '05', name: 'Any format', token: 'json · csv · html',
                title: 'Formats and clients you never wrote',
                description: 'The same response is available as JSON, CSV, JSONL, HTML, MessagePack, Protobuf and gRPC, alongside an executable API Explorer UI and typed DTOs for 15 languages - all generated from the contract above.',
            },
        ]
        const selected = ref(0)
        const active = computed(() => stages[selected.value])
        const codeHtml = computed(() => active.value.code ? highlight(active.value.code, active.value.lang) : '')
        return { stages, selected, active, codeHtml }
    }
}

/* ---------------------------------------------------------------- code tour */

const CodeTour = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Tour the solution</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Every file that matters, in one screen</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">This is the entire working API the template gives you - four short files, no code-gen to maintain and no configuration to wire up.</p>
      </div>

      <div class="grid md:grid-cols-[16rem_1fr]">
        <nav class="border-b border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/40 md:border-b-0 md:border-r">
          <button v-for="(file,i) in files" :key="file.path" type="button" @click="selected=i"
            :class="['block w-full rounded-lg px-3 py-2.5 text-left transition', selected === i
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-white hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-800']">
            <div :class="['font-mono text-sm font-semibold', selected === i ? 'text-white' : 'text-slate-900 dark:text-white']">{{file.name}}</div>
            <div :class="['mt-0.5 truncate font-mono text-xs', selected === i ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400']">{{file.project}}</div>
          </button>
        </nav>

        <div class="min-w-0">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-5 py-3 dark:border-slate-700">
            <code class="font-mono text-xs text-slate-500 dark:text-slate-400">{{active.project}}/{{active.name}}</code>
            <span class="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:ring-indigo-900">{{active.badge}}</span>
          </div>
          <pre class="codeblock overflow-x-auto bg-slate-950"><code class="hljs" v-html="codeHtml"></code></pre>
          <p class="px-5 py-4 leading-7 text-slate-600 dark:text-slate-300">{{active.summary}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const files = [
            {
                name: 'Hello.cs', project: 'MyApp.ServiceModel', badge: 'The contract', lang: 'csharp',
                summary: 'Your API in one file. IGet declares the verb, IReturn<T> declares the response type, and the Route declares the URL. This project has no dependencies beyond ServiceStack.Interfaces, so it can be shared with any .NET client as-is.',
                code: `using ServiceStack;

namespace MyApp.ServiceModel;

[Route("/hello/{Name}")]
public class Hello : IGet, IReturn<HelloResponse>
{
    public required string Name { get; set; }
}

public class HelloResponse
{
    public required string Result { get; set; }
}`,
            },
            {
                name: 'MyServices.cs', project: 'MyApp.ServiceInterface', badge: 'The implementation', lang: 'csharp',
                summary: 'The only logic you write. Any(Hello) handles every HTTP Verb - use Get, Post, Put or Delete to restrict it. Because it takes a message and returns a message, it is trivially unit testable without a web server.',
                code: `using ServiceStack;
using MyApp.ServiceModel;

namespace MyApp.ServiceInterface;

public class MyServices : Service
{
    public object Any(Hello request)
    {
        return new HelloResponse { Result = $"Hello, {request.Name}!" };
    }
}`,
            },
            {
                name: 'Program.cs', project: 'MyApp', badge: 'The host', lang: 'csharp',
                summary: 'A standard ASP.NET Core app. AddServiceStack() registers the Services found in your ServiceInterface assembly and MapEndpoints() maps them onto ASP.NET Core endpoint routing - so your APIs sit alongside everything else in the pipeline.',
                code: `var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

services.AddServiceStack(typeof(MyServices).Assembly);

var app = builder.Build();

app.UseStaticFiles();

app.UseServiceStack(new AppHost(), options => {
    options.MapEndpoints();
});

app.Run();`,
            },
            {
                name: 'UnitTest.cs', project: 'MyApp.Tests', badge: 'The tests', lang: 'csharp',
                summary: 'No HTTP, no mocking framework, no test host gymnastics. Resolve the Service and call the method - the same code path a real request takes. Swap BasicAppHost for a real one when you want integration tests over HTTP.',
                code: `public class UnitTest
{
    private readonly ServiceStackHost appHost;

    public UnitTest()
    {
        appHost = new BasicAppHost().Init();
        appHost.Container.AddTransient<MyServices>();
    }

    [OneTimeTearDown]
    public void OneTimeTearDown() => appHost.Dispose();

    [Test]
    public void Can_call_MyServices()
    {
        var service = appHost.Container.Resolve<MyServices>();

        var response = (HelloResponse)service.Any(new Hello { Name = "World" });

        Assert.That(response.Result, Is.EqualTo("Hello, World!"));
    }
}`,
            },
        ]
        const selected = ref(0)
        const active = computed(() => files[selected.value])
        const codeHtml = computed(() => highlight(active.value.code, active.value.lang))
        return { files, selected, active, codeHtml }
    }
}

/* ------------------------------------------------------------ free surfaces */

const FreeSurface = {
    template: `
    <section class="not-prose my-10">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Included, not configured</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Endpoints your one DTO just created</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Every URL below is live on the running template. Try them on the
          <a href="https://web.web-templates.io" rel="noopener" class="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">hosted demo</a>
          or on <code class="font-mono">https://localhost:5001</code> after <code class="font-mono">dotnet watch</code>.
        </p>

        <div class="mt-6 grid gap-3 sm:grid-cols-2">
          <a v-for="item in items" :key="item.url" :href="'https://web.web-templates.io' + item.url" target="_blank" rel="noopener"
             class="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-indigo-600">
            <div class="flex items-center gap-2">
              <code class="font-mono text-sm font-bold text-indigo-700 group-hover:text-indigo-600 dark:text-indigo-300">{{item.url}}</code>
              <span aria-hidden="true" class="text-slate-400 opacity-0 transition group-hover:opacity-100">↗</span>
            </div>
            <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">{{item.text}}</p>
          </a>
        </div>
      </div>
    </section>`,
    setup() {
        const items = [
            { url: '/hello/World', text: 'Your custom route, rendered in the human-friendly HTML Auto Format.' },
            { url: '/hello/World?format=json', text: 'The same response as JSON - or csv, jsonl, html and more.' },
            { url: '/ui/Hello', text: 'API Explorer: an executable, authorized UI for every API, generated at runtime.' },
            { url: '/types/mjs', text: 'Annotated ES6 class DTOs for JavaScript, served straight from your App.' },
            { url: '/metadata', text: 'The metadata page listing every API, format and client language available.' },
            { url: '/hello/World?format=csv', text: 'CSV, straight from the same Response DTO - no extra code, no extra route.' },
        ]
        return { items }
    }
}

/* --------------------------------------------------------- solution layout */

const SolutionLayout = {
    template: `
    <section class="not-prose my-10">
      <div class="grid gap-4 lg:grid-cols-2">
        <div v-for="p in projects" :key="p.name"
             class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center justify-between gap-3">
            <code class="font-mono text-sm font-bold text-slate-900 dark:text-white">{{p.name}}</code>
            <span class="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{p.role}}</span>
          </div>
          <p class="mt-3 leading-7 text-slate-600 dark:text-slate-300">{{p.summary}}</p>
          <ul class="mt-4 space-y-1.5">
            <li v-for="point in p.points" :key="point" class="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
              <span aria-hidden="true" class="mt-px text-indigo-500">▸</span><span>{{point}}</span>
            </li>
          </ul>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-400">
        Dependencies flow one way: the Host references everything, and <b class="text-slate-900 dark:text-white">nothing references the Host</b>.
        Your ServiceModel sits at the bottom with no dependencies at all, which is what lets any client consume it.
      </p>
    </section>`,
    setup() {
        const projects = [
            {
                name: 'MyApp', role: 'Host',
                summary: 'The ASP.NET Core project that decides which concrete implementations your App uses. It owns configuration, registrations and web assets - and by design stays free of business logic.',
                points: ['Program.cs & Configure.*.cs modular startup', 'wwwroot assets, appsettings & deployment config', 'References every other project'],
            },
            {
                name: 'MyApp.ServiceInterface', role: 'Implementation',
                summary: 'Where your Services and business logic live. Small and medium Apps keep everything here grouped by feature; large solutions split it into cohesive modules that encapsulate their own dependencies.',
                points: ['Service implementations', 'Business logic & dependencies', 'References ServiceModel'],
            },
            {
                name: 'MyApp.ServiceModel', role: 'Contract',
                summary: 'Your DTOs, and nothing else. Keeping the contract free of implementation is what lets you ship it as a dll or generate it remotely with Add ServiceStack Reference.',
                points: ['Request & Response DTOs', 'Only references ServiceStack.Interfaces', 'The single project clients need'],
            },
            {
                name: 'MyApp.Tests', role: 'Tests',
                summary: 'Unit and integration tests. It is itself a host project, so it can mix concrete and mock dependencies depending on what you are testing.',
                points: ['In-process unit tests with BasicAppHost', 'Integration tests over a real HTTP host', 'References all non-Host projects'],
            },
        ]
        return { projects }
    }
}

/* --------------------------------------------------------- the DTO boundary */

/**
 * Replaces the old /img/pages/dtos-role.png diagram: a trivial call on the client,
 * a tiny shared contract, and however much complexity the Service wants to hide.
 */
const DtoBoundary = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">The role of DTOs</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">A small contract in front of as much complexity as you like</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          The DTO is the only thing the client and server share. It stays trivial to call, while the Service behind it is free to grow into whatever it needs.
        </p>
      </div>

      <div class="grid items-stretch gap-4 p-6 sm:p-8 lg:grid-cols-[1fr_auto_0.95fr_auto_1.3fr] lg:gap-3">

        <!-- Client -->
        <div class="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950/40">
          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-bold text-slate-900 dark:text-white">Client</span>
            <span class="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700">any of 15 languages</span>
          </div>
          <pre class="codeblock codeblock-sm mt-4 overflow-x-auto rounded-lg bg-slate-950"><code class="hljs" v-html="clientHtml"></code></pre>
          <p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
            One call. No URLs to build, no JSON to parse, no error handling to invent.
          </p>
          <div class="mt-auto flex flex-wrap gap-1.5 pt-4">
            <span v-for="lang in langs" :key="lang"
                  class="rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700">{{lang}}</span>
          </div>
        </div>

        <!-- flow: client <-> contract -->
        <div class="flex shrink-0 items-center justify-center gap-4 lg:flex-col lg:gap-6" aria-hidden="true">
          <div class="flex flex-col items-center text-indigo-500 dark:text-indigo-400">
            <span class="text-lg leading-none lg:rotate-0"><span class="lg:hidden">↓</span><span class="hidden lg:inline">→</span></span>
            <span class="mt-1 text-[10px] font-bold uppercase tracking-wider">request</span>
          </div>
          <div class="flex flex-col items-center text-slate-400 dark:text-slate-500">
            <span class="text-lg leading-none"><span class="lg:hidden">↑</span><span class="hidden lg:inline">←</span></span>
            <span class="mt-1 text-[10px] font-bold uppercase tracking-wider">response</span>
          </div>
        </div>

        <!-- The shared contract -->
        <div class="relative flex min-w-0 flex-col rounded-xl border-2 border-emerald-400 bg-emerald-50/70 p-5 shadow-sm dark:border-emerald-500/60 dark:bg-emerald-950/30">
          <div>
            <span class="inline-block rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">the contract</span>
            <div class="mt-2 text-sm font-bold text-emerald-900 dark:text-emerald-200">Shared DTOs</div>
          </div>
          <pre class="codeblock codeblock-sm mt-4 overflow-x-auto rounded-lg bg-slate-950"><code class="hljs" v-html="dtoHtml"></code></pre>
          <p class="mt-4 text-sm leading-6 text-emerald-900/80 dark:text-emerald-200/80">
            Implementation-free and dependency-free - shared as a dll, or generated from the live API in any language.
          </p>
        </div>

        <!-- flow: contract <-> service -->
        <div class="flex shrink-0 items-center justify-center gap-4 lg:flex-col lg:gap-6" aria-hidden="true">
          <div class="flex flex-col items-center text-indigo-500 dark:text-indigo-400">
            <span class="text-lg leading-none"><span class="lg:hidden">↓</span><span class="hidden lg:inline">→</span></span>
            <span class="mt-1 text-[10px] font-bold uppercase tracking-wider">binds to</span>
          </div>
          <div class="flex flex-col items-center text-slate-400 dark:text-slate-500">
            <span class="text-lg leading-none"><span class="lg:hidden">↑</span><span class="hidden lg:inline">←</span></span>
            <span class="mt-1 text-[10px] font-bold uppercase tracking-wider">returns</span>
          </div>
        </div>

        <!-- Server -->
        <div class="relative isolate flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-300 bg-gradient-to-br from-slate-100 to-slate-50 p-5 dark:border-slate-600 dark:from-slate-800/60 dark:to-slate-900">
          <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10 opacity-[.5] dark:opacity-30"
               style="background-image:radial-gradient(circle at 80% 0%, rgb(129 140 248 / .25), transparent 55%), radial-gradient(circle at 20% 100%, rgb(45 212 191 / .2), transparent 55%)"></div>

          <div class="flex items-center justify-between gap-2">
            <span class="text-sm font-bold text-slate-900 dark:text-white">Service implementation</span>
            <span class="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700">encapsulated</span>
          </div>

          <div class="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-3 font-mono text-sm text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200">
            object Any(<span class="text-emerald-600 dark:text-emerald-400">Hello</span> request)
          </div>

          <p class="mt-4 text-xs font-bold uppercase tracking-[.18em] text-slate-500 dark:text-slate-400">Free to use, change or drop</p>
          <div class="mt-3 flex flex-wrap gap-2">
            <span v-for="cap in capabilities" :key="cap"
                  class="rounded-lg border border-slate-300 bg-white/90 px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-200">
              {{cap}}
            </span>
          </div>

          <p class="mt-auto pt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Rewrite any of it - swap the database, add a cache, split it into microservices - and every client keeps working, because none of it leaks past the contract.
          </p>
        </div>
      </div>
    </section>`,
    setup() {
        const capabilities = [
            'RDBMS', 'Redis cache', 'MQ workers', 'Background Jobs',
            'Search index', 'Blob storage', 'Microservices', '3rd party APIs',
            'AI models', 'Auth & validation',
        ]
        const langs = ['C#', 'TypeScript', 'Python', 'Swift', 'Kotlin', 'Dart', 'Go', 'Rust', '+7 more']
        const clientHtml = highlight(`var api = client.Api(
    new Hello {
        Name = "World"
    });`, 'csharp')
        const dtoHtml = highlight(`class Hello {
    string Name;
}
class HelloResponse {
    string Result;
}`, 'csharp')
        return { capabilities, langs, clientHtml, dtoHtml }
    }
}

/* ----------------------------------------------------------- template videos */

const TemplateVideos = {
    components: { VideoGallery },
    template: `<VideoGallery
        eyebrow="Walkthroughs"
        title="See the templates built from scratch"
        description="Pick a stack to watch it go from an empty folder to a working App - then configure the AppHost that ties it together."
        :videos="videos" />`,
    setup() {
        const svg = name => `/img/pages/svg/${name}.svg`
        const videos = [
            { id: 'SyppvQB7IPs', icon: svg('tailwindcss'), tags: ['Razor Pages', 'MVC', 'Tailwind'],
              title: 'Modern Razor Pages & MVC Tailwind templates',
              caption: 'Server-rendered, without the SPA tax',
              summary: 'Build modern Tailwind Apps on Razor Pages and MVC that stay fast and simple - none of the build complexity, and none of the pitfalls that come with a full SPA.' },
            { id: 'YIa0w6whe2U', icon: svg('vue'), tags: ['Vue 3', 'Components'],
              title: 'Progressively enhance Razor Pages with Vue 3',
              caption: 'Drop rich components into server-rendered pages',
              summary: 'Use the Vue 3 Tailwind component library from inside Razor Pages to add rich, interactive islands - typed forms, AutoQuery grids and modals - without adopting a client-side router or build step.' },
            { id: 'D-rU0lU_B4I', icon: svg('vite'), tags: ['Vite', 'SPA', 'SSG'],
              title: 'The ultimate Vue SPA & SSG JAMStack templates',
              caption: 'Best-in-class npm tooling, statically hosted',
              summary: 'Vite-powered Vue SPA and static-site templates that deploy your UI to a CDN while your typed APIs run on .NET - with hot reload, prerendering and end-to-end typed API calls.' },
            { id: '3pPLRyPsO5A', icon: '/img/svgs/react.svg', tags: ['Next.js', 'React'],
              title: 'Rapidly develop a .NET Next.js JAMStack App',
              caption: 'React & Next.js on a typed .NET API',
              summary: 'Scaffold and build a Next.js App backed by typed .NET APIs in JetBrains Rider, calling your Services through generated TypeScript DTOs.' },
            { id: 'mOpx5mUGoqI', icon: svg('dotnet'), tags: ['AppHost', 'Configuration'],
              title: 'Fundamentals of AppHost configuration',
              caption: 'How your App is wired together',
              summary: 'A walk through the AppHost: registering dependencies and plugins, applying configuration and modular startup, and where each piece of your App belongs.' },
        ]
        return { videos }
    }
}

/* ------------------------------------------------------------- what's next */

const NextSteps = {
    template: `
    <section class="not-prose my-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <a v-for="step in steps" :key="step.title" :href="step.href"
         class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-600">
        <div class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">{{step.eyebrow}}</div>
        <div class="mt-2 font-bold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{{step.title}}</div>
        <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">{{step.text}}</p>
      </a>
    </section>`,
    setup() {
        const steps = [
            { eyebrow: 'Data', title: 'AutoQuery', text: 'Turn a Query DTO into a filterable, paged, sorted API over your RDBMS - with no Service to write.', href: '/autoquery/' },
            { eyebrow: 'Data', title: 'OrmLite', text: 'Fast, typed, POCO-first data access for SQL Server, PostgreSQL, MySQL and SQLite.', href: '/ormlite/' },
            { eyebrow: 'Security', title: 'Authentication', text: 'ASP.NET Identity Auth, API Keys, JWT and fine-grained roles & permissions.', href: '/auth/' },
            { eyebrow: 'Quality', title: 'Validation', text: 'Declarative rules on your DTOs that return structured errors every typed client understands.', href: '/validation' },
            { eyebrow: 'Clients', title: 'Add ServiceStack Reference', text: 'Generate native DTOs and idiomatic Service Clients for 15 languages from your live API.', href: '/add-servicestack-reference' },
            { eyebrow: 'Operations', title: 'Built-in Admin UIs', text: 'API Explorer, Locode, database, logging, profiling and analytics UIs generated from your APIs.', href: '/admin-ui' },
        ]
        return { steps }
    }
}

export default {
    components: {
        FirstApiHero,
        QuickStart,
        RequestLifecycle,
        CodeTour,
        FreeSurface,
        SolutionLayout,
        DtoBoundary,
        TemplateVideos,
        NextSteps,
        DtoQuickStart,
    },
}
