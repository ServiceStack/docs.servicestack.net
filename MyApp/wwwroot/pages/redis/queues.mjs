/** Which queueing approach fits which job */
const QueueChooser = {
    template: `
    <section class="not-prose my-10">
      <div class="mb-6">
        <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Start simple, add guarantees as you need them</p>
        <h3 class="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Which queue do you need?</h3>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <a v-for="q in options" :key="q.name" :href="q.href"
           class="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-red-700">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">{{q.when}}</div>
          <div class="mt-1 font-bold text-slate-900 group-hover:text-red-700 dark:text-white dark:group-hover:text-red-300">{{q.name}}</div>
          <p class="mt-1.5 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{{q.text}}</p>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <code v-for="c in q.cmds" :key="c" class="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-red-700 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-red-300 dark:ring-slate-700">{{c}}</code>
          </div>
        </a>
      </div>
    </section>`,
    setup() {
        const options = [
            { when:'Losing a job is fine', name:'Simple queue', href:'#a-simple-work-queue', cmds:['LPUSH','BRPOP'],
              text:'The fewest moving parts. A job taken by a worker that crashes is gone.' },
            { when:'Every job must finish', name:'Reliable queue', href:'#a-reliable-queue', cmds:['BRPOPLPUSH','LREM'],
              text:'Jobs move atomically into a per-worker processing list, and are recovered when that worker restarts.' },
            { when:'Run it later', name:'Delayed jobs', href:'#delayed-and-scheduled-jobs', cmds:['ZADD','Lua promote'],
              text:'A Sorted Set scored by due time, with a script that moves due jobs onto the queue.' },
            { when:'Some work is urgent', name:'Priority queues', href:'#priority-queues', cmds:['BRPOP high normal low'],
              text:'One blocking call across several Lists, always served in the order given.' },
            { when:'Several consumers need each message', name:'Streams', href:'#streams-consumer-groups', cmds:['XREADGROUP','XACK','XAUTOCLAIM'],
              text:'Durable history, consumer groups, acknowledgments and claiming from crashed consumers.' },
            { when:'You want it all built in', name:'Background Jobs / Redis MQ', href:'#when-to-use-a-messaging-solution', cmds:['retries','dead letters','dashboard'],
              text:'Complete solutions with retries, dead-letter queues, scheduling and monitoring.' },
        ]
        return { options }
    }
}

/** A job's path through a reliable queue, including recovery after a crash */
const ReliableQueueFlow = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">A job is always in exactly one List</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">The reliable queue</h3>

      <div class="mt-6 grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Waiting</div>
          <code class="text-sm font-bold text-slate-900 dark:text-white">queue:jobs</code>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <span v-for="j in ['job-5','job-4','job-3']" :key="j" class="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{j}}</span>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center px-1 text-center" aria-hidden="true">
          <span class="text-[11px] font-black text-red-600 dark:text-red-400">Take()</span>
          <span class="text-xl text-red-400"><span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span></span>
          <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500">BRPOPLPUSH, atomic</span>
        </div>
        <div class="rounded-2xl border-2 border-red-400/50 bg-red-50/40 p-4 shadow-sm dark:border-red-800 dark:bg-red-950/25">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">In progress</div>
          <code class="text-sm font-bold text-slate-900 dark:text-white">processing:worker-1</code>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <span class="rounded-md bg-red-100 px-2 py-1 font-mono text-[11px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">job-2</span>
          </div>
        </div>
        <div class="flex flex-col items-center justify-center px-1 text-center" aria-hidden="true">
          <span class="text-[11px] font-black text-emerald-600 dark:text-emerald-400">Complete()</span>
          <span class="text-xl text-emerald-400"><span class="hidden lg:inline">→</span><span class="lg:hidden">↓</span></span>
          <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500">LREM</span>
        </div>
        <div class="rounded-2xl border border-emerald-300/60 bg-emerald-50/40 p-4 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/20">
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Done</div>
          <div class="text-sm font-bold text-slate-900 dark:text-white">removed</div>
          <div class="mt-3 flex flex-wrap gap-1.5">
            <span class="rounded-md bg-emerald-100 px-2 py-1 font-mono text-[11px] font-bold text-emerald-700 line-through dark:bg-emerald-950 dark:text-emerald-300">job-1</span>
          </div>
        </div>
      </div>

      <div class="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-sm leading-6 text-slate-700 dark:border-amber-900 dark:bg-amber-950/25 dark:text-slate-200">
        <span class="mt-0.5 text-lg leading-none" aria-hidden="true">↺</span>
        <span><b class="text-slate-900 dark:text-white">worker-1 crashes while processing job-2.</b>
          When it restarts, <code>RecoverUnfinished()</code> moves job-2 from its processing list back onto <code>queue:jobs</code>,
          so it's retried instead of lost.</span>
      </div>
    </section>`,
}

export default {
    components: { QueueChooser, ReliableQueueFlow }
}
