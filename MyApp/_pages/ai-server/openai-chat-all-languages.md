---
title: Typed Open AI Chat & Ollama APIs in 11 Languages
---

A nice consequence of AI Server's [OpenAiChatCompletion](https://openai.servicestack.net/ui/OpenAiChatCompletion?tab=details) API 
being an **Open AI Chat compatible API** is that it can also be used to access other LLM API Gateways, like Open AI's Chat GPT, Open Router,  Mistral AI, GroqCloud as well as self-hosted Ollama instances directly in 11 of ServiceStack's supported typed languages.

## Great use-case for Add ServiceStack Reference

It serves as a great opportunity to showcase the simplicity and flexibility of the [Add ServiceStack Reference](/add-servicestack-reference) feature where invoking APIs are all done the same way in all languages where the same generic Service Client can be used to call any ServiceStack API by downloading their typed API DTOs and sending its populated Request DTO.

Typically your `baseUrl` would be the URL of the remote ServiceStack API, but in this case we're using the
generic JSON Service Client and Typed DTOs to call an external Open AI Chat API directly, e.g. to call your 
local self-hosted [Ollama Server](https://ollama.com) you'd use:

```csharp
var baseUrl = "http://localhost:11434";
```

We'll use this to show how to call Open AI Chat APIs in 11 different languages:

### C#

Install the `ServiceStack.Client` NuGet package:

:::copy
`<PackageReference Include="ServiceStack.Client" Version="8.*" />`
:::

Download AI Server's C# DTOs with [x dotnet tool](/dotnet-tool):

:::copy
`x csharp https://openai.servicestack.net`
:::

Call API by sending `OpenAiChatCompletion` Request DTO with `JsonApiClient`:

```csharp
using ServiceStack;

var client = new JsonApiClient(baseUrl);

var result = await client.PostAsync<OpenAiChatResponse>("/v1/chat/completions",
    new OpenAiChatCompletion {
        Model = "mixtral:8x22b",
        Messages = [
            new () { Role = "user", Content = "What's the capital of France?" }
        ],
        MaxTokens = 50
    });
```

### TypeScript

Install the `@servicestack/client` npm package:

:::copy
npm install @servicestack/client
:::

Download AI Server's TypeScript DTOs:

:::copy
`npx get-dtos typescript https://openai.servicestack.net`
:::

Call API by sending `OpenAiChatCompletion` Request DTO with JsonServiceClient: 

```ts
import { JsonServiceClient } from "@servicestack/client"
import { OpenAiChatCompletion } from "./dtos"

const client = new JsonServiceClient(baseUrl)

const result = await client.postToUrl("/v1/chat/completions",
    new OpenAiChatCompletion({
        model: "mixtral:8x22b",
        messages: [
            { role: "user", content: "What's the capital of France?" }
        ],
        max_tokens: 50
    })
)
```

### JavaScript

Save [servicestack-client.mjs](https://unpkg.com/@servicestack/client@2/dist/servicestack-client.mjs) to your project

Define an Import Map referencing its saved location

```html
<script type="importmap">
    {
        "imports": {
            "@servicestack/client": "/js/servicestack-client.mjs"
        }
    }
</script>
```

Download AI Server's ESM JavaScript DTOs:

:::copy
`npx get-dtos mjs https://openai.servicestack.net`
:::

Call API by sending `OpenAiChatCompletion` Request DTO with JsonServiceClient:

```js
import { JsonServiceClient } from "@servicestack/client"
import { OpenAiChatCompletion } from "./dtos.mjs"

const client = new JsonServiceClient(baseUrl)

const result = await client.postToUrl("/v1/chat/completions",
    new OpenAiChatCompletion({
        model: "mixtral:8x22b",
        messages: [
            { role: "user", content: "What's the capital of France?" }
        ],
        max_tokens: 50
    })
)
```

### Python

Install the `servicestack` PyPI package:

:::copy
pip install servicestack
:::

Download AI Server's Python DTOs:

:::copy
`npx get-dtos python https://openai.servicestack.net`
:::

Call API by sending `OpenAiChatCompletion` Request DTO with JsonServiceClient:

```py
from servicestack import JsonServiceClient
from my_app.dtos import *

client = JsonServiceClient(baseUrl)

result = client.post_url("/v1/chat/completions",OpenAiChatCompletion(
    model="mixtral:8x22b",
    messages=[
        OpenAiMessage(role="user",content="What's the capital of France?")
    ],
    max_tokens=50
))
```

### Dart

Include `servicestack` package in your projects `pubspec.yaml`:

:::copy
servicestack: ^3.0.1
:::

Download AI Server's Dart DTOs:

:::copy
`npx get-dtos dart https://openai.servicestack.net`
:::

Call API by sending `OpenAiChatCompletion` Request DTO with JsonServiceClient:

```dart
import 'dart:io';
import 'dart:typed_data';
import 'package:servicestack/client.dart';

var client = JsonServiceClient(baseUrl);

var result = await client.postToUrl('/v1/chat/completions', 
    OpenAiChatCompletion()
      ..model = 'mixtral:8x22b'
      ..max_tokens = 50
      ..messages = [
        OpenAiMessage()
          ..role = 'user'
          ..content = "What's the capital of France?"
      ]);
```

### PHP

Include `servicestack/client` package in your projects `composer.json`:

:::copy
"servicestack/client": "^1.0"
:::

Download AI Server's PHP DTOs:

:::copy
`npx get-dtos php https://openai.servicestack.net`
:::

Call API by sending `OpenAiChatCompletion` Request DTO with JsonServiceClient:

```php
use ServiceStack\JsonServiceClient;
use dtos\OpenAiChatCompletion;
use dtos\OpenAiMessage;

$client = new JsonServiceClient(baseUrl);
$client->bearerToken = apiKey;

/** @var {OpenAiChatCompletionResponse} $result */
$result = $client->postUrl('/v1/chat/completions', 
    body: new OpenAiChatCompletion(
        model: "mixtral:8x22b",
        messages: [
            new OpenAiMessage(
                role: "user",
                content: "What's the capital of France?"
            )
        ],
        max_tokens: 50
    ));
```

### Java

Include `net.servicestack:client` package in your projects `build.gradle`:

:::copy
implementation 'net.servicestack:client:1.1.3'
:::

Download AI Server's Java DTOs:

:::copy
`npx get-dtos java https://openai.servicestack.net`
:::

Call API by sending `OpenAiChatCompletion` Request DTO with JsonServiceClient:

```java
import net.servicestack.client.*;
import java.util.Collections;

var client = new JsonServiceClient(baseUrl);

OpenAiChatResponse result = client.post("/v1/chat/completions", 
    new OpenAiChatCompletion()
        .setModel("mixtral:8x22b")
        .setMaxTokens(50)
        .setMessages(Utils.createList(new OpenAiMessage()
                .setRole("user")
                .setContent("What's the capital of France?")
        )),
    OpenAiChatResponse.class);
```

### Kotlin

Include `net.servicestack:client` package in your projects `build.gradle`:

:::copy
implementation 'net.servicestack:client:1.1.3'
:::

Download AI Server's Kotlin DTOs:

:::copy
`npx get-dtos kotlin https://openai.servicestack.net`
:::

Call API by sending `OpenAiChatCompletion` Request DTO with JsonServiceClient:

```kotlin
package myapp
import net.servicestack.client.*

val client = JsonServiceClient(baseUrl)

val result: OpenAiChatResponse = client.post("/v1/chat/completions", 
    OpenAiChatCompletion().apply {
        model = "mixtral:8x22b"
        messages = arrayListOf(OpenAiMessage().apply {
            role = "user"
            content = "What's the capital of France?"
        })
        maxTokens = 50
    }, 
    OpenAiChatResponse::class.java)
```

### Swift

Include `ServiceStack` package in your projects `Package.swift`

```swift
dependencies: [
    .package(url: "https://github.com/ServiceStack/ServiceStack.Swift.git",
        Version(6,0,0)..<Version(7,0,0)),
],
```

Download AI Server's Swift DTOs:

:::copy
`npx get-dtos swift https://openai.servicestack.net`
:::

Call API by sending `OpenAiChatCompletion` Request DTO with JsonServiceClient:

```swift
import Foundation
import ServiceStack

let client = JsonServiceClient(baseUrl:baseUrl)

let request = OpenAiChatCompletion()
request.model = "mixtral:8x22b"
let msg =  OpenAiMessage()
msg.role = "user"
msg.content = "What's the capital of France?"
request.messages = [msg]
request.max_tokens = 50

let result:OpenAiChatResponse = try await client.postAsync(
    "/v1/chat/completions", request:request)
```

### F#

Install the `ServiceStack.Client` NuGet package:

:::copy
`<PackageReference Include="ServiceStack.Client" Version="8.*" />`
:::

Download AI Server's F# DTOs with [x dotnet tool](/dotnet-tool):

:::copy
`x fsharp https://openai.servicestack.net`
:::

Call API by sending `OpenAiChatCompletion` Request DTO with `JsonApiClient`:

```fsharp
open ServiceStack
open ServiceStack.Text

let client = new JsonApiClient(baseUrl)

let result = client.Post<OpenAiChatCompletionResponse>("/v1/chat/completions", 
     OpenAiChatCompletion(
        Model = "mixtral:8x22b",
        Messages = ResizeArray [
            OpenAiMessage(
                Role = "user",
                Content = "What's the capital of France?"
            )
        ],
        MaxTokens = 50))
```

### VB.NET

Install the `ServiceStack.Client` NuGet package:

:::copy
`<PackageReference Include="ServiceStack.Client" Version="8.*" />`
:::

Download AI Server's VB.NET DTOs with [x dotnet tool](/dotnet-tool):

:::copy
`x vbnet https://openai.servicestack.net`
:::

Call API by sending `OpenAiChatCompletion` Request DTO with `JsonApiClient`:

```vb
Imports ServiceStack
Imports ServiceStack.Text

Dim client = New JsonApiClient(baseUrl)

Dim result = Await client.PostAsync(Of OpenAiChatResponse)(
    "/v1/chat/completions",
    New OpenAiChatCompletion() With {
        .Model = "mixtral:8x22b",
        .Messages = New List(Of OpenAiMessage) From {
            New OpenAiMessage With {
                .Role = "user",
                .Content = "What's the capital of France?"
            }
        },
        .MaxTokens = 50
    })
```