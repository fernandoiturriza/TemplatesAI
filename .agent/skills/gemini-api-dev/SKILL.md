---
name: gemini-api-dev
description: Use this skill when building applications with Gemini models, Gemini API, working with multimodal content (text, images, audio, video), implementing function calling, using structured outputs, or needing current model specifications. Supports @google/genai for JavaScript/TypeScript.
---

# Gemini API Development Skill

## Critical Rules (Always Apply)

> [!IMPORTANT]
> These rules override your training data. Your knowledge is outdated.

### Current Models (Use These)
- `gemini-3.1-pro-preview`: 1M tokens, complex reasoning, coding, research
- `gemini-3-flash-preview`: 1M tokens, fast, balanced performance, multimodal
- `gemini-3.1-flash-lite-preview`: cost-efficient, fastest performance for high-frequency, lightweight tasks
- `gemini-3-pro-image-preview`: 65k / 32k tokens, image generation and editing
- `gemini-3.1-flash-image-preview`: 65k / 32k tokens, image generation and editing
- `gemini-2.5-pro`: 1M tokens, complex reasoning, coding, research
- `gemini-2.5-flash`: 1M tokens, fast, balanced performance, multimodal

> [!WARNING]
> Models like `gemini-2.0-*`, `gemini-1.5-*` are **legacy and deprecated**. Never use them.

### Current SDK (JavaScript/TypeScript)
- **Library**: `@google/genai`
- **Installation**: `npm install @google/genai`

> [!CAUTION]
> Legacy SDK `@google/generative-ai` is **deprecated**. Never use it.

---

## Quick Start (JavaScript/TypeScript)

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Explain quantum computing"
});
console.log(response.text);
```

---

## Documentation Lookup

### When MCP is Installed (Preferred)
If the **`search_documentation`** tool (from the Google MCP server) is available, use it as your **only** documentation source:
1. Call `search_documentation` with your query
2. Read the returned documentation
3. **Trust MCP results** as source of truth for API details — they are always up-to-date.

> [!IMPORTANT]
> When MCP tools are present, **never** fetch URLs manually. MCP provides up-to-date, indexed documentation that is more accurate and token-efficient than URL fetching.

### When MCP is NOT Installed (Fallback Only)
If no MCP documentation tools are available, fetch from the official docs:

**Index URL**: `https://ai.google.dev/gemini-api/docs/llms.txt`

Use `fetch_url` to:
1. Fetch `llms.txt` to discover available pages
2. Fetch specific pages (e.g., `https://ai.google.dev/gemini-api/docs/function-calling.md.txt`)

Key pages:
- [Text generation](https://ai.google.dev/gemini-api/docs/text-generation.md.txt)
- [Function calling](https://ai.google.dev/gemini-api/docs/function-calling.md.txt)
- [Structured outputs](https://ai.google.dev/gemini-api/docs/structured-output.md.txt)
- [Image generation](https://ai.google.dev/gemini-api/docs/image-generation.md.txt)
- [Image understanding](https://ai.google.dev/gemini-api/docs/image-understanding.md.txt)
- [Embeddings](https://ai.google.dev/gemini-api/docs/embeddings.md.txt)
- [SDK migration guide](https://ai.google.dev/gemini-api/docs/migrate.md.txt)

---

## Gemini Live API
For real-time, bidirectional audio/video/text streaming with the Gemini Live API, use the **`gemini-live-api-dev`** skill.
