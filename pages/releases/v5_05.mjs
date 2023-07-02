import { ServerLoginUis, ClientLoginUis, ServerContactUis, ClientContactUis } from "../world-validation.mjs"

export default {
    install(app) {
    },
    components: {
        ServerLoginUis, 
        ClientLoginUis, 
        ServerContactUis, 
        ClientContactUis,
    },
    setup() {
        return { }
    }
}
