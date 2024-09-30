import Templates, { Index } from "../templates/Templates.mjs"
import AudioPlayer from "../podcasts/AudioPlayer.mjs"

const BlazorTemplate = {
    components: { Templates },
    template:`<Templates :templates="[Index['blazor']]" />`,
    setup() {
        return { Index }
    }
}

const BlazorWasmTemplate = {
    components: { Templates },
    template:`<Templates :templates="[Index['blazor-wasm']]" />`,
    setup() {
        return { Index }
    }
}

const BlazorVueTemplate = {
    components: { Templates },
    template:`<Templates :templates="[Index['blazor-vue']]" />`,
    setup() {
        return { Index }
    }
}

export default {
    install(app) {
    },
    components: {
        AudioPlayer,
        BlazorTemplate,
        BlazorWasmTemplate,
        BlazorVueTemplate,
    },
    setup() {
        return { }
    }
}
