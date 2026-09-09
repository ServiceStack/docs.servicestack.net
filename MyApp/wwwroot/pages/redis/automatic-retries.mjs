/** What happens to a request when the socket blips */
const RetryTimeline = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">On by default</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Transient failures retried with exponential backoff</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        Socket and I/O exceptions are retried transparently, so a brief network blip or a Sentinel failover mid-request
        usually never reaches your code.
      </p>

      <div class="mt-7 grid gap-3 sm:grid-cols-3">
        <div v-for="s in settings" :key="s.name"
             class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-3xl font-black text-red-600 dark:text-red-400">{{s.value}}</div>
          <div class="mt-1 font-bold text-slate-900 dark:text-white">{{s.name}}</div>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
          <code class="mt-3 whitespace-pre-wrap break-words rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{s.setting}}</code>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
        The retry timeout can also be set per connection with <code class="font-bold">?RetryTimeout=10000</code> on the connection string,
        and every retry is counted in <a class="font-bold text-red-700 hover:underline dark:text-red-300" href="/redis/stats">RedisStats</a>.
      </p>
    </section>`,
    setup() {
        const settings = [
            { value:'10ms', name:'First retry', text:'The backoff starts here and grows exponentially with each attempt.', setting:'RedisConfig.BackOffMultiplier = 10;' },
            { value:'10s', name:'Retry timeout', text:'Retries stop once this budget is exhausted and the exception surfaces.', setting:'RedisConfig.DefaultRetryTimeout = 10000;' },
            { value:'0', name:'Code changes', text:'Nothing to enable and no wrapper to write - it applies to every RedisClient operation.', setting:'?RetryTimeout=10000' },
        ]
        return { settings }
    }
}

export default {
    components: { RetryTimeline }
}
