import { ref, computed } from "vue"
import CopyBlock from "../components/CopyBlock.mjs"
import HighlightJson, { dedent, slotText } from "../components/HighlightJson.mjs"

const ViewJson = {
    components: { HighlightJson },
    template: `
        <div class="not-prose group relative my-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 sm:p-6">
            <button type="button" @click="copy" :title="copied ? 'Copied!' : 'Copy JSON'"
                    :aria-label="copied ? 'Copied!' : 'Copy JSON'"
                    :class="['absolute top-3 right-3 z-10 flex items-center justify-center p-2 rounded-md cursor-pointer',
                        'transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100',
                        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
                        copied
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 opacity-100'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500']">
                <svg v-if="copied" class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                <svg v-else class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
            <div class="overflow-x-auto whitespace-pre text-sm">
                <HighlightJson :json="json" :indent="indent" />
            </div>
        </div>`,
    props: {
        indent: { type: Number, default: 2 },
    },
    setup(props, { slots }) {
        const text = computed(() => dedent(slots.default ? slotText(slots.default()) : ''))
        const json = computed(() => {
            try {
                return JSON.parse(text.value)
            } catch (e) {
                return text.value
            }
        })
        const copyText = computed(() => typeof json.value === 'string'
            ? json.value
            : JSON.stringify(json.value, null, props.indent))

        const copied = ref(false)
        async function copy(e) {
            e.preventDefault()
            try {
                await navigator.clipboard.writeText(copyText.value)
            } catch (err) {
                const $el = document.createElement("textarea")
                $el.value = copyText.value
                $el.style.position = "fixed"
                $el.style.opacity = "0"
                document.body.appendChild($el)
                $el.select()
                document.execCommand("copy")
                document.body.removeChild($el)
            }
            copied.value = true
            setTimeout(() => copied.value = false, 2000)
        }
        return { json, copied, copy }
    }
}

const ScreenshotToggle = {
    props: {
        title: String,
        description: String,
        images: Object,
        screens: Array,
        defaultIndex: { type: Number, default: 0 }
    },
    template: `
        <div class="not-prose my-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm outline-none dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 sm:p-6"
             tabindex="0" @keydown.left.prevent="prev" @keydown.right.prevent="next">
            
            <!-- Optional Header -->
            <div v-if="title || description" class="text-center mb-5">
                <h4 v-if="title" class="text-lg font-bold text-slate-900 dark:text-white">{{ title }}</h4>
                <p v-if="description" class="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{{ description }}</p>
            </div>

            <!-- Tab Buttons / Controls -->
            <div v-if="items.length > 1" class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex flex-wrap gap-1.5 sm:gap-2">
                    <button v-for="(item, idx) in items" :key="idx" type="button" @click="selectIndex(idx)"
                            :class="['rounded-full px-3.5 py-1.5 text-xs font-semibold transition sm:text-sm cursor-pointer', currentIndex === idx
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700']">
                        {{ item.title }}
                    </button>
                </div>
                
                <!-- Step Navigation -->
                <div class="flex shrink-0 items-center gap-2">
                    <button type="button" @click="prev" aria-label="Previous screenshot" title="Previous"
                            class="rounded-lg bg-white p-1.5 text-slate-500 ring-1 ring-slate-200 transition hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700 cursor-pointer">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <span class="tabular-nums text-xs font-semibold text-slate-400">{{ currentIndex + 1 }} / {{ items.length }}</span>
                    <button type="button" @click="next" aria-label="Next screenshot" title="Next"
                            class="rounded-lg bg-white p-1.5 text-slate-500 ring-1 ring-slate-200 transition hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-700 cursor-pointer">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>
                    </button>
                </div>
            </div>

            <!-- Screenshot Viewport -->
            <div v-if="current" class="mt-4">
                <div class="relative group cursor-pointer"
                     @click="openLightbox">
                    <img :src="current.src" :alt="current.title" loading="lazy"
                         class="w-full h-auto block rounded-lg transition-transform duration-300 group-hover:scale-[1.005]">
                    
                    <!-- Zoom badge overlay on hover -->
                    <div class="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div class="bg-black/75 text-white rounded-full py-1.5 px-3 backdrop-blur-sm shadow-md flex items-center gap-1.5 text-xs font-medium">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
                            </svg>
                            <span>Click to enlarge</span>
                        </div>
                    </div>
                </div>
                
                <p v-if="current.title" class="mt-2.5 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
                    {{ current.title }}
                </p>
            </div>

            <!-- Lightbox Modal -->
            <div v-if="lightboxOpen" 
                 @click="closeLightbox"
                 class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8">
                
                <!-- Close button -->
                <button @click="closeLightbox"
                        class="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full cursor-pointer"
                        title="Close (Esc)">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                
                <!-- Image title -->
                <div v-if="current.title" class="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg max-w-[calc(100%-6rem)]">
                    <h3 class="text-white text-base sm:text-xl font-semibold capitalize truncate">{{ current.title }}</h3>
                </div>
                
                <!-- Image container in lightbox -->
                <div @click.stop class="relative max-w-7xl max-h-[90vh] flex items-center justify-center">
                    <img :src="current.src" 
                         :alt="current.title"
                         class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl">
                </div>
                
                <!-- Navigation arrows (if multiple images) -->
                <button v-if="items.length > 1"
                        @click.stop="prev"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-3 hover:bg-white/10 rounded-full cursor-pointer"
                        title="Previous (Left Arrow)">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                
                <button v-if="items.length > 1"
                        @click.stop="next"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-3 hover:bg-white/10 rounded-full cursor-pointer"
                        title="Next (Right Arrow)">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
                
                <!-- Image counter -->
                <div v-if="items.length > 1" 
                     class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p class="text-white text-sm">{{ currentIndex + 1 }} / {{ items.length }}</p>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            currentIndex: this.defaultIndex || 0,
            lightboxOpen: false
        }
    },
    computed: {
        items() {
            if (Array.isArray(this.screens) && this.screens.length > 0) {
                return this.screens.map(s => {
                    if (typeof s === 'string') return { title: '', src: s }
                    return {
                        title: s.title || s.name || s.caption || '',
                        src: s.src || s.img || s.url || ''
                    }
                })
            }
            if (this.images && typeof this.images === 'object') {
                return Object.entries(this.images).map(([title, src]) => ({ title, src }))
            }
            return []
        },
        current() {
            return this.items[this.currentIndex] || this.items[0] || { title: '', src: '' }
        }
    },
    methods: {
        selectIndex(idx) {
            this.currentIndex = idx
        },
        prev() {
            if (this.items.length === 0) return
            this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length
        },
        next() {
            if (this.items.length === 0) return
            this.currentIndex = (this.currentIndex + 1) % this.items.length
        },
        openLightbox() {
            this.lightboxOpen = true
            document.body.style.overflow = 'hidden'
            window.addEventListener('keydown', this.handleKeydown)
        },
        closeLightbox() {
            this.lightboxOpen = false
            document.body.style.overflow = ''
            window.removeEventListener('keydown', this.handleKeydown)
        },
        handleKeydown(e) {
            if (e.key === 'Escape') {
                this.closeLightbox()
            } else if (e.key === 'ArrowLeft') {
                this.prev()
            } else if (e.key === 'ArrowRight') {
                this.next()
            }
        }
    },
    beforeUnmount() {
        if (this.lightboxOpen) {
            document.body.style.overflow = ''
        }
        window.removeEventListener('keydown', this.handleKeydown)
    }
}

export default {
    components: {
        CopyBlock,
        ViewJson,
        ScreenshotToggle,
    }
}
