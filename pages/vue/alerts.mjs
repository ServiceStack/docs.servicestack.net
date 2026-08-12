import { JsonServiceClient } from "@servicestack/client"

export default {
    install(app) {
        app.provide('client', new JsonServiceClient('https://blazor-gallery.servicestack.net'))
    },
    components: {
    },
    setup() {
        const message = "Requires <b>Employee</b> Role"
        return { message }
    }
}
