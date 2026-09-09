/** RedisStats counters, grouped by what they tell you */
const StatsGroups = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">RedisStats</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Introspection into a running instance</h3>
        <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Every counter below is a static property you can read at any time - and they’re surfaced on the
          <a class="font-bold text-red-700 hover:underline dark:text-red-300" href="/admin-ui-redis#redis-stats-on-dashboard">Admin UI Dashboard</a> for you.
        </p>
      </div>

      <div class="grid gap-4 lg:grid-cols-3">
        <div v-for="g in groups" :key="g.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-center gap-2">
            <span class="text-lg" aria-hidden="true">{{g.icon}}</span>
            <span class="font-bold text-slate-900 dark:text-white">{{g.name}}</span>
          </div>
          <p class="mt-1.5 text-sm leading-6 text-slate-500 dark:text-slate-400">{{g.caption}}</p>
          <div class="mt-4 space-y-2">
            <div v-for="s in g.stats" :key="s.name">
              <code class="block whitespace-pre-wrap break-words text-xs font-bold text-red-700 dark:text-red-300">{{s.name}}</code>
              <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const groups = [
            { icon:'📈', name:'Throughput & pool', caption:'Is the pool the right size?',
              stats:[
                { name:'TotalCommandsSent', text:'Total number of commands sent.' },
                { name:'TotalClientsCreated', text:'Redis Client instances created with RedisConfig.ClientFactory.' },
                { name:'TotalClientsCreatedOutsidePool', text:'Clients created outside the pool, from overflow or an overridden reserved slot - a persistently rising count suggests a bigger pool.' },
                { name:'TotalDeactivatedClients', text:'Clients deactivated from the pool by a failover or client exception.' },
                { name:'TotalPendingDeactivatedClients', text:'Deactivated clients still pending disposal.' },
              ] },
            { icon:'🔀', name:'Failover & Sentinel', caption:'Is your HA setup healthy?',
              stats:[
                { name:'TotalFailovers', text:'Times the client managers have FailoverTo(), by sentinel or manually.' },
                { name:'TotalFailedSentinelWorkers', text:'Times connecting to a Sentinel has failed.' },
                { name:'TotalForcedMasterFailovers', text:'Times Sentinel was forced to failover due to consecutive errors.' },
                { name:'TotalInvalidMasters', text:'Times a reported Master turned out not to be a Master.' },
                { name:'TotalNoMastersFound', text:'Times no Master could be found in any configured host.' },
                { name:'TotalSubjectiveServersDown / TotalObjectiveServersDown', text:'Sentinel sdown and odown reports.' },
              ] },
            { icon:'🔁', name:'Retries', caption:'How often is the network flaky?',
              stats:[
                { name:'TotalRetryCount', text:'Requests retried after a socket or retryable exception.' },
                { name:'TotalRetrySuccess', text:'Requests that succeeded after being retried - the reason most blips never reach your users.' },
                { name:'TotalRetryTimedout', text:'Requests that still failed after exceeding RetryTimeout.' },
              ] },
        ]
        return { groups }
    }
}

export default {
    components: { StatsGroups }
}
