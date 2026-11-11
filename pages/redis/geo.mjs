/** A radius query over the example stores, drawn to scale inside the radius */
const GeoRadius = {
    template: `
    <section class="not-prose my-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:to-slate-950 sm:p-8">
      <p class="text-xs font-bold uppercase tracking-[.18em] text-red-600 dark:text-red-400">FindGeoResultsInRadius</p>
      <h3 class="mt-1 text-xl font-bold text-slate-900 dark:text-white">Stores within 25 km, nearest first</h3>

      <div class="mt-6 grid items-center gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <svg viewBox="0 0 320 260" class="w-full" role="img" aria-label="A 25 km radius around a point in San Francisco contains the downtown and Oakland stores; Cupertino is outside it">
          <defs>
            <pattern id="geo-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0H0V20" fill="none" class="stroke-slate-200 dark:stroke-slate-800" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="320" height="260" rx="14" fill="url(#geo-grid)"/>
          <circle :cx="c.x" :cy="c.y" :r="radius" class="fill-red-500/10 stroke-red-500 dark:fill-red-500/15 dark:stroke-red-400" stroke-width="2" stroke-dasharray="6 4"/>
          <line :x1="c.x" :y1="c.y" :x2="c.x" :y2="c.y + radius" class="stroke-red-400 dark:stroke-red-500" stroke-width="1.5"/>
          <text :x="c.x + 6" :y="c.y + radius * 0.7" class="fill-red-600 text-[10px] font-bold dark:fill-red-400">25 km</text>
          <g v-for="s in stores" :key="s.id">
            <circle :cx="s.x" :cy="s.y" r="6" :class="s.inside ? 'fill-red-600 dark:fill-red-400' : 'fill-slate-400 dark:fill-slate-600'" class="stroke-white dark:stroke-slate-900" stroke-width="2"/>
            <text :x="s.x + (s.labelLeft ? -10 : 10)" :y="s.y + 4" :text-anchor="s.labelLeft ? 'end' : 'start'"
                  :class="s.inside ? 'fill-slate-900 dark:fill-white' : 'fill-slate-400 dark:fill-slate-500'" class="text-[11px] font-bold">{{s.name}}</text>
          </g>
          <circle :cx="c.x" :cy="c.y" r="4.5" class="fill-slate-900 dark:fill-white"/>
          <text :x="c.x + 4" :y="c.y - 12" text-anchor="middle" class="fill-slate-600 text-[10px] font-bold dark:fill-slate-300">you are here</text>
        </svg>

        <div>
          <div class="text-[11px] font-black uppercase tracking-[.16em] text-slate-400 dark:text-slate-500">Results</div>
          <div class="mt-2 space-y-1.5">
            <div v-for="(r,i) in results" :key="r.member" class="flex items-baseline justify-between gap-3 rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
              <code class="text-xs font-bold text-slate-900 dark:text-white"><span class="mr-1.5 text-slate-400">{{i+1}}</span>{{r.member}}</code>
              <span class="font-mono text-xs font-bold text-red-700 dark:text-red-300">{{r.distance}}</span>
            </div>
          </div>
          <p class="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Cupertino is about 60 km away, outside the radius, and Los Angeles at 559 km isn't drawn.
            Each result includes its <code>Distance</code>, <code>Longitude</code>, <code>Latitude</code> and geohash.
          </p>
        </div>
      </div>
    </section>`,
    setup() {
        // ~4 px per km inside the radius; cupertino is drawn closer than its real ~60 km
        const c = { x: 130, y: 120 }
        const radius = 100
        const stores = [
            { id:'sf', name:'sf-downtown', x: 122, y: 134, inside:true, labelLeft:true },
            { id:'oak', name:'oakland', x: 178, y: 112, inside:true },
            { id:'cup', name:'cupertino', x: 290, y: 242, inside:false, labelLeft:true },
        ]
        const results = [
            { member:'store:sf-downtown', distance:'1.3 km' },
            { member:'store:oakland', distance:'12.3 km' },
        ]
        return { c, radius, stores, results }
    }
}

export default {
    components: { GeoRadius }
}
