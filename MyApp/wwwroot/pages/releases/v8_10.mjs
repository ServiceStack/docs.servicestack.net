import AudioPlayer from "../podcasts/AudioPlayer.mjs"
import ReactTemplate from "../components/ReactTemplate.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"

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
