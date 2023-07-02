import { JsonApiClient } from "@servicestack/client"
import { useMetadata, useAuth, useClient } from '@servicestack/vue'
import { allContacts, files, setMetadata } from "../vue/data.mjs"

export default {
    install(app) {
    },
    components: {
    },
    setup() {
        setMetadata()
        return { allContacts, files }
    }
}
