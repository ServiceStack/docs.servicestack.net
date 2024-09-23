import Templates, { Index } from "../templates/Templates.mjs"
import AudioPlayer from "../podcasts/AudioPlayer.mjs"

const ComposeTemplate = {
    components: { Templates },
    template:`<Templates :templates="[Index['kmp-desktop']]" />`,
    setup() {
        return { Index }
    }
}

export default {
    install(app) {
    },
    components: {
        AudioPlayer,
        ComposeTemplate,
    },
    setup() {
        return { }
    }
}
