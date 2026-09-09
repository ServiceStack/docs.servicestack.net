import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Two gates, then a boundary - and Projects is only the last one */
const ProjectBoundary = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Projects narrow access, they don’t grant it</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What a filesystem tool can actually reach</h3>

      <div class="mt-7 grid gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div v-for="(gate,i) in gates" :key="gate.name" class="contents">
          <div :class="['min-w-0 rounded-2xl border-2 p-5 shadow-sm', gate.accent]">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div class="min-w-0 text-sm font-bold text-slate-900 dark:text-white">{{gate.name}}</div>
              <span :class="['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', gate.tint]">{{gate.state}}</span>
            </div>
            <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] text-emerald-300 dark:bg-black/50">{{gate.code}}</code>
            <p class="mt-2.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{gate.text}}</p>
          </div>
          <div v-if="i < gates.length - 1" class="flex items-center justify-center text-2xl text-indigo-400" aria-hidden="true">
            <span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span>
          </div>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-slate-200">
        Every path a filesystem tool receives is <b class="text-slate-900 dark:text-white">normalized to a full path and
        checked against the active boundary</b>, so <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">..</code>
        segments and absolute paths can’t escape it. That’s what makes a capable coding Agent possible without granting
        ambient access to the whole server.
      </p>
    </section>`,
    setup() {
        const gates = [
            { name:'Host enables the tools', code:'EnableFilesystemTools = true', state:'off by default',
              tint:'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
              accent:'border-rose-200 bg-rose-50/40 dark:border-rose-900 dark:bg-rose-950/20',
              text:'Nothing below applies until the host opts in. Filesystem and code tools stay unregistered.' },
            { name:'Host allows directories', code:'AllowedDirectories = ["/srv/…"]', state:'empty by default',
              tint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              accent:'border-amber-200 bg-amber-50/40 dark:border-amber-900 dark:bg-amber-950/20',
              text:'The fallback boundary when no project is active - and empty means nothing is reachable.' },
            { name:'User selects a project', code:'…/user/{user}/projects/{folder}', state:'replaces',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/25',
              text:'An active project replaces the allowed directories with its own folder, under that user’s storage.' },
        ]
        return { gates }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, ProjectBoundary }
}
