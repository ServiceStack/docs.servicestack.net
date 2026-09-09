/** The typed transaction sits on the typed client, but behaves identically */
const TypedTransactionMap = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Same semantics, typed operations</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Transactions over POCOs</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        A typed transaction is created from the typed client rather than the string client. Everything else - queueing,
        committing, discarding on dispose - works exactly as it does for <a class="font-bold text-red-700 hover:underline dark:text-red-300" href="/redis/transactions">string transactions</a>.
      </p>

      <div class="mt-7 grid gap-4 lg:grid-cols-2">
        <div v-for="c in comparison" :key="c.title"
             :class="['min-w-0 rounded-2xl border p-5 shadow-sm', c.featured ? 'border-red-300/60 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900']">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">{{c.title}}</div>
          <div class="mt-2 whitespace-pre-wrap break-words rounded-lg bg-slate-900 p-3 font-mono text-[11px] leading-5 text-slate-200 dark:bg-black/50">{{c.code}}</div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{c.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const comparison = [
            { title:'String transaction', featured:false,
              code:'using var trans = redis.CreateTransaction();\ntrans.QueueCommand(r => r.Increment("key"));\ntrans.Commit();',
              text:'Queued operations are IRedisClient calls working on string values.' },
            { title:'Typed transaction', featured:true,
              code:'var redisTyped = redis.As<Shipper>();\nusing var trans = redisTyped.CreateTransaction();\ntrans.QueueCommand(r => r.Store(shipper));\ntrans.Commit();',
              text:'Queued operations are IRedisTypedClient<T> calls, so values are serialized POCOs and results come back typed.' },
        ]
        return { comparison }
    }
}

export default {
    components: { TypedTransactionMap }
}
