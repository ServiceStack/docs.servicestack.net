---
title: Custom AutoQueryGrid
---

Locode lets you easily replace entire Locode Pages with your own, thanks to the reusable [AutoQueryGrid](/vue/autoquerygrid) component in the [Vue Component Library](/vue/) which lets you reuse custom components in your Vue Project templates to replace functionality in Locode, e.g. we can copy the custom 
[Bookings AutoQueryGrid](https://blazor-vue.web-templates.io/secure/bookings) Vue 3 component in the new [blazor-vue](https://blazor-vue.web-templates.io) Project Template
and use it to manage our Bookings in Locode by registering a Vue 3 component with the name:

`{DataModel}Page`

## Example

That we can auto register with Locode by adding it in our **/wwwroot** folder at `/modules/locode/components/*.mjs`.

Which we've added in our Blazor Gallery App, in [/modules/locode/components/BookingPage.mjs](https://github.com/NetCoreApps/BlazorGallery/blob/main/Gallery.Server/wwwroot/modules/locode/components/BookingPage.mjs) containing our custom Bookings AutoQueryGrid component:

```csharp
import { inject, ref } from "vue"
import { QueryCoupons } from "/types/mjs"

export const BookingPage = {
    template:`
    <div>
        <h1 class="py-8 text-center text-3xl text-indigo-700 font-semibold">Custom Bookings AutoQueryGrid</h1>
        <AutoQueryGrid type="Booking" selected-columns="id,name,cost,bookingStartDate,bookingEndDate,discount,notes">
        <template #discount="{ discount }">
            <TextLink v-if="discount" class="flex items-end" @click.stop="showCoupon(discount.id)" :title="discount.id">
                <Icon class="w-5 h-5 mr-1" type="Coupon" />
                <PreviewFormat :value="discount.description" />
            </TextLink>
        </template>
        </AutoQueryGrid>
        <AutoEditForm v-if="coupon" type="UpdateCoupon" v-model="coupon" @done="close" @save="close" />
    </div>
    `,
    props:['type'],
    setup() {
        const client = inject('client')
        const coupon = ref()
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
```

Where our custom version will open the related **Coupon** entry for the booking allowing both Bookings and their Coupons to be managed from the same page.

Now when **Booking** is selected in Locode it will load our custom version:

<a href="https://blazor-gallery.servicestack.net/locode/QueryBookings" class="not-prose max-w-4xl">
    <div class="block flex justify-center shadow hover:shadow-lg rounded">
        <img class="" src="/img/pages/locode/custom-bookingpage.png">
    </div>
</a>