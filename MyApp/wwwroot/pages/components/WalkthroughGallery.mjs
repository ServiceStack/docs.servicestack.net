export default {
    props: {
        slides: { type: Array, default: () => [] },
        className: String,
    },
    template: `
        <section :class="className || 'not-prose'" @keydown="onGalleryKeydown"
                 aria-label="Screenshot walkthrough">
            <div v-if="current" class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
                <div class="flex items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-5 dark:border-slate-700 dark:bg-slate-800/70">
                    <span class="rounded-full bg-rose-100 px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-widest text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                        {{ current.phase }}
                    </span>
                    <span class="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                        Step {{ activeIndex + 1 }} of {{ slides.length }}
                    </span>
                </div>

                <div class="group relative bg-slate-950">
                    <button ref="imageButton" type="button" @click="openLightbox"
                            class="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-500"
                            :aria-label="'View full size: ' + current.title">
                        <span class="flex w-full items-center justify-center p-2 sm:p-4" style="aspect-ratio: 59 / 41">
                            <img :src="current.src" :alt="current.alt || current.title"
                                 class="max-h-full max-w-full rounded object-contain" loading="lazy">
                        </span>
                    </button>

                    <template v-if="slides.length > 1">
                        <button type="button" @click="previous"
                                class="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white shadow-lg transition hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                                aria-label="Previous step" title="Previous step">
                            <svg viewBox="0 0 24 24" class="size-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <button type="button" @click="next"
                                class="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white shadow-lg transition hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                                aria-label="Next step" title="Next step">
                            <svg viewBox="0 0 24 24" class="size-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </template>
                </div>

                <div class="grid gap-5 px-5 py-5 sm:px-7 sm:py-6 lg:grid-cols-[1fr_auto] lg:items-end" aria-live="polite">
                    <div>
                        <h3 class="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                            {{ current.title }}
                        </h3>
                        <p class="mt-2 max-w-4xl text-base leading-7 text-slate-600 dark:text-slate-300">
                            {{ current.caption }}
                        </p>
                    </div>
                    <div v-if="slides.length > 1" class="flex gap-2">
                        <button type="button" @click="previous"
                                class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
                            <span aria-hidden="true">&larr;</span> Previous
                        </button>
                        <button type="button" @click="next"
                                class="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:ring-offset-slate-900">
                            Next <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="slides.length > 1" ref="rail" class="mt-4 flex snap-x gap-2 overflow-x-auto pb-3"
                 role="tablist" aria-label="Walkthrough steps">
                <button v-for="(slide, index) in slides" :key="slide.src + index" ref="thumbnails"
                        type="button" role="tab" :aria-selected="index === activeIndex"
                        :aria-label="'Show step ' + (index + 1) + ': ' + slide.title" @click="select(index)"
                        :class="['w-32 shrink-0 snap-center overflow-hidden rounded-xl border-2 bg-white p-1.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 sm:w-40',
                            index === activeIndex
                                ? 'border-rose-500 shadow-md dark:border-rose-400 dark:bg-slate-900'
                                : 'border-slate-200 hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600']">
                    <img :src="slide.src" alt="" class="aspect-video w-full rounded-md bg-slate-950 object-cover object-top" loading="lazy">
                    <span class="mt-1.5 block truncate px-0.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {{ index + 1 }}. {{ slide.title }}
                    </span>
                </button>
            </div>

            <Teleport to="body">
                <div v-if="lightboxOpen" @click="closeLightbox"
                     class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
                     role="dialog" aria-modal="true" :aria-label="current.title + ' screenshot'">
                    <button ref="closeButton" type="button" @click.stop="closeLightbox"
                            class="absolute right-4 top-4 z-20 grid size-11 place-items-center rounded-full text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            aria-label="Close screenshot" title="Close (Esc)">
                        <svg viewBox="0 0 24 24" class="size-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6 6 18" />
                        </svg>
                    </button>

                    <div class="absolute left-4 top-4 z-20 max-w-[calc(100%-6rem)] rounded-lg bg-black/60 px-3 py-2 text-white">
                        <div class="text-sm font-semibold">{{ current.title }}</div>
                        <div class="mt-0.5 font-mono text-xs text-white/65">{{ activeIndex + 1 }} / {{ slides.length }}</div>
                    </div>

                    <img :src="current.src" :alt="current.alt || current.title" @click.stop
                         class="max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl">

                    <template v-if="slides.length > 1">
                        <button type="button" @click.stop="previous"
                                class="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-4"
                                aria-label="Previous step">
                            <svg viewBox="0 0 24 24" class="size-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <button type="button" @click.stop="next"
                                class="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-4"
                                aria-label="Next step">
                            <svg viewBox="0 0 24 24" class="size-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </template>
                </div>
            </Teleport>
        </section>
    `,
    data() {
        return {
            activeIndex: 0,
            lightboxOpen: false,
            previousOverflow: '',
            lastFocus: null,
        }
    },
    computed: {
        current() {
            return this.slides[this.activeIndex] || this.slides[0] || null
        },
    },
    methods: {
        select(index) {
            if (!this.slides.length) return
            this.activeIndex = (index + this.slides.length) % this.slides.length
            this.$nextTick(() => {
                const rail = this.$refs.rail
                const thumbnail = this.$refs.thumbnails?.[this.activeIndex]
                if (!rail || !thumbnail) return
                const railRect = rail.getBoundingClientRect()
                const thumbnailRect = thumbnail.getBoundingClientRect()
                const left = rail.scrollLeft + thumbnailRect.left - railRect.left
                    - (rail.clientWidth - thumbnailRect.width) / 2
                rail.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
            })
        },
        previous() {
            this.select(this.activeIndex - 1)
        },
        next() {
            this.select(this.activeIndex + 1)
        },
        openLightbox() {
            if (!this.current) return
            this.lastFocus = document.activeElement
            this.previousOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            this.lightboxOpen = true
            document.addEventListener('keydown', this.onDocumentKeydown)
            this.$nextTick(() => this.$refs.closeButton?.focus())
        },
        closeLightbox() {
            if (!this.lightboxOpen) return
            this.lightboxOpen = false
            document.body.style.overflow = this.previousOverflow
            document.removeEventListener('keydown', this.onDocumentKeydown)
            this.$nextTick(() => this.lastFocus?.focus?.())
        },
        onGalleryKeydown(e) {
            if (this.lightboxOpen) return
            if (e.key === 'ArrowLeft') { e.preventDefault(); this.previous() }
            if (e.key === 'ArrowRight') { e.preventDefault(); this.next() }
        },
        onDocumentKeydown(e) {
            if (!this.lightboxOpen) return
            if (e.key === 'Escape') { e.preventDefault(); this.closeLightbox() }
            if (e.key === 'ArrowLeft') { e.preventDefault(); this.previous() }
            if (e.key === 'ArrowRight') { e.preventDefault(); this.next() }
        },
    },
    beforeUnmount() {
        if (this.lightboxOpen) document.body.style.overflow = this.previousOverflow
        document.removeEventListener('keydown', this.onDocumentKeydown)
    },
}
