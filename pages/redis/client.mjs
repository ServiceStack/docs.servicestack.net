/** The IRedisClient surface, grouped so it can be skimmed */
const ClientApiMap = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">IRedisClient : IEntityStore, ICacheClient</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">What’s on the string client</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          The full interface is listed below - this is a map of it, so you know which section to jump to.
          Use this API when you want values as strings, or want control over your own text serialization format.
        </p>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="g in groups" :key="g.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="text-lg" aria-hidden="true">{{g.icon}}</span>
          <div class="mt-2 font-bold text-slate-900 dark:text-white">{{g.name}}</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{g.text}}</p>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <code v-for="m in g.members" :key="m"
                  class="whitespace-pre-wrap break-words rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{m}}</code>
          </div>
        </div>
      </div>

      <p class="mt-4 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-red-900 dark:bg-red-950/25 dark:text-slate-200">
        Because it implements <code class="font-bold">ICacheClient</code>, code written against it can also run on the
        In-Memory or Memcached providers - and <code class="font-bold">redis.As&lt;T&gt;()</code> hands you the
        <a class="font-bold text-red-700 hover:underline dark:text-red-300" href="/redis/typed-client">typed client</a> whenever you’d rather work in POCOs.
      </p>
    </section>`,
    setup() {
        const groups = [
            { icon:'🔌', name:'Connection', text:'Selecting a database, inspecting the server and controlling persistence.',
              members:['Db','DbSize','Info','LastSave','Save()','Shutdown()'] },
            { icon:'🔑', name:'Keys & values', text:'The string get/set surface, plus expiry, existence and key management.',
              members:['GetValue','SetEntry','IncrementValue','ExpireEntryIn','GetValuesMap','GetAllKeys'] },
            { icon:'🧱', name:'Collections', text:'Lists, Sets, Sorted Sets and Hashes, including queue and stack operations.',
              members:['Lists','Sets','SortedSets','Hashes','EnqueueItemOnList','PopItemFromList'] },
            { icon:'🧾', name:'POCOs as hashes', text:'Store an object as a Redis hash so individual fields can be read and written.',
              members:['StoreAsHash','GetFromHash<T>'] },
            { icon:'🔎', name:'Scan & HyperLog', text:'Cursor-based keyspace traversal and approximate unique counts.',
              members:['ScanAllKeys','ScanAllHashEntries','AddToHyperLog','CountHyperLog'] },
            { icon:'⚛️', name:'Atomicity', text:'Transactions, pipelines, distributed locks and server-side LUA.',
              members:['CreateTransaction()','CreatePipeline()','AcquireLock','ExecCachedLua'] },
        ]
        return { groups }
    }
}

export default {
    components: { ClientApiMap }
}
