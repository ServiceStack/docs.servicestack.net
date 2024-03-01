import { JsonServiceClient } from "@servicestack/client"

export default {
    install(app) {
        app.provide('client', new JsonServiceClient('https://blazor-gallery.jamstacks.net'))
    },
    components: {
    },
    setup() {
        const message = "Requires <b>Employee</b> Role"
        return { message }
    }
}
