//import BlazorTemplate from "../templates/BlazorTemplate8.mjs"
import Templates, { Index } from "../templates/Templates.mjs"

const BlazorTemplate = {
    components: { Templates },
    template:`<Templates :templates="[Index['blazor']]" />`,
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

const IdentityAuthTemplates = {
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
        BlazorTemplate,
        BlazorVueTemplate,
        IdentityAuthTemplates,
    },
    setup() {
        return { }
    }
}
