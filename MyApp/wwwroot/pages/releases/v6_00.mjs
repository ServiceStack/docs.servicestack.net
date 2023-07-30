import JamstackTodos from "../templates/JamstackTodos.mjs"
import JamstackBookingsCrud from "../templates/JamstackBookingsCrud.mjs"
import JamstackTemplates from "../templates/JamstackTemplates.mjs"


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
