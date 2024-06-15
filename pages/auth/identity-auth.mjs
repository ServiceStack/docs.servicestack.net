import Templates, { Index } from "../templates/Templates.mjs"

const IdentityAuthTemplates = {
    components: { Templates },
    template:`<Templates :templates="[Index['blazor'], Index['blazor-vue'], Index['blazor-wasm'], Index['razor'], Index['mvc'], Index['razor-bootstrap']]" hide="demo" />`,
    setup() {
        return { Index }
    }
}

export default {
    install(app) {
    },
    components: {
        IdentityAuthTemplates,
    },
    setup() {
        return { }
    }
}
