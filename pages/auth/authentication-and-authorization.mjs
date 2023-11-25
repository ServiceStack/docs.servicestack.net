import Templates, { Index } from "../templates/Templates.mjs"

const ServicestackAuthTemplates = {
    components: { Templates },
    template:`<Templates :templates="[Index['vue-mjs'], Index['nextjs'], Index['vue-vite'], Index['vue-ssg'], Index['razor-pages'], Index['mvcauth'], Index['script'], Index['vue-spa'], Index['react-spa'], Index['angular-spa'], Index['svelte-spa']]" hide="demo" />`,
    setup() {
        return { Index }
    }
}

export default {
    install(app) {
    },
    components: {
        ServicestackAuthTemplates,
    },
    setup() {
        return { }
    }
}
