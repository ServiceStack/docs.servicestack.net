---
title: Text to Speech
---

## Text to Speech UI

AI Server's Text to Speech UI lets you create audio files from its active Comfy UI Agents or Open AI Text to Speech models:

<div class="not-prose">
    <h3 class="text-4xl text-center text-indigo-800 pb-3">
        <span class="text-gray-300">https://localhost:5006</span>/TextToSpeech
    </h3>
</div>

![](/img/pages/ai-server/uis/TextToSpeech.webp)

## Using Text to Speech Endpoints

::include ai-server/endpoint-usage.md::

## Text to Speech {#text-to-speech}

The Text to Speech endpoint converts text input into audio output.

::include ai-server/cs/text-to-speech-1.cs.md::

## Queue Text to Speech {#queue-text-to-speech}

For generating longer audio files or when you want to process the request asynchronously, you can use the Queue Text to Speech endpoint.

::include ai-server/cs/queue-text-to-speech-1.cs.md::

## Comfy UI

The ComfyUI Agent uses PiperTTS to generate the audio files. You can configure download the necessary models by setting the `DEFAULT_MODELS` in the `.env` file to include **text-to-speech** for your ComfyUI Agent where
PiperTTS via ComfyUI Agent uses the preconfigured `lessac` model.

Available Comfy UI Models:
 
 - `text-to-speech` - Default (Lessic)
 - `lessac` - [Piper](https://github.com/rhasspy/piper) TTS using the US English **Lessac** "high" voice model 

## Open AI

If you have included an `OPENAI_API_KEY` in your `.env` file, you can also use the OpenAI API to generate audio files from text which by default uses their `alloy` voice model.

Available Open AI Model [Voice Options](https://platform.openai.com/docs/guides/text-to-speech/voice-options):
 
 - `text-to-speech` - Default (Alloy)
 - `tts-alloy` - Alloy
 - `tts-echo` - Echo
 - `tts-fable` - Fable
 - `tts-onyx` - Onyx
 - `tts-nova` - Nova
 - `tts-shimmer` - Shimmer
