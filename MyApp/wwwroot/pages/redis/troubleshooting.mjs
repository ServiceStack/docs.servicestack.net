/** The one mistake behind most corrupted-data reports */
const SharedClientPitfall = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Almost always the same cause</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Corrupted data means a shared client</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        A <code class="rounded bg-slate-100 px-1 dark:bg-slate-800">RedisClient</code> owns a single connection and is not thread-safe.
        Share one across threads and replies get interleaved - which surfaces later as garbled values or a runtime exception far from the real cause.
      </p>

      <div class="mt-7 grid gap-4 lg:grid-cols-2">
        <div v-for="c in cases" :key="c.title"
             :class="['min-w-0 rounded-2xl border p-5 shadow-sm', c.bad ? 'border-red-300/70 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20' : 'border-emerald-300/60 bg-emerald-50/40 dark:border-emerald-800 dark:bg-emerald-950/20']">
          <div class="flex items-center gap-2">
            <span aria-hidden="true">{{c.bad ? '❌' : '✅'}}</span>
            <span class="font-bold text-slate-900 dark:text-white">{{c.title}}</span>
          </div>
          <div class="mt-3 whitespace-pre-wrap break-words rounded-lg bg-slate-900 p-3 font-mono text-[11px] leading-5 text-slate-200 dark:bg-black/50">{{c.code}}</div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{c.text}}</p>
        </div>
      </div>
    </section>`,
    setup() {
        const cases = [
            { bad:true, title:'A shared or static client',
              code:'// singleton / static field\npublic static IRedisClient Redis = …;',
              text:'Every thread writes to the same connection. Nothing fails immediately - it fails later, somewhere unrelated.' },
            { bad:false, title:'A client per usage, from the manager',
              code:'using var redis = redisManager.GetClient();\n//…',
              text:'Keep a singleton of the IRedisClientsManager factory only, and resolve a client inside a using block each time you need one.' },
        ]
        return { cases }
    }
}

/** The rules that keep a client single-threaded */
const DiagnosisChecklist = {
    template: `
    <section class="not-prose my-6">
      <div class="grid gap-2 sm:grid-cols-2">
        <div v-for="r in rules" :key="r"
             class="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <span class="shrink-0 text-sm" aria-hidden="true">✓</span>
          <span class="min-w-0 text-sm leading-6 text-slate-600 dark:text-slate-300">{{r}}</span>
        </div>
      </div>
    </section>`,
    setup() {
        const rules = [
            'Use an IRedisClient instance inside a using statement.',
            'Never use a client instance after it has been disposed.',
            'Never use or return a server collection or resource (Redis.Lists, a lock) after the client has been disposed.',
            'Never keep a singleton or static redis client - only the IRedisClientsManager factory.',
            'Never use the same client in multiple threads; have each thread resolve its own from the factory.',
        ]
        return { rules }
    }
}

export default {
    components: { SharedClientPitfall, DiagnosisChecklist }
}
