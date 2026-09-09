/** Queue, then commit - or don't, and it discards itself */
const TransactionFlow = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">MULTI / EXEC / DISCARD</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">A transaction is a queue you either commit or drop</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        Nothing is sent while you queue. <code class="rounded bg-slate-100 px-1 dark:bg-slate-800">Commit()</code> sends them all as one atomic
        <b class="text-slate-900 dark:text-white">EXEC</b>; leaving the using block without committing sends <b class="text-slate-900 dark:text-white">DISCARD</b> instead.
      </p>

      <div class="mt-7 space-y-3">
        <div v-for="(s,i) in steps" :key="s.name" class="flex items-start gap-4">
          <span :class="['flex h-8 shrink-0 items-center justify-center rounded-xl px-2.5 text-[11px] font-black uppercase tracking-wider', s.tint]">{{s.cmd}}</span>
          <div class="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div class="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <code class="min-w-0 whitespace-pre-wrap break-words font-bold text-slate-900 dark:text-white">{{s.name}}</code>
            </div>
            <p class="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-300">{{s.text}}</p>
          </div>
        </div>
      </div>

      <p class="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-amber-900 dark:bg-amber-950/25 dark:text-slate-200">
        <b class="text-slate-900 dark:text-white">Forgetting Commit() is safe.</b> <code>Dispose()</code> calls <code>Rollback()</code>, which discards the
        transaction and resets the client connection back to its previous state.
      </p>
    </section>`,
    setup() {
        const steps = [
            { cmd:'MULTI', tint:'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
              name:'redis.CreateTransaction()', text:'Opens the transaction. Wrap it in a using block so it can clean up after itself.' },
            { cmd:'queue', tint:'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
              name:'trans.QueueCommand(r => …)', text:'Adds any IRedisClient operation to the transaction. An optional second callback receives that command’s result after EXEC.' },
            { cmd:'EXEC', tint:'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
              name:'trans.Commit()', text:'Sends every queued command atomically and then invokes each registered callback with its result.' },
            { cmd:'DISCARD', tint:'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
              name:'trans.Rollback() — automatic on Dispose()', text:'Throws the queue away without executing anything, leaving the connection ready for reuse.' },
        ]
        return { steps }
    }
}

export default {
    components: { TransactionFlow }
}
