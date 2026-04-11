---
name: gemini-interactions-api
description: Use this skill for building applications with the Gemini Interactions API. This API simplifies complex workflows like multi-turn chat, streaming, function calling, structured output, image generation, and Deep Research agents. Supports @google/genai for JavaScript/TypeScript.
---

# Gemini Interactions API Skill

## Critical Rules (Always Apply)

> [!IMPORTANT]
> This skill assumes you are using the modern `@google/genai` SDK and current models (Gemini 3.1 or 2.5).

### Key Concept: Interactions
Interactions are higher-level abstractions than raw content generation. They handle history, context, and specialized agentic behaviors natively.

---

## Capabilities & Patterns (Node.js/TypeScript)

### 1. Multi-turn Chat
Natively manages the `contents` array for history.

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
const chat = ai.models.startInteraction({
    model: "gemini-3.1-pro-preview",
    systemInstruction: "You are a helpful assistant."
});

const result = await chat.sendMessage("Hello!");
console.log(result.text);
```

### 2. Deep Research Agents
Native support for multi-step reasoning and research tasks.

```typescript
const agent = ai.models.startInteraction({
    model: "gemini-3.1-pro-preview",
    config: {
        agentType: "research"
    }
});
```

### 3. Structured Output (Controlled JSON)
Use `responseMimeType` and `responseSchema` for guaranteed structure.

```typescript
const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Find 3 recipes for pasta",
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    prepTime: { type: "string" }
                }
            }
        }
    }
});
```

---

## Documentation Lookup

**Index URL**: `https://ai.google.dev/gemini-api/docs/interactions/llms.txt`

Key pages:
- [Chat & History](https://ai.google.dev/gemini-api/docs/chat.md.txt)
- [Deep Research](https://ai.google.dev/gemini-api/docs/deep-research.md.txt)
- [Control & Tuning](https://ai.google.dev/gemini-api/docs/control.md.txt)
