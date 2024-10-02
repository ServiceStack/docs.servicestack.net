---
title: "Transcribing Audio"
---

# Transcribing Audio

AI Server can transcribe audio files to text using the Speech-to-Text provider. This is powered by the Whisper model and is hosted on your own ComfyUI Agent.

## Using Speech-to-Text

To transcribe an audio file to text, you can use the `SpeechToText` request:

```csharp
var request = new SpeechToText{};

var response = await client.PostFilesWithRequest<GenerationResponse>(
    request,
    [new UploadFile("audio", File.OpenRead("audio.wav"), "audio.wav")]
);

// Two texts are returned
// The first is the timestamped text json with `start` and `end` timestamps
var textWithTimestamps = response.TextOutputs[0].Text;
// The second is the plain text
var textOnly = response.TextOutputs[1].Text;
```

## Text To Speech

AI Server also has a Text-to-Speech endpoint that works with the ComfyUI Agent. This can be used to generate audio files from text.

```csharp
var request = new TextToSpeech
{
    Text = "Hello, how are you?",
    Sync = true
};

var response = await client.PostAsync(request);
response.Outputs[0].Url.DownloadFileTo("hello.mp3");
```

The ComfyUI Agent uses PiperTTS to generate the audio files. You can configure download the necessary models by setting the `DEFAULT_MODELS` in the `.env` file to include `text-to-speech` for your ComfyUI Agent.
If you have included an `OPENAI_API_KEY` in your `.env` file, you can also use the OpenAI API to generate audio files from text. By default, this uses their 'tts-1:alloy' model, while PiperTTS via ComfyUI Agent uses the preconfigured 'high:en_US-lessac' model.

See the [`/lib/data/ai-models.json`](/lib/data/ai-models.json) file for more information on the available models.
