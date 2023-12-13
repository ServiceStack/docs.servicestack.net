import Templates, { Index } from "../templates/Templates.mjs"

const BlazorTemplates = {
    components: { Templates },
    template:`<Templates :templates="[Index['blazor'], Index['blazor-vue'], Index['blazor-wasm']]" hide="demo" />`,
    setup() {
        return { Index }
    }
}

export default {
    install(app) {
    },
    components: {
        BlazorTemplates,
    },
    setup() {
        return { }
    }
}
