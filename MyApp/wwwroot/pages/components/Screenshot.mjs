export default {
    props: {
        src: String,
        img: String,
        title: String,
        alt: String,
        caption: String,
        imageClass: String,
    },
    template: `
        <div class="not-prose my-8">
            <!-- Clickable Screenshot Image -->
            <div class="relative group cursor-pointer transition-transform duration-300 transform hover:scale-[1.01]"
                 @click="openLightbox">
                <img :src="imageUrl" 
                     :alt="imageAlt"
                     :class="imageClass || 'shadow rounded-md w-full h-auto block'"
                     loading="lazy">
                     
                <!-- Zoom icon overlay on hover -->
                <div class="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div class="bg-black/70 text-white rounded-full p-2 backdrop-blur-sm shadow-md">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
                        </svg>
                    </div>
                </div>
            </div>
            
            <!-- Caption below image -->
            <p v-if="displayTitle" class="mt-2.5 text-sm text-gray-500 dark:text-gray-400 text-center font-medium">
                {{ displayTitle }}
            </p>
            
            <!-- Lightbox Modal -->
            <div v-if="lightboxOpen" 
                 @click="closeLightbox"
                 class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8">
                
                <!-- Close button -->
                <button @click="closeLightbox"
                        class="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
                        title="Close (Esc)">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                
                <!-- Image title -->
                <div v-if="displayTitle" class="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg max-w-[calc(100%-6rem)]">
                    <h3 class="text-white text-base sm:text-xl font-semibold capitalize truncate">{{ displayTitle }}</h3>
                </div>
                
                <!-- Image container in lightbox -->
                <div @click.stop class="relative max-w-7xl max-h-[90vh] flex items-center justify-center">
                    <img :src="imageUrl" 
                         :alt="imageAlt"
                         class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl">
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            lightboxOpen: false
        }
    },
    computed: {
        imageUrl() {
            return this.src || this.img || ''
        },
        imageAlt() {
            return this.alt || this.title || this.caption || 'Screenshot'
        },
        displayTitle() {
            return this.title || this.caption || ''
        }
    },
    methods: {
        openLightbox() {
            this.lightboxOpen = true
            document.body.style.overflow = 'hidden'
            document.addEventListener('keydown', this.handleKeydown)
        },
        closeLightbox() {
            this.lightboxOpen = false
            document.body.style.overflow = ''
            document.removeEventListener('keydown', this.handleKeydown)
        },
        handleKeydown(e) {
            if (!this.lightboxOpen) return
            if (e.key === 'Escape') {
                this.closeLightbox()
            }
        }
    },
    beforeUnmount() {
        if (this.lightboxOpen) {
            document.body.style.overflow = ''
        }
        document.removeEventListener('keydown', this.handleKeydown)
    }
}