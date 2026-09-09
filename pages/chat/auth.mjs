import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Three sign-in experiences over the same identity */
const AuthTypes = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">No second identity silo</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Choosing an AuthType</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          All three authenticate against the users your App already has. What changes is only where the sign-in
          happens - not who the user is, or what they are allowed to do.
        </p>
      </div>

      <div class="grid gap-3 lg:grid-cols-3">
        <div v-for="t in types" :key="t.name"
             :class="['flex flex-col rounded-2xl border-2 p-5 shadow-sm', t.accent]">
          <div class="flex items-start justify-between gap-2">
            <code class="min-w-0 break-words text-sm font-bold text-slate-900 dark:text-white">{{t.name}}</code>
            <span v-if="t.badge" class="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{{t.badge}}</span>
          </div>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Sign-in experience</div>
          <p class="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{{t.ux}}</p>
          <div class="mt-3 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Requires</div>
          <p class="mt-1 flex-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{t.requires}}</p>
          <p class="mt-3 border-t border-black/5 pt-2.5 text-xs leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400">
            <b class="text-slate-700 dark:text-slate-200">Pick it when:</b> {{t.when}}
          </p>
        </div>
      </div>

      <p class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">API keys are always a valid way in</b>, whatever AuthType is set -
        Chat UI routes bypass the ApiKeysFeature request filter, so keys are resolved on every request, including to
        <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">/chat/mcp</code>. Each key carries its own
        roles, permissions and expiry.
      </p>
    </section>`,
    setup() {
        const types = [
            { name:'Credentials', badge:'default', accent:'border-indigo-300 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/25',
              ux:'A username/password form rendered inside the Chat UI.',
              requires:'AuthFeature with CredentialsAuth(), or Identity Auth.',
              when:'You want users to stay in /chat and share the App’s auth cookie.' },
            { name:'OAuth', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              ux:'Redirects to the host’s Identity login page at SignInUrl.',
              requires:'ASP.NET Identity Auth.',
              when:'Your App already has a branded login page you’d rather send users to.' },
            { name:'ApiKey', accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              ux:'GET /auth with an Authorization: Bearer header.',
              requires:'ApiKeysFeature.',
              when:'The caller is a programmatic client or an external MCP assistant.' },
        ]
        return { types }
    }
}

/** What "scoped to the identity" actually means */
const IdentityScope = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One identity, everywhere</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What the signed-in user’s identity decides</h3>
      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="s in scopes" :key="s.name"
             class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="mt-0.5 shrink-0 text-emerald-500">✓</span>
          <div class="min-w-0">
            <div class="text-sm font-bold text-slate-900 dark:text-white">{{s.name}}</div>
            <p class="mt-0.5 text-xs leading-5 text-slate-500 dark:text-slate-400">{{s.text}}</p>
          </div>
        </div>
      </div>
      <p class="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        With <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">RequireAuth = false</code>
        everything runs as the shared <code class="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">default</code>
        user - appropriate for a single-user or internal deployment, and nothing more.
      </p>
    </section>`,
    setup() {
        const scopes = [
            { name:'Threads & history', text:'Conversations are partitioned by username - no user sees another’s.' },
            { name:'Media & gallery', text:'Generated images and audio belong to whoever produced them.' },
            { name:'Projects & files', text:'Each user’s workspace lives under their own App_Data folder.' },
            { name:'Profiles & skills', text:'Personal agent profiles and skills override shared ones.' },
            { name:'API calls', text:'A tool call runs as that user, through your normal authorization.' },
            { name:'Gemini File Stores', text:'A store one user creates is not visible to another.' },
        ]
        return { scopes }
    }
}

export default {
    components: { Screenshot, ScreenshotsGallery, ScreenshotsGalleryView, AuthTypes, IdentityScope }
}
