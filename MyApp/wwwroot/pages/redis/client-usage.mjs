/** Redis data structures, mapped to the .NET collections they behave like */
const DataStructureTour = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Server-side data structures</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Collections you already know, stored in Redis</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          The typed client exposes each Redis structure as a familiar .NET collection interface, so working with a distributed
          list reads the same as working with a local one.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div v-for="s in structures" :key="s.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span class="min-w-0 font-bold text-slate-900 dark:text-white">{{s.name}}</span>
            <code v-if="s.dotnet" class="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">{{s.dotnet}}</code>
          </div>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
          <code class="mt-3 whitespace-pre-wrap break-words rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{s.api}}</code>
        </div>
      </div>
    </section>`,
    setup() {
        const structures = [
            { name:'Lists', dotnet:'IList<T>', api:'redis.Lists["urn:shippers:current"]',
              text:'Ordered, duplicates allowed. Add, Remove and index into it as you would any list - each call is an atomic server operation.' },
            { name:'Sets', dotnet:'ICollection<T>', api:'redis.Sets["urn:tags"]',
              text:'Unordered and unique, with server-side union, intersect and difference between sets.' },
            { name:'Sorted Sets', dotnet:'', api:'redis.SortedSets["urn:leaderboard"]',
              text:'Unique members ordered by a score - the structure behind leaderboards, time-ordered feeds and lexical range queries.' },
            { name:'Hashes', dotnet:'', api:'redis.Hashes["urn:user:1"]',
              text:'A dictionary stored under one key, so you can read or write a single field without fetching the whole object.' },
        ]
        return { structures }
    }
}

/** The specialised APIs that aren't a plain collection */
const AdvancedApis = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Beyond get and set</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Specialised APIs worth knowing</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="a in apis" :key="a.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="text-lg" aria-hidden="true">{{a.icon}}</span>
          <div class="mt-2 font-bold text-slate-900 dark:text-white">{{a.name}}</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{a.text}}</p>
          <code class="mt-3 whitespace-pre-wrap break-words rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{a.api}}</code>
        </div>
      </div>
      <p class="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-amber-900 dark:bg-amber-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Prefer SCAN over KEYS in application code.</b> SCAN traverses the keyspace in
        manageable chunks using only a client-side cursor, without blocking the server or introducing any server state.
      </p>
    </section>`,
    setup() {
        const apis = [
            { icon:'🔤', name:'Lex operations', api:'ZRangeByLex / ZLexCount',
              text:'Query a sorted set lexically - the technique behind fast autocomplete over a large term list.' },
            { icon:'🧮', name:'HyperLog', api:'AddToHyperLog / CountHyperLog',
              text:'Approximate the count of unique elements in a set, and merge sets, without storing the elements themselves.' },
            { icon:'🔎', name:'Scan APIs', api:'ScanAllKeys / ScanAllSetItems',
              text:'Cursor-based traversal of keys, set members, sorted set members and hash fields, returned as a lazy IEnumerable.' },
            { icon:'🌍', name:'GEO', api:'AddGeoMember / FindGeoResultsInRadius',
              text:'Store coordinates and query members within a radius, built on Redis geospatial indexes.' },
            { icon:'📦', name:'Bulk store', api:'redis.StoreAll(items)',
              text:'Store an entire collection in one round trip - the whole 3,202-record Northwind dataset lands in about a second.' },
            { icon:'🔢', name:'Sequences', api:'redis.GetNextSequence()',
              text:'Atomic, server-side id generation for the POCOs you store with the typed client.' },
        ]
        return { apis }
    }
}

export default {
    components: { DataStructureTour, AdvancedApis }
}
