/** The three ways to run a script, and why ExecCachedLua wins */
const LuaStrategies = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Three ways to run a script</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Bandwidth vs. brittleness</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        Sending the whole script every call is wasteful; pre-loading it and calling by SHA1 is efficient until the server is flushed.
        <code class="rounded bg-slate-100 px-1 dark:bg-slate-800">ExecCachedLua</code> gives you both.
      </p>

      <div class="mt-7 grid gap-4 lg:grid-cols-3">
        <div v-for="s in strategies" :key="s.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', s.featured ? 'border-red-300/70 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900']">
          <div class="flex flex-wrap items-center gap-2">
            <code class="min-w-0 whitespace-pre-wrap break-words font-bold text-slate-900 dark:text-white">{{s.name}}</code>
            <span v-if="s.featured" class="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">Best of both</span>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
          <div class="mt-4 space-y-1.5">
            <div v-for="t in s.traits" :key="t.label" class="flex items-start gap-2">
              <span class="shrink-0 text-xs" aria-hidden="true">{{t.ok ? '✅' : '⚠️'}}</span>
              <span class="min-w-0 text-sm leading-6 text-slate-600 dark:text-slate-300">{{t.label}}</span>
            </div>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const strategies = [
            { name:'ExecLua(body, …)', featured:false,
              text:'Sends the full script body on every call, where redis parses and executes it.',
              traits:[{ok:true,label:'Always works, no pre-existing state'},{ok:false,label:'Sends and re-parses the whole script each call'}] },
            { name:'ExecLuaSha(sha1, …)', featured:false,
              text:'Executes a script already loaded into Redis, referenced only by its SHA1 hash.',
              traits:[{ok:true,label:'Minimal bandwidth and CPU'},{ok:false,label:'A flushed server breaks the app with a NOSCRIPT error'}] },
            { name:'ExecCachedLua(body, sha1 => …)', featured:true,
              text:'Executes by SHA1, and if the script no longer exists it re-creates it and retries transparently.',
              traits:[{ok:true,label:'Minimal bandwidth and CPU'},{ok:true,label:'Self-heals after a ScriptFlush or server restart'},{ok:true,label:'No start-up registration step to maintain'}] },
        ]
        return { strategies }
    }
}

/** What ExecCachedLua does on each call */
const CachedLuaFlow = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Self-healing execution</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">The same call, three different server states</h3>
      </div>
      <div class="grid gap-3 lg:grid-cols-3">
        <div v-for="(c,i) in calls" :key="c.state"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500 dark:bg-slate-800 dark:text-slate-400">{{i+1}}</span>
          <div class="mt-3 font-bold text-slate-900 dark:text-white">{{c.state}}</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{c.text}}</p>
          <span class="mt-3 self-start rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{{c.result}}</span>
        </div>
      </div>
    </section>`,
    setup() {
        const calls = [
            { state:'First call', text:'The script isn’t loaded yet, so it is sent, compiled and its SHA1 hash cached in the Redis Client.', result:'Executes' },
            { state:'Subsequent calls', text:'Only the cached SHA1 hash goes over the wire - no script body, no re-parsing.', result:'Executes' },
            { state:'After a ScriptFlush', text:'The SHA1 call returns a NOSCRIPT error, so the script is re-created and re-executed automatically.', result:'Executes' },
        ]
        return { calls }
    }
}

export default {
    components: { LuaStrategies, CachedLuaFlow }
}
