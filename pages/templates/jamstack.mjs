import JamstackTodos from "./JamstackTodos.mjs"
import JamstackBookingsCrud from "./JamstackBookingsCrud.mjs"
import JamstackTemplates from "./JamstackTemplates.mjs"


export default {
    install(app) {
    },
    components: {
        JamstackTodos,
        JamstackBookingsCrud,
        JamstackTemplates,
    },
    setup() {
        return { }
    }
}
