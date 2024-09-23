import Templates, { Index } from "../templates/Templates.mjs"
import AudioPlayer from "../podcasts/AudioPlayer.mjs"

const AuthTemplates = {
    components: { Templates },
    template:`<Templates :templates="[Index['blazor'], Index['blazor-vue'], Index['razor'], Index['mvc'], Index['razor-bootstrap'], Index['mvc-bootstrap']]" hide="demo" />`,
    setup() {
        return { Index }
    }
}

export default {
    install(app) {
    },
    components: {
        AudioPlayer,
        AuthTemplates,
    },
    setup() {
        return { }
    }
}
