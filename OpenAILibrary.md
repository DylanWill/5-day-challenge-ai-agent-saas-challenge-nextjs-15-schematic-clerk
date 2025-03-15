# OpenAI Library Reference

This document contains important information about the OpenAI SDK and API for future implementation.

## Libraries

Set up your development environment to use the OpenAI API with an SDK in your preferred language. This page covers setting up your local development environment to use the OpenAI API. You can use one of the officially supported SDKs, a community library, or your own preferred HTTP client.

## Create and Export an API Key

Before you begin, create an API key in the [OpenAI dashboard](https://platform.openai.com/api-keys), which you'll use to securely access the API. Store the key in a safe location, like a `.zshrc` file or another text file on your computer. Once you've generated an API key, export it as an environment variable in your terminal.

### macOS / Linux
```bash
export OPENAI_API_KEY="your_api_key_here"
```

### Windows
Export an environment variable in PowerShell:
```powershell
setx OPENAI_API_KEY "your_api_key_here"
```

OpenAI SDKs are configured to automatically read your API key from the system environment.

## Install an Official SDK

### JavaScript
To use the OpenAI API in server-side JavaScript environments like Node.js, Deno, or Bun, you can use the official OpenAI SDK for TypeScript and JavaScript. Get started by installing the SDK using npm or your preferred package manager:

```bash
npm install openai
```

With the OpenAI SDK installed, create a file called `example.mjs` and copy the example code into it:

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        {
            role: "user",
            content: "Write a one-sentence bedtime story about a unicorn.",
        },
    ],
});

console.log(completion.choices[0].message.content);
```

Execute the code with `node example.mjs` (or the equivalent command for Deno or Bun). In a few moments, you should see the output of your API request.

### Other Official SDKs
- **Python**: `pip install openai`
- **.NET**: `dotnet add package OpenAI`
- **Java**: Available via Maven
- **Go**: Available via Go modules

## Learn More on GitHub

Discover more SDK capabilities and options on the [library's GitHub README](https://github.com/openai/openai-node).

## Azure OpenAI Libraries

Microsoft's Azure team maintains libraries that are compatible with both the OpenAI API and Azure OpenAI services:

- [Azure OpenAI client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/main/sdk/openai/Azure.AI.OpenAI)
- [Azure OpenAI client library for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/openai/openai)
- [Azure OpenAI client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/openai/azure-ai-openai)
- [Azure OpenAI client library for Go](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/ai/openai)

## Community Libraries

The libraries below are built and maintained by the broader developer community. OpenAI does not verify the correctness or security of these projects. Use them at your own risk!

### C# / .NET
- [Betalgo.OpenAI](https://github.com/betalgo/openai) by Betalgo
- [OpenAI-API-dotnet](https://github.com/OkGoDoIt/OpenAI-API-dotnet) by OkGoDoIt
- [OpenAI-DotNet](https://github.com/RageAgainstThePixel/OpenAI-DotNet) by RageAgainstThePixel

### C++
- [liboai](https://github.com/D7EAD/liboai) by D7EAD

### Clojure
- [openai-clojure](https://github.com/wkok/openai-clojure) by wkok

### Crystal
- [openai-crystal](https://github.com/sferik/openai-crystal) by sferik

### Dart/Flutter
- [openai](https://github.com/anasfik/openai) by anasfik

### Delphi
- [DelphiOpenAI](https://github.com/HemulGM/DelphiOpenAI) by HemulGM

### Elixir
- [openai.ex](https://github.com/mgallo/openai.ex) by mgallo

### Go
- [go-gpt3](https://github.com/sashabaranov/go-gpt3) by sashabaranov

### Java
- [simple-openai](https://github.com/SashirEsla/simple-openai) by Sashir Estela
- [Spring AI](https://github.com/spring-projects/spring-ai)

### Julia
- [OpenAI.jl](https://github.com/rory-linehan/OpenAI.jl) by rory-linehan

### Kotlin
- [openai-kotlin](https://github.com/Aallam/openai-kotlin) by Mouaad Aallam

### Node.js
- [openai-api](https://github.com/Njerschow/openai-api) by Njerschow
- [openai-api-node](https://github.com/erlapso/openai-api-node) by erlapso
- [gpt-x](https://github.com/ceifa/gpt-x) by ceifa
- [gpt3](https://github.com/poteat/gpt3) by poteat
- [gpts](https://github.com/thencc/gpts) by thencc
- [@dalenguyen/openai](https://github.com/dalenguyen/openai) by dalenguyen
- [tectalic/openai](https://github.com/tectalic/openai) by tectalic

### PHP
- [orhanerday/open-ai](https://github.com/orhanerday/open-ai) by orhanerday
- [tectalic/openai](https://github.com/tectalic/openai) by tectalic
- [openai-php client](https://github.com/openai-php/client) by openai-php

### Python
- [chronology](https://github.com/OthersideAI/chronology) by OthersideAI

### R
- [rgpt3](https://github.com/ben-aaron188/rgpt3) by ben-aaron188

### Ruby
- [openai](https://github.com/nileshtrivedi/openai) by nileshtrivedi
- [ruby-openai](https://github.com/alexrudall/ruby-openai) by alexrudall

### Rust
- [async-openai](https://github.com/64bit/async-openai) by 64bit
- [fieri](https://github.com/lbkolev/fieri) by lbkolev

### Scala
- [openai-scala-client](https://github.com/cequence-io/openai-scala-client) by cequence-io

### Swift
- [AIProxySwift](https://github.com/louzell/AIProxySwift) by Lou Zell
- [OpenAIKit](https://github.com/dylanshine/openai-kit) by dylanshine
- [OpenAI](https://github.com/MacPaw/OpenAI) by MacPaw

### Unity
- [OpenAi-Api-Unity](https://github.com/hexthedev/OpenAi-Api-Unity) by hexthedev
- [com.openai.unity](https://github.com/RageAgainstThePixel/com.openai.unity) by RageAgainstThePixel

### Unreal Engine
- [OpenAI-Api-Unreal](https://github.com/KellanM/OpenAI-Api-Unreal) by KellanM

## Other OpenAI Repositories

- [tiktoken](https://github.com/openai/tiktoken) - counting tokens
- [simple-evals](https://github.com/openai/simple-evals) - simple evaluation library
- [mle-bench](https://github.com/openai/mle-bench) - library to evaluate machine learning engineer agents
- [gym](https://github.com/openai/gym) - reinforcement learning library
- [swarm](https://github.com/openai/swarm) - educational orchestration repository

## GPT-4o Mini Model Information

### Model Details
- **Model ID**: `gpt-4o-mini`
- **Context Window**: 128,000 tokens
- **Max Output Tokens**: 16,000 tokens
- **Pricing**: $0.15 per million input tokens, $0.60 per million output tokens
- **Capabilities**: Text and image understanding, code generation, reasoning

### API Usage Examples

#### Basic Chat Completion
```javascript
async function getChatCompletion() {
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Hello, how are you?" }
    ],
    max_tokens: 500,
    temperature: 0.7,
  });

  return completion.choices[0].message;
}
```

#### Streaming Responses
```javascript
async function streamChatCompletion() {
  const stream = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Write a short story about a robot." }
    ],
    stream: true,
    max_tokens: 1000,
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}
```

#### Image Input
```javascript
async function imageUnderstanding() {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What's in this image?" },
          {
            type: "image_url",
            image_url: {
              url: "https://example.com/image.jpg",
            },
          },
        ],
      },
    ],
  });
  
  return response.choices[0].message.content;
}
```

## Migration from Anthropic to OpenAI

### Key Differences
- Different message format structure
- Different parameter naming
- Different response structure
- Different token counting methods
- Different pricing model

### Anthropic to OpenAI Conversion

| Anthropic | OpenAI |
|-----------|--------|
| `claude-3-sonnet-20240229` | `gpt-4o-mini` |
| `max_tokens` | `max_tokens` |
| `temperature` | `temperature` |
| `system` | `messages: [{ role: "system", content: "..." }]` |
| `messages` | `messages` |
| `anthropic.messages.create()` | `client.chat.completions.create()` |

## Best Practices

1. **Environment Variables**: Store API keys in environment variables
2. **Error Handling**: Implement robust error handling for API calls
3. **Rate Limiting**: Respect rate limits and implement backoff strategies
4. **Token Management**: Monitor token usage to control costs
5. **Prompt Engineering**: Optimize prompts for the GPT-4o Mini model