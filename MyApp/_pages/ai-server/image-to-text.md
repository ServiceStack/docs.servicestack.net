---
title: Image to Text
---

## Image to Text UI

AI Server's Image to Text UI lets you request image classifications from its active Comfy UI Agents:

<div class="not-prose">
    <h3 class="text-4xl text-center text-indigo-800 pb-3">
        <span class="text-gray-300">https://localhost:5006</span>/ImageToText
    </h3>
</div>

![](/img/pages/ai-server/uis/ImageToText.webp)

## Using Image to Text Endpoints

::include ai-server/endpoint-usage.md::

### Ollama Vision Models

If AI Server has access to any Ollama Vision Models (e.g. **gemma3:27b** or **mistral-small**), it can be used
instead to get information about the uploaded image:

 - `Model` - the ollama vision model to use
 - `Prompt` - vision model prompt

### Image to Text {#image-to-text}

::include ai-server/cs/image-to-text-1.cs.md::

### Queue Image to Text {#queue-image-to-text}

::include ai-server/cs/queue-image-to-text-1.cs.md::

:::info
Ensure that the ComfyUI Agent has the Florence 2 model downloaded and installed for the Image-To-Text functionality to work.
This can be done by setting the `DEFAULT_MODELS` environment variable in the `.env` file to include `image-to-text`
:::

## Support for Ollama Vision Models

By default [ImageToText](/ai-server/image-to-text) uses a purpose-specific **Florence 2 Vision model** with ComfyUI for its functionality which is capable of generating a very short description about an image, e.g:

> A woman sitting on the edge of a lake with a wolf

But with LLMs gaining multi modal capabilities and Ollama's recent support of Vision Models we can instead use popular
Open Source models like Google's **gemma3:27b** or Mistral's **mistral-small:24b** to extract information from images.

Both models are very capable vision models that's can provide rich detail about an image:

### Describe Image

<div class="not-prose mt-8 grid grid-cols-2 gap-4">
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700 flex flex-col justify-between" href="/img/pages/ai-server/image-to-text/gemma3-describe.png">
        <img class="p-2" src="/img/pages/ai-server/image-to-text/gemma3-describe.png" />
    </a>
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700 flex flex-col justify-between" href="/img/pages/ai-server/image-to-text/mistral-small-describe.png">
        <img class="p-2" src="/img/pages/ai-server/image-to-text/mistral-small-describe.png" />
    </a>
</div>

### Caption Image

Although our initial testing sees gemma being better at responding to a wide variety of different prompts, e.g:

<div class="not-prose mt-8 grid grid-cols-2 gap-4">
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700 flex flex-col justify-between" href="/img/pages/ai-server/image-to-text/gemma3-caption.png">
        <img class="p-2" src="/img/pages/ai-server/image-to-text/gemma3-caption.png" />
    </a>
    <a class="block group border dark:border-gray-800 hover:border-indigo-700 dark:hover:border-indigo-700 flex flex-col justify-between" href="/img/pages/ai-server/image-to-text/mistral-small-caption.png">
        <img class="p-2" src="/img/pages/ai-server/image-to-text/mistral-small-caption.png" />
    </a>
</div>

## Support OllamaGenerate Endpoint

To support Ollama's vision models AI Server added a new feature pipeline around
[Ollama's generate completion API](https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-completion):


- `ImageToText`
  - **Model** - Whether to use a Vision Model for the request
  - **Prompt** - Prompt for the vision model
- `OllamaGeneration`: Synchronous invocation of Ollama's Generate API
- `QueueOllamaGeneration`: Asynchronous or Web Callback invocation of Ollama's Generate API
- `GetOllamaGenerationStatus`: Get the generation status of an Ollama Generate API
