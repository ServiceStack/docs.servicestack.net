import { computed, ref } from "vue"

/**
 * A YouTube playlist: one large lazy-loaded player with a selectable list of
 * the other videos beside it. Uses <lite-youtube>, so nothing is requested
 * from YouTube until a video is actually played.
 *
 *   <VideoGallery eyebrow="Demos" title="See it in action" :videos="[{
 *      id:'5NNCaWMviXU', title:'…', caption:'…', summary:'…',
 *      icon:'/img/pages/svg/dart-logo.svg', tags:['gRPC','Dart'] }]" />
 */
export default {
    props: {
        eyebrow: String,
        title: String,
        description: String,
        /** [{ id, title, caption, summary, icon, tags:[] }] - `id` is the YouTube video id */
        videos: { type: Array, default: () => [] },
    },
    template: `
    <section class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div v-if="eyebrow || title || description" class="border-b border-slate-200 px-6 py-5 dark:border-slate-700 sm:px-8">
        <p v-if="eyebrow" class="text-xs font-bold uppercase tracking-[.18em] text-indigo-600 dark:text-indigo-400">{{eyebrow}}</p>
        <h3 v-if="title" class="mt-1 text-xl font-bold text-slate-900 dark:text-white">{{title}}</h3>
        <p v-if="description" class="mt-2 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">{{description}}</p>
      </div>

      <div class="grid lg:grid-cols-[1.55fr_1fr]">
        <div v-if="current" class="min-w-0 p-5 sm:p-6">
          <lite-youtube :key="current.id" :videoid="current.id" :playlabel="'Play: ' + current.title"
            class="block w-full overflow-hidden rounded-xl shadow-lg"
            :style="{ maxWidth:'none', backgroundImage:'url(' + poster(current.id) + ')' }"></lite-youtube>

          <div class="mt-5 flex items-start gap-3">
            <img v-if="current.icon" :src="current.icon" alt="" class="mt-0.5 h-8 w-8 shrink-0 object-contain">
            <div class="min-w-0">
              <h4 class="text-lg font-bold text-slate-900 dark:text-white">{{current.title}}</h4>
              <p v-if="current.summary" class="mt-1.5 leading-7 text-slate-600 dark:text-slate-300">{{current.summary}}</p>
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <span v-for="tag in current.tags" :key="tag"
                      class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{tag}}</span>
                <a :href="'https://youtu.be/' + current.id" target="_blank" rel="noopener noreferrer"
                   class="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400">Watch on YouTube <span aria-hidden="true">→</span></a>
              </div>
            </div>
          </div>
        </div>

        <div v-if="videos.length > 1"
             class="flex max-h-[34rem] flex-col divide-y divide-slate-100 overflow-y-auto border-t border-slate-200 dark:divide-slate-800 dark:border-slate-700 lg:border-l lg:border-t-0">
          <button v-for="(video,index) in videos" :key="video.id" type="button" @click="index_ = index"
            :aria-current="index_ === index"
            :class="['flex w-full items-start gap-3 p-4 text-left transition', index_ === index
              ? 'bg-indigo-50 dark:bg-indigo-950/40'
              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60']">
            <span class="relative shrink-0">
              <img :src="thumb(video.id)" alt="" loading="lazy" width="320" height="180"
                   class="h-14 w-24 rounded-md object-cover ring-1 ring-slate-900/10 dark:ring-white/10">
              <span v-if="index_ === index" class="absolute inset-0 flex items-center justify-center rounded-md bg-indigo-600/70">
                <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </span>
            </span>
            <span class="min-w-0 flex-1">
              <span :class="['block text-sm font-bold', index_ === index ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-900 dark:text-white']">{{video.title}}</span>
              <span v-if="video.caption" class="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">{{video.caption}}</span>
            </span>
            <img v-if="video.icon" :src="video.icon" alt="" class="mt-0.5 h-5 w-5 shrink-0 object-contain opacity-70">
          </button>
        </div>
      </div>
    </section>`,
    setup(props) {
        const index_ = ref(0)
        const current = computed(() => props.videos[index_.value])
        const poster = id => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
        const thumb = id => `https://img.youtube.com/vi/${id}/mqdefault.jpg`
        return { index_, current, poster, thumb }
    }
}
