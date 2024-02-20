import { onMounted, ref } from "vue"
import { Authenticate } from "../vue/dtos.mjs"
import { fetchBookings, tracks, setMetadata } from "../vue/data.mjs"
import { JsonApiClient } from "@servicestack/client"
import { useAuth, useClient } from '@servicestack/vue'

export default {
    install(app) {
        app.provide('client', JsonApiClient.create('https://blazor-gallery.jamstacks.net'))
    },
    components: {
    },
    setup() {
        setMetadata()
        const bookings = ref()

        const { signIn, signOut, user } = useAuth()

        // AutoForm
        const results = ref()
        const onSuccess = response => results.value = response.results

        // Combobox
        const strings = ref()
        const objects = ref()
        const pairs = ref([])

        // TagInput
        const request = ref({ skills:['servicestack','vue'] })

        // Tabs
        const A = { template:`<h3 class="text-center text-2xl">A Tab Body</h3>` }
        const B = { template:`<h3 class="text-center text-2xl">B Tab Body</h3>` }
        const C = { template:`<h3 class="text-center text-2xl">C Tab Body</h3>` }
        const tabs = { A, B, C }

        onMounted(async () => {
            bookings.value = await fetchBookings()
            const client = useClient()
            const api = await client.api(new Authenticate({ provider: 'credentials', userName:'admin@email.com', password:'p@55wOrd' }))
            if (api.succeeded) {
                signIn(api.response)
            }
        })
        return { signIn, signOut, user, results, onSuccess, strings, objects, pairs, request, tabs, bookings, tracks, }
    }
}
