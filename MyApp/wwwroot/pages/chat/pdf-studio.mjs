import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"
import WorkflowShowcase from "../components/WorkflowShowcase.mjs"

/** Design → Publish → Admin → C# → Render, and where the AI stops */
const PdfLifecycle = {
    components: { WorkflowShowcase },
    template: `<WorkflowShowcase eyebrow="Authoring is only the first half"
        title="From an AI-assisted draft to deterministic production output" :steps="steps" />`,
    setup() {
        const steps = [
            { name:'Design', caption:'PDF Studio', title:'Author against representative data', tags:['Typst editor','Live preview','Schema forms'],
              description:'Start from Typst, a library template, an uploaded document or an AI-assisted draft. Form and Code views keep the document’s data visible and editable while you work.' },
            { name:'Publish', caption:'Promotion gate', title:'Validate before anything reaches production', tags:['Fixtures compiled','Rolls back on failure'],
              description:'Publish flattens the folder-based design into a self-contained artifact set, validates example data and every named fixture against the schema, exercises C# model generation, and compiles each fixture through the real template. A failure rolls the publish back.' },
            { name:'Administer', caption:'Admin PDF', title:'Immutable revisions and auditable rollback', tags:['History','Restore','Unpublish'],
              description:'Every successful publish becomes an immutable revision holding the complete artifact set, its preview and publishing metadata. Restoring never edits history - it records a new revision naming what was restored.' },
            { name:'Integrate', caption:'Typed C#', title:'Generate the production data contract', tags:['[Pdf] models','Compile-time'],
              description:'Generate strongly typed C# models from the published template schema, so your application code and the document design share a contract the compiler checks.' },
            { name:'Render', caption:'IPdfRenderer', title:'No model is called at runtime', tags:['No LLM','No Studio workspace'],
              description:'The [Pdf] model selects the template, serializes to its JSON contract and invokes the published Typst template. No LLM runs, no personal Studio workspace is read, and only the live files in App_Data/pdf are used.' },
        ]
        return { steps }
    }
}

/** Which plugin you actually need */
const PdfPlugins = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div v-for="p in plugins" :key="p.title"
           :class="['flex flex-col rounded-2xl border p-6 shadow-sm', p.accent]">
        <div class="flex items-center gap-3">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm dark:bg-slate-900/70">{{p.icon}}</span>
          <div>
            <div class="text-base font-bold text-slate-900 dark:text-white">{{p.title}}</div>
            <code class="text-xs text-slate-500 dark:text-slate-400">{{p.plugin}}</code>
          </div>
        </div>
        <div class="mt-4 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Runtime dependencies</div>
        <ul class="mt-2 flex flex-wrap gap-1.5">
          <li v-for="d in p.deps" :key="d"
              class="rounded-lg bg-white/80 px-2.5 py-1 text-xs text-slate-700 ring-1 ring-black/5 dark:bg-slate-900/70 dark:text-slate-300 dark:ring-white/10">{{d}}</li>
        </ul>
        <p class="mt-4 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{p.text}}</p>
      </div>
      <p class="lg:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Rendering has no dependency on ChatFeature</b> - only publishing does,
        since that reads the designer’s folder. Design documents in development, then deploy only
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">PdfFeature</code>, Typst and the published
        artifacts to production.
      </p>
    </section>`,
    setup() {
        const plugins = [
            { icon:'🎨', title:'AI-assisted authoring', plugin:'ChatFeature PDF extension',
              accent:'border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30',
              deps:['Typst CLI','An AI provider'],
              text:'The designer, live preview, schema-generated forms, visual formatting controls and AI editing. Development-time tooling.' },
            { icon:'🖨', title:'Published templates & rendering', plugin:'PdfFeature',
              accent:'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/25',
              deps:['Typst CLI'],
              text:'Template administration, immutable revisions and deterministic production rendering. No AI provider required.' },
        ]
        return { plugins }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, PdfLifecycle, PdfPlugins }
}
