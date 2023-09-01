---
title: Markdown Input Component
group: Component Gallery
---

## Markdown Editor Input

The `<MarkdownInput>` component is a developer-friendly Markdown Editor that provides a rich Markdown Textarea Input to capture 
rich formatted text in Markdown with icons for markdown's popular formatting options and convenience keyboard bindings for a pleasant 
intuitive authoring experience. 

It's optimized [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/) where it supports popular short-cuts for 
editing and documenting code like tab block un/indenting, single-line and code and comments blocks.

It behaves like all other Input components which you can embed in custom UIs as a standard Vue Component:

```ts
<MarkdownInput id="body" v-model="request.body" />
```

#### MarkdownInput Properties

It offers a number of properties to customize its appearance and behavior:

```ts
defineProps<{
    status?: ResponseStatus|null
    id: string
    inputClass?: string
    label?: string
    labelClass?: string
    help?: string
    placeholder?: string
    modelValue?: string

    counter?: boolean
    rows?: number
    errorMessages?: string[]
    lang?: string
    autoFocus?: boolean
    disabled?: boolean
    helpUrl?: string
    hide?: string|MarkdownInputOptions|MarkdownInputOptions[]
}>()

type MarkdownInputOptions = "bold" | "italics" | "link" | "image" | "blockquote" | "code" 
  | "heading" | "orderedList" | "unorderedList" | "strikethrough" | "undo" | "redo" | "help"
```

Just like other Input components it can be annotated on Request DTO string properties to change which Input component it should use in 
[AutoForm components](/vue/autoform), where it can be further customized with tailwind classes on its
containing Field and Textarea Input elements, e.g:

```csharp
public class MarkdownEmail
{
    [Input(Type="MarkdownInput", Label=""), FieldCss(Field="col-span-12", Input="h-56")]
    public string? Body { get; set; }
}
```

Where it's used to generate all of [CreatorKit's Markdown Email Forms](https://servicestack.net/creatorkit/portal-messages), e.g:

<figure class="mt-4">
    <a class="my-8 max-w-4xl mx-auto block" href="https://servicestack.net/creatorkit/portal-messages#sending-html-markdown-emails">
        <img class="rounded shadow hover:shadow-lg" src="/img/pages/vue/markdown-email-form.png" alt=""></a>
</figure>

## Keyboard Shortcuts

For added productivity the Editor supports many of the popular Keyboard shortcuts in found in common IDEs:

![](/img/pages/vue/markdown-shortcuts.png)

