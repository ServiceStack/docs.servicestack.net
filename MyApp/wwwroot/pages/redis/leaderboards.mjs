import { ref } from "vue"

/** One sorted set, and the slice of it each API returns */
const SortedSetLeaderboard = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">Always sorted, on every write</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">One Sorted Set, many questions</h3>
      <p class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
        Pick a query to see which part of <code class="rounded bg-slate-100 px-1 dark:bg-slate-800">leaderboard:global</code> it reads.
      </p>

      <div class="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div class="space-y-2" role="tablist" aria-label="Sorted Set queries">
          <button v-for="(q,i) in queries" :key="q.name" type="button" role="tab" :aria-selected="active === i"
                  @click="active = i"
                  :class="['block w-full rounded-xl border p-3.5 text-left transition', active === i
                    ? 'border-red-300 bg-white shadow-md ring-1 ring-red-200 dark:border-red-700 dark:bg-slate-900 dark:ring-red-900'
                    : 'border-slate-200 bg-white/60 hover:border-red-200 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-red-800']">
            <div class="text-sm font-bold text-slate-900 dark:text-white">{{q.name}}</div>
            <code class="mt-1 block whitespace-pre-wrap break-words text-[11px] font-bold text-red-700 dark:text-red-300">{{q.code}}</code>
          </button>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div class="mb-2 flex justify-between px-1 text-[10px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">
            <span>rank · member</span><span>score</span>
          </div>
          <div class="space-y-1.5">
            <div v-for="(p,i) in players" :key="p.name"
                 :class="['relative overflow-hidden rounded-lg px-3 py-2 transition', selected(i)
                   ? 'bg-red-50 ring-1 ring-red-300 dark:bg-red-950/40 dark:ring-red-800'
                   : 'bg-slate-50 opacity-60 dark:bg-slate-800/60']">
              <div class="absolute inset-y-0 left-0 bg-red-500/10 dark:bg-red-500/15" :style="{ width: (p.score / max * 100) + '%' }"></div>
              <div class="relative flex items-baseline justify-between gap-3">
                <span class="text-sm"><span class="mr-2 inline-block w-5 text-right font-mono text-xs font-bold text-slate-400 dark:text-slate-500">{{i}}</span><b class="text-slate-900 dark:text-white">{{p.name}}</b></span>
                <span class="font-mono text-sm font-bold text-slate-700 dark:text-slate-200">{{p.score}}</span>
              </div>
            </div>
          </div>
          <div class="mt-3 rounded-lg bg-slate-900 px-3 py-2 font-mono text-[11px] leading-5 text-slate-200 dark:bg-black/50">
            <span class="text-slate-500">// returns</span><br>{{queries[active].result}}
          </div>
        </div>
      </div>
    </section>`,
    setup() {
        const players = [
            { name:'erin', score:1300 }, { name:'alice', score:1200 }, { name:'bob', score:1150 },
            { name:'carol', score:1100 }, { name:'dave', score:700 }, { name:'frank', score:420 },
        ]
        const max = 1300
        const queries = [
            { name:'Top 3', code:'GetRangeWithScoresFromSortedSetDesc(board, 0, 2)', ranks:[0,1,2],
              result:'{ erin: 1300, alice: 1200, bob: 1150 }' },
            { name:'Carol’s rank', code:'GetItemIndexInSortedSetDesc(board, "carol")', ranks:[3],
              result:'3   // 0-based: 4th place' },
            { name:'Around carol', code:'GetRangeWithScoresFromSortedSetDesc(board, 2, 4)', ranks:[2,3,4],
              result:'{ bob: 1150, carol: 1100, dave: 700 }' },
            { name:'At least 1,000 points', code:'GetSortedSetCount(board, 1000, double.MaxValue)', ranks:[0,1,2,3],
              result:'4' },
            { name:'Keep the top 4', code:'RemoveRangeFromSortedSet(board, 0, -5)', ranks:[4,5],
              result:'2   // removed dave and frank' },
        ]
        const active = ref(0)
        const selected = i => queries[active.value].ranks.includes(i)
        return { players, max, queries, active, selected }
    }
}

export default {
    components: { SortedSetLeaderboard }
}
