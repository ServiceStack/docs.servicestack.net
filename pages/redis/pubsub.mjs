/** RedisPubSubServer as a managed background service */
const PubSubServerLifecycle = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">The engine behind Redis MQ and Server Events</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">A subscriber that looks after itself</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        <code class="rounded bg-slate-100 px-1 dark:bg-slate-800">RedisPubSubServer</code> processes messages on a managed background thread that
        <b class="text-slate-900 dark:text-white">automatically reconnects</b> when the connection to redis-server fails, and can be stopped and started on command.
      </p>

      <div class="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="f in features" :key="f.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="text-lg" aria-hidden="true">{{f.icon}}</span>
          <div class="mt-2 font-bold text-slate-900 dark:text-white">{{f.name}}</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{f.text}}</p>
        </div>
      </div>

      <div class="mt-7">
        <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Hooks fired over the server’s lifetime</div>
        <div class="mt-2 grid gap-2 sm:grid-cols-2">
          <div v-for="h in hooks" :key="h.name"
               class="flex flex-col gap-1 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700 sm:flex-row sm:items-baseline sm:gap-3">
            <code class="min-w-0 shrink-0 whitespace-pre-wrap break-words text-xs font-bold text-red-700 dark:text-red-300">{{h.name}}</code>
            <span class="min-w-0 text-sm leading-6 text-slate-600 dark:text-slate-300">{{h.text}}</span>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const features = [
            { icon:'🧵', name:'Managed thread', text:'Messages are processed on its own background thread, independent of your request pipeline.' },
            { icon:'🔁', name:'Auto-reconnect', text:'A broken redis-server connection is re-established without any handling on your part.' },
            { icon:'🎚', name:'Start / Stop', text:'Behaves like an independent background service you control at runtime.' },
            { icon:'📻', name:'Any channels', text:'Subscribe to the specific Redis Pub/Sub channels your app publishes to.' },
        ]
        const hooks = [
            { name:'OnInit', text:'Runs once on initial start-up.' },
            { name:'OnStart', text:'Called each time a new connection is started.' },
            { name:'OnStop', text:'Called when the connection is broken or stopped.' },
            { name:'OnMessage', text:'Invoked for every message published to a subscribed channel.' },
            { name:'OnError', text:'Receives exceptions raised while listening.' },
            { name:'OnFailover', text:'Called before attempting to failover to a new redis master.' },
        ]
        return { features, hooks }
    }
}

export default {
    components: { PubSubServerLifecycle }
}
