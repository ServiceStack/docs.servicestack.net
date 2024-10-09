---
title: Speech Endpoints
description: Processing speech with AI Server
---

AI Server provides endpoints for speech-related tasks, including Speech-to-Text and Text-to-Speech conversions. These endpoints utilize AI models to process audio and text data.

The following tasks are available for speech processing:

- **Speech to Text**: Convert audio input to text output.
- **Text to Speech**: Convert text input to audio output.

## Using Speech Endpoints

These endpoints are used in a similar way to other AI Server endpoints. You can provide a RefId and Tag to help categorize the request, and for Queue requests, you can provide a ReplyTo URL to send a POST request to when the request is complete.

### Speech to Text {#speech-to-text}

The Speech to Text endpoint converts audio input into text. It provides two types of output:

1. Text with timestamps: JSON format with `start` and `end` timestamps for each segment.
2. Plain text: The full transcription without timestamps.

These outputs are returned in the `TextOutputs` array, where the JSON will need to be parsed to extract the text and timestamps.

::include ai-server/cs/speech-to-text-1.cs.md::

### Queue Speech to Text {#queue-speech-to-text}

For longer audio files or when you want to process the request asynchronously, you can use the Queue Speech to Text endpoint.

::include ai-server/cs/queue-speech-to-text-1.cs.md::

### Text to Speech {#text-to-speech}

The Text to Speech endpoint converts text input into audio output.

::include ai-server/cs/text-to-speech-1.cs.md::

### Queue Text to Speech {#queue-text-to-speech}

For generating longer audio files or when you want to process the request asynchronously, you can use the Queue Text to Speech endpoint.

::include ai-server/cs/queue-text-to-speech-1.cs.md::

