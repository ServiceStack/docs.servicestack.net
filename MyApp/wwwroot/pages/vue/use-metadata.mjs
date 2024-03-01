import { ref } from "vue"
import { useMetadata } from "@servicestack/vue"
import { JsonServiceClient } from "@servicestack/client"

export default {
    install(app) {
        app.provide('client', new JsonServiceClient('https://blazor-gallery.jamstacks.net'))
    },
    components: {
    },
    setup() {
        const { typeOf } = useMetadata()
        return { typeOf }
    }
}
