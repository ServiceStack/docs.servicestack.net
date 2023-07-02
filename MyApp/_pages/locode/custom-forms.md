---
title: Custom Forms
---

To override Locode's built-in Form UI you can add custom [Vue components](https://vuejs.org/guide/essentials/component-basics.html)
to your Host Project **/wwwroot** folder at `/modules/locode/components/*.mjs` using the naming conventions below:

| Component Name | Description           |
|----------------|-----------------------|
| `New{Table}`   | Custom Create Form UI |
| `Edit{Table}`  | Custom Update Form UI |

The [chinook.locode.dev](https://chinook.locode.dev) demo does this to create a custom Form UI for creating and
editing Albums by registering `NewAlbums` in [NewAlbums.mjs](https://github.com/NetCoreApps/Chinook/blob/main/Chinook/wwwroot/modules/locode/components/NewAlbums.mjs)
and `EditAlbums` component in [EditAlbums.mjs](https://github.com/NetCoreApps/Chinook/blob/main/Chinook/wwwroot/modules/locode/components/EditAlbums.mjs)
which are used to render Chinook's [custom Create Album form](https://chinook.locode.dev/locode/QueryAlbums?create)
to update its `Albums` table.

## Built-in App functionality

### JavaScript Libraries

Your custom components can utilize built in libraries embedded in ServiceStack.dll where they will have access to the latest [Vue 3](https://vuejs.org/guide/introduction.html) reactive fx, [@servicestack/client](/javascript-client) client library and [Vue 3 Tailwind Component library](/vue/) which they can import by package name, e.g:

```js
import { ref } from "vue"
import { useClient } from "@servicestack/vue"
import { humanify } from "@servicestack/client"
```

#### Static Analysis

As all package dependencies are written in TypeScript you can install them as dev dependencies to get static analysis from its TypeScript definitions at dev time:

```bash
npm install -D vue
npm install -D @servicestack/client
npm install -D @servicestack/vue
```

Your components can access your Apps Typed DTOs directly from the [ES6 Module DTO endpoint](/javascript-add-servicestack-reference) at `/types/mjs`, e.g:

```js
import { CreateAlbums } from "/types/mjs"
```

### App functionality

Your components access to most App functionality via the injected dependencies for functionality defined in Locode's [app.mjs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/tests/NorthwindAuto/locode/lib/app.mjs):

```js
const app = inject('app')                  // App for customizing Vue App, register components, providers, plugins, etc
const client = inject('client')            // JsonServiceClient for API Calls
const server = inject('server')            // AppMetadata (metadata for your Server App and APIs)
const store = inject('store')              // Locode's Reactive object model
const routes = inject('routes')            // usePageRoutes() Reactive store to manage its SPA routing
const breakpoints = inject('breakpoints')  // useBreakpoints() Reactive store to Tailwind responsive breakpoints
```

Most of which creates instance of common library features in [core.mjs](https://github.com/ServiceStack/ServiceStack/blob/main/ServiceStack/tests/NorthwindAuto/wwwroot/js/core.mjs) that are documented at [api.locode.dev/modules/locode.html](https://api.locode.dev/modules/locode.html).

You're also not limited with what's in Locode, with full access to [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
you can import external 3rd Party packages the same way you import built-in packages.

### Code walkthrough

Your components will have full control to implement their desired functionality how they want, which can get a lot of integrated functionality for free by leveraging the [Vue Component library](/vue/), e.g. this custom component uses:

 - [ModalDialog](/vue/gallery/modals) - to load our custom Create Albums Form component in a Modal Dialog
 - [ErrorSummary](/vue/gallery/alerts) - to display any non-contextual summary API errors
 - [TextInput](/vue/gallery/form-inputs) - to create a validation bound form for the `CreateAlbums` **Title** property
 - [LookupInput](/vue/gallery/form-inputs) - to create a Lookup input to select an Artist for the `CreateAlbums` **ArtistId** property

Whilst `<SubmitAlbumButton>` is an example of using a shared component in 
[SubmitAlbumButton.mjs](https://github.com/NetCoreApps/Chinook/blob/main/Chinook/wwwroot/modules/locode/components/SubmitAlbumButton.mjs).

```js
import { ref } from "vue"
import { useClient, useMetadata } from "@servicestack/vue"
import { CreateAlbums } from "/types/mjs"

export const NewAlbums = {
    template:/*html*/`
    <ModalDialog @done="done" sizeClass="">
      <div class="album-form relative flex flex-col">
        <ErrorSummary except="title,artistId"/>
        <form @submit.prevent="submit" class="m-4 shadow-md rounded-full w-96 h-96 flex justify-center items-center">
          <div class="flex flex-col justify-center items-center text-center">
            <h1 class="text-3xl font-medium text-rose-500 mb-4">New Album</h1>
            <fieldset>
              <TextInput id="title" v-model="request.title" label="" placeholder="Album Title" class="mb-3" />

              <LookupInput id="artistId" v-model="request" label="" placeholder="Select Artist"
                           :input="lookupProp.input" :metadataType="dataModelType" class="mb-3" />

              <SubmitAlbumButton />
            </fieldset>
          </div>
        </form>
      </div>
    </ModalDialog>
    `,
    props: ['type'],
    emits: ['done','save'],
    setup(props, { emit }) {
        const client = useClient()
        const { typeOf } = useMetadata()

        const dataModelType = typeOf("Albums")
        const lookupProp = dataModelType.properties.find(x => x.name === 'ArtistId')
        const request = ref(new CreateAlbums())

        /** @param {Event} e */
        async function submit(e) {
            const form = e.target
            const api = await client.apiForm(new CreateAlbums(), new FormData(form))
            if (api.succeeded) {
                emit('save', api.response)
            }
        }

        function done() {
            emit('done')
        }

        return { request, lookupProp, dataModelType, submit, done }
    }
}
```

The only integration needed to communicate back with Locode's
[AutoQueryGrid component](/vue/gallery/autoquerygrid) is to emit `done` when the form is dismissed without changes or emit `save` if changes are made to
refresh the AutoQueryGrid resultset to see the latest changes.

Invoking APIs with `useClient()` APIs will propagate any error information from any [declarative validation attributes](/locode/declarative#type-validation-attributes) into validation-aware components which alleviates us from needing to perform any manual validation ourselves.

When registered this custom component replaces Locode's Auto Form UI with a custom [Create Album Form](https://chinook.locode.dev/locode/QueryAlbums?create):

[![](/img/pages/locode/chinook/custom-createform.png)](https://chinook.locode.dev/locode/QueryAlbums?create)

That when submitting an empty form will trigger the contextual validation errors to appear:

[![](/img/pages/locode/chinook/custom-createform-errors.png)](https://chinook.locode.dev/locode/QueryAlbums?new=true)

As enforced by the [Declarative Validation](/declarative-validation) rules on the `CreateAlbums` AutoQuery CRUD DTO its calling:

```csharp
[Route("/albums", "POST"), Tag(Tags.Media)]
public class CreateAlbums
    : IReturn<IdResponse>, IPost, ICreateDb<Albums>
{
    [ValidateNotEmpty]
    public string Title { get; set; }

    [ValidateGreaterThan(0)]
    public long ArtistId { get; set; }
}
```

## Custom Edit Form

The custom `EditAlbums` form has a very similar implementation the `NewAlbums` implementation above other than populating the Input components with 
the existing Album's values, accessible via the **model** property.

```js
import { useClient, useMetadata } from "@servicestack/vue"
import { ref } from "vue"
import { UpdateAlbums } from "/types/mjs"

export const EditAlbums = {
    template:/*html*/`
      <ModalDialog @done="done" sizeClass="">
        <div class="album-form relative flex flex-col">
          <ErrorSummary except="title,artistId" />
          <form @submit.prevent="submit" class="m-4 shadow-md rounded-full w-96 h-96 max-w-96 flex justify-center items-center">
            <div class="flex flex-col justify-center items-center text-center">
              <h1 class="text-3xl font-medium text-rose-500 mb-4">Edit Album {{ request.albumId }}</h1>
              <fieldset>
                <input type="hidden" name="albumId" :value="request.albumId">
                <TextInput id="title" v-model="request.title" label="" placeholder="Album Title" class="mb-3" />

                <LookupInput id="artistId" v-model="request" label="" placeholder="Select Artist"
                             :input="lookupProp.input" :metadataType="dataModelType" class="mb-3" />

                <SubmitAlbumButton />
              </fieldset>
            </div>
          </form>
        </div>
      </ModalDialog>
    `,
    props: ['model','type','deleteType'],
    emits: ['done','save'],
    setup(props, { emit }) {
        const client = useClient()
        const { typeOf } = useMetadata()

        const dataModelType = typeOf("Albums")
        const lookupProp = dataModelType.properties.find(x => x.name === 'ArtistId')
        const request = ref(new UpdateAlbums(props.model))

        /** @param {Event} e */
        async function submit(e) {
            const form = e.target
            const api = await client.apiForm(new UpdateAlbums(), new FormData(form))
            if (api.succeeded) {
                emit('save', api.response)
            }
        }

        function done() {
            emit('done')
        }

        return { request, lookupProp, dataModelType, submit, done }
    }
} 
```

If applicable **deleteType** will be populated with an API to Delete Albums that the current user has authorization to access, should you wish to implement delete functionality.

Then to perform the updates we just need to call an Update Albums API, which for Chinook is called `PatchAlbums`:

```csharp
[Route("/albums/{AlbumId}", "PATCH"), Tag(Tags.Media)]
public class PatchAlbums
    : IReturn<IdResponse>, IPatch, IPatchDb<Albums>
{
    public long AlbumId { get; set; }
    public string Title { get; set; }
    public long ArtistId { get; set; }
}
```

Which is all that's need to implement our custom Edit Albums Form:

[![](/img/pages/locode/chinook/custom-editform.png)](https://chinook.locode.dev/locode/QueryAlbums?edit=6)

To minimize code duplication both custom forms makes use of a shared
[SubmitAlbumButton.mjs](https://github.com/NetCoreApps/Chinook/blob/main/Chinook/wwwroot/modules/locode/components/SubmitAlbumButton.mjs) component, defined as:

```js
export const SubmitAlbumButton = {
    template:`
    <button type="submit" class="inline-flex items-center p-3 border border-transparent rounded-full shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500">
        <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid meet" viewBox="0 0 48 48">
            <g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="4">
                <path stroke-linecap="round" d="M24 44C12.954 44 4 35.046 4 24S12.954 4 24 4s20 8.954 20 20"/>
                <path d="M20 24v-6.928l6 3.464L32 24l-6 3.464l-6 3.464V24Z"/><path stroke-linecap="round" d="M37.05 32v10M42 36.95H32"/>
            </g>
        </svg>
    </button>`
}
```

## Custom Locode Home Page

Next we'll look at how we can create a [custom Home page](/locode/custom-components) by overriding Locode's
existing `Welcome.mjs` component.