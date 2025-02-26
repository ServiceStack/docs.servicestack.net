---
title: Free LLM Chat Prompts
---

## okai chat

As part of the development of [okai](/autoquery/okai-models) for generating [Blazor CRUD Apps from a text prompt](/autoquery/text-to-blazor) using your preferred AI Models, we've also made available a generic **chat** prompt that can be used as a convenient way to conduct personal research against many of the worlds most popular Large Language Models - for Free!

:::{.px-8}
![](/img/pages/okai/okai-chat.webp)
:::

You can just start immediately using the `npx okai chat` script to ask LLMs for assistance:

:::sh
npx okai chat "command to copy a folder with rsync?"
:::

This will use the default model (currently codestral:22b) to answer your question.

### Select Preferred Model

You can also use your preferred model with the `-m <model>` flag with either the model **name** or its **alias**, e.g you can use 
[Microsoft's PHI-4 14B](https://techcommunity.microsoft.com/blog/aiplatformblog/introducing-phi-4-microsoft%E2%80%99s-newest-small-language-model-specializing-in-comple/4357090) 
model with:

:::sh
npx okai -m phi chat "command to copy folder with rsync?"
:::

### List Available Models

We're actively adding more great performing and leading experimental models as they're released. 
You can view the list of available models with `ls models`:

:::sh
npx okai ls models
:::

Which at this time will return the following list of available models along with instructions for how to use them:

```txt
USAGE (5 models max):
a) OKAI_MODELS=codestral,llama3.3,flash
b) okai -models codestral,llama3.3,flash <prompt>
c) okai -m flash chat <prompt>

FREE MODELS:
claude-3-haiku            (alias haiku)
codestral:22b             (alias codestral)
deepseek-r1:32b
deepseek-r1:70b
deepseek-r2:32b
deepseek-v3:671b          (alias deepseek)
gemini-flash-1.5
gemini-flash-1.5-8b       (alias flash-8b)
gemini-flash-2.0          (alias flash)
gemini-flash-lite-2.0     (alias flash-lite)
gemini-flash-thinking-2.0 (alias flash-thinking)
gemini-pro-2.0            (alias gemini-pro)
gemma2:9b                 (alias gemma)
gpt-3.5-turbo             (alias gpt-3.5)
gpt-4o-mini
llama3.1:70b              (alias llama3.1)
llama3.3:70b              (alias llama3.3)
llama3:8b                 (alias llama3)
mistral-nemo:12b          (alias mistral-nemo)
mistral-small:24b         (alias mistral-small)
mistral:7b                (alias mistral)
mixtral:8x22b
mixtral:8x7b              (alias mixtral)
nova-lite
nova-micro
phi-4:14b                 (alias phi,phi-4)
qwen-plus
qwen-turbo
qwen2.5-coder:32b         (alias qwen2.5-coder)
qwen2.5:32b
qwen2.5:72b               (alias qwen2.5)
qwq:32b                   (alias qwq)
qwq:72b

PREMIUM MODELS: *
claude-3-5-haiku
claude-3-5-sonnet
claude-3-7-sonnet         (alias sonnet)
claude-3-sonnet
deepseek-r1:671b          (alias deepseek-r1)
gemini-pro-1.5
gpt-4
gpt-4-turbo
gpt-4o
mistral-large:123b
nova-pro
o1-mini
o1-preview
o3-mini
qwen-max

 * requires valid license:
a) SERVICESTACK_LICENSE=<key>
b) SERVICESTACK_CERTIFICATE=<LC-XXX>
c) okai -models <premium,models> -license <license> <prompt>
```

Where you'll be able to use any of the great performing inexpensive models listed under `FREE MODELS` for Free.
Whilst ServiceStack customers with an active commercial license can also use any of the  more expensive
and better performing models listed under `PREMIUM MODELS` by either:

 a) Setting the `SERVICESTACK_LICENSE` Environment Variable with your **License Key**
 b) Setting the `SERVICESTACK_CERTIFICATE` Variable with your **License Certificate**
 c) Inline using the `-license` flag with either the **License Key** or **Certificate**

### FREE for Personal Usage

To be able to maintain this as a free service we're limiting usage as a tool that developers can use for personal
assistance and research by limiting usage to **60 requests /hour** which should be more than enough for most 
personal usage and research whilst deterring usage in automated tools.

:::tip info
Rate limiting is implemented with a sliding [Token Bucket algorithm](https://en.wikipedia.org/wiki/Token_bucket) that replenishes 1 additional request every 60s
:::