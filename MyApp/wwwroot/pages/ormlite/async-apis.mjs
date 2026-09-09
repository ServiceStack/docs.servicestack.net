import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** The whole async story in one rule */
const AsyncRule = {
    template: `
    <section class="not-prose my-10 rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-6 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/25 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-emerald-700 dark:text-emerald-400">Nothing new to learn</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Add <code class="rounded bg-white px-1.5 py-0.5 text-lg dark:bg-slate-800">Async</code>, add <code class="rounded bg-white px-1.5 py-0.5 text-lg dark:bg-slate-800">await</code></h3>

      <div class="mt-6 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Sync</div>
          <pre class="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] leading-5 text-slate-200 dark:bg-black/50"><code class="nohighlight">var rows = db.Select&lt;Customer&gt;(
    x =&gt; x.Age &gt; 40);</code></pre>
        </div>
        <div class="flex items-center justify-center text-2xl text-emerald-500" aria-hidden="true">
          <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
        </div>
        <div class="rounded-2xl border-2 border-emerald-400/60 bg-white p-5 shadow-sm dark:bg-slate-900">
          <div class="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Async</div>
          <pre class="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] leading-5 text-slate-200 dark:bg-black/50"><code class="nohighlight">var rows = await db.SelectAsync&lt;Customer&gt;(
    x =&gt; x.Age &gt; 40, token);</code></pre>
        </div>
      </div>

      <p class="mt-5 text-sm leading-6 text-slate-700 dark:text-slate-200">
        Almost every public API has an async twin with the same name, the same arguments and an optional
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">CancellationToken</code> - so converting
        existing code is a mechanical change rather than a redesign.
      </p>
    </section>`,
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, AsyncRule }
}
