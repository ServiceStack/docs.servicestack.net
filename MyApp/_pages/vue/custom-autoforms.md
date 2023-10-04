---
title: Custom Auto Forms
group: Component Gallery
---

## Custom AutoForm UIs

[CoffeeShop's Admin UI](https://servicestack.net/posts/building-typechat-coffeeshop-modelling) is a good example of the rapid development model 
of AutoQuery and Vue's [AutoQueryGrid](/vue/autoquerygrid) and 
[Auto Form](/vue/autoform) Components was nearly able to develop the entire CRUD management UI using just AutoQuery's Typed DTOs.

The one Form that it wasn't able to generate the entire UI for is its **Many-to-Many** `CategoryOption` relationship
which requires a custom AutoForm component to be able to specify which Options a category of CoffeeShop Products can have.

<div class="not-prose">
    <div class="mb-16 flex justify-center">
        <iframe style="width:896px;height:504px;" src="https://www.youtube.com/embed/MjNqPAXLH5w?si=HDFs2FnYhtuZSDWL&amp;start=404" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
</div>


### Implementing Many to Many CategoryOption Admin UI

The easier way to implement this functionality would be to have the UI call an API each time an `Option` was added or removed
to a `Category`. The problem with this approach is that it doesn't match the existing behavior where if a User **cancels**
a form they'd expect for none of their changes to be applied.

To implement the desired functionality we'll instead create a custom `UpdateCategory` implementation that also
handles any changes to `CategoryOption` using new `AddOptionIds` and `RemoveOptionIds` properties that we'll want 
rendered as **hidden** inputs in our HTML Form with:

```csharp
public class UpdateCategory : IPatchDb<Category>, IReturn<Category>
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    [Input(Type = "tag"), FieldCss(Field = "col-span-12")]
    public List<string>? Sizes { get; set; }
    [Input(Type = "tag"), FieldCss(Field = "col-span-12")]
    public List<string>? Temperatures { get; set; }
    public string? DefaultSize { get; set; }
    public string? DefaultTemperature { get; set; }
    [Input(Type = "file"), UploadTo("products")]
    public string? ImageUrl { get; set; }

    [Input(Type = "hidden")]
    public List<int>? AddOptionIds { get; set; }
 
    [Input(Type = "hidden")]
    public List<int>? RemoveOptionIds { get; set; }
}
```

## Custom AutoQuery Implementation

The [Custom AutoQuery Implementation](/autoquery/rdbms#custom-autoquery-implementations)
in [CoffeeShopServices.cs](https://github.com/NetCoreApps/TypeChatExamples/blob/main/TypeChatExamples.ServiceInterface/CoffeeShopServices.cs) 
contains the custom implementation which continues to utilize AutoQuery's **Partial Update** functionality if there's any changes to update, 
as well as removing or adding any Options the user makes to the `Category`: 

```csharp
public class CoffeeShopServices : Service
{
    public IAutoQueryDb AutoQuery { get; set; }
    
    public async Task<object> Any(UpdateCategory request)
    {
        // Perform all RDBMS Updates within the same Transaction
        using var trans = Db.OpenTransaction();

        Category? response = null;
        var ignore = new[]{nameof(request.Id),nameof(request.AddOptionIds),nameof(request.RemoveOptionIds)};
        // Only call AutoQuery Update if there's something to update
        if (request.ToObjectDictionary().HasNonDefaultValues(ignoreKeys:ignore))
        {
            response = (Category) await AutoQuery.PartialUpdateAsync<Category>(request, Request, Db);
        }
        if (request.RemoveOptionIds?.Count > 0)
        {
            await Db.DeleteAsync<CategoryOption>(x => 
                x.CategoryId == request.Id && request.RemoveOptionIds.Contains(x.OptionId));
        }
        if (request.AddOptionIds?.Count > 0)
        {
            await Db.InsertAllAsync(request.AddOptionIds.Map(id => 
                new CategoryOption { CategoryId = request.Id, OptionId = id }));
        }
        trans.Commit();

        response ??= request.ConvertTo<Category>();
        return response;
    }
}
```

## Custom AutoForm Component

It now needs to implement a Custom UI that Adds/Removes Options from a Category which is done in a custom `CategoryOptions`
Vue Component that displays all the Category Options with a button to remove existing ones and a Select Input to 
add non existing options.

The purpose of the component is to populate the `addOptionIds` field with Option Ids that should be added and `removeOptionIds`
with Ids to be removed, which updates the Request DTO of the parent Form Model with the `update:modelValue` event:

```js
const CategoryOptions = {
    template:`
         <div>
            <ul v-for="optionType in currentOptionTypes">
                <li class="py-1 flex justify-between">
                    <span>
                        {{optionType}}
                    </span>
                    <span>
                        <svg class="w-6 h-6 text-red-600 hover:text-red-800 cursor-pointer" @click="removeOption(optionType)" xmlns='http://www.w3.org/2000/svg' width='1024' height='1024' viewBox='0 0 1024 1024'>
                            <title>Remove Option</title>
                            <path fill='currentColor' d='M512 64a448 448 0 1 1 0 896a448 448 0 0 1 0-896zM288 512a38.4 38.4 0 0 0 38.4 38.4h371.2a38.4 38.4 0 0 0 0-76.8H326.4A38.4 38.4 0 0 0 288 512z'/>
                        </svg>
                    </span>
                </li> 
            </ul>
            <div class="flex justify-between items-center">
                <select-input class="flex-grow" @change="addOption" :values="['',...options.filter(x => !currentOptionTypes.includes(x.type)).map(x => x.type)]"></select-input>
                <svg class="ml-2 w-6 h-6 text-green-600" xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
                    <title>Add Option</title>
                    <path fill='currentColor' d='M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4v4Zm1 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z'/>
                </svg>            
            </div>
         </div>
    `,
    props:['type','id','modelValue'],
    emits:['update:modelValue'],
    setup(props, { emit }) {
        const client = useClient()
        const options = ref([])
        const model = props.modelValue

        model.addOptionIds ??= []
        model.removeOptionIds ??= []
        const origOptionIds = model.categoryOptions?.map(x => x.optionId) || []

        const currentOptionIds = computed(() => [...origOptionIds, ...model.addOptionIds]
            .filter(x => !model.removeOptionIds.includes(x)))
        const currentOptionTypes = computed(() =>
            currentOptionIds.value.map(id => options.value.find(x => x.id === id)?.type).filter(x => !!x))

        function addOption(e) {
            const optionType = e.target.value
            if (!optionType) return
            const option = options.value.find(x => x.type === optionType)
            if (model.removeOptionIds.includes(option.id))
                model.removeOptionIds = model.removeOptionIds.filter(id => id !== option.id)
            else if (!model.addOptionIds.includes(option.id))
                model.addOptionIds.push(option.id)
            emit('update:modelValue', model)
        }
        function removeOption(optionType) {
            const option = options.value.find(x => x.type === optionType)
            if (model.addOptionIds.includes(option.id))
                model.addOptionIds = model.addOptionIds.filter(id => id !== option.id)
            else if (!model.removeOptionIds.includes(option.id))
                model.removeOptionIds.push(option.id)
        }

        onMounted(async () => {
            const api = await client.api(new QueryOptions({ orderBy:'id' }))
            options.value = api.response.results || []
            emit('update:modelValue', model)
        })

        return { options, addOption, removeOption, currentOptionTypes }
    }
}
```

Which is then attached to the AutoQueryGrid Form Components using its `<template #formfooter>` to include it in the
bottom of the Create and Edit Form Components:

```js
const sections = {
    Categories: {
        type: 'Category',
        component: {
            components: { CategoryOptions },
            template:`
            <AutoQueryGrid :type="type" selectedColumns="imageUrl,id,name,defaultSize,products"
                    :headerTitles="{ imageUrl: ' ' }" :canFilter="x => x != 'ImageUrl'">
                <template #imageUrl="{ imageUrl }">
                    <Icon :src="imageUrl" class="w-8 h-8 rounded-full" />
                </template>
                <template #id="{ id }">{{id}}</template>
                <template #name="{ name }">{{name}}</template>
                <template #description="{ description }">{{description}}</template>
                <template #defaultSize="{ defaultSize }">{{defaultSize}}</template>
                <template #products="{ products }">{{ products.map(x => x.name).join(', ') }}</template>
                <template #formfooter="{ form, type, apis, model, id, updateModel }">
                    <div class="w-1/2 mt-4 px-4 sm:px-6">
                        <h3 class="text-lg font-semibold">Options</h3>
                        <CategoryOptions v-if="form === 'edit'" :key="id" :type="type" :id="id" v-model="model" @update:modelValue="updateModel(model)" />
                    </div>
                </template>                
            </AutoQueryGrid>`,
        },
    },
    //...
}
```

With those finishing touches CoffeeShop's back-end Admin UI is now complete which now allows shop owners to manage their entire database:

:::{.shadow .rounded-sm}
[![](/img/pages/autoquery/portal-update-category.png)](/img/pages/autoquery/portal-update-category.png)
:::

