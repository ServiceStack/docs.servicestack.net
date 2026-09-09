/** The URI connection string, taken apart */
const ConnectionAnatomy = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">One string, most of the config</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Anatomy of a Redis connection string</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        Every part is optional. A bare <code class="rounded bg-slate-100 px-1 dark:bg-slate-800">localhost</code> is a valid connection string -
        add only the pieces you need.
      </p>

      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="p in parts" :key="p.token"
             class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <code class="block whitespace-pre-wrap break-words text-xs font-bold text-red-700 dark:text-red-300">{{p.token}}</code>
          <div class="mt-1.5 text-sm font-bold text-slate-900 dark:text-white">{{p.name}}</div>
          <p class="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{{p.text}}</p>
        </div>
      </div>

      <div class="mt-6">
        <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Growing from simplest to fully-qualified</div>
        <div class="mt-2 space-y-1.5">
          <div v-for="e in examples" :key="e.value"
               class="flex flex-col gap-1 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <code class="min-w-0 whitespace-pre-wrap break-words text-xs font-bold text-slate-900 dark:text-white">{{e.value}}</code>
            <span class="shrink-0 text-[11px] text-slate-500 dark:text-slate-400">{{e.note}}</span>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const parts = [
            { token:'redis://', name:'Scheme', text:'Optional. Included for readability when the rest of the URI is qualified.' },
            { token:'clientid:password@', name:'Credentials', text:'A client alias and password. With Redis ACLs pass the username on the QueryString instead.' },
            { token:'localhost:6380', name:'Host and port', text:'The only required part. Port defaults to 6379 when omitted.' },
            { token:'?ssl=true', name:'SSL', text:'Connect over TLS - the primary use-case for Azure Redis Cache.' },
            { token:'?db=1', name:'Database', text:'The Redis DB this connection is switched to on connect.' },
            { token:'?connectTimeout=..', name:'Timeouts', text:'Connect, Send, Receive and IdleTimeOutSecs are all settable here.' },
        ]
        const examples = [
            { value:'localhost', note:'hostname only' },
            { value:'127.0.0.1:6379', note:'IP address and port' },
            { value:'password@localhost:6379', note:'with a password' },
            { value:'redis://clientid:password@localhost:6380?ssl=true&db=1', note:'fully qualified' },
        ]
        return { parts, examples }
    }
}

/** Choosing between the three client managers */
const ManagerPicker = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Register one as a singleton</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Which client manager?</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          All three are thread-safe connection factories implementing <code class="rounded bg-slate-100 px-1 dark:bg-slate-800">IRedisClientsManager</code>,
          so switching between them is a one-line change.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <div v-for="m in managers" :key="m.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', m.featured ? 'border-red-300/70 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900']">
          <div class="flex flex-wrap items-center gap-2">
            <code class="min-w-0 whitespace-pre-wrap break-words font-bold text-slate-900 dark:text-white">{{m.name}}</code>
            <span v-if="m.featured" class="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">Recommended</span>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{m.text}}</p>
          <div class="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
            <div class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">At max pool size</div>
            <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{m.behavior}}</p>
          </div>
          <div class="mt-3">
            <div class="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">Use it when</div>
            <p class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{m.when}}</p>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const managers = [
            { name:'RedisManagerPool', featured:true,
              text:'The streamlined pool configured entirely from the connection string - no options on the manager itself and no separate readonly hosts.',
              behavior:'Extra connections are created and disposed outside the pool, so a request never blocks waiting for a free client.',
              when:'The common case: a single Redis instance and a simpler configuration.' },
            { name:'PooledRedisClientManager', featured:false,
              text:'The configurable pool, which also accepts separate read/write (master) and readonly (replica) hosts.',
              behavior:'Blocks new requests until a client is released. If none frees up within PoolTimeout a TimeoutException is thrown.',
              when:'You need master/replica splitting, or want to set options like ConnectTimeout on the manager.' },
            { name:'BasicRedisClientManager', featured:false,
              text:'No pooling at all - each GetClient() opens a new connection and disposing it closes the connection.',
              behavior:'There is no pool, so nothing to exhaust - at the cost of a TCP connection per use.',
              when:'You don’t want connection pooling at all, e.g. accessing a local redis-server instance.' },
        ]
        return { managers }
    }
}

export default {
    components: { ConnectionAnatomy, ManagerPicker }
}
