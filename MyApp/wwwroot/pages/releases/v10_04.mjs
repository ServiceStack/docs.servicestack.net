import AudioPlayer from "../podcasts/AudioPlayer.mjs"
import GeneratedSql from "../components/GeneratedSql.mjs"

export default {
    install(app) {
    },
    components: {
        AudioPlayer,
        GeneratedSql,
    },
    setup() {
        return { }
    }
}
