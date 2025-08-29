---
title: Custom HTML Components
---

The Chinook Demo shows an example of overriding its existing
[/modules/locode/components/Welcome.mjs](https://github.com/NetCoreApps/Chinook/blob/main/Chinook/wwwroot/modules/locode/components/Welcome.mjs)
component in order to render its [custom Home page](https://chinook.locode.dev/locode).

## Example

Which in addition to using built-in Locode functionality, also makes use of your Apps Typed DTOs directly from the [ES6 Module DTO endpoint](/javascript-add-servicestack-reference) at `/types/mjs`, e.g:

```js
import { QueryInvoices } from "/types/mjs"
```
This results in providing an end-to-end typed dev UX for creating custom components that call our App's APIs as done in:

```js
import { inject, ref, onMounted, computed } from "vue"
import { QueryInvoices } from "/types/mjs"

export const Welcome = {
    template:/*html*/`
    <div class="pl-4">
        <h1 class="text-3xl">
            Welcome to Chinook Locode
        </h1>
        <div v-if="lastOrders.length" class="mt-8">
            <h3 class="text-xl mb-4">Here are your last {{lastOrders.length}} orders:</h3>
            <DataGrid class="max-w-screen-md" type="Invoices" :items="lastOrders" tableStyle="uppercaseHeadings" />
        </div>
    </div>`,
    setup() {
        const client = inject('client')
        const api = ref()
        const lastOrders = computed(() => api.value?.response?.results || [])
        
        onMounted(async () => {
            api.value = await client.api(new QueryInvoices({ 
                orderBy:'-InvoiceId',
                take:5,
                fields:'InvoiceId,CustomerId,InvoiceDate,Total,BillingCountry,BillingCity'
            }), { jsconfig: 'edv' })
        })
        
        return { lastOrders }
    }
}
```

Which uses the [DataGrid](/vue/datagrid) component to render its [custom Home page](https://chinook.locode.dev/locode):

[![](/img/pages/locode/chinook/welcome.png)](https://chinook.locode.dev/locode)

That makes use of the [Declarative UI Attributes](/locode/declarative#ui-metadata-attributes) in its
[Invoices](https://github.com/NetCoreApps/Chinook/blob/main/Chinook.ServiceModel/Types/Models.cs) data model to render a formatted currency
**Total** and a direct link to the Customer that the invoice was for:

```csharp
[Icon(Svg = Icons.Invoices)]
public class Invoices
{
    [AutoIncrement]
    public long InvoiceId { get; set; }

    [Ref(Model = nameof(Customers), RefId = nameof(CustomerId), RefLabel = nameof(Customers.DisplayName))]
    public long CustomerId { get; set; }
    
    public DateTime InvoiceDate { get; set; }
    [Format(FormatMethods.Currency)]
    
    public decimal Total { get; set; }
    public string BillingAddress { get; set; }
    public string BillingCity { get; set; }
    public string BillingState { get; set; }
    public string BillingCountry { get; set; }
    public string BillingPostalCode { get; set; }
}
```