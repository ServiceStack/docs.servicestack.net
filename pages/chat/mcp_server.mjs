import Screenshot from "../components/Screenshot.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import ScreenshotsGalleryView from "../components/ScreenshotsGalleryView.mjs"

/** Nothing is exposed until the host names it */
const McpExposure = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">Closed until you open it</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">What an external assistant can reach</h3>

      <div class="mt-7 grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div class="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center justify-between gap-2">
            <div class="font-bold text-slate-900 dark:text-white">Your Tool Registry</div>
            <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">everything</span>
          </div>
          <ul class="mt-3 flex flex-wrap gap-1.5">
            <li v-for="g in registry" :key="g"
                class="rounded-lg bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{{g}}</li>
          </ul>
          <p class="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Every tool the built-in Chat UI can use, from every installed extension.
          </p>
        </div>

        <div class="flex flex-col items-center justify-center gap-2 text-center">
          <code class="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-[11px] font-bold text-white">Mcp.ToolGroups</code>
          <span class="text-2xl text-indigo-400" aria-hidden="true"><span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span></span>
          <span class="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">explicit allowlist</span>
        </div>

        <div class="rounded-2xl border-2 border-emerald-400/60 bg-emerald-50/60 p-5 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/25">
          <div class="flex items-center justify-between gap-2">
            <div class="font-bold text-slate-900 dark:text-white">Published over MCP</div>
            <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">what you named</span>
          </div>
          <ul class="mt-3 flex flex-wrap gap-1.5">
            <li v-for="g in exposed" :key="g"
                class="rounded-lg bg-white px-2.5 py-1 font-mono text-[11px] text-emerald-700 ring-1 ring-emerald-200 dark:bg-slate-900 dark:text-emerald-300 dark:ring-emerald-800">{{g}}</li>
          </ul>
          <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            With both lists empty the endpoint isn’t registered at all - <code class="rounded bg-white px-1 py-0.5 text-xs dark:bg-slate-900">IsEnabled</code> reports whether anything is exposed.
          </p>
        </div>
      </div>

      <div class="mt-5 grid gap-3 sm:grid-cols-3">
        <div v-for="pub in publishes" :key="pub.name" class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-sm font-bold text-slate-900 dark:text-white">{{pub.name}}</div>
          <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{{pub.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const registry = ['api_tools','core_tools','computer','filesystem','gemini','pdf','your extension']
        const exposed = ['api_tools','bookings','get_current_time']
        const publishes = [
            { name:'Schemas', text:'The same OpenAI function input schema the Chat UI uses, plus an output schema where one was registered.' },
            { name:'Safety annotations', text:'Derived from ToolSafety, so a client knows which calls mutate before it makes them.' },
            { name:'Bounded results', text:'Small images and audio are inlined as base64; anything larger returns a resource link instead of streaming 40MB through context.' },
        ]
        return { registry, exposed, publishes }
    }
}

/** The identity an MCP tool call runs as */
const McpIdentity = {
    template: `
    <section class="not-prose my-10 rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 p-6 shadow-sm dark:border-indigo-900 dark:bg-indigo-950/30 sm:p-7">
      <div class="flex items-center gap-3">
        <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-lg shadow-sm dark:bg-slate-900/70">🔑</span>
        <div>
          <div class="text-lg font-bold text-slate-900 dark:text-white">Tools execute as the user, not as the App</div>
          <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">ServiceStack API key in the Bearer token</div>
        </div>
      </div>
      <div class="mt-5 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <div v-for="(step,i) in steps" :key="step.name" class="contents">
          <div class="flex-1 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div class="text-sm font-bold text-slate-900 dark:text-white">{{step.name}}</div>
            <p class="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{{step.text}}</p>
          </div>
          <div v-if="i < steps.length - 1" class="flex items-center justify-center px-1 text-indigo-400" aria-hidden="true">
            <span class="hidden sm:inline">→</span><span class="sm:hidden">↓</span>
          </div>
        </div>
      </div>
      <p class="mt-5 text-sm leading-6 text-slate-700 dark:text-slate-200">
        An external assistant therefore sees exactly what that API key’s user is allowed to see - the same authorization
        every other client goes through, with no separate MCP permission model to keep in sync.
      </p>
    </section>`,
    setup() {
        const steps = [
            { name:'Client sends a key', text:'A ServiceStack API key travels in the Bearer token of the JSON-RPC POST.' },
            { name:'ChatFeature resolves it', text:'OnRequestAsync attaches the resolved identity to the request.' },
            { name:'Your API runs', text:'Through the normal pipeline - authentication, authorization, validation, filters and business logic.' },
        ]
        return { steps }
    }
}

/** Three ways to handle a write across a boundary that can't render your approval form */
const ApprovalModes = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">A generic client can’t render your form</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Approval across the MCP boundary</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          The built-in Chat UI pauses a thread and renders ServiceStack’s editable approval form. An external assistant
          can’t resume that server UI, so MCP offers three postures instead.
        </p>
      </div>

      <div class="grid gap-3 lg:grid-cols-3">
        <div v-for="mode in modes" :key="mode.name"
             :class="['flex flex-col rounded-2xl border-2 p-5 shadow-sm', mode.accent]">
          <div class="flex items-start justify-between gap-2">
            <code class="min-w-0 break-words text-sm font-bold text-slate-900 dark:text-white">{{mode.name}}</code>
            <span v-if="mode.badge" :class="['shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider', mode.tint]">{{mode.badge}}</span>
          </div>
          <p class="mt-2.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{mode.text}}</p>
          <p class="mt-3 border-t border-black/5 pt-2.5 text-xs leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400">
            <b class="text-slate-700 dark:text-slate-200">Use when:</b> {{mode.when}}
          </p>
        </div>
      </div>

      <div class="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
        <div class="text-sm font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">The confirmation-token round trip</div>
        <div class="mt-4 grid gap-2 lg:grid-cols-4">
          <div v-for="(step,i) in flow" :key="step" class="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-700 dark:bg-slate-800/40">
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white text-[11px] font-black text-slate-500 shadow-sm dark:bg-slate-900 dark:text-slate-400">{{i+1}}</span>
            <span class="text-xs leading-5 text-slate-600 dark:text-slate-300">{{step}}</span>
          </div>
        </div>
        <p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          The server validates <b class="text-slate-900 dark:text-white">user identity, target API, payload argument hash,
          expiry and a single-use replay check</b> before executing. Read-only operations never need a token.
        </p>
      </div>

      <p class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">API authorization and DTO validation are never disabled by any approval mode.</b>
        Only responsibility for the interactive approval decision changes.
      </p>
    </section>`,
    setup() {
        const modes = [
            { name:'ConfirmationToken', badge:'default', tint:'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
              accent:'border-indigo-300 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-950/25',
              text:'A write returns a signed, short-lived token with a summary of what it would do. The assistant asks the user, then re-invokes with the token.',
              when:'You want human approval to survive a boundary you don’t control.' },
            { name:'Reject', badge:'fail-closed', tint:'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
              accent:'border-rose-200 bg-rose-50/40 dark:border-rose-900 dark:bg-rose-950/20',
              text:'Refuses any tool that would require interactive approval, before it executes.',
              when:'Exposure is meant to be strictly read-only.' },
            { name:'DelegateToClient', badge:'trusted client', tint:'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
              accent:'border-amber-200 bg-amber-50/40 dark:border-amber-900 dark:bg-amber-950/20',
              text:'Executes immediately, relying on the client’s own native confirmation dialog and the MCP safety annotations.',
              when:'The MCP client is trusted and its confirmation policy is known to be enabled.' },
        ]
        const flow = [
            'A write is called without a token - the server returns requires_confirmation with a summary, the proposed arguments and a signed token.',
            'The assistant presents that summary to the user in its own chat.',
            'On approval it re-invokes api_call with the same arguments plus the confirmationToken.',
            'The server validates the token cryptographically, then executes once.',
        ]
        return { modes, flow }
    }
}

/** What to set before exposing this in production */
const McpProduction = {
    template: `
    <section class="not-prose my-10 grid gap-4 lg:grid-cols-2">
      <div v-for="item in items" :key="item.name"
           class="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm dark:border-amber-900 dark:bg-amber-950/20">
        <div class="flex items-center gap-2.5">
          <span class="text-lg">{{item.icon}}</span>
          <code class="font-bold text-slate-900 dark:text-white">{{item.name}}</code>
        </div>
        <p class="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{{item.text}}</p>
        <p class="mt-3 border-t border-amber-200/60 pt-2.5 text-xs leading-5 text-slate-600 dark:border-amber-900/60 dark:text-slate-300">
          <b class="text-slate-900 dark:text-white">Without it:</b> {{item.without}}
        </p>
      </div>
    </section>`,
    setup() {
        const items = [
            { icon:'🔏', name:'SigningSecret', text:'A shared value of at least 32 bytes, or HostConfig.AdminAuthSecret.',
              without:'An ephemeral per-process secret is generated - tokens don’t survive a restart and are rejected across load-balanced instances.' },
            { icon:'🗄', name:'Distributed ICacheClient', text:'Redis, OrmLiteCacheClient or any shared cache, for single-use replay protection.',
              without:'An in-process set is used, which degrades silently in a farm - the same token could be replayed on another instance.' },
        ]
        return { items }
    }
}

export default {
    components: {
        Screenshot,
        ScreenshotsGallery,
        ScreenshotsGalleryView,
        McpExposure,
        McpIdentity,
        ApprovalModes,
        McpProduction,
    }
}
