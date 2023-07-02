import { ref, onMounted } from "vue"
import { Authenticate, QueryCoupons } from "./dtos.mjs"
import { useAuth, useClient, useFormatters } from '@servicestack/vue'
import { JsonApiClient } from "@servicestack/client"

export const Responsive = {
    template:`<AutoQueryGrid type="Booking" :visibleFrom="{ name:'xl', bookingStartDate:'sm', bookingEndDate:'xl', createdBy:'2xl' }">
        <template #id="{ id }">
            <span class="text-gray-900">{{ id }}</span>
        </template>
        
        <template #name="{ name }">
            {{ name }}
        </template>
        
        <template #roomNumber-header>
            <span class="hidden lg:inline">Room </span>No
        </template>
    
        <template #cost="{ cost }">{{ currency(cost) }}</template>
        
        <template #bookingStartDate-header>
            Start<span class="hidden lg:inline"> Date</span>
        </template>
        
        <template #bookingEndDate-header>
            End<span class="hidden lg:inline"> Date</span>
        </template>
    
        <template #createdBy-header>
            Employee
        </template>
        <template #createdBy="{ createdBy }">{{ createdBy }}</template>
    </AutoQueryGrid>`,
    setup() {
        const client = useClient()
        const coupon = ref()
        const { currency } = useFormatters()
        
        /** @param {string} id */
        async function showCoupon(id) {
            const api = await client.api(new QueryCoupons({ id }))
            if (api.succeeded) {
                coupon.value = api.response.results[0]
            }
        }
        const close = () => coupon.value = null
        
        return { coupon, showCoupon, close, currency }
    }
}

export const CustomBooking = {
    template:`<div>
        <AutoQueryGrid type="Booking" selectedColumns="id,name,cost,bookingStartDate,bookingEndDate,discount">
            <template #discount="{ discount }">
                <TextLink v-if="discount" class="flex items-end" @click.stop="showCoupon(discount.id)" :title="discount.id">
                    <Icon class="w-5 h-5 mr-1" type="Coupon" />
                    <PreviewFormat :value="discount.description" />
                </TextLink>
            </template>
        </AutoQueryGrid>
        <AutoEditForm v-if="coupon" type="UpdateCoupon" v-model="coupon" @done="close" @save="close" />
    </div>`,
    setup() {
        const client = useClient()
        const coupon = ref()
        /** @param {string} id */
        async function showCoupon(id) {
            const api = await client.api(new QueryCoupons({ id }))
            if (api.succeeded) {
                coupon.value = api.response.results[0]
            }
        }
        const close = () => coupon.value = null
        return { coupon, showCoupon, close }
    }
}

export default {
    install(app) {
        console.log('install(app)')
        app.provide('client', JsonApiClient.create('https://blazor-gallery-api.jamstacks.net'))
    },
    components: {
        Responsive,
        CustomBooking,
    },
    setup() {
        const client = useClient()
        
        onMounted(async () => {
            const api = await client.api(new Authenticate({ provider: 'credentials', userName:'admin@email.com', password:'p@55wOrd' }))
            if (api.succeeded) {
                const { signIn } = useAuth()
                signIn(api.response)
            }
        })
        return { }
    }
}
