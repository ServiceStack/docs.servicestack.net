import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Why API Keys were separated from Users in .NET 10 */
const ApiKeyRedesign = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Machines aren’t users</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Why API Keys were redesigned</h3>

      <div class="mt-7 grid gap-4 lg:grid-cols-2">
        <div class="rounded-2xl border-2 border-rose-200 bg-rose-50/40 p-5 dark:border-rose-900 dark:bg-rose-950/20">
          <div class="flex items-center justify-between gap-2">
            <div class="font-bold text-slate-900 dark:text-white">The old Auth Provider</div>
            <span class="shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-700 dark:bg-rose-950 dark:text-rose-300">superseded</span>
          </div>
          <ul class="mt-3 space-y-2">
            <li v-for="p in problems" :key="p" class="flex items-start gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <span class="mt-0.5 shrink-0 font-black text-rose-500">✕</span><span>{{p}}</span>
            </li>
          </ul>
        </div>

        <div class="rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-5 dark:border-emerald-800 dark:bg-emerald-950/25">
          <div class="flex items-center justify-between gap-2">
            <div class="font-bold text-slate-900 dark:text-white">ApiKeysFeature</div>
            <span class="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">.NET 10</span>
          </div>
          <ul class="mt-3 space-y-2">
            <li v-for="s in solutions" :key="s" class="flex items-start gap-2.5 text-sm leading-6 text-slate-700 dark:text-slate-200">
              <span class="mt-0.5 shrink-0 text-emerald-500">✓</span><span>{{s}}</span>
            </li>
          </ul>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        It’s <b class="text-slate-900 dark:text-white">a plugin, not an Auth Provider</b> - which is what lets a key
        exist without a user account, and lets a caller you hand a key to reach only what that key allows rather than
        everything its owner can do.
      </p>
    </section>`,
    setup() {
        const problems = [
            'The first request was slow - it ran the whole authentication workflow to set up a user.',
            'No fine-grained access control: a key had exactly the same access as its user.',
            'Every key had to be attached to a User, which machine-to-machine callers never needed.',
        ]
        const solutions = [
            'Keys are independent of Users and of authentication itself.',
            'Scopes, per-API restrictions and features narrow what one key can do.',
            'A key you hand out can’t reach the owner’s account.',
        ]
        return { problems, solutions }
    }
}

/** The three ways to narrow what a key can do */
const KeyControls = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Three independent dials</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Controlling what a key can reach</h3>
      </div>
      <div class="grid gap-3 lg:grid-cols-3">
        <div v-for="c in controls" :key="c.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', c.accent]">
          <div class="flex items-center gap-2.5">
            <span class="text-lg">{{c.icon}}</span>
            <div class="font-bold text-slate-900 dark:text-white">{{c.name}}</div>
          </div>
          <p class="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{c.text}}</p>
          <code class="mt-3 block whitespace-pre-wrap break-words rounded-lg bg-slate-900 px-2.5 py-2 text-[11px] text-emerald-300 dark:bg-black/50">{{c.code}}</code>
          <p class="mt-2.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{{c.note}}</p>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-amber-900 dark:bg-amber-950/20 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">An API with no scope is reachable by any valid key.</b> Scopes narrow
        access, they don’t grant it - so decide deliberately which APIs carry one. The only built-in scope is
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">Admin</code>, which like the Admin role
        opens every <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">[ValidateApiKey]</code> API.
      </p>
    </section>`,
    setup() {
        const controls = [
            { icon:'🔑', name:'Scopes', accent:'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900 dark:bg-indigo-950/30',
              text:'User-defined strings an API requires. The usual shape is read-only, write-only or read/write access to a slice of your API surface.',
              code:'[ValidateApiKey("todo:read")]',
              note:'Applied on the Request DTO, so clients can see the requirement too.' },
            { icon:'🎯', name:'API restrictions', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Instead of - or alongside - scopes, a key can be restricted to an explicit list of APIs it may call.',
              code:'Restrict to APIs (Admin UI)',
              note:'The tightest option when a key exists for exactly one integration.' },
            { icon:'⭐', name:'Features', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Tags your own code inspects to change behavior rather than to allow or deny - a Paid tier, higher rate limits, extra tracking.',
              code:'Request.GetApiKey().HasFeature()',
              note:'Authorization stays in the attribute; features shape what a permitted call returns.' },
        ]
        return { controls }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, ApiKeyRedesign, KeyControls }
}
