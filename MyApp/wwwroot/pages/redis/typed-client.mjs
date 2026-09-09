/** What redis.As<T>() gives you */
const TypedClientMap = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">redis.As&lt;T&gt;()</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">One call turns the client into a typed one</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        Every value operation on the returned client applies to your POCO instead of a string - serialized with ServiceStack.Text
        on the way out and deserialized on the way back.
      </p>

      <div class="mt-7 grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div class="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">The string client</div>
          <div class="mt-2 whitespace-pre-wrap break-words rounded-lg bg-slate-900 p-3 font-mono text-[11px] leading-5 text-slate-200 dark:bg-black/50">using var redisClient = new RedisClient();</div>
        </div>
        <div class="flex flex-col items-center justify-center gap-1.5 text-center">
          <span class="text-2xl text-red-400" aria-hidden="true"><span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span></span>
          <code class="text-[11px] font-black uppercase tracking-wider text-red-600 dark:text-red-400">.As&lt;Shipper&gt;()</code>
        </div>
        <div class="min-w-0 rounded-2xl border-2 border-red-300/60 bg-red-50/40 p-5 shadow-sm dark:border-red-800 dark:bg-red-950/20">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">A typed client</div>
          <div class="mt-2 whitespace-pre-wrap break-words rounded-lg bg-slate-900 p-3 font-mono text-[11px] leading-5 text-slate-200 dark:bg-black/50">IRedisTypedClient&lt;Shipper&gt; redis =
    redisClient.As&lt;Shipper&gt;();</div>
        </div>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="m in members" :key="m.name"
             class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <code class="block whitespace-pre-wrap break-words text-xs font-bold text-red-700 dark:text-red-300">{{m.name}}</code>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{m.text}}</p>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        It also implements <code class="font-bold">IBasicPersistenceProvider&lt;T&gt;</code>, a common data access interface with
        <code>GetById</code>, <code>Store</code> and <code>Delete</code> - so simple persistence code can be written against Redis,
        an RDBMS or an in-memory provider interchangeably.
      </p>
    </section>`,
    setup() {
        const members = [
            { name:'Lists', text:'IRedisList<T> keyed by name - an IList<T> whose items are your POCOs.' },
            { name:'Sets', text:'IRedisSet<T> keyed by name - unique members with server-side set operations.' },
            { name:'SortedSets', text:'IRedisSortedSet<T> - members ordered by score.' },
            { name:'GetHash<TKey>(id)', text:'IRedisHash<TKey,T> - a typed dictionary stored under a single key.' },
            { name:'CreateTransaction()', text:'A typed transaction that queues IRedisTypedClient<T> operations to commit atomically.' },
            { name:'AcquireLock()', text:'The same distributed lock API, scoped to this type.' },
            { name:'GetNextSequence()', text:'Atomic server-side id generation for new entities.' },
        ]
        return { members }
    }
}

export default {
    components: { TypedClientMap }
}
