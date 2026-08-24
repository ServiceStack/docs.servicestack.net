export default {
    props: {
        images: { type: Object, default: () => ({}) },
        className: String,
        alt: String,
    },
    template: `
        <div :class="className || 'not-prose my-8'" @keydown="onGalleryKeydown">
            <div class="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <button type="button" @click="openLightbox"
                        class="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
                        :aria-label="'Open ' + currentTitle + ' in full size'">
                    <img :src="currentImage" :alt="imageAlt"
                         class="aspect-video w-full object-contain" loading="lazy">
                </button>

                <div class="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/75 via-black/20 to-transparent px-4 pb-3 pt-12 text-white">
                    <span class="min-w-0 truncate text-sm font-medium sm:text-base">{{ currentTitle }}</span>
                    <span class="shrink-0 rounded-full bg-black/45 px-2 py-0.5 text-xs tabular-nums">
                        {{ activeIndex + 1 }} / {{ entries.length }}
                    </span>
                </div>

                <template v-if="entries.length > 1">
                    <button type="button" @click="previous"
                            class="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-80 shadow transition hover:bg-black/70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                            aria-label="Previous screenshot" title="Previous screenshot">
                        <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <button type="button" @click="next"
                            class="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white opacity-80 shadow transition hover:bg-black/70 hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                            aria-label="Next screenshot" title="Next screenshot">
                        <svg viewBox="0 0 24 24" class="size-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </template>
            </div>

            <div v-if="entries.length > 1" class="mt-3 flex snap-x gap-2 overflow-x-auto pb-2"
                 role="tablist" aria-label="Choose a screenshot">
                <button v-for="(entry, index) in entries" :key="entry[0]" ref="thumbnails"
                        type="button" role="tab" :aria-selected="index === activeIndex"
                        :aria-label="'Show ' + entry[0]" @click="select(index)"
                        :class="['w-28 shrink-0 snap-center overflow-hidden rounded-lg border-2 bg-white p-1 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:w-32',
                            index === activeIndex
                                ? 'border-blue-500 shadow-sm dark:border-blue-400'
                                : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800']">
                    <img :src="entry[1]" alt="" class="aspect-video w-full rounded object-cover" loading="lazy">
                    <span class="mt-1 block truncate px-0.5 text-xs font-medium text-gray-700 dark:text-gray-200">{{ entry[0] }}</span>
                </button>
            </div>

            <Teleport to="body">
                <div v-if="lightboxOpen" @click="closeLightbox"
                     class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
                     role="dialog" aria-modal="true" :aria-label="currentTitle + ' screenshot'">
                    <button type="button" @click.stop="closeLightbox"
                            class="absolute right-4 top-4 z-20 grid size-10 place-items-center rounded-full text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                            aria-label="Close screenshot" title="Close (Esc)">
                        <svg viewBox="0 0 24 24" class="size-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                            <path d="M6 6l12 12M18 6 6 18" />
                        </svg>
                    </button>

                    <div class="absolute left-4 top-4 z-20 rounded-lg bg-black/55 px-3 py-2 text-sm font-medium text-white">
                        {{ currentTitle }} <span class="ml-1 text-white/65">{{ activeIndex + 1 }} / {{ entries.length }}</span>
                    </div>

                    <img :src="currentImage" :alt="imageAlt" @click.stop
                         class="max-h-[92vh] max-w-full rounded-lg object-contain shadow-2xl">

                    <template v-if="entries.length > 1">
                        <button type="button" @click.stop="previous"
                                class="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                aria-label="Previous screenshot">
                            <svg viewBox="0 0 24 24" class="size-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <button type="button" @click.stop="next"
                                class="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                aria-label="Next screenshot">
                            <svg viewBox="0 0 24 24" class="size-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </template>
                </div>
            </Teleport>
        </div>
    `,
    data() {
        return {
            activeIndex: 0,
            lightboxOpen: false,
            previousOverflow: '',
        }
    },
    computed: {
        entries() {
            return Object.entries(this.images || {})
        },
        current() {
            return this.entries[this.activeIndex] || this.entries[0] || ['', '']
        },
        currentTitle() {
            return this.current[0]
        },
        currentImage() {
            return this.current[1]
        },
        imageAlt() {
            return this.alt ? `${this.alt} — ${this.currentTitle}` : this.currentTitle
        },
    },
    methods: {
        select(index) {
            this.activeIndex = index
            this.$nextTick(() => {
                const thumbnail = this.$refs.thumbnails?.[index]
                thumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            })
        },
        previous() {
            if (this.entries.length > 1)
                this.select((this.activeIndex - 1 + this.entries.length) % this.entries.length)
        },
        next() {
            if (this.entries.length > 1)
                this.select((this.activeIndex + 1) % this.entries.length)
        },
        openLightbox() {
            if (!this.currentImage) return
            this.previousOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            this.lightboxOpen = true
            document.addEventListener('keydown', this.onDocumentKeydown)
        },
        closeLightbox() {
            this.lightboxOpen = false
            document.body.style.overflow = this.previousOverflow
            document.removeEventListener('keydown', this.onDocumentKeydown)
        },
        onGalleryKeydown(e) {
            if (this.lightboxOpen) return
            if (e.key === 'ArrowLeft') { e.preventDefault(); this.previous() }
            if (e.key === 'ArrowRight') { e.preventDefault(); this.next() }
        },
        onDocumentKeydown(e) {
            if (!this.lightboxOpen) return
            if (e.key === 'Escape') this.closeLightbox()
            if (e.key === 'ArrowLeft') { e.preventDefault(); this.previous() }
            if (e.key === 'ArrowRight') { e.preventDefault(); this.next() }
        },
    },
    beforeUnmount() {
        if (this.lightboxOpen) document.body.style.overflow = this.previousOverflow
        document.removeEventListener('keydown', this.onDocumentKeydown)
    },
}
