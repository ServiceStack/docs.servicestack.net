/** The three algorithms, drawn against the same burst of traffic */
const RateLimitAlgorithms = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">One atomic Lua script per request</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Three ways to count requests</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        Each algorithm trades memory against accuracy. All three keep their state in a single Redis key per caller,
        with an expiry, so idle callers cost nothing.
      </p>

      <div class="mt-7 grid gap-4 lg:grid-cols-3">
        <!-- Fixed window -->
        <div class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-baseline justify-between gap-2">
            <span class="font-bold text-slate-900 dark:text-white">Fixed window</span>
            <code class="text-[11px] font-bold text-red-700 dark:text-red-300">INCR + PEXPIRE</code>
          </div>
          <div class="mt-4 flex h-24 items-end gap-1" aria-hidden="true">
            <template v-for="(w,wi) in fixedWindows" :key="wi">
              <div class="relative flex h-full flex-1 items-end gap-[3px] rounded-md border border-dashed border-slate-300 px-1.5 pb-1.5 dark:border-slate-600">
                <span class="absolute left-1.5 top-1 text-[10px] font-bold text-slate-400 dark:text-slate-500">{{w.label}}</span>
                <span v-for="(on,i) in w.slots" :key="i" :class="['flex-1 rounded-sm', on ? 'h-1/2 bg-red-500/80 dark:bg-red-500/70' : 'h-1 bg-slate-200 dark:bg-slate-700']"></span>
              </div>
            </template>
          </div>
          <div class="mt-1.5 text-center text-[11px] font-bold text-amber-600 dark:text-amber-400">↑ 2× the limit across the boundary</div>
          <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">A counter per window. Cheapest and simplest, but bursts at a window boundary can double the rate.</p>
          <div class="mt-auto pt-3 text-[11px] font-bold text-slate-400 dark:text-slate-500">Memory: 1 integer</div>
        </div>

        <!-- Sliding window -->
        <div class="flex flex-col rounded-2xl border-2 border-red-400/50 bg-red-50/30 p-5 shadow-sm dark:border-red-800 dark:bg-red-950/20">
          <div class="flex items-baseline justify-between gap-2">
            <span class="font-bold text-slate-900 dark:text-white">Sliding window</span>
            <code class="text-[11px] font-bold text-red-700 dark:text-red-300">Sorted Set</code>
          </div>
          <div class="relative mt-4 h-24" aria-hidden="true">
            <div class="absolute inset-x-0 top-1/2 h-px bg-slate-300 dark:bg-slate-600"></div>
            <span v-for="(d,i) in slidingDots" :key="i"
                  :class="['absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full', d.in ? 'bg-red-500 dark:bg-red-400' : 'bg-slate-300 dark:bg-slate-600']"
                  :style="{ left: d.x + '%' }"></span>
            <div class="absolute top-2 bottom-6 rounded-lg border-2 border-red-400/70 bg-red-400/5 dark:border-red-500/60" style="left:46%; right:2%">
              <span class="absolute -top-0.5 left-1.5 text-[10px] font-bold text-red-600 dark:text-red-400">last 60s</span>
            </div>
            <span class="absolute bottom-0 left-0 text-[10px] font-bold text-slate-400 dark:text-slate-500">ZREMRANGEBYSCORE</span>
            <span class="absolute bottom-0 right-0 text-[10px] font-bold text-slate-400 dark:text-slate-500">now</span>
          </div>
          <div class="mt-1.5 text-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400">exact over every 60s period</div>
          <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">A timestamp per request. Old entries are trimmed, and the request is allowed if fewer than the limit remain.</p>
          <div class="mt-auto pt-3 text-[11px] font-bold text-slate-400 dark:text-slate-500">Memory: 1 entry per request in the window</div>
        </div>

        <!-- Token bucket -->
        <div class="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="flex items-baseline justify-between gap-2">
            <span class="font-bold text-slate-900 dark:text-white">Token bucket</span>
            <code class="text-[11px] font-bold text-red-700 dark:text-red-300">Hash</code>
          </div>
          <div class="mt-4 flex h-24 items-end justify-center gap-5" aria-hidden="true">
            <div class="flex flex-col items-center gap-1">
              <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+5 / sec</span>
              <span class="text-lg leading-none text-emerald-500">↓</span>
            </div>
            <div class="relative h-full w-20 overflow-hidden rounded-b-2xl rounded-t-md border-2 border-slate-300 dark:border-slate-600">
              <div class="absolute inset-x-0 bottom-0 bg-red-500/70 dark:bg-red-500/60" style="height:60%"></div>
              <span class="absolute inset-x-0 top-1 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400">cap 10</span>
              <span class="absolute inset-x-0 bottom-1.5 text-center text-sm font-black text-white">6</span>
            </div>
            <div class="flex flex-col items-center gap-1">
              <span class="text-[10px] font-bold text-red-600 dark:text-red-400">−1 / request</span>
              <span class="text-lg leading-none text-red-500">↓</span>
            </div>
          </div>
          <div class="mt-1.5 text-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400">bursts to 10, then 5 / sec</div>
          <p class="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">Tokens refill at a steady rate up to a cap. Bursts are allowed up to the cap; the long-run rate is the refill rate.</p>
          <div class="mt-auto pt-3 text-[11px] font-bold text-slate-400 dark:text-slate-500">Memory: 2 hash fields</div>
        </div>
      </div>
    </section>`,
    setup() {
        // 2 windows of 10 slots, requests packed at the end of the first and start of the second
        const fixedWindows = [
            { label:'12:00', slots:[0,0,0,0,0,1,1,1,1,1] },
            { label:'12:01', slots:[1,1,1,1,1,0,0,0,0,0] },
        ]
        const xs = [6, 14, 22, 31, 40, 52, 60, 69, 77, 86, 94]
        const slidingDots = xs.map(x => ({ x, in: x > 47 }))
        return { fixedWindows, slidingDots }
    }
}

export default {
    components: { RateLimitAlgorithms }
}
