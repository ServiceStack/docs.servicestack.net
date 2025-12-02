import AudioPlayer from "../podcasts/AudioPlayer.mjs"
import ReactTemplate from "../components/ReactTemplate.mjs"
import ScreenshotsGallery from "../components/ScreenshotsGallery.mjs"
import CopyBlock from "../components/CopyBlock.mjs"
import VibeTemplate from "../components/VibeTemplate.mjs"
import ArchitectureDiagram from "../components/ArchitectureDiagram.mjs"

export default {
    install(app) {
    },
    components: {
        AudioPlayer,
        ReactTemplate,
        ScreenshotsGallery,
        CopyBlock,
        VibeTemplate,
        ArchitectureDiagram,
    },
    setup() {
        return { }
    }
}
