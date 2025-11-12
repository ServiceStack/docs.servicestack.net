import AudioPlayer from "../podcasts/AudioPlayer.mjs"
import Templates, { Index } from "../components/Templates.mjs"

const ReactTemplate = {
    components: { Templates },
    template:`
        <div class="mb-24 not-prose">
            <!-- Simple header -->
            <div class="mb-8">
                <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl flex justify-between items-center">
                    <div>{{ Index[name].name }}</div>
                    <a class="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                       :href="'https://github.com/NetCoreTemplates/' + name">
                        <svg class="size-5 group-hover:rotate-12 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
                        Source Code
                    </a>
                </h2>
                <p class="mt-3 text-xl text-gray-600 dark:text-gray-400 mb-8">
                    {{ description }}
                </p>
            </div>

            <!-- Templates section with enhanced styling -->
            <div class="my-10 transform transition-all duration-300 hover:scale-[1.02]">
                <Templates :templates="[Index[name]]" />
            </div>

            <!-- Screenshots with enhanced hover effects and layout -->
            <div class="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-10 my-10">
                <!-- light screenshot -->
                <a class="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-rotate-1"
                   :href="'https://' + name + '.web-templates.io'">
                    <div class="absolute inset-0 bg-gradient-to-tr from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <img class="w-80 h-80 md:w-96 md:h-96 object-cover ring-4 ring-gray-200 group-hover:ring-indigo-400 transition-all duration-300"
                         :src="'/img/pages/react/' + name + '.webp'"
                         :alt="Index[name].name + ' light theme'">
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p class="text-white text-base font-semibold">Light Theme</p>
                    </div>
                </a>

                <!-- dark screenshot -->
                <a class="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:rotate-1"
                   :href="'https://' + name + '.web-templates.io'">
                    <div class="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <img class="w-80 h-80 md:w-96 md:h-96 object-cover ring-4 ring-gray-200 group-hover:ring-purple-400 transition-all duration-300"
                         :src="'/img/pages/react/' + name + '-dark.webp'"
                         :alt="Index[name].name + ' dark theme'">
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p class="text-white text-base font-semibold">Dark Theme</p>
                    </div>
                </a>
            </div>
        </div>
    `,
    props: {
        name:String,
        description:String
    },
    setup() {
        return { Index }
    }
}

const ScreenshotsGallery = {
    props: {
        images: Object
    },
    template:`
        <div class="not-prose my-16">
            <!-- Gallery Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="(imageUrl, title) in images" :key="title"
                     @click="openLightbox(imageUrl, title)"
                     class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer bg-white dark:bg-gray-800">
                    
                    <!-- Image Container with aspect ratio for 2048x2158 -->
                    <div class="relative aspect-[2048/2158] overflow-hidden">
                        <!-- Gradient overlay on hover -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        
                        <!-- Image -->
                        <img :src="imageUrl" 
                             :alt="title"
                             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                             loading="lazy">
                        
                        <!-- Title overlay -->
                        <div class="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <h3 class="text-white text-lg font-semibold capitalize">{{ title }}</h3>
                            <p class="text-gray-200 text-sm mt-1">Click to view full size</p>
                        </div>
                        
                        <!-- Zoom icon -->
                        <div class="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div class="bg-white/90 dark:bg-gray-900/90 rounded-full p-2 shadow-lg">
                                <svg class="w-5 h-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Lightbox Modal -->
            <div v-if="lightboxOpen" 
                 @click="closeLightbox"
                 class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
                
                <!-- Close button -->
                <button @click="closeLightbox"
                        class="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                
                <!-- Image title -->
                <div class="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <h3 class="text-white text-xl font-semibold capitalize">{{ currentTitle }}</h3>
                </div>
                
                <!-- Image container -->
                <div @click.stop class="relative max-w-6xl max-h-[90vh] flex items-center justify-center">
                    <img :src="currentImage" 
                         :alt="currentTitle"
                         class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl">
                </div>
                
                <!-- Navigation arrows (if multiple images) -->
                <button v-if="imageKeys.length > 1"
                        @click.stop="previousImage"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-3 hover:bg-white/10 rounded-full">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                
                <button v-if="imageKeys.length > 1"
                        @click.stop="nextImage"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-3 hover:bg-white/10 rounded-full">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
                
                <!-- Image counter -->
                <div v-if="imageKeys.length > 1" 
                     class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <p class="text-white text-sm">{{ currentIndex + 1 }} / {{ imageKeys.length }}</p>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            lightboxOpen: false,
            currentImage: '',
            currentTitle: '',
            currentIndex: 0
        }
    },
    computed: {
        imageKeys() {
            return Object.keys(this.images)
        }
    },
    methods: {
        openLightbox(imageUrl, title) {
            this.currentImage = imageUrl
            this.currentTitle = title
            this.currentIndex = this.imageKeys.indexOf(title)
            this.lightboxOpen = true
            document.body.style.overflow = 'hidden'
            document.addEventListener('keydown', this.handleKeydown)
        },
        closeLightbox() {
            this.lightboxOpen = false
            document.body.style.overflow = ''
            document.removeEventListener('keydown', this.handleKeydown)
        },
        nextImage() {
            this.currentIndex = (this.currentIndex + 1) % this.imageKeys.length
            const key = this.imageKeys[this.currentIndex]
            this.currentImage = this.images[key]
            this.currentTitle = key
        },
        previousImage() {
            this.currentIndex = (this.currentIndex - 1 + this.imageKeys.length) % this.imageKeys.length
            const key = this.imageKeys[this.currentIndex]
            this.currentImage = this.images[key]
            this.currentTitle = key
        },
        handleKeydown(e) {
            if (!this.lightboxOpen) return

            switch(e.key) {
                case 'Escape':
                    this.closeLightbox()
                    break
                case 'ArrowRight':
                    if (this.imageKeys.length > 1) {
                        this.nextImage()
                    }
                    break
                case 'ArrowLeft':
                    if (this.imageKeys.length > 1) {
                        this.previousImage()
                    }
                    break
            }
        }
    },
    beforeUnmount() {
        document.removeEventListener('keydown', this.handleKeydown)
    }
}

export default {
    install(app) {
    },
    components: {
        AudioPlayer,
        ReactTemplate,
        ScreenshotsGallery,
    },
    setup() {
        return { }
    }
}
