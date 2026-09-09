/** The lifecycle of a lock across several app servers */
const LockLifecycle = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Built on SETNX + IDisposable</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">One winner, everyone else backs off</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        Because the check-and-set happens in a single atomic server operation, exactly one client can hold the lock at a time -
        across every thread and every app server pointing at the same Redis instance.
      </p>

      <div class="mt-7 grid gap-3 lg:grid-cols-3">
        <div v-for="(s,i) in stages" :key="s.name"
             :class="['flex flex-col rounded-2xl border p-5 shadow-sm', s.tint]">
          <div class="flex items-center gap-2">
            <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white/70 text-xs font-black text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700">{{i+1}}</span>
            <span class="font-bold text-slate-900 dark:text-white">{{s.name}}</span>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
          <code v-if="s.code" class="mt-3 whitespace-pre-wrap break-words rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-bold text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:ring-slate-700">{{s.code}}</code>
        </div>
      </div>

      <div class="mt-6 grid gap-3 sm:grid-cols-2">
        <div v-for="o in overloads" :key="o.sig"
             class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <code class="block whitespace-pre-wrap break-words text-xs font-bold text-red-700 dark:text-red-300">{{o.sig}}</code>
          <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{o.text}}</p>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-amber-900 dark:bg-amber-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Zombie locks.</b> A crashed client, power cut or network failure can leave a lock nobody releases.
        Supply a <code>TimeOut</code>, or clear stale locks on server restart, so waiters can’t deadlock indefinitely.
      </p>
    </section>`,
    setup() {
        const stages = [
            { name:'Acquire', tint:'border-red-300/60 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20',
              text:'One client wins the atomic SETNX and enters the using block. Everything inside it is guaranteed to run alone.',
              code:'using (redis.AcquireLock("key"))' },
            { name:'Back off', tint:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Losers enter an exponential retry back-off, retrying at random intervals until the lock frees up - barely noticeable load on the server.',
              code:'' },
            { name:'Release', tint:'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900',
              text:'Leaving the using block disposes the lock, and the next waiting client wins it on its next retry.',
              code:'' },
        ]
        const overloads = [
            { sig:'IDisposable AcquireLock(string key)', text:'Waits indefinitely until the lock is acquired. Simplest, but has no protection against a zombie lock.' },
            { sig:'IDisposable AcquireLock(string key, TimeSpan timeOut)', text:'Treats the lock as invalid once the timeout expires and takes it - the safer default for production.' },
        ]
        return { stages, overloads }
    }
}

export default {
    components: { LockLifecycle }
}
