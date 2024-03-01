import { ref } from "vue"
import { JsonServiceClient } from "@servicestack/client"

export default {
    install(app) {
        app.provide('client', new JsonServiceClient('https://blazor-gallery.jamstacks.net'))
    },
    setup() {
        const strings = ref()
        const objects = ref()
        const pairs = ref([])

        return { strings, objects, pairs }
    }
}
