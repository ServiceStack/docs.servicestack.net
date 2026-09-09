/** Sync and async side by side, from registration to resolution */
const AsyncPairs = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">One registration, both APIs</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Every sync API has an async twin</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        All client managers implement both <code class="rounded bg-slate-100 px-1 dark:bg-slate-800">IRedisClientsManager</code> and
        <code class="rounded bg-slate-100 px-1 dark:bg-slate-800">IRedisClientsManagerAsync</code>, so your existing IOC registration keeps working.
      </p>

      <div class="mt-7 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
        <div class="grid grid-cols-1 gap-px bg-slate-200 sm:grid-cols-3 dark:bg-slate-700">
          <div class="bg-slate-50 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">Where</div>
          <div class="hidden bg-slate-50 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-slate-500 sm:block dark:bg-slate-800 dark:text-slate-400">Sync</div>
          <div class="hidden bg-slate-50 px-4 py-2 text-[11px] font-black uppercase tracking-wider text-red-600 sm:block dark:bg-slate-800 dark:text-red-400">Async</div>
          <template v-for="p in pairs" :key="p.where">
            <div class="bg-white px-4 py-3 text-sm font-bold text-slate-900 dark:bg-slate-900 dark:text-white">{{p.where}}</div>
            <div class="bg-white px-4 py-3 dark:bg-slate-900">
              <code class="whitespace-pre-wrap break-words text-xs text-slate-600 dark:text-slate-300">{{p.sync}}</code>
            </div>
            <div class="bg-white px-4 py-3 dark:bg-slate-900">
              <code class="whitespace-pre-wrap break-words text-xs font-bold text-red-700 dark:text-red-300">{{p.async}}</code>
            </div>
          </template>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-red-900 dark:bg-red-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Want async only?</b> Register just
        <code>IRedisClientsManagerAsync</code> and the container will only hand out async
        <code>IRedisClientAsync</code> and <code>ICacheClientAsync</code> clients - a compile-time guarantee that nothing blocks.
      </p>
    </section>`,
    setup() {
        const pairs = [
            { where:'Resolve a client', sync:'manager.GetClient()', async:'await manager.GetClientAsync()' },
            { where:'Dispose', sync:'using var redis = …', async:'await using var redis = …' },
            { where:'In a Service', sync:'base.Redis', async:'await base.GetRedisAsync()' },
            { where:'A command', sync:'redis.Increment(key, 1)', async:'await redis.IncrementAsync(key, 1)' },
            { where:'Caching', sync:'ICacheClient', async:'ICacheClientAsync' },
        ]
        return { pairs }
    }
}

export default {
    components: { AsyncPairs }
}
