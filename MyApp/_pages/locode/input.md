---
title: Input controls
---

The `PhotoPath` and `Notes` properties on the `Epmployee` table also have custom `InputAttribute` applied to change the Locode app HTML input type.
Since the `PhotoPath` is related to a file upload and use of `UploadTo`, we want to have a way for the Locode client to upload files.
`[Input(Type=Input.Types.File)]` adds metadata so the Locode app knows to use a file upload control for this field. The `Notes` property
contains more long form text, so instead of the standard one line `text` input, an `Input.Types.Textarea` can be used.

<ul role="list" class="m-4 grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-8 xl:gap-x-8">
  <li class="relative">
    <div class="group block w-full aspect-w-13 aspect-h-6 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
      <img src="/img/pages/locode/database-first-northwind-input-1.png" alt="" class="object-cover pointer-events-none group-hover:opacity-75">
    </div>
    <p class="block text-sm font-medium text-gray-500 pointer-events-none">Without `Input`</p>
  </li>
  <li class="relative">
    <div class="group block w-full aspect-w-13 aspect-h-6  rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
      <img src="/img/pages/locode/database-first-northwind-input-2.png" alt="" class="object-cover pointer-events-none group-hover:opacity-75">
    </div>
    <p class="block text-sm font-medium text-gray-500 pointer-events-none">Custom `Input`</p>
  </li>
</ul>

