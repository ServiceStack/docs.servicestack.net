import Templates, { Index } from "../templates/Templates.mjs"

const IdentityAuthTemplates = {
    components: { Templates },
    template:`<Templates :templates="[Index['blazor'], Index['blazor-vue'], Index['razor'], Index['mvc'], Index['razor-bootstrap']]" hide="demo" />`,
    setup() {
        return { Index }
    }
}

/** How Identity Auth and ServiceStack meet in the middle */
const IdentityBridge = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One sign-in, two worlds</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">How ServiceStack integrates with Identity Auth</h3>

      <div class="mt-7 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">ASP.NET Core</div>
          <div class="mt-2 font-bold text-slate-900 dark:text-white">ClaimsPrincipal</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Pages, controllers and endpoints authenticate exactly as they do in Microsoft\u2019s own templates.
            Authorization is configured with standard ASP.NET Core APIs.
          </p>
        </div>

        <div class="flex flex-col items-center justify-center gap-2 text-center">
          <code class="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-bold text-white">IdentityApplicationAuthProvider</code>
          <span class="text-2xl text-indigo-400" aria-hidden="true"><span class="hidden lg:inline">\u2194</span><span class="lg:hidden">\u2195</span></span>
          <span class="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">converts</span>
        </div>

        <div class="rounded-2xl border-2 border-emerald-400/60 bg-emerald-50/60 p-5 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/25">
          <div class="text-sm font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">ServiceStack</div>
          <div class="mt-2 font-bold text-slate-900 dark:text-white">Typed User Session</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Your APIs keep using the same Session abstraction, the same endpoints and the same Request/Response DTOs
            your clients already call.
          </p>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <b class="text-slate-900 dark:text-white">There are no new concepts to learn.</b> The integration replaces the
        internals, not the surface - which is why an existing ServiceStack codebase migrates with minimal changes despite
        Identity Auth being an entirely different provider model.
      </p>
    </section>`,
}

/** The three providers, and which ones you actually need */
const IdentityProviders = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">One registered by default</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">The Identity Auth Providers</h3>
      </div>
      <div class="grid gap-3 lg:grid-cols-3">
        <div v-for="p in providers" :key="p.name"
             :class="['flex flex-col rounded-2xl border-2 p-5 shadow-sm', p.accent]">
          <div class="flex items-start justify-between gap-2">
            <code class="min-w-0 break-words text-sm font-bold text-slate-900 dark:text-white">{{p.name}}</code>
            <span :class="['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', p.tint]">{{p.state}}</span>
          </div>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{p.text}}</p>
          <p class="mt-3 border-t border-black/5 pt-2.5 text-xs leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400">
            <b class="text-slate-700 dark:text-slate-200">Enable it when:</b> {{p.when}}
          </p>
        </div>
      </div>
    </section>`,
    setup() {
        const providers = [
            { name:'IdentityApplicationAuthProvider', state:'always on',
              tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              accent:'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/25',
              text:'Converts Identity Auth\u2019s ClaimsPrincipal into an authenticated ServiceStack Session.',
              when:'Registered by default - this is what makes the integration work at all.' },
            { name:'IdentityCredentialsAuthProvider', state:'opt-in',
              tint:'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Implements ServiceStack\u2019s Authenticate API against Identity Auth.',
              when:'You want ServiceStack\u2019s built-in UIs to sign in through their own dialogs.' },
            { name:'IdentityJwtAuthProvider', state:'opt-in',
              tint:'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
              accent:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Converts an Identity Auth JWT into an authenticated ServiceStack Session.',
              when:'Clients authenticate statelessly with a bearer token.' },
        ]
        return { providers }
    }
}

export default {
    install(app) {
    },
    components: {
        IdentityAuthTemplates,
        IdentityBridge,
        IdentityProviders,
    },
    setup() {
        return { }
    }
}
