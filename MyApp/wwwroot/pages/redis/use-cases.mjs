/** Application problems mapped to the Redis structure that solves them */
const UseCaseMap = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Problem → structure → recipe</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">What do you need to do?</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <a v-for="u in cases" :key="u.name" :href="u.href"
           class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-red-700">
          <div class="flex items-start gap-3">
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-lg dark:bg-red-950/50" aria-hidden="true">{{u.icon}}</span>
            <div class="min-w-0">
              <div class="font-bold text-slate-900 group-hover:text-red-700 dark:text-white dark:group-hover:text-red-300">{{u.name}}</div>
              <div class="mt-0.5 text-[11px] font-black uppercase tracking-[.14em] text-slate-400 dark:text-slate-500">{{u.structure}}</div>
            </div>
          </div>
          <p class="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{u.text}}</p>
          <span class="mt-3 text-xs font-bold text-red-600 group-hover:underline dark:text-red-400">{{u.link}} →</span>
        </a>
      </div>
    </section>`,
    setup() {
        const cases = [
            { icon:'⚡', name:'Cache expensive results', structure:'String · Set', href:'/redis/caching-patterns', link:'Caching Patterns',
              text:'Cache-aside with expiry, stampede protection, tag and namespace invalidation.' },
            { icon:'🚦', name:'Limit request rates', structure:'String · Sorted Set · Hash', href:'/redis/rate-limiting', link:'Rate Limiting',
              text:'Fixed window, sliding window and token bucket limits shared across every server.' },
            { icon:'🏆', name:'Rank and sort', structure:'Sorted Set', href:'/redis/leaderboards', link:'Leaderboards',
              text:'Top-N, a player’s rank, neighbours, score ranges and period boards.' },
            { icon:'📬', name:'Process work in the background', structure:'List · Sorted Set · Stream', href:'/redis/queues', link:'Queues',
              text:'Reliable, delayed and priority queues, and when to use Streams or Redis MQ.' },
            { icon:'📈', name:'Count and measure', structure:'String · Hash · HyperLogLog · Bitmap', href:'/redis/analytics', link:'Counters & Analytics',
              text:'Atomic counters, time buckets, unique visitors and daily active users.' },
            { icon:'📍', name:'Find what’s nearby', structure:'GEO', href:'/redis/geo', link:'Geospatial',
              text:'Store locators, live driver positions and geofences.' },
            { icon:'🔒', name:'Coordinate servers', structure:'String (SET NX)', href:'/redis/distributed-locking', link:'Distributed Locking',
              text:'Make sure a job or critical section runs on one server at a time.' },
            { icon:'🟢', name:'Track presence', structure:'Hash + field expiry', href:'/redis/hash-field-expiration#presence-with-per-field-expiry', link:'Hash Field Expiration',
              text:'Who’s online, with each member expiring independently.' },
            { icon:'📣', name:'Broadcast events', structure:'Pub/Sub · Stream', href:'/redis/pubsub', link:'Pub/Sub',
              text:'Notify every server instantly, or keep a durable log for consumer groups.' },
        ]
        return { cases }
    }
}

/** The core structures, by how they're read */
const DataStructureGuide = {
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div class="divide-y divide-slate-100 dark:divide-slate-800">
        <div v-for="d in structures" :key="d.name" class="grid gap-2 p-4 sm:grid-cols-[9rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-5 sm:p-5">
          <div>
            <div class="font-bold text-slate-900 dark:text-white">{{d.name}}</div>
            <div class="text-[11px] font-bold text-slate-400 dark:text-slate-500">{{d.shape}}</div>
          </div>
          <div class="text-sm leading-6 text-slate-600 dark:text-slate-300"><span class="font-bold text-slate-900 dark:text-white">Read it when</span> {{d.when}}</div>
          <div class="flex flex-wrap content-start gap-1.5">
            <code v-for="a in d.apis" :key="a" class="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-red-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-red-300 dark:ring-slate-700">{{a}}</code>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const structures = [
            { name:'String', shape:'key → value', when:'you need one value, a counter, or a lock.',
              apis:['SetValue','GetValue','IncrementValue','SetValueIfNotExists'] },
            { name:'Hash', shape:'key → field → value', when:'you read or update the fields of one object, or many counters together.',
              apis:['SetEntryInHash','GetAllEntriesFromHash','IncrementValueInHash'] },
            { name:'List', shape:'ordered, by insertion', when:'you take items from one end: queues and recent-item feeds.',
              apis:['EnqueueItemOnList','BlockingDequeueItemFromList','GetRangeFromList'] },
            { name:'Set', shape:'unique members', when:'you ask "is it a member?" or combine groups with union and intersection.',
              apis:['AddItemToSet','SetContainsItem','GetIntersectFromSets'] },
            { name:'Sorted Set', shape:'unique members, by score', when:'you read in order of a score: rankings, time windows, schedules.',
              apis:['AddItemToSortedSet','GetRangeWithScoresFromSortedSetDesc','GetItemIndexInSortedSetDesc'] },
            { name:'Stream', shape:'append-only log', when:'several consumers need every event, with acknowledgment and history.',
              apis:['AddStreamEntry','ReadStreamGroupEntries','XAck'] },
            { name:'HyperLogLog', shape:'~12 KB estimate', when:'you only need to know how many unique items there were.',
              apis:['AddToHyperLog','CountHyperLog','MergeHyperLogs'] },
            { name:'Bitmap', shape:'one bit per integer', when:'you track a yes/no flag for each of many integer IDs.',
              apis:['SetBit','GetBit','BITCOUNT'] },
            { name:'GEO', shape:'members by location', when:'you ask what’s within a distance of a point.',
              apis:['AddGeoMember','FindGeoResultsInRadius','CalculateDistanceBetweenGeoMembers'] },
        ]
        return { structures }
    }
}

export default {
    components: { UseCaseMap, DataStructureGuide }
}
