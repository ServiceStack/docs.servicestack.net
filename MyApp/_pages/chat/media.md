---
title: Voice & Media
---

Text is only one AI modality. AI Chat supports voice-to-text input, image generation, audio generation and speech synthesis through configured providers, with everything generated recorded in the App's own media catalog.

<screenshot src="/img/pages/chat/voice-and-media.webp" title="AI Chat voice and media controls"></screenshot>

## Voice input

The `voice` extension adds speech-to-text at `POST /chat/transcribe`, accepting multipart audio.

It picks the first available option from the `LLMS_VOICE` environment variable, which defaults to:

<text-block text="voxtype,transcribe,voxtral-mini-latest"></text-block>

| Option | Requires |
| --- | --- |
| `voxtype` | The `voxtype` CLI on `PATH`, plus `ffmpeg` |
| `transcribe` | The `transcribe` CLI on `PATH`, plus `ffmpeg` |
| `voxtral-*` | The `mistral` provider enabled with `MISTRAL_API_KEY` |

```bash
# prefer Mistral's hosted transcription over local CLIs
export LLMS_VOICE=voxtral-mini-latest
```

When none are available the extension **disables itself** — no route, no microphone button. To turn it off explicitly:

```csharp
services.AddPlugin(new ChatFeature {
    DisableExtensions = ["voice"],
});
```

## Generation modalities

Image, audio and speech generation are configured as **modality sub-providers** on a provider definition in `llms.json`:

```json
{
  "providers": {
    "openai": {
      "enabled": true,
      "modalities": {
        "image": { "npm": "openai/image" }
      }
    }
  }
}
```

Built-in modality sdk ids:

| Sdk id | Modality |
| --- | --- |
| `openai/image` | Image generation |
| `openrouter/image` | Image generation |
| `fireworks/image` | Image generation |
| `zai/image` | Image generation |
| `chutes/image` | Image generation |
| `nvidia/image` | Image generation |
| `openrouter/audio` | Audio generation |
| `openrouter/text-to-speech` | Speech synthesis |
| `mistral/transcriptions` | Transcription |

An unsupported modality sdk drops just that modality rather than disabling the whole provider, so a provider whose text models you want stays usable even if its image sdk isn't available.

See [Providers & Models](/chat/providers).

## Aspect ratios

Image generation uses a fixed set of aspect ratios, resolved to pixel dimensions:

| Ratio | Dimensions | | Ratio | Dimensions |
| --- | --- | --- | --- | --- |
| `1:1` | 1024×1024 | | `4:5` | 896×1152 |
| `2:3` | 832×1248 | | `5:4` | 1152×896 |
| `3:2` | 1248×832 | | `9:16` | 768×1344 |
| `3:4` | 864×1184 | | `16:9` | 1344×768 |
| `4:3` | 1184×864 | | `21:9` | 1536×672 |

`ChatFeature.AspectRatios` and `AspectRatiosReverse` expose the mapping.

## The media gallery

Every file written to AI Chat's content-addressed cache is recorded as a `ChatMedia` row by the `gallery` extension, making it queryable and browsable rather than lost inside a transient provider response.

Recorded per item: name, type (`image` / `audio` / `video`), the prompt that produced it, model, cost, seed, dimensions, size, duration, aspect ratio, content hash, reactions, caption, tags, rating and any publish state.

<text-block :rows="[
  ['GET    /chat/ext/gallery/media','Query the media catalog'],
  ['GET    /chat/ext/gallery/media/totals','Counts and totals for the gallery filters'],
  ['DELETE /chat/ext/gallery/media/{hash}','Delete a media item']]"></text-block>

Media is scoped to the user who generated it. To disable the gallery:

```csharp
services.AddPlugin(new ChatFeature {
    DisableExtensions = ["gallery"],
});
```

## Attachments and uploads

`POST /chat/upload` accepts image and document attachments, storing them in the content-addressed cache and returning a URL under `/chat/~cache/`.

Supply an `ImageTransformer` to downscale uploads and serve `?variant=` thumbnails; without one, originals are served as-is:

```csharp
services.AddPlugin(new ChatFeature {
    ImageTransformer = (bytes, width, height) => MyImageLib.ToWebp(bytes, width, height),
});
```

Set `ValidateDownloadUrl` to vet any URL referenced in a chat message before AI Chat fetches it:

```csharp
services.AddPlugin(new ChatFeature {
    ValidateDownloadUrl = url => {
        if (!url.StartsWith("https://", StringComparison.OrdinalIgnoreCase))
            throw new ArgumentException("Only https URLs are allowed");
    },
});
```

## Rendering

The conversation view supports rich Markdown, syntax highlighting and — via the `katex` extension — LaTeX mathematical typesetting. Tool calls render as compact expandable blocks so machine output doesn't overwhelm the thread.

```csharp
services.AddPlugin(new ChatFeature {
    DisableExtensions = ["katex"],   // drop the KaTeX importmap + stylesheet
});
```

The look of all of this is controlled by the active theme — see [Themes](/chat/themes).

## Controlling what's available

The same modular provider system lets an organization enable only approved vendors and models. A creative team can expose image and speech models, whilst a regulated workflow restricts users to text models hosted inside its approved boundary:

```csharp
services.AddPlugin(new ChatFeature {
    EnableProviders = ["ollama"],              // nothing leaves the network
    DisableExtensions = ["voice", "gallery"],  // no transcription, no media catalog
});
```
