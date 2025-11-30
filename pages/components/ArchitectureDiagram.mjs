import { ref, computed } from "vue"

export default {
    template: `
    <div class="bg-[#f9f9fb] dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
        <h4 class="font-semibold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Architecture
        </h4>
        <div class="flex bg-muted rounded-lg p-0.5 border border-border/50">
            <button
            @click="diagramMode = 'Development'"
            :class="['px-3 py-1 text-[10px] font-medium rounded-md transition-all', diagramMode === 'Development' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground']"
            >
            Development
            </button>
            <button
            @click="diagramMode = 'Production'"
            :class="['px-3 py-1 text-[10px] font-medium rounded-md transition-all', diagramMode === 'Production' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground']"
            >
            Production
            </button>
        </div>
        </div>
        <img :src="currentDiagram" :alt="title + ' Architecture'" class="w-full h-auto rounded dark:invert opacity-90 hover:opacity-100 transition-opacity" />
    </div>
    `,
    props: {
        src: String,
    },
    setup(props) {
        const diagramMode = ref('Development')
        const currentDiagram = computed(() =>
            props.src.replace('-prod.svg', diagramMode.value === 'Production' ? '-prod.svg' : '-dev.svg')
        )
        return { diagramMode, currentDiagram }
    }
}