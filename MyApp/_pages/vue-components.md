---
slug: vue-components
title: Vue Components
---

A collection of Vue and Vuetify Components you might find useful for use in your own Apps:

## Vuetify Markdown Editor

To make contributing ServiceStack Community content as pleasant as possible we've developed a custom Markdown Editor that enhances a Vuetify Text Input component with editing features optimal for authoring Markdown of developer content.

[@servicestack/editor](https://github.com/ServiceStack/servicestack-editor) is a developer-friendly Markdown Editor for Vuetify Apps which is optimized for [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/) where it supports popular IDE short-cuts for authoring code like tab un/indenting, single-line code and comments blocks, etc. 

[![](https://i.imgur.com/YPlfplv.png)](https://github.com/ServiceStack/servicestack-editor)

For wrist-friendly productivity the Editor supports many of the popular Keyboard shortcuts found in popular IDEs:

![](https://i.imgur.com/PXqkSuN.png)

It's ideal for use in Apps that need to accept rich Content and can be installed with:

```bash
$ npm install @servicestack/editor
```

Where it's used like a regular Vue or Vuetify component:

```html
<template>
  <Editor v-model="content" label="Markdown" />
</template>

<script>
import Editor from "@servicestack/editor";

export default {
  components: { Editor },
}
</script>
```

See the Project Page for [documented Example Usage](https://github.com/ServiceStack/servicestack-editor/blob/master/README.md#example-usage) of its features and how to make use of it within an existing component.

## Beautiful, free Hero Backgrounds

[@servicestack/images](https://github.com/ServiceStack/images) is a growing hand-picked curated collection of beautiful free images from [unsplash.com](https://unsplash.com) that's an easy drop-in to any Website, with backgrounds being served from GitHub's CDN.

[heroes.js](https://github.com/ServiceStack/img/pages/blob/master/heroes.js) is a dependency-free script that returns different URLs to **2560x1000** [/hero](https://github.com/ServiceStack/img/pages/tree/master/hero) images ideal for usage in hero backgrounds.

It includes a number of different API's to control which hero to get and for how long to return the same hero for:

```
heroes.random()          // a random hero each time
heroes.daily()           // the same hero for the day
heroes.hourly()          // the same hero for the hour
heroes.static('foo')     // the same hero for this string constant
heroes.static('foo',10)  // the same hero + 10 for this string constant
heroes.get(1)            // the first hero
heroes.get(1000000)      // the hero at mod length 1000000

heroes.images            // the array of hero image names
heroes.baseUrl           //= https://servicestack.github.io/img/pages/ 
```

Live Example: [/heroes](https://servicestack.github.io/img/pages/heroes)

It's used in all TechStacks pages containing background hero images where it's embedded inside a [Vuetify Parallax Component](https://vuetifyjs.com/en/components/parallax) where it provides a subtle parallax effect. This example shows the same hero image for each Technology based on its `slug`:

```html
<template>
  <v-parallax :src="heroUrl">
</template>

<script>
  import { heroes } from "@servicestack/images";
  export default {
    heroUrl() { 
      return heroes.static(this.slug); 
    },
  }
</script>
```

The [Usage](https://github.com/ServiceStack/img/pages/blob/master/README.md#usage) section on the project page contains additional examples showing how to use it within a static web page, a npm-based Web App using ES6/TypeScript as well as inside a React or Vue Component.

### Image Upload Vue Component

The [FileInput.vue](https://github.com/NetCoreApps/TechStacks/blob/master/src/TechStacks/src/components/FileInput.vue) is a simple single File Upload Component with an image preview. 

The basic usage example below shows an example of using it to upload files with the `JsonServiceClient` where instead of sending a Request DTO, use `toFormData` to create a "multipart/form-data" `FormData` request that can be sent using the `postBody` API, e.g:

```html
<template>
  <file-input :value="logoUrl" accept="image/*" @input="onFileChange" selectLabel="Add Logo"></file-input>
</template>

<script>

import { JsonServiceClient, toFormData } from "@servicestack/client";

export default {
  components: { FileInput },

  onFileChange(imgFile) {
    const fields = { id: 1, name: 'foo' };
    const body = toFormData({...fields, imgFile });
    await client.postBody(new CreateTechnology(), body);
  }
}
</script>
```

Inside your ServiceStack Service the uploaded file will be accessible from `IRequest.Files` collection with any additional arguments used to populate the Request DTO. 

You could use `VirtualFiles.WriteFile(path, Request.Files[0].InputStream)` to write the file to the configured [Virtual File System provider](/virtual-file-system), but as we want to keep the App Server stateless we're instead uploading it to Imgur and just saving the URL on Imgur:

```csharp
public object Post(CreateTechnology request)
{
    //...
    if (Request.Files.Length > 0)
    {
        tech.LogoUrl = Request.Files[0].UploadToImgur(AppSettings.GetString("oauth.imgur.ClientId"),
            nameof(tech.LogoUrl), minWidth:100, minHeight:50, maxWidth:2000, maxHeight:1000);
    }
}
```

If you'd also like to upload to Imgur you can copy the `UploadToImgur` extension in [ImgurExtensions.cs](https://github.com/NetCoreApps/TechStacks/blob/master/src/TechStacks.ServiceInterface/ImgurExtensions.cs) into your project which includes image size validation as well as extracting any Imgur error responses into a readable C# Exception so it displays the cause of any downstream Imgur Upload Error in your UI.
