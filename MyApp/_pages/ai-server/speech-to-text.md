---
title: Speech to Text
---

AI Server can transcribe audio files to text using the Speech-to-Text provider. This is powered by the Whisper model and is hosted on your own ComfyUI Agent.

## Using Speech to Text Endpoints

::include ai-server/endpoint-usage.md::

### Speech to Text {#speech-to-text}

The Speech to Text endpoint converts audio input into text. It provides two types of output:

1. Text with timestamps: JSON format with `start` and `end` timestamps for each segment.
2. Plain text: The full transcription without timestamps.

These outputs are returned in the `TextOutputs` array, where the JSON will need to be parsed to extract the text and timestamps.

::include ai-server/cs/speech-to-text-1.cs.md::

### Queue Speech to Text {#queue-speech-to-text}

For longer audio files or when you want to process the request asynchronously, you can use the Queue Speech to Text endpoint.

::include ai-server/cs/queue-speech-to-text-1.cs.md::

