import { ref } from "vue"
import { useAuth } from "@servicestack/vue"
import { JsonServiceClient } from "@servicestack/client"

export default {
    install(app) {
        app.provide('client', new JsonServiceClient('https://blazor-gallery.jamstacks.net'))
    },
    components: {
    },
    setup() {
        const showDialog = ref(false)
        const showSlide = ref(false)
        const { signIn, user } = useAuth()

        return { showDialog, showSlide, signIn, user }
    }
}
